import crypto from 'crypto';
import { supabase } from '../db';
import { signJwt } from '../../utils/crypto';
import { COOKIE_ACCESS_NAME } from '../../utils/cookies';

export class RazorpayVerificationService {
  /**
   * Verification feature gate. Disabled by default.
   */
  public static isVerificationEnabled(): boolean {
    return process.env.RAZORPAY_VERIFICATION_ENABLED === 'true';
  }

  public static getVerificationUsername(): string {
    return process.env.RAZORPAY_VERIFICATION_USERNAME || 'razorpay_reviewer';
  }

  public static getVerificationPasswordHash(): string {
    return process.env.RAZORPAY_VERIFICATION_PASSWORD_HASH || '';
  }

  /**
   * Timing-safe verification of credentials.
   */
  public static verifyCredentials(username: string, password: string): boolean {
    if (!this.isVerificationEnabled()) return false;

    const expectedUser = this.getVerificationUsername();
    const expectedHash = this.getVerificationPasswordHash();

    if (!expectedHash || !username || !password) return false;

    // Check username
    if (username.trim() !== expectedUser) return false;

    // Hash input password with SHA-256
    const inputHash = crypto.createHash('sha256').update(password).digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(inputHash, 'utf8'),
        Buffer.from(expectedHash, 'utf8')
      );
    } catch (e) {
      return false;
    }
  }

  /**
   * Creates or fetches the dedicated synthetic reviewer user.
   * NEVER links to any real user records, real journals, or clinical data.
   */
  public static async getOrCreateSyntheticReviewer() {
    const syntheticPhone = '+919999990000'; // Dedicated synthetic reviewer phone

    // Check if synthetic user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id, phone_number, name')
      .eq('phone_number', syntheticPhone)
      .maybeSingle();

    if (existingUser) {
      return existingUser;
    }

    // Create synthetic user record
    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        phone_number: syntheticPhone,
        name: 'Razorpay Verification Reviewer',
        account_status: 'active',
        is_active: true
      })
      .select()
      .single();

    if (userError || !newUser) {
      // Fallback synthetic object if insert blocked
      return {
        id: 'usr_synthetic_razorpay_reviewer',
        phone_number: syntheticPhone,
        name: 'Razorpay Verification Reviewer'
      };
    }

    // Ensure synthetic profile exists
    try {
      await supabase
        .from('profiles')
        .upsert({
          id: newUser.id,
          phone_number: syntheticPhone,
          full_name: 'Razorpay Verification Reviewer',
          onboarding_status: 'completed',
          consent_completed: true,
          profile_completed: true,
          orientation_completed: true,
          assessment_completed: true,
          onboarding_completed: true
        });
    } catch (e) {}

    return newUser;
  }

  /**
   * Establishes a standard session for the reviewer with HTTP-only cookie.
   */
  public static async establishReviewerSession() {
    const reviewer = await this.getOrCreateSyntheticReviewer();
    const jwtSecret = process.env.JWT_SECRET || 'jwt_default_secret_dev';
    const deviceId = `reviewer_session_${Date.now()}`;

    // Standard user JWT with uid, phone, and did
    const token = signJwt(
      {
        uid: reviewer.id,
        phone: reviewer.phone_number,
        did: deviceId
      },
      jwtSecret,
      24 * 60 * 60 // 24 hours
    );

    // Save session in user_sessions
    try {
      await supabase.from('user_sessions').insert({
        user_id: reviewer.id,
        refresh_token_hash: crypto.createHash('sha256').update(token).digest('hex'),
        device_id: deviceId,
        device_name: 'Razorpay Reviewer Console',
        ip_address: '127.0.0.1',
        user_agent: 'Razorpay Verification',
        is_active: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
    } catch (e) {}

    return { token, reviewer };
  }
}
