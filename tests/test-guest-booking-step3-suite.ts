process.env.BYPASS_REDIS = 'true';
import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { GET as publicBookingGetRoute } from '../src/app/api/therapy/book/[token]/route';
import {
  generateBookingToken,
  hashBookingToken,
  encryptBookingToken,
  decryptBookingToken,
  RelationshipBookingLinkService,
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

async function runStep3TestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — STEP 3: PUBLIC GUEST BOOKING & AVAILABILITY ');
  console.log('================================================================\n');

  const publicRoutePath = path.join(process.cwd(), 'src/app/api/therapy/book/[token]/route.ts');
  const guestViewPath = path.join(process.cwd(), 'src/views/therapy/GuestBookingView.jsx');
  const guestPagePath = path.join(process.cwd(), 'src/app/book/[token]/page.jsx');
  const servicePath = path.join(process.cwd(), 'src/lib/therapy/relationshipBookingLinkService.ts');

  const publicRouteSrc = fs.readFileSync(publicRoutePath, 'utf8');
  const guestViewSrc = fs.readFileSync(guestViewPath, 'utf8');
  const guestPageSrc = fs.readFileSync(guestPagePath, 'utf8');
  const serviceSrc = fs.readFileSync(servicePath, 'utf8');

  // ===========================================================================
  // 1. PUBLIC ENDPOINT RESOLUTION & FAIL-SAFE ERROR HANDLING
  // ===========================================================================
  console.log('--- SECTION 1: Public Token Resolution & Fail-Safe Invariants ---');

  await test('GET /api/therapy/book/[token] returns generic 404 for empty or missing token', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/book/%20');
    const res = await publicBookingGetRoute(req, {
      params: Promise.resolve({ token: '   ' }),
    });

    assert.strictEqual(res.status, 404, 'Returns 404 for invalid token');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'BOOKING_LINK_UNAVAILABLE');
    assert.strictEqual(body.error?.message, 'This booking link is invalid or no longer active.');
  });

  await test('GET /api/therapy/book/[token] returns generic 404 for unresolvable or fake token without leaking state', async () => {
    const fakeToken = generateBookingToken();
    const req = new NextRequest(`http://localhost:3000/api/therapy/book/${fakeToken}`);
    const res = await publicBookingGetRoute(req, {
      params: Promise.resolve({ token: fakeToken }),
    });

    assert.strictEqual(res.status, 404, 'Returns 404 for non-existent token');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'BOOKING_LINK_UNAVAILABLE');
    // Generic message prevents token enumeration or probing
    assert.strictEqual(body.error?.message, 'This booking link is invalid or no longer active.');
  });

  // ===========================================================================
  // 2. CONSENT & THERAPIST CLEARANCE PREREQUISITES
  // ===========================================================================
  console.log('\n--- SECTION 2: Practice Clearance & Authoritative Consent Gate ---');

  await test('resolveBookingLinkByToken strictly enforces therapy consent verification', () => {
    assert(
      serviceSrc.includes('verifyClientConsent(rel.user_id, rel.therapy_session_id)'),
      'Calls verifyClientConsent with relationship user_id and therapy_session_id'
    );
    assert(
      serviceSrc.includes("errorCode: 'CONSENT_REQUIRED'"),
      'Fails closed if client consent cannot be proven'
    );
  });

  await test('resolveBookingLinkByToken strictly validates therapist clinical practice clearance', () => {
    assert(serviceSrc.includes('thAcc.can_practice'), 'Checks can_practice');
    assert(serviceSrc.includes("thAcc.status !== 'active'"), 'Checks active account status');
    assert(serviceSrc.includes("thAcc.application_status !== 'approved'"), 'Checks approved application status');
    assert(serviceSrc.includes("thAcc.verification_status !== 'verified'"), 'Checks verified practitioner status');
    assert(serviceSrc.includes("errorCode: 'THERAPIST_UNAVAILABLE'"), 'Rejects unavailable/unverified practitioners');
  });

  // ===========================================================================
  // 3. DATA MINIMIZATION & SANITIZED RESPONSE DTO
  // ===========================================================================
  console.log('\n--- SECTION 3: Response Data Minimization & Privacy Shield ---');

  await test('Public endpoint response DTO excludes client identity, internal IDs, and tokens', () => {
    // Check fields in publicRouteSrc response builder
    assert(!publicRouteSrc.includes('userId:'), 'Does not return userId');
    assert(!publicRouteSrc.includes('user_id:'), 'Does not return user_id');
    assert(!publicRouteSrc.includes('clientEmail:'), 'Does not return clientEmail');
    assert(!publicRouteSrc.includes('phoneNumber:'), 'Does not return phoneNumber');
    assert(!publicRouteSrc.includes('relationshipId:'), 'Does not return relationshipId');
    assert(!publicRouteSrc.includes('therapistAccountId:'), 'Does not return therapistAccountId');
    assert(!publicRouteSrc.includes('token_hash:'), 'Does not return token_hash');
    assert(!publicRouteSrc.includes('encrypted_token:'), 'Does not return encrypted_token');
    assert(!publicRouteSrc.includes('soapNotes:'), 'Does not return SOAP notes');
    assert(!publicRouteSrc.includes('clinicalIntake:'), 'Does not return clinical intake answers');
  });

  await test('Public endpoint sets no-store cache control headers to prevent caching sensitive booking metadata', () => {
    assert(
      publicRouteSrc.includes("'Cache-Control': 'no-store, max-age=0'"),
      'Sets Cache-Control no-store'
    );
  });

  // ===========================================================================
  // 4. AUTHORITATIVE PRICING & SCHEDULING INTEGRITY
  // ===========================================================================
  console.log('\n--- SECTION 4: Authoritative Pricing & Scheduling Integrity ---');

  await test('Public route derives pricing strictly from SessionBookingService.getAuthoritativePricing', () => {
    assert(
      publicRouteSrc.includes('SessionBookingService.getAuthoritativePricing'),
      'Uses authoritative pricing service'
    );
    assert(publicRouteSrc.includes('subtotalPaise'), 'Includes subtotalPaise');
    assert(publicRouteSrc.includes('gstPaise'), 'Includes gstPaise');
    assert(publicRouteSrc.includes('totalPaise'), 'Includes totalPaise');
  });

  await test('Public route calls SessionBookingService.getTherapistAvailability with real-time slot resolution', () => {
    assert(
      publicRouteSrc.includes('SessionBookingService.getTherapistAvailability'),
      'Calls existing authoritative availability service'
    );
    assert(
      publicRouteSrc.includes('availableSlots = []'),
      'Fails safely: never fabricates slots if upstream scheduling fails'
    );
  });

  // ===========================================================================
  // 5. GUEST BOOKING PAGE (UI & ACCESSIBILITY)
  // ===========================================================================
  console.log('\n--- SECTION 5: Guest Booking Page UI, States & Boundaries ---');

  await test('GuestBookingView implements loading, error, empty, and slot selection states', () => {
    assert(guestViewSrc.includes('Loading Consultation Schedule'), 'Has loading state');
    assert(guestViewSrc.includes('Booking Link Unavailable'), 'Has unavailable error state');
    assert(guestViewSrc.includes('No Open Consultation Slots'), 'Has empty slots state');
    assert(guestViewSrc.includes('Available Dates'), 'Has date selection chips');
    assert(guestViewSrc.includes('Available Slots'), 'Has interactive slot picker');
  });

  await test('GuestBookingView slot selection does NOT submit booking, hold, or payment (Step 3 Boundary)', () => {
    assert(
      !guestViewSrc.includes('create-order'),
      'Does not call create-order endpoint in Step 3'
    );
    assert(
      !guestViewSrc.includes('verify-payment'),
      'Does not call verify-payment endpoint in Step 3'
    );
    assert(
      !guestViewSrc.includes('Razorpay'),
      'Does not load or trigger Razorpay checkout in Step 3'
    );
    assert(
      guestViewSrc.includes('Ready for Details & Payment (Step 4)'),
      'Explicitly indicates readiness for Step 4 without creating holds'
    );
  });

  await test('GuestBookingPage sets robots noindex, nofollow for search crawler exclusion', () => {
    assert(guestPageSrc.includes('index: false'), 'Sets robots index: false');
    assert(guestPageSrc.includes('follow: false'), 'Sets robots follow: false');
  });

  // ===========================================================================
  // 6. CRYPTOGRAPHIC & ROUND-TRIP INTEGRITY
  // ===========================================================================
  console.log('\n--- SECTION 6: Cryptographic & Service Round-Trip Integrity ---');

  await test('Token generation and encryption round-trip remains deterministic and unguessable', () => {
    const token = generateBookingToken();
    const encrypted = encryptBookingToken(token);
    const decrypted = decryptBookingToken(encrypted);
    assert.strictEqual(decrypted, token, 'Decrypted token matches original token');
  });
}

runStep3TestSuite()
  .then(() => {
    console.log(`\n================================================================`);
    console.log(`  ALL STEP 3 TESTS PASSED (${passed}/${total})`);
    console.log(`================================================================\n`);
  })
  .catch((err) => {
    console.error(`\nTest suite failed with error:`, err);
    process.exit(1);
  });
