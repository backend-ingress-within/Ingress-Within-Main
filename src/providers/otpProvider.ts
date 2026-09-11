import { supabase, supabaseAuth } from '../lib/db';
import { sendOtpSms } from '../lib/sms';
import { generateSalt, hashOtp } from '../utils/crypto';
import { checkPhoneLockout, applyPhoneLockout, LOCKOUT_DURATION_MS, MAX_INCORRECT_ATTEMPTS } from '../lib/auth/lockout';

export interface OtpResult {
  success: boolean;
  message: string;
  resendInSeconds?: number;
  code?: string;
}

export interface OtpVerifyResult {
  success: boolean;
  message: string;
  userId?: string; // Returns Supabase GoTrue Auth UID if present
  code?: string;   // Error code if any
  attemptsRemaining?: number;
}

export interface OtpProvider {
  sendOtp(phoneNumber: string, rateLimitCount?: number): Promise<OtpResult>;
  verifyOtp(phoneNumber: string, code: string): Promise<OtpVerifyResult>;
}

// ----------------------------------------------------
// 1. Database-backed Production OTP Provider (Primary)
// ----------------------------------------------------
export class DatabaseOtpProvider implements OtpProvider {
  async sendOtp(phoneNumber: string, rateLimitCount: number = 0): Promise<OtpResult> {
    try {
      // 1. Check Server-Side Lockout
      const lockout = await checkPhoneLockout(phoneNumber);
      if (lockout.isLocked) {
        return {
          success: false,
          code: 'AUTH_LOCKOUT',
          message: 'Too many incorrect attempts. Try again in 10 minutes.'
        };
      }

      const nowStr = new Date().toISOString();

      // 2. Invalidate all previous unverified OTPs for this phone number immediately
      await supabase
        .from('otp_verifications')
        .update({ expires_at: nowStr })
        .eq('phone_number', phoneNumber)
        .is('verified_at', null)
        .gt('expires_at', nowStr);

      // 3. Generate 6-digit numeric OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

      // 4. Hash OTP with cryptographic salt & set 5-minute strict server expiry
      const salt = generateSalt();
      const hashedCode = hashOtp(otpCode, salt);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // 5 minutes

      const { error: dbError } = await supabase
        .from('otp_verifications')
        .insert({
          phone_number: phoneNumber,
          otp_hash: hashedCode,
          salt,
          attempts_count: 0,
          resend_count: rateLimitCount,
          expires_at: expiresAt
        });

      if (dbError) {
        console.error('[OtpProvider] DB insertion failed:', dbError);
        return {
          success: false,
          code: 'DATABASE_ERROR',
          message: "We couldn't send the code. Check your connection and try again."
        };
      }

      // 5. Dispatch SMS via configured SMS gateway (e.g. Fast2SMS/MSG91)
      const smsResult = await sendOtpSms(phoneNumber, otpCode);

      if (!smsResult.success) {
        console.error('[OtpProvider] SMS dispatch failed:', smsResult.message);
        // Clean up pending challenge on delivery failure so user can retry cleanly
        await supabase
          .from('otp_verifications')
          .delete()
          .eq('phone_number', phoneNumber)
          .eq('otp_hash', hashedCode);

        return {
          success: false,
          code: 'SMS_GATEWAY_ERROR',
          message: "We couldn't send the code. Check your connection and try again."
        };
      }

      return {
        success: true,
        message: 'Code sent successfully.',
        resendInSeconds: 30
      };
    } catch (err: any) {
      console.error('[OtpProvider] sendOtp fatal error:', err);
      return {
        success: false,
        code: 'NETWORK_ISSUE',
        message: "We couldn't send the code. Check your connection and try again."
      };
    }
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<OtpVerifyResult> {
    try {
      // 1. Check Server-Side Lockout
      const lockout = await checkPhoneLockout(phoneNumber);
      if (lockout.isLocked) {
        return {
          success: false,
          code: 'AUTH_LOCKOUT',
          message: 'Too many incorrect attempts. Try again in 10 minutes.'
        };
      }

      // 2. Fetch the latest active OTP challenge for this phone number
      const { data: records, error: dbError } = await supabase
        .from('otp_verifications')
        .select('*')
        .eq('phone_number', phoneNumber)
        .is('verified_at', null)
        .order('created_at', { ascending: false })
        .limit(5);

      if (dbError || !records || records.length === 0) {
        return {
          success: false,
          code: 'AUTH_OTP_EXPIRED',
          message: 'That code has expired.'
        };
      }

      const latestRecord = records[0];
      const now = Date.now();
      const expiresAtTime = new Date(latestRecord.expires_at).getTime();

      // 3. Check expiration (5 minutes from creation)
      if (now >= expiresAtTime) {
        return {
          success: false,
          code: 'AUTH_OTP_EXPIRED',
          message: 'That code has expired.'
        };
      }

      // 4. Verify OTP Code
      const hashedInput = hashOtp(code.trim(), latestRecord.salt);
      const isMatch = (hashedInput === latestRecord.otp_hash);

      if (!isMatch) {
        const newAttempts = (latestRecord.attempts_count || 0) + 1;

        if (newAttempts >= MAX_INCORRECT_ATTEMPTS) {
          // Apply 10-minute server-side lockout
          await applyPhoneLockout(latestRecord.id);
          return {
            success: false,
            code: 'AUTH_LOCKOUT',
            message: 'Too many incorrect attempts. Try again in 10 minutes.',
            attemptsRemaining: 0
          };
        }

        // Update attempt count in DB
        await supabase
          .from('otp_verifications')
          .update({ attempts_count: newAttempts })
          .eq('id', latestRecord.id);

        if (newAttempts === 1) {
          return {
            success: false,
            code: 'AUTH_OTP_MISMATCH',
            message: "That code didn't match. Try again.",
            attemptsRemaining: 2
          };
        } else if (newAttempts === 2) {
          return {
            success: false,
            code: 'AUTH_OTP_MISMATCH',
            message: "That code didn't match. One more attempt before a 10-minute wait.",
            attemptsRemaining: 1
          };
        }
      }

      // 5. Code Matched Successfully
      const nowStr = new Date().toISOString();
      await supabase
        .from('otp_verifications')
        .update({ verified_at: nowStr })
        .eq('id', latestRecord.id);

      return {
        success: true,
        message: 'Verified successfully.'
      };
    } catch (err: any) {
      console.error('[OtpProvider] verifyOtp fatal error:', err);
      return {
        success: false,
        code: 'NETWORK_ISSUE',
        message: "We couldn't verify your code. Check your connection and try again."
      };
    }
  }
}

// ----------------------------------------------------
// 2. Native Supabase OTP Provider
// ----------------------------------------------------
export class SupabaseOtpProvider implements OtpProvider {
  async sendOtp(phoneNumber: string): Promise<OtpResult> {
    try {
      const { error } = await supabaseAuth.auth.signInWithOtp({
        phone: phoneNumber
      });

      if (error) {
        console.error('Supabase signInWithOtp error:', error);
        return {
          success: false,
          code: 'AUTH_ERROR',
          message: "We couldn't send the code. Check your connection and try again."
        };
      }

      return {
        success: true,
        message: 'Code sent successfully.',
        resendInSeconds: 30
      };
    } catch (err: any) {
      console.error('SupabaseOtpProvider sendOtp fatal error:', err);
      return {
        success: false,
        code: 'NETWORK_ISSUE',
        message: "We couldn't send the code. Check your connection and try again."
      };
    }
  }

