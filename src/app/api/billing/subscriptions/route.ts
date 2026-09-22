import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../lib/auth-helper';
import { BillingService } from '../../../../lib/billing/billingService';

/**
 * POST /api/billing/subscriptions
 * Creates a Razorpay recurring subscription for the authenticated user.
 * Pricing is strictly loaded server-side.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {}

    // Reject any client attempts to specify price, amount, or currency
    if (body.amount !== undefined || body.price !== undefined || body.currency !== undefined || body.gst !== undefined) {
      return NextResponse.json(
        {
          error: {
            code: 'FORBIDDEN_CLIENT_PRICING',
            message: 'Price, amount, and tax cannot be specified by the client.'
          }
        },
        { status: 400 }
      );
    }

    const sku = body.sku || 'SELF_HELP_MONTHLY';

    const result = await BillingService.createSubscription(authUser.userId, sku, authUser.phoneNumber);

    console.log(`[Billing API] billing.subscription.created user=${authUser.userId} sub=${result.subscription_id}`);

    return NextResponse.json({
      success: true,
      subscription_id: result.subscription_id,
      key_id: result.key_id,
      product: result.product
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'SUBSCRIPTION_CREATION_FAILED',
          message: err.message || 'Failed to initiate subscription checkout.'
        }
      },
      { status }
    );
  }
}
