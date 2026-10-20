import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { ClientNotificationService } from '../../../../../../lib/therapy/clientNotificationService';

/**
 * GET /api/therapy/client/notifications/preferences
 * Retrieves notification preferences from the authoritative notification_preferences table.
 * 
 * PUT /api/therapy/client/notifications/preferences
 * Updates client notification preferences (SMS, WhatsApp, digest frequency).
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

    const preferences = await ClientNotificationService.getPreferences(authUser.userId);

    return NextResponse.json({
      success: true,
      preferences,
    });
  } catch (err: any) {
    console.error('[Client Notification Preferences GET] Error:', err);
    return NextResponse.json(
      { error: { code: 'PREFERENCES_GET_ERROR', message: err.message || 'Failed to retrieve notification preferences' } },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const updated = await ClientNotificationService.updatePreferences(authUser.userId, {
      smsReminders: typeof body.smsReminders === 'boolean' ? body.smsReminders : undefined,
      whatsappReminders: typeof body.whatsappReminders === 'boolean' ? body.whatsappReminders : undefined,
      digestFrequency: body.digestFrequency,
    });

    return NextResponse.json({
      success: true,
      preferences: updated,
    });
  } catch (err: any) {
    console.error('[Client Notification Preferences PUT] Error:', err);
    return NextResponse.json(
      { error: { code: 'PREFERENCES_UPDATE_ERROR', message: err.message || 'Failed to update notification preferences' } },
      { status: 500 }
    );
  }
}
