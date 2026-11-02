import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../../lib/therapist/therapistAuthHelper';
import { TherapeuticProfileService } from '../../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * PATCH /api/therapist/clients/[id]/therapeutic-profile/intake/clarify
 * Therapist flags questions for clarification or marks intake reviewed.
 */
export async function PATCH(
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

    const result = await TherapeuticProfileService.setTherapistIntakeClarification({
      therapistAccountId: account.id,
      relationshipId: rel.id,
      clarificationFlags: body.clarificationFlags,
      markReviewed: Boolean(body.markReviewed),
    });

    return NextResponse.json({
      ...result,
    });
  } catch (err: any) {
    console.error('[Therapist Intake Clarify PATCH] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'INTAKE_CLARIFICATION_ERROR',
          message: err.message || 'Failed to update intake clarification.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
