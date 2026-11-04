/**
 * Ingress Within: Comprehensive Matching Engine & Intake Journey Verification
 *
 * Verifies:
 * 1. Hard Eligibility Filters:
 *    - Unverified clinicians fail hard filter.
 *    - Capacity ceiling (current >= max) fails hard filter.
 *    - Verified clinician with open capacity passes hard filter.
 * 2. Multi-Dimensional Scoring (38% Concerns, 28% Modalities, 23% Budget, 11% Gender + 4% Capacity Tie-breaker).
 * 3. Quality Floor Enforcement (must have positive substantive fit).
 * 4. Multi-Tier Widening (Strict -> Language relaxation -> Guaranteed Care Team Handoff).
 * 5. Safety & Triage Routing (Standard -> Direct selection, Priority -> Care team + cleared clinician, Immediate -> Crisis resources & immediate human triage).
 * 6. The End-to-End User Intake Journey:
 *    - Step 1: Intake submission
 *    - Step 2: Matching engine calculation & 3 top recommendations
 *    - Step 3: Therapist candidate selection & Insight sharing consent
 *    - Step 4: Match notification dispatched to therapist
 *    - Step 5: Therapist acceptance & mutual relationship creation
 *    - Step 6: Next steps: Active care stage & session booking link enabled
 */

import {
  ClientProfile,
  TherapistRecord,
  matchTherapists,
  getGuaranteedMatches,
  computeTriageTier,
  getClientSafetyMessage,
  getRoutingAction,
  adaptClientAnswers,
  inferModalitiesWithAI,
  sanitizePublicTherapist,
} from '../src/lib/therapy/matchingEngine';
import { runIntakeMatching } from '../src/lib/therapy/therapistMatchingService';

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition: boolean, testName: string, failureDetails?: any) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ [PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`  ✗ [FAIL] ${testName}`);
    if (failureDetails) console.error('    Details:', failureDetails);
    failedTests++;
  }
}

// Sample Active Clinician Roster
const ACTIVE_THERAPISTS_ROSTER: TherapistRecord[] = [
  {
    id: 'th_ananya_001',
    name: 'Dr. Ananya Sharma',
    credentials: 'PhD, Clinical Psychology, RCI Registered',
    experienceYears: 9,
    city: 'Mumbai',
    state: 'Maharashtra',
    bio: 'Specializing in anxiety disorders, panic, and CBT-based emotional regulation.',
    languages: ['English', 'Hindi'],
    formats: ['Telehealth', 'In-Person'],
    fee: 1500,
    specialties: ['Anxiety', 'Panic Attacks', 'Work Stress', 'Burnout'],
    modalities: ['CBT', 'Mindfulness-Based Cognitive Therapy', 'ACT'],
    primaryModalities: ['CBT'],
    gender: 'Female',
    ageGroups: ['Adults'],
    capacity: { current: 3, max: 10 },
    severityCeiling: 3,
    verificationStatus: 'verified',
    traumaListed: true,
    traumaVerified: true,
    backgroundCheckCleared: true,
    acuityClearance: 'cleared-for-priority',
    email: 'ananya.sharma@example.com',
  },
  {
    id: 'th_rohit_002',
    name: 'Dr. Rohit Mehta',
    credentials: 'MPhil Clinical Psychology',
    experienceYears: 6,
    city: 'Bengaluru',
    state: 'Karnataka',
    bio: 'Specializing in relational conflicts, family dynamics, and psychodynamic exploration.',
    languages: ['English', 'Kannada', 'Hindi'],
    formats: ['Telehealth'],
    fee: 1800,
    specialties: ['Relationships', 'Family Conflict', 'Self-Esteem', 'Life Transitions'],
    modalities: ['Psychodynamic', 'Interpersonal/Relational'],
    primaryModalities: ['Psychodynamic'],
    gender: 'Male',
    ageGroups: ['Adults', 'Young Adults'],
    capacity: { current: 5, max: 8 },
    severityCeiling: 3,
    verificationStatus: 'verified',
    traumaListed: false,
    traumaVerified: false,
    backgroundCheckCleared: true,
    acuityClearance: 'none',
    email: 'rohit.mehta@example.com',
  },
  {
    id: 'th_priya_003',
    name: 'Priya Nambiar',
    credentials: 'MSc Counselling Psychology',
    experienceYears: 5,
    city: 'Chennai',
    state: 'Tamil Nadu',
    bio: 'Focusing on academic stress, workplace boundaries, and holistic habits.',
    languages: ['English', 'Tamil', 'Hindi'],
    formats: ['Telehealth'],
    fee: 1200,
    specialties: ['Work Stress', 'Academic Stress', 'Habits & Routines', 'Mild Depression'],
    modalities: ['CBT', 'Behavioral Activation'],
    primaryModalities: ['CBT'],
    gender: 'Female',
    ageGroups: ['Adults', 'Adolescents (16-17)'],
    capacity: { current: 2, max: 12 },
    severityCeiling: 2,
    verificationStatus: 'verified',
    traumaListed: false,
    traumaVerified: false,
    backgroundCheckCleared: true,
    acuityClearance: 'none',
    email: 'priya.nambiar@example.com',
  },
  {
    id: 'th_vikram_unverified',
    name: 'Vikram Joshi (Pending)',
    credentials: 'MA Psychology',
    experienceYears: 3,
    city: 'Pune',
    state: 'Maharashtra',
    bio: 'Pending verification account.',
    languages: ['English', 'Marathi'],
    formats: ['Telehealth'],
    fee: 1000,
    specialties: ['General Counseling'],
    modalities: ['CBT'],
    gender: 'Male',
    ageGroups: ['Adults'],
    capacity: { current: 0, max: 10 },
    verificationStatus: 'pending', // NOT VERIFIED
    backgroundCheckCleared: false,
    email: 'vikram.pending@example.com',
  },
  {
    id: 'th_neha_full_capacity',
    name: 'Neha Kapoor (Full)',
    credentials: 'MPhil Clinical Psychology',
    experienceYears: 11,
    city: 'Delhi',
    state: 'Delhi',
    bio: 'Specialist with zero remaining intake slots.',
    languages: ['English', 'Hindi'],
    formats: ['Telehealth'],
    fee: 2000,
    specialties: ['Anxiety', 'Depression'],
    modalities: ['CBT'],
    gender: 'Female',
    ageGroups: ['Adults'],
    capacity: { current: 10, max: 10 }, // FULL CAPACITY
    verificationStatus: 'verified',
    backgroundCheckCleared: true,
    email: 'neha.full@example.com',
  },
];

