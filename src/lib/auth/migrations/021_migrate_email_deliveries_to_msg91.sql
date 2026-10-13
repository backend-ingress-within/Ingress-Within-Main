-- ==============================================================================
-- INGRESS WITHIN: MIGRATION 021 — MIGRATE EMAIL DELIVERIES TO MSG91
-- ==============================================================================
-- Scope:
--   1. Updates default provider in public.email_deliveries to 'msg91'
--   2. Adds public.email_deliveries.crqid column for MSG91 Customer Request ID correlation
--   3. Adds performance index on crqid for webhook status updates
-- ==============================================================================

BEGIN;

-- 1. Update default provider to 'msg91'
ALTER TABLE public.email_deliveries 
    ALTER COLUMN provider SET DEFAULT 'msg91';

-- 2. Add crqid column if not exists
ALTER TABLE public.email_deliveries
    ADD COLUMN IF NOT EXISTS crqid TEXT;

-- 3. Add index on crqid
CREATE INDEX IF NOT EXISTS idx_email_deliv_crqid
    ON public.email_deliveries (crqid)
    WHERE crqid IS NOT NULL;

COMMIT;
