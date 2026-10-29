import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { TherapistPlatformService } from '../../../../../lib/therapist/therapistPlatformService';
import { supabase } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);

    const [{ data: profile }, { data: blocks }] = await Promise.all([
      supabase
        .from('therapist_profiles')
        .select('availability_hours')
        .eq('therapist_account_id', account.id)
        .maybeSingle(),
      supabase
        .from('therapist_availability_blocks')
        .select('*')
        .eq('therapist_account_id', account.id),
    ]);

    return NextResponse.json({
      success: true,
      availabilityHours: profile?.availability_hours || {
        mon: ['09:00-17:00'],
        tue: ['09:00-17:00'],
        wed: ['09:00-17:00'],
        thu: ['09:00-17:00'],
        fri: ['09:00-17:00'],
        sat: [],
        sun: [],
      },
      blocks: blocks || [],
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'AVAILABILITY_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json().catch(() => ({}));
    const { availabilityHours } = body;

    if (!availabilityHours || typeof availabilityHours !== 'object') {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'availabilityHours object is required.' } },
        { status: 400 }
      );
    }

    // 1. Update therapist profile availability_hours
    const updatedProfile = await TherapistPlatformService.updateProfile(account.id, {
      availability_hours: availabilityHours,
    });

    // 2. Synchronize recurring availability blocks to therapist_availability_blocks
    const dayMap: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
    const recurringBlocks: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isRecurring: boolean;
      isBlocked: boolean;
    }> = [];

    for (const [dayKey, slotList] of Object.entries(availabilityHours)) {
      const dayIdx = dayMap[dayKey.toLowerCase()];
      if (dayIdx !== undefined && Array.isArray(slotList)) {
        for (const slotStr of slotList) {
          const [start, end] = String(slotStr).split('-');
          if (start && end) {
            recurringBlocks.push({
              dayOfWeek: dayIdx,
              startTime: start.trim(),
              endTime: end.trim() === '24:00' ? '23:59:59' : end.trim(),
              isRecurring: true,
              isBlocked: false,
            });
          }
        }
      }
    }

    await TherapistPlatformService.saveAvailabilityBlocks(account.id, recurringBlocks).catch((err) => {
      console.warn('[Availability API] Error syncing recurring blocks:', err);
    });

    return NextResponse.json({
      success: true,
      availabilityHours: updatedProfile.availability_hours,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'AVAILABILITY_UPDATE_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const body = await request.json().catch(() => ({}));
    const { blocks } = body;

    if (!Array.isArray(blocks)) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'blocks array is required.' } },
        { status: 400 }
      );
    }

    const saved = await TherapistPlatformService.saveAvailabilityBlocks(
      account.id,
      blocks
    );

    return NextResponse.json({ success: true, blocks: saved });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'AVAILABILITY_ERROR', message: err.message } },
      { status: err.status || 500 }
    );
  }
}
