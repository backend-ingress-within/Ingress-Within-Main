import { NextRequest, NextResponse } from 'next/server';
import {
  TherapyClientAuthService,
  THERAPY_CLIENT_COOKIE_NAME,
  THERAPY_CLIENT_SESSION_EXPIRY_SECONDS,
} from '../../../../../lib/therapy/therapyClientAuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json({ error: 'Phone number and verification code are required.' }, { status: 400 });
    }

    const result = await TherapyClientAuthService.verifyOtpAndLogin(phone, code);
    if (!result.success || !result.token) {
      return NextResponse.json({ error: result.error || 'Verification failed.' }, { status: 401 });
    }

    const response = NextResponse.json({
      success: true,
      client: result.client,
      message: 'Logged in successfully via OTP.',
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
