import fs from 'fs';
import path from 'path';

/**
 * Ingress Within — Transactional Email Configuration
 * Centralized, fail-safe environment variable resolution, sender parsing, and mode control.
 * Authoritatively migrated to MSG91 as the single transactional email delivery provider.
 */

export interface EmailConfig {
  provider: 'msg91' | 'mock';
  msg91EmailAuthKey: string | null;
  msg91EmailDomain: string;
  msg91EmailTemplateId: string | null;
  msg91EmailDefaultTemplateId: string | null;
  fromAddress: string;
  fromName: string;
  replyTo: string;
  adminNotificationEmail: string;
  opsTeamEmail: string;
  webhookSecret: string | null;
  dispatchMode: 'queue' | 'immediate';
  isProduction: boolean;
  allowMockEmail: boolean;
}

export const MSG91_TEMPLATE_ENV_KEYS: Record<string, string> = {
  therapist_match_request: 'MSG91_TEMPLATE_THERAPIST_MATCH_REQUEST',
  therapist_accepted_client: 'MSG91_TEMPLATE_THERAPIST_ACCEPTED_CLIENT',
  therapist_accepted_therapist_confirmation: 'MSG91_TEMPLATE_THERAPIST_ACCEPTED_CONFIRMATION',
  first_session_coordination_team: 'MSG91_TEMPLATE_FIRST_SESSION_COORDINATION_TEAM',
  session_confirmed: 'MSG91_TEMPLATE_SESSION_CONFIRMED',
  session_rescheduled: 'MSG91_TEMPLATE_SESSION_RESCHEDULED',
  session_cancelled: 'MSG91_TEMPLATE_SESSION_CANCELLED',
  refund_initiated: 'MSG91_TEMPLATE_REFUND_INITIATED',
  no_show_recorded: 'MSG91_TEMPLATE_NO_SHOW_RECORDED',
  therapist_application_submitted_admin: 'MSG91_TEMPLATE_THERAPIST_APPLICATION_SUBMITTED_ADMIN',
  therapist_application_received: 'MSG91_TEMPLATE_THERAPIST_APPLICATION_RECEIVED',
  therapist_application_approved: 'MSG91_TEMPLATE_THERAPIST_APPLICATION_APPROVED',
  therapist_application_rejected: 'MSG91_TEMPLATE_THERAPIST_APPLICATION_REJECTED',
  feedback_team_notification: 'MSG91_TEMPLATE_FEEDBACK_TEAM_NOTIFICATION',
  feedback_user_acknowledgement: 'MSG91_TEMPLATE_FEEDBACK_USER_ACKNOWLEDGEMENT',
  smoke_test: 'MSG91_TEMPLATE_SMOKE_TEST',
  therapist_bulk_broadcast: 'MSG91_TEMPLATE_THERAPIST_BULK_BROADCAST',
};

