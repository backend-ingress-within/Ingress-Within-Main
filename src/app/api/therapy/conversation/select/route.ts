import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { ConversationalIntakeService } from '../../../../../lib/therapy/conversationalIntakeService';

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { sessionId, therapistId } = body;

    if (!sessionId || !therapistId) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'sessionId and therapistId are required.' } },
        { status: 400 }
      );
    }

    const result = await ConversationalIntakeService.selectTherapist(
      authUser.userId,
      sessionId,
      String(therapistId).trim()
    );

    return NextResponse.json({
      ...result,
    });
  } catch (error: any) {
    console.error('[POST /api/therapy/conversation/select] Error:', error);
    return NextResponse.json(
      { error: { code: 'SELECT_THERAPIST_ERROR', message: error.message || 'Failed to select therapist.' } },
      { status: 400 }
    );
  }
}
