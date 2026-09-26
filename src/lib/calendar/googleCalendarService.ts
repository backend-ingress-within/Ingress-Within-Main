import { GoogleAuthService } from './googleAuthService';

export interface CreateEventOptions {
  therapistAccountId: string;
  userId?: string;
  appointmentId: string;
  summary: string;
  description: string;
  startTime: string; // ISO
  endTime: string;   // ISO
  attendees: string[]; // Email addresses
}

export interface GoogleCalendarEventResult {
  eventId: string | null;
  meetUrl: string | null;
  conferenceId: string | null;
  syncStatus: 'synced' | 'failed' | 'not_connected';
  error?: string;
}

export class GoogleCalendarService {
  /**
   * Creates an event in the therapist's Google Calendar with an automatically generated Google Meet link.
   * Uses Google Calendar API conferenceData.createRequest with conferenceDataVersion=1.
   * 
   * Strict boundary: This application does NOT host video calls. It strictly relies on Google Meet.
   * If Google Calendar is not connected or fails, this returns gracefully without throwing,
   * ensuring clinical appointments and payments are never rolled back.
   */
  static async createEventWithMeet(options: CreateEventOptions): Promise<GoogleCalendarEventResult> {
    try {
      // 1. Get access token for therapist
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', options.therapistAccountId);

      if (!accessToken) {
        return {
          eventId: null,
          meetUrl: null,
          conferenceId: null,
          syncStatus: 'not_connected',
        };
      }

      // 2. Prepare event payload with Google Meet conferenceData
      const requestId = `ingress-meet-${options.appointmentId.substring(0, 18)}`;
      const eventPayload = {
        summary: options.summary || 'Ingress Within Therapy Session',
        description: options.description || 'Confidential clinical therapy session scheduled via Ingress Within.',
        start: { dateTime: options.startTime },
        end: { dateTime: options.endTime },
        attendees: options.attendees.filter(Boolean).map((email) => ({ email })),
        conferenceData: {
          createRequest: {
            requestId,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
      };

      // 3. Google Calendar API events.insert with conferenceDataVersion=1
      const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.warn(`[GoogleCalendarService] Failed to insert event: HTTP ${res.status} - ${errorText}`);
        return {
          eventId: null,
          meetUrl: null,
          conferenceId: null,
          syncStatus: 'failed',
          error: `HTTP ${res.status}: ${errorText}`,
        };
      }

      const event = await res.json();

      // 4. Extract Google Meet video link
      let meetUrl: string | null = null;
      let conferenceId: string | null = null;

      if (event.conferenceData) {
        conferenceId = event.conferenceData.conferenceId || null;
        const videoEntryPoint = event.conferenceData.entryPoints?.find(
          (ep: any) => ep.entryPointType === 'video'
        );
        if (videoEntryPoint?.uri) {
          meetUrl = videoEntryPoint.uri;
        } else if (event.hangoutLink) {
          meetUrl = event.hangoutLink;
        }
      }

      return {
        eventId: event.id || null,
        meetUrl,
        conferenceId,
        syncStatus: 'synced',
      };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Exception creating event with Google Meet:', err);
      return {
        eventId: null,
        meetUrl: null,
        conferenceId: null,
        syncStatus: 'failed',
        error: err.message || 'Unknown calendar error',
      };
    }
  }

  /**
   * Reschedules an existing Google Calendar event.
   */
  static async updateEventTimes(
    therapistAccountId: string,
    eventId: string,
    newStartTime: string,
    newEndTime: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
      if (!accessToken || !eventId) {
        return { success: false, error: 'Not connected or invalid event' };
      }

      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}?conferenceDataVersion=1`;
      const res = await fetch(url, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          start: { dateTime: newStartTime },
          end: { dateTime: newEndTime },
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.warn(`[GoogleCalendarService] Failed to update event: ${errText}`);
        return { success: false, error: errText };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Exception updating event:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Deletes an event from Google Calendar (on cancellation).
   */
  static async deleteEvent(
    therapistAccountId: string,
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
      if (!accessToken || !eventId) {
        return { success: false, error: 'Not connected or invalid event' };
      }

      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok && res.status !== 404) {
        const errText = await res.text();
        console.warn(`[GoogleCalendarService] Failed to delete event: ${errText}`);
        return { success: false, error: errText };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Exception deleting event:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Queries Google Calendar FreeBusy API to inspect external commitments.
   */
  static async getBusySlots(
    therapistAccountId: string,
    timeMin: string,
    timeMax: string
  ): Promise<Array<{ start: string; end: string }>> {
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
      if (!accessToken) {
        return [];
      }

      const url = 'https://www.googleapis.com/calendar/v3/freeBusy';
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timeMin,
          timeMax,
          items: [{ id: 'primary' }],
        }),
      });

      if (!res.ok) {
        return [];
      }

      const data = await res.json();
      const primaryBusy = data.calendars?.primary?.busy || [];
      return primaryBusy.map((b: any) => ({
        start: b.start,
        end: b.end,
      }));
    } catch (err) {
      console.warn('[GoogleCalendarService] Error fetching freebusy:', err);
      return [];
    }
  }
}
