import assert from 'assert';
import { calculateCurrentCycleDay, calculateTotalUserDays } from '../src/lib/services/cycleService';
import { ExerciseAvailabilityService } from '../src/lib/exercises/v4/services/exerciseAvailabilityService';

console.log('=== TESTING EXACT DAY 15 USER CALENDAR UNLOCK SCENARIO ===\n');

// 1. Recreate the user from the screenshot: Cycle 1, Day 15 of 30
// Today is 2026-09-08, so Cycle started 14 days ago on 2026-08-25
const cycleStart14DaysAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

const userCycle = {
  cycle_number: 1,
  start_date: cycleStart14DaysAgo,
  current_day: 1, // Stored DB value was 1
  total_days: 30
};

// Calculate cycle day dynamically
const calculatedCycleDay = calculateCurrentCycleDay(userCycle);
console.log(`1. Dynamic Cycle Day: ${calculatedCycleDay} (Expected: 15)`);
assert.strictEqual(calculatedCycleDay, 15, 'Cycle Day should be dynamically calculated as 15 from calendar start_date');

const totalCalendarDays = calculateTotalUserDays(userCycle);
console.log(`2. Total User Calendar Days: ${totalCalendarDays} (Expected: 15)`);
assert.strictEqual(totalCalendarDays, 15, 'Total calendar days should be 15');

// 3. Resolve status for Day 10 Exercise (Word Association Test)
const wordAssocStatus = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'word_association',
  unlockDay: 10,
  totalUserDays: totalCalendarDays,
  userEntryCount: 4, // 27% of 15 days = ~4 entries written
  persistedStatus: 'locked' // Was previously stored as locked
});

console.log('3. Word Association (Day 10) Status on Day 15:', wordAssocStatus.status);
assert.strictEqual(wordAssocStatus.status, 'available', 'Word Association MUST be UNLOCKED / AVAILABLE on Day 15');
assert.strictEqual(wordAssocStatus.isUnlocked, true, 'isUnlocked must be true on Day 15 for Day 10 exercise');

// 4. Resolve status for Day 16 Exercise (Inkblot Projective Test)
const inkblotStatus = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'inkblot_projective',
  unlockDay: 16,
  totalUserDays: totalCalendarDays,
  userEntryCount: 4,
  persistedStatus: 'locked'
});

console.log('4. Inkblot Projective (Day 16) Status on Day 15:', inkblotStatus.status, `(${inkblotStatus.unlockLabel})`);
assert.strictEqual(inkblotStatus.status, 'locked', 'Inkblot must be locked on Day 15');
assert.strictEqual(inkblotStatus.unlockLabel, 'Unlocks Day 16', 'Inkblot unlock label should say "Unlocks Day 16"');

// 5. Test tomorrow on Day 16 for Inkblot
const tomorrowInkblotStatus = ExerciseAvailabilityService.resolveStatus({
  exerciseId: 'inkblot_projective',
  unlockDay: 16,
  totalUserDays: 16, // Tomorrow
  userEntryCount: 4
});
console.log('5. Inkblot Projective (Day 16) Status tomorrow on Day 16:', tomorrowInkblotStatus.status);
assert.strictEqual(tomorrowInkblotStatus.status, 'available', 'Inkblot MUST automatically unlock on Day 16');

console.log('\n================================================================');
console.log('🎉 DAY 15 CALENDAR UNLOCK SCENARIO TEST PASSED WITH 100% SUCCESS!');
console.log('================================================================\n');
