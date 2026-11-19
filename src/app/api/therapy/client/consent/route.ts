import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { supabase } from '../../../../../lib/db';
import { AdminTherapyRelationshipService } from '../../../../../lib/admin/adminTherapyRelationshipService';

/**
 * GET /api/therapy/client/consent
 *
 * Secure client endpoint to retrieve their authoritative verified legal telehealth & clinical consent document.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const userIds = [authUser.userId];
    try {
      const { data: clientAcc } = await supabase
        .from('therapy_client_accounts')
        .select('id, user_id')
        .or(`id.eq.${authUser.userId},user_id.eq.${authUser.userId}`)
        .maybeSingle();
      if (clientAcc) {
        if (clientAcc.id && !userIds.includes(clientAcc.id)) userIds.push(clientAcc.id);
        if (clientAcc.user_id && !userIds.includes(clientAcc.user_id)) userIds.push(clientAcc.user_id);
      }
    } catch {}

    // Find active or latest care relationship
    const { data: rel, error: relError } = await supabase
      .from('therapy_care_relationships')
      .select('id, user_id, therapist_account_id, status')
      .in('user_id', userIds)
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (relError || !rel) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'No active clinical relationship record found.' } },
        { status: 404 }
      );
    }

    const consentDoc = await AdminTherapyRelationshipService.getConsentDocument(rel.id);

    return NextResponse.json({
      success: true,
      document: consentDoc,
    });
  } catch (err: any) {
    console.error('[Client Consent GET] Error:', err);
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
