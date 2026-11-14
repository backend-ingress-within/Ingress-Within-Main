import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { LeadPipelineService } from '../../../../lib/therapy/leadPipelineService';

export const dynamic = 'force-dynamic';

/**
 * GET /api/admin/leads
 * ====================
 * Lists intake leads and drop-offs for clinical follow-up and CRM.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') || undefined;
    const stage = searchParams.get('stage') || undefined;
    const journey = searchParams.get('journey') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const data = await LeadPipelineService.getLeads({
      search,
      status,
      stage,
      journey,
      page,
      limit,
    });

    return NextResponse.json(data);
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized admin access' },
        { status: error.status }
      );
    }
    console.error('[GET /api/admin/leads Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to fetch intake leads' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/leads
 * =======================
 * Bulk deletes leads and drop-offs by IDs.
 */
export async function DELETE(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const body = await request.json().catch(() => ({}));
    const ids: string[] = Array.isArray(body?.ids) ? body.ids : (body?.id ? [body.id] : []);

    if (ids.length === 0) {
      return NextResponse.json(
        { error: 'At least one lead ID must be provided for deletion.' },
        { status: 400 }
      );
    }

    const result = await LeadPipelineService.deleteLeads(ids);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to delete selected leads.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Successfully deleted ${result.count} lead(s).`,
      count: result.count,
      deletedIds: ids,
    });
  } catch (error: any) {
    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        { error: error.message || 'Unauthorized admin access' },
        { status: error.status }
      );
    }
    console.error('[DELETE /api/admin/leads Error]:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete leads' },
      { status: 500 }
    );
  }
}
