import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { TherapistAuthService } from '../../../../../lib/therapist/therapistAuthService';
import { COOKIE_THERAPIST_ACCESS_NAME, COOKIE_THERAPIST_REFRESH_NAME, getCookieOptions } from '../../../../../utils/cookies';

export async function POST(request: NextRequest) {
  try {
    const authTherapist = await getAuthenticatedTherapist(request);

    if (authTherapist) {
      await TherapistAuthService.deactivateSession(authTherapist.therapistId, authTherapist.deviceId);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully.'
    });

    // Clear therapist session cookies
    response.cookies.set(COOKIE_THERAPIST_ACCESS_NAME, '', getCookieOptions(0));
    response.cookies.set(COOKIE_THERAPIST_REFRESH_NAME, '', getCookieOptions(0));

    return response;
  } catch (error) {
    console.error('Therapist Logout Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'LOGOUT_FAILED',
          message: 'Failed to process logout cleanly.'
        }
      },
      { status: 500 }
    );
  }
}
