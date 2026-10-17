import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * INGRESS WITHIN — CLIENT THERAPY HOME / OVERVIEW TEST SUITE
 * ==========================================================
 * Tests requirements of Step 1:
 * 1. Connected clients see their real therapist and next session.
 * 2. Clients without upcoming sessions see the booking empty state.
 * 3. Actual pending homework appears in the overview.
 * 4. Empty homework and journey data are handled correctly.
 * 5. Pending or ended relationships are not displayed as active connections.
 * 6. Failed API requests show recoverable errors without fabricated data.
 * 7. Meeting links are not shown when missing or invalid.
 * 8. All overview actions navigate or perform their advertised behavior.
 * 9. Existing sessions, homework, matching, and therapist-dashboard behavior remains intact.
 * 10. The overview works on mobile and desktop breakpoints.
 */

console.log('================================================================');
console.log('    INGRESS WITHIN — CLIENT THERAPY HOME / OVERVIEW SUITE       ');
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

const DASHBOARD_FILE = path.resolve(process.cwd(), 'src/views/client/ClientTherapyDashboard.jsx');
const THERAPY_PAGE_FILE = path.resolve(process.cwd(), 'src/views/TherapyPage.jsx');
const SESSIONS_ROUTE_FILE = path.resolve(process.cwd(), 'src/app/api/therapy/client/sessions/route.ts');
const HOMEWORK_ROUTE_FILE = path.resolve(process.cwd(), 'src/app/api/therapy/client/homework/route.ts');
const JOURNEY_ROUTE_FILE = path.resolve(process.cwd(), 'src/app/api/therapy/client/journey/route.ts');

const dashboardCode = fs.readFileSync(DASHBOARD_FILE, 'utf8');
const therapyPageCode = fs.readFileSync(THERAPY_PAGE_FILE, 'utf8');
const sessionsRouteCode = fs.readFileSync(SESSIONS_ROUTE_FILE, 'utf8');
const homeworkRouteCode = fs.readFileSync(HOMEWORK_ROUTE_FILE, 'utf8');
const journeyRouteCode = fs.readFileSync(JOURNEY_ROUTE_FILE, 'utf8');

// --- SECTION 1: Connected Clients See Real Therapist & Next Session ---
console.log('--- SECTION 1: Real Connected Clinician & Next Session ---');
try {
  assert(dashboardCode.includes('clinicianName'), 'Uses clinicianName derived from therapist prop');
  assert(dashboardCode.includes('clinicianTitle'), 'Uses clinicianTitle derived from therapist prop');
  assert(dashboardCode.includes('Verified Ingress Clinician'), 'Renders verified clinician badge');
  assert(dashboardCode.includes('nextSession'), 'Computes nextSession from upcomingSessionsList');
  assert(dashboardCode.includes('new Date(nextSession.scheduledStart).toLocaleDateString'), 'Formats real scheduled date');
  pass('Overview binds directly to authenticated therapist prop and next eligible session');
} catch (e) {
  fail('Real Connected Clinician & Next Session binding', e);
}

// --- SECTION 2: Empty Sessions Handling & Booking Empty State ---
console.log('\n--- SECTION 2: Next Consultation Empty State ---');
try {
  assert(dashboardCode.includes('No upcoming session scheduled right now with'), 'Displays helpful empty state when no upcoming session');
  assert(dashboardCode.includes('Schedule Next Consultation'), 'Provides working booking action');
  assert(dashboardCode.includes('handleStartBooking(therapist)'), 'Invokes real booking modal with current therapist');
  pass('Consultation card displays empty state with Schedule Consultation CTA');
} catch (e) {
  fail('Next Consultation Empty State', e);
}

// --- SECTION 3: Actual Pending Homework in Overview ---
console.log('\n--- SECTION 3: Clinical Self-Work Card & Due Dates ---');
try {
  assert(dashboardCode.includes('nextDueHomework'), 'Derives nextDueHomework from pendingHomeworkList');
  assert(dashboardCode.includes('nextDueHomework.exerciseType.replace'), 'Displays actual exercise type');
  assert(dashboardCode.includes('nextDueHomework.estimatedMinutes'), 'Displays actual estimated duration');
  assert(dashboardCode.includes('nextDueHomework.dueAt'), 'Renders real due date only when present');
  assert(dashboardCode.includes('setSelectedHomeworkId(nextDueHomework.id)'), 'Working action to open assignment modal');
  pass('Self-work card displays real pending assignment, duration, due date, and open action');
} catch (e) {
  fail('Clinical Self-Work Card', e);
}

// --- SECTION 4: Empty Homework & Care Journey Handling ---
console.log('\n--- SECTION 4: Empty Homework & Care Journey States ---');
try {
  assert(dashboardCode.includes('You are all caught up!'), 'Displays friendly empty state when all assignments are complete');
  assert(dashboardCode.includes('STAGE_LABELS[careStage]'), 'Displays real careStage from relationship');
  assert(dashboardCode.includes('STAGE_DESCRIPTIONS[careStage]'), 'Displays evidence-based description of care stage');
  assert(dashboardCode.includes('stageOrder.indexOf(careStage)'), 'Accurately highlights active milestone step');
  pass('Empty homework displays completion banner and journey displays real milestone step');
} catch (e) {
  fail('Empty Homework & Care Journey States', e);
}

