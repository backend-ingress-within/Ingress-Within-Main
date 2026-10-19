import { supabase } from '../db';
import {
  ClientProfile,
  TherapistRecord,
  ScoredMatch,
  PublicTherapistMatch,
  MatchIntakeResponse,
  WEIGHTS,
  BUDGET_BAND_MAX,
  KNOWN_MODALITIES,
  computeTriageTier,
  getClientSafetyMessage,
  getRoutingAction,
  adaptClientAnswers,
  inferModalitiesWithAI,
  getGuaranteedMatches,
  matchTherapistsForAcuityCase,
  sanitizePublicTherapist,
} from './matchingEngine';

export interface TherapistMatchCandidate {
  therapistAccountId: string;
  therapistName: string;
  email?: string | null;
  score: number;
  reasons: string[];
  metadata: Record<string, unknown>;
  publicMatch?: PublicTherapistMatch;
}

/**
 * Loads verified and eligible therapists from Supabase PostgreSQL,
 * translating database rows into canonical TherapistRecord models.
 */
export async function loadEligibleTherapistRoster(): Promise<TherapistRecord[]> {
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
        city,
        state,
        gender,
        availability_hours
      ),
      therapist_applications (
        answers,
        acuity_clearance_level
      )
    `)
    .eq('status', 'active')
    .eq('application_status', 'approved')
    .eq('verification_status', 'verified')
    .eq('can_practice', true);

  if (error || !accounts) {
    console.warn('[TherapistMatchingService] Failed to load therapists from Supabase:', error);
    return [];
  }

  const roster: TherapistRecord[] = [];

  for (const account of accounts) {
    const profile = Array.isArray(account.therapist_profiles)
      ? account.therapist_profiles[0]
      : account.therapist_profiles;

    if (!profile?.full_name) continue;

    const application = Array.isArray(account.therapist_applications)
      ? account.therapist_applications[0]
      : account.therapist_applications;

    const appAnswers = (application?.answers as Record<string, any>) || {};

    const modalities = Array.isArray(appAnswers.modalities)
      ? appAnswers.modalities
      : Array.isArray(profile.specializations)
      ? profile.specializations
      : ['CBT'];

    const primaryModalities = Array.isArray(appAnswers.primaryModalities)
      ? appAnswers.primaryModalities
      : [];

    const specialties = Array.isArray(profile.specializations)
      ? profile.specializations
      : [];

    const languages = Array.isArray(profile.languages)
      ? profile.languages
      : ['English', 'Hindi'];

    const formats = Array.isArray(profile.session_formats)
      ? profile.session_formats
      : ['Telehealth'];

    const fee = account.per_session_fee
      ? Number(account.per_session_fee)
      : Number(appAnswers.fee) || 1200;

    const experienceYears = Number(profile.experience_years) || Number(appAnswers.experienceYears) || 0;

    const capacityCurrent = Number(appAnswers.capacityCurrent ?? appAnswers.current_capacity ?? 0);
    const capacityMax = Number(appAnswers.capacityMax ?? appAnswers.max_capacity ?? 10);

    const traumaListed = Boolean(appAnswers.traumaListed === 'Yes' || appAnswers.trauma_listed === 'Yes' || appAnswers.traumaCertification);
    const traumaVerified = Boolean(appAnswers.traumaVerified || (account as any).trauma_verified);
    const backgroundCheckCleared = Boolean(appAnswers.backgroundCheckCleared || appAnswers.backgroundCheckConsent);

    const acuityClearance =
      application?.acuity_clearance_level ||
      appAnswers.acuityClearance ||
      (account as any).acuity_clearance ||
      'none';

    roster.push({
      id: account.id,
      name: profile.full_name,
      credentials: profile.qualification || profile.title || 'Consultant Psychologist',
      experienceYears,
      city: profile.city || '',
      state: profile.state || null,
      bio: profile.bio || '',
      languages,
      formats,
      fee,
      specialties,
      modalities,
      primaryModalities,
      ageGroups: Array.isArray(appAnswers.ageGroups) ? appAnswers.ageGroups : ['Adults'],
      gender: (profile as any).gender || appAnswers.gender || null,
      capacity: {
        current: capacityCurrent,
        max: capacityMax > 0 ? capacityMax : null,
      },
      severityCeiling: Number(appAnswers.severityCeiling) || 3,
      verificationStatus: account.verification_status,
      traumaListed,
      traumaVerified,
      backgroundCheckCleared,
      acuityClearance,
      email: (profile as any).contact_email || null,
    });
  }

  return roster;
}

/**
 * End-to-end matching pipeline for client intake.
 * Accepts client safety screening answers, intake answers, and an optional custom roster
 * (for testing, mocks, or isolated execution).
 */
export async function runIntakeMatching(
  safetyAnswers: Record<string, any>,
  clientAnswers: Record<string, any>,
  customRoster?: TherapistRecord[]
): Promise<MatchIntakeResponse> {
  // 1. Evaluate safety tier server-side
  const triage = computeTriageTier(safetyAnswers || {});
  const safetyMessage = getClientSafetyMessage(triage.tier);
  const routing = getRoutingAction(triage.tier);

  // 2. Adapt client answers to canonical profile shape
  const profile = adaptClientAnswers(clientAnswers || {});

  // 3. Modality inference (AI with deterministic fallback)
  try {
    const ai = await inferModalitiesWithAI(clientAnswers || {}, profile.concernPriority);
    profile.modalityHints = {
      modalities: ai.modalities,
      confidence: ai.confidence,
      reasoning: ai.reasoning,
    };
  } catch {
    // Keep deterministic heuristic from adaptClientAnswers
  }

  // 4. Load therapist roster
  const roster = customRoster || (await loadEligibleTherapistRoster());

  // 5. Match based on safety routing
  let matchResults: ScoredMatch[] = [];
  let relaxed = false;
  let relaxLabel: string | null = null;
  let guaranteedHandoff = false;

  if (routing.useAcuityPool) {
    // Priority or immediate: check the admin-cleared acuity pool first
    const acuity = matchTherapistsForAcuityCase(
      triage.tier === 'immediate' ? 'immediate' : 'priority',
      profile,
      roster
    );
    const top = acuity.ranked.find((r) => r.passesHard) || null;
    if (top) {
      matchResults = [top];
      guaranteedHandoff = false;
    } else if (triage.tier === 'priority') {
      // For priority cases, allow matched verified practitioners while notifying the care team
      const verifiedRoster = roster.filter((t) => t.verificationStatus === 'verified');
      const outcome = getGuaranteedMatches(profile, verifiedRoster);
      matchResults = outcome.results.filter((r) => r.qualifies);
      relaxed = outcome.relaxed;
      relaxLabel = outcome.relaxLabel;
      guaranteedHandoff = outcome.guaranteedHandoff;
    } else {
      // For immediate cases without an on-call cleared clinician, require direct human handoff
      matchResults = [];
      guaranteedHandoff = true;
    }
  } else {
    // Standard matching: strict -> language widening -> human handoff
    const verifiedRoster = roster.filter((t) => t.verificationStatus === 'verified');
    const outcome = getGuaranteedMatches(profile, verifiedRoster);
    matchResults = outcome.results.filter((r) => r.qualifies);
    relaxed = outcome.relaxed;
    relaxLabel = outcome.relaxLabel;
    guaranteedHandoff = outcome.guaranteedHandoff;
  }

  // 6. Public field sanitization (Privacy Shield)
  const publicMatches = matchResults.slice(0, 3).map(sanitizePublicTherapist);

  return {
    tier: triage.tier,
    safetyMessage,
    needsTeamOutreach: routing.needsTeamOutreach,
    guaranteedHandoff,
    relaxed,
    relaxLabel,
    slaHours: routing.slaHours,
    matches: publicMatches,
  };
}

/**
 * Computes therapist matches for an authenticated therapy session.
 * Fully backwards-compatible with previous computeTherapistMatches calls.
 */
export async function computeTherapistMatches(
  sessionId: string,
  userId: string,
  limit = 3,
  overrideRoster?: TherapistRecord[]
): Promise<TherapistMatchCandidate[]> {
  const { data: intake } = await supabase
    .from('therapy_intakes')
    .select('*')
    .eq('therapy_session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  if (!intake) return [];

  const { data: safety } = await supabase
    .from('therapy_safety_assessments')
    .select('*')
    .eq('therapy_session_id', sessionId)
    .eq('user_id', userId)
    .maybeSingle();

  const answers = {
    ...(intake.answers || {}),
    concerns: intake.concerns || intake.answers?.concerns || [],
    severity: intake.answers?.concernSeverity || intake.answers?.severity || {},
    city: intake.city,
    budget: intake.expectations?.budget || intake.answers?.budget,
    therapistgender: intake.answers?.therapistGender || intake.expectations?.therapistGender,
    clientlanguage: intake.answers?.clientlanguage || intake.answers?.languages || ['English'],
    clienttype: intake.answers?.clienttype || 'Adults',
  };

  const outcome = await runIntakeMatching(safety?.answers || {}, answers, overrideRoster);

  return outcome.matches.slice(0, limit).map((m, idx) => ({
    therapistAccountId: m.therapist.id,
    therapistName: m.therapist.name,
    email: null,
    score: m.score,
    reasons: [
      m.why.concerns.length ? `Matches concerns: ${m.why.concerns.join(', ')}` : 'Specialization fit',
      m.why.modalities.length ? `Approach: ${m.why.modalities.join(', ')}` : 'Modality fit',
      m.why.withinBudget ? 'Within stated budget' : 'Fee aligned with clinical experience',
    ],
    metadata: {
      rank: idx + 1,
      why: m.why,
      qualifies: m.qualifies,
      tier: outcome.tier,
      relaxed: outcome.relaxed,
    },
    publicMatch: m,
  }));
}

export * from './matchingEngine';
