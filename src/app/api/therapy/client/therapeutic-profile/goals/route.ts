import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapy/client/therapeutic-profile/goals
 * Returns active, achieved, and paused goals for the client.
 *
 * POST /api/therapy/client/therapeutic-profile/goals
 * Creates a new collaborative goal proposed by the client.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const rel = await TherapeuticProfileService.resolveRelationship(undefined, authUser.userId);
    if (!rel) {
      return NextResponse.json({
        success: true,
        active: [],
        achieved: [],
        paused: [],
      });
    }

    const goals = await TherapeuticProfileService.getRelationshipGoals({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: authUser.userId,
    });

    return NextResponse.json({
      success: true,
      ...goals,
    });
  } catch (err: any) {
    console.error('[Client Goals GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'GOALS_FETCH_ERROR',
          message: err.message || 'Failed to retrieve goals.',
        },
      },
      { status: err.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { relationshipId, title, description, whyItMatters, category, targetDate, status, progressPercentage, clientNotes } = body;

    if (!relationshipId) {
      const rel = await TherapeuticProfileService.resolveRelationship(undefined, authUser.userId);
      if (!rel) {
        return NextResponse.json(
          { error: { code: 'NO_ACTIVE_RELATIONSHIP', message: 'No active therapy relationship found.' } },
          { status: 400 }
        );
      }
      relationshipId = rel.id;
    }

    const goal = await TherapeuticProfileService.createGoal({
      relationshipId,
      creatorRole: 'client',
      creatorId: authUser.userId,
      title,
      description,
      whyItMatters,
      category,
      targetDate,
      status,
      progressPercentage,
      clientNotes,
    });

    return NextResponse.json({
      success: true,
      goal,
    });
  } catch (err: any) {
    console.error('[Client Goals POST] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'GOAL_CREATE_ERROR',
          message: err.message || 'Failed to create goal.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
