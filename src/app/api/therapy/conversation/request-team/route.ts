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
    const { sessionId, notes } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'sessionId is required.' } },
        { status: 400 }
      );
    }

    const result = await ConversationalIntakeService.requestTeamAssistance(
      authUser.userId,
      sessionId,
      notes
    );

    return NextResponse.json({
      ...result,
    });
  } catch (error: any) {
    console.error('[POST /api/therapy/conversation/request-team] Error:', error);
    return NextResponse.json(
      { error: { code: 'REQUEST_TEAM_ERROR', message: error.message || 'Failed to request team assistance.' } },
      { status: 500 }
    );
  }
}
