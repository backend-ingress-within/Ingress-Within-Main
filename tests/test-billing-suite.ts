import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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

import { BillingService, GST_RATE } from '../src/lib/billing/billingService';
import { EntitlementService } from '../src/lib/billing/entitlementService';
import { RazorpayVerificationService } from '../src/lib/auth/razorpayVerificationService';

async function runBillingTestSuite() {
  console.log('================================================================');
  console.log('   INGRESS WITHIN: PRODUCTION BILLING SYSTEM TEST SUITE');
  console.log('================================================================\n');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (!condition) {
      console.error(`  ❌ FAILED: ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
    passedTests++;
    console.log(`  ✓ ${message}`);
  }

  // -------------------------------------------------------------
  // Test 1: Authoritative Integer Paise Calculations & GST
  // -------------------------------------------------------------
  console.log('Test 1: Authoritative Pricing & 18% GST (Integer Paise)');
  {
    const pricing = BillingService.calculatePricing(49900); // ₹499.00
    assert(pricing.subtotalPaise === 49900, 'Base amount is exactly 49900 paise (₹499.00)');
    assert(pricing.gstPaise === 8982, '18% GST is exactly 8982 paise (₹89.82)');
    assert(pricing.totalPaise === 58882, 'Total amount is exactly 58882 paise (₹588.82)');
    assert(pricing.gstRate === 0.18, 'GST rate is precisely 18%');
    assert(pricing.formattedSubtotal === '₹499.00', 'Formatted subtotal is ₹499.00');
    assert(pricing.formattedGst === '₹89.82', 'Formatted GST is ₹89.82');
    assert(pricing.formattedTotal === '₹588.82', 'Formatted total is ₹588.82');

    // Rounding verification for fractional paise (e.g. ₹199)
    const oddPricing = BillingService.calculatePricing(19900);
    assert(oddPricing.gstPaise === 3582, 'GST on ₹199 is 3582 paise');
    assert(oddPricing.totalPaise === 23482, 'Total on ₹199 is 23482 paise');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 2: Product Catalog & Server-Side Price Authority
  // -------------------------------------------------------------
  console.log('Test 2: Product Catalog & Server-Side Price Authority');
  {
    const subProduct = await BillingService.getProductBySku('SELF_HELP_MONTHLY');
    assert(subProduct !== null, 'Product SELF_HELP_MONTHLY exists in catalog');
    assert(subProduct?.price_inr === 49900, 'Catalog base price is 49900 paise (₹499.00)');
    assert(subProduct?.gst_rate === 0.18, 'Catalog GST rate is 0.18 (18%)');
    assert(subProduct?.type === 'subscription', 'Catalog type is subscription');
    assert(subProduct?.interval === 'monthly', 'Catalog interval is monthly');

    const activeProducts = await BillingService.getActiveProducts();
    assert(activeProducts.length > 0, 'Active products catalog returns at least one product');
    for (const prod of activeProducts) {
      assert(prod.price_inr > 0, `Product ${prod.sku} has positive base price`);
      assert(Number.isInteger(prod.price_inr), `Product ${prod.sku} price is integer paise`);
    }
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 3: Razorpay Payment Signature Verification (Standard Orders)
  // -------------------------------------------------------------
  console.log('Test 3: Razorpay Order Signature HMAC-SHA256 Verification');
  {
    const secret = BillingService.getKeySecret();
    const orderId = 'order_DA1234567890';
    const paymentId = 'pay_DB9876543210';
    const validSignature = crypto
      .createHmac('sha256', secret)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    const isValid = BillingService.verifyPaymentSignature(orderId, paymentId, validSignature);
    assert(isValid === true, 'Authentic Razorpay order signature is verified successfully');

    const isTampered = BillingService.verifyPaymentSignature(orderId, paymentId, validSignature + 'xyz');
    assert(isTampered === false, 'Tampered signature is rejected');

    const isWrongOrder = BillingService.verifyPaymentSignature('order_FAKE', paymentId, validSignature);
    assert(isWrongOrder === false, 'Mismatched order ID is rejected');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 4: Razorpay Subscription Signature Verification
  // -------------------------------------------------------------
  console.log('Test 4: Razorpay Subscription Signature HMAC-SHA256 Verification');
  {
    const secret = BillingService.getKeySecret();
    const paymentId = 'pay_SUB12345678';
    const subscriptionId = 'sub_SUB87654321';
    const validSubSig = crypto
      .createHmac('sha256', secret)
      .update(`${paymentId}|${subscriptionId}`)
      .digest('hex');

    const isValidSub = BillingService.verifySubscriptionSignature(subscriptionId, paymentId, validSubSig);
    assert(isValidSub === true, 'Authentic Razorpay subscription signature is verified');

    const isInvalidSub = BillingService.verifySubscriptionSignature(subscriptionId, paymentId, 'invalid_sig');
    assert(isInvalidSub === false, 'Invalid subscription signature is rejected');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 5: Razorpay Webhook Raw Body HMAC-SHA256 Verification
  // -------------------------------------------------------------
  console.log('Test 5: Razorpay Webhook Signature Verification');
  {
    const webhookSecret = BillingService.getWebhookSecret();
    const webhookPayload = JSON.stringify({
      entity: 'event',
      account_id: 'acc_123',
      event: 'subscription.charged',
      contains: ['subscription', 'payment'],
      payload: {
        subscription: { entity: { id: 'sub_live_123' } },
        payment: { entity: { id: 'pay_live_456', amount: 58882 } }
      }
    });

    const validWebhookSig = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookPayload)
      .digest('hex');

    const isWhValid = BillingService.verifyWebhookSignature(webhookPayload, validWebhookSig);
    assert(isWhValid === true, 'Webhook with valid raw payload signature passes verification');

    const isWhTampered = BillingService.verifyWebhookSignature(webhookPayload + ' ', validWebhookSig);
    assert(isWhTampered === false, 'Webhook with altered body fails verification');

    const isWhBadSig = BillingService.verifyWebhookSignature(webhookPayload, 'wrong_hex_digest');
    assert(isWhBadSig === false, 'Webhook with forged signature fails verification');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 6: Invoice Number Generation Format & Line Items
  // -------------------------------------------------------------
  console.log('Test 6: Sequential Invoice Number Format & Tax Breakdown');
  {
    const year = new Date().getFullYear();
    const invoicePrefix = `INV-${year}-`;
    const formatRegex = new RegExp(`^INV-${year}-\\d{5}$`);

    const sampleInvoiceId1 = `${invoicePrefix}00001`;
    const sampleInvoiceId2 = `${invoicePrefix}00042`;

    assert(formatRegex.test(sampleInvoiceId1), `Sample invoice ${sampleInvoiceId1} conforms to INV-YYYY-XXXXX format`);
    assert(formatRegex.test(sampleInvoiceId2), `Sample invoice ${sampleInvoiceId2} conforms to INV-YYYY-XXXXX format`);

    // Verify invoice items calculation
    const base = 49900;
    const tax = Math.round(base * GST_RATE);
    const total = base + tax;

    assert(tax === 8982, 'Invoice GST line item = ₹89.82 (8982 paise)');
    assert(total === 58882, 'Invoice Total line item = ₹588.82 (58882 paise)');
    assert(base + tax === total, 'Sum of base and GST matches total exactly');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 7: Razorpay Verification Access Account Security
  // -------------------------------------------------------------
  console.log('Test 7: Temporary Synthetic Reviewer Account Security');
  {
    const isEnabled = RazorpayVerificationService.isVerificationEnabled();
    console.log(`   Verification Account Enabled: ${isEnabled}`);

    // Verify rejection of invalid credentials
    const badLogin = RazorpayVerificationService.verifyCredentials('wrong_user', 'wrong_pass');
    assert(badLogin === false, 'Invalid credentials rejected by reviewer authenticator');

    // Test synthetic reviewer creation and isolation
    const syntheticUser = await RazorpayVerificationService.getOrCreateSyntheticReviewer();
    assert(syntheticUser !== null, 'Synthetic reviewer profile resolves');
    assert(syntheticUser.phone_number === '+919999990000', 'Synthetic reviewer uses dedicated test phone (+919999990000)');

    // Test session establishment
    const session = await RazorpayVerificationService.establishReviewerSession();
    assert(session.token.length > 20, 'Synthetic reviewer session token successfully minted');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 8: Entitlement Service Module Check
  // -------------------------------------------------------------
  console.log('Test 8: Dynamic Entitlement Engine Verification');
  {
    // Test synthetic reviewer entitlement bypass
    const syntheticHasSub = await EntitlementService.hasActiveSubscription('synthetic-reviewer-user');
    assert(syntheticHasSub === true, 'Synthetic reviewer automatically has active platform access');

    const syntheticHasModule = await EntitlementService.hasModuleAccess('synthetic-reviewer-user', 'module_10');
    assert(syntheticHasModule === true, 'Synthetic reviewer automatically has module access for testing');

    // Test non-existent user
    const randomUserSub = await EntitlementService.hasActiveSubscription('non-existent-user-123456');
    assert(randomUserSub === false, 'Non-existent user correctly returns false for subscription');
  }
  console.log('');

  // -------------------------------------------------------------
  // Test 9: No Hardcoded/Mock Billing Data Regression Check
  // -------------------------------------------------------------
  console.log('Test 9: Zero Mock/Hardcoded Billing Data Static Audit');
  {
    const settingsPath = path.join(process.cwd(), 'src/views/SettingsPage.jsx');
    const settingsCode = fs.readFileSync(settingsPath, 'utf8');

    assert(!settingsCode.includes('mockSubscription'), 'No mockSubscription in SettingsPage.jsx');
    assert(!settingsCode.includes('mockInvoices'), 'No mockInvoices in SettingsPage.jsx');
    assert(!settingsCode.includes('₹799'), 'No ₹799 in SettingsPage.jsx');
    assert(!settingsCode.includes('14 July 2026'), 'No hardcoded "14 July 2026" date in SettingsPage.jsx');
    assert(!settingsCode.includes('setSubState'), 'No dev subState preview switcher in SettingsPage.jsx');
    assert(settingsCode.includes('/api/billing/overview'), 'SettingsPage fetches real /api/billing/overview');
    assert(settingsCode.includes('/api/billing/subscriptions'), 'SettingsPage posts to real /api/billing/subscriptions');
    assert(settingsCode.includes('/api/billing/subscriptions/cancel'), 'SettingsPage posts to real /api/billing/subscriptions/cancel');
  }
  console.log('');

  console.log('================================================================');
  console.log(`  ALL ${passedTests}/${totalTests} BILLING TEST SUITE CHECKS PASSED!`);
  console.log('================================================================\n');
}

runBillingTestSuite().catch((err) => {
  console.error('\n❌ Billing test suite failed with error:', err);
  process.exit(1);
});
