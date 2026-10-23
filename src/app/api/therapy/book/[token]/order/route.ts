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
      fullName,
      email,
      phoneNumber,
      slotStart,
      slotEnd,
      sessionType,
      modality,
      clientNotes,
      idempotencyKey: bodyIdempotencyKey,
    } = body;

    // Header idempotency key takes precedence if supplied
    const headerIdempotencyKey =
      request.headers.get('idempotency-key') ||
      request.headers.get('x-idempotency-key') ||
      null;

    const idempotencyKey = headerIdempotencyKey || bodyIdempotencyKey || null;

    // Input validations
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2 || fullName.trim().length > 100) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Please provide a valid full name (2–100 characters).',
          },
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim()) || email.trim().length > 150) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Please provide a valid email address.',
          },
        },
        { status: 400 }
      );
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phoneNumber || typeof phoneNumber !== 'string' || !phoneRegex.test(phoneNumber.trim())) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Please provide a valid phone number (at least 7 digits).',
          },
        },
        { status: 400 }
      );
    }

    if (!slotStart || !slotEnd) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Please select a valid time slot.',
          },
        },
        { status: 400 }
      );
    }

    const startMs = Date.parse(slotStart);
    const endMs = Date.parse(slotEnd);
    if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_INPUT',
            message: 'Invalid slot time range.',
          },
        },
        { status: 400 }
      );
    }

    if (startMs < Date.now()) {
      return NextResponse.json(
        {
          error: {
            code: 'SLOT_IN_PAST',
            message: 'The selected time slot has already passed. Please choose an upcoming slot.',
          },
        },
        { status: 400 }
      );
    }

    // Call authoritative service to create hold and Razorpay order
    const result = await SessionBookingService.createGuestBookingOrder({
      token: token.trim(),
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phoneNumber: phoneNumber.trim(),
      slotStart,
      slotEnd,
      sessionType: sessionType || 'video',
      modality: modality || 'telehealth',
      clientNotes: typeof clientNotes === 'string' ? clientNotes.trim() : null,
      idempotencyKey,
    });

    return NextResponse.json(
      {
        success: true,
        order: result,
      },
      { status: 201 }
    );
  } catch (err: any) {
    const status = err.status || 500;
    const code = err.code || 'INTERNAL_ERROR';

    // Safely format generic response for link errors
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

    if (code === 'CONSENT_REQUIRED') {
      return NextResponse.json(
        {
          error: {
            code: 'CONSENT_REQUIRED',
            message: 'Therapy consent must be verified before sessions can be scheduled.',
          },
        },
        { status: 422 }
      );
    }

    if (code === 'SLOT_ON_HOLD') {
      return NextResponse.json(
        {
          error: {
            code: 'SLOT_ON_HOLD',
            message: 'This time slot is temporarily held for another checkout. Please choose another time or try again in 15 minutes.',
          },
        },
        { status: 409 }
      );
    }

    if (code === 'SLOT_UNAVAILABLE') {
      return NextResponse.json(
        {
          error: {
            code: 'SLOT_UNAVAILABLE',
            message: 'This time slot is no longer available. Please select another slot.',
          },
        },
        { status: 409 }
      );
    }

    if (code === 'PAYMENT_GATEWAY_ERROR') {
      return NextResponse.json(
        {
          error: {
            code: 'PAYMENT_GATEWAY_ERROR',
            message: 'Unable to initiate checkout with payment provider. Please try again.',
          },
        },
        { status: 502 }
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

    console.error('[GuestBookingOrderAPI] Unexpected error creating guest order:', err);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred while reserving your slot. Please try again.',
        },
      },
      { status }
    );
  }
}
