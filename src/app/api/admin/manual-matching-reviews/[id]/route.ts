import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { getInMemoryManualReviews } from '../../../../../lib/therapy/conversationalIntakeService';
import { validateEligibleTherapist } from '../../../../../lib/therapy/therapyService';
import { supabase } from '../../../../../lib/db';

/**
 * PATCH /api/admin/manual-matching-reviews/[id]
 * ============================================
 * Updates the review status, internal notes, assigned reviewer, or manually
 * assigns a vetted therapist. Enforces single-clinician workflow with zero broadcasts.
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

    if (reviewStatus && !VALID_STATUSES.includes(reviewStatus)) {
      return NextResponse.json(
        { error: { code: 'INVALID_STATUS', message: `Invalid reviewStatus: ${reviewStatus}` } },
        { status: 400 }
      );
    }

    if (identifiedTherapistId) {
      const val = await validateEligibleTherapist(identifiedTherapistId);
      if (!val.valid) {
        return NextResponse.json(
          { error: { code: 'THERAPIST_NOT_ELIGIBLE', message: 'Assigned therapist is not verified or active.' } },
          { status: 409 }
        );
      }
    }

    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: identifiedTherapistId ? 'therapist_manually_assigned' : 'review_status_updated',
      actor: admin.fullName || admin.email || 'Admin',
      details: identifiedTherapistId
        ? `Manually assigned therapist ${identifiedTherapistId} with status ${reviewStatus || 'therapist_identified'}`
        : `Updated status to ${reviewStatus || 'unchanged'}. Notes: ${internalNotes || 'none'}`,
    };

    // 1. Update in-memory record
    const memoryReviews = getInMemoryManualReviews();
    const memoryRecord = memoryReviews.find((r) => r.id === id || r.reference_id === id);
    if (memoryRecord) {
      if (reviewStatus) memoryRecord.review_status = reviewStatus;
      if (internalNotes !== undefined) memoryRecord.internal_notes = internalNotes;
      if (identifiedTherapistId) memoryRecord.identified_therapist_id = identifiedTherapistId;
      if (assignedReviewerName) memoryRecord.assigned_reviewer_name = assignedReviewerName;
      memoryRecord.assigned_reviewer_id = admin.adminId;
      memoryRecord.audit_trail.push(auditEntry);
      memoryRecord.updated_at = new Date().toISOString();
    }

    // 2. Update Supabase record
    try {
      const updatePayload: Record<string, any> = {
        updated_at: new Date().toISOString(),
      };
      if (reviewStatus) updatePayload.review_status = reviewStatus;
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
      reviewStatus,
      identifiedTherapistId,
      auditEntry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: error.code || 'UPDATE_ERROR', message: error.message } },
      { status: error.status || 500 }
    );
  }
}
