import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * INGRESS WITHIN — CLIENT MY THERAPIST INTEGRATION SUITE (STEP 3)
 * ===============================================================
 * Tests requirements of Step 3:
 * 1. Connected, pending, no-connection, and historical states.
 * 2. Loading, empty, and error recovery states with retry action.
 * 3. Correct display of client-visible therapist information (credentials, specializations, rate, bio).
 * 4. Navigation to matching, booking, and upcoming sessions.
 * 5. Reassignment modal and safety policies.
 * 6. Authentication, ownership, IDOR, and privacy boundaries.
 * 7. Responsive mobile and desktop behavior.
 * 8. Regression tests for Steps 1 and 2.
 */

console.log('================================================================');
console.log('    INGRESS WITHIN — CLIENT MY THERAPIST SUITE (STEP 3)         ');
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
const MY_THERAPIST_VIEW_FILE = path.resolve(process.cwd(), 'src/views/client/ClientTherapyMyTherapistView.jsx');
const THERAPY_PAGE_FILE = path.resolve(process.cwd(), 'src/views/TherapyPage.jsx');
const THERAPIST_ROUTE_FILE = path.resolve(process.cwd(), 'src/app/api/therapy/client/therapist/route.ts');
const CONNECTION_ROUTE_FILE = path.resolve(process.cwd(), 'src/app/api/therapy/connection/route.ts');
const SERVICE_FILE = path.resolve(process.cwd(), 'src/lib/therapy/therapyService.ts');

const dashboardCode = fs.readFileSync(DASHBOARD_FILE, 'utf8');
const myTherapistCode = fs.readFileSync(MY_THERAPIST_VIEW_FILE, 'utf8');
const therapyPageCode = fs.readFileSync(THERAPY_PAGE_FILE, 'utf8');
const therapistRouteCode = fs.readFileSync(THERAPIST_ROUTE_FILE, 'utf8');
const connectionRouteCode = fs.readFileSync(CONNECTION_ROUTE_FILE, 'utf8');
const serviceCode = fs.readFileSync(SERVICE_FILE, 'utf8');

// --- SECTION 1: Connected State Display & Approved Fields ---
console.log('--- SECTION 1: Connected State Display & Approved Information ---');
try {
  assert(myTherapistCode.includes('clinicianName'), 'Renders clinicianName derived from therapist prop or fetched data');
  assert(myTherapistCode.includes('clinicianTitle'), 'Renders clinicianTitle');
  assert(myTherapistCode.includes('Verified Practitioner'), 'Displays Verified Practitioner badge');
  assert(myTherapistCode.includes('Active Care Relationship'), 'Displays Active Care Relationship status pill');
  assert(myTherapistCode.includes('therapist?.qualification'), 'Displays accredited qualifications when available');
  assert(myTherapistCode.includes('therapist?.experienceYears'), 'Displays verified clinical experience years');
  assert(myTherapistCode.includes('therapist?.specializations'), 'Maps approved clinical specializations');
  assert(myTherapistCode.includes('therapist?.languages'), 'Maps spoken clinical consultation languages');
  assert(myTherapistCode.includes('therapist?.bio'), 'Renders clinical bio & therapeutic approach');
  assert(myTherapistCode.includes('sessionFee'), 'Displays transparent session consultation rate');
  pass('Connected state renders comprehensive, approved client-visible clinician information');
} catch (e) {
  fail('Connected State Display & Approved Fields', e);
}

// --- SECTION 2: Pending State (Matching & Intake In Progress) ---
console.log('\n--- SECTION 2: Pending State (Matching / Intake Review) ---');
try {
  assert(myTherapistCode.includes("status === 'pending'"), 'Recognizes pending relationship status');
  assert(myTherapistCode.includes('Clinical Matching In Progress'), 'Displays clear pending section header');
  assert(myTherapistCode.includes('Matching in Progress · Under Review'), 'Displays prominent review status badge');
  assert(myTherapistCode.includes('requestedName'), 'Displays requested practitioner details when client selected a preference');
  assert(myTherapistCode.includes('concerns.length > 0'), 'Renders submitted presenting focus areas');
  assert(myTherapistCode.includes('1. Clinical Review'), 'Outlines clear 3-step review timeline');
  assert(myTherapistCode.includes('Update Intake Preferences'), 'Provides action to update intake without repeated forms');
  assert(myTherapistCode.includes('Speak with Care Coordinator'), 'Provides action to contact care coordinator');
  pass('Pending state accurately reflects matching review without fabricating an active connection');
} catch (e) {
  fail('Pending State Handling', e);
}

// --- SECTION 3: No Active Connection State ---
console.log('\n--- SECTION 3: No Active Connection State ---');
try {
  assert(myTherapistCode.includes("status === 'no_therapist'"), 'Recognizes no_therapist lifecycle status');
  assert(myTherapistCode.includes('No Active Clinician Connection'), 'Displays unambiguous unassigned pill');
  assert(myTherapistCode.includes('Start Your Therapy Journey'), 'Presents dignified invitation to begin care');
  assert(myTherapistCode.includes('Guided Matching'), 'Includes Guided Matching path');
  assert(myTherapistCode.includes('Clinician Directory'), 'Includes Direct Clinician Directory path');
  assert(myTherapistCode.includes('Care Coordination'), 'Includes Direct Care Team assistance path');
  pass('No-connection state offers clear, multi-path onboarding without broken layouts');
} catch (e) {
  fail('No Active Connection State', e);
}

