import { calculateCurrentCycleDay, calculateTotalUserDays } from '../src/lib/services/cycleService';
import { ExerciseAvailabilityService } from '../src/lib/exercises/v4/services/exerciseAvailabilityService';

console.log('================================================================');
console.log('  INGRESS WITHIN — EXERCISE UNLOCK MECHANISM REGRESSION TEST SUITE');
console.log('================================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, description: string) {
  totalTests++;
  if (condition) {
    console.log(` ✓ [PASS] ${description}`);
    passedTests++;
  } else {
    console.error(` ✗ [FAIL] ${description}`);
    process.exitCode = 1;
  }
}

// --- 1. CYCLE SERVICE CALCULATIONS ---
console.log('--- 1. Canonical Cycle Day Calculations ---');

// Mock Cycle started 13 days ago -> Today is Day 14
const startDateDay14 = new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
const cycleDay14 = {
  cycle_number: 1,
  start_date: startDateDay14,
  current_day: 1, // Stale DB value should be ignored!
  total_days: 30
};

const calcDay14 = calculateCurrentCycleDay(cycleDay14);
assert(calcDay14 === 14, `Day 14 calculated dynamically from start_date (got ${calcDay14})`);

const totalDays14 = calculateTotalUserDays(cycleDay14);
assert(totalDays14 === 14, `Total user days on Cycle 1 Day 14 is 14 (got ${totalDays14})`);

// Cycle 2 Day 5 -> 35 total days
const cycle2Day5 = {
  cycle_number: 2,
  start_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  current_day: 1,
  total_days: 30
};
const totalDaysCycle2 = calculateTotalUserDays(cycle2Day5);
assert(totalDaysCycle2 === 35, `Total user days on Cycle 2 Day 5 is 35 (got ${totalDaysCycle2})`);


// --- 2. REGRESSION SCENARIOS (TESTS 1 to 12) ---
console.log('\n--- 2. Exercise Availability Resolution Scenarios ---');

// TEST 1 — Day 1
console.log('» TEST 1 — Day 1');
const test1Baseline = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'exercise_0',
  unlockDay: 1,
  totalUserDays: 1,
  userEntryCount: 0
});
assert(test1Baseline.status === 'available' || test1Baseline.status === 'completed', 'TEST 1: Baseline available on Day 1');

const test1WordAssoc = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 1,
  userEntryCount: 0
});
assert(test1WordAssoc.status === 'locked', 'TEST 1: Day 10 exercise locked on Day 1');


// TEST 2 — Day 9
console.log('» TEST 2 — Day 9');
const test2WordAssoc = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 9,
  userEntryCount: 0
});
assert(test2WordAssoc.status === 'locked', 'TEST 2: Word Association locked on Day 9');


// TEST 3 — Day 10
console.log('» TEST 3 — Day 10');
const test3WordAssoc = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 10,
  userEntryCount: 0
});
assert(test3WordAssoc.status === 'available', 'TEST 3: Word Association available on Day 10');


// TEST 4 — Day 14 (EXACT BUG REGRESSION TEST)
console.log('» TEST 4 — Day 14 (CRITICAL BUG REGRESSION TEST)');
const test4WordAssoc = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 14,
  userEntryCount: 0
});
assert(test4WordAssoc.status === 'available', 'TEST 4 [BUG FIX]: Word Association AVAILABLE on Day 14');

const test4Inkblot = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'inkblot_projective',
  unlockDay: 16,
  totalUserDays: 14,
  userEntryCount: 0
});
assert(test4Inkblot.status === 'locked', 'TEST 4: Inkblot Projective Test LOCKED on Day 14');
assert(test4Inkblot.unlockLabel === 'Unlocks Day 16', 'TEST 4: Inkblot unlock label is "Unlocks Day 16"');

const test4SelfPerception = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'self_perception',
  unlockDay: 24,
  totalUserDays: 14,
  userEntryCount: 0
});
assert(test4SelfPerception.status === 'locked', 'TEST 4: Self-Perception Test LOCKED on Day 14');
assert(test4SelfPerception.unlockLabel === 'Unlocks Day 24', 'TEST 4: Self-Perception unlock label is "Unlocks Day 24"');


// TEST 5 — Day 16
console.log('» TEST 5 — Day 16');
const test5Inkblot = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'inkblot_projective',
  unlockDay: 16,
  totalUserDays: 16,
  userEntryCount: 0
});
assert(test5Inkblot.status === 'available', 'TEST 5: Inkblot available on Day 16');


// TEST 6 — Day 24
console.log('» TEST 6 — Day 24');
const test6SelfPerception = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'self_perception',
  unlockDay: 24,
  totalUserDays: 24,
  userEntryCount: 0
});
assert(test6SelfPerception.status === 'available', 'TEST 6: Self-Perception available on Day 24');


// TEST 7 — Completed Exercise
console.log('» TEST 7 — Completed Exercise');
const test7Completed = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 14,
  userEntryCount: 5,
  persistedStatus: 'completed'
});
assert(test7Completed.status === 'completed', 'TEST 7: Completed exercise remains completed on Day 14');


// TEST 8 — In-Progress Exercise
console.log('» TEST 8 — In-Progress Exercise');
const test8InProgress = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 14,
  userEntryCount: 5,
  persistedStatus: 'in_progress'
});
assert(test8InProgress.status === 'in_progress', 'TEST 8: In-progress exercise remains in_progress (resumable)');


