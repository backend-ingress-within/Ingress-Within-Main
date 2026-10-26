import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../../../../lib/therapist/therapistAuthHelper';
import { ClientInsightConsentService } from '../../../../../../../../lib/therapy/clientInsightConsentService';

/**
 * GET /api/therapist/clients/[id]/insights/weekly-reports/[reportId]
 *
 * Fetches an individual weekly report for an assigned therapist if consented.
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; reportId: string }> }
) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const params = await props.params;
    const { id: clientId, reportId } = params;

    if (!clientId || !reportId) {
      return NextResponse.json(
        { error: { code: 'BAD_REQUEST', message: 'Client ID and Report ID are required.' } },
        { status: 400 }
      );
    }

    const reportDetail = await ClientInsightConsentService.getWeeklyReportDetailForTherapist(
      account.id,
      clientId,
      reportId
    );

    const response = NextResponse.json(reportDetail);
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: err.code || 'WEEKLY_REPORT_ERROR',
          message: err.message || 'Unable to retrieve weekly report.',
        },
      },
      { status: err.status || 500 }
    );
  }
}
