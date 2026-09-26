export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface IEmailProvider {
  send(options: {
    to: string;
    from: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<EmailSendResult>;
}

/**
 * Resilient mock/development provider that logs dispatches
 * and stores them in-memory for testing verification.
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
  }> = [];

  async send(options: {
    to: string;
    from: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<EmailSendResult> {
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const record = {
      ...options,
      sentAt: new Date().toISOString(),
      messageId,
    };
    LoggedEmailProvider.sentMessages.push(record);
    console.log(`[EmailProvider:Sent] to=${options.to} subject="${options.subject}" id=${messageId}`);
    return { success: true, messageId };
  }

  static getSentMessages() {
    return this.sentMessages;
  }

  static clear() {
    this.sentMessages = [];
  }
}

/**
 * HTTP/REST-based provider (e.g. Resend) if API key is provided
 */
export class RestEmailProvider implements IEmailProvider {
  private apiKey: string;
  private endpoint: string;

  constructor(apiKey: string, endpoint = 'https://api.resend.com/emails') {
    this.apiKey = apiKey;
    this.endpoint = endpoint;
  }

  async send(options: {
    to: string;
    from: string;
    subject: string;
    html: string;
    text?: string;
  }): Promise<EmailSendResult> {
    try {
      const res = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: options.from,
          to: [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        return { success: false, error: `HTTP ${res.status}: ${errorText}` };
      }

      const data = await res.json();
      return { success: true, messageId: data.id || 'resend_ok' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Unknown network error' };
    }
  }
}

/**
 * Factory to retrieve the active email provider.
 */
export function getEmailProvider(): IEmailProvider {
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && !process.env.TEST_MODE) {
    return new RestEmailProvider(resendKey);
  }
  return new LoggedEmailProvider();
}
