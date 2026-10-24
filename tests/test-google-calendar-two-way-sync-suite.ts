import {
  GoogleCalendarService,
  doIntervalsOverlap,
  parseGoogleEventTime,
  ExternalCalendarEvent,
} from '../src/lib/calendar/googleCalendarService';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';
import { SessionBookingService } from '../src/lib/therapy/sessionBookingService';
import { supabase } from '../src/lib/db';

function assert(condition: any, message: string) {
  if (!condition) {
    console.error(`  ✗ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✓ [PASS] ${message}`);
}

async function runTwoWaySyncSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — TWO-WAY GOOGLE CALENDAR SYNC TEST SUITE     ');
  console.log('================================================================');

  const testTherapistAccountId = '9f61bc20-b896-449e-90c3-75c4a6a11b4d';

  // ===========================================================================
  // 1. INTERVAL OVERLAP LOGIC (startA < endB && endA > startB)
  // ===========================================================================
  console.log('\n--- SECTION 1: Authoritative Interval Overlap Logic ---');

  const slotStart = '2026-11-10T10:00:00.000Z';
  const slotEnd = '2026-11-10T10:50:00.000Z';

  // Overlapping event (10:15 - 11:15)
  assert(
    doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T10:15:00.000Z', '2026-11-10T11:15:00.000Z'),
    'Detects partial overlap where event starts during slot'
  );

  // Overlapping event (09:30 - 10:30)
  assert(
    doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T09:30:00.000Z', '2026-11-10T10:30:00.000Z'),
    'Detects partial overlap where event ends during slot'
  );

  // Encompassing event (09:00 - 12:00)
  assert(
    doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T09:00:00.000Z', '2026-11-10T12:00:00.000Z'),
    'Detects full enclosure where event envelopes slot completely'
  );

  // Internal event (10:10 - 10:40)
  assert(
    doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T10:10:00.000Z', '2026-11-10T10:40:00.000Z'),
    'Detects internal event completely inside slot'
  );

  // Back-to-back earlier (09:00 - 10:00)
  assert(
    !doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T09:00:00.000Z', '2026-11-10T10:00:00.000Z'),
    'Permits back-to-back slot where previous event ends exactly when slot starts'
  );

  // Back-to-back later (10:50 - 11:50)
  assert(
    !doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T10:50:00.000Z', '2026-11-10T11:50:00.000Z'),
    'Permits back-to-back slot where next event starts exactly when slot ends'
  );

  // Completely separate event (14:00 - 15:00)
  assert(
    !doIntervalsOverlap(slotStart, slotEnd, '2026-11-10T14:00:00.000Z', '2026-11-10T15:00:00.000Z'),
    'Permits non-overlapping future event'
  );

  // ===========================================================================
  // 2. TIMEZONE & ALL-DAY EVENT EXPANSION
  // ===========================================================================
  console.log('\n--- SECTION 2: Google Timestamps & All-Day Event Normalization ---');

  const timedIso = parseGoogleEventTime(
    { dateTime: '2026-11-10T10:00:00+05:30' },
    false,
    'Asia/Kolkata'
  );
  assert(
    timedIso === '2026-11-10T04:30:00.000Z',
    'Converts ISO timestamp with +05:30 offset to exact UTC ISO string'
  );

  const allDayStart = parseGoogleEventTime(
    { date: '2026-11-10' },
    false,
    'Asia/Kolkata'
  );
  assert(
    allDayStart === '2026-11-09T18:30:00.000Z',
    'Converts all-day event date string to local midnight in IST (18:30 UTC previous day)'
  );

  // ===========================================================================
  // 3. IN-MEMORY & DB CACHING OF EXTERNAL EVENTS
  // ===========================================================================
  console.log('\n--- SECTION 3: External Event Caching & Retrieval ---');

  const sampleExternalEvent: ExternalCalendarEvent = {
    therapistAccountId: testTherapistAccountId,
    googleEventId: 'google_test_event_123',
    googleCalendarId: 'primary',
    summary: 'Dentist Appointment',
    description: 'Personal commitment',
    startTime: '2026-11-10T10:00:00.000Z',
    endTime: '2026-11-10T11:00:00.000Z',
    isAllDay: false,
    transparency: 'opaque',
    status: 'confirmed',
  };

  await GoogleCalendarService.persistExternalEvents(testTherapistAccountId, [sampleExternalEvent]);

  const retrieved = await GoogleCalendarService.getExternalEvents(
    testTherapistAccountId,
    '2026-11-10T00:00:00.000Z',
    '2026-11-10T23:59:59.000Z'
  );

  assert(retrieved.length >= 1, 'External event successfully cached and retrieved');
  const found = retrieved.find((e) => e.googleEventId === 'google_test_event_123');
  assert(found !== undefined, 'Found specific external event by googleEventId');
  assert(found?.summary === 'Dentist Appointment', 'Summary correctly preserved');
  assert(found?.transparency === 'opaque', 'Transparency correctly marked as opaque');

  // ===========================================================================
  // 4. TRANSPARENCY HANDLING (Free vs Busy)
  // ===========================================================================
  console.log('\n--- SECTION 4: Event Transparency (Opaque vs Transparent) ---');

  const transparentEvent: ExternalCalendarEvent = {
    therapistAccountId: testTherapistAccountId,
    googleEventId: 'transparent_event_456',
    summary: 'Working from home (Free)',
    startTime: '2026-11-10T12:00:00.000Z',
    endTime: '2026-11-10T13:00:00.000Z',
    isAllDay: false,
    transparency: 'transparent',
    status: 'confirmed',
  };

  await GoogleCalendarService.persistExternalEvents(testTherapistAccountId, [transparentEvent]);

  // Query busy external events (excluding transparent)
  const busyOnly = await GoogleCalendarService.getExternalEvents(
    testTherapistAccountId,
    '2026-11-10T11:30:00.000Z',
    '2026-11-10T13:30:00.000Z',
    { includeTransparent: false }
  );

  const transparentInBusy = busyOnly.find((e) => e.googleEventId === 'transparent_event_456');
  assert(
    transparentInBusy === undefined,
    'Transparent events do NOT block availability or appear in busy list'
  );

  // ===========================================================================
  // 5. FAIL-SAFE BUSY SLOTS AGGREGATION
  // ===========================================================================
  console.log('\n--- SECTION 5: Fail-Safe Availability Query (getBusySlots) ---');

  const busySlots = await GoogleCalendarService.getBusySlots(
    'therapist',
    testTherapistAccountId,
    '2026-11-10T09:00:00.000Z',
    '2026-11-10T12:00:00.000Z'
  );

  assert(Array.isArray(busySlots), 'getBusySlots returns array');
  const coversDentist = busySlots.some((s) =>
    doIntervalsOverlap(s.start, s.end, '2026-11-10T10:00:00.000Z', '2026-11-10T11:00:00.000Z')
  );
  assert(coversDentist, 'Fail-safe fallback includes cached external event in busy slots');

  // Verify privacy invariant
  assert(
    !('summary' in busySlots[0]) && !('description' in busySlots[0]) && !('attendees' in busySlots[0]),
    'Free/busy output strictly strips all event summaries, descriptions, and attendees'
  );

  // ===========================================================================
  // 6. AVAILABILITY BLOCKING ACROSS BOOKING PIPELINES
  // ===========================================================================
  console.log('\n--- SECTION 6: Availability Blocking Across Booking Entry Points ---');

  // 6a. TherapistPlatformService.validateSessionConflict
  const conflictCheck = await TherapistPlatformService.validateSessionConflict(
    testTherapistAccountId,
    '',
    '2026-11-10T10:15:00.000Z',
    '2026-11-10T11:05:00.000Z'
  );

  assert(conflictCheck.hasConflict === true, 'validateSessionConflict detects conflict with external Google event');
  assert(
    conflictCheck.code === 'GOOGLE_CALENDAR_CONFLICT',
    'Returns authoritative GOOGLE_CALENDAR_CONFLICT error code'
  );

  // 6b. Non-conflicting time should pass (11:30 AM IST = 06:00 UTC, within 09:00-17:00 working hours)
  const freeCheck = await TherapistPlatformService.validateSessionConflict(
    testTherapistAccountId,
    '',
    '2026-11-10T06:00:00.000Z',
    '2026-11-10T06:50:00.000Z'
  );
  assert(freeCheck.hasConflict === false, 'Free slot without external events passes conflict check');

  // ===========================================================================
  // 7. RESCHEDULING CONFLICT DETECTION
  // ===========================================================================
  console.log('\n--- SECTION 7: Reschedule Protection with External Events ---');

  // Create mock appointment for reschedule test
  let dummyApptId: string | null = null;
  const { data: dummyAppt, error: insertErr } = await supabase
    .from('therapist_clinical_appointments')
    .insert({
      therapist_account_id: testTherapistAccountId,
      user_id: 'b7f36e5f-27b7-499f-8b09-033ba64b6373',
      scheduled_start: '2026-11-10T15:00:00.000Z',
      scheduled_end: '2026-11-10T15:50:00.000Z',
      status: 'confirmed',
      session_type: 'video',
      modality: 'telehealth',
    })
    .select('id')
    .single();

  dummyApptId = dummyAppt?.id || null;

  if (dummyApptId) {
    let rescheduleBlocked = false;
    try {
      await SessionBookingService.rescheduleSession({
        appointmentId: dummyApptId,
        newStart: '2026-11-10T10:15:00.000Z',
        newEnd: '2026-11-10T11:05:00.000Z',
        requestedBy: 'therapist',
        therapistAccountId: testTherapistAccountId,
      });
    } catch (err: any) {
      if (err.code === 'SLOT_UNAVAILABLE' || err.status === 409) {
        rescheduleBlocked = true;
      }
    }

    assert(
      rescheduleBlocked,
      'SessionBookingService.rescheduleSession strictly rejects move to external Google Calendar busy slot'
    );

    // Clean up dummy appointment
    await supabase.from('therapist_clinical_appointments').delete().eq('id', dummyApptId);
  }

  // ===========================================================================
  // 8. ANTI-DUPLICATION & BI-DIRECTIONAL SAFETY INVARIANTS
  // ===========================================================================
  console.log('\n--- SECTION 8: Anti-Duplication & Bi-Directional Safety ---');

  const managedEventPayload = {
    id: 'google_managed_session_999',
    summary: 'Ingress Within Therapy Session: Client & Therapist',
    description: 'Confidential clinical therapy session scheduled via Ingress Within.',
    extendedProperties: {
      private: {
        ingress_appointment_id: 'appt_uuid_999',
      },
    },
  };

  assert(
    GoogleCalendarService.isManagedIngressEvent(managedEventPayload),
    'Correctly identifies Ingress-managed event via extendedProperties'
  );

  const regularExternalEvent = {
    id: 'regular_external_meet_888',
    summary: 'Family Lunch',
    description: 'Lunch with parents',
  };

  assert(
    !GoogleCalendarService.isManagedIngressEvent(regularExternalEvent),
    'Correctly distinguishes external non-managed event from Ingress-managed appointment'
  );

  // Deletion of external event from portal
  await GoogleCalendarService.deleteExternalEvent(testTherapistAccountId, 'google_test_event_123');
  const postDeletion = await GoogleCalendarService.getExternalEvents(
    testTherapistAccountId,
    '2026-11-10T00:00:00.000Z',
    '2026-11-10T23:59:59.000Z'
  );
  assert(
    postDeletion.find((e) => e.googleEventId === 'google_test_event_123') === undefined,
    'Deleted external Google event removed from cache and releases blocked availability'
  );

  // ===========================================================================
  // 9. WEBHOOK HANDLING & WATCH CHANNELS
  // ===========================================================================
  console.log('\n--- SECTION 9: Google Webhook Notification Processing ---');

  // 9a. Sync handshake
  const handshakeResult = await GoogleCalendarService.handleWebhookNotification({
    'x-goog-channel-id': 'ch_test_channel_001',
    'x-goog-resource-state': 'sync',
  });

  assert(handshakeResult.acknowledged === true, 'Webhook handshake with state: sync acknowledged');
  assert(handshakeResult.state === 'sync', 'Handshake state preserved');

  // 9b. Missing channel ID
  const invalidWebhook = await GoogleCalendarService.handleWebhookNotification({});
  assert(invalidWebhook.acknowledged === false, 'Invalid webhook with missing channel ID rejected safely');

  console.log('\n================================================================');
  console.log('  COMPLETE TWO-WAY GOOGLE CALENDAR SYNC SUITE: ALL TESTS PASSED ');
  console.log('================================================================');
}

runTwoWaySyncSuite().catch((err) => {
  console.error('\nTest Suite Failed:', err);
  process.exit(1);
});
