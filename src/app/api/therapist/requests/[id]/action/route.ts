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
    const { action } = body;

    if (action !== 'accept' && action !== 'decline') {
      return NextResponse.json(
        { error: { code: 'INVALID_ACTION', message: "Action must be 'accept' or 'decline'." } },
        { status: 400 }
      );
    }

    const result = await TherapistPlatformService.handleRequestAction(
      account.id,
      id,
      action
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'REQUEST_ACTION_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
