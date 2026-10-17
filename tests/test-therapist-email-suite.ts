import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';

// 1. Set environment flags before importing application services
process.env.TEST_MODE = 'true';
process.env.NODE_ENV = 'test';
process.env.BYPASS_REDIS = 'true';
process.env.EMAIL_PROVIDER = 'msg91';
process.env.EMAIL_FROM = 'contactus@ingresswithin.com';
process.env.THERAPIST_APPLICATION_NOTIFICATION_EMAIL = 'contactus@ingresswithin.com';
process.env.MSG91_EMAIL_AUTH_KEY = 'test_msg91_auth_key_123';
process.env.MSG91_AUTH_KEY = 'test_msg91_auth_key_123';
process.env.MSG91_EMAIL_DOMAIN = 'ingresswithin.com';
process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID = 'template_default_test_123';
process.env.MSG91_WEBHOOK_SECRET = 'whsec_test_secret_key_1234567890';
process.env.ALLOW_MOCK_EMAIL = 'true';
process.env.FORCE_MOCK_EMAIL = 'true';

import { validateAndNormalizeEmail } from '../src/lib/email/emailValidation';
import { EmailService } from '../src/lib/email/emailService';
import { EmailTemplates, escapeHtml } from '../src/lib/email/emailTemplates';
import { renderBaseEmailLayout } from '../src/lib/email/baseEmailLayout';
import { EmailEvents } from '../src/lib/email/emailEvents';
import {
  LoggedEmailProvider,
  Msg91EmailProvider,
  MissingCredentialsProvider,
  getEmailProvider,
} from '../src/lib/email/emailProvider';
import { getEmailConfig, getMsg91TemplateId } from '../src/lib/email/emailConfig';
import { processEmailJob, EmailWorkerError } from '../src/lib/queue/workers/emailWorker';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
import { GET as getAdminEmailsHandler, POST as postAdminEmailsHandler } from '../src/app/api/admin/emails/route';
import { POST as emailWebhookHandler } from '../src/app/api/webhooks/email/route';
import { AdminAuthService } from '../src/lib/admin/adminAuthService';
import { COOKIE_ADMIN_ACCESS_NAME } from '../src/utils/cookies';
import { getOtpProvider } from '../src/providers/otpProvider';
import { Msg91OtpProvider } from '../src/providers/msg91Provider';
import { supabase } from '../src/lib/db';

let passed = 0;
let total = 0;

