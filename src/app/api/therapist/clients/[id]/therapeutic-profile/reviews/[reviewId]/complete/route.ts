import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../../../lib/therapist/therapistAuthHelper';
import { TherapeuticProfileService } from '../../../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * POST /api/therapist/clients/[id]/therapeutic-profile/reviews/[reviewId]/complete
 * Therapist completes periodic review:
 * - Records collaborative client-visible feedback.
 * - Stores therapist-only internal clinical notes (strictly isolated).
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; reviewId: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const { id, reviewId } = await params;
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

    const updatedReview = await TherapeuticProfileService.completePeriodicReview({
      therapistAccountId: account.id,
      reviewId,
      feedback: body.feedback || {},
      internalClinicalNotes: body.internalClinicalNotes,
    });

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (err: any) {
    console.error('[Therapist Review Complete POST] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'REVIEW_COMPLETE_ERROR',
          message: err.message || 'Failed to complete review.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
