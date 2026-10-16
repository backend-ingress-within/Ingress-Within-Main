import fs from 'fs';
import path from 'path';

// Load .env before importing application modules
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch (e) {}

import assert from 'assert';
import { NextRequest } from 'next/server';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
import { AdminAuthService } from '../src/lib/admin/adminAuthService';
import { DELETE as deleteTherapistRoute } from '../src/app/api/admin/therapists/[id]/route';
import { COOKIE_ADMIN_ACCESS_NAME } from '../src/utils/cookies';
import { supabase } from '../src/lib/db';

async function runTestSuite() {
  console.log('================================================================');
  console.log('   INGRESS WITHIN — DELETE REJECTED THERAPIST TEST SUITE        ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  async function test(name: string, fn: () => void | Promise<void>) {
    total++;
    try {
      await fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
      throw err;
    }
  }

  // --- SECTION 1: Validation & Invariants ---
  console.log('--- SECTION 1: Validation & Security Restrictions ---');

  await test('deleteRejectedTherapist throws INVALID_ID if therapistAccountId is empty', async () => {
    try {
      await AdminPlatformService.deleteRejectedTherapist('', 'admin_123');
      assert.fail('Should have thrown an error');
    } catch (err: any) {
      assert.strictEqual(err.code, 'INVALID_ID');
      assert.strictEqual(err.status, 400);
    }
  });

  await test('deleteRejectedTherapist throws THERAPIST_NOT_FOUND for non-existent therapist', async () => {
    try {
      await AdminPlatformService.deleteRejectedTherapist('00000000-0000-0000-0000-000000000000', 'admin_123');
      assert.fail('Should have thrown an error');
    } catch (err: any) {
      assert.strictEqual(err.code, 'THERAPIST_NOT_FOUND');
      assert.strictEqual(err.status, 404);
    }
  });

  // --- SECTION 2: Active / Non-Rejected Clinicians Must Not Be Deletable ---
  console.log('\n--- SECTION 2: Protection of Active & Non-Rejected Clinicians ---');

  // Create temporary non-rejected therapist
  const testActiveAccountId = '11111111-2222-3333-4444-555555555555';
  const { error: activeErr } = await supabase.from('therapist_accounts').upsert({
    id: testActiveAccountId,
    auth_user_id: '11111111-2222-3333-4444-555555555550',
    status: 'active',
    application_status: 'approved',
    verification_status: 'verified',
    can_practice: true,
    phone_number: '+919999999991',
    per_session_fee: 1500,
  });
  if (activeErr) throw new Error(`Active account seed failed: ${activeErr.message}`);

  await test('deleteRejectedTherapist blocks deletion of active/approved clinician with THERAPIST_NOT_REJECTED', async () => {
    try {
      await AdminPlatformService.deleteRejectedTherapist(testActiveAccountId, 'admin_123');
      assert.fail('Should have thrown an error');
    } catch (err: any) {
      assert.strictEqual(err.code, 'THERAPIST_NOT_REJECTED');
      assert.strictEqual(err.status, 400);
      assert(err.message.includes('Only therapists with rejected status can be deleted'));
    }
  });

  // Cleanup the test active clinician
  await supabase.from('therapist_accounts').delete().eq('id', testActiveAccountId);

  // --- SECTION 3: Successful Deletion of Rejected Therapist ---
  console.log('\n--- SECTION 3: Successful Cascade Purge of Rejected Therapist ---');

  const testRejectedAccountId = '77777777-8888-9999-aaaa-bbbbbbbbbbbb';
  const testRejectedEmail = 'test_rejected_therapist_purge@example.com';

  // Seed test records across therapist tables
  const { error: rejErr } = await supabase.from('therapist_accounts').upsert({
    id: testRejectedAccountId,
    auth_user_id: '77777777-8888-9999-aaaa-bbbbbbbbbbb0',
    status: 'rejected',
    application_status: 'rejected',
    verification_status: 'rejected',
    can_practice: false,
    phone_number: '+919999999992',
    per_session_fee: 1200,
  });
  if (rejErr) throw new Error(`Rejected account seed failed: ${rejErr.message}`);

  const { error: profErr } = await supabase.from('therapist_profiles').upsert({
    therapist_account_id: testRejectedAccountId,
    full_name: 'Dr. Test Rejected Purge',
    phone: '+919999999992',
    contact_email: testRejectedEmail,
  });
  if (profErr) throw new Error(`Profile seed failed: ${profErr.message}`);

  const { error: appErr } = await supabase.from('therapist_applications').upsert({
    therapist_account_id: testRejectedAccountId,
    contact_email: testRejectedEmail,
    answers: { fullName: 'Dr. Test Rejected Purge', email: testRejectedEmail },
  });
  if (appErr) throw new Error(`Application seed failed: ${appErr.message}`);

  const { error: availErr } = await supabase.from('therapist_availability_blocks').upsert({
    therapist_account_id: testRejectedAccountId,
    day_of_week: 1,
    start_time: '10:00:00',
    end_time: '11:00:00',
  });
  if (availErr) throw new Error(`Availability seed failed: ${availErr.message}`);

  await test('deleteRejectedTherapist purges rejected therapist and dependent records', async () => {
    const result = await AdminPlatformService.deleteRejectedTherapist(testRejectedAccountId, 'admin_test');
    assert.strictEqual(result.success, true);
    assert(result.message.includes('Dr. Test Rejected Purge'));

    // Verify account deleted
    const { data: acc } = await supabase
      .from('therapist_accounts')
      .select('id')
      .eq('id', testRejectedAccountId)
      .maybeSingle();
    assert.strictEqual(acc, null, 'Therapist account should be deleted');

    // Verify profile deleted
    const { data: prof } = await supabase
      .from('therapist_profiles')
      .select('id')
      .eq('therapist_account_id', testRejectedAccountId)
      .maybeSingle();
    assert.strictEqual(prof, null, 'Therapist profile should be deleted');

    // Verify application deleted
    const { data: app } = await supabase
      .from('therapist_applications')
      .select('id')
      .eq('therapist_account_id', testRejectedAccountId)
      .maybeSingle();
    assert.strictEqual(app, null, 'Therapist application should be deleted');

    // Verify availability deleted
    const { data: avail } = await supabase
      .from('therapist_availability_blocks')
      .select('id')
      .eq('therapist_account_id', testRejectedAccountId);
    assert.strictEqual((avail || []).length, 0, 'Availability blocks should be deleted');
  });

  // --- SECTION 4: API Endpoint Security ---
  console.log('\n--- SECTION 4: API Route Security (DELETE /api/admin/therapists/[id]) ---');

  await test('DELETE /api/admin/therapists/[id] rejects unauthenticated request with 403', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/therapists/123', {
      method: 'DELETE',
    });
    const res = await deleteTherapistRoute(req, {
      params: Promise.resolve({ id: '123' }),
    });
    assert.strictEqual(res.status, 403);
    const body = await res.json();
    assert.strictEqual(body.error.code, 'ADMIN_UNAUTHORIZED');
  });

  console.log('\n================================================================');
  console.log(`   ALL TESTS COMPLETED: ${passed}/${total} PASSED`);
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
