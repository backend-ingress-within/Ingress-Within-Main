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

  // Test 7: Session whose scheduled end time passed 10 minutes ago (within 20 min buffer for late joins)
  const sessionEnded10MinsAgoStart = new Date(now - 60 * 60 * 1000).toISOString();
  const sessionEnded10MinsAgoEnd = new Date(now - 10 * 60 * 1000).toISOString();
  const windowWithinBuffer = getSessionMeetingWindow(sessionEnded10MinsAgoStart, sessionEnded10MinsAgoEnd);
  assert.strictEqual(windowWithinBuffer.canJoin, true, 'Session ended 10 mins ago CAN still be joined (within 20m buffer)');
  assert.strictEqual(windowWithinBuffer.isEnded, false, 'Session within 20m buffer is not marked as ended');
  console.log('  ✓ [PASS] Session 10 mins past end time: Join is ENABLED (within 20m grace period buffer)');

  // Test 8: Session ended 25 minutes ago (past 20-minute buffer window)
  const sessionEnded25MinsAgoStart = new Date(now - 75 * 60 * 1000).toISOString();
  const sessionEnded25MinsAgoEnd = new Date(now - 25 * 60 * 1000).toISOString();
  const windowPastBuffer = getSessionMeetingWindow(sessionEnded25MinsAgoStart, sessionEnded25MinsAgoEnd);
  assert.strictEqual(windowPastBuffer.canJoin, false, 'Session ended 25 mins ago CANNOT be joined (past 20m buffer)');
  assert.strictEqual(windowPastBuffer.isEnded, true, 'Session ended 25 mins ago is marked as ended');
  console.log('  ✓ [PASS] Session 25 mins past end time: Join is disabled (past 20m grace period buffer, isEnded = true)');

  console.log('\n================================================================');
  console.log('  SUMMARY: All 8 Time Window & Buffer Boundary Tests Passed!    ');
  console.log('================================================================\n');
}

runSuite();