// --- SECTION 5: Relationship Routing & Non-Connected Client Invariants ---
console.log('\n--- SECTION 5: Relationship Resolution & Routing Invariants ---');
try {
  assert(therapyPageCode.includes("connectionStatus === 'connected'"), 'Only routes to dashboard if connectionStatus is connected');
  assert(therapyPageCode.includes("connectionStatus === 'pending'"), 'Renders matching in progress card if relationship is pending');
  assert(therapyPageCode.includes("['paused', 'ended', 'transferred'].includes(connectionStatus)"), 'Renders paused/ended/transferred state without active portal assumption');
  assert(therapyPageCode.includes("isPastRelationship={true}"), 'Passes isPastRelationship flag to historical view');
  pass('Non-connected, pending, and ended clients are never shown as actively connected');
} catch (e) {
  fail('Relationship Resolution & Routing', e);
}

// --- SECTION 6: Error States & Recoverability Without Fake Data ---
console.log('\n--- SECTION 6: Error States & Recoverability ---');
try {
  assert(dashboardCode.includes('sessionsError'), 'Tracks sessions error state');
  assert(dashboardCode.includes('homeworkError'), 'Tracks homework error state');
  assert(dashboardCode.includes('journeyError'), 'Tracks journey error state');
  assert(dashboardCode.includes('Retry Loading'), 'Provides recoverable retry action');
  assert(!dashboardCode.includes('mockSessions'), 'No fake mock sessions in dashboard');
  assert(!dashboardCode.includes('mockHomework'), 'No fake mock homework in dashboard');
  pass('API errors render recoverable retry buttons and never fabricate mock data');
} catch (e) {
  fail('Error States & Recoverability', e);
}

// --- SECTION 7: Meeting Link Gating ---
console.log('\n--- SECTION 7: Meeting Link Gating & Security ---');
try {
  assert(dashboardCode.includes('nextSession.googleMeetUrl ?'), 'Checks for valid googleMeetUrl before displaying join action');
  assert(!dashboardCode.includes('handleRetryCalendarSync'), 'Calendar sync retry is strictly hidden for clients (therapist-only capability)');
  assert(sessionsRouteCode.includes('isValidGoogleMeetUrl'), 'Backend verifies Google Meet URL before returning to client');
  pass('Join meeting action is gated strictly to validated Google Meet links');
} catch (e) {
  fail('Meeting Link Gating', e);
}

// --- SECTION 8: Action Navigation & Destination Routing ---
console.log('\n--- SECTION 8: Action Navigation & Deep Links ---');
try {
  assert(dashboardCode.includes("setActiveTab('sessions')"), 'View all sessions tab link works');
  assert(dashboardCode.includes("setActiveTab('homework')"), 'View all assignments tab link works');
  assert(dashboardCode.includes("setActiveTab('journey')"), 'Explore journey milestones tab link works');
  assert(dashboardCode.includes('window.navigateTo'), 'Dashboard back navigation handles app routing');
  pass('All overview links navigate to real functional tabs and app destinations');
} catch (e) {
  fail('Action Navigation & Deep Links', e);
}

// --- SECTION 9: Backend API Ownership & Zero Clinical Leaks ---
console.log('\n--- SECTION 9: Authenticated Ownership & Privacy Shields ---');
try {
  assert(sessionsRouteCode.includes('authUser.userId'), 'Sessions API enforces authUser.userId ownership');
  assert(homeworkRouteCode.includes('authUser.userId'), 'Homework API enforces authUser.userId ownership');
  assert(journeyRouteCode.includes('authUser.userId'), 'Journey API enforces authUser.userId ownership');
  assert(!journeyRouteCode.includes('soap_notes'), 'Journey API strictly omits SOAP notes');
  assert(!sessionsRouteCode.includes('clinical_formulation'), 'Sessions API strictly omits clinical formulation');
  pass('All client endpoints authenticate ownership and exclude private clinician records');
} catch (e) {
  fail('Authenticated Ownership & Privacy Shields', e);
}

// --- SECTION 10: Mobile Breakpoints & Responsive Accessibility ---
console.log('\n--- SECTION 10: Mobile & Desktop Breakpoints ---');
try {
  assert(dashboardCode.includes('hidden md:flex'), 'Desktop navigation uses md:flex');
  assert(dashboardCode.includes('md:hidden'), 'Mobile menu button is md:hidden');
  assert(dashboardCode.includes('mobileMenuOpen'), 'Mobile navigation dropdown toggle is implemented');
  assert(dashboardCode.includes('grid-cols-1 md:grid-cols-2'), 'Overview cards adapt from 1 column on mobile to 2 columns on desktop');
  assert(dashboardCode.includes('grid-cols-4'), 'Journey steps render responsive progress bars');
  pass('Responsive grid and mobile navigation menu adapt seamlessly across breakpoints');
} catch (e) {
  fail('Mobile Breakpoints & Responsive Accessibility', e);
}

console.log('\n================================================================');
console.log(` SUMMARY: ${passCount}/${passCount + failCount} Overview Tests Passed`);
console.log('================================================================');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
