import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { getInMemoryManualReviews } from '../../../../../lib/therapy/conversationalIntakeService';
import { assignTherapistToClient } from '../../../../../lib/admin/adminManualMatchService';
import { supabase } from '../../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * PATCH /api/admin/manual-matching-reviews/[id]
 * ============================================
 * Updates review status, notes, or manually assigns an available verified therapist.
 * Creates an authoritative single match or directly connects the care relationship.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuthorizedAdmin(request);
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const {
      reviewStatus,
      internalNotes,
      identifiedTherapistId,
      assignedReviewerName,
      connectDirectly,
    } = body;

    const VALID_STATUSES = [
      'manual_review_required',
      'under_review',
      'therapist_identified',
      'awaiting_therapist_acceptance',
      'client_contacted',
      'resolved',
      'closed',
    ];

    let targetStatus = reviewStatus;
    if (connectDirectly) {
      targetStatus = 'resolved';
    } else if (identifiedTherapistId && (!targetStatus || targetStatus === 'manual_review_required')) {
      targetStatus = 'awaiting_therapist_acceptance';
    }

    if (targetStatus && !VALID_STATUSES.includes(targetStatus)) {
      return NextResponse.json(
        { error: { code: 'INVALID_STATUS', message: `Invalid reviewStatus: ${targetStatus}` } },
        { status: 400 }
      );
    }

    // 1. Fetch existing review to extract client context
    let clientUserId: string | null = null;
    let therapySessionId: string | null = null;
    let clientEmail: string | null = null;
    let clientPhone: string | null = null;

    try {
      const { data: dbReview } = await supabase
        .from('manual_matching_reviews')
        .select('user_id, therapy_session_id, client_preferences')
        .or(`id.eq.${id},reference_id.eq.${id}`)
        .maybeSingle();

      if (dbReview) {
        clientUserId = dbReview.user_id;
        therapySessionId = dbReview.therapy_session_id;
        clientEmail = (dbReview.client_preferences as any)?.email || null;
        clientPhone = (dbReview.client_preferences as any)?.phone || null;
      }
    } catch {
      // Fallback
    }

    // Also check in-memory record
    const memoryReviews = getInMemoryManualReviews();
    const memoryRecord = memoryReviews.find((r) => r.id === id || r.reference_id === id);
    if (memoryRecord) {
      if (!clientUserId) clientUserId = memoryRecord.user_id;
      if (!therapySessionId) therapySessionId = memoryRecord.therapy_session_id || null;
      if (!clientEmail) clientEmail = memoryRecord.client_preferences?.email || null;
      if (!clientPhone) clientPhone = memoryRecord.client_preferences?.phone || null;
    }

    // 2. Delegate therapist validation, match creation, direct relationship activation, & email
    let therapistName = 'Assigned Clinician';
    let createdMatchId: string | null = null;
    let createdRelationshipId: string | null = null;
    let bookingLink: string | null = null;
    let bookingToken: string | null = null;

    if (identifiedTherapistId) {
      const result = await assignTherapistToClient({
        therapistId: identifiedTherapistId,
        clientUserId,
        therapySessionId,
        clientEmail,
        clientPhone,
        connectDirectly: Boolean(connectDirectly),
        source: 'admin_manual_matching_review',
        referenceId: id,
        internalNotes: internalNotes || null,
        admin: {
          adminId: admin.adminId,
          email: admin.email,
          fullName: admin.fullName,
        },
      });
      therapistName = result.therapistName;
      createdMatchId = result.createdMatchId;
      createdRelationshipId = result.createdRelationshipId;
      bookingLink = result.bookingLink || null;
      bookingToken = result.bookingToken || null;
      if (!clientUserId && result.clientUserId) clientUserId = result.clientUserId;

      // Update Lead Pipeline record if client exists in leads
      if (clientUserId || clientEmail || clientPhone) {
        try {
          const filters: string[] = [];
          if (clientEmail) filters.push(`email.eq.${clientEmail}`);
          if (clientPhone) filters.push(`phone_number.eq.${clientPhone}`);
          if (clientUserId) filters.push(`phone_number.eq.${clientUserId}`);
          if (filters.length > 0) {
            await supabase
              .from('therapy_intake_leads')
              .update({
                selected_therapist_id: identifiedTherapistId,
                selected_therapist_name: therapistName,
                follow_up_status: connectDirectly ? 'converted' : 'contacted',
                internal_notes: `Manual match assigned: ${therapistName}. ${internalNotes || ''}`.trim(),
                updated_at: new Date().toISOString(),
              })
              .or(filters.join(','));
          }
        } catch {
          // Continue
        }
      }
    }

    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: identifiedTherapistId
        ? (connectDirectly ? 'therapist_manually_connected' : 'therapist_manually_assigned')
        : 'review_status_updated',
      actor: admin.fullName || admin.email || 'Admin',
      details: identifiedTherapistId
        ? `${connectDirectly ? 'Directly connected' : 'Assigned'} therapist ${therapistName} (${identifiedTherapistId}) with status ${targetStatus || 'awaiting_therapist_acceptance'}. Notes: ${internalNotes || 'None'}`
        : `Updated status to ${targetStatus || 'unchanged'}. Notes: ${internalNotes || 'None'}`,
    };

    if (memoryRecord) {
      if (targetStatus) memoryRecord.review_status = targetStatus as any;
      if (internalNotes !== undefined) memoryRecord.internal_notes = internalNotes;
      if (identifiedTherapistId) memoryRecord.identified_therapist_id = identifiedTherapistId;
      if (assignedReviewerName) memoryRecord.assigned_reviewer_name = assignedReviewerName;
      memoryRecord.assigned_reviewer_id = admin.adminId;
      memoryRecord.audit_trail.push(auditEntry);
      memoryRecord.updated_at = new Date().toISOString();
    }

    // 3. Update Supabase record in manual_matching_reviews
    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (targetStatus) updatePayload.review_status = targetStatus;
      if (internalNotes !== undefined) updatePayload.internal_notes = internalNotes;
      if (identifiedTherapistId) updatePayload.identified_therapist_id = identifiedTherapistId;
      if (assignedReviewerName) updatePayload.assigned_reviewer_name = assignedReviewerName;
      updatePayload.assigned_reviewer_id = admin.adminId;

      await supabase
        .from('manual_matching_reviews')
        .update(updatePayload)
        .or(`id.eq.${id},reference_id.eq.${id}`);
    } catch (dbErr) {
      console.warn('[PATCH /api/admin/manual-matching-reviews/[id]] DB update notice:', dbErr);
    }

    return NextResponse.json({
      success: true,
      id,
      reviewStatus: targetStatus,
      identifiedTherapistId,
      therapistName,
      createdMatchId,
      createdRelationshipId,
      bookingLink,
      bookingToken,
      auditEntry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: error.code || 'UPDATE_ERROR', message: error.message } },
      { status: error.status || 500 }
    );
  }
}
