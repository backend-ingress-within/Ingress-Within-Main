import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../lib/therapist/therapistAuthHelper';
import { TherapistPlatformService } from '../../../../lib/therapist/therapistPlatformService';

export async function GET(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const clientId = searchParams.get('clientId') || undefined;
    const status = searchParams.get('status') || undefined;

    const appointments = await TherapistPlatformService.getAppointments(account.id, {
      startDate,
      endDate,
      clientId,
      status,
    });

    return NextResponse.json({ success: true, appointments });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'SESSIONS_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json().catch(() => ({}));
    const { user_id, scheduled_start, scheduled_end, session_type, meeting_link, client_notes } = body;

    if (!user_id || !scheduled_start || !scheduled_end) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'user_id, scheduled_start, and scheduled_end are required.' } },
        { status: 400 }
      );
    }

    const appointment = await TherapistPlatformService.createAppointment(account.id, {
      userId: user_id,
      scheduledStart: scheduled_start,
      scheduledEnd: scheduled_end,
      sessionType: session_type,
      meetingLink: meeting_link,
      clientNotes: client_notes,
    });

    return NextResponse.json({ success: true, appointment });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'SESSION_CREATE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
