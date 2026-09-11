import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../lib/db';
import { requireAuthenticatedUser, requireUserProfile } from '../../../lib/auth-helper';
import { AuthService } from '../../../services/authService';

/**
 * GET /api/profile
 * Returns the authenticated user's profile and account state.
 */
export async function GET(request: NextRequest) {
  try {
    const userProfile = await requireUserProfile(request);
    return NextResponse.json({
      success: true,
      user: userProfile.user,
      profile: userProfile.profile
    });
  } catch (err: any) {
    const status = err.status || (err.code === 'AUTH_REQUIRED' ? 401 : 500);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'INTERNAL_ERROR',
          message: err.message || 'An unexpected error occurred.'
        }
      },
      { status }
    );
  }
}

/**
 * PATCH /api/profile
 * Updates editable fields on the user's profile.
 * 
 * STRICT ALLOWLIST:
 * - Only 'name' is permitted to be updated by the client.
 * - Any client attempts to modify 'id', 'phone', 'phone_number', 'account_status',
 *   'onboarding_status', 'role', 'permissions', 'created_at', or 'updated_at' are strictly rejected.
 */
export async function PATCH(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const body = await request.json().catch(() => ({}));

    // Explicit rejection of forbidden fields
    const FORBIDDEN_FIELDS = [
      'id',
      'phone',
      'phone_number',
      'account_status',
      'onboarding_status',
      'role',
      'permissions',
      'is_active',
      'created_at',
      'updated_at'
    ];

    for (const field of FORBIDDEN_FIELDS) {
      if (field in body) {
        return NextResponse.json(
          {
            error: {
              code: 'FORBIDDEN_FIELD',
              message: `Field '${field}' cannot be modified directly.`
            }
          },
          { status: 400 }
        );
      }
    }

    if (!('name' in body)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'No editable fields provided.'
          }
        },
        { status: 400 }
      );
    }

    const cleanName = AuthService.sanitizeName(body.name);
    if (!cleanName || cleanName.length < 1) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_NAME',
            message: 'A name is required.'
          }
        },
        { status: 400 }
      );
    }

    const nowStr = new Date().toISOString();

    // 1. Update public.users
    await supabase
      .from('users')
      .update({ name: cleanName, updated_at: nowStr })
      .eq('id', authUser.userId);

    // 2. Update public.profiles
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update({ full_name: cleanName, updated_at: nowStr })
      .eq('id', authUser.userId)
      .select()
      .single();

    if (profileError) {
      console.error('[PATCH /api/profile] DB update error:', profileError);
      return NextResponse.json(
        {
          error: {
            code: 'DATABASE_ERROR',
            message: 'Failed to update user profile.'
          }
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      profile: updatedProfile
    });

  } catch (err: any) {
    const status = err.status || (err.code === 'AUTH_REQUIRED' ? 401 : 500);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'INTERNAL_ERROR',
          message: err.message || 'An unexpected error occurred.'
        }
      },
      { status }
    );
  }
}
