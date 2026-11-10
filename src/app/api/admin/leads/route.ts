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
