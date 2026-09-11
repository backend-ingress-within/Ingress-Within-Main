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

import { normalizePhoneNumber, validateIndianPhone, formatPhoneForDisplay, maskPhoneNumber } from '../src/lib/auth/phone';
import { checkPhoneLockout, applyPhoneLockout, MAX_INCORRECT_ATTEMPTS } from '../src/lib/auth/lockout';
import { DatabaseOtpProvider, getOtpProvider } from '../src/providers/otpProvider';
import { AuthService } from '../src/services/authService';
import { supabase } from '../src/lib/db';
import { verifyJwt, hashOtp } from '../src/utils/crypto';
import { COOKIE_ACCESS_NAME } from '../src/utils/cookies';
import { NextRequest } from 'next/server';
import { GET as getProfile, PATCH as patchProfile } from '../src/app/api/profile/route';

async function runComprehensiveUserAuthTests() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — USER AUTHENTICATION TEST SUITE');
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
  // SECTION 1: Phone Normalization & Validation (+91 India Only)
  // ----------------------------------------------------
  console.log('--- SECTION 1: Phone Normalization & Validation ---');

  const validPhones = [
    { input: '9876543210', expected: '+919876543210' },
    { input: '+919876543210', expected: '+919876543210' },
    { input: '+91 98765 43210', expected: '+919876543210' },
    { input: '09876543210', expected: '+919876543210' },
    { input: '919876543210', expected: '+919876543210' },
    { input: '00919876543210', expected: '+919876543210' },
    { input: '6123456789', expected: '+916123456789' },
    { input: '7123456789', expected: '+917123456789' },
    { input: '8123456789', expected: '+918123456789' }
  ];

  for (const item of validPhones) {
    const normalized = normalizePhoneNumber(item.input);
    assert(normalized === item.expected, `Normalizes "${item.input}" -> "${item.expected}"`);
    const valResult = validateIndianPhone(item.input);
    assert(valResult.isValid && valResult.canonicalPhone === item.expected, `Validates valid phone "${item.input}"`);
  }

  const invalidPhones = [
    '1234567890',     // Invalid operator prefix (starts with 1)
    '5123456789',     // Invalid operator prefix (starts with 5)
    '987654321',      // Only 9 digits
    '987654321012',   // 12 digits not starting with 91
    'abcdefghij',     // Non-numeric
    '',               // Empty
    'undefined'
  ];

  for (const item of invalidPhones) {
    const normalized = normalizePhoneNumber(item);
    assert(normalized === null, `Rejects invalid phone "${item}"`);
    const valResult = validateIndianPhone(item);
    assert(!valResult.isValid && valResult.error === "That doesn't look like a valid number.", `Returns standard error for invalid phone "${item}"`);
  }

  // Formatting & Masking
  assert(formatPhoneForDisplay('+919876543210') === '+91 98765 43210', 'Formats phone for display: +91 98765 43210');
  assert(maskPhoneNumber('+919876543210') === '+91 98*** **210', 'Masks phone correctly: +91 98*** **210');

  // ----------------------------------------------------
  // SECTION 2: Token Issuance & Verification (JWT Crypto)
  // ----------------------------------------------------
  console.log('\n--- SECTION 2: Temporary Signup Token & JWT Claims ---');

  const testNewPhone = '+919999900003';

  // Issue temporary signup token
  const signupToken = AuthService.createSignupToken(testNewPhone);
  assert(typeof signupToken === 'string' && signupToken.length > 20, 'Generates temporary signed JWT signup token');

  const verifiedToken = AuthService.verifySignupToken(signupToken);
  assert(verifiedToken !== null && verifiedToken.phone === testNewPhone, 'Verifies valid signup token');

  const forgedToken = AuthService.verifySignupToken(signupToken + 'forged');
  assert(forgedToken === null, 'Rejects tampered / invalid signup token');

  // ----------------------------------------------------
  // SECTION 3: Name Sanitization & XSS Protection
  // ----------------------------------------------------
  console.log('\n--- SECTION 3: Name Sanitization & XSS Protection ---');

  const maliciousName1 = '<script>alert("xss")</script> Aarav </textarea><div id="attack">x</div>';
  const cleanName1 = AuthService.sanitizeName(maliciousName1);
  assert(!cleanName1.includes('<') && !cleanName1.includes('>') && !cleanName1.includes('"'), 'Strips HTML tags and delimiters from name');

  const maliciousName2 = '<img src=x onerror=alert(1)> Priya';
  const cleanName2 = AuthService.sanitizeName(maliciousName2);
  assert(!cleanName2.includes('<') && !cleanName2.includes('>'), 'Strips img onerror tag');

  const emptyName = AuthService.sanitizeName('   ');
  assert(emptyName === '', 'Sanitizes empty whitespace name to empty string');

  // ----------------------------------------------------
  // SECTION 4: Multi-Device Session Generation & Verification
  // ----------------------------------------------------
  console.log('\n--- SECTION 4: Multi-Device Session Generation & Verification ---');

  const mockUserRecord = {
    id: 'f87a329d-4e9b-4654-8e44-1234567890ab',
    phone_number: '+919876543210',
    name: 'Aarav Sharma',
    account_status: 'active',
    is_active: true,
    created_at: new Date().toISOString()
  };

  const mockProfileRecord = {
    id: 'f87a329d-4e9b-4654-8e44-1234567890ab',
    phone_number: '+919876543210',
    full_name: 'Aarav Sharma',
    account_status: 'active',
    onboarding_status: 'pending',
    consent_completed: false,
    profile_completed: false,
    orientation_completed: false,
    assessment_completed: false,
    onboarding_completed: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const sessionResult = await AuthService.establishSession(
    mockUserRecord,
    mockProfileRecord,
    'device_test_mock_1',
    'Chrome Desktop',
    '127.0.0.1',
    'Mozilla/5.0 Agent',
    false
  );

  assert(sessionResult.success === true, 'establishSession completes successfully');
  assert(sessionResult.user.id === mockUserRecord.id, 'Session retains user ID');
  assert(sessionResult.profile.onboarding_status === 'pending', 'Session profile onboarding_status is "pending"');
  assert(sessionResult.expiresIn === 30 * 24 * 60 * 60, 'Session expiry is 30 days (2,592,000 seconds)');

  // Verify JWT access token claims
  const jwtSecret = AuthService.getJwtSecret();
  const decodedJwt = verifyJwt(sessionResult.accessToken, jwtSecret);
  assert(decodedJwt !== null && decodedJwt.uid === mockUserRecord.id, 'JWT payload contains valid uid');
  assert(decodedJwt.phone === mockUserRecord.phone_number, 'JWT payload contains valid phone claim');
  assert(decodedJwt.did === 'device_test_mock_1', 'JWT payload contains valid deviceId claim');

  // ----------------------------------------------------
  // SECTION 5: Profile API Strict Allowlist Security
  // ----------------------------------------------------
  console.log('\n--- SECTION 5: Profile API & Strict Allowlist Security ---');

  // Mock Request for PATCH /api/profile with forbidden fields
  const forbiddenAttempts = ['account_status', 'role', 'onboarding_status', 'phone_number', 'id', 'permissions', 'is_active'];
  for (const forbiddenField of forbiddenAttempts) {
    const mockPatchForbidden = new NextRequest('http://localhost:3000/api/profile', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${sessionResult.accessToken}`,
        'cookie': `${COOKIE_ACCESS_NAME}=${sessionResult.accessToken}`
      },
      body: JSON.stringify({ [forbiddenField]: 'unauthorized_value' })
    });

    const patchRes = await patchProfile(mockPatchForbidden);
    const patchJson = await patchRes.json();
    assert(patchRes.status === 400 && patchJson.error?.code === 'FORBIDDEN_FIELD', `PATCH /api/profile strictly rejects modification of forbidden field "${forbiddenField}"`);
  }

  // ----------------------------------------------------
  // SECTION 6: Therapist Isolation Architectural Boundary
  // ----------------------------------------------------
  console.log('\n--- SECTION 6: Therapist Isolation Architectural Boundary ---');

  // Audit user views and routes for therapist code leakage
  const authPageContent = fs.readFileSync(path.join(process.cwd(), 'src/views/AuthPage.jsx'), 'utf8');
  assert(!authPageContent.toLowerCase().includes('therapist'), 'AuthPage.jsx contains zero therapist references');
  assert(!authPageContent.toLowerCase().includes('role-selection'), 'AuthPage.jsx contains zero role selectors');
  assert(!authPageContent.toLowerCase().includes('i\'m a user'), 'AuthPage.jsx contains zero "I\'m a user / therapist" toggles');

  const sendOtpContent = fs.readFileSync(path.join(process.cwd(), 'src/app/api/auth/send-otp/route.ts'), 'utf8');
  assert(!sendOtpContent.toLowerCase().includes('therapist'), 'send-otp route contains zero therapist references');

  const verifyOtpContent = fs.readFileSync(path.join(process.cwd(), 'src/app/api/auth/verify-otp/route.ts'), 'utf8');
  assert(!verifyOtpContent.toLowerCase().includes('therapist'), 'verify-otp route contains zero therapist references');

  const completeSignupContent = fs.readFileSync(path.join(process.cwd(), 'src/app/api/auth/complete-signup/route.ts'), 'utf8');
  assert(!completeSignupContent.toLowerCase().includes('therapist'), 'complete-signup route contains zero therapist references');

  const profileRouteContent = fs.readFileSync(path.join(process.cwd(), 'src/app/api/profile/route.ts'), 'utf8');
  assert(!profileRouteContent.toLowerCase().includes('therapist'), 'profile route contains zero therapist references');

  console.log('\n================================================================');
  console.log(`  USER AUTH TEST SUITE RESULT: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('================================================================\n');
}

runComprehensiveUserAuthTests().catch((err) => {
  console.error('\nAuth Test Suite failed:', err);
  process.exit(1);
});
