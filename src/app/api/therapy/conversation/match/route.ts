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
    const { sessionId, answers } = body;

    if (!sessionId || !answers || typeof answers !== 'object') {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'sessionId and answers are required.' } },
        { status: 400 }
      );
    }

    const outcome = await ConversationalIntakeService.evaluateMatching(
      authUser.userId,
      sessionId,
      answers
    );

    return NextResponse.json({
      success: true,
      ...outcome,
    });
  } catch (error: any) {
    console.error('[POST /api/therapy/conversation/match] Error:', error);
    return NextResponse.json(
      { error: { code: 'MATCH_EVALUATION_ERROR', message: error.message || 'Failed to evaluate therapist matches.' } },
      { status: 500 }
    );
  }
}
