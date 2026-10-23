process.env.BYPASS_REDIS = 'true';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import assert from 'assert';
import { NextRequest } from 'next/server';
import { AdminAuthService } from '../src/lib/admin/adminAuthService';
import { POST as adminLoginPost } from '../src/app/api/admin/auth/login/route';
import { GET as adminMeGet } from '../src/app/api/admin/auth/me/route';
import { COOKIE_ADMIN_ACCESS_NAME, COOKIE_ADMIN_REFRESH_NAME } from '../src/utils/cookies';
import { verifyJwt } from '../src/utils/crypto';

async function runAdminSessionDurationSuite() {
  console.log('================================================================');
  console.log('STARTING ADMIN SESSION DURATION (1-WEEK DURATION) TEST SUITE');
  console.log('================================================================\n');

  const testEmail = 'admin-duration-test@ingresswithin.com';
  const testPassword = 'SecureAdminPassword123!';
  const testAdminId = 'adm-duration-test-uuid-1';

  // 1. Register test admin in memory
  AdminAuthService.registerInMemoryAdmin({
    id: testAdminId,
    email: testEmail,
    password_hash: AdminAuthService.hashPassword(testPassword),
    full_name: 'Duration Test Administrator',
    role: 'super_admin',
    status: 'active',
    failed_login_attempts: 0,
    locked_until: null,
    last_login_at: null,
    last_login_ip: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  // Test 1: Configured token expiry constant is 7 days (604,800 seconds)
  const expectedSeconds = 7 * 24 * 60 * 60; // 604,800 seconds
  assert.strictEqual(
    AdminAuthService.getAccessTokenExpirySeconds(),
    expectedSeconds,
    'Admin access token expiry constant must be exactly 7 days (604,800 seconds)'
  );
  console.log('  ✓ [PASS] AdminAuthService.getAccessTokenExpirySeconds() is 7 days (604,800s)');

  // Test 2: AdminAuthService.login returns 7-day expiresIn and 7-day token
  const loginResult = await AdminAuthService.login({
    email: testEmail,
    password: testPassword,
    deviceId: 'test_dev_session_1',
  });

  assert.strictEqual(loginResult.expiresIn, expectedSeconds, 'expiresIn must be 604,800s');
  assert.ok(loginResult.accessToken, 'Must return accessToken');

  const jwtSecret = process.env.JWT_SECRET || 'jwt_default_secret_dev';
  const decodedPayload = verifyJwt(loginResult.accessToken, jwtSecret);
  assert.ok(decodedPayload, 'Access token must be verifiable with JWT secret');
  assert.strictEqual(decodedPayload.aid, testAdminId);
  assert.strictEqual(decodedPayload.scope, 'admin');

  // Verify exp is ~7 days ahead of iat
  const tokenDuration = decodedPayload.exp - decodedPayload.iat;
  assert.strictEqual(tokenDuration, expectedSeconds, 'JWT exp minus iat must equal 7 days');
  console.log('  ✓ [PASS] AdminAuthService.login generates JWT with 7-day lifetime');

  // Test 3: POST /api/admin/auth/login sets 7-day access cookie and 30-day refresh cookie
  const loginReq = new NextRequest('http://localhost:3000/api/admin/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: testEmail,
      password: testPassword,
    }),
  });

  const loginResponse = await adminLoginPost(loginReq);
  assert.strictEqual(loginResponse.status, 200);

  const cookies = loginResponse.cookies;
  const accessCookie = cookies.get(COOKIE_ADMIN_ACCESS_NAME);
  const refreshCookie = cookies.get(COOKIE_ADMIN_REFRESH_NAME);

  assert.ok(accessCookie, `Must set ${COOKIE_ADMIN_ACCESS_NAME} cookie`);
  assert.strictEqual(accessCookie.maxAge, expectedSeconds, 'Access cookie maxAge must be 7 days');

  assert.ok(refreshCookie, `Must set ${COOKIE_ADMIN_REFRESH_NAME} cookie`);
  assert.strictEqual(refreshCookie.maxAge, 30 * 24 * 60 * 60, 'Refresh cookie maxAge must be 30 days');
  console.log('  ✓ [PASS] POST /api/admin/auth/login sets 7-day cookie maxAge');

  // Test 4: GET /api/admin/auth/me refreshes the 7-day cookie (rolling session)
  const meReq = new NextRequest('http://localhost:3000/api/admin/auth/me', {
    method: 'GET',
    headers: {
      cookie: `${COOKIE_ADMIN_ACCESS_NAME}=${accessCookie.value}`,
    },
  });

  const meResponse = await adminMeGet(meReq);
  assert.strictEqual(meResponse.status, 200);
  const meBody = await meResponse.json();
  assert.strictEqual(meBody.success, true);
  assert.strictEqual(meBody.admin.id, testAdminId);

  const refreshedCookie = meResponse.cookies.get(COOKIE_ADMIN_ACCESS_NAME);
  assert.ok(refreshedCookie, 'GET /api/admin/auth/me must refresh the admin access cookie');
  assert.strictEqual(refreshedCookie.maxAge, expectedSeconds, 'Refreshed cookie maxAge must be 7 days');

  const refreshedPayload = verifyJwt(refreshedCookie.value, jwtSecret);
  assert.ok(refreshedPayload);
  assert.strictEqual(refreshedPayload.aid, testAdminId);
  console.log('  ✓ [PASS] GET /api/admin/auth/me successfully rolls/extends 7-day session');

  console.log('\n================================================================');
  console.log('ALL ADMIN SESSION DURATION TESTS PASSED (4/4)');
  console.log('================================================================\n');
}

runAdminSessionDurationSuite().catch((err) => {
  console.error('\nFAILED TEST SUITE WITH UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
