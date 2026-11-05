-- =============================================================================
-- Migration 031: Dedicated Therapy Client Accounts Schema & Management
-- =============================================================================
-- Purpose:
--   1. Introduces a dedicated public.therapy_client_accounts table to formalize
--      client therapy accounts separately from generic platform users.
--   2. Provides centralized tracking of therapy status, active clinician assignment,
--      intake details, contact info, and lifecycle progression.
--   3. Adds public.delete_client_therapy_data() stored procedure to safely and
--      completely delete client therapy accounts without disrupting auth.users.
-- =============================================================================

BEGIN;

-- 1. CREATE THERAPY CLIENT ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.therapy_client_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Links to core user account
    user_id UUID NOT NULL
        REFERENCES public.users(id) ON DELETE CASCADE,
        
    -- Official client therapy contact details
    email VARCHAR(255) NOT NULL,
    full_name TEXT,
    phone_number VARCHAR(30),
    
    -- Clinical and platform lifecycle status
    status VARCHAR(50) NOT NULL DEFAULT 'intake_pending'
        CHECK (status IN (
            'intake_pending',
            'matched',
            'connected',
            'in_care',
            'paused',
            'completed',
            'dormant',
            'deactivated'
        )),
        
    triage_tier VARCHAR(20) DEFAULT 'standard'
        CHECK (triage_tier IN ('standard', 'priority', 'immediate')),
        
    -- Active clinician and care relationship
    active_therapist_account_id UUID
        REFERENCES public.therapist_accounts(id) ON DELETE SET NULL,
        
    active_relationship_id UUID
        REFERENCES public.therapy_care_relationships(id) ON DELETE SET NULL,
        
    latest_therapy_session_id UUID
        REFERENCES public.therapy_sessions(id) ON DELETE SET NULL,
        
    -- Demographics and clinical preferences
    city TEXT,
    state TEXT,
    preferred_languages TEXT[] DEFAULT ARRAY['English']::TEXT[],
    
    emergency_contact JSONB DEFAULT '{}'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    -- Milestones and timestamps
    intake_completed_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    
    CONSTRAINT uq_therapy_client_user UNIQUE (user_id)
);

-- 2. INDEXES
CREATE INDEX IF NOT EXISTS idx_therapy_client_email 
    ON public.therapy_client_accounts (LOWER(email));

CREATE INDEX IF NOT EXISTS idx_therapy_client_status 
    ON public.therapy_client_accounts (status);

CREATE INDEX IF NOT EXISTS idx_therapy_client_active_therapist 
    ON public.therapy_client_accounts (active_therapist_account_id);

CREATE INDEX IF NOT EXISTS idx_therapy_client_created_at 
    ON public.therapy_client_accounts (created_at DESC);

-- 3. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.therapy_client_accounts ENABLE ROW LEVEL SECURITY;

-- Service role bypass
DROP POLICY IF EXISTS "Service role access for therapy_client_accounts" ON public.therapy_client_accounts;
CREATE POLICY "Service role access for therapy_client_accounts"
    ON public.therapy_client_accounts
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Authenticated clients can view and update their own therapy account
DROP POLICY IF EXISTS "Clients read own therapy_client_accounts" ON public.therapy_client_accounts;
CREATE POLICY "Clients read own therapy_client_accounts"
    ON public.therapy_client_accounts
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Clients update own therapy_client_accounts" ON public.therapy_client_accounts;
CREATE POLICY "Clients update own therapy_client_accounts"
    ON public.therapy_client_accounts
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. INITIAL BACKFILL FROM EXISTING INTAKES & RELATIONSHIPS
INSERT INTO public.therapy_client_accounts (
    user_id,
    email,
    full_name,
    phone_number,
    status,
    active_therapist_account_id,
    active_relationship_id,
    latest_therapy_session_id,
    city,
    preferred_languages,
    created_at,
    updated_at
)
SELECT DISTINCT ON (ti.user_id)
    ti.user_id,
    COALESCE(ti.email, 'client@ingresswithin.com'),
    ti.full_name,
    ti.phone_number,
    CASE 
        WHEN tcr.status = 'active' THEN 'connected'
        WHEN tcr.status = 'completed' THEN 'completed'
        WHEN tcr.status = 'paused' THEN 'paused'
        ELSE 'intake_pending'
    END AS status,
    tcr.therapist_account_id AS active_therapist_account_id,
    tcr.id AS active_relationship_id,
    ti.therapy_session_id AS latest_therapy_session_id,
    ti.city,
    ARRAY['English']::TEXT[],
    ti.created_at,
    NOW()
