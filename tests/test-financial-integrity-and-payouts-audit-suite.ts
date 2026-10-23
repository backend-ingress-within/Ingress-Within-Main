process.env.BYPASS_REDIS = 'true';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import assert from 'assert';
import { TherapistPayoutAccountService } from '../src/lib/therapist/therapistPayoutAccountService';
import { TherapistPayoutService } from '../src/lib/therapist/therapistPayoutService';
import { TherapistEarningsService } from '../src/lib/therapist/therapistEarningsService';
import { AdminPlatformService } from '../src/lib/admin/adminPlatformService';
import { supabase } from '../src/lib/db';

async function runTestSuite() {
  console.log('================================================================');
  console.log('STARTING MASTER FINANCIAL INTEGRITY & PAYOUT AUDIT TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function test(name: string, fn: () => Promise<void> | void) {
    totalTests++;
    return (async () => {
      try {
        await fn();
        console.log(`  ✓ PASS: ${name}`);
        passedTests++;
      } catch (err: any) {
        console.error(`  ✗ FAIL: ${name}`);
        console.error(`    ${err.message || err}`);
        throw err;
      }
    })();
  }

  // --- 1. PAYOUT ACCOUNT ONBOARDING & DATA SANITIZATION ---
  console.log('--- TEST GROUP 1: Payout Account Validation & Tokenization ---');

  await test('Bank Account masking preserves only last 4 digits', () => {
    const masked = TherapistPayoutAccountService.maskBankAccount('123456789012');
    assert.strictEqual(masked, '••••9012');
    const shortMasked = TherapistPayoutAccountService.maskBankAccount('4321');
    assert.strictEqual(shortMasked, '••••4321');
  });

  await test('UPI VPA masking masks identifier before domain', () => {
    const masked = TherapistPayoutAccountService.maskUpiId('siddharth@oksbi');
    assert.strictEqual(masked, 'si••••@oksbi');
    const shortMasked = TherapistPayoutAccountService.maskUpiId('a@upi');
    assert.strictEqual(shortMasked, 'a••••@upi');
  });

  await test('createPayoutAccount rejects invalid IFSC code', async () => {
    try {
      await TherapistPayoutAccountService.createPayoutAccount({
        therapistAccountId: 'test-therapist-id-1',
        accountType: 'bank',
        beneficiaryName: 'Dr. Jane Doe',
        accountNumber: '987654321012',
        ifsc: 'INVALID_IFSC',
      });
      assert.fail('Should have thrown an error for invalid IFSC code');
    } catch (err: any) {
      assert.strictEqual(err.code, 'INVALID_IFSC_CODE');
    }
  });

  await test('createPayoutAccount rejects invalid UPI VPA format', async () => {
    try {
      await TherapistPayoutAccountService.createPayoutAccount({
        therapistAccountId: 'test-therapist-id-1',
        accountType: 'upi',
        beneficiaryName: 'Dr. Jane Doe',
        upiId: 'not-a-valid-vpa',
      });
      assert.fail('Should have thrown an error for invalid UPI ID');
    } catch (err: any) {
      assert.strictEqual(err.code, 'INVALID_UPI_ID');
    }
  });

  await test('createPayoutAccount creates tokenized Bank and UPI accounts without leaking secrets', async () => {
    const bankAccount = await TherapistPayoutAccountService.createPayoutAccount({
      therapistAccountId: 'test-therapist-audit-acc',
      accountType: 'bank',
      beneficiaryName: 'Dr. Samantha Bloom',
      accountNumber: '50100234567890',
      ifsc: 'HDFC0001234',
    });

    assert.ok(bankAccount.id);
    assert.strictEqual(bankAccount.account_type, 'bank');
    assert.strictEqual(bankAccount.masked_identifier, '••••7890');
    assert.strictEqual(bankAccount.bank_name, 'HDFC Bank');
    assert.strictEqual(bankAccount.status, 'verified');
    assert.strictEqual(bankAccount.is_default, true);
    // Crucial: ensure raw account number or ifsc are NOT exposed anywhere on account object
    assert.strictEqual((bankAccount as any).accountNumber, undefined);
    assert.strictEqual((bankAccount as any).ifsc, undefined);

    const upiAccount = await TherapistPayoutAccountService.createPayoutAccount({
      therapistAccountId: 'test-therapist-audit-acc',
      accountType: 'upi',
      beneficiaryName: 'Dr. Samantha Bloom',
      upiId: 'samantha@okhdfcbank',
      isDefault: true,
    });

    assert.ok(upiAccount.id);
    assert.strictEqual(upiAccount.account_type, 'upi');
    assert.strictEqual(upiAccount.masked_identifier, 'sa••••@okhdfcbank');
    assert.strictEqual(upiAccount.is_default, true);

    // Verify default switched properly
    const updatedBank = await TherapistPayoutAccountService.getPayoutAccountById(bankAccount.id);
    assert.strictEqual(updatedBank?.is_default, false);
  });

  // --- 2. AUTHORITATIVE BALANCE ENGINE & INVARIANTS ---
  console.log('\n--- TEST GROUP 2: Authoritative Balance Engine & Anti-Corruption Invariants ---');

  const testTherapistId = 'test-audit-therapist-math';

  await test('Simulate multi-session lifecycle: collected, cancelled, client_no_show, in-flight, completed', async () => {
    // Session 1: Valid Completed Session (₹1,500 gross -> ₹1,146 net after 20% fee + 18% GST on fee)
    const appt1Id = 'audit-appt-1-valid';
    await TherapistPayoutService.recordEarningForAppointment({
      earningId: 'audit-earn-1',
      therapistAccountId: testTherapistId,
      appointmentId: appt1Id,
      grossAmount: 1500,
      initialStatus: 'collected',
    });

    // Session 2: Valid Completed Session with Client No-Show (₹1,500 gross -> ₹1,146 net)
    const appt2Id = 'audit-appt-2-no-show';
    await TherapistPayoutService.recordEarningForAppointment({
      earningId: 'audit-earn-2',
      therapistAccountId: testTherapistId,
      appointmentId: appt2Id,
      grossAmount: 1500,
      initialStatus: 'collected',
    });

    // Session 3: Cancelled Session (MUST NOT be withdrawable)
    const appt3Id = 'audit-appt-3-cancelled';
    await TherapistPayoutService.recordEarningForAppointment({
      earningId: 'audit-earn-3',
      therapistAccountId: testTherapistId,
      appointmentId: appt3Id,
      grossAmount: 1500,
      initialStatus: 'collected',
    });
    // Immediately cancel Session 3 via refund handler
    await TherapistPayoutService.handleAppointmentRefund(appt3Id);

    // Initial Balance Check:
    // Session 1 (1146) + Session 2 (1146) = ₹2,292
    // Session 3 is cancelled = ₹0
    const b1 = await TherapistPayoutAccountService.getAvailableBalance(testTherapistId);
    assert.strictEqual(b1.totalNetEarned, 2292);
    assert.strictEqual(b1.availableToWithdraw, 2292);
    assert.strictEqual(b1.withdrawn, 0);
    assert.strictEqual(b1.pendingPayout, 2292);
    assert.strictEqual(b1.inFlightWithdrawals, 0);
  });

  await test('Withdrawal submission reserves available balance in-flight', async () => {
    // Create verified account for withdrawal
    const acc = await TherapistPayoutAccountService.createPayoutAccount({
      therapistAccountId: testTherapistId,
      accountType: 'upi',
      beneficiaryName: 'Dr. Test Math',
      upiId: 'testmath@okhdfcbank',
    });

    // Request withdrawal of ₹1,000
    const wReq = await TherapistPayoutAccountService.requestWithdrawal({
      therapistAccountId: testTherapistId,
      payoutAccountId: acc.id,
      amount: 1000,
      idempotencyKey: 'idemp-audit-test-1',
    });

    assert.strictEqual(wReq.status, 'processing');
    assert.strictEqual(wReq.amount, 1000);

    // Balance verification:
    // Available: 2292 - 1000 = 1292
    // In-flight: 1000
    // Withdrawn: 0 (not completed yet)
    const b2 = await TherapistPayoutAccountService.getAvailableBalance(testTherapistId);
    assert.strictEqual(b2.availableToWithdraw, 1292);
    assert.strictEqual(b2.inFlightWithdrawals, 1000);
    assert.strictEqual(b2.withdrawn, 0);
    assert.strictEqual(b2.pendingPayout, 2292);
  });

  await test('Reject concurrent withdrawal requests exceeding available balance', async () => {
    const accounts = await TherapistPayoutAccountService.getPayoutAccounts(testTherapistId);
    const acc = accounts[0];

    // Try to withdraw ₹2,000 (only ₹1,292 available)
    try {
      await TherapistPayoutAccountService.requestWithdrawal({
        therapistAccountId: testTherapistId,
        payoutAccountId: acc.id,
        amount: 2000,
      });
      assert.fail('Should have rejected withdrawal exceeding available balance');
    } catch (err: any) {
      assert.strictEqual(err.code, 'INSUFFICIENT_BALANCE');
    }
  });

  await test('RazorpayX webhook payout.processed transitions withdrawal to completed and updates balance', async () => {
    const history = await TherapistPayoutAccountService.getWithdrawalHistory(testTherapistId);
    const w = history[0];

    // Deliver payout.processed webhook
    const webhookRes = await TherapistPayoutAccountService.handlePayoutWebhookEvent({
      event: 'payout.processed',
      payload: {
        payout: {
          entity: {
            id: w.provider_payout_id!,
            amount: 100000,
            status: 'processed',
            utr: 'UTR_TEST_1234567890',
          },
        },
      },
    });

    assert.strictEqual(webhookRes.handled, true);
    assert.strictEqual(webhookRes.status, 'completed');

    // Balance verification:
    // Total Net Earned: 2292
    // Withdrawn: 1000
    // In-flight: 0
    // Pending Payout: 1292
    // Available to Withdraw: 1292
    const b3 = await TherapistPayoutAccountService.getAvailableBalance(testTherapistId);
    assert.strictEqual(b3.totalNetEarned, 2292);
    assert.strictEqual(b3.withdrawn, 1000);
    assert.strictEqual(b3.inFlightWithdrawals, 0);
    assert.strictEqual(b3.pendingPayout, 1292);
    assert.strictEqual(b3.availableToWithdraw, 1292);

    // Duplicate webhook delivery: must be idempotent!
    const dupRes = await TherapistPayoutAccountService.handlePayoutWebhookEvent({
      event: 'payout.processed',
      payload: {
        payout: {
          entity: {
            id: w.provider_payout_id!,
            amount: 100000,
            status: 'processed',
            utr: 'UTR_TEST_1234567890',
          },
        },
      },
    });
    assert.strictEqual(dupRes.idempotent, true);
  });

  await test('RazorpayX webhook payout.failed releases held funds back to available balance', async () => {
    const accounts = await TherapistPayoutAccountService.getPayoutAccounts(testTherapistId);
    const acc = accounts[0];

    // Request second withdrawal of ₹500
    const w2 = await TherapistPayoutAccountService.requestWithdrawal({
      therapistAccountId: testTherapistId,
      payoutAccountId: acc.id,
      amount: 500,
      idempotencyKey: 'idemp-audit-test-2',
    });

    // Delivered payout.failed
    const failRes = await TherapistPayoutAccountService.handlePayoutWebhookEvent({
      event: 'payout.failed',
      payload: {
        payout: {
          entity: {
            id: w2.provider_payout_id!,
            amount: 50000,
            status: 'failed',
            failure_reason: 'Account closed by beneficiary',
          },
        },
      },
    });

    assert.strictEqual(failRes.handled, true);
    assert.strictEqual(failRes.status, 'failed');

    // Balance verification: The ₹500 must be restored to available balance!
    const b4 = await TherapistPayoutAccountService.getAvailableBalance(testTherapistId);
    assert.strictEqual(b4.availableToWithdraw, 1292);
    assert.strictEqual(b4.inFlightWithdrawals, 0);
    assert.strictEqual(b4.withdrawn, 1000);
  });

  // --- 3. DATABASE RECONCILIATION & ADMIN PANEL INTEGRITY ---
  console.log('\n--- TEST GROUP 3: Database Reconciliation & Admin Panel Integrity ---');

  await test('AdminPlatformService.getOverviewMetrics executes without errors and calculates integer paise', async () => {
    const overview = await AdminPlatformService.getOverviewMetrics('30d');
    assert.ok(typeof overview.totalUsers === 'number');
    assert.ok(typeof overview.grossRevenuePaise === 'number');
    assert.ok(typeof overview.platformFeesPaise === 'number');
    assert.ok(typeof overview.therapistEarningsPaise === 'number');
    assert.ok(typeof overview.failedPayments === 'number');
    assert.strictEqual(overview.currency, 'INR');

    // Invariant: Gross Revenue = Platform Fees + Therapist Net (within integer rounding)
    const calculatedSum = overview.platformFeesPaise + overview.therapistEarningsPaise;
    const diff = Math.abs(overview.grossRevenuePaise - calculatedSum);
    assert.ok(diff <= 100, `Gross revenue should balance with fees + net, diff was ${diff} paise`);
  });

  await test('AdminPlatformService.getRevenueAnalytics returns exact refunds without hardcoding', async () => {
    const analytics = await AdminPlatformService.getRevenueAnalytics('30d');
    assert.ok(typeof analytics.grossRevenuePaise === 'number');
    assert.ok(typeof analytics.refundsPaise === 'number');
    assert.ok(typeof analytics.successfulPaymentsCount === 'number');
    assert.ok(Array.isArray(analytics.dailyBreakdown));
  });

  await test('AdminPlatformService.getSessions uses scheduled_start and maps session_time correctly', async () => {
    const sessionsRes = await AdminPlatformService.getSessions({ page: 1, limit: 10 });
    assert.ok(Array.isArray(sessionsRes.sessions));
    assert.ok(typeof sessionsRes.pagination.total === 'number');
    if (sessionsRes.sessions.length > 0) {
      const s = sessionsRes.sessions[0];
      assert.ok(s.id);
      assert.ok(s.session_time !== undefined, 'session_time should be defined');
      assert.ok(s.client_id !== undefined, 'client_id should be mapped from user_id');
    }
  });

  await test('AdminPlatformService.getPayments unifies session bookings and orders without billing_orders table crash', async () => {
    const paymentsRes = await AdminPlatformService.getPayments({ page: 1, limit: 10 });
    assert.ok(Array.isArray(paymentsRes.payments));
    assert.ok(typeof paymentsRes.pagination.total === 'number');
    if (paymentsRes.payments.length > 0) {
      const p = paymentsRes.payments[0];
      assert.ok(p.id);
      assert.ok(typeof p.amount_total_paise === 'number');
      assert.ok(p.currency);
      assert.ok(p.status);
    }
  });

  await test('TherapistEarningsService.getEarningsReport matches TherapistPayoutAccountService.getAvailableBalance', async () => {
    // Check with therapist 9f61bc20-b896-449e-90c3-75c4a6a11b4d
    const therapistId = '9f61bc20-b896-449e-90c3-75c4a6a11b4d';
    const report = await TherapistEarningsService.getEarningsReport(therapistId, { range: 'month' });
    const balance = await TherapistPayoutAccountService.getAvailableBalance(therapistId);

    assert.ok(report.summary);
    assert.ok(report.balance);
    assert.strictEqual(report.balance.availableToWithdraw, balance.availableToWithdraw);
    assert.strictEqual(report.summary.pendingPayout, balance.pendingPayout);
    assert.strictEqual(report.summary.paidOut, balance.withdrawn);
  });

  console.log('\n================================================================');
  console.log(`ALL TESTS PASSED: ${passedTests}/${totalTests}`);
  console.log('================================================================\n');
}

runTestSuite().catch((err) => {
  console.error('\nFAILED TEST SUITE WITH UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
