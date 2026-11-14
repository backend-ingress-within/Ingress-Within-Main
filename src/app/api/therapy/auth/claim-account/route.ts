import { NextRequest, NextResponse } from 'next/server';
import {
  TherapyClientAuthService,
  THERAPY_CLIENT_COOKIE_NAME,
  THERAPY_CLIENT_SESSION_EXPIRY_SECONDS,
} from '../../../../../lib/therapy/therapyClientAuthService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing setup token.' }, { status: 400 });
    }

    const resolution = await TherapyClientAuthService.resolveClaimToken(token);
    if (!resolution.valid) {
      return NextResponse.json(
        {
          error: resolution.error,
          alreadyClaimed: resolution.alreadyClaimed,
          expired: resolution.expired,
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      client: resolution.client,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 });
    }

    const result = await TherapyClientAuthService.claimAccountAndSetPassword(token, password);
    if (!result.success || !result.token) {
      return NextResponse.json({ error: result.error || 'Failed to claim account.' }, { status: 400 });
    }

    const response = NextResponse.json({
      success: true,
      client: result.client,
      message: 'Account setup successfully! You are now logged in.',
    });

    response.cookies.set({
      name: THERAPY_CLIENT_COOKIE_NAME,
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: THERAPY_CLIENT_SESSION_EXPIRY_SECONDS,
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
