import { GoogleAuthService } from './googleAuthService';
import { supabase } from '../db';
import { ApiUsageService } from '../admin/apiUsageService';

export interface CreateEventOptions {
  therapistAccountId: string;
  userId?: string;
  appointmentId: string;
  summary: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  attendees: string[]; // Email addresses
  createMeetConference?: boolean;
}

export interface GoogleCalendarEventResult {
  eventId: string | null;
  meetUrl: string | null;
  conferenceId: string | null;
  syncStatus: 'synced' | 'pending' | 'failed' | 'not_connected';
  meetStatus: 'created' | 'generating' | 'failed' | 'not_connected' | 'none';
  error?: string;
}

export interface SyncAppointmentResult {
  success: boolean;
  appointmentId: string;
  eventId: string | null;
  googleMeetUrl: string | null;
  googleMeetConferenceId: string | null;
  googleMeetStatus: 'created' | 'generating' | 'failed' | 'not_connected' | 'none';
  calendarSyncStatus: 'synced' | 'pending' | 'failed' | 'not_connected';
  error?: string;
}

export interface ExternalCalendarEvent {
  id?: string;
  therapistAccountId: string;
  googleEventId: string;
  googleCalendarId?: string;
  summary: string;
  description?: string | null;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  isAllDay: boolean;
  transparency: 'opaque' | 'transparent';
  status: 'confirmed' | 'tentative' | 'cancelled';
  recurringEventId?: string | null;
  isRecurringInstance?: boolean;
  etag?: string | null;
  htmlLink?: string | null;
  rawEvent?: any;
  createdAt?: string;
  updatedAt?: string;
}

export interface SyncExternalEventsResult {
  success: boolean;
  syncedCount: number;
  deletedCount: number;
  nextSyncToken?: string;
  reconciledManagedEvents?: number;
  error?: string;
}

/**
 * Validates that a URL is a real, canonical Google Meet URL.
 * Strictly forbids custom subdomains, localhost, or non-Google domains.
 */
export function isValidGoogleMeetUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (trimmed.includes('ingresswithin.com') || trimmed.includes('localhost')) {
    return false;
  }
  // Standard format: https://meet.google.com/abc-defg-hij (with optional query parameters)
  return /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}(\?.*)?$/i.test(trimmed);
}

/**
 * Helper to convert Google Calendar start/end objects into standard UTC ISO strings.
 * Handles both standard timed events ({ dateTime }) and all-day events ({ date }).
 */
export function parseGoogleEventTime(
  eventTime: { dateTime?: string; date?: string } | undefined,
  isEnd: boolean,
  timeZone: string = 'Asia/Kolkata'
): string {
  if (!eventTime) {
    return new Date().toISOString();
  }

  // Case 1: Standard datetime (contains time component and timezone)
  if (eventTime.dateTime) {
    const d = new Date(eventTime.dateTime);
    return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
  }

  // Case 2: All-day event (date format: YYYY-MM-DD)
  if (eventTime.date) {
    const match = eventTime.date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) {
      return new Date(eventTime.date).toISOString();
    }
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);

    // Construct local midnight in India Standard Time (+05:30) or UTC fallback
    if (timeZone === 'Asia/Kolkata' || timeZone.includes('Kolkata') || timeZone.includes('Calcutta') || timeZone === '+05:30') {
      const utcOffsetMs = 5.5 * 60 * 60 * 1000;
      const baseUtcMs = Date.UTC(year, month, day, 0, 0, 0, 0);
      return new Date(baseUtcMs - utcOffsetMs).toISOString();
    }

    // Default UTC conversion
    const d = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
    return d.toISOString();
  }

  return new Date().toISOString();
}

/**
 * Checks whether two time intervals overlap.
 * Invariant: startA < endB && endA > startB
 */
export function doIntervalsOverlap(
  startA: string | number | Date,
  endA: string | number | Date,
  startB: string | number | Date,
  endB: string | number | Date
): boolean {
  const sA = new Date(startA).getTime();
  const eA = new Date(endA).getTime();
  const sB = new Date(startB).getTime();
  const eB = new Date(endB).getTime();

  return sA < eB && eA > sB;
}

export class GoogleCalendarService {
  /**
   * Fast In-Memory cache for external calendar events keyed by therapistAccountId.
   * Guarantees zero downtime and fast lookups even if database table migrations
   * are pending or remote schema cache is refreshing.
   */
  private static externalEventsCache: Map<string, ExternalCalendarEvent[]> = new Map();

  /**
   * Helper delay for polling
   */
  private static async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Retrieves an optional pre-configured static Google Meet room URL from environment.
   * If DEFAULT_GOOGLE_MEET_URL is configured and satisfies isValidGoogleMeetUrl, returns it.
   * Otherwise returns null (leaving consultation room link pending until provided or synced).
   */
  static getFallbackMeetUrl(): string | null {
    const defaultUrl = process.env.DEFAULT_GOOGLE_MEET_URL?.trim();
    if (defaultUrl && isValidGoogleMeetUrl(defaultUrl)) {
      return defaultUrl;
    }
    return null;
  }

  /**
   * @deprecated Google Meet rooms must be created via Google Calendar API or specified via DEFAULT_GOOGLE_MEET_URL.
   */
  static generateCanonicalMeetUrl(seedId?: string): string | null {
    return this.getFallbackMeetUrl();
  }

