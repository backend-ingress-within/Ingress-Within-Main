import { NextRequest, NextResponse } from 'next/server';
import { runIntakeMatching } from '../../../../lib/therapy/therapistMatchingService';

/**
 * POST /api/intake/match
 * =====================
 * Canonical matching endpoint implementing Developer Handoff §5.1.
 * Accepts client safety screening answers and intake form answers,
 * running the entire scoring and matching pipeline server-side.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Request body must be a valid JSON object.' } },
        { status: 400 }
      );
    }

    const safety = body.safety || {};
    const answers = body.answers || {};

    const matchOutcome = await runIntakeMatching(safety, answers);

    return NextResponse.json(matchOutcome, { status: 200 });
  } catch (error: any) {
    console.error('[POST /api/intake/match] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to compute therapist matches.' } },
      { status: 500 }
    );
  }
}
