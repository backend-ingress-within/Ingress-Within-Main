import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../lib/auth-helper';
import { BillingService } from '../../../../lib/billing/billingService';

/**
 * GET /api/billing/overview
 * Returns real dynamic billing overview for the authenticated user:
 * - current subscription
 * - payment methods
 * - invoices
 * - order history
 * - active entitlements
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const overview = await BillingService.getBillingOverview(authUser.userId);

    return NextResponse.json({
      success: true,
      billing: overview
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'BILLING_OVERVIEW_ERROR',
          message: err.message || 'Failed to load billing overview.'
        }
      },
      { status }
    );
  }
}
