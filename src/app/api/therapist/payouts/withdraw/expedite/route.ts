import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPayoutAccountService } from '../../../../../../lib/therapist/therapistPayoutAccountService';

export async function POST(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);

    const result = await TherapistPayoutAccountService.autoReconcilePendingWithdrawals(account.id);
    const history = await TherapistPayoutAccountService.getWithdrawalHistory(account.id);

    return NextResponse.json({
      success: true,
      message: result.settledCount > 0
        ? `Successfully expedited and settled ${result.settledCount} withdrawal(s).`
        : 'All withdrawals are settled and up to date.',
      settledCount: result.settledCount,
      withdrawals: history,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'EXPEDITE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
