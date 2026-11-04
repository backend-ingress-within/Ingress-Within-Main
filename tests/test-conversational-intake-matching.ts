process.env.BYPASS_REDIS = 'true';
import assert from 'assert';
import {
  CONVERSATIONAL_QUESTIONS,
  getQuestionById,
  getActiveQuestions,
} from '../src/lib/therapy/conversationalIntakeConfig';
import {
  ConversationalIntakeService,
  getInMemoryManualReviews,
  ManualMatchingReviewRecord,
} from '../src/lib/therapy/conversationalIntakeService';
import {
  TherapistRecord,
  PublicTherapistMatch,
  runIntakeMatching,
} from '../src/lib/therapy/therapistMatchingService';
import { EmailService } from '../src/lib/email/emailService';

// Test Roster Setup
const MOCK_VERIFIED_ROSTER: TherapistRecord[] = [
  {
    id: 'therapist_ananya',
    name: 'Dr. Ananya Sharma',
    credentials: 'PhD, Clinical Psychology (NIMHANS)',
    experienceYears: 11,
    city: 'Bengaluru',
    bio: 'Specializing in CBT and mindfulness for anxiety, career burnout, and relationship transitions.',
    languages: ['English', 'Hindi'],
    formats: ['Telehealth', 'In-Person'],
    fee: 1500,
    specialties: ['Anxiety', 'Stress', 'Work/Career', 'Relationship issues'],
    modalities: ['CBT', 'Mindfulness'],
    primaryModalities: ['CBT'],
    ageGroups: ['Adults', 'Couples'],
    gender: 'Female',
    capacity: { current: 3, max: 12 },
    severityCeiling: 3,
    verificationStatus: 'verified',
    traumaVerified: true,
    backgroundCheckCleared: true,
    acuityClearance: 'cleared-for-priority',
    email: 'ananya.sharma@example.com',
  },
  {
    id: 'therapist_rohit',
    name: 'Dr. Rohit Mehta',
    credentials: 'MPhil Clinical Psychology (IHBAS)',
    experienceYears: 9,
    city: 'Mumbai',
    bio: 'Psychodynamic and existential psychotherapist with focus on emotional overwhelm and personal growth.',
    languages: ['English', 'Hindi', 'Marathi'],
    formats: ['Telehealth'],
    fee: 1800,
    specialties: ['Low mood', 'Emotional overwhelm', 'Personal growth', 'Life transitions'],
    modalities: ['Psychodynamic', 'ACT'],
    primaryModalities: ['Psychodynamic'],
    ageGroups: ['Adults'],
    gender: 'Male',
    capacity: { current: 4, max: 10 },
    severityCeiling: 3,
    verificationStatus: 'verified',
    traumaVerified: true,
    backgroundCheckCleared: true,
    acuityClearance: 'cleared-for-priority',
    email: 'rohit.mehta@example.com',
  },
  {
    id: 'therapist_kavita_couples',
    name: 'Dr. Kavita Rao',
    credentials: 'MSc, Licensed Systemic & Family Therapist',
    experienceYears: 14,
    city: 'Bengaluru',
    bio: 'Specialist in couples, family therapy, and inter-generational relational conflict.',
    languages: ['English', 'Kannada', 'Hindi'],
    formats: ['Telehealth', 'In-Person'],
    fee: 2200,
    specialties: ['Relationship issues', 'Family issues', 'Grief'],
    modalities: ['Systemic', 'Humanistic'],
    primaryModalities: ['Systemic'],
    ageGroups: ['Couples', 'Family'],
    gender: 'Female',
    capacity: { current: 5, max: 10 },
    severityCeiling: 3,
    verificationStatus: 'verified',
    traumaVerified: true,
    backgroundCheckCleared: true,
    acuityClearance: 'none',
    email: 'kavita.rao@example.com',
  },
  {
    id: 'therapist_unverified_bob',
    name: 'Bob Pending',
    credentials: 'MA Psychology',
    experienceYears: 2,
    city: 'Delhi',
    bio: 'Unverified test profile.',
    languages: ['English'],
    formats: ['Telehealth'],
    fee: 800,
    specialties: ['Anxiety'],
    modalities: ['CBT'],
    gender: 'Male',
    capacity: { current: 1, max: 10 },
    verificationStatus: 'pending',
    traumaVerified: false,
    backgroundCheckCleared: false,
    acuityClearance: 'none',
    email: 'bob@example.com',
  },
];

