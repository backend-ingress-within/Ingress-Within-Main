import { NextRequest, NextResponse } from 'next/server';
import { TherapistPlatformService } from '../../../../../lib/therapist/therapistPlatformService';

export async function POST(request: NextRequest) {
  try {
    // Admin Authorization Guard: require admin secret header or bearer token
    const authHeader = request.headers.get('authorization') || '';
    const adminKey = request.headers.get('x-admin-key') || '';
    const expectedAdminKey = process.env.ADMIN_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || 'iw_admin_dev_secret';

    const isAuthorized =
      adminKey === expectedAdminKey ||
      authHeader === `Bearer ${expectedAdminKey}` ||
      authHeader === `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`;

    if (!isAuthorized) {
      return NextResponse.json(
        { error: { code: 'ADMIN_UNAUTHORIZED', message: 'Administrative authorization required.' } },
        { status: 403 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { therapist_account_id, decision, reviewer_notes } = body;

    if (!therapist_account_id) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'therapist_account_id is required.' } },
        { status: 400 }
      );
    }

    if (decision !== 'approved' && decision !== 'rejected') {
      return NextResponse.json(
        { error: { code: 'INVALID_DECISION', message: "decision must be 'approved' or 'rejected'." } },
        { status: 400 }
      );
    }

    const result = await TherapistPlatformService.adminReviewTherapist(
      therapist_account_id,
      decision,
      'admin_reviewer',
      reviewer_notes
    );

    return NextResponse.json({
      message: `Therapist application ${decision}.`,
      ...result,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'REVIEW_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
