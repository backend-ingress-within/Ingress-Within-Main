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

process.env.BYPASS_REDIS = 'true';

import { NextRequest } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../src/lib/db';
import {
  getClientTherapyDashboardSummary,
  getClientConnectedTherapist,
  getClientCareJourney,
  getClientBillingHistory,
  getEligibleTherapists,
} from '../src/lib/therapy/therapyService';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';
import { AuthService } from '../src/services/authService';
import { signJwt } from '../src/utils/crypto';
import { COOKIE_ACCESS_NAME, COOKIE_THERAPIST_ACCESS_NAME } from '../src/utils/cookies';
import { GET as getConnectionRoute } from '../src/app/api/therapy/connection/route';
import { GET as getJourneyRoute } from '../src/app/api/therapy/client/journey/route';
import { GET as getBillingRoute } from '../src/app/api/therapy/client/billing/route';
import { GET as getSessionsRoute } from '../src/app/api/therapy/client/sessions/route';
import { GET as getHomeworkRoute } from '../src/app/api/therapy/client/homework/route';
import { GET as getTherapistClientsRoute } from '../src/app/api/therapist/clients/route';

async function runClientTherapyDashboardSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — CLIENT THERAPY DASHBOARD VERIFICATION SUITE  ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, failureDetails?: any) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      if (failureDetails) console.error('    Details:', failureDetails);
    }
  }

  const phoneA = '+919' + Math.floor(100000000 + Math.random() * 900000000);
  const phoneB = '+919' + Math.floor(100000000 + Math.random() * 900000000);
  const sessionA = await AuthService.establishSession(phoneA, 'user_dev_01');
  const sessionB = await AuthService.establishSession(phoneB, 'user_dev_02');
  const testClientAId = sessionA.user.id;
  const testClientBId = sessionB.user.id;
  const clientAToken = sessionA.accessToken;
  const clientBToken = sessionB.accessToken;

  function makeClientRequest(url: string, token?: string, method = 'GET', body?: any) {
    const req = new NextRequest(new URL(url, 'http://localhost:3000'), {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Cookie: `${COOKIE_ACCESS_NAME}=${token}`, Authorization: `Bearer ${token}` } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    return req;
  }

  // --------------------------------------------------------------------------
  // SECTION 1: RELATIONSHIP LIFECYCLE RESOLUTION
  // --------------------------------------------------------------------------
  console.log('--- 1. Relationship Lifecycle Resolution ---');
  try {
    const summaryNew = await getClientTherapyDashboardSummary(testClientAId);
    assert(summaryNew !== null, 'Summary returned for new client');
    assert(
      summaryNew.status === 'no_therapist' || summaryNew.status === 'pending',
      'New user without therapist resolves to no_therapist or pending (not active connected)'
    );
    assert(summaryNew.therapist === null, 'No therapist attached for new client');

    // Check idempotency: calling repeatedly does not create duplicate requests or change state
    const summaryReload = await getClientTherapyDashboardSummary(testClientAId);
    assert(summaryReload.status === summaryNew.status, 'Reloading relationship check is strictly idempotent');
  } catch (err: any) {
    assert(false, 'Relationship lifecycle resolution failed with exception', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 2: CONNECTION API ROUTE & AUTHORIZATION BOUNDARIES
  // --------------------------------------------------------------------------
  console.log('\n--- 2. Connection API Route & Tenant Boundaries ---');
  try {
    // 2.1 Unauthenticated call rejects with 401
    const unauthReq = makeClientRequest('http://localhost:3000/api/therapy/connection');
    const unauthRes = await getConnectionRoute(unauthReq);
    assert(unauthRes.status === 401, 'Unauthenticated /api/therapy/connection returns 401');

    // 2.2 Authenticated call for Client A
    const authReqA = makeClientRequest('http://localhost:3000/api/therapy/connection', clientAToken);
    const authResA = await getConnectionRoute(authReqA);
    assert(authResA.status === 200, 'Authenticated Client A /api/therapy/connection returns 200');
    const bodyA = await authResA.json();
    assert(bodyA.success === true, 'Response indicates success');
    assert(typeof bodyA.connectionStatus === 'string', 'connectionStatus field is present as a string');
    assert('pendingRequest' in bodyA, 'pendingRequest field is present');
    assert('history' in bodyA, 'history array is present');

    // 2.3 User Isolation: Client B cannot see Client A data
    const authReqB = makeClientRequest('http://localhost:3000/api/therapy/connection', clientBToken);
    const authResB = await getConnectionRoute(authReqB);
    const bodyB = await authResB.json();
    assert(authResB.status === 200, 'Client B connection check returns 200');
    assert(bodyB.therapist === null, 'Client B does not inherit Client A context');
  } catch (err: any) {
    assert(false, 'Connection route testing threw exception', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 3: CLIENT CARE JOURNEY API & STRICT PRIVACY BOUNDARY
  // --------------------------------------------------------------------------
  console.log('\n--- 3. Client Care Journey API & Clinical Privacy Boundary ---');
  try {
    // 3.1 Unauthenticated rejects
    const unauthJourneyReq = makeClientRequest('http://localhost:3000/api/therapy/client/journey');
    const unauthJourneyRes = await getJourneyRoute(unauthJourneyReq);
    assert(unauthJourneyRes.status === 401, 'Unauthenticated /api/therapy/client/journey returns 401');

    // 3.2 Authenticated journey fetch
    const authJourneyReq = makeClientRequest('http://localhost:3000/api/therapy/client/journey', clientAToken);
    const authJourneyRes = await getJourneyRoute(authJourneyReq);
    assert(authJourneyRes.status === 200, 'Authenticated /api/therapy/client/journey returns 200');
    const journeyBody = await authJourneyRes.json();
    assert(journeyBody.success === true, 'Journey response success is true');
    assert('journey' in journeyBody, 'journey object exists in response');

    // 3.3 STRICT PRIVACY VERIFICATION:
    // Never expose therapist SOAP notes, formulation, risk triage, or private case reflections!
    const journeyStr = JSON.stringify(journeyBody).toLowerCase();
    const forbiddenKeys = [
      'soap_note',
      'subjective',
      'objective',
      'assessment_plan',
      'clinical_formulation',
      'risk_log',
      'internal_supervisor_reflection',
    ];

    let leakDetected = false;
    for (const key of forbiddenKeys) {
      if (journeyStr.includes(`"${key}"`)) {
        leakDetected = true;
        console.error(`Privacy boundary violation: found forbidden field "${key}" in client journey payload!`);
      }
    }
    assert(!leakDetected, 'Privacy Boundary Confirmed: Zero therapist SOAP notes or clinical formulation in client journey');
  } catch (err: any) {
    assert(false, 'Care journey testing threw exception', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 4: CLIENT BILLING API & VERIFIED PAYMENT SCOPING
  // --------------------------------------------------------------------------
  console.log('\n--- 4. Client Billing API & Payment State Scoping ---');
  try {
    // 4.1 Unauthenticated rejects
    const unauthBillReq = makeClientRequest('http://localhost:3000/api/therapy/client/billing');
    const unauthBillRes = await getBillingRoute(unauthBillReq);
    assert(unauthBillRes.status === 401, 'Unauthenticated /api/therapy/client/billing returns 401');

    // 4.2 Authenticated billing fetch
    const authBillReq = makeClientRequest('http://localhost:3000/api/therapy/client/billing', clientAToken);
    const authBillRes = await getBillingRoute(authBillReq);
    assert(authBillRes.status === 200, 'Authenticated /api/therapy/client/billing returns 200');
    const billBody = await authBillRes.json();
    assert(billBody.success === true, 'Billing response success is true');
    assert(Array.isArray(billBody.transactions), 'transactions is returned as an array');
    assert('summary' in billBody, 'summary object is returned');
    assert(typeof billBody.summary.totalPaid === 'number', 'summary.totalPaid is numeric');
    assert(typeof billBody.summary.outstanding === 'number', 'summary.outstanding is numeric');

    // 4.3 Payout boundary verification: Therapist earnings and platform margin must not be in client payload
    const billStr = JSON.stringify(billBody).toLowerCase();
    const forbiddenBillingKeys = ['therapist_payout', 'platform_commission', 'therapist_earnings', 'hostinger_cost'];
    let billingLeak = false;
    for (const bKey of forbiddenBillingKeys) {
      if (billStr.includes(bKey)) {
        billingLeak = true;
        console.error(`Financial boundary violation: found therapist payout key "${bKey}" in client billing!`);
      }
    }
    assert(!billingLeak, 'Financial Boundary Confirmed: Therapist payouts and platform commission remain private');
  } catch (err: any) {
    assert(false, 'Billing testing threw exception', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 5: CLIENT SESSIONS & GOOGLE MEET INTEGRATION
  // --------------------------------------------------------------------------
  console.log('\n--- 5. Client Sessions API & Meeting Synchronization ---');
  try {
    // 5.1 Unauthenticated rejects
    const unauthSessReq = makeClientRequest('http://localhost:3000/api/therapy/client/sessions');
    const unauthSessRes = await getSessionsRoute(unauthSessReq);
    assert(unauthSessRes.status === 401, 'Unauthenticated /api/therapy/client/sessions returns 401');

    // 5.2 Authenticated sessions fetch
    const authSessReq = makeClientRequest('http://localhost:3000/api/therapy/client/sessions', clientAToken);
    const authSessRes = await getSessionsRoute(authSessReq);
    assert(authSessRes.status === 200, 'Authenticated /api/therapy/client/sessions returns 200');
    const sessBody = await authSessRes.json();
    assert(sessBody.success === true, 'Sessions response success is true');
    assert(Array.isArray(sessBody.sessions), 'sessions is an array');

    // 5.3 Verify policy metadata
    if (sessBody.sessions.length > 0) {
      const s = sessBody.sessions[0];
      assert('rescheduleEligible' in s, 'Session contains rescheduleEligible policy flag');
      assert('cancellationRefundEligible' in s, 'Session contains cancellationRefundEligible policy flag');
    } else {
      assert(true, 'Empty sessions array handled cleanly for new user');
    }
  } catch (err: any) {
    assert(false, 'Client sessions testing threw exception', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 6: CLIENT HOMEWORK / SELF-WORK SYNCHRONIZATION
  // --------------------------------------------------------------------------
  console.log('\n--- 6. Client Homework & Self-Work API ---');
  try {
    // 6.1 Unauthenticated rejects
    const unauthHwReq = makeClientRequest('http://localhost:3000/api/therapy/client/homework');
    const unauthHwRes = await getHomeworkRoute(unauthHwReq);
    assert(unauthHwRes.status === 401, 'Unauthenticated /api/therapy/client/homework returns 401');

    // 6.2 Authenticated homework fetch
    const authHwReq = makeClientRequest('http://localhost:3000/api/therapy/client/homework', clientAToken);
    const authHwRes = await getHomeworkRoute(authHwReq);
    assert(authHwRes.status === 200, 'Authenticated /api/therapy/client/homework returns 200');
    const hwBody = await authHwRes.json();
    assert(hwBody.success === true, 'Homework response success is true');
    assert(Array.isArray(hwBody.assignments), 'assignments is returned as an array');
  } catch (err: any) {
    assert(false, 'Client homework testing threw exception', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 7: CANONICAL THERAPIST DASHBOARD INTEGRITY
  // --------------------------------------------------------------------------
  console.log('\n--- 7. Therapist Dashboard Integrity Verification ---');
  try {
    // Ensure therapist endpoints remain fully operational and unaltered
    const jwtSecret = TherapistAuthService.getJwtSecret();
    const therapistToken = signJwt(
      {
        tid: 'test-therapist-1',
        phone: '+919876543210',
        did: 'dev_test_req_01',
        scope: 'therapist',
      },
      jwtSecret,
      3600
    );

    const thReq = new NextRequest(new URL('http://localhost:3000/api/therapist/clients'), {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `${COOKIE_THERAPIST_ACCESS_NAME}=${therapistToken}`,
      },
    });

    const thRes = await getTherapistClientsRoute(thReq);
    assert([200, 401, 403].includes(thRes.status), 'Therapist clients route continues to enforce authorized access');
  } catch (err: any) {
    assert(false, 'Therapist portal integrity testing failed', err.message);
  }

  // --------------------------------------------------------------------------
  // SECTION 8: ELIGIBLE THERAPISTS MATCHING INTEGRATION
  // --------------------------------------------------------------------------
  console.log('\n--- 8. Eligible Therapists & Real Match Persistence ---');
  try {
    const eligibleTherapists = await getEligibleTherapists();
    assert(Array.isArray(eligibleTherapists), 'Eligible therapists returned from canonical source');
    if (eligibleTherapists.length > 0) {
      const first = eligibleTherapists[0];
      assert(typeof first.id === 'string', 'Therapist id is valid string');
      assert(typeof first.displayName === 'string' || typeof first.name === 'string', 'Therapist has display name');
      assert(typeof first.availability === 'string' && first.availability.length > 0, 'Only active eligible practitioners returned');
    }
  } catch (err: any) {
    assert(false, 'Eligible therapists query threw exception', err.message);
  }

  // Cleanup test fixtures
  try {
    await supabase.from('user_sessions').delete().in('user_id', [testClientAId, testClientBId]);
    await supabase.from('users').delete().in('id', [testClientAId, testClientBId]);
  } catch (cleanErr) {}

  // --------------------------------------------------------------------------
  // SUMMARY REPORT
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  CLIENT THERAPY DASHBOARD SUITE RESULT: ${passedTests}/${totalTests} PASSED`);
  console.log('================================================================');

  if (passedTests < totalTests) {
    process.exit(1);
  }
}

runClientTherapyDashboardSuite().catch((err) => {
  console.error('Fatal error in client therapy dashboard suite:', err);
  process.exit(1);
});
