import { NextRequest, NextResponse } from 'next/server';
import { TherapyClientAuthService } from '../../../../../lib/therapy/therapyClientAuthService';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    if (!phone) {
      return NextResponse.json({ exists: false });
    }

    const check = await TherapyClientAuthService.checkPhoneExists(phone);
    return NextResponse.json(check);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Error checking phone number' }, { status: 500 });
  }
}
