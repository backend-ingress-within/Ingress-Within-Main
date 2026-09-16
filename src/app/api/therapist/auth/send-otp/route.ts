import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '../../../../../lib/rate-limit';
import { getOtpProvider } from '../../../../../providers/otpProvider';
import { getClientIp } from '../../../../../utils/ip';
import { validateIndianPhone } from '../../../../../lib/auth/phone';
import { checkPhoneLockout } from '../../../../../lib/auth/lockout';
import { TherapistAuthService } from '../../../../../lib/therapist/therapistAuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone_number, mode, full_name } = body;

    // 1. Validate Indian phone number (+91 with 10 digits)
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

    // 2. Lockout check (10 min lockout after 3 incorrect attempts)
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

    // 3. Mode-specific account checks
    const existingTherapist = await TherapistAuthService.findTherapistByPhone(canonicalPhone);

    if (mode === 'login') {
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
              message: 'This therapist account is deactivated. Please contact support.'
            }
          },
          { status: 403 }
        );
      }
    } else if (mode === 'signup') {
      if (existingTherapist) {
        return NextResponse.json(
          {
            error: {
              code: 'THERAPIST_ALREADY_EXISTS',
              message: 'A therapist account with this phone number already exists. Please log in.'
            }
          },
          { status: 409 }
        );
      }
      if (full_name && typeof full_name === 'string') {
        const cleanName = TherapistAuthService.sanitizeName(full_name);
        if (cleanName.length < 2) {
          return NextResponse.json(
            {
              error: {
                code: 'INVALID_NAME',
                message: 'Please provide a valid full name.'
              }
            },
            { status: 400 }
          );
        }
      }
    }

    // 4. Rate limiting
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

    // 5. Send OTP via OTP Provider
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

    return NextResponse.json({
      success: true,
      message: 'Code sent successfully.',
      resend_in_seconds: result.resendInSeconds || 30
    });
  } catch (error) {
    console.error('Therapist Send OTP Route Error:', error);
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
