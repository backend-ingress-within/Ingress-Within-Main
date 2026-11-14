import { NextRequest, NextResponse } from 'next/server';
import {
  TherapyClientAuthService,
  THERAPY_CLIENT_COOKIE_NAME,
} from '../../../../../lib/therapy/therapyClientAuthService';

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get(THERAPY_CLIENT_COOKIE_NAME)?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ authenticated: false, client: null }, { status: 401 });
    }

    const client = await TherapyClientAuthService.verifyClientToken(token);
    if (!client) {
      return NextResponse.json({ authenticated: false, client: null }, { status: 401 });
    }

    return NextResponse.json({ authenticated: true, client });
  } catch (err: any) {
    return NextResponse.json({ authenticated: false, error: err.message }, { status: 500 });
  }
}
