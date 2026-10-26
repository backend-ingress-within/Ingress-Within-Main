import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { ClientInsightConsentService } from '../../../../lib/therapy/clientInsightConsentService';
import { getClientIp } from '../../../../utils/ip';

/**
 * GET /api/user/insights-consent
 *
 * Retrieves current insight sharing consent preferences for the authenticated client.
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const result = await ClientInsightConsentService.getConsentForClient(authUser.userId);

    const response = NextResponse.json({
      success: true,
      consent: result.consent,
      activeTherapist: result.activeTherapist,
    });

    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('[User Insights Consent GET] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}

/**
 * POST / PUT /api/user/insights-consent
 *
 * Updates or withdraws insight sharing consent for the authenticated client.
 */
export async function POST(request: NextRequest) {
  return handleUpdateConsent(request);
}

export async function PUT(request: NextRequest) {
  return handleUpdateConsent(request);
}

async function handleUpdateConsent(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const ipAddress = getClientIp(request);
    const userAgent = request.headers.get('user-agent') || undefined;

    // Check if this is an explicit withdrawal request
    if (body.withdraw === true || body.action === 'withdraw') {
      const updated = await ClientInsightConsentService.withdrawConsent({
        clientId: authUser.userId,
        ipAddress,
        userAgent,
      });

      const response = NextResponse.json({
        success: true,
        message: 'Insight sharing consent has been completely withdrawn.',
        consent: updated,
      });
      response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
      return response;
    }

    // Explicit affirmative consent update
    const isEnabled = Boolean(body.isEnabled ?? body.is_enabled);
    const categories = body.categories || {
      patternSummary: Boolean(body.sharePatternSummary ?? body.share_pattern_summary),
      emotionalVocabulary: Boolean(body.shareEmotionalVocabulary ?? body.share_emotional_vocabulary),
      weeklyReports: Boolean(body.shareWeeklyReports ?? body.share_weekly_reports),
      monthlyReports: Boolean(body.shareMonthlyReports ?? body.share_monthly_reports),
    };

    const updated = await ClientInsightConsentService.updateConsent({
      clientId: authUser.userId,
      isEnabled,
      categories,
      therapistAccountId: body.therapistAccountId || body.therapist_account_id,
      relationshipId: body.relationshipId || body.relationship_id,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json({
      success: true,
      message: isEnabled
        ? 'Insight sharing preferences updated successfully.'
        : 'Insight sharing has been disabled.',
      consent: updated,
    });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate');
    return response;
  } catch (error: any) {
    console.error('[User Insights Consent POST/PUT] Error:', error);
    return NextResponse.json(
      { error: { code: 'INTERNAL_ERROR', message: error.message || 'An unexpected error occurred.' } },
      { status: 500 }
    );
  }
}
