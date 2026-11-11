'use strict';
/**
 * Shared Admin Manual Matching Service
 * =====================================
 * Coordinates manual client-to-therapist matching from both
 * Matching Reviews and Lead Pipeline & Drop-offs without duplicating
 * database, relationship, or notification logic.
 */

import { supabase } from '../db';
import { validateEligibleTherapist } from '../therapy/therapyService';
import { EmailService } from '../email/emailService';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isUuid(value?: string | null): boolean {
  return Boolean(value && UUID_REGEX.test(value.trim()));
}

export interface ClientResolutionInput {
  userId?: string | null;
  therapySessionId?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
}

export interface ClientResolutionResult {
  userId: string | null;
  therapySessionId: string | null;
}

/**
 * Resolves a real user UUID and valid therapy_sessions UUID for a lead or review.
 * Ensures therapy_matches / therapy_care_relationships inserts have valid FKs.
 */
export async function resolveClientSessionForMatch(
  input: ClientResolutionInput
): Promise<ClientResolutionResult> {
  let resolvedUserId: string | null = isUuid(input.userId) ? input.userId!.trim() : null;
  let resolvedSessionId: string | null = isUuid(input.therapySessionId)
    ? input.therapySessionId!.trim()
    : null;

  // 1. If we already have a real session UUID, pull its user_id
  if (resolvedSessionId && !resolvedUserId) {
    try {
      const { data: sessionRow } = await supabase
        .from('therapy_sessions')
        .select('id, user_id')
        .eq('id', resolvedSessionId)
        .maybeSingle();
      if (sessionRow?.user_id) {
        resolvedUserId = sessionRow.user_id;
      } else {
        // Non-existent session UUID; clear so we don't violate FK
        resolvedSessionId = null;
      }
    } catch {
      // Ignore lookup failures
    }
  }

  // 2. Try finding user & session from therapy_intakes by email
  const cleanEmail = (input.email || '').trim().toLowerCase();
  if ((!resolvedUserId || !resolvedSessionId) && cleanEmail) {
    try {
      const { data: intakeRow } = await supabase
        .from('therapy_intakes')
        .select('user_id, therapy_session_id')
        .ilike('email', cleanEmail)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (intakeRow) {
        if (!resolvedUserId && intakeRow.user_id) resolvedUserId = intakeRow.user_id;
        if (!resolvedSessionId && isUuid(intakeRow.therapy_session_id)) {
          resolvedSessionId = intakeRow.therapy_session_id;
        }
      }
    } catch {
      // Ignore lookup failures
    }
  }

  // 3. Fallback: look up user in public.users by email or phone number
  if (!resolvedUserId && cleanEmail) {
    try {
      const { data: userRow } = await supabase
        .from('users')
        .select('id')
        .ilike('email', cleanEmail)
        .limit(1)
        .maybeSingle();
      if (userRow?.id) resolvedUserId = userRow.id;
    } catch {
      // Ignore
    }
  }

  const digits = (input.phoneNumber || '').replace(/[^\d]/g, '');
  if (!resolvedUserId && digits.length >= 7) {
    try {
      const last10 = digits.slice(-10);
      const { data: userRow } = await supabase
        .from('users')
        .select('id')
        .ilike('phone_number', `%${last10}`)
        .limit(1)
        .maybeSingle();
      if (userRow?.id) resolvedUserId = userRow.id;
    } catch {
      // Ignore
    }
  }

  // 4. If we resolved user_id but don't have a session UUID yet, find latest or create one
  if (resolvedUserId && !resolvedSessionId) {
    try {
      const { data: latestSession } = await supabase
        .from('therapy_sessions')
        .select('id')
        .eq('user_id', resolvedUserId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (latestSession?.id) {
        resolvedSessionId = latestSession.id;
      } else {
        const { data: createdSession } = await supabase
          .from('therapy_sessions')
          .insert({
            user_id: resolvedUserId,
            journey_type: 'guided',
            session_status: 'submitted',
            metadata: { source: 'admin_manual_match_lead_bridge' },
          })
          .select('id')
          .maybeSingle();
        if (createdSession?.id) {
          resolvedSessionId = createdSession.id;
        }
      }
    } catch {
      // Ignore session bridge failure
    }
  }

  return {
    userId: resolvedUserId,
    therapySessionId: resolvedSessionId,
  };
}

export interface AdminManualAssignInput {
  therapistId: string;
  clientUserId?: string | null;
  therapySessionId?: string | null;
  clientEmail?: string | null;
  clientPhone?: string | null;
  connectDirectly?: boolean;
  source: 'admin_manual_matching_review' | 'admin_lead_manual_match';
  referenceId?: string | null;
  internalNotes?: string | null;
  admin: {
    adminId: string;
    email?: string | null;
    fullName?: string | null;
  };
}

export interface AdminManualAssignResult {
  therapistId: string;
  therapistName: string;
  therapistEmail: string | null;
  clientUserId: string | null;
  therapySessionId: string | null;
  createdMatchId: string | null;
  createdRelationshipId: string | null;
}

/**
 * Validates the target clinician, cleans stale candidate ties, assigns the
 * authoritative therapy_matches record, optionally activates therapy_care_relationships,
 * and sends a match request email to the clinician.
 */
export async function assignTherapistToClient(
  input: AdminManualAssignInput
): Promise<AdminManualAssignResult> {
  const val = await validateEligibleTherapist(input.therapistId);
  if (!val.valid) {
    const err: any = new Error('Assigned therapist is not verified or currently active.');
    err.code = 'THERAPIST_NOT_ELIGIBLE';
    err.status = 409;
    throw err;
  }

  let therapistName = 'Assigned Clinician';
  let therapistEmail: string | null = null;

  const { data: thProfile } = await supabase
    .from('therapist_profiles')
    .select('full_name, contact_email')
    .eq('therapist_account_id', input.therapistId)
    .maybeSingle();

  if (thProfile?.full_name) therapistName = thProfile.full_name;
  therapistEmail = thProfile?.contact_email || null;

  if (!therapistEmail) {
    const { data: thApp } = await supabase
      .from('therapist_applications')
      .select('contact_email, answers')
      .eq('therapist_account_id', input.therapistId)
      .maybeSingle();
    therapistEmail = thApp?.contact_email || (thApp?.answers as any)?.contact_email || null;
  }

  const resolved = await resolveClientSessionForMatch({
    userId: input.clientUserId,
    therapySessionId: input.therapySessionId,
    email: input.clientEmail,
    phoneNumber: input.clientPhone,
  });

  const adminActor = input.admin.fullName || input.admin.email || 'Admin';
  const nowIso = new Date().toISOString();
  let createdMatchId: string | null = null;
  let createdRelationshipId: string | null = null;

  if (resolved.userId) {
    // 1. Remove any stale candidate / competing matches for this client
    try {
      await supabase
        .from('therapy_matches')
        .delete()
        .eq('user_id', resolved.userId)
        .neq('therapist_account_id', input.therapistId);
    } catch (delErr) {
      console.warn('[AdminManualMatch] Stale match cleanup note:', delErr);
    }

    // 2. Create or update authoritative match in therapy_matches (requires valid therapy_session_id)
    if (resolved.therapySessionId) {
      try {
        const matchStatus = input.connectDirectly ? 'selected' : 'shortlisted';
        const metadata = {
          source: input.source,
          referenceId: input.referenceId || null,
          assignedBy: adminActor,
          assignedAt: nowIso,
          notes: input.internalNotes || null,
        };

        const { data: existingMatch } = await supabase
          .from('therapy_matches')
          .select('id')
          .eq('user_id', resolved.userId)
          .eq('therapist_account_id', input.therapistId)
          .limit(1)
          .maybeSingle();

        if (existingMatch?.id) {
          await supabase
            .from('therapy_matches')
            .update({
              therapy_session_id: resolved.therapySessionId,
              match_status: matchStatus,
              match_rank: 1,
              match_score: 95,
              match_reasons: ['Manually matched by Ingress Within Care Team'],
              matching_metadata: metadata,
              updated_at: nowIso,
            })
            .eq('id', existingMatch.id);
          createdMatchId = existingMatch.id;
        } else {
          const { data: insertedMatch, error: insertMatchErr } = await supabase
            .from('therapy_matches')
            .insert({
              user_id: resolved.userId,
              therapy_session_id: resolved.therapySessionId,
              therapist_account_id: input.therapistId,
              match_status: matchStatus,
              match_rank: 1,
              match_score: 95,
              match_reasons: ['Manually matched by Ingress Within Care Team'],
              matching_metadata: metadata,
            })
            .select('id')
            .maybeSingle();
          if (insertMatchErr) {
            console.warn('[AdminManualMatch] therapy_matches insert error:', insertMatchErr);
          } else if (insertedMatch?.id) {
            createdMatchId = insertedMatch.id;
          }
        }
      } catch (matchErr) {
        console.warn('[AdminManualMatch] therapy_matches error:', matchErr);
      }
    }

    // 3. When connectDirectly is enabled, activate therapy_care_relationships with valid care_stage ('intake')
    if (input.connectDirectly) {
      try {
        const relMeta = {
          source:
            input.source === 'admin_lead_manual_match'
              ? 'admin_lead_direct_manual_connection'
              : 'admin_direct_manual_connection',
          assignedBy: adminActor,
          confirmedAt: nowIso,
          notes: input.internalNotes || null,
        };

        const { data: existingRel } = await supabase
          .from('therapy_care_relationships')
          .select('id')
          .eq('user_id', resolved.userId)
          .eq('therapist_account_id', input.therapistId)
          .limit(1)
          .maybeSingle();

        if (existingRel?.id) {
          await supabase
            .from('therapy_care_relationships')
            .update({
              therapy_session_id: resolved.therapySessionId,
              status: 'active',
              care_stage: 'intake',
              started_at: nowIso,
              ended_at: null,
              metadata: relMeta,
              updated_at: nowIso,
            })
            .eq('id', existingRel.id);
          createdRelationshipId = existingRel.id;
        } else {
          const { data: insertedRel, error: insertRelErr } = await supabase
            .from('therapy_care_relationships')
            .insert({
              user_id: resolved.userId,
              therapist_account_id: input.therapistId,
              therapy_session_id: resolved.therapySessionId,
              status: 'active',
              care_stage: 'intake',
              started_at: nowIso,
              metadata: relMeta,
            })
            .select('id')
            .maybeSingle();
          if (insertRelErr) {
            console.warn('[AdminManualMatch] therapy_care_relationships insert error:', insertRelErr);
          } else if (insertedRel?.id) {
            createdRelationshipId = insertedRel.id;
          }
        }
      } catch (relErr) {
        console.warn('[AdminManualMatch] therapy_care_relationships error:', relErr);
      }

      // Optional therapist in-app notification
      try {
        await supabase.from('therapist_notifications').insert({
          therapist_account_id: input.therapistId,
          user_id: resolved.userId,
          notification_type: 'client_assigned',
          title: 'New Client Matched by Care Team',
          body: 'The Ingress Within care team has manually matched a client with you.',
          metadata: { source: input.source, referenceId: input.referenceId || null },
        });
      } catch {
        // Non-blocking
      }
    }
  }

  // 4. Notify assigned therapist via email when match request or direct connection is created
  if (therapistEmail && (createdMatchId || input.connectDirectly)) {
    try {
      await EmailService.notifyTherapistMatchRequest({
        matchId: createdMatchId || `match_${Date.now()}`,
        therapistId: input.therapistId,
        therapistName,
        therapistEmail,
        rank: 1,
        score: 95,
      });
    } catch (emailErr) {
      console.warn('[AdminManualMatch] Email dispatch note:', emailErr);
    }
  }

  return {
    therapistId: input.therapistId,
    therapistName,
    therapistEmail,
    clientUserId: resolved.userId,
    therapySessionId: resolved.therapySessionId,
    createdMatchId,
    createdRelationshipId,
  };
}
