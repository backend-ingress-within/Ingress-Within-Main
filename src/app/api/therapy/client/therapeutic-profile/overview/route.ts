import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapy/client/therapeutic-profile/overview
 * Returns compact Therapeutic Profile summary for the Client Portal Overview card.
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

    const overview = await TherapeuticProfileService.getTherapeuticProfileOverview(authUser.userId);

    return NextResponse.json({
      success: true,
      overview,
    });
  } catch (err: any) {
    console.error('[Client Profile Overview GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'PROFILE_OVERVIEW_ERROR',
          message: err.message || 'Failed to retrieve profile overview.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
