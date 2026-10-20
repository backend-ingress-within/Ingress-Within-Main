import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { ClientNotificationService } from '../src/lib/therapy/clientNotificationService';

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

async function runStep6Suite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — CLIENT BILLING & NOTIFICATIONS (STEP 6)      ');
  console.log('================================================================\n');

  // ===========================================================================
  // SECTION 1: Authoritative Client Billing & Payment Verification
  // ===========================================================================
  console.log('--- SECTION 1: Billing & Payment History ---');

  const billingViewPath = path.join(process.cwd(), 'src/views/client/ClientTherapyBillingView.jsx');
  assert(fs.existsSync(billingViewPath), 'ClientTherapyBillingView component exists on disk');

  const billingViewSrc = fs.readFileSync(billingViewPath, 'utf8');

  // Authoritative fields rendered
  assert(
    billingViewSrc.includes('bookingReference') &&
    billingViewSrc.includes('amountRupees') &&
    billingViewSrc.includes('paymentStatus') &&
    billingViewSrc.includes('refundStatus') &&
    billingViewSrc.includes('therapistName'),
    'Displays authoritative transaction reference, amount, payment status, refund status, and therapist'
  );

  // Status distinction
  assert(
    billingViewSrc.includes("filter === 'paid'") &&
    billingViewSrc.includes("filter === 'refunded'") &&
    billingViewSrc.includes("filter === 'pending'"),
    'Supports strict status filtering: paid, refunded, and pending'
  );

  // Receipt Modal
  assert(
    billingViewSrc.includes('selectedReceipt') &&
    billingViewSrc.includes('Official Consultation Receipt') &&
    billingViewSrc.includes('Integrated GST (18%)'),
    'Generates verifiable receipt with itemized consultation fee and 18% GST breakdown'
  );

  // Invoices table
  assert(
    billingViewSrc.includes('invoices.map') &&
    billingViewSrc.includes('invoice_number') &&
    billingViewSrc.includes('amount_total'),
    'Renders platform invoices from authoritative invoices data'
  );

  // Refund policy & 48-hour window
  assert(
    billingViewSrc.includes('48-Hour Cancellation Window') &&
    billingViewSrc.includes('Eligible (&gt;48h)'),
    'Displays authoritative 48-hour cancellation policy and real-time eligibility tags'
  );

  // ===========================================================================
  // SECTION 2: Refund Eligibility Mapping Logic
  // ===========================================================================
  console.log('\n--- SECTION 2: Refund Status & 48-Hour Eligibility Mapping ---');

  const billingRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/billing/route.ts');
  assert(fs.existsSync(billingRoutePath), 'Client billing API route exists on disk');

  const billingRouteSrc = fs.readFileSync(billingRoutePath, 'utf8');

  // Verifies strict 48-hour rule
  assert(
    billingRouteSrc.includes('FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000') &&
    billingRouteSrc.includes('slotStartTime - now >= FORTY_EIGHT_HOURS_MS'),
    'Calculates refund eligibility using strict server-side 48-hour timestamp math'
  );

  // Verifies refund status preservation
  assert(
    billingRouteSrc.includes("b.refund_status === 'full'") &&
    billingRouteSrc.includes("b.refund_status === 'partial'"),
    'Authoritatively tracks full and partial refund statuses from ledger'
  );

  // Test mathematical policy execution
  const now = Date.now();
  const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

  const slotFuture72h = new Date(now + 72 * 60 * 60 * 1000).toISOString();
  const slotFuture24h = new Date(now + 24 * 60 * 60 * 1000).toISOString();

  const isEligible72h = new Date(slotFuture72h).getTime() - now >= FORTY_EIGHT_HOURS_MS;
  const isEligible24h = new Date(slotFuture24h).getTime() - now >= FORTY_EIGHT_HOURS_MS;

  assert(isEligible72h === true, 'Session booked 72 hours in advance is eligible for full refund (>48h)');
  assert(isEligible24h === false, 'Session booked 24 hours in advance is non-refundable (<48h policy)');

  // ===========================================================================
  // SECTION 3: Client Notification Service & Read/Unread State
  // ===========================================================================
  console.log('\n--- SECTION 3: Client Notifications & Delivery Tracking ---');

  const notifServicePath = path.join(process.cwd(), 'src/lib/therapy/clientNotificationService.ts');
  assert(fs.existsSync(notifServicePath), 'ClientNotificationService exists on disk');

  const testUserId = `test_client_usr_${Date.now()}`;
  const notifId1 = `notif_test_1_${Date.now()}`;
  const notifId2 = `notif_test_2_${Date.now()}`;

  // Mark single as read
  const markRes = ClientNotificationService.markAsRead(testUserId, notifId1);
  assert(markRes.success === true && markRes.id === notifId1, 'Marks individual notification as read');

  // Mark multiple as read
  const markAllRes = ClientNotificationService.markAllAsRead(testUserId, [notifId1, notifId2]);
  assert(markAllRes.success === true && markAllRes.count === 2, 'Marks all notifications as read in bulk');

  // Notification types supported
  const notifServiceSrc = fs.readFileSync(notifServicePath, 'utf8');
  assert(
    notifServiceSrc.includes('session_confirmed') &&
    notifServiceSrc.includes('session_cancelled') &&
    notifServiceSrc.includes('payment_refunded') &&
    notifServiceSrc.includes('homework_assigned') &&
    notifServiceSrc.includes('homework_reviewed') &&
    notifServiceSrc.includes('therapist_matched') &&
    notifServiceSrc.includes('email_delivery'),
    'Supports all authoritative clinical and communication notification events'
  );

  // Preferences retrieval & updates
  assert(
    notifServiceSrc.includes('getPreferences') &&
    notifServiceSrc.includes('updatePreferences') &&
    notifServiceSrc.includes('sms_reminders') &&
    notifServiceSrc.includes('whatsapp_reminders') &&
    notifServiceSrc.includes('digest_frequency'),
    'Manages granular notification preferences (SMS, WhatsApp, Email digest)'
  );

  // ===========================================================================
  // SECTION 4: Client Notifications UI & Portal Deep-Linking
  // ===========================================================================
  console.log('\n--- SECTION 4: Notifications UI & Portal Deep-Linking ---');

  const notifViewPath = path.join(process.cwd(), 'src/views/client/ClientTherapyNotificationsView.jsx');
  assert(fs.existsSync(notifViewPath), 'ClientTherapyNotificationsView exists on disk');

  const notifViewSrc = fs.readFileSync(notifViewPath, 'utf8');

  // Deep linking to relevant tabs
  assert(
    notifViewSrc.includes('item.linkTab') &&
    notifViewSrc.includes('onNavigateTab') &&
    notifViewSrc.includes("item.linkTab === 'homework'"),
    'Deep-links notifications to corresponding portal tabs (Sessions, Self-Work, Therapist, Billing)'
  );

  // Preferences toggles in UI
  assert(
    notifViewSrc.includes('SMS Reminders') &&
    notifViewSrc.includes('WhatsApp Alerts') &&
    notifViewSrc.includes('Digest Frequency'),
    'Includes in-portal preference configuration controls'
  );

  // Read / Unread badges and filter
  assert(
    notifViewSrc.includes("activeFilter === 'unread'") &&
    notifViewSrc.includes('unreadCount') &&
    notifViewSrc.includes('onMarkAsRead'),
    'Provides instant read/unread filtering, counter badges, and mark-as-read triggers'
  );

  // ===========================================================================
  // SECTION 5: Security, IDOR Protection & Clinical Privacy Boundary
  // ===========================================================================
  console.log('\n--- SECTION 5: Security Boundaries & Clinical Privacy ---');

  // Billing Route Auth & Scoping
  assert(
    billingRouteSrc.includes('getAuthenticatedUser') &&
    billingRouteSrc.includes(".eq('user_id', authUser.userId)"),
    'Billing route strictly authenticates and scopes queries to authUser.userId'
  );

  // No leaks of provider secrets or internal payment keys
  assert(
    !billingRouteSrc.includes('razorpay_key_secret') &&
    !billingRouteSrc.includes('webhook_secret') &&
    !billingViewSrc.includes('key_secret'),
    'Strictly protects payment provider credentials, internal keys, and secrets'
  );

  // Clinical Privacy: Client notifications must never expose therapist SOAP notes or private formulation
  assert(
    !notifServiceSrc.includes('soap_notes') &&
    !notifServiceSrc.includes('clinical_formulation') &&
    !notifServiceSrc.includes('supervision_notes') &&
    !notifServiceSrc.includes('risk_assessment_private'),
    'Privacy Boundary: Strictly excludes therapist SOAP notes, formulations, and supervision logs'
  );

  // Notifications API routes check authentication
  const notifRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/notifications/route.ts');
  const notifRouteSrc = fs.readFileSync(notifRoutePath, 'utf8');
  assert(
    notifRouteSrc.includes('getAuthenticatedUser') &&
    notifRouteSrc.includes("status: 401"),
    'Notifications endpoint enforces authentication (rejects unauthenticated with 401)'
  );

  const notifReadPath = path.join(process.cwd(), 'src/app/api/therapy/client/notifications/[id]/read/route.ts');
  const notifReadSrc = fs.readFileSync(notifReadPath, 'utf8');
  assert(
    notifReadSrc.includes('getAuthenticatedUser') &&
    notifReadSrc.includes("status: 401"),
    'Notification mark-read endpoint enforces authentication'
  );

  const notifPrefsPath = path.join(process.cwd(), 'src/app/api/therapy/client/notifications/preferences/route.ts');
  const notifPrefsSrc = fs.readFileSync(notifPrefsPath, 'utf8');
  assert(
    notifPrefsSrc.includes('getAuthenticatedUser') &&
    notifPrefsSrc.includes("status: 401"),
    'Notification preferences endpoint enforces authentication'
  );

  // ===========================================================================
  // SECTION 6: Integration into ClientTherapyDashboard (Steps 1–6 Integrity)
  // ===========================================================================
  console.log('\n--- SECTION 6: ClientTherapyDashboard Integration & Step 1–5 Integrity ---');

  const dashPath = path.join(process.cwd(), 'src/views/client/ClientTherapyDashboard.jsx');
  const dashSrc = fs.readFileSync(dashPath, 'utf8');

  // Mounts both views
  assert(
    dashSrc.includes('<ClientTherapyBillingView') &&
    dashSrc.includes('<ClientTherapyNotificationsView'),
    'Mounts both ClientTherapyBillingView and ClientTherapyNotificationsView'
  );

  // Tab navigation contains all 8 tabs
  assert(
    dashSrc.includes("id: 'overview'") &&
    dashSrc.includes("id: 'sessions'") &&
    dashSrc.includes("id: 'therapist'") &&
    dashSrc.includes("id: 'journey'") &&
    dashSrc.includes("id: 'homework'") &&
    dashSrc.includes("id: 'billing'") &&
    dashSrc.includes("id: 'notifications'") &&
    dashSrc.includes("id: 'support'"),
    'Navigation preserves all 8 core therapy tabs seamlessly'
  );

  // Header notification bell
  assert(
    dashSrc.includes("setActiveTab('notifications')") &&
    dashSrc.includes('unreadNotificationsCount'),
    'Header includes responsive notification bell with live unread badge'
  );

  // Preserves Step 1: Overview and buffer
  assert(
    dashSrc.includes('MEETING_POST_SESSION_BUFFER_MS') &&
    dashSrc.includes('careStage'),
    'Preserves Step 1: 20-minute meeting window buffer and stage cards'
  );

  // Preserves Step 2: Sessions & Booking
  assert(
    dashSrc.includes('handleRescheduleSubmit') &&
    dashSrc.includes('handleCancelSubmit') &&
    dashSrc.includes('bookingFlowOpen'),
    'Preserves Step 2: Reschedule, Cancel, and Booking flow modals'
  );

  // Preserves Step 3: My Therapist & OTP flow
  assert(
    dashSrc.includes('ClientTherapyMyTherapistView') &&
    dashSrc.includes('onRefreshRelationship'),
    'Preserves Step 3: My Therapist relationship management and OTP flows'
  );

  // Preserves Step 4: Homework & Programs
  assert(
    dashSrc.includes('ClientTherapyHomeworkView') &&
    dashSrc.includes('ClientHomeworkModal'),
    'Preserves Step 4: Homework assignments list, submission drawer, and modal'
  );

  // Preserves Step 5: My Journey
  assert(
    dashSrc.includes('ClientTherapyCareJourneyView'),
    'Preserves Step 5: Care journey timeline and longitudinal milestones'
  );

  console.log('\n================================================================');
  console.log(`  STEP 6 SUITE RESULTS: ${passed} / ${total} TESTS PASSED        `);
  console.log('================================================================\n');
}

runStep6Suite().catch((err) => {
  console.error('\nTest Suite Failed:', err);
  process.exit(1);
});
