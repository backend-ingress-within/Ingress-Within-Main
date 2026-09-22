import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../../lib/auth-helper';
import { BillingService } from '../../../../../lib/billing/billingService';

/**
 * POST /api/billing/subscriptions/cancel
 * Cancels a user's subscription (at period end by default).
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const body = await request.json();

    const { subscription_id, cancel_immediately } = body;
    if (!subscription_id) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Subscription ID is required.' } },
        { status: 400 }
      );
    }

    const result = await BillingService.cancelSubscription(
      authUser.userId,
      subscription_id,
      !cancel_immediately
    );

    console.log(`[Billing API] billing.subscription.cancelled user=${authUser.userId} sub=${subscription_id}`);

    return NextResponse.json(result);
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'CANCELLATION_FAILED',
          message: err.message || 'Failed to cancel subscription.'
        }
      },
      { status }
    );
  }
}
