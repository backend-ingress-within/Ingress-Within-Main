import { NextRequest } from 'next/server';
import { supabase } from './db';
import { verifyJwt } from '../utils/crypto';
import { COOKIE_ACCESS_NAME } from '../utils/cookies';

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

    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`${COOKIE_ACCESS_NAME}=([^;]+)`));
      if (match) token = match[1];
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
