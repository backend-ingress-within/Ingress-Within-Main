import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { ClientNotificationService } from '../../../../../lib/therapy/clientNotificationService';

/**
 * GET /api/therapy/client/notifications
 * Retrieves client-scoped notifications:
 * - Consultation confirmations, cancellations, and refunds
 * - Clinical self-work assignments and clinician review feedback
 * - Care relationship milestone updates
 * - Official delivery records
 * 
 * Security Boundary:
 * - Strictly authorized for authUser.userId
 * - Zero access to therapist-private clinical SOAP notes, formulations, or supervisor logs
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

    const { notifications, unreadCount } = await ClientNotificationService.getNotifications(
      authUser.userId
    );

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (err: any) {
    console.error('[Client Notifications GET] Error:', err);
    return NextResponse.json(
      { error: { code: 'CLIENT_NOTIFICATIONS_ERROR', message: err.message || 'Failed to retrieve notifications' } },
      { status: 500 }
    );
  }
}
