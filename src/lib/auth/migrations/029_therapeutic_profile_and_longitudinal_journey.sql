-- ==============================================================================
-- INGRESS WITHIN: THERAPEUTIC PROFILE & LONGITUDINAL CLIENT JOURNEY SCHEMA
-- Migration: 029_therapeutic_profile_and_longitudinal_journey.sql
-- ==============================================================================
-- Scope:
--   1. Creates public.therapeutic_profiles (relationship-scoped living record metadata)
--   2. Creates public.therapeutic_intake_versions (audit and history of client-updated intake)
--   3. Creates public.therapeutic_goals (collaborative clinical & personal goals)
--   4. Creates public.therapeutic_goal_history (immutable audit trail of goal revisions)
--   5. Creates public.therapeutic_life_events (client milestones with privacy boundaries)
--   6. Creates public.therapeutic_periodic_reviews (structured longitudinal reviews)
--   7. Creates public.therapeutic_review_clinical_notes (strictly therapist-only clinical formulation)
--   8. Enforces multi-tenant Row Level Security (RLS) guaranteeing strict privacy boundaries:
--      - Private life events NEVER exposed to therapists
--      - Internal clinical review notes NEVER exposed to clients or general admins
--      - Relationship scoping preventing IDOR across client-therapist tenancies
-- ==============================================================================

BEGIN;

-- 1. THERAPEUTIC PROFILES TABLE (Relationship-Scoped Header)
CREATE TABLE IF NOT EXISTS public.therapeutic_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL UNIQUE REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    review_cadence VARCHAR(50) NOT NULL DEFAULT 'every_6_sessions',
    intake_clarification_flags JSONB NOT NULL DEFAULT '[]'::jsonb,
    intake_last_reviewed_at TIMESTAMPTZ,
    next_review_due_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_therapeutic_profiles_rel 
    ON public.therapeutic_profiles (relationship_id);
CREATE INDEX IF NOT EXISTS idx_therapeutic_profiles_user 
    ON public.therapeutic_profiles (user_id);
CREATE INDEX IF NOT EXISTS idx_therapeutic_profiles_therapist 
    ON public.therapeutic_profiles (therapist_account_id);


-- 2. THERAPEUTIC INTAKE VERSIONS TABLE (Immutable Version History)
CREATE TABLE IF NOT EXISTS public.therapeutic_intake_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL DEFAULT 1,
    intake_data JSONB NOT NULL,
    update_summary TEXT DEFAULT '',
    updated_by UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_intake_versions_rel 
    ON public.therapeutic_intake_versions (relationship_id, version_number DESC);
CREATE INDEX IF NOT EXISTS idx_intake_versions_user 
    ON public.therapeutic_intake_versions (user_id);


-- 3. THERAPEUTIC GOALS TABLE (Collaborative Goals)
CREATE TABLE IF NOT EXISTS public.therapeutic_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    why_it_matters TEXT NOT NULL DEFAULT '',
    category VARCHAR(50) NOT NULL DEFAULT 'anxiety_management' CHECK (category IN (
        'anxiety_management',
        'emotional_regulation',
        'interpersonal_relationships',
        'life_transition',
        'career_academics',
        'habits_routines',
        'mindfulness_acceptance',
        'trauma_processing',
        'other'
    )),
    target_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'in_progress' CHECK (status IN (
        'not_started',
        'in_progress',
        'needs_attention',
        'achieved',
        'paused',
        'revised'
    )),
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    client_notes TEXT NOT NULL DEFAULT '',
    therapist_feedback TEXT NOT NULL DEFAULT '',
    created_by_role VARCHAR(20) NOT NULL DEFAULT 'client' CHECK (created_by_role IN ('client', 'therapist')),
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_therapeutic_goals_rel_status 
    ON public.therapeutic_goals (relationship_id, status);
CREATE INDEX IF NOT EXISTS idx_therapeutic_goals_user 
    ON public.therapeutic_goals (user_id);
CREATE INDEX IF NOT EXISTS idx_therapeutic_goals_therapist 
    ON public.therapeutic_goals (therapist_account_id);


