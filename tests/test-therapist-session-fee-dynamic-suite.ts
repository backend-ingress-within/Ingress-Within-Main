import assert from 'assert';
import { NextRequest } from 'next/server';
import { PATCH as patchProfileRoute } from '../src/app/api/therapist/profile/route';
import { PATCH as patchAdminTherapistRoute } from '../src/app/api/admin/therapists/[id]/route';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';
import { signJwt } from '../src/utils/crypto';
import { COOKIE_THERAPIST_ACCESS_NAME } from '../src/utils/cookies';
import { COOKIE_ADMIN_ACCESS_NAME } from '../src/lib/auth/adminAuthHelper';

let passed = 0;
let total = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  total++;
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ [FAIL] ${name}`);
    console.error('    Error:', err.message || err);
    throw err;
  }
}

async function runTestSuite() {
  console.log('================================================================');
  console.log('   INGRESS WITHIN — DYNAMIC THERAPIST SESSION FEE TEST SUITE    ');
  console.log('================================================================\n');

  const jwtSecret = TherapistAuthService.getJwtSecret();
  const testTherapistId = 'th-fee-test-1';
  const testPhone = '+919999988888';

  const validTherapistToken = signJwt(
    {
      tid: testTherapistId,
      phone: testPhone,
      sub: testTherapistId,
      role: 'therapist',
    },
    jwtSecret,
    '2h'
  );

  const adminToken = signJwt(
    {
      adminId: 'admin-super-1',
      email: 'admin@ingresswithin.com',
      role: 'super_admin',
    },
    process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'test-admin-secret-key-for-ingress-within-123',
    '2h'
  );

  console.log('--- SECTION 1: Mass Assignment & Fee Modification Authorization ---');

  await test('PATCH /api/therapist/profile accepts custom per_session_fee mutation', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${validTherapistToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ per_session_fee: 2500 }),
    });

    const res = await patchProfileRoute(req);
    // Should NOT return 403 Forbidden
    assert.notStrictEqual(res.status, 403, 'per_session_fee must no longer be blocked as FORBIDDEN_FIELD_MUTATION');
  });

  await test('PATCH /api/therapist/profile rejects invalid negative or zero per_session_fee', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${validTherapistToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ per_session_fee: -500 }),
    });

    const res = await patchProfileRoute(req);
    assert.strictEqual(res.status, 400, 'Must return 400 Bad Request for negative fee');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'INVALID_PER_SESSION_FEE');
  });

  await test('PATCH /api/therapist/profile still strictly rejects can_practice mutation', async () => {
    const req = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${validTherapistToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ can_practice: true }),
    });

    const res = await patchProfileRoute(req);
    assert.strictEqual(res.status, 403, 'Must return 403 Forbidden for can_practice');
    const body = await res.json();
    assert.strictEqual(body.error?.code, 'FORBIDDEN_FIELD_MUTATION');
  });

  console.log('\n--- SECTION 2: Administrative Fee Controls & Endpoint ---');

  await test('PATCH /api/admin/therapists/[id] rejects unauthenticated request', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/therapists/th-fee-test-1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ per_session_fee: 2800 }),
    });

    const res = await patchAdminTherapistRoute(req, { params: Promise.resolve({ id: 'th-fee-test-1' }) });
    assert.strictEqual(res.status === 401 || res.status === 403, true, 'Must require admin authorization (401 or 403)');
  });

  await test('AdminPlatformService.updateTherapist validates per_session_fee', async () => {
    try {
      await AdminPlatformService.updateTherapist('th-fee-test-1', { per_session_fee: -100 });
      assert.fail('Should have thrown for negative fee');
    } catch (err: any) {
      assert.strictEqual(err.code, 'INVALID_FEE');
    }
  });

  console.log('\n================================================================');
  console.log(`  DYNAMIC SESSION FEE SUITE RESULTS: ${passed}/${total} PASSING`);
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
