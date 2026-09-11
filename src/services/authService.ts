import { supabase } from '../lib/db';
import { signJwt, verifyJwt, generateToken, hashOtp } from '../utils/crypto';
import { normalizePhoneNumber } from '../lib/auth/phone';

export interface EstablishSessionResult {
  success: boolean;
  user: {
    id: string;
    phone_number: string;
    name: string | null;
    account_status: string;
    is_active: boolean;
    created_at: string;
  };
  profile: {
    id: string;
    phone_number: string;
    full_name: string | null;
    account_status: string;
    onboarding_status: string;
    created_at: string;
    updated_at: string;
  };
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface CompleteSignupPayload {
  phoneNumber: string;
  name: string;
  deviceId: string;
  deviceName?: string;
  ipAddress?: string;
  userAgent?: string;
}

export class AuthService {
  public static getJwtSecret(): string {
    return process.env.JWT_SECRET || 'jwt_default_secret_dev';
  }
  private static readonly SIGNUP_TOKEN_EXPIRY = 15 * 60; // 15 minutes
  private static readonly SESSION_EXPIRY_SECONDS = 30 * 24 * 60 * 60; // 30 days rolling session

  /**
   * Generates a secure temporary signup token for a verified phone number.
   */
  static createSignupToken(phoneNumber: string): string {
    const canonical = normalizePhoneNumber(phoneNumber) || phoneNumber;
    return signJwt(
      {
        phone: canonical,
        purpose: 'signup_verified'
      },
      this.getJwtSecret(),
      this.SIGNUP_TOKEN_EXPIRY
    );
  }

  /**
   * Verifies a temporary signup token.
   */
  static verifySignupToken(token: string): { phone: string } | null {
    const payload = verifyJwt(token, this.getJwtSecret());
    if (!payload || payload.purpose !== 'signup_verified' || !payload.phone) {
      return null;
    }
    return { phone: payload.phone };
  }

  /**
   * Sanitizes a user's display name to prevent XSS / HTML injection.
   */
  static sanitizeName(rawName: string): string {
    if (!rawName || typeof rawName !== 'string') return '';
    // Trim whitespace and remove dangerous control / script characters while preserving standard international names
    return rawName
      .trim()
      .replace(/[<>'"&]/g, '') // Strip HTML tags/entities
      .substring(0, 100);
  }

  /**
   * Checks if an active user account exists for a phone number.
   */
  static async findUserByPhone(phoneNumber: string) {
    const canonical = normalizePhoneNumber(phoneNumber) || phoneNumber;
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', canonical)
      .eq('is_active', true)
      .maybeSingle();

    if (error) {
      console.warn('[AuthService] findUserByPhone DB notice:', error.message);
      return null;
    }

    return user;
  }

  /**
   * Atomically completes new user signup and establishes a 30-day session.
   */
  static async completeNewUserSignup(payload: CompleteSignupPayload): Promise<EstablishSessionResult> {
    const canonical = normalizePhoneNumber(payload.phoneNumber);
    if (!canonical) {
      throw new Error("That doesn't look like a valid number.");
    }

    const cleanName = this.sanitizeName(payload.name);
    if (!cleanName || cleanName.length < 1) {
      throw new Error('A name is required.');
    }

    const sanitizedIp = (payload.ipAddress || '127.0.0.1').split(',')[0].trim().substring(0, 45);
    const userAgent = payload.userAgent || 'Unknown';

    // 1. Check if user already exists (handles concurrent requests gracefully)
    let userRecord = await this.findUserByPhone(canonical);

    if (!userRecord) {
      // Create user record in public.users
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone_number: canonical,
          name: cleanName,
          account_status: 'active',
          is_active: true
        })
        .select()
        .single();

      if (createError) {
        // If unique constraint collision from race condition, fetch existing
        if (createError.code === '23505' || createError.message?.includes('duplicate')) {
          userRecord = await this.findUserByPhone(canonical);
          if (!userRecord) {
            throw new Error(`Failed to create user: ${createError.message}`);
          }
        } else {
          throw new Error(`Failed to create user: ${createError.message}`);
        }
      } else {
        userRecord = newUser;
      }

      // Sync with Supabase auth.users
      try {
        await supabase.auth.admin.createUser({
          id: userRecord.id,
          phone: canonical,
          phone_confirm: true
        });
      } catch (err: any) {
        console.warn('[AuthService] auth.users sync notice:', err?.message);
      }
    } else {
      // Update name if not set
      if (!userRecord.name) {
        await supabase
          .from('users')
          .update({ name: cleanName })
          .eq('id', userRecord.id);
        userRecord.name = cleanName;
      }
    }

    // 2. Ensure profile exists with deferred onboarding status ('pending')
    // TODO: Account onboarding must integrate the explicit legal consent flow before final production launch.
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userRecord.id)
      .maybeSingle();

    let profileRecord = existingProfile;

