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

    // 5. Check if user already has an active account or create one
    let existingUser = await AuthService.findUserByPhone(canonicalPhone);
    let isNewUser = false;

    if (!existingUser) {
      isNewUser = true;
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          phone_number: canonicalPhone,
          account_status: 'active',
          is_active: true
        })
        .select()
        .single();

      if (createError && (createError.code === '23505' || createError.message?.includes('duplicate'))) {
        existingUser = await AuthService.findUserByPhone(canonicalPhone);
      } else {
        existingUser = newUser;
      }

      if (!existingUser) {
        throw new Error('Failed to initialize user account.');
      }
    }

    // Ensure profile exists with onboarding flags initialized
    let { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', existingUser.id)
      .maybeSingle();

    if (!profile) {
      const { data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: existingUser.id,
          phone_number: canonicalPhone,
          account_status: 'active',
          onboarding_status: 'completed',
          consent_completed: true,
          profile_completed: false,
          orientation_completed: false,
          assessment_completed: false,
          onboarding_completed: true,
          notifications_completed: false
        })
        .select()
        .single();
      profile = newProfile;
    }

    // Automatically create Cycle 1 for the user if it doesn't already exist
    const { data: existingCycle } = await supabase
      .from('cycles')
      .select('id')
      .eq('user_id', existingUser.id)
      .limit(1)
      .maybeSingle();

    if (!existingCycle) {
      const todayStr = new Date().toISOString().split('T')[0];
      await supabase
        .from('cycles')
        .insert({
          user_id: existingUser.id,
          cycle_number: 1,
          status: 'ACTIVE',
          start_date: todayStr,
          total_days: 30,
          current_day: 1,
          days_completed: 0,
          entries_count: 0,
          assessment_completed: false,
          assessment_available: false
        });
    }

    const sessionResult = await AuthService.establishSession(
      existingUser,
      profile,
      device_id,
      device_name || 'Browser',
      ipAddress,
      userAgent,
      isNewUser
    );

    const response = NextResponse.json({
      success: true,
      is_new_user: isNewUser,
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
