'use strict';
/**
 * Ingress Within — Canonical Matching Engine Comprehensive Test Suite
 * ===================================================================
 * Verifies Phase 6 release gate requirements:
 * 1. Scoring dimensions, weights (38/28/23/11), normalization & tie-breaker.
 * 2. Hard eligibility filters (verification, telehealth, same-city, capacity, trauma, population).
 * 3. Quality floor enforcement.
 * 4. Two-stage widening & guaranteed handoff.
 * 5. Acuity clearance pool routing (priority / immediate).
 * 6. Safety triage & India crisis helplines.
 * 7. Modality inference heuristic fallback & validation.
 * 8. Privacy shield allowlist (zero sensitive data leakage).
 */

import assert from 'node:assert';
import {
  WEIGHTS,
  BUDGET_BAND_MAX,
  KNOWN_MODALITIES,
  CRISIS_RESOURCES_INDIA,
  SAFETY_TIER,
  ClientProfile,
  TherapistRecord,
  scoreConcern,
  scoreModality,
  scoreGender,
  scoreBudget,
  capacityBonus,
  hardFilter,
  qualifiesFloor,
  matchTherapists,
  getGuaranteedMatches,
  matchTherapistsForAcuityCase,
  computeTriageTier,
  getClientSafetyMessage,
  getRoutingAction,
  adaptClientAnswers,
  inferModalitiesWithAI,
  sanitizePublicTherapist,
  tagsMatch,
  diceCoefficient,
} from '../src/lib/therapy/matchingEngine';

let passed = 0;
let total = 0;

