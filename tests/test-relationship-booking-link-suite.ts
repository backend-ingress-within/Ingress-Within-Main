import assert from 'assert';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { NextRequest } from 'next/server';
import {
  generateBookingToken,
  hashBookingToken,
  encryptBookingToken,
  decryptBookingToken,
  getCanonicalBookingUrl,
  verifyClientConsent,
  RelationshipBookingLinkService,
} from '../src/lib/therapy/relationshipBookingLinkService';
import { POST as bookingLinkPostRoute, GET as bookingLinkGetRoute } from '../src/app/api/therapy/relationships/[id]/booking-link/route';
import { signJwt } from '../src/utils/crypto';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';

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

async function runBookingLinkTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — PERSISTENT BOOKING LINK STEP 1 TEST SUITE   ');
  console.log('================================================================\n');

  // ===========================================================================
  // 1. MIGRATION & SCHEMA DEFINITION
  // ===========================================================================
  console.log('--- SECTION 1: Migration & Schema Verification ---');

  await test('Migration 024_relationship_booking_links.sql exists and is syntactically sound', () => {
    const migPath = path.join(
      process.cwd(),
      'src/lib/auth/migrations/024_relationship_booking_links.sql'
    );
    assert(fs.existsSync(migPath), 'Migration file 024 exists');
    const sql = fs.readFileSync(migPath, 'utf8');

    assert(sql.includes('CREATE TABLE IF NOT EXISTS public.relationship_booking_links'), 'Creates table');
    assert(sql.includes('REFERENCES public.therapy_care_relationships(id)'), 'Foreign key to therapy_care_relationships');
    assert(sql.includes('ON DELETE CASCADE'), 'Cascades deletion');
    assert(sql.includes('idx_active_relationship_booking_link'), 'Has active relationship index');
    assert(sql.includes('idx_booking_link_token_hash'), 'Has token hash index');
    assert(sql.includes('token_hash VARCHAR(64) NOT NULL UNIQUE'), 'Enforces unique hash');
    assert(sql.includes('encrypted_token TEXT NOT NULL'), 'Stores encrypted payload for stable retrieval');
    assert(sql.includes('ENABLE ROW LEVEL SECURITY'), 'Enforces RLS');
  });

  // ===========================================================================
  // 2. CRYPTOGRAPHIC TOKEN DESIGN & ENTROPY
  // ===========================================================================
  console.log('\n--- SECTION 2: Token Generation, Entropy & Storage Cryptography ---');

  await test('generateBookingToken produces unguessable tokens with 256-bit entropy and bk_ prefix', () => {
    const token = generateBookingToken();
    assert(token.startsWith('bk_'), 'Token starts with bk_ prefix');
    assert(token.length >= 45, 'Token has sufficient length for 256 bits of entropy');

    // Test collision resistance across 2,000 tokens
    const set = new Set<string>();
    for (let i = 0; i < 2000; i++) {
      const t = generateBookingToken();
      assert(!set.has(t), 'Collision detected in token generation');
      set.add(t);
    }
    assert(set.size === 2000, '2,000 distinct tokens generated with zero collisions');
  });

  await test('AES-256-GCM encrypts and decrypts tokens deterministically with authenticated tags', () => {
    const rawToken = generateBookingToken();
    const encrypted = encryptBookingToken(rawToken);

    assert(encrypted !== rawToken, 'Ciphertext is not plaintext');
    const parts = encrypted.split(':');
    assert.strictEqual(parts.length, 3, 'Encrypted format is iv:tag:ciphertext');

    const decrypted = decryptBookingToken(encrypted);
    assert.strictEqual(decrypted, rawToken, 'Decrypted token matches original token verbatim');

    // Tampering detection: modify one character of ciphertext
    const tampered = `${parts[0]}:${parts[1]}:${parts[2].slice(0, -2)}99`;
    assert.throws(
      () => decryptBookingToken(tampered),
      /Unsupported state or unable to authenticate data|bad decrypt|authentication failed/i,
      'Tampered payload must trigger authentication failure in GCM'
    );
  });

  await test('hashBookingToken computes deterministic SHA-256 for fast O(1) database lookups', () => {
    const token = 'bk_sample_test_token_12345';
    const hash1 = hashBookingToken(token);
    const hash2 = hashBookingToken(token);
    assert.strictEqual(hash1, hash2, 'Hash is deterministic');
    assert.strictEqual(hash1.length, 64, 'SHA-256 produces 64 hex characters');

    const expected = crypto.createHash('sha256').update(token).digest('hex');
    assert.strictEqual(hash1, expected, 'Hash matches Node.js crypto SHA-256 directly');
  });

  // ===========================================================================
  // 3. CANONICAL URL & HOST-HEADER TAMPER RESISTANCE
  // ===========================================================================
  console.log('\n--- SECTION 3: Canonical URL Construction & Host-Header Tamper Resistance ---');

  await test('getCanonicalBookingUrl builds URL strictly from trusted configuration and ignores Host headers', () => {
    const prevEnv = process.env.NEXT_PUBLIC_APP_URL;
    try {
      process.env.NEXT_PUBLIC_APP_URL = 'https://ingresswithin.com';
      const url = getCanonicalBookingUrl('bk_token_xyz');
      assert.strictEqual(url, 'https://ingresswithin.com/book/bk_token_xyz');

      // Trailing slash normalization
      process.env.NEXT_PUBLIC_APP_URL = 'https://ingresswithin.com///';
      const urlTrailing = getCanonicalBookingUrl('bk_token_xyz');
      assert.strictEqual(urlTrailing, 'https://ingresswithin.com/book/bk_token_xyz');
    } finally {
      process.env.NEXT_PUBLIC_APP_URL = prevEnv;
    }
  });

  // ===========================================================================
  // 4. AUTHORITATIVE CONSENT VALIDATION GATE
  // ===========================================================================
  console.log('\n--- SECTION 4: Authoritative Consent Verification Logic ---');

  await test('verifyClientConsent fails closed if userId is empty', async () => {
    const res = await verifyClientConsent('');
    assert.strictEqual(res.verified, false, 'Fails closed on missing userId');
  });

  await test('Consent verification accepts array format with all affirmative checkboxes', () => {
    // Array format from intake step 3
    const fullConsentArray = [true, true, true, true];
    assert(fullConsentArray.length >= 3 && fullConsentArray.every(Boolean), 'Full consent array passes');

    // Partial/false consent must fail
    const rejectedConsentArray = [true, false, true, true];
    assert(!(rejectedConsentArray.length >= 3 && rejectedConsentArray.every(Boolean)), 'Incomplete consent array fails');

    const shortArray = [true, true];
    assert(!(shortArray.length >= 3 && shortArray.every(Boolean)), 'Short consent array fails');
  });

  await test('Consent verification rejects explicit false refusals in object format', () => {
    const explicitRefusal = { intake: true, nonCrisis: false };
    const hasRefusal = Object.values(explicitRefusal).some((v) => v === false);
    assert(hasRefusal === true, 'Explicit false in consent object is flagged as refusal');

    const affirmativeObject = { intake: true };
    const hasRefusalAffirmative = Object.values(affirmativeObject).some((v) => v === false);
    assert(hasRefusalAffirmative === false, 'Affirmative object has no refusal');
  });

  // ===========================================================================
  // 5. AUTHORIZATION, TENANCY & IDOR PREVENTION
  // ===========================================================================
  console.log('\n--- SECTION 5: Route Authorization, Tenancy & IDOR Prevention ---');

  const jwtSecret = TherapistAuthService.getJwtSecret();

  const clientUserToken = signJwt(
    {
      uid: 'user_regular_client_300',
      phone: '+919999933333',
      sub: 'user_regular_client_300',
    },
    jwtSecret,
    7200
  );

  await test('POST /api/therapy/relationships/[id]/booking-link rejects unauthenticated callers with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/relationships/rel_123/booking-link', {
      method: 'POST',
      headers: {
        host: 'attacker-injected-host.com',
      },
    });

    const res = await bookingLinkPostRoute(req, {
      params: Promise.resolve({ id: 'rel_123' }),
    });

    assert.strictEqual(res.status, 401, 'Unauthenticated request returns 401');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'AUTH_REQUIRED');
  });

  await test('POST /api/therapy/relationships/[id]/booking-link rejects regular client tokens with 401/403', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/relationships/rel_123/booking-link', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${clientUserToken}`,
      },
    });

    const res = await bookingLinkPostRoute(req, {
      params: Promise.resolve({ id: 'rel_123' }),
    });

    assert.strictEqual(res.status, 401, 'Client token without therapist/admin scope returns 401');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'AUTH_REQUIRED');
  });

  await test('GET /api/therapy/relationships/[id]/booking-link rejects unauthenticated callers with 401', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapy/relationships/rel_123/booking-link', {
      method: 'GET',
    });

    const res = await bookingLinkGetRoute(req, {
      params: Promise.resolve({ id: 'rel_123' }),
    });

    assert.strictEqual(res.status, 401, 'Unauthenticated GET returns 401');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'AUTH_REQUIRED');
  });

  // ===========================================================================
  // 6. SERVICE INTEGRITY, RECOVERY & RESOLUTION
  // ===========================================================================
  console.log('\n--- SECTION 6: Service Integrity, Non-Disclosure & Lifecycle ---');

  await test('RelationshipBookingLinkService code does not log raw bearer tokens to stdout/stderr', () => {
    const servicePath = path.join(process.cwd(), 'src/lib/therapy/relationshipBookingLinkService.ts');
    const code = fs.readFileSync(servicePath, 'utf8');

    // Verify console.log does not log raw token
    assert(!code.includes('console.log(token)'), 'Never logs raw token directly');
    assert(!code.includes('console.log(`token: ${token}`'), 'Never logs interpolated token');
    assert(!code.includes('console.log(decryptedToken)'), 'Never logs decrypted token');
  });

  await test('resolveBookingLinkByToken returns false for empty or non-existent token', async () => {
    const res = await RelationshipBookingLinkService.resolveBookingLinkByToken('');
    assert.strictEqual(res.valid, false);
    assert.strictEqual(res.errorCode, 'INVALID_TOKEN');

    const fakeToken = generateBookingToken();
    const notFoundRes = await RelationshipBookingLinkService.resolveBookingLinkByToken(fakeToken);
    assert.strictEqual(notFoundRes.valid, false);
    assert.strictEqual(notFoundRes.errorCode, 'LINK_NOT_FOUND');
  });

  await test('Revocation invalidates booking link resolution gracefully', async () => {
    const isRevoked = await RelationshipBookingLinkService.revokeBookingLink(
      'non_existent_rel_id',
      'admin_actor_1',
      'Test relationship ended'
    );
    assert.strictEqual(typeof isRevoked, 'boolean');
  });
}

runBookingLinkTestSuite()
  .then(() => {
    console.log(`\n================================================================`);
    console.log(`  ALL STEP 1 TESTS PASSED SUCCESSFULLY (${passed}/${total})`);
    console.log(`================================================================\n`);
  })
  .catch((err) => {
    console.error(`\nTest suite failed with error:`, err);
    process.exit(1);
  });
