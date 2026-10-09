import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { DataExportService } from '../../../../lib/dataExportService';

export const runtime = 'nodejs';

/**
 * GET /api/user/export-data
 * Compiles and streams a complete ZIP archive of the user's data.
 * Contains dedicated documents for every journal entry, reflections,
 * weekly synthesis reports, emotional vocabulary, and profile.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'You must be signed in to download your data.'
          }
        },
        { status: 401 }
      );
    }

    const { buffer, filename, stats } = await DataExportService.exportUserDataZip(authUser.userId);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
        'X-Entries-Count': String(stats.entriesCount),
        'X-Reports-Count': String(stats.reportsCount),
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });

  } catch (error: any) {
    console.error('[API /api/user/export-data] Error generating export:', error);
    return NextResponse.json(
      {
        error: {
          code: 'EXPORT_FAILED',
          message: error?.message || 'Failed to compile your data archive.'
        }
      },
      { status: 500 }
    );
  }
}
