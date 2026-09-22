import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import {
  getTherapySession,
  saveTherapyMatches,
  getTherapyMatches,
} from '../../../../lib/therapy/therapyService';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication is required.',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!isRecord(body)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request body.',
          },
        },
        { status: 400 }
      );
    }

    const sessionId = body.sessionId;

    if (
      typeof sessionId !== 'string' ||
      sessionId.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SESSION',
            message: 'sessionId is required.',
          },
        },
        { status: 400 }
      );
    }

    const session = await getTherapySession(
      sessionId.trim(),
      authUser.userId
    );

    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Therapy session was not found.',
          },
        },
        { status: 404 }
      );
    }

    if (!Array.isArray(body.matches)) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_MATCHES',
            message: 'matches must be an array.',
          },
        },
        { status: 400 }
      );
    }

    const matches = body.matches.map((match: unknown) => {
      if (!isRecord(match)) {
        return {};
      }

      return {
        therapistAccountId:
          typeof match.therapistAccountId === 'string'
            ? match.therapistAccountId
            : null,

        matchStatus:
          typeof match.matchStatus === 'string'
            ? match.matchStatus
            : 'candidate',

        matchRank:
          typeof match.matchRank === 'number'
            ? match.matchRank
            : null,

        matchScore:
          typeof match.matchScore === 'number'
            ? match.matchScore
            : null,

        matchReasons:
          Array.isArray(match.matchReasons)
            ? match.matchReasons
            : [],

        matchingMetadata:
          isRecord(match.matchingMetadata)
            ? match.matchingMetadata
            : {},
      };
    });

    const savedMatches = await saveTherapyMatches(
      sessionId.trim(),
      authUser.userId,
      matches
    );

    return NextResponse.json(
      {
        success: true,
        matches: savedMatches,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Therapy Matches POST] Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to save Therapy matches.',
        },
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication is required.',
          },
        },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SESSION',
            message: 'sessionId is required.',
          },
        },
        { status: 400 }
      );
    }

    const session = await getTherapySession(
      sessionId,
      authUser.userId
    );

    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: 'SESSION_NOT_FOUND',
            message: 'Therapy session was not found.',
          },
        },
        { status: 404 }
      );
    }

    const matches = await getTherapyMatches(
      sessionId,
      authUser.userId
    );

    return NextResponse.json({
      success: true,
      matches,
    });
  } catch (error) {
    console.error('[Therapy Matches GET] Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to retrieve Therapy matches.',
        },
      },
      { status: 500 }
    );
  }
}