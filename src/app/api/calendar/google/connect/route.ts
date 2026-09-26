import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { getAuthenticatedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { GoogleAuthService } from '../../../../../lib/calendar/googleAuthService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const asTherapist = searchParams.get('type') === 'therapist';
    const returnTo = searchParams.get('returnTo') || (asTherapist ? '/therapist/calendar' : '/client/appointments');

    let accountType: 'user' | 'therapist' = 'user';
    let userId: string | undefined;
    let therapistAccountId: string | undefined;

    if (asTherapist) {
      const therapistAuth = await getAuthenticatedTherapist(request);
      if (!therapistAuth) {
        return NextResponse.json({ error: { code: 'AUTH_REQUIRED', message: 'Therapist authentication required.' } }, { status: 401 });
      }
      accountType = 'therapist';
      therapistAccountId = therapistAuth.therapistId;
    } else {
      const userAuth = await getAuthenticatedUser(request);
      if (!userAuth) {
        return NextResponse.json({ error: { code: 'AUTH_REQUIRED', message: 'User authentication required.' } }, { status: 401 });
      }
      accountType = 'user';
      userId = userAuth.userId;
    }

    const authUrl = GoogleAuthService.getAuthUrl({
      accountType,
      userId,
      therapistAccountId,
      returnTo,
    });

    return NextResponse.json({ url: authUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: 'OAUTH_INITIATE_FAILED', message: err.message || 'Failed to start Google OAuth flow' } },
      { status: 500 }
    );
  }
}
