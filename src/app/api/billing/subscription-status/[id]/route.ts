import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../../lib/auth-helper';
import { supabase } from '../../../../../lib/db';

/**
 * GET /api/billing/subscription-status/[id]
 * Allows frontend to poll for subscription activation after checkout completion.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Subscription ID is required.' } },
        { status: 400 }
      );
    }

    const { data: sub, error } = await supabase
      .from('subscriptions')
      .select('id, gateway_subscription_id, status, current_period_start, current_period_end, cancel_at_period_end')
      .or(`id.eq.${id},gateway_subscription_id.eq.${id}`)
      .eq('user_id', authUser.userId)
      .maybeSingle();

    if (error || !sub) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Subscription not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      subscription: {
        id: sub.id,
        gateway_subscription_id: sub.gateway_subscription_id,
        status: sub.status,
        is_active: sub.status === 'active',
        current_period_start: sub.current_period_start,
        current_period_end: sub.current_period_end,
        cancel_at_period_end: sub.cancel_at_period_end
      }
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'STATUS_FETCH_ERROR',
          message: err.message || 'Failed to check subscription status.'
        }
      },
      { status }
    );
  }
}