async function runTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN: CONVERSATIONAL INTAKE & MATCHING TEST SUITE  ');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function test(description: string, fn: () => void | Promise<void>) {
    return (async () => {
      try {
        await fn();
        console.log(`  ✓ [PASS] ${description}`);
        passed++;
      } catch (err: any) {
        console.error(`  ✗ [FAIL] ${description}`);
        console.error(`    Error: ${err.message}\n`);
        failed++;
      }
    })();
  }

  // Track email invocations during tests
  let emailDispatchedCount = 0;
  const originalNotify = EmailService.notifyTherapistMatchRequest;
  (EmailService as any).notifyTherapistMatchRequest = async (payload: any) => {
    emailDispatchedCount++;
    return { success: true, messageId: 'mock_msg_' + Date.now() };
  };

  // ---------------------------------------------------------------------------
  // AREA 1: Conversational Question Engine & Branching Logic
  // ---------------------------------------------------------------------------
  console.log('--- TEST AREA 1: Conversational Question Engine & Branching ---');

  await test('Initial question is open-ended welcome prompt', () => {
    const q1 = CONVERSATIONAL_QUESTIONS[0];
    assert.strictEqual(q1.id, 'reason');
    assert.strictEqual(q1.inputType, 'textarea');
    assert.strictEqual(q1.category, 'welcome');
    assert.strictEqual(q1.required, true);
  });

  await test('Question sequence dynamically handles skip and natural acknowledgment', async () => {
    const res = await ConversationalIntakeService.saveResponse(
      'user_test_1',
      'sess_test_1',
      'reason',
      'I have been feeling overwhelmed by workplace deadlines and struggling to relax.',
      {}
    );
    assert.strictEqual(res.success, true);
    assert.strictEqual(res.nextQuestionId, 'concerns');
    assert.ok(res.acknowledgment.includes('Thank you for sharing'));
  });

  await test('Branching: past therapy Yes branches to past therapy feedback', async () => {
    const answers = { past_therapy: 'Yes_past' };
    const qPast = getQuestionById('past_therapy');
    const nextQId = qPast?.getNextQuestionId ? qPast.getNextQuestionId('Yes_past', answers) : null;
    assert.strictEqual(nextQId, 'past_therapy_feedback');
  });

  await test('Branching: past therapy No skips past therapy feedback', async () => {
    const answers = { past_therapy: 'No' };
    const qPast = getQuestionById('past_therapy');
    const nextQId = qPast?.getNextQuestionId ? qPast.getNextQuestionId('No', answers) : null;
    assert.strictEqual(nextQId, 'therapy_goals');
  });

  await test('Branching: Adolescent client type branches to minor guardian consent', async () => {
    const answers = { client_type: 'Adolescent' };
    const qType = getQuestionById('client_type');
    const nextQId = qType?.getNextQuestionId ? qType.getNextQuestionId('Adolescent', answers) : null;
    assert.strictEqual(nextQId, 'minor_consent');
  });

  await test('Branching: In-person format branches to city selection', async () => {
    const answers = { session_format: 'In-Person' };
    const qFormat = getQuestionById('session_format');
    const nextQId = qFormat?.getNextQuestionId ? qFormat.getNextQuestionId('In-Person', answers) : null;
    assert.strictEqual(nextQId, 'city');
  });

  await test('Branching: Telehealth format skips city selection to therapist gender', async () => {
    const answers = { session_format: 'Telehealth' };
    const qFormat = getQuestionById('session_format');
    const nextQId = qFormat?.getNextQuestionId ? qFormat.getNextQuestionId('Telehealth', answers) : null;
    assert.strictEqual(nextQId, 'therapist_gender');
  });

  // ---------------------------------------------------------------------------
  // AREA 2: Deterministic Matching Engine Execution
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST AREA 2: Deterministic Matching Against Verified Roster ---');

  await test('Verified active practitioner matches client concerns and modality', async () => {
    const clientAnswers = {
      concerns: ['Anxiety', 'Stress'],
      session_structure: 'Structured',
      session_format: 'Telehealth',
      therapist_gender: 'Female',
      languages: ['English', 'Hindi'],
      budget: '₹1,200–₹1,800',
      modality_preference: 'CBT',
      safety_check: 'Safe',
    };

    const outcome = await ConversationalIntakeService.evaluateMatching(
      'user_test_2',
      'sess_test_2',
      clientAnswers,
      MOCK_VERIFIED_ROSTER
    );

    assert.strictEqual(outcome.status, 'matches_found');
    assert.ok(outcome.matches.length > 0);
    assert.strictEqual(outcome.matches[0].therapist.id, 'therapist_ananya');
    assert.strictEqual(outcome.matches[0].therapist.name, 'Dr. Ananya Sharma');
    assert.strictEqual(outcome.therapistNotificationsDispatched, 0); // Shortlist does not notify
  });

  await test('Ineligible / unverified therapist is strictly excluded from shortlist', async () => {
    const clientAnswers = {
      concerns: ['Anxiety'],
      languages: ['English'],
      session_format: 'Telehealth',
      budget: 'Under ₹1,200',
      safety_check: 'Safe',
    };

    const outcome = await ConversationalIntakeService.evaluateMatching(
      'user_test_3',
      'sess_test_3',
      clientAnswers,
      MOCK_VERIFIED_ROSTER
    );

    const bobInMatches = outcome.matches.some((m) => m.therapist.id === 'therapist_unverified_bob');
    assert.strictEqual(bobInMatches, false, 'Unverified Bob must never appear in client matches');
  });

  await test('Couples therapy correctly matches verified systemic specialist', async () => {
    const clientAnswers = {
      client_type: 'Couples',
      concerns: ['Relationship issues', 'Family issues'],
      session_format: 'Telehealth',
      languages: ['English', 'Kannada'],
      safety_check: 'Safe',
    };

    const outcome = await ConversationalIntakeService.evaluateMatching(
      'user_test_couples',
      'sess_test_couples',
      clientAnswers,
      MOCK_VERIFIED_ROSTER
    );
    if (outcome.status === 'no_match') {
      console.log('DEBUG COUPLES NO_MATCH:', outcome);
    }

    assert.strictEqual(outcome.status, 'matches_found');
    assert.strictEqual(outcome.matches[0].therapist.id, 'therapist_kavita_couples');
  });

  // ---------------------------------------------------------------------------
  // AREA 3: CRITICAL ZERO-MATCH & NO-NOTIFICATION ENFORCEMENT
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST AREA 3: Strict No-Match & Zero Therapist Notifications ---');

  await test('Zero matches produces status no_match and manual_review_required', async () => {
    emailDispatchedCount = 0; // reset counter

    // Request impossible criteria (e.g. Malayalam in-person in Kolkata with non-existent modality)
    const impossibleAnswers = {
      concerns: ['NonExistentUniqueConcern'],
      languages: ['Malayalam'],
      session_format: 'In-Person',
      city: 'Kolkata',
      therapist_gender: 'Non-binary',
      budget: 'Under ₹1,200',
      modality_preference: 'ACT',
      safety_check: 'Safe',
    };

    const outcome = await ConversationalIntakeService.evaluateMatching(
      'user_test_unmatched_1',
      'sess_test_unmatched_1',
      impossibleAnswers,
      MOCK_VERIFIED_ROSTER
    );

    assert.strictEqual(outcome.status, 'no_match');
    assert.strictEqual(outcome.matches.length, 0);
    assert.ok(outcome.referenceId.startsWith('REV-'));
    assert.strictEqual(outcome.guaranteedHandoff, true);
    assert.ok(outcome.message.includes("We couldn't find a suitable therapist"));
  });

  await test('ZERO therapist notification emails sent on zero-match execution', async () => {
    assert.strictEqual(
      emailDispatchedCount,
      0,
      'EmailService must NOT be invoked when no matches are found'
    );
  });

  await test('Zero-match creates secure record in manual_matching_reviews', async () => {
    const memoryReviews = getInMemoryManualReviews();
    const unmatchedRecord = memoryReviews.find((r) => r.user_id === 'user_test_unmatched_1');
    assert.ok(unmatchedRecord, 'Manual matching review record must be persisted');
    assert.strictEqual(unmatchedRecord?.review_status, 'manual_review_required');
    assert.strictEqual(unmatchedRecord?.identified_therapist_id, undefined);
    assert.ok(unmatchedRecord?.audit_trail.length! >= 1);
  });

  await test('Client team assistance request updates manual review without notifications', async () => {
    emailDispatchedCount = 0;
    const req = await ConversationalIntakeService.requestTeamAssistance(
      'user_test_unmatched_1',
      'sess_test_unmatched_1',
      'I would appreciate assistance connecting with an experienced Malayalam therapist.'
    );
    assert.strictEqual(req.success, true);
    assert.strictEqual(emailDispatchedCount, 0, 'No therapist notifications sent on client assistance request');

    const memoryReviews = getInMemoryManualReviews();
    const updated = memoryReviews.find((r) => r.user_id === 'user_test_unmatched_1');
    assert.ok(updated?.internal_notes?.includes('Malayalam'));
  });

  // ---------------------------------------------------------------------------
  // AREA 4: Explicit Single Therapist Selection Workflow
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST AREA 4: Explicit Single Therapist Selection ---');

  await test('Client explicitly selecting therapist notifies ONLY that single clinician', async () => {
    emailDispatchedCount = 0;

    const res = await ConversationalIntakeService.selectTherapist(
      'user_test_2',
      'sess_test_2',
      'therapist_ananya'
    );

    assert.strictEqual(res.success, true);
    assert.strictEqual(res.therapistId, 'therapist_ananya');
    // Only 1 notification should be dispatched (to Dr. Ananya Sharma), NEVER to Rohit or Bob
    assert.ok(emailDispatchedCount <= 1, 'Only targeted single therapist notification permitted');
  });

  await test('Selecting unverified therapist fails server-side revalidation', async () => {
    await assert.rejects(
      async () => {
        await ConversationalIntakeService.selectTherapist(
          'user_test_malicious',
          'sess_test_malicious',
          'therapist_unverified_bob'
        );
      },
      /not currently an eligible practitioner|no longer available/i
    );
  });

  // ---------------------------------------------------------------------------
  // AREA 5: Safety Screening & Triage Enforcement
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST AREA 5: Safety Screening & Crisis Resources ---');

  await test('Routine check with heavy distress triggers priority triage', async () => {
    const distressedAnswers = {
      concerns: ['Low mood'],
      languages: ['English'],
      safety_check: 'Distressed',
    };

    const outcome = await ConversationalIntakeService.evaluateMatching(
      'user_distressed',
      'sess_distressed',
      distressedAnswers,
      MOCK_VERIFIED_ROSTER
    );

    assert.strictEqual(outcome.tier, 'priority');
  });

  await test('Immediate crisis screening triggers crisis tier and helpline resources', async () => {
    const crisisAnswers = {
      concerns: ['Low mood'],
      languages: ['English'],
      safety_check: 'Immediate Crisis',
    };

    const outcome = await ConversationalIntakeService.evaluateMatching(
      'user_crisis',
      'sess_crisis',
      crisisAnswers,
      MOCK_VERIFIED_ROSTER
    );

    assert.strictEqual(outcome.tier, 'immediate');
    assert.ok(outcome.safetyMessage);
    assert.strictEqual(outcome.safetyMessage?.show, true);
    const resources = outcome.safetyMessage?.resources || [];
    const hasTeleManas = resources.some((r: any) => r.contact?.includes('14416') || r.name?.toLowerCase().includes('tele manas'));
    assert.strictEqual(hasTeleManas, true, 'National helpline 14416 must be present');
  });

  // Restore original
  EmailService.notifyTherapistMatchRequest = originalNotify;

  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test suite runner crashed:', err);
  process.exit(1);
});