// TEST 9 — Stale Persisted Locked State Overridden
console.log('» TEST 9 — Stale Persisted Locked State Overridden');
const test9Stale = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: 14,
  userEntryCount: 5,
  persistedStatus: 'locked'
});
assert(test9Stale.status === 'available', 'TEST 9 [BUG FIX]: Stale persisted "locked" state overridden to AVAILABLE when totalUserDays >= 10');


// TEST 10 — Entry Requirement Unmet
console.log('» TEST 10 — Entry Requirement Unmet');
const test10EntryUnmet = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'unfinished_conversation',
  unlockDay: 213,
  minEntries: 15,
  totalUserDays: 220, // Day requirement met
  userEntryCount: 13  // Entry requirement unmet (13 < 15)
});
assert(test10EntryUnmet.status === 'locked', 'TEST 10: Exercise locked when entry requirement unmet');
assert(test10EntryUnmet.remainingEntriesNeeded === 2, 'TEST 10: Correctly calculates 2 more entries needed');
assert(test10EntryUnmet.unlockLabel === '2 more entries needed', 'TEST 10: Unlock label says "2 more entries needed"');


// TEST 11 — Entry Requirement Met
console.log('» TEST 11 — Entry Requirement Met');
const test11EntryMet = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'unfinished_conversation',
  unlockDay: 213,
  minEntries: 15,
  totalUserDays: 220,
  userEntryCount: 15
});
assert(test11EntryMet.status === 'available', 'TEST 11: Exercise available when both day and entry requirements met');


// TEST 12 — Both Day & Entry Requirements Unmet
console.log('» TEST 12 — Both Day & Entry Requirements Unmet');
const test12BothUnmet = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'recurring_scenario',
  unlockDay: 304,
  minEntries: 15,
  totalUserDays: 200,
  userEntryCount: 10
});
assert(test12BothUnmet.status === 'locked', 'TEST 12: Locked when both day and entry requirements unmet');
assert(Boolean(test12BothUnmet.unlockLabel?.includes('Day 304')), 'TEST 12: Unlock label explains day requirement');
assert(Boolean(test12BothUnmet.unlockLabel?.includes('5 more entries needed')), 'TEST 12: Unlock label explains 5 more entries needed');


// --- 3. FULL CATALOG REGRESSION TEST (TEST 15) ---
console.log('\n--- 3. Full Exercise Catalog Regression Test (TEST 15) ---');

const catalogSpecs = [
  { id: 'exercise_0', title: 'Baseline Assessment', unlockDay: 1, minEntries: 0 },
  { id: 'word_association', title: 'Word Association Test', unlockDay: 10, minEntries: 0 },
  { id: 'inkblot_projective', title: 'Inkblot Projective Test', unlockDay: 16, minEntries: 0 },
  { id: 'self_perception', title: 'Self-Perception Test', unlockDay: 24, minEntries: 0 },
  { id: 'core_values_card_sort', title: 'Core Values Card Sort', unlockDay: 35, minEntries: 0 },
  { id: 'relationship_map', title: 'Relationship Map', unlockDay: 42, minEntries: 5 },
  { id: 'body_signal_inventory', title: 'Body Signal Inventory', unlockDay: 49, minEntries: 0 },
  { id: 'avoidance_audit', title: 'Avoidance Audit', unlockDay: 91, minEntries: 0 },
  { id: 'cost_benefit_audit', title: 'Cost-Benefit Audit', unlockDay: 122, minEntries: 0 },
  { id: 'trigger_mapping', title: 'Trigger Mapping', unlockDay: 152, minEntries: 0 },
  { id: 'six_month_assessment', title: '6-Month Self-Assessment', unlockDay: 183, minEntries: 20 },
  { id: 'unfinished_conversation', title: 'Unfinished Conversation', unlockDay: 213, minEntries: 18 },
  { id: 'identity_statements', title: 'Identity Statements', unlockDay: 244, minEntries: 0 },
  { id: 'narrative_arc', title: 'Narrative Arc Exercise', unlockDay: 274, minEntries: 0 },
  { id: 'recurring_scenario', title: 'Recurring Scenario Exercise', unlockDay: 304, minEntries: 15 },
  { id: 'values_revisit', title: 'Values Revisit', unlockDay: 335, minEntries: 0 },
  { id: 'year_end_portrait', title: 'Year-End Self-Portrait', unlockDay: 365, minEntries: 0 }
];

catalogSpecs.forEach((spec) => {
  // Test before unlock day
  if (spec.unlockDay > 1) {
    const resBefore = ExerciseAvailabilityService.resolveStatus({
      exerciseId: spec.id,
      unlockDay: spec.unlockDay,
      minEntries: spec.minEntries,
      totalUserDays: spec.unlockDay - 1,
      userEntryCount: 100
    });
    assert(resBefore.status === 'locked', `${spec.title} (Day ${spec.unlockDay}): Locked on Day ${spec.unlockDay - 1}`);
  }

  // Test on unlock day
  const resOnDay = ExerciseAvailabilityService.resolveStatus({
    exerciseId: spec.id,
    unlockDay: spec.unlockDay,
    minEntries: spec.minEntries,
    totalUserDays: spec.unlockDay,
    userEntryCount: spec.minEntries > 0 ? spec.minEntries : 0
  });
  assert(resOnDay.status === 'available', `${spec.title} (Day ${spec.unlockDay}): AVAILABLE on Day ${spec.unlockDay}`);
});

console.log('\n================================================================');
console.log(`  EXERCISE UNLOCK REGRESSION SUMMARY: ${passedTests} passed, ${totalTests - passedTests} failed.`);
console.log('================================================================\n');
