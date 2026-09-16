import { NextRequest, NextResponse } from 'next/server';
import { RazorpayVerificationService } from '../../../../lib/auth/razorpayVerificationService';
import { COOKIE_ACCESS_NAME, getCookieOptions } from '../../../../utils/cookies';

/**
 * POST /api/auth/razorpay-verification
 * Temporary isolated verification route for Razorpay payment-flow compliance reviewers.
 *
 * Security:
 * - Gated behind RAZORPAY_VERIFICATION_ENABLED=true (defaults to 404).
 * - Constant-time password comparison.
 * - Logs into dedicated synthetic user with 0 real data.
 */
export async function POST(request: NextRequest) {
  if (!RazorpayVerificationService.isVerificationEnabled()) {
    return NextResponse.json(
      { error: { code: 'NOT_FOUND', message: 'Not found.' } },
      { status: 404 }
    );
  }

  try {
    const body = await request.json();
    const { username, password } = body;

    const isValid = RazorpayVerificationService.verifyCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { error: { code: 'INVALID_CREDENTIALS', message: 'Invalid verification credentials.' } },
        { status: 401 }
      );
    }

    const { token, reviewer } = await RazorpayVerificationService.establishReviewerSession();

    const response = NextResponse.json({
      success: true,
      message: 'Verification reviewer authenticated successfully.',
      redirect: '/settings',
      user: {
        id: reviewer.id,
        name: reviewer.name
      }
    });

    response.cookies.set(COOKIE_ACCESS_NAME, token, getCookieOptions(24 * 60 * 60));

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Verification login failed.' } },
      { status: 500 }
    );
  }
}
