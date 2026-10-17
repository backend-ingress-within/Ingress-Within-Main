import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { SessionBookingService } from '../../../../../lib/therapy/sessionBookingService';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required to book a session.' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { therapistAccountId, slotStart, slotEnd, sessionType, modality, clientNotes } = body;

    if (!therapistAccountId || !slotStart || !slotEnd) {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMETERS', message: 'therapistAccountId, slotStart, and slotEnd are required.' } },
        { status: 400 }
      );
    }

    const order = await SessionBookingService.createBookingOrder({
      userId: authUser.userId,
      therapistAccountId,
      slotStart,
      slotEnd,
      sessionType,
      modality,
      clientNotes,
      isFirstSessionCoordination: false,
    });

    const isBypass =
      process.env.DISABLE_BOOKING_PAYMENTS === 'true' ||
      process.env.NEXT_PUBLIC_DISABLE_BOOKING_PAYMENTS === 'true';

    if (isBypass) {
      const confirmation = await SessionBookingService.confirmSessionPayment({
        bookingId: order.bookingId,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: `pay_test_bypass_${Date.now()}`,
      });

      return NextResponse.json(
        {
          ...order,
          bypassPayment: true,
          confirmed: true,
          appointment: confirmation.appointment,
          booking: confirmation.booking,
        },
        { status: 201 }
      );
    }

    return NextResponse.json(order, { status: 201 });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'BOOKING_CREATION_FAILED',
          message: err.message || 'Unable to create booking order.',
        },
      },
      { status }
    );
  }
}
