import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../../lib/auth-helper';
import { TherapeuticProfileService } from '../../../../../../../lib/therapy/therapeuticProfileService';

/**
 * PATCH /api/therapy/client/therapeutic-profile/life-events/[eventId]
 * Allows client to update their life event (including sharing toggle).
 *
 * DELETE /api/therapy/client/therapeutic-profile/life-events/[eventId]
 * Allows client to delete their life event.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const { eventId } = await params;
    const body = await request.json();

    const updated = await TherapeuticProfileService.updateLifeEvent({
      userId: authUser.userId,
      eventId,
      updates: body || {},
    });

    return NextResponse.json({
      success: true,
      event: updated,
    });
  } catch (err: any) {
    console.error('[Client Life Event PATCH] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'LIFE_EVENT_UPDATE_ERROR',
          message: err.message || 'Failed to update life event.',
        },
      },
      { status: err.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ eventId: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const { eventId } = await params;
    await TherapeuticProfileService.deleteLifeEvent(authUser.userId, eventId);

    return NextResponse.json({
      success: true,
      message: 'Life event deleted.',
    });
  } catch (err: any) {
    console.error('[Client Life Event DELETE] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'LIFE_EVENT_DELETE_ERROR',
          message: err.message || 'Failed to delete life event.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
