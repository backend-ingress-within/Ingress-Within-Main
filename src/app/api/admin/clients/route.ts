import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { AdminPlatformService } from '../../../../lib/admin/adminPlatformService';
import { deleteClientTherapyAccount } from '../../../../lib/therapy/therapyClientAccountService';

export async function GET(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';

    const result = await AdminPlatformService.getClients({
      page,
      limit,
      search,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'CLIENTS_QUERY_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const body = await request.json().catch(() => ({}));
    const target = body.email || body.userId || request.nextUrl.searchParams.get('target');

    if (!target) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Target client email or userId is required.' } },
        { status: 400 }
      );
    }

    const outcome = await deleteClientTherapyAccount(target);

    return NextResponse.json({
      success: outcome.success,
      target,
      details: outcome.details || 'Client therapy account records safely purged.',
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'DELETE_CLIENT_THERAPY_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
