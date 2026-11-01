import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../lib/auth/adminAuthHelper';
import { AdminTherapyRelationshipService } from '../../../../../lib/admin/adminTherapyRelationshipService';

/**
 * GET /api/admin/therapy-relationships/[id]
 *
 * Secure administrator endpoint to retrieve full details, complete session history,
 * and all 9 chronological milestones for a specific relationship.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Authorize admin session
    await requireAuthorizedAdmin(request);

    // 2. Resolve parameters
    const resolvedParams = await params;
    const relationshipId = resolvedParams.id;

    if (!relationshipId) {
      return NextResponse.json(
        { error: { code: 'INVALID_ID', message: 'Relationship ID is required.' } },
        { status: 400 }
      );
    }

    // 3. Fetch detailed relationship payload
    const relationship = await AdminTherapyRelationshipService.getRelationshipDetail(relationshipId);

    return NextResponse.json({
      success: true,
      relationship,
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'RELATIONSHIP_DETAIL_ERROR',
          message: err.message || 'Failed to retrieve relationship details.',
        },
      },
      { status }
    );
  }
}
