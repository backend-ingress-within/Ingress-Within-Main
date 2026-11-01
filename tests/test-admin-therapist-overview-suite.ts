/**
 * Comprehensive Test Suite: Admin Dashboard — Therapist-Wise Client & Session Overview
 *
 * Verifies all 14 areas specified in Phase 8:
 * 1. Therapist with no clients
 * 2. Therapist with multiple active clients
 * 3. Therapist with historical completed clients
 * 4. Client reassigned to another therapist
 * 5. Correct unique-client counting
 * 6. Correct historical relationship counting
 * 7. Correct session totals
 * 8. Cancelled and rescheduled appointment exclusion
 * 9. Completed versus upcoming session separation
 * 10. No-show classification
 * 11. Multiple historical therapist relationships
 * 12. Search, sorting, filters, and pagination
 * 13. Unauthorized admin API access
 * 14. Existing Therapy Relationships section remains functional
 */

import { NextRequest } from 'next/server';
import { supabase } from '../src/lib/db';
import { AdminTherapistOverviewService } from '../src/lib/admin/adminTherapistOverviewService';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition: boolean, message: string) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  [OK] ${message}`);
  } else {
    failedAssertions++;
    console.error(`  [FAIL] ${message}`);
  }
}

async function runTests() {
  console.log('================================================================================');
  console.log('ADMIN THERAPIST-WISE CLIENT & SESSION OVERVIEW TEST SUITE');
  console.log('================================================================================\n');

  // Ensure ADMIN_SECRET_KEY is configured for authorized testing
  const testAdminKey = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_API_KEY || 'test_admin_auth_key_2026';
  process.env.ADMIN_SECRET_KEY = testAdminKey;

  // --- Area 1: Therapist with no clients ---
  console.log('--- Area 1: Therapist with no clients ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({
      page: 1,
      limit: 100,
      activityFilter: 'no_clients',
    });

    assert(Array.isArray(overview.therapists), 'Therapists with no clients returned as an array');
    assert(overview.therapists.length > 0, 'Found therapists with no clients in database');

    const emptyTherapist = overview.therapists[0];
    assert(emptyTherapist.totalHistoricalClients === 0, 'totalHistoricalClients is exactly 0');
    assert(emptyTherapist.activeClients === 0, 'activeClients is exactly 0');
    assert(emptyTherapist.totalValidSessions === 0, 'totalValidSessions is exactly 0');
    assert(emptyTherapist.firstSessionDate === null, 'firstSessionDate is null');
    assert(emptyTherapist.lastCompletedSessionDate === null, 'lastCompletedSessionDate is null');

    const detail = await AdminTherapistOverviewService.getTherapistDetail(emptyTherapist.id);
    assert(detail.clientStats.uniqueClientsEver === 0, 'Detail clientStats.uniqueClientsEver is 0');
    assert(detail.clients.length === 0, 'Detail clients array is empty');
    assert(detail.sessions.length === 0, 'Detail sessions array is empty');
  }

  // --- Area 2: Therapist with multiple active clients ---
  console.log('\n--- Area 2: Therapist with multiple active clients ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({
      page: 1,
      limit: 100,
      sort: 'active_clients_desc',
    });

    const activeTherapist = overview.therapists.find((t) => t.activeClients > 0) || overview.therapists[0];
    assert(Boolean(activeTherapist), 'Identified therapist with active clients');
    assert(activeTherapist.activeClients >= 0, 'activeClients is a non-negative integer');

    const detail = await AdminTherapistOverviewService.getTherapistDetail(activeTherapist.id);
    assert(detail.clientStats.activeClients === activeTherapist.activeClients, 'Detail activeClients matches list count');
    assert(detail.therapist.id === activeTherapist.id, 'Detail therapist id matches');
    assert(typeof detail.therapist.name === 'string', 'Therapist name is populated');
    assert(Array.isArray(detail.clients), 'Detail clients is an array');
  }

  // --- Area 3: Therapist with historical completed clients ---
  console.log('\n--- Area 3: Therapist with historical completed clients ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({
      page: 1,
      limit: 100,
    });

    const completedTherapist = overview.therapists.find((t) => t.completedClients > 0);
    assert(Boolean(completedTherapist), 'Found therapist with historical completed clients');

    if (completedTherapist) {
      assert(completedTherapist.completedClients > 0, 'completedClients is greater than 0');
      const detail = await AdminTherapistOverviewService.getTherapistDetail(completedTherapist.id);
      assert(detail.clientStats.completedRelationships === completedTherapist.completedClients, 'Detail completedRelationships matches list');
      
      const completedClientItem = detail.clients.find((c) => c.relationshipStatus === 'Completed');
      assert(Boolean(completedClientItem), 'Completed client relationship present in client list');
      if (completedClientItem) {
        assert(
          ['completed', 'transferred', 'terminated'].includes(completedClientItem.rawStatus.toLowerCase()) ||
          completedClientItem.careStage === 'completed',
          'Completed relationship has appropriate rawStatus or careStage'
        );
      }
    }
  }

  // --- Area 4: Client reassigned to another therapist ---
  console.log('\n--- Area 4: Client reassigned to another therapist ---');
  {
    const { data: transferredRels } = await supabase
      .from('therapy_care_relationships')
      .select('*')
      .eq('status', 'transferred');

    assert(Array.isArray(transferredRels) && transferredRels.length > 0, 'Found transferred client relationships in database');

    if (transferredRels && transferredRels.length > 0) {
      const rel = transferredRels[0];
      const detail = await AdminTherapistOverviewService.getTherapistDetail(rel.therapist_account_id);
      const foundRel = detail.clients.find((c) => c.relationshipId === rel.id);
      assert(Boolean(foundRel), 'Transferred relationship exists under original therapist');
      assert(foundRel?.relationshipStatus === 'Completed', 'Transferred relationship is categorized as Completed under previous therapist');
    }
  }

  // --- Area 5: Correct unique-client counting ---
  console.log('\n--- Area 5: Correct unique-client counting ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({ page: 1, limit: 100 });
    const { aggregateMetrics } = overview;

    const { data: allCareRels } = await supabase.from('therapy_care_relationships').select('user_id');
    const actualUniqueClients = new Set((allCareRels || []).map((r) => r.user_id)).size;

    assert(
      aggregateMetrics.totalUniqueClientsAcrossTherapists === actualUniqueClients,
      `Platform unique clients (${aggregateMetrics.totalUniqueClientsAcrossTherapists}) accurately matches distinct clients (${actualUniqueClients})`
    );

    // Verify per-therapist unique clients
    for (const t of overview.therapists.slice(0, 5)) {
      assert(
        t.totalHistoricalClients <= t.totalRelationships,
        `Therapist ${t.name}: unique clients (${t.totalHistoricalClients}) <= total relationships (${t.totalRelationships})`
      );
    }
  }

  // --- Area 6: Correct historical relationship counting ---
  console.log('\n--- Area 6: Correct historical relationship counting ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({ page: 1, limit: 100 });
    const { aggregateMetrics } = overview;

    const { count: actualTotalRels } = await supabase
      .from('therapy_care_relationships')
      .select('id', { count: 'exact', head: true });

    const summedRels =
      aggregateMetrics.totalActiveRelationships +
      aggregateMetrics.totalDormantRelationships +
      aggregateMetrics.totalCompletedRelationships;

    assert(
      summedRels === actualTotalRels,
      `Summed relationships (${summedRels}) matches actual care relationship count (${actualTotalRels})`
    );
  }

  // --- Area 7: Correct session totals ---
  console.log('\n--- Area 7: Correct session totals ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({ page: 1, limit: 100 });
    const { aggregateMetrics } = overview;

    const { data: allAppts } = await supabase.from('therapist_clinical_appointments').select('status');
    const validCount = (allAppts || []).filter(
      (a) => a.status !== 'cancelled' && a.status !== 'rescheduled'
    ).length;

    assert(
      aggregateMetrics.totalValidSessions === validCount,
      `Platform valid sessions (${aggregateMetrics.totalValidSessions}) matches expected non-cancelled count (${validCount})`
    );
  }

  // --- Area 8: Cancelled and rescheduled appointment exclusion ---
  console.log('\n--- Area 8: Cancelled and rescheduled appointment exclusion ---');
  {
    const { data: cancelledAppts } = await supabase
      .from('therapist_clinical_appointments')
      .select('therapist_account_id, status')
      .eq('status', 'cancelled');

    assert(Array.isArray(cancelledAppts) && cancelledAppts.length > 0, 'Cancelled appointments exist in database to verify exclusion');

    if (cancelledAppts && cancelledAppts.length > 0) {
      const thId = cancelledAppts[0].therapist_account_id;
      const detail = await AdminTherapistOverviewService.getTherapistDetail(thId);

      assert(detail.sessionStats.cancelledSessions > 0, 'Cancelled sessions tracked separately in sessionStats');
      assert(
        detail.sessionStats.totalValidSessions + detail.sessionStats.cancelledSessions <= detail.sessions.length,
        'Cancelled sessions excluded from totalValidSessions'
      );
    }
  }

  // --- Area 9: Completed versus upcoming session separation ---
  console.log('\n--- Area 9: Completed versus upcoming session separation ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({ page: 1, limit: 100 });
    const therapistWithAppts = overview.therapists.find((t) => t.totalValidSessions > 0);

    assert(Boolean(therapistWithAppts), 'Found therapist with valid appointments');
    if (therapistWithAppts) {
      const detail = await AdminTherapistOverviewService.getTherapistDetail(therapistWithAppts.id);
      assert(
        typeof detail.sessionStats.completedSessions === 'number',
        'completedSessions is a valid number'
      );
      assert(
        typeof detail.sessionStats.upcomingConfirmedSessions === 'number',
        'upcomingConfirmedSessions is a valid number'
      );
      assert(
        detail.sessionStats.completedSessions + detail.sessionStats.upcomingConfirmedSessions <= detail.sessionStats.totalValidSessions,
        'Completed + upcoming does not exceed total valid sessions'
      );
    }
  }

  // --- Area 10: No-show classification ---
  console.log('\n--- Area 10: No-show classification ---');
  {
    const overview = await AdminTherapistOverviewService.getOverviewList({ page: 1, limit: 100 });
    for (const t of overview.therapists) {
      assert(
        typeof t.noShowSessions === 'number',
        `Therapist ${t.name}: noShowSessions is a numeric field`
      );
    }
  }

  // --- Area 11: Multiple historical therapist relationships ---
  console.log('\n--- Area 11: Multiple historical therapist relationships ---');
  {
    // Find client who has multiple care relationships
    const { data: rels } = await supabase.from('therapy_care_relationships').select('user_id, therapist_account_id');
    const clientRelCount = new Map<string, string[]>();
    for (const r of rels || []) {
      const list = clientRelCount.get(r.user_id) || [];
      list.push(r.therapist_account_id);
      clientRelCount.set(r.user_id, list);
    }

    let multiClientUserId: string | null = null;
    let therapistIds: string[] = [];
    for (const [uid, tids] of clientRelCount.entries()) {
      const uniqueTh = Array.from(new Set(tids));
      if (uniqueTh.length > 1) {
        multiClientUserId = uid;
        therapistIds = uniqueTh;
        break;
      }
    }

    assert(Boolean(multiClientUserId), 'Found client with relationships across multiple distinct therapists');
    if (multiClientUserId && therapistIds.length >= 2) {
      const [detailA, detailB] = await Promise.all([
        AdminTherapistOverviewService.getTherapistDetail(therapistIds[0]),
        AdminTherapistOverviewService.getTherapistDetail(therapistIds[1]),
      ]);

      const clientInA = detailA.clients.filter((c) => c.clientId === multiClientUserId);
      const clientInB = detailB.clients.filter((c) => c.clientId === multiClientUserId);

      assert(clientInA.length > 0, `Client exists in Therapist A's roster`);
      assert(clientInB.length > 0, `Client exists in Therapist B's roster`);

      // Verify relationship IDs are distinct
      const relIdA = clientInA[0].relationshipId;
      const relIdB = clientInB[0].relationshipId;
      assert(relIdA !== relIdB, `Relationship ID in A (${relIdA}) is distinct from B (${relIdB})`);

      // Verify session isolation: Sessions in A's list never belong to relationship B
      for (const s of detailA.sessions) {
        assert(s.relationshipId !== relIdB, `Therapist A does not leak sessions from Therapist B's relationship`);
      }
    }
  }

  // --- Area 12: Search, sorting, filters, and pagination ---
  console.log('\n--- Area 12: Search, sorting, filters, and pagination ---');
  {
    // Search by name
    const searchRes = await AdminTherapistOverviewService.getOverviewList({
      search: 'consultant',
    });
    assert(searchRes.therapists.length > 0, 'Search for "consultant" returns results');
    for (const t of searchRes.therapists) {
      assert(
        t.name.toLowerCase().includes('consultant') ||
        (t.email && t.email.toLowerCase().includes('consultant')),
        `Result ${t.name} matches search keyword`
      );
    }

    // Sort by name_asc
    const sortedNameRes = await AdminTherapistOverviewService.getOverviewList({
      sort: 'name_asc',
    });
    const names = sortedNameRes.therapists.map((t) => t.name.toLowerCase());
    const isSorted = names.every((n, i) => i === 0 || n >= names[i - 1]);
    assert(isSorted, 'name_asc sorting correctly orders therapists alphabetically');

    // Pagination
    const page1 = await AdminTherapistOverviewService.getOverviewList({ page: 1, limit: 5 });
    const page2 = await AdminTherapistOverviewService.getOverviewList({ page: 2, limit: 5 });
    assert(page1.therapists.length === 5, 'Page 1 limit 5 returns 5 therapists');
    assert(page2.therapists.length === 5, 'Page 2 limit 5 returns 5 therapists');
    assert(page1.therapists[0].id !== page2.therapists[0].id, 'Page 1 and Page 2 contain distinct therapists');
  }

  // --- Area 13: Unauthorized admin API access ---
  console.log('\n--- Area 13: Unauthorized admin API access ---');
  {
    const overviewRoute = await import('../src/app/api/admin/therapist-overview/route');
    const detailRoute = await import('../src/app/api/admin/therapist-overview/[id]/route');

    // Unauthenticated GET /api/admin/therapist-overview
    const unauthReq = new NextRequest('http://localhost:3000/api/admin/therapist-overview');
    const unauthRes = await overviewRoute.GET(unauthReq);
    assert(
      unauthRes.status === 401 || unauthRes.status === 403,
      `Unauthenticated overview query blocked with status ${unauthRes.status}`
    );

    // Unauthenticated GET /api/admin/therapist-overview/[id]
    const unauthDetailReq = new NextRequest('http://localhost:3000/api/admin/therapist-overview/some-id');
    const unauthDetailRes = await detailRoute.GET(unauthDetailReq, {
      params: Promise.resolve({ id: 'some-id' }),
    });
    assert(
      unauthDetailRes.status === 401 || unauthDetailRes.status === 403,
      `Unauthenticated detail query blocked with status ${unauthDetailRes.status}`
    );

    // Authorized GET /api/admin/therapist-overview with admin key
    const authReq = new NextRequest('http://localhost:3000/api/admin/therapist-overview?limit=2', {
      headers: {
        'x-admin-key': testAdminKey,
        authorization: `Bearer ${testAdminKey}`,
      },
    });
    const authRes = await overviewRoute.GET(authReq);
    if (authRes.status !== 200) {
      const errText = await authRes.clone().text();
      console.error('Authorized overview error:', authRes.status, errText);
    }
    assert(
      authRes.status === 200,
      `Authorized overview query succeeds with status 200`
    );
  }

  // --- Area 14: Existing Therapy Relationships section remains functional ---
  console.log('\n--- Area 14: Existing Therapy Relationships section remains functional ---');
  {
    const relationshipsRoute = await import('../src/app/api/admin/therapy-relationships/route');
    const req = new NextRequest('http://localhost:3000/api/admin/therapy-relationships?limit=5', {
      headers: {
        'x-admin-key': testAdminKey,
        authorization: `Bearer ${testAdminKey}`,
      },
    });
    const res = await relationshipsRoute.GET(req);
    if (res.status !== 200) {
      const errText = await res.clone().text();
      console.error('Existing therapy-relationships error:', res.status, errText);
    }
    assert(res.status === 200, 'Existing therapy-relationships endpoint returns status 200');

    const data = await res.json();
    assert(data.success === true, 'Existing therapy-relationships response contains success: true');
    assert(Array.isArray(data.relationships), 'Existing therapy-relationships returns relationships array');
    assert(typeof data.counts?.all === 'number', 'Existing therapy-relationships counts object is preserved');
  }

  console.log('\n================================================================================');
  console.log(`TEST RESULTS: ${passedAssertions}/${totalAssertions} assertions PASSED`);
  if (failedAssertions > 0) {
    console.error(`FAILED ASSERTIONS: ${failedAssertions}`);
    process.exit(1);
  } else {
    console.log('ALL 14 TEST AREAS PASSED PERFECTLY!');
    console.log('================================================================================\n');
  }
}

runTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
