import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { supabase } from '../../../../../lib/db';
import { BillingService } from '../../../../../lib/billing/billingService';

/**
 * GET /api/therapy/client/billing
 * Retrieves client-scoped billing records:
 * - Session bookings & payment verification (Razorpay orders, payment IDs, amounts, refunds)
 * - Invoices and platform subscription entitlements
 * 
 * Security Boundary:
 * - Strictly scoped to authUser.userId
 * - Zero access to therapist payouts, platform commissions, or other clients' financial records.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    // 1. Fetch client session bookings
    const { data: bookings, error: bookingsError } = await supabase
      .from('therapy_session_bookings')
      .select(`
        id,
        booking_reference,
        slot_start,
        slot_end,
        session_type,
        booking_type,
        booking_status,
        amount_paise,
        currency,
        razorpay_order_id,
        razorpay_payment_id,
        payment_status,
        payment_method,
        refund_status,
        refund_amount_paise,
        created_at,
        therapist_account_id,
        therapist_accounts (
          id,
          therapist_profiles (full_name, title)
        )
      `)
      .eq('user_id', authUser.userId)
      .order('created_at', { ascending: false });

    if (bookingsError) {
      console.warn('[Client Billing GET] bookings lookup warning:', bookingsError);
    }

    const formattedBookings = (bookings || []).map((b: any) => {
      const acc = b.therapist_accounts as any;
      const prof = Array.isArray(acc?.therapist_profiles)
        ? acc.therapist_profiles[0]
        : acc?.therapist_profiles;

      return {
        id: b.id,
        bookingReference: b.booking_reference,
        slotStart: b.slot_start,
        slotEnd: b.slot_end,
        sessionType: b.session_type || 'video',
        bookingType: b.booking_type,
        bookingStatus: b.booking_status,
        amountPaise: b.amount_paise,
        amountRupees: Math.round(b.amount_paise / 100),
        currency: b.currency || 'INR',
        razorpayOrderId: b.razorpay_order_id,
        razorpayPaymentId: b.razorpay_payment_id,
        paymentStatus: b.payment_status,
        paymentMethod: b.payment_method || 'Online (Razorpay)',
        refundStatus: b.refund_status || 'none',
        refundAmountRupees: b.refund_amount_paise ? Math.round(b.refund_amount_paise / 100) : 0,
        createdAt: b.created_at,
        therapistName: prof?.full_name || 'Assigned Therapist',
        therapistTitle: prof?.title || 'Consultant Psychologist',
      };
    });

    // 2. Fetch general platform billing overview
    let generalBilling: any = null;
    try {
      generalBilling = await BillingService.getBillingOverview(authUser.userId);
    } catch (gErr) {
      console.warn('[Client Billing GET] general billing warning:', gErr);
    }

    const totalPaid = formattedBookings
      .filter((b: any) => b.paymentStatus === 'paid' || b.paymentStatus === 'captured')
      .reduce((sum: number, b: any) => sum + b.amountRupees, 0);

    const outstanding = formattedBookings
      .filter((b: any) => b.paymentStatus === 'pending')
      .reduce((sum: number, b: any) => sum + b.amountRupees, 0);

    return NextResponse.json({
      success: true,
      sessionBookings: formattedBookings,
      transactions: formattedBookings,
      summary: {
        totalPaid,
        outstanding,
        currency: 'INR',
      },
      generalBilling: generalBilling || null,
    });
  } catch (err: any) {
    console.error('[Client Billing GET] Error:', err);
    return NextResponse.json(
      { error: { code: 'CLIENT_BILLING_ERROR', message: err.message || 'Failed to retrieve billing records' } },
      { status: 500 }
    );
  }
}
