import { NextRequest, NextResponse } from 'next/server';
import { GoogleAuthService } from '../../../../../lib/calendar/googleAuthService';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    if (!code || !state) {
      return NextResponse.redirect(new URL('/?error=missing_oauth_params', request.url));
    }

    const result = await GoogleAuthService.handleOAuthCallback(code, state);

    // Redirect to returned destination with success query param
    const destination = new URL(result.returnTo || '/', request.url);
    destination.searchParams.set('google_calendar_connected', 'true');

    return NextResponse.redirect(destination);
  } catch (err: any) {
    console.error('[GoogleCallback] Error processing callback:', err);
    return NextResponse.redirect(new URL('/?error=calendar_connection_failed', request.url));
  }
}
