import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { EmailService } from '../../../../lib/email/emailService';
import { getEmailConfig } from '../../../../lib/email/emailConfig';
import { supabase } from '../../../../lib/db';

function getWebhookSecret(): string {
  return getEmailConfig().webhookSecret || '';
}

/**
 * Validates incoming webhook authentication:
 * 1. Custom Secret Header (MSG91 standard: x-webhook-secret, x-msg91-secret, or Bearer auth)
 * 2. HMAC SHA-256 Signature (x-webhook-signature, legacy svix-signature or x-resend-signature)
 * 3. Query string token (?token= or ?secret=)
 */
function verifyWebhookAuth(
  request: NextRequest,
  payload: string,
  secret: string
): boolean {
  if (!secret) {
    // If no secret configured in test/dev, permit for testing
    return process.env.NODE_ENV !== 'production' || process.env.TEST_MODE === 'true';
  }

  // A. Check Direct Secret Headers (MSG91 Recommended)
  const headerSecret =
    request.headers.get('x-webhook-secret') ||
    request.headers.get('x-msg91-secret') ||
    request.headers.get('x-api-key');

  if (headerSecret && headerSecret.trim() === secret.trim()) {
    return true;
  }

  // B. Check Authorization Header (Bearer <secret>)
  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    if (token === secret.trim()) {
      return true;
    }
  }

  // C. Check Query String Secret
  const { searchParams } = new URL(request.url);
  const querySecret = searchParams.get('secret') || searchParams.get('token');
  if (querySecret && querySecret.trim() === secret.trim()) {
    return true;
  }

  // D. Check HMAC Signature (Svix, MSG91 HMAC or hex digest)
  const signature =
    request.headers.get('x-webhook-signature') ||
    request.headers.get('svix-signature') ||
    request.headers.get('x-resend-signature');

  if (signature) {
    const svixId = request.headers.get('svix-id') || request.headers.get('x-resend-event-id');
    const svixTimestamp = request.headers.get('svix-timestamp');

    try {
      // 1. Svix base64 format (whsec_ key)
      if (svixId && svixTimestamp) {
        const secretKey = secret.startsWith('whsec_')
          ? Buffer.from(secret.slice(6), 'base64')
          : Buffer.from(secret, 'utf-8');

        const toSign = `${svixId}.${svixTimestamp}.${payload}`;
        const expectedBase64 = crypto
          .createHmac('sha256', secretKey)
          .update(toSign)
          .digest('base64');

        const expectedSig = `v1,${expectedBase64}`;
        const candidateSignatures = signature.split(' ');

        for (const candidate of candidateSignatures) {
          if (candidate.length === expectedSig.length) {
            if (crypto.timingSafeEqual(Buffer.from(candidate), Buffer.from(expectedSig))) {
              return true;
            }
          }
        }
      }

      // 2. Standard Hex HMAC SHA-256
      const expectedHex = crypto
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');

      const cleanSig = signature.replace(/^v\d+=/, '').trim();
      if (cleanSig.length === expectedHex.length) {
        return crypto.timingSafeEqual(Buffer.from(cleanSig), Buffer.from(expectedHex));
      }
    } catch {
      return false;
    }
  }

  return false;
}

/**
 * POST /api/webhooks/email
 * Receives delivery status events from transactional email provider (MSG91 Email Delivery Reports).
 */
export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const secret = getWebhookSecret();

    // 1. Authenticate incoming request
    if (secret && !verifyWebhookAuth(request, rawBody, secret)) {
      console.warn('[Email Webhook] Authentication failed for incoming request.');
      return NextResponse.json(
        { error: { code: 'INVALID_AUTHENTICATION', message: 'Webhook authentication failed.' } },
        { status: 401 }
      );
    }

    // 2. Parse payload
    let parsedBody: any;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { error: { code: 'MALFORMED_JSON', message: 'Invalid JSON payload.' } },
        { status: 400 }
      );
    }

    // Normalizes single event or batch of events
    const events: any[] = Array.isArray(parsedBody) ? parsedBody : [parsedBody];
    const results: Array<{ eventId: string; processed: boolean; updated: boolean }> = [];

    for (const evt of events) {
      const eventId =
        evt.uuid ||
        evt.requestId ||
        evt.id ||
        evt.crqid ||
        request.headers.get('svix-id') ||
        `msg91_evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

      // 3. Replay Protection & Idempotency
      let isDuplicate = false;
      try {
        const { data: existing } = await supabase
          .from('webhook_events')
          .select('id, processed')
          .eq('event_id', eventId)
          .maybeSingle();

        if (existing && existing.processed) {
          isDuplicate = true;
        } else {
          await supabase.from('webhook_events').upsert(
            {
              event_id: eventId,
              provider: 'msg91_email',
              event_type: evt.status || evt.type || 'delivery_report',
              processed: true,
              created_at: new Date().toISOString(),
            },
            { onConflict: 'event_id' }
          );
        }
      } catch (dbErr) {
        console.warn('[Email Webhook] Idempotency record notice:', dbErr);
      }

      if (isDuplicate) {
        results.push({ eventId, processed: true, updated: false });
        continue;
      }

      // 4. Map provider attributes
      const messageId = evt.requestId || evt.uuid || evt.id || evt.data?.email_id || evt.data?.id;
      const crqid = evt.crqid || evt.CRQID || evt.data?.crqid;
      const status = evt.status || evt.type;
      const reason = evt.reason || evt.description || evt.data?.reason || evt.data?.error || null;
      const timestamp = evt.requestedAt || evt.timestamp || evt.created_at || new Date().toISOString();

      const { updated } = await EmailService.handleProviderWebhook({
        status,
        type: evt.type,
        messageId,
        requestId: evt.requestId,
        crqid,
        timestamp,
        reason,
        description: evt.description,
      });

      results.push({ eventId, processed: true, updated });
    }

    return NextResponse.json({
      received: true,
      provider: 'msg91',
      totalEvents: events.length,
      results,
    });
  } catch (err: any) {
    console.error('[Email Webhook] Error processing event:', err.message || err);
    return NextResponse.json(
      { error: { code: 'WEBHOOK_ERROR', message: err.message || 'Internal error' } },
      { status: 500 }
    );
  }
}
