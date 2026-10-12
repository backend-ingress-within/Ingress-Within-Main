import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../lib/db';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { recordMatchRequest, PersistedMatchRequest } from '../../../../lib/therapy/matchRequestsStore';

/**
 * POST /api/match/request
 * =======================
 * Persists a client's interest in a specific matched therapist.
 * Does not falsely claim the therapist has been notified in real time.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.therapistId) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'therapistId is required.' } },
        { status: 400 }
      );
    }

    const therapistId = String(body.therapistId).trim();
    const answers = body.answers || {};

    let authUserId: string | null = null;
    try {
      const authUser = await getAuthenticatedUser(request);
      if (authUser) authUserId = authUser.userId;
    } catch {}

    const reqId = 'req_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    const createdAt = new Date().toISOString();

    const record: PersistedMatchRequest = {
      id: reqId,
      therapistId,
      userId: authUserId,
      answers,
      status: 'pending',
      createdAt,
    };

    recordMatchRequest(record);

    // Try saving to Supabase if database is available
    try {
      if (authUserId) {
        await supabase.from('therapy_submissions').insert({
          user_id: authUserId,
          submission_type: 'guided',
          submission_status: 'submitted',
          metadata: {
            selectedTherapistAccountId: therapistId,
            requestId: reqId,
            answers,
          },
        });
      }
    } catch {}

    return NextResponse.json(
      {
        id: reqId,
        therapistId,
        createdAt,
        status: 'pending',
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[POST /api/match/request] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to persist match request.' } },
      { status: 500 }
    );
  }
}
