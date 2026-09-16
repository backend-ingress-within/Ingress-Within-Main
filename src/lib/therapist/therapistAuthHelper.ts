import { NextRequest } from 'next/server';
import { supabase } from '../db';
import { verifyJwt } from '../../utils/crypto';
import { COOKIE_THERAPIST_ACCESS_NAME } from '../../utils/cookies';
import { TherapistAuthService } from './therapistAuthService';

export interface AuthenticatedTherapist {
  therapistId: string;
  phoneNumber: string;
  deviceId: string;
  scope: 'therapist';
}

export interface AuthenticatedTherapistProfile {
  account: {
    id: string;
    phone_number: string;
    status: 'pending' | 'active' | 'suspended' | 'rejected';
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };
  profile: {
    id: string;
    phone_number: string;
    full_name: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Extracts and verifies the therapist access token from cookies or Authorization header.
 * Validates against active sessions in database.
 * Rejects any non-therapist tokens (e.g. user tokens).
 */
export async function getAuthenticatedTherapist(request: NextRequest): Promise<AuthenticatedTherapist | null> {
  try {
    let token = request.cookies?.get(COOKIE_THERAPIST_ACCESS_NAME)?.value;

    if (!token) {
      const cookieHeader = request.headers.get('cookie') || '';
      const match = cookieHeader.match(new RegExp(`${COOKIE_THERAPIST_ACCESS_NAME}=([^;]+)`));
      if (match) token = match[1];
    }

    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return null;

    const jwtSecret = TherapistAuthService.getJwtSecret();
    const payload = verifyJwt(token, jwtSecret);

    // Strict therapist check: must have tid and scope === 'therapist'
    // Ordinary user tokens have uid and no therapist scope, so they are immediately rejected.
    if (!payload || !payload.tid || payload.scope !== 'therapist') {
      return null;
    }

    // Validate that session is still active in database
    try {
      const { data: sessions, error: sessionError } = await supabase
        .from('therapist_sessions')
        .select('id')
        .eq('therapist_id', payload.tid)
        .eq('device_id', payload.did)
        .eq('is_active', true)
        .gt('expires_at', new Date().toISOString())
        .order('expires_at', { ascending: false });

      if (!sessionError && sessions && sessions.length === 0) {
        return null;
      }
    } catch (dbErr) {
      console.warn('[therapistAuthHelper] DB session check notice:', dbErr);
    }

    return {
      therapistId: payload.tid,
      phoneNumber: payload.phone,
      deviceId: payload.did,
      scope: payload.scope
    };
  } catch (error) {
    console.error('[therapistAuthHelper] getAuthenticatedTherapist error:', error);
    return null;
  }
}

/**
 * Requires an authenticated therapist session.
 * Throws an Error with status 401 if unauthenticated or if a user token is provided.
 */
export async function requireAuthenticatedTherapist(request: NextRequest): Promise<AuthenticatedTherapist> {
  const therapist = await getAuthenticatedTherapist(request);
  if (!therapist) {
    const error: any = new Error('Therapist authentication required.');
    error.status = 401;
    error.code = 'THERAPIST_AUTH_REQUIRED';
    throw error;
  }
  return therapist;
}

/**
 * Retrieves the therapist account record and profile for the authenticated therapist session.
 */
export async function requireTherapistProfile(request: NextRequest): Promise<AuthenticatedTherapistProfile> {
  const authTherapist = await requireAuthenticatedTherapist(request);

  // 1. Fetch therapist account
  const { data: account, error: accountError } = await supabase
    .from('therapist_accounts')
    .select('id, phone_number, status, is_active, created_at, updated_at')
    .eq('id', authTherapist.therapistId)
    .eq('is_active', true)
    .single();

  if (accountError || !account) {
    const error: any = new Error('Therapist account not found or deactivated.');
    error.status = 401;
    error.code = 'THERAPIST_NOT_FOUND';
    throw error;
  }

  // 2. Fetch therapist profile
  const { data: profile } = await supabase
    .from('therapist_profiles')
    .select('*')
    .eq('id', authTherapist.therapistId)
    .maybeSingle();

  const profileData = profile || {
    id: account.id,
    phone_number: account.phone_number,
    full_name: '',
    created_at: account.created_at,
    updated_at: account.updated_at
  };

  return {
    account,
    profile: profileData
  };
}
