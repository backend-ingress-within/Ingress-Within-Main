import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { FeedbackService } from '../../../../../lib/feedback/feedbackService';

export const runtime = 'nodejs';

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/admin/feedback/[id]
 * Retrieves details for a specific feedback submission.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    await requireAuthorizedAdmin(request);
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: { code: 'INVALID_ID', message: 'Missing feedback identifier.' } },
        { status: 400 }
      );
    }

    const record = await FeedbackService.getFeedbackById(id);
    if (!record) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Feedback submission not found.' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      feedback: record
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: err.code || 'FEEDBACK_ERROR',
          message: err.message || 'Failed to fetch submission.'
        }
      },
      { status: err.status || 500 }
    );
  }
}

/**
 * PATCH /api/admin/feedback/[id]
 * Updates status, priority, admin notes, or assignment on a submission.
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
  try {
    const adminSession = await requireAuthorizedAdmin(request);
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: { code: 'INVALID_ID', message: 'Missing feedback identifier.' } },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { status, priority, admin_notes, assigned_to } = body;

    const validStatuses = ['new', 'in_review', 'in_progress', 'resolved', 'closed'];
    const validPriorities = ['low', 'normal', 'high', 'critical'];

    if (status && !validStatuses.includes(status)) {
      return NextResponse.json(
        { error: { code: 'INVALID_STATUS', message: 'Invalid status provided.' } },
        { status: 400 }
      );
    }

    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: { code: 'INVALID_PRIORITY', message: 'Invalid priority provided.' } },
        { status: 400 }
      );
    }

    const updated = await FeedbackService.updateFeedback(
      id,
      { status, priority, admin_notes, assigned_to },
      adminSession.adminId
    );

    return NextResponse.json({
      success: true,
      feedback: updated,
      message: 'Feedback updated successfully.'
    });

  } catch (err: any) {
    return NextResponse.json(
      {
        error: {
          code: err.code || 'UPDATE_ERROR',
          message: err.message || 'Failed to update submission.'
        }
      },
      { status: err.status || 500 }
    );
  }
}
