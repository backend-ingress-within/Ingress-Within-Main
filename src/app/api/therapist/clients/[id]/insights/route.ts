import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../lib/therapist/therapistAuthHelper';
import { ClientInsightConsentService } from '../../../../../../lib/therapy/clientInsightConsentService';

/**
 * GET /api/therapist/clients/[id]/insights
 *
 * Retrieves consented client insights for an assigned therapist.
 *
 * Server-side checks:
 * 1. Therapist is authenticated.
 * 2. Active clinical care relationship exists between therapist and client.
 * 3. Client has explicitly granted and maintained insight sharing consent.
 * 4. Strictly checks category permissions (Pattern Summary, Emotional Vocabulary, Weekly, Monthly).
 * 5. Returns only consented summaries; non-consented categories return { consented: false }.
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const params = await props.params;
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Client ID is required.' } },
        { status: 400 }
      );
    }

    const insights = await ClientInsightConsentService.getTherapistClientInsights(
      account.id,
      clientId
    );

    const response = NextResponse.json({
      success: true,
      ...insights,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (err: any) {
    console.error('[Therapist Client Insights GET] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'INSIGHTS_ACCESS_ERROR',
          message: err.message || 'Unable to retrieve client insights.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
