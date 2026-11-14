import { NextRequest, NextResponse } from 'next/server';
import { TherapyClientAuthService } from '../../../../../lib/therapy/therapyClientAuthService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { phone } = body;

    if (!phone) {
      return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 });
    }

    const result = await TherapyClientAuthService.sendOtpForLogin(phone);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: result.message || 'OTP sent successfully to your phone.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send OTP.' }, { status: 500 });
  }
}
