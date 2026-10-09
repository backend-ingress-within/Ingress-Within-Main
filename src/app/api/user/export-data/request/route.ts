import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { DataExportService } from '../../../../../lib/dataExportService';

export const runtime = 'nodejs';

/**
 * POST /api/user/export-data/request
 * Securely logs the data export request to the user's audit log
 * and confirms that the export archive is prepared for immediate download.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'You must be signed in to request your data.'
          }
        },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const contactInfo = body.contactInfo || authUser.phoneNumber;
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    const result = await DataExportService.requestDataExport(
      authUser.userId,
      contactInfo,
      ip,
      userAgent
    );

    return NextResponse.json(result);

  } catch (error: any) {
    console.error('[API /api/user/export-data/request] Error logging request:', error);
    return NextResponse.json(
      {
        error: {
          code: 'REQUEST_FAILED',
          message: error?.message || 'Failed to submit data export request.'
        }
      },
      { status: 500 }
    );
  }
}
