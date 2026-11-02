import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../lib/therapy/therapeuticProfileService';

/**
 * PATCH /api/therapy/client/therapeutic-profile/intake
 * Allows client to update permitted intake responses and preserves version history.
 */
export async function PATCH(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { relationshipId, updates, updateSummary } = body;

    if (!relationshipId) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'relationshipId is required.' } },
        { status: 400 }
      );
    }

    const result = await TherapeuticProfileService.updateClientIntake({
      userId: authUser.userId,
      relationshipId,
      updates: updates || {},
      updateSummary,
    });

    return NextResponse.json({
      ...result,
    });
  } catch (err: any) {
    console.error('[Client Intake PATCH] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'INTAKE_UPDATE_ERROR',
          message: err.message || 'Failed to update intake responses.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
