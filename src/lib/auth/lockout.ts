import { supabase } from '../db';

export interface LockoutStatus {
  isLocked: boolean;
  remainingSeconds: number;
  message?: string;
}

export const LOCKOUT_DURATION_MS = 10 * 60 * 1000; // 10 minutes
export const MAX_INCORRECT_ATTEMPTS = 3;

/**
 * Checks if a phone number is currently under server-side lockout due to 3 incorrect attempts.
 * This check is server-authoritative and resistant to clearing cookies, localStorage, incognito, or switching devices.
 */
export async function checkPhoneLockout(phoneNumber: string): Promise<LockoutStatus> {
  try {
    const now = Date.now();
    const tenMinutesAgo = new Date(now - LOCKOUT_DURATION_MS).toISOString();

    const { data: records, error } = await supabase
      .from('otp_verifications')
      .select('id, attempts_count, locked_until, created_at')
      .eq('phone_number', phoneNumber)
      .gt('created_at', tenMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.warn('[LockoutEngine] DB query notice:', error.message);
      return { isLocked: false, remainingSeconds: 0 };
    }

    if (!records || records.length === 0) {
      return { isLocked: false, remainingSeconds: 0 };
    }

    for (const record of records) {
      // 1. Explicit locked_until field
      if (record.locked_until) {
        const lockedUntilTime = new Date(record.locked_until).getTime();
        if (now < lockedUntilTime) {
          const remainingSeconds = Math.ceil((lockedUntilTime - now) / 1000);
          return {
            isLocked: true,
            remainingSeconds,
            message: 'Too many incorrect attempts. Try again in 10 minutes.'
          };
        }
      }

      // 2. 3 or more attempts within the 10-minute window
      if (record.attempts_count >= MAX_INCORRECT_ATTEMPTS) {
        const recordCreatedAt = new Date(record.created_at).getTime();
        const expiryOfLockout = recordCreatedAt + LOCKOUT_DURATION_MS;
        if (now < expiryOfLockout) {
          const remainingSeconds = Math.ceil((expiryOfLockout - now) / 1000);
          return {
            isLocked: true,
            remainingSeconds,
            message: 'Too many incorrect attempts. Try again in 10 minutes.'
          };
        }
      }
    }

    return { isLocked: false, remainingSeconds: 0 };
  } catch (err) {
    console.error('[LockoutEngine] Unexpected error checking lockout:', err);
    return { isLocked: false, remainingSeconds: 0 };
  }
}

/**
 * Enforces lockout on a phone record after 3 incorrect attempts.
 */
export async function applyPhoneLockout(recordId: string): Promise<void> {
  try {
    const lockedUntil = new Date(Date.now() + LOCKOUT_DURATION_MS).toISOString();
    await supabase
      .from('otp_verifications')
      .update({
        attempts_count: MAX_INCORRECT_ATTEMPTS,
        locked_until: lockedUntil
      })
      .eq('id', recordId);
  } catch (err) {
    console.error('[LockoutEngine] Failed to apply lockout:', err);
  }
}
