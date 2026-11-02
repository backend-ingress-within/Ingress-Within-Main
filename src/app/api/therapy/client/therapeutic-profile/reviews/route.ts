import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapy/client/therapeutic-profile/reviews
 * Returns periodic reviews for the client.
 * PRIVACY: Internal clinical notes are strictly stripped.
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
        reviews: [],
      });
    }

    const reviews = await TherapeuticProfileService.getPeriodicReviews({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: authUser.userId,
    });

    return NextResponse.json({
      success: true,
      reviews,
    });
  } catch (err: any) {
    console.error('[Client Reviews GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'REVIEWS_FETCH_ERROR',
          message: err.message || 'Failed to retrieve periodic reviews.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
