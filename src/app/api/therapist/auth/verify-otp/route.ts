import { NextRequest, NextResponse } from 'next/server';
import { getOtpProvider } from '../../../../../providers/otpProvider';
import { TherapistAuthService } from '../../../../../lib/therapist/therapistAuthService';
import { supabase } from '../../../../../lib/db';
import { COOKIE_THERAPIST_ACCESS_NAME, COOKIE_THERAPIST_REFRESH_NAME, getCookieOptions } from '../../../../../utils/cookies';
import { getClientIp } from '../../../../../utils/ip';
import { validateIndianPhone } from '../../../../../lib/auth/phone';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone_number, otp_code, mode, full_name, device_id, device_name } = body;

    // 1. Validate phone number
    const phoneValidation = validateIndianPhone(phone_number);
    if (!phoneValidation.isValid || !phoneValidation.canonicalPhone) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_PHONE_NUMBER',
            message: "That doesn't look like a valid Indian phone number."
          }
        },
        { status: 400 }
      );
    }

    const canonicalPhone = phoneValidation.canonicalPhone;

    // 2. Validate OTP code format
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

    const deviceId = device_id || 'therapist_device_default';
    const deviceName = device_name || 'Browser';
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || 'Unknown';

    // 3. Verify OTP via Provider
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

    // 4. Branch by mode or account existence
    const existingTherapist = await TherapistAuthService.findTherapistByPhone(canonicalPhone);

    if (mode === 'signup' || (!existingTherapist && full_name)) {
      // ----------------------------------------------------
      // SIGNUP FLOW: Creates account with status 'pending'
      // ----------------------------------------------------
      const cleanName = TherapistAuthService.sanitizeName(full_name || '');
      if (!cleanName || cleanName.length < 2) {
        return NextResponse.json(
          {
            error: {
              code: 'INVALID_NAME',
              message: 'Please provide your full name to complete registration.'
            }
          },
          { status: 400 }
        );
      }

      const sessionResult = await TherapistAuthService.completeTherapistSignup({
        phoneNumber: canonicalPhone,
        fullName: cleanName,
        deviceId,
        deviceName,
        ipAddress,
        userAgent
      });

      const response = NextResponse.json({
        success: true,
        is_new_account: true,
        therapist: sessionResult.therapist,
        profile: sessionResult.profile,
        session: {
          access_token: sessionResult.accessToken,
          expires_in: sessionResult.expiresIn
        }
      });

      // Set therapist HTTP-only session cookies
      response.cookies.set(COOKIE_THERAPIST_ACCESS_NAME, sessionResult.accessToken, getCookieOptions(sessionResult.expiresIn));
      response.cookies.set(COOKIE_THERAPIST_REFRESH_NAME, sessionResult.refreshToken, getCookieOptions(sessionResult.expiresIn));

      return response;
    } else {
      // ----------------------------------------------------
      // LOGIN FLOW: Existing therapist authentication
      // ----------------------------------------------------
      if (!existingTherapist) {
        return NextResponse.json(
          {
            error: {
              code: 'THERAPIST_NOT_FOUND',
              message: 'No therapist account found with this phone number. Please create an account.'
            }
          },
          { status: 404 }
        );
      }

      if (existingTherapist.status === 'suspended' || existingTherapist.status === 'rejected') {
        return NextResponse.json(
          {
            error: {
              code: 'THERAPIST_DEACTIVATED',
              message: 'This therapist account is deactivated.'
            }
          },
          { status: 403 }
        );
      }

      const { data: profile } = await supabase
        .from('therapist_profiles')
        .select('*')
        .eq('therapist_account_id', existingTherapist.id)
        .maybeSingle();

      const sessionResult = await TherapistAuthService.establishTherapistSession(
        existingTherapist,
        profile,
        deviceId,
        deviceName,
        ipAddress,
        userAgent
      );

      const response = NextResponse.json({
        success: true,
        is_new_account: false,
        therapist: sessionResult.therapist,
        profile: sessionResult.profile,
        session: {
          access_token: sessionResult.accessToken,
          expires_in: sessionResult.expiresIn
        }
      });

      // Set therapist HTTP-only session cookies
      response.cookies.set(COOKIE_THERAPIST_ACCESS_NAME, sessionResult.accessToken, getCookieOptions(sessionResult.expiresIn));
      response.cookies.set(COOKIE_THERAPIST_REFRESH_NAME, sessionResult.refreshToken, getCookieOptions(sessionResult.expiresIn));

      return response;
    }
  } catch (error: any) {
    console.error('Therapist Verify OTP Route Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'VERIFICATION_ERROR',
          message: error?.message || "We couldn't verify your code. Check your connection and try again."
        }
      },
      { status: 500 }
    );
  }
}
