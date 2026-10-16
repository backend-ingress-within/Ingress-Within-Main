import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPlatformService } from '../../../../../lib/therapist/therapistPlatformService';

export async function POST(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json().catch(() => ({}));
    const { specificDate, startTime, endTime, reason, isRecurring, dayOfWeek } = body;

    if (!specificDate && dayOfWeek === undefined) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'specificDate or dayOfWeek is required to block time.' } },
        { status: 400 }
      );
    }

    const block = await TherapistPlatformService.createBlockedSlot(account.id, {
      specificDate,
      startTime,
      endTime,
      reason,
      isRecurring,
      dayOfWeek,
    });

    return NextResponse.json({ success: true, block });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'BLOCK_CREATE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json().catch(() => ({}));
    const searchParams = request.nextUrl.searchParams;
    const blockId = body.blockId || searchParams.get('blockId') || searchParams.get('id');

    if (!blockId) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'blockId is required to unblock time.' } },
        { status: 400 }
      );
    }

    await TherapistPlatformService.deleteBlockedSlot(account.id, blockId);

    return NextResponse.json({ success: true, blockId });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'BLOCK_DELETE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