  async verifyOtp(phoneNumber: string, code: string): Promise<OtpVerifyResult> {
    try {
      const { data, error } = await supabaseAuth.auth.verifyOtp({
        phone: phoneNumber,
        token: code,
        type: 'sms'
      });

      if (error || !data.user) {
        console.error('Supabase verifyOtp error:', error);
        const isExpired = error?.message?.toLowerCase().includes('expired') || false;
        return {
          success: false,
          message: isExpired ? 'That code has expired.' : "That code didn't match. Try again.",
          code: isExpired ? 'AUTH_OTP_EXPIRED' : 'AUTH_OTP_MISMATCH'
        };
      }

      return {
        success: true,
        message: 'Verified successfully.',
        userId: data.user.id
      };
    } catch (err: any) {
      console.error('SupabaseOtpProvider verifyOtp fatal error:', err);
      return {
        success: false,
        code: 'NETWORK_ISSUE',
        message: "We couldn't verify your code. Check your connection and try again."
      };
    }
  }
}

export { DatabaseOtpProvider as Fast2SmsProvider };
import { Msg91OtpProvider } from './msg91Provider';

// ----------------------------------------------------
// 3. Factory Function
// ----------------------------------------------------
export function getOtpProvider(): OtpProvider {
  const rawProvider = process.env.OTP_PROVIDER;
  const provider = (rawProvider || '').trim().toLowerCase();

  if (provider === 'msg91') {
    return new Msg91OtpProvider();
  }
  if (provider === 'supabase') {
    return new SupabaseOtpProvider();
  }
  if (provider === 'database' || provider === 'fast2sms') {
    return new DatabaseOtpProvider();
  }

  if (process.env.MSG91_AUTH_KEY) {
    return new Msg91OtpProvider();
  }

  // Default to Database-backed provider for strict 3-attempt lockout and 5-min expiry
  return new DatabaseOtpProvider();
}
