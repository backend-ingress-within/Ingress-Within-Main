import assert from 'assert';
import { supabase } from '../src/lib/db';
import { SessionBookingService } from '../src/lib/therapy/sessionBookingService';
import { GoogleCalendarService, isValidGoogleMeetUrl } from '../src/lib/calendar/googleCalendarService';
import { EmailService } from '../src/lib/email/emailService';

console.log('================================================================');
console.log('  INGRESS WITHIN — BOOKING MEET & EMAIL DISPATCH TEST SUITE    ');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function pass(name: string) {
  passCount++;
  console.log(`  ✓ [PASS] ${name}`);
}

function fail(name: string, error: any) {
  failCount++;
  console.error(`  ✗ [FAIL] ${name}:`, error?.message || error);
}

async function run() {
  // --- SECTION 1: Google Meet URL Invariants ---
  console.log('--- SECTION 1: Google Meet URL Validity & Zero Fabricated Codes ---');
  try {
    const fallback = GoogleCalendarService.getFallbackMeetUrl();
    if (process.env.DEFAULT_GOOGLE_MEET_URL) {
      assert.strictEqual(fallback, process.env.DEFAULT_GOOGLE_MEET_URL.trim());
    } else {
      assert.strictEqual(fallback, null, 'Fallback meet URL must be null when DEFAULT_GOOGLE_MEET_URL is unset');
    }
    pass('GoogleCalendarService returns null or valid static fallback without generating fabricated strings');
  } catch (e) {
    fail('GoogleCalendarService meet fallback invariant', e);
  }

  // --- SECTION 2: Participant Identity Resolution (No SQL Error, Real Emails) ---
  console.log('\n--- SECTION 2: Participant Identity Resolution ---');
  let testTherapistAccountId = '7593553c-6b81-41dc-8334-7cb5bce7ed84';
  let testUserId = '';

  try {
    // Fetch a real user from users table
    const { data: user } = await supabase.from('users').select('id, name').limit(1).single();
    assert.ok(user, 'Found user in database');
    testUserId = user.id;

    // Test resolveParticipantIdentities directly
    const identities = await SessionBookingService.resolveParticipantIdentities({
      userId: testUserId,
      therapistAccountId: testTherapistAccountId,
    });

    assert.ok(identities.therapistName, 'Therapist name resolved from therapist_profiles');
    assert.strictEqual(identities.therapistEmail, 'premsonarofficial@gmail.com', 'Therapist email resolved from therapist_profiles');
    assert.notStrictEqual(identities.therapistEmail, 'therapist@ingresswithin.com', 'Therapist email must NOT be dummy fallback');
    assert.strictEqual(identities.clientName, user.name, 'Client name resolved correctly from users.name');
    pass('Participant identities resolved from therapist_profiles and users without column mismatch');
  } catch (e) {
    fail('Participant Identity Resolution', e);
  }

  // --- SECTION 3: Booking Order Creation with Client Email ---
  console.log('\n--- SECTION 3: Booking Order with Client Email ---');
  let createdBookingId = '';
  let createdApptId = '';
  const testClientEmail = 'client.verifier.test@gmail.com';

  try {
    const futureStart = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    futureStart.setMinutes(0, 0, 0);
    const futureEnd = new Date(futureStart.getTime() + 50 * 60 * 1000);

    const order = await SessionBookingService.createBookingOrder({
      userId: testUserId,
      therapistAccountId: testTherapistAccountId,
      slotStart: futureStart.toISOString(),
      slotEnd: futureEnd.toISOString(),
      sessionType: 'video',
      modality: 'telehealth',
      clientEmail: testClientEmail,
      clientNotes: 'Integration test session hold',
    });

    assert.ok(order.bookingId, 'Booking hold created');
    createdBookingId = order.bookingId;

    // Verify metadata has client_email
    const { data: bookingRow } = await supabase
      .from('therapy_session_bookings')
      .select('metadata')
      .eq('id', order.bookingId)
      .single();

    assert.strictEqual(
      (bookingRow?.metadata as any)?.client_email,
      testClientEmail,
      'booking.metadata.client_email accurately stored'
    );
    pass('Booking order successfully captures and persists client email in metadata');
  } catch (e) {
    fail('Booking Order with Client Email', e);
  }

  // --- SECTION 4: Payment Confirmation & Real Email Dispatch ---
  console.log('\n--- SECTION 4: Confirmation & Real Email Dispatch ---');
  try {
    // Intercept notifySessionConfirmed to assert email parameters
    let interceptedMailPayload: any = null;
    const originalNotify = EmailService.notifySessionConfirmed;
    EmailService.notifySessionConfirmed = async (data: any) => {
      interceptedMailPayload = data;
      return originalNotify.call(EmailService, data);
    };

    const confirmRes = await SessionBookingService.confirmSessionPayment({
      bookingId: createdBookingId,
      razorpayPaymentId: `pay_test_bypass_${Date.now()}`,
      razorpayOrderId: `order_test_bypass_${Date.now()}`,
    });

    EmailService.notifySessionConfirmed = originalNotify;

    assert.ok(confirmRes.success, 'Booking confirmed successfully');
    assert.ok(confirmRes.appointment, 'Appointment created');
    createdApptId = confirmRes.appointment.id;

    // Verify Meet Link is genuine or null (NEVER fabricated iwk-...)
    const apptMeetUrl = confirmRes.appointment.google_meet_url;
    if (apptMeetUrl) {
      assert.ok(
        isValidGoogleMeetUrl(apptMeetUrl),
        'If meet URL is present, must be valid canonical Google Meet'
      );
      assert.ok(
        !apptMeetUrl.includes('iwk-'),
        'Must NOT generate fabricated random code like iwk-xxxx-yyy'
      );
    } else {
      pass('No fake Google Meet code generated when clinician calendar not connected');
    }

    // Verify intercepted email dispatch received real recipient emails
    assert.ok(interceptedMailPayload, 'EmailService.notifySessionConfirmed was called');
    assert.strictEqual(
      interceptedMailPayload.clientEmail,
      testClientEmail,
      'Session confirmation email directed to client verified email'
    );
    assert.strictEqual(
      interceptedMailPayload.therapistEmail,
      'premsonarofficial@gmail.com',
      'Session confirmation email directed to real therapist profile email'
    );
    assert.notStrictEqual(
      interceptedMailPayload.clientEmail,
      'client@ingresswithin.com',
      'Client email must not be dummy fallback'
    );
    assert.notStrictEqual(
      interceptedMailPayload.therapistEmail,
      'therapist@ingresswithin.com',
      'Therapist email must not be dummy fallback'
    );
    pass('Session confirmation emails dispatch with authentic client and therapist addresses');
  } catch (e) {
    fail('Confirmation & Real Email Dispatch', e);
  } finally {
    // Cleanup created test records
    if (createdApptId) {
      await supabase.from('therapist_earnings').delete().eq('appointment_id', createdApptId);
      await supabase.from('therapist_clinical_appointments').delete().eq('id', createdApptId);
    }
    if (createdBookingId) {
      await supabase.from('therapy_session_bookings').delete().eq('id', createdBookingId);
    }
  }

  console.log('\n================================================================');
  console.log(` SUMMARY: ${passCount}/${passCount + failCount} Booking & Dispatch Tests Passed`);
  console.log('================================================================');

  if (failCount > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run();
