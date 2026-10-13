import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { getClientCareJourney } from '../../../../../lib/therapy/therapyService';

/**
 * GET /api/therapy/client/journey
 * Returns client-safe longitudinal Care Journey for the authenticated user.
 * 
 * Privacy Shield:
 * - NO SOAP notes (subjective, objective, assessment, plan)
 * - NO clinical formulation, risk assessments, or private clinician notes
 * - Strictly longitudinal care stages, timeline milestones, and session attendance metrics.
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

    const journey = await getClientCareJourney(authUser.userId);

    return NextResponse.json({
      success: true,
      journey,
    });
  } catch (err: any) {
    console.error('[Client Journey GET] Error:', err);
    return NextResponse.json(
      { error: { code: 'CLIENT_JOURNEY_ERROR', message: err.message || 'Failed to retrieve care journey' } },
      { status: 500 }
    );
  }
}
