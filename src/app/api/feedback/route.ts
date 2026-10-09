import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../lib/auth-helper';
import { FeedbackService } from '../../../lib/feedback/feedbackService';

export const runtime = 'nodejs';

/**
 * POST /api/feedback
 * Public endpoint to submit feedback, bug reports, or technical issues.
 * Supports authenticated and anonymous users alike.
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Identify client IP for rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || undefined;

    // 2. Identify authenticated user if session exists (non-mandatory)
    const authUser = await getAuthenticatedUser(request);
    const userId = authUser?.userId || null;

    // 3. Rate limiting check (Max 5 submissions per 10 mins per IP/User)
    const rateLimitTarget = userId || ip;
    const isAllowed = await FeedbackService.checkRateLimit(rateLimitTarget);
    if (!isAllowed) {
      return NextResponse.json(
        {
          error: {
            code: 'RATE_LIMIT_EXCEEDED',
            message: 'Too many submissions from this connection. Please wait a few minutes before submitting again.'
          }
        },
        { status: 429 }
      );
    }

    // 4. Parse request body
    const body = await request.json().catch(() => ({}));

    // 5. Create feedback record
    const result = await FeedbackService.createFeedback(
      {
        submission_type: body.submission_type,
        subject: body.subject,
        description: body.description,
        category: body.category,
        contact_email: body.contact_email,
        page_url: body.page_url,
        steps_to_reproduce: body.steps_to_reproduce,
        expected_behavior: body.expected_behavior,
        actual_behavior: body.actual_behavior,
        user_id: userId,
        bot_trap: body.bot_trap,
        metadata: {
          client_reported_url: body.page_url || null,
          is_authenticated: Boolean(userId),
          authenticated_phone: authUser?.phoneNumber || null
        }
      },
      ip,
      userAgent
    );

    return NextResponse.json({
      success: true,
      reference_code: result.reference_code,
      id: result.id,
      message: 'Your feedback has been received and registered with our team.'
    });

  } catch (error: any) {
    console.error('[API /api/feedback] Submission error:', error);
    const isClientError =
      error.message?.includes('Please provide') ||
      error.message?.includes('Please describe') ||
      error.message?.includes('valid email') ||
      error.message?.includes('Automated submission');

    return NextResponse.json(
      {
        error: {
          code: isClientError ? 'INVALID_SUBMISSION' : 'SUBMISSION_FAILED',
          message: error.message || 'Failed to submit feedback. Please try again.'
        }
      },
      { status: isClientError ? 400 : 500 }
    );
  }
}
