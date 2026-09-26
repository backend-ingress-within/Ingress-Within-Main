import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { getAuthenticatedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { GoogleAuthService } from '../../../../../lib/calendar/googleAuthService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect(new URL('/?error=missing_oauth_params', request.url));
    }

    // Determine current caller session to enforce account binding
    const therapistAuth = await getAuthenticatedTherapist(request);
    const userAuth = await getAuthenticatedUser(request);

    let callerSession: { accountType: 'user' | 'therapist'; accountId: string } | undefined;
    if (therapistAuth) {
      callerSession = { accountType: 'therapist', accountId: therapistAuth.therapistId };
    } else if (userAuth) {
      callerSession = { accountType: 'user', accountId: userAuth.userId };
    } else {
      console.warn('[GoogleCallback] Unauthenticated callback attempt');
      return NextResponse.redirect(new URL('/?error=auth_required_for_calendar', request.url));
    }

    const result = await GoogleAuthService.handleOAuthCallback(code, state, callerSession);

    // Redirect to returned destination with success query param
    const destination = new URL(result.returnTo || '/', request.url);
    destination.searchParams.set('google_calendar_connected', 'true');

    return NextResponse.redirect(destination);
  } catch (err: any) {
    const errorCode = err.code || 'calendar_connection_failed';
    console.error(`[GoogleCallback] Error during OAuth callback: ${errorCode}`);
    return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(errorCode)}`, request.url));
  }
}
