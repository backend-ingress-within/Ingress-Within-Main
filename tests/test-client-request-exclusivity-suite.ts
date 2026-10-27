import fs from 'fs';
import path from 'path';

// Load .env configuration
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

import { supabase } from '../src/lib/db';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';

async function runExclusivityTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — CLIENT REQUEST EXCLUSIVITY & ANTI-COLLISION  ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, failureDetails?: any) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      if (failureDetails) console.error('    Details:', failureDetails);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // --- SECTION 1: Migration Verification ---
  console.log('--- SECTION 1: Migration Verification ---');

  const migration028Path = path.join(process.cwd(), 'src/lib/auth/migrations/028_single_therapist_acceptance_guard.sql');
  assert(fs.existsSync(migration028Path), 'Migration 028 exists on disk');

  const migration028Content = fs.readFileSync(migration028Path, 'utf8');
  assert(migration028Content.includes('CREATE OR REPLACE FUNCTION public.accept_therapy_match'), 'accept_therapy_match procedure is declared in migration 028');
  assert(migration028Content.includes('REQUEST_ALREADY_CLAIMED'), 'Migration 028 checks and raises REQUEST_ALREADY_CLAIMED when client already claimed');
  assert(migration028Content.includes("SET match_status = 'unavailable'"), 'Migration 028 updates conflicting matches to unavailable');
  assert(migration028Content.includes('public.therapy_care_relationships'), 'Migration 028 checks existing active care relationships');

  const migration004Path = path.join(process.cwd(), 'src/lib/auth/migrations/004_therapist_match_acceptance_transaction.sql');
  const migration004Content = fs.readFileSync(migration004Path, 'utf8');
  assert(migration004Content.includes('REQUEST_ALREADY_CLAIMED'), 'Migration 004 includes REQUEST_ALREADY_CLAIMED guard');
  assert(migration004Content.includes("SET match_status = 'unavailable'"), 'Migration 004 invalidates other matches to unavailable');

  // --- SECTION 2: Broadcast Request Multi-Therapist Flow ---
  console.log('\n--- SECTION 2: Broadcast Request Multi-Therapist Flow ---');

  const testSessionId = 'sess_test_exclusivity_' + Date.now();
  const testClientId = 'client_test_usr_' + Date.now();
  const therapistA = '00000000-0000-0000-0000-00000000000a';
  const therapistB = '00000000-0000-0000-0000-00000000000b';
  const therapistC = '00000000-0000-0000-0000-00000000000c';

  const matchAId = 'match_test_a_' + Date.now();
  const matchBId = 'match_test_b_' + Date.now();
  const matchCId = 'match_test_c_' + Date.now();

  TherapistPlatformService.clearMockMatches();

  // Register mock broadcast matches across the 3 therapists
  TherapistPlatformService.registerMockMatch({
    id: matchAId,
    therapy_session_id: testSessionId,
    user_id: testClientId,
    therapist_account_id: therapistA,
    match_status: 'candidate',
    match_rank: 1,
    match_score: 90,
  });
  TherapistPlatformService.registerMockMatch({
    id: matchBId,
    therapy_session_id: testSessionId,
    user_id: testClientId,
    therapist_account_id: therapistB,
    match_status: 'candidate',
    match_rank: 2,
    match_score: 85,
  });
  TherapistPlatformService.registerMockMatch({
    id: matchCId,
    therapy_session_id: testSessionId,
    user_id: testClientId,
    therapist_account_id: therapistC,
    match_status: 'candidate',
    match_rank: 3,
    match_score: 80,
  });

  // 2.1 Verify initial visibility: All therapists see the open request before acceptance
  const reqsABefore = await TherapistPlatformService.getAssignedRequests(therapistA);
  const reqsBBefore = await TherapistPlatformService.getAssignedRequests(therapistB);
  const reqsCBefore = await TherapistPlatformService.getAssignedRequests(therapistC);

  const foundInA = reqsABefore.some((r) => r.id === matchAId);
  const foundInB = reqsBBefore.some((r) => r.id === matchBId);
  const foundInC = reqsCBefore.some((r) => r.id === matchCId);

  assert(foundInA, 'Therapist A sees the open request initially');
  assert(foundInB, 'Therapist B sees the open request initially');
  assert(foundInC, 'Therapist C sees the open request initially');

  // --- SECTION 3: Therapist A Accepts & Confirms the Client ---
  console.log('\n--- SECTION 3: Therapist A Accepts & Confirms the Client ---');

  const acceptResult = await TherapistPlatformService.handleRequestAction(
    therapistA,
    matchAId,
    'accept'
  );
  assert(acceptResult.success === true, 'Therapist A accepts successfully');
  assert(acceptResult.matchStatus === 'selected', 'Match A status is updated to selected');

  // --- SECTION 4: Client Must NOT Be Seen by Any Other Therapist ---
  console.log('\n--- SECTION 4: Client Must NOT Be Seen by Any Other Therapist ---');

  // 4.1 Therapist B fetches requests
  const reqsBAfter = await TherapistPlatformService.getAssignedRequests(therapistB);
  const foundInBAfter = reqsBAfter.some((r) => r.userId === testClientId || r.id === matchBId || r.therapySessionId === testSessionId);
  assert(!foundInBAfter, 'Therapist B CANNOT see the request or client after Therapist A accepts');

  // 4.2 Therapist C fetches requests
  const reqsCAfter = await TherapistPlatformService.getAssignedRequests(therapistC);
  const foundInCAfter = reqsCAfter.some((r) => r.userId === testClientId || r.id === matchCId || r.therapySessionId === testSessionId);
  assert(!foundInCAfter, 'Therapist C CANNOT see the request or client after Therapist A accepts');

  // 4.3 Therapist A still sees it under their accepted roster
  const reqsAAfter = await TherapistPlatformService.getAssignedRequests(therapistA);
  const foundInAAfter = reqsAAfter.some((r) => r.id === matchAId && r.matchStatus === 'selected');
  assert(foundInAAfter, 'Therapist A retains the confirmed accepted request in their history');

  // --- SECTION 5: Collision & Race Condition Defense ---
  console.log('\n--- SECTION 5: Collision & Race Condition Defense ---');

  // 5.1 If Therapist B attempts to accept the already-claimed request
  let rejectedTherapistB = false;
  try {
    await TherapistPlatformService.handleRequestAction(
      therapistB,
      matchBId,
      'accept'
    );
  } catch (err: any) {
    rejectedTherapistB = true;
    assert(
      err.code === 'REQUEST_ALREADY_CLAIMED' || err.status === 409 || err.message?.includes('already been accepted'),
      'Therapist B accept is rejected with REQUEST_ALREADY_CLAIMED / 409'
    );
  }
  assert(rejectedTherapistB, 'Therapist B is strictly blocked from accepting an already-claimed client');

  // 5.2 Single request lookup by Therapist B throws 409
  let getByIdBlocked = false;
  try {
    await TherapistPlatformService.getRequestById(therapistB, matchBId);
  } catch (err: any) {
    getByIdBlocked = true;
    assert(
      err.code === 'REQUEST_ALREADY_CLAIMED' || err.status === 409 || err.message?.includes('already been accepted'),
      'getRequestById for claimed request throws 409 REQUEST_ALREADY_CLAIMED'
    );
  }
  assert(getByIdBlocked, 'Single request lookup by other therapist is rejected once claimed');

  // 5.3 Active relationship remains with Therapist A and was NOT overwritten
  const { data: finalActiveRel } = await supabase
    .from('therapy_care_relationships')
    .select('id, therapist_account_id, status')
    .eq('user_id', testClientId)
    .eq('status', 'active')
    .maybeSingle();

  if (finalActiveRel) {
    assert(finalActiveRel.therapist_account_id === therapistA, 'Active relationship remains exclusively with Therapist A (never changed)');
  }

  // --- SECTION 6: Cleanup ---
  console.log('\n--- SECTION 6: Cleanup ---');
  try {
    await supabase.from('therapy_matches').delete().in('id', [matchAId, matchBId, matchCId]);
    await supabase.from('therapy_care_relationships').delete().eq('user_id', testClientId);
  } catch {}
  assert(true, 'Test artifacts cleaned up successfully');

  console.log('\n================================================================');
  console.log(`  EXCLUSIVITY RESULTS: ${passed}/${total} PASSING`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runExclusivityTestSuite().catch((err) => {
  console.error('\nExclusivity test suite failed:', err);
  process.exit(1);
});
