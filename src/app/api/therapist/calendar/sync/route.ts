import { NextRequest, NextResponse } from 'next/server';
import { requireAuthorizedTherapist } from '../../../../../lib/therapist/therapistAuthHelper';
import { GoogleCalendarService } from '../../../../../lib/calendar/googleCalendarService';
import { supabase } from '../../../../../lib/db';

export async function POST(request: NextRequest) {
  try {
    const { account } = await requireAuthorizedTherapist(request);

    // Fetch upcoming active appointments for this therapist
    const nowIso = new Date().toISOString();
    const { data: upcomingAppts, error } = await supabase
      .from('therapist_clinical_appointments')
      .select('id, scheduled_start, calendar_sync_status, google_meet_url')
      .eq('therapist_account_id', account.id)
      .in('status', ['confirmed', 'scheduled'])
      .gte('scheduled_start', nowIso)
      .order('scheduled_start', { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: { code: 'FETCH_ERROR', message: error.message } },
        { status: 500 }
      );
    }

    let syncedCount = 0;
    const results: any[] = [];

    for (const appt of upcomingAppts || []) {
      const syncResult = await GoogleCalendarService.syncAppointmentToGoogle(appt.id);
      if (syncResult.success || syncResult.googleMeetUrl) {
        syncedCount++;
      }
      results.push({
        appointmentId: appt.id,
        syncStatus: syncResult.calendarSyncStatus,
        meetStatus: syncResult.googleMeetStatus,
        googleMeetUrl: syncResult.googleMeetUrl,
      });
    }

    return NextResponse.json({
      success: true,
      syncedCount,
      totalUpcoming: (upcomingAppts || []).length,
      results,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: err.code || 'SYNC_ERROR', message: err.message || 'Failed to sync calendar' } },
      { status: err.status || 500 }
    );
  }
}
