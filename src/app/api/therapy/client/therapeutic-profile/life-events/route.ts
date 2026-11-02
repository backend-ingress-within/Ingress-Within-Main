import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../lib/therapy/therapeuticProfileService';

/**
 * GET /api/therapy/client/therapeutic-profile/life-events
 * Returns client's personal life events timeline (both private and shared with therapist).
 *
 * POST /api/therapy/client/therapeutic-profile/life-events
 * Creates a new personal life event.
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

    const events = await TherapeuticProfileService.getClientLifeEvents(authUser.userId);

    return NextResponse.json({
      success: true,
      events,
    });
  } catch (err: any) {
    console.error('[Client Life Events GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'LIFE_EVENTS_ERROR',
          message: err.message || 'Failed to retrieve life events.',
        },
      },
      { status: err.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json();
    let { relationshipId, title, category, eventDate, description, emotionalImpact, discussInSession, isSharedWithTherapist } = body;

    if (!relationshipId) {
      const rel = await TherapeuticProfileService.resolveRelationship(undefined, authUser.userId);
      if (!rel) {
        return NextResponse.json(
          { error: { code: 'NO_ACTIVE_RELATIONSHIP', message: 'Active relationship not found.' } },
          { status: 400 }
        );
      }
      relationshipId = rel.id;
    }

    const event = await TherapeuticProfileService.createLifeEvent({
      userId: authUser.userId,
      relationshipId,
      title,
      category,
      eventDate,
      description,
      emotionalImpact,
      discussInSession,
      isSharedWithTherapist,
    });

    return NextResponse.json({
      success: true,
      event,
    });
  } catch (err: any) {
    console.error('[Client Life Events POST] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'LIFE_EVENT_CREATE_ERROR',
          message: err.message || 'Failed to create life event.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
