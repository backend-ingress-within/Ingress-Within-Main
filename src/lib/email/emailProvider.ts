import { getEmailConfig, getMsg91TemplateId, readFreshEnvKey } from './emailConfig';

export interface EmailSendOptions {
  to: string;
  recipientName?: string;
  from: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  templateKey?: string;
  templateData?: Record<string, any>;
  crqid?: string;
}

export interface EmailSendResult {
  success: boolean;
  provider: 'msg91' | 'resend' | 'mock';
  messageId?: string;
  crqid?: string;
  statusCode?: number;
  error?: string;
  errorCategory?: string;
  isPermanent?: boolean;
}

export interface IEmailProvider {
  send(options: EmailSendOptions): Promise<EmailSendResult>;
}

/**
 * Helper to mask recipient email addresses in logs to preserve patient privacy.
 * e.g., "patient.name@example.com" -> "p***e@example.com"
 */
function maskEmailForLogs(email: string): string {
  if (!email || !email.includes('@')) return '***';
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local[0]}***@${domain}`;
  return `${local[0]}***${local[local.length - 1]}@${domain}`;
}

/**
 * Extracts raw email and display name from an RFC 5322 string.
 * e.g., '"Ingress Within" <contactus@ingresswithin.com>' -> { name: "Ingress Within", email: "contactus@ingresswithin.com" }
 */
function parseEmailAndName(input: string, fallbackName = 'Ingress Within'): { name: string; email: string } {
  const trimmed = (input || '').trim();
  const angleMatch = trimmed.match(/^(?:"?([^"<]*)"?\s*)?<([^>]+)>$/);
  if (angleMatch) {
    const name = angleMatch[1]?.trim() || fallbackName;
    const email = angleMatch[2]?.trim();
    return { name, email };
  }
  return { name: fallbackName, email: trimmed };
}

/**
 * Resilient in-memory mock provider for automated unit testing and isolated staging.
 * CANNOT be silently activated in production unless ALLOW_MOCK_EMAIL=true is explicitly set.
 */
export class LoggedEmailProvider implements IEmailProvider {
  public static sentMessages: Array<{
    to: string;
    from: string;
    subject: string;
    html: string;
    text?: string;
    sentAt: string;
    messageId: string;
    templateKey?: string;
    templateData?: Record<string, any>;
    crqid?: string;
  }> = [];

  async send(options: EmailSendOptions): Promise<EmailSendResult> {
    const messageId = `mock_msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record = {
      ...options,
      sentAt: new Date().toISOString(),
      messageId,
    };
    LoggedEmailProvider.sentMessages.push(record);
    console.log(`[EmailProvider:Mock] Simulated dispatch (no real email delivered). to=${options.to} subject="${options.subject}" id=${messageId}`);
    return {
      success: true,
      provider: 'mock',
      messageId,
      crqid: options.crqid,
      statusCode: 200,
    };
  }

  static getSentMessages() {
    return this.sentMessages;
  }

  static clear() {
    this.sentMessages = [];
  }
}

/**
 * Production-ready Centralized MSG91 Transactional Email Provider.
 * Conforms to the official MSG91 Email API v5 specification:
 * https://docs.msg91.com/email
 *
 * Endpoint: POST https://control.msg91.com/api/v5/email/send
 * Headers: authkey, content-type: application/json, accept: application/json
 */
export class Msg91EmailProvider implements IEmailProvider {
  private authKey: string;
  private domain: string;
  private endpoint: string;
  private timeoutMs: number;

  constructor(
    authKey: string,
    domain?: string,
    endpoint = 'https://control.msg91.com/api/v5/email/send',
    timeoutMs = 10000
  ) {
    this.authKey = authKey.trim();
    this.domain = domain?.trim() || 'ingresswithin.com';
    this.endpoint = endpoint;
    this.timeoutMs = timeoutMs;
  }

