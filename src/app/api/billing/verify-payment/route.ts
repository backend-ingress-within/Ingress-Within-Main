import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../lib/auth-helper';
import { BillingService } from '../../../../lib/billing/billingService';

/**
 * POST /api/billing/verify-payment
 * Verifies Razorpay checkout signature for orders and subscriptions.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const body = await request.json();

    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_subscription_id,
      razorpay_signature
    } = body;

    if (!razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Payment ID and signature are required.' } },
        { status: 400 }
      );
    }

    let isValid = false;

    if (razorpay_subscription_id) {
      isValid = BillingService.verifySubscriptionSignature(
        razorpay_subscription_id,
        razorpay_payment_id,
        razorpay_signature
      );
    } else if (razorpay_order_id) {
      isValid = BillingService.verifyPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
    } else {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Either order ID or subscription ID is required.' } },
        { status: 400 }
      );
    }

    if (!isValid) {
      console.warn(`[Billing API] billing.payment.verification_failed user=${authUser.userId} payment=${razorpay_payment_id}`);
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SIGNATURE',
            message: 'Payment verification failed. Signature mismatch.'
          }
        },
        { status: 400 }
      );
    }

    // Process confirmation
    const product = await BillingService.getProductBySku('SELF_HELP_MONTHLY');
    const pricing = BillingService.calculatePricing(product.price_inr, product.gst_rate);

    await BillingService.onPaymentConfirmed({
      userId: authUser.userId,
      paymentId: razorpay_payment_id,
      subscriptionId: razorpay_subscription_id,
      orderId: razorpay_order_id,
      amount: pricing.totalPaise,
      paymentMethodType: 'upi'
    });

    return NextResponse.json({
      success: true,
      status: 'verified',
      payment_id: razorpay_payment_id
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'PAYMENT_VERIFICATION_ERROR',
          message: err.message || 'Error occurred during payment verification.'
        }
      },
      { status }
    );
  }
}
