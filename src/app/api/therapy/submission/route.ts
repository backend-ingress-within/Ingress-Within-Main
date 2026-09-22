import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { createTherapySubmission } from '../../../../lib/therapy/therapyService';

const VALID_SUBMISSION_TYPES = [
  'conversation',
  'guided',
  'team',
] as const;

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

    if (!body || typeof body !== 'object') {
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

    const {
      therapySessionId,
      submissionType,
      callbackPreference,
      notes,
      metadata,
    } = body;

    if (
      typeof therapySessionId !== 'string' ||
      therapySessionId.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SESSION',
            message: 'therapySessionId is required.',
          },
        },
        { status: 400 }
      );
    }

    if (
      typeof submissionType !== 'string' ||
      !VALID_SUBMISSION_TYPES.includes(
        submissionType as (typeof VALID_SUBMISSION_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SUBMISSION_TYPE',
            message: 'Invalid submissionType.',
          },
        },
        { status: 400 }
      );
    }

    const submission = await createTherapySubmission({
      therapySessionId: therapySessionId.trim(),
      userId: authUser.userId,
      submissionType:
        submissionType as Parameters<typeof createTherapySubmission>[0]['submissionType'],
      callbackPreference:
        typeof callbackPreference === 'string'
          ? callbackPreference
          : null,
      notes:
        typeof notes === 'string'
          ? notes
          : null,
      metadata:
        metadata &&
        typeof metadata === 'object' &&
        !Array.isArray(metadata)
          ? metadata
          : {},
    });

    return NextResponse.json(
      {
        success: true,
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Therapy Submission POST] Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create Therapy submission.',
        },
      },
      { status: 500 }
    );
  }
}