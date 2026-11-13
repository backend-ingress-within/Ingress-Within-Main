import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../../lib/auth/adminAuthHelper';
import { LeadPipelineService } from '../../../../../../lib/therapy/leadPipelineService';
import { assignTherapistToClient } from '../../../../../../lib/admin/adminManualMatchService';
import { RelationshipBookingLinkService } from '../../../../../../lib/therapy/relationshipBookingLinkService';
import { supabase } from '../../../../../../lib/db';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/leads/[id]/booking-link
 * Issues or idempotently retrieves the stable persistent booking link for a matched lead.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuthorizedAdmin(request);
    const { id } = await params;

    const lead = await LeadPipelineService.getLeadById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    if (!lead.selected_therapist_id) {
      return NextResponse.json(
        { error: 'No therapist has been assigned to this lead yet.' },
        { status: 400 }
      );
    }

    // 1. Look up existing active care relationship for this client & therapist
    let relationshipId: string | null = null;
    const clientPhone = (lead.phone_number || '').trim();
    const clientEmail = (lead.email || '').trim().toLowerCase();

    // Check by user ID from leads.answers or user lookup
    let userId = lead.answers?.client_user_id || lead.answers?.provisioned_user_id || null;

    if (!userId && (clientPhone || clientEmail)) {
      const { data: u } = await supabase
        .from('users')
        .select('id')
        .or(`phone_number.eq.${clientPhone},email.ilike.${clientEmail}`)
        .limit(1)
        .maybeSingle();
      if (u?.id) userId = u.id;
    }

    if (userId) {
      const { data: rel } = await supabase
        .from('therapy_care_relationships')
        .select('id')
        .eq('user_id', userId)
        .eq('therapist_account_id', lead.selected_therapist_id)
        .eq('status', 'active')
        .maybeSingle();
      if (rel?.id) relationshipId = rel.id;
    }

    // 2. If no relationship exists yet, connect directly
    if (!relationshipId) {
      const assignResult = await assignTherapistToClient({
        therapistId: lead.selected_therapist_id,
        therapySessionId: lead.session_id,
        clientEmail: lead.email,
        clientPhone: lead.phone_number,
        clientName: lead.full_name,
        answers: lead.answers,
        connectDirectly: true,
        source: 'admin_lead_manual_match',
        referenceId: lead.id,
        internalNotes: 'Booking link requested from Admin Lead Pipeline',
        admin: {
          adminId: admin.adminId,
          email: admin.email,
          fullName: admin.fullName,
        },
      });

      relationshipId = assignResult.createdRelationshipId;
      if (assignResult.bookingLink) {
        await LeadPipelineService.assignTherapistToLead(id, {
          therapistId: lead.selected_therapist_id,
          therapistName: assignResult.therapistName,
          bookingLink: assignResult.bookingLink,
          bookingToken: assignResult.bookingToken || undefined,
          clientUserId: assignResult.clientUserId || undefined,
        });

        return NextResponse.json({
          success: true,
          bookingLink: assignResult.bookingLink,
          bookingToken: assignResult.bookingToken,
          therapistName: assignResult.therapistName,
          relationshipId,
        });
      }
    }

    if (!relationshipId) {
      return NextResponse.json(
        { error: 'Unable to establish care relationship for booking link.' },
        { status: 500 }
      );
    }

    // 3. Issue or retrieve active link
    const linkResult = await RelationshipBookingLinkService.issueBookingLink({
      relationshipId,
      actor: {
        actorType: 'admin',
        actorId: admin.adminId,
      },
    });

    await LeadPipelineService.assignTherapistToLead(id, {
      therapistId: lead.selected_therapist_id,
      therapistName: lead.selected_therapist_name || 'Assigned Clinician',
      bookingLink: linkResult.bookingLink,
      bookingToken: linkResult.token,
      clientUserId: userId || undefined,
    });

    return NextResponse.json({
      success: true,
      bookingLink: linkResult.bookingLink,
      bookingToken: linkResult.token,
      therapistName: lead.selected_therapist_name,
      relationshipId,
      isNew: linkResult.isNew,
    });
  } catch (error: any) {
    console.error('[GET /api/admin/leads/[id]/booking-link Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to issue booking link' },
      { status: error?.status || 500 }
    );
  }
}
