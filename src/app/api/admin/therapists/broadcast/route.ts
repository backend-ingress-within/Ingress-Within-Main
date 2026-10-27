import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { AdminPlatformService } from '../../../../../lib/admin/adminPlatformService';

/**
 * GET /api/admin/therapists/broadcast
 * Returns summary of active therapists eligible for bulk email broadcast from contactus@ingresswithin.com.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const summary = await AdminPlatformService.getActiveTherapistsForBroadcast();

    return NextResponse.json({
      success: true,
      totalActiveAccounts: summary.totalActiveAccounts,
      totalEligibleTherapists: summary.therapists.length,
      unreachableCount: summary.unreachableCount,
      sender: 'contactus@ingresswithin.com',
      therapists: summary.therapists.map((t) => ({
        therapistId: t.therapistId,
        name: t.name,
        email: t.email,
      })),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'BROADCAST_QUERY_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

/**
 * POST /api/admin/therapists/broadcast
 * Sends bulk email broadcast to all active therapists.
 * Sender is strictly verified as contactus@ingresswithin.com.
 */
export async function POST(request: NextRequest) {
  try {
    const adminSession = await requireAuthorizedAdmin(request);

    let body: any = {};
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: { code: 'INVALID_JSON_BODY', message: 'Request body must be valid JSON.' } },
        { status: 400 }
      );
    }

    const { subject, message, msg } = body;
    const content = message || msg;

    if (!subject || typeof subject !== 'string' || !subject.trim()) {
      return NextResponse.json(
        { error: { code: 'SUBJECT_REQUIRED', message: 'Email subject is required.' } },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json(
        { error: { code: 'MESSAGE_REQUIRED', message: 'Email message content is required.' } },
        { status: 400 }
      );
    }

    const result = await AdminPlatformService.broadcastEmailToActiveTherapists({
      adminId: adminSession.adminId,
      adminEmail: adminSession.email,
      subject: subject.trim(),
      message: content.trim(),
    });

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'BROADCAST_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
