export type EmailRecipientType = 'client' | 'therapist' | 'team';

export type EmailDeliveryStatus = 'pending' | 'sent' | 'failed';

export interface EmailRecipient {
  email: string;
  name?: string;
  type: EmailRecipientType;
  id?: string;
}

export interface EmailRenderedContent {
  subject: string;
  html: string;
  text: string;
}

export interface SendEmailOptions {
  eventType: string;
  recipient: EmailRecipient;
  templateKey: string;
  templateData: Record<string, any>;
  entityType?: 'appointment' | 'booking' | 'match' | 'refund';
  entityId?: string;
  metadata?: Record<string, any>;
}

export interface EmailDeliveryRecord {
  id: string;
  eventType: string;
  recipientType: EmailRecipientType;
  recipientId?: string | null;
  recipientEmail: string;
  templateKey: string;
  subject: string;
  bodyHtml: string;
  bodyText?: string | null;
  entityType?: string | null;
  entityId?: string | null;
  status: EmailDeliveryStatus;
  attemptCount: number;
  lastError?: string | null;
  metadata?: Record<string, any>;
  sentAt?: string | null;
  createdAt: string;
}
