import crypto from 'crypto';
import { supabase } from '../db';
import { BillingService } from '../billing/billingService';
import { GoogleCalendarService, isValidGoogleMeetUrl } from '../calendar/googleCalendarService';
import { EmailService } from '../email/emailService';
import { EmailEvents } from '../email/emailEvents';
import { TherapistPayoutService } from '../therapist/therapistPayoutService';
import { AdminAuditService } from '../admin/adminAuditService';
import {
  RelationshipBookingLinkService,
  verifyClientConsent,
} from './relationshipBookingLinkService';

export interface CreateGuestBookingOrderInput {
  token: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  slotStart: string;
  slotEnd: string;
  sessionType?: string;
  modality?: string;
  clientNotes?: string | null;
  idempotencyKey?: string | null;
}

export interface GuestBookingOrderResult {
  success: boolean;
  bookingId: string;
  bookingReference: string;
  razorpayOrderId: string;
  amountPaise: number;
  currency: string;
  keyId: string;
  expiresAt: string;
  isIdempotentReplay?: boolean;
  slot: {
    start: string;
    end: string;
    durationMinutes: number;
  };
  pricing: {
    baseFee: number;
    gstAmount: number;
    totalAmount: number;
  };
}

export interface VerifyGuestPaymentInput {
  token: string;
  razorpayPaymentId: string;
  razorpayOrderId: string;
  razorpaySignature?: string;
  bookingId?: string;
}

export interface VerifyGuestPaymentResult {
  success: boolean;
  alreadyConfirmed?: boolean;
  requiresReconciliation?: boolean;
  reconciliationReason?: string;
  message?: string;
  appointment?: {
    id: string;
    bookingReference: string;
    scheduledStart: string;
    scheduledEnd: string;
    sessionType: string;
    modality: string;
    meetingLink?: string | null;
    googleMeetUrl?: string | null;
    googleMeetStatus?: string;
    calendarSyncStatus?: string;
    therapistName?: string;
  };
  booking?: {
    id: string;
    bookingReference: string;
    bookingStatus: string;
    paymentStatus: string;
    amountPaise: number;
    currency: string;
  };
}

export interface AuthoritativePricing {
  subtotalInr: number;
  subtotalPaise: number;
  gstPaise: number;
  totalPaise: number;
  totalInr: number;
  currency: string;
}

export class SessionBookingService {
  // Concurrency Locks to protect against race conditions
  private static activeCancellationLocks: Set<string> = new Set();
  private static activeNoShowLocks: Set<string> = new Set();
  private static activeRefundLocks: Set<string> = new Set();
  private static activeSlotHoldLocks: Set<string> = new Set();
  /**
   * Calculates platform authoritative pricing for a therapist's session.
   * Client-side pricing is strictly prohibited and discarded.
   */
  static async getAuthoritativePricing(therapistAccountId: string): Promise<AuthoritativePricing> {
    const { data: therapist } = await supabase
      .from('therapist_accounts')
      .select('per_session_fee')
      .eq('id', therapistAccountId)
      .maybeSingle();

    const baseInr = Number(therapist?.per_session_fee) || 1500;
    const subtotalPaise = Math.round(baseInr * 100);
    const gstPaise = Math.round(subtotalPaise * 0.18); // 18% GST standard
    const totalPaise = subtotalPaise + gstPaise;

    return {
      subtotalInr: baseInr,
      subtotalPaise,
      gstPaise,
      totalPaise,
      totalInr: totalPaise / 100,
      currency: 'INR',
    };
  }

  /**
   * Verifies client booking eligibility.
   * Subsequent self-booking is ONLY allowed if the client has an active care relationship
   * and has completed their first session.
   */
  static async verifyClientBookingEligibility(
    userId: string,
    therapistAccountId: string
  ): Promise<{
    eligible: boolean;
    reason?: 'NO_ACTIVE_RELATIONSHIP' | 'RELATIONSHIP_TERMINATED' | 'FIRST_SESSION_COORDINATION_REQUIRED';
    message?: string;
    relationshipId?: string;
  }> {
    const { data: rel, error } = await supabase
      .from('therapy_care_relationships')
      .select('id, status, care_stage, first_session_completed')
      .eq('therapist_account_id', therapistAccountId)
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !rel || rel.status !== 'active') {
      return {
        eligible: false,
        reason: 'NO_ACTIVE_RELATIONSHIP',
        message: 'You do not have an active care relationship with this therapist. Please match first.',
      };
    }

    if (rel.care_stage === 'completed') {
      return {
        eligible: false,
        reason: 'RELATIONSHIP_TERMINATED',
        message: 'This therapy care journey has concluded.',
      };
    }

    // Check if first session has been completed
    if (!rel.first_session_completed) {
      // Check if there's any completed appointment for this relationship
      const { data: completedAppt } = await supabase
        .from('therapist_clinical_appointments')
        .select('id')
        .eq('relationship_id', rel.id)
        .eq('status', 'completed')
        .limit(1)
        .maybeSingle();

      if (!completedAppt) {
        return {
          eligible: false,
          reason: 'FIRST_SESSION_COORDINATION_REQUIRED',
          message: 'Your first session is coordinated directly by the Ingress Within clinical team. Subsequent sessions can be self-booked.',
        };
      }
    }

