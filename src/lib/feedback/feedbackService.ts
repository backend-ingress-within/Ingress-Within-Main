import crypto from 'crypto';
import { supabase } from '../db';
import { EmailService } from '../email/emailService';
import { SUPPORT_CONFIG } from '../../config/supportConfig';

export interface CreateFeedbackInput {
  submission_type: 'feedback' | 'bug_report' | 'issue';
  subject: string;
  description: string;
  category?: string;
  contact_email?: string | null;
  page_url?: string | null;
  steps_to_reproduce?: string | null;
  expected_behavior?: string | null;
  actual_behavior?: string | null;
  user_id?: string | null;
  metadata?: Record<string, any>;
  bot_trap?: string; // honeypot
}

export interface FeedbackRecord {
  id: string;
  reference_code: string;
  submission_type: 'feedback' | 'bug_report' | 'issue';
  subject: string;
  description: string;
  category: string;
  contact_email: string | null;
  page_url: string | null;
  steps_to_reproduce: string | null;
  expected_behavior: string | null;
  actual_behavior: string | null;
  user_id: string | null;
  status: 'new' | 'in_review' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'normal' | 'high' | 'critical';
  admin_notes: string | null;
  assigned_to: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
  resolved_at: string | null;
  user?: {
    id: string;
    phone_number?: string;
    name?: string;
  } | null;
}

export interface ListFeedbackOptions {
  page?: number;
  limit?: number;
  status?: string;
  submission_type?: string;
  priority?: string;
  category?: string;
  search?: string;
}

export class FeedbackService {
  /**
   * Generates a non-sensitive, human-friendly reference identifier.
   * Format: FB-YYYYMMDD-XXXX (e.g. FB-20261009-4K7P)
   */
  public static generateReferenceCode(): string {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    return `FB-${today}-${randomHex}`;
  }

