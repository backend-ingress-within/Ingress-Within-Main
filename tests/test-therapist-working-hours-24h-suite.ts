import fs from 'fs';
import path from 'path';

// Load .env configuration if present
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    for (const line of envContent.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.substring(0, eqIdx).trim();
        const value = trimmed.substring(eqIdx + 1).trim();
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    }
  }
} catch (e) {}

import { NextRequest } from 'next/server';
import { supabase } from '../src/lib/db';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';
import { SessionBookingService } from '../src/lib/therapy/sessionBookingService';
import { signJwt } from '../src/utils/crypto';
import { COOKIE_THERAPIST_ACCESS_NAME } from '../src/utils/cookies';
import { GET as getCalendarRoute } from '../src/app/api/therapist/calendar/route';
import { GET as getAvailabilityRoute, PUT as putAvailabilityRoute } from '../src/app/api/therapist/calendar/availability/route';
import { GET as getSlotsRoute } from '../src/app/api/therapist/calendar/slots/route';
import { ALL_24_HOUR_OPTIONS } from '../src/views/therapist/TherapistWorkingHoursModal';

async function runWorkingHoursTestSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — THERAPIST 24-HOUR WORKING HOURS SUITE        ');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, testName: string, failureDetails?: any) {
    totalTests++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      if (failureDetails) console.error('    Details:', failureDetails);
      throw new Error(`Test failed: ${testName}`);
    }
  }

  const jwtSecret = TherapistAuthService.getJwtSecret();
  const testDeviceId = 'dev_hours_test_' + Date.now();

  function createTherapistRequest(
    url: string,
    therapistId: string,
    phone = '+919876543210',
    method = 'GET',
    body?: any
  ) {
    const token = signJwt(
      { tid: therapistId, phone, did: testDeviceId, scope: 'therapist' },
      jwtSecret,
      3600
    );
    const headers: Record<string, string> = {
      cookie: `${COOKIE_THERAPIST_ACCESS_NAME}=${token}`,
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
    };
    return new NextRequest(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // --------------------------------------------------------------------------
  // TEST 1: ALL_24_HOUR_OPTIONS contains all 24 hours (00:00 to 24:00)
  // --------------------------------------------------------------------------
  console.log('TEST 1: 24-Hour Option Range Generation');
  assert(
    ALL_24_HOUR_OPTIONS.length === 49, // 24 * 2 (half hours) + 24:00 = 49 options
    'ALL_24_HOUR_OPTIONS contains 49 discrete half-hour interval options spanning 00:00 to 24:00',
    { count: ALL_24_HOUR_OPTIONS.length }
  );
  assert(
    ALL_24_HOUR_OPTIONS[0].value === '00:00' && ALL_24_HOUR_OPTIONS[0].label.includes('12:00 AM'),
    'First option is 00:00 (12:00 AM)'
  );
  assert(
    ALL_24_HOUR_OPTIONS[ALL_24_HOUR_OPTIONS.length - 1].value === '24:00',
    'Last option is 24:00 (Midnight End)'
  );
  assert(
    ALL_24_HOUR_OPTIONS.some(o => o.value === '08:00') && ALL_24_HOUR_OPTIONS.some(o => o.value === '18:00'),
    'Supports custom morning hours (08:00) and evening hours (18:00)'
  );

  // --------------------------------------------------------------------------
  // TEST 2: GET & PUT /api/therapist/calendar/availability
  // --------------------------------------------------------------------------
  console.log('\nTEST 2: Availability API GET & PUT');
  
  // Find an authorized active therapist from DB
  const { data: therapistAccount, error: thErr } = await supabase
    .from('therapist_accounts')
    .select('id, phone_number')
    .eq('status', 'active')
    .eq('can_practice', true)
    .limit(1)
    .single();

  if (thErr || !therapistAccount) {
    throw new Error('Could not find active verified therapist for test: ' + JSON.stringify(thErr));
  }

  const mockTherapistId = therapistAccount.id;
  const mockTherapistPhone = therapistAccount.phone_number;

  // Retrieve original availability hours to restore after test
  const { data: origProfile } = await supabase
    .from('therapist_profiles')
    .select('availability_hours')
    .eq('therapist_account_id', mockTherapistId)
    .maybeSingle();
  const originalHours = origProfile?.availability_hours;

  // Insert active test session for therapist
  await supabase.from('therapist_sessions').insert({
    therapist_account_id: mockTherapistId,
    device_id: testDeviceId,
    refresh_token_hash: 'test_hash_' + Date.now(),
    is_active: true,
    expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
  });

  try {
  // Custom 24-hour split shift: Morning (8-11 AM) and Night (6-10 PM)
  const customWorkingHours = {
    mon: ['08:00-11:00', '18:00-22:00'],
    tue: ['08:00-11:00', '18:00-22:00'],
    wed: ['08:00-11:00', '18:00-22:00'],
    thu: ['08:00-11:00', '18:00-22:00'],
    fri: ['08:00-11:00', '18:00-22:00'],
    sat: ['09:00-13:00'],
    sun: [], // Closed
  };

  const putReq = createTherapistRequest(
    'http://localhost:3000/api/therapist/calendar/availability',
    mockTherapistId,
    mockTherapistPhone,
    'PUT',
    { availabilityHours: customWorkingHours }
  );

  const putRes = await putAvailabilityRoute(putReq);
  const putJson = await putRes.json();
  if (putRes.status !== 200) {
    console.error('PUT failed:', putRes.status, putJson);
  }

  assert(putRes.status === 200, 'PUT /api/therapist/calendar/availability returns 200 OK', { status: putRes.status, putJson });
  assert(putJson.success === true, 'PUT response confirms success');
  assert(
    putJson.availabilityHours?.mon?.length === 2 &&
    putJson.availabilityHours.mon[0] === '08:00-11:00' &&
    putJson.availabilityHours.mon[1] === '18:00-22:00',
    'Persisted Morning (8-11 AM) and Night (6-10 PM) consultation shifts in availabilityHours'
  );

  // GET Availability
  const getReq = createTherapistRequest(
    'http://localhost:3000/api/therapist/calendar/availability',
    mockTherapistId
  );
  const getRes = await getAvailabilityRoute(getReq);
  const getJson = await getRes.json();

  assert(getRes.status === 200, 'GET /api/therapist/calendar/availability returns 200 OK');
  assert(
    getJson.availabilityHours?.mon?.[0] === '08:00-11:00',
    'GET returns persisted morning routine window'
  );
  assert(
    getJson.availabilityHours?.mon?.[1] === '18:00-22:00',
    'GET returns persisted night routine window'
  );
  assert(
    getJson.availabilityHours?.sun?.length === 0,
    'GET correctly returns empty array for closed day (Sunday)'
  );

  // --------------------------------------------------------------------------
  // TEST 3: Calendar endpoint returns availabilityHours
  // --------------------------------------------------------------------------
  console.log('\nTEST 3: Calendar View Data includes availabilityHours');
  const calReq = createTherapistRequest(
    'http://localhost:3000/api/therapist/calendar?from=2026-11-01T00:00:00.000Z&to=2026-11-30T23:59:59.999Z',
    mockTherapistId
  );
  const calRes = await getCalendarRoute(calReq);
  const calJson = await calRes.json();

  assert(calRes.status === 200, 'GET /api/therapist/calendar returns 200 OK');
  assert(
    calJson.availabilityHours !== undefined,
    'Calendar response includes availabilityHours object for 24h timeline rendering'
  );
  assert(
    calJson.availabilityHours?.mon?.[0] === '08:00-11:00',
    'Calendar availabilityHours contains morning routine'
  );

  // --------------------------------------------------------------------------
  // TEST 4: Discrete Slot Generation matches Morning and Night Routines
  // --------------------------------------------------------------------------
  console.log('\nTEST 4: Slot Generation Respects Custom 24-Hour Shifts');
  // Choose a Monday: 2026-11-02 is a Monday
  const slotsReq = createTherapistRequest(
    'http://localhost:3000/api/therapist/calendar/slots?date=2026-11-02&duration=50',
    mockTherapistId
  );
  const slotsRes = await getSlotsRoute(slotsReq);
  const slotsJson = await slotsRes.json();

  assert(slotsRes.status === 200, 'GET /api/therapist/calendar/slots returns 200 OK');
  assert(slotsJson.isClosed === false, 'Therapist is open on Monday');
  assert(
    slotsJson.workingHours.includes('08:00-11:00') && slotsJson.workingHours.includes('18:00-22:00'),
    'workingHours string reflects morning 8-11 and night 18-22 windows'
  );

  const slotStartTimes = (slotsJson.slots || []).map((s: any) => s.startTimeStr);
  
  // Morning slots (08:00, 09:00, 10:00)
  assert(
    slotStartTimes.some((t: string) => t.includes('08:00')),
    'Generates 8:00 AM morning slot'
  );
  assert(
    slotStartTimes.some((t: string) => t.includes('09:00')),
    'Generates 9:00 AM morning slot'
  );
  assert(
    slotStartTimes.some((t: string) => t.includes('10:00')),
    'Generates 10:00 AM morning slot'
  );

  // Night slots (18:00, 19:00, 20:00, 21:00)
  assert(
    slotStartTimes.some((t: string) => t.includes('06:00') && t.toUpperCase().includes('PM')),
    'Generates 6:00 PM (18:00) night routine slot'
  );
  assert(
    slotStartTimes.some((t: string) => t.includes('07:00') && t.toUpperCase().includes('PM')),
    'Generates 7:00 PM (19:00) night routine slot'
  );
  assert(
    slotStartTimes.some((t: string) => t.includes('08:00') && t.toUpperCase().includes('PM')),
    'Generates 8:00 PM (20:00) night routine slot'
  );
  assert(
    slotStartTimes.some((t: string) => t.includes('09:00') && t.toUpperCase().includes('PM')),
    'Generates 9:00 PM (21:00) night routine slot'
  );

  // Unworked midday slots (e.g. 12:00 PM, 2:00 PM, 3:00 PM) must NOT exist
  assert(
    !slotStartTimes.some((t: string) => t.includes('12:00') && t.toUpperCase().includes('PM')),
    'Does NOT generate midday 12:00 PM slot outside working hours'
  );
  assert(
    !slotStartTimes.some((t: string) => t.includes('02:00') && t.toUpperCase().includes('PM')),
    'Does NOT generate afternoon 2:00 PM slot outside working hours'
  );
  assert(
    !slotStartTimes.some((t: string) => t.includes('03:00') && t.toUpperCase().includes('PM')),
    'Does NOT generate afternoon 3:00 PM slot outside working hours'
  );

  // Sunday (closed day)
  // 2026-11-01 is a Sunday
  const sundayReq = createTherapistRequest(
    'http://localhost:3000/api/therapist/calendar/slots?date=2026-11-01&duration=50',
    mockTherapistId
  );
  const sundayRes = await getSlotsRoute(sundayReq);
  const sundayJson = await sundayRes.json();

  assert(sundayJson.isClosed === true, 'Sunday correctly returns isClosed: true');
  assert(sundayJson.slots.length === 0, 'Sunday returns 0 slots');

  // --------------------------------------------------------------------------
  // TEST 5: Session Conflict Engine Respects 24-Hour Working Windows
  // --------------------------------------------------------------------------
  console.log('\nTEST 5: Conflict Engine Honors Custom Working Routine');
  // 8:00 AM slot on Monday is allowed
  const morningStartIso = '2026-11-02T02:30:00.000Z'; // 08:00 IST
  const morningEndIso = '2026-11-02T03:20:00.000Z';   // 08:50 IST

  const morningConflict = await TherapistPlatformService.checkAppointmentConflict(
    mockTherapistId,
    morningStartIso,
    morningEndIso
  );
  assert(
    morningConflict.hasConflict === false,
    'Session conflict check passes for morning shift 08:00 IST'
  );

  // 7:00 PM (19:00 IST) slot on Monday is allowed
  const nightStartIso = '2026-11-02T13:30:00.000Z'; // 19:00 IST
  const nightEndIso = '2026-11-02T14:20:00.000Z';   // 19:50 IST

  const nightConflict = await TherapistPlatformService.checkAppointmentConflict(
    mockTherapistId,
    nightStartIso,
    nightEndIso
  );
  assert(
    nightConflict.hasConflict === false,
    'Session conflict check passes for night shift 19:00 IST'
  );

  // 2:00 PM (14:00 IST) slot on Monday must be REJECTED as OUTSIDE_WORKING_HOURS
  const afternoonStartIso = '2026-11-02T08:30:00.000Z'; // 14:00 IST
  const afternoonEndIso = '2026-11-02T09:20:00.000Z';   // 14:50 IST

  const afternoonConflict = await TherapistPlatformService.checkAppointmentConflict(
    mockTherapistId,
    afternoonStartIso,
    afternoonEndIso
  );
  assert(
    afternoonConflict.hasConflict === true && afternoonConflict.code === 'OUTSIDE_WORKING_HOURS',
    'Session conflict check correctly blocks 14:00 IST with OUTSIDE_WORKING_HOURS',
    { afternoonConflict }
  );

  // --------------------------------------------------------------------------
  // TEST 6: SessionBookingService generates client slots matching custom routine
  // --------------------------------------------------------------------------
  console.log('\nTEST 6: SessionBookingService Client Booking Slots Integration');
  const clientAvailability = await SessionBookingService.getTherapistAvailability(
    mockTherapistId,
    '2026-11-02T00:00:00.000Z',
    '2026-11-02T23:59:59.999Z'
  );

  assert(
    Array.isArray(clientAvailability) && clientAvailability.length > 0,
    'SessionBookingService returns slots for configured day'
  );

  const clientSlotHours = clientAvailability.map(s => {
    return new Date(s.start).toLocaleTimeString('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit',
      hour12: false,
    });
  });

  assert(
    clientSlotHours.includes('08'),
    'Client availability contains 08:00 AM slot',
    { clientSlotHours }
  );
  assert(
    clientSlotHours.includes('19') || clientSlotHours.includes('18'),
    'Client availability contains night routine slot (18:00 / 19:00)',
    { clientSlotHours }
  );
  assert(
    !clientSlotHours.includes('13') && !clientSlotHours.includes('14') && !clientSlotHours.includes('15'),
    'Client availability does NOT include unworked afternoon slots (13:00, 14:00, 15:00)'
  );
  } finally {
    if (originalHours !== undefined) {
      await supabase
        .from('therapist_profiles')
        .update({ availability_hours: originalHours })
        .eq('therapist_account_id', mockTherapistId);
    }
    await supabase
      .from('therapist_sessions')
      .delete()
      .eq('device_id', testDeviceId);
  }

  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passedTests}/${totalTests} PASSED`);
  console.log('================================================================\n');
  console.log('🎉 ALL 24-HOUR WORKING HOURS CALENDAR TESTS PASSED!');
}

runWorkingHoursTestSuite().catch((err) => {
  console.error('\nTest suite execution error:', err);
  process.exit(1);
});
