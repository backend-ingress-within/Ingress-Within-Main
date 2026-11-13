import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { getEligibleTherapists } from '../../../../lib/therapy/therapyService';

export async function GET(request: NextRequest) {
  try {
    const therapists = await getEligibleTherapists();

    return NextResponse.json({
      success: true,
      therapists,
      count: therapists.length,
    });
  } catch (error: any) {
    console.error('[Therapy Therapists Discovery GET] Error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve eligible therapists.',
        },
      },
      { status: 500 }
    );
  }
}