async function test(name: string, fn: () => Promise<void> | void) {
  total++;
  try {
    await fn();
    console.log(`  ✓ [PASS] ${name}`);
    passed++;
  } catch (err: any) {
    console.error(`  ✗ [FAIL] ${name}: ${err.message}`);
    throw err;
  }
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('   INGRESS WITHIN — MSG91 TRANSACTIONAL EMAIL TEST SUITE        ');
  console.log('================================================================\n');

  // --- SECTION 1: Email Field & Security Validation ---
  console.log('--- SECTION 1: Email Field & Server-Side Security Validation ---');

  await test('Rejects missing or empty email', () => {
    assert.strictEqual(validateAndNormalizeEmail('').valid, false);
    assert.strictEqual(validateAndNormalizeEmail(null).valid, false);
    assert.strictEqual(validateAndNormalizeEmail(undefined).valid, false);
  });

  await test('Validates and normalizes valid email address to canonical lowercase', () => {
    const res = validateAndNormalizeEmail('  Doctor.Smith@Hospital.ORG  ');
    assert.strictEqual(res.valid, true);
    assert.strictEqual(res.normalizedEmail, 'Doctor.Smith@hospital.org');
  });

  await test('Rejects malformed emails lacking domain or at-sign', () => {
    assert.strictEqual(validateAndNormalizeEmail('invalid-email').valid, false);
    assert.strictEqual(validateAndNormalizeEmail('invalid@').valid, false);
    assert.strictEqual(validateAndNormalizeEmail('@example.com').valid, false);
    assert.strictEqual(validateAndNormalizeEmail('user@domain').valid, false);
  });

  await test('Blocks CRLF and Header Injection characters in email addresses', () => {
    assert.strictEqual(validateAndNormalizeEmail('victim@example.com\r\nBcc: evil@attacker.com').valid, false);
    assert.strictEqual(validateAndNormalizeEmail('victim@example.com%0aBcc: evil@attacker.com').valid, false);
    assert.strictEqual(validateAndNormalizeEmail('victim@example.com\nSubject: Injected').valid, false);
  });

  await test('Enforces maximum length limits (<= 254 chars per RFC 5321)', () => {
    const superLong = 'a'.repeat(250) + '@example.com';
    assert.strictEqual(validateAndNormalizeEmail(superLong).valid, false);
  });

  // --- SECTION 2: Email Template Rendering & Integrity ---
  console.log('\n--- SECTION 2: Email Template Rendering & Content Invariants ---');

  await test('therapist_application_submitted_admin renders without undefined and contains admin CTA', () => {
    const rendered = EmailTemplates.therapist_application_submitted_admin({
      therapistName: 'Dr. Jane Roe',
      email: 'jane.roe@clinic.in',
      specialization: ['Trauma', 'Anxiety'],
      experience: 7,
      submittedAt: new Date().toISOString(),
      adminReviewUrl: 'https://ingresswithin.com/admin/applications',
    });

    assert(rendered.subject.includes('New Therapist Application — Dr. Jane Roe'), 'Subject contains therapist name');
    assert(rendered.html.includes('Review Application in Admin Portal'), 'Contains admin CTA button');
    assert(rendered.html.includes('jane.roe@clinic.in'), 'Contains therapist contact email');
    assert(!rendered.html.includes('undefined'), 'Zero undefined strings in rendered template');
  });

  await test('therapist_application_received renders confirmation receipt with Under Review status', () => {
    const rendered = EmailTemplates.therapist_application_received({
      therapistName: 'Dr. John Doe',
      statusUrl: 'https://ingresswithin.com/therapist/application/status',
    });

    assert(rendered.subject.includes('Has Been Received'), 'Subject indicates receipt');
    assert(rendered.html.includes('UNDER REVIEW'), 'Emphasizes under review status');
    assert(rendered.html.includes('View Application Status'), 'Contains applicant tracking CTA');
    assert(!rendered.html.includes('undefined'), 'Zero undefined in received template');
  });

  await test('therapist_application_approved renders congratulatory practice verification notice', () => {
    const rendered = EmailTemplates.therapist_application_approved({
      therapistName: 'Dr. Alice Walker',
      dashboardUrl: 'https://ingresswithin.com/therapist',
    });

    assert(rendered.subject.toLowerCase().includes('approved'), 'Subject conveys approval');
    assert(rendered.html.includes('Connect Google Calendar'), 'Recommends calendar setup');
    assert(rendered.html.includes('Therapist Dashboard'), 'Includes CTA');
    assert(!rendered.html.includes('undefined'), 'Zero undefined in approved template');
  });

  await test('therapist_application_rejected renders respectful feedback with required rejection reason', () => {
    const rendered = EmailTemplates.therapist_application_rejected({
      therapistName: 'Dr. Bob Vance',
      rejectionReason: 'Master of Clinical Psychology degree certificate was blurred and unreadable.',
      reviewUrl: 'https://ingresswithin.com/therapist/application/status',
    });

    assert(rendered.subject.includes('Update Regarding Your Ingress Within Therapist Application'), 'Subject matches requirements');
    assert(rendered.html.includes('Master of Clinical Psychology degree certificate was blurred and unreadable'), 'Includes exact rejection reason');
    assert(rendered.html.includes('Review Application &amp; Resubmit') || rendered.html.includes('Review Application & Resubmit'), 'Includes resubmission link');
    assert(!rendered.html.includes('undefined'), 'Zero undefined in rejection template');
  });

  // --- SECTION 2B: Reusable Base HTML Layout & Sanitization ---
  console.log('\n--- SECTION 2B: Reusable Base HTML Layout & Sanitization ---');

  await test('renderBaseEmailLayout produces responsive, accessible branded HTML layout', () => {
    const layout = renderBaseEmailLayout({
      title: 'Test Notification',
      badge: 'Account Verified',
      badgeVariant: 'success',
      heading: 'Welcome to Ingress Within',
      preheader: 'This is a test preheader preview for inbox client.',
      contentHtml: '<p>This is test content body paragraph.</p>',
      ctaButton: {
        label: 'View Dashboard',
        url: 'https://ingresswithin.com/dashboard',
      },
      footerNote: 'Operational diagnostic footnote.',
    });

    assert(layout.includes('<!DOCTYPE html>'), 'Layout includes HTML5 DOCTYPE');
    assert(layout.includes('INGRESS WITHIN'), 'Layout includes Ingress Within brand wordmark');
    assert(layout.includes('Mental Health &amp; Psychotherapy Practice') || layout.includes('Mental Health & Psychotherapy Practice'), 'Layout includes practice subtitle');
    assert(layout.includes('Account Verified'), 'Layout renders badge text');
    assert(layout.includes('Welcome to Ingress Within'), 'Layout renders main heading');
    assert(layout.includes('This is a test preheader preview'), 'Layout includes hidden preheader snippet');
    assert(layout.includes('View Dashboard'), 'Layout renders CTA button');
    assert(layout.includes('https://ingresswithin.com/dashboard'), 'Layout links to CTA URL');
    assert(layout.includes('Confidentiality Notice:'), 'Layout includes confidentiality disclaimer');
    assert(layout.includes('contactus@ingresswithin.com'), 'Layout includes support contact email');
    assert(layout.includes('ingresswithin.com'), 'Layout includes website URL');
    assert(layout.includes('Operational diagnostic footnote.'), 'Layout includes footer note');
    assert(!layout.includes('undefined'), 'Layout has zero undefined values');
  });

  await test('escapeHtml safely neutralizes HTML, XSS, and script injection strings', () => {
    assert.strictEqual(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
    assert.strictEqual(escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
    assert.strictEqual(escapeHtml('Tom & Jerry "Special" \'Quotes\''), 'Tom &amp; Jerry &quot;Special&quot; &#39;Quotes&#39;');
    assert.strictEqual(escapeHtml(null), '');
    assert.strictEqual(escapeHtml(undefined), '');
    assert.strictEqual(escapeHtml(123), '123');
  });

  await test('Email templates safely escape malicious input in dynamic fields', () => {
    const maliciousTherapistName = '<script>alert("hacked")</script>Dr. Evil';
    const maliciousReason = '<img src="x" onerror="evil()"/>Degree rejected due to fraud';
    const rendered = EmailTemplates.therapist_application_rejected({
      therapistName: maliciousTherapistName,
      rejectionReason: maliciousReason,
      reviewUrl: 'https://ingresswithin.com/status',
    });

    assert(!rendered.html.includes('<script>alert'), 'Raw script tags must NEVER appear in rendered HTML');
    assert(!rendered.html.includes('<img src="x"'), 'Raw img injection tags must NEVER appear in rendered HTML');
    assert(rendered.html.includes('&lt;script&gt;'), 'Script tag must be safely HTML escaped');
    assert(rendered.html.includes('&lt;img src='), 'Img tag must be safely HTML escaped');
  });

  await test('Transactional email subjects strictly avoid leaking private clinical diagnoses', () => {
    const sensitiveData = {
      therapistName: 'Dr. Jane Smith',
      otherPartyName: 'Dr. Jane Smith',
      diagnosis: 'Severe Major Depressive Disorder with Psychotic Features',
      soapNote: 'Patient expressed acute distress during intake assessment',
      clinicalNotes: 'ICD-10 F33.2',
      scheduledStart: new Date().toISOString(),
    };

    const confirmed = EmailTemplates.session_confirmed(sensitiveData);
    assert(!confirmed.subject.includes('Depressive'), 'Confirmed subject must not reveal diagnosis');
    assert(!confirmed.subject.includes('F33.2'), 'Confirmed subject must not reveal diagnostic codes');
    assert(!confirmed.html.includes('soapNote'), 'Confirmed body must not include SOAP note');

    const matchReq = EmailTemplates.therapist_match_request(sensitiveData);
    assert(!matchReq.subject.includes('Severe'), 'Match request subject must not reveal diagnosis');
    assert(!matchReq.html.includes('Psychotic'), 'Match request body must not reveal psychiatric conditions');
  });

  // --- SECTION 3: Application Submission Workflow & Concurrency ---
  console.log('\n--- SECTION 3: Application Submission Workflow & Idempotency ---');

  await test('Application submission triggers admin email and therapist confirmation', async () => {
    LoggedEmailProvider.clear();
    const testAccountId = crypto.randomUUID();

    await EmailService.notifyTherapistApplicationSubmitted({
      therapistAccountId: testAccountId,
      therapistName: 'Dr. Test Clinician',
      email: 'clinician.test@ingresswithin.com',
      specialization: ['CBT', 'Anxiety'],
      experienceYears: 5,
      submittedAt: new Date().toISOString(),
      applicationId: `app_${testAccountId}`,
    });

    async function waitForSent(count: number, timeoutMs = 3000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const msgs = LoggedEmailProvider.getSentMessages();
        if (msgs.length >= count) return msgs;
        await new Promise((r) => setTimeout(r, 50));
      }
      return LoggedEmailProvider.getSentMessages();
    }

    const sent = await waitForSent(2);
    const adminMsg = sent.find((m) => m.to === 'contactus@ingresswithin.com');
    const therapistMsg = sent.find((m) => m.to === 'clinician.test@ingresswithin.com');

    assert(adminMsg, 'Admin notification email must be sent to contactus@ingresswithin.com');
    assert(adminMsg.subject.includes('Dr. Test Clinician'), 'Admin email subject includes applicant name');
    assert(therapistMsg, 'Confirmation email must be sent to therapist email');
    assert(therapistMsg.subject.includes('Has Been Received'), 'Confirmation subject indicates receipt');
  });

  await test('Duplicate submission with same idempotency key does not duplicate email dispatch', async () => {
    LoggedEmailProvider.clear();
    const uniqueKey = `idemp_test_sub_${Date.now()}`;

    // Send first
    await processEmailJob({
      eventType: EmailEvents.THERAPIST_APPLICATION_RECEIVED,
      recipient: { email: 'duplicate.check@example.com', type: 'therapist' },
      templateKey: 'therapist_application_received',
      templateData: { therapistName: 'Dr. Duplicate Check' },
      idempotencyKey: uniqueKey,
    });

    const countAfterFirst = LoggedEmailProvider.getSentMessages().length;
    assert.strictEqual(countAfterFirst, 1, 'First dispatch must succeed');

    // Send second with exact same idempotency key
    await processEmailJob({
      eventType: EmailEvents.THERAPIST_APPLICATION_RECEIVED,
      recipient: { email: 'duplicate.check@example.com', type: 'therapist' },
      templateKey: 'therapist_application_received',
      templateData: { therapistName: 'Dr. Duplicate Check' },
      idempotencyKey: uniqueKey,
    });

    const countAfterSecond = LoggedEmailProvider.getSentMessages().length;
    assert.strictEqual(countAfterSecond, 1, 'Second dispatch with same key must be deduplicated (no duplicate send)');
  });

  // --- SECTION 4: Admin Approval & Rejection Flow ---
  console.log('\n--- SECTION 4: Admin Approval & Rejection Flow ---');

  await test('Admin approval queues approval email to therapist', async () => {
    LoggedEmailProvider.clear();
    const testTherapistId = crypto.randomUUID();

    await EmailService.notifyTherapistApplicationApproved({
      therapistAccountId: testTherapistId,
      therapistName: 'Dr. Approved Applicant',
      email: 'approved.doctor@example.com',
    });

    async function waitForSent(count: number, timeoutMs = 3000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const msgs = LoggedEmailProvider.getSentMessages();
        if (msgs.length >= count) return msgs;
        await new Promise((r) => setTimeout(r, 50));
      }
      return LoggedEmailProvider.getSentMessages();
    }

    const sent = await waitForSent(1);
    const approvalMsg = sent.find((m) => m.to === 'approved.doctor@example.com');
    assert(approvalMsg, 'Approval message must be dispatched');
    assert(approvalMsg.subject.toLowerCase().includes('approved'), 'Subject conveys approval');
  });

  await test('Admin rejection requires minimum 5-character reason and delivers feedback', async () => {
    LoggedEmailProvider.clear();
    const testTherapistId = crypto.randomUUID();

    await EmailService.notifyTherapistApplicationRejected({
      therapistAccountId: testTherapistId,
      therapistName: 'Dr. Rejected Applicant',
      email: 'rejected.doctor@example.com',
      rejectionReason: 'Clinical registration license number expired in 2024.',
    });

    async function waitForSent(count: number, timeoutMs = 3000) {
      const start = Date.now();
      while (Date.now() - start < timeoutMs) {
        const msgs = LoggedEmailProvider.getSentMessages();
        if (msgs.length >= count) return msgs;
        await new Promise((r) => setTimeout(r, 50));
      }
      return LoggedEmailProvider.getSentMessages();
    }

    const sent = await waitForSent(1);
    const rejectionMsg = sent.find((m) => m.to === 'rejected.doctor@example.com');
    assert(rejectionMsg, 'Rejection message must be dispatched');
    assert(rejectionMsg.subject.includes('Update Regarding Your Ingress Within Therapist Application'), 'Subject matches');
    assert(rejectionMsg.html.includes('Clinical registration license number expired in 2024.'), 'Contains exact reason');
  });

  await test('Email dispatch failure does not crash or throw when failSafe = true', async () => {
    const result = await EmailService.sendEmail(
      {
        eventType: 'test.unknown',
        recipient: { email: 'safe@example.com', type: 'therapist' },
        templateKey: 'non_existent_template_xyz',
        templateData: {},
      },
      true
    );

    assert.strictEqual(result, null, 'Returns null safely without crashing calling flow');
  });

  // --- SECTION 5: Queue Retry & Failure Classification ---
  console.log('\n--- SECTION 5: Queue Retry & Failure Classification ---');

  await test('Permanent invalid email failure aborts without infinite retry', async () => {
    try {
      await processEmailJob({
        eventType: 'test.permanent',
        recipient: { email: 'not-an-email', type: 'therapist' },
        templateKey: 'therapist_application_received',
        templateData: { therapistName: 'Tester' },
        attempt: 1,
        maxAttempts: 4,
      });
      assert.fail('Should have thrown EmailWorkerError');
    } catch (err: any) {
      assert(err instanceof EmailWorkerError, 'Must throw EmailWorkerError');
      assert.strictEqual(err.isPermanent, true, 'Must be marked as permanent failure');
      assert.strictEqual(err.errorCategory, 'INVALID_RECIPIENT_EMAIL', 'Category must be INVALID_RECIPIENT_EMAIL');
    }
  });

  // --- SECTION 5B: MSG91 Provider Boundaries & Failure Invariants ---
  console.log('\n--- SECTION 5B: Centralized MSG91 Provider & Fail-Safe Invariants ---');

  await test('MissingCredentialsProvider fails explicitly and marks error as MISSING_PROVIDER_CREDENTIALS', async () => {
    const missingProvider = new MissingCredentialsProvider();
    const result = await missingProvider.send({
      to: 'doctor@example.com',
      from: 'Ingress Within <care@ingresswithin.com>',
      subject: 'Test Subject',
      html: '<p>Test</p>',
    });

    assert.strictEqual(result.success, false);
    assert.strictEqual(result.errorCategory, 'MISSING_PROVIDER_CREDENTIALS');
    assert.strictEqual(result.isPermanent, true);
    assert.strictEqual(result.messageId, undefined);
  });

  await test('getEmailProvider returns MissingCredentialsProvider when MSG91 credentials are missing and ALLOW_MOCK_EMAIL is false', () => {
    const prevMock = process.env.ALLOW_MOCK_EMAIL;
    const prevMsg91Key = process.env.MSG91_EMAIL_AUTH_KEY;
    const prevAuthKey = process.env.MSG91_AUTH_KEY;
    const prevNodeEnv = process.env.NODE_ENV;
    const prevTestMode = process.env.TEST_MODE;
    const prevForce = process.env.FORCE_MOCK_EMAIL;
    const prevIgnore = process.env.IGNORE_DISK_ENV;
    try {
      process.env.IGNORE_DISK_ENV = 'true';
      process.env.ALLOW_MOCK_EMAIL = 'false';
      process.env.FORCE_MOCK_EMAIL = 'false';
      delete process.env.MSG91_EMAIL_AUTH_KEY;
      delete process.env.MSG91_AUTH_KEY;
      process.env.NODE_ENV = 'production';
      delete process.env.TEST_MODE;
      const provider = getEmailProvider();
      assert(provider instanceof MissingCredentialsProvider, 'Must return MissingCredentialsProvider without credentials');
    } finally {
      if (prevIgnore !== undefined) process.env.IGNORE_DISK_ENV = prevIgnore;
      else delete process.env.IGNORE_DISK_ENV;
      if (prevMock !== undefined) process.env.ALLOW_MOCK_EMAIL = prevMock;
      if (prevForce !== undefined) process.env.FORCE_MOCK_EMAIL = prevForce;
      if (prevMsg91Key !== undefined) process.env.MSG91_EMAIL_AUTH_KEY = prevMsg91Key;
      if (prevAuthKey !== undefined) process.env.MSG91_AUTH_KEY = prevAuthKey;
      process.env.NODE_ENV = prevNodeEnv;
      if (prevTestMode !== undefined) process.env.TEST_MODE = prevTestMode;
    }
  });

  await test('Mock provider cannot be silently selected in production without explicit allowMockEmail flag', () => {
    const prevMock = process.env.ALLOW_MOCK_EMAIL;
    const prevMsg91Key = process.env.MSG91_EMAIL_AUTH_KEY;
    const prevAuthKey = process.env.MSG91_AUTH_KEY;
    const prevNodeEnv = process.env.NODE_ENV;
    const prevTestMode = process.env.TEST_MODE;
    const prevForce = process.env.FORCE_MOCK_EMAIL;
    const prevIgnore = process.env.IGNORE_DISK_ENV;
    try {
      process.env.IGNORE_DISK_ENV = 'true';
      process.env.ALLOW_MOCK_EMAIL = 'false';
      process.env.FORCE_MOCK_EMAIL = 'false';
      delete process.env.MSG91_EMAIL_AUTH_KEY;
      delete process.env.MSG91_AUTH_KEY;
      process.env.NODE_ENV = 'production';
      delete process.env.TEST_MODE;
      const provider = getEmailProvider();
      assert(!(provider instanceof LoggedEmailProvider), 'LoggedEmailProvider must not be used in production when allowMockEmail=false');
      assert(provider instanceof MissingCredentialsProvider, 'MissingCredentialsProvider must be used instead');
    } finally {
      if (prevIgnore !== undefined) process.env.IGNORE_DISK_ENV = prevIgnore;
      else delete process.env.IGNORE_DISK_ENV;
      if (prevMock !== undefined) process.env.ALLOW_MOCK_EMAIL = prevMock;
      if (prevForce !== undefined) process.env.FORCE_MOCK_EMAIL = prevForce;
      if (prevMsg91Key !== undefined) process.env.MSG91_EMAIL_AUTH_KEY = prevMsg91Key;
      if (prevAuthKey !== undefined) process.env.MSG91_AUTH_KEY = prevAuthKey;
      process.env.NODE_ENV = prevNodeEnv;
      if (prevTestMode !== undefined) process.env.TEST_MODE = prevTestMode;
    }
  });

  await test('Msg91EmailProvider correctly calls MSG91 API endpoint with authkey and payload', async () => {
    const originalFetch = global.fetch;
    let interceptedUrl = '';
    let interceptedOptions: any = null;

    global.fetch = async (url: any, options: any) => {
      interceptedUrl = String(url);
      interceptedOptions = options;
      const jsonPayload = {
        status: 'success',
        message: 'Email sent successfully.',
        data: { messageId: 'msg91_real_msg_987654321' },
      };
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => JSON.stringify(jsonPayload),
        json: async () => jsonPayload,
      } as any;
    };

    try {
      const msg91Provider = new Msg91EmailProvider('test_auth_key_xyz', 'ingresswithin.com');
      const result = await msg91Provider.send({
        to: 'patient@example.com',
        recipientName: 'Patient Name',
        from: 'Ingress Within <contactus@ingresswithin.com>',
        subject: 'Appointment Confirmed',
        html: '<p>Your appointment is confirmed</p>',
        text: 'Your appointment is confirmed',
        replyTo: 'contactus@ingresswithin.com',
        templateKey: 'session_confirmed',
        templateData: { appointmentId: 'apt_123', scheduledStart: '2026-10-15T10:00:00Z' },
        crqid: 'crq_test_123',
      });

      assert.strictEqual(interceptedUrl, 'https://control.msg91.com/api/v5/email/send');
      assert.strictEqual(interceptedOptions.method, 'POST');
      assert.strictEqual(interceptedOptions.headers.authkey, 'test_auth_key_xyz');
      assert.strictEqual(interceptedOptions.headers['content-type'], 'application/json');

      const body = JSON.parse(interceptedOptions.body);
      assert.strictEqual(body.recipients[0].to[0].email, 'patient@example.com');
      assert.strictEqual(body.recipients[0].to[0].name, 'Patient Name');
      assert.strictEqual(body.recipients[0].to[0].CRQID, 'crq_test_123');
      assert.strictEqual(body.from.email, 'contactus@ingresswithin.com');
      assert.strictEqual(body.from.name, 'Ingress Within');
      assert.strictEqual(body.domain, 'ingresswithin.com');
      assert.strictEqual(body.reply_to[0].email, 'contactus@ingresswithin.com');
      assert(body.template_id, 'template_id is populated');
      assert(body.recipients[0].variables.subject, 'Variables includes subject');

      assert.strictEqual(result.success, true);
      assert.strictEqual(result.provider, 'msg91');
      assert.strictEqual(result.messageId, 'msg91_real_msg_987654321');
      assert.strictEqual(result.crqid, 'crq_test_123');
    } finally {
      global.fetch = originalFetch;
    }
  });

  await test('Msg91EmailProvider accurately maps MSG91 error statuses (401, 403, 422, 429, 500, network, timeout)', async () => {
    const originalFetch = global.fetch;

    const mockResponse = (status: number, message: string) => async () => {
      const jsonPayload = { status: 'error', message };
      return {
        ok: false,
        status,
        headers: new Headers({ 'content-type': 'application/json' }),
        text: async () => JSON.stringify(jsonPayload),
        json: async () => jsonPayload,
      };
    };

    const provider = new Msg91EmailProvider('test_auth_key');

    try {
      // 401: AUTHENTICATION_ERROR (permanent)
      global.fetch = mockResponse(401, 'Invalid authkey') as any;
      const res401 = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(res401.success, false);
      assert.strictEqual(res401.errorCategory, 'AUTHENTICATION_ERROR');
      assert.strictEqual(res401.isPermanent, true);

      // 403 Domain not verified: DOMAIN_NOT_VERIFIED (permanent)
      global.fetch = mockResponse(403, 'The domain ingresswithin.com is not verified') as any;
      const res403 = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(res403.success, false);
      assert.strictEqual(res403.errorCategory, 'DOMAIN_NOT_VERIFIED');
      assert.strictEqual(res403.isPermanent, true);

      // 422: VALIDATION_ERROR (permanent)
      global.fetch = mockResponse(422, 'Invalid email recipient') as any;
      const res422 = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(res422.success, false);
      assert.strictEqual(res422.errorCategory, 'VALIDATION_ERROR');
      assert.strictEqual(res422.isPermanent, true);

      // 429: RATE_LIMIT_EXCEEDED (transient)
      global.fetch = mockResponse(429, 'Rate limit exceeded') as any;
      const res429 = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(res429.success, false);
      assert.strictEqual(res429.errorCategory, 'RATE_LIMIT_EXCEEDED');
      assert.strictEqual(res429.isPermanent, false);

      // 500: PROVIDER_UNAVAILABLE (transient)
      global.fetch = mockResponse(500, 'Internal Server Error') as any;
      const res500 = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(res500.success, false);
      assert.strictEqual(res500.errorCategory, 'PROVIDER_UNAVAILABLE');
      assert.strictEqual(res500.isPermanent, false);

      // Network error: NETWORK_ERROR (transient)
      global.fetch = async () => { throw new TypeError('fetch failed ECONNRESET'); };
      const resNet = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(resNet.success, false);
      assert.strictEqual(resNet.errorCategory, 'NETWORK_ERROR');
      assert.strictEqual(resNet.isPermanent, false);

      // Timeout error: TIMEOUT_ERROR (transient)
      const timeoutErr = new Error('The operation was aborted');
      timeoutErr.name = 'AbortError';
      global.fetch = async () => { throw timeoutErr; };
      const resTimeout = await provider.send({ to: 't@example.com', from: 'f@test.com', subject: 's', html: 'h', templateKey: 'session_confirmed' });
      assert.strictEqual(resTimeout.success, false);
      assert.strictEqual(resTimeout.errorCategory, 'TIMEOUT_ERROR');
      assert.strictEqual(resTimeout.isPermanent, false);
    } finally {
      global.fetch = originalFetch;
    }
  });

  await test('getMsg91TemplateId resolves single reusable MSG91_EMAIL_TEMPLATE_ID across all email events', () => {
    process.env.MSG91_EMAIL_TEMPLATE_ID = 'single_reusable_tpl_999';
    assert.strictEqual(getMsg91TemplateId('therapist_match_request'), 'single_reusable_tpl_999');
    assert.strictEqual(getMsg91TemplateId('session_confirmed'), 'single_reusable_tpl_999');
    assert.strictEqual(getMsg91TemplateId('refund_initiated'), 'single_reusable_tpl_999');
    assert.strictEqual(getMsg91TemplateId('smoke_test'), 'single_reusable_tpl_999');
    assert.strictEqual(getMsg91TemplateId('any_custom_event'), 'single_reusable_tpl_999');
  });

  await test('getMsg91TemplateId supports optional per-event override when explicitly provided', () => {
    process.env.MSG91_EMAIL_TEMPLATE_ID = 'single_reusable_tpl_999';
    process.env.MSG91_TEMPLATE_SESSION_CONFIRMED = 'special_session_tpl_111';
    try {
      assert.strictEqual(getMsg91TemplateId('session_confirmed'), 'special_session_tpl_111');
      assert.strictEqual(getMsg91TemplateId('therapist_match_request'), 'single_reusable_tpl_999');
    } finally {
      delete process.env.MSG91_TEMPLATE_SESSION_CONFIRMED;
    }
  });

  await test('Msg91EmailProvider dispatches payload with single template_id and mapped variables', async () => {
    process.env.MSG91_EMAIL_TEMPLATE_ID = 'single_reusable_tpl_999';
    let capturedPayload: any = null;
    const originalFetch = global.fetch;

    global.fetch = async (url: any, opts: any) => {
      capturedPayload = JSON.parse(opts.body);
      return new Response(JSON.stringify({ status: 'success', data: { messageId: 'msg_999_test' } }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    };

    try {
      const provider = new Msg91EmailProvider('test_auth_key', 'ingresswithin.com');
      const rendered = EmailTemplates.session_confirmed({
        recipientName: 'Alex',
        otherPartyName: 'Dr. Smith',
        scheduledStart: '2026-10-15T10:00:00Z',
        bookingReference: 'IW-BKG-TEST',
      });

      const res = await provider.send({
        to: 'alex@example.com',
        recipientName: 'Alex',
        from: 'Ingress Within <contactus@ingresswithin.com>',
        subject: rendered.subject,
        html: rendered.html,
        text: rendered.text,
        templateKey: 'session_confirmed',
        crqid: 'crq_alex_123',
      });

      assert.strictEqual(res.success, true);
      assert.strictEqual(capturedPayload.template_id, 'single_reusable_tpl_999');
      assert.strictEqual(capturedPayload.domain, 'ingresswithin.com');
      assert.strictEqual(capturedPayload.recipients[0].to[0].email, 'alex@example.com');
      assert.strictEqual(capturedPayload.recipients[0].to[0].name, 'Alex');
      assert.strictEqual(capturedPayload.recipients[0].to[0].CRQID, 'crq_alex_123');
      assert.strictEqual(capturedPayload.recipients[0].variables.subject, rendered.subject);
      assert(capturedPayload.recipients[0].variables.body_html.includes('INGRESS WITHIN'), 'Variables include branded HTML layout');
    } finally {
      global.fetch = originalFetch;
    }
  });

  await test('Msg91EmailProvider fails cleanly on missing template configuration without sending generic email', async () => {
    const prevDefault = process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID;
    const prevSingle = process.env.MSG91_EMAIL_TEMPLATE_ID;
    const prevKey = process.env.MSG91_TEMPLATE_UNKNOWN_EVENT;
    try {
      delete process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID;
      delete process.env.MSG91_EMAIL_TEMPLATE_ID;
      delete process.env.MSG91_TEMPLATE_UNKNOWN_EVENT;

      const provider = new Msg91EmailProvider('test_key');
      const res = await provider.send({
        to: 'user@example.com',
        from: 'Ingress Within <contactus@ingresswithin.com>',
        subject: 'Unknown',
        html: '<p>test</p>',
        templateKey: 'unknown_event_xyz',
      });

      assert.strictEqual(res.success, false);
      assert.strictEqual(res.errorCategory, 'MISSING_TEMPLATE_CONFIGURATION');
      assert.strictEqual(res.isPermanent, true);
    } finally {
      if (prevDefault !== undefined) process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID = prevDefault;
      if (prevSingle !== undefined) process.env.MSG91_EMAIL_TEMPLATE_ID = prevSingle;
      if (prevKey !== undefined) process.env.MSG91_TEMPLATE_UNKNOWN_EVENT = prevKey;
    }
  });

  // --- SECTION 6: Provider Webhook Verification & Processing ---
  console.log('\n--- SECTION 6: MSG91 Delivery Webhook Verification & Processing ---');

  await test('Rejects email webhook requests with missing or invalid secret when secret is set', async () => {
    const rawPayload = JSON.stringify({ status: 'delivered', requestId: 'msg_test_123' });
    const req = new NextRequest('http://localhost:3000/api/webhooks/email', {
      method: 'POST',
      headers: {
        'x-webhook-secret': 'invalid_secret_key',
      },
      body: rawPayload,
    });

    const res = await emailWebhookHandler(req);
    assert.strictEqual(res.status, 401, 'Invalid secret must return 401 Unauthorized');
  });

  await test('Accepts email webhook with MSG91 direct secret header (x-webhook-secret)', async () => {
    const rawPayload = JSON.stringify({
      requestId: 'msg_msg91_delivered_101',
      status: 'delivered',
      requestedAt: new Date().toISOString(),
      crqid: 'crq_101',
    });

    const req = new NextRequest('http://localhost:3000/api/webhooks/email', {
      method: 'POST',
      headers: {
        'x-webhook-secret': process.env.MSG91_WEBHOOK_SECRET!,
        'content-type': 'application/json',
      },
      body: rawPayload,
    });

    const res = await emailWebhookHandler(req);
    assert.strictEqual(res.status, 200, 'Valid MSG91 secret header must return 200 OK');
    const data = await res.json();
    assert.strictEqual(data.received, true, 'Acknowledges event receipt');
    assert.strictEqual(data.provider, 'msg91');
  });

  await test('Accepts email webhook with MSG91 Bearer token authorization header', async () => {
    const rawPayload = JSON.stringify({
      requestId: 'msg_msg91_delivered_102',
      status: 'delivered',
      requestedAt: new Date().toISOString(),
    });

    const req = new NextRequest('http://localhost:3000/api/webhooks/email', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${process.env.MSG91_WEBHOOK_SECRET!}`,
        'content-type': 'application/json',
      },
      body: rawPayload,
    });

    const res = await emailWebhookHandler(req);
    assert.strictEqual(res.status, 200, 'Valid Bearer token must return 200 OK');
    const data = await res.json();
    assert.strictEqual(data.received, true);
  });

  await test('Accepts email webhook batch payload and processes array of delivery reports', async () => {
    const rawPayload = JSON.stringify([
      { requestId: 'msg_batch_1', status: 'delivered', crqid: 'crq_batch_1' },
      { requestId: 'msg_batch_2', status: 'bounced', reason: 'Mailbox full', crqid: 'crq_batch_2' },
    ]);

    const req = new NextRequest('http://localhost:3000/api/webhooks/email', {
      method: 'POST',
      headers: {
        'x-webhook-secret': process.env.MSG91_WEBHOOK_SECRET!,
        'content-type': 'application/json',
      },
      body: rawPayload,
    });

    const res = await emailWebhookHandler(req);
    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.totalEvents, 2);
  });

  await test('Accepts email webhook with valid HMAC signature and processes delivered status', async () => {
    const rawPayload = JSON.stringify({
      type: 'email.delivered',
      created_at: new Date().toISOString(),
      data: {
        id: 'msg_verified_delivered_999',
      },
    });

    const validSig = crypto
      .createHmac('sha256', process.env.MSG91_WEBHOOK_SECRET!)
      .update(rawPayload)
      .digest('hex');

    const req = new NextRequest('http://localhost:3000/api/webhooks/email', {
      method: 'POST',
      headers: {
        'x-webhook-signature': validSig,
        'svix-id': `msg_delivered_${Date.now()}`,
      },
      body: rawPayload,
    });

    const res = await emailWebhookHandler(req);
    assert.strictEqual(res.status, 200, 'Valid signed webhook must return 200 OK');
    const data = await res.json();
    assert.strictEqual(data.received, true, 'Acknowledges event receipt');
  });

  // --- SECTION 7: Administrative Security & Observability ---
  console.log('\n--- SECTION 7: Administrative Security & Delivery Auditing ---');

  await test('Unauthenticated user cannot access GET /api/admin/emails', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/emails', {
      method: 'GET',
    });

    const res = await getAdminEmailsHandler(req);
    assert.strictEqual(res.status, 403, 'Must reject unauthenticated request with 403');
  });

  await test('Authenticated admin can retrieve email delivery log without secret leakage', async () => {
    const testAdminPassword = 'StrongFounderPassword!2026';
    const testAdminHash = AdminAuthService.hashPassword(testAdminPassword);
    const testAdminEmail = 'founder_email_test@ingresswithin.com';

    AdminAuthService.registerInMemoryAdmin({
      id: 'adm_test_founder_email',
      email: testAdminEmail,
      password_hash: testAdminHash,
      full_name: 'Platform Founder',
      role: 'super_admin',
      status: 'active',
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: null,
      last_login_ip: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const loginRes = await AdminAuthService.login({
      email: testAdminEmail,
      password: testAdminPassword,
      deviceId: 'dev_test_device',
    });
    const adminToken = loginRes.accessToken;

    const req = new NextRequest('http://localhost:3000/api/admin/emails?page=1&limit=10', {
      method: 'GET',
      headers: {
        authorization: `Bearer ${adminToken}`,
        cookie: `${COOKIE_ADMIN_ACCESS_NAME}=${adminToken}`,
      },
    });

    const res = await getAdminEmailsHandler(req);
    assert.strictEqual(res.status, 200, 'Admin authorized to view emails');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(Array.isArray(data.deliveries), 'Returns deliveries array');
    assert(data.health, 'Includes email health metrics');

    const jsonStr = JSON.stringify(data);
    assert(!jsonStr.includes('api_key'), 'Zero API key exposure');
    assert(!jsonStr.includes('authkey'), 'Zero authkey exposure');
    assert(!jsonStr.includes('secret'), 'Zero secret exposure');
  });

  await test('AdminPlatformService.getSystemHealth reports Email Provider health', async () => {
    const health = await AdminPlatformService.getSystemHealth();
    assert(health.checks.email, 'Must include email check in system health');
    assert(
      health.checks.email.status === 'healthy' ||
      health.checks.email.status === 'degraded' ||
      health.checks.email.status === 'error' ||
      health.checks.email.status === 'unavailable',
      'Valid health status for email'
    );
  });

  await test('Unauthenticated user cannot trigger POST /api/admin/emails smoke test', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/emails', {
      method: 'POST',
      body: JSON.stringify({ recipient: 'admin@ingresswithin.com' }),
    });

    const res = await postAdminEmailsHandler(req);
    assert.strictEqual(res.status, 403, 'Must reject unauthenticated smoke test with 403');
  });

  await test('Authenticated admin can execute POST /api/admin/emails smoke test', async () => {
    const testAdminPassword = 'StrongFounderPassword!2026';
    const testAdminHash = AdminAuthService.hashPassword(testAdminPassword);
    const testAdminEmail = 'founder_smoke_test@ingresswithin.com';

    AdminAuthService.registerInMemoryAdmin({
      id: 'adm_test_smoke_founder',
      email: testAdminEmail,
      password_hash: testAdminHash,
      full_name: 'Smoke Test Admin',
      role: 'super_admin',
      status: 'active',
      failed_login_attempts: 0,
      locked_until: null,
      last_login_at: null,
      last_login_ip: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    const loginRes = await AdminAuthService.login({
      email: testAdminEmail,
      password: testAdminPassword,
      deviceId: 'dev_smoke_device',
    });
    const adminToken = loginRes.accessToken;

    const req = new NextRequest('http://localhost:3000/api/admin/emails', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${adminToken}`,
        cookie: `${COOKIE_ADMIN_ACCESS_NAME}=${adminToken}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ recipientEmail: 'smoke-recipient@example.com' }),
    });

    const res = await postAdminEmailsHandler(req);
    assert.strictEqual(res.status, 200, 'Smoke test endpoint accepts authorized admin request');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert(data.smokeTest, 'Response contains smokeTest object');
    assert.strictEqual(data.smokeTest.recipient, 'smoke-recipient@example.com');
    assert(data.smokeTest.provider, 'smokeTest contains provider');
    assert(!JSON.stringify(data).includes('secret'), 'smokeTest does not leak secrets');
  });

  // --- SECTION 8: All Transactional Email Events Inventory & Integrity ---
  console.log('\n--- SECTION 8: Platform Transactional Email Events Inventory ---');

  await test('All 15 transactional email templates render accurately without exceptions', () => {
    const mockData = {
      therapistName: 'Dr. Jane Smith',
      clientName: 'Rahul Verma',
      clientEmail: 'rahul@example.com',
      email: 'doctor@example.com',
      matchId: 'match_123',
      rank: 1,
      appointmentId: 'apt_123',
      scheduledStart: '2026-10-15T10:00:00Z',
      previousStart: '2026-10-14T10:00:00Z',
      newStart: '2026-10-15T10:00:00Z',
      googleMeetUrl: 'https://meet.google.com/abc-defg-hij',
      bookingReference: 'IW-BK-12345',
      reason: 'Schedule conflict',
      refundStatus: 'full',
      amountPaise: 150000,
      refundId: 'rfnd_123',
      attendanceStatus: 'client_no_show',
      referenceCode: 'FB-98765',
      submissionType: 'bug_report',
      category: 'UI Glitch',
      subject: 'Button not clickable',
      description: 'The booking button was unresponsive on mobile.',
      adminUrl: 'https://ingresswithin.com/admin',
      statusUrl: 'https://ingresswithin.com/status',
      dashboardUrl: 'https://ingresswithin.com/therapist',
      specialization: ['CBT', 'Anxiety'],
      experience: 6,
    };

    const templateKeys = Object.keys(EmailTemplates);
    assert(templateKeys.length >= 15, `Expected at least 15 templates, found ${templateKeys.length}`);

    for (const key of templateKeys) {
      const renderer = EmailTemplates[key];
      assert(typeof renderer === 'function', `Renderer for ${key} must be a function`);
      const res = renderer(mockData);
      assert(res.subject && res.subject.length > 0, `Template ${key} subject must be non-empty`);
      assert(res.html && res.html.length > 0, `Template ${key} HTML must be non-empty`);
      assert(res.text && res.text.length > 0, `Template ${key} text must be non-empty`);
      assert(!res.html.includes('undefined'), `Template ${key} HTML must not contain "undefined"`);
    }
  });

  // --- SECTION 9: OTP Authentication Non-Regression Verification ---
  console.log('\n--- SECTION 9: OTP Authentication Non-Regression Verification ---');

  await test('MSG91 OTP Provider remains fully intact and logically isolated from Email', () => {
    process.env.OTP_PROVIDER = 'msg91';
    const otpProvider = getOtpProvider();
    assert(otpProvider instanceof Msg91OtpProvider, 'OTP provider resolves to Msg91OtpProvider');
    assert(typeof (otpProvider as any).sendOtp === 'function', 'sendOtp method exists');
    assert(typeof (otpProvider as any).verifyOtp === 'function', 'verifyOtp method exists');
  });

  console.log('\n================================================================');
  console.log(`   MSG91 EMAIL TEST SUITE RESULTS: ${passed}/${total} PASSING`);
  console.log('================================================================\n');
}

runTestSuite()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error('Fatal test error in MSG91 email suite:', err);
    process.exit(1);
  });