    return {
      eligible: true,
      relationshipId: rel.id,
    };
  }

  /**
   * Retrieves available time slots for a therapist, combining:
   * 1. Availability blocks / working hours
   * 2. Minus existing clinical appointments
   * 3. Minus Google Calendar external busy periods
   */
  static async getTherapistAvailability(
    therapistAccountId: string,
    startDateIso: string,
    endDateIso: string
  ) {
    const start = new Date(startDateIso);
    const end = new Date(endDateIso);

    // 1. Fetch therapist availability blocks
    const { data: blocks } = await supabase
      .from('therapist_availability_blocks')
      .select('*')
      .eq('therapist_account_id', therapistAccountId);

    // 2. Fetch existing appointments
    const { data: appointments } = await supabase
      .from('therapist_clinical_appointments')
      .select('scheduled_start, scheduled_end')
      .eq('therapist_account_id', therapistAccountId)
      .in('status', ['scheduled', 'confirmed', 'in_progress', 'rescheduled'])
      .gte('scheduled_end', startDateIso)
      .lte('scheduled_start', endDateIso);

    // 3. Fetch Google Calendar busy slots
    const googleBusy = await GoogleCalendarService.getBusySlots(
      therapistAccountId,
      startDateIso,
      endDateIso
    );

    // 4. Fetch pending unexpired slot reservations (15-min checkout holds)
    const nowIso = new Date().toISOString();
    const { data: pendingHolds } = await supabase
      .from('therapy_session_bookings')
      .select('slot_start, slot_end')
      .eq('therapist_account_id', therapistAccountId)
      .eq('booking_status', 'pending_payment')
      .gt('expires_at', nowIso)
      .gte('slot_end', startDateIso)
      .lte('slot_start', endDateIso);

    // Generate potential slots (50-minute sessions with 10-minute breaks)
    const availableSlots: Array<{ start: string; end: string; available: boolean }> = [];

    let currentCursor = new Date(start);
    // Align to the nearest top of the hour
    currentCursor.setMinutes(0, 0, 0);

    const minLeadTimeMs = Date.now() + 60 * 60 * 1000; // 1 hour lead time

    while (currentCursor < end) {
      const slotStart = new Date(currentCursor);
      const slotEnd = new Date(slotStart.getTime() + 50 * 60 * 1000);

      // Check if slot falls within working hours (default 9am - 6pm if no custom blocks)
      const dayOfWeek = slotStart.getDay();
      const hour = slotStart.getHours();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      let withinWorkingHours = hour >= 9 && hour < 18 && !isWeekend;

      if (blocks && blocks.length > 0) {
        const dayBlock = blocks.find((b: any) => b.day_of_week === dayOfWeek);
        if (dayBlock && dayBlock.is_available) {
          const [startH] = dayBlock.start_time.split(':').map(Number);
          const [endH] = dayBlock.end_time.split(':').map(Number);
          withinWorkingHours = hour >= startH && hour < endH;
        } else if (dayBlock && !dayBlock.is_available) {
          withinWorkingHours = false;
        }
      }

      if (withinWorkingHours && slotStart.getTime() > minLeadTimeMs) {
        // Check if slot falls on any therapist blocked window / leave
        const dateStr = slotStart.toLocaleDateString('en-CA'); // YYYY-MM-DD
        const slotStartFmt = `${String(slotStart.getHours()).padStart(2, '0')}:${String(slotStart.getMinutes()).padStart(2, '0')}`;
        const slotEndFmt = `${String(slotEnd.getHours()).padStart(2, '0')}:${String(slotEnd.getMinutes()).padStart(2, '0')}`;

        const isTherapistBlocked = blocks?.some((b: any) => {
          if (!b.is_blocked) return false;
          if (b.specific_date) {
            if (b.specific_date !== dateStr) return false;
            const bStart = (b.start_time || '00:00:00').substring(0, 5);
            const bEnd = (b.end_time || '23:59:59').substring(0, 5);
            return slotStartFmt < bEnd && slotEndFmt > bStart;
          }
          if (b.is_recurring && b.day_of_week === dayOfWeek) {
            const bStart = (b.start_time || '00:00:00').substring(0, 5);
            const bEnd = (b.end_time || '23:59:59').substring(0, 5);
            return slotStartFmt < bEnd && slotEndFmt > bStart;
          }
          return false;
        });

        const isConflict =
          isTherapistBlocked ||
          appointments?.some((appt: any) => {
            const aStart = new Date(appt.scheduled_start).getTime();
            const aEnd = new Date(appt.scheduled_end).getTime();
            return slotStart.getTime() < aEnd && slotEnd.getTime() > aStart;
          }) ||
          googleBusy.some((gb) => {
            const bStart = new Date(gb.start).getTime();
            const bEnd = new Date(gb.end).getTime();
            return slotStart.getTime() < bEnd && slotEnd.getTime() > bStart;
          }) ||
          pendingHolds?.some((hold: any) => {
            const hStart = new Date(hold.slot_start).getTime();
            const hEnd = new Date(hold.slot_end).getTime();
            return slotStart.getTime() < hEnd && slotEnd.getTime() > hStart;
          });

        if (!isConflict) {
          availableSlots.push({
            start: slotStart.toISOString(),
            end: slotEnd.toISOString(),
            available: true,
          });
        }
      }

      // Advance by 1 hour (50 min session + 10 min buffer)
      currentCursor = new Date(currentCursor.getTime() + 60 * 60 * 1000);
    }

    return availableSlots;
  }

  /**
   * Resolves genuine participant names and verified email addresses for transactional emails and calendar sync.
   * Handles schema boundaries (users: name/phone; therapist_profiles: full_name/contact_email; booking metadata).
   */
  static async resolveParticipantIdentities(params: {
    userId: string;
    therapistAccountId: string;
    bookingId?: string | null;
  }): Promise<{
    clientName: string;
    clientEmail: string;
    therapistName: string;
    therapistEmail: string;
    clientId: string;
    therapistId: string;
  }> {
    const [
      { data: clientUser },
      { data: therapistProfile },
      { data: therapistApp },
      { data: bookingRecord },
    ] = await Promise.all([
      supabase
        .from('users')
        .select('id, name, phone_number')
        .eq('id', params.userId)
        .maybeSingle(),
      supabase
        .from('therapist_profiles')
        .select('full_name, contact_email')
        .eq('therapist_account_id', params.therapistAccountId)
        .maybeSingle(),
      supabase
        .from('therapist_applications')
        .select('contact_email, answers')
        .eq('therapist_account_id', params.therapistAccountId)
        .maybeSingle(),
      params.bookingId
        ? supabase
            .from('therapy_session_bookings')
            .select('metadata')
            .eq('id', params.bookingId)
            .maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

    let clientEmail =
      (bookingRecord?.metadata as any)?.guest_email ||
      (bookingRecord?.metadata as any)?.client_email ||
      (bookingRecord?.metadata as any)?.clientEmail ||
      '';

    if (!clientEmail) {
      try {
        const { data: authUserData } = await supabase.auth.admin.getUserById(params.userId);
        if (authUserData?.user?.email) {
          clientEmail = authUserData.user.email;
        }
      } catch {}
    }

    const clientName =
      (bookingRecord?.metadata as any)?.guest_name ||
      clientUser?.name ||
      'Valued Client';

    const therapistEmail =
      therapistProfile?.contact_email ||
      therapistApp?.contact_email ||
      (therapistApp?.answers as any)?.contact_email ||
      (therapistApp?.answers as any)?.email ||
      process.env.ADMIN_NOTIFICATION_EMAIL ||
      'contactus@ingresswithin.com';

    const therapistName =
      therapistProfile?.full_name ||
      (therapistApp?.answers as any)?.fullName ||
      'Therapist';

    return {
      clientName,
      clientEmail,
      therapistName,
      therapistEmail,
      clientId: params.userId,
      therapistId: params.therapistAccountId,
    };
  }

  /**
   * Creates a session booking hold and generates a Razorpay Order.
   * Holds the slot for 15 minutes while awaiting payment.
   */
  static async createBookingOrder(params: {
    userId: string;
    therapistAccountId: string;
    slotStart: string;
    slotEnd: string;
    sessionType?: 'video' | 'audio' | 'in_person';
    modality?: 'telehealth' | 'in_person' | 'chat' | 'phone';
    isFirstSessionCoordination?: boolean;
    clientNotes?: string;
    clientEmail?: string;
  }) {
    const { userId, therapistAccountId, slotStart, slotEnd } = params;

    // 1. Eligibility guard & care relationship resolution
    let relationshipId: string | null = null;
    let isFirstSession = false;

    if (!params.isFirstSessionCoordination) {
      // Find or initialize relationship
      const { data: rel } = await supabase
        .from('therapy_care_relationships')
        .select('id, status, care_stage, first_session_completed')
        .eq('therapist_account_id', therapistAccountId)
        .eq('user_id', userId)
        .maybeSingle();

      if (rel) {
        if (rel.status !== 'active') {
          const err: any = new Error('This therapy care relationship is not active.');
          err.code = 'RELATIONSHIP_INACTIVE';
          err.status = 403;
          throw err;
        }
        relationshipId = rel.id;
        isFirstSession = !rel.first_session_completed;
      } else {
        // Direct booking: initialize active care relationship for client and therapist
        const { data: newRel } = await supabase
          .from('therapy_care_relationships')
          .insert({
            therapist_account_id: therapistAccountId,
            user_id: userId,
            status: 'active',
            care_stage: 'intake',
            first_session_completed: false,
            started_at: new Date().toISOString(),
          })
          .select('id')
          .single();

        relationshipId = newRel?.id || null;
        isFirstSession = true;
      }
    } else {
      // Find relationship
      const { data: rel } = await supabase
        .from('therapy_care_relationships')
        .select('id')
        .eq('therapist_account_id', therapistAccountId)
        .eq('user_id', userId)
        .maybeSingle();
      relationshipId = rel?.id || null;
      isFirstSession = true;
    }

    // 2. Conflict verification (Appointments + Google Calendar FreeBusy + Pending Holds)
    const { data: conflict } = await supabase
      .from('therapist_clinical_appointments')
      .select('id')
      .eq('therapist_account_id', therapistAccountId)
      .in('status', ['scheduled', 'confirmed', 'in_progress', 'rescheduled'])
      .lt('scheduled_start', slotEnd)
      .gt('scheduled_end', slotStart)
      .maybeSingle();

    if (conflict) {
      const err: any = new Error('Selected time slot conflicts with an existing appointment.');
      err.code = 'SLOT_UNAVAILABLE';
      err.status = 409;
      throw err;
    }

    // Check Google Calendar conflict
    const googleBusy = await GoogleCalendarService.getBusySlots(
      therapistAccountId,
      slotStart,
      slotEnd
    );
    const hasGoogleConflict = googleBusy.some((gb) => {
      const bStart = new Date(gb.start).getTime();
      const bEnd = new Date(gb.end).getTime();
      const sStart = new Date(slotStart).getTime();
      const sEnd = new Date(slotEnd).getTime();
      return sStart < bEnd && sEnd > bStart;
    });

    if (hasGoogleConflict) {
      const err: any = new Error('Selected time slot conflicts with therapist Google Calendar.');
      err.code = 'SLOT_UNAVAILABLE';
      err.status = 409;
      throw err;
    }

    // Check therapist manual blocked availability windows / leave
    const { data: availBlocks } = await supabase
      .from('therapist_availability_blocks')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .eq('is_blocked', true);

    const slotStartDate = new Date(slotStart);
    const slotEndDate = new Date(slotEnd);
    const dateStr = slotStartDate.toLocaleDateString('en-CA');
    const dayOfWeek = slotStartDate.getDay();
    const slotStartFmt = `${String(slotStartDate.getHours()).padStart(2, '0')}:${String(slotStartDate.getMinutes()).padStart(2, '0')}`;
    const slotEndFmt = `${String(slotEndDate.getHours()).padStart(2, '0')}:${String(slotEndDate.getMinutes()).padStart(2, '0')}`;

    const isTherapistBlocked = availBlocks?.some((b: any) => {
      if (b.specific_date) {
        if (b.specific_date !== dateStr) return false;
        const bStart = (b.start_time || '00:00:00').substring(0, 5);
        const bEnd = (b.end_time || '23:59:59').substring(0, 5);
        return slotStartFmt < bEnd && slotEndFmt > bStart;
      }
      if (b.is_recurring && b.day_of_week === dayOfWeek) {
        const bStart = (b.start_time || '00:00:00').substring(0, 5);
        const bEnd = (b.end_time || '23:59:59').substring(0, 5);
        return slotStartFmt < bEnd && slotEndFmt > bStart;
      }
      return false;
    });

    if (isTherapistBlocked) {
      const err: any = new Error('Selected time slot is blocked by the therapist.');
      err.code = 'SLOT_UNAVAILABLE';
      err.status = 409;
      throw err;
    }

    // Check active unexpired pending holds
    const nowIso = new Date().toISOString();
    const { data: heldBooking } = await supabase
      .from('therapy_session_bookings')
      .select('id')
      .eq('therapist_account_id', therapistAccountId)
      .eq('booking_status', 'pending_payment')
      .gt('expires_at', nowIso)
      .lt('slot_start', slotEnd)
      .gt('slot_end', slotStart)
      .maybeSingle();

    if (heldBooking) {
      const err: any = new Error('Selected time slot is currently on hold for another checkout.');
      err.code = 'SLOT_ON_HOLD';
      err.status = 409;
      throw err;
    }

    // 3. Authoritative Pricing
    const pricing = await this.getAuthoritativePricing(therapistAccountId);

    // 4. Generate unique booking reference
    const bookingReference = `IW-BKG-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;

    // 5. Create Razorpay order
    const isPaymentBypassed =
      process.env.DISABLE_BOOKING_PAYMENTS === 'true' ||
      process.env.NEXT_PUBLIC_DISABLE_BOOKING_PAYMENTS === 'true';

    let razorpayOrderId = isPaymentBypassed
      ? `order_test_bypass_${Date.now()}`
      : `order_mock_${Date.now()}`;

    const rzp = !isPaymentBypassed ? BillingService.getRazorpayClient() : null;
    if (rzp) {
      try {
        const order = await rzp.orders.create({
          amount: pricing.totalPaise,
          currency: 'INR',
          receipt: bookingReference,
          notes: {
            booking_reference: bookingReference,
            therapist_account_id: therapistAccountId,
            user_id: userId,
          },
        });
        razorpayOrderId = order.id;
      } catch (rzpErr) {
        console.error('[SessionBookingService] Razorpay order creation failed:', rzpErr);
      }
    }

    // 6. Insert pending booking hold (15-minute expiration)
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    const bookingType = params.isFirstSessionCoordination ? 'first_session' : 'subsequent';

    const { data: booking, error: insertErr } = await supabase
      .from('therapy_session_bookings')
      .insert({
        booking_reference: bookingReference,
        user_id: userId,
        therapist_account_id: therapistAccountId,
        relationship_id: relationshipId,
        slot_start: slotStart,
        slot_end: slotEnd,
        session_type: params.sessionType || 'video',
        modality: params.modality || 'telehealth',
        booking_type: bookingType,
        booking_status: 'pending_payment',
        amount_paise: pricing.totalPaise,
        currency: 'INR',
        razorpay_order_id: razorpayOrderId,
        payment_status: 'pending',
        expires_at: expiresAt,
        metadata: {
          client_notes: params.clientNotes || null,
          client_email: params.clientEmail ? params.clientEmail.trim().toLowerCase() : null,
          pricing,
        },
      })
      .select('*')
      .single();

    if (insertErr || !booking) {
      console.error('[SessionBookingService] Failed to create booking record:', insertErr);
      throw new Error('Failed to create session booking.');
    }

    return {
      bookingId: booking.id,
      bookingReference,
      razorpayOrderId,
      amountPaise: pricing.totalPaise,
      currency: 'INR',
      keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_key',
      expiresAt,
      bypassPayment: isPaymentBypassed,
    };
  }

  /**
   * Creates a temporary slot hold (15 minutes) and Razorpay Order for guest checkout.
   * Enforces server-side token resolution, relationship and consent validation,
   * therapist practice verification, slot availability revalidation, and concurrency locking.
   */
  static async createGuestBookingOrder(input: CreateGuestBookingOrderInput): Promise<GuestBookingOrderResult> {
    // 1. Validate and sanitize inputs
    const token = typeof input.token === 'string' ? input.token.trim() : '';
    if (!token) {
      const err: any = new Error('Booking link unavailable or invalid.');
      err.code = 'BOOKING_LINK_UNAVAILABLE';
      err.status = 404;
      throw err;
    }

    const fullName = typeof input.fullName === 'string' ? input.fullName.trim() : '';
    if (!fullName || fullName.length < 2 || fullName.length > 100) {
      const err: any = new Error('Please provide a valid full name between 2 and 100 characters.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const email = typeof input.email === 'string' ? input.email.trim().toLowerCase() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || email.length > 150 || !emailRegex.test(email)) {
      const err: any = new Error('Please provide a valid email address.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const phoneNumber = typeof input.phoneNumber === 'string' ? input.phoneNumber.trim() : '';
    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!phoneNumber || !phoneRegex.test(phoneNumber)) {
      const err: any = new Error('Please provide a valid phone number (at least 7 digits).');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const slotStartMs = Date.parse(input.slotStart);
    const slotEndMs = Date.parse(input.slotEnd);
    if (isNaN(slotStartMs) || isNaN(slotEndMs) || slotEndMs <= slotStartMs) {
      const err: any = new Error('Invalid slot start or end time specified.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    if (slotStartMs < Date.now()) {
      const err: any = new Error('Cannot reserve a time slot in the past.');
      err.code = 'SLOT_IN_PAST';
      err.status = 400;
      throw err;
    }

    const durationMinutes = Math.round((slotEndMs - slotStartMs) / 60000);
    if (durationMinutes < 15 || durationMinutes > 180) {
      const err: any = new Error('Invalid session slot duration.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const clientNotes = typeof input.clientNotes === 'string' && input.clientNotes.trim().length > 0
      ? input.clientNotes.trim().substring(0, 1000)
      : null;

    const idempotencyKey = typeof input.idempotencyKey === 'string' && input.idempotencyKey.trim().length > 0
      ? input.idempotencyKey.trim().substring(0, 128)
      : null;

    // 2. Authoritative Token Resolution & Relationship/Therapist/Consent Validation
    const resolved = await RelationshipBookingLinkService.resolveBookingLinkByToken(token);
    if (!resolved.valid || !resolved.relationshipId || !resolved.therapistAccountId || !resolved.userId) {
      if (resolved.errorCode === 'CONSENT_REQUIRED') {
        const err: any = new Error(resolved.errorMessage || 'Required therapy consent has not been verified.');
        err.code = 'CONSENT_REQUIRED';
        err.status = 422;
        throw err;
      }
      const err: any = new Error('This booking link is invalid, expired, or unavailable.');
      err.code = 'BOOKING_LINK_UNAVAILABLE';
      err.status = 404;
      throw err;
    }

    const therapistAccountId = resolved.therapistAccountId;
    const relationshipId = resolved.relationshipId;
    const userId = resolved.userId;

    // 3. Concurrency Control: In-Memory Lock for therapist and slot start
    const lockKey = `${therapistAccountId}:${input.slotStart}`;
    if (this.activeSlotHoldLocks.has(lockKey)) {
      const err: any = new Error('This time slot is currently being held or checked out by another client.');
      err.code = 'SLOT_ON_HOLD';
      err.status = 409;
      throw err;
    }
    this.activeSlotHoldLocks.add(lockKey);

    try {
      const nowIso = new Date().toISOString();

      // 4. Idempotency Check: Replay existing unexpired hold if idempotency key matches
      if (idempotencyKey) {
        const { data: existingHolds } = await supabase
          .from('therapy_session_bookings')
          .select('*')
          .eq('therapist_account_id', therapistAccountId)
          .eq('booking_status', 'pending_payment')
          .gt('expires_at', nowIso)
          .order('created_at', { ascending: false });

        const matchingHold = existingHolds?.find(
          (b: any) => b.metadata && b.metadata.idempotency_key === idempotencyKey
        );

        if (matchingHold) {
          const pricing = await this.getAuthoritativePricing(therapistAccountId);
          const holdDuration = Math.round(
            (new Date(matchingHold.slot_end).getTime() - new Date(matchingHold.slot_start).getTime()) / 60000
          );
          return {
            success: true,
            bookingId: matchingHold.id,
            bookingReference: matchingHold.booking_reference,
            razorpayOrderId: matchingHold.razorpay_order_id,
            amountPaise: matchingHold.amount_paise,
            currency: matchingHold.currency || 'INR',
            keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_key',
            expiresAt: matchingHold.expires_at,
            isIdempotentReplay: true,
            slot: {
              start: matchingHold.slot_start,
              end: matchingHold.slot_end,
              durationMinutes: holdDuration,
            },
            pricing: {
              baseFee: pricing.subtotalInr,
              gstAmount: pricing.gstPaise / 100,
              totalAmount: pricing.totalInr,
            },
          };
        }
      }

      // 5. Authoritative Conflict Checks
      // Check 5a: Confirmed/scheduled clinical appointments
      const { data: apptConflict } = await supabase
        .from('therapist_clinical_appointments')
        .select('id')
        .eq('therapist_account_id', therapistAccountId)
        .in('status', ['scheduled', 'confirmed', 'in_progress', 'rescheduled'])
        .lt('scheduled_start', input.slotEnd)
        .gt('scheduled_end', input.slotStart)
        .maybeSingle();

      if (apptConflict) {
        const err: any = new Error('Selected time slot conflicts with an existing appointment.');
        err.code = 'SLOT_UNAVAILABLE';
        err.status = 409;
        throw err;
      }

      // Check 5b: Google Calendar Busy Periods
      const googleBusy = await GoogleCalendarService.getBusySlots(
        therapistAccountId,
        input.slotStart,
        input.slotEnd
      );
      const hasGoogleConflict = googleBusy.some((gb) => {
        const bStart = new Date(gb.start).getTime();
        const bEnd = new Date(gb.end).getTime();
        return slotStartMs < bEnd && slotEndMs > bStart;
      });

      if (hasGoogleConflict) {
        const err: any = new Error('Selected time slot conflicts with therapist Google Calendar.');
        err.code = 'SLOT_UNAVAILABLE';
        err.status = 409;
        throw err;
      }

      // Check 5c: Therapist Manual Blocked Windows
      const { data: availBlocks } = await supabase
        .from('therapist_availability_blocks')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .eq('is_blocked', true);

      const slotStartDate = new Date(input.slotStart);
      const slotEndDate = new Date(input.slotEnd);
      const dateStr = slotStartDate.toLocaleDateString('en-CA');
      const dayOfWeek = slotStartDate.getDay();
      const slotStartFmt = `${String(slotStartDate.getHours()).padStart(2, '0')}:${String(slotStartDate.getMinutes()).padStart(2, '0')}`;
      const slotEndFmt = `${String(slotEndDate.getHours()).padStart(2, '0')}:${String(slotEndDate.getMinutes()).padStart(2, '0')}`;

      const isTherapistBlocked = availBlocks?.some((b: any) => {
        if (b.specific_date) {
          if (b.specific_date !== dateStr) return false;
          const bStart = (b.start_time || '00:00:00').substring(0, 5);
          const bEnd = (b.end_time || '23:59:59').substring(0, 5);
          return slotStartFmt < bEnd && slotEndFmt > bStart;
        }
        if (b.is_recurring && b.day_of_week === dayOfWeek) {
          const bStart = (b.start_time || '00:00:00').substring(0, 5);
          const bEnd = (b.end_time || '23:59:59').substring(0, 5);
          return slotStartFmt < bEnd && slotEndFmt > bStart;
        }
        return false;
      });

      if (isTherapistBlocked) {
        const err: any = new Error('Selected time slot is blocked by the therapist.');
        err.code = 'SLOT_UNAVAILABLE';
        err.status = 409;
        throw err;
      }

      // Check 5d: Active Unexpired Slot Holds
      const { data: heldBooking } = await supabase
        .from('therapy_session_bookings')
        .select('id')
        .eq('therapist_account_id', therapistAccountId)
        .eq('booking_status', 'pending_payment')
        .gt('expires_at', nowIso)
        .lt('slot_start', input.slotEnd)
        .gt('slot_end', input.slotStart)
        .maybeSingle();

      if (heldBooking) {
        const err: any = new Error('Selected time slot is currently on hold for another checkout.');
        err.code = 'SLOT_ON_HOLD';
        err.status = 409;
        throw err;
      }

      // 6. Authoritative Pricing Calculation
      const pricing = await this.getAuthoritativePricing(therapistAccountId);

      // 7. Generate Booking Reference and Expiry (15 minutes)
      const bookingReference = `IW-GUEST-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`;
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
      const bookingType = resolved.firstSessionCompleted ? 'subsequent' : 'first_session';

      // 8. Insert Pending Slot Hold Record
      const { data: booking, error: insertErr } = await supabase
        .from('therapy_session_bookings')
        .insert({
          booking_reference: bookingReference,
          user_id: userId,
          therapist_account_id: therapistAccountId,
          relationship_id: relationshipId,
          slot_start: input.slotStart,
          slot_end: input.slotEnd,
          session_type: input.sessionType || 'video',
          modality: input.modality || 'telehealth',
          booking_type: bookingType,
          booking_status: 'pending_payment',
          amount_paise: pricing.totalPaise,
          currency: 'INR',
          payment_status: 'pending',
          expires_at: expiresAt,
          metadata: {
            guest_name: fullName,
            guest_email: email,
            guest_phone: phoneNumber,
            client_notes: clientNotes,
            idempotency_key: idempotencyKey,
            pricing,
            booking_source: 'relationship_link',
          },
        })
        .select('*')
        .single();

      if (insertErr || !booking) {
        console.error('[SessionBookingService] Failed to create guest booking slot hold:', insertErr);
        const err: any = new Error('Failed to create session slot hold.');
        err.code = 'BOOKING_CREATION_FAILED';
        err.status = 500;
        throw err;
      }

      // 9. Razorpay Order Creation
      const isPaymentBypassed =
        process.env.DISABLE_BOOKING_PAYMENTS === 'true' ||
        process.env.NEXT_PUBLIC_DISABLE_BOOKING_PAYMENTS === 'true';

      let razorpayOrderId = isPaymentBypassed
        ? `order_test_bypass_${Date.now()}`
        : `order_mock_${Date.now()}`;

      const rzp = !isPaymentBypassed ? BillingService.getRazorpayClient() : null;
      if (rzp) {
        try {
          const order = await rzp.orders.create({
            amount: pricing.totalPaise,
            currency: 'INR',
            receipt: bookingReference,
            notes: {
              booking_reference: bookingReference,
              booking_id: booking.id,
              therapist_account_id: therapistAccountId,
              relationship_id: relationshipId,
            },
          });
          razorpayOrderId = order.id;
        } catch (rzpErr: any) {
          console.error('[SessionBookingService] Razorpay order creation failed for guest hold:', rzpErr);
          // Safely release/expire the hold immediately so slot is not blocked
          await supabase
            .from('therapy_session_bookings')
            .update({
              booking_status: 'expired',
              cancellation_reason: 'RAZORPAY_ORDER_FAILED',
              updated_at: new Date().toISOString(),
            })
            .eq('id', booking.id);

          const err: any = new Error('Payment gateway error. Unable to create checkout order.');
          err.code = 'PAYMENT_GATEWAY_ERROR';
          err.status = 502;
          throw err;
        }
      }

      // 10. Update booking record with razorpay_order_id
      await supabase
        .from('therapy_session_bookings')
        .update({
          razorpay_order_id: razorpayOrderId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id);

      // 11. Return Sanitized Order DTO
      return {
        success: true,
        bookingId: booking.id,
        bookingReference,
        razorpayOrderId,
        amountPaise: pricing.totalPaise,
        currency: 'INR',
        keyId: process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_key',
        expiresAt,
        slot: {
          start: input.slotStart,
          end: input.slotEnd,
          durationMinutes,
        },
        pricing: {
          baseFee: pricing.subtotalInr,
          gstAmount: pricing.gstPaise / 100,
          totalAmount: pricing.totalInr,
        },
      };
    } finally {
      this.activeSlotHoldLocks.delete(lockKey);
    }
  }

  /**
   * Securely verifies Razorpay payment and confirms the appointment exactly once for a guest booking.
   * Revalidates link token, care relationship, consent, and therapist practice eligibility.
   * Verifies Razorpay payment signature and authoritative order/amount/currency matching.
   * Prevents double-booking via concurrency locking and moves conflicting late payments into a safe reconciliation path.
   */
  static async verifyAndConfirmGuestPayment(input: VerifyGuestPaymentInput): Promise<VerifyGuestPaymentResult> {
    const token = typeof input.token === 'string' ? input.token.trim() : '';
    const razorpayPaymentId = typeof input.razorpayPaymentId === 'string' ? input.razorpayPaymentId.trim() : '';
    const razorpayOrderId = typeof input.razorpayOrderId === 'string' ? input.razorpayOrderId.trim() : '';
    const razorpaySignature = typeof input.razorpaySignature === 'string' ? input.razorpaySignature.trim() : '';
    const bookingId = typeof input.bookingId === 'string' ? input.bookingId.trim() : undefined;

    if (!token) {
      const err: any = new Error('Booking link unavailable or invalid.');
      err.code = 'BOOKING_LINK_UNAVAILABLE';
      err.status = 404;
      throw err;
    }

    if (!razorpayPaymentId || !razorpayOrderId) {
      const err: any = new Error('Payment identifiers (payment ID and order ID) are required.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    // 1. Authoritative Token Resolution & Relationship/Consent Validation
    const resolved = await RelationshipBookingLinkService.resolveBookingLinkByToken(token);
    if (!resolved.valid || !resolved.relationshipId || !resolved.therapistAccountId || !resolved.userId) {
      if (resolved.errorCode === 'CONSENT_REQUIRED') {
        const err: any = new Error(resolved.errorMessage || 'Required therapy consent has not been verified.');
        err.code = 'CONSENT_REQUIRED';
        err.status = 422;
        throw err;
      }
      const err: any = new Error('This booking link is invalid, expired, or unavailable.');
      err.code = 'BOOKING_LINK_UNAVAILABLE';
      err.status = 404;
      throw err;
    }

    const therapistAccountId = resolved.therapistAccountId;
    const relationshipId = resolved.relationshipId;

    // 2. Locate and Authenticate Booking Attempt (Strict tenancy: scoped to this link's therapist and relationship)
    let booking: any = null;
    if (bookingId) {
      const { data } = await supabase
        .from('therapy_session_bookings')
        .select('*')
        .eq('id', bookingId)
        .eq('therapist_account_id', therapistAccountId)
        .eq('relationship_id', relationshipId)
        .maybeSingle();
      booking = data;
    }

    if (!booking && razorpayOrderId) {
      const { data } = await supabase
        .from('therapy_session_bookings')
        .select('*')
        .eq('razorpay_order_id', razorpayOrderId)
        .eq('therapist_account_id', therapistAccountId)
        .eq('relationship_id', relationshipId)
        .maybeSingle();
      booking = data;
    }

    if (!booking) {
      const err: any = new Error('Booking attempt not found for this relationship and payment.');
      err.code = 'BOOKING_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    // 3. IDEMPOTENCY GUARD: If already confirmed, return existing appointment without repeating side effects
    if (booking.booking_status === 'confirmed' && booking.appointment_id) {
      const { data: existingAppt } = await supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('id', booking.appointment_id)
        .maybeSingle();

      const { data: therapistProfile } = await supabase
        .from('therapist_profiles')
        .select('full_name')
        .eq('therapist_account_id', therapistAccountId)
        .maybeSingle();

      return {
        success: true,
        alreadyConfirmed: true,
        appointment: {
          id: existingAppt ? existingAppt.id : booking.appointment_id,
          bookingReference: booking.booking_reference,
          scheduledStart: existingAppt ? existingAppt.scheduled_start : booking.slot_start,
          scheduledEnd: existingAppt ? existingAppt.scheduled_end : booking.slot_end,
          sessionType: existingAppt ? existingAppt.session_type : (booking.session_type || 'video'),
          modality: existingAppt ? existingAppt.modality : (booking.modality || 'telehealth'),
          meetingLink: existingAppt?.google_meet_url || existingAppt?.meeting_link || null,
          googleMeetUrl: existingAppt?.google_meet_url || null,
          googleMeetStatus: existingAppt?.google_meet_status || 'created',
          calendarSyncStatus: existingAppt?.calendar_sync_status || 'synced',
          therapistName: therapistProfile?.full_name || 'Practitioner',
        },
        booking: {
          id: booking.id,
          bookingReference: booking.booking_reference,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          amountPaise: booking.amount_paise,
          currency: booking.currency || 'INR',
        },
      };
    }

    // 4. Verify Razorpay Payment Signature
    const isPaymentBypassed =
      (process.env.DISABLE_BOOKING_PAYMENTS === 'true' ||
        process.env.NEXT_PUBLIC_DISABLE_BOOKING_PAYMENTS === 'true') &&
      (Boolean(razorpayPaymentId?.startsWith('pay_test_bypass_')) ||
        Boolean(razorpayOrderId?.startsWith('order_test_bypass_')));

    if (!isPaymentBypassed) {
      if (!razorpaySignature || !razorpayOrderId) {
        const err: any = new Error('Payment signature is required for verification.');
        err.code = 'INVALID_SIGNATURE';
        err.status = 400;
        throw err;
      }

      const isValidSignature = BillingService.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );

      if (!isValidSignature) {
        const err: any = new Error('Cryptographic signature verification failed.');
        err.code = 'INVALID_SIGNATURE';
        err.status = 400;
        throw err;
      }
    }

    // 5. Verify Order Association, Amount, and Currency
    if (booking.razorpay_order_id && booking.razorpay_order_id !== razorpayOrderId) {
      const err: any = new Error('Payment order ID does not match the stored booking attempt.');
      err.code = 'ORDER_MISMATCH';
      err.status = 400;
      throw err;
    }

    const pricing = await this.getAuthoritativePricing(therapistAccountId);
    if (booking.amount_paise !== pricing.totalPaise) {
      const err: any = new Error('Authoritative pricing mismatch.');
      err.code = 'AMOUNT_MISMATCH';
      err.status = 400;
      throw err;
    }

    if (booking.currency && booking.currency !== 'INR') {
      const err: any = new Error('Invalid payment currency.');
      err.code = 'CURRENCY_MISMATCH';
      err.status = 400;
      throw err;
    }

    // 6. Online Provider Fetch Verification (where Razorpay client is initialized)
    if (!isPaymentBypassed) {
      const rzp = BillingService.getRazorpayClient();
      if (rzp) {
        try {
          const payment = await rzp.payments.fetch(razorpayPaymentId);
          if (!payment || !['captured', 'authorized'].includes(payment.status)) {
            const err: any = new Error('Payment has not been captured or authorized by payment provider.');
            err.code = 'PAYMENT_NOT_CAPTURED';
            err.status = 400;
            throw err;
          }
          if (payment.order_id && payment.order_id !== razorpayOrderId) {
            const err: any = new Error('Razorpay payment does not match expected order.');
            err.code = 'ORDER_MISMATCH';
            err.status = 400;
            throw err;
          }
          if (payment.amount && Number(payment.amount) !== booking.amount_paise) {
            const err: any = new Error('Razorpay payment amount does not match expected session fee.');
            err.code = 'AMOUNT_MISMATCH';
            err.status = 400;
            throw err;
          }
          if (payment.currency && payment.currency !== 'INR') {
            const err: any = new Error('Razorpay payment currency is not INR.');
            err.code = 'CURRENCY_MISMATCH';
            err.status = 400;
            throw err;
          }
        } catch (fetchErr: any) {
          if (
            fetchErr.code === 'PAYMENT_NOT_CAPTURED' ||
            fetchErr.code === 'ORDER_MISMATCH' ||
            fetchErr.code === 'AMOUNT_MISMATCH' ||
            fetchErr.code === 'CURRENCY_MISMATCH'
          ) {
            throw fetchErr;
          }
          console.warn('[SessionBookingService] Unable to reach Razorpay API online for verification:', fetchErr.message);
        }
      }
    }

    // 7. Concurrency Protection & Late-Payment Conflict Guard
    const lockKey = `${therapistAccountId}:${booking.slot_start}`;
    this.activeSlotHoldLocks.add(lockKey);

    try {
      // Recheck for competing confirmed clinical appointments
      const { data: conflictAppt } = await supabase
        .from('therapist_clinical_appointments')
        .select('id')
        .eq('therapist_account_id', therapistAccountId)
        .in('status', ['scheduled', 'confirmed', 'in_progress', 'rescheduled'])
        .lt('scheduled_start', booking.slot_end)
        .gt('scheduled_end', booking.slot_start)
        .maybeSingle();

      // RECONCILIATION PATH: If another appointment claimed the slot (late payment after hold expired)
      if (conflictAppt) {
        console.warn(`[SessionBookingService] Slot conflict detected post-payment for booking ${booking.id}. Moving to reconciliation.`);

        await supabase
          .from('therapy_session_bookings')
          .update({
            payment_status: 'paid',
            razorpay_payment_id: razorpayPaymentId,
            booking_status: 'expired',
            cancellation_reason: 'SLOT_CONFLICT_POST_PAYMENT: Slot was claimed before payment confirmation. Requires rescheduling or refund reconciliation.',
            refund_status: 'eligible',
            metadata: {
              ...(booking.metadata || {}),
              reconciliation_status: 'manual_review_required',
              requires_reschedule_or_refund: true,
              paid_at: new Date().toISOString(),
              conflict_appointment_id: conflictAppt.id,
            },
            updated_at: new Date().toISOString(),
          })
          .eq('id', booking.id);

        return {
          success: false,
          requiresReconciliation: true,
          reconciliationReason: 'SLOT_UNAVAILABLE_RECONCILIATION_REQUIRED',
          message: 'Payment was successfully captured, but your selected time slot is no longer available. Our care team has been notified to reschedule your session or issue a full refund immediately.',
          booking: {
            id: booking.id,
            bookingReference: booking.booking_reference,
            bookingStatus: 'expired',
            paymentStatus: 'paid',
            amountPaise: booking.amount_paise,
            currency: booking.currency || 'INR',
          },
        };
      }

      // 8. Confirm Clinical Appointment
      const { data: newAppt, error: apptErr } = await supabase
        .from('therapist_clinical_appointments')
        .insert({
          therapist_account_id: booking.therapist_account_id,
          user_id: booking.user_id,
          relationship_id: booking.relationship_id,
          booking_id: booking.id,
          scheduled_start: booking.slot_start,
          scheduled_end: booking.slot_end,
          status: 'confirmed',
          session_type: booking.session_type || 'video',
          modality: booking.modality || 'telehealth',
          payment_id: razorpayPaymentId,
          client_notes: booking.metadata?.client_notes || null,
        })
        .select('*')
        .single();

      if (apptErr || !newAppt) {
        console.error('[SessionBookingService] Failed to create clinical appointment after guest payment:', apptErr);
        throw new Error('Failed to create clinical appointment record.');
      }

      // 9. Update Booking Record to Confirmed
      const { data: updatedBooking } = await supabase
        .from('therapy_session_bookings')
        .update({
          appointment_id: newAppt.id,
          booking_status: 'confirmed',
          payment_status: 'paid',
          razorpay_payment_id: razorpayPaymentId,
          updated_at: new Date().toISOString(),
        })
        .eq('id', booking.id)
        .select('*')
        .single();

      // 10. Record Therapist Earnings (Idempotent: checks DB before insert)
      try {
        const { data: therapistAccount } = await supabase
          .from('therapist_accounts')
          .select('id, per_session_fee, commission_rate')
          .eq('id', therapistAccountId)
          .single();

        const gross = Number(therapistAccount?.per_session_fee) || 1500;
        const commRate = Number(therapistAccount?.commission_rate) || 20;

        await TherapistPayoutService.recordEarningForAppointment({
          therapistAccountId,
          appointmentId: newAppt.id,
          grossAmount: gross,
          commissionRate: commRate,
          initialStatus: 'collected',
        });
      } catch (earnErr) {
        console.warn('[SessionBookingService] Notice recording earnings (may already exist):', earnErr);
      }

      // 11. Side Effects: Google Calendar and Meet Sync (Retryable & Non-Blocking)
      let meetUrl: string | null = null;
      let meetStatus = 'none';
      let calStatus = 'not_connected';

      const identities = await this.resolveParticipantIdentities({
        userId: booking.user_id,
        therapistAccountId,
        bookingId: booking.id,
      });

      try {
        const sync = await GoogleCalendarService.syncAppointmentToGoogle(newAppt.id, {
          summary: `Ingress Within: Session with ${identities.clientName}`,
          description: `Ingress Within confidential therapy session. Ref: ${booking.booking_reference}`,
        });
        meetUrl = sync.googleMeetUrl;
        meetStatus = sync.googleMeetStatus;
        calStatus = sync.calendarSyncStatus;
      } catch (calErr) {
        console.warn('[SessionBookingService] Google Calendar sync failed gracefully:', calErr);
        calStatus = 'failed';
      }

      const fallbackMeet = GoogleCalendarService.getFallbackMeetUrl();
      if (!meetUrl && fallbackMeet) {
        meetUrl = fallbackMeet;
        meetStatus = 'created';
        await supabase
          .from('therapist_clinical_appointments')
          .update({
            google_meet_url: meetUrl,
            google_meet_status: 'created',
            updated_at: new Date().toISOString(),
          })
          .eq('id', newAppt.id);
      }

      // 12. Side Effects: Transactional Email Notifications (Retryable & Non-Blocking)
      try {
        await EmailService.notifySessionConfirmed({
          bookingId: booking.id,
          appointmentId: newAppt.id,
          bookingReference: booking.booking_reference,
          scheduledStart: booking.slot_start,
          scheduledEnd: booking.slot_end,
          clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
          therapistEmail: identities.therapistEmail || 'contactus@ingresswithin.com',
          clientName: identities.clientName,
          therapistName: identities.therapistName,
          googleMeetUrl: meetUrl || undefined,
          clientId: identities.clientId,
          therapistId: identities.therapistId,
        });
      } catch (mailErr) {
        console.warn('[SessionBookingService] Email notification dispatch failed gracefully:', mailErr);
      }

      // 13. Return Minimal Client-Safe Response DTO
      return {
        success: true,
        alreadyConfirmed: false,
        appointment: {
          id: newAppt.id,
          bookingReference: booking.booking_reference,
          scheduledStart: newAppt.scheduled_start,
          scheduledEnd: newAppt.scheduled_end,
          sessionType: newAppt.session_type,
          modality: newAppt.modality,
          meetingLink: meetUrl || newAppt.meeting_link || null,
          googleMeetUrl: meetUrl,
          googleMeetStatus: meetStatus,
          calendarSyncStatus: calStatus,
          therapistName: identities.therapistName,
        },
        booking: {
          id: booking.id,
          bookingReference: booking.booking_reference,
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          amountPaise: booking.amount_paise,
          currency: booking.currency || 'INR',
        },
      };
    } finally {
      this.activeSlotHoldLocks.delete(lockKey);
    }
  }



  /**
   * Confirms payment and promotes booking to a confirmed clinical appointment.
   * Idempotent: repeated callbacks or webhooks with the same payment_id will return existing record.
   */
  static async confirmSessionPayment(params: {
    razorpayOrderId?: string;
    razorpayPaymentId: string;
    razorpaySignature?: string;
    bookingId?: string;
  }) {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = params;

    // 1. Locate booking
    let booking: any = null;
    if (bookingId) {
      const { data } = await supabase.from('therapy_session_bookings').select('*').eq('id', bookingId).maybeSingle();
      booking = data;
    }
    if (!booking && razorpayOrderId) {
      const { data } = await supabase.from('therapy_session_bookings').select('*').eq('razorpay_order_id', razorpayOrderId).maybeSingle();
      booking = data;
    }
    if (!booking && razorpayPaymentId) {
      const { data } = await supabase.from('therapy_session_bookings').select('*').eq('razorpay_payment_id', razorpayPaymentId).maybeSingle();
      booking = data;
    }

    if (!booking) {
      const err: any = new Error('Booking not found for this payment.');
      err.code = 'BOOKING_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    // IDEMPOTENCY GUARD:
    if (booking.payment_status === 'paid' && booking.appointment_id) {
      const { data: existingAppt } = await supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('id', booking.appointment_id)
        .single();

      return {
        success: true,
        alreadyProcessed: true,
        booking,
        appointment: existingAppt,
      };
    }

    // 2. Verify Razorpay Payment Signature
    const isPaymentBypassed =
      (process.env.DISABLE_BOOKING_PAYMENTS === 'true' ||
        process.env.NEXT_PUBLIC_DISABLE_BOOKING_PAYMENTS === 'true') &&
      (Boolean(razorpayPaymentId?.startsWith('pay_test_bypass_')) ||
        Boolean(razorpayOrderId?.startsWith('order_test_bypass_')));

    if (!isPaymentBypassed) {
      if (!razorpaySignature || !razorpayOrderId) {
        const err: any = new Error('Payment signature is required for verification.');
        err.code = 'INVALID_SIGNATURE';
        err.status = 400;
        throw err;
      }
      const isValid = BillingService.verifyPaymentSignature(
        razorpayOrderId,
        razorpayPaymentId,
        razorpaySignature
      );
      if (!isValid) {
        const err: any = new Error('Invalid payment signature.');
        err.code = 'INVALID_SIGNATURE';
        err.status = 400;
        throw err;
      }
    }

    // 3. Fetch client and therapist details
    const identities = await this.resolveParticipantIdentities({
      userId: booking.user_id,
      therapistAccountId: booking.therapist_account_id,
      bookingId: booking.id,
    });

    const { data: therapistAccount } = await supabase
      .from('therapist_accounts')
      .select('id, per_session_fee, commission_rate')
      .eq('id', booking.therapist_account_id)
      .single();

    // 4. Create Clinical Appointment
    const { data: newAppt, error: apptErr } = await supabase
      .from('therapist_clinical_appointments')
      .insert({
        therapist_account_id: booking.therapist_account_id,
        user_id: booking.user_id,
        relationship_id: booking.relationship_id,
        booking_id: booking.id,
        scheduled_start: booking.slot_start,
        scheduled_end: booking.slot_end,
        status: 'confirmed',
        session_type: booking.session_type || 'video',
        modality: booking.modality || 'telehealth',
        payment_id: razorpayPaymentId,
        client_notes: booking.metadata?.client_notes || null,
      })
      .select('*')
      .single();

    if (apptErr || !newAppt) {
      console.error('[SessionBookingService] Failed to create clinical appointment:', apptErr);
      throw new Error('Failed to create appointment after payment.');
    }

    // 5. Create Google Calendar event with Google Meet via canonical orchestration
    let syncResult = {
      eventId: null as string | null,
      googleMeetUrl: null as string | null,
      googleMeetConferenceId: null as string | null,
      googleMeetStatus: 'not_connected' as any,
      calendarSyncStatus: 'not_connected' as any,
    };

    try {
      const sync = await GoogleCalendarService.syncAppointmentToGoogle(newAppt.id, {
        summary: `Ingress Within: Session with ${identities.clientName}`,
        description: `Ingress Within confidential therapy session. Ref: ${booking.booking_reference}`,
      });
      syncResult = {
        eventId: sync.eventId,
        googleMeetUrl: sync.googleMeetUrl,
        googleMeetConferenceId: sync.googleMeetConferenceId,
        googleMeetStatus: sync.googleMeetStatus,
        calendarSyncStatus: sync.calendarSyncStatus,
      };
    } catch (calErr) {
      console.warn('[SessionBookingService] Calendar sync failed gracefully:', calErr);
      syncResult.calendarSyncStatus = 'failed';
      syncResult.googleMeetStatus = 'failed';
    }

    let meetUrl = isValidGoogleMeetUrl(syncResult.googleMeetUrl) ? syncResult.googleMeetUrl : null;
    let meetStatus = syncResult.googleMeetStatus;

    // Check fallback meet url if configured in environment
    const fallbackMeet = GoogleCalendarService.getFallbackMeetUrl();
    const isTelehealth = newAppt.modality !== 'in_person' && newAppt.session_type !== 'in_person';
    if (!meetUrl && fallbackMeet && isTelehealth) {
      meetUrl = fallbackMeet;
      meetStatus = 'created';

      await supabase
        .from('therapist_clinical_appointments')
        .update({
          google_meet_url: meetUrl,
          google_meet_status: 'created',
          updated_at: new Date().toISOString(),
        })
        .eq('id', newAppt.id);
    }

    // 6. Update booking status
    const { data: updatedBooking } = await supabase
      .from('therapy_session_bookings')
      .update({
        appointment_id: newAppt.id,
        booking_status: 'confirmed',
        payment_status: 'paid',
        razorpay_payment_id: razorpayPaymentId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', booking.id)
      .select('*')
      .single();

    // 7. Register therapist earnings (enforcing single earning per appointment)
    try {
      const gross = Number(therapistAccount?.per_session_fee) || 1500;
      const commRate = Number(therapistAccount?.commission_rate) || 20;

      await TherapistPayoutService.recordEarningForAppointment({
        therapistAccountId: booking.therapist_account_id,
        appointmentId: newAppt.id,
        grossAmount: gross,
        commissionRate: commRate,
        initialStatus: 'collected',
      });
    } catch (earnErr) {
      console.warn('[SessionBookingService] Failed to record earnings (may already exist):', earnErr);
    }

    // 8. Dispatch confirmation emails
    try {
      await EmailService.notifySessionConfirmed({
        bookingId: booking.id,
        appointmentId: newAppt.id,
        bookingReference: booking.booking_reference,
        scheduledStart: booking.slot_start,
        scheduledEnd: booking.slot_end,
        clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
        therapistEmail: identities.therapistEmail || 'contactus@ingresswithin.com',
        clientName: identities.clientName,
        therapistName: identities.therapistName,
        googleMeetUrl: meetUrl || undefined,
        clientId: identities.clientId,
        therapistId: identities.therapistId,
      });
    } catch (mailErr) {
      console.warn('[SessionBookingService] Email notification dispatch failed gracefully:', mailErr);
    }

    return {
      success: true,
      booking: updatedBooking,
      appointment: {
        ...newAppt,
        meeting_link: meetUrl,
        google_meet_url: meetUrl,
        google_meet_status: meetStatus,
        calendar_sync_status: syncResult.calendarSyncStatus,
      },
    };
  }

  /**
   * Reschedules an appointment.
   * STRICT POLICY: Must be requested at least 24 hours prior to scheduled_start.
   */
  static async rescheduleSession(params: {
    appointmentId: string;
    newStart: string;
    newEnd: string;
    requestedBy: 'client' | 'therapist';
    userId?: string;
    therapistAccountId?: string;
    reason?: string;
  }) {
    const { appointmentId, newStart, newEnd, requestedBy } = params;

    // 1. Fetch appointment
    const { data: appt, error } = await supabase
      .from('therapist_clinical_appointments')
      .select('*')
      .eq('id', appointmentId)
      .maybeSingle();

    if (error || !appt) {
      const err: any = new Error('Appointment not found.');
      err.code = 'SESSION_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    // Ownership check
    if (requestedBy === 'client' && (!params.userId || appt.user_id !== params.userId)) {
      const err: any = new Error('Unauthorized to reschedule this appointment.');
      err.code = 'UNAUTHORIZED';
      err.status = 403;
      throw err;
    }
    if (requestedBy === 'therapist' && (!params.therapistAccountId || appt.therapist_account_id !== params.therapistAccountId)) {
      const err: any = new Error('Unauthorized to reschedule this appointment.');
      err.code = 'UNAUTHORIZED';
      err.status = 403;
      throw err;
    }

    if (['completed', 'cancelled'].includes(appt.status)) {
      const err: any = new Error(`Cannot reschedule a ${appt.status} session.`);
      err.code = 'SESSION_IMMUTABLE';
      err.status = 400;
      throw err;
    }

    // 2. Enforce > 24 Hours Policy
    const scheduledStart = new Date(appt.scheduled_start).getTime();
    const now = Date.now();
    const hoursRemaining = (scheduledStart - now) / (1000 * 60 * 60);

    if (hoursRemaining < 24) {
      const err: any = new Error(
        'POLICY_VIOLATION: Sessions can only be rescheduled at least 24 hours in advance.'
      );
      err.code = 'RESCHEDULE_WINDOW_CLOSED';
      err.status = 400;
      throw err;
    }

    // 3. Check conflict on new time
    const { data: conflict } = await supabase
      .from('therapist_clinical_appointments')
      .select('id')
      .eq('therapist_account_id', appt.therapist_account_id)
      .neq('id', appointmentId)
      .in('status', ['scheduled', 'confirmed', 'in_progress'])
      .lt('scheduled_start', newEnd)
      .gt('scheduled_end', newStart)
      .maybeSingle();

    if (conflict) {
      const err: any = new Error('New time slot conflicts with another booked session.');
      err.code = 'SESSION_CONFLICT';
      err.status = 409;
      throw err;
    }

    // 3b. Check Google Calendar conflict on new time
    const googleBusy = await GoogleCalendarService.getBusySlots(
      appt.therapist_account_id,
      newStart,
      newEnd
    );
    const nStartMs = new Date(newStart).getTime();
    const nEndMs = new Date(newEnd).getTime();
    const hasGoogleConflict = googleBusy.some((gb) => {
      const bStart = new Date(gb.start).getTime();
      const bEnd = new Date(gb.end).getTime();
      return nStartMs < bEnd && nEndMs > bStart;
    });

    if (hasGoogleConflict) {
      const err: any = new Error('New time slot conflicts with therapist Google Calendar.');
      err.code = 'SLOT_UNAVAILABLE';
      err.status = 409;
      throw err;
    }

    // 3c. Check therapist manual blocked availability windows on new time
    const { data: availBlocks } = await supabase
      .from('therapist_availability_blocks')
      .select('*')
      .eq('therapist_account_id', appt.therapist_account_id)
      .eq('is_blocked', true);

    const slotStartDate = new Date(newStart);
    const slotEndDate = new Date(newEnd);
    const dateStr = slotStartDate.toLocaleDateString('en-CA');
    const dayOfWeek = slotStartDate.getDay();
    const slotStartFmt = `${String(slotStartDate.getHours()).padStart(2, '0')}:${String(slotStartDate.getMinutes()).padStart(2, '0')}`;
    const slotEndFmt = `${String(slotEndDate.getHours()).padStart(2, '0')}:${String(slotEndDate.getMinutes()).padStart(2, '0')}`;

    const isTherapistBlocked = availBlocks?.some((b: any) => {
      if (!b.is_blocked) return false;
      if (b.specific_date) {
        if (b.specific_date !== dateStr) return false;
        const bStart = (b.start_time || '00:00:00').substring(0, 5);
        const bEnd = (b.end_time || '23:59:59').substring(0, 5);
        return slotStartFmt < bEnd && slotEndFmt > bStart;
      }
      if (b.is_recurring && b.day_of_week === dayOfWeek) {
        const bStart = (b.start_time || '00:00:00').substring(0, 5);
        const bEnd = (b.end_time || '23:59:59').substring(0, 5);
        return slotStartFmt < bEnd && slotEndFmt > bStart;
      }
      return false;
    });

    if (isTherapistBlocked) {
      const err: any = new Error('Selected time slot falls within therapist blocked leave/time-off.');
      err.code = 'SLOT_UNAVAILABLE';
      err.status = 409;
      throw err;
    }

    // 4. Insert audit record in therapist_session_reschedules
    await supabase.from('therapist_session_reschedules').insert({
      appointment_id: appointmentId,
      previous_start: appt.scheduled_start,
      previous_end: appt.scheduled_end,
      new_start: newStart,
      new_end: newEnd,
      rescheduled_by: requestedBy,
      reason: params.reason || `Rescheduled by ${requestedBy}`,
    });

    // 5. Update appointment
    const { data: updatedAppt, error: updateErr } = await supabase
      .from('therapist_clinical_appointments')
      .update({
        scheduled_start: newStart,
        scheduled_end: newEnd,
        status: 'rescheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select('*')
      .single();

    if (updateErr) {
      throw new Error('Failed to update appointment record.');
    }

    // 6. Update Google Calendar event
    if (appt.google_calendar_event_id) {
      await GoogleCalendarService.updateEventTimes(
        appt.therapist_account_id,
        appt.google_calendar_event_id,
        newStart,
        newEnd
      );
    }

    // 7. Update linked booking if present
    if (appt.booking_id) {
      await supabase
        .from('therapy_session_bookings')
        .update({
          slot_start: newStart,
          slot_end: newEnd,
          booking_status: 'rescheduled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', appt.booking_id);
    }

    // 8. Dispatch notification emails
    const identities = await this.resolveParticipantIdentities({
      userId: appt.user_id,
      therapistAccountId: appt.therapist_account_id,
      bookingId: appt.booking_id,
    });

    await EmailService.notifySessionRescheduled({
      appointmentId,
      previousStart: appt.scheduled_start,
      newStart,
      clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
      therapistEmail: identities.therapistEmail || 'contactus@ingresswithin.com',
      clientName: identities.clientName,
      therapistName: identities.therapistName,
      googleMeetUrl: appt.google_meet_url || appt.meeting_link,
    });

    return updatedAppt;
  }

  /**
   * Cancels an appointment and applies the authoritative refund policy:
   * - >= 48 hours: 100% full refund automatically initiated
   * - 24-48 hours: Administrative review / credit flagged
   * - < 24 hours: Non-refundable
   * - If cancelled by therapist: 100% full refund always!
   */
  static async cancelSession(params: {
    appointmentId: string;
    cancelledBy: 'client' | 'therapist' | 'admin';
    userId?: string;
    therapistAccountId?: string;
    reason?: string;
  }) {
    const { appointmentId, cancelledBy, reason } = params;

    if (this.activeCancellationLocks.has(appointmentId)) {
      const err: any = new Error('Cancellation currently in progress for this appointment.');
      err.code = 'CONCURRENT_OPERATION';
      err.status = 409;
      throw err;
    }
    this.activeCancellationLocks.add(appointmentId);

    try {
      // 1. Fetch appointment
      const { data: appt, error } = await supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (error || !appt) {
        const err: any = new Error('Appointment not found.');
        err.code = 'SESSION_NOT_FOUND';
        err.status = 404;
        throw err;
      }

      // Ownership check
      if (cancelledBy === 'client' && (!params.userId || appt.user_id !== params.userId)) {
        const err: any = new Error('Unauthorized to cancel this appointment.');
        err.code = 'UNAUTHORIZED';
        err.status = 403;
        throw err;
      }
      if (cancelledBy === 'therapist' && (!params.therapistAccountId || appt.therapist_account_id !== params.therapistAccountId)) {
        const err: any = new Error('Unauthorized to cancel this appointment.');
        err.code = 'UNAUTHORIZED';
        err.status = 403;
        throw err;
      }

      if (appt.status === 'completed') {
        const err: any = new Error('Cannot cancel a completed session.');
        err.code = 'SESSION_IMMUTABLE';
        err.status = 400;
        throw err;
      }

      if (appt.status === 'cancelled') {
        return { success: true, appointment: appt, alreadyCancelled: true };
      }

      // 2. Evaluate Refund Policy
      const scheduledStart = new Date(appt.scheduled_start).getTime();
      const now = Date.now();
      const hoursRemaining = (scheduledStart - now) / (1000 * 60 * 60);

      let refundStatus: 'none' | 'eligible' | 'pending' | 'full' | 'partial' | 'denied' | 'failed' = 'denied';

      if (cancelledBy === 'therapist' || cancelledBy === 'admin') {
        refundStatus = 'eligible';
      } else if (hoursRemaining >= 48) {
        refundStatus = 'eligible';
      } else if (hoursRemaining >= 24) {
        refundStatus = 'pending'; // 24-48 hours review window
      } else {
        refundStatus = 'denied';  // Under 24 hours
      }

      // 3. Execute Razorpay refund if eligible
      let refundId: string | null = appt.refund_id || null;
      let refundAmountPaise = 0;

      if (appt.booking_id) {
        const { data: bkg } = await supabase
          .from('therapy_session_bookings')
          .select('amount_paise')
          .eq('id', appt.booking_id)
          .maybeSingle();

        refundAmountPaise = bkg?.amount_paise || 177000;
      }

      // Idempotency anchor: if already refunded, keep full
      if (appt.refund_status === 'full') {
        refundStatus = 'full';
        refundId = appt.refund_id || null;
      } else if (refundStatus === 'eligible') {
        if (appt.payment_id) {
          const rzp = BillingService.getRazorpayClient();
          if (rzp) {
            try {
              const rzpRefund = await rzp.payments.refund(appt.payment_id, {
                amount: refundAmountPaise > 0 ? refundAmountPaise : undefined,
                notes: {
                  appointment_id: appointmentId,
                  cancelled_by: cancelledBy,
                },
              });
              if (rzpRefund?.id) {
                refundId = rzpRefund.id;
                refundStatus = 'full';
                await AdminAuditService.logAction({
                  action: 'refund_issued',
                  resourceType: 'appointment',
                  resourceId: appointmentId,
                  actorType: cancelledBy === 'admin' ? 'admin' : (cancelledBy === 'therapist' ? 'therapist' : 'client'),
                  actorId: params.userId || params.therapistAccountId || 'system',
                  metadata: {
                    refundId,
                    amountPaise: refundAmountPaise,
                    paymentId: appt.payment_id,
                  },
                });
              } else {
                refundStatus = 'failed';
              }
            } catch (rfErr: any) {
              console.error('[SessionBookingService] Razorpay refund failed:', rfErr);
              refundStatus = 'failed';
              await AdminAuditService.logAction({
                action: 'refund_failed',
                resourceType: 'appointment',
                resourceId: appointmentId,
                actorType: cancelledBy === 'admin' ? 'admin' : (cancelledBy === 'therapist' ? 'therapist' : 'client'),
                actorId: params.userId || params.therapistAccountId || 'system',
                metadata: {
                  error: rfErr?.message || String(rfErr),
                  paymentId: appt.payment_id,
                  amountPaise: refundAmountPaise,
                },
              });
            }
          } else {
            refundStatus = 'failed';
            await AdminAuditService.logAction({
              action: 'refund_failed',
              resourceType: 'appointment',
              resourceId: appointmentId,
              actorType: cancelledBy === 'admin' ? 'admin' : (cancelledBy === 'therapist' ? 'therapist' : 'client'),
              actorId: params.userId || params.therapistAccountId || 'system',
              metadata: {
                error: 'Razorpay gateway client not configured.',
                paymentId: appt.payment_id,
              },
            });
          }
        } else {
          refundStatus = 'none';
        }
      }

      // 4. Update linked booking if present
      if (appt.booking_id) {
        await supabase
          .from('therapy_session_bookings')
          .update({
            booking_status: 'cancelled',
            cancellation_reason: reason || `Cancelled by ${cancelledBy}`,
            payment_status: refundStatus === 'full' ? 'refunded' : (refundStatus === 'failed' ? 'paid' : (refundStatus === 'pending' ? 'pending' : 'paid')),
            refund_status: refundStatus,
            refund_id: refundId,
            refund_amount_paise: refundStatus === 'full' ? refundAmountPaise : 0,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appt.booking_id);
      }

      // 5. Update appointment
      const apptUpdate: Record<string, any> = {
        status: 'cancelled',
        cancelled_by: cancelledBy,
        cancellation_reason: reason || `Cancelled by ${cancelledBy}`,
        refund_status: refundStatus,
        updated_at: new Date().toISOString(),
      };
      if (refundId) {
        apptUpdate.refund_id = refundId;
      }

      let { data: updatedAppt, error: cancelUpdErr } = await supabase
        .from('therapist_clinical_appointments')
        .update(apptUpdate)
        .eq('id', appointmentId)
        .select('*')
        .single();

      if (cancelUpdErr && (cancelUpdErr.message?.includes('refund_id') || cancelUpdErr.code === 'PGRST204')) {
        delete apptUpdate.refund_id;
        const fbRes = await supabase
          .from('therapist_clinical_appointments')
          .update(apptUpdate)
          .eq('id', appointmentId)
          .select('*')
          .single();
        updatedAppt = fbRes.data;
      }

      // 6. Delete Google Calendar event
      if (appt.google_calendar_event_id) {
        const delResult = await GoogleCalendarService.deleteEvent(
          appt.therapist_account_id,
          appt.google_calendar_event_id
        );
        if (!delResult.success) {
          await supabase
            .from('therapist_clinical_appointments')
            .update({ calendar_sync_status: 'failed' })
            .eq('id', appointmentId);
        }
      }

      // 7. Adjust earnings ONLY IF refund confirmed
      if (refundStatus === 'full') {
        await TherapistPayoutService.handleAppointmentRefund(appointmentId);
      }

      // 8. Dispatch notification emails
      const identities = await this.resolveParticipantIdentities({
        userId: appt.user_id,
        therapistAccountId: appt.therapist_account_id,
        bookingId: appt.booking_id,
      });

      await EmailService.notifySessionCancelled({
        appointmentId,
        scheduledStart: appt.scheduled_start,
        clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
        therapistEmail: identities.therapistEmail || 'contactus@ingresswithin.com',
        clientName: identities.clientName,
        therapistName: identities.therapistName,
        reason,
        refundStatus,
      });

      if (refundStatus === 'full' && refundId) {
        await EmailService.notifyRefundInitiated({
          clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
          clientName: identities.clientName,
          amountPaise: refundAmountPaise,
          refundId,
          bookingId: appt.booking_id,
        });
      }

      return {
        success: true,
        refundStatus,
        refundId,
        appointment: updatedAppt,
      };
    } finally {
      this.activeCancellationLocks.delete(appointmentId);
    }
  }

  /**
   * Retries a failed or pending refund for an appointment.
   * Admin-only operation with strict concurrency locking and audit logging.
   */
  static async retryRefund(appointmentId: string, adminActorId: string) {
    if (this.activeRefundLocks.has(appointmentId)) {
      const err: any = new Error('Refund retry currently in progress.');
      err.code = 'CONCURRENT_OPERATION';
      err.status = 409;
      throw err;
    }
    this.activeRefundLocks.add(appointmentId);

    try {
      const { data: appt, error } = await supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('id', appointmentId)
        .maybeSingle();

      if (error || !appt) {
        const err: any = new Error('Appointment not found.');
        err.code = 'SESSION_NOT_FOUND';
        err.status = 404;
        throw err;
      }

      if (appt.refund_status === 'full') {
        return { success: true, refundStatus: 'full', refundId: appt.refund_id || null, alreadyRefunded: true };
      }

      if (!appt.payment_id) {
        const err: any = new Error('No payment ID associated with appointment to refund.');
        err.code = 'PAYMENT_NOT_FOUND';
        err.status = 400;
        throw err;
      }

      let refundAmountPaise = 177000;
      if (appt.booking_id) {
        const { data: bkg } = await supabase
          .from('therapy_session_bookings')
          .select('amount_paise')
          .eq('id', appt.booking_id)
          .maybeSingle();
        if (bkg?.amount_paise) refundAmountPaise = bkg.amount_paise;
      }

      const rzp = BillingService.getRazorpayClient();
      if (!rzp) {
        const err: any = new Error('Razorpay gateway client not configured.');
        err.code = 'GATEWAY_ERROR';
        err.status = 502;
        throw err;
      }

      let refundId: string | null = null;
      try {
        const rzpRefund = await rzp.payments.refund(appt.payment_id, {
          amount: refundAmountPaise > 0 ? refundAmountPaise : undefined,
          notes: {
            appointment_id: appointmentId,
            retry_by: adminActorId,
          },
        });
        if (rzpRefund?.id) {
          refundId = rzpRefund.id;
        } else {
          throw new Error('Razorpay did not return a refund ID');
        }
      } catch (rfErr: any) {
        await AdminAuditService.logAction({
          action: 'refund_failed',
          resourceType: 'appointment',
          resourceId: appointmentId,
          actorType: 'admin',
          actorId: adminActorId,
          metadata: {
            error: rfErr?.message || String(rfErr),
            paymentId: appt.payment_id,
            isRetry: true,
          },
        });
        throw rfErr;
      }

      // Update DB with confirmed refund
      const updateData: Record<string, any> = {
        refund_status: 'full',
        updated_at: new Date().toISOString(),
      };
      if (refundId) {
        updateData.refund_id = refundId;
      }

      const { error: updErr } = await supabase
        .from('therapist_clinical_appointments')
        .update(updateData)
        .eq('id', appointmentId);

      if (updErr && (updErr.message?.includes('refund_id') || updErr.code === 'PGRST204')) {
        delete updateData.refund_id;
        await supabase
          .from('therapist_clinical_appointments')
          .update(updateData)
          .eq('id', appointmentId);
      }

      if (appt.booking_id) {
        await supabase
          .from('therapy_session_bookings')
          .update({
            payment_status: 'refunded',
            refund_status: 'full',
            refund_id: refundId,
            refund_amount_paise: refundAmountPaise,
            updated_at: new Date().toISOString(),
          })
          .eq('id', appt.booking_id);
      }

      // Void therapist earnings now that refund is confirmed
      await TherapistPayoutService.handleAppointmentRefund(appointmentId);

      // Audit log
      await AdminAuditService.logAction({
        action: 'refund_issued',
        resourceType: 'appointment',
        resourceId: appointmentId,
        actorType: 'admin',
        actorId: adminActorId,
        metadata: {
          refundId,
          amountPaise: refundAmountPaise,
          paymentId: appt.payment_id,
          isRetry: true,
        },
      });

      return {
        success: true,
        refundStatus: 'full',
        refundId,
      };
    } finally {
      this.activeRefundLocks.delete(appointmentId);
    }
  }

  /**
   * Handles attendance status / no-show recording.
   * - attended: Session completed normally, therapist paid, first_session_completed set if first session.
   * - client_no_show: Non-refundable, therapist earnings kept, first_session_completed NOT set.
   * - therapist_no_show: 100% full refund to client, therapist earnings voided, first_session_completed NOT set.
   */
  static async recordAttendanceStatus(params: {
    appointmentId: string;
    therapistAccountId: string;
    attendanceStatus: 'attended' | 'client_no_show' | 'therapist_no_show';
    notes?: string;
  }) {
    const { appointmentId, therapistAccountId, attendanceStatus, notes } = params;

    if (this.activeNoShowLocks.has(appointmentId)) {
      const err: any = new Error('Attendance update in progress for this appointment.');
      err.code = 'CONCURRENT_OPERATION';
      err.status = 409;
      throw err;
    }
    this.activeNoShowLocks.add(appointmentId);

    try {
      const { data: appt, error } = await supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('id', appointmentId)
        .eq('therapist_account_id', therapistAccountId)
        .maybeSingle();

      if (error || !appt) {
        const err: any = new Error('Appointment not found or unauthorized.');
        err.code = 'SESSION_NOT_FOUND';
        err.status = 404;
        throw err;
      }

      if (appt.status === 'cancelled') {
        const err: any = new Error('Cannot update attendance for a cancelled session.');
        err.code = 'SESSION_CANCELLED';
        err.status = 400;
        throw err;
      }

      let refundStatus = appt.refund_status || 'none';
      let refundId: string | null = appt.refund_id || null;
      let newStatus = appt.status;

      if (attendanceStatus === 'client_no_show') {
        // Client missed: session counts as consumed, NO refund, therapist keeps earning
        newStatus = 'completed';
        refundStatus = 'denied';
        await TherapistPayoutService.handleAppointmentNoShow(appointmentId, 'client');
        await AdminAuditService.logAction({
          action: 'client_no_show',
          resourceType: 'appointment',
          resourceId: appointmentId,
          actorType: 'therapist',
          actorId: therapistAccountId,
          metadata: { notes },
        });
      } else if (attendanceStatus === 'therapist_no_show') {
        // Clinician missed: 100% full refund to client, therapist earning voided
        newStatus = 'cancelled';
        refundStatus = 'eligible';

        if (appt.payment_id) {
          const rzp = BillingService.getRazorpayClient();
          if (rzp) {
            try {
              const rzpRefund = await rzp.payments.refund(appt.payment_id, {
                notes: {
                  appointment_id: appointmentId,
                  reason: 'therapist_no_show',
                },
              });
              if (rzpRefund?.id) {
                refundId = rzpRefund.id;
                refundStatus = 'full';
              } else {
                refundStatus = 'failed';
              }
            } catch (rErr: any) {
              console.warn('[SessionBookingService] Therapist no-show refund error:', rErr);
              refundStatus = 'failed';
              await AdminAuditService.logAction({
                action: 'refund_failed',
                resourceType: 'appointment',
                resourceId: appointmentId,
                actorType: 'therapist',
                actorId: therapistAccountId,
                metadata: {
                  error: rErr?.message || String(rErr),
                  paymentId: appt.payment_id,
                  reason: 'therapist_no_show',
                },
              });
            }
          } else {
            refundStatus = 'failed';
          }
        } else {
          refundStatus = 'none';
        }

        // Void therapist earnings
        await TherapistPayoutService.handleAppointmentNoShow(appointmentId, 'therapist');

        await AdminAuditService.logAction({
          action: 'therapist_no_show',
          resourceType: 'appointment',
          resourceId: appointmentId,
          actorType: 'therapist',
          actorId: therapistAccountId,
          metadata: {
            refundStatus,
            refundId,
            notes,
          },
        });
      } else if (attendanceStatus === 'attended') {
        newStatus = 'completed';
        await AdminAuditService.logAction({
          action: 'appointment_attended',
          resourceType: 'appointment',
          resourceId: appointmentId,
          actorType: 'therapist',
          actorId: therapistAccountId,
          metadata: { notes },
        });
      }

      const attendUpdate: Record<string, any> = {
        attendance_status: attendanceStatus,
        status: newStatus,
        refund_status: refundStatus,
        client_notes: notes || appt.client_notes,
        updated_at: new Date().toISOString(),
      };
      if (refundId) {
        attendUpdate.refund_id = refundId;
      }

      let { data: updatedAppt, error: attendErr } = await supabase
        .from('therapist_clinical_appointments')
        .update(attendUpdate)
        .eq('id', appointmentId)
        .select('*')
        .single();

      if (attendErr && (attendErr.message?.includes('refund_id') || attendErr.code === 'PGRST204')) {
        delete attendUpdate.refund_id;
        const fbRes = await supabase
          .from('therapist_clinical_appointments')
          .update(attendUpdate)
          .eq('id', appointmentId)
          .select('*')
          .single();
        updatedAppt = fbRes.data;
      }

      // CRITICAL INVARIANT: Mark first_session_completed ONLY IF attendanceStatus === 'attended'
      if (attendanceStatus === 'attended' && appt.relationship_id) {
        await supabase
          .from('therapy_care_relationships')
          .update({ first_session_completed: true })
          .eq('id', appt.relationship_id);
      }

      // Send notifications if no-show
      if (attendanceStatus === 'client_no_show' || attendanceStatus === 'therapist_no_show') {
        const identities = await this.resolveParticipantIdentities({
          userId: appt.user_id,
          therapistAccountId: appt.therapist_account_id,
          bookingId: appt.booking_id,
        });

        await EmailService.notifyNoShow({
          appointmentId,
          scheduledStart: appt.scheduled_start,
          clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
          therapistEmail: identities.therapistEmail || 'contactus@ingresswithin.com',
          clientName: identities.clientName,
          therapistName: identities.therapistName,
          attendanceStatus,
        });

        if (attendanceStatus === 'therapist_no_show' && refundStatus === 'full' && refundId) {
          await EmailService.notifyRefundInitiated({
            clientEmail: identities.clientEmail || 'contactus@ingresswithin.com',
            clientName: identities.clientName,
            amountPaise: 177000,
            refundId,
            bookingId: appt.booking_id,
          });
        }
      }

      return updatedAppt;
    } finally {
      this.activeNoShowLocks.delete(appointmentId);
    }
  }

  /**
   * Safely retries Google Calendar synchronization and Meet creation for an appointment.
   * Invoked via POST /api/therapy/sessions/sync-calendar
   */
  static async retryCalendarSync(
    appointmentId: string,
    caller: { accountType: 'user' | 'therapist'; accountId: string }
  ) {
    const { data: appt, error } = await supabase
      .from('therapist_clinical_appointments')
      .select('*')
      .eq('id', appointmentId)
      .maybeSingle();

    if (error || !appt) {
      const err: any = new Error('Appointment not found.');
      err.code = 'APPOINTMENT_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    // Ownership check
    if (caller.accountType === 'user' && appt.user_id !== caller.accountId) {
      const err: any = new Error('Unauthorized.');
      err.code = 'UNAUTHORIZED';
      err.status = 403;
      throw err;
    }
    if (caller.accountType === 'therapist' && appt.therapist_account_id !== caller.accountId) {
      const err: any = new Error('Unauthorized.');
      err.code = 'UNAUTHORIZED';
      err.status = 403;
      throw err;
    }

    if (appt.status === 'cancelled') {
      const err: any = new Error('Cannot sync a cancelled appointment.');
      err.code = 'APPOINTMENT_CANCELLED';
      err.status = 400;
      throw err;
    }

    const identities = await this.resolveParticipantIdentities({
      userId: appt.user_id,
      therapistAccountId: appt.therapist_account_id,
      bookingId: appt.booking_id,
    });

    const syncResult = await GoogleCalendarService.syncAppointmentToGoogle(appt.id, {
      summary: `Ingress Within: Session with ${identities.clientName}`,
      description: `Ingress Within confidential therapy session.`,
    });

    let meetUrl = isValidGoogleMeetUrl(syncResult.googleMeetUrl) ? syncResult.googleMeetUrl : null;
    if (!meetUrl && appt.modality !== 'in_person' && appt.session_type !== 'in_person') {
      const fallbackMeet = GoogleCalendarService.getFallbackMeetUrl();
      if (fallbackMeet) {
        meetUrl = fallbackMeet;
        await supabase
          .from('therapist_clinical_appointments')
          .update({
            google_meet_url: fallbackMeet,
            google_meet_status: 'created',
            updated_at: new Date().toISOString(),
          })
          .eq('id', appt.id);
      }
    }

    const { data: updatedAppt } = await supabase
      .from('therapist_clinical_appointments')
      .select('*')
      .eq('id', appt.id)
      .single();

    return {
      success: syncResult.calendarSyncStatus === 'synced',
      appointment: updatedAppt,
      syncStatus: syncResult.calendarSyncStatus,
      googleMeetUrl: meetUrl,
      meetUrl,
    };
  }
}
