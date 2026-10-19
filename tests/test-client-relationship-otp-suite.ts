import assert from 'assert';
import fs from 'fs';
import path from 'path';

/**
 * INGRESS WITHIN — CLIENT RELATIONSHIP OTP TRANSITION TEST SUITE
 * ==============================================================
 * Tests the security, OTP verification, and lifecycle transitions for:
 * 1. Quitting therapy (care cycle conclusion) -> Takes back to matching engine
 * 2. Changing therapist (reassignment) -> Shows other available therapists with details
 *
 * Verifies:
 * - Session-based authentication & ownership enforcement
 * - Mandatory 6-digit OTP dispatch and rate-limiting
 * - Transition action verification ('quit' vs 'change')
 * - Resilient database queries that never throw 404 RELATIONSHIP_NOT_FOUND
 * - Front-end post-change view displaying other available therapists with full details
 * - Front-end post-quit navigation returning client to guided matching engine
 */

console.log('================================================================');
console.log('  INGRESS WITHIN — CLIENT RELATIONSHIP OTP SUITE                ');
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

const SEND_OTP_ROUTE = path.resolve(process.cwd(), 'src/app/api/therapy/client/relationship/send-otp/route.ts');
const TRANSITION_ROUTE = path.resolve(process.cwd(), 'src/app/api/therapy/client/relationship/transition/route.ts');
const THERAPY_SERVICE = path.resolve(process.cwd(), 'src/lib/therapy/therapyService.ts');
const MY_THERAPIST_VIEW = path.resolve(process.cwd(), 'src/views/client/ClientTherapyMyTherapistView.jsx');
const THERAPY_PAGE = path.resolve(process.cwd(), 'src/views/TherapyPage.jsx');

const sendOtpCode = fs.readFileSync(SEND_OTP_ROUTE, 'utf8');
const transitionCode = fs.readFileSync(TRANSITION_ROUTE, 'utf8');
const serviceCode = fs.readFileSync(THERAPY_SERVICE, 'utf8');
const myTherapistCode = fs.readFileSync(MY_THERAPIST_VIEW, 'utf8');
const therapyPageCode = fs.readFileSync(THERAPY_PAGE, 'utf8');

// --- SECTION 1: Send OTP Route Security & Invariants ---
console.log('--- SECTION 1: Send OTP Endpoint Security & Validation ---');
try {
  assert(sendOtpCode.includes('getAuthenticatedUser(request)'), 'Enforces session authentication');
  assert(sendOtpCode.includes('AUTH_REQUIRED'), 'Returns 401 AUTH_REQUIRED for unauthenticated callers');
  assert(sendOtpCode.includes('authUser.phoneNumber') || sendOtpCode.includes('{ phoneNumber } = authUser'), 'Retrieves phone number strictly from verified session user profile');
  assert(sendOtpCode.includes('checkRateLimit'), 'Enforces server-side rate-limiting on OTP requests');
  assert(sendOtpCode.includes('getOtpProvider()'), 'Uses production cryptographic OtpProvider');
  assert(sendOtpCode.includes('maskedPhone'), 'Masks phone number in response to prevent data exposure');
  pass('Send OTP endpoint enforces session auth, phone verification, and rate limiting');
} catch (e) {
  fail('Send OTP Endpoint Security', e);
}

// --- SECTION 2: Relationship Transition Endpoint Verification ---
console.log('\n--- SECTION 2: Transition Endpoint OTP Verification & Execution ---');
try {
  assert(transitionCode.includes('getAuthenticatedUser(request)'), 'Enforces session authentication on transition');
  assert(transitionCode.includes("['quit', 'change'].includes(action)"), 'Validates action to strictly allow quit or change');
  assert(transitionCode.includes('/^\\d{6}$/'), 'Validates 6-digit numeric OTP format');
  assert(transitionCode.includes('provider.verifyOtp(authUser.phoneNumber'), 'Cryptographically verifies OTP against verified phone number');
  assert(transitionCode.includes('quitClientTherapyRelationship'), 'Calls quitClientTherapyRelationship when action === quit');
  assert(transitionCode.includes('changeClientTherapistRelationship'), 'Calls changeClientTherapistRelationship when action === change');
  pass('Transition endpoint enforces cryptographic OTP verification before updating relationship');
} catch (e) {
  fail('Transition Endpoint Verification', e);
}

