import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * PATCH /api/therapy/client/therapeutic-profile/goals/[goalId]
 * Client updates an existing goal (progress, notes, status, details).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ goalId: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const { goalId } = await params;
    const body = await request.json();
    let { relationshipId, updates, changeReason } = body;

    if (!relationshipId) {
      const rel = await TherapeuticProfileService.resolveRelationship(undefined, authUser.userId);
      if (!rel) {
        return NextResponse.json(
          { error: { code: 'NO_ACTIVE_RELATIONSHIP', message: 'Active relationship not found.' } },
          { status: 400 }
        );
      }
      relationshipId = rel.id;
    }

    const updated = await TherapeuticProfileService.updateGoal({
      relationshipId,
      goalId,
      updaterRole: 'client',
      updaterId: authUser.userId,
      updates: updates || {},
      changeReason: changeReason || 'Client updated goal',
    });

    return NextResponse.json({
      success: true,
      goal: updated,
    });
  } catch (err: any) {
    console.error('[Client Goal PATCH] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'GOAL_UPDATE_ERROR',
          message: err.message || 'Failed to update goal.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