function it(name: string, fn: () => void) {
  total++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ [FAIL] ${name}:`, err.message);
    throw err;
  }
}

async function run() {
  console.log('================================================================');
  console.log('  CANONICAL THERAPIST MATCHING ENGINE TEST SUITE');
  console.log('================================================================\n');

  // -------------------------------------------------------------------
  // SECTION 1: Scoring Weights & Normalization
  // -------------------------------------------------------------------
  console.log('--- SECTION 1: Scoring Weights & Normalization ---');

  it('Scoring weights sum precisely to 100', () => {
    const sum = WEIGHTS.concern + WEIGHTS.modality + WEIGHTS.budget + WEIGHTS.gender;
    assert.strictEqual(sum, 100, `Weights sum must be 100, got ${sum}`);
    assert.strictEqual(WEIGHTS.concern, 38);
    assert.strictEqual(WEIGHTS.modality, 28);
    assert.strictEqual(WEIGHTS.budget, 23);
    assert.strictEqual(WEIGHTS.gender, 11);
  });

  const baseTherapist: TherapistRecord = {
    id: 't-test-1',
    name: 'Dr. Clinical Test',
    credentials: 'PhD, Licensed Clinical Psychologist',
    experienceYears: 8,
    city: 'Bengaluru',
    bio: 'Dedicated practitioner specializing in mood and anxiety.',
    languages: ['English', 'Hindi'],
    formats: ['Telehealth', 'In-Person'],
    fee: 1000,
    specialties: ['Anxiety', 'Burnout', 'Workplace Stress'],
    modalities: ['CBT', 'Acceptance & Commitment Therapy'],
    primaryModalities: ['CBT'],
    ageGroups: ['Adults'],
    gender: 'Female',
    capacity: { current: 2, max: 10, source: 'manual' },
    verificationStatus: 'verified',
    traumaListed: true,
    traumaVerified: true,
    backgroundCheckCleared: true,
    acuityClearance: 'none',
  };

  it('Scores 100% fit score when all 4 dimensions are fully satisfied', () => {
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 3 }],
      explicitModalities: ['CBT'],
      traumaFlag: false,
      genderPref: 'Female',
      languages: ['English'],
      clientType: 'Adults',
      city: 'Mumbai',
      budget: '₹1000–1500',
    };

    const c = scoreConcern(profile, baseTherapist);
    const m = scoreModality(profile, baseTherapist);
    const g = scoreGender(profile, baseTherapist);
    const b = scoreBudget(profile, baseTherapist);

    assert.strictEqual(c.score, 1);
    assert.strictEqual(m.score, 1);
    assert.strictEqual(g.score, 1);
    assert.strictEqual(b.score, 1);

    const matches = matchTherapists(profile, [baseTherapist]);
    assert.strictEqual(matches[0].fitScore, 100);
    assert.strictEqual(matches[0].qualifies, true);
  });

  it('Unanswered gender preference is omitted from numerator and denominator', () => {
    const profileNoGender: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 3 }],
      explicitModalities: ['CBT'],
      traumaFlag: false,
      genderPref: 'No preference',
      languages: ['English'],
      clientType: 'Adults',
      city: 'Mumbai',
      budget: '₹1000–1500',
    };

    const g = scoreGender(profileNoGender, baseTherapist);
    assert.strictEqual(g.score, null, 'Unanswered gender must return null');

    const matches = matchTherapists(profileNoGender, [baseTherapist]);
    // 38 + 28 + 23 = 89 weight, fully matched = 89/89 = 100%
    assert.strictEqual(matches[0].fitScore, 100);
  });

  it('Above-budget fee gives 0 for budget dimension without blocking match', () => {
    const expensiveTherapist: TherapistRecord = {
      ...baseTherapist,
      fee: 2500,
    };
    const profileLowBudget: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 3 }],
      explicitModalities: ['CBT'],
      traumaFlag: false,
      languages: ['English'],
      clientType: 'Adults',
      budget: 'Under ₹500',
    };

    const b = scoreBudget(profileLowBudget, expensiveTherapist);
    assert.strictEqual(b.score, 0, 'Above budget score must be 0');

    const matches = matchTherapists(profileLowBudget, [expensiveTherapist]);
    // Only concern (38), modality (28), and budget (23). Total weight = 89.
    // Weighted points = 38 + 28 + 0 = 66. Fit score = round(66/89 * 100) = 74%.
    assert.strictEqual(matches[0].fitScore, 74);
    assert.strictEqual(matches[0].qualifies, true, 'Above budget still qualifies with a clear warning');
  });

  it('Capacity bonus is a small tie-breaker (max 4 pts) and never substitutes for fit', () => {
    const fullTherapist: TherapistRecord = {
      ...baseTherapist,
      capacity: { current: 10, max: 10 },
    };
    const emptyTherapist: TherapistRecord = {
      ...baseTherapist,
      capacity: { current: 0, max: 10 },
    };

    assert.strictEqual(capacityBonus(fullTherapist), 0);
    assert.strictEqual(capacityBonus(emptyTherapist), 4);
    assert(capacityBonus(emptyTherapist) <= 4, 'Capacity bonus must not exceed 4 pts');
  });

  // -------------------------------------------------------------------
  // SECTION 2: Hard Eligibility Filters
  // -------------------------------------------------------------------
  console.log('\n--- SECTION 2: Hard Eligibility Filters ---');

  it('Unverified therapists fail hard filter', () => {
    const unverifiedTherapist: TherapistRecord = {
      ...baseTherapist,
      verificationStatus: 'pending',
    };
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const fails = hardFilter(profile, unverifiedTherapist);
    assert(fails.some((f) => f.includes('Not yet verified')), 'Must fail on unverified status');
  });

  it('Lack of telehealth/online support fails hard filter', () => {
    const inPersonOnlyTherapist: TherapistRecord = {
      ...baseTherapist,
      formats: ['In-Person Clinic'],
    };
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const fails = hardFilter(profile, inPersonOnlyTherapist);
    assert(fails.some((f) => f.includes('online sessions')), 'Must fail on missing online sessions');
  });

  it('Same-city exclusion prevents dual relationship without judging quality', () => {
    const sameCityTherapist: TherapistRecord = {
      ...baseTherapist,
      city: 'Delhi',
    };
    const profileDelhi: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
      city: 'Delhi',
    };

    const fails = hardFilter(profileDelhi, sameCityTherapist);
    assert(fails.some((f) => f.includes('Same city as you')), 'Must fail same-city exclusion');
  });

  it('Minors cannot match with therapists restricted to adult clients', () => {
    const adultOnlyTherapist: TherapistRecord = {
      ...baseTherapist,
      ageGroups: ['Adults (18+)'],
    };
    const minorProfile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
      clientType: 'Teen / Minor',
    };

    const fails = hardFilter(minorProfile, adultOnlyTherapist);
    assert(fails.some((f) => f.includes("Doesn't work with teen / minor")), 'Must protect minor clients');
  });

  it('Trauma intake requires both traumaListed AND traumaVerified', () => {
    const unverifiedTraumaTherapist: TherapistRecord = {
      ...baseTherapist,
      traumaListed: true,
      traumaVerified: false,
    };
    const traumaProfile: ClientProfile = {
      concernPriority: [{ tag: 'PTSD / Trauma', severity: 3 }],
      languages: ['English'],
      traumaFlag: true,
    };

    const fails = hardFilter(traumaProfile, unverifiedTraumaTherapist);
    assert(fails.some((f) => f.includes('Not verified for trauma-focused work')), 'Must enforce clinical trauma verification');
  });

  it('Fully booked therapists fail hard filter', () => {
    const bookedTherapist: TherapistRecord = {
      ...baseTherapist,
      capacity: { current: 10, max: 10 },
    };
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const fails = hardFilter(profile, bookedTherapist);
    assert(fails.includes('Fully booked'), 'Must fail fully booked practitioners');
  });

  // -------------------------------------------------------------------
  // SECTION 3: Quality Floor & Fuzzy Matching
  // -------------------------------------------------------------------
  console.log('\n--- SECTION 3: Quality Floor & Fuzzy Matching ---');

  it('Therapist with 0 concern overlap fails the quality floor', () => {
    const zeroOverlapTherapist: TherapistRecord = {
      ...baseTherapist,
      specialties: ['Substance Abuse', 'Schizophrenia'],
    };
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Relationship Issues', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const matches = matchTherapists(profile, [zeroOverlapTherapist]);
    assert.strictEqual(matches[0].passesHard, true, 'Passes hard filters');
    assert.strictEqual(matches[0].qualifies, false, 'Fails quality floor due to 0 concern overlap');
  });

  it('Dice coefficient handles minor orthographic differences without false fuzzy positives', () => {
    assert(tagsMatch('CBT', 'Cognitive Behavioral Therapy (CBT)'));
    assert(tagsMatch('Anxiety', 'Generalized Anxiety Disorder'));
    assert(!tagsMatch('Psychodynamic', 'Somatic Experiencing'), 'Distinct modalities must never fuzzy match');
  });

  // -------------------------------------------------------------------
  // SECTION 4: Two-Stage Widening & Guaranteed Handoff
  // -------------------------------------------------------------------
  console.log('\n--- SECTION 4: Two-Stage Widening & Guaranteed Handoff ---');

  it('Widening relaxes language preference before falling back to human handoff', () => {
    const marathiTherapist: TherapistRecord = {
      ...baseTherapist,
      languages: ['Marathi'],
    };
    const englishClient: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      explicitModalities: ['CBT'],
      languages: ['English'],
      traumaFlag: false,
    };

    const result = getGuaranteedMatches(englishClient, [marathiTherapist]);
    assert.strictEqual(result.relaxed, true, 'Language must be relaxed in tier 2');
    assert.strictEqual(result.guaranteedHandoff, false, 'Found match in relaxed tier');
    assert(result.relaxLabel?.includes('language preference'));
  });

  it('Empty eligible roster triggers guaranteed human handoff', () => {
    const unverifiedOnly: TherapistRecord = {
      ...baseTherapist,
      verificationStatus: 'unverified',
    };
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 2 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const result = getGuaranteedMatches(profile, [unverifiedOnly]);
    assert.strictEqual(result.guaranteedHandoff, true, 'Empty qualified roster must guarantee human handoff');
    assert.strictEqual(result.results.length, 0);
  });

  // -------------------------------------------------------------------
  // SECTION 5: Acuity Clearance & Safety Triage
  // -------------------------------------------------------------------
  console.log('\n--- SECTION 5: Acuity Clearance & Safety Triage ---');

  it('Priority and Immediate tiers only auto-match clinicians with explicit admin clearance', () => {
    const unclearedTherapist: TherapistRecord = { ...baseTherapist, acuityClearance: 'none' };
    const priorityTherapist: TherapistRecord = { ...baseTherapist, id: 't-pri', acuityClearance: 'cleared-for-priority' };
    const immediateTherapist: TherapistRecord = { ...baseTherapist, id: 't-imm', acuityClearance: 'cleared-for-immediate' };

    const roster = [unclearedTherapist, priorityTherapist, immediateTherapist];
    const profile: ClientProfile = {
      concernPriority: [{ tag: 'Anxiety', severity: 3 }],
      languages: ['English'],
      traumaFlag: false,
    };

    const priMatch = matchTherapistsForAcuityCase('priority', profile, roster);
    assert.strictEqual(priMatch.eligible.length, 2, 'Priority allows priority and immediate cleared clinicians');

    const immMatch = matchTherapistsForAcuityCase('immediate', profile, roster);
    assert.strictEqual(immMatch.eligible.length, 1, 'Immediate allows only cleared-for-immediate clinicians');
    assert.strictEqual(immMatch.eligible[0].id, 't-imm');
  });

  it('Server calculates safety tiers and provides verified India emergency resources', () => {
    const standardCase = computeTriageTier({ response: 'No' });
    assert.strictEqual(standardCase.tier, SAFETY_TIER.STANDARD);

    const priorityCase = computeTriageTier({ response: 'Prefer not to say' });
    assert.strictEqual(priorityCase.tier, SAFETY_TIER.PRIORITY);

    const immediateCase = computeTriageTier({ response: 'Yes', planOrMeans: 'Yes' });
    assert.strictEqual(immediateCase.tier, SAFETY_TIER.IMMEDIATE);

    const immediateMsg = getClientSafetyMessage(immediateCase.tier);
    assert.strictEqual(immediateMsg.pauseFlow, true);
    assert(immediateMsg.resources.some((r) => r.contact.includes('112')));
    assert(immediateMsg.resources.some((r) => r.contact.includes('14416')));
    assert(immediateMsg.resources.some((r) => r.contact.includes('1800-599-0019')));

    const immRouting = getRoutingAction(immediateCase.tier);
    assert.strictEqual(immRouting.needsTeamOutreach, true);
    assert.strictEqual(immRouting.slaHours, null);

    const priRouting = getRoutingAction(priorityCase.tier);
    assert.strictEqual(priRouting.needsTeamOutreach, true);
    assert.strictEqual(priRouting.slaHours, 24);
  });

  // -------------------------------------------------------------------
  // SECTION 6: Privacy Shield Allowlist
  // -------------------------------------------------------------------
  console.log('\n--- SECTION 6: Privacy Shield Allowlist ---');

  it('sanitizePublicTherapist strictly strips sensitive and private clinician fields', () => {
    const scored = matchTherapists(
      { concernPriority: [{ tag: 'Anxiety', severity: 2 }], languages: ['English'], traumaFlag: false },
      [{ ...baseTherapist, email: 'secret@hospital.com' }]
    )[0];

    const sanitized = sanitizePublicTherapist(scored);
    const rawKeys = Object.keys(sanitized.therapist);

    assert(!rawKeys.includes('email'), 'Must not expose therapist email');
    assert(!rawKeys.includes('internalNotes'), 'Must not expose internal notes');
    assert(!rawKeys.includes('commissionRate'), 'Must not expose commercial terms');
    assert(!rawKeys.includes('bank_details'), 'Must not expose financial info');
    assert.strictEqual(typeof sanitized.score, 'number');
    assert.strictEqual(typeof sanitized.why.dimensionStatus.concern, 'string');
  });

  // -------------------------------------------------------------------
  // SECTION 7: Modality Inference Offline Fallback
  // -------------------------------------------------------------------
  console.log('\n--- SECTION 7: Modality Inference Offline Fallback ---');

  it('Deterministic heuristic provides valid modality inference when AI is offline', async () => {
    const answers = {
      sit1: 'I become very critical of myself',
      stylestructure: 'Structured',
      bodysignal: 'Often',
    };
    const concernPriority = [{ tag: 'Anxiety', severity: 2 }];

    const result = await inferModalitiesWithAI(answers, concernPriority);
    assert(Array.isArray(result.modalities));
    assert(result.modalities.length > 0);
    result.modalities.forEach((m) => {
      assert((KNOWN_MODALITIES as readonly string[]).includes(m), `Inferred modality ${m} must be in KNOWN_MODALITIES`);
    });
  });

  console.log('\n================================================================');
  console.log(`  MATCHING ENGINE UNIT TESTS: ${passed}/${total} PASSED`);
  console.log('================================================================\n');
}

run().catch((err) => {
  console.error('\nMatching engine unit test suite failed:', err);
  process.exit(1);
});
