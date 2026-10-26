import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../../lib/therapist/therapistAuthHelper';
import { ClientInsightConsentService } from '../../../../../../../../lib/therapy/clientInsightConsentService';

/**
 * GET /api/therapist/clients/[id]/insights/monthly-reports/[cycleId]
 *
 * Fetches an individual monthly/cycle assessment report for an assigned therapist if consented.
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; cycleId: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const params = await props.params;
    const { id: clientId, cycleId } = params;

    if (!clientId || !cycleId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Client ID and Cycle ID are required.' } },
        { status: 400 }
      );
    }

    const reportDetail = await ClientInsightConsentService.getMonthlyReportDetailForTherapist(
      account.id,
      clientId,
      cycleId
    );

    const response = NextResponse.json(reportDetail);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: err.code || 'MONTHLY_REPORT_ERROR',
          message: err.message || 'Unable to retrieve monthly report.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
