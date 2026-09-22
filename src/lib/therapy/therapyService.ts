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

  const payload = matches.map((match) => ({
    therapy_session_id: sessionId,
    user_id: userId,
    therapist_account_id: match.therapistAccountId ?? null,
    match_status: match.matchStatus || 'candidate',
    match_rank: match.matchRank ?? null,
    match_score: match.matchScore ?? null,
    match_reasons: match.matchReasons || [],
    matching_metadata: match.matchingMetadata || {},
  }));

  const { data, error } = await supabase
    .from('therapy_matches')
    .insert(payload)
    .select('*');

  if (error) {
    console.error('[TherapyService] saveTherapyMatches failed:', error);
    throw new Error('Failed to save Therapy matches.');
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