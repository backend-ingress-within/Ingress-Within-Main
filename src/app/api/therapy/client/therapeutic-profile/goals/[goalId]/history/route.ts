import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapy/client/therapeutic-profile/goals/[goalId]/history
 * Retrieves revision audit trail for a goal.
 */
export async function GET(
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
    const rel = await TherapeuticProfileService.resolveRelationship(undefined, authUser.userId);
    if (!rel) {
      return NextResponse.json(
        { error: { code: 'NO_ACTIVE_RELATIONSHIP', message: 'Active relationship not found.' } },
        { status: 400 }
      );
    }

    const history = await TherapeuticProfileService.getGoalHistory({
      relationshipId: rel.id,
      goalId,
      accessorRole: 'client',
      accessorId: authUser.userId,
    });

    return NextResponse.json({
      success: true,
      history,
    });
  } catch (err: any) {
    console.error('[Client Goal History GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'GOAL_HISTORY_ERROR',
          message: err.message || 'Failed to retrieve goal history.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
