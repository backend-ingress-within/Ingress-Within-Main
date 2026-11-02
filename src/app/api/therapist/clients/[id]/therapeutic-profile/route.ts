import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../lib/therapist/therapistAuthHelper';
import { TherapeuticProfileService } from '../../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapist/clients/[id]/therapeutic-profile
 * Authorized therapist retrieves therapeutic profile for their assigned client.
 *
 * Privacy Shield:
 * - Only life events with is_shared_with_therapist = true are returned.
 * - Private client life events are strictly excluded.
 * - Includes therapist's own internal clinical notes for periodic reviews.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const { id } = await params;

    // Resolve relationship for this therapist and client
    const rel = await TherapeuticProfileService.resolveRelationship(
      undefined,
      id,
      account.id
    );

    if (!rel || rel.therapist_account_id !== account.id) {
      return NextResponse.json(
        { error: { code: 'CLIENT_NOT_AUTHORIZED', message: 'Client not in your authorized caseload.' } },
        { status: 403 }
      );
    }

    // 1. Intake & background
    const intake = await TherapeuticProfileService.getRelationshipIntake({
      relationshipId: rel.id,
      accessorRole: 'therapist',
      accessorId: account.id,
    });

    // 2. Collaborative Goals
    const goals = await TherapeuticProfileService.getRelationshipGoals({
      relationshipId: rel.id,
      accessorRole: 'therapist',
      accessorId: account.id,
    });

    // 3. Shared Life Events ONLY (Therapist query MUST NEVER return private events)
    const sharedLifeEvents = await TherapeuticProfileService.getTherapistSharedLifeEvents(
      account.id,
      rel.id
    );

    // 4. Periodic Reviews (includes therapist internal clinical notes)
    const reviews = await TherapeuticProfileService.getPeriodicReviews({
      relationshipId: rel.id,
      accessorRole: 'therapist',
      accessorId: account.id,
    });

    return NextResponse.json({
      success: true,
      relationship: {
        id: rel.id,
        clientId: rel.user_id,
        therapistAccountId: rel.therapist_account_id,
        careStage: rel.care_stage,
        status: rel.status,
        startedAt: rel.started_at,
        endedAt: rel.ended_at,
      },
      intake,
      goals,
      sharedLifeEvents,
      reviews,
    });
  } catch (err: any) {
    console.error('[Therapist Therapeutic Profile GET] Error:', err);
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
