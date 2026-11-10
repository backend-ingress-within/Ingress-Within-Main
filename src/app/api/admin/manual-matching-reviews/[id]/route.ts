import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { getInMemoryManualReviews } from '../../../../../lib/therapy/conversationalIntakeService';
import { validateEligibleTherapist } from '../../../../../lib/therapy/therapyService';
import { supabase } from '../../../../../lib/db';
import { EmailService } from '../../../../../lib/email/emailService';

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

    let therapistName = 'Assigned Clinician';
    let therapistEmail: string | null = null;

    if (identifiedTherapistId) {
      const val = await validateEligibleTherapist(identifiedTherapistId);
      if (!val.valid) {
        return NextResponse.json(
          { error: { code: 'THERAPIST_NOT_ELIGIBLE', message: 'Assigned therapist is not verified or currently active.' } },
          { status: 409 }
        );
      }

      // Fetch therapist profile for notification and audit
      const { data: thProfile } = await supabase
        .from('therapist_profiles')
        .select('full_name, contact_email')
        .eq('therapist_account_id', identifiedTherapistId)
        .maybeSingle();

      if (thProfile?.full_name) therapistName = thProfile.full_name;
      therapistEmail = thProfile?.contact_email || null;

      if (!therapistEmail) {
        const { data: thApp } = await supabase
          .from('therapist_applications')
          .select('contact_email, answers')
          .eq('therapist_account_id', identifiedTherapistId)
          .maybeSingle();
        therapistEmail = thApp?.contact_email || (thApp?.answers as any)?.contact_email || null;
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

    // 1. Fetch existing review to extract client context
    let clientUserId: string | null = null;
    let therapySessionId: string | null = null;

    try {
      const { data: dbReview } = await supabase
        .from('manual_matching_reviews')
        .select('user_id, therapy_session_id')
        .or(`id.eq.${id},reference_id.eq.${id}`)
        .maybeSingle();

      if (dbReview) {
        clientUserId = dbReview.user_id;
        therapySessionId = dbReview.therapy_session_id;
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

      if (targetStatus) memoryRecord.review_status = targetStatus as any;
      if (internalNotes !== undefined) memoryRecord.internal_notes = internalNotes;
      if (identifiedTherapistId) memoryRecord.identified_therapist_id = identifiedTherapistId;
      if (assignedReviewerName) memoryRecord.assigned_reviewer_name = assignedReviewerName;
      memoryRecord.assigned_reviewer_id = admin.adminId;
      memoryRecord.audit_trail.push(auditEntry);
      memoryRecord.updated_at = new Date().toISOString();
    }

    // 2. Perform Single Clinician Match & Care Relationship Creation
    let createdMatchId: string | null = null;
    let createdRelationshipId: string | null = null;

    if (identifiedTherapistId && clientUserId) {
      // A. Remove any old / stale candidate matches for this user to guarantee exclusivity
      try {
        await supabase
          .from('therapy_matches')
          .delete()
          .eq('user_id', clientUserId)
          .neq('therapist_account_id', identifiedTherapistId);
      } catch (delErr) {
        console.warn('[PATCH Manual Review] Old match cleanup note:', delErr);
      }

      // B. Create / upsert single authoritative match in therapy_matches
      try {
        const { data: matchRecord } = await supabase
          .from('therapy_matches')
          .upsert({
            user_id: clientUserId,
            therapy_session_id: therapySessionId,
            therapist_account_id: identifiedTherapistId,
            match_status: connectDirectly ? 'selected' : 'shortlisted',
            match_rank: 1,
            match_score: 95,
            match_reasons: ['Manually matched by Ingress Within Care Team'],
            matching_metadata: {
              source: 'admin_manual_matching_review',
              reviewId: id,
              assignedBy: admin.fullName || admin.email,
              assignedAt: new Date().toISOString(),
            },
          })
          .select('id')
          .maybeSingle();

        if (matchRecord?.id) {
          createdMatchId = matchRecord.id;
        }
      } catch (matchErr) {
        console.warn('[PATCH Manual Review] therapy_matches upsert note:', matchErr);
      }

      // C. If connectDirectly: create or activate relationship in therapy_care_relationships
      if (connectDirectly) {
        try {
          const { data: relRecord } = await supabase
            .from('therapy_care_relationships')
            .upsert({
              user_id: clientUserId,
              therapist_account_id: identifiedTherapistId,
              therapy_session_id: therapySessionId,
              status: 'active',
              care_stage: 'matched',
              started_at: new Date().toISOString(),
              metadata: {
                source: 'admin_direct_manual_connection',
                assignedBy: admin.fullName || admin.email,
                confirmedAt: new Date().toISOString(),
              },
            })
            .select('id')
            .maybeSingle();

          if (relRecord?.id) {
            createdRelationshipId = relRecord.id;
          }
        } catch (relErr) {
          console.warn('[PATCH Manual Review] therapy_care_relationships creation note:', relErr);
        }
      }

      // D. Dispatch notification email to assigned therapist
      if (therapistEmail && (createdMatchId || connectDirectly)) {
        try {
          await EmailService.notifyTherapistMatchRequest({
            matchId: createdMatchId || `match_${Date.now()}`,
            therapistId: identifiedTherapistId,
            therapistName,
            therapistEmail,
            rank: 1,
            score: 95,
          });
        } catch (emailErr) {
          console.warn('[PATCH Manual Review] Therapist notification email dispatch note:', emailErr);
        }
      }

      // E. Update Lead Pipeline record if client exists in leads
      try {
        await supabase
          .from('therapy_intake_leads')
          .update({
            selected_therapist_id: identifiedTherapistId,
            selected_therapist_name: therapistName,
            follow_up_status: connectDirectly ? 'converted' : 'contacted',
            internal_notes: `Manual match assigned: ${therapistName}. ${internalNotes || ''}`.trim(),
            updated_at: new Date().toISOString(),
          })
          .or(`phone_number.eq.${clientUserId}`);
      } catch {
        // Continue
      }
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
      auditEntry,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: error.code || 'UPDATE_ERROR', message: error.message } },
      { status: error.status || 500 }
    );
  }
}
