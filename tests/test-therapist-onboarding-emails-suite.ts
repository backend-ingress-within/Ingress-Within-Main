import assert from 'assert';
import crypto from 'crypto';
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
process.env.ALLOW_MOCK_EMAIL = 'true';
process.env.FORCE_MOCK_EMAIL = 'true';

import { EmailService } from '../src/lib/email/emailService';
import { EmailTemplates, escapeHtml } from '../src/lib/email/emailTemplates';
import { EmailEvents } from '../src/lib/email/emailEvents';
import { LoggedEmailProvider } from '../src/lib/email/emailProvider';
import { SUPPORT_CONFIG } from '../src/config/supportConfig';
import { TherapistPlatformService } from '../src/lib/therapist/therapistPlatformService';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
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

async function waitForMessages(count: number, timeoutMs = 2500) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const msgs = LoggedEmailProvider.getSentMessages();
    if (msgs.length >= count) return msgs;
    await new Promise((r) => setTimeout(r, 50));
  }
  return LoggedEmailProvider.getSentMessages();
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('   THERAPIST ONBOARDING & APPROVAL EMAIL SUITE                   ');
  console.log('================================================================\n');

  // --- SECTION 1: Submission Confirmation Email Template & Rendering ---
  console.log('--- SECTION 1: Application Received Confirmation Email Template ---');

  await test('Renders structured application submission copy matching form sections', () => {
    const sampleAnswers = {
      fullName: 'Dr. Ananya Sharma',
      contact_email: 'ananya.sharma@example.com',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      state: 'Maharashtra',
      gender: 'Female',
      credentials: 'M.Phil Clinical Psychology',
      yearsOfExperience: 7,
      issuingBody: 'Rehabilitation Council of India',
      licenseNumber: 'RCI-CRR-A12345',
      specialties: ['Anxiety Disorders', 'Trauma & PTSD', 'Depression'],
      modalities: ['Cognitive Behavioral Therapy (CBT)', 'EMDR', 'Mindfulness-Based Stress Reduction'],
      languages: ['English', 'Hindi', 'Marathi'],
      sessionFormats: ['Telehealth', 'In-Person'],
      feePerSession: 2000,
      currentCapacity: 12,
      maxCapacity: 20,
      soonestOpeningDays: 3,
      severityCeiling: 4,
      ageGroups: ['Young Adults (18-25)', 'Adults (26-64)'],
      higherAcuityInterest: 'Yes',
      higherAcuityExperience: 'Managed crisis cases in hospital outpatient psychiatry department.',
      supervision: {
        status: 'Fully Licensed / Independent',
        format: 'Peer Consultation',
      },
      truthfulnessConfirmed: true,
      ethicsDeclaration: true,
      backgroundCheckConsent: true,
    };

    const sampleDocs = [
      {
        filename: 'ananya_degree_mphil.pdf',
        category: 'degree_certificate',
        size: 1540000,
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'pending',
      },
      {
        filename: 'rci_registration_license.pdf',
        category: 'license_certificate',
        size: 820000,
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'pending',
      },
      {
        filename: 'trauma_emdr_certificate.pdf',
        category: 'trauma_certification',
        size: 640000,
        uploadedAt: new Date().toISOString(),
        verificationStatus: 'pending',
      },
    ];

    const rendered = EmailTemplates.therapist_application_received({
      therapistName: 'Dr. Ananya Sharma',
      email: 'ananya.sharma@example.com',
      submittedAt: '2026-10-16T10:00:00.000Z',
      statusUrl: 'https://ingresswithin.com/therapist/application/status',
      answers: sampleAnswers,
      documents: sampleDocs,
    });

    // 1. Core Header and Status
    assert.strictEqual(rendered.subject, 'Your Ingress Within Therapist Application Has Been Received');
    assert(rendered.html.includes('Dr. Ananya Sharma'), 'Contains therapist name');
    assert(rendered.html.includes('SUBMITTED / UNDER REVIEW'), 'Contains Under Review status');
    assert(rendered.html.includes('ananya.sharma@example.com'), 'Contains applicant email');
    assert(rendered.html.includes('Mumbai, Maharashtra'), 'Contains location');

    // 2. Credentials and Licensure
    assert(rendered.html.includes('M.Phil Clinical Psychology'), 'Contains degree title');
    assert(rendered.html.includes('7 years'), 'Contains clinical experience');
    assert(rendered.html.includes('RCI-CRR-A12345'), 'Contains license reference');
    assert(rendered.html.includes('Yes (RCI Registered)'), 'Marks RCI registration');

    // 3. Clinical Modalities & Specialties
    assert(rendered.html.includes('Anxiety Disorders'), 'Contains specialty');
    assert(rendered.html.includes('Cognitive Behavioral Therapy (CBT)'), 'Contains modality');
    assert(rendered.html.includes('₹2000 per session'), 'Contains fee');
    assert(rendered.html.includes('English, Hindi, Marathi'), 'Contains languages');

    // 4. Caseload and Acuity
    assert(rendered.html.includes('12 clients'), 'Contains current capacity');
    assert(rendered.html.includes('20 clients'), 'Contains max capacity');
    assert(rendered.html.includes('Within 3 days'), 'Contains soonest opening');
    assert(rendered.html.includes('Level 4 of 5'), 'Contains severity ceiling');
    assert(rendered.html.includes('Interested in higher-acuity'), 'Contains higher-acuity interest');

    // 5. Supervision and Declarations
    assert(rendered.html.includes('Fully Licensed / Independent'), 'Contains supervision info');
    assert(rendered.html.includes('Confirmed'), 'Contains ethics declaration confirmation');

    // 6. Uploaded Documents Ledger
    assert(rendered.html.includes('ananya_degree_mphil.pdf'), 'Lists degree certificate filename');
    assert(rendered.html.includes('rci_registration_license.pdf'), 'Lists license filename');
    assert(rendered.html.includes('trauma_emdr_certificate.pdf'), 'Lists trauma cert filename');
    assert(rendered.html.includes('Degree / Qualification Certificate'), 'Maps degree category label');
    assert(rendered.html.includes('Clinical Licensure / RCI Certificate'), 'Maps license category label');
    assert(rendered.html.includes('Trauma-Informed Certification'), 'Maps trauma category label');
    assert(rendered.html.includes('Uploaded (Pending Review)'), 'Contains document review status');

    // 7. Security and Support Contact Information
    assert(rendered.html.includes(SUPPORT_CONFIG.supportEmail), 'Includes configured support email');
    assert(rendered.html.includes(SUPPORT_CONFIG.temporaryContactNumber), 'Includes configured support phone');
    assert(rendered.html.includes('does not constitute authorization to practise'), 'Contains practice disclaimer');
    assert(!rendered.html.includes('undefined'), 'Zero undefined tokens in HTML output');

    // 8. Plain Text Equivalents
    assert(rendered.text.includes('Dr. Ananya Sharma'), 'Plain text contains name');
    assert(rendered.text.includes('CURRENT APPLICATION STATUS: SUBMITTED / UNDER REVIEW'), 'Plain text contains status');
    assert(rendered.text.includes('ananya_degree_mphil.pdf'), 'Plain text lists document');
    assert(rendered.text.includes(SUPPORT_CONFIG.supportEmail), 'Plain text includes support email');
    assert(rendered.text.includes(SUPPORT_CONFIG.temporaryContactNumber), 'Plain text includes support phone');
  });

  await test('Strict Security Boundary: Never leaks private storage paths, raw Supabase URLs, or credentials in email', () => {
    const rawStoragePath = 'therapist-acc-999/degree_certificate/123e4567-e89b-12d3-a456-426614174000-original_degree.pdf';
    const sampleDocs = [
      {
        path: rawStoragePath,
        bucket: 'therapist-verification',
        filename: 'original_degree.pdf',
        category: 'degree_certificate',
        size: 500000,
      },
    ];

    const rendered = EmailTemplates.therapist_application_received({
      therapistName: 'Dr. Secure Practitioner',
      email: 'secure.practitioner@example.com',
      documents: sampleDocs,
      answers: {
        fullName: 'Dr. Secure Practitioner',
      },
    });

    // Verify raw path and bucket are NOT leaked into rendered output
    assert(!rendered.html.includes(rawStoragePath), 'Raw storage path must NOT leak into HTML');
    assert(!rendered.text.includes(rawStoragePath), 'Raw storage path must NOT leak into text');
    assert(!rendered.html.includes('therapist-acc-999'), 'Account ID in path must NOT leak');
    assert(!rendered.html.includes('supabase.co/storage'), 'Public Supabase storage URL must NOT be exposed');
    assert(!rendered.html.includes('service_role'), 'Service role must never appear in email');
    assert(rendered.html.includes('original_degree.pdf'), 'Only clean original filename is shown');
  });

  await test('Escapes malicious script tags and HTML injection safely', () => {
    const maliciousAnswers = {
      fullName: '<script>alert("XSS")</script>Dr. Safe',
      contact_email: 'safe@example.com',
      credentials: '<b>Fake Degree</b>',
      bio: '<img src=x onerror=alert(1)>',
    };

    const rendered = EmailTemplates.therapist_application_received({
      therapistName: '<script>alert("XSS")</script>Dr. Safe',
      answers: maliciousAnswers,
    });

    assert(!rendered.html.includes('<script>'), 'Script tag must be escaped');
    assert(rendered.html.includes('&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;'), 'HTML characters properly escaped');
  });

  // --- SECTION 2: Congratulations / Approval Email Template & Rendering ---
  console.log('\n--- SECTION 2: Congratulations & Approval Email Template ---');

  await test('Renders warm, celebratory congratulations email with canonical login link and practice guidance', () => {
    const rendered = EmailTemplates.therapist_application_approved({
      therapistName: 'Dr. Rajesh Khanna',
      loginUrl: 'https://ingresswithin.com/auth?role=therapist',
      dashboardUrl: 'https://ingresswithin.com/therapist',
    });

    // 1. Subject and Preheader
    assert.strictEqual(
      rendered.subject,
      'Congratulations! Your Ingress Within therapist application is approved'
    );
    assert(rendered.html.includes('Congratulations! Your Ingress Within therapist application is approved'));

    // 2. Greeting and Welcome
    assert(rendered.html.includes('Dr. Rajesh Khanna'), 'Contains therapist name');
    assert(rendered.html.includes('Congratulations, and welcome to Ingress Within!'), 'Contains warm welcome');
    assert(
      rendered.html.includes('We&#39;re happy to let you know that your therapist application has been approved.') ||
      rendered.html.includes("We're happy to let you know that your therapist application has been approved.")
    );

    // 3. Verification & Practice Authorization Confirmation
    assert(rendered.html.includes('Your Therapist Account is Verified &amp; Practice Authorized'));
    assert(rendered.html.includes('authorized to provide psychotherapy consultations on the Ingress Within platform'));

    // 4. Prominent Canonical Login Link & Practice Steps
    assert(rendered.html.includes('https://ingresswithin.com/auth?role=therapist'), 'Contains canonical login link');
    assert(rendered.html.includes('Connect Google Calendar'), 'Recommends calendar setup');
    assert(rendered.html.includes('Configure Practice Hours &amp; Buffers'), 'Recommends hours configuration');
    assert(rendered.html.includes('Link Payout Details'), 'Recommends payout linkage');
    assert(rendered.html.includes('Log in to Therapist Dashboard'), 'CTA button is prominent');

    // 5. Support Information
    assert(rendered.html.includes(SUPPORT_CONFIG.supportEmail), 'Includes support email');
    assert(rendered.html.includes(SUPPORT_CONFIG.temporaryContactNumber), 'Includes support phone');
    assert(!rendered.html.includes('undefined'), 'Zero undefined tokens in approved output');

    // 6. Plain Text Format
    assert(rendered.text.includes('Congratulations, and welcome to Ingress Within!'), 'Plain text has welcome');
    assert(rendered.text.includes('https://ingresswithin.com/auth?role=therapist'), 'Plain text has login link');
    assert(rendered.text.includes(SUPPORT_CONFIG.supportEmail), 'Plain text has support email');
    assert(rendered.text.includes(SUPPORT_CONFIG.temporaryContactNumber), 'Plain text has support phone');
  });

  // --- SECTION 3: Service-Level Queueing & Idempotency ---
  console.log('\n--- SECTION 3: Service-Level Queueing & Idempotency ---');

  await test('notifyTherapistApplicationSubmitted dispatches admin alert and confirmation receipt with full copy', async () => {
    LoggedEmailProvider.clear();
    const testAccountId = crypto.randomUUID();
    const testEmail = `therapist.${Date.now()}@example.com`;

    await EmailService.notifyTherapistApplicationSubmitted({
      therapistAccountId: testAccountId,
      therapistName: 'Dr. Priya Desai',
      email: testEmail,
      specialization: ['Cognitive Therapy', 'Anxiety'],
      experienceYears: 5,
      submittedAt: new Date().toISOString(),
      answers: {
        fullName: 'Dr. Priya Desai',
        contact_email: testEmail,
        credentials: 'M.Sc Clinical Psychology',
        yearsOfExperience: 5,
        city: 'Bengaluru',
        state: 'Karnataka',
        feePerSession: 1800,
        currentCapacity: 10,
        maxCapacity: 15,
        truthfulnessConfirmed: true,
        ethicsDeclaration: true,
        backgroundCheckConsent: true,
      },
      documents: [
        {
          filename: 'msc_degree_certificate.pdf',
          category: 'degree_certificate',
          size: 980000,
        },
      ],
    });

    const messages = await waitForMessages(2);
    assert.strictEqual(messages.length, 2, 'Must dispatch both admin notification and applicant receipt');

    const adminMsg = messages.find((m) => m.to === SUPPORT_CONFIG.supportEmail);
    const applicantMsg = messages.find((m) => m.to === testEmail);

    assert(adminMsg, 'Admin notification must be received');
    assert(applicantMsg, 'Applicant confirmation receipt must be received');
    assert.strictEqual(applicantMsg.subject, 'Your Ingress Within Therapist Application Has Been Received');
    assert(applicantMsg.html.includes('msc_degree_certificate.pdf'), 'Applicant copy lists submitted document');
    assert(applicantMsg.html.includes('Bengaluru, Karnataka'), 'Applicant copy includes location');
    assert(applicantMsg.html.includes('₹1800 per session'), 'Applicant copy includes fee');
  });

  await test('notifyTherapistApplicationApproved dispatches congratulations email with login CTA', async () => {
    LoggedEmailProvider.clear();
    const testAccountId = crypto.randomUUID();
    const testEmail = `approved.${Date.now()}@example.com`;

    await EmailService.notifyTherapistApplicationApproved({
      therapistAccountId: testAccountId,
      therapistName: 'Dr. Vikram Malhotra',
      email: testEmail,
      loginUrl: 'https://ingresswithin.com/auth?role=therapist',
    });

    const messages = await waitForMessages(1);
    const approvalMsg = messages.find((m) => m.to === testEmail);

    assert(approvalMsg, 'Approval message must be delivered to applicant');
    assert.strictEqual(
      approvalMsg.subject,
      'Congratulations! Your Ingress Within therapist application is approved'
    );
    assert(approvalMsg.html.includes('https://ingresswithin.com/auth?role=therapist'), 'Contains canonical login URL');
    assert(approvalMsg.html.includes('Your Therapist Account is Verified &amp; Practice Authorized'));
    assert(approvalMsg.html.includes(SUPPORT_CONFIG.supportEmail));
  });

  await test('Repeated approval calls for same therapist are deduplicated (Idempotency Key Guard)', async () => {
    LoggedEmailProvider.clear();
    const testAccountId = `therapist_dup_${crypto.randomUUID()}`;
    const testEmail = `dup.approval.${Date.now()}@example.com`;

    // 1st dispatch
    await EmailService.notifyTherapistApplicationApproved({
      therapistAccountId: testAccountId,
      therapistName: 'Dr. Duplicate Check',
      email: testEmail,
    });

    const messages1 = await waitForMessages(1);
    assert.strictEqual(messages1.length, 1, 'First dispatch must succeed');

    // 2nd dispatch with exact same therapistAccountId (and thus identical idempotency key)
    await EmailService.notifyTherapistApplicationApproved({
      therapistAccountId: testAccountId,
      therapistName: 'Dr. Duplicate Check',
      email: testEmail,
    });

    const messages2 = await waitForMessages(1);
    assert.strictEqual(messages2.length, 1, 'Duplicate dispatch must be ignored idempotently');
  });

  await test('Fail-safe queueing: Email dispatch errors never throw or roll back critical workflows', async () => {
    // Calling notifyTherapistApplicationSubmitted with invalid email is handled fail-safe
    let didThrow = false;
    try {
      await EmailService.notifyTherapistApplicationSubmitted({
        therapistAccountId: crypto.randomUUID(),
        therapistName: 'Dr. Fail Safe',
        email: 'invalid-email-address',
      });
    } catch {
      didThrow = true;
    }
    assert.strictEqual(didThrow, false, 'EmailService must never throw uncaught exceptions to caller');
  });

  // --- SECTION 4: Integrity of Existing Features ---
  console.log('\n--- SECTION 4: Non-Regression & Architecture Integrity ---');

  await test('All transactional template keys remain registered and operational', () => {
    const expectedKeys = [
      'therapist_match_request',
      'therapist_accepted_client',
      'therapist_accepted_therapist_confirmation',
      'first_session_coordination_team',
      'session_confirmed',
      'session_rescheduled',
      'session_cancelled',
      'refund_initiated',
      'no_show_recorded',
      'therapist_application_submitted_admin',
      'therapist_application_received',
      'therapist_application_approved',
      'therapist_application_rejected',
    ];

    for (const key of expectedKeys) {
      assert(typeof EmailTemplates[key] === 'function', `Template renderer for "${key}" must be registered`);
    }
  });

  await test('SUPPORT_CONFIG values match production contact channels', () => {
    assert.strictEqual(SUPPORT_CONFIG.supportEmail, 'contactus@ingresswithin.com');
    assert.strictEqual(SUPPORT_CONFIG.temporaryContactNumber, '+91 89556 05569');
  });

  console.log('\n================================================================');
  console.log(`   SUITE COMPLETE: ${passed} OF ${total} TESTS PASSED SUCCESSFULLY!`);
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\nFatal test runner failure:', err);
  process.exit(1);
});
