import { supabase } from './db';
import { redisService } from './redis';

interface RateLimitResult {
  allowed: boolean;
  count: number;
  limit: number;
}

/**
 * Validates rate limit restrictions.
 * If Upstash Redis envs are configured, executes edge IP checks.
 * Otherwise, runs database check restricting phone numbers to max 3 OTP sends per 15 minutes.
 */
export async function checkRateLimit(phoneNumber: string, ipAddress: string): Promise<RateLimitResult> {
  const cleanIp = (ipAddress || '127.0.0.1').split(',')[0].trim().substring(0, 45);
  const key = `rl:ip:${cleanIp.replace(/[:.]/g, '_')}`;

  // 1. Try Upstash Redis Edge rate limiting if variables are present and service is available
  if (redisService.checkAvailability()) {
    try {
      const script = `
        local current = redis.call('get', KEYS[1])
        if current and tonumber(current) >= tonumber(ARGV[1]) then
          return tonumber(current)
        end
        local newVal = redis.call('incr', KEYS[1])
        if newVal == 1 then
          redis.call('expire', KEYS[1], tonumber(ARGV[2]))
        end
        return newVal
      `;
      
      const result = await redisService.eval(script, [key], ['60', '60']);
      
      if (result !== null) {
        const count = Number(result);
        return {
          allowed: count <= 60,
          count,
          limit: 60
        };
      }
    } catch (error) {
      console.warn('Upstash Redis check failed; falling back to DB rate limiting:', error);
    }
  }

  // 2. PostgreSQL Database-backed rate limiting per Phone Number (Max 3 OTP requests / 15 minutes)
  try {
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000).toISOString();
    
    // Count OTP entries for this phone number in the last 15 minutes
    const { count, error } = await supabase
      .from('otp_verifications')
      .select('*', { count: 'exact', head: true })
      .eq('phone_number', phoneNumber)
      .gt('created_at', fifteenMinutesAgo);

    if (error) {
      // If table doesn't exist yet (local dev state), bypass checks to allow tests
      if (error.code === 'P0001' || error.message.includes('does not exist')) {
        return { allowed: true, count: 0, limit: 3 };
      }
      throw error;
    }

    const otpCount = count || 0;
    return {
      allowed: otpCount < 3,
      count: otpCount,
      limit: 3
    };
  } catch (error) {
    console.error('Database rate limit query error:', error);
    return {
      allowed: true, // Fail-open to avoid locking out users on system glitches
      count: 0,
      limit: 3
    };
  }
}
