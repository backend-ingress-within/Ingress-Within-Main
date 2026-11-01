import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../../lib/auth/adminAuthHelper';
import { AdminTherapyRelationshipService } from '../../../../../../lib/admin/adminTherapyRelationshipService';

/**
 * GET /api/admin/therapy-relationships/[id]/consent
 *
 * Secure administrator endpoint to retrieve the verified legal consent document
 * record for the client in a relationship. No public exposure.
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

    // 3. Fetch verified consent document record
    const consentDoc = await AdminTherapyRelationshipService.getConsentDocument(relationshipId);

    return NextResponse.json({
      success: true,
      document: consentDoc,
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'CONSENT_DOCUMENT_ERROR',
          message: err.message || 'Failed to retrieve consent document.',
        },
      },
      { status }
    );
  }
}