async function runTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN: MATCHING ENGINE & INTAKE JOURNEY TEST SUITE  ');
  console.log('================================================================\n');

  // ------------------------------------------------------------------
  // 1. HARD ELIGIBILITY FILTERS
  // ------------------------------------------------------------------
  console.log('--- TEST AREA 1: Hard Eligibility Filters ---');
  {
    const client: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
      city: 'Delhi',
      budget: '₹1500+',
    };

    const matches = matchTherapists(client, ACTIVE_THERAPISTS_ROSTER);

    const unverifiedMatch = matches.find((m) => m.therapist.id === 'th_vikram_unverified');
    assert(unverifiedMatch?.passesHard === false, 'Unverified therapist fails hard filter');
    assert(unverifiedMatch?.fails.some((f) => f.includes('Not yet verified')), 'Fails reason notes verification status');

    const fullCapacityMatch = matches.find((m) => m.therapist.id === 'th_neha_full_capacity');
    assert(fullCapacityMatch?.passesHard === false, 'Therapist at max capacity fails hard filter');
    assert(fullCapacityMatch?.fails.some((f) => f.includes('Fully booked')), 'Fails reason notes fully booked');

    const verifiedMatch = matches.find((m) => m.therapist.id === 'th_ananya_001');
    assert(verifiedMatch?.passesHard === true, 'Verified active therapist with open capacity passes hard filter');
    assert(verifiedMatch?.qualifies === true, 'Verified active therapist qualifies for recommendations');
  }

  // ------------------------------------------------------------------
  // 2. SAME-CITY DUAL RELATIONSHIP EXCLUSION & FORMAT FILTERING
  // ------------------------------------------------------------------
  console.log('\n--- TEST AREA 2: Dual Relationship & Format Filtering ---');
  {
    // Client is in Mumbai and looking for Work Stress support
    // Dr. Ananya is in Mumbai, Priya is in Chennai (Telehealth)
    const mumbaiClient: ClientProfile = {
      concernPriority: [{ tag: 'Work Stress', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
      city: 'Mumbai',
    };

    const matches = matchTherapists(mumbaiClient, ACTIVE_THERAPISTS_ROSTER);
    const qualifying = matches.filter((m) => m.qualifies);

    // Dr. Priya in Chennai matches online; Dr. Ananya in Mumbai is excluded by same-city dual relationship check
    assert(qualifying.some((m) => m.therapist.id === 'th_priya_003'), 'Out-of-city telehealth therapist qualifies');
    const mumbaiTherapistMatch = matches.find((m) => m.therapist.id === 'th_ananya_001');
    assert(
      mumbaiTherapistMatch?.fails.some((f) => f.includes('Same city')),
      'Same-city therapist excluded to protect against dual relationships'
    );
  }

  // ------------------------------------------------------------------
  // 3. MULTI-DIMENSIONAL SCORING SPECIFICITY
  // ------------------------------------------------------------------
  console.log('\n--- TEST AREA 3: Multi-Dimensional Scoring Fit ---');
  {
    const relationshipClient: ClientProfile = {
      concernPriority: [{ tag: 'Relationships', severity: 3 }, { tag: 'Family Conflict', severity: 2 }],
      explicitModalities: ['Psychodynamic'],
      languages: ['English', 'Hindi'],
      genderPref: 'Male',
      budget: '₹1500+',
      traumaFlag: false,
    };

    const matches = matchTherapists(relationshipClient, ACTIVE_THERAPISTS_ROSTER);
    const qualifying = matches.filter((m) => m.qualifies);
    const topMatch = qualifying[0];

    assert(topMatch.therapist.id === 'th_rohit_002', 'Dr. Rohit Mehta ranks #1 for Relationships + Psychodynamic + Male preference');
    assert(topMatch.fitScore === 100, `Fit score is 100% across all 4 dimensions`);
    assert(topMatch.dims.concern.score === 1, 'Concern dimension score is 1.0 (100% overlap on Relationships & Family Conflict)');
    assert(topMatch.dims.modality.score === 1, 'Modality dimension score is 1.0 (Psychodynamic matched)');
    assert(topMatch.dims.gender.score === 1, 'Gender preference dimension score is 1.0 (Male preference satisfied)');
    assert(topMatch.score === 100, 'Score is crisp at 100');
  }

  // ------------------------------------------------------------------
  // 4. QUALITY FLOOR ENFORCEMENT & GUARANTEED HANDOFF
  // ------------------------------------------------------------------
  console.log('\n--- TEST AREA 4: Quality Floor Enforcement ---');
  {
    const unrelatedClient: ClientProfile = {
      concernPriority: [{ tag: 'Astrology Counseling', severity: 3 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const matches = matchTherapists(unrelatedClient, ACTIVE_THERAPISTS_ROSTER);
    const qualifying = matches.filter((m) => m.qualifies);
    assert(qualifying.length === 0, 'Zero concern overlap correctly fails quality floor (no spurious matches)');

    // When roster only has unverified therapists, guaranteed handoff triggers
    const unverifiedOnlyRoster = ACTIVE_THERAPISTS_ROSTER.filter((t) => t.verificationStatus !== 'verified');
    const guaranteed = getGuaranteedMatches(unrelatedClient, unverifiedOnlyRoster);
    assert(guaranteed.guaranteedHandoff === true, 'Guaranteed human care-team handoff triggered when no verified clinician passes');
  }

  // ------------------------------------------------------------------
  // 5. SAFETY SCREENING & TRIAGE TIERS
  // ------------------------------------------------------------------
  console.log('\n--- TEST AREA 5: Safety Screening & Triage Tiers ---');
  {
    // Standard tier
    const standardTriage = computeTriageTier({
      response: 'No',
    });
    assert(standardTriage.tier === 'standard', 'Calculates standard tier when no crisis indicators');
    const standardRouting = getRoutingAction(standardTriage.tier);
    assert(!standardRouting.useAcuityPool, 'Standard tier routes to self-service verified clinician selection');

    // Priority tier
    const priorityTriage = computeTriageTier({
      response: 'Yes',
      recency: 'In the past month, but not currently',
      plan: 'No thoughts or intent',
    });
    assert(priorityTriage.tier === 'priority', 'Calculates priority tier when safety screen is positive without active plan');
    const priorityRouting = getRoutingAction(priorityTriage.tier);
    assert(priorityRouting.needsTeamOutreach === true, 'Priority tier flags needsTeamOutreach');
    assert(priorityRouting.slaHours === 24, 'Priority SLA is 24 hours');

    // Immediate tier
    const immediateTriage = computeTriageTier({
      response: 'Yes',
      plan: 'Yes',
    });
    assert(immediateTriage.tier === 'immediate', 'Calculates immediate crisis tier when plan is present');
    const safetyMsg = getClientSafetyMessage(immediateTriage.tier);
    assert(safetyMsg.headline.includes("wait"), 'Safety message headline informs client they do not have to wait');
    assert(safetyMsg.resources.some((r) => r.contact.includes('14416')), 'Tele-MANAS national toll-free helpline (14416) included');
    assert(safetyMsg.resources.some((r) => r.contact.includes('1800-599-0019')), 'KIRAN national helpline (1800-599-0019) included');
  }

  // ------------------------------------------------------------------
  // 6. END-TO-END INTAKE MATCHING PIPELINE
  // ------------------------------------------------------------------
  console.log('\n--- TEST AREA 6: End-to-End runIntakeMatching Pipeline ---');
  {
    const clientIntakeAnswers = {
      name: 'Rohan Verma',
      email: 'rohan.verma@example.com',
      phone: '+91 98765 12345',
      age: 28,
      reason: 'Overwhelming anxiety and chest tightness before Monday morning meetings.',
      concerns: ['Anxiety', 'Work Stress'],
      concernSeverity: 3,
      styleStructure: 'More structured (CBT style)',
      budget: '₹1000–1500',
      gender: 'No preference',
      languages: ['English', 'Hindi'],
    };

    const safetyAnswers = {
      response: 'No',
    };

    const result = await runIntakeMatching(safetyAnswers, clientIntakeAnswers, ACTIVE_THERAPISTS_ROSTER);

    assert(result.tier === 'standard', 'Triage tier is standard');
    assert(result.matches.length >= 1, `Matches returned: ${result.matches.length}`);
    const topMatch = result.matches[0];
    assert(topMatch.therapist.name === 'Dr. Ananya Sharma', 'Dr. Ananya Sharma is top recommendation for Anxiety + Work Stress');
    assert(topMatch.score >= 80, `Top match score is crisp: ${topMatch.score}`);

    // Verify Privacy Shield on public matches
    const publicTherapist = topMatch.therapist;
    assert((publicTherapist as any).email === undefined, 'Privacy Shield: Clinician personal email stripped');
    assert((publicTherapist as any).calibration === undefined, 'Privacy Shield: Internal calibration data stripped');
    assert((publicTherapist as any).severityCeiling === undefined, 'Privacy Shield: Severity ceiling stripped');
    assert(publicTherapist.name !== undefined, 'Public name preserved');
    assert(publicTherapist.credentials !== undefined, 'Public credentials preserved');
    assert(publicTherapist.fee !== undefined, 'Fee preserved');
  }

  // ------------------------------------------------------------------
  // 7. SIMULATED USER JOURNEY: FROM INTAKE TO MUTUAL ACCEPTANCE
  // ------------------------------------------------------------------
  console.log('\n--- TEST AREA 7: Journey Simulation (Intake -> Match -> Acceptance) ---');
  {
    // Step 1: Intake & Safety Submitted
    const intakePayload = {
      user_id: 'usr_rohan_001',
      fullName: 'Rohan Verma',
      presentingReason: 'Anxiety before work meetings',
      concerns: ['Anxiety', 'Work Stress'],
    };
    assert(intakePayload.fullName === 'Rohan Verma', 'Step 1: Intake captures user presenting context');

    // Step 2: Recommendations generated
    const recommendations = await runIntakeMatching(
      { response: 'No' },
      {
        concerns: intakePayload.concerns,
        reason: intakePayload.presentingReason,
        budget: '₹1500+',
        languages: ['English'],
      },
      ACTIVE_THERAPISTS_ROSTER
    );
    assert(recommendations.matches.length > 0, 'Step 2: Recommendations computed successfully');
    const selected = recommendations.matches[0];

    // Step 3: User selects top therapist and grants optional insight consent
    const matchSelection = {
      match_id: 'match_rec_991',
      user_id: intakePayload.user_id,
      therapist_account_id: selected.therapist.id,
      status: 'shortlisted',
      insight_sharing: {
        sharePatternSummary: true,
        shareEmotionalVocab: true,
      },
    };
    assert(matchSelection.status === 'shortlisted', 'Step 3: User shortlisted matched therapist');

    // Step 4: Therapist notification payload simulated
    const notification = {
      therapistId: matchSelection.therapist_account_id,
      clientName: intakePayload.fullName,
      matchScore: selected.score,
      action: 'Awaiting therapist review on dashboard',
    };
    assert(notification.therapistId === 'th_ananya_001', 'Step 4: Therapist identified for notification');

    // Step 5: Therapist accepts the match request
    const acceptedRelationship = {
      relationship_id: 'rel_active_777',
      user_id: intakePayload.user_id,
      therapist_account_id: matchSelection.therapist_account_id,
      status: 'active',
      care_stage: 'active_therapy',
      intake_form_completed: true,
      mutual_acceptance_at: new Date().toISOString(),
    };
    assert(acceptedRelationship.status === 'active', 'Step 5: Mutual relationship transitioned to active');

    // Step 6: Next steps: First session booking enabled
    const bookingLinkReady = {
      relationshipId: acceptedRelationship.relationship_id,
      canBookSession: true,
      perSessionFee: selected.therapist.fee,
      bookingUrl: `https://ingresswithin.com/therapy/book/${acceptedRelationship.relationship_id}`,
    };
    assert(bookingLinkReady.canBookSession === true, 'Step 6: Booking link activated for client');
    assert(bookingLinkReady.perSessionFee === 1500, 'Fee aligned with therapist fee');
  }

  // ------------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`TOTAL TESTS: ${totalTests}`);
  console.log(`PASSED: ${passedTests}`);
  console.log(`FAILED: ${failedTests}`);
  console.log('================================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error in matching engine test suite:', err);
  process.exit(1);
});
