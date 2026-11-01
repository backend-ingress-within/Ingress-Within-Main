import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { AdminTherapistOverviewService } from '../../../../lib/admin/adminTherapistOverviewService';

/**
 * GET /api/admin/therapist-overview
 *
 * Secure administrator endpoint to query therapist-wise client and session statistics,
 * platform aggregate metrics, server-side filtering, sorting, and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authorize admin session
    await requireAuthorizedAdmin(request);

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const search = searchParams.get('search') || '';
    const verificationStatus = searchParams.get('verificationStatus') || 'all';
    const activityFilter = searchParams.get('activityFilter') || 'all';
    const sort = searchParams.get('sort') || 'total_clients_desc';

    // 3. Query overview statistics
    const result = await AdminTherapistOverviewService.getOverviewList({
      page,
      limit,
      search,
      verificationStatus,
      activityFilter,
      sort,
    });

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'THERAPIST_OVERVIEW_ERROR',
          message: err.message || 'Failed to retrieve therapist overview statistics.',
        },
      },
      { status }
    );
  }
}
