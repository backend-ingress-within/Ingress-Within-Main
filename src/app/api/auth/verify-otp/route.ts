import { NextRequest, NextResponse } from 'next/server';
import { getOtpProvider } from '../../../../providers/otpProvider';
import { AuthService } from '../../../../services/authService';
import { supabase } from '../../../../lib/db';
import { COOKIE_ACCESS_NAME, COOKIE_REFRESH_NAME, getCookieOptions } from '../../../../utils/cookies';
import { getClientIp } from '../../../../utils/ip';
import { validateIndianPhone } from '../../../../lib/auth/phone';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse payload
    const body = await request.json().catch(() => ({}));
    const { phone_number, otp_code, device_id, device_name } = body;

    // 2. Validate phone formatting
    const phoneValidation = validateIndianPhone(phone_number);
    if (!phoneValidation.isValid || !phoneValidation.canonicalPhone) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PHONE_NUMBER',
            message: "That doesn't look like a valid number."
          }
        },
        { status: 400 }
      );
    }

    const canonicalPhone = phoneValidation.canonicalPhone;

    // 3. Validate OTP format (exactly 6 numeric digits)
    if (!otp_code || !/^\d{6}$/.test(String(otp_code).trim())) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_OTP_MISMATCH',
            message: "That code didn't match. Try again."
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

    // 4. Verify OTP via configured provider
    const provider = getOtpProvider();
    const result = await provider.verifyOtp(canonicalPhone, String(otp_code).trim());

    if (!result.success) {
      const status = result.code === 'AUTH_LOCKOUT' ? 429 : 400;
      return NextResponse.json(
        {
          error: {
            code: result.code || 'AUTH_OTP_MISMATCH',
            message: result.message || "That code didn't match. Try again.",
            attempts_remaining: result.attemptsRemaining
          }
        },
        { status }
      );
    }

    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 5. Check if user already has an active account
    const existingUser = await AuthService.findUserByPhone(canonicalPhone);

    if (existingUser && existingUser.name) {
      // ----------------------------------------------------
      // BRANCH A: EXISTING USER -> Authenticate & Session
      // ----------------------------------------------------
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', existingUser.id)
        .maybeSingle();

      const sessionResult = await AuthService.establishSession(
        existingUser,
        profile,
        device_id,
        device_name || 'Browser',
        ipAddress,
        userAgent,
        false
      );

      const response = NextResponse.json({
        success: true,
        is_new_user: false,
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
    } else {
      // ----------------------------------------------------
      // BRANCH B: NEW USER -> Verified Signup Token
      // ----------------------------------------------------
      // Do NOT create incomplete user record until name is submitted
      const signupToken = AuthService.createSignupToken(canonicalPhone);

      return NextResponse.json({
        success: true,
        is_new_user: true,
        signup_token: signupToken,
        phone_number: canonicalPhone
      });
    }

  } catch (error) {
    console.error('Verify OTP Route Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'NETWORK_ISSUE',
          message: "We couldn't verify your code. Check your connection and try again."
        }
      },
      { status: 500 }
    );
  }
}
