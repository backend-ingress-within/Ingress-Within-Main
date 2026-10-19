import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../../lib/auth-helper';
import { getOtpProvider } from '../../../../../../providers/otpProvider';
import {
  quitClientTherapyRelationship,
  changeClientTherapistRelationship,
} from '../../../../../../lib/therapy/therapyService';

/**
 * POST /api/therapy/client/relationship/transition
 *
 * Verifies client OTP and atomically executes:
 * - action === 'quit': Conclude therapy relationship (status: 'ended')
 * - action === 'change': Request therapist change / rematch (status: 'transferred')
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate client session
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { action, otpCode, reason, notes } = body;

    if (!['quit', 'change'].includes(action)) {
      return NextResponse.json(
        { error: { code: 'INVALID_ACTION', message: "Action must be 'quit' or 'change'." } },
        { status: 400 }
      );
    }

    if (!otpCode || !/^\d{6}$/.test(String(otpCode).trim())) {
      return NextResponse.json(
        { error: { code: 'INVALID_OTP', message: 'Please enter a valid 6-digit verification code.' } },
        { status: 400 }
      );
    }

    // 2. Cryptographic OTP Verification
    const provider = getOtpProvider();
    const verifyResult = await provider.verifyOtp(authUser.phoneNumber, String(otpCode).trim());

    if (!verifyResult.success) {
      const status = verifyResult.code === 'RATE_LIMIT_EXCEEDED' ? 429 : 400;
      return NextResponse.json(
        { error: { code: verifyResult.code || 'AUTH_OTP_MISMATCH', message: verifyResult.message || 'Incorrect verification code.' } },
        { status }
      );
    }

    // 3. Execute authoritative relationship change
    let result;
    if (action === 'quit') {
      result = await quitClientTherapyRelationship(
        authUser.userId,
        reason || 'Client concluded therapy care cycle',
        notes || ''
      );
    } else {
      result = await changeClientTherapistRelationship(
        authUser.userId,
        reason || 'Personal fit / prefer a fresh clinical perspective',
        notes || ''
      );
    }

    return NextResponse.json({
      success: true,
      action,
      message:
        action === 'quit'
          ? 'Therapy relationship successfully concluded. Your records remain preserved.'
          : 'Therapist change confirmed. You can now select or rematch with a new clinician.',
      relationship: result.relationship,
    });
  } catch (err: any) {
    console.error('[Relationship Transition POST] Error:', err);
    return NextResponse.json(
      { error: { code: err.code || 'TRANSITION_ERROR', message: err.message || 'Failed to update relationship.' } },
      { status: err.status || 500 }
    );
  }
}
