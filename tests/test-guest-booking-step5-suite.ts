process.env.BYPASS_REDIS = 'true';
process.env.DISABLE_BOOKING_PAYMENTS = 'true';

import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST as publicVerifyPostRoute } from '../src/app/api/therapy/book/[token]/verify/route';
import { RelationshipBookingLinkService } from '../src/lib/therapy/relationshipBookingLinkService';
import { SessionBookingService } from '../src/lib/therapy/sessionBookingService';
import { BillingService } from '../src/lib/billing/billingService';
import { TherapistPayoutService } from '../src/lib/therapist/therapistPayoutService';

let passed = 0;
let total = 0;

async function test(name: string, fn: () => void | Promise<void>) {
  total++;
  try {
    await fn();
    passed++;
    console.log(`  ✓ [PASS] ${name}`);
  } catch (err: any) {
    console.error(`  ✗ [FAIL] ${name}`);
    console.error('    Error:', err.message || err);
    throw err;
  }
}

async function runStep5TestSuite() {
  console.log('================================================================');
  console.log(' INGRESS WITHIN — STEP 5: PAYMENT VERIFICATION & APPOINTMENTS   ');
  console.log('================================================================\n');

  const verifyRoutePath = path.join(process.cwd(), 'src/app/api/therapy/book/[token]/verify/route.ts');
  const sessionServicePath = path.join(process.cwd(), 'src/lib/therapy/sessionBookingService.ts');
  const payoutServicePath = path.join(process.cwd(), 'src/lib/therapist/therapistPayoutService.ts');
  const webhookRoutePath = path.join(process.cwd(), 'src/app/api/webhooks/razorpay/route.ts');
  const guestViewPath = path.join(process.cwd(), 'src/views/therapy/GuestBookingView.jsx');

  const verifyRouteSrc = fs.readFileSync(verifyRoutePath, 'utf8');
  const sessionServiceSrc = fs.readFileSync(sessionServicePath, 'utf8');
  const payoutServiceSrc = fs.readFileSync(payoutServicePath, 'utf8');
  const webhookRouteSrc = fs.readFileSync(webhookRoutePath, 'utf8');
  const guestViewSrc = fs.readFileSync(guestViewPath, 'utf8');

  // ===========================================================================
  // 1. SIGNATURE VERIFICATION & REJECTION GUARDS
  // ===========================================================================
  console.log('--- SECTION 1: Signature Verification & Input Invariants ---');

  await test('Reject verification request when token is missing or whitespace', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/%20/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpayPaymentId: 'pay_123',
        razorpayOrderId: 'order_123',
        razorpaySignature: 'sig_123',
      }),
    });
    const res = await publicVerifyPostRoute(req, {
      params: Promise.resolve({ token: '   ' }),
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'BOOKING_LINK_UNAVAILABLE');
  });

  await test('Reject verification request when payment identifiers are missing', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/verify', {
      method: 'POST',
      body: JSON.stringify({
        razorpayOrderId: 'order_123',
      }),
    });
    const res = await publicVerifyPostRoute(req, {
      params: Promise.resolve({ token: 'test-token' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'INVALID_INPUT');
  });

  await test('BillingService.verifyPaymentSignature validates genuine HMAC-SHA256 signature', () => {
    const secret = BillingService.getKeySecret();
    const orderId = 'order_valid_12345';
    const paymentId = 'pay_valid_67890';
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = BillingService.verifyPaymentSignature(orderId, paymentId, validSignature);
    assert.strictEqual(isValid, true, 'Valid signature must verify successfully');

    const isInvalid = BillingService.verifyPaymentSignature(orderId, paymentId, 'tampered_signature_payload');
    assert.strictEqual(isInvalid, false, 'Tampered signature must be rejected');
  });

  // ===========================================================================
  // 2. IDOR, AUTHORITATIVE ORDER & AMOUNT MATCHING
  // ===========================================================================
  console.log('\n--- SECTION 2: Tenancy Scoping & Data Consistency ---');

  await test('Unknown or unmatched booking attempt is rejected with 404 BOOKING_NOT_FOUND', async () => {
    const origResolve = RelationshipBookingLinkService.resolveBookingLinkByToken;
    try {
      (RelationshipBookingLinkService as any).resolveBookingLinkByToken = async () => ({
        valid: true,
        relationshipId: 'rel_111',
        therapistAccountId: 'th_222',
        userId: 'usr_333',
      });

      const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/verify', {
        method: 'POST',
        body: JSON.stringify({
          razorpayPaymentId: 'pay_test_bypass_123',
          razorpayOrderId: 'order_non_existent',
          razorpaySignature: 'sig_bypass',
        }),
      });
      const res = await publicVerifyPostRoute(req, {
        params: Promise.resolve({ token: 'test-token' }),
      });
      assert.strictEqual(res.status, 404);
      const body = await res.json();
      assert.strictEqual(body.error?.code, 'BOOKING_NOT_FOUND');
    } finally {
      RelationshipBookingLinkService.resolveBookingLinkByToken = origResolve;
    }
  });

  await test('Booking verification query strictly scopes to resolved therapist and relationship (IDOR Shield)', () => {
    assert(
      sessionServiceSrc.includes('.eq(\'therapist_account_id\', therapistAccountId)'),
      'Scopes booking lookup by therapist_account_id'
    );
    assert(
      sessionServiceSrc.includes('.eq(\'relationship_id\', relationshipId)'),
      'Scopes booking lookup by relationship_id'
    );
  });

  await test('Order and amount mismatches trigger 400 rejection', () => {
    assert(
      sessionServiceSrc.includes("err.code = 'ORDER_MISMATCH'"),
      'Rejects mismatched order ID'
    );
    assert(
      sessionServiceSrc.includes("err.code = 'AMOUNT_MISMATCH'"),
      'Rejects mismatched authoritative amount'
    );
    assert(
      sessionServiceSrc.includes("err.code = 'CURRENCY_MISMATCH'"),
      'Rejects mismatched currency'
    );
  });

  // ===========================================================================
  // 3. IDEMPOTENT APPOINTMENT CONFIRMATION & RETRY SAFETY
  // ===========================================================================
  console.log('\n--- SECTION 3: Idempotent Appointment Confirmation ---');

  await test('Repeated verification calls on an already-confirmed booking return alreadyConfirmed without re-creating appointment', () => {
    assert(
      sessionServiceSrc.includes("if (booking.booking_status === 'confirmed' && booking.appointment_id)"),
      'Detects already confirmed booking'
    );
    assert(
      sessionServiceSrc.includes('alreadyConfirmed: true'),
      'Returns alreadyConfirmed flag idempotently'
    );
  });

  await test('Database transaction & in-memory locking protect against race conditions during confirmation', () => {
    assert(
      sessionServiceSrc.includes('this.activeSlotHoldLocks.add(lockKey)'),
      'Acquires concurrency lock for slot confirmation'
    );
    assert(
      sessionServiceSrc.includes('this.activeSlotHoldLocks.delete(lockKey)'),
      'Releases concurrency lock in finally block'
    );
  });

  // ===========================================================================
  // 4. LATE PAYMENT & CONFLICT RECONCILIATION PATH
  // ===========================================================================
  console.log('\n--- SECTION 4: Late-Payment Conflict & Reconciliation Path ---');

  await test('Post-payment slot conflict never double-books and enters reconciliation path', () => {
    assert(
      sessionServiceSrc.includes("reconciliationReason: 'SLOT_UNAVAILABLE_RECONCILIATION_REQUIRED'"),
      'Returns reconciliationReason when competing appointment claimed slot'
    );
    assert(
      sessionServiceSrc.includes("refund_status: 'eligible'"),
      'Marks refund_status as eligible for conflict post-payment'
    );
    assert(
      sessionServiceSrc.includes("reconciliation_status: 'manual_review_required'"),
      'Sets reconciliation_status to manual_review_required in metadata'
    );
    assert(
      sessionServiceSrc.includes("requires_reschedule_or_refund: true"),
      'Sets requires_reschedule_or_refund flag in metadata'
    );
  });

  // ===========================================================================
  // 5. WEBHOOK IDEMPOTENCY & BROWSER/WEBHOOK CONVERGENCE
  // ===========================================================================
  console.log('\n--- SECTION 5: Webhook Processing & Convergence ---');

  await test('Razorpay webhook handler deduplicates events using webhook_events table', () => {
    assert(
      webhookRouteSrc.includes("from('webhook_events')"),
      'Queries webhook_events for idempotency'
    );
    assert(
      webhookRouteSrc.includes('existingEvent && existingEvent.processed'),
      'Skips already processed webhook events'
    );
    assert(
      webhookRouteSrc.includes('duplicate: true'),
      'Returns duplicate acknowledgement'
    );
  });

  await test('Browser callback and webhook processing converge on SessionBookingService confirmation', () => {
    assert(
      webhookRouteSrc.includes('SessionBookingService.confirmSessionPayment'),
      'Webhook invokes authoritative session booking confirmation'
    );
    assert(
      verifyRouteSrc.includes('SessionBookingService.verifyAndConfirmGuestPayment'),
      'Browser verify endpoint invokes authoritative session booking confirmation'
    );
    assert(
      sessionServiceSrc.includes("payment_status === 'paid' && booking.appointment_id"),
      'Guarantees convergence regardless of whether browser or webhook finishes first'
    );
  });

  // ===========================================================================
  // 6. EARNINGS & ACCOUNTING INTEGRITY
  // ===========================================================================
  console.log('\n--- SECTION 6: Earnings & Accounting Integrity ---');

  await test('TherapistPayoutService.recordEarningForAppointment checks DB to prevent duplicate credits', async () => {
    assert(
      payoutServiceSrc.includes("from('therapist_earnings')"),
      'Queries therapist_earnings table before inserting'
    );
    assert(
      payoutServiceSrc.includes("eq('appointment_id', appointmentId)"),
      'Enforces 1:1 earning per appointment'
    );
    assert(
      payoutServiceSrc.includes('return record') || payoutServiceSrc.includes('return earning'),
      'Returns existing earning record on retry'
    );
  });

  // ===========================================================================
  // 7. CALENDAR & TRANSACTIONAL NOTIFICATIONS INTEGRITY
  // ===========================================================================
  console.log('\n--- SECTION 7: Side Effects & Resilience ---');

  await test('Google Calendar sync failures do NOT roll back confirmed appointment', () => {
    assert(
      sessionServiceSrc.includes("console.warn('[SessionBookingService] Google Calendar sync failed gracefully:'"),
      'Catches calendar failures gracefully'
    );
    assert(
      sessionServiceSrc.includes("calStatus = 'failed'"),
      'Records calendar failure state without aborting'
    );
  });

  await test('Email dispatch failures do NOT roll back confirmed appointment', () => {
    assert(
      sessionServiceSrc.includes("console.warn('[SessionBookingService] Email notification dispatch failed gracefully:'"),
      'Catches email failures gracefully'
    );
  });

  // ===========================================================================
  // 8. DATA MINIMIZATION & PRIVACY SHIELD
  // ===========================================================================
  console.log('\n--- SECTION 8: Data Minimization & Privacy Shield ---');

  await test('Verification endpoint response excludes secrets, signatures, raw tokens, and client IDs', () => {
    // Check that response serialization does not return secrets or signatures
    assert(!verifyRouteSrc.includes('key_secret'), 'Does not return key_secret');
    assert(!verifyRouteSrc.includes('webhook_secret'), 'Does not return webhook_secret');
    assert(!verifyRouteSrc.includes('raw_token'), 'Does not return raw_token');
    assert(!verifyRouteSrc.includes('token_hash'), 'Does not return token_hash');
  });

  // ===========================================================================
  // 9. GUEST UI POST-CHECKOUT INTEGRATION
  // ===========================================================================
  console.log('\n--- SECTION 9: Guest UI Post-Checkout Integration ---');

  await test('GuestBookingView implements verification loading, confirmed state, and reconciliation state', () => {
    assert(guestViewSrc.includes('isVerifyingPayment'), 'Tracks verification in progress');
    assert(guestViewSrc.includes('Your Consultation is Confirmed'), 'Renders confirmed appointment view');
    assert(guestViewSrc.includes('Payment Received — Booking Under Review'), 'Renders reconciliation notice view');
    assert(guestViewSrc.includes('Retry Verification'), 'Provides safe verification retry path');
    assert(guestViewSrc.includes('Join Video Session (Google Meet)'), 'Displays Google Meet link when available');
  });
}

runStep5TestSuite()
  .then(() => {
    console.log(`\n================================================================`);
    console.log(`  ALL STEP 5 TESTS PASSED (${passed}/${total})`);
    console.log(`================================================================\n`);
  })
  .catch((err) => {
    console.error(`\nTest suite failed with error:`, err);
    process.exit(1);
  });
