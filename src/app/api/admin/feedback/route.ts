import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../lib/auth/adminAuthHelper';
import { FeedbackService } from '../../../../lib/feedback/feedbackService';

export const runtime = 'nodejs';

/**
 * GET /api/admin/feedback
 * Lists and filters feedback and bug submissions for the admin panel.
 */
export async function GET(request: NextRequest) {
  try {
    await requireAuthorizedAdmin(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status') || undefined;
    const submission_type = searchParams.get('type') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const data = await FeedbackService.listFeedback({
      page,
      limit,
      status,
      submission_type,
      priority,
      category,
      search
    });

    return NextResponse.json({
      success: true,
      ...data
    });

  } catch (err: any) {
    console.error('[API /api/admin/feedback] Error:', err);
    return NextResponse.json(
      {
        error: {
          code: err.code || 'FEEDBACK_FETCH_FAILED',
          message: err.message || 'Failed to retrieve feedback submissions.'
        }
      },
      { status: err.status || 500 }
    );
  }
}
