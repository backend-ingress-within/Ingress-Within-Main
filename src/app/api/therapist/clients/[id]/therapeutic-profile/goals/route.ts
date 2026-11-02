import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../lib/therapist/therapistAuthHelper';
import { TherapeuticProfileService } from '../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * POST /api/therapist/clients/[id]/therapeutic-profile/goals
 * Therapist creates or updates collaborative goal for the client.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const { id } = await params;
    const body = await request.json();

    const rel = await TherapeuticProfileService.resolveRelationship(
      undefined,
      id,
      account.id
    );

    if (!rel || rel.therapist_account_id !== account.id) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED_ACCESS', message: 'Client not assigned to you.' } },
        { status: 403 }
      );
    }

    const goal = await TherapeuticProfileService.createGoal({
      relationshipId: rel.id,
      creatorRole: 'therapist',
      creatorId: account.id,
      title: body.title,
      description: body.description,
      whyItMatters: body.whyItMatters,
      category: body.category,
      targetDate: body.targetDate,
      status: body.status,
      progressPercentage: body.progressPercentage,
      therapistFeedback: body.therapistFeedback,
    });

    return NextResponse.json({
      success: true,
      goal,
    });
  } catch (err: any) {
    console.error('[Therapist Goal POST] Error:', err);
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
