-- ==============================================================================
-- INGRESS WITHIN: USER AUTHENTICATION SCHEMA & ROW LEVEL SECURITY (RLS)
-- ==============================================================================
-- Scope: USER authentication only.
-- Notes:
--   - India-only phone (+91) canonical format: '+91XXXXXXXXXX'
--   - 3-attempt OTP lockout with 10-minute server-side lockout window
--   - Rolling 30-day multi-device sessions
--   - Profiles with deferred onboarding status ('pending')
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    name TEXT,
    account_status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'dormant', 'deactivated')),
    is_active BOOLEAN DEFAULT true,
    sustained_distress_flag BOOLEAN DEFAULT false,
    crisis_flag_active BOOLEAN DEFAULT false,
    personality_summary_text TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all columns exist on public.users (in case table was previously created)
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS sustained_distress_flag BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS crisis_flag_active BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS personality_summary_text TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Unique index on active canonical phone numbers
CREATE UNIQUE INDEX IF NOT EXISTS uq_users_active_phone 
ON public.users (phone_number) 
WHERE is_active = true;

-- 3. PROFILES TABLE (Associated with User identity)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    phone_number VARCHAR(20),
    full_name TEXT,
    account_status VARCHAR(50) DEFAULT 'active',
    onboarding_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'consent_pending', 'completed')),
    consent_completed BOOLEAN DEFAULT false,
    profile_completed BOOLEAN DEFAULT false,
    orientation_completed BOOLEAN DEFAULT false,
    assessment_completed BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    notifications_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ensure all columns exist on public.profiles (in case table was previously created)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_status VARCHAR(50) DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_status VARCHAR(50) DEFAULT 'pending';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS consent_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS orientation_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS assessment_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS notifications_completed BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- 3b. EXPLICIT USER BOUNDARY VIEWS (Semantic separation from future therapist tables)
CREATE OR REPLACE VIEW public.user_accounts AS 
SELECT id, id AS auth_user_id, phone_number, name, account_status, is_active, created_at, updated_at 
FROM public.users;

CREATE OR REPLACE VIEW public.user_profiles AS 
SELECT id AS user_id, phone_number, full_name, account_status, onboarding_status, created_at, updated_at 
FROM public.profiles;

-- 4. OTP VERIFICATIONS TABLE (Server-side tracking & lockout)
CREATE TABLE IF NOT EXISTS public.otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone_number VARCHAR(20) NOT NULL,
    otp_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    attempts_count INT NOT NULL DEFAULT 0,
    resend_count INT NOT NULL DEFAULT 0,
    locked_until TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS otp_hash TEXT;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS salt TEXT;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS attempts_count INT DEFAULT 0;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS resend_count INT DEFAULT 0;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS locked_until TIMESTAMPTZ;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.otp_verifications ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_otp_verifications_phone_active
ON public.otp_verifications (phone_number, created_at DESC);

-- 5. USER SESSIONS TABLE (Multi-device rolling 30-day sessions)
CREATE TABLE IF NOT EXISTS public.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT NOT NULL,
    device_id VARCHAR(150) NOT NULL,
    device_name VARCHAR(150) DEFAULT 'Browser',
    ip_address VARCHAR(50),
    user_agent TEXT,
    session_state JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS refresh_token_hash TEXT;
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS device_id VARCHAR(150);
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS device_name VARCHAR(150) DEFAULT 'Browser';
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS session_state JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT now();
ALTER TABLE public.user_sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_user_sessions_lookup
ON public.user_sessions (user_id, device_id, is_active);

CREATE INDEX IF NOT EXISTS idx_user_sessions_refresh
ON public.user_sessions (refresh_token_hash)
WHERE is_active = true;

-- 6. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    ip_address VARCHAR(50),
    user_agent TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_id UUID;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS action VARCHAR(100);
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS ip_address VARCHAR(50);
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.audit_logs ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otp_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: Users can only read and update their own profile
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Users RLS: Users can only read their own user record
DROP POLICY IF EXISTS "Users can read own user record" ON public.users;
CREATE POLICY "Users can read own user record"
ON public.users FOR SELECT
USING (auth.uid() = id);

-- User Sessions RLS: Users can only view their own active sessions
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
CREATE POLICY "Users can view own sessions"
ON public.user_sessions FOR SELECT
USING (auth.uid() = user_id);

-- 8. SYSTEM SYNC TRIGGER: Keep auth.users and public.users aligned
CREATE OR REPLACE FUNCTION public.handle_new_public_user()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.id) THEN
        INSERT INTO auth.users (
            id,
            instance_id,
            aud,
            role,
            phone,
            phone_confirmed_at,
            created_at,
            updated_at,
            raw_app_meta_data,
            raw_user_meta_data
        ) VALUES (
            NEW.id,
            '00000000-0000-0000-0000-000000000000'::uuid,
            'authenticated',
            'authenticated',
            COALESCE(NEW.phone_number, ''),
            now(),
            COALESCE(NEW.created_at, now()),
            now(),
            '{"provider":"phone","providers":["phone"]}'::jsonb,
            '{}'::jsonb
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_sync_public_user_to_auth ON public.users;
CREATE TRIGGER trg_sync_public_user_to_auth
    AFTER INSERT ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_public_user();
