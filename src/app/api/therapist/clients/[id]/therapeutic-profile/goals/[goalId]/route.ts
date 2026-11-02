import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../../lib/therapist/therapistAuthHelper';
import { TherapeuticProfileService } from '../../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * PATCH /api/therapist/clients/[id]/therapeutic-profile/goals/[goalId]
 * Therapist updates a goal (collaborative feedback, status, progress).
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; goalId: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const { id, goalId } = await params;
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

    const updated = await TherapeuticProfileService.updateGoal({
      relationshipId: rel.id,
      goalId,
      updaterRole: 'therapist',
      updaterId: account.id,
      updates: body.updates || body,
      changeReason: body.changeReason || 'Therapist updated goal',
    });

    return NextResponse.json({
      success: true,
      goal: updated,
    });
  } catch (err: any) {
    console.error('[Therapist Goal PATCH] Error:', err);
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
