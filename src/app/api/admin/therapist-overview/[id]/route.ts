import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { AdminTherapistOverviewService } from '../../../../../lib/admin/adminTherapistOverviewService';

/**
 * GET /api/admin/therapist-overview/[id]
 *
 * Secure administrator endpoint to retrieve full details, client list, session statistics,
 * and sanitized clinical session history for a specific therapist.
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authorize admin session
    await requireAuthorizedAdmin(request);

    // 2. Parse therapist ID
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json(
        { error: { code: 'MISSING_ID', message: 'Therapist ID is required.' } },
        { status: 400 }
      );
    }

    // 3. Query therapist detail dossier
    const detail = await AdminTherapistOverviewService.getTherapistDetail(id);

    return NextResponse.json({
      success: true,
      ...detail,
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'THERAPIST_DETAIL_ERROR',
          message: err.message || 'Failed to retrieve therapist details.',
        },
      },
      { status }
    );
  }
}
