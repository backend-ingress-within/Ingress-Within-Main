-- ==============================================================================
-- INGRESS WITHIN: AUTH <-> PUBLIC USERS INTEGRITY & SYNC MIGRATION
-- ==============================================================================
-- Description:
-- Ensures all existing and future users in public.users have a corresponding
-- record in auth.users with the exact same UUID so foreign keys on auth.users(id)
-- (such as exercise_instances_user_id_fkey) never fail.
-- ==============================================================================

-- 1. BACKFILL: Insert any missing public.users into auth.users idempotently
INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    phone,
    phone_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    is_super_admin
)
SELECT
    u.id,
    '00000000-0000-0000-0000-000000000000'::uuid,
    'authenticated',
    'authenticated',
    NULL,
    '',
    NULL,
    COALESCE(u.phone_number, ''),
    now(),
    COALESCE(u.created_at, now()),
    now(),
    '{"provider":"phone","providers":["phone"]}'::jsonb,
    '{}'::jsonb,
    false
FROM public.users u
WHERE NOT EXISTS (
    SELECT 1 FROM auth.users au WHERE au.id = u.id
);

-- 2. ENSURE ALL USERS HAVE PROFILES
INSERT INTO public.profiles (id, full_name, created_at, updated_at)
SELECT 
    u.id,
    'User',
    COALESCE(u.created_at, now()),
    now()
FROM public.users u
WHERE NOT EXISTS (
    SELECT 1 FROM public.profiles p WHERE p.id = u.id
);

-- 3. (OPTIONAL) AUTOMATIC TRIGGER: Sync new public.users -> auth.users
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
