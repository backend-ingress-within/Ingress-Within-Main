import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { ConversationalIntakeService } from '../../../../../lib/therapy/conversationalIntakeService';
import { CONVERSATIONAL_QUESTIONS } from '../../../../../lib/therapy/conversationalIntakeConfig';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const sessionState = await ConversationalIntakeService.startOrResume(authUser.userId);

    return NextResponse.json({
      success: true,
      ...sessionState,
      questions: CONVERSATIONAL_QUESTIONS,
    });
  } catch (error: any) {
    console.error('[GET /api/therapy/conversation/session] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to load conversation session.' } },
      { status: 500 }
    );
  }
}

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
    const { sessionId, questionId, answerValue, currentAnswers } = body;

    if (!sessionId || !questionId) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'sessionId and questionId are required.' } },
        { status: 400 }
      );
    }

    const result = await ConversationalIntakeService.saveResponse(
      authUser.userId,
      sessionId,
      questionId,
      answerValue,
      currentAnswers || {}
    );

    return NextResponse.json({
      ...result,
    });
  } catch (error: any) {
    console.error('[POST /api/therapy/conversation/session] Error:', error);
    return NextResponse.json(
      { error: { code: 'SAVE_RESPONSE_ERROR', message: error.message || 'Failed to save question response.' } },
      { status: 400 }
    );
  }
}
