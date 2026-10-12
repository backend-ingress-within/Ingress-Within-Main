import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { supabase } from '../../../../lib/db';

const VALID_LEVELS = ['none', 'cleared-for-priority', 'cleared-for-immediate'];

/**
 * POST /api/admin/acuity-clearance
 * ===============================
 * Sets the acuity clearance level for a verified therapist.
 * Only administrators can raise or revoke clearance.
 */
export async function POST(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const body = await request.json().catch(() => null);

    if (!body || !body.therapistId || !body.level) {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'therapistId and level are required.' } },
        { status: 400 }
      );
    }

    const { therapistId, level } = body;

    if (!VALID_LEVELS.includes(level)) {
      return NextResponse.json(
        { error: { code: 'INVALID_LEVEL', message: `Level must be one of: ${VALID_LEVELS.join(', ')}` } },
        { status: 400 }
      );
    }

    // Update in therapist_applications if available
    const { data: app, error } = await supabase
      .from('therapist_applications')
      .update({ acuity_clearance_level: level })
      .eq('therapist_account_id', therapistId)
      .select('id, therapist_account_id, acuity_clearance_level')
      .maybeSingle();

    if (error) {
      console.error('[Admin Acuity Clearance] DB error:', error);
    }

    return NextResponse.json({
      success: true,
      therapistId,
      acuityClearance: level,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'ACUITY_CLEARANCE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
