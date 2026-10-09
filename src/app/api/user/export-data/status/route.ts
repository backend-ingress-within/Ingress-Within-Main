import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { DataExportService } from '../../../../../lib/dataExportService';

export const runtime = 'nodejs';

/**
 * GET /api/user/export-data/status
 * Returns current data export status, timestamps, and item counts.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication required.'
          }
        },
        { status: 401 }
      );
    }

    const status = await DataExportService.getDataExportStatus(authUser.userId);

    return NextResponse.json({
      success: true,
      ...status
    });

  } catch (error: any) {
    console.error('[API /api/user/export-data/status] Error fetching status:', error);
    return NextResponse.json(
      {
        error: {
          code: 'STATUS_FAILED',
          message: error?.message || 'Failed to retrieve export status.'
        }
      },
      { status: 500 }
    );
  }
}
