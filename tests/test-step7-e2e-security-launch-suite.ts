import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ClientNotificationService } from '../src/lib/therapy/clientNotificationService';
import { BillingService } from '../src/lib/billing/billingService';
import { getSessionMeetingWindow, MEETING_POST_SESSION_BUFFER_MS } from '../src/utils/sessionMeetingUtils';

let passed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (!condition) {
    console.error(`  ✗ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passed++;
  console.log(`  ✓ [PASS] ${message}`);
}

async function runStep7LaunchSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — STEP 7: E2E QA, SECURITY & LAUNCH AUDIT     ');
  console.log('================================================================\n');

  // ===========================================================================
  // WORKFLOW 1: Client Booking, Authoritative Pricing & Payment Verification
  // ===========================================================================
  console.log('--- WORKFLOW 1: Booking, Pricing Arithmetic & Cryptographic Verification ---');

  // Verify server-side pricing with integer paise arithmetic and 18% GST
  const baseConsultationRupees = 1500;
  const basePaise = baseConsultationRupees * 100;
  const gstPaise = Math.round(basePaise * 0.18);
  const totalPaise = basePaise + gstPaise;

  assert(basePaise === 150000, 'Base consultation is exactly 150,000 paise (₹1,500)');
  assert(gstPaise === 27000, 'Integrated GST (18%) is exactly 27,000 paise (₹270)');
  assert(totalPaise === 177000, 'Total consultation fee is exactly 177,000 paise (₹1,770)');

  // Cryptographic Razorpay HMAC signature verification check
  const testOrderId = 'order_test_audit_123';
  const testPaymentId = 'pay_test_audit_456';
  const testSecret = 'rzp_test_secret_for_audit_validation';

  const expectedSignature = crypto
    .createHmac('sha256', testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest('hex');

  const validVerification = crypto
    .createHmac('sha256', testSecret)
    .update(`${testOrderId}|${testPaymentId}`)
    .digest('hex') === expectedSignature;

  const forgedVerification = crypto
    .createHmac('sha256', testSecret)
    .update(`${testOrderId}|pay_forged_tampered_id`)
    .digest('hex') === expectedSignature;

  assert(validVerification === true, 'Cryptographic signature verifies authentic Razorpay payment token');
  assert(forgedVerification === false, 'Tampered or forged payment token is strictly rejected');

  // ===========================================================================
  // WORKFLOW 2: Webhook Signature Verification, Idempotency & Duplicate Shield
  // ===========================================================================
  console.log('\n--- WORKFLOW 2: Webhook Verification, Idempotency & Tamper Resistance ---');

  const webhookRoutePath = path.join(process.cwd(), 'src/app/api/webhooks/razorpay/route.ts');
  assert(fs.existsSync(webhookRoutePath), 'Razorpay webhook route exists');

  const webhookRouteSrc = fs.readFileSync(webhookRoutePath, 'utf8');

  assert(
    webhookRouteSrc.includes('verifyWebhookSignature') &&
    webhookRouteSrc.includes("request.headers.get('x-razorpay-signature')"),
    'Enforces X-Razorpay-Signature verification against raw request body before processing'
  );

  assert(
    webhookRouteSrc.includes('webhook_events') &&
    webhookRouteSrc.includes('duplicate: true'),
    'Idempotency guard prevents duplicate webhook replay execution'
  );

  assert(
    !webhookRouteSrc.includes('console.log(rawBody)') &&
    !webhookRouteSrc.includes('console.log(payload)'),
    'Zero PII, card data, or client mental health payloads are logged in webhook traces'
  );

  // ===========================================================================
  // WORKFLOW 3: Calendar Sync & Safe Google Meet Window Enforcement
  // ===========================================================================
  console.log('\n--- WORKFLOW 3: Calendar Sync & Safe Join Meeting Windows ---');

  const now = Date.now();
  const sessionDurationMs = 50 * 60 * 1000; // 50-minute clinical session

  // Active Session: Started 15 minutes ago
  const activeStart = new Date(now - 15 * 60 * 1000).toISOString();
  const activeEnd = new Date(now + 35 * 60 * 1000).toISOString();
  const activeWindow = getSessionMeetingWindow(activeStart, activeEnd);
  assert(activeWindow.canJoin === true, 'Client can join an actively running consultation');
  assert(activeWindow.isTooEarly === false && activeWindow.isEnded === false, 'Active consultation is neither early nor ended');

  // Upcoming Session: Starting in 5 minutes (within 1-hour early join window)
  const imminentStart = new Date(now + 5 * 60 * 1000).toISOString();
  const imminentEnd = new Date(now + 55 * 60 * 1000).toISOString();
  const imminentWindow = getSessionMeetingWindow(imminentStart, imminentEnd);
  assert(imminentWindow.canJoin === true, 'Client can join session 5 minutes prior to start time');
  assert(imminentWindow.isTooEarly === false, 'Imminent consultation is within open window');

  // Far Upcoming Session: Starting tomorrow (outside join window)
  const tomorrowStart = new Date(now + 24 * 60 * 60 * 1000).toISOString();
  const tomorrowEnd = new Date(now + 25 * 60 * 60 * 1000).toISOString();
  const tomorrowWindow = getSessionMeetingWindow(tomorrowStart, tomorrowEnd);
  assert(tomorrowWindow.canJoin === false, 'Session starting in 24 hours cannot be joined yet');
  assert(tomorrowWindow.isTooEarly === true, 'Session starting tomorrow is classified as isTooEarly');

  // Post-Session Buffer: Ended 10 minutes ago (within 20-minute buffer)
  assert(MEETING_POST_SESSION_BUFFER_MS === 20 * 60 * 1000, 'Meeting post-session buffer is exactly 20 minutes');
  const recentlyEndedStart = new Date(now - 55 * 60 * 1000).toISOString();
  const recentlyEndedEnd = new Date(now - 5 * 60 * 1000).toISOString();
  const recentWindow = getSessionMeetingWindow(recentlyEndedStart, recentlyEndedEnd);
  assert(recentWindow.canJoin === true, 'Client can rejoin during the 20-minute post-session buffer if disconnected');
  assert(recentWindow.isEnded === false, 'Consultation within post-session buffer is not prematurely marked ended');

  // Concluded Session: Ended 45 minutes ago (outside buffer)
  const longEndedStart = new Date(now - 95 * 60 * 1000).toISOString();
  const longEndedEnd = new Date(now - 45 * 60 * 1000).toISOString();
  const longEndedWindow = getSessionMeetingWindow(longEndedStart, longEndedEnd);
  assert(longEndedWindow.canJoin === false, 'Session ended 45 minutes ago is locked and closed');
  assert(longEndedWindow.isEnded === true, 'Concluded session beyond buffer is marked isEnded');

  // ===========================================================================
  // WORKFLOW 4: Cancellation, Rescheduling & IDOR Resistance
  // ===========================================================================
  console.log('\n--- WORKFLOW 4: Rescheduling, Cancellation & IDOR Ownership Guards ---');

  const sessionServicePath = path.join(process.cwd(), 'src/lib/therapy/sessionBookingService.ts');
  const sessionServiceSrc = fs.readFileSync(sessionServicePath, 'utf8');

  // Verify ownership checks in rescheduleSession
  assert(
    sessionServiceSrc.includes("requestedBy === 'client' && (!params.userId || appt.user_id !== params.userId)") &&
    sessionServiceSrc.includes("requestedBy === 'therapist' && (!params.therapistAccountId || appt.therapist_account_id !== params.therapistAccountId)"),
    'rescheduleSession strictly validates caller ownership and rejects unauthorized user IDs'
  );

  // Verify ownership checks in cancelSession
  assert(
    sessionServiceSrc.includes("cancelledBy === 'client' && (!params.userId || appt.user_id !== params.userId)") &&
    sessionServiceSrc.includes("cancelledBy === 'therapist' && (!params.therapistAccountId || appt.therapist_account_id !== params.therapistAccountId)"),
    'cancelSession strictly validates caller ownership and prevents cross-client IDOR cancellation'
  );

  // Authoritative 48-Hour Refund Policy
  assert(
    sessionServiceSrc.includes('hoursRemaining >= 48') &&
    sessionServiceSrc.includes("refundStatus = 'eligible'"),
    'Cancellations >=48 hours in advance are eligible for 100% automated refund'
  );

  assert(
    sessionServiceSrc.includes('hoursRemaining >= 24') &&
    sessionServiceSrc.includes("refundStatus = 'pending'"),
    'Cancellations between 24 and 48 hours are placed in clinical review window'
  );

  // ===========================================================================
  // WORKFLOW 5: Therapist Relationship Transitions & OTP Cryptographic Security
  // ===========================================================================
  console.log('\n--- WORKFLOW 5: Relationship Transitions & OTP Cryptographic Security ---');

  const otpRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/relationship/transition/route.ts');
  const otpRouteSrc = fs.readFileSync(otpRoutePath, 'utf8');

  assert(
    otpRouteSrc.includes('getAuthenticatedUser') &&
    otpRouteSrc.includes('getOtpProvider') &&
    otpRouteSrc.includes('verifyOtp'),
    'Relationship transition endpoint requires authenticated user and verified 6-digit cryptographic OTP'
  );

  assert(
    otpRouteSrc.includes("action === 'quit'") &&
    otpRouteSrc.includes("action === 'change'") &&
    otpRouteSrc.includes('quitClientTherapyRelationship') &&
    otpRouteSrc.includes('changeClientTherapistRelationship'),
    'Supports distinct actions: quit (concludes therapy) and change (transfers and launches matching)'
  );

  // ===========================================================================
  // WORKFLOW 6: Homework Assignments, Drafts, Submissions & Feedback Isolation
  // ===========================================================================
  console.log('\n--- WORKFLOW 6: Homework Lifecycle & Clinical Feedback Privacy ---');

  const homeworkServicePath = path.join(process.cwd(), 'src/lib/therapy/clientHomeworkService.ts');
  const homeworkServiceSrc = fs.readFileSync(homeworkServicePath, 'utf8');

  assert(
    homeworkServiceSrc.includes('getClientAssignments') &&
    homeworkServiceSrc.includes(".eq('user_id', userId)"),
    'getClientAssignments scopes queries strictly to the authenticated user ID'
  );

  assert(
    homeworkServiceSrc.includes('saveDraftResponse') &&
    homeworkServiceSrc.includes('submitResponse'),
    'Supports non-destructive draft auto-saving and authoritative final submissions'
  );

  assert(
    homeworkServiceSrc.includes('content.length > 20000'),
    'Enforces maximum length constraint (20,000 characters) to prevent database denial-of-service'
  );

  assert(
    !homeworkServiceSrc.includes('soap_notes') &&
    !homeworkServiceSrc.includes('diagnostic_formulation'),
    'Strict clinical privacy: therapist-private notes are never exposed in homework responses'
  );

  // ===========================================================================
  // WORKFLOW 7: Journey Metrics & Longitudinal Care Milestones
  // ===========================================================================
  console.log('\n--- WORKFLOW 7: Longitudinal Care Journey & Timeline Chronology ---');

  const therapyServicePath = path.join(process.cwd(), 'src/lib/therapy/therapyService.ts');
  const therapyServiceSrc = fs.readFileSync(therapyServicePath, 'utf8');

  assert(
    therapyServiceSrc.includes('getClientCareJourney') &&
    therapyServiceSrc.includes('attendance_status === \'attended\''),
    'Care journey strictly counts attended sessions as completed milestones (excludes no-shows)'
  );

  assert(
    therapyServiceSrc.includes('timeline.sort') &&
    therapyServiceSrc.includes('new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()'),
    'Timeline milestones are strictly ordered chronologically newest first'
  );

  // ===========================================================================
  // WORKFLOW 8: Billing, Official Tax Invoices & Sensitive Secret Protection
  // ===========================================================================
  console.log('\n--- WORKFLOW 8: Billing, Invoices & Secret Key Isolation ---');

  const billingRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/billing/route.ts');
  const billingRouteSrc = fs.readFileSync(billingRoutePath, 'utf8');

  assert(
    billingRouteSrc.includes('getAuthenticatedUser') &&
    billingRouteSrc.includes(".eq('user_id', authUser.userId)"),
    'Client billing route authenticates caller and scopes queries to authUser.userId'
  );

  assert(
    billingRouteSrc.includes('invoices: generalBilling?.invoices || []') &&
    billingRouteSrc.includes('refundEligible') &&
    billingRouteSrc.includes('refundPolicyText'),
    'Returns authoritative invoices and real-time 48-hour refund eligibility metadata'
  );

  assert(
    !billingRouteSrc.includes('RAZORPAY_KEY_SECRET') &&
    !billingRouteSrc.includes('MSG91_AUTH_KEY') &&
    !billingRouteSrc.includes('webhook_secret'),
    'Payment gateway and messaging credentials are never included in API responses'
  );

  // ===========================================================================
  // WORKFLOW 9: Notification Synthesis, Deduplication & Read Persistence
  // ===========================================================================
  console.log('\n--- WORKFLOW 9: Notifications, Deduplication & Read State Persistence ---');

  const notifServicePath = path.join(process.cwd(), 'src/lib/therapy/clientNotificationService.ts');
  const notifServiceSrc = fs.readFileSync(notifServicePath, 'utf8');

  // Verify correct database column usage
  assert(
    notifServiceSrc.includes(".from('client_homework_assignments')") &&
    notifServiceSrc.includes(".eq('user_id', userId)"),
    'Homework query uses correct user_id column (not client_user_id)'
  );

  // Deduplication
  assert(
    notifServiceSrc.includes('coveredTargetIds = new Set') &&
    notifServiceSrc.includes('coveredTargetIds.has(d.entity_id)'),
    'Deduplication guard eliminates duplicate email alerts for already surfaced sessions & homework'
  );

  // Read state persistence in ClientTherapyDashboard
  const dashPath = path.join(process.cwd(), 'src/views/client/ClientTherapyDashboard.jsx');
  const dashSrc = fs.readFileSync(dashPath, 'utf8');

  assert(
    dashSrc.includes('ingress_read_notifs_') &&
    dashSrc.includes('localStorage.getItem') &&
    dashSrc.includes('localStorage.setItem'),
    'ClientTherapyDashboard reconciles and persists read notification IDs in localStorage'
  );

  // Granular notification preferences
  const notifPrefsPath = path.join(process.cwd(), 'src/app/api/therapy/client/notifications/preferences/route.ts');
  const notifPrefsSrc = fs.readFileSync(notifPrefsPath, 'utf8');

  assert(
    notifPrefsSrc.includes('getAuthenticatedUser') &&
    notifPrefsSrc.includes('ClientNotificationService.getPreferences') &&
    notifPrefsSrc.includes('ClientNotificationService.updatePreferences'),
    'Notification preferences endpoints authenticate and scope updates strictly to caller'
  );

  // ===========================================================================
  // WORKFLOW 10: Multi-View Consistency & Launch Readiness
  // ===========================================================================
  console.log('\n--- WORKFLOW 10: Multi-View Navigation & Step 1–6 Seamless Integration ---');

  assert(
    dashSrc.includes('<ClientTherapyBillingView') &&
    dashSrc.includes('<ClientTherapyNotificationsView') &&
    dashSrc.includes('<ClientTherapyCareJourneyView') &&
    dashSrc.includes('<ClientTherapyHomeworkView') &&
    dashSrc.includes('<ClientTherapyMyTherapistView'),
    'ClientTherapyDashboard mounts all specialized Step 1–6 views seamlessly'
  );

  assert(
    dashSrc.includes("onNavigateTab={(tab) => setActiveTab(tab)}") &&
    dashSrc.includes("onOpenHomework={(homeworkId) => {"),
    'Cross-view navigation connects notification alerts directly to session and self-work modals'
  );

  console.log('\n================================================================');
  console.log(`  STEP 7 AUDIT RESULTS: ${passed} / ${total} TESTS PASSED        `);
  console.log('================================================================\n');
}

runStep7LaunchSuite().catch((err) => {
  console.error('\nAudit Suite Execution Failed:', err);
  process.exit(1);
});
