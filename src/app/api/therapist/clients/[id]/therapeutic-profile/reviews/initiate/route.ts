import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../../lib/therapist/therapistAuthHelper';
import { TherapeuticProfileService } from '../../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * POST /api/therapist/clients/[id]/therapeutic-profile/reviews/initiate
 * Therapist initiates a structured periodic review.
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

    const review = await TherapeuticProfileService.initiatePeriodicReview({
      therapistAccountId: account.id,
      relationshipId: rel.id,
      reviewPeriodLabel: body.reviewPeriodLabel,
      sessionsIncluded: body.sessionsIncluded,
      nextReviewDueDate: body.nextReviewDueDate,
    });

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (err: any) {
    console.error('[Therapist Review Initiate POST] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'REVIEW_INITIATE_ERROR',
          message: err.message || 'Failed to initiate review.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
