import { NextRequest, NextResponse } from 'next/server';
import { requireTherapistProfile } from '../../../../../lib/therapist/therapistAuthHelper';

export async function GET(request: NextRequest) {
  try {
    const { account, profile } = await requireTherapistProfile(request);

    return NextResponse.json({
      success: true,
      therapist: {
        id: account.id,
        phone_number: account.phone_number,
        status: account.status,
        is_active: account.is_active,
        created_at: account.created_at,
        updated_at: account.updated_at
      },
      profile: {
        id: profile.id,
        phone_number: profile.phone_number,
        full_name: profile.full_name,
        created_at: profile.created_at,
        updated_at: profile.updated_at
      }
    });
  } catch (err: any) {
    const status = err.status || 401;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'THERAPIST_AUTH_REQUIRED',
          message: err.message || 'Therapist authentication required.'
        }
      },
      { status }
    );
  }
}