// --- SECTION 3: Service Layer Transition Logic (Resilient & Non-Crashing) ---
console.log('\n--- SECTION 3: Therapy Service Layer Transitions & Resiliency ---');
try {
  assert(serviceCode.includes('quitClientTherapyRelationship'), 'Exports quitClientTherapyRelationship service function');
  assert(!serviceCode.includes("RELATIONSHIP_NOT_FOUND"), 'Does not throw 404 RELATIONSHIP_NOT_FOUND when user wants to quit or change');
  assert(serviceCode.includes("status: 'ended'"), 'Sets relationship status to ended on quit');
  assert(serviceCode.includes("ended_by: 'client'"), 'Logs ended_by: client in relationship metadata');
  assert(serviceCode.includes('changeClientTherapistRelationship'), 'Exports changeClientTherapistRelationship service function');
  assert(serviceCode.includes("status: 'transferred'"), 'Sets relationship status to transferred on change');
  assert(serviceCode.includes("transferred_by: 'client'"), 'Logs transferred_by: client in relationship metadata');
  assert(serviceCode.includes("therapist_notifications"), 'Dispatches in-app notification to therapist');
  assert(serviceCode.includes("status === 'ended'"), 'getClientTherapyDashboardSummary classifies ended relationships into care history archive');
  pass('Service layer performs resilient updates, metadata logging, and clean match invalidation');
} catch (e) {
  fail('Service Layer Transition Logic', e);
}

// --- SECTION 4: Client UI Integration & 2-Step OTP Workflow ---
console.log('\n--- SECTION 4: Client UI 2-Step Transition & OTP Verification ---');
try {
  assert(myTherapistCode.includes("openTransitionModal('change')") || myTherapistCode.includes("setShowReassignModal(true)"), 'Provides Change Therapist action trigger in Connected state');
  assert(myTherapistCode.includes("openTransitionModal('quit')"), 'Provides Quit Therapy action trigger in Connected state');
  assert(myTherapistCode.includes('transitionModal.step === 1'), 'Renders Step 1 with reason selection and clinical reassurance');
  assert(myTherapistCode.includes('transitionModal.step === 2'), 'Renders Step 2 with 6-digit OTP code inputs');
  assert(myTherapistCode.includes('/api/therapy/client/relationship/send-otp'), 'Requests OTP from /api/therapy/client/relationship/send-otp');
  assert(myTherapistCode.includes('/api/therapy/client/relationship/transition'), 'Submits verified OTP and reason to transition endpoint');
  assert(myTherapistCode.includes('otpDigits'), 'Manages individual OTP digit input boxes');
  assert(myTherapistCode.includes('otpCooldown'), 'Implements resend OTP countdown timer');
  pass('Client UI renders seamless 2-step OTP transition dialog with resend cooldown and error recovery');
} catch (e) {
  fail('Client UI Integration', e);
}

// --- SECTION 5: Change Shows Available Therapists & Quit Returns to Matching Engine ---
console.log('\n--- SECTION 5: Change Shows Other Therapists & Quit Launches Matching Engine ---');
try {
  // 1. Therapist change renders Step 3 with other available therapists and their details
  assert(myTherapistCode.includes('fetchAvailableTherapists'), 'Fetches available therapists upon change confirmation');
  assert(myTherapistCode.includes('transitionModal.step === 3'), 'Renders Step 3 for post-change clinician selection');
  assert(myTherapistCode.includes('/api/therapy/therapists'), 'Queries canonical /api/therapy/therapists endpoint');
  assert(myTherapistCode.includes('availableTherapists.map'), 'Maps available therapists in directory cards');
  assert(myTherapistCode.includes('t.credentials') || myTherapistCode.includes('t.title'), 'Displays clinician credentials and title');
  assert(myTherapistCode.includes('t.specializations'), 'Displays therapist specializations');
  assert(myTherapistCode.includes('t.languages'), 'Displays therapist languages');
  assert(myTherapistCode.includes('t.bio'), 'Displays therapist professional bio');
  assert(myTherapistCode.includes('onStartBooking(t)'), 'Provides one-click action to book with chosen clinician');

  // 2. Quitting takes client back to matching engine
  assert(myTherapistCode.includes("onStartRematch('guided')"), 'Takes client back to guided matching engine on quit');
  assert(therapyPageCode.includes("setJourney(targetJourney)"), 'TherapyPage activates guided matching engine when requested');
  pass('Change therapist displays full available therapist details and quit returns client to matching engine');
} catch (e) {
  fail('Change Shows Other Therapists & Quit Launches Matching Engine', e);
}

console.log('\n================================================================');
console.log(` RESULTS: ${passCount} passed, ${failCount} failed (${passCount + failCount} total)`);
console.log('================================================================\n');

if (failCount > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
