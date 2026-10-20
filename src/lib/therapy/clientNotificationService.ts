import { supabase } from '../db';

export interface ClientNotification {
  id: string;
  userId: string;
  type: 'session_confirmed' | 'session_rescheduled' | 'session_cancelled' | 'payment_refunded' | 'homework_assigned' | 'homework_reviewed' | 'therapist_matched' | 'email_delivery';
  title: string;
  message: string;
  linkTab: 'sessions' | 'homework' | 'therapist' | 'journey' | 'billing';
  targetId?: string;
  deliveryStatus?: 'delivered' | 'sent' | 'pending' | 'failed';
  isRead: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}

export interface ClientNotificationPreferences {
  smsReminders: boolean;
  whatsappReminders: boolean;
  digestFrequency: 'immediate' | 'daily' | 'weekly' | 'none';
  updatedAt: string;
}

// In-memory read tracking store for notification items (keyed by userId -> Set of notificationIds)
const userReadNotificationIds: Map<string, Set<string>> = new Map();

export class ClientNotificationService {
  /**
   * Generates authoritative client notifications derived directly from the
   * underlying authoritative platform tables:
   * - therapy_session_bookings (session booking, cancellation, refunds)
   * - client_homework_assignments (assigned homework, clinician reviews)
   * - therapy_care_relationships (matching, care stage progression)
   * - email_deliveries (transactional alerts sent to the client)
   * 
   * Security & Privacy Boundary:
   * - Strictly filtered by authenticated userId
   * - Absolutely NO therapist SOAP notes, clinical formulations, or supervision logs exposed
   */
  static async getNotifications(userId: string, userEmail?: string | null): Promise<{
    notifications: ClientNotification[];
    unreadCount: number;
  }> {
    if (!userId) {
      return { notifications: [], unreadCount: 0 };
    }

    const readSet = userReadNotificationIds.get(userId) || new Set<string>();
    const notifications: ClientNotification[] = [];

    // 1. Fetch Session Bookings & Payment/Refund events
    try {
      const { data: bookings } = await supabase
        .from('therapy_session_bookings')
        .select(`
          id,
          booking_reference,
          slot_start,
          booking_status,
          payment_status,
          refund_status,
          refund_amount_paise,
          amount_paise,
          created_at,
          updated_at,
          therapist_accounts (
            therapist_profiles (full_name)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (bookings && bookings.length > 0) {
        for (const b of bookings) {
          const acc = b.therapist_accounts as any;
          const prof = Array.isArray(acc?.therapist_profiles)
            ? acc.therapist_profiles[0]
            : acc?.therapist_profiles;
          const clinicianName = prof?.full_name || 'your clinician';
          const sessionDateStr = new Date(b.slot_start).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          });

          // Session Confirmed notification
          if (b.payment_status === 'paid' || b.payment_status === 'captured') {
            const notifId = `notif_sess_conf_${b.id}`;
            notifications.push({
              id: notifId,
              userId,
              type: 'session_confirmed',
              title: 'Consultation Confirmed',
              message: `Your therapy consultation with ${clinicianName} on ${sessionDateStr} is confirmed.`,
              linkTab: 'sessions',
              targetId: b.id,
              isRead: readSet.has(notifId),
              createdAt: b.created_at,
              metadata: {
                bookingReference: b.booking_reference,
                slotStart: b.slot_start,
                amountRupees: Math.round(b.amount_paise / 100),
              },
            });
          }

          // Session Cancelled notification
          if (b.booking_status === 'cancelled') {
            const notifId = `notif_sess_canc_${b.id}`;
            const refundRupees = b.refund_amount_paise ? Math.round(b.refund_amount_paise / 100) : 0;
            const refundMsg =
              b.refund_status === 'full'
                ? ` A full refund of ₹${refundRupees} has been processed back to your payment account.`
                : b.refund_status === 'partial'
                ? ` A partial refund of ₹${refundRupees} has been processed.`
                : '';

            notifications.push({
              id: notifId,
              userId,
              type: 'session_cancelled',
              title: 'Consultation Cancelled',
              message: `Your consultation on ${sessionDateStr} was cancelled.${refundMsg}`,
              linkTab: 'billing',
              targetId: b.id,
              isRead: readSet.has(notifId),
              createdAt: b.updated_at || b.created_at,
              metadata: {
                bookingReference: b.booking_reference,
                refundStatus: b.refund_status,
                refundRupees,
              },
            });
          }

          // Payment Refunded notification
          if (b.refund_status === 'full' || b.refund_status === 'partial') {
            const notifId = `notif_refund_${b.id}`;
            const refundRupees = b.refund_amount_paise ? Math.round(b.refund_amount_paise / 100) : 0;
            notifications.push({
              id: notifId,
              userId,
              type: 'payment_refunded',
              title: 'Refund Executed',
              message: `A refund of ₹${refundRupees} for booking #${b.booking_reference} has been credited to your original payment method.`,
              linkTab: 'billing',
              targetId: b.id,
              isRead: readSet.has(notifId),
              createdAt: b.updated_at || b.created_at,
              metadata: {
                refundStatus: b.refund_status,
                refundRupees,
              },
            });
          }
        }
      }
    } catch (err) {
      console.warn('[ClientNotificationService] Bookings fetch warning:', err);
    }

    // 2. Fetch Homework & Clinician Feedback events
    try {
      const { data: assignments } = await supabase
        .from('client_homework_assignments')
        .select(`
          id,
          title,
          status,
          due_at,
          reviewed_at,
          created_at,
          updated_at
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (assignments && assignments.length > 0) {
        for (const a of assignments) {
          // New Homework Assigned
          const notifAssignId = `notif_hw_assign_${a.id}`;
          const dueStr = a.due_at
            ? ` Due by ${new Date(a.due_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.`
            : '';
          notifications.push({
            id: notifAssignId,
            userId,
            type: 'homework_assigned',
            title: 'New Clinical Self-Work Assigned',
            message: `Your clinician assigned "${a.title}".${dueStr}`,
            linkTab: 'homework',
            targetId: a.id,
            isRead: readSet.has(notifAssignId),
            createdAt: a.created_at,
            metadata: {
              assignmentTitle: a.title,
              dueAt: a.due_at,
            },
          });

          // Clinician Feedback Reviewed
          if (a.reviewed_at) {
            const notifReviewId = `notif_hw_review_${a.id}`;
            notifications.push({
              id: notifReviewId,
              userId,
              type: 'homework_reviewed',
              title: 'Clinician Feedback Shared',
              message: `Your clinician provided clinical reflections on your self-work: "${a.title}".`,
              linkTab: 'homework',
              targetId: a.id,
              isRead: readSet.has(notifReviewId),
              createdAt: a.reviewed_at,
              metadata: {
                assignmentTitle: a.title,
              },
            });
          }
        }
      }
    } catch (err) {
      console.warn('[ClientNotificationService] Homework fetch warning:', err);
    }

    // 3. Fetch Relationship Care Updates
    try {
      const { data: relationship } = await supabase
        .from('therapy_care_relationships')
        .select(`
          id,
          status,
          care_stage,
          started_at,
          created_at,
          therapist_accounts (
            therapist_profiles (full_name, title)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (relationship) {
        const acc = relationship.therapist_accounts as any;
        const prof = Array.isArray(acc?.therapist_profiles)
          ? acc.therapist_profiles[0]
          : acc?.therapist_profiles;
        const clinicianName = prof?.full_name || 'your assigned therapist';

        if (relationship.status === 'active') {
          const notifRelId = `notif_rel_act_${relationship.id}`;
          notifications.push({
            id: notifRelId,
            userId,
            type: 'therapist_matched',
            title: 'Therapeutic Partnership Active',
            message: `You are connected with ${clinicianName}. Your care journey is currently in the ${relationship.care_stage || 'assessment'} phase.`,
            linkTab: 'therapist',
            targetId: relationship.id,
            isRead: readSet.has(notifRelId),
            createdAt: relationship.started_at || relationship.created_at,
            metadata: {
              careStage: relationship.care_stage,
              clinicianName,
            },
          });
        }
      }
    } catch (err) {
      console.warn('[ClientNotificationService] Relationship fetch warning:', err);
    }

    // 4. Fetch Client Email Deliveries
    try {
      let emailQuery = supabase
        .from('email_deliveries')
        .select(`
          id,
          event_type,
          recipient_email,
          subject,
          body_text,
          entity_type,
          entity_id,
          status,
          created_at
        `)
        .eq('recipient_type', 'client');

      if (userEmail) {
        emailQuery = emailQuery.eq('recipient_email', userEmail.trim().toLowerCase());
      } else {
        emailQuery = emailQuery.eq('recipient_id', userId);
      }

      const { data: deliveries } = await emailQuery
        .order('created_at', { ascending: false })
        .limit(15);

      if (deliveries && deliveries.length > 0) {
        // Collect existing target IDs to prevent duplicate alerts for the same underlying event
        const coveredTargetIds = new Set(notifications.map((n) => n.targetId).filter(Boolean));

        for (const d of deliveries) {
          // If this delivery corresponds to a booking or homework assignment already surfaced, skip duplicate
          if (d.entity_id && coveredTargetIds.has(d.entity_id)) {
            continue;
          }

          // If subject references a session confirmation or cancellation within 5 minutes of a primary booking event
          const isSessionEmail = d.event_type?.startsWith('therapy.session_') || (d.subject && d.subject.toLowerCase().includes('therapy session'));
          if (isSessionEmail && notifications.some((n) => n.type.startsWith('session_') && Math.abs(new Date(n.createdAt).getTime() - new Date(d.created_at).getTime()) < 300000)) {
            continue;
          }

          const notifEmailId = `notif_email_${d.id}`;
          const linkTab: ClientNotification['linkTab'] =
            d.entity_type === 'homework' ? 'homework' : 'sessions';

          notifications.push({
            id: notifEmailId,
            userId,
            type: 'email_delivery',
            title: d.subject || 'Platform Email Update',
            message: d.body_text
              ? d.body_text.slice(0, 160) + (d.body_text.length > 160 ? '...' : '')
              : 'Official therapy delivery update.',
            linkTab,
            targetId: d.entity_id || d.id,
            deliveryStatus: d.status as any,
            isRead: readSet.has(notifEmailId),
            createdAt: d.created_at,
            metadata: {
              eventType: d.event_type,
              deliveryStatus: d.status,
            },
          });
        }
      }
    } catch (err) {
      console.warn('[ClientNotificationService] Email deliveries fetch warning:', err);
    }

    // Sort all combined notifications descending by timestamp
    notifications.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    return { notifications, unreadCount };
  }

  /**
   * Marks a specific notification as read for the authenticated client.
   */
  static markAsRead(userId: string, notificationId: string): { success: boolean; id: string } {
    if (!userId || !notificationId) {
      return { success: false, id: notificationId };
    }
    let readSet = userReadNotificationIds.get(userId);
    if (!readSet) {
      readSet = new Set<string>();
      userReadNotificationIds.set(userId, readSet);
    }
    readSet.add(notificationId);
    return { success: true, id: notificationId };
  }

  /**
   * Marks all notifications as read for the authenticated client.
   */
  static markAllAsRead(userId: string, notificationIds: string[]): { success: boolean; count: number } {
    if (!userId) {
      return { success: false, count: 0 };
    }
    let readSet = userReadNotificationIds.get(userId);
    if (!readSet) {
      readSet = new Set<string>();
      userReadNotificationIds.set(userId, readSet);
    }
    for (const id of notificationIds) {
      readSet.add(id);
    }
    return { success: true, count: notificationIds.length };
  }

  /**
   * Retrieves client notification preferences from the authoritative notification_preferences table.
   */
  static async getPreferences(userId: string): Promise<ClientNotificationPreferences> {
    const defaultPrefs: ClientNotificationPreferences = {
      smsReminders: true,
      whatsappReminders: false,
      digestFrequency: 'daily',
      updatedAt: new Date().toISOString(),
    };

    if (!userId) return defaultPrefs;

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return defaultPrefs;
      }

      return {
        smsReminders: !!data.sms_reminders,
        whatsappReminders: !!data.whatsapp_reminders,
        digestFrequency: (data.digest_frequency as any) || 'daily',
        updatedAt: data.updated_at || new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[ClientNotificationService] getPreferences error:', err);
      return defaultPrefs;
    }
  }

  /**
   * Updates client notification preferences in the authoritative notification_preferences table.
   */
  static async updatePreferences(
    userId: string,
    updates: Partial<ClientNotificationPreferences>
  ): Promise<ClientNotificationPreferences> {
    if (!userId) throw new Error('User ID is required');

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof updates.smsReminders === 'boolean') {
      updatePayload.sms_reminders = updates.smsReminders;
    }
    if (typeof updates.whatsappReminders === 'boolean') {
      updatePayload.whatsapp_reminders = updates.whatsappReminders;
    }
    if (updates.digestFrequency) {
      const validFreqs = ['immediate', 'daily', 'weekly', 'none'];
      if (validFreqs.includes(updates.digestFrequency)) {
        updatePayload.digest_frequency = updates.digestFrequency;
      }
    }

    try {
      // Upsert into notification_preferences
      const { data: existing } = await supabase
        .from('notification_preferences')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('notification_preferences')
          .update(updatePayload)
          .eq('user_id', userId);
      } else {
        await supabase
          .from('notification_preferences')
          .insert({
            user_id: userId,
            sms_reminders: updatePayload.sms_reminders ?? true,
            whatsapp_reminders: updatePayload.whatsapp_reminders ?? false,
            digest_frequency: updatePayload.digest_frequency ?? 'daily',
            updated_at: updatePayload.updated_at,
          });
      }

      return await this.getPreferences(userId);
    } catch (err: any) {
      console.error('[ClientNotificationService] updatePreferences error:', err);
      throw err;
    }
  }
}
