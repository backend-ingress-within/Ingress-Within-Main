import { supabase } from '../db';

export type TherapyJourney = 'conversation' | 'guided' | 'team';

export type TherapySessionStatus =
  | 'active'
  | 'completed'
  | 'submitted'
  | 'abandoned'
  | 'closed';

export type TherapyTriageLevel =
  | 'standard'
  | 'priority'
  | 'immediate';

export interface CreateTherapySessionInput {
  userId: string;
  journeyType: TherapyJourney;
  metadata?: Record<string, unknown>;
}

export interface UpdateTherapySessionInput {
  currentStep?: number;
  status?: TherapySessionStatus;
  triageLevel?: TherapyTriageLevel | null;
  metadata?: Record<string, unknown>;
}

export interface SaveTherapyIntakeInput {
  therapySessionId: string;
  userId: string;
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
  city?: string | null;
  livingSituation?: string | null;
  presentingReason?: string | null;
  concerns?: unknown[];
  affectedLifeAreas?: unknown[];
  ownWords?: string | null;
  mentalHealthHistory?: Record<string, unknown>;
  copingAndSupport?: Record<string, unknown>;
  expectations?: Record<string, unknown>;
  contactPreferences?: Record<string, unknown>;
  consents?: Record<string, unknown>;
  answers?: Record<string, unknown>;
}

export interface AddTherapyMessageInput {
  therapySessionId: string;
  userId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  metadata?: Record<string, unknown>;
}

export interface SaveTherapySafetyInput {
  therapySessionId: string;
  userId: string;
  safetyStatus: 'not_assessed' | 'negative' | 'positive' | 'declined';
  triageLevel?: TherapyTriageLevel | null;
  recentTiming?: string | null;
  planOrMeans?: string | null;
  priorAttempt?: string | null;
  physicalSafety?: string | null;
  psychiatricCare?: string | null;
  answers?: Record<string, unknown>;
  evaluatedBy?: 'deterministic' | 'ai' | 'hybrid' | 'human';
  evaluationMetadata?: Record<string, unknown>;
}

export interface CreateTherapySubmissionInput {
  therapySessionId: string;
  userId: string;
  submissionType: TherapyJourney;
  callbackPreference?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown>;
}

/**
 * Create a new Therapy session.
 */
export async function createTherapySession(
  input: CreateTherapySessionInput
) {
  const { data, error } = await supabase
    .from('therapy_sessions')
    .insert({
      user_id: input.userId,
      journey_type: input.journeyType,
      status: 'active',
      current_step: 0,
      metadata: input.metadata || {},
      last_activity_at: new Date().toISOString(),
    })
    .select('*')
    .single();

  if (error) {
    console.error('[TherapyService] createTherapySession failed:', error);
    throw new Error('Failed to create Therapy session.');
  }

  return data;
}

/**
 * Fetch one Therapy session belonging to the authenticated user.
 */
export async function getTherapySession(
  sessionId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('therapy_sessions')
    .select('*')
    .eq('id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[TherapyService] getTherapySession failed:', error);
    throw new Error('Failed to retrieve Therapy session.');
  }

  return data;
}

/**
 * Update a Therapy session.
 */
