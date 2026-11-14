import { NextRequest, NextResponse } from 'next/server';
import { THERAPY_CLIENT_COOKIE_NAME } from '../../../../../lib/therapy/therapyClientAuthService';

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.cookies.set({
    name: THERAPY_CLIENT_COOKIE_NAME,
    value: '',
    httpOnly: true,
    path: '/',
    maxAge: 0,
  });
  return response;
}
