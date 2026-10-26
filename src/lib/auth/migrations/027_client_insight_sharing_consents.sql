-- ==============================================================================
-- INGRESS WITHIN: CLIENT INSIGHT SHARING CONSENTS SCHEMA & RLS
-- ==============================================================================
-- Scope: Secure, consent-based feature allowing a client to share selected
-- insights from their self-reflection and reporting features with their
-- assigned therapist.
--
-- Categories:
--   1. pattern_summary
--   2. emotional_vocabulary
--   3. weekly_reports
--   4. monthly_reports
--
-- Security Invariants:
--   - Explicit, affirmative client consent (never pre-checked or inferred).
--   - Granular per-category authorization.
--   - Tied strictly to the current active care relationship (transfers/reassignments require renewed consent).
--   - Row-level security for tenant isolation.
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.client_insight_sharing_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    therapist_account_id UUID REFERENCES public.therapist_accounts(id) ON DELETE SET NULL,
    relationship_id UUID REFERENCES public.therapy_care_relationships(id) ON DELETE SET NULL,
    is_enabled BOOLEAN NOT NULL DEFAULT false,
    share_pattern_summary BOOLEAN NOT NULL DEFAULT false,
    share_emotional_vocabulary BOOLEAN NOT NULL DEFAULT false,
    share_weekly_reports BOOLEAN NOT NULL DEFAULT false,
    share_monthly_reports BOOLEAN NOT NULL DEFAULT false,
    consent_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0',
    consented_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    ip_address VARCHAR(50),
    user_agent TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist if table was partially created
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS client_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS therapist_account_id UUID REFERENCES public.therapist_accounts(id) ON DELETE SET NULL;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS relationship_id UUID REFERENCES public.therapy_care_relationships(id) ON DELETE SET NULL;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS is_enabled BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS share_pattern_summary BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS share_emotional_vocabulary BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS share_weekly_reports BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS share_monthly_reports BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS consent_version VARCHAR(50) NOT NULL DEFAULT 'v1.0.0';
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS revoked_at TIMESTAMPTZ;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE public.client_insight_sharing_consents ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Lookup index for client sharing preferences
CREATE INDEX IF NOT EXISTS idx_insight_consents_client 
    ON public.client_insight_sharing_consents (client_id);

-- Lookup index for therapist relationship authorization
CREATE INDEX IF NOT EXISTS idx_insight_consents_lookup 
    ON public.client_insight_sharing_consents (client_id, therapist_account_id, is_enabled);

-- Enable Row Level Security
ALTER TABLE public.client_insight_sharing_consents ENABLE ROW LEVEL SECURITY;

-- Clients can view and update their own insight sharing consent
DROP POLICY IF EXISTS "Clients can view own insight sharing consents" ON public.client_insight_sharing_consents;
CREATE POLICY "Clients can view own insight sharing consents"
    ON public.client_insight_sharing_consents FOR SELECT
    USING (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can insert own insight sharing consents" ON public.client_insight_sharing_consents;
CREATE POLICY "Clients can insert own insight sharing consents"
    ON public.client_insight_sharing_consents FOR INSERT
    WITH CHECK (auth.uid() = client_id);

DROP POLICY IF EXISTS "Clients can update own insight sharing consents" ON public.client_insight_sharing_consents;
CREATE POLICY "Clients can update own insight sharing consents"
    ON public.client_insight_sharing_consents FOR UPDATE
    USING (auth.uid() = client_id)
    WITH CHECK (auth.uid() = client_id);

-- Therapists can only select consents for clients where they maintain an ACTIVE care relationship
DROP POLICY IF EXISTS "Therapists can view active clients insight sharing consents" ON public.client_insight_sharing_consents;
CREATE POLICY "Therapists can view active clients insight sharing consents"
    ON public.client_insight_sharing_consents FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.therapy_care_relationships tcr
            JOIN public.therapist_accounts ta ON ta.id = tcr.therapist_account_id
            WHERE tcr.user_id = client_insight_sharing_consents.client_id
              AND tcr.status = 'active'
              AND ta.id = client_insight_sharing_consents.therapist_account_id
        )
    );
