import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * POST /api/therapy/client/therapeutic-profile/reviews/[reviewId]/submit
 * Client submits their perspective for an initiated periodic review.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const { reviewId } = await params;
    const body = await request.json();

    const updatedReview = await TherapeuticProfileService.submitClientReviewResponse({
      userId: authUser.userId,
      reviewId,
      responses: body || {},
    });

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (err: any) {
    console.error('[Client Review Submit POST] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'REVIEW_SUBMIT_ERROR',
          message: err.message || 'Failed to submit review response.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
