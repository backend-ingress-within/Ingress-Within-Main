import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { checkRateLimit } from '../../../../../../lib/rate-limit';
import { getOtpProvider } from '../../../../../../providers/otpProvider';
import { getClientIp } from '../../../../../../utils/ip';

/**
 * POST /api/therapy/client/relationship/send-otp
 *
 * Sends a 6-digit verification code to the client's verified phone number
 * before permitting relationship conclusion (quit) or clinician reassignment (change).
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate client session
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const { phoneNumber } = authUser;
    if (!phoneNumber) {
      return NextResponse.json(
        { error: { code: 'PHONE_REQUIRED', message: 'Phone number is required on your profile to verify action.' } },
        { status: 400 }
      );
    }

    // 2. Check rate limit
    const ip = getClientIp(request);
    const limit = await checkRateLimit(phoneNumber, ip);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many OTP attempts. Please wait before requesting another code.' } },
        { status: 429 }
      );
    }

    // 3. Dispatch OTP via production provider
    const provider = getOtpProvider();
    const result = await provider.sendOtp(phoneNumber, limit.count + 1);

    if (!result.success) {
      return NextResponse.json(
        { error: { code: result.code || 'OTP_SEND_FAILED', message: result.message || 'Failed to send OTP.' } },
        { status: 500 }
      );
    }

    // Mask phone number for security in response (e.g. +91 98*** **321)
    const maskedPhone = phoneNumber.replace(/(\+\d{2})(\d{2})\d+(\d{3})$/, '$1 $2*** ***$3');

    return NextResponse.json({
      success: true,
      message: result.message,
      maskedPhone,
      resendInSeconds: result.resendInSeconds || 30,
    });
  } catch (err: any) {
    console.error('[Relationship Send OTP] Error:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to send verification code.' } },
      { status: 500 }
    );
  }
}
