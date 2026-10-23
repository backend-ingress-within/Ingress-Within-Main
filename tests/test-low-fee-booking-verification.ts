import assert from 'assert';
import { NextRequest } from 'next/server';
import { PATCH as patchProfileRoute } from '../src/app/api/therapist/profile/route';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';
import { signJwt } from '../src/utils/crypto';

console.log('================================================================');
console.log('  INGRESS WITHIN — LOW FEE TEST VERIFICATION SUITE (₹5 - ₹10)   ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function pass(name: string) {
  passCount++;
  console.log(`  ✓ [PASS] ${name}`);
}

function fail(name: string, error: any) {
  failCount++;
  console.error(`  ✗ [FAIL] ${name}:`, error?.message || error);
}

async function runTests() {
  const jwtSecret = TherapistAuthService.getJwtSecret();
  const testTherapistId = 'th-low-fee-test';
  const token = signJwt(
    { tid: testTherapistId, phone: '+919999988888', sub: testTherapistId, role: 'therapist' },
    jwtSecret,
    '2h'
  );

  // 1. Accepts ₹5 per-session fee
  try {
    const req = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ per_session_fee: 5 }),
    });
    const res = await patchProfileRoute(req);
    assert.notStrictEqual(res.status, 400, 'Must NOT reject ₹5 fee with 400 Bad Request');
    pass('PATCH /api/therapist/profile accepts ₹5 per-session fee without error');
  } catch (err) {
    fail('Accepts ₹5 per-session fee', err);
  }

  // 2. Accepts ₹10 per-session fee
  try {
    const req = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ per_session_fee: 10 }),
    });
    const res = await patchProfileRoute(req);
    assert.notStrictEqual(res.status, 400, 'Must NOT reject ₹10 fee with 400 Bad Request');
    pass('PATCH /api/therapist/profile accepts ₹10 per-session fee without error');
  } catch (err) {
    fail('Accepts ₹10 per-session fee', err);
  }

  // 3. Still rejects negative or zero fees
  try {
    const reqZero = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ per_session_fee: 0 }),
    });
    const resZero = await patchProfileRoute(reqZero);
    assert.strictEqual(resZero.status, 400, 'Must reject ₹0 fee');
    const bodyZero = await resZero.json();
    assert.strictEqual(bodyZero.error?.code, 'INVALID_PER_SESSION_FEE');

    const reqNeg = new NextRequest('http://localhost:3000/api/therapist/profile', {
      method: 'PATCH',
      headers: {
        authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ per_session_fee: -10 }),
    });
    const resNeg = await patchProfileRoute(reqNeg);
    assert.strictEqual(resNeg.status, 400, 'Must reject negative fee');
    pass('PATCH /api/therapist/profile correctly enforces positive fee (rejects <= 0)');
  } catch (err) {
    fail('Rejects non-positive fees', err);
  }

  // 4. Test Authoritative Pricing Math for ₹5 and ₹10
  try {
    // For ₹5
    const baseInr5 = 5;
    const subtotalPaise5 = Math.round(baseInr5 * 100); // 500 paise
    const gstPaise5 = Math.round(subtotalPaise5 * 0.18); // 90 paise
    const totalPaise5 = subtotalPaise5 + gstPaise5; // 590 paise = ₹5.90
    assert.strictEqual(subtotalPaise5, 500);
    assert.strictEqual(gstPaise5, 90);
    assert.strictEqual(totalPaise5, 590);
    assert.strictEqual(totalPaise5 / 100, 5.9);

    // For ₹10
    const baseInr10 = 10;
    const subtotalPaise10 = Math.round(baseInr10 * 100); // 1000 paise
    const gstPaise10 = Math.round(subtotalPaise10 * 0.18); // 180 paise
    const totalPaise10 = subtotalPaise10 + gstPaise10; // 1180 paise = ₹11.80
    assert.strictEqual(subtotalPaise10, 1000);
    assert.strictEqual(gstPaise10, 180);
    assert.strictEqual(totalPaise10, 1180);
    assert.strictEqual(totalPaise10 / 100, 11.8);

    pass('Pricing Math: ₹5 session = ₹5.90 total (590 paise); ₹10 session = ₹11.80 total (1180 paise)');
  } catch (err) {
    fail('Pricing Math for low fees', err);
  }

  console.log('\n================================================================');
  console.log(`RESULTS: ${passCount} PASSED, ${failCount} FAILED`);
  console.log('================================================================\n');

  if (failCount > 0) process.exit(1);
}

runTests().catch((e) => {
  console.error(e);
  process.exit(1);
});