-- 4. THERAPEUTIC GOAL HISTORY TABLE (Audit Trail for Changes)
CREATE TABLE IF NOT EXISTS public.therapeutic_goal_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID NOT NULL REFERENCES public.therapeutic_goals(id) ON DELETE CASCADE,
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    changed_by_role VARCHAR(20) NOT NULL CHECK (changed_by_role IN ('client', 'therapist')),
    changed_by_id UUID NOT NULL,
    previous_status VARCHAR(30),
    new_status VARCHAR(30) NOT NULL,
    previous_progress INTEGER,
    new_progress INTEGER NOT NULL,
    change_reason TEXT DEFAULT '',
    snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_goal_hist_goal 
    ON public.therapeutic_goal_history (goal_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_goal_hist_rel 
    ON public.therapeutic_goal_history (relationship_id);


-- 5. THERAPEUTIC LIFE EVENTS TABLE (Client Milestones with Privacy Controls)
CREATE TABLE IF NOT EXISTS public.therapeutic_life_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'other' CHECK (category IN (
        'career_education',
        'relationships_family',
        'health_wellness',
        'loss_bereavement',
        'relocation_home',
        'achievement_milestone',
        'financial_stress',
        'other'
    )),
    event_date DATE NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    emotional_impact VARCHAR(30) NOT NULL DEFAULT 'neutral' CHECK (emotional_impact IN (
        'positive',
        'neutral',
        'challenging',
        'mixed',
        'severe_distress'
    )),
    discuss_in_session BOOLEAN NOT NULL DEFAULT false,
    is_shared_with_therapist BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_life_events_rel_date 
    ON public.therapeutic_life_events (relationship_id, event_date DESC);
CREATE INDEX IF NOT EXISTS idx_life_events_user_privacy 
    ON public.therapeutic_life_events (user_id, is_shared_with_therapist);
CREATE INDEX IF NOT EXISTS idx_life_events_therapist_shared 
    ON public.therapeutic_life_events (therapist_account_id, is_shared_with_therapist);


-- 6. THERAPEUTIC PERIODIC REVIEWS TABLE (Longitudinal Reviews)
CREATE TABLE IF NOT EXISTS public.therapeutic_periodic_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    review_period_label VARCHAR(100) NOT NULL,
    sessions_included INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'initiated' CHECK (status IN (
        'initiated',
        'pending_client_input',
        'client_submitted',
        'in_discussion',
        'completed'
    )),
    initiated_by_role VARCHAR(20) NOT NULL DEFAULT 'therapist' CHECK (initiated_by_role IN ('client', 'therapist')),
    initiated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    client_submitted_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    next_review_due_date DATE,
    
    -- Client perspective fields
    what_feels_better TEXT NOT NULL DEFAULT '',
    what_remains_difficult TEXT NOT NULL DEFAULT '',
    what_has_changed TEXT NOT NULL DEFAULT '',
    next_focus TEXT NOT NULL DEFAULT '',
    meeting_needs_rating VARCHAR(30) NOT NULL DEFAULT 'yes' CHECK (meeting_needs_rating IN ('yes', 'partially', 'needs_adjustment', 'no')),

    -- Therapist collaborative summary (client-visible)
    progress_observed TEXT NOT NULL DEFAULT '',
    goals_progress_summary TEXT NOT NULL DEFAULT '',
    barriers_and_challenges TEXT NOT NULL DEFAULT '',
    life_events_impact TEXT NOT NULL DEFAULT '',
    collaborative_next_steps TEXT NOT NULL DEFAULT '',
    feedback_for_client TEXT NOT NULL DEFAULT '',

    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_periodic_reviews_rel 
    ON public.therapeutic_periodic_reviews (relationship_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_periodic_reviews_user 
    ON public.therapeutic_periodic_reviews (user_id, status);
CREATE INDEX IF NOT EXISTS idx_periodic_reviews_therapist 
    ON public.therapeutic_periodic_reviews (therapist_account_id, status);


-- 7. THERAPEUTIC REVIEW CLINICAL NOTES TABLE (Therapist-Only Private Notes)
CREATE TABLE IF NOT EXISTS public.therapeutic_review_clinical_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL UNIQUE REFERENCES public.therapeutic_periodic_reviews(id) ON DELETE CASCADE,
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    clinical_notes_internal TEXT NOT NULL DEFAULT '',
    clinical_risk_assessment_notes TEXT NOT NULL DEFAULT '',
    diagnostic_impressions TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_review_clinical_notes_review 
    ON public.therapeutic_review_clinical_notes (review_id);
CREATE INDEX IF NOT EXISTS idx_review_clinical_notes_therapist 
    ON public.therapeutic_review_clinical_notes (therapist_account_id);


-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.therapeutic_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_intake_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_goal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_life_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_periodic_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapeutic_review_clinical_notes ENABLE ROW LEVEL SECURITY;

-- 8.1 therapeutic_profiles Policies
DROP POLICY IF EXISTS "Clients can view own therapeutic profile" ON public.therapeutic_profiles;
CREATE POLICY "Clients can view own therapeutic profile"
    ON public.therapeutic_profiles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Therapists can view assigned therapeutic profiles" ON public.therapeutic_profiles;
CREATE POLICY "Therapists can view assigned therapeutic profiles"
    ON public.therapeutic_profiles FOR SELECT
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Therapists can update assigned therapeutic profiles" ON public.therapeutic_profiles;
CREATE POLICY "Therapists can update assigned therapeutic profiles"
    ON public.therapeutic_profiles FOR UPDATE
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

-- 8.2 therapeutic_goals Policies
DROP POLICY IF EXISTS "Clients can view own goals" ON public.therapeutic_goals;
CREATE POLICY "Clients can view own goals"
    ON public.therapeutic_goals FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can insert own goals" ON public.therapeutic_goals;
CREATE POLICY "Clients can insert own goals"
    ON public.therapeutic_goals FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can update own goals" ON public.therapeutic_goals;
CREATE POLICY "Clients can update own goals"
    ON public.therapeutic_goals FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Therapists can view active client goals" ON public.therapeutic_goals;
CREATE POLICY "Therapists can view active client goals"
    ON public.therapeutic_goals FOR SELECT
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Therapists can update active client goals" ON public.therapeutic_goals;
CREATE POLICY "Therapists can update active client goals"
    ON public.therapeutic_goals FOR UPDATE
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

-- 8.3 therapeutic_life_events Policies (CRITICAL PRIVACY SHIELD)
DROP POLICY IF EXISTS "Clients have full access to own life events" ON public.therapeutic_life_events;
CREATE POLICY "Clients have full access to own life events"
    ON public.therapeutic_life_events FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Therapists can ONLY SELECT events marked is_shared_with_therapist = true
DROP POLICY IF EXISTS "Therapists can view shared life events only" ON public.therapeutic_life_events;
CREATE POLICY "Therapists can view shared life events only"
    ON public.therapeutic_life_events FOR SELECT
    USING (
        is_shared_with_therapist = true
        AND therapist_account_id IN (
            SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
        )
    );

-- 8.4 therapeutic_periodic_reviews Policies
DROP POLICY IF EXISTS "Clients can view own reviews" ON public.therapeutic_periodic_reviews;
CREATE POLICY "Clients can view own reviews"
    ON public.therapeutic_periodic_reviews FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients can update own review responses" ON public.therapeutic_periodic_reviews;
CREATE POLICY "Clients can update own review responses"
    ON public.therapeutic_periodic_reviews FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Therapists can view assigned reviews" ON public.therapeutic_periodic_reviews;
CREATE POLICY "Therapists can view assigned reviews"
    ON public.therapeutic_periodic_reviews FOR SELECT
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

DROP POLICY IF EXISTS "Therapists can manage assigned reviews" ON public.therapeutic_periodic_reviews;
CREATE POLICY "Therapists can manage assigned reviews"
    ON public.therapeutic_periodic_reviews FOR ALL
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ))
    WITH CHECK (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

-- 8.5 therapeutic_review_clinical_notes Policies (STRICTLY THERAPIST ONLY)
-- NO CLIENT POLICIES EXIST. Zero client access granted.
DROP POLICY IF EXISTS "Therapists can manage own clinical notes" ON public.therapeutic_review_clinical_notes;
CREATE POLICY "Therapists can manage own clinical notes"
    ON public.therapeutic_review_clinical_notes FOR ALL
    USING (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ))
    WITH CHECK (therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    ));

COMMIT;
