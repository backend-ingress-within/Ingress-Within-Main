import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { TherapistPayoutAccountService } from '../../../../../lib/therapist/therapistPayoutAccountService';
import { AdminAuditService } from '../../../../../lib/admin/adminAuditService';

export async function POST(request: NextRequest) {
  try {
    const admin = await requireAuthorizedAdmin(request);
    const body = await request.json();

    const { withdrawalId, utrNumber } = body;

    if (!withdrawalId) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'withdrawalId is required.' } },
        { status: 400 }
      );
    }

    if (!utrNumber || typeof utrNumber !== 'string' || utrNumber.trim().length < 6) {
      return NextResponse.json(
        { error: { code: 'INVALID_UTR', message: 'A valid authentic bank UTR / UPI transaction reference (minimum 6 characters) is required.' } },
        { status: 400 }
      );
    }

    const settled = await TherapistPayoutAccountService.settleWithdrawal(
      withdrawalId,
      undefined,
      utrNumber.trim()
    );

    if (!settled) {
      return NextResponse.json(
        { error: { code: 'SETTLE_FAILED', message: 'Withdrawal not found or could not be settled.' } },
        { status: 400 }
      );
    }

    await AdminAuditService.logAction({
      actorId: admin.adminId,
      actorType: admin.actorType,
      action: 'therapist_withdrawal_disbursed',
      entityType: 'withdrawal_request',
      entityId: settled.id,
      metadata: {
        amount: settled.amount,
        therapist_account_id: settled.therapist_account_id,
        utr_number: settled.utr_number,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Withdrawal successfully recorded as disbursed with Bank UTR: ${settled.utr_number}.`,
      withdrawal: settled,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'SETTLE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
