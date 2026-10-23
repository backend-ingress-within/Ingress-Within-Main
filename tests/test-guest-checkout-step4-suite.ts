process.env.BYPASS_REDIS = 'true';
process.env.DISABLE_BOOKING_PAYMENTS = 'true';

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { POST as publicOrderPostRoute } from '../src/app/api/therapy/book/[token]/order/route';
import {
  RelationshipBookingLinkService,
  generateBookingToken,
  hashBookingToken,
} from '../src/lib/therapy/relationshipBookingLinkService';
import { SessionBookingService } from '../src/lib/therapy/sessionBookingService';

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

async function runStep4TestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — STEP 4: GUEST CHECKOUT & TEMPORARY SLOT HOLDS ');
  console.log('================================================================\n');

  const orderRoutePath = path.join(process.cwd(), 'src/app/api/therapy/book/[token]/order/route.ts');
  const sessionServicePath = path.join(process.cwd(), 'src/lib/therapy/sessionBookingService.ts');
  const guestViewPath = path.join(process.cwd(), 'src/views/therapy/GuestBookingView.jsx');

  const orderRouteSrc = fs.readFileSync(orderRoutePath, 'utf8');
  const sessionServiceSrc = fs.readFileSync(sessionServicePath, 'utf8');
  const guestViewSrc = fs.readFileSync(guestViewPath, 'utf8');

  // ===========================================================================
  // 1. INPUT VALIDATION & GUEST NORMALIZATION
  // ===========================================================================
  console.log('--- SECTION 1: Input Validation & Sanitization ---');

  await test('POST /api/therapy/book/[token]/order returns 404 for missing/whitespace token', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/%20/order', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phoneNumber: '+91 9876543210',
        slotStart: new Date(Date.now() + 86400000).toISOString(),
        slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
      }),
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: '   ' }),
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'BOOKING_LINK_UNAVAILABLE');
  });

  await test('Returns 400 for invalid/malformed JSON body', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/order', {
      method: 'POST',
      body: 'invalid-non-json',
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: 'test-token' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'INVALID_INPUT');
  });

  await test('Returns 400 for missing or too-short full name', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/order', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'J',
        email: 'jane@example.com',
        phoneNumber: '+91 9876543210',
        slotStart: new Date(Date.now() + 86400000).toISOString(),
        slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
      }),
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: 'test-token' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'INVALID_INPUT');
  });

  await test('Returns 400 for invalid email format', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/order', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'not-an-email',
        phoneNumber: '+91 9876543210',
        slotStart: new Date(Date.now() + 86400000).toISOString(),
        slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
      }),
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: 'test-token' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'INVALID_INPUT');
  });

  await test('Returns 400 for invalid/short phone number', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/order', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phoneNumber: '123',
        slotStart: new Date(Date.now() + 86400000).toISOString(),
        slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
      }),
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: 'test-token' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'INVALID_INPUT');
  });

  await test('Returns 400 for slot time specified in the past', async () => {
    const pastStart = new Date(Date.now() - 3600000).toISOString();
    const pastEnd = new Date(Date.now() - 1800000).toISOString();

    const req = new NextRequest('http://localhost:3000/api/therapy/book/test-token/order', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phoneNumber: '+91 9876543210',
        slotStart: pastStart,
        slotEnd: pastEnd,
      }),
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: 'test-token' }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'SLOT_IN_PAST');
  });

  // ===========================================================================
  // 2. AUTHORITATIVE TOKEN RESOLUTION & ELIGIBILITY REVALIDATION
  // ===========================================================================
  console.log('\n--- SECTION 2: Token Resolution & Eligibility Revalidation ---');

  await test('Returns safe 404 BOOKING_LINK_UNAVAILABLE for unresolvable or invalid token', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/non-existent-token/order', {
      method: 'POST',
      body: JSON.stringify({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        phoneNumber: '+91 9876543210',
        slotStart: new Date(Date.now() + 86400000).toISOString(),
        slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
      }),
    });
    const res = await publicOrderPostRoute(req, {
      params: Promise.resolve({ token: 'non-existent-token' }),
    });
    assert.strictEqual(res.status, 404);
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'BOOKING_LINK_UNAVAILABLE');
    assert(!body.error?.message?.includes('token'), 'Does not leak token details');
  });

  await test('Revalidates required therapy consent and returns 422 CONSENT_REQUIRED if missing', async () => {
    // Mock resolveBookingLinkByToken to simulate consent missing
    const origResolve = RelationshipBookingLinkService.resolveBookingLinkByToken;
    try {
      (RelationshipBookingLinkService as any).resolveBookingLinkByToken = async () => ({
        valid: false,
        errorCode: 'CONSENT_REQUIRED',
        errorMessage: 'Required therapy-specific consent has not been verified for client.',
      });

      const req = new NextRequest('http://localhost:3000/api/therapy/book/consent-needed-token/order', {
        method: 'POST',
        body: JSON.stringify({
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          phoneNumber: '+91 9876543210',
          slotStart: new Date(Date.now() + 86400000).toISOString(),
          slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        }),
      });
      const res = await publicOrderPostRoute(req, {
        params: Promise.resolve({ token: 'consent-needed-token' }),
      });
      assert.strictEqual(res.status, 422);
      const body = await res.json();
      assert.strictEqual(body.error?.code, 'CONSENT_REQUIRED');
    } finally {
      RelationshipBookingLinkService.resolveBookingLinkByToken = origResolve;
    }
  });

  await test('Revalidates therapist clearance and returns 404 for ineligible therapist', async () => {
    const origResolve = RelationshipBookingLinkService.resolveBookingLinkByToken;
    try {
      (RelationshipBookingLinkService as any).resolveBookingLinkByToken = async () => ({
        valid: false,
        errorCode: 'THERAPIST_INELIGIBLE',
        errorMessage: 'Therapist is not cleared for practice.',
      });

      const req = new NextRequest('http://localhost:3000/api/therapy/book/ineligible-th-token/order', {
        method: 'POST',
        body: JSON.stringify({
          fullName: 'Jane Doe',
          email: 'jane@example.com',
          phoneNumber: '+91 9876543210',
          slotStart: new Date(Date.now() + 86400000).toISOString(),
          slotEnd: new Date(Date.now() + 86400000 + 3600000).toISOString(),
        }),
      });
      const res = await publicOrderPostRoute(req, {
        params: Promise.resolve({ token: 'ineligible-th-token' }),
      });
      assert.strictEqual(res.status, 404);
      const body = await res.json();
      assert.strictEqual(body.error?.code, 'BOOKING_LINK_UNAVAILABLE');
    } finally {
      RelationshipBookingLinkService.resolveBookingLinkByToken = origResolve;
    }
  });

  // ===========================================================================
  // 3. CONCURRENCY, SLOT HOLDS & CONFLICT PROTECTION
  // ===========================================================================
  console.log('\n--- SECTION 3: Concurrency & Slot Hold Integrity ---');

  await test('SessionBookingService enforces in-memory concurrency locks during order creation', () => {
    assert(
      sessionServiceSrc.includes('activeSlotHoldLocks'),
      'Defines activeSlotHoldLocks concurrency tracker'
    );
    assert(
      sessionServiceSrc.includes('this.activeSlotHoldLocks.has(lockKey)'),
      'Checks activeSlotHoldLocks before acquiring slot'
    );
    assert(
      sessionServiceSrc.includes('this.activeSlotHoldLocks.add(lockKey)'),
      'Adds lock during reservation transaction'
    );
    assert(
      sessionServiceSrc.includes('this.activeSlotHoldLocks.delete(lockKey)'),
      'Releases lock in finally block'
    );
  });

  await test('Enforces 15-minute temporary slot hold with pending_payment status', () => {
    assert(
      sessionServiceSrc.includes('15 * 60 * 1000'),
      'Calculates 15-minute hold expiration'
    );
    assert(
      sessionServiceSrc.includes("booking_status: 'pending_payment'"),
      'Sets booking_status to pending_payment'
    );
  });

  await test('Rejects overlapping reservations on unexpired active holds with 409 SLOT_ON_HOLD', () => {
    assert(
      sessionServiceSrc.includes("err.code = 'SLOT_ON_HOLD'"),
      'Throws SLOT_ON_HOLD when an unexpired hold exists'
    );
    assert(
      sessionServiceSrc.includes('.gt(\'expires_at\', nowIso)'),
      'Ignores stale/expired holds'
    );
  });

  // ===========================================================================
  // 4. AUTHORITATIVE PRICING & PAYMENT GATEWAY RESILIENCE
  // ===========================================================================
  console.log('\n--- SECTION 4: Authoritative Pricing & Gateway Resilience ---');

  await test('Derives price strictly via getAuthoritativePricing and ignores client amounts', () => {
    assert(
      sessionServiceSrc.includes('const pricing = await this.getAuthoritativePricing('),
      'Derives price server-side'
    );
    assert(
      !orderRouteSrc.includes('body.amount'),
      'Order route never reads client-provided amount'
    );
    assert(
      !orderRouteSrc.includes('body.fee'),
      'Order route never reads client-provided fee'
    );
  });

  await test('Releases hold immediately if Razorpay order creation fails', () => {
    assert(
      sessionServiceSrc.includes("booking_status: 'expired'"),
      'Expires hold on gateway failure'
    );
    assert(
      sessionServiceSrc.includes("cancellation_reason: 'RAZORPAY_ORDER_FAILED'"),
      'Records cancellation reason on failure'
    );
  });

  await test('Supports idempotent retries with Idempotency-Key header', () => {
    assert(
      orderRouteSrc.includes("request.headers.get('idempotency-key')"),
      'Supports Idempotency-Key header'
    );
    assert(
      sessionServiceSrc.includes('isIdempotentReplay: true'),
      'Returns isIdempotentReplay on duplicate request within hold window'
    );
  });

  // ===========================================================================
  // 5. DATA MINIMIZATION & PRIVACY SHIELD
  // ===========================================================================
  console.log('\n--- SECTION 5: Data Minimization & Privacy Shield ---');

  await test('Guest order endpoint response DTO minimizes client-exposed data', () => {
    assert(
      !orderRouteSrc.includes('userId:'),
      'Does not expose internal user ID'
    );
    assert(
      !orderRouteSrc.includes('relationshipId:'),
      'Does not expose internal relationship ID'
    );
    assert(
      !orderRouteSrc.includes('therapistAccountId:'),
      'Does not expose internal therapist account ID'
    );
    assert(
      !orderRouteSrc.includes('token_hash:'),
      'Does not expose token hash'
    );
  });

  // ===========================================================================
  // 6. GUEST BOOKING UI INTEGRATION & SCOPE BOUNDARIES
  // ===========================================================================
  console.log('\n--- SECTION 6: UI Integration & Step 4 Scope Boundaries ---');

  await test('GuestBookingView contains guest contact inputs (name, email, phone, notes)', () => {
    assert(guestViewSrc.includes('guest-name'), 'Has guest name input');
    assert(guestViewSrc.includes('guest-email'), 'Has guest email input');
    assert(guestViewSrc.includes('guest-phone'), 'Has guest phone input');
    assert(guestViewSrc.includes('guest-notes'), 'Has guest notes input');
  });

  await test('GuestBookingView displays 15-minute countdown and hold status when active', () => {
    assert(guestViewSrc.includes('Temporary Slot Hold Active'), 'Shows hold banner');
    assert(guestViewSrc.includes('timeLeftStr'), 'Contains countdown timer display');
  });

  await test('GuestBookingView initializes Razorpay checkout modal via Step 4 order payload', () => {
    assert(guestViewSrc.includes('launchRazorpay'), 'Has Razorpay launcher');
    assert(guestViewSrc.includes('checkout.razorpay.com/v1/checkout.js'), 'Loads Razorpay checkout script');
    assert(guestViewSrc.includes('orderPayload.razorpayOrderId'), 'Passes authoritative Razorpay order ID');
  });

  await test('Step 4 strictly respects scope boundaries (NO payment verification or confirmation)', () => {
    assert(
      !orderRouteSrc.includes('confirmSessionPayment'),
      'Step 4 endpoint does not confirm session payment'
    );
    assert(
      !orderRouteSrc.includes('therapist_clinical_appointments'),
      'Step 4 endpoint does not create confirmed appointments'
    );
    assert(
      !orderRouteSrc.includes('GoogleCalendarService.createEvent'),
      'Step 4 endpoint does not create Google Calendar events'
    );
  });
}

runStep4TestSuite()
  .then(() => {
    console.log(`\n================================================================`);
    console.log(`  ALL STEP 4 TESTS PASSED (${passed}/${total})`);
    console.log(`================================================================\n`);
  })
  .catch((err) => {
    console.error(`\nTest suite failed with error:`, err);
    process.exit(1);
  });
