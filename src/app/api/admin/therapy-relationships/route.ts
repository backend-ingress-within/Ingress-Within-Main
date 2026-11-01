import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { AdminTherapyRelationshipService } from '../../../../lib/admin/adminTherapyRelationshipService';

/**
 * GET /api/admin/therapy-relationships
 *
 * Secure administrator endpoint to query all client-therapist relationships
 * with lifecycle tracking, server-side filtering, sorting, and pagination.
 */
export async function GET(request: NextRequest) {
  try {
    // 1. Authorize admin session
    await requireAuthorizedAdmin(request);

    // 2. Parse query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const search = searchParams.get('search') || '';
    const filter = searchParams.get('filter') || 'all';
    const sort = searchParams.get('sort') || 'newest_request';

    // 3. Fetch relationships
    const result = await AdminTherapyRelationshipService.getRelationships({
      page,
      limit,
      search,
      filter,
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
          code: err.code || 'RELATIONSHIPS_QUERY_ERROR',
          message: err.message || 'Failed to retrieve therapy relationships.',
        },
      },
      { status }
    );
  }
}