export async function updateTherapySession(
  sessionId: string,
  userId: string,
  input: UpdateTherapySessionInput
) {
  const updateData: Record<string, unknown> = {
    last_activity_at: new Date().toISOString(),
  };

  if (input.currentStep !== undefined) {
    updateData.current_step = input.currentStep;
  }

  if (input.status !== undefined) {
    updateData.status = input.status;
  }

  if (input.triageLevel !== undefined) {
    updateData.triage_level = input.triageLevel;
  }

  if (input.metadata !== undefined) {
    updateData.metadata = input.metadata;
  }

  if (input.status === 'completed' || input.status === 'submitted') {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from('therapy_sessions')
    .update(updateData)
    .eq('id', sessionId)
    .eq('user_id', userId)
    .select('*')
    .single();

  if (error) {
    console.error('[TherapyService] updateTherapySession failed:', error);
    throw new Error('Failed to update Therapy session.');
  }

  return data;
}

/**
 * Create or update the structured Therapy intake.
 */
export async function saveTherapyIntake(
  input: SaveTherapyIntakeInput
) {
  const payload = {
    therapy_session_id: input.therapySessionId,
    user_id: input.userId,
    full_name: input.fullName ?? null,
    email: input.email ?? null,
    phone_number: input.phoneNumber ?? null,
    age: input.age ?? null,
    gender: input.gender ?? null,
    occupation: input.occupation ?? null,
    city: input.city ?? null,
    living_situation: input.livingSituation ?? null,
    presenting_reason: input.presentingReason ?? null,
    concerns: input.concerns || [],
    affected_life_areas: input.affectedLifeAreas || [],
    own_words: input.ownWords ?? null,
    mental_health_history: input.mentalHealthHistory || {},
    coping_and_support: input.copingAndSupport || {},
    expectations: input.expectations || {},
    contact_preferences: input.contactPreferences || {},
    consents: input.consents || {},
    answers: input.answers || {},
  };

  const { data, error } = await supabase
    .from('therapy_intakes')
    .upsert(payload, {
      onConflict: 'therapy_session_id',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[TherapyService] saveTherapyIntake failed:', error);
    throw new Error('Failed to save Therapy intake.');
  }

  return data;
}

/**
 * Add one conversation message.
 */
export async function addTherapyMessage(
  input: AddTherapyMessageInput
) {
  const { data: lastMessage, error: lastMessageError } = await supabase
    .from('therapy_messages')
    .select('sequence_number')
    .eq('therapy_session_id', input.therapySessionId)
    .order('sequence_number', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (lastMessageError) {
    console.error(
      '[TherapyService] sequence lookup failed:',
      lastMessageError
    );
    throw new Error('Failed to prepare Therapy message.');
  }

  const nextSequence =
    typeof lastMessage?.sequence_number === 'number'
      ? lastMessage.sequence_number + 1
      : 1;

  const { data, error } = await supabase
    .from('therapy_messages')
    .insert({
      therapy_session_id: input.therapySessionId,
      user_id: input.userId,
      role: input.role,
      content: input.content,
      sequence_number: nextSequence,
      metadata: input.metadata || {},
    })
    .select('*')
    .single();

  if (error) {
    console.error('[TherapyService] addTherapyMessage failed:', error);
    throw new Error('Failed to save Therapy message.');
  }

  return data;
}

/**
 * Fetch conversation messages for a user's own Therapy session.
 */
export async function getTherapyMessages(
  sessionId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('therapy_messages')
    .select('*')
    .eq('therapy_session_id', sessionId)
    .eq('user_id', userId)
    .order('sequence_number', { ascending: true });

  if (error) {
    console.error('[TherapyService] getTherapyMessages failed:', error);
    throw new Error('Failed to retrieve Therapy messages.');
  }

  return data || [];
}

/**
 * Save/update the safety assessment.
 */
export async function saveTherapySafety(
  input: SaveTherapySafetyInput
) {
  const payload = {
    therapy_session_id: input.therapySessionId,
    user_id: input.userId,
    safety_status: input.safetyStatus,
    triage_level: input.triageLevel ?? null,
    recent_timing: input.recentTiming ?? null,
    plan_or_means: input.planOrMeans ?? null,
    prior_attempt: input.priorAttempt ?? null,
    physical_safety: input.physicalSafety ?? null,
    psychiatric_care: input.psychiatricCare ?? null,
    answers: input.answers || {},
    evaluated_by: input.evaluatedBy || 'deterministic',
    evaluation_metadata: input.evaluationMetadata || {},
    evaluated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('therapy_safety_assessments')
    .upsert(payload, {
      onConflict: 'therapy_session_id',
    })
    .select('*')
    .single();

  if (error) {
    console.error('[TherapyService] saveTherapySafety failed:', error);
    throw new Error('Failed to save Therapy safety assessment.');
  }

  if (input.triageLevel) {
    await updateTherapySession(
      input.therapySessionId,
      input.userId,
      {
        triageLevel: input.triageLevel,
      }
    );
  }

  return data;
}

/**
 * Fetch the safety assessment for a user's Therapy session.
 */
export async function getTherapySafety(
  sessionId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('therapy_safety_assessments')
    .select('*')
    .eq('therapy_session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (error) {
    console.error('[TherapyService] getTherapySafety failed:', error);
    throw new Error('Failed to retrieve Therapy safety assessment.');
  }

  return data;
}

/**
 * Create the final team submission.
 */
export async function createTherapySubmission(
  input: CreateTherapySubmissionInput
) {
  const { data, error } = await supabase
    .from('therapy_submissions')
    .upsert(
      {
        therapy_session_id: input.therapySessionId,
        user_id: input.userId,
        submission_type: input.submissionType,
        submission_status: 'submitted',
        callback_preference: input.callbackPreference ?? null,
        notes: input.notes ?? null,
        metadata: input.metadata || {},
        submitted_at: new Date().toISOString(),
      },
      {
        onConflict: 'therapy_session_id',
      }
    )
    .select('*')
    .single();

  if (error) {
    console.error(
      '[TherapyService] createTherapySubmission failed:',
      error
    );
    throw new Error('Failed to submit Therapy request.');
  }

  await updateTherapySession(
    input.therapySessionId,
    input.userId,
    {
      status: 'submitted',
    }
  );

  return data;
}

/**
 * Save therapist match candidates.
 */
export async function saveTherapyMatches(
  sessionId: string,
  userId: string,
  matches: Array<{
    therapistAccountId?: string | null;
    matchStatus?: string;
    matchRank?: number | null;
    matchScore?: number | null;
    matchReasons?: unknown[];
    matchingMetadata?: Record<string, unknown>;
  }>
) {
  if (!matches.length) {
    return [];
  }

  const VALID_STATUSES = new Set([
    'candidate',
    'shortlisted',
    'selected',
    'rejected',
    'unavailable',
  ]);

  const payload = matches.map((match) => {
    let status = match.matchStatus || 'candidate';
    if (!VALID_STATUSES.has(status)) {
      status = status === 'recommended' ? 'shortlisted' : 'candidate';
    }
    return {
      therapy_session_id: sessionId,
      user_id: userId,
      therapist_account_id: match.therapistAccountId ?? null,
      match_status: status,
      match_rank: match.matchRank ?? null,
      match_score: match.matchScore ?? null,
      match_reasons: match.matchReasons || [],
      matching_metadata: match.matchingMetadata || {},
    };
  });

  // Idempotently clear previous matches for this session
  await supabase
    .from('therapy_matches')
    .delete()
    .eq('therapy_session_id', sessionId)
    .eq('user_id', userId);

  const { data, error } = await supabase
    .from('therapy_matches')
    .insert(payload)
    .select('*');

  if (error) {
    console.error('[TherapyService] saveTherapyMatches failed:', error);
    throw new Error(error.message || 'Failed to save Therapy matches.');
  }

  return data || [];
}

/**
 * Fetch saved therapist matches for a user's session.
 */
export async function getTherapyMatches(
  sessionId: string,
  userId: string
) {
  const { data, error } = await supabase
    .from('therapy_matches')
    .select(`
      *,
      therapist_accounts (
        id,
        status
      )
    `)
    .eq('therapy_session_id', sessionId)
    .eq('user_id', userId)
    .order('match_rank', { ascending: true });

  if (error) {
    console.error('[TherapyService] getTherapyMatches failed:', error);
    throw new Error('Failed to retrieve Therapy matches.');
  }

  return data || [];
}

export interface PublicTherapistProfile {
  id: string;
  displayName: string;
  name?: string;
  full_name?: string;
  title: string;
  credentials?: string;
  bio: string;
  qualification: string;
  experienceYears: number;
  specializations: string[];
  languages: string[];
  sessionFormats: string[];
  profileImageUrl: string | null;
  city: string | null;
  state: string | null;
  fee: number;
  per_session_fee?: number;
  availability: string;
  gender: string;
}

/**
 * Retrieves discoverable therapists satisfying all 5 clinical practice criteria:
 * 1. status = 'active'
 * 2. application_status = 'approved'
 * 3. verification_status = 'verified'
 * 4. can_practice = true
 * 5. valid therapist profile exists
 *
 * Privacy Shield: Returns strictly public-safe fields, never exposing phone,
 * earnings, internal review metadata, or auth identifiers.
 */
export async function getEligibleTherapists(): Promise<PublicTherapistProfile[]> {
  const { data: accounts, error } = await supabase
    .from('therapist_accounts')
    .select(`
      id,
      status,
      application_status,
      verification_status,
      can_practice,
      per_session_fee,
      therapist_profiles (
        full_name,
        title,
        bio,
        qualification,
        experience_years,
        specializations,
        languages,
        session_formats,
        availability_hours,
        profile_image_url,
        city,
        state
      )
    `)
    .eq('status', 'active')
    .eq('application_status', 'approved')
    .eq('verification_status', 'verified')
    .eq('can_practice', true);

  if (error || !accounts) {
    console.error('[TherapyService] getEligibleTherapists failed:', error);
    return [];
  }

  const eligible: PublicTherapistProfile[] = [];

  for (const acc of accounts) {
    const profile = Array.isArray(acc.therapist_profiles)
      ? acc.therapist_profiles[0]
      : acc.therapist_profiles;

    if (!profile || !profile.full_name) {
      continue;
    }

    let availabilityText = 'Flexible hours';
    if (profile.availability_hours && typeof profile.availability_hours === 'object') {
      const days = Object.keys(profile.availability_hours);
      if (days.length > 0) {
        availabilityText = `${days.slice(0, 3).map((d: string) => d.charAt(0).toUpperCase() + d.slice(1)).join('/')} available`;
      }
    }

    eligible.push({
      id: acc.id,
      displayName: profile.full_name,
      name: profile.full_name,
      full_name: profile.full_name,
      title: profile.title || 'Consultant Psychologist',
      credentials: profile.qualification || profile.title || 'Consultant Psychologist',
      bio: profile.bio || '',
      qualification: profile.qualification || '',
      experienceYears: profile.experience_years || 0,
      specializations: Array.isArray(profile.specializations) ? profile.specializations : [],
      languages: Array.isArray(profile.languages) ? profile.languages : ['English', 'Hindi'],
      sessionFormats: Array.isArray(profile.session_formats) ? profile.session_formats : ['telehealth'],
      profileImageUrl: profile.profile_image_url || null,
      city: profile.city || null,
      state: profile.state || null,
      fee: acc.per_session_fee ? Number(acc.per_session_fee) : 1500,
      per_session_fee: acc.per_session_fee ? Number(acc.per_session_fee) : 1500,
      availability: availabilityText,
      gender: (profile as any).gender || 'Not specified',
    });
  }

  return eligible;
}

/**
 * Validates whether a therapist account ID is a real, currently eligible practitioner.
 * Acts as the authoritative server-side gate at submission time.
 */
export async function validateEligibleTherapist(
  therapistAccountId: string
): Promise<{ valid: boolean; therapist?: PublicTherapistProfile; error?: string }> {
  if (!therapistAccountId || typeof therapistAccountId !== 'string') {
    return { valid: false, error: 'INVALID_THERAPIST_ID' };
  }

  // UUID format guard
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(therapistAccountId.trim())) {
    return { valid: false, error: 'INVALID_THERAPIST_UUID' };
  }

  const { data: account, error } = await supabase
    .from('therapist_accounts')
    .select(`
      id,
      status,
      application_status,
      verification_status,
      can_practice,
      per_session_fee,
      therapist_profiles (
        full_name,
        title,
        bio,
        qualification,
        experience_years,
        specializations,
        languages,
        session_formats,
        availability_hours,
        profile_image_url,
        city,
        state
      )
    `)
    .eq('id', therapistAccountId.trim())
    .maybeSingle();

  if (error || !account) {
    return { valid: false, error: 'THERAPIST_NOT_FOUND' };
  }

  // Enforce all 5 eligibility conditions
  if (
    account.status !== 'active' ||
    account.application_status !== 'approved' ||
    account.verification_status !== 'verified' ||
    !account.can_practice
  ) {
    return { valid: false, error: 'THERAPIST_UNAVAILABLE' };
  }

  const profile = Array.isArray(account.therapist_profiles)
    ? account.therapist_profiles[0]
    : account.therapist_profiles;

  if (!profile || !profile.full_name) {
    return { valid: false, error: 'THERAPIST_PROFILE_MISSING' };
  }

  return {
    valid: true,
    therapist: {
      id: account.id,
      displayName: profile.full_name,
      title: profile.title || 'Consultant Psychologist',
      bio: profile.bio || '',
      qualification: profile.qualification || '',
      experienceYears: profile.experience_years || 0,
      specializations: Array.isArray(profile.specializations) ? profile.specializations : [],
      languages: Array.isArray(profile.languages) ? profile.languages : ['English', 'Hindi'],
      sessionFormats: Array.isArray(profile.session_formats) ? profile.session_formats : ['telehealth'],
      profileImageUrl: profile.profile_image_url || null,
      city: profile.city || null,
      state: profile.state || null,
      fee: account.per_session_fee ? Number(account.per_session_fee) : 1500,
      availability: 'Available',
      gender: (profile as any).gender || 'Not specified',
    },
  };
}

/**
 * Checks if client has an active care relationship with a therapist.
 */
export async function getClientConnectedTherapist(userId: string) {
  if (!userId) return null;

  const { data: relationship, error } = await supabase
    .from('therapy_care_relationships')
    .select(`
      id,
      therapist_account_id,
      status,
      care_stage,
      started_at,
      therapist_accounts (
        id,
        status,
        can_practice,
        therapist_profiles (
          full_name,
          title,
          bio,
          qualification,
          experience_years,
          specializations,
          languages,
          session_formats,
          profile_image_url,
          city,
          state
        )
      )
    `)
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !relationship) {
    return null;
  }

  const account = relationship.therapist_accounts as any;
  const profile = Array.isArray(account?.therapist_profiles)
    ? account.therapist_profiles[0]
    : account?.therapist_profiles;

  return {
    relationshipId: relationship.id,
    careStage: relationship.care_stage,
    startedAt: relationship.started_at,
    therapist: {
      id: relationship.therapist_account_id,
      displayName: profile?.full_name || 'Assigned Therapist',
      name: profile?.full_name || 'Assigned Therapist',
      full_name: profile?.full_name || 'Assigned Therapist',
      title: profile?.title || 'Consultant Psychologist',
      credentials: profile?.qualification || profile?.title || 'Consultant Psychologist',
      qualification: profile?.qualification || '',
      experienceYears: profile?.experience_years || 0,
      specializations: profile?.specializations || [],
      languages: profile?.languages || ['English', 'Hindi'],
      sessionFormats: profile?.session_formats || ['telehealth'],
      profileImageUrl: profile?.profile_image_url || null,
      city: profile?.city || null,
      state: profile?.state || null,
      bio: profile?.bio || '',
      fee: account?.per_session_fee ? Number(account.per_session_fee) : 1500,
      per_session_fee: account?.per_session_fee ? Number(account.per_session_fee) : 1500,
    },
  };
}

export type ClientRelationshipLifecycleStatus =
  | 'connected'
  | 'pending'
  | 'no_therapist'
  | 'paused'
  | 'ended'
  | 'transferred';

/**
 * Resolves the full therapy relationship lifecycle for an authenticated client.
 * Identifies whether client is:
 * - 'connected': active relationship with an approved clinician
 * - 'pending': matching request or team triage pending acceptance
 * - 'paused': relationship temporarily placed on hold
 * - 'ended': care journey finished/completed or terminated
 * - 'transferred': transfer/handover pending to a new clinician
 * - 'no_therapist': no active connection or request
 */
export async function getClientTherapyDashboardSummary(userId: string) {
  if (!userId) {
    return {
      status: 'no_therapist' as ClientRelationshipLifecycleStatus,
      connection: null,
      therapist: null,
      pendingRequest: null,
      history: [],
    };
  }

  // 1. Fetch care relationships (both active and historical)
  const { data: relationships, error: relError } = await supabase
    .from('therapy_care_relationships')
    .select(`
      id,
      therapist_account_id,
      status,
      care_stage,
      started_at,
      ended_at,
      created_at,
      therapist_accounts (
        id,
        status,
        can_practice,
        per_session_fee,
        therapist_profiles (
          full_name,
          title,
          bio,
          qualification,
          experience_years,
          specializations,
          languages,
          session_formats,
          profile_image_url,
          city,
          state
        )
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (relError) {
    console.error('[TherapyService] Error fetching client relationships:', relError);
  }

  const allRel = relationships || [];
  const activeRel = allRel.find((r) => r.status === 'active');

  const mapTherapistProfile = (rel: any) => {
    const account = rel.therapist_accounts as any;
    const profile = Array.isArray(account?.therapist_profiles)
      ? account.therapist_profiles[0]
      : account?.therapist_profiles;

    return {
      id: rel.therapist_account_id,
      displayName: profile?.full_name || 'Assigned Therapist',
      name: profile?.full_name || 'Assigned Therapist',
      full_name: profile?.full_name || 'Assigned Therapist',
      title: profile?.title || 'Consultant Psychologist',
      credentials: profile?.qualification || profile?.title || 'Consultant Psychologist',
      qualification: profile?.qualification || '',
      experienceYears: profile?.experience_years || 0,
      specializations: profile?.specializations || [],
      languages: profile?.languages || ['English', 'Hindi'],
      sessionFormats: profile?.session_formats || ['telehealth'],
      profileImageUrl: profile?.profile_image_url || null,
      city: profile?.city || null,
      state: profile?.state || null,
      bio: profile?.bio || '',
      fee: account?.per_session_fee ? Number(account.per_session_fee) : 1500,
      per_session_fee: account?.per_session_fee ? Number(account.per_session_fee) : 1500,
    };
  };

  // If active relationship exists -> state is 'connected'
  if (activeRel) {
    return {
      status: 'connected' as ClientRelationshipLifecycleStatus,
      connection: {
        relationshipId: activeRel.id,
        status: activeRel.status,
        careStage: activeRel.care_stage,
        startedAt: activeRel.started_at,
      },
      therapist: mapTherapistProfile(activeRel),
      pendingRequest: null,
      history: allRel
        .filter((r) => r.id !== activeRel.id)
        .map((r) => ({
          relationshipId: r.id,
          status: r.status,
          careStage: r.care_stage,
          startedAt: r.started_at,
          endedAt: r.ended_at,
          therapist: mapTherapistProfile(r),
        })),
    };
  }

  // Check if latest historical relationship was paused, transferred, or completed
  const latestHistorical = allRel[0];
  if (latestHistorical) {
    if (latestHistorical.status === 'paused') {
      return {
        status: 'paused' as ClientRelationshipLifecycleStatus,
        connection: {
          relationshipId: latestHistorical.id,
          status: 'paused',
          careStage: latestHistorical.care_stage,
          startedAt: latestHistorical.started_at,
        },
        therapist: mapTherapistProfile(latestHistorical),
        pendingRequest: null,
        history: allRel.map((r) => ({
          relationshipId: r.id,
          status: r.status,
          careStage: r.care_stage,
          startedAt: r.started_at,
          endedAt: r.ended_at,
          therapist: mapTherapistProfile(r),
        })),
      };
    }

    if (latestHistorical.status === 'transferred') {
      return {
        status: 'transferred' as ClientRelationshipLifecycleStatus,
        connection: {
          relationshipId: latestHistorical.id,
          status: 'transferred',
          careStage: latestHistorical.care_stage,
          startedAt: latestHistorical.started_at,
        },
        therapist: mapTherapistProfile(latestHistorical),
        pendingRequest: null,
        history: allRel.map((r) => ({
          relationshipId: r.id,
          status: r.status,
          careStage: r.care_stage,
          startedAt: r.started_at,
          endedAt: r.ended_at,
          therapist: mapTherapistProfile(r),
        })),
      };
    }
  }

  // 2. Check for pending matching requests or team submissions
  const [matchRes, subRes] = await Promise.all([
    supabase
      .from('therapy_matches')
      .select(`
        id,
        therapy_session_id,
        therapist_account_id,
        match_status,
        match_rank,
        match_score,
        created_at,
        therapist_accounts (
          id,
          therapist_profiles (full_name, title, profile_image_url)
        )
      `)
      .eq('user_id', userId)
      .in('match_status', ['shortlisted', 'candidate'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('therapy_submissions')
      .select(`
        id,
        therapy_session_id,
        submission_type,
        submission_status,
        submitted_at,
        metadata
      `)
      .eq('user_id', userId)
      .in('submission_status', ['submitted', 'under_review'])
      .order('submitted_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const activeMatch = matchRes.data;
  const activeSubmission = subRes.data;

  if (activeMatch || activeSubmission) {
    let requestedTherapistName: string | null = null;
    let requestedTherapistTitle: string | null = null;
    let requestedTherapistImage: string | null = null;

    if (activeMatch?.therapist_accounts) {
      const acc = activeMatch.therapist_accounts as any;
      const prof = Array.isArray(acc?.therapist_profiles)
        ? acc.therapist_profiles[0]
        : acc?.therapist_profiles;
      requestedTherapistName = prof?.full_name || null;
      requestedTherapistTitle = prof?.title || null;
      requestedTherapistImage = prof?.profile_image_url || null;
    } else if (activeSubmission?.metadata) {
      requestedTherapistName = (activeSubmission.metadata as any)?.selectedTherapistName || null;
    }

    return {
      status: 'pending' as ClientRelationshipLifecycleStatus,
      connection: null,
      therapist: null,
      pendingRequest: {
        matchId: activeMatch?.id || null,
        submissionId: activeSubmission?.id || null,
        submissionType: activeSubmission?.submission_type || 'guided',
        submissionStatus: activeSubmission?.submission_status || activeMatch?.match_status || 'submitted',
        submittedAt: activeSubmission?.submitted_at || activeMatch?.created_at || new Date().toISOString(),
        requestedTherapistName,
        requestedTherapistTitle,
        requestedTherapistImage,
      },
      history: allRel.map((r) => ({
        relationshipId: r.id,
        status: r.status,
        careStage: r.care_stage,
        startedAt: r.started_at,
        endedAt: r.ended_at,
        therapist: mapTherapistProfile(r),
      })),
    };
  }

  // If relationship was ended/completed and no pending requests
  if (latestHistorical && (latestHistorical.status === 'completed' || latestHistorical.status === 'terminated' || latestHistorical.status === 'ended')) {
    return {
      status: 'ended' as ClientRelationshipLifecycleStatus,
      connection: {
        relationshipId: latestHistorical.id,
        status: latestHistorical.status,
        careStage: latestHistorical.care_stage,
        startedAt: latestHistorical.started_at,
        endedAt: latestHistorical.ended_at,
      },
      therapist: mapTherapistProfile(latestHistorical),
      pendingRequest: null,
      history: allRel.map((r) => ({
        relationshipId: r.id,
        status: r.status,
        careStage: r.care_stage,
        startedAt: r.started_at,
        endedAt: r.ended_at,
        therapist: mapTherapistProfile(r),
      })),
    };
  }

  return {
    status: 'no_therapist' as ClientRelationshipLifecycleStatus,
    connection: null,
    therapist: null,
    pendingRequest: null,
    history: allRel.map((r) => ({
      relationshipId: r.id,
      status: r.status,
      careStage: r.care_stage,
      startedAt: r.started_at,
      endedAt: r.ended_at,
      therapist: mapTherapistProfile(r),
    })),
  };
}

/**
 * Retrieves the client-facing care journey model.
 * Strict Privacy Shield:
 * - NO SOAP notes (subjective, objective, assessment, plan)
 * - NO clinical formulation, risk logs, or diagnostic codes
 * - Only longitudinal care stage progression, session milestones, and client-safe progress notes.
 */
export async function getClientCareJourney(userId: string) {
  if (!userId) {
    return null;
  }

  // 1. Locate relationship
  const { data: relationship, error: relError } = await supabase
    .from('therapy_care_relationships')
    .select(`
      id,
      therapist_account_id,
      status,
      care_stage,
      started_at,
      ended_at,
      therapist_accounts (
        id,
        therapist_profiles (full_name, title, qualification, profile_image_url)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (relError || !relationship) {
    return null;
  }

  const account = relationship.therapist_accounts as any;
  const profile = Array.isArray(account?.therapist_profiles)
    ? account.therapist_profiles[0]
    : account?.therapist_profiles;

  // 2. Fetch care stage transition history
  const { data: stageHistory } = await supabase
    .from('therapy_care_stage_history')
    .select('id, previous_stage, new_stage, changed_at, reason')
    .eq('relationship_id', relationship.id)
    .order('changed_at', { ascending: true });

  // 3. Fetch appointment metrics & items
  const { data: appointments } = await supabase
    .from('therapist_clinical_appointments')
    .select('id, scheduled_start, scheduled_end, status, attendance_status, session_type')
    .eq('relationship_id', relationship.id)
    .eq('user_id', userId)
    .order('scheduled_start', { ascending: false });

  const appts = appointments || [];
  const now = new Date();
  const totalSessions = appts.length;
  const completedSessions = appts.filter(
    (a) => a.status === 'completed' && a.attendance_status !== 'client_no_show'
  ).length;
  const attendedSessions = appts.filter(
    (a) => a.attendance_status === 'attended' || (a.status === 'completed' && a.attendance_status !== 'client_no_show')
  ).length;
  const upcomingSessions = appts.filter(
    (a) => ['scheduled', 'confirmed', 'in_progress'].includes(a.status) && new Date(a.scheduled_start) >= now
  ).length;
  const cancelledSessions = appts.filter((a) => a.status === 'cancelled').length;

  // 4. Fetch client self-work / homework assignments
  const { data: homeworkAssignments } = await supabase
    .from('client_homework_assignments')
    .select(`
      id,
      title,
      exercise_type,
      status,
      assigned_at,
      submitted_at,
      reviewed_at,
      submission:client_homework_submissions (
        id,
        is_draft,
        submitted_at,
        therapist_feedback,
        feedback_added_at
      )
    `)
    .eq('relationship_id', relationship.id)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  const hwList = homeworkAssignments || [];
  const totalHomework = hwList.length;
  const submittedHomework = hwList.filter((h) => ['submitted', 'reviewed'].includes(h.status)).length;
  const reviewedHomework = hwList.filter((h) => h.status === 'reviewed').length;

  // 5. Construct unified chronological timeline of real milestones
  const timeline: Array<{
    id: string;
    type: 'relationship_started' | 'care_stage_transition' | 'session_attended' | 'session_scheduled' | 'homework_submitted' | 'homework_reviewed' | 'care_concluded';
    title: string;
    description?: string;
    timestamp: string;
    metadata?: Record<string, any>;
  }> = [];

  // Milestone: Care started
  if (relationship.started_at) {
    timeline.push({
      id: `rel_start_${relationship.id}`,
      type: 'relationship_started',
      title: 'Therapeutic Care Commenced',
      description: `Matched and partnered with ${profile?.full_name || 'your clinician'} for personalized care.`,
      timestamp: relationship.started_at,
    });
  }

  // Milestones: Care Stage Transitions
  (stageHistory || []).forEach((h) => {
    timeline.push({
      id: `stage_${h.id}`,
      type: 'care_stage_transition',
      title: `Transitioned to Care Stage: ${h.new_stage.replace('_', ' ').toUpperCase()}`,
      description: h.reason || undefined,
      timestamp: h.changed_at,
      metadata: { previousStage: h.previous_stage, newStage: h.new_stage },
    });
  });

  // Milestones: Sessions
  appts.forEach((a) => {
    if (a.status === 'completed' && a.attendance_status !== 'client_no_show') {
      timeline.push({
        id: `session_${a.id}`,
        type: 'session_attended',
        title: 'Clinical Consultation Attended',
        description: `Completed 1-on-1 therapy session (${(a.session_type || 'telehealth').replace('_', ' ')}).`,
        timestamp: a.scheduled_start,
        metadata: { appointmentId: a.id, attendanceStatus: a.attendance_status || 'attended' },
      });
    } else if (a.status === 'cancelled') {
      // Intentionally not polluting primary achievement timeline with cancelled sessions, but available in metrics
    }
  });

  // Milestones: Completed Homework & Clinical Feedback
  hwList.forEach((h: any) => {
    const sub = Array.isArray(h.submission) ? h.submission[0] : h.submission;
    if (h.status === 'reviewed' && (h.reviewed_at || sub?.feedback_added_at)) {
      timeline.push({
        id: `hw_rev_${h.id}`,
        type: 'homework_reviewed',
        title: `Self-Work Reviewed: "${h.title}"`,
        description: sub?.therapist_feedback
          ? `Clinician feedback provided: "${sub.therapist_feedback}"`
          : 'Clinician reviewed your practice reflection and integrated it into your care plan.',
        timestamp: h.reviewed_at || sub?.feedback_added_at || h.assigned_at,
        metadata: {
          homeworkId: h.id,
          exerciseType: h.exercise_type,
          hasFeedback: Boolean(sub?.therapist_feedback),
          feedback: sub?.therapist_feedback || null,
        },
      });
    } else if (['submitted', 'reviewed'].includes(h.status) && (h.submitted_at || sub?.submitted_at)) {
      timeline.push({
        id: `hw_sub_${h.id}`,
        type: 'homework_submitted',
        title: `Practice Exercise Submitted: "${h.title}"`,
        description: `Completed and submitted ${(h.exercise_type || 'clinical exercise').replace('_', ' ')} reflection.`,
        timestamp: h.submitted_at || sub?.submitted_at || h.assigned_at,
        metadata: { homeworkId: h.id, exerciseType: h.exercise_type },
      });
    }
  });

  // Milestone: Care concluded (if relationship ended)
  if (relationship.ended_at && ['ended', 'completed'].includes(relationship.status)) {
    timeline.push({
      id: `rel_end_${relationship.id}`,
      type: 'care_concluded',
      title: 'Therapeutic Journey Concluded',
      description: 'Care cycle concluded. Longitudinal notes and self-work records remain archived.',
      timestamp: relationship.ended_at,
    });
  }

  // Sort timeline newest first
  timeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return {
    relationshipId: relationship.id,
    careStage: relationship.care_stage,
    status: relationship.status,
    startedAt: relationship.started_at,
    endedAt: relationship.ended_at,
    therapist: {
      id: relationship.therapist_account_id,
      name: profile?.full_name || 'Assigned Clinician',
      title: profile?.title || 'Consultant Psychologist',
      qualification: profile?.qualification || '',
      profileImageUrl: profile?.profile_image_url || null,
    },
    stageHistory: (stageHistory || []).map((h) => ({
      id: h.id,
      previousStage: h.previous_stage,
      newStage: h.new_stage,
      changedAt: h.changed_at,
      note: h.reason || null,
    })),
    sessionMetrics: {
      total: totalSessions,
      completed: completedSessions,
      attended: attendedSessions,
      upcoming: upcomingSessions,
      cancelled: cancelledSessions,
    },
    homeworkMetrics: {
      total: totalHomework,
      submitted: submittedHomework,
      reviewed: reviewedHomework,
    },
    timeline,
  };
}

/**
 * Client-initiated action to end / conclude active care relationship.
 * Marks relationship as 'ended', records ending timestamp and reason in metadata.
 */
export async function quitClientTherapyRelationship(
  userId: string,
  reason: string = 'Client requested to conclude therapy',
  feedback: string = ''
) {
  if (!userId) {
    const err: any = new Error('User ID is required');
    err.code = 'INVALID_INPUT';
    throw err;
  }

  // 1. Locate active relationship
  const { data: relationship, error: fetchErr } = await supabase
    .from('therapy_care_relationships')
    .select('id, therapist_account_id, status, care_stage, metadata')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (fetchErr || !relationship) {
    const err: any = new Error('No active therapy relationship found to conclude.');
    err.code = 'RELATIONSHIP_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const nowIso = new Date().toISOString();
  const currentMeta = (relationship.metadata as Record<string, any>) || {};

  // 2. Update relationship to ended
  const { data: updated, error: updErr } = await supabase
    .from('therapy_care_relationships')
    .update({
      status: 'ended',
      ended_at: nowIso,
      updated_at: nowIso,
      metadata: {
        ...currentMeta,
        ended_by: 'client',
        end_reason: reason,
        end_feedback: feedback || null,
        ended_at: nowIso,
      },
    })
    .eq('id', relationship.id)
    .select('*')
    .single();

  if (updErr) {
    console.error('[quitClientTherapyRelationship] Error ending relationship:', updErr);
    throw new Error('Failed to conclude therapy relationship');
  }

  // 3. Optional: Notify therapist in-app
  try {
    await supabase.from('therapist_notifications').insert({
      therapist_account_id: relationship.therapist_account_id,
      user_id: userId,
      notification_type: 'relationship_concluded',
      title: 'Client Concluded Therapy',
      body: `Client concluded therapy care cycle. Reason: ${reason}.`,
      action_url: `/therapist/clients`,
      is_read: false,
      created_at: nowIso,
    });
  } catch (notifErr) {
    console.warn('[quitClientTherapyRelationship] Failed to notify therapist:', notifErr);
  }

  return { success: true, relationship: updated };
}

/**
 * Client-initiated action to request therapist change / rematch.
 * Transitions current relationship to 'transferred' and allows immediate rematch intake.
 */
export async function changeClientTherapistRelationship(
  userId: string,
  reason: string = 'Personal fit / prefer a fresh clinical perspective',
  notes: string = ''
) {
  if (!userId) {
    const err: any = new Error('User ID is required');
    err.code = 'INVALID_INPUT';
    throw err;
  }

  // 1. Locate active relationship
  const { data: relationship, error: fetchErr } = await supabase
    .from('therapy_care_relationships')
    .select('id, therapist_account_id, status, care_stage, metadata')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle();

  if (fetchErr || !relationship) {
    const err: any = new Error('No active therapy relationship found to change.');
    err.code = 'RELATIONSHIP_NOT_FOUND';
    err.status = 404;
    throw err;
  }

  const nowIso = new Date().toISOString();
  const currentMeta = (relationship.metadata as Record<string, any>) || {};

  // 2. Update relationship to transferred
  const { data: updated, error: updErr } = await supabase
    .from('therapy_care_relationships')
    .update({
      status: 'transferred',
      ended_at: nowIso,
      updated_at: nowIso,
      metadata: {
        ...currentMeta,
        transferred_by: 'client',
        transfer_reason: reason,
        transfer_notes: notes || null,
        transferred_at: nowIso,
      },
    })
    .eq('id', relationship.id)
    .select('*')
    .single();

  if (updErr) {
    console.error('[changeClientTherapistRelationship] Error transferring relationship:', updErr);
    throw new Error('Failed to update therapist relationship for transfer');
  }

  // 3. Invalidate active matches to allow rematching
  try {
    await supabase
      .from('therapy_matches')
      .update({ status: 'transferred', updated_at: nowIso })
      .eq('user_id', userId)
      .eq('status', 'accepted');
  } catch (matchErr) {
    console.warn('[changeClientTherapistRelationship] Match cleanup notice:', matchErr);
  }

  // 4. Notify therapist in-app
  try {
    await supabase.from('therapist_notifications').insert({
      therapist_account_id: relationship.therapist_account_id,
      user_id: userId,
      notification_type: 'client_reassigned',
      title: 'Client Requested Rematch',
      body: `Client requested rematch / clinician change. Reason: ${reason}.`,
      action_url: `/therapist/clients`,
      is_read: false,
      created_at: nowIso,
    });
  } catch (notifErr) {
    console.warn('[changeClientTherapistRelationship] Failed to notify therapist:', notifErr);
  }

  return { success: true, relationship: updated };
}