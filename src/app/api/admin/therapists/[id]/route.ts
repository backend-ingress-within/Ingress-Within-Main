import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { AdminPlatformService } from '../../../../../lib/admin/adminPlatformService';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuthorizedAdmin(request);
    const resolvedParams = await params;
    const therapistAccountId = resolvedParams.id;
    const body = await request.json().catch(() => ({}));

    const result = await AdminPlatformService.updateTherapist(
      therapistAccountId,
      body,
      admin.adminId
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'UPDATE_THERAPIST_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAuthorizedAdmin(request);
    const resolvedParams = await params;
    const therapistAccountId = resolvedParams.id;

    const result = await AdminPlatformService.deleteRejectedTherapist(
      therapistAccountId,
      admin.adminId
    );

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'DELETE_THERAPIST_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