FROM public.therapy_intakes ti
LEFT JOIN LATERAL (
    SELECT id, therapist_account_id, status
    FROM public.therapy_care_relationships
    WHERE user_id = ti.user_id
    ORDER BY created_at DESC
    LIMIT 1
) tcr ON true
ON CONFLICT (user_id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, public.therapy_client_accounts.full_name),
    phone_number = COALESCE(EXCLUDED.phone_number, public.therapy_client_accounts.phone_number),
    status = EXCLUDED.status,
    active_therapist_account_id = EXCLUDED.active_therapist_account_id,
    active_relationship_id = EXCLUDED.active_relationship_id,
    updated_at = NOW();

-- 5. COMPLETE CLIENT THERAPY DATA PURGE STORED PROCEDURE
-- Safely purges only therapy account records without deleting the core auth account.
CREATE OR REPLACE FUNCTION public.delete_client_therapy_data(target_email_or_id TEXT)
RETURNS TABLE (
    deleted_user_id UUID,
    deleted_email TEXT,
    relationships_deleted INT,
    sessions_deleted INT,
    intakes_deleted INT,
    accounts_deleted INT
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    uid UUID;
    target_mail TEXT;
    rel_count INT := 0;
    sess_count INT := 0;
    intake_count INT := 0;
    acct_count INT := 0;
BEGIN
    -- 1. Resolve user_id from UUID or Email
    IF target_email_or_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN
        uid := target_email_or_id::UUID;
    ELSE
        target_mail := LOWER(TRIM(target_email_or_id));
        
        -- Try therapy_client_accounts
        SELECT tca.user_id INTO uid 
        FROM public.therapy_client_accounts tca 
        WHERE LOWER(tca.email) = target_mail 
        LIMIT 1;

        -- If not found, try therapy_intakes
        IF uid IS NULL THEN
            SELECT ti.user_id INTO uid 
            FROM public.therapy_intakes ti 
            WHERE LOWER(ti.email) = target_mail 
            LIMIT 1;
        END IF;

        -- If not found, try manual_matching_reviews
        IF uid IS NULL THEN
            SELECT mmr.user_id INTO uid 
            FROM public.manual_matching_reviews mmr 
            WHERE LOWER(mmr.client_email) = target_mail 
            LIMIT 1;
        END IF;

        -- If not found, try auth.users
        IF uid IS NULL THEN
            BEGIN
                SELECT au.id INTO uid 
                FROM auth.users au 
                WHERE LOWER(au.email) = target_mail 
                LIMIT 1;
            EXCEPTION WHEN OTHERS THEN
                uid := NULL;
            END;
        END IF;
    END IF;

    IF uid IS NULL AND target_mail IS NULL THEN
        RAISE NOTICE 'No therapy user found for target: %', target_email_or_id;
        RETURN;
    END IF;

    -- 2. Delete all client therapy records
    IF uid IS NOT NULL THEN
        -- Delete care relationships (cascades to therapeutic_profiles, goals, reviews, life_events)
        WITH del_rel AS (
            DELETE FROM public.therapy_care_relationships WHERE user_id = uid RETURNING id
        ) SELECT COUNT(*) INTO rel_count FROM del_rel;

        -- Delete therapy sessions (cascades to intakes, matches, messages)
        WITH del_sess AS (
            DELETE FROM public.therapy_sessions WHERE user_id = uid RETURNING id
        ) SELECT COUNT(*) INTO sess_count FROM del_sess;

        -- Delete matches, submissions, safety assessments, booking records
        DELETE FROM public.therapy_matches WHERE user_id = uid;
        DELETE FROM public.therapy_submissions WHERE user_id = uid;
        DELETE FROM public.therapy_safety_assessments WHERE user_id = uid;
        DELETE FROM public.client_insight_sharing_consents WHERE client_id = uid;
        DELETE FROM public.therapy_session_bookings WHERE client_user_id = uid;
        DELETE FROM public.therapist_clinical_appointments WHERE user_id = uid;

        -- Delete dedicated therapy client account
        WITH del_acct AS (
            DELETE FROM public.therapy_client_accounts WHERE user_id = uid RETURNING id
        ) SELECT COUNT(*) INTO acct_count FROM del_acct;
    END IF;

    -- Clean up any records matching email directly
    IF target_mail IS NOT NULL THEN
        WITH del_intake AS (
            DELETE FROM public.therapy_intakes WHERE LOWER(email) = target_mail RETURNING id
        ) SELECT COUNT(*) INTO intake_count FROM del_intake;

        DELETE FROM public.manual_matching_reviews WHERE LOWER(client_email) = target_mail;
        DELETE FROM public.therapy_client_accounts WHERE LOWER(email) = target_mail;
    END IF;

    RETURN QUERY SELECT uid, COALESCE(target_mail, target_email_or_id), rel_count, sess_count, intake_count, acct_count;
END;
$$;

COMMIT;
