import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../lib/therapist/therapistAuthHelper';
import { supabase } from '../../../../../../lib/db';
import { AdminTherapyRelationshipService } from '../../../../../../lib/admin/adminTherapyRelationshipService';

/**
 * GET /api/therapist/clients/[id]/consent
 *
 * Secure clinical practitioner endpoint to retrieve the authoritative verified legal consent document
 * record for a client in the therapist's caseload. Tenancy strictly restricted to the assigned practitioner.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const resolvedParams = await params;
    const clientId = resolvedParams.id;

    if (!clientId) {
      return NextResponse.json(
        { error: { code: 'INVALID_ID', message: 'Client ID or Relationship ID is required.' } },
        { status: 400 }
      );
    }

    // Verify clinical tenancy: relationship belongs to this therapist
    const { data: rel, error: relError } = await supabase
      .from('therapy_care_relationships')
      .select('id, user_id, therapist_account_id')
      .eq('therapist_account_id', account.id)
      .or(`id.eq.${clientId},user_id.eq.${clientId}`)
      .limit(1)
      .maybeSingle();

    if (relError || !rel) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Client not found in your clinical care roster.' } },
        { status: 404 }
      );
    }

    // Fetch verified legal consent document record
    const consentDoc = await AdminTherapyRelationshipService.getConsentDocument(rel.id);

    return NextResponse.json({
      success: true,
      document: consentDoc,
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: err.code || 'CONSENT_DOCUMENT_ERROR',
          message: err.message || 'Failed to retrieve legal consent document.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
