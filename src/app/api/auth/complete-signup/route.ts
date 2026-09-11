import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../../../../services/authService';
import { COOKIE_ACCESS_NAME, COOKIE_REFRESH_NAME, getCookieOptions } from '../../../../utils/cookies';
import { getClientIp } from '../../../../utils/ip';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { signup_token, name, device_id, device_name } = body;

    // 1. Verify signup token
    if (!signup_token) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SIGNUP_TOKEN',
            message: 'Your verification token is missing. Please start again.'
          }
        },
        { status: 401 }
      );
    }

    const tokenVerification = AuthService.verifySignupToken(signup_token);
    if (!tokenVerification || !tokenVerification.phone) {
      return NextResponse.json(
        {
          error: {
            code: 'EXPIRED_SIGNUP_TOKEN',
            message: 'Your verification has expired. Please enter your number again.'
          }
        },
        { status: 401 }
      );
    }

    // 2. Validate Name
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
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

    const cleanName = AuthService.sanitizeName(name);
    if (cleanName.length === 0) {
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

    if (!device_id) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_DEVICE',
            message: 'Device information is required.'
          }
        },
        { status: 400 }
      );
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 3. Atomically Complete Signup & Session Creation
    const sessionResult = await AuthService.completeNewUserSignup({
      phoneNumber: tokenVerification.phone,
      name: cleanName,
      deviceId: device_id,
      deviceName: device_name || 'Browser',
      ipAddress,
      userAgent
    });

    const response = NextResponse.json({
      success: true,
      user: sessionResult.user,
      profile: sessionResult.profile,
      session: {
        access_token: sessionResult.accessToken,
        expires_in: sessionResult.expiresIn
      }
    });

    // Set secure HTTP-only cookies
    response.cookies.set(COOKIE_ACCESS_NAME, sessionResult.accessToken, getCookieOptions(sessionResult.expiresIn));
    response.cookies.set(COOKIE_REFRESH_NAME, sessionResult.refreshToken, getCookieOptions(sessionResult.expiresIn));

    return response;

  } catch (error: any) {
    console.error('[Complete Signup Route Error]:', error);
    return NextResponse.json(
      {
        error: {
          code: 'NETWORK_ISSUE',
          message: "You're offline. We can't create your account right now. Try again when you're connected."
        }
      },
      { status: 500 }
    );
  }
}
