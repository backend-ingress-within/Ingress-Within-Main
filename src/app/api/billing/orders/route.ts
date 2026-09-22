import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../lib/auth-helper';
import { BillingService } from '../../../../lib/billing/billingService';

/**
 * POST /api/billing/orders
 * Creates a one-time Razorpay order for psychoeducation modules or touch packs.
 * Pricing is strictly loaded server-side.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const body = await request.json();

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

    const { product_id, idempotency_key } = body;
    if (!product_id) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Product ID is required.' } },
        { status: 400 }
      );
    }

    const result = await BillingService.createOneTimeOrder(authUser.userId, product_id, idempotency_key);

    console.log(`[Billing API] billing.order.created user=${authUser.userId} order=${result.order_id}`);

    return NextResponse.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'ORDER_CREATION_FAILED',
          message: err.message || 'Failed to create order.'
        }
      },
      { status }
    );
  }
}