  /**
   * Sanitizes plain text input to prevent XSS and control character injection.
   */
  private static sanitizeText(val: string | null | undefined, maxLen = 3000): string {
    if (!val) return '';
    return val
      .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F]/g, '')
      .trim()
      .slice(0, maxLen);
  }

  /**
   * Validates email format.
   */
  private static isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  }

  /**
   * In-memory and database rate limiter: Max 5 submissions per 10 minutes per IP/User.
   */
  public static async checkRateLimit(ipOrUserId: string): Promise<boolean> {
    try {
      const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
      const { count } = await supabase
        .from('user_feedback')
        .select('*', { count: 'exact', head: true })
        .or(`metadata->>ip.eq.${ipOrUserId},user_id.eq.${ipOrUserId}`)
        .gte('created_at', tenMinutesAgo);

      return (count || 0) < 5;
    } catch {
      return true; // fail-open on rate limit query glitch
    }
  }

  /**
   * Creates a user feedback / bug report record.
   */
  public static async createFeedback(
    input: CreateFeedbackInput,
    clientIp?: string,
    userAgent?: string
  ): Promise<{ success: boolean; reference_code: string; id: string }> {
    // 1. Anti-bot honeypot check
    if (input.bot_trap && input.bot_trap.trim() !== '') {
      throw new Error('Automated submission detected.');
    }

    // 2. Validate submission type
    const validTypes = ['feedback', 'bug_report', 'issue'];
    const submissionType = input.submission_type && validTypes.includes(input.submission_type)
      ? input.submission_type
      : 'feedback';

    // 3. Validate subject & description
    const subject = this.sanitizeText(input.subject, 180);
    if (!subject || subject.length < 3) {
      throw new Error('Please provide a subject line (at least 3 characters).');
    }

    const description = this.sanitizeText(input.description, 4000);
    if (!description || description.length < 10) {
      throw new Error('Please describe the feedback or issue in more detail (at least 10 characters).');
    }

    // 4. Validate category
    const category = input.category ? this.sanitizeText(input.category, 60) : 'General Feedback';

    // 5. Validate contact email if provided
    let contactEmail: string | null = null;
    if (input.contact_email && input.contact_email.trim() !== '') {
      const cleanEmail = input.contact_email.trim().toLowerCase();
      if (!this.isValidEmail(cleanEmail)) {
        throw new Error('Please enter a valid email address for contact follow-up.');
      }
      contactEmail = cleanEmail;
    }

    // 6. Bug report diagnostic details
    const stepsToReproduce = input.steps_to_reproduce ? this.sanitizeText(input.steps_to_reproduce, 2000) : null;
    const expectedBehavior = input.expected_behavior ? this.sanitizeText(input.expected_behavior, 1000) : null;
    const actualBehavior = input.actual_behavior ? this.sanitizeText(input.actual_behavior, 1000) : null;
    const pageUrl = input.page_url ? this.sanitizeText(input.page_url, 300) : null;

    // 7. Generate unique reference code
    let referenceCode = this.generateReferenceCode();

    // 8. Prepare metadata
    const metadata = {
      ...(input.metadata || {}),
      ip: clientIp || 'unknown',
      user_agent: userAgent ? userAgent.slice(0, 200) : 'unknown',
      submitted_at: new Date().toISOString()
    };

    // 9. Insert into public.user_feedback
    const payload = {
      reference_code: referenceCode,
      submission_type: submissionType,
      subject,
      description,
      category,
      contact_email: contactEmail,
      page_url: pageUrl,
      steps_to_reproduce: stepsToReproduce,
      expected_behavior: expectedBehavior,
      actual_behavior: actualBehavior,
      user_id: input.user_id || null,
      status: 'new',
      priority: submissionType === 'bug_report' ? 'high' : 'normal',
      metadata
    };

    const { data: inserted, error: insertError } = await supabase
      .from('user_feedback')
      .insert(payload)
      .select('id, reference_code')
      .single();

    if (insertError) {
      console.error('[FeedbackService] Database insert failed:', insertError);
      throw new Error('Could not record your submission. Please try again shortly.');
    }

    const feedbackId = inserted.id;
    const finalRefCode = inserted.reference_code;

    // 10. Fire Transactional Emails Asynchronously (Fail-safe, non-blocking)
    void this.dispatchNotifications({
      id: feedbackId,
      referenceCode: finalRefCode,
      submissionType,
      category,
      subject,
      description,
      contactEmail,
      pageUrl,
      stepsToReproduce,
      expectedBehavior,
      actualBehavior,
      createdAt: new Date().toISOString()
    }).catch(err => {
      console.warn('[FeedbackService] Notification dispatch warning:', err.message);
    });

    return {
      success: true,
      reference_code: finalRefCode,
      id: feedbackId
    };
  }

  /**
   * Sends transactional email to the internal ops team and an acknowledgment to the user.
   */
  private static async dispatchNotifications(data: {
    id: string;
    referenceCode: string;
    submissionType: string;
    category: string;
    subject: string;
    description: string;
    contactEmail: string | null;
    pageUrl: string | null;
    stepsToReproduce: string | null;
    expectedBehavior: string | null;
    actualBehavior: string | null;
    createdAt: string;
  }): Promise<void> {
    const adminUrl = `https://ingresswithin.com/admin?tab=feedback&id=${data.id}`;

    // A. Notify internal team at contactus@ingresswithin.com
    await EmailService.sendEmail({
      eventType: 'feedback_received',
      recipient: {
        email: SUPPORT_CONFIG.supportEmail,
        name: 'Ingress Within Support Team',
        type: 'team'
      },
      templateKey: 'feedback_team_notification',
      templateData: {
        referenceCode: data.referenceCode,
        submissionType: data.submissionType,
        category: data.category,
        subject: data.subject,
        description: data.description,
        contactEmail: data.contactEmail,
        pageUrl: data.pageUrl,
        stepsToReproduce: data.stepsToReproduce,
        expectedBehavior: data.expectedBehavior,
        actualBehavior: data.actualBehavior,
        adminUrl,
        createdAt: data.createdAt
      },
      idempotencyKey: `fb_team_notif_${data.id}`
    }, true);

    // B. Send acknowledgment to submitter if valid contact email provided
    if (data.contactEmail) {
      await EmailService.sendEmail({
        eventType: 'feedback_acknowledgement',
        recipient: {
          email: data.contactEmail,
          type: 'client'
        },
        templateKey: 'feedback_user_acknowledgement',
        templateData: {
          referenceCode: data.referenceCode,
          subject: data.subject,
          description: data.description,
          submissionType: data.submissionType
        },
        idempotencyKey: `fb_ack_${data.id}`
      }, true);
    }
  }

  /**
   * Retrieves paginated feedback records for the administrative dashboard.
   */
  public static async listFeedback(options: ListFeedbackOptions = {}): Promise<{
    feedback: FeedbackRecord[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
    counts: {
      total: number;
      new: number;
      bug_reports: number;
      resolved: number;
    };
  }> {
    const page = Math.max(1, options.page || 1);
    const limit = Math.min(100, Math.max(1, options.limit || 20));
    const offset = (page - 1) * limit;

    let query = supabase
      .from('user_feedback')
      .select('*, users(id, phone_number, name)', { count: 'exact' });

    if (options.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }
    if (options.submission_type && options.submission_type !== 'all') {
      query = query.eq('submission_type', options.submission_type);
    }
    if (options.priority && options.priority !== 'all') {
      query = query.eq('priority', options.priority);
    }
    if (options.category && options.category !== 'all') {
      query = query.eq('category', options.category);
    }
    if (options.search && options.search.trim()) {
      const term = `%${options.search.trim()}%`;
      query = query.or(`reference_code.ilike.${term},subject.ilike.${term},contact_email.ilike.${term}`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      console.error('[FeedbackService] listFeedback query error:', error);
      throw new Error(`Failed to list feedback: ${error.message}`);
    }

    // Aggregate summary counts for admin dashboard header cards
    const { count: totalCount } = await supabase.from('user_feedback').select('id', { count: 'exact', head: true });
    const { count: newCount } = await supabase.from('user_feedback').select('id', { count: 'exact', head: true }).eq('status', 'new');
    const { count: bugCount } = await supabase.from('user_feedback').select('id', { count: 'exact', head: true }).eq('submission_type', 'bug_report');
    const { count: resolvedCount } = await supabase.from('user_feedback').select('id', { count: 'exact', head: true }).in('status', ['resolved', 'closed']);

    const total = count || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      feedback: (data as any) || [],
      pagination: {
        total,
        page,
        limit,
        totalPages
      },
      counts: {
        total: totalCount || 0,
        new: newCount || 0,
        bug_reports: bugCount || 0,
        resolved: resolvedCount || 0
      }
    };
  }

  /**
   * Fetches single feedback record with full detail.
   */
  public static async getFeedbackById(id: string): Promise<FeedbackRecord | null> {
    const { data, error } = await supabase
      .from('user_feedback')
      .select('*, users(id, phone_number, name)')
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(error.message);
    return data as any;
  }

  /**
   * Updates administrative fields on feedback submission.
   */
  public static async updateFeedback(
    id: string,
    updates: {
      status?: 'new' | 'in_review' | 'in_progress' | 'resolved' | 'closed';
      priority?: 'low' | 'normal' | 'high' | 'critical';
      admin_notes?: string | null;
      assigned_to?: string | null;
    },
    adminId = 'admin'
  ): Promise<FeedbackRecord> {
    const patch: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.status) {
      patch.status = updates.status;
      if (updates.status === 'resolved' || updates.status === 'closed') {
        patch.resolved_at = new Date().toISOString();
      } else {
        patch.resolved_at = null;
      }
    }
    if (updates.priority) {
      patch.priority = updates.priority;
    }
    if (updates.admin_notes !== undefined) {
      patch.admin_notes = updates.admin_notes;
    }
    if (updates.assigned_to !== undefined) {
      patch.assigned_to = updates.assigned_to;
    }

    const { data, error } = await supabase
      .from('user_feedback')
      .update(patch)
      .eq('id', id)
      .select('*, users(id, phone_number, name)')
      .single();

    if (error) {
      throw new Error(`Failed to update feedback: ${error.message}`);
    }

    // Log admin audit action
    try {
      await supabase.from('admin_audit_logs').insert({
        actor_id: adminId,
        action: 'UPDATE_USER_FEEDBACK',
        entity_type: 'user_feedback',
        entity_id: id,
        details: patch
      });
    } catch (e) {
      console.warn('[FeedbackService] Admin audit log insert notice:', e);
    }

    return data as any;
  }
}
