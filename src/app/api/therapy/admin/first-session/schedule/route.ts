import { NextRequest, NextResponse } from 'next/server';
import { SessionBookingService } from '../../../../../../lib/therapy/sessionBookingService';
import { supabase } from '../../../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    // In production, verify admin API key or admin JWT role
    const body = await request.json();
    const { therapistAccountId, userId, slotStart, slotEnd, sessionType, modality, notes } = body;

    if (!therapistAccountId || !userId || !slotStart || !slotEnd) {
      return NextResponse.json(
        { error: { code: 'INVALID_PARAMETERS', message: 'therapistAccountId, userId, slotStart, and slotEnd are required.' } },
        { status: 400 }
      );
    }

    // Verify relationship exists
    const { data: rel } = await supabase
      .from('therapy_care_relationships')
      .select('id, status')
      .eq('therapist_account_id', therapistAccountId)
      .eq('user_id', userId)
      .maybeSingle();

    if (!rel) {
      return NextResponse.json(
        { error: { code: 'RELATIONSHIP_REQUIRED', message: 'No care relationship found. Therapist must accept client request first.' } },
        { status: 400 }
      );
    }

    const order = await SessionBookingService.createBookingOrder({
      userId,
      therapistAccountId,
      slotStart,
      slotEnd,
      sessionType: sessionType || 'video',
      modality: modality || 'telehealth',
      isFirstSessionCoordination: true,
      clientNotes: notes,
    });

    return NextResponse.json({
      success: true,
      coordinationStatus: 'order_created',
      ...order,
    }, { status: 201 });
  } catch (err: any) {
    const status = err.status || 500;
    return NextResponse.json(
      {
        error: {
          code: err.code || 'COORDINATION_FAILED',
          message: err.message || 'Failed to coordinate first session.',
        },
      },
      { status }
    );
  }
}
