import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPlatformService } from '../../../../../../lib/therapist/therapistPlatformService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { new_start, new_end, reason } = body;

    if (!new_start || !new_end) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'new_start and new_end are required.' } },
        { status: 400 }
      );
    }

    const updated = await TherapistPlatformService.rescheduleAppointment(
      account.id,
      id,
      new_start,
      new_end,
      reason
    );

    return NextResponse.json({ success: true, appointment: updated });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'RESCHEDULE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
