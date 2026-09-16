import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../../lib/auth-helper';
import { supabase } from '../../../../../lib/db';

/**
 * GET /api/billing/order-status/[id]
 * Allows frontend to poll for order payment status.
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
        { error: { code: 'BAD_REQUEST', message: 'Order ID is required.' } },
        { status: 400 }
      );
    }

    const { data: order, error } = await supabase
      .from('orders')
      .select('id, gateway_order_id, status, amount_total, currency, created_at')
      .or(`id.eq.${id},gateway_order_id.eq.${id}`)
      .eq('user_id', authUser.userId)
      .maybeSingle();

    if (error || !order) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Order not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        gateway_order_id: order.gateway_order_id,
        status: order.status,
        is_paid: order.status === 'paid',
        amount_total: order.amount_total,
        currency: order.currency
      }
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'STATUS_FETCH_ERROR',
          message: err.message || 'Failed to check order status.'
        }
      },
      { status }
    );
  }
}
