import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { getInMemoryManualReviews } from '../../../../lib/therapy/conversationalIntakeService';
import { supabase } from '../../../../lib/db';

/**
 * GET /api/admin/manual-matching-reviews
 * =====================================
 * Retrieves unmatched therapy intakes requiring authorized clinical coordination.
 * Filterable by status: manual_review_required, under_review, therapist_identified,
 * awaiting_therapist_acceptance, client_contacted, resolved, closed.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status');

    // 1. Fetch from Supabase if table exists
    let dbReviews: any[] = [];
    try {
      let query = supabase
        .from('manual_matching_reviews')
        .select(`
          *,
          users:user_id (
            email,
            phone_number,
            profiles:profiles (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('review_status', statusFilter);
      }

      const { data } = await query.limit(100);
      if (data) dbReviews = data;
    } catch (dbErr) {
      console.warn('[GET /api/admin/manual-matching-reviews] DB query notice:', dbErr);
    }

    // 2. Fetch in-memory fallback reviews
    let memoryReviews = getInMemoryManualReviews();
    if (statusFilter && statusFilter !== 'all') {
      memoryReviews = memoryReviews.filter((r) => r.review_status === statusFilter);
    }

    // 3. Deduplicate by reference_id
    const seenRefs = new Set<string>();
    const combined: any[] = [];

    for (const r of [...dbReviews, ...memoryReviews]) {
      const ref = r.reference_id || r.id;
      if (!seenRefs.has(ref)) {
        seenRefs.add(ref);
        combined.push({
          ...r,
          clientName: r.users?.profiles?.full_name || r.client_preferences?.contact_name || r.client_preferences?.name || r.client_name || 'Client',
          clientEmail: r.users?.email || r.client_preferences?.contact_email || r.client_preferences?.email || r.client_email || 'N/A',
          clientPhone: r.users?.phone_number || r.client_preferences?.contact_phone || r.client_preferences?.phone || r.client_phone || 'N/A',
        });
      }
    }

    // Metrics summary
    const counts = {
      total: combined.length,
      manual_review_required: combined.filter((r) => r.review_status === 'manual_review_required').length,
      under_review: combined.filter((r) => r.review_status === 'under_review').length,
      therapist_identified: combined.filter((r) => r.review_status === 'therapist_identified').length,
      resolved: combined.filter((r) => r.review_status === 'resolved' || r.review_status === 'closed').length,
    };

    return NextResponse.json({
      success: true,
      counts,
      reviews: combined,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: { code: error.code || 'UNAUTHORIZED_ADMIN', message: error.message || 'Unauthorized admin access.' } },
      { status: error.status || 401 }
    );
  }
}
