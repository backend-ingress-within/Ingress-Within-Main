import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { getPersistedMatchRequests } from '../../../../lib/therapy/matchRequestsStore';
import { supabase } from '../../../../lib/db';

/**
 * GET /api/admin/match-requests
 * =============================
 * Returns persisted match interest requests for administrative review.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const inMemory = getPersistedMatchRequests();

    // Also fetch submissions from Supabase if table exists
    let dbSubmissions: any[] = [];
    try {
      const { data } = await supabase
        .from('therapy_submissions')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      if (data) dbSubmissions = data;
    } catch {}

    return NextResponse.json({
      success: true,
      requests: inMemory,
      submissionsCount: dbSubmissions.length,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'MATCH_REQUESTS_QUERY_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
