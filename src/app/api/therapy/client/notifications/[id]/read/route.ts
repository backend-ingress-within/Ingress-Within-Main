import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../../lib/auth-helper';
import { ClientNotificationService } from '../../../../../../../lib/therapy/clientNotificationService';

/**
 * POST /api/therapy/client/notifications/[id]/read
 * Marks a specific notification as read for the authenticated client.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: { code: 'INVALID_ID', message: 'Notification ID is required.' } },
        { status: 400 }
      );
    }

    const result = ClientNotificationService.markAsRead(authUser.userId, id);

    return NextResponse.json({
      success: true,
      notificationId: result.id,
      readAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('[Client Notification Read POST] Error:', err);
    return NextResponse.json(
      { error: { code: 'MARK_READ_ERROR', message: err.message || 'Failed to mark notification as read' } },
      { status: 500 }
    );
  }
}
