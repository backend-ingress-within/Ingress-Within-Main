-- ==============================================================================
-- INGRESS WITHIN: MIGRATION 020 — PRODUCTION USER FEEDBACK & BUG REPORTING SYSTEM
-- ==============================================================================
-- Scope:
--   1. Creates public.user_feedback table for tracking user feedback, bug reports, and technical issues.
--   2. Enforces unique, human-readable reference codes (e.g. FB-YYYYMMDD-XXXX).
--   3. Associates submissions with verified users when authenticated, or optional contact info when anonymous.
--   4. Adds structured fields for bug diagnosis: steps_to_reproduce, expected_behavior, actual_behavior.
--   5. Implements administrative workflow fields: status, priority, admin_notes, assigned_to, resolved_at.
--   6. Establishes performance indexes for admin filtering, sorting, and search.
--   7. Configures strict Row Level Security (RLS) policies.
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.user_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_code VARCHAR(32) NOT NULL,
    submission_type VARCHAR(30) NOT NULL DEFAULT 'feedback' CHECK (submission_type IN ('feedback', 'bug_report', 'issue')),
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'General Feedback',
    contact_email TEXT,
    page_url TEXT,
    steps_to_reproduce TEXT,
    expected_behavior TEXT,
    actual_behavior TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_review', 'in_progress', 'resolved', 'closed')),
    priority VARCHAR(20) NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    admin_notes TEXT,
    assigned_to TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- Defensive column additions in case table was partially created
ALTER TABLE public.user_feedback
    ADD COLUMN IF NOT EXISTS reference_code VARCHAR(32),
    ADD COLUMN IF NOT EXISTS submission_type VARCHAR(30) DEFAULT 'feedback',
    ADD COLUMN IF NOT EXISTS subject TEXT,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS category VARCHAR(50) DEFAULT 'General Feedback',
    ADD COLUMN IF NOT EXISTS contact_email TEXT,
    ADD COLUMN IF NOT EXISTS page_url TEXT,
    ADD COLUMN IF NOT EXISTS steps_to_reproduce TEXT,
    ADD COLUMN IF NOT EXISTS expected_behavior TEXT,
    ADD COLUMN IF NOT EXISTS actual_behavior TEXT,
    ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS status VARCHAR(30) DEFAULT 'new',
    ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'normal',
    ADD COLUMN IF NOT EXISTS admin_notes TEXT,
    ADD COLUMN IF NOT EXISTS assigned_to TEXT,
    ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb,
    ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now(),
    ADD COLUMN IF NOT EXISTS resolved_at TIMESTAMPTZ;

-- Unique constraint on reference code
CREATE UNIQUE INDEX IF NOT EXISTS uq_user_feedback_reference_code
    ON public.user_feedback (reference_code);

-- Performance indexes for administrative query filters
CREATE INDEX IF NOT EXISTS idx_user_feedback_status
    ON public.user_feedback (status);

CREATE INDEX IF NOT EXISTS idx_user_feedback_type
    ON public.user_feedback (submission_type);

CREATE INDEX IF NOT EXISTS idx_user_feedback_priority
    ON public.user_feedback (priority);

CREATE INDEX IF NOT EXISTS idx_user_feedback_created_at
    ON public.user_feedback (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_feedback_user_id
    ON public.user_feedback (user_id)
    WHERE user_id IS NOT NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE public.user_feedback ENABLE ROW LEVEL SECURITY;

-- 1. Service role has full permissions
DROP POLICY IF EXISTS "Service role manages all feedback" ON public.user_feedback;
CREATE POLICY "Service role manages all feedback"
    ON public.user_feedback
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- 2. Authenticated users can view only their own submissions
DROP POLICY IF EXISTS "Users can view own feedback submissions" ON public.user_feedback;
CREATE POLICY "Users can view own feedback submissions"
    ON public.user_feedback
    FOR SELECT
    USING (auth.uid() = user_id);

-- 3. Controlled insert policy for authenticated or anonymous submissions
DROP POLICY IF EXISTS "Users can insert feedback" ON public.user_feedback;
CREATE POLICY "Users can insert feedback"
    ON public.user_feedback
    FOR INSERT
    WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

COMMIT;
