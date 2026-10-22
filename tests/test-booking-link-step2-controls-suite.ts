import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { signJwt } from '../src/utils/crypto';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';
import { POST as bookingLinkPostRoute } from '../src/app/api/therapy/relationships/[id]/booking-link/route';
import {
  generateBookingToken,
  encryptBookingToken,
  decryptBookingToken,
  getCanonicalBookingUrl,
} from '../src/lib/therapy/relationshipBookingLinkService';

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

async function runStep2TestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — STEP 2: ADMIN & THERAPIST CONTROLS TEST SUITE');
  console.log('================================================================\n');

  const adminDashboardPath = path.join(process.cwd(), 'src/views/admin/AdminDashboardShell.jsx');
  const therapistModalPath = path.join(process.cwd(), 'src/views/therapist/TherapistClientModal.jsx');
  const adminPlatformServicePath = path.join(process.cwd(), 'src/lib/admin/adminPlatformService.ts');

  const adminDashboardSrc = fs.readFileSync(adminDashboardPath, 'utf8');
  const therapistModalSrc = fs.readFileSync(therapistModalPath, 'utf8');
  const adminServiceSrc = fs.readFileSync(adminPlatformServicePath, 'utf8');

  // ===========================================================================
  // 1. ADMIN UI INTEGRATION & RELATIONSHIP RESOLUTION
  // ===========================================================================
  console.log('--- SECTION 1: Admin Dashboard Integration & Tenancy Safety ---');

  await test('AdminPlatformService.getClients queries active relationships and returns relationship.id', () => {
    assert(adminServiceSrc.includes('from(\'therapy_care_relationships\')'), 'Queries therapy_care_relationships');
    assert(adminServiceSrc.includes('relationshipsByUserId'), 'Indexes relationships by client user ID');
    assert(adminServiceSrc.includes('relationship: relationshipsByUserId[c.id] || null'), 'Attaches relationship to safe client record');
  });

  await test('AdminDashboardShell provides handleGenerateBookingLink scoped strictly to relationship ID', () => {
    assert(adminDashboardSrc.includes('handleGenerateBookingLink'), 'Contains handleGenerateBookingLink');
    assert(
      adminDashboardSrc.includes('fetch(`/api/therapy/relationships/${relationshipId}/booking-link`'),
      'Calls correct authenticated relationship booking-link endpoint'
    );
    assert(
      adminDashboardSrc.includes('c.relationship?.id'),
      'Renders action strictly when an active care relationship exists'
    );
    assert(
      adminDashboardSrc.includes('No active relationship'),
      'Renders fallback text when no care relationship exists'
    );
  });

  await test('Admin UI prevents repeated concurrent clicks with generatingLinkId state', () => {
    assert(adminDashboardSrc.includes('generatingLinkId === c.relationship.id'), 'Disables button while generating');
    assert(adminDashboardSrc.includes('setGeneratingLinkId(relationshipId)'), 'Sets loading state on click');
    assert(adminDashboardSrc.includes('setGeneratingLinkId(null)'), 'Clears loading state in finally block');
  });

  await test('Admin UI provides feedback and copies canonical URL to clipboard', () => {
    assert(adminDashboardSrc.includes('navigator.clipboard.writeText(data.bookingLink)'), 'Copies link to clipboard');
    assert(adminDashboardSrc.includes('showToast('), 'Invokes toast notifications with server messages');
    assert(adminDashboardSrc.includes('copiedLinkId === c.relationship.id'), 'Switches label to Copied Link!');
  });

  // ===========================================================================
  // 2. THERAPIST CLIENT MODAL INTEGRATION & TENANCY
  // ===========================================================================
  console.log('\n--- SECTION 2: Therapist Client Modal Integration & Tenancy ---');

  await test('TherapistClientModal derives relationship ID strictly from profile.relationship.id', () => {
    assert(therapistModalSrc.includes('profile?.relationship?.id'), 'Checks relationship ID before rendering action');
    assert(
      therapistModalSrc.includes('fetch(`/api/therapy/relationships/${profile.relationship.id}/booking-link`'),
      'Calls endpoint with exact profile.relationship.id'
    );
    assert(
      !therapistModalSrc.includes('fetch(`/api/therapy/relationships/${clientId}/booking-link`'),
      'Never substitutes client ID for relationship ID'
    );
  });

  await test('TherapistClientModal checks relationship status and disables for non-active relationships', () => {
    assert(
      therapistModalSrc.includes("profile.relationship?.status !== 'active'"),
      'Disables button when relationship is not active'
    );
    assert(
      therapistModalSrc.includes('cursor-not-allowed'),
      'Applies disabled styling for inactive relationships'
    );
  });

  await test('TherapistClientModal handles loading state and duplicate click prevention', () => {
    assert(therapistModalSrc.includes('isGeneratingLink'), 'Tracks isGeneratingLink state');
    assert(
      therapistModalSrc.includes('disabled={isGeneratingLink'),
      'Disables button while request is in flight'
    );
    assert(therapistModalSrc.includes('Generating...'), 'Displays loading feedback');
  });

  await test('TherapistClientModal provides inline dismissible error and success banner', () => {
    assert(therapistModalSrc.includes('linkNotice'), 'Manages linkNotice state');
    assert(therapistModalSrc.includes("linkNotice.type === 'error'"), 'Renders error styling');
    assert(therapistModalSrc.includes('Dismiss'), 'Allows dismissing notice banner');
  });

  // ===========================================================================
  // 3. AUTHORIZATION & REJECTION INVARIANTS
  // ===========================================================================
  console.log('\n--- SECTION 3: Authorization & Security Invariants ---');

  const jwtSecret = TherapistAuthService.getJwtSecret();

  const regularClientToken = signJwt(
    {
      uid: 'client-intruder-1',
      phone: '+919999944444',
      sub: 'client-intruder-1',
    },
    jwtSecret,
    3600
  );

  await test('POST /api/therapy/relationships/[id]/booking-link rejects regular client sessions', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/relationships/any-rel/booking-link', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${regularClientToken}`,
      },
    });

    const res = await bookingLinkPostRoute(req, {
      params: Promise.resolve({ id: 'any-rel' }),
    });

    assert.strictEqual(res.status, 401, 'Returns 401 for non-admin, non-therapist caller');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'AUTH_REQUIRED');
  });

  await test('POST /api/therapy/relationships/[id]/booking-link rejects unauthenticated callers', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/relationships/any-rel/booking-link', {
      method: 'POST',
    });

    const res = await bookingLinkPostRoute(req, {
      params: Promise.resolve({ id: 'any-rel' }),
    });

    assert.strictEqual(res.status, 401);
  });

  // ===========================================================================
  // 4. STABLE LINK IDEMPOTENCY & NON-ROTATION
  // ===========================================================================
  console.log('\n--- SECTION 4: Stable Link Idempotency & Encryption Verification ---');

  await test('Encrypted token payload survives round-trip encryption without rotation', () => {
    const originalToken = generateBookingToken();
    const encrypted1 = encryptBookingToken(originalToken);
    const decrypted1 = decryptBookingToken(encrypted1);
    assert.strictEqual(decrypted1, originalToken, 'Decrypted token matches original');

    const canonicalUrl = getCanonicalBookingUrl(decrypted1);
    assert(canonicalUrl.includes(originalToken), 'Canonical URL contains stable token');
  });

  await test('Neither UI file logs raw token values to console', () => {
    assert(!adminDashboardSrc.includes('console.log(data.bookingLink)'), 'Admin dashboard does not log link');
    assert(!therapistModalSrc.includes('console.log(data.bookingLink)'), 'Therapist modal does not log link');
  });
}

runStep2TestSuite()
  .then(() => {
    console.log(`\n================================================================`);
    console.log(`  ALL STEP 2 CONTROLS TESTS PASSED (${passed}/${total})`);
    console.log(`================================================================\n`);
  })
  .catch((err) => {
    console.error(`\nTest suite failed with error:`, err);
    process.exit(1);
  });
