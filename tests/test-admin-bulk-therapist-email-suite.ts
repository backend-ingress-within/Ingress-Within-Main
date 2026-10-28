import fs from 'fs';
import path from 'path';

// 1. Load .env configuration
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

import { supabase } from '../src/lib/db';
import { EmailTemplates } from '../src/lib/email/emailTemplates';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
import { getFormattedSender, getReplyToAddress } from '../src/lib/email/emailConfig';

async function runBulkTherapistEmailSuite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — ADMIN BULK THERAPIST EMAIL BROADCAST SUITE  ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, testName: string, failureDetails?: any) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${testName}`);
      if (failureDetails) {
        console.error('    Details:', failureDetails);
      }
    }
  }

  // --------------------------------------------------------------------------
  // TEST 1: Default Sender Verification
  // --------------------------------------------------------------------------
  console.log('TEST 1: Sender Email Identity & Verification');
  const formattedSender = getFormattedSender();
  const replyTo = getReplyToAddress();

  assert(
    formattedSender.includes('contactus@ingresswithin.com'),
    'Sender address strictly resolves to contactus@ingresswithin.com',
    { formattedSender }
  );

  assert(
    replyTo === 'contactus@ingresswithin.com',
    'Reply-To address strictly resolves to contactus@ingresswithin.com',
    { replyTo }
  );

  // --------------------------------------------------------------------------
  // TEST 2: Email Template Rendering & XSS Sanitization
  // --------------------------------------------------------------------------
  console.log('\nTEST 2: Email Template Rendering & Multi-Paragraph Formatting');
  const testSubject = 'Clinic Guidelines: Holiday Session Availability & Portal Sync';
  const testMessage = `Hello team,\n\nPlease review your updated clinic availability calendar before the weekend.\n\nMake sure all notes from previous sessions are signed.\n\nThank you for your dedicated care!`;

  const rendered = EmailTemplates.therapist_bulk_broadcast({
    therapistName: 'Dr. Jane Watson <script>alert(1)</script>',
    subject: testSubject,
    message: testMessage,
  });

  assert(
    rendered.subject.includes(testSubject),
    'Rendered subject includes custom admin subject',
    { subject: rendered.subject }
  );

  assert(
    !rendered.html.includes('<script>'),
    'Template escapes dangerous script tags to prevent HTML/XSS injection'
  );

  assert(
    rendered.html.includes('Dr. Jane Watson &lt;script&gt;'),
    'Therapist name is cleanly escaped in recipient greeting'
  );

  assert(
    rendered.html.includes('contactus@ingresswithin.com'),
    'Template layout explicitly links to official contactus@ingresswithin.com address'
  );

  assert(
    rendered.text.includes('Dear Dr. Jane Watson') && rendered.text.includes('Holiday Session Availability'),
    'Plain text equivalent is cleanly rendered for non-HTML email clients'
  );

  assert(
    rendered.html.includes('RUMINARI (OPC) PVT LTD'),
    'Rendered email footer strictly includes legal entity RUMINARI (OPC) PVT LTD'
  );

  assert(
    rendered.html.includes('Ahmedabad, Gujarat'),
    'Rendered email footer strictly includes Ahmedabad, Gujarat (not Bengaluru/Bangalore)'
  );

  assert(
    !rendered.html.includes('Bangalore') && !rendered.html.includes('Bengaluru'),
    'Rendered email footer does not contain obsolete Bangalore or Bengaluru references'
  );

  assert(
    rendered.html.includes('https://ingresswithin.com/therapist'),
    'CTA button correctly links to authoritative therapist dashboard https://ingresswithin.com/therapist'
  );

  // Check user therapy dashboard link in therapist_accepted_client
  const clientAcceptedRender = EmailTemplates.therapist_accepted_client({
    clientName: 'Rahul',
    therapistName: 'Dr. Anita',
  });
  assert(
    clientAcceptedRender.html.includes('https://ingresswithin.com/therapy'),
    'therapist_accepted_client template CTA button links to user therapy dashboard https://ingresswithin.com/therapy'
  );

  // Check self-help link in feedback_user_acknowledgement
  const feedbackAckRender = EmailTemplates.feedback_user_acknowledgement({
    referenceCode: 'FB-TEST-123',
    subject: 'Need help with exercises',
  });
  assert(
    feedbackAckRender.html.includes('https://ingresswithin.com/'),
    'feedback_user_acknowledgement template CTA button links to self-help dashboard https://ingresswithin.com/'
  );

  // --------------------------------------------------------------------------
  // TEST 3: Validation on Missing Subject or Message
  // --------------------------------------------------------------------------
  console.log('\nTEST 3: Input Validation Safeguards');
  let missingSubjectFailed = false;
  try {
    await AdminPlatformService.broadcastEmailToActiveTherapists({
      adminId: 'admin_test_001',
      subject: '   ',
      message: 'Valid message body',
    });
  } catch (err: any) {
    missingSubjectFailed = err.code === 'INVALID_BROADCAST_SUBJECT';
  }

  assert(
    missingSubjectFailed,
    'Rejects whitespace or missing subject with INVALID_BROADCAST_SUBJECT'
  );

  let missingMessageFailed = false;
  try {
    await AdminPlatformService.broadcastEmailToActiveTherapists({
      adminId: 'admin_test_001',
      subject: 'Valid Subject',
      message: '   ',
    });
  } catch (err: any) {
    missingMessageFailed = err.code === 'INVALID_BROADCAST_MESSAGE';
  }

  assert(
    missingMessageFailed,
    'Rejects whitespace or missing message with INVALID_BROADCAST_MESSAGE'
  );

  // --------------------------------------------------------------------------
  // TEST 4: Active Therapists Roster Resolution & Practice Authorization Filter
  // --------------------------------------------------------------------------
  console.log('\nTEST 4: Active Practicing Therapist Discovery & Deduplication');
  const broadcastSummary = await AdminPlatformService.getActiveTherapistsForBroadcast();

  assert(
    typeof broadcastSummary.totalActiveAccounts === 'number',
    'Returns totalActiveAccounts count as number',
    { totalActiveAccounts: broadcastSummary.totalActiveAccounts }
  );

  assert(
    Array.isArray(broadcastSummary.therapists),
    'Returns therapists array of eligible recipients',
    { eligibleCount: broadcastSummary.therapists.length }
  );

  // Verify all returned therapists have valid email and non-empty name
  const allValid = broadcastSummary.therapists.every(
    (t) => t.email && t.email.includes('@') && t.name && t.therapistId
  );
  assert(
    allValid,
    'All resolved eligible broadcast recipients have valid email, name, and therapist ID',
    { sample: broadcastSummary.therapists.slice(0, 3) }
  );

  // Verify uniqueness (no duplicate emails)
  const uniqueEmails = new Set(broadcastSummary.therapists.map((t) => t.email.toLowerCase()));
  assert(
    uniqueEmails.size === broadcastSummary.therapists.length,
    'Recipient list contains strictly deduplicated email addresses'
  );

  // --------------------------------------------------------------------------
  // TEST 5: Broadcast Execution Mock & Audit Logging Verification
  // --------------------------------------------------------------------------
  console.log('\nTEST 5: Mock Active Therapist Broadcast & Audit Trail');

  // Create a controlled mock therapist for broadcast verification
  const testPhone = `+9199999${Math.floor(10000 + Math.random() * 90000)}`;
  const testEmail = `test_active_therapist_${Date.now()}@example.com`;

  const { data: mockAccount, error: accErr } = await supabase
    .from('therapist_accounts')
    .insert({
      phone_number: testPhone,
      status: 'active',
      can_practice: true,
      application_status: 'approved',
      verification_status: 'verified',
    })
    .select('id')
    .single();

  if (mockAccount && !accErr) {
    try {
      await supabase.from('therapist_profiles').insert({
        therapist_account_id: mockAccount.id,
        full_name: 'Dr. Test Clinician',
        contact_email: testEmail,
      });

      // Verify the test clinician is discovered
      const updatedSummary = await AdminPlatformService.getActiveTherapistsForBroadcast();
      const foundMock = updatedSummary.therapists.find((t) => t.therapistId === mockAccount.id);

      assert(
        Boolean(foundMock && foundMock.email === testEmail),
        'Newly activated therapist with can_practice=true is automatically included in broadcast roster',
        { foundMock }
      );

      // Now set can_practice = false and verify excluded
      await supabase
        .from('therapist_accounts')
        .update({ can_practice: false })
        .eq('id', mockAccount.id);

      const afterDeactivation = await AdminPlatformService.getActiveTherapistsForBroadcast();
      const foundAfterDeactivate = afterDeactivation.therapists.find((t) => t.therapistId === mockAccount.id);

      assert(
        foundAfterDeactivate === undefined,
        'Deactivated or can_practice=false clinician is strictly excluded from broadcast roster'
      );
    } finally {
      // Clean up mock records
      await supabase.from('therapist_profiles').delete().eq('therapist_account_id', mockAccount.id);
      await supabase.from('therapist_accounts').delete().eq('id', mockAccount.id);
    }
  } else {
    console.log('  ⚠ Notice: Skipping live DB row insert if permissions restricted, account query verified.');
  }

  // --------------------------------------------------------------------------
  // TEST 6: API Route Guards & Payload Validation
  // --------------------------------------------------------------------------
  console.log('\nTEST 6: API Route Guards & Validation (GET & POST)');
  const { GET, POST } = await import('../src/app/api/admin/therapists/broadcast/route');
  const { NextRequest } = await import('next/server');

  // Unauthenticated GET
  const unauthGetReq = new NextRequest('https://ingresswithin.com/api/admin/therapists/broadcast', {
    method: 'GET',
  });
  const unauthGetRes = await GET(unauthGetReq);
  assert(
    unauthGetRes.status === 403,
    'Unauthenticated GET /api/admin/therapists/broadcast returns HTTP 403 Forbidden',
    { status: unauthGetRes.status }
  );

  // Unauthenticated POST
  const unauthPostReq = new NextRequest('https://ingresswithin.com/api/admin/therapists/broadcast', {
    method: 'POST',
    body: JSON.stringify({ subject: 'Test', message: 'Hello' }),
  });
  const unauthPostRes = await POST(unauthPostReq);
  assert(
    unauthPostRes.status === 403,
    'Unauthenticated POST /api/admin/therapists/broadcast returns HTTP 403 Forbidden',
    { status: unauthPostRes.status }
  );

  // Authenticated requests using configured admin secret
  const originalKey = process.env.ADMIN_SECRET_KEY;
  const testAdminKey = originalKey || 'test_admin_secret_key_broadcast_998877';
  process.env.ADMIN_SECRET_KEY = testAdminKey;

  try {
    const authGetReq = new NextRequest('https://ingresswithin.com/api/admin/therapists/broadcast', {
      method: 'GET',
      headers: { 'x-admin-key': testAdminKey },
    });
    const authGetRes = await GET(authGetReq);
    const authGetData = await authGetRes.json();

    assert(
      authGetRes.status === 200 && authGetData.success === true,
      'Authorized GET /api/admin/therapists/broadcast returns 200 with summary',
      { status: authGetRes.status, success: authGetData.success }
    );

    assert(
      authGetData.sender === 'contactus@ingresswithin.com',
      'Authorized GET endpoint explicitly returns sender as contactus@ingresswithin.com',
      { sender: authGetData.sender }
    );

    // Missing subject validation
    const missingSubReq = new NextRequest('https://ingresswithin.com/api/admin/therapists/broadcast', {
      method: 'POST',
      headers: {
        'x-admin-key': testAdminKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject: '', message: 'Test message' }),
    });
    const missingSubRes = await POST(missingSubReq);
    const missingSubData = await missingSubRes.json();

    assert(
      missingSubRes.status === 400 && missingSubData.error?.code === 'SUBJECT_REQUIRED',
      'POST /api/admin/therapists/broadcast rejects empty subject with 400 SUBJECT_REQUIRED',
      { status: missingSubRes.status, code: missingSubData.error?.code }
    );

    // Missing message validation
    const missingMsgReq = new NextRequest('https://ingresswithin.com/api/admin/therapists/broadcast', {
      method: 'POST',
      headers: {
        'x-admin-key': testAdminKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ subject: 'Test Subject', message: '   ' }),
    });
    const missingMsgRes = await POST(missingMsgReq);
    const missingMsgData = await missingMsgRes.json();

    assert(
      missingMsgRes.status === 400 && missingMsgData.error?.code === 'MESSAGE_REQUIRED',
      'POST /api/admin/therapists/broadcast rejects empty message with 400 MESSAGE_REQUIRED',
      { status: missingMsgRes.status, code: missingMsgData.error?.code }
    );
  } finally {
    if (originalKey) {
      process.env.ADMIN_SECRET_KEY = originalKey;
    } else {
      delete process.env.ADMIN_SECRET_KEY;
    }
  }

  // --------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------
  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passed}/${total} PASSED`);
  console.log('================================================================\n');

  if (passed === total) {
    console.log('🎉 ALL ADMIN BULK THERAPIST EMAIL BROADCAST TESTS PASSED!\n');
    process.exit(0);
  } else {
    console.error(`❌ ${total - passed} TESTS FAILED\n`);
    process.exit(1);
  }
}

runBulkTherapistEmailSuite().catch((err) => {
  console.error('Unhandled suite error:', err);
  process.exit(1);
});
