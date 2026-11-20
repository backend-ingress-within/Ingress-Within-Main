import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { sendClientCareSummaryEmail } from '../../../../../../lib/therapy/therapyService';

/**
 * POST /api/therapy/client/journey/email-summary
 *
 * Generates and delivers a comprehensive therapy care summary over email to the authenticated client.
 * Includes care duration, clinician details, list of all completed sessions, and 6-month retention notice.
 */
export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const result = await sendClientCareSummaryEmail(authUser.userId);

    if (!result.success) {
      return NextResponse.json(
        { error: { code: 'EMAIL_FAILED', message: result.error || 'Failed to dispatch care summary email.' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      email: result.email,
      message: `A complete summary of your therapy sessions and care journey has been sent to ${result.email}.`,
    });
  } catch (err: any) {
    console.error('[Client Email Summary POST] Error:', err);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: err.message || 'Failed to send care summary.' } },
      { status: 500 }
    );
  }
}
