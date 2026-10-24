import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { GoogleCalendarService, doIntervalsOverlap } from '../../../../../lib/calendar/googleCalendarService';
import { supabase } from '../../../../../lib/db';

export async function GET(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);
    const searchParams = request.nextUrl.searchParams;
    const dateParam = searchParams.get('date') || new Date().toISOString().split('T')[0];
    const durationMinutes = Number(searchParams.get('duration')) || 50;

    // Validate date format YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return NextResponse.json(
        { error: { code: 'INVALID_DATE', message: 'Date must be in YYYY-MM-DD format.' } },
        { status: 400 }
      );
    }

    // 1. Determine day of week in Asia/Kolkata
    const targetDate = new Date(`${dateParam}T00:00:00+05:30`);
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    const fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeekIdx = targetDate.getDay();
    const dayKey = dayNames[dayOfWeekIdx];
    const fullDayName = fullDayNames[dayOfWeekIdx];

    // 2. Fetch therapist profile availability hours
    const { data: profile } = await supabase
      .from('therapist_profiles')
      .select('availability_hours')
      .eq('therapist_account_id', account.id)
      .maybeSingle();

    const hoursConfig = profile?.availability_hours;
    const dayRanges: string[] = (hoursConfig && typeof hoursConfig === 'object' && Array.isArray(hoursConfig[dayKey]))
      ? hoursConfig[dayKey]
      : (dayOfWeekIdx >= 1 && dayOfWeekIdx <= 5 ? ['09:00-17:00'] : []);

    if (dayRanges.length === 0) {
      return NextResponse.json({
        success: true,
        date: dateParam,
        dayOfWeek: fullDayName,
        isClosed: true,
        message: 'Therapist is closed on this day.',
        slots: [],
      });
    }

    // 3. Define date boundaries in UTC ISO
    const dayStartIso = new Date(`${dateParam}T00:00:00+05:30`).toISOString();
    const dayEndIso = new Date(`${dateParam}T23:59:59.999+05:30`).toISOString();

    // 4. Fetch existing commitments in parallel
    const [
      { data: appointments },
      { data: availBlocks },
      { data: pendingHolds },
      googleBusy,
    ] = await Promise.all([
      supabase
        .from('therapist_clinical_appointments')
        .select('id, scheduled_start, scheduled_end, status')
        .eq('therapist_account_id', account.id)
        .in('status', ['scheduled', 'confirmed', 'in_progress', 'rescheduled'])
        .lt('scheduled_start', dayEndIso)
        .gt('scheduled_end', dayStartIso),
      supabase
        .from('therapist_availability_blocks')
        .select('*')
        .eq('therapist_account_id', account.id)
        .eq('is_blocked', true),
      supabase
        .from('therapy_session_bookings')
        .select('id, slot_start, slot_end')
        .eq('therapist_account_id', account.id)
        .eq('booking_status', 'pending_payment')
        .gt('expires_at', new Date().toISOString())
        .lt('slot_start', dayEndIso)
        .gt('slot_end', dayStartIso),
      GoogleCalendarService.getBusySlots(account.id, dayStartIso, dayEndIso),
    ]);

    // 5. Generate discrete slots within configured working ranges
    const slots: Array<{
      id: string;
      start: string;
      end: string;
      startTimeStr: string;
      endTimeStr: string;
      formatted: string;
      available: boolean;
      conflictType?: 'past' | 'session_conflict' | 'google_calendar' | 'manual_block' | 'pending_hold';
      conflictReason?: string;
    }> = [];

    const nowMs = Date.now();
    const minLeadTimeMs = nowMs + 15 * 60 * 1000; // 15-minute minimum lead time for booking

    for (const range of dayRanges) {
      const [rStart, rEnd] = range.split('-').map((s) => s.trim());
      if (!rStart || !rEnd) continue;

      const [sHour, sMin = 0] = rStart.split(':').map(Number);
      const [eHour, eMin = 0] = rEnd.split(':').map(Number);

      let slotCursor = new Date(`${dateParam}T${String(sHour).padStart(2, '0')}:${String(sMin).padStart(2, '0')}:00+05:30`);
      const rangeEnd = new Date(`${dateParam}T${String(eHour).padStart(2, '0')}:${String(eMin).padStart(2, '0')}:00+05:30`);

      while (slotCursor.getTime() + durationMinutes * 60 * 1000 <= rangeEnd.getTime()) {
        const slotStart = new Date(slotCursor);
        const slotEnd = new Date(slotStart.getTime() + durationMinutes * 60 * 1000);

        const slotStartIso = slotStart.toISOString();
        const slotEndIso = slotEnd.toISOString();

        const startTimeStr = slotStart.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });
        const endTimeStr = slotEnd.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        });

        const formatted = `${startTimeStr} – ${endTimeStr}`;
        const slotId = `slot_${slotStart.getTime()}`;

        // Conflict checks
        let available = true;
        let conflictType: any = undefined;
        let conflictReason: string | undefined = undefined;

        // Check A: Past time
        if (slotStart.getTime() < minLeadTimeMs) {
          available = false;
          conflictType = 'past';
          conflictReason = 'Past Time';
        }

        // Check B: Existing clinical appointment
        if (available && appointments && appointments.length > 0) {
          const apptConflict = appointments.find((a: any) =>
            doIntervalsOverlap(slotStartIso, slotEndIso, a.scheduled_start, a.scheduled_end)
          );
          if (apptConflict) {
            available = false;
            conflictType = 'session_conflict';
            conflictReason = 'Booked Session';
          }
        }

        // Check C: Manual therapist leave / blocked window
        if (available && availBlocks && availBlocks.length > 0) {
          const blockConflict = availBlocks.find((b: any) => {
            if (!b.is_blocked) return false;
            if (b.specific_date && b.specific_date === dateParam) {
              const bStart = (b.start_time || '00:00:00').substring(0, 5);
              const bEnd = (b.end_time || '23:59:59').substring(0, 5);
              const [bStartH, bStartM = 0] = bStart.split(':').map(Number);
              const [bEndH, bEndM = 0] = bEnd.split(':').map(Number);
              const bStartDate = new Date(`${dateParam}T${String(bStartH).padStart(2, '0')}:${String(bStartM).padStart(2, '0')}:00+05:30`);
              const bEndDate = new Date(`${dateParam}T${String(bEndH).padStart(2, '0')}:${String(bEndM).padStart(2, '0')}:00+05:30`);
              return doIntervalsOverlap(slotStartIso, slotEndIso, bStartDate.toISOString(), bEndDate.toISOString());
            }
            if (b.is_recurring && b.day_of_week === dayOfWeekIdx) {
              const bStart = (b.start_time || '00:00:00').substring(0, 5);
              const bEnd = (b.end_time || '23:59:59').substring(0, 5);
              const [bStartH, bStartM = 0] = bStart.split(':').map(Number);
              const [bEndH, bEndM = 0] = bEnd.split(':').map(Number);
              const bStartDate = new Date(`${dateParam}T${String(bStartH).padStart(2, '0')}:${String(bStartM).padStart(2, '0')}:00+05:30`);
              const bEndDate = new Date(`${dateParam}T${String(bEndH).padStart(2, '0')}:${String(bEndM).padStart(2, '0')}:00+05:30`);
              return doIntervalsOverlap(slotStartIso, slotEndIso, bStartDate.toISOString(), bEndDate.toISOString());
            }
            return false;
          });

          if (blockConflict) {
            available = false;
            conflictType = 'manual_block';
            conflictReason = blockConflict.reason || 'Blocked Leave';
          }
        }

        // Check D: External Google Calendar busy slot
        if (available && googleBusy && googleBusy.length > 0) {
          const gConflict = googleBusy.find((gb) =>
            doIntervalsOverlap(slotStartIso, slotEndIso, gb.start, gb.end)
          );
          if (gConflict) {
            available = false;
            conflictType = 'google_calendar';
            conflictReason = 'Google Calendar Busy';
          }
        }

        // Check E: Pending Checkout Hold
        if (available && pendingHolds && pendingHolds.length > 0) {
          const holdConflict = pendingHolds.find((h: any) =>
            doIntervalsOverlap(slotStartIso, slotEndIso, h.slot_start, h.slot_end)
          );
          if (holdConflict) {
            available = false;
            conflictType = 'pending_hold';
            conflictReason = 'Pending Payment Hold';
          }
        }

        slots.push({
          id: slotId,
          start: slotStartIso,
          end: slotEndIso,
          startTimeStr,
          endTimeStr,
          formatted,
          available,
          conflictType,
          conflictReason,
        });

        // Step cursor forward by duration + 10 min buffer (or 60 mins)
        slotCursor = new Date(slotCursor.getTime() + 60 * 60 * 1000);
      }
    }

    return NextResponse.json({
      success: true,
      date: dateParam,
      dayOfWeek: fullDayName,
      isClosed: false,
      workingHours: dayRanges.join(', '),
      totalSlots: slots.length,
      availableCount: slots.filter((s) => s.available).length,
      slots,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'SLOTS_FETCH_ERROR', message: err.message || 'Failed to fetch slots' } },
      { status: err.status || 500 }
    );
  }
}
