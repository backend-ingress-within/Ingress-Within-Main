-- ==============================================================================
-- INGRESS WITHIN: THERAPIST AUTHENTICATION & ISOLATION SCHEMA (RLS)
-- ==============================================================================
-- Scope: Dedicated THERAPIST application-level identity and session store.
-- Hard Separation:
--   - Completely separate from public.users and public.profiles.
--   - No polymorphic role/account_type columns on user tables.
--   - Therapists hold dedicated accounts with independent lifecycle status ('pending', 'active', etc.).
--   - Dedicated rolling 30-day multi-device sessions with cryptographic token hashing.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. THERAPIST ACCOUNTS TABLE
CREATE TABLE IF NOT EXISTS public.therapist_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all columns exist
ALTER TABLE public.therapist_accounts ADD COLUMN IF NOT EXISTS auth_user_id UUID;
ALTER TABLE public.therapist_accounts ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE public.therapist_accounts ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE public.therapist_accounts ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.therapist_accounts ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Unique index on active/pending therapist phone number
CREATE UNIQUE INDEX IF NOT EXISTS uq_therapist_phone 
ON public.therapist_accounts (phone_number) 
WHERE status != 'rejected';

-- Index on auth_user_id lookup
CREATE INDEX IF NOT EXISTS idx_therapist_accounts_auth_uid 
ON public.therapist_accounts (auth_user_id);

-- 3. THERAPIST PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.therapist_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_account_id UUID NOT NULL UNIQUE REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.therapist_profiles ADD COLUMN IF NOT EXISTS therapist_account_id UUID;
ALTER TABLE public.therapist_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.therapist_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE public.therapist_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.therapist_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 4. THERAPIST SESSIONS TABLE (Multi-device rolling 30-day sessions)
CREATE TABLE IF NOT EXISTS public.therapist_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    therapist_account_id UUID NOT NULL REFERENCES public.therapist_accounts(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    device_id VARCHAR(150) NOT NULL,
    device_name VARCHAR(150) DEFAULT 'Browser',
    ip_address VARCHAR(50),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS therapist_account_id UUID;
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS refresh_token_hash TEXT;
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS device_id VARCHAR(150);
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS device_name VARCHAR(150) DEFAULT 'Browser';
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.therapist_sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_therapist_sessions_lookup
ON public.therapist_sessions (therapist_account_id, device_id, is_active);

CREATE INDEX IF NOT EXISTS idx_therapist_sessions_refresh
ON public.therapist_sessions (refresh_token_hash)
WHERE is_active = true;

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.therapist_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.therapist_sessions ENABLE ROW LEVEL SECURITY;

-- Therapists can only select their own therapist account
DROP POLICY IF EXISTS "Therapists can view own account" ON public.therapist_accounts;
CREATE POLICY "Therapists can view own account"
ON public.therapist_accounts FOR SELECT
USING (auth.uid() = auth_user_id);

-- Therapists can only view and update their own profile
DROP POLICY IF EXISTS "Therapists can view own profile" ON public.therapist_profiles;
CREATE POLICY "Therapists can view own profile"
ON public.therapist_profiles FOR SELECT
USING (
    therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    )
);

DROP POLICY IF EXISTS "Therapists can update own profile" ON public.therapist_profiles;
CREATE POLICY "Therapists can update own profile"
ON public.therapist_profiles FOR UPDATE
USING (
    therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    )
)
WITH CHECK (
    therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    )
);

-- Therapists can only view their own active sessions
DROP POLICY IF EXISTS "Therapists can view own sessions" ON public.therapist_sessions;
CREATE POLICY "Therapists can view own sessions"
ON public.therapist_sessions FOR SELECT
USING (
    therapist_account_id IN (
        SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
    )
);
