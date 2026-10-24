-- ============================================================================
-- MIGRATION 026: GOOGLE CALENDAR TWO-WAY SYNCHRONIZATION & AVAILABILITY ENGINE
-- ============================================================================
-- Description:
--   1. Enhances google_calendar_connections with sync tokens, push notification
--      channel details (channel_id, resource_id, expiration), and last external sync timestamp.
--   2. Creates therapist_external_calendar_events table to cache external events
--      from Google Calendar with stable event IDs, start/end timestamps, all-day flag,
--      transparency (opaque vs transparent), and sync status.
--   3. Configures strict multi-tenant Row Level Security (RLS) so external events
--      are exclusively accessible by the authorized therapist and system service role.
--   4. Creates high-performance composite indexes for interval overlap queries:
--      (start_time < proposed_end AND end_time > proposed_start).
-- ============================================================================

BEGIN;

-- 1. ENHANCE google_calendar_connections
ALTER TABLE public.google_calendar_connections
    ADD COLUMN IF NOT EXISTS next_sync_token TEXT,
    ADD COLUMN IF NOT EXISTS webhook_channel_id TEXT,
    ADD COLUMN IF NOT EXISTS webhook_resource_id TEXT,
    ADD COLUMN IF NOT EXISTS webhook_channel_token TEXT,
    ADD COLUMN IF NOT EXISTS webhook_channel_expiration TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS last_external_sync_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_google_cal_webhook_channel 
    ON public.google_calendar_connections(webhook_channel_id) 
    WHERE webhook_channel_id IS NOT NULL;

-- 2. CREATE therapist_external_calendar_events TABLE
CREATE TABLE IF NOT EXISTS public.therapist_external_calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    google_event_id VARCHAR(255) NOT NULL,
    google_calendar_id VARCHAR(255) DEFAULT 'primary',
    summary TEXT,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    is_all_day BOOLEAN NOT NULL DEFAULT false,
    transparency VARCHAR(30) NOT NULL DEFAULT 'opaque', -- 'opaque' (blocks time) vs 'transparent' (available)
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed',    -- 'confirmed', 'tentative', 'cancelled'
    recurring_event_id VARCHAR(255),
    is_recurring_instance BOOLEAN NOT NULL DEFAULT false,
    etag TEXT,
    html_link TEXT,
    raw_event JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_therapist_google_event UNIQUE (therapist_account_id, google_event_id),
    CONSTRAINT chk_event_time_order CHECK (end_time >= start_time)
);

-- Indexes for lightning fast interval overlap availability queries
CREATE INDEX IF NOT EXISTS idx_ext_events_therapist_window 
    ON public.therapist_external_calendar_events(therapist_account_id, start_time, end_time)
    WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_ext_events_google_id 
    ON public.therapist_external_calendar_events(therapist_account_id, google_event_id);

CREATE INDEX IF NOT EXISTS idx_ext_events_recurring 
    ON public.therapist_external_calendar_events(therapist_account_id, recurring_event_id)
    WHERE recurring_event_id IS NOT NULL;

-- 3. ROW LEVEL SECURITY
ALTER TABLE public.therapist_external_calendar_events ENABLE ROW LEVEL SECURITY;

-- Therapists can only select and manage their own external calendar events
DROP POLICY IF EXISTS "Therapists can view own external events" ON public.therapist_external_calendar_events;
CREATE POLICY "Therapists can view own external events"
    ON public.therapist_external_calendar_events FOR SELECT
    USING (
        therapist_account_id IN (
            SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Therapists can manage own external events" ON public.therapist_external_calendar_events;
CREATE POLICY "Therapists can manage own external events"
    ON public.therapist_external_calendar_events FOR ALL
    USING (
        therapist_account_id IN (
            SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
        )
    );

-- Service role and admin can manage all external calendar events
DROP POLICY IF EXISTS "Service role manages external events" ON public.therapist_external_calendar_events;
CREATE POLICY "Service role manages external events"
    ON public.therapist_external_calendar_events FOR ALL
    USING (
        auth.jwt() ->> 'role' = 'service_role' OR auth.jwt() ->> 'role' = 'admin'
    );

COMMIT;
