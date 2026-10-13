/**
 * Ingress Within — Interactive Live Email Smoke Test CLI
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/test-live-email.ts your-email@example.com
 */

import { EmailService } from '../src/lib/email/emailService';
import { getEmailConfig } from '../src/lib/email/emailConfig';

async function main() {
  const recipient = process.argv[2]?.trim();

  console.log('\n============================================================');
  console.log('   INGRESS WITHIN — LIVE MSG91 EMAIL DELIVERY TEST          ');
  console.log('============================================================\n');

  if (!recipient || !recipient.includes('@')) {
    console.error('❌ Error: Please provide a target email address.');
    console.error('Example:');
    console.error('   npx tsx --env-file=.env scripts/test-live-email.ts your-email@example.com\n');
    process.exit(1);
  }

  const config = getEmailConfig();

  console.log('--- Active Configuration ---');
  console.log(`Provider:        ${config.provider}`);
  console.log(`Sending Domain:  ${config.msg91EmailDomain}`);
  console.log(`Template ID:     ${config.msg91EmailTemplateId || '(not configured)'}`);
  console.log(`From Address:    ${config.fromAddress}`);
  console.log(`Reply-To:        ${config.replyTo}`);
  console.log(`Auth Key:        ${config.msg91EmailAuthKey ? 'Present (***' + config.msg91EmailAuthKey.slice(-4) + ')' : 'MISSING ❌'}`);
  console.log(`Recipient:       ${recipient}\n`);

  if (!config.msg91EmailAuthKey) {
    console.error('❌ MSG91_EMAIL_AUTH_KEY (or MSG91_AUTH_KEY) is missing in your .env file.');
    process.exit(1);
  }

  if (!config.msg91EmailTemplateId) {
    console.error('❌ MSG91_EMAIL_TEMPLATE_ID is missing in your .env file.');
    console.error('   Please add MSG91_EMAIL_TEMPLATE_ID="your_template_id" in .env');
    process.exit(1);
  }

  console.log('⏳ Dispatching live smoke test email via MSG91 API...');
  const start = Date.now();

  const result = await EmailService.sendSmokeTestEmail({
    recipientEmail: recipient,
  });

  const duration = Date.now() - start;

  console.log('\n--- Result ---');
  if (result.success) {
    console.log(`✅ SUCCESS! Email accepted by MSG91 API in ${duration}ms`);
    console.log(`   Provider:    ${result.provider}`);
    console.log(`   Message ID:  ${result.messageId || '(generated)'}`);
    console.log(`   Delivery ID: ${result.deliveryId || '(in-memory)'}`);
    console.log(`   Status:      ${result.status}`);
    console.log(`\n📬 Check your inbox at "${recipient}" (also check Spam/Promotions if newly registered domain).`);
  } else {
    console.error(`❌ FAILED (Status: ${result.status})`);
    console.error(`   Error Category: ${result.errorCategory || 'UNKNOWN'}`);
    console.error(`   Error Message:  ${result.error || 'Unknown error'}`);
    console.error('\nTroubleshooting Tips:');
    if (result.errorCategory === 'AUTHENTICATION_ERROR' || (result.error && result.error.includes('401'))) {
      console.error('   • Your MSG91_AUTH_KEY might be invalid or expired.');
    } else if (result.errorCategory === 'DOMAIN_NOT_VERIFIED' || (result.error && result.error.includes('403'))) {
      console.error('   • The domain in MSG91_EMAIL_DOMAIN does not match an approved domain in MSG91.');
    } else if (result.errorCategory === 'MISSING_TEMPLATE_CONFIGURATION' || (result.error && result.error.includes('422'))) {
      console.error('   • Check MSG91_EMAIL_TEMPLATE_ID in .env.');
    }
  }

  console.log('\n============================================================\n');
}

main().catch((err) => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});
