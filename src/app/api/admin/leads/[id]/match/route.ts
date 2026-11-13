import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../../lib/auth/adminAuthHelper';
import { LeadPipelineService } from '../../../../../../lib/therapy/leadPipelineService';
import { assignTherapistToClient, isUuid } from '../../../../../../lib/admin/adminManualMatchService';
import {
  getInMemoryManualReviews,
  recordInMemoryManualReview,
} from '../../../../../../lib/therapy/conversationalIntakeService';
import { supabase } from '../../../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * POST /api/admin/leads/[id]/match
 * =================================
 * Allows Admin to manually match a lead/drop-off client to an eligible verified therapist.
 * Resolves the client's user/session records, updates therapy_matches & (optionally)
 * activates therapy_care_relationships, syncs manual_matching_reviews, and updates the lead.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuthorizedAdmin(request);
    const { id } = await params;

    const body = await request.json().catch(() => ({}));
    const therapistId = typeof body?.therapistId === 'string' ? body.therapistId.trim() : '';
    const connectDirectly = Boolean(body?.connectDirectly);
    const internalNotes = typeof body?.internalNotes === 'string' ? body.internalNotes.trim() : '';

    if (!therapistId) {
      return NextResponse.json(
        { error: 'Please select a therapist to match with this client.' },
        { status: 400 }
      );
    }

    const lead = await LeadPipelineService.getLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    const assignResult = await assignTherapistToClient({
      therapistId,
      therapySessionId: lead.session_id,
      clientEmail: lead.email,
      clientPhone: lead.phone_number,
      clientName: lead.full_name,
      answers: lead.answers,
      connectDirectly,
      source: 'admin_lead_manual_match',
      referenceId: lead.id,
      internalNotes,
      admin: {
        adminId: admin.adminId,
        email: admin.email,
        fullName: admin.fullName,
      },
    });

    const targetReviewStatus = connectDirectly
      ? ('resolved' as const)
      : ('awaiting_therapist_acceptance' as const);
    const reviewNote = `Manual match from Lead Pipeline: Assigned ${assignResult.therapistName}.${internalNotes ? ` Notes: ${internalNotes}` : ''}`;
    const auditEntry = {
      timestamp: new Date().toISOString(),
      action: connectDirectly ? 'lead_therapist_directly_connected' : 'lead_therapist_assigned',
      actor: admin.fullName || admin.email || 'Admin',
      details: reviewNote,
    };

    // Sync or create a manual_matching_reviews audit record if possible
    const sessionUuid = isUuid(assignResult.therapySessionId)
      ? assignResult.therapySessionId
      : isUuid(lead.session_id)
      ? lead.session_id
      : null;

    if (assignResult.clientUserId) {
      try {
        const { data: existingReview } = await supabase
          .from('manual_matching_reviews')
          .select('id, audit_trail')
          .or(
            sessionUuid
              ? `therapy_session_id.eq.${sessionUuid},user_id.eq.${assignResult.clientUserId}`
              : `user_id.eq.${assignResult.clientUserId}`
          )
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (existingReview?.id) {
          const nextTrail = Array.isArray(existingReview.audit_trail)
            ? [...existingReview.audit_trail, auditEntry]
            : [auditEntry];
          await supabase
            .from('manual_matching_reviews')
            .update({
              identified_therapist_id: therapistId,
              review_status: targetReviewStatus,
              assigned_reviewer_id: admin.adminId,
              assigned_reviewer_name: admin.fullName || admin.email || 'Admin',
              internal_notes: internalNotes || lead.internal_notes || reviewNote,
              audit_trail: nextTrail,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingReview.id);
        } else {
          const refId = `LEAD-${Date.now().toString(36).toUpperCase()}`;
          await supabase.from('manual_matching_reviews').insert({
            reference_id: refId,
            user_id: assignResult.clientUserId,
            therapy_session_id: sessionUuid,
            therapy_type: 'Lead Manual Match',
            matching_requirements: {
              language: lead.preferred_language || 'No preference',
              gender_preference: lead.therapist_gender_pref || 'No preference',
              budget: lead.budget || 'Flexible',
              concerns: lead.concerns || [],
              city: lead.answers?.city || null,
            },
            client_preferences: {
              name: lead.full_name || 'Client',
              email: lead.email || null,
              phone: lead.phone_number,
              language: lead.preferred_language || 'No preference',
              gender_preference: lead.therapist_gender_pref || 'No preference',
              concerns: lead.concerns || [],
              city: lead.answers?.city || null,
            },
            no_match_reason:
              lead.drop_off_stage === 'no_matches_found'
                ? 'Automated matching found 0 clinicians; manually matched by Admin from Lead Pipeline.'
                : `Admin manually matched client from Lead Pipeline (${lead.drop_off_stage}).`,
            unmet_criteria: [],
            review_status: targetReviewStatus,
            assigned_reviewer_id: admin.adminId,
            assigned_reviewer_name: admin.fullName || admin.email || 'Admin',
            identified_therapist_id: therapistId,
            internal_notes: internalNotes || reviewNote,
            audit_trail: [auditEntry],
          });
        }
      } catch (revErr) {
        console.warn('[POST /api/admin/leads/[id]/match] Review sync note:', revErr);
      }
    }

    // Keep in-memory review mirror updated as well
    const memReviews = getInMemoryManualReviews();
    const existingMem = memReviews.find(
      (r) =>
        (sessionUuid && r.therapy_session_id === sessionUuid) ||
        (lead.email && r.client_preferences?.email === lead.email)
    );
    if (existingMem) {
      existingMem.identified_therapist_id = therapistId;
      existingMem.review_status = targetReviewStatus;
      existingMem.internal_notes = internalNotes || reviewNote;
      existingMem.audit_trail.push(auditEntry);
      existingMem.updated_at = new Date().toISOString();
    } else if (assignResult.clientUserId) {
      recordInMemoryManualReview({
        id: crypto.randomUUID(),
        reference_id: `LEAD-${Date.now().toString(36).toUpperCase()}`,
        user_id: assignResult.clientUserId,
        therapy_session_id: sessionUuid,
        therapy_type: 'Lead Manual Match',
        matching_requirements: {
          language: lead.preferred_language || 'No preference',
          gender_preference: lead.therapist_gender_pref || 'No preference',
          budget: lead.budget || 'Flexible',
          concerns: lead.concerns || [],
          city: lead.answers?.city || null,
        },
        client_preferences: {
          name: lead.full_name || 'Client',
          email: lead.email || null,
          phone: lead.phone_number,
        },
        no_match_reason: `Admin manually matched from Lead Pipeline (${lead.drop_off_stage}).`,
        unmet_criteria: [],
        review_status: targetReviewStatus,
        assigned_reviewer_id: admin.adminId,
        assigned_reviewer_name: admin.fullName || admin.email || 'Admin',
        identified_therapist_id: therapistId,
        internal_notes: internalNotes || reviewNote,
        audit_trail: [auditEntry],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Build updated lead notes without clobbering prior notes
    const bookingNote = assignResult.bookingLink ? ` Booking link: ${assignResult.bookingLink}` : '';
    const combinedNotes = internalNotes
      ? `${internalNotes}${bookingNote}`
      : lead.internal_notes
      ? `${lead.internal_notes}\n${reviewNote}${bookingNote}`
      : `${reviewNote}${bookingNote}`;

    const updatedLead = await LeadPipelineService.assignTherapistToLead(id, {
      therapistId,
      therapistName: assignResult.therapistName,
      followUpStatus: connectDirectly ? 'converted' : 'contacted',
      internalNotes: combinedNotes,
      isCompleted: connectDirectly ? true : lead.is_completed,
      bookingLink: assignResult.bookingLink || undefined,
      bookingToken: assignResult.bookingToken || undefined,
      clientUserId: assignResult.clientUserId || undefined,
    });

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      therapistName: assignResult.therapistName,
      clientUserLinked: Boolean(assignResult.clientUserId),
      createdMatchId: assignResult.createdMatchId,
      createdRelationshipId: assignResult.createdRelationshipId,
      bookingLink: assignResult.bookingLink,
      bookingToken: assignResult.bookingToken,
      clientUserId: assignResult.clientUserId,
    });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403 || error?.status === 409) {
      return NextResponse.json(
        { error: error.message || 'Unable to manually match lead' },
        { status: error.status }
      );
    }
    console.error('[POST /api/admin/leads/[id]/match Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to manually match lead with therapist' },
      { status: 500 }
    );
  }
}
