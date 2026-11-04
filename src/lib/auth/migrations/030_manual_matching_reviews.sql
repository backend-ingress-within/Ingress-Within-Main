-- =============================================================================
-- Migration 030: Manual Matching Reviews & Unmatched Intake Administration
-- =============================================================================
-- Tracks intakes where zero immediate verified matches were found, or where
-- manual clinical team assistance was requested. Enforces zero therapist
-- broadcast or notification side-effects, preserving privacy and clinical oversight.
-- =============================================================================

CREATE TABLE IF NOT EXISTS public.manual_matching_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id VARCHAR(50) UNIQUE NOT NULL,

    user_id UUID NOT NULL
        REFERENCES public.users(id) ON DELETE CASCADE,

    therapy_session_id UUID
        REFERENCES public.therapy_sessions(id) ON DELETE CASCADE,

    intake_id UUID
        REFERENCES public.therapy_intakes(id) ON DELETE SET NULL,

    therapy_type VARCHAR(50) NOT NULL DEFAULT 'Individual',

    matching_requirements JSONB NOT NULL DEFAULT '{}'::jsonb,
    client_preferences JSONB NOT NULL DEFAULT '{}'::jsonb,

    no_match_reason TEXT,
    unmet_criteria JSONB NOT NULL DEFAULT '[]'::jsonb,

    review_status VARCHAR(40) NOT NULL DEFAULT 'manual_review_required'
        CHECK (review_status IN (
            'manual_review_required',
            'under_review',
            'therapist_identified',
            'awaiting_therapist_acceptance',
            'client_contacted',
            'resolved',
            'closed'
        )),

    assigned_reviewer_id UUID,
    assigned_reviewer_name TEXT,

    identified_therapist_id UUID
        REFERENCES public.therapist_accounts(id) ON DELETE SET NULL,

    internal_notes TEXT,
    audit_trail JSONB NOT NULL DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_manual_matching_reviews_status
    ON public.manual_matching_reviews (review_status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_manual_matching_reviews_user
    ON public.manual_matching_reviews (user_id, created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.manual_matching_reviews ENABLE ROW LEVEL SECURITY;

-- Service role bypass
DROP POLICY IF EXISTS "Service role access for manual_matching_reviews" ON public.manual_matching_reviews;
CREATE POLICY "Service role access for manual_matching_reviews"
    ON public.manual_matching_reviews
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Clients can only read their own manual review records
DROP POLICY IF EXISTS "Clients read own manual_matching_reviews" ON public.manual_matching_reviews;
CREATE POLICY "Clients read own manual_matching_reviews"
    ON public.manual_matching_reviews
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
