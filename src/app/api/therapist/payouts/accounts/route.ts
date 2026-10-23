import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPayoutAccountService } from '../../../../../lib/therapist/therapistPayoutAccountService';

export async function GET(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const accounts = await TherapistPayoutAccountService.getPayoutAccounts(account.id);

    return NextResponse.json({
      success: true,
      accounts,
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

    const {
      accountType,
      beneficiaryName,
      bankName,
      accountNumber,
      ifsc,
      upiId,
      isDefault,
    } = body;

    const newAccount = await TherapistPayoutAccountService.createPayoutAccount({
      therapistAccountId: account.id,
      accountType,
      beneficiaryName,
      bankName,
      accountNumber,
      ifsc,
      upiId,
      isDefault,
    });

    return NextResponse.json({
      success: true,
      account: newAccount,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'PAYOUT_ACCOUNT_ERROR', message: err.message } },
      { status: err.status || 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json();
    const { accountId } = body;

    if (!accountId) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'accountId is required.' } },
        { status: 400 }
      );
    }

    const updated = await TherapistPayoutAccountService.setDefaultAccount(account.id, accountId);

    return NextResponse.json({
      success: true,
      account: updated,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'PAYOUT_ACCOUNT_ERROR', message: err.message } },
      { status: err.status || 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('id');

    if (!accountId) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Payout account id is required.' } },
        { status: 400 }
      );
    }

    await TherapistPayoutAccountService.deletePayoutAccount(account.id, accountId);

    return NextResponse.json({
      success: true,
      message: 'Payout account deleted successfully.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'PAYOUT_ACCOUNT_ERROR', message: err.message } },
      { status: err.status || 400 }
    );
  }
}
