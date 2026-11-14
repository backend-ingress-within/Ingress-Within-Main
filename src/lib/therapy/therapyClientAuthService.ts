import crypto from 'crypto';
import { supabase } from '../db';
import { signJwt, verifyJwt } from '../../utils/crypto';
import { getOtpProvider } from '../../providers/otpProvider';

export const THERAPY_CLIENT_COOKIE_NAME = 'iw_therapy_client_token';
export const THERAPY_CLIENT_SESSION_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days

export interface TherapyClientAuthUser {
  id: string; // therapy_client_accounts.id
  userId: string; // auth user_id or account id
  fullName: string | null;
  phoneNumber: string;
  email: string;
  status: string;
}

export class TherapyClientAuthService {
  /**
   * Normalizes phone numbers to standard E.164 +91XXXXXXXXXX format.
   */
  static normalizePhoneNumber(rawPhone: string): string {
    if (!rawPhone) return '';
    const cleanDigits = rawPhone.replace(/[^\d+]/g, '');
    if (cleanDigits.startsWith('+')) {
      return cleanDigits;
    }
    const digitsOnly = cleanDigits.replace(/\D/g, '');
    if (digitsOnly.length === 10) {
      return `+91${digitsOnly}`;
    }
    if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
      return `+${digitsOnly}`;
    }
    return `+${digitsOnly}`;
  }

  /**
   * Hashes a password using Node's native scrypt memory-hard key derivation.
   */
  static hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = crypto.scryptSync(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
  }

  /**
   * Timing-safe verification of password against scrypt salt:hash.
   */
  static verifyPassword(password: string, storedHash: string): boolean {
    if (!storedHash || !storedHash.includes(':')) return false;
    const [salt, key] = storedHash.split(':');
    const keyBuffer = Buffer.from(key, 'hex');
    const derivedBuffer = crypto.scryptSync(password, salt, 64);
    if (keyBuffer.length !== derivedBuffer.length) return false;
    return crypto.timingSafeEqual(keyBuffer, derivedBuffer);
  }

  /**
   * Generates a 32-byte cryptographic claim token for first-session password creation.
   * Stores the SHA-256 hash in therapy_client_accounts.metadata.
   */
  static async generateClaimToken(
    clientAccountIdOrUserId: string
  ): Promise<{ token: string; claimUrl: string; expiresAt: string }> {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30-day window
    const nowIso = new Date().toISOString();

    // Find the client account by id or user_id
    const { data: client, error } = await supabase
      .from('therapy_client_accounts')
      .select('id, metadata')
      .or(`id.eq.${clientAccountIdOrUserId},user_id.eq.${clientAccountIdOrUserId}`)
      .maybeSingle();

    if (error || !client) {
      throw new Error('Therapy client account not found.');
    }

    const currentMetadata = (client.metadata && typeof client.metadata === 'object') ? client.metadata : {};
    const updatedMetadata = {
      ...currentMetadata,
      claim_token_hash: tokenHash,
      claim_token_created_at: nowIso,
      claim_token_expires_at: expiresAt,
    };

    await supabase
      .from('therapy_client_accounts')
      .update({
        metadata: updatedMetadata,
        updated_at: nowIso,
      })
      .eq('id', client.id);

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.APP_BASE_URL ||
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'https://ingresswithin.com');

    const claimUrl = `${baseUrl.replace(/\/+$/, '')}/therapy/claim-account?token=${rawToken}`;

    return {
      token: rawToken,
      claimUrl,
      expiresAt,
    };
  }

  /**
   * Validates a claim token from URL and retrieves pre-filled client information.
   */
  static async resolveClaimToken(rawToken: string): Promise<{
    valid: boolean;
    alreadyClaimed?: boolean;
    expired?: boolean;
    error?: string;
    client?: {
      id: string;
      fullName: string | null;
      phoneNumber: string | null;
      email: string;
    };
  }> {
    if (!rawToken || typeof rawToken !== 'string') {
      return { valid: false, error: 'Invalid or missing claim token.' };
    }

    const tokenHash = crypto.createHash('sha256').update(rawToken.trim()).digest('hex');

    const { data: clients, error } = await supabase
      .from('therapy_client_accounts')
      .select('id, full_name, phone_number, email, metadata')
      .filter('metadata->>claim_token_hash', 'eq', tokenHash)
      .limit(1);

    if (error || !clients || clients.length === 0) {
      return { valid: false, error: 'Setup link is invalid or has already been used.' };
    }

    const client = clients[0];
    const metadata = client.metadata || {};

    if (metadata.claimed_at) {
      return {
        valid: false,
        alreadyClaimed: true,
        error: 'This therapy account has already been set up. Please sign in with your phone number and password.',
      };
    }

    if (metadata.claim_token_expires_at) {
      const expires = new Date(metadata.claim_token_expires_at).getTime();
      if (Date.now() > expires) {
        return {
          valid: false,
          expired: true,
          error: 'This setup link has expired. Please request a new setup link from your therapist or admin.',
        };
      }
    }

    return {
      valid: true,
      client: {
        id: client.id,
        fullName: client.full_name,
        phoneNumber: client.phone_number,
        email: client.email,
      },
    };
  }

  /**
   * Claims account by setting password, updating status to in_care, and issuing session JWT.
   */
  static async claimAccountAndSetPassword(
    rawToken: string,
    password: string
  ): Promise<{
    success: boolean;
    token?: string;
    client?: TherapyClientAuthUser;
    error?: string;
  }> {
    const resolution = await this.resolveClaimToken(rawToken);
    if (!resolution.valid || !resolution.client) {
      return { success: false, error: resolution.error || 'Invalid claim token.' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const clientRecord = resolution.client;
    const passwordHash = this.hashPassword(password);
    const nowIso = new Date().toISOString();

    const { data: fullAccount, error: fetchErr } = await supabase
      .from('therapy_client_accounts')
      .select('*')
      .eq('id', clientRecord.id)
      .single();

    if (fetchErr || !fullAccount) {
      return { success: false, error: 'Failed to retrieve client account.' };
    }

    const currentMeta = fullAccount.metadata || {};
    const updatedMeta = {
      ...currentMeta,
      password_hash: passwordHash,
      claimed_at: nowIso,
      claim_token_hash: null, // Invalidate token upon claiming
    };

    const { data: updated, error: updateErr } = await supabase
      .from('therapy_client_accounts')
      .update({
        metadata: updatedMeta,
        status: fullAccount.status === 'lead' || fullAccount.status === 'intake_pending' ? 'in_care' : fullAccount.status,
        last_active_at: nowIso,
        updated_at: nowIso,
      })
      .eq('id', clientRecord.id)
      .select('*')
      .single();

    if (updateErr || !updated) {
      return { success: false, error: 'Failed to update client account with new password.' };
    }

    const sessionToken = this.issueClientJwt({
      id: updated.id,
      userId: updated.user_id || updated.id,
      fullName: updated.full_name,
      phoneNumber: updated.phone_number,
      email: updated.email,
      status: updated.status,
    });

    return {
      success: true,
      token: sessionToken,
      client: {
        id: updated.id,
        userId: updated.user_id || updated.id,
        fullName: updated.full_name,
        phoneNumber: updated.phone_number,
        email: updated.email,
        status: updated.status,
      },
    };
  }

  /**
   * Verifies credentials (phone + password) and issues session JWT.
   */
  static async loginWithPassword(
    rawPhone: string,
    password: string
  ): Promise<{
    success: boolean;
    token?: string;
    client?: TherapyClientAuthUser;
    error?: string;
  }> {
    const normalizedPhone = this.normalizePhoneNumber(rawPhone);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      return { success: false, error: 'Please enter a valid phone number.' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password.' };
    }

    const { data: client, error } = await supabase
      .from('therapy_client_accounts')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .maybeSingle();

    if (error || !client) {
      return {
        success: false,
        error: 'No therapy account found for this phone number. Please check your number or contact your care team.',
      };
    }

    const storedHash = client.metadata?.password_hash;
    if (!storedHash) {
      return {
        success: false,
        error: 'A password has not been set for this account yet. Please log in using OTP or use the setup link sent to your email.',
      };
    }

    const matches = this.verifyPassword(password, storedHash);
    if (!matches) {
      return { success: false, error: 'Incorrect phone number or password.' };
    }

    const nowIso = new Date().toISOString();
    await supabase
      .from('therapy_client_accounts')
      .update({ last_active_at: nowIso })
      .eq('id', client.id);

    const token = this.issueClientJwt({
      id: client.id,
      userId: client.user_id || client.id,
      fullName: client.full_name,
      phoneNumber: client.phone_number,
      email: client.email,
      status: client.status,
    });

    return {
      success: true,
      token,
      client: {
        id: client.id,
        userId: client.user_id || client.id,
        fullName: client.full_name,
        phoneNumber: client.phone_number,
        email: client.email,
        status: client.status,
      },
    };
  }

  /**
   * Sends OTP for phone-based login via MSG91/OTP provider.
   */
  static async sendOtpForLogin(rawPhone: string): Promise<{ success: boolean; message: string; code?: string }> {
    const normalizedPhone = this.normalizePhoneNumber(rawPhone);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      return { success: false, message: 'Please enter a valid phone number.' };
    }

    const { data: client } = await supabase
      .from('therapy_client_accounts')
      .select('id')
      .eq('phone_number', normalizedPhone)
      .maybeSingle();

    if (!client) {
      return {
        success: false,
        message: 'No therapy account found with this phone number. Please check your number or complete the intake form.',
      };
    }

    const provider = getOtpProvider();
    const result = await provider.sendOtp(normalizedPhone);
    return result;
  }

  /**
   * Verifies OTP and logs in client.
   */
  static async verifyOtpAndLogin(
    rawPhone: string,
    code: string
  ): Promise<{
    success: boolean;
    token?: string;
    client?: TherapyClientAuthUser;
    error?: string;
  }> {
    const normalizedPhone = this.normalizePhoneNumber(rawPhone);
    const provider = getOtpProvider();
    const result = await provider.verifyOtp(normalizedPhone, code);

    if (!result.success) {
      return { success: false, error: result.message || 'Invalid or expired OTP.' };
    }

    const { data: client, error } = await supabase
      .from('therapy_client_accounts')
      .select('*')
      .eq('phone_number', normalizedPhone)
      .maybeSingle();

    if (error || !client) {
      return { success: false, error: 'No therapy account found for this phone number.' };
    }

    const nowIso = new Date().toISOString();
    await supabase
      .from('therapy_client_accounts')
      .update({ last_active_at: nowIso })
      .eq('id', client.id);

    const token = this.issueClientJwt({
      id: client.id,
      userId: client.user_id || client.id,
      fullName: client.full_name,
      phoneNumber: client.phone_number,
      email: client.email,
      status: client.status,
    });

    return {
      success: true,
      token,
      client: {
        id: client.id,
        userId: client.user_id || client.id,
        fullName: client.full_name,
        phoneNumber: client.phone_number,
        email: client.email,
        status: client.status,
      },
    };
  }

  /**
   * Checks if an account already exists for a phone number (used in intake Step 1).
   */
  static async checkPhoneExists(rawPhone: string): Promise<{
    exists: boolean;
    isClaimed: boolean;
    hasPassword: boolean;
    fullName?: string;
  }> {
    const normalizedPhone = this.normalizePhoneNumber(rawPhone);
    if (!normalizedPhone || normalizedPhone.length < 10) {
      return { exists: false, isClaimed: false, hasPassword: false };
    }

    const { data: client } = await supabase
      .from('therapy_client_accounts')
      .select('id, full_name, metadata')
      .eq('phone_number', normalizedPhone)
      .maybeSingle();

    if (!client) {
      return { exists: false, isClaimed: false, hasPassword: false };
    }

    const hasPassword = Boolean(client.metadata?.password_hash);
    const isClaimed = Boolean(client.metadata?.claimed_at);

    return {
      exists: true,
      isClaimed,
      hasPassword,
      fullName: client.full_name || undefined,
    };
  }

  /**
   * Signs a secure JWT for the therapy client.
   */
  static issueClientJwt(client: TherapyClientAuthUser): string {
    const jwtSecret = process.env.JWT_SECRET || 'jwt_default_secret_dev';
    const payload = {
      uid: client.userId || client.id,
      clientAccountId: client.id,
      phone: client.phoneNumber,
      email: client.email,
      role: 'therapy_client',
      type: 'therapy_client',
    };
    return signJwt(payload, jwtSecret, THERAPY_CLIENT_SESSION_EXPIRY_SECONDS);
  }

  /**
   * Verifies a client JWT and retrieves active account record.
   */
  static async verifyClientToken(token: string): Promise<TherapyClientAuthUser | null> {
    if (!token) return null;
    const jwtSecret = process.env.JWT_SECRET || 'jwt_default_secret_dev';
    const payload = verifyJwt(token, jwtSecret);
    if (!payload || !payload.uid) return null;

    const { data: client, error } = await supabase
      .from('therapy_client_accounts')
      .select('id, user_id, full_name, phone_number, email, status')
      .or(`id.eq.${payload.clientAccountId || payload.uid},user_id.eq.${payload.uid}`)
      .maybeSingle();

    if (error || !client) return null;

    return {
      id: client.id,
      userId: client.user_id || client.id,
      fullName: client.full_name,
      phoneNumber: client.phone_number,
      email: client.email,
      status: client.status,
    };
  }
}
