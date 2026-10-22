-- ==============================================================================
-- INGRESS WITHIN: PERSISTENT RELATIONSHIP BOOKING LINKS SCHEMA
-- Migration: 024_relationship_booking_links.sql
-- ==============================================================================
-- Scope:
--   - Creates public.relationship_booking_links table to store stable booking links.
--   - Binds each booking link strictly to a single therapy_care_relationships record.
--   - Enforces at most ONE active link per relationship at the database level.
--   - Stores token_hash (SHA-256) for O(1) fast unguessable lookup.
--   - Stores encrypted_token (AES-256-GCM) so authorized users can re-read the same link.
--   - Tracks creation, revocation, access count, and lifecycle timestamps.
--   - Enforces strict RLS: only authorized therapists and admins can access.
-- ==============================================================================

BEGIN;

CREATE TABLE IF NOT EXISTS public.relationship_booking_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    relationship_id UUID NOT NULL REFERENCES public.therapy_care_relationships(id) ON DELETE CASCADE,
    token_hash VARCHAR(64) NOT NULL UNIQUE,
    encrypted_token TEXT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'revoked', 'expired')),
    created_by_actor_type VARCHAR(30) NOT NULL CHECK (created_by_actor_type IN ('therapist', 'admin')),
    created_by_id VARCHAR(100),
    revoked_at TIMESTAMPTZ,
    revoked_by_id VARCHAR(100),
    revocation_reason TEXT,
    last_accessed_at TIMESTAMPTZ,
    access_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enforce exactly ONE active link per care relationship at the database level
CREATE UNIQUE INDEX IF NOT EXISTS idx_active_relationship_booking_link 
    ON public.relationship_booking_links (relationship_id) 
    WHERE revoked_at IS NULL AND status = 'active';

-- Index for lookup by token hash
CREATE INDEX IF NOT EXISTS idx_booking_link_token_hash 
    ON public.relationship_booking_links (token_hash);

-- Row Level Security
ALTER TABLE public.relationship_booking_links ENABLE ROW LEVEL SECURITY;

-- Therapists can only view and manage booking links for their own care relationships
DROP POLICY IF EXISTS "Therapists can view booking links for own relationships" ON public.relationship_booking_links;
CREATE POLICY "Therapists can view booking links for own relationships"
    ON public.relationship_booking_links FOR SELECT
    USING (relationship_id IN (
        SELECT id FROM public.therapy_care_relationships
        WHERE therapist_account_id IN (
            SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
        )
    ));

DROP POLICY IF EXISTS "Therapists can insert booking links for own relationships" ON public.relationship_booking_links;
CREATE POLICY "Therapists can insert booking links for own relationships"
    ON public.relationship_booking_links FOR INSERT
    WITH CHECK (relationship_id IN (
        SELECT id FROM public.therapy_care_relationships
        WHERE therapist_account_id IN (
            SELECT id FROM public.therapist_accounts WHERE auth_user_id = auth.uid()
        )
    ));

COMMIT;
