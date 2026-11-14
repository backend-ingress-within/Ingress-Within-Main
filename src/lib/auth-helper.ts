import { NextRequest } from 'next/server';
import { supabase } from './db';
import { verifyJwt } from '../utils/crypto';
import { COOKIE_ACCESS_NAME } from '../utils/cookies';
import { THERAPY_CLIENT_COOKIE_NAME } from './therapy/therapyClientAuthService';

export interface AuthenticatedUser {
  userId: string;
  phoneNumber: string;
  deviceId: string;
}

export interface AuthenticatedUserProfile {
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
    consent_completed: boolean;
    profile_completed: boolean;
    orientation_completed: boolean;
    assessment_completed: boolean;
    onboarding_completed: boolean;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Extracts and verifies the access token from cookies or Authorization header.
 * Validates against active sessions in database.
 * Returns user session metadata if valid, or null otherwise.
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    let token = request.cookies?.get(COOKIE_ACCESS_NAME)?.value;
    let isTherapyClientCookie = false;

    if (!token) {
      const therapyCookie = request.cookies?.get(THERAPY_CLIENT_COOKIE_NAME)?.value;
      if (therapyCookie) {
        token = therapyCookie;
        isTherapyClientCookie = true;
      }
    }

    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`${COOKIE_ACCESS_NAME}=([^;]+)`));
      if (match) {
        token = match[1];
      } else {
        const therapyMatch = cookieHeader.match(new RegExp(`${THERAPY_CLIENT_COOKIE_NAME}=([^;]+)`));
        if (therapyMatch) {
          token = therapyMatch[1];
          isTherapyClientCookie = true;
        }
      }
    }

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const jwtSecret = process.env.JWT_SECRET || 'jwt_default_secret_dev';
    const payload = verifyJwt(token, jwtSecret);

    if (!payload || !payload.uid) return null;

    // If therapy client token, validate against therapy_client_accounts
    if (isTherapyClientCookie || payload.role === 'therapy_client' || payload.type === 'therapy_client') {
      try {
        const { data: clientAcc } = await supabase
          .from('therapy_client_accounts')
          .select('id, user_id, phone_number')
          .or(`id.eq.${payload.clientAccountId || payload.uid},user_id.eq.${payload.uid}`)
          .maybeSingle();

        if (clientAcc) {
          return {
            userId: clientAcc.user_id || clientAcc.id,
            phoneNumber: clientAcc.phone_number || payload.phone || '',
            deviceId: 'therapy_client',
          };
        }
      } catch (clientErr) {
        console.warn('[auth-helper] Therapy client session verify note:', clientErr);
      }

      return {
        userId: payload.uid,
        phoneNumber: payload.phone || '',
        deviceId: 'therapy_client',
      };
    }

    // Validate that session is still active in database (if database is reachable)
    try {
      const { data: sessions, error: sessionError } = await supabase
        .from('user_sessions')
        .select('id')
        .eq('user_id', payload.uid)
        .eq('device_id', payload.did)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false });

      // If DB responded successfully and session was explicitly revoked/not found, deny access
      if (!sessionError && sessions && sessions.length === 0) {
        return null;
      }
    } catch (dbErr) {
      console.warn('[auth-helper] DB session verification notice:', dbErr);
    }

    return {
      userId: payload.uid,
      phoneNumber: payload.phone,
      deviceId: payload.did
    };
  } catch (error) {
    console.error('[auth-helper] getAuthenticatedUser error:', error);
    return null;
  }
}

/**
 * Requires an authenticated user session. Throws an Error with 401 status if unauthenticated.
 */
export async function requireAuthenticatedUser(request: NextRequest): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    const error: any = new Error('Authentication required.');
    error.status = 401;
    error.code = 'AUTH_REQUIRED';
    throw error;
  }
  return user;
}

/**
 * Retrieves the full user record and profile for the authenticated session.
 */
export async function requireUserProfile(request: NextRequest): Promise<AuthenticatedUserProfile> {
  const authUser = await requireAuthenticatedUser(request);

  // 1. Fetch user record
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, phone_number, name, account_status, is_active, created_at')
    .eq('id', authUser.userId)
    .eq('is_active', true)
    .single();

  if (userError || !user) {
    // Check if authenticated as a dedicated therapy client account
    const { data: clientAcc } = await supabase
      .from('therapy_client_accounts')
      .select('id, user_id, full_name, phone_number, email, status, created_at')
      .or(`id.eq.${authUser.userId},user_id.eq.${authUser.userId}`)
      .maybeSingle();

    if (clientAcc) {
      const syntheticUser = {
        id: clientAcc.user_id || clientAcc.id,
        phone_number: clientAcc.phone_number || authUser.phoneNumber,
        name: clientAcc.full_name || 'Therapy Client',
        account_status: clientAcc.status || 'in_care',
        is_active: true,
        created_at: clientAcc.created_at || new Date().toISOString(),
      };
      const syntheticProfile = {
        id: syntheticUser.id,
        phone_number: syntheticUser.phone_number,
        full_name: syntheticUser.name,
        account_status: syntheticUser.account_status,
        onboarding_status: 'completed',
        consent_completed: true,
        profile_completed: true,
        orientation_completed: true,
        assessment_completed: true,
        onboarding_completed: true,
        created_at: syntheticUser.created_at,
        updated_at: syntheticUser.created_at,
      };
      return {
        user: syntheticUser,
        profile: syntheticProfile,
      };
    }

    const error: any = new Error('User account not found or deactivated.');
    error.status = 401;
    error.code = 'AUTH_USER_NOT_FOUND';
    throw error;
  }

  // 2. Fetch profile record
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authUser.userId)
    .maybeSingle();

  const profileData = profile || {
    id: user.id,
    phone_number: user.phone_number,
    full_name: user.name || null,
    account_status: user.account_status || 'active',
    onboarding_status: 'pending',
    consent_completed: false,
    profile_completed: false,
    orientation_completed: false,
    assessment_completed: false,
    onboarding_completed: false,
    created_at: user.created_at,
    updated_at: user.created_at
  };

  return {
    user,
    profile: profileData
  };
}
