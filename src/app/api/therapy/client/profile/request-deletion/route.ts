import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { supabase } from '../../../../../../lib/db';
import { THERAPY_CLIENT_COOKIE_NAME } from '../../../../../../lib/therapy/therapyClientAuthService';

/**
 * POST /api/therapy/client/profile/request-deletion
 *
 * Allows a client to request deletion of their client profile and portal access.
 *
 * STATUTORY CLINICAL RECORD COMPLIANCE:
 * Client profile login and authentication credentials are closed / marked inactive.
 * In accordance with healthcare standards and psychological legal requirements,
 * clinical session appointments, therapist SOAP notes, and telehealth consents on the
 * therapist side remain permanently archived in the clinician's confidential records.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { reason, confirm } = body;

    if (!confirm) {
      return NextResponse.json(
        { error: { code: 'CONFIRMATION_REQUIRED', message: 'Please confirm profile deletion request.' } },
        { status: 400 }
      );
    }

    const nowIso = new Date().toISOString();
    const userIds = [authUser.userId];

    // Find client account
    const { data: clientAcc } = await supabase
      .from('therapy_client_accounts')
      .select('id, user_id, metadata, status')
      .or(`id.eq.${authUser.userId},user_id.eq.${authUser.userId}`)
      .maybeSingle();

    if (clientAcc) {
      if (clientAcc.id && !userIds.includes(clientAcc.id)) userIds.push(clientAcc.id);
      if (clientAcc.user_id && !userIds.includes(clientAcc.user_id)) userIds.push(clientAcc.user_id);

      const currentMeta = clientAcc.metadata || {};
      await supabase
        .from('therapy_client_accounts')
        .update({
          status: 'deletion_requested',
          updated_at: nowIso,
          metadata: {
            ...currentMeta,
            deletion_requested_at: nowIso,
            deletion_reason: reason || 'Client requested profile deletion',
            therapist_records_permanently_preserved: true,
          },
        })
        .eq('id', clientAcc.id);
    }

    // Also update users table metadata if exists
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('id, metadata')
        .in('id', userIds)
        .maybeSingle();

      if (userRow) {
        const uMeta = (userRow.metadata as any) || {};
        await supabase
          .from('users')
          .update({
            metadata: {
              ...uMeta,
              therapy_profile_deleted: true,
              therapy_profile_deleted_at: nowIso,
              deletion_reason: reason || null,
            },
          })
          .eq('id', userRow.id);
      }
    } catch {}

    const response = NextResponse.json({
      success: true,
      message: 'Your profile deletion request has been processed. Your portal login has been deactivated. Clinical documentation and SOAP notes on your therapist\'s side remain permanently archived in compliance with medical record regulations.',
    });

    // Clear client session cookie
    response.cookies.set({
      name: THERAPY_CLIENT_COOKIE_NAME,
      value: '',
      maxAge: 0,
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('[Client Profile Deletion Request] Error:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to process profile deletion request.' } },
      { status: 500 }
    );
  }
}
