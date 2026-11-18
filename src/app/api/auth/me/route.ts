import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';
import { verifyJwt } from '../../../../utils/crypto';
import { COOKIE_ACCESS_NAME } from '../../../../utils/cookies';
import {
  THERAPY_CLIENT_COOKIE_NAME,
  TherapyClientAuthService,
} from '../../../../lib/therapy/therapyClientAuthService';

export async function GET(request: NextRequest) {
  try {
    // Helper to authenticate therapy clients if a dedicated therapy token exists
    const checkTherapyClient = async () => {
      let therapyToken = request.cookies?.get(THERAPY_CLIENT_COOKIE_NAME)?.value;
      if (!therapyToken) {
        const cookieHeader = request.headers.get('cookie') || '';
        const therapyMatch = cookieHeader.match(new RegExp(`${THERAPY_CLIENT_COOKIE_NAME}=([^;]+)`));
        if (therapyMatch) therapyToken = therapyMatch[1];
      }
      if (therapyToken) {
        const client = await TherapyClientAuthService.verifyClientToken(therapyToken);
        if (client) {
          return NextResponse.json({
            user: {
              id: client.userId,
              client_account_id: client.id,
              phone_number: client.phoneNumber,
              name: client.fullName,
              full_name: client.fullName,
              email: client.email,
              role: 'therapy_client',
              is_therapy_client: true,
              account_status: client.status,
              is_active: true,
              created_at: new Date().toISOString(),
            },
            profile: {
              id: client.id,
              phone_number: client.phoneNumber,
              name: client.fullName,
              full_name: client.fullName,
              email: client.email,
              role: 'therapy_client',
              is_therapy_client: true,
              account_status: client.status,
              onboarding_status: 'completed',
              consent_completed: true,
              profile_completed: true,
              orientation_completed: true,
              assessment_completed: true,
              onboarding_completed: true,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
          });
        }
      }
      return null;
    };

    // 1. Resolve access token (priority to secure cookie, fallback to Authorization header)
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

    if (!token) {
      const therapyRes = await checkTherapyClient();
      if (therapyRes) return therapyRes;

      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication token is required.'
          }
        },
        { status: 401 }
      );
    }

    // 2. Cryptographically verify JWT
    const jwtSecret = process.env.JWT_SECRET || 'jwt_default_secret_dev';
    const payload = verifyJwt(token, jwtSecret);

    if (!payload || !payload.uid) {
      const therapyRes = await checkTherapyClient();
      if (therapyRes) return therapyRes;

      return NextResponse.json(
        {
          error: {
            code: 'AUTH_INVALID_TOKEN',
            message: 'Your login token is invalid or has expired.'
          }
        },
        { status: 401 }
      );
    }

    // 3. Validate that the session is still active in database (revocable access tokens)
    const { data: sessions, error: sessionError } = await supabase
      .from('user_sessions')
      .select('id, expires_at, is_active')
      .eq('user_id', payload.uid)
      .eq('device_id', payload.did)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString())
      .order('expires_at', { ascending: false });

    let session: any = null;
    if (sessions && sessions.length > 0) {
      if (sessions.length > 1) {
        // Asynchronously deactivate the older stale sessions in the background
        const staleSessionIds = sessions.slice(1).map(s => s.id);
        supabase
          .from('user_sessions')
          .update({ is_active: false })
          .in('id', staleSessionIds)
          .then(({ error: cleanError }) => {
            if (cleanError) {
              console.error(`[me/route.ts] Background cleanup of stale sessions failed:`, cleanError.message);
            }
          });
      }
      session = sessions[0];
    }

    if (sessionError) {
      console.error('[me/route.ts] Supabase query error checking user sessions:', sessionError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to query session table.'
          }
        },
        { status: 500 }
      );
    }

    if (!session) {
      const therapyRes = await checkTherapyClient();
      if (therapyRes) return therapyRes;

      return NextResponse.json(
        {
          error: {
            code: 'AUTH_SESSION_EXPIRED',
            message: 'Your session has been logged out or expired.'
          }
        },
        { status: 401 }
      );
    }

    // 4. Fetch active user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, phone_number, name, is_active, created_at, sustained_distress_flag, crisis_flag_active, personality_summary_text')
      .eq('id', payload.uid)
      .eq('is_active', true)
      .maybeSingle();

    if (userError) {
      console.error('[me/route.ts] Supabase query error fetching user:', userError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to retrieve user record.'
          }
        },
        { status: 500 }
      );
    }

    if (!user) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_USER_NOT_FOUND',
            message: 'User account not found or has been deactivated.'
          }
        },
        { status: 401 }
      );
    }

    // 5. Fetch user profile and onboarding flags
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', payload.uid)
      .maybeSingle();

    if (profileError) {
      console.error('[me/route.ts] Failed to query user profile:', profileError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to retrieve user profile.'
          }
        },
        { status: 500 }
      );
    }

    let profileRecord = profile;
    if (!profile) {
      // Dynamic backfill to prevent gaps for pre-existing users
      const { data: newProfile, error: backfillError } = await supabase
        .from('profiles')
        .insert({ id: user.id, phone_number: user.phone_number })
        .select()
        .maybeSingle();

      if (backfillError) {
        console.error('[me/route.ts] Failed to backfill user profile:', backfillError);
        return NextResponse.json(
          {
            error: {
              code: 'DATABASE_ERROR',
              message: 'Failed to initialize user profile.'
            }
          },
          { status: 500 }
        );
      }

      if (newProfile) {
        profileRecord = newProfile;
      } else {
        console.warn('[me/route.ts] Dynamic backfill returned empty profile.');
      }
    }

    // 6. Check if user is an active therapy client
    let isTherapyClient = false;
    try {
      const { data: therapyRel } = await supabase
        .from('therapy_care_relationships')
        .select('id, status, care_stage')
        .eq('user_id', payload.uid)
        .in('status', ['active', 'paused'])
        .limit(1)
        .maybeSingle();

      if (therapyRel?.id) {
        isTherapyClient = true;
      }
    } catch {
      // Non-blocking
    }

    // 7. Return user profile and onboarding state
    return NextResponse.json({
      success: true,
      user: {
        ...user,
        is_therapy_client: isTherapyClient,
      },
      profile: profileRecord
    });

  } catch (error) {
    console.error('[me/route.ts] Critical error in me endpoint:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected server error occurred.'
        }
      },
      { status: 500 }
    );
  }
}