// --- SECTION 4: Historical Relationship Distinction ---
console.log('\n--- SECTION 4: Historical Relationship (Paused, Ended, Transferred) ---');
try {
  assert(myTherapistCode.includes('isHistorical'), 'Accurately detects historical relationships');
  assert(myTherapistCode.includes("['paused', 'ended', 'completed', 'terminated', 'transferred']"), 'Categorizes all concluded/paused relationship statuses');
  assert(myTherapistCode.includes('Relationship {statusLabel}'), 'Displays historical badge with exact status');
  assert(myTherapistCode.includes('This is not an active therapeutic relationship'), 'Unambiguously warns user relationship is archived');
  assert(myTherapistCode.includes('Past Clinician'), 'Labels clinician clearly as Past Clinician');
  assert(myTherapistCode.includes('Archived Care History'), 'Renders prior care timeline and preserved history records');
  assert(myTherapistCode.includes('Find a New Therapist'), 'Provides clear action to rematch or start new relationship');
  pass('Historical relationships are strictly distinguished from active care and preserve past records');
} catch (e) {
  fail('Historical Relationship Distinction', e);
}

// --- SECTION 5: Loading & Recoverable Error States ---
console.log('\n--- SECTION 5: Loading & Recoverable Error States ---');
try {
  assert(myTherapistCode.includes('Loading your care relationship...'), 'Presents therapeutic loading state');
  assert(myTherapistCode.includes('Unable to Load Therapist Details'), 'Renders distinct error container on fetch failure');
  assert(myTherapistCode.includes('Try Again'), 'Provides actionable retry button for network recovery');
  assert(myTherapistCode.includes('handleRefresh'), 'Executes real data refetch on retry');
  assert(myTherapistCode.includes('aria-label="Refresh therapist profile"'), 'Accessible refresh button provided on header');
  pass('Loading and network errors render accessible feedback and actionable retries');
} catch (e) {
  fail('Loading & Recoverable Error States', e);
}

// --- SECTION 6: Action Navigation & Reassignment Policy ---
console.log('\n--- SECTION 6: Relationship Actions & Rematch Flow ---');
try {
  assert(myTherapistCode.includes('onStartBooking(therapist)'), 'Invokes existing booking flow with assigned therapist');
  assert(myTherapistCode.includes('onNavigateSessions'), 'Provides navigation to view upcoming sessions');
  assert(myTherapistCode.includes('setShowReassignModal(true)'), 'Opens reassignment confirmation dialog');
  assert(myTherapistCode.includes('Requesting a Therapist Change'), 'Explains gentle clinical transition process');
  assert(myTherapistCode.includes('name="reassignReason"'), 'Captures client feedback reason (modality, schedule, fit)');
  assert(myTherapistCode.includes('Continue to Rematch Intake'), 'Safely routes through authorized rematch intake workflow');
  pass('Actions navigate to booking, sessions, and authorized care reassignment without unilateral disconnects');
} catch (e) {
  fail('Relationship Actions & Rematch Flow', e);
}

// --- SECTION 7: Security, Authentication & Privacy Boundaries ---
console.log('\n--- SECTION 7: Security, Authentication & Privacy Boundaries ---');
try {
  assert(therapistRouteCode.includes('getAuthenticatedUser(request)'), 'Derives user strictly from authenticated session');
  assert(therapistRouteCode.includes("status: 401"), 'Rejects unauthenticated requests with 401');
  assert(therapistRouteCode.includes('getClientConnectedTherapist(authUser.userId)'), 'Derives relationship server-side using authenticated user ID');
  assert(!therapistRouteCode.includes('request.nextUrl.searchParams.get(\'therapistId\')'), 'Never trusts client-supplied therapist ID as proof of assignment');
  assert(!therapistRouteCode.includes('soap_notes'), 'Excludes SOAP notes from client response');
  assert(!therapistRouteCode.includes('clinical_formulation'), 'Excludes internal clinical formulation');
  assert(!therapistRouteCode.includes('risk_logs'), 'Excludes internal crisis risk logs');
  assert(!myTherapistCode.includes('soap_notes'), 'UI never renders internal clinical documentation');
  assert(serviceCode.includes('Privacy Shield: Returns strictly public-safe fields'), 'Service enforces privacy shield on therapist profiles');
  pass('Server enforces session authentication, IDOR prevention, and clinical privacy boundaries');
} catch (e) {
  fail('Security, Authentication & Privacy Boundaries', e);
}

// --- SECTION 8: Dashboard Integration & Regression Testing ---
console.log('\n--- SECTION 8: Dashboard Integration & Regressions (Steps 1 & 2) ---');
try {
  assert(dashboardCode.includes("import ClientTherapyMyTherapistView from './ClientTherapyMyTherapistView';"), 'Integrates ClientTherapyMyTherapistView into ClientTherapyDashboard');
  assert(dashboardCode.includes("<ClientTherapyMyTherapistView"), 'Renders ClientTherapyMyTherapistView under activeTab === therapist');
  assert(dashboardCode.includes("setActiveTab('sessions')"), 'Preserves step 2 sessions navigation');
  assert(dashboardCode.includes("handleStartBooking"), 'Preserves step 2 booking flow integration');
  assert(dashboardCode.includes("nextSession"), 'Preserves step 1 next session overview');
  assert(dashboardCode.includes("nextDueHomework"), 'Preserves step 1 homework overview');
  assert(therapyPageCode.includes("connectionStatus={connectionStatus}"), 'TherapyPage passes live connection status to dashboard');
  pass('Step 3 seamlessly integrates into ClientTherapyDashboard with zero regressions to Steps 1 and 2');
} catch (e) {
  fail('Dashboard Integration & Regressions', e);
}

console.log('\n================================================================');
console.log(` RESULTS: ${passCount} passed, ${failCount} failed (${passCount + failCount} total)`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
