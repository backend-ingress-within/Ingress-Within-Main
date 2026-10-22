import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedAdmin } from '../../../../../../lib/auth/adminAuthHelper';
import { requireAuthorizedTherapist } from '../../../../../../lib/therapist/therapistAuthHelper';
import {
  RelationshipBookingLinkService,
  BookingActor,
} from '../../../../../../lib/therapy/relationshipBookingLinkService';

/**
 * Resolves the authenticated actor (Administrator or Assigned Therapist).
 * Client session tokens and unauthenticated requests are strictly rejected.
 */
async function getAuthorizedActor(request: NextRequest): Promise<BookingActor | null> {
  // 1. Try Admin authorization
  try {
    const admin = await requireAuthorizedAdmin(request);
    if (admin) {
      return {
        actorType: 'admin',
        actorId: admin.adminId,
      };
    }
  } catch {
    // Not admin, proceed to therapist check
  }

  // 2. Try Therapist authorization (strictly requires can_practice === true and verified standing)
  try {
    const { account } = await requireAuthorizedTherapist(request);
    if (account) {
      return {
        actorType: 'therapist',
        actorId: account.id,
      };
    }
  } catch {
    // Not authorized therapist
  }

  return null;
}

/**
 * POST /api/therapy/relationships/[id]/booking-link
 * Issues or idempotently retrieves the stable persistent booking link for a care relationship.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMETERS', message: 'Relationship ID is required in URL path.' } },
        { status: 400 }
      );
    }

    const actor = await getAuthorizedActor(request);
    if (!actor) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'You must be an authenticated administrator or the assigned practitioner to issue booking links.',
          },
        },
        { status: 401 }
      );
    }

    const result = await RelationshipBookingLinkService.issueBookingLink({
      relationshipId: id,
      actor,
    });

    return NextResponse.json(
      {
        success: true,
        bookingLink: result.bookingLink,
        status: result.status,
        isNew: result.isNew,
        createdAt: result.createdAt,
        relationshipId: result.relationshipId,
      },
      { status: result.isNew ? 201 : 200 }
    );
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'BOOKING_LINK_ISSUANCE_FAILED',
          message: err.message || 'Failed to issue booking link for care relationship.',
          details: err.details,
        },
      },
      { status }
    );
  }
}

/**
 * GET /api/therapy/relationships/[id]/booking-link
 * Retrieves the existing active booking link for a care relationship.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id || typeof id !== 'string') {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMETERS', message: 'Relationship ID is required in URL path.' } },
        { status: 400 }
      );
    }

    const actor = await getAuthorizedActor(request);
    if (!actor) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'You must be an authenticated administrator or the assigned practitioner to view booking links.',
          },
        },
        { status: 401 }
      );
    }

    const result = await RelationshipBookingLinkService.issueBookingLink({
      relationshipId: id,
      actor,
    });

    return NextResponse.json({
      success: true,
      bookingLink: result.bookingLink,
      status: result.status,
      createdAt: result.createdAt,
      relationshipId: result.relationshipId,
    });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'BOOKING_LINK_FETCH_FAILED',
          message: err.message || 'Failed to fetch booking link for care relationship.',
        },
      },
      { status }
    );
  }
}
