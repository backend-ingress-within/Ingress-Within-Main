import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapy/client/therapeutic-profile
 * Returns the comprehensive Therapeutic Profile for the authenticated client.
 * Scoped strictly to the active client-therapist relationship.
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
        hasActiveRelationship: false,
        profile: null,
      });
    }

    // 1. Intake
    const intakeData = await TherapeuticProfileService.getRelationshipIntake({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: authUser.userId,
    });

    // 2. Goals
    const goalsData = await TherapeuticProfileService.getRelationshipGoals({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: authUser.userId,
    });

    // 3. Life Events (all client events, private & shared)
    const lifeEvents = await TherapeuticProfileService.getClientLifeEvents(
      authUser.userId,
      rel.id
    );

    // 4. Periodic Reviews (strictly client-visible, no therapist internal clinical notes)
    const reviews = await TherapeuticProfileService.getPeriodicReviews({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: authUser.userId,
    });

    return NextResponse.json({
      success: true,
      hasActiveRelationship: true,
      relationship: {
        id: rel.id,
        status: rel.status,
        careStage: rel.care_stage,
        startedAt: rel.started_at,
        endedAt: rel.ended_at,
        therapistAccountId: rel.therapist_account_id,
      },
      intake: intakeData,
      goals: goalsData,
      lifeEvents,
      reviews,
    });
  } catch (err: any) {
    console.error('[Client Therapeutic Profile GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'THERAPEUTIC_PROFILE_ERROR',
          message: err.message || 'Failed to retrieve therapeutic profile.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