  /**
   * Extracts Google Meet video URL and conference ID from a Google Calendar event object.
   */
  private static extractMeetDetails(event: any): { meetUrl: string | null; conferenceId: string | null } {
    let meetUrl: string | null = null;
    let conferenceId: string | null = null;

    if (event?.conferenceData) {
      conferenceId = event.conferenceData.conferenceId || null;
      const videoEntryPoint = event.conferenceData.entryPoints?.find(
        (ep: any) => ep.entryPointType === 'video'
      );
      if (videoEntryPoint?.uri && isValidGoogleMeetUrl(videoEntryPoint.uri)) {
        meetUrl = videoEntryPoint.uri;
      }
    }

    if (!meetUrl && event?.hangoutLink && isValidGoogleMeetUrl(event.hangoutLink)) {
      meetUrl = event.hangoutLink;
    }

    return { meetUrl, conferenceId };
  }

  /**
   * Polls an existing Google Calendar event for asynchronous Google Meet conference completion.
   */
  private static async pollConferenceCreation(
    accessToken: string,
    eventId: string,
    maxAttempts: number = 3
  ): Promise<{ meetUrl: string | null; conferenceId: string | null; isPending: boolean }> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await this.sleep(attempt * 600); // 600ms, 1200ms, 1800ms
      try {
        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}?conferenceDataVersion=1`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (res.ok) {
          const event = await res.json();
          const { meetUrl, conferenceId } = this.extractMeetDetails(event);
          if (meetUrl) {
            return { meetUrl, conferenceId, isPending: false };
          }

          const status = event.conferenceData?.createRequest?.status?.statusCode;
          if (status && status !== 'pending' && status !== 'inProgress') {
            // Conference creation failed on Google's end
            return { meetUrl: null, conferenceId, isPending: false };
          }
        }
      } catch (pollErr) {
        console.warn(`[GoogleCalendarService] Conference poll attempt ${attempt} failed:`, pollErr);
      }
    }

    return { meetUrl: null, conferenceId: null, isPending: true };
  }

  /**
   * Identifies whether a Google Calendar event was created and managed by Ingress Within.
   * Checks extendedProperties, metadata, and description markers.
   */
  static isManagedIngressEvent(event: any): boolean {
    if (!event) return false;

    // Check private extendedProperties
    if (event.extendedProperties?.private?.ingress_appointment_id) return true;
    if (event.extendedProperties?.shared?.ingress_appointment_id) return true;

    // Check description markers
    if (typeof event.description === 'string' && event.description.includes('Ingress Within')) {
      return true;
    }

    // Check summary markers
    if (typeof event.summary === 'string' && event.summary.startsWith('Ingress Within Therapy Session')) {
      return true;
    }

    return false;
  }

  /**
   * Creates an event in the therapist's Google Calendar with an automatically generated Google Meet link.
   * Uses Google Calendar API conferenceData.createRequest with conferenceDataVersion=1.
   */
  static async createEventWithMeet(options: CreateEventOptions): Promise<GoogleCalendarEventResult> {
    try {
      // 1. Get valid access token for therapist
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', options.therapistAccountId);

      if (!accessToken) {
        return {
          eventId: null,
          meetUrl: null,
          conferenceId: null,
          syncStatus: 'not_connected',
          meetStatus: 'not_connected',
        };
      }

      // 2. Idempotency Check: Verify if appointment already has an active calendar event
      if (options.appointmentId) {
        const { data: appt } = await supabase
          .from('therapist_clinical_appointments')
          .select('google_calendar_event_id, google_meet_url, google_meet_conference_id, calendar_sync_status, google_meet_status')
          .eq('id', options.appointmentId)
          .maybeSingle();

        if (appt?.google_calendar_event_id) {
          // If already synced and has valid meet URL, return existing
          if (appt.google_meet_url && isValidGoogleMeetUrl(appt.google_meet_url)) {
            return {
              eventId: appt.google_calendar_event_id,
              meetUrl: appt.google_meet_url,
              conferenceId: appt.google_meet_conference_id,
              syncStatus: 'synced',
              meetStatus: 'created',
            };
          }

          // Otherwise poll Google to check if Meet has finished generating
          const pollResult = await this.pollConferenceCreation(accessToken, appt.google_calendar_event_id, 2);
          if (pollResult.meetUrl) {
            return {
              eventId: appt.google_calendar_event_id,
              meetUrl: pollResult.meetUrl,
              conferenceId: pollResult.conferenceId,
              syncStatus: 'synced',
              meetStatus: 'created',
            };
          } else if (pollResult.isPending) {
            return {
              eventId: appt.google_calendar_event_id,
              meetUrl: null,
              conferenceId: pollResult.conferenceId,
              syncStatus: 'pending',
              meetStatus: 'generating',
            };
          }
        }
      }

      const createMeet = options.createMeetConference !== false;

      // 3. Prepare event payload (attaching conferenceData only if createMeet is true)
      const eventPayload: any = {
        summary: options.summary || 'Ingress Within Therapy Session',
        description: options.description || 'Confidential clinical therapy session scheduled via Ingress Within.',
        start: { dateTime: options.startTime },
        end: { dateTime: options.endTime },
        attendees: options.attendees.filter(Boolean).map((email) => ({ email })),
        extendedProperties: {
          private: {
            ingress_appointment_id: options.appointmentId,
            ingress_therapist_account_id: options.therapistAccountId,
          },
        },
      };

      if (createMeet) {
        const sanitizedApptId = options.appointmentId.replace(/[^a-zA-Z0-9]/g, '');
        const requestId = `ingress_${sanitizedApptId.slice(0, 32)}`;
        eventPayload.conferenceData = {
          createRequest: {
            requestId,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        };
      }

      // 4. Google Calendar API events.insert
      const url = createMeet
        ? 'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1'
        : 'https://www.googleapis.com/calendar/v3/calendars/primary/events';

      const calStart = Date.now();
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      const calLatency = Date.now() - calStart;

      if (!res.ok) {
        const status = res.status;
        console.warn(`[GoogleCalendarService] Failed to insert event: HTTP ${status}`);

        ApiUsageService.recordEvent({
          provider: 'google_calendar',
          service: 'calendar_events',
          endpoint: 'googleapis.com/calendar/v3/events.insert',
          statusCode: status,
          success: false,
          latencyMs: calLatency,
          errorCategory: status === 401 ? 'AUTH_EXPIRED' : (status === 403 ? 'FORBIDDEN' : 'API_ERROR'),
        });

        return {
          eventId: null,
          meetUrl: null,
          conferenceId: null,
          syncStatus: 'failed',
          meetStatus: createMeet ? 'failed' : 'none',
          error: `HTTP_${status}`,
        };
      }

      ApiUsageService.recordEvent({
        provider: 'google_calendar',
        service: 'calendar_events',
        endpoint: 'googleapis.com/calendar/v3/events.insert',
        statusCode: 200,
        success: true,
        latencyMs: calLatency,
        metadata: { createMeetConference: createMeet },
      });

      const event = await res.json();
      let { meetUrl, conferenceId } = this.extractMeetDetails(event);

      // 5. If conference creation is still pending for telehealth, poll boundedly
      if (createMeet && !meetUrl && event.id) {
        const pollResult = await this.pollConferenceCreation(accessToken, event.id, 3);
        if (pollResult.meetUrl) {
          meetUrl = pollResult.meetUrl;
          conferenceId = pollResult.conferenceId || conferenceId;
        } else if (pollResult.isPending) {
          return {
            eventId: event.id,
            meetUrl: null,
            conferenceId,
            syncStatus: 'pending',
            meetStatus: 'generating',
          };
        }
      }

      const isMeetReady = Boolean(meetUrl);

      return {
        eventId: event.id || null,
        meetUrl,
        conferenceId,
        syncStatus: 'synced',
        meetStatus: createMeet ? (isMeetReady ? 'created' : 'failed') : 'none',
      };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Safe failure during event creation:', err.message || 'unknown');
      ApiUsageService.recordEvent({
        provider: 'google_calendar',
        service: 'calendar_events',
        endpoint: 'googleapis.com/calendar/v3/events.insert',
        statusCode: 500,
        success: false,
        errorCategory: 'NETWORK_EXCEPTION',
      });
      return {
        eventId: null,
        meetUrl: null,
        conferenceId: null,
        syncStatus: 'failed',
        meetStatus: 'failed',
        error: err.code || 'CALENDAR_SERVICE_EXCEPTION',
      };
    }
  }

  /**
   * Canonical orchestration method to sync an Ingress Within clinical appointment to Google Calendar.
   */
  static async syncAppointmentToGoogle(
    appointmentId: string,
    options: { summary?: string; description?: string; createMeetConference?: boolean } = {}
  ): Promise<SyncAppointmentResult> {
    try {
      if (!appointmentId) {
        return {
          success: false,
          appointmentId: '',
          eventId: null,
          googleMeetUrl: null,
          googleMeetConferenceId: null,
          googleMeetStatus: 'failed',
          calendarSyncStatus: 'failed',
          error: 'MISSING_APPOINTMENT_ID',
        };
      }

      // 1. Fetch appointment details
      const { data: appt, error: apptErr } = await supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (apptErr || !appt) {
        return {
          success: false,
          appointmentId,
          eventId: null,
          googleMeetUrl: null,
          googleMeetConferenceId: null,
          googleMeetStatus: 'failed',
          calendarSyncStatus: 'failed',
          error: 'APPOINTMENT_NOT_FOUND',
        };
      }

      if (appt.status === 'cancelled') {
        return {
          success: false,
          appointmentId,
          eventId: appt.google_calendar_event_id || null,
          googleMeetUrl: null,
          googleMeetConferenceId: null,
          googleMeetStatus: 'none',
          calendarSyncStatus: 'not_connected',
          error: 'APPOINTMENT_CANCELLED',
        };
      }

      // 2. Fetch therapist and client identity
      const [
        { data: therapistProfile },
        { data: clientUser },
        { data: bookingRecord },
      ] = await Promise.all([
        supabase
          .from('therapist_profiles')
          .select('full_name, contact_email')
          .eq('therapist_account_id', appt.therapist_account_id)
          .maybeSingle(),
        supabase
          .from('users')
          .select('id, name, phone_number')
          .eq('id', appt.user_id)
          .maybeSingle(),
        appt.booking_id
          ? supabase
              .from('therapy_session_bookings')
              .select('metadata')
              .eq('id', appt.booking_id)
              .maybeSingle()
          : Promise.resolve({ data: null }),
      ]);

      const clientName = clientUser?.name || 'Client';
      const therapistName = therapistProfile?.full_name || 'Therapist';
      const clientEmail = (bookingRecord?.metadata as any)?.client_email || (bookingRecord?.metadata as any)?.clientEmail || null;
      const therapistEmail = therapistProfile?.contact_email || null;

      const isTelehealth = appt.modality !== 'in_person' && appt.session_type !== 'in_person';
      const shouldCreateMeet = options.createMeetConference ?? isTelehealth;

      const summary = options.summary || `Ingress Within Therapy Session: ${clientName} & ${therapistName}`;
      const description = options.description || (isTelehealth
        ? `Confidential clinical telehealth session scheduled via Ingress Within.\nClient: ${clientName}\nTherapist: ${therapistName}`
        : `Confidential clinical in-person therapy session scheduled via Ingress Within.\nClient: ${clientName}\nTherapist: ${therapistName}`);

      const attendees = [therapistEmail, clientEmail].filter(Boolean) as string[];

      // 3. Create or reconcile event in Google Calendar
      const eventResult = await this.createEventWithMeet({
        therapistAccountId: appt.therapist_account_id,
        userId: appt.user_id,
        appointmentId: appt.id,
        summary,
        description,
        startTime: appt.scheduled_start,
        endTime: appt.scheduled_end,
        attendees,
        createMeetConference: shouldCreateMeet,
      });

      // 4. Update appointment in database with real results
      const finalMeetUrl = eventResult.meetUrl;
      const finalSyncStatus = eventResult.syncStatus;
      const finalMeetStatus = eventResult.meetStatus;

      await supabase
        .from('therapist_clinical_appointments')
        .update({
          google_calendar_event_id: eventResult.eventId || appt.google_calendar_event_id || null,
          google_meet_url: finalMeetUrl,
          google_meet_conference_id: eventResult.conferenceId || appt.google_meet_conference_id || null,
          google_meet_status: finalMeetStatus,
          calendar_sync_status: finalSyncStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', appt.id);

      return {
        success: finalSyncStatus === 'synced',
        appointmentId: appt.id,
        eventId: eventResult.eventId || appt.google_calendar_event_id || null,
        googleMeetUrl: finalMeetUrl,
        googleMeetConferenceId: eventResult.conferenceId || appt.google_meet_conference_id || null,
        googleMeetStatus: finalMeetStatus,
        calendarSyncStatus: finalSyncStatus,
      };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Safe sync failure:', err.message || 'unknown');
      return {
        success: false,
        appointmentId,
        eventId: null,
        googleMeetUrl: null,
        googleMeetConferenceId: null,
        googleMeetStatus: 'failed',
        calendarSyncStatus: 'failed',
        error: err.code || 'SYNC_EXCEPTION',
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
        return { success: false, error: 'NOT_CONNECTED_OR_MISSING_EVENT' };
      }

      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`;
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
        console.warn(`[GoogleCalendarService] Failed to reschedule event: HTTP ${res.status}`);
        return { success: false, error: `HTTP_${res.status}` };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Safe failure updating event times:', err.message || 'unknown');
      return { success: false, error: err.code || 'UPDATE_EXCEPTION' };
    }
  }

  /**
   * Deletes an event from Google Calendar on cancellation.
   */
  static async deleteEvent(
    therapistAccountId: string,
    eventId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
      if (!accessToken || !eventId) {
        return { success: true }; // Nothing to delete
      }

      const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`;
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!res.ok && res.status !== 404) {
        console.warn(`[GoogleCalendarService] Failed to delete event: HTTP ${res.status}`);
        return { success: false, error: `HTTP_${res.status}` };
      }

      return { success: true };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Safe failure deleting event:', err.message || 'unknown');
      return { success: false, error: err.code || 'DELETE_EXCEPTION' };
    }
  }

  // ===========================================================================
  // TWO-WAY SYNCHRONIZATION ENGINE & EXTERNAL EVENT INGESTION
  // ===========================================================================

  /**
   * Internal cache manager for external events.
   */
  static getCachedExternalEvents(
    therapistAccountId: string,
    timeMin?: string,
    timeMax?: string
  ): ExternalCalendarEvent[] {
    const list = this.externalEventsCache.get(therapistAccountId) || [];
    if (!timeMin && !timeMax) return list;

    const minMs = timeMin ? new Date(timeMin).getTime() : -Infinity;
    const maxMs = timeMax ? new Date(timeMax).getTime() : Infinity;

    return list.filter((e) => {
      const startMs = new Date(e.startTime).getTime();
      const endMs = new Date(e.endTime).getTime();
      return startMs < maxMs && endMs > minMs && e.status !== 'cancelled';
    });
  }

  /**
   * Upserts external events into in-memory cache and attempts database storage.
   */
  static async persistExternalEvents(
    therapistAccountId: string,
    events: ExternalCalendarEvent[]
  ): Promise<void> {
    if (!therapistAccountId || events.length === 0) return;

    // 1. Update in-memory cache
    const current = this.externalEventsCache.get(therapistAccountId) || [];
    const map = new Map<string, ExternalCalendarEvent>();
    for (const item of current) {
      map.set(item.googleEventId, item);
    }
    for (const item of events) {
      if (item.status === 'cancelled') {
        map.delete(item.googleEventId);
      } else {
        map.set(item.googleEventId, item);
      }
    }
    this.externalEventsCache.set(therapistAccountId, Array.from(map.values()));

    // 2. Persist to database if table exists
    try {
      const rows = events
        .filter((e) => e.status !== 'cancelled')
        .map((e) => ({
          therapist_account_id: therapistAccountId,
          google_event_id: e.googleEventId,
          google_calendar_id: e.googleCalendarId || 'primary',
          summary: e.summary,
          description: e.description || null,
          start_time: e.startTime,
          end_time: e.endTime,
          is_all_day: e.isAllDay,
          transparency: e.transparency,
          status: e.status,
          recurring_event_id: e.recurringEventId || null,
          is_recurring_instance: Boolean(e.isRecurringInstance),
          etag: e.etag || null,
          html_link: e.htmlLink || null,
          updated_at: new Date().toISOString(),
        }));

      if (rows.length > 0) {
        await supabase
          .from('therapist_external_calendar_events')
          .upsert(rows, { onConflict: 'therapist_account_id,google_event_id' });
      }
    } catch (err: any) {
      // Graceful fallback: table might not exist in older environments
      // The robust in-memory cache handles all requests safely.
    }
  }

  /**
   * Deletes an external event from cache and database.
   */
  static async deleteExternalEvent(
    therapistAccountId: string,
    googleEventId: string
  ): Promise<void> {
    if (!therapistAccountId || !googleEventId) return;

    // Update in-memory cache
    const current = this.externalEventsCache.get(therapistAccountId) || [];
    this.externalEventsCache.set(
      therapistAccountId,
      current.filter((e) => e.googleEventId !== googleEventId)
    );

    // Database deletion
    try {
      await supabase
        .from('therapist_external_calendar_events')
        .delete()
        .eq('therapist_account_id', therapistAccountId)
        .eq('google_event_id', googleEventId);
    } catch {
      // Non-blocking fallback
    }
  }

  /**
   * Fetches events directly from the therapist's Google Calendar using events.list API.
   * Supports incremental synchronization via syncToken and bounded date queries.
   */
  static async fetchExternalEventsFromGoogle(
    therapistAccountId: string,
    options: {
      timeMin?: string;
      timeMax?: string;
      syncToken?: string;
      calendarId?: string;
    } = {}
  ): Promise<{
    events: ExternalCalendarEvent[];
    cancelledEventIds: string[];
    managedEventReconciliations: Array<{ eventId: string; status: string }>;
    nextSyncToken?: string;
    syncTokenExpired?: boolean;
    calendarTimeZone?: string;
  }> {
    const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
    if (!accessToken) {
      return {
        events: [],
        cancelledEventIds: [],
        managedEventReconciliations: [],
      };
    }

    const calendarId = options.calendarId || 'primary';
    const baseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`;

    const allEvents: ExternalCalendarEvent[] = [];
    const cancelledEventIds: string[] = [];
    const managedEventReconciliations: Array<{ eventId: string; status: string }> = [];
    let pageToken: string | undefined = undefined;
    let nextSyncToken: string | undefined = undefined;
    let calendarTimeZone: string = 'Asia/Kolkata';

    // Query Ingress-managed appointment Google event IDs to avoid duplicates
    const { data: managedAppts } = await supabase
      .from('therapist_clinical_appointments')
      .select('id, google_calendar_event_id, status')
      .eq('therapist_account_id', therapistAccountId)
      .not('google_calendar_event_id', 'is', null);

    const managedEventIdSet = new Set<string>();
    const managedEventMap = new Map<string, any>();
    for (const a of managedAppts || []) {
      if (a.google_calendar_event_id) {
        managedEventIdSet.add(a.google_calendar_event_id);
        managedEventMap.set(a.google_calendar_event_id, a);
      }
    }

    // Default window: -30 days to +60 days if syncToken not provided
    const defaultTimeMin = options.timeMin || new Date(Date.now() - 30 * 86400000).toISOString();
    const defaultTimeMax = options.timeMax || new Date(Date.now() + 60 * 86400000).toISOString();

    do {
      const url = new URL(baseUrl);
      url.searchParams.set('singleEvents', 'true');
      url.searchParams.set('showDeleted', 'true');
      url.searchParams.set('maxResults', '250');

      if (options.syncToken) {
        url.searchParams.set('syncToken', options.syncToken);
      } else {
        url.searchParams.set('timeMin', defaultTimeMin);
        url.searchParams.set('timeMax', defaultTimeMax);
      }

      if (pageToken) {
        url.searchParams.set('pageToken', pageToken);
      }

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Handle 410 Gone (expired or invalid sync token per Google Calendar API spec)
      if (res.status === 410) {
        console.warn(`[GoogleCalendarService] Sync token expired (HTTP 410) for therapist ${therapistAccountId}. Triggering full resync.`);
        return {
          events: [],
          cancelledEventIds: [],
          managedEventReconciliations: [],
          syncTokenExpired: true,
        };
      }

      if (!res.ok) {
        console.warn(`[GoogleCalendarService] events.list returned HTTP ${res.status}`);
        break;
      }

      const data = await res.json();
      calendarTimeZone = data.timeZone || calendarTimeZone;
      pageToken = data.nextPageToken;
      nextSyncToken = data.nextSyncToken || nextSyncToken;

      const items = data.items || [];
      for (const item of items) {
        const isManaged = this.isManagedIngressEvent(item) || managedEventIdSet.has(item.id);

        if (isManaged) {
          // BI-DIRECTIONAL SAFETY INVARIANT:
          // Deleting or editing a managed event in Google Calendar must NOT cancel paid appointments or trigger refunds.
          if (item.status === 'cancelled') {
            managedEventReconciliations.push({ eventId: item.id, status: 'cancelled' });
            // Safe desync record: update calendar_sync_status without modifying clinical status
            const appt = managedEventMap.get(item.id);
            if (appt && appt.status !== 'cancelled') {
              await supabase
                .from('therapist_clinical_appointments')
                .update({
                  calendar_sync_status: 'failed',
                  updated_at: new Date().toISOString(),
                })
                .eq('id', appt.id);
            }
          }
          continue; // Skip adding to external events list
        }

        // External Google Calendar Event
        if (item.status === 'cancelled') {
          cancelledEventIds.push(item.id);
          continue;
        }

        const isAllDay = Boolean(item.start?.date && !item.start?.dateTime);
        const startTime = parseGoogleEventTime(item.start, false, calendarTimeZone);
        const endTime = parseGoogleEventTime(item.end, true, calendarTimeZone);

        // Sanitize minimal event summary to protect therapist privacy
        const summary = (item.summary || '').trim() || 'Busy';

        allEvents.push({
          therapistAccountId,
          googleEventId: item.id,
          googleCalendarId: calendarId,
          summary,
          description: item.description || null,
          startTime,
          endTime,
          isAllDay,
          transparency: item.transparency === 'transparent' ? 'transparent' : 'opaque',
          status: item.status || 'confirmed',
          recurringEventId: item.recurringEventId || null,
          isRecurringInstance: Boolean(item.recurringEventId),
          etag: item.etag || null,
          htmlLink: item.htmlLink || null,
          rawEvent: item,
        });
      }
    } while (pageToken);

    return {
      events: allEvents,
      cancelledEventIds,
      managedEventReconciliations,
      nextSyncToken,
      calendarTimeZone,
    };
  }

  /**
   * Canonical Two-Way Sync Orchestration.
   * Synchronizes external Google Calendar events into Ingress Within with sync tokens,
   * handles 410 Gone recovery, upserts external events, and updates connection metadata.
   */
  static async syncExternalEvents(
    therapistAccountId: string,
    options: { forceFullSync?: boolean; calendarId?: string } = {}
  ): Promise<SyncExternalEventsResult> {
    try {
      // 1. Fetch connection record
      const { data: conn } = await supabase
        .from('google_calendar_connections')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .eq('account_type', 'therapist')
        .maybeSingle();

      if (!conn || conn.sync_status !== 'connected') {
        return {
          success: false,
          syncedCount: 0,
          deletedCount: 0,
          error: 'GOOGLE_CALENDAR_NOT_CONNECTED',
        };
      }

      const existingSyncToken = options.forceFullSync
        ? undefined
        : ((conn.metadata as any)?.next_sync_token || conn.next_sync_token || undefined);

      // 2. Fetch events from Google
      let fetchResult = await this.fetchExternalEventsFromGoogle(therapistAccountId, {
        syncToken: existingSyncToken,
        calendarId: options.calendarId || conn.calendar_id || 'primary',
      });

      // 3. If sync token was expired (HTTP 410), perform immediate full resync
      if (fetchResult.syncTokenExpired) {
        fetchResult = await this.fetchExternalEventsFromGoogle(therapistAccountId, {
          syncToken: undefined,
          calendarId: options.calendarId || conn.calendar_id || 'primary',
        });
      }

      // 4. Persist active external events
      if (fetchResult.events.length > 0) {
        await this.persistExternalEvents(therapistAccountId, fetchResult.events);
      }

      // 5. Remove cancelled external events
      for (const cancelledId of fetchResult.cancelledEventIds) {
        await this.deleteExternalEvent(therapistAccountId, cancelledId);
      }

      // 6. Update connection metadata and last sync timestamp
      const updatedMetadata = {
        ...(conn.metadata || {}),
        next_sync_token: fetchResult.nextSyncToken || existingSyncToken || null,
        last_external_sync_at: new Date().toISOString(),
      };

      await supabase
        .from('google_calendar_connections')
        .update({
          metadata: updatedMetadata,
          last_synced_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', conn.id);

      return {
        success: true,
        syncedCount: fetchResult.events.length,
        deletedCount: fetchResult.cancelledEventIds.length,
        nextSyncToken: fetchResult.nextSyncToken,
        reconciledManagedEvents: fetchResult.managedEventReconciliations.length,
      };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Safe syncExternalEvents error:', err.message || err);
      return {
        success: false,
        syncedCount: 0,
        deletedCount: 0,
        error: err.code || err.message || 'EXTERNAL_SYNC_FAILED',
      };
    }
  }

  /**
   * Retrieves sanitized external events for a therapist within a date range.
   * Strictly respects privacy boundaries: external events are only exposed to the authorized therapist.
   */
  static async getExternalEvents(
    therapistAccountId: string,
    startDateIso: string,
    endDateIso: string,
    options: { includeTransparent?: boolean } = {}
  ): Promise<ExternalCalendarEvent[]> {
    if (!therapistAccountId) return [];

    let events: ExternalCalendarEvent[] = [];

    // 1. Try querying database
    try {
      let query = supabase
        .from('therapist_external_calendar_events')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .neq('status', 'cancelled')
        .lt('start_time', endDateIso)
        .gt('end_time', startDateIso);

      if (!options.includeTransparent) {
        query = query.neq('transparency', 'transparent');
      }

      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        events = data.map((d: any) => ({
          id: d.id,
          therapistAccountId: d.therapist_account_id,
          googleEventId: d.google_event_id,
          summary: d.summary || 'Google Calendar Event',
          startTime: d.start_time,
          endTime: d.end_time,
          isAllDay: Boolean(d.is_all_day),
          transparency: d.transparency || 'opaque',
          status: d.status || 'confirmed',
          recurringEventId: d.recurring_event_id,
          isRecurringInstance: Boolean(d.is_recurring_instance),
        }));
      }
    } catch {
      // Non-blocking fallback
    }

    // 2. If database yielded empty or failed, fallback to memory cache
    if (events.length === 0) {
      events = this.getCachedExternalEvents(therapistAccountId, startDateIso, endDateIso);
      if (!options.includeTransparent) {
        events = events.filter((e) => e.transparency !== 'transparent');
      }
    }

    // Sort chronologically
    return events.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }

  /**
   * Queries Google Calendar FreeBusy API to inspect availability with FAIL-SAFE local fallback.
   * 
   * STRICT PRIVACY BOUNDARY:
   * Only returns an array of { start: string, end: string }.
   * NEVER returns event titles, descriptions, attendees, organizer, location, or Google event IDs.
   * 
   * FAIL-SAFE AVAILABILITY GUARANTEE:
   * If Google Calendar is temporarily unreachable, rate-limited, or token expired,
   * falls back to locally cached external events so busy intervals are NOT falsely treated as free!
   */
  static async getBusySlots(
    accountTypeOrId: 'therapist' | 'user' | string,
    idOrTimeMin: string,
    timeMinOrMax: string,
    timeMaxOptional?: string
  ): Promise<Array<{ start: string; end: string }>> {
    let accountType: 'therapist' | 'user' = 'therapist';
    let accountId = '';
    let timeMin = '';
    let timeMax = '';

    if (accountTypeOrId === 'therapist' || accountTypeOrId === 'user') {
      accountType = accountTypeOrId;
      accountId = idOrTimeMin;
      timeMin = timeMinOrMax;
      timeMax = timeMaxOptional || '';
    } else {
      accountType = 'therapist';
      accountId = accountTypeOrId;
      timeMin = idOrTimeMin;
      timeMax = timeMinOrMax;
    }

    const busySlots: Array<{ start: string; end: string }> = [];

    // 1. Live Google Calendar FreeBusy Query
    let liveQuerySucceeded = false;
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken(accountType, accountId);
      if (accessToken) {
        const calStart = Date.now();
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

        const calLatency = Date.now() - calStart;

        if (res.ok) {
          liveQuerySucceeded = true;
          ApiUsageService.recordEvent({
            provider: 'google_calendar',
            service: 'calendar_availability',
            endpoint: 'googleapis.com/calendar/v3/freeBusy',
            statusCode: 200,
            success: true,
            latencyMs: calLatency,
          });

          const data = await res.json();
          const primaryBusy = data.calendars?.primary?.busy || [];

          for (const b of primaryBusy) {
            busySlots.push({
              start: String(b.start),
              end: String(b.end),
            });
          }
        } else {
          ApiUsageService.recordEvent({
            provider: 'google_calendar',
            service: 'calendar_availability',
            endpoint: 'googleapis.com/calendar/v3/freeBusy',
            statusCode: res.status,
            success: false,
            latencyMs: calLatency,
            errorCategory: res.status === 401 ? 'AUTH_EXPIRED' : 'API_ERROR',
          });
        }
      }
    } catch (err: any) {
      console.warn('[GoogleCalendarService] FreeBusy query exception:', err.message || 'unknown');
    }

    // 2. Fail-safe & cached external events merge:
    // If live query did not succeed, or to guarantee cached external commitments are protected:
    if (accountType === 'therapist') {
      const cachedEvents = await this.getExternalEvents(accountId, timeMin, timeMax);
      for (const ev of cachedEvents) {
        if (ev.transparency === 'transparent' || ev.status === 'cancelled') continue;

        // Check if interval is already covered
        const alreadyCovered = busySlots.some((s) =>
          doIntervalsOverlap(s.start, s.end, ev.startTime, ev.endTime)
        );
        if (!alreadyCovered) {
          busySlots.push({
            start: ev.startTime,
            end: ev.endTime,
          });
        }
      }
    }

    // Sanitization: Exclusively map start and end. Strip all potential external metadata!
    return busySlots.map((b) => ({
      start: String(b.start),
      end: String(b.end),
    }));
  }

  /**
   * Registers a Google Calendar push notification watch channel for real-time webhooks.
   */
  static async watchCalendar(
    therapistAccountId: string,
    webhookUrl: string
  ): Promise<{ success: boolean; channelId?: string; resourceId?: string; expiration?: string; error?: string }> {
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
      if (!accessToken) {
        return { success: false, error: 'NOT_CONNECTED' };
      }

      const channelId = `ch_${therapistAccountId.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;
      const channelToken = `tok_${therapistAccountId.replace(/[^a-zA-Z0-9]/g, '')}_${Date.now()}`;

      const watchRes = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events/watch', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: channelId,
          type: 'web_hook',
          address: webhookUrl,
          token: channelToken,
          params: { ttl: '604800' }, // 7 days
        }),
      });

      if (!watchRes.ok) {
        console.warn(`[GoogleCalendarService] Watch channel registration failed: HTTP ${watchRes.status}`);
        return { success: false, error: `HTTP_${watchRes.status}` };
      }

      const watchData = await watchRes.json();

      // Update connection with webhook details
      const { data: conn } = await supabase
        .from('google_calendar_connections')
        .select('id, metadata')
        .eq('therapist_account_id', therapistAccountId)
        .maybeSingle();

      if (conn) {
        const metadata = {
          ...(conn.metadata || {}),
          webhook_channel_id: channelId,
          webhook_resource_id: watchData.resourceId,
          webhook_channel_token: channelToken,
          webhook_channel_expiration: watchData.expiration ? new Date(Number(watchData.expiration)).toISOString() : null,
        };

        await supabase
          .from('google_calendar_connections')
          .update({ metadata, updated_at: new Date().toISOString() })
          .eq('id', conn.id);
      }

      return {
        success: true,
        channelId,
        resourceId: watchData.resourceId,
        expiration: watchData.expiration,
      };
    } catch (err: any) {
      console.error('[GoogleCalendarService] Safe watchCalendar error:', err.message || err);
      return { success: false, error: err.code || 'WATCH_FAILED' };
    }
  }

  /**
   * Stops an active Google Calendar push notification watch channel.
   */
  static async stopWatchChannel(
    therapistAccountId: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const accessToken = await GoogleAuthService.getValidAccessToken('therapist', therapistAccountId);
      const { data: conn } = await supabase
        .from('google_calendar_connections')
        .select('id, metadata')
        .eq('therapist_account_id', therapistAccountId)
        .maybeSingle();

      const meta = conn?.metadata as any;
      if (!accessToken || !meta?.webhook_channel_id || !meta?.webhook_resource_id) {
        return { success: true };
      }

      const res = await fetch('https://www.googleapis.com/calendar/v3/channels/stop', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: meta.webhook_channel_id,
          resourceId: meta.webhook_resource_id,
        }),
      });

      if (conn?.id) {
        const updatedMeta = { ...meta };
        delete updatedMeta.webhook_channel_id;
        delete updatedMeta.webhook_resource_id;
        delete updatedMeta.webhook_channel_token;
        delete updatedMeta.webhook_channel_expiration;

        await supabase
          .from('google_calendar_connections')
          .update({ metadata: updatedMeta, updated_at: new Date().toISOString() })
          .eq('id', conn.id);
      }

      return { success: res.ok };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  /**
   * Handles incoming Google Calendar push notification webhook.
   */
  static async handleWebhookNotification(headers: Record<string, string | string[] | undefined>): Promise<{
    acknowledged: boolean;
    state: string;
    therapistAccountId?: string;
  }> {
    const channelId = Array.isArray(headers['x-goog-channel-id'])
      ? headers['x-goog-channel-id'][0]
      : headers['x-goog-channel-id'];
    const resourceState = Array.isArray(headers['x-goog-resource-state'])
      ? headers['x-goog-resource-state'][0]
      : headers['x-goog-resource-state'] || 'unknown';
    const channelToken = Array.isArray(headers['x-goog-channel-token'])
      ? headers['x-goog-channel-token'][0]
      : headers['x-goog-channel-token'];

    if (!channelId) {
      return { acknowledged: false, state: resourceState };
    }

    // Handshake / sync verification message
    if (resourceState === 'sync') {
      return { acknowledged: true, state: 'sync' };
    }

    // Locate matching connection
    const { data: connections } = await supabase
      .from('google_calendar_connections')
      .select('therapist_account_id, metadata')
      .eq('sync_status', 'connected');

    let matchingTherapistId: string | null = null;
    for (const c of connections || []) {
      const meta = c.metadata as any;
      if (meta?.webhook_channel_id === channelId) {
        if (!channelToken || meta?.webhook_channel_token === channelToken) {
          matchingTherapistId = c.therapist_account_id;
          break;
        }
      }
    }

    if (matchingTherapistId && (resourceState === 'exists' || resourceState === 'not_exists')) {
      // Trigger incremental synchronization in background
      this.syncExternalEvents(matchingTherapistId).catch((syncErr) => {
        console.warn(`[GoogleCalendarWebhook] Background incremental sync error for ${matchingTherapistId}:`, syncErr);
      });
    }

    return {
      acknowledged: true,
      state: resourceState,
      therapistAccountId: matchingTherapistId || undefined,
    };
  }
}
