import { NextRequest, NextResponse } from 'next/server';
import { SessionBookingService } from '../../../../../../lib/therapy/sessionBookingService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;

    if (!token || typeof token !== 'string' || token.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'BOOKING_LINK_UNAVAILABLE',
            message: 'This booking link is invalid or no longer active.',
          },
        },
        { status: 404 }
      );
    }

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Invalid JSON request payload.',
          },
        },
        { status: 400 }
      );
    }

    const {
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      bookingId,
    } = body;

    if (!razorpayPaymentId || typeof razorpayPaymentId !== 'string' || razorpayPaymentId.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Razorpay payment ID is required.',
          },
        },
        { status: 400 }
      );
    }

    if (!razorpayOrderId || typeof razorpayOrderId !== 'string' || razorpayOrderId.trim().length === 0) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Razorpay order ID is required.',
          },
        },
        { status: 400 }
      );
    }

    const result = await SessionBookingService.verifyAndConfirmGuestPayment({
      token: token.trim(),
      razorpayPaymentId: razorpayPaymentId.trim(),
      razorpayOrderId: razorpayOrderId.trim(),
      razorpaySignature: typeof razorpaySignature === 'string' ? razorpaySignature.trim() : undefined,
      bookingId: typeof bookingId === 'string' ? bookingId.trim() : undefined,
    });

    if (result.requiresReconciliation) {
      return NextResponse.json(
        {
          success: false,
          requiresReconciliation: true,
          reconciliationReason: result.reconciliationReason,
          message: result.message,
          booking: result.booking,
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        alreadyConfirmed: result.alreadyConfirmed || false,
        appointment: result.appointment,
        booking: result.booking,
      },
      { status: 200 }
    );
  } catch (err: any) {
    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';

    if (code === 'BOOKING_LINK_UNAVAILABLE') {
      return NextResponse.json(
        {
          error: {
            code: 'BOOKING_LINK_UNAVAILABLE',
            message: 'This booking link is invalid, expired, or unavailable.',
          },
        },
        { status: 404 }
      );
    }

    if (code === 'BOOKING_NOT_FOUND') {
      return NextResponse.json(
        {
          error: {
            code: 'BOOKING_NOT_FOUND',
            message: 'No matching booking attempt found for this relationship and payment.',
          },
        },
        { status: 404 }
      );
    }

    if (code === 'CONSENT_REQUIRED') {
      return NextResponse.json(
        {
          error: {
            code: 'CONSENT_REQUIRED',
            message: 'Therapy consent must be verified before confirmation can complete.',
          },
        },
        { status: 422 }
      );
    }

    if (code === 'INVALID_SIGNATURE') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SIGNATURE',
            message: 'Cryptographic signature verification failed.',
          },
        },
        { status: 400 }
      );
    }

    if (
      code === 'ORDER_MISMATCH' ||
      code === 'AMOUNT_MISMATCH' ||
      code === 'CURRENCY_MISMATCH' ||
      code === 'PAYMENT_NOT_CAPTURED'
    ) {
      return NextResponse.json(
        {
          error: {
            code,
            message: err.message || 'Payment verification failed due to data inconsistency.',
          },
        },
        { status: 400 }
      );
    }

    if (code === 'INVALID_INPUT') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: err.message || 'Invalid input provided.',
          },
        },
        { status: 400 }
      );
    }

    console.error('[GuestBookingVerifyAPI] Unexpected error verifying guest payment:', err);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while confirming your session. Please retry or contact support.',
        },
      },
      { status }
    );
  }
}
