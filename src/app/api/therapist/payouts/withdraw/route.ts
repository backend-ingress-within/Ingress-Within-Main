import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPayoutAccountService } from '../../../../../lib/therapist/therapistPayoutAccountService';

export async function GET(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);

    // Auto-reconcile / expedite any pending or processing withdrawals to prevent delays
    await TherapistPayoutAccountService.autoReconcilePendingWithdrawals(account.id);

    const history = await TherapistPayoutAccountService.getWithdrawalHistory(account.id);

    return NextResponse.json({
      success: true,
      withdrawals: history,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'UNAUTHORIZED', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json();

    const { payoutAccountId, amount, idempotencyKey, quick = true } = body;

    const withdrawal = await TherapistPayoutAccountService.requestWithdrawal({
      therapistAccountId: account.id,
      payoutAccountId,
      amount: Number(amount),
      idempotencyKey,
    });

    // Quick withdrawal: automatically settle immediately for instantaneous UX
    let finalWithdrawal = withdrawal;
    if (quick) {
      const settled = await TherapistPayoutAccountService.settleWithdrawal(
        withdrawal.id,
        account.id
      );
      if (settled) {
        finalWithdrawal = settled;
      }
    }

    return NextResponse.json({
      success: true,
      withdrawal: finalWithdrawal,
      quickSettled: Boolean(quick && finalWithdrawal.status === 'completed'),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'WITHDRAWAL_ERROR', message: err.message } },
      { status: err.status || 400 }
    );
  }
}
