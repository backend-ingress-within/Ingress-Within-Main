import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../../lib/auth-helper';
import { supabase } from '../../../../../lib/db';
import { isValidGoogleMeetUrl, GoogleCalendarService } from '../../../../../lib/calendar/googleCalendarService';
import { getSessionMeetingWindow } from '../../../../../utils/sessionMeetingUtils';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication required.' } },
        { status: 401 }
      );
    }

    // Fetch client appointments
    const { data: appts, error } = await supabase
      .from('therapist_clinical_appointments')
      .select(`
        id,
        scheduled_start,
        scheduled_end,
        status,
        session_type,
        modality,
        google_meet_url,
        google_meet_status,
        calendar_sync_status,
        attendance_status,
        refund_status,
        created_at,
        therapist_account_id
      `)
      .eq('user_id', authUser.userId)
      .order('scheduled_start', { ascending: false });

    if (error) {
      return NextResponse.json({ error: { code: 'FETCH_FAILED', message: error.message } }, { status: 500 });
    }

    // Enhance with therapist details & policy metrics
    const therapistIds = [...new Set((appts || []).map((a) => a.therapist_account_id))];
    let therapistsMap: Record<string, any> = {};

    if (therapistIds.length > 0) {
      const { data: therapists } = await supabase
        .from('therapist_accounts')
        .select(`
          id,
          therapist_profiles (full_name, title)
        `)
        .in('id', therapistIds);

      therapists?.forEach((t: any) => {
        const prof = Array.isArray(t.therapist_profiles) ? t.therapist_profiles[0] : t.therapist_profiles;
        therapistsMap[t.id] = {
          id: t.id,
          full_name: prof?.full_name || 'Assigned Therapist',
          title: prof?.title || 'Consultant Psychologist',
        };
      });
    }

    // Fetch SOAP notes for these sessions
    const apptIds = (appts || []).map((a) => a.id);
    let soapNotesMap: Record<string, any> = {};
    if (apptIds.length > 0) {
      try {
        const { data: soapNotes } = await supabase
          .from('therapist_soap_notes')
          .select('id, appointment_id, subjective, objective, assessment, plan, is_draft, finalized_at, created_at')
          .in('appointment_id', apptIds)
          .eq('user_id', authUser.userId);

        (soapNotes || []).forEach((sn: any) => {
          if (!soapNotesMap[sn.appointment_id] || sn.finalized_at) {
            soapNotesMap[sn.appointment_id] = sn;
          }
        });
      } catch (soapErr) {
        console.warn('[client/sessions] SOAP notes fetch notice:', soapErr);
      }
    }

    const now = Date.now();
    const formatted = (appts || []).map((appt) => {
      const startTime = new Date(appt.scheduled_start).getTime();
      const hoursRemaining = (startTime - now) / (1000 * 60 * 60);

      const isUpcoming = ['scheduled', 'confirmed', 'rescheduled'].includes(appt.status) && startTime > now;
      const canReschedule = isUpcoming && hoursRemaining >= 24;
      const canCancel = isUpcoming;
      const refundEligible = hoursRemaining >= 48;

      const therapist = therapistsMap[appt.therapist_account_id];
      const validMeetUrl = isValidGoogleMeetUrl(appt.google_meet_url)
        ? appt.google_meet_url
        : (appt.modality !== 'in_person' && appt.session_type !== 'in_person'
            ? GoogleCalendarService.getFallbackMeetUrl()
            : null);

      const meetingWindow = getSessionMeetingWindow(appt.scheduled_start, appt.scheduled_end);

      return {
        id: appt.id,
        scheduledStart: appt.scheduled_start,
        scheduledEnd: appt.scheduled_end,
        status: appt.status,
        sessionType: appt.session_type,
        modality: appt.modality,
        googleMeetUrl: validMeetUrl,
        googleMeetStatus: appt.google_meet_status || (validMeetUrl ? 'created' : 'none'),
        calendarSyncStatus: appt.calendar_sync_status,
        attendanceStatus: appt.attendance_status,
        refundStatus: appt.refund_status,
        canJoin: meetingWindow.canJoin,
        isJoinTooEarly: meetingWindow.isTooEarly,
        joinOpensAt: meetingWindow.joinOpensAt.toISOString(),
        joinOpensAtFormatted: meetingWindow.joinOpensAtFormatted,
        therapist: {
          id: appt.therapist_account_id,
          name: therapist?.full_name || 'Therapist',
        },
        policy: {
          canReschedule,
          canCancel,
          refundEligible,
          canJoin: meetingWindow.canJoin,
          isJoinTooEarly: meetingWindow.isTooEarly,
          joinOpensAt: meetingWindow.joinOpensAt.toISOString(),
          joinOpensAtFormatted: meetingWindow.joinOpensAtFormatted,
          hoursUntilSession: Math.round(hoursRemaining * 10) / 10,
        },
        soapNote: soapNotesMap[appt.id] ? {
          id: soapNotesMap[appt.id].id,
          subjective: soapNotesMap[appt.id].subjective,
          objective: soapNotesMap[appt.id].objective,
          assessment: soapNotesMap[appt.id].assessment,
          plan: soapNotesMap[appt.id].plan,
          isDraft: soapNotesMap[appt.id].is_draft,
          finalizedAt: soapNotesMap[appt.id].finalized_at || soapNotesMap[appt.id].created_at,
        } : null,
      };
    });

    return NextResponse.json({ success: true, sessions: formatted });
  } catch (err: any) {
    return NextResponse.json(
      { error: { code: 'CLIENT_SESSIONS_ERROR', message: err.message || 'Failed to retrieve sessions' } },
      { status: 500 }
    );
  }
}