  async send(options: EmailSendOptions): Promise<EmailSendResult> {
    const maskedTo = maskEmailForLogs(options.to);

    // 1. Resolve MSG91 Template ID (Single reusable template architecture)
    const templateKey = options.templateKey || '';
    const templateId = getMsg91TemplateId(templateKey);

    if (!templateId) {
      const errorMsg = `No MSG91 email template ID configured. Configure MSG91_EMAIL_TEMPLATE_ID (or MSG91_EMAIL_DEFAULT_TEMPLATE_ID). Ingress Within utilizes a single reusable base template for all transactional emails.`;
      console.error(`[Msg91EmailProvider:Failure] [MISSING_TEMPLATE_CONFIGURATION]: ${errorMsg}`);
      return {
        success: false,
        provider: 'msg91',
        error: errorMsg,
        errorCategory: 'MISSING_TEMPLATE_CONFIGURATION',
        isPermanent: true,
      };
    }

    // 2. Parse sender & reply-to details
    const parsedSender = parseEmailAndName(options.from, 'Ingress Within');
    const senderEmail = parsedSender.email;
    const senderName = parsedSender.name;

    let replyToObj: Array<{ name?: string; email: string }> | undefined = undefined;
    if (options.replyTo) {
      const parsedReply = parseEmailAndName(options.replyTo, 'Ingress Within');
      replyToObj = [{ name: parsedReply.name, email: parsedReply.email }];
    }

    // 3. Prepare template variables
    // In the single reusable MSG91 base template:
    // Subject is interpolated via {{subject}}
    // Rendered HTML layout is interpolated via {{{body_html}}}, {{{body}}}, or {{{content}}}
    // Plain text is accessible via {{body_text}}
    const variables: Record<string, any> = {
      ...(options.templateData || {}),
      subject: options.subject,
      body: options.html,
      body_html: options.html,
      body_text: options.text || '',
      content: options.html,
      template_key: templateKey,
    };

    // 4. Construct MSG91 Send Email v5 Payload
    const recipientToObj: { name?: string; email: string; CRQID?: string } = {
      email: options.to,
    };
    if (options.recipientName) {
      recipientToObj.name = options.recipientName;
    }
    if (options.crqid) {
      recipientToObj.CRQID = options.crqid;
    }

    const payload = {
      recipients: [
        {
          to: [recipientToObj],
          variables,
        },
      ],
      from: {
        name: senderName,
        email: senderEmail,
      },
      domain: this.domain,
      reply_to: replyToObj,
      subject: options.subject,
      template_id: templateId,
    };

    // 5. Execute bounded HTTP request
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

      let res: Response;
      try {
        res = await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'authkey': this.authKey,
            'content-type': 'application/json',
            'accept': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }

      const responseText = await res.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {
        // Raw text response
      }

      // 6. Handle HTTP Non-200 Responses
      if (!res.ok) {
        // If 401, check if authKey was updated on disk (e.g. key rotation)
        if (res.status === 401) {
          const freshKey = readFreshEnvKey('MSG91_EMAIL_AUTH_KEY') || readFreshEnvKey('MSG91_AUTH_KEY');
          if (freshKey && freshKey !== this.authKey) {
            console.log('[Msg91EmailProvider] Reloaded updated MSG91 Auth Key from disk, retrying delivery...');
            this.authKey = freshKey;
            const retryRes = await fetch(this.endpoint, {
              method: 'POST',
              headers: {
                'authkey': this.authKey,
                'content-type': 'application/json',
                'accept': 'application/json',
              },
              body: JSON.stringify(payload),
            });
            if (retryRes.ok) {
              const retryJson = await retryRes.json().catch(() => ({}));
              const retryMessageId =
                retryJson?.data?.messageId ||
                retryJson?.data?.id ||
                retryJson?.requestId ||
                retryJson?.message_id ||
                null;
              console.log(`[Msg91EmailProvider:Success] Email accepted by MSG91 API on retry. id=${retryMessageId || '(unknown)'} to=${maskedTo}`);
              return {
                success: true,
                messageId: retryMessageId || undefined,
                crqid: options.crqid,
                provider: 'msg91',
                statusCode: retryRes.status,
              };
            }
          }
        }

        const rawErrorMsg =
          responseJson?.message ||
          responseJson?.error?.message ||
          responseJson?.error ||
          `HTTP ${res.status}: ${responseText || 'Unknown MSG91 error'}`;

        let errorCategory = 'TRANSIENT_PROVIDER_ERROR';
        if (res.status === 401) {
          errorCategory = 'AUTHENTICATION_ERROR';
        } else if (res.status === 403) {
          if (/domain|verify|verified/i.test(rawErrorMsg)) {
            errorCategory = 'DOMAIN_NOT_VERIFIED';
          } else {
            errorCategory = 'ACCESS_DENIED';
          }
        } else if (res.status === 422) {
          if (/template/i.test(rawErrorMsg)) {
            errorCategory = 'MISSING_TEMPLATE_CONFIGURATION';
          } else {
            errorCategory = 'VALIDATION_ERROR';
          }
        } else if (res.status === 429) {
          errorCategory = 'RATE_LIMIT_EXCEEDED';
        } else if (res.status >= 500) {
          errorCategory = 'PROVIDER_UNAVAILABLE';
        }

        console.error(`[Msg91EmailProvider:Failure] Status ${res.status} [${errorCategory}]: ${rawErrorMsg}`);

        const isPermanent =
          errorCategory === 'AUTHENTICATION_ERROR' ||
          errorCategory === 'DOMAIN_NOT_VERIFIED' ||
          errorCategory === 'VALIDATION_ERROR' ||
          errorCategory === 'ACCESS_DENIED' ||
          errorCategory === 'MISSING_TEMPLATE_CONFIGURATION';

        return {
          success: false,
          provider: 'msg91',
          statusCode: res.status,
          error: rawErrorMsg,
          errorCategory,
          isPermanent,
        };
      }

      // 7. Parse MSG91 Success Payload
      // MSG91 standard response: { status: "success", message: "Email sent successfully.", data: { messageId: "..." } }
      // Alternatively: { requestId: "...", status: "success" } or { message_id: "..." }
      const isSuccessStatus = responseJson?.status === 'success' || !responseJson?.hasError;
      const messageId =
        responseJson?.data?.messageId ||
        responseJson?.data?.id ||
        responseJson?.requestId ||
        responseJson?.message_id ||
        responseJson?.id;

      if (!messageId && !isSuccessStatus) {
        console.error('[Msg91EmailProvider:Failure] MSG91 returned HTTP 200 without success status or message ID:', responseText);
        return {
          success: false,
          provider: 'msg91',
          statusCode: res.status,
          error: responseJson?.message || 'MSG91 response missing provider message ID or success acknowledgment',
          errorCategory: 'INVALID_PROVIDER_RESPONSE',
          isPermanent: true,
        };
      }

      const finalMessageId = messageId || `msg91_req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      console.log(`[Msg91EmailProvider:Success] Email accepted by MSG91 API. id=${finalMessageId} to=${maskedTo}`);

      return {
        success: true,
        provider: 'msg91',
        statusCode: res.status,
        messageId: finalMessageId,
        crqid: options.crqid,
      };
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.error(`[Msg91EmailProvider:Exception] Timeout after ${this.timeoutMs}ms communicating with MSG91 API`);
        return {
          success: false,
          provider: 'msg91',
          error: `MSG91 API request timed out after ${this.timeoutMs}ms`,
          errorCategory: 'TIMEOUT_ERROR',
          isPermanent: false,
        };
      }

      console.error('[Msg91EmailProvider:Exception]', err.message || err);
      return {
        success: false,
        provider: 'msg91',
        error: err.message || 'Network exception communicating with MSG91 Email API',
        errorCategory: 'NETWORK_ERROR',
        isPermanent: false,
      };
    }
  }
}

/**
 * Legacy REST-based email provider communicating directly with Resend API.
 * Retained for explicit, monitored fallback during migration if EMAIL_PROVIDER=resend.
 */
export class RestEmailProvider implements IEmailProvider {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint = 'https://api.resend.com/emails') {
    this.apiKey = apiKey.trim();
    this.endpoint = endpoint;
  }

  async send(options: EmailSendOptions): Promise<EmailSendResult> {
    try {
      const payload: Record<string, any> = {
        from: options.from,
        to: [options.to],
        subject: options.subject,
        html: options.html,
        text: options.text,
      };

      if (options.replyTo) {
        payload.reply_to = options.replyTo;
      }

      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseText = await res.text();
      let responseJson: any = null;
      try {
        responseJson = JSON.parse(responseText);
      } catch {}

      if (!res.ok) {
        const errorMsg =
          responseJson?.message ||
          responseJson?.error?.message ||
          `HTTP ${res.status}: ${responseText || 'Unknown Resend error'}`;

        let errorCategory = 'TRANSIENT_PROVIDER_ERROR';
        if (res.status === 401) errorCategory = 'AUTHENTICATION_ERROR';
        else if (res.status === 403) errorCategory = /domain|verify/i.test(errorMsg) ? 'DOMAIN_NOT_VERIFIED' : 'ACCESS_DENIED';
        else if (res.status === 422) errorCategory = 'VALIDATION_ERROR';
        else if (res.status === 429) errorCategory = 'RATE_LIMIT_EXCEEDED';
        else if (res.status >= 500) errorCategory = 'PROVIDER_UNAVAILABLE';

        const isPermanent =
          errorCategory === 'AUTHENTICATION_ERROR' ||
          errorCategory === 'DOMAIN_NOT_VERIFIED' ||
          errorCategory === 'VALIDATION_ERROR' ||
          errorCategory === 'ACCESS_DENIED';

        return {
          success: false,
          provider: 'resend',
          statusCode: res.status,
          error: errorMsg,
          errorCategory,
          isPermanent,
        };
      }

      const messageId = responseJson?.id;
      if (!messageId) {
        return {
          success: false,
          provider: 'resend',
          statusCode: res.status,
          error: 'Resend response missing provider message ID',
          errorCategory: 'INVALID_PROVIDER_RESPONSE',
          isPermanent: true,
        };
      }

      return {
        success: true,
        provider: 'resend',
        statusCode: res.status,
        messageId,
      };
    } catch (err: any) {
      return {
        success: false,
        provider: 'resend',
        error: err.message || 'Network exception communicating with Resend API',
        errorCategory: 'NETWORK_ERROR',
        isPermanent: false,
      };
    }
  }
}

/**
 * Fallback provider that fails clearly when credentials are not configured in production.
 * Ensures the system never marks an email as 'sent' when no provider is configured.
 */
export class MissingCredentialsProvider implements IEmailProvider {
  private reason: string;

  constructor(reason = 'MSG91 email credentials (MSG91_EMAIL_AUTH_KEY or MSG91_AUTH_KEY) are missing in environment.') {
    this.reason = reason;
  }

  async send(options: EmailSendOptions): Promise<EmailSendResult> {
    const errorMsg = `[Email Provider Failure] ${this.reason} Cannot send email to ${options.to}.`;
    console.error(errorMsg);
    return {
      success: false,
      provider: 'msg91',
      error: errorMsg,
      errorCategory: 'MISSING_PROVIDER_CREDENTIALS',
      isPermanent: true,
    };
  }
}

/**
 * Factory to retrieve the active email provider.
 * Guarantees that production environments fail loudly if provider credentials are absent,
 * preventing silent failures and false "sent" reports.
 */
export function getEmailProvider(): IEmailProvider {
  const config = getEmailConfig();

  // 1. Force mock mode for automated unit tests when explicitly enabled
  if (process.env.FORCE_MOCK_EMAIL === 'true' && config.allowMockEmail) {
    return new LoggedEmailProvider();
  }

  // 2. Active MSG91 Email Provider (Primary Transactional Provider)
  if (config.provider === 'msg91' && config.msg91EmailAuthKey) {
    return new Msg91EmailProvider(config.msg91EmailAuthKey, config.msg91EmailDomain);
  }

  // 3. Explicit monitored Resend fallback if explicitly selected in environment
  if (config.provider === 'resend' && config.resendApiKey) {
    console.warn('[EmailProvider] Operating under explicit legacy fallback provider (Resend).');
    return new RestEmailProvider(config.resendApiKey);
  }

  // 4. Secondary check: if MSG91 key is present regardless of default flag
  if (config.msg91EmailAuthKey) {
    return new Msg91EmailProvider(config.msg91EmailAuthKey, config.msg91EmailDomain);
  }

  // 5. Explicit mock permitted in test or non-production environment
  if (config.allowMockEmail) {
    console.warn('[EmailProvider] Email credentials not configured. Falling back to LoggedEmailProvider (allowed via test/ALLOW_MOCK_EMAIL=true).');
    return new LoggedEmailProvider();
  }

  // 6. Strict production failure: NEVER report sent if provider credentials are missing
  return new MissingCredentialsProvider(
    'MSG91_EMAIL_AUTH_KEY (or MSG91_AUTH_KEY) is missing in environment. Production transactional email requires a valid MSG91 authentication key.'
  );
}
