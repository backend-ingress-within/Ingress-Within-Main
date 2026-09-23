import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../lib/therapist/therapistAuthHelper';
import { TherapistPlatformService } from '../../../../lib/therapist/therapistPlatformService';

export async function GET(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const earnings = await TherapistPlatformService.getEarningsSummary(account.id);
    return NextResponse.json({ success: true, ...earnings });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'EARNINGS_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
