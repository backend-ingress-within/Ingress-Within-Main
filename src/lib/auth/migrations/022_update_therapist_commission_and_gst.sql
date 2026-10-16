-- ==============================================================================
-- INGRESS WITHIN: MIGRATION 022 — UPDATE THERAPIST COMMISSION & GST POLICY
-- ==============================================================================
-- Scope:
--   1. Updates default commission_rate on public.therapist_accounts to 20.00%
--   2. Updates existing therapist_accounts with legacy default 15.00% to 20.00%
-- ==============================================================================

BEGIN;

-- 1. Update column default to 20.00%
ALTER TABLE public.therapist_accounts 
    ALTER COLUMN commission_rate SET DEFAULT 20.00;

-- 2. Update existing legacy accounts currently set to 15.00%
UPDATE public.therapist_accounts
SET commission_rate = 20.00
WHERE commission_rate = 15.00 OR commission_rate IS NULL;

COMMIT;
