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

import { normalizePhoneNumber, validateIndianPhone, formatPhoneForDisplay } from '../src/lib/auth/phone';
import { TherapistAuthService } from '../src/lib/therapist/therapistAuthService';
import { getAuthenticatedTherapist, requireAuthenticatedTherapist } from '../src/lib/therapist/therapistAuthHelper';
import { getAuthenticatedUser } from '../src/lib/auth-helper';
import { AuthService } from '../src/services/authService';
import { verifyJwt, signJwt } from '../src/utils/crypto';
import { COOKIE_ACCESS_NAME, COOKIE_THERAPIST_ACCESS_NAME, COOKIE_THERAPIST_REFRESH_NAME } from '../src/utils/cookies';
import { NextRequest } from 'next/server';
import { POST as sendTherapistOtp } from '../src/app/api/therapist/auth/send-otp/route';
import { POST as verifyTherapistOtp } from '../src/app/api/therapist/auth/verify-otp/route';
import { GET as getTherapistMe } from '../src/app/api/therapist/auth/me/route';
import { POST as logoutTherapist } from '../src/app/api/therapist/auth/logout/route';

async function runTherapistAuthTests() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — THERAPIST AUTHENTICATION & ISOLATION SUITE');
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

  // ----------------------------------------------------
  // SECTION 1: Route Separation & Zero Role Selectors
  // ----------------------------------------------------
  console.log('--- SECTION 1: Route Separation & Zero Role Selectors ---');

  // 1.1 Verify User AuthPage has ZERO therapist references or role dropdowns
  const authPageContent = fs.readFileSync(path.join(process.cwd(), 'src/views/AuthPage.jsx'), 'utf8');
  assert(!authPageContent.toLowerCase().includes('therapist'), 'User AuthPage.jsx has zero therapist references');
  assert(!authPageContent.toLowerCase().includes('role'), 'User AuthPage.jsx has zero role selectors');
  assert(!authPageContent.toLowerCase().includes('account_type'), 'User AuthPage.jsx has zero account-type pickers');
  assert(!authPageContent.toLowerCase().includes('practitioner'), 'User AuthPage.jsx has zero practitioner pickers');

  // 1.2 Verify User LandingPage has ZERO therapist role pickers
  const landingPageContent = fs.readFileSync(path.join(process.cwd(), 'src/views/LandingPage.jsx'), 'utf8');
  assert(!landingPageContent.toLowerCase().includes('role-picker'), 'LandingPage.jsx has zero role-picker UI');
  assert(!landingPageContent.toLowerCase().includes('?role=therapist'), 'LandingPage.jsx has zero ?role=therapist queries');

  // 1.3 Verify Therapist Portal view exists and has login / signup toggle
  const therapistAuthPageContent = fs.readFileSync(path.join(process.cwd(), 'src/views/TherapistAuthPage.jsx'), 'utf8');
  assert(therapistAuthPageContent.includes('Log in') && therapistAuthPageContent.includes('Create account'), 'TherapistAuthPage.jsx has [Log in] [Create account] toggle');
  assert(therapistAuthPageContent.includes('pending'), 'TherapistAuthPage.jsx renders pending review view');
  assert(therapistAuthPageContent.includes('+91'), 'TherapistAuthPage.jsx uses +91 Indian phone number');

  // 1.4 Verify Next.js App routing registers therapist routes
  const pageJsxContent = fs.readFileSync(path.join(process.cwd(), 'src/app/[[...slug]]/page.jsx'), 'utf8');
  assert(pageJsxContent.includes('therapist/auth'), '[[...slug]]/page.jsx registers therapist/auth in KNOWN_PUBLIC_ROUTES');
  assert(pageJsxContent.includes("rawPath.startsWith('therapist')"), '[[...slug]]/page.jsx permits therapist paths');

  const appJsxContent = fs.readFileSync(path.join(process.cwd(), 'src/App.jsx'), 'utf8');
  assert(appJsxContent.includes('TherapistAuthPage'), 'App.jsx imports TherapistAuthPage');
  assert(appJsxContent.includes("case 'therapist/auth':"), 'App.jsx handles therapist/auth route');

  // ----------------------------------------------------
  // SECTION 2: Dedicated Supabase Schema & Zero Polymorphic Role Columns
  // ----------------------------------------------------
  console.log('\n--- SECTION 2: Schema Isolation & Zero Polymorphic Role Columns ---');

  const migration002 = fs.readFileSync(path.join(process.cwd(), 'src/lib/auth/migrations/002_therapist_auth_schema.sql'), 'utf8');
  assert(migration002.includes('CREATE TABLE IF NOT EXISTS public.therapist_accounts'), 'Migration creates dedicated public.therapist_accounts table');
  assert(migration002.includes('CREATE TABLE IF NOT EXISTS public.therapist_profiles'), 'Migration creates dedicated public.therapist_profiles table');
  assert(migration002.includes('CREATE TABLE IF NOT EXISTS public.therapist_sessions'), 'Migration creates dedicated public.therapist_sessions table');
  assert(migration002.includes("DEFAULT 'pending'"), 'therapist_accounts sets default status to pending');

  // Verify public.users and public.profiles do not have role column
  const migration001 = fs.readFileSync(path.join(process.cwd(), 'src/lib/auth/migrations/001_user_auth_schema.sql'), 'utf8');
  assert(!migration001.includes('role text'), 'User schema does NOT contain polymorphic role column');
  assert(!migration001.includes('account_type text'), 'User schema does NOT contain polymorphic account_type column');
  assert(!migration002.includes('ALTER TABLE public.users ADD COLUMN role'), 'Therapist migration does NOT alter public.users with role');
  assert(!migration002.includes('ALTER TABLE public.profiles ADD COLUMN role'), 'Therapist migration does NOT alter public.profiles with role');

  // ----------------------------------------------------
  // SECTION 3: Dedicated Therapist Cookies & Token Structure
  // ----------------------------------------------------
  console.log('\n--- SECTION 3: Dedicated Cookies & Token Transport Segregation ---');

  assert(COOKIE_THERAPIST_ACCESS_NAME.includes('iw-th-access'), 'COOKIE_THERAPIST_ACCESS_NAME is iw-th-access');
  assert(COOKIE_THERAPIST_REFRESH_NAME.includes('iw-th-refresh'), 'COOKIE_THERAPIST_REFRESH_NAME is iw-th-refresh');
  assert((COOKIE_THERAPIST_ACCESS_NAME as string) !== (COOKIE_ACCESS_NAME as string), 'Therapist access cookie is strictly separate from user access cookie');

  // Establish mock therapist session
  const mockTherapistAccount = {
    id: 'th_mock_acct_001',
    phone_number: '+919876543210',
    status: 'pending',
    is_active: true,
    created_at: new Date().toISOString()
  };

  const mockTherapistProfile = {
    id: 'th_mock_acct_001',
    phone_number: '+919876543210',
    full_name: 'Dr. Shruti Sen',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const thSession = await TherapistAuthService.establishTherapistSession(
    mockTherapistAccount,
    mockTherapistProfile,
    'dev_th_01',
    'Safari Mac',
    '127.0.0.1',
    'Mozilla Therapist Test'
  );

  assert(thSession.success === true, 'establishTherapistSession returns success: true');
  assert(thSession.therapist.status === 'pending', 'Therapist account initial status is "pending"');
  assert(thSession.profile.full_name === 'Dr. Shruti Sen', 'Therapist profile retains full_name');
  assert(thSession.expiresIn === 30 * 24 * 60 * 60, 'Therapist session expires in 30 days');

  // Verify JWT claims: must have tid and scope: therapist
  const jwtSecret = TherapistAuthService.getJwtSecret();
  const thPayload: any = verifyJwt(thSession.accessToken, jwtSecret);
  assert(thPayload !== null, 'Therapist JWT verifies cryptographically');
  assert(thPayload.tid === 'th_mock_acct_001', 'Therapist JWT payload contains tid (therapist id)');
  assert(thPayload.scope === 'therapist', 'Therapist JWT payload contains scope: "therapist"');
  assert(thPayload.uid === undefined, 'Therapist JWT payload does NOT contain uid (user id)');

  // ----------------------------------------------------
  // SECTION 4: Cross-Boundary Rejection (User <-> Therapist)
  // ----------------------------------------------------
  console.log('\n--- SECTION 4: Cross-Boundary Rejection (User <-> Therapist) ---');

  // 4.1 Ordinary User Token sent to Therapist Helper -> MUST BE REJECTED
  const userJwt = signJwt(
    { uid: 'usr_mock_123', phone: '+919876543210', did: 'user_dev_01' },
    jwtSecret,
    3600
  );

  const mockReqWithUserToken = new NextRequest('http://localhost:3000/api/therapist/auth/me', {
    headers: {
      'authorization': `Bearer ${userJwt}`,
      'cookie': `${COOKIE_THERAPIST_ACCESS_NAME}=${userJwt}`
    }
  });

  const authTherapistResult = await getAuthenticatedTherapist(mockReqWithUserToken);
  assert(authTherapistResult === null, 'getAuthenticatedTherapist strictly returns null when presented with user token');

  let therapistRejected = false;
  try {
    await requireAuthenticatedTherapist(mockReqWithUserToken);
  } catch (err: any) {
    if (err.status === 401 && err.code === 'THERAPIST_AUTH_REQUIRED') {
      therapistRejected = true;
    }
  }
  assert(therapistRejected, 'requireAuthenticatedTherapist strictly throws 401 for user token');

  // 4.2 Therapist Token sent to User Helper -> MUST BE REJECTED
  const mockReqWithTherapistToken = new NextRequest('http://localhost:3000/api/auth/me', {
    headers: {
      'authorization': `Bearer ${thSession.accessToken}`,
      'cookie': `${COOKIE_ACCESS_NAME}=${thSession.accessToken}`
    }
  });

  const authUserResult = await getAuthenticatedUser(mockReqWithTherapistToken);
  assert(authUserResult === null, 'getAuthenticatedUser strictly returns null when presented with therapist token');

  // ----------------------------------------------------
  // SECTION 5: Therapist Name Sanitization & XSS Protection
  // ----------------------------------------------------
  console.log('\n--- SECTION 5: Therapist Name Sanitization & Input Validation ---');

  const xssName = '<script>alert("hack")</script>Dr. Anand Sharma & Co. "MD"';
  const cleanName = TherapistAuthService.sanitizeName(xssName);
  assert(!cleanName.includes('<') && !cleanName.includes('>') && !cleanName.includes('"'), 'Strips HTML tags, script, and quotes from therapist name');
  assert(cleanName.includes('Dr. Anand Sharma'), 'Preserves legitimate name text');

  // ----------------------------------------------------
  // SECTION 6: Therapist API Route Handlers
  // ----------------------------------------------------
  console.log('\n--- SECTION 6: Therapist API Route Handlers ---');

  // 6.1 Send OTP - Invalid Phone
  const badPhoneReq = new NextRequest('http://localhost:3000/api/therapist/auth/send-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ phone_number: '1234567890' })
  });
  const badPhoneRes = await sendTherapistOtp(badPhoneReq);
  const badPhoneJson = await badPhoneRes.json();
  assert(badPhoneRes.status === 400 && badPhoneJson.error?.code === 'INVALID_PHONE_NUMBER', 'send-otp rejects invalid phone number');

  // 6.2 Verify OTP - Malformed OTP
  const badOtpReq = new NextRequest('http://localhost:3000/api/therapist/auth/verify-otp', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      phone_number: '+919876543210',
      otp_code: '123', // Not 6 digits
      mode: 'login'
    })
  });
  const badOtpRes = await verifyTherapistOtp(badOtpReq);
  const badOtpJson = await badOtpRes.json();
  assert(badOtpRes.status === 400 && badOtpJson.error?.code === 'AUTH_OTP_MISMATCH', 'verify-otp rejects non-6-digit OTP');

  // 6.3 GET /api/therapist/auth/me - Unauthenticated
  const unauthMeReq = new NextRequest('http://localhost:3000/api/therapist/auth/me', {
    method: 'GET'
  });
  const unauthMeRes = await getTherapistMe(unauthMeReq);
  const unauthMeJson = await unauthMeRes.json();
  assert(unauthMeRes.status === 401 && unauthMeJson.error?.code === 'THERAPIST_AUTH_REQUIRED', '/api/therapist/auth/me returns 401 without therapist token');

  // 6.4 POST /api/therapist/auth/logout
  const logoutReq = new NextRequest('http://localhost:3000/api/therapist/auth/logout', {
    method: 'POST',
    headers: {
      'cookie': `${COOKIE_THERAPIST_ACCESS_NAME}=${thSession.accessToken}`
    }
  });
  const logoutRes = await logoutTherapist(logoutReq);
  const logoutJson = await logoutRes.json();
  assert(logoutRes.status === 200 && logoutJson.success === true, 'logout returns success: true');
  const clearedCookie = logoutRes.cookies.get(COOKIE_THERAPIST_ACCESS_NAME);
  assert(clearedCookie?.value === '', 'logout clears therapist session cookie');

  console.log('\n================================================================');
  console.log(`  THERAPIST AUTH TEST SUITE RESULT: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('================================================================\n');
}

runTherapistAuthTests().catch((err) => {
  console.error('\nTherapist Auth Test Suite failed:', err);
  process.exit(1);
});
