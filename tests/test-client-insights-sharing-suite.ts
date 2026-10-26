import fs from 'fs';
import path from 'path';
import assert from 'assert';
import {
  ClientInsightConsentService,
  ClientInsightCategory,
} from '../src/lib/therapy/clientInsightConsentService';
import { supabase } from '../src/lib/db';

async function runTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — CONSENT-BASED CLIENT INSIGHTS SHARING SUITE  ');
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

  // --- SECTION 1: Migration 027 Schema & RLS Policies ---
  console.log('--- SECTION 1: Database Migration 027 Invariants ---');

  const migrationPath = path.join(
    process.cwd(),
    'src/lib/auth/migrations/027_client_insight_sharing_consents.sql'
  );

  await test('Migration 027 exists on disk', () => {
    assert(fs.existsSync(migrationPath), 'Migration 027 file must exist');
  });

  await test('Defines public.client_insight_sharing_consents table with category flags', () => {
    const content = fs.readFileSync(migrationPath, 'utf8');
    assert(content.includes('CREATE TABLE IF NOT EXISTS public.client_insight_sharing_consents'), 'Table definition missing');
    assert(content.includes('share_pattern_summary BOOLEAN'), 'share_pattern_summary column missing');
    assert(content.includes('share_emotional_vocabulary BOOLEAN'), 'share_emotional_vocabulary column missing');
    assert(content.includes('share_weekly_reports BOOLEAN'), 'share_weekly_reports column missing');
    assert(content.includes('share_monthly_reports BOOLEAN'), 'share_monthly_reports column missing');
  });

  await test('Enforces Row Level Security (RLS) on client insight consents', () => {
    const content = fs.readFileSync(migrationPath, 'utf8');
    assert(content.includes('ALTER TABLE public.client_insight_sharing_consents ENABLE ROW LEVEL SECURITY'), 'RLS must be enabled');
    assert(content.includes('Clients can view own insight sharing consents'), 'Client SELECT policy missing');
    assert(content.includes('Therapists can view active clients insight sharing consents'), 'Therapist active-relationship policy missing');
  });

  // --- SECTION 2: Client Explicit Affirmative Consent & Granular Categories ---
  console.log('\n--- SECTION 2: Consent Lifecycle & Granular Category Selection ---');

  ClientInsightConsentService._resetMemoryState();

  const testClient1 = 'test-client-uuid-1';
  const testTherapist1 = 'test-therapist-uuid-1';
  const testRel1 = 'test-rel-uuid-1';

  // Seed active care relationship in memory & DB
  ClientInsightConsentService.registerMockRelationship({
    id: testRel1,
    therapist_account_id: testTherapist1,
    user_id: testClient1,
    status: 'active',
    therapist_name: 'Dr. Test Therapist',
  });

  await test('1. Client explicitly consents to all four categories', async () => {
    const res = await ClientInsightConsentService.updateConsent({
      clientId: testClient1,
      isEnabled: true,
      categories: {
        patternSummary: true,
        emotionalVocabulary: true,
        weeklyReports: true,
        monthlyReports: true,
      },
      therapistAccountId: testTherapist1,
      relationshipId: testRel1,
    });

    assert.strictEqual(res.is_enabled, true);
    assert.strictEqual(res.share_pattern_summary, true);
    assert.strictEqual(res.share_emotional_vocabulary, true);
    assert.strictEqual(res.share_weekly_reports, true);
    assert.strictEqual(res.share_monthly_reports, true);
    assert.strictEqual(res.therapist_account_id, testTherapist1);
    assert(res.consented_at !== null, 'consented_at must be populated');
  });

  const testClient2 = 'test-client-uuid-2';
  const testRel2 = 'test-rel-uuid-2';
  ClientInsightConsentService.registerMockRelationship({
    id: testRel2,
    therapist_account_id: testTherapist1,
    user_id: testClient2,
    status: 'active',
  });

  await test('2. Client consents to only selected categories (Pattern Summary and Weekly Reports only)', async () => {
    const res = await ClientInsightConsentService.updateConsent({
      clientId: testClient2,
      isEnabled: true,
      categories: {
        patternSummary: true,
        emotionalVocabulary: false,
        weeklyReports: true,
        monthlyReports: false,
      },
      therapistAccountId: testTherapist1,
      relationshipId: testRel2,
    });

    assert.strictEqual(res.is_enabled, true);
    assert.strictEqual(res.share_pattern_summary, true);
    assert.strictEqual(res.share_emotional_vocabulary, false);
    assert.strictEqual(res.share_weekly_reports, true);
    assert.strictEqual(res.share_monthly_reports, false);
  });

  const testClient3 = 'test-client-uuid-3';
  ClientInsightConsentService.registerMockRelationship({
    id: 'test-rel-uuid-3',
    therapist_account_id: testTherapist1,
    user_id: testClient3,
    status: 'active',
  });
  await test('3. Client declines sharing (explicit negative or empty consent)', async () => {
    const res = await ClientInsightConsentService.updateConsent({
      clientId: testClient3,
      isEnabled: false,
      categories: {
        patternSummary: false,
        emotionalVocabulary: false,
        weeklyReports: false,
        monthlyReports: false,
      },
      therapistAccountId: testTherapist1,
    });

    assert.strictEqual(res.is_enabled, false);
    assert.strictEqual(res.share_pattern_summary, false);
    assert.strictEqual(res.share_emotional_vocabulary, false);
    assert.strictEqual(res.share_weekly_reports, false);
    assert.strictEqual(res.share_monthly_reports, false);
    assert(res.revoked_at !== null, 'revoked_at must be recorded');
  });

  await test('4. Client withdraws consent after previously granting it', async () => {
    // Previously testClient1 had granted all 4
    const withdrawn = await ClientInsightConsentService.withdrawConsent({
      clientId: testClient1,
    });

    assert.strictEqual(withdrawn.is_enabled, false);
    assert.strictEqual(withdrawn.share_pattern_summary, false);
    assert.strictEqual(withdrawn.share_emotional_vocabulary, false);
    assert.strictEqual(withdrawn.share_weekly_reports, false);
    assert.strictEqual(withdrawn.share_monthly_reports, false);
    assert(withdrawn.revoked_at !== null, 'revoked_at must be populated on withdrawal');

    const authCheck = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'pattern_summary',
    });

    assert.strictEqual(authCheck.authorized, false);
    assert.strictEqual(authCheck.consentGranted, false);
  });

  // Re-grant for further testing
  await ClientInsightConsentService.updateConsent({
    clientId: testClient1,
    isEnabled: true,
    categories: {
      patternSummary: true,
      emotionalVocabulary: false, // excluded
      weeklyReports: true,
      monthlyReports: false, // excluded
    },
    therapistAccountId: testTherapist1,
    relationshipId: testRel1,
  });

  // --- SECTION 3: Granular Category Server-Side Enforcement ---
  console.log('\n--- SECTION 3: Granular Category Authorization Checks ---');

  await test('5. Therapist can access a consented Pattern Summary', async () => {
    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'pattern_summary',
    });

    assert.strictEqual(check.authorized, true);
    assert.strictEqual(check.categoryAuthorized, true);
  });

  await test('6. Therapist cannot access a non-consented Pattern Summary (Client 3)', async () => {
    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient3,
      category: 'pattern_summary',
    });

    assert.strictEqual(check.authorized, false);
    assert.strictEqual(check.categoryAuthorized, false);
  });

  const testClient4 = 'test-client-uuid-4';

  await test('7. Therapist can access consented Emotional Vocabulary Summary when granted (Client 4)', async () => {
    ClientInsightConsentService.registerMockRelationship({
      id: 'test-rel-uuid-4',
      therapist_account_id: testTherapist1,
      user_id: testClient4,
      status: 'active',
    });

    await ClientInsightConsentService.updateConsent({
      clientId: testClient4,
      isEnabled: true,
      categories: {
        patternSummary: false,
        emotionalVocabulary: true,
        weeklyReports: false,
        monthlyReports: false,
      },
      therapistAccountId: testTherapist1,
    });

    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient4,
      category: 'emotional_vocabulary',
    });

    assert.strictEqual(check.authorized, true);
    assert.strictEqual(check.categoryAuthorized, true);
  });

  await test('8. Therapist cannot access non-consented Emotional Vocabulary data (Client 1 excluded it)', async () => {
    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'emotional_vocabulary',
    });

    assert.strictEqual(check.authorized, false);
    assert.strictEqual(check.categoryAuthorized, false);
    assert(check.reason?.includes('not authorized sharing for emotional vocabulary'));
  });

  await test('9. Weekly reports are visible only when that category is authorized', async () => {
    const checkClient1 = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'weekly_reports',
    });
    assert.strictEqual(checkClient1.authorized, true);

    const checkClient4 = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient4,
      category: 'weekly_reports',
    });
    assert.strictEqual(checkClient4.authorized, false);
  });

  await test('10. Monthly reports are visible only when that category is authorized', async () => {
    const checkClient1 = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'monthly_reports',
    });
    assert.strictEqual(checkClient1.authorized, false); // Client 1 did not consent to monthly

    // Grant monthly to client 1
    await ClientInsightConsentService.updateConsent({
      clientId: testClient1,
      isEnabled: true,
      categories: {
        patternSummary: true,
        emotionalVocabulary: true,
        weeklyReports: true,
        monthlyReports: true,
      },
      therapistAccountId: testTherapist1,
    });

    const checkClient1After = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'monthly_reports',
    });
    assert.strictEqual(checkClient1After.authorized, true);
  });

  // --- SECTION 4: Multi-Tenant Isolation & IDOR Defense ---
  console.log('\n--- SECTION 4: Multi-Tenant Isolation & IDOR Defense ---');

  const testTherapist2 = 'test-therapist-uuid-2';

  await test("11. Therapist A cannot access Therapist B's client's insights", async () => {
    // testClient1 belongs to testTherapist1, NOT testTherapist2
    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist2,
      clientId: testClient1,
      category: 'pattern_summary',
    });

    assert.strictEqual(check.authorized, false);
    assert(check.reason?.includes('not in your clinical caseload'));
  });

  await test('12. Changing client or relationship IDs in requests cannot bypass authorization', async () => {
    // Tampered client ID
    const fakeClientId = 'fake-client-999';
    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: fakeClientId,
      category: 'pattern_summary',
    });

    assert.strictEqual(check.authorized, false);
  });

  // --- SECTION 5: Relationship Lifecycle & Reassignment Guards ---
  console.log('\n--- SECTION 5: Relationship Lifecycle & Reassignment Protection ---');

  await test('13. An ended relationship cannot retain access', async () => {
    const testClientEnded = 'test-client-ended';
    ClientInsightConsentService.registerMockRelationship({
      id: 'test-rel-ended',
      therapist_account_id: testTherapist1,
      user_id: testClientEnded,
      status: 'terminated', // ended
    });

    await ClientInsightConsentService.updateConsent({
      clientId: testClientEnded,
      isEnabled: true,
      categories: {
        patternSummary: true,
        emotionalVocabulary: true,
        weeklyReports: true,
        monthlyReports: true,
      },
      therapistAccountId: testTherapist1,
    });

    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClientEnded,
      category: 'pattern_summary',
    });

    assert.strictEqual(check.authorized, false);
    assert(check.reason?.includes('Clinical relationship is terminated'));
  });

  await test('14. Reassignment does not accidentally transfer access (Requires renewed consent)', async () => {
    const testClientReassigned = 'test-client-reassigned';
    // Client consented while under Therapist 1
    await ClientInsightConsentService.updateConsent({
      clientId: testClientReassigned,
      isEnabled: true,
      categories: {
        patternSummary: true,
        emotionalVocabulary: true,
        weeklyReports: true,
        monthlyReports: true,
      },
      therapistAccountId: testTherapist1, // explicitly authorized only for therapist 1
    });

    // Client is now reassigned to Therapist 2
    ClientInsightConsentService.registerMockRelationship({
      id: 'test-rel-reassigned',
      therapist_account_id: testTherapist2,
      user_id: testClientReassigned,
      status: 'active',
    });

    // Therapist 2 attempts to view insights
    const check = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist2,
      clientId: testClientReassigned,
      category: 'pattern_summary',
    });

    assert.strictEqual(check.authorized, false);
    assert(check.reason?.includes('authorized for a different clinician') || check.reason?.includes('renewed authorization'));
  });

  await test('15. Consent changes invalidate cached or previously authorized responses', async () => {
    // When consent is updated or withdrawn, verify immediate revocation
    await ClientInsightConsentService.withdrawConsent({ clientId: testClient1 });

    const checkAfterRevoke = await ClientInsightConsentService.verifyTherapistAccess({
      therapistAccountId: testTherapist1,
      clientId: testClient1,
      category: 'pattern_summary',
    });

    assert.strictEqual(checkAfterRevoke.authorized, false);
    assert.strictEqual(checkAfterRevoke.consentGranted, false);
  });

  // --- SECTION 6: Empty States & Public Boundaries ---
  console.log('\n--- SECTION 6: Data Integrity & Surface Boundaries ---');

  await test('16. Missing summaries and reports produce safe empty states', async () => {
    // Re-enable for client 1
    await ClientInsightConsentService.updateConsent({
      clientId: testClient1,
      isEnabled: true,
      categories: {
        patternSummary: true,
        emotionalVocabulary: true,
        weeklyReports: true,
        monthlyReports: true,
      },
      therapistAccountId: testTherapist1,
    });

    const insights = await ClientInsightConsentService.getTherapistClientInsights(
      testTherapist1,
      testClient1
    );

    assert(insights.disclaimer.includes('not clinical diagnoses'), 'Disclaimer must be present');
    assert(insights.patternSummary !== undefined, 'Pattern summary object must be present');
    assert(insights.emotionalVocabulary !== undefined, 'Emotional vocabulary object must be present');
    assert(Array.isArray(insights.weeklyReports?.reports), 'Weekly reports must be an array');
    assert(Array.isArray(insights.monthlyReports?.reports), 'Monthly reports must be an array');
  });

  await test('17. Existing client onboarding and consent flows remain functional', () => {
    const onboardingFile = fs.readFileSync(
      path.join(process.cwd(), 'src/views/OnboardingPage.jsx'),
      'utf8'
    );
    assert(onboardingFile.includes('sharing_consent'), 'Onboarding sharing consent step present');
    assert(onboardingFile.includes('/api/user/insights-consent'), 'API call to insights consent present');
    assert(onboardingFile.includes('handleFinalizeOnboarding'), 'Onboarding finalization preserved');
  });

  await test('18. Existing therapist-client details and report experiences remain functional', () => {
    const modalFile = fs.readFileSync(
      path.join(process.cwd(), 'src/views/therapist/TherapistClientModal.jsx'),
      'utf8'
    );
    assert(modalFile.includes('TherapistClientInsightsView'), 'Insights view integrated into client modal');
    assert(modalFile.includes("id: 'insights'"), 'Insights tab registered in client modal tabs');
    assert(modalFile.includes("id: 'overview'"), 'Existing overview tab preserved');
    assert(modalFile.includes("id: 'journey'"), 'Existing journey tab preserved');
    assert(modalFile.includes("id: 'sessions'"), 'Existing sessions tab preserved');
    assert(modalFile.includes("id: 'soap'"), 'Existing soap tab preserved');
  });

  await test('19. Public booking endpoints never expose insight data', () => {
    const publicBookingRoute = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/therapy/book/[token]/route.ts'),
      'utf8'
    );
    assert(!publicBookingRoute.includes('insights'), 'Public booking must not reference client insights');
    assert(!publicBookingRoute.includes('pattern_summary'), 'Public booking must not reference pattern summary');
    assert(!publicBookingRoute.includes('emotional_vocabulary'), 'Public booking must not reference emotional vocabulary');
    assert(!publicBookingRoute.includes('weekly_summaries'), 'Public booking must not query weekly summaries');
  });

  await test('20. Clean API route handlers and responses', () => {
    const userConsentRoute = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/user/insights-consent/route.ts'),
      'utf8'
    );
    assert(userConsentRoute.includes('getAuthenticatedUser'), 'Client route requires authentication');
    assert(userConsentRoute.includes('Cache-Control'), 'Client route sets Cache-Control header');

    const therapistInsightsRoute = fs.readFileSync(
      path.join(process.cwd(), 'src/app/api/therapist/clients/[id]/insights/route.ts'),
      'utf8'
    );
    assert(therapistInsightsRoute.includes('requireAuthorizedTherapist'), 'Therapist route requires therapist authentication');
    assert(therapistInsightsRoute.includes('Cache-Control'), 'Therapist route sets Cache-Control header');
  });

  console.log('\n================================================================');
  console.log(`  CLIENT INSIGHTS SHARING RESULTS: ${passed}/${total} PASSING`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
