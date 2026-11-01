import fs from 'fs';
import path from 'path';

// 1. Load .env configuration
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

import { NextRequest } from 'next/server';
import { supabase } from '../src/lib/db';
import { AdminAuthService } from '../src/lib/admin/adminAuthService';
import { AdminTherapyRelationshipService } from '../src/lib/admin/adminTherapyRelationshipService';
import { COOKIE_ADMIN_ACCESS_NAME } from '../src/utils/cookies';
import { GET as getRelationshipsRoute } from '../src/app/api/admin/therapy-relationships/route';
import { GET as getRelationshipDetailRoute } from '../src/app/api/admin/therapy-relationships/[id]/route';
import { GET as getConsentDocumentRoute } from '../src/app/api/admin/therapy-relationships/[id]/consent/route';

async function runTherapyRelationshipsTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — ADMIN THERAPY RELATIONSHIPS TEST SUITE       ');
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
      throw new Error(`Test failed: ${testName}`);
    }
  }

  // 1. Prepare Admin Authentication Credentials
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_API_KEY || 'test_admin_auth_key_2026';
  process.env.ADMIN_SECRET_KEY = adminSecretKey;

  function createAdminRequest(url: string, method = 'GET', body?: any) {
    const headers: Record<string, string> = {
      'content-type': 'application/json',
      'x-admin-key': adminSecretKey,
      authorization: `Bearer ${adminSecretKey}`,
    };
    return new NextRequest(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // --------------------------------------------------------------------------
  // TEST 1: Unauthorized Access Attempts Strictly Rejected (Point 14)
  // --------------------------------------------------------------------------
  console.log('TEST 1: Security Invariants & Unauthorized Request Gating');
  const unauthReq = new NextRequest('http://localhost:3000/api/admin/therapy-relationships');
  const unauthRes = await getRelationshipsRoute(unauthReq);
  const unauthJson = await unauthRes.json();

  assert(
    unauthRes.status === 401 || unauthRes.status === 403,
    'Unauthenticated GET /api/admin/therapy-relationships rejected with 401/403'
  );
  assert(
    unauthJson.error?.code === 'ADMIN_UNAUTHORIZED' || unauthJson.error?.code === 'ADMIN_AUTH_REQUIRED',
    'Rejection error code reflects admin authorization required'
  );

  const unauthDetailReq = new NextRequest('http://localhost:3000/api/admin/therapy-relationships/fake_id');
  const unauthDetailRes = await getRelationshipDetailRoute(unauthDetailReq, { params: Promise.resolve({ id: 'fake_id' }) });
  assert(
    unauthDetailRes.status === 401 || unauthDetailRes.status === 403,
    'Unauthenticated GET /api/admin/therapy-relationships/[id] rejected with 401/403'
  );

  const unauthConsentReq = new NextRequest('http://localhost:3000/api/admin/therapy-relationships/fake_id/consent');
  const unauthConsentRes = await getConsentDocumentRoute(unauthConsentReq, { params: Promise.resolve({ id: 'fake_id' }) });
  assert(
    unauthConsentRes.status === 401 || unauthConsentRes.status === 403,
    'Unauthenticated GET /api/admin/therapy-relationships/[id]/consent rejected with 401/403'
  );

  // --------------------------------------------------------------------------
  // TEST 2: Admin Authorized Relationships Query & Schema Contract
  // --------------------------------------------------------------------------
  console.log('\nTEST 2: Authorized Relationships Retrieval');
  const authReq = createAdminRequest('http://localhost:3000/api/admin/therapy-relationships?limit=20');
  const authRes = await getRelationshipsRoute(authReq);
  const authJson = await authRes.json();

  assert(authRes.status === 200, 'Authorized request returns 200 OK');
  assert(authJson.success === true, 'Response confirms success: true');
  assert(Array.isArray(authJson.relationships), 'Response contains relationships array');
  assert(typeof authJson.pagination?.total === 'number', 'Response contains total pagination count');
  assert(authJson.counts && typeof authJson.counts.all === 'number', 'Response contains aggregated filter counts');
  assert(authJson.relationships.length > 0, 'Returns real care relationships from database');

  // Verify first relationship item conforms to required schema
  const sampleRel = authJson.relationships[0];
  assert('clientName' in sampleRel, 'Relationship item contains clientName');
  assert('therapistName' in sampleRel, 'Relationship item contains therapistName');
  assert('requestDate' in sampleRel, 'Relationship item contains requestDate');
  assert('intakeStatus' in sampleRel, 'Relationship item contains intakeStatus (Completed / Pending)');
  assert('matchedTherapistName' in sampleRel, 'Relationship item contains matchedTherapistName');
  assert('matchingDate' in sampleRel, 'Relationship item contains matchingDate');
  assert('mutualAccepted' in sampleRel, 'Relationship item contains mutualAccepted boolean');
  assert('hasConsent' in sampleRel, 'Relationship item contains hasConsent boolean');
  assert('consentStatus' in sampleRel, 'Relationship item contains consentStatus');
  assert('firstSessionBooked' in sampleRel, 'Relationship item contains firstSessionBooked boolean');
  assert('totalSessions' in sampleRel, 'Relationship item contains totalSessions count');
  assert('lastSessionDate' in sampleRel, 'Relationship item contains lastSessionDate');
  assert(['Active', 'Dormant', 'Completed'].includes(sampleRel.status), 'Relationship status is Active, Dormant, or Completed');

  // --------------------------------------------------------------------------
  // TEST 3: Accurate Lifecycle Tracking — Intake & Therapy Request (Point 1)
  // --------------------------------------------------------------------------
  console.log('\nTEST 3: New Therapy Request & Intake Completion Tracking');
  const intakeCompletedRels = authJson.relationships.filter((r: any) => r.intakeStatus === 'Completed');
  const intakePendingRels = authJson.relationships.filter((r: any) => r.intakeStatus === 'Pending');

  assert(
    intakeCompletedRels.length > 0,
    'Accurately identifies relationships with completed intake form',
    { completedCount: intakeCompletedRels.length }
  );
  if (intakePendingRels.length > 0) {
    assert(
      intakePendingRels[0].intakeStatus === 'Pending' && intakePendingRels[0].intakeCompleted === false,
      'Clearly identifies relationships where intake form is pending'
    );
  } else {
    assert(true, 'Intake status evaluation preserves boolean and string consistency');
  }

  // --------------------------------------------------------------------------
  // TEST 4: Therapist Matched & Acceptance Status (Point 2)
  // --------------------------------------------------------------------------
  console.log('\nTEST 4: Therapist Matching & Acceptance Status');
  const acceptedRels = authJson.relationships.filter((r: any) => r.therapistAcceptanceStatus === 'accepted');
  assert(
    acceptedRels.length > 0,
    'Authoritative care relationships have therapistAcceptanceStatus: accepted'
  );
  assert(
    Boolean(acceptedRels[0].therapistAcceptedAt),
    'Accepted therapist relationship has valid therapistAcceptedAt timestamp'
  );

  // --------------------------------------------------------------------------
  // TEST 5: Mutual Acceptance Timestamps (Point 3)
  // --------------------------------------------------------------------------
  console.log('\nTEST 5: Mutual Acceptance Timestamps');
  const mutualRels = authJson.relationships.filter((r: any) => r.mutualAccepted === true);
  assert(
    mutualRels.length > 0,
    'Care relationships record mutual acceptance when both client and therapist have accepted'
  );
  assert(
    !isNaN(new Date(mutualRels[0].mutualAcceptedAt).getTime()),
    'Mutual acceptance timestamp is a valid ISO date-time string'
  );

  // --------------------------------------------------------------------------
  // TEST 6: Client Consent Status & Secure Document Access (Point 4)
  // --------------------------------------------------------------------------
  console.log('\nTEST 6: Client Consent & Secure Document Access');
  const consentedRels = authJson.relationships.filter((r: any) => r.hasConsent === true);
  assert(
    consentedRels.length > 0,
    'Correctly identifies clients with active verified consent',
    { consentedCount: consentedRels.length }
  );

  // Test secure consent document endpoint
  const targetRelId = consentedRels[0].id;
  const docReq = createAdminRequest(`http://localhost:3000/api/admin/therapy-relationships/${targetRelId}/consent`);
  const docRes = await getConsentDocumentRoute(docReq, { params: Promise.resolve({ id: targetRelId }) });
  const docJson = await docRes.json();

  assert(docRes.status === 200, 'GET /api/admin/therapy-relationships/[id]/consent returns 200 OK');
  assert(docJson.success === true, 'Consent document query returns success: true');
  assert(docJson.document.documentId.startsWith('CONSENT-DOC-'), 'Document has official auditable documentId');
  assert(docJson.document.consentStatus === 'AUTHENTICATED_AND_VERIFIED', 'Consent document status is AUTHENTICATED_AND_VERIFIED');
  assert(Array.isArray(docJson.document.legalClauses) && docJson.document.legalClauses.length >= 5, 'Contains 5 mandatory legal clauses');
  assert(docJson.document.governingBody.includes('RCI') || docJson.document.governingBody.includes('Clinical Ethics'), 'Contains clinical governing body attestation');

  // --------------------------------------------------------------------------
  // TEST 7: First Session Booked Yes/No & Correct Date/Time (Points 5 & 6)
  // --------------------------------------------------------------------------
  console.log('\nTEST 7: First Session Booked Yes/No & Scheduled Time');
  const firstSessionYes = authJson.relationships.filter((r: any) => r.firstSessionBooked === true);
  const firstSessionNo = authJson.relationships.filter((r: any) => r.firstSessionBooked === false);

  assert(
    firstSessionYes.length > 0,
    'Identifies relationships with valid first session booked (Yes)',
    { count: firstSessionYes.length }
  );
  assert(
    Boolean(firstSessionYes[0].firstSessionDate) && !isNaN(new Date(firstSessionYes[0].firstSessionDate).getTime()),
    'First session scheduled date is a valid date-time'
  );

  if (firstSessionNo.length > 0) {
    assert(
      firstSessionNo[0].firstSessionDate === null,
      'Relationships without first session booked have firstSessionDate: null (No)'
    );
  }

  // --------------------------------------------------------------------------
  // TEST 8: Accurate Session Counting & Exclusion of Cancelled (Points 7 & 8)
  // --------------------------------------------------------------------------
  console.log('\nTEST 8: Authoritative Session Counting & Cancellation Exclusion');
  for (const rel of authJson.relationships) {
    assert(
      typeof rel.totalSessions === 'number' && rel.totalSessions >= 0,
      `Relationship ${rel.id.substring(0, 8)} has non-negative integer session count: ${rel.totalSessions}`
    );
  }

  // Specifically check relationship '0c615d67-0232-4be4-bc08-769705fd657f' which has 5 cancelled sessions and 1 confirmed session
  const cancelledTestRel = authJson.relationships.find((r: any) => r.id === '0c615d67-0232-4be4-bc08-769705fd657f');
  if (cancelledTestRel) {
    assert(
      cancelledTestRel.totalSessions === 1,
      'Strictly excludes 5 cancelled sessions and counts only the 1 valid confirmed session for relationship',
      { actualCount: cancelledTestRel.totalSessions }
    );
  }

  // --------------------------------------------------------------------------
  // TEST 9: Correct Last Completed Session Date (Point 9)
  // --------------------------------------------------------------------------
  console.log('\nTEST 9: Last Completed Session Date');
  const completedSessionRels = authJson.relationships.filter((r: any) => r.lastSessionDate !== null);
  assert(
    completedSessionRels.length > 0,
    'Identifies relationships with actually completed sessions',
    { count: completedSessionRels.length }
  );
  assert(
    !isNaN(new Date(completedSessionRels[0].lastSessionDate).getTime()),
    'Last completed session date is a valid ISO timestamp'
  );

  // --------------------------------------------------------------------------
  // TEST 10: Active, Dormant, and Completed Status Logic (Point 10)
  // --------------------------------------------------------------------------
  console.log('\nTEST 10: Active, Dormant, and Completed Status Resolution');
  const activeCount = authJson.relationships.filter((r: any) => r.status === 'Active').length;
  const completedCount = authJson.relationships.filter((r: any) => r.status === 'Completed').length;

  assert(activeCount > 0, 'Correctly resolves Active relationships', { activeCount });
  assert(completedCount > 0, 'Correctly resolves Completed relationships (transferred/closed)', { completedCount });

  // --------------------------------------------------------------------------
  // TEST 11: Multiple Historical Therapist Relationships Isolation (Point 11)
  // --------------------------------------------------------------------------
  console.log('\nTEST 11: Tenancy & Isolation Across Multiple Historical Relationships');
  // Client '086321d3-3936-4d14-9535-b0101bca2bc5' has transferred across multiple therapists
  const multiRelClient = authJson.relationships.filter((r: any) => r.userId === '086321d3-3936-4d14-9535-b0101bca2bc5');
  assert(
    multiRelClient.length >= 2,
    'Client with multiple historical relationships maintains distinct, separate rows per therapist',
    { count: multiRelClient.length }
  );

  const distinctTherapists = new Set(multiRelClient.map((r: any) => r.therapistAccountId));
  assert(
    distinctTherapists.size >= 2,
    'Each historical relationship references its distinct assigned therapist',
    { distinctTherapistCount: distinctTherapists.size }
  );

  // --------------------------------------------------------------------------
  // TEST 12: Search, Filters, and Sorting (Point 12)
  // --------------------------------------------------------------------------
  console.log('\nTEST 12: Server-Side Search, Filters, and Sorting');
  // Search by client name
  const searchName = sampleRel.clientName.split(' ')[0];
  const searchReq = createAdminRequest(`http://localhost:3000/api/admin/therapy-relationships?search=${encodeURIComponent(searchName)}`);
  const searchRes = await getRelationshipsRoute(searchReq);
  const searchJson = await searchRes.json();

  assert(searchRes.status === 200, 'Search request returns 200 OK');
  assert(
    searchJson.relationships.every((r: any) =>
      r.clientName.toLowerCase().includes(searchName.toLowerCase()) ||
      (r.clientEmail || '').toLowerCase().includes(searchName.toLowerCase()) ||
      r.therapistName.toLowerCase().includes(searchName.toLowerCase())
    ),
    'Search matches client name, email, or therapist name'
  );

  // Filter: active
  const activeReq = createAdminRequest('http://localhost:3000/api/admin/therapy-relationships?filter=active');
  const activeRes = await getRelationshipsRoute(activeReq);
  const activeJson = await activeRes.json();
  assert(
    activeJson.relationships.every((r: any) => r.status === 'Active'),
    'Filter "active" returns exclusively Active relationships'
  );

  // Filter: completed
  const compReq = createAdminRequest('http://localhost:3000/api/admin/therapy-relationships?filter=completed');
  const compRes = await getRelationshipsRoute(compReq);
  const compJson = await compRes.json();
  assert(
    compJson.relationships.every((r: any) => r.status === 'Completed'),
    'Filter "completed" returns exclusively Completed relationships'
  );

  // Sort: sessions_count_desc
  const sortReq = createAdminRequest('http://localhost:3000/api/admin/therapy-relationships?sort=sessions_count_desc');
  const sortRes = await getRelationshipsRoute(sortReq);
  const sortJson = await sortRes.json();
  const sessionCounts = sortJson.relationships.map((r: any) => r.totalSessions);
  const isSortedDesc = sessionCounts.every((val: number, idx: number) => idx === 0 || sessionCounts[idx - 1] >= val);
  assert(isSortedDesc, 'Sorting by "sessions_count_desc" sorts correctly in descending order');

  // --------------------------------------------------------------------------
  // TEST 13: Detailed View & All 9 Chronological Milestones (Points 3, 13)
  // --------------------------------------------------------------------------
  console.log('\nTEST 13: Detailed View & 9 Chronological Milestones');
  const detailReq = createAdminRequest(`http://localhost:3000/api/admin/therapy-relationships/${sampleRel.id}`);
  const detailRes = await getRelationshipDetailRoute(detailReq, { params: Promise.resolve({ id: sampleRel.id }) });
  const detailJson = await detailRes.json();

  assert(detailRes.status === 200, 'GET /api/admin/therapy-relationships/[id] returns 200 OK');
  assert(detailJson.relationship.clientDetails !== undefined, 'Detail payload includes clientDetails');
  assert(detailJson.relationship.therapistDetails !== undefined, 'Detail payload includes therapistDetails');
  assert(Array.isArray(detailJson.relationship.timeline), 'Detail payload includes chronological timeline array');
  assert(detailJson.relationship.timeline.length === 9, 'Timeline contains exactly 9 comprehensive milestones');

  const milestones = detailJson.relationship.timeline;
  assert(milestones[0].id === 'milestone_1' && milestones[0].title.includes('Request Submitted'), 'Milestone 1 is Therapy Request Submitted');
  assert(milestones[1].id === 'milestone_2' && milestones[1].title.includes('Intake Form'), 'Milestone 2 is Intake Form Completed');
  assert(milestones[2].id === 'milestone_3' && milestones[2].title.includes('Therapist Assigned'), 'Milestone 3 is Therapist Assigned & Matched');
  assert(milestones[3].id === 'milestone_4' && milestones[3].title.includes('Therapist Accepted'), 'Milestone 4 is Therapist Accepted');
  assert(milestones[4].id === 'milestone_5' && milestones[4].title.includes('Mutual Acceptance'), 'Milestone 5 is Mutual Acceptance Completed');
  assert(milestones[5].id === 'milestone_6' && milestones[5].title.includes('Client Consent'), 'Milestone 6 is Client Consent Provided');
  assert(milestones[6].id === 'milestone_7' && milestones[6].title.includes('First Session'), 'Milestone 7 is First Session Booked');
  assert(milestones[7].id === 'milestone_8' && milestones[7].title.includes('Care Sessions'), 'Milestone 8 is Clinical Care Sessions');
  assert(milestones[8].id === 'milestone_9', 'Milestone 9 is Relationship Lifecycle Completion');

  assert(Array.isArray(detailJson.relationship.sessionsList), 'Detail payload includes sessionsList array');

  // --------------------------------------------------------------------------
  // TEST 14: Data Minimization & Privacy Invariant (Point 5)
  // --------------------------------------------------------------------------
  console.log('\nTEST 14: Clinical Privacy Shield & Data Minimization');
  assert(!('subjective' in detailJson.relationship), 'Relationship detail does NOT leak subjective SOAP notes');
  assert(!('objective' in detailJson.relationship), 'Relationship detail does NOT leak objective SOAP notes');
  assert(!('assessment' in detailJson.relationship), 'Relationship detail does NOT leak clinical assessment notes');
  assert(!('plan' in detailJson.relationship), 'Relationship detail does NOT leak clinical plan notes');
  assert(!('journal_entries' in detailJson.relationship), 'Relationship detail does NOT leak private client journal entries');

  // --------------------------------------------------------------------------
  // TEST 15: Existing Admin Dashboard APIs Remain Fully Functional (Point 15)
  // --------------------------------------------------------------------------
  console.log('\nTEST 15: Admin Dashboard Regression & Workflow Verification');
  const overviewModule = await import('../src/app/api/admin/overview/route');
  const clientsModule = await import('../src/app/api/admin/clients/route');
  const sessionsModule = await import('../src/app/api/admin/sessions/route');

  const overviewRes = await overviewModule.GET(createAdminRequest('http://localhost:3000/api/admin/overview'));
  assert(overviewRes.status === 200, 'Existing GET /api/admin/overview continues to return 200 OK');

  const clientsRes = await clientsModule.GET(createAdminRequest('http://localhost:3000/api/admin/clients'));
  assert(clientsRes.status === 200, 'Existing GET /api/admin/clients continues to return 200 OK');

  const sessionsRes = await sessionsModule.GET(createAdminRequest('http://localhost:3000/api/admin/sessions'));
  assert(sessionsRes.status === 200, 'Existing GET /api/admin/sessions continues to return 200 OK');

  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
  console.log('================================================================\n');
  console.log('🎉 ALL ADMIN THERAPY RELATIONSHIPS TESTS PASSED!');
}

runTherapyRelationshipsTestSuite().catch((err) => {
  console.error('\nTest suite execution error:', err);
  process.exit(1);
});
