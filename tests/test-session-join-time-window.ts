import assert from 'assert';
import { getSessionMeetingWindow } from '../src/utils/sessionMeetingUtils';

function runSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — SESSION JOIN TIME WINDOW TEST SUITE         ');
  console.log('================================================================\n');

  const now = Date.now();

  // Test 1: Session 2 days in the future (e.g. Oct 19 when today is Oct 17)
  const sessionIn2Days = new Date(now + 48 * 60 * 60 * 1000).toISOString();
  const window2Days = getSessionMeetingWindow(sessionIn2Days);
  assert.strictEqual(window2Days.canJoin, false, 'Session 48h away CANNOT be joined');
  assert.strictEqual(window2Days.isTooEarly, true, 'Session 48h away is marked as too early');
  assert.strictEqual(window2Days.isEnded, false, 'Session 48h away is not ended');
  assert(window2Days.hoursUntilJoin >= 46 && window2Days.hoursUntilJoin <= 48, 'Hours until join reflects 47h remaining');
  console.log('  ✓ [PASS] Session 48h in future: Join is disabled (isTooEarly = true, canJoin = false)');

  // Test 2: Session 2 hours in the future (120 minutes away)
  const sessionIn2Hours = new Date(now + 2 * 60 * 60 * 1000).toISOString();
  const window2Hours = getSessionMeetingWindow(sessionIn2Hours);
  assert.strictEqual(window2Hours.canJoin, false, 'Session 2h away CANNOT be joined');
  assert.strictEqual(window2Hours.isTooEarly, true, 'Session 2h away is too early');
  console.log('  ✓ [PASS] Session 2h in future: Join is disabled (canJoin = false)');

  // Test 3: Session 61 minutes in the future (just outside 1h window)
  const sessionIn61Mins = new Date(now + 61 * 60 * 1000).toISOString();
  const window61Mins = getSessionMeetingWindow(sessionIn61Mins);
  assert.strictEqual(window61Mins.canJoin, false, 'Session 61 mins away CANNOT be joined');
  assert.strictEqual(window61Mins.isTooEarly, true, 'Session 61 mins away is too early');
  console.log('  ✓ [PASS] Session 61 mins in future: Join is disabled (boundary check)');

  // Test 4: Session 59 minutes in the future (inside 1h window!)
  const sessionIn59Mins = new Date(now + 59 * 60 * 1000).toISOString();
  const window59Mins = getSessionMeetingWindow(sessionIn59Mins);
  assert.strictEqual(window59Mins.canJoin, true, 'Session 59 mins away CAN be joined');
  assert.strictEqual(window59Mins.isTooEarly, false, 'Session 59 mins away is not too early');
  assert.strictEqual(window59Mins.isEnded, false, 'Session 59 mins away is not ended');
  console.log('  ✓ [PASS] Session 59 mins in future: Join is ENABLED (canJoin = true)');

  // Test 5: Session 15 minutes in the future (waiting room active)
  const sessionIn15Mins = new Date(now + 15 * 60 * 1000).toISOString();
  const window15Mins = getSessionMeetingWindow(sessionIn15Mins);
  assert.strictEqual(window15Mins.canJoin, true, 'Session 15 mins away CAN be joined');
  assert.strictEqual(window15Mins.isTooEarly, false, 'Session 15 mins away is not too early');
  console.log('  ✓ [PASS] Session 15 mins in future: Join is ENABLED (canJoin = true)');

  // Test 6: Session happening right now (in-progress)
  const sessionStarted10MinsAgo = new Date(now - 10 * 60 * 1000).toISOString();
  const sessionEndsIn40Mins = new Date(now + 40 * 60 * 1000).toISOString();
  const windowInProgress = getSessionMeetingWindow(sessionStarted10MinsAgo, sessionEndsIn40Mins);
  assert.strictEqual(windowInProgress.canJoin, true, 'In-progress session CAN be joined');
  assert.strictEqual(windowInProgress.isTooEarly, false, 'In-progress session is not too early');
  assert.strictEqual(windowInProgress.isEnded, false, 'In-progress session is not ended');
  console.log('  ✓ [PASS] Session in-progress: Join is ENABLED (canJoin = true)');

  // Test 7: Session ended 10 minutes ago
  const sessionEndedStart = new Date(now - 60 * 60 * 1000).toISOString();
  const sessionEndedEnd = new Date(now - 10 * 60 * 1000).toISOString();
  const windowEnded = getSessionMeetingWindow(sessionEndedStart, sessionEndedEnd);
  assert.strictEqual(windowEnded.canJoin, false, 'Ended session CANNOT be joined');
  assert.strictEqual(windowEnded.isEnded, true, 'Ended session is marked as ended');
  console.log('  ✓ [PASS] Session ended: Join is disabled (isEnded = true, canJoin = false)');

  console.log('\n================================================================');
  console.log('  SUMMARY: All 7 Time Window Boundary Tests Passed!             ');
  console.log('================================================================\n');
}

runSuite();
