import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../../lib/rate-limit';
import { getOtpProvider } from '../../../../providers/otpProvider';
import { getClientIp } from '../../../../utils/ip';
import { validateIndianPhone } from '../../../../lib/auth/phone';
import { checkPhoneLockout } from '../../../../lib/auth/lockout';

export async function POST(request: NextRequest) {
  try {
    // 1. Parse payload
    const body = await request.json().catch(() => ({}));
    const { phone_number } = body;

    // 2. Validate phone formatting (India-only +91 and 10 digits)
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

    // 3. Server-side Lockout Check (10-minute wait after 3 wrong attempts)
    const lockout = await checkPhoneLockout(canonicalPhone);
    if (lockout.isLocked) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_LOCKOUT',
            message: 'Too many incorrect attempts. Try again in 10 minutes.',
            remaining_seconds: lockout.remainingSeconds
          }
        },
        { status: 429 }
      );
    }

    // 4. Rate Limit Check (IP-based and Phone-based)
    const ipAddress = getClientIp(request);
    const rateLimit = await checkRateLimit(canonicalPhone, ipAddress);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Please wait before requesting another code.'
          }
        },
        { status: 429 }
      );
    }

    // 5. Send OTP via configured provider (Zero account enumeration)
    const provider = getOtpProvider();
    const result = await provider.sendOtp(canonicalPhone, rateLimit.count + 1);

    if (!result.success) {
      const status = result.code === 'AUTH_LOCKOUT' ? 429 : 500;
      return NextResponse.json(
        {
          error: {
            code: result.code || 'NETWORK_ISSUE',
            message: result.message || "We couldn't send the code. Check your connection and try again."
          }
        },
        { status }
      );
    }

    // 6. Return success (Never expose OTP or account existence)
    return NextResponse.json({
      success: true,
      message: 'Code sent successfully.',
      resend_in_seconds: result.resendInSeconds || 30
    });

  } catch (error) {
    console.error('Send OTP Route Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'NETWORK_ISSUE',
          message: "We couldn't send the code. Check your connection and try again."
        }
      },
      { status: 500 }
    );
  }
}
