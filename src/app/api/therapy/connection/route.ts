import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { getClientConnectedTherapist, getClientTherapyDashboardSummary } from '../../../../lib/therapy/therapyService';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication is required.',
          },
        },
        { status: 401 }
      );
    }

    const [connectedTherapist, summary] = await Promise.all([
      getClientConnectedTherapist(authUser.userId),
      getClientTherapyDashboardSummary(authUser.userId),
    ]);

    return NextResponse.json({
      success: true,
      connected: Boolean(connectedTherapist),
      connection: connectedTherapist,
      therapist: connectedTherapist?.therapist || summary.therapist || null,
      connectionStatus: summary.status,
      pendingRequest: summary.pendingRequest,
      history: summary.history,
    });
  } catch (error: any) {
    console.error('[Therapy Connection GET] Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve therapy connection status.',
        },
      },
      { status: 500 }
    );
  }
}
