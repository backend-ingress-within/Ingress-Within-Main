import { supabase } from '../db';

export type TherapyClientStatus =
  | 'intake_pending'
  | 'matched'
  | 'connected'
  | 'in_care'
  | 'paused'
  | 'completed'
  | 'dormant'
  | 'deactivated';

export type TherapyTriageTier = 'standard' | 'priority' | 'immediate';

export interface TherapyClientAccount {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  status: TherapyClientStatus;
  triageTier: TherapyTriageTier;
  activeTherapistAccountId: string | null;
  activeRelationshipId: string | null;
  latestTherapySessionId: string | null;
  city: string | null;
  state: string | null;
  preferredLanguages: string[];
  emergencyContact: Record<string, any>;
  metadata: Record<string, any>;
  intakeCompletedAt: string | null;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface UpsertTherapyClientAccountInput {
  userId: string;
  email: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  status?: TherapyClientStatus;
  triageTier?: TherapyTriageTier;
  activeTherapistAccountId?: string | null;
  activeRelationshipId?: string | null;
  latestTherapySessionId?: string | null;
  city?: string | null;
  state?: string | null;
  preferredLanguages?: string[];
  emergencyContact?: Record<string, any>;
  metadata?: Record<string, any>;
  intakeCompletedAt?: string | null;
}

/**
 * Upserts a client therapy account in public.therapy_client_accounts.
 */
export async function upsertTherapyClientAccount(
  input: UpsertTherapyClientAccountInput
): Promise<TherapyClientAccount | null> {
  const payload: Record<string, any> = {
    user_id: input.userId,
    email: input.email.toLowerCase().trim(),
    updated_at: new Date().toISOString(),
    last_active_at: new Date().toISOString(),
  };

  if (input.fullName !== undefined) payload.full_name = input.fullName;
  if (input.phoneNumber !== undefined) payload.phone_number = input.phoneNumber;
  if (input.status !== undefined) payload.status = input.status;
  if (input.triageTier !== undefined) payload.triage_tier = input.triageTier;
  if (input.activeTherapistAccountId !== undefined)
    payload.active_therapist_account_id = input.activeTherapistAccountId;
  if (input.activeRelationshipId !== undefined)
    payload.active_relationship_id = input.activeRelationshipId;
  if (input.latestTherapySessionId !== undefined)
    payload.latest_therapy_session_id = input.latestTherapySessionId;
  if (input.city !== undefined) payload.city = input.city;
  if (input.state !== undefined) payload.state = input.state;
  if (input.preferredLanguages !== undefined)
    payload.preferred_languages = input.preferredLanguages;
  if (input.emergencyContact !== undefined)
    payload.emergency_contact = input.emergencyContact;
  if (input.metadata !== undefined) payload.metadata = input.metadata;
  if (input.intakeCompletedAt !== undefined)
    payload.intake_completed_at = input.intakeCompletedAt;

  const { data, error } = await supabase
    .from('therapy_client_accounts')
    .upsert(payload, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) {
    console.warn('[TherapyClientAccountService] Upsert notice (table may be pending migration):', error.message);
    return null;
  }

  return mapTherapyClientAccountRow(data);
}

/**
 * Retrieves a client's therapy account by core user ID.
 */
export async function getTherapyClientAccountByUserId(
  userId: string
): Promise<TherapyClientAccount | null> {
  if (!userId) return null;

  const { data, error } = await supabase
    .from('therapy_client_accounts')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapTherapyClientAccountRow(data);
}

/**
 * Retrieves a client's therapy account by email.
 */
export async function getTherapyClientAccountByEmail(
  email: string
): Promise<TherapyClientAccount | null> {
  if (!email) return null;

  const { data, error } = await supabase
    .from('therapy_client_accounts')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle();

  if (error || !data) return null;
  return mapTherapyClientAccountRow(data);
}

/**
 * Completely purges ONLY the client therapy records (relationships, intakes, sessions, bookings)
 * for a specific user ID or email, without removing their general platform account.
 */
export async function deleteClientTherapyAccount(
  targetEmailOrId: string
): Promise<{ success: boolean; details?: any; error?: string }> {
  if (!targetEmailOrId) return { success: false, error: 'Target identifier required' };

  try {
    // 1. First attempt to call the stored procedure delete_client_therapy_data
    const { data, error } = await supabase.rpc('delete_client_therapy_data', {
      target_email_or_id: targetEmailOrId,
    });

    if (!error) {
      return { success: true, details: data };
    }

    // 2. Fallback: manual sequential deletion via Supabase SDK if RPC is not present
    let targetUserId: string | null = null;
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetEmailOrId);

    if (isUuid) {
      targetUserId = targetEmailOrId;
    } else {
      const email = targetEmailOrId.toLowerCase().trim();
      const { data: intake } = await supabase
        .from('therapy_intakes')
        .select('user_id')
        .ilike('email', email)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (intake?.user_id) targetUserId = intake.user_id;
    }

    if (targetUserId) {
      await supabase.from('therapy_care_relationships').delete().eq('user_id', targetUserId);
      await supabase.from('therapy_sessions').delete().eq('user_id', targetUserId);
      await supabase.from('therapy_matches').delete().eq('user_id', targetUserId);
      await supabase.from('therapy_submissions').delete().eq('user_id', targetUserId);
      await supabase.from('therapy_safety_assessments').delete().eq('user_id', targetUserId);
      await supabase.from('client_insight_sharing_consents').delete().eq('client_id', targetUserId);
      await supabase.from('therapy_session_bookings').delete().eq('client_user_id', targetUserId);
      await supabase.from('therapist_clinical_appointments').delete().eq('user_id', targetUserId);
      await supabase.from('therapy_client_accounts').delete().eq('user_id', targetUserId);
    }

    if (!isUuid) {
      const email = targetEmailOrId.toLowerCase().trim();
      await supabase.from('therapy_intakes').delete().ilike('email', email);
      await supabase.from('manual_matching_reviews').delete().ilike('client_email', email);
      await supabase.from('therapy_client_accounts').delete().ilike('email', email);
    }

    return { success: true };
  } catch (err: any) {
    console.error('[TherapyClientAccountService] Delete failed:', err);
    return { success: false, error: err.message };
  }
}

function mapTherapyClientAccountRow(row: any): TherapyClientAccount {
  return {
    id: row.id,
    userId: row.user_id,
    email: row.email,
    fullName: row.full_name || null,
    phoneNumber: row.phone_number || null,
    status: row.status || 'intake_pending',
    triageTier: row.triage_tier || 'standard',
    activeTherapistAccountId: row.active_therapist_account_id || null,
    activeRelationshipId: row.active_relationship_id || null,
    latestTherapySessionId: row.latest_therapy_session_id || null,
    city: row.city || null,
    state: row.state || null,
    preferredLanguages: Array.isArray(row.preferred_languages) ? row.preferred_languages : ['English'],
    emergencyContact: row.emergency_contact || {},
    metadata: row.metadata || {},
    intakeCompletedAt: row.intake_completed_at || null,
    lastActiveAt: row.last_active_at || row.updated_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
