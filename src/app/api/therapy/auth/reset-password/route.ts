import { NextRequest, NextResponse } from 'next/server';
import { TherapyClientAuthService, THERAPY_CLIENT_COOKIE_NAME, THERAPY_CLIENT_SESSION_EXPIRY_SECONDS } from '../../../../../lib/therapy/therapyClientAuthService';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone, code, newPassword, currentPassword } = body;

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: { message: 'Password must be at least 6 characters long.' } },
        { status: 400 }
      );
    }

    // Flow A: Phone OTP reset (unauthenticated or self-recovery)
    if (phone && code) {
      const resetResult = await TherapyClientAuthService.resetPasswordWithOtp(
        phone,
        code,
        newPassword
      );

      if (!resetResult.success || !resetResult.token) {
        return NextResponse.json(
          { error: { message: resetResult.error || 'Failed to reset password.' } },
          { status: 400 }
        );
      }

      const response = NextResponse.json({
        success: true,
        message: 'Password reset successfully.',
        client: resetResult.client,
      });

      response.cookies.set({
        name: THERAPY_CLIENT_COOKIE_NAME,
        value: resetResult.token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: THERAPY_CLIENT_SESSION_EXPIRY_SECONDS,
      });

      return response;
    }

    // Flow B: Authenticated client changing their password inside portal
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { message: 'Authentication or verification code is required to reset password.' } },
        { status: 401 }
      );
    }

    const changeResult = await TherapyClientAuthService.changeAuthenticatedPassword(
      authUser.userId,
      newPassword,
      currentPassword
    );

    if (!changeResult.success) {
      return NextResponse.json(
        { error: { message: changeResult.error || 'Failed to update password.' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
    });
  } catch (err: any) {
    console.error('[Therapy Reset Password] Error:', err);
    return NextResponse.json(
      { error: { message: err.message || 'Internal server error while resetting password.' } },
      { status: 500 }
    );
  }
}