export function readFreshEnvKey(key: string): string | null {
  if (process.env.IGNORE_DISK_ENV === 'true') {
    return process.env[key] ? process.env[key]!.trim() : null;
  }

  // In test mode, respect process.env mutations directly for isolated testing
  if (process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true') {
    return process.env[key] !== undefined && process.env[key] !== '' ? process.env[key]!.trim() : null;
  }

  try {
    const envPath = path.resolve(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      const match = content.match(new RegExp(`^${key}=(.*)$`, 'm'));
      if (match && match[1]) {
        const val = match[1].trim().replace(/^["']|["']$/g, '');
        if (val) return val;
      }
    }
  } catch {}
  return process.env[key]?.trim() || null;
}

export function getMsg91TemplateId(templateKey?: string): string | null {
  // 1. If an event-specific template override is explicitly configured, honor it (backward compatibility)
  if (templateKey) {
    const envKey = MSG91_TEMPLATE_ENV_KEYS[templateKey];
    if (envKey) {
      const val = readFreshEnvKey(envKey);
      if (val) return val;
    }

    const dynamicKey = `MSG91_TEMPLATE_${templateKey.toUpperCase()}`;
    const dynamicVal = readFreshEnvKey(dynamicKey);
    if (dynamicVal) return dynamicVal;
  }

  // 2. Primary: Single reusable base HTML template ID for all Ingress Within transactional emails
  const singleTemplateId =
    readFreshEnvKey('MSG91_EMAIL_TEMPLATE_ID') ||
    readFreshEnvKey('MSG91_EMAIL_DEFAULT_TEMPLATE_ID') ||
    process.env.MSG91_EMAIL_TEMPLATE_ID?.trim() ||
    process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID?.trim();

  return singleTemplateId || null;
}

export function getEmailConfig(): EmailConfig {
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true';

  // Sender details
  const fileFrom = readFreshEnvKey('EMAIL_FROM');
  const fromAddress = (fileFrom || process.env.EMAIL_FROM)?.trim() || 'contactus@ingresswithin.com';
  const fromName = (readFreshEnvKey('EMAIL_FROM_NAME') || process.env.EMAIL_FROM_NAME)?.trim() || 'Ingress Within';
  const replyTo = (readFreshEnvKey('EMAIL_REPLY_TO') || process.env.EMAIL_REPLY_TO)?.trim() || 'contactus@ingresswithin.com';

  // Parse default domain from fromAddress if not explicitly set
  let extractedDomain = 'ingresswithin.com';
  const atMatch = fromAddress.match(/@([a-zA-Z0-9.-]+)/);
  if (atMatch && atMatch[1]) {
    extractedDomain = atMatch[1].replace(/>$/, '').trim();
  }

  // MSG91 Email Configuration
  const msg91EmailAuthKey =
    readFreshEnvKey('MSG91_EMAIL_AUTH_KEY') ||
    readFreshEnvKey('MSG91_AUTH_KEY') ||
    process.env.MSG91_EMAIL_AUTH_KEY?.trim() ||
    process.env.MSG91_AUTH_KEY?.trim() ||
    null;

  const rawMsg91Domain =
    readFreshEnvKey('MSG91_EMAIL_DOMAIN') ||
    process.env.MSG91_EMAIL_DOMAIN?.trim() ||
    extractedDomain;
  const msg91EmailDomain = rawMsg91Domain ? rawMsg91Domain.toLowerCase().trim() : 'mail.ingresswithin.com';

  const msg91EmailDefaultTemplateId =
    readFreshEnvKey('MSG91_EMAIL_DEFAULT_TEMPLATE_ID') ||
    readFreshEnvKey('MSG91_EMAIL_TEMPLATE_ID') ||
    process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID?.trim() ||
    process.env.MSG91_EMAIL_TEMPLATE_ID?.trim() ||
    null;

  // Webhook secret resolution (MSG91 priority with fallback to generic EMAIL_WEBHOOK_SECRET)
  const webhookSecret =
    readFreshEnvKey('MSG91_WEBHOOK_SECRET') ||
    readFreshEnvKey('EMAIL_WEBHOOK_SECRET') ||
    process.env.MSG91_WEBHOOK_SECRET?.trim() ||
    process.env.EMAIL_WEBHOOK_SECRET?.trim() ||
    null;

  // Destination addresses
  const adminNotificationEmail =
    readFreshEnvKey('THERAPIST_APPLICATION_NOTIFICATION_EMAIL') ||
    readFreshEnvKey('OPS_TEAM_EMAIL') ||
    process.env.THERAPIST_APPLICATION_NOTIFICATION_EMAIL?.trim() ||
    process.env.OPS_TEAM_EMAIL?.trim() ||
    'contactus@ingresswithin.com';

  const opsTeamEmail =
    readFreshEnvKey('OPS_TEAM_EMAIL') ||
    process.env.OPS_TEAM_EMAIL?.trim() ||
    'contactus@ingresswithin.com';

  // Dispatch mode
  const dispatchMode =
    process.env.EMAIL_DISPATCH_MODE === 'queue' && process.env.BYPASS_REDIS !== 'true'
      ? 'queue'
      : 'immediate';

  const allowMockEmail = isTest || process.env.ALLOW_MOCK_EMAIL === 'true';

  // Active Provider Selection (Strictly MSG91 or mock in test/dev)
  const explicitProvider = (readFreshEnvKey('EMAIL_PROVIDER') || process.env.EMAIL_PROVIDER)?.toLowerCase();
  let provider: 'msg91' | 'mock' = 'msg91';

  if (explicitProvider === 'mock' && allowMockEmail) {
    provider = 'mock';
  } else {
    provider = 'msg91';
  }

  const msg91EmailTemplateId =
    readFreshEnvKey('MSG91_EMAIL_TEMPLATE_ID') ||
    readFreshEnvKey('MSG91_EMAIL_DEFAULT_TEMPLATE_ID') ||
    process.env.MSG91_EMAIL_TEMPLATE_ID?.trim() ||
    process.env.MSG91_EMAIL_DEFAULT_TEMPLATE_ID?.trim() ||
    null;

  return {
    provider,
    msg91EmailAuthKey,
    msg91EmailDomain,
    msg91EmailTemplateId,
    msg91EmailDefaultTemplateId: msg91EmailTemplateId,
    fromAddress,
    fromName,
    replyTo,
    adminNotificationEmail,
    opsTeamEmail,
    webhookSecret,
    dispatchMode,
    isProduction,
    allowMockEmail,
  };
}

/**
 * Returns formatted RFC 5322 sender string, e.g. "Ingress Within <contactus@ingresswithin.com>"
 */
export function getFormattedSender(): string {
  const config = getEmailConfig();
  if (config.fromAddress.includes('<') && config.fromAddress.includes('>')) {
    return config.fromAddress;
  }
  return `"${config.fromName}" <${config.fromAddress}>`;
}

/**
 * Returns canonical reply-to address
 */
export function getReplyToAddress(): string {
  return getEmailConfig().replyTo;
}
