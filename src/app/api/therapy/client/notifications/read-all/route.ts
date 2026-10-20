import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { ClientNotificationService } from '../../../../../../lib/therapy/clientNotificationService';

/**
 * POST /api/therapy/client/notifications/read-all
 * Marks all notifications as read for the authenticated client.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const notificationIds: string[] = Array.isArray(body?.notificationIds) ? body.notificationIds : [];

    const result = ClientNotificationService.markAllAsRead(authUser.userId, notificationIds);

    return NextResponse.json({
      success: true,
      markedCount: result.count,
    });
  } catch (err: any) {
    console.error('[Client Notifications Read-All POST] Error:', err);
    return NextResponse.json(
      { error: { code: 'MARK_ALL_READ_ERROR', message: err.message || 'Failed to mark notifications as read' } },
      { status: 500 }
    );
  }
}
