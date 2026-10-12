import { NextRequest, NextResponse } from 'next/server';
import { inferModalitiesWithAI } from '../../../lib/therapy/matchingEngine';

/**
 * POST /api/infer-modality
 * ========================
 * Standalone endpoint for AI modality inference.
 * Falls back gracefully to deterministic heuristics when offline.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { error: { code: 'INVALID_REQUEST', message: 'Valid JSON body is required.' } },
        { status: 400 }
      );
    }

    const answers = body.answers || {};
    const concernPriority = Array.isArray(body.concernPriority) ? body.concernPriority : [];

    const result = await inferModalitiesWithAI(answers, concernPriority);

    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error('[POST /api/infer-modality] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'Failed to infer modalities.' } },
      { status: 500 }
    );
  }
}
