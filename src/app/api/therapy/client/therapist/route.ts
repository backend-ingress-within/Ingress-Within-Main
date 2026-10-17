import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { getClientConnectedTherapist, getClientTherapyDashboardSummary } from '../../../../../lib/therapy/therapyService';

/**
 * GET /api/therapy/client/therapist
 * Step 3: My Therapist client endpoint.
 *
 * Strict Privacy & Security Invariants:
 * 1. Derives client identity strictly from authenticated session (no client-supplied ID).
 * 2. Enforces relationship ownership on the server.
 * 3. Returns only client-safe public profile fields (credentials, specializations, bio, languages).
 * 4. Strictly excludes internal SOAP notes, formulations, risk assessments, or supervisory notes.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication is required to view therapist details.',
          },
        },
        { status: 401 }
      );
    }

    const [connectedTherapist, summary] = await Promise.all([
      getClientConnectedTherapist(authUser.userId),
      getClientTherapyDashboardSummary(authUser.userId),
    ]);

    return NextResponse.json({
      success: true,
      status: summary.status,
      connected: Boolean(connectedTherapist),
      relationship: connectedTherapist || summary.connection || null,
      therapist: connectedTherapist?.therapist || summary.therapist || null,
      pendingRequest: summary.pendingRequest || null,
      history: summary.history || [],
    });
  } catch (error: any) {
    console.error('[Client Therapist GET] Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve therapist relationship details.',
        },
      },
      { status: 500 }
    );
  }
}