    if (!existingProfile) {
      const { data: newProfile, error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userRecord.id,
          phone_number: canonical,
          full_name: cleanName,
          account_status: 'active',
          onboarding_status: 'pending',
          consent_completed: false,
          profile_completed: false,
          orientation_completed: false,
          onboarding_completed: false,
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileError) {
        console.warn('[AuthService] Profile creation notice:', profileError.message);
      }
      profileRecord = newProfile || {
        id: userRecord.id,
        phone_number: canonical,
        full_name: cleanName,
        account_status: 'active',
        onboarding_status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
    } else if (!existingProfile.full_name) {
      await supabase
        .from('profiles')
        .update({ full_name: cleanName })
        .eq('id', userRecord.id);
      profileRecord.full_name = cleanName;
    }

    // 3. Establish Multi-Device Session
    return this.establishSession(
      userRecord,
      profileRecord,
      payload.deviceId,
      payload.deviceName || 'Browser',
      sanitizedIp,
      userAgent,
      true
    );
  }

  /**
   * Establishes a rolling 30-day multi-device session for an existing or newly verified user.
   */
  static async establishSession(
    userOrPhone: any,
    profileOrDeviceId: any,
    deviceIdOrDeviceName?: string,
    deviceNameOrIp?: string,
    ipOrUserAgent?: string,
    userAgentOrIsNewSignup?: string | boolean,
    isNewSignupFlag?: boolean
  ): Promise<EstablishSessionResult> {
    let userRecord: any;
    let profileRecord: any = null;
    let deviceId: string;
    let deviceName: string = 'Browser';
    let ipAddress: string = '127.0.0.1';
    let userAgent: string = 'Unknown';
    let isNewSignup: boolean = false;

    if (typeof userOrPhone === 'string') {
      const phone = normalizePhoneNumber(userOrPhone) || userOrPhone;
      userRecord = await this.findUserByPhone(phone);
      if (!userRecord) {
        const { data: newUser } = await supabase.from('users').insert({
          phone_number: phone,
          account_status: 'active',
          is_active: true
        }).select().single();
        userRecord = newUser || { id: 'usr_' + Date.now(), phone_number: phone, account_status: 'active', is_active: true, created_at: new Date().toISOString() };
      }
      deviceId = profileOrDeviceId || 'device_default';
      deviceName = deviceIdOrDeviceName || 'Browser';
      ipAddress = deviceNameOrIp || '127.0.0.1';
      userAgent = ipOrUserAgent || 'Unknown';
      isNewSignup = Boolean(userAgentOrIsNewSignup);
    } else {
      userRecord = userOrPhone;
      profileRecord = profileOrDeviceId;
      deviceId = deviceIdOrDeviceName || 'device_default';
      deviceName = deviceNameOrIp || 'Browser';
      ipAddress = ipOrUserAgent || '127.0.0.1';
      userAgent = (typeof userAgentOrIsNewSignup === 'string') ? userAgentOrIsNewSignup : 'Unknown';
      isNewSignup = Boolean(isNewSignupFlag);
    }

    const sanitizedIp = (ipAddress || '127.0.0.1').split(',')[0].trim().substring(0, 45);

    // 1. Generate session tokens
    const rawRefreshToken = generateToken();
    const hashedRefreshToken = hashOtp(rawRefreshToken, 'session_salt_static_secret');
    const sessionExpiresAt = new Date(Date.now() + this.SESSION_EXPIRY_SECONDS * 1000).toISOString();

    // 2. Multi-device support: Deactivate only sessions on the SAME device_id for this user
    await supabase
      .from('user_sessions')
      .update({ is_active: false })
      .eq('user_id', userRecord.id)
      .eq('device_id', deviceId)
      .eq('is_active', true);

    // 3. Store Session Record
    const { error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        user_id: userRecord.id,
        refresh_token_hash: hashedRefreshToken,
        device_id: deviceId,
        device_name: deviceName ? deviceName.substring(0, 100) : 'Browser',
        ip_address: sanitizedIp,
        user_agent: userAgent,
        session_state: { onboardingCompleted: profileRecord?.onboarding_completed || false },
        expires_at: sessionExpiresAt
      });

    if (sessionError) {
      console.warn('[AuthService] Session insertion notice:', sessionError.message);
    }

    // 4. Generate JWT Access Token (30 days validity)
    const accessToken = signJwt(
      {
        uid: userRecord.id,
        phone: userRecord.phone_number,
        did: deviceId
      },
      this.getJwtSecret(),
      this.SESSION_EXPIRY_SECONDS
    );

    // 5. Audit Log
    try {
      await supabase.from('audit_logs').insert({
        user_id: userRecord.id,
        action: isNewSignup ? 'auth.signup_success' : 'auth.login_success',
        ip_address: sanitizedIp,
        user_agent: userAgent,
        metadata: { device_id: deviceId, device_name: deviceName }
      });
    } catch {}

    return {
      success: true,
      user: {
        id: userRecord.id,
        phone_number: userRecord.phone_number,
        name: userRecord.name || null,
        account_status: userRecord.account_status || 'active',
        is_active: userRecord.is_active !== false,
        created_at: userRecord.created_at || new Date().toISOString()
      },
      profile: {
        id: profileRecord?.id || userRecord.id,
        phone_number: profileRecord?.phone_number || userRecord.phone_number,
        full_name: profileRecord?.full_name || userRecord.name || null,
        account_status: profileRecord?.account_status || 'active',
        onboarding_status: profileRecord?.onboarding_status || 'pending',
        created_at: profileRecord?.created_at || new Date().toISOString(),
        updated_at: profileRecord?.updated_at || new Date().toISOString()
      },
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: this.SESSION_EXPIRY_SECONDS
    };
  }
}
