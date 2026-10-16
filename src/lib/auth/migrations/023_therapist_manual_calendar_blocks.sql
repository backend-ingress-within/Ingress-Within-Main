-- Migration 023: Add optional reason and metadata for manual blocked availability windows
ALTER TABLE public.therapist_availability_blocks
    ADD COLUMN IF NOT EXISTS reason TEXT DEFAULT 'Manual Block / Leave';

-- Add index on specific_date and is_blocked for fast range and date lookups
CREATE INDEX IF NOT EXISTS idx_th_avail_blocks_date
    ON public.therapist_availability_blocks (therapist_account_id, specific_date, is_blocked);
