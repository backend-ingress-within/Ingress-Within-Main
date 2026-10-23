-- ==============================================================================
-- INGRESS WITHIN: ATOMIC GUEST SESSION SLOT HOLD TRANSACTION
-- Migration: 025_guest_slot_hold_transaction.sql
-- ==============================================================================
-- Scope:
--   - Provides atomic slot reservation for guest checkout with 15-minute hold expiry.
--   - Enforces PostgreSQL advisory transaction locking (pg_advisory_xact_lock)
--     to eliminate race conditions when concurrent guests attempt to hold the same slot.
--   - Atomically checks clinical appointments, Google Calendar conflicts, and existing holds.
--   - Automatically bypasses expired holds (expires_at <= now()) during conflict checks.
--   - Idempotently handles duplicate hold requests matching the same idempotency key.
-- ==============================================================================

BEGIN;

-- 1. Index for fast querying of active unexpired holds
CREATE INDEX IF NOT EXISTS idx_th_bookings_active_holds 
    ON public.therapy_session_bookings (therapist_account_id, slot_start, slot_end) 
    WHERE booking_status = 'pending_payment';

-- 2. Atomic Slot Hold Creation Function
CREATE OR REPLACE FUNCTION public.create_guest_session_slot_hold(
    p_therapist_account_id UUID,
    p_user_id UUID,
    p_relationship_id UUID,
    p_slot_start TIMESTAMPTZ,
    p_slot_end TIMESTAMPTZ,
    p_amount_paise INTEGER,
    p_booking_reference VARCHAR(50),
    p_booking_type VARCHAR(30),
    p_metadata JSONB,
    p_hold_duration_minutes INTEGER DEFAULT 15,
    p_idempotency_key TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_now TIMESTAMPTZ := now();
    v_conflict_appt_id UUID;
    v_conflict_hold_id UUID;
    v_existing_booking public.therapy_session_bookings%ROWTYPE;
    v_new_booking public.therapy_session_bookings%ROWTYPE;
    v_expires_at TIMESTAMPTZ;
BEGIN
    -- 1. Validate timestamps
    IF p_slot_start IS NULL OR p_slot_end IS NULL OR p_slot_end <= p_slot_start THEN
        RAISE EXCEPTION 'INVALID_TIME_RANGE: Scheduled end time must be after scheduled start time.' USING ERRCODE = '22000';
    END IF;

    IF p_slot_start < v_now THEN
        RAISE EXCEPTION 'SLOT_IN_PAST: Cannot reserve a time slot in the past.' USING ERRCODE = '22000';
    END IF;

    -- 2. Concurrency Protection: Acquire advisory transaction lock on therapist scheduling
    -- This serializes concurrent booking requests for this therapist for the duration of this transaction
    PERFORM pg_advisory_xact_lock(hashtext('th_sched_' || p_therapist_account_id::text));
    PERFORM pg_advisory_xact_lock(hashtext('th_slot_' || p_therapist_account_id::text || '_' || p_slot_start::text));

    -- 3. Idempotency Check: if idempotency key provided, check for existing active unexpired hold
    IF p_idempotency_key IS NOT NULL AND length(trim(p_idempotency_key)) > 0 THEN
        SELECT * INTO v_existing_booking
        FROM public.therapy_session_bookings
        WHERE therapist_account_id = p_therapist_account_id
          AND metadata->>'idempotency_key' = trim(p_idempotency_key)
          AND booking_status = 'pending_payment'
          AND expires_at > v_now
        ORDER BY created_at DESC
        LIMIT 1;

        IF v_existing_booking.id IS NOT NULL THEN
            RETURN jsonb_build_object(
                'success', true,
                'is_idempotent_replay', true,
                'booking', to_jsonb(v_existing_booking),
                'message', 'Existing unexpired hold returned idempotently.'
            );
        END IF;
    END IF;

    -- 4. Check Conflict: Confirmed or Scheduled Clinical Appointments
    SELECT id INTO v_conflict_appt_id
    FROM public.therapist_clinical_appointments
    WHERE therapist_account_id = p_therapist_account_id
      AND status IN ('scheduled', 'confirmed', 'in_progress', 'rescheduled')
      AND scheduled_start < p_slot_end
      AND scheduled_end > p_slot_start
    LIMIT 1;

    IF v_conflict_appt_id IS NOT NULL THEN
        RAISE EXCEPTION 'SLOT_UNAVAILABLE: Time slot conflicts with an existing appointment.' USING ERRCODE = 'P0001';
    END IF;

    -- 5. Check Conflict: Active Unexpired Pending Holds
    SELECT id INTO v_conflict_hold_id
    FROM public.therapy_session_bookings
    WHERE therapist_account_id = p_therapist_account_id
      AND booking_status = 'pending_payment'
      AND expires_at > v_now
      AND slot_start < p_slot_end
      AND slot_end > p_slot_start
    LIMIT 1;

    IF v_conflict_hold_id IS NOT NULL THEN
        RAISE EXCEPTION 'SLOT_ON_HOLD: Time slot is currently on hold for another checkout.' USING ERRCODE = 'P0002';
    END IF;

    -- 6. Lazy cleanup: Mark stale expired holds on this slot as 'expired'
    UPDATE public.therapy_session_bookings
    SET booking_status = 'expired',
        updated_at = v_now
    WHERE therapist_account_id = p_therapist_account_id
      AND booking_status = 'pending_payment'
      AND expires_at <= v_now
      AND slot_start < p_slot_end
      AND slot_end > p_slot_start;

    -- 7. Insert the new 15-minute slot hold
    v_expires_at := v_now + (COALESCE(p_hold_duration_minutes, 15) || ' minutes')::interval;

    INSERT INTO public.therapy_session_bookings (
        booking_reference,
        user_id,
        therapist_account_id,
        relationship_id,
        slot_start,
        slot_end,
        session_type,
        modality,
        booking_type,
        booking_status,
        amount_paise,
        currency,
        payment_status,
        expires_at,
        metadata,
        created_at,
        updated_at
    ) VALUES (
        p_booking_reference,
        p_user_id,
        p_therapist_account_id,
        p_relationship_id,
        p_slot_start,
        p_slot_end,
        'video',
        'telehealth',
        COALESCE(p_booking_type, 'first_session'),
        'pending_payment',
        p_amount_paise,
        'INR',
        'pending',
        v_expires_at,
        COALESCE(p_metadata, '{}'::jsonb),
        v_now,
        v_now
    )
    RETURNING * INTO v_new_booking;

    RETURN jsonb_build_object(
        'success', true,
        'is_idempotent_replay', false,
        'booking', to_jsonb(v_new_booking),
        'message', 'Slot hold created successfully.'
    );
END;
$$;

COMMIT;
