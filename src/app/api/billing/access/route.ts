import { NextRequest, NextResponse } from 'next/server';
import { requireAuthenticatedUser } from '../../../../lib/auth-helper';
import { AccessControlService } from '../../../../lib/billing/accessControlService';

/**
 * GET /api/billing/access
 * Returns centralized customer access state, capabilities, and banners.
 * States: TRIAL | ACTIVE | PAST_DUE | CANCELLED_PENDING | DORMANT
 */
export async function GET(request: NextRequest) {
  try {
    const authUser = await requireAuthenticatedUser(request);
    const access = await AccessControlService.getCustomerAccess(authUser.userId);

    return NextResponse.json({
      success: true,
      access
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'ACCESS_EVALUATION_ERROR',
          message: err.message || 'Failed to evaluate customer access.'
        }
      },
      { status }
    );
  }
}

