-- =====================================================================
-- Migration 032: Therapy Intake Leads & Drop-off Pipeline
-- =====================================================================
-- Captures client contact information at earliest point (phone number entry)
-- and tracks longitudinal progress through intake steps, drop-offs, matches
-- viewed, and conversion states for CRM and clinical follow-up.
-- =====================================================================

CREATE TABLE IF NOT EXISTS public.therapy_intake_leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    full_name TEXT,
    email TEXT,
    journey_type TEXT DEFAULT 'guided', -- 'guided' | 'conversational' | 'team'
    current_step INTEGER DEFAULT 0,
    drop_off_stage TEXT NOT NULL DEFAULT 'contact_captured',
    -- Stages: 'contact_captured', 'concerns_selected', 'safety_evaluated', 
    --         'preferences_set', 'matches_shown', 'booking_initiated', 'completed'
    answers JSONB DEFAULT '{}'::jsonb,
    concerns TEXT[] DEFAULT '{}'::text[],
    preferred_language TEXT,
    therapist_gender_pref TEXT,
    budget NUMERIC,
    matches_shown JSONB DEFAULT '[]'::jsonb,
    selected_therapist_id TEXT,
    selected_therapist_name TEXT,
    is_completed BOOLEAN DEFAULT false,
    follow_up_status TEXT DEFAULT 'new',
    -- Status: 'new', 'contacted', 'callback_scheduled', 'converted', 'closed_lost', 'not_interested'
    internal_notes TEXT,
    last_active_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Fast lookup indexes
CREATE INDEX IF NOT EXISTS idx_therapy_intake_leads_phone ON public.therapy_intake_leads(phone_number);
CREATE INDEX IF NOT EXISTS idx_therapy_intake_leads_session ON public.therapy_intake_leads(session_id);
CREATE INDEX IF NOT EXISTS idx_therapy_intake_leads_email ON public.therapy_intake_leads(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_therapy_intake_leads_stage ON public.therapy_intake_leads(drop_off_stage);
CREATE INDEX IF NOT EXISTS idx_therapy_intake_leads_status ON public.therapy_intake_leads(follow_up_status);
CREATE INDEX IF NOT EXISTS idx_therapy_intake_leads_updated ON public.therapy_intake_leads(updated_at DESC);

-- Enable RLS
ALTER TABLE public.therapy_intake_leads ENABLE ROW LEVEL SECURITY;

-- Anonymous and authenticated visitors can insert and update their own intake session leads
CREATE POLICY "Allow public insert and update leads by session"
ON public.therapy_intake_leads
FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);

COMMENT ON TABLE public.therapy_intake_leads IS 'Ingress Within intake leads and drop-off pipeline tracking for clinical care outreach.';
