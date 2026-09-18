import { NextRequest, NextResponse } from 'next/server';
import { BillingService } from '../../../../lib/billing/billingService';
import { supabase } from '../../../../lib/db';

/**
 * POST /api/webhooks/razorpay
 * Authoritative webhook receiver for Razorpay payment and subscription events.
 *
 * Security:
 * - Verifies X-Razorpay-Signature with raw request body
 * - Idempotency via public.webhook_events
 * - Never logs PII, card numbers, or mental health data
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const eventId = request.headers.get('x-razorpay-event-id') || `evt_${Date.now()}`;

    if (!signature) {
      console.warn('[Razorpay Webhook] billing.webhook.signature_failed: Missing signature header.');
      return NextResponse.json(
        { error: { code: 'MISSING_SIGNATURE', message: 'Missing Razorpay signature header.' } },
        { status: 400 }
      );
    }

    // 1. Signature Verification
    const isValid = BillingService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('[Razorpay Webhook] billing.webhook.signature_failed: Signature verification failed.');
      return NextResponse.json(
        { error: { code: 'INVALID_SIGNATURE', message: 'Webhook signature verification failed.' } },
        { status: 400 }
      );
    }

    // 2. Parse payload safely
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch (err) {
      return NextResponse.json(
        { error: { code: 'MALFORMED_JSON', message: 'Invalid JSON payload.' } },
        { status: 400 }
      );
    }

    const eventType = payload.event;
    console.log(`[Razorpay Webhook] billing.webhook.received event=${eventType} id=${eventId}`);

    // 3. Idempotency Check via webhook_events table
    try {
      const { data: existingEvent } = await supabase
        .from('webhook_events')
        .select('id, processed')
        .eq('event_id', eventId)
        .maybeSingle();

      if (existingEvent && existingEvent.processed) {
        console.log(`[Razorpay Webhook] billing.webhook.duplicate: Event ${eventId} already processed.`);
        return NextResponse.json({ success: true, duplicate: true });
      }

      await supabase
        .from('webhook_events')
        .upsert({
          event_id: eventId,
          event_type: eventType,
          payload: {
            event: eventType,
            created_at: payload.created_at
          },
          processed: false
        }, { onConflict: 'event_id' });
    } catch (e: any) {
      console.warn('[Razorpay Webhook] Webhook events table notice:', e.message);
    }

    // 4. Process Events
    switch (eventType) {
      // Recurring Subscription Events
      case 'subscription.activated':
      case 'subscription.charged':
      case 'subscription.resumed': {
        const subEntity = payload.payload?.subscription?.entity;
        const paymentEntity = payload.payload?.payment?.entity;

        const gatewaySubscriptionId = subEntity?.id;
        const paymentId = paymentEntity?.id || `pay_sub_${Date.now()}`;
        const amount = paymentEntity?.amount || subEntity?.plan_amount || 49900; // 49900 paise (₹499.00 GST inclusive)
        const userId = subEntity?.notes?.user_id;

        if (gatewaySubscriptionId) {
          // Find local user if not in notes
          let targetUserId = userId;
          if (!targetUserId) {
            const { data: localSub } = await supabase
              .from('subscriptions')
              .select('user_id')
              .eq('gateway_subscription_id', gatewaySubscriptionId)
              .maybeSingle();
            targetUserId = localSub?.user_id;
          }

          if (targetUserId) {
            await BillingService.onPaymentConfirmed({
              userId: targetUserId,
              paymentId,
              subscriptionId: gatewaySubscriptionId,
              amount,
              paymentMethodType: paymentEntity?.method === 'card' ? 'card' : 'upi',
              maskedAccount: paymentEntity?.vpa || (paymentEntity?.card ? `•••• ${paymentEntity.card.last4}` : 'UPI Mandate'),
              cardNetwork: paymentEntity?.card?.network || null
            });
            console.log(`[Razorpay Webhook] billing.subscription.activated sub=${gatewaySubscriptionId}`);
          }
        }
        break;
      }

      case 'subscription.pending': {
        // Out-of-order protection: Do not downgrade an already active subscription to pending
        const subEntity = payload.payload?.subscription?.entity;
        if (subEntity?.id) {
          const { data: currentSub } = await supabase
            .from('subscriptions')
            .select('status')
            .eq('gateway_subscription_id', subEntity.id)
            .maybeSingle();

          if (!currentSub || currentSub.status !== 'active') {
            await supabase
              .from('subscriptions')
              .update({
                status: 'pending',
                updated_at: new Date().toISOString()
              })
              .eq('gateway_subscription_id', subEntity.id);
            console.log(`[Razorpay Webhook] billing.subscription.pending sub=${subEntity.id}`);
          } else {
            console.log(`[Razorpay Webhook] Ignored stale pending event for already active subscription ${subEntity.id}`);
          }
        }
        break;
      }

      case 'subscription.halted':
      case 'subscription.paused': {
        const subEntity = payload.payload?.subscription?.entity;
        if (subEntity?.id) {
          await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString()
            })
            .eq('gateway_subscription_id', subEntity.id);
          console.log(`[Razorpay Webhook] billing.subscription.payment_failed sub=${subEntity.id}`);
        }
        break;
      }

      case 'subscription.cancelled': {
        const subEntity = payload.payload?.subscription?.entity;
        if (subEntity?.id) {
          const currentPeriodEnd = subEntity.current_end ? new Date(subEntity.current_end * 1000).toISOString() : undefined;
          await supabase
            .from('subscriptions')
            .update({
              status: 'cancelled',
              cancel_at_period_end: true,
              current_period_end: currentPeriodEnd,
              cancelled_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('gateway_subscription_id', subEntity.id);
          console.log(`[Razorpay Webhook] billing.subscription.cancelled sub=${subEntity.id}`);
        }
        break;
      }

      // One-time Payment & Order Events
      case 'payment.captured':
      case 'order.paid': {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderEntity = payload.payload?.order?.entity;

        const paymentId = paymentEntity?.id;
        const orderId = paymentEntity?.order_id || orderEntity?.id;
        const amount = paymentEntity?.amount || orderEntity?.amount;
        const userId = paymentEntity?.notes?.user_id || orderEntity?.notes?.user_id;

        if (paymentId && orderId) {
          let targetUserId = userId;
          if (!targetUserId) {
            const { data: localOrder } = await supabase
              .from('orders')
              .select('user_id')
              .eq('gateway_order_id', orderId)
              .maybeSingle();
            targetUserId = localOrder?.user_id;
          }

          if (targetUserId) {
            await BillingService.onPaymentConfirmed({
              userId: targetUserId,
              paymentId,
              orderId,
              amount: amount || 0,
              paymentMethodType: paymentEntity?.method === 'card' ? 'card' : 'upi',
              maskedAccount: paymentEntity?.vpa || (paymentEntity?.card ? `•••• ${paymentEntity.card.last4}` : undefined),
              cardNetwork: paymentEntity?.card?.network || null
            });
            console.log(`[Razorpay Webhook] billing.order.paid order=${orderId}`);
          }
        }
        break;
      }

      case 'payment.failed': {
        const paymentEntity = payload.payload?.payment?.entity;
        const orderId = paymentEntity?.order_id;
        if (orderId) {
          await supabase
            .from('orders')
            .update({
              status: 'failed',
              updated_at: new Date().toISOString()
            })
            .eq('gateway_order_id', orderId);
          console.log(`[Razorpay Webhook] billing.order.failed order=${orderId}`);
        }
        break;
      }

      case 'refund.processed': {
        const refundEntity = payload.payload?.refund?.entity;
        if (refundEntity?.id) {
          await supabase
            .from('refunds')
            .update({
              status: 'processed',
              updated_at: new Date().toISOString()
            })
            .eq('gateway_refund_id', refundEntity.id);
          console.log(`[Razorpay Webhook] billing.refund.created refund=${refundEntity.id}`);
        }
        break;
      }

      default:
        console.log(`[Razorpay Webhook] Unhandled event type: ${eventType}`);
        break;
    }

    // 5. Mark webhook event as processed
    try {
      await supabase
        .from('webhook_events')
        .update({
          processed: true,
          processed_at: new Date().toISOString()
        })
        .eq('event_id', eventId);
    } catch (e) {}

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('[Razorpay Webhook] Unexpected error:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: 'Webhook processing encountered an error.' } },
      { status: 500 }
    );
  }
}
