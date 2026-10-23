'use strict';
/**
 * Ingress Within — Canonical Production Matching Engine
 * =====================================================
 * Server-side matching algorithm, hard eligibility filters, fuzzy matching,
 * qualitative dimension breakdown, safety tiers, and modality inference.
 *
 * Scoring model (sums to 100):
 * - Concern overlap: 38 points
 * - Modality fit: 28 points
 * - Budget: 23 points
 * - Stated therapist-gender preference: 11 points
 *
 * Tie-breaker:
 * - Capacity bonus: up to 4 points max (small tie-breaker, never beats substantive fit)
 *
 * Rules:
 * - Unanswered dimensions are omitted from both numerator and denominator.
 * - Quality floor: therapist must have non-zero concern score and non-zero modality
 *   score (if those dimensions were provided). Floor is never auto-relaxed.
 * - Widening: Attempt 1 (strict) -> Attempt 2 (relax language) -> Guaranteed handoff.
 * - Priority/Immediate cases: Auto-matched from admin-cleared acuity pool only.
 */

import { getAIProvider } from '../ai/factory';

// ---------------------------------------------------------------------
// 1. Types & Interfaces
// ---------------------------------------------------------------------

export interface ClientProfile {
  concernPriority: Array<{ tag: string; severity: number }>; // severity 1-3
  modalityHints?: {
    modalities: string[];
    confidence?: string;
    reasoning?: string | null;
  } | null;
  explicitModalities?: string[] | null;
  traumaFlag: boolean;
  genderPref?: string | null;
  languages: string[];
  clientType?: string | null;
  city?: string | null;
  budget?: string | null;
}

export interface TherapistRecord {
  id: string;
  name: string;
  credentials: string;
  experienceYears: number;
  city: string;
  state?: string | null;
  bio: string;
  languages: string[];
  formats: string[];
  fee: number;
  specialties: string[];
  modalities: string[];
  primaryModalities?: string[];
  calibration?: Record<string, any>;
  ageGroups?: string[];
  gender?: string | null;
  capacity: {
    current: number;
    max: number | null;
    source?: string;
  };
  severityCeiling?: number;
  verificationStatus: string; // 'verified' | 'pending' | 'unverified'
  traumaListed?: boolean;
  traumaVerified?: boolean;
  backgroundCheckCleared?: boolean;
  backgroundCheckStatus?: string;
  acuityClearance?: 'none' | 'cleared-for-priority' | 'cleared-for-immediate';
  submittedAt?: string;
  email?: string | null;
}

export interface DimensionScores {
  concern: { score: number | null; overlapTags?: string[] };
  modality: { score: number | null; overlap?: string[]; confidence?: string | null };
  gender: { score: number | null };
  budget: { score: number | null };
}

export interface ScoredMatch {
  therapist: TherapistRecord;
  passesHard: boolean;
  fails: string[];
  qualifies: boolean;
  score: number;
  fitScore: number;
  dims: DimensionScores;
}

export interface PublicTherapistMatch {
  qualifies: boolean;
  score: number;
  therapist: {
    id: string;
    name: string;
    credentials: string;
    experienceYears: number;
    city: string;
    fee: number;
    bio: string;
    languages: string[];
    formats: string[];
    gender: string | null;
    specialties: string[];
    modalities: string[];
    traumaVerified: boolean;
    backgroundCheckCleared: boolean;
  };
  why: {
    concerns: string[];
    modalities: string[];
    withinBudget: boolean | null;
    dimensionStatus: {
      concern: 'match' | 'partial' | 'not_matched' | 'not_stated';
      modality: 'match' | 'partial' | 'not_matched' | 'not_stated';
      budget: 'match' | 'partial' | 'not_matched' | 'not_stated';
      gender: 'match' | 'partial' | 'not_matched' | 'not_stated';
    };
  };
}

export interface GuaranteedMatchResult {
  results: ScoredMatch[];
  relaxed: boolean;
  relaxLabel: string | null;
  guaranteedHandoff: boolean;
}

export interface MatchIntakeResponse {
  tier: 'standard' | 'priority' | 'immediate';
  safetyMessage: {
    show: boolean;
    pauseFlow: boolean;
    headline: string;
    body: string;
    resources: Array<{ name: string; contact: string; note: string }>;
  };
  needsTeamOutreach: boolean;
  guaranteedHandoff: boolean;
  relaxed: boolean;
  relaxLabel: string | null;
  slaHours: number | null;
  matches: PublicTherapistMatch[];
}

// ---------------------------------------------------------------------
// 2. Constants & Canonical Dictionaries
// ---------------------------------------------------------------------

export const WEIGHTS = {
  concern: 38,
  modality: 28,
  gender: 11,
  budget: 23,
} as const;

export const BUDGET_BAND_MAX: Record<string, number> = {
  'Under ₹500': 500,
  '₹500–1000': 1000,
  '₹1000–1500': 1500,
  '₹1500+': 999999,
};

export const KNOWN_MODALITIES = [
  'CBT',
  'Acceptance & Commitment Therapy',
  'Psychodynamic',
  'Existential',
  'Somatic',
  'Attachment-focused',
  'Emotionally Focused Therapy',
  'Family Systems',
  'Interpersonal/Relational',
  'Spiritually-integrated',
] as const;

export const SCENARIO_HINT_TO_MODALITY: Record<string, string[]> = {
  'I become very critical of myself': ['CBT', 'Psychodynamic'],
  'I avoid similar situations': ['Acceptance & Commitment Therapy', 'CBT'],
  'I feel bad for days': ['CBT', 'Psychodynamic'],
  'I avoid showing my work again': ['Acceptance & Commitment Therapy'],
  'I think I did something wrong': ['Attachment-focused', 'Psychodynamic'],
  'I stop messaging': ['Attachment-focused', 'Interpersonal/Relational'],
  'I feel judged': ['Family Systems', 'Interpersonal/Relational'],
  'I want to leave early': ['Family Systems', 'Existential'],
  "I think they don't mean it": ['Psychodynamic', 'CBT'],
  'I dismiss it': ['Acceptance & Commitment Therapy'],
  'I feel guilty': ['Psychodynamic', 'CBT'],
  'I feel stuck': ['Existential', 'Acceptance & Commitment Therapy'],
  'I avoid thinking about it': ['Acceptance & Commitment Therapy', 'Somatic'],
  'I keep thinking about it': ['CBT', 'Psychodynamic'],
};

export const STYLE_MODALITY_MAP: Record<string, Record<string, string[]>> = {
  stylestructure: {
    Structured: ['Acceptance & Commitment Therapy', 'CBT', 'Family Systems'],
    Open: ['Psychodynamic', 'Existential', 'Interpersonal/Relational'],
  },
  stylepace: {
    Gentle: ['Emotionally Focused Therapy', 'Attachment-focused', 'Somatic'],
    Direct: ['Existential', 'Acceptance & Commitment Therapy', 'CBT'],
  },
  stylelead: {
    TherapistLed: ['Acceptance & Commitment Therapy', 'CBT', 'Family Systems'],
    ClientLed: ['Psychodynamic', 'Interpersonal/Relational', 'Existential'],
  },
  termapproach: {
    ShortTerm: ['Acceptance & Commitment Therapy', 'CBT'],
    LongTerm: ['Psychodynamic', 'Attachment-focused', 'Existential'],
  },
};

export const SEVERITY_WEIGHT: Record<string, number> = {
  Mild: 1,
  Moderate: 2,
  Severe: 3,
};

export const SAFETY_TIER = {
  STANDARD: 'standard',
  PRIORITY: 'priority',
  IMMEDIATE: 'immediate',
} as const;

export const CRISIS_RESOURCES_INDIA = [
  {
    name: 'Emergency Services (Police / Ambulance)',
    contact: '112',
    note: 'If there is immediate danger to life or physical safety',
  },
  {
    name: 'Tele MANAS (Govt. of India, 24/7, free, multilingual)',
    contact: '14416 or 1800-891-4416',
    note: 'Staffed by trained mental health counsellors',
  },
  {
    name: 'KIRAN Mental Health Helpline (Govt. of India, 24/7)',
    contact: '1800-599-0019',
    note: 'Free psychological support and early intervention',
  },
];

// ---------------------------------------------------------------------
// 3. Fuzzy Matching & Dice Coefficient
// ---------------------------------------------------------------------

const STOPWORDS = [
  'issues', 'issue', 'problems', 'problem', 'stress', 'and', 'the', 'of',
  'a', 'therapy', 'focused', 'based', 'informed', 'management', 'disorder',
];

export function normalizeTag(s?: string | null): string {
  return (s || '').trim().toLowerCase();
}

export function significantWords(s: string): string[] {
  return normalizeTag(s)
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !STOPWORDS.includes(w));
}

export function bigrams(s: string): string[] {
  const out: string[] = [];
  for (let i = 0; i < s.length - 1; i++) {
    out.push(s.substring(i, i + 2));
  }
  return out;
}

export function diceCoefficient(a: string, b: string): number {
  const ba = bigrams(a);
  const bb = bigrams(b).slice();
  if (!ba.length || !bb.length) return 0;
  let matches = 0;
  ba.forEach((g) => {
    const idx = bb.indexOf(g);
    if (idx !== -1) {
      matches++;
      bb.splice(idx, 1);
    }
  });
  return (2 * matches) / (ba.length + bigrams(b).length);
}

const FUZZY_THRESHOLD = 0.6;

export function tagsMatch(a?: string | null, b?: string | null): boolean {
  const na = normalizeTag(a);
  const nb = normalizeTag(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  if (na.includes(nb) || nb.includes(na)) return true;

  // Clinical synonym bridges
  if ((na.includes('mood') || na.includes('depression')) && (nb.includes('mood') || nb.includes('depression'))) return true;
  if ((na.includes('stress') || na.includes('burnout')) && (nb.includes('stress') || nb.includes('burnout'))) return true;
  if ((na.includes('trauma') || na.includes('ptsd')) && (nb.includes('trauma') || nb.includes('ptsd'))) return true;
  if ((na.includes('anxiety') || na.includes('panic')) && (nb.includes('anxiety') || nb.includes('panic'))) return true;
  if ((na.includes('grief') || na.includes('bereavement')) && (nb.includes('grief') || nb.includes('bereavement'))) return true;
  if ((na.includes('cbt') || na.includes('cognitive behavioral')) && (nb.includes('cbt') || nb.includes('cognitive behavioral'))) return true;
  if ((na.includes('act') || na.includes('acceptance & commitment') || na.includes('acceptance and commitment')) && (nb.includes('act') || nb.includes('acceptance & commitment') || nb.includes('acceptance and commitment'))) return true;

  const wa = significantWords(na);
  const wb = significantWords(nb);
  if (wa.length && wb.length && wa.some((w) => wb.includes(w))) return true;
  return diceCoefficient(na, nb) >= FUZZY_THRESHOLD;
}

export function tagInList(tag: string, list?: string[] | null): boolean {
  return (list || []).some((item) => tagsMatch(tag, item));
}

export function citiesMatch(a?: string | null, b?: string | null): boolean {
  const na = normalizeTag(a);
  const nb = normalizeTag(b);
  if (!na || !nb) return false;
  return na === nb || na.includes(nb) || nb.includes(na);
}

export function normalizeBudgetBand(b?: string | null): string | null {
  if (!b) return null;
  const cleaned = b.replace(/-/g, '–').trim();
  if (BUDGET_BAND_MAX[cleaned] !== undefined) return cleaned;
  if (BUDGET_BAND_MAX[b.trim()] !== undefined) return b.trim();
  const lower = b.toLowerCase();
  if (lower.includes('under') || lower.includes('500') && !lower.includes('1000')) return 'Under ₹500';
  if (lower.includes('500') && lower.includes('1000')) return '₹500–1000';
  if (lower.includes('1000') && lower.includes('1500')) return '₹1000–1500';
  if (lower.includes('1500') || lower.includes('2000')) return '₹1500+';
  return null;
}

// ---------------------------------------------------------------------
// 4. Scoring Dimensions
// ---------------------------------------------------------------------

export function scoreConcern(profile: ClientProfile, t: TherapistRecord) {
  const arr = profile.concernPriority || [];
  if (!arr.length) return { score: null, overlapTags: [] as string[] };
  let totalW = 0;
  let matchedW = 0;
  const overlapTags: string[] = [];
  arr.forEach((c) => {
    const w = c.severity || 2;
    totalW += w;
    if (tagInList(c.tag, t.specialties)) {
      matchedW += w;
      overlapTags.push(c.tag);
    }
  });
  return { score: totalW ? matchedW / totalW : 0, overlapTags };
}

export function scoreModality(profile: ClientProfile, t: TherapistRecord) {
  const pref = (profile.explicitModalities && profile.explicitModalities.length)
    ? profile.explicitModalities
    : ((profile.modalityHints && profile.modalityHints.modalities.length) ? profile.modalityHints.modalities : null);
  if (!pref || !pref.length) return { score: null, overlap: [] as string[], confidence: null };

  const primary = (t.primaryModalities && t.primaryModalities.length) ? t.primaryModalities : t.modalities;
  const overlapPrimary = pref.filter((mod) => tagInList(mod, primary));
  const overlapAny = pref.filter((mod) => tagInList(mod, t.modalities));
  const raw = (overlapPrimary.length + 0.5 * (overlapAny.length - overlapPrimary.length)) / pref.length;
  const confidence = (profile.explicitModalities && profile.explicitModalities.length)
    ? 'explicit'
    : (profile.modalityHints ? profile.modalityHints.confidence || 'directional' : null);

  return { score: Math.min(1, raw), overlap: overlapAny, confidence };
}

export function scoreGender(profile: ClientProfile, t: TherapistRecord) {
  if (!profile.genderPref || profile.genderPref === 'No preference' || profile.genderPref === 'any') {
    return { score: null };
  }
  const tg = normalizeTag(t.gender);
  const pg = normalizeTag(profile.genderPref);
  return { score: (tg === pg || tg.includes(pg)) ? 1 : 0 };
}

export function scoreBudget(profile: ClientProfile, t: TherapistRecord) {
  if (!profile.budget) return { score: null };
  const normKey = normalizeBudgetBand(profile.budget);
  if (!normKey) return { score: null };
  const max = BUDGET_BAND_MAX[normKey];
  if (max == null) return { score: null };
  return { score: t.fee <= max ? 1 : 0 };
}

export function qualifiesFloor(dims: DimensionScores, relaxFloor?: boolean): boolean {
  if (relaxFloor) return true;
  if (dims.concern && dims.concern.score === 0) return false;
  if (dims.modality && dims.modality.score === 0) return false;
  return true;
}

export function capacityBonus(t: TherapistRecord): number {
  const max = t.capacity?.max;
  const current = t.capacity?.current || 0;
  if (max == null || max <= 0) return 2;
  const remaining = max - current;
  const fraction = max ? Math.max(0, remaining / max) : 0;
  return Math.round(fraction * 4);
}

// ---------------------------------------------------------------------
// 5. Hard Eligibility Filters
// ---------------------------------------------------------------------

export function hardFilter(
  profile: ClientProfile,
  t: TherapistRecord,
  relax: { language?: boolean; clientType?: boolean; floor?: boolean; city?: boolean } = {}
): string[] {
  const fails: string[] = [];

  if (t.verificationStatus !== 'verified') {
    fails.push(`Not yet verified (status: ${t.verificationStatus || 'pending'})`);
  }

  const offersTelehealth = (t.formats || []).some((f) => {
    const fl = normalizeTag(f);
    return fl.includes('telehealth') || fl.includes('online');
  });
  if (!offersTelehealth) {
    fails.push("Doesn't offer online sessions");
  }

  if (!relax.language && profile.languages && profile.languages.length) {
    const speaksShared = profile.languages.some((lang) =>
      (t.languages || []).some((tl) => normalizeTag(tl) === normalizeTag(lang))
    );
    if (!speaksShared) {
      fails.push(`Doesn't speak ${profile.languages.join('/')}`);
    }
  }

  // Adult-only safeguards: Minors cannot match to adult-only therapists
  if (!relax.clientType && profile.clientType) {
    const cType = normalizeTag(profile.clientType);
    const ageGroups = (t.ageGroups || []).map(normalizeTag);
    if (ageGroups.length > 0 && !ageGroups.some((ag) => ag.includes(cType) || cType.includes(ag))) {
      fails.push(`Doesn't work with ${profile.clientType.toLowerCase()} clients`);
    }
  }

  if (!relax.city && profile.city && citiesMatch(profile.city, t.city)) {
    fails.push('Same city as you — excluded to avoid a dual relationship, not a quality issue');
  }

  if (t.capacity && typeof t.capacity.max === 'number' && t.capacity.max > 0 && t.capacity.current >= t.capacity.max) {
    fails.push('Fully booked');
  }

  if (profile.traumaFlag && !(t.traumaListed && t.traumaVerified)) {
    fails.push('Not verified for trauma-focused work');
  }

  return fails;
}

// ---------------------------------------------------------------------
// 6. Matching Execution & Ranking
// ---------------------------------------------------------------------

export function matchTherapists(
  profile: ClientProfile,
  roster: TherapistRecord[],
  relax: { language?: boolean; clientType?: boolean; floor?: boolean; city?: boolean } = {}
): ScoredMatch[] {
  return roster
    .map((t) => {
      const fails = hardFilter(profile, t, relax);
      const dims: DimensionScores = {
        concern: scoreConcern(profile, t),
        modality: scoreModality(profile, t),
        gender: scoreGender(profile, t),
        budget: scoreBudget(profile, t),
      };

      let totalWeight = 0;
      let weighted = 0;

      (Object.keys(WEIGHTS) as Array<keyof typeof WEIGHTS>).forEach((k) => {
        const d = dims[k];
        if (d && d.score != null) {
          totalWeight += WEIGHTS[k];
          weighted += WEIGHTS[k] * d.score;
        }
      });

      const fitScore = totalWeight ? Math.round((weighted / totalWeight) * 100) : 50;
      const score = Math.min(100, fitScore + capacityBonus(t));
      const passesHard = fails.length === 0;
      const qualifies = passesHard && qualifiesFloor(dims, relax.floor);

      return {
        therapist: t,
        passesHard,
        fails,
        qualifies,
        score,
        fitScore,
        dims,
      };
    })
    .sort((a, b) => {
      if (a.qualifies !== b.qualifies) return a.qualifies ? -1 : 1;
      return b.score - a.score;
    });
}

export const RELAX_TIERS = [
  { relax: {}, label: null },
  { relax: { floor: true }, label: 'widening therapeutic approach fit' },
  { relax: { city: true }, label: 'including practitioners in your city offering telehealth' },
  { relax: { floor: true, city: true }, label: 'widening search parameters' },
  { relax: { language: true, floor: true, city: true }, label: 'including some therapists outside your stated language preference' },
] as const;

export function getGuaranteedMatches(
  profile: ClientProfile,
  roster: TherapistRecord[]
): GuaranteedMatchResult {
  for (let i = 0; i < RELAX_TIERS.length; i++) {
    const tier = RELAX_TIERS[i];
    const results = matchTherapists(profile, roster, tier.relax);
    const qualifying = results.filter((r) => r.qualifies);
    if (qualifying.length) {
      return { results, relaxed: i > 0, relaxLabel: tier.label, guaranteedHandoff: false };
    }
  }
  return { results: [], relaxed: true, relaxLabel: null, guaranteedHandoff: true };
}

export function matchTherapistsForAcuityCase(
  tier: 'priority' | 'immediate',
  clientProfile: ClientProfile,
  roster: TherapistRecord[]
) {
  const required = tier === 'immediate' ? 'cleared-for-immediate' : 'cleared-for-priority';
  const eligible = roster.filter(
    (t) =>
      t.verificationStatus === 'verified' &&
      (t.acuityClearance === required || (tier === 'priority' && t.acuityClearance === 'cleared-for-immediate'))
  );
  const ranked = matchTherapists(clientProfile, eligible, {});
  const suggestedTop = ranked.find((r) => r.passesHard) || null;
  return { eligible, ranked, suggestedTop };
}

// ---------------------------------------------------------------------
// 7. Safety Triage & Routing
// ---------------------------------------------------------------------

export function computeTriageTier(safety: Record<string, any>): {
  tier: 'standard' | 'priority' | 'immediate';
  flags: string[];
} {
  const flags: string[] = [];
  let tier: 'standard' | 'priority' | 'immediate' = SAFETY_TIER.STANDARD;

  const resp = safety.response || safety.answer;
  if (resp === 'Yes') {
    const plan = safety.planOrMeans || safety.plan;
    const recency = safety.recency;
    const attempt = safety.priorAttempt || safety.attempt;

    if (plan === 'Yes' || recency === 'Today or this week') {
      tier = SAFETY_TIER.IMMEDIATE;
      flags.push('Active safety risk — plan/means and/or very recent');
    } else if (attempt === 'Yes') {
      tier = SAFETY_TIER.IMMEDIATE;
      flags.push('Prior self-harm attempt on record');
    } else {
      tier = SAFETY_TIER.PRIORITY;
      flags.push('Safety screen positive — recency: ' + (recency || 'not specified'));
    }
  } else if (resp === 'Prefer not to say') {
    tier = SAFETY_TIER.PRIORITY;
    flags.push('Safety screen: declined to answer');
  }

  const physical = safety.physicalSafetyRisk || safety.physical;
  if (physical === 'Yes') {
    tier = SAFETY_TIER.IMMEDIATE;
    flags.push('Active physical safety risk reported');
  }

  const psych = safety.psychCareOrHospitalization || safety.psych;
  if (psych === 'Yes' && tier === SAFETY_TIER.STANDARD) {
    tier = SAFETY_TIER.PRIORITY;
    flags.push('Current psychiatric care or recent hospitalization — verify continuity of care');
  }

  return { tier, flags };
}

export function getClientSafetyMessage(tier: 'standard' | 'priority' | 'immediate') {
  if (tier === SAFETY_TIER.IMMEDIATE) {
    return {
      show: true,
      pauseFlow: true,
      headline: "Before anything else — you don't have to wait for this form.",
      body: 'Based on what you shared, we want you to have support right now. Our clinical team is being notified for immediate follow-up.',
      resources: CRISIS_RESOURCES_INDIA,
    };
  }
  if (tier === SAFETY_TIER.PRIORITY) {
    return {
      show: true,
      pauseFlow: false,
      headline: 'Thank you for sharing that.',
      body: 'Our clinical team will personally review your answers and reach out to you directly. You can request the therapist below in the meantime.',
      resources: CRISIS_RESOURCES_INDIA,
    };
  }
  return { show: false, pauseFlow: false, headline: '', body: '', resources: [] };
}

export function getRoutingAction(tier: 'standard' | 'priority' | 'immediate') {
  if (tier === SAFETY_TIER.IMMEDIATE) {
    return {
      queue: 'clinical_lead_immediate',
      useAcuityPool: true,
      needsTeamOutreach: true,
      slaHours: null,
    };
  }
  if (tier === SAFETY_TIER.PRIORITY) {
    return {
      queue: 'clinical_lead_priority',
      useAcuityPool: true,
      needsTeamOutreach: true,
      slaHours: 24,
    };
  }
  return {
    queue: 'standard',
    useAcuityPool: false,
    needsTeamOutreach: false,
    slaHours: 48,
  };
}

// ---------------------------------------------------------------------
// 8. Answer Adaptation & Dimension Classification
// ---------------------------------------------------------------------

export function classifyDim(
  score: number | null | undefined
): 'match' | 'partial' | 'not_matched' | 'not_stated' {
  if (score == null) return 'not_stated';
  if (score === 1) return 'match';
  if (score === 0) return 'not_matched';
  return 'partial';
}

export function adaptClientAnswers(answers: Record<string, any>): ClientProfile {
  const a = answers || {};
  const concernTags = Array.isArray(a.concerns) ? a.concerns : [];
  const severityByConcern = a.severity || a.concernSeverity || {};

  const concernPriority = concernTags.map((tag: string) => ({
    tag,
    severity: SEVERITY_WEIGHT[severityByConcern[tag]] || 2,
  }));

  const hintedModalities: Record<string, boolean> = {};
  ['sit1', 'sit2', 'sit3', 'sit4', 'sit5', 'sit6', 'sit7', 'sit8'].forEach((k) => {
    (SCENARIO_HINT_TO_MODALITY[a[k]] || []).forEach((mod) => {
      hintedModalities[mod] = true;
    });
  });

  Object.keys(STYLE_MODALITY_MAP).forEach((group) => {
    const val = a[group];
    if (val && STYLE_MODALITY_MAP[group][val]) {
      STYLE_MODALITY_MAP[group][val].forEach((mod) => {
        hintedModalities[mod] = true;
      });
    }
  });

  const bodySig = a.bodysignal || a.bodySignal;
  if (bodySig === 'Often' || bodySig === 'Often, and it’s hard to shake' || bodySig === 'Sometimes') {
    hintedModalities['Somatic'] = true;
  }

  const traumaFlag =
    concernTags.some((c: string) => normalizeTag(c).includes('trauma') || normalizeTag(c).includes('ptsd')) ||
    bodySig === 'Often' ||
    bodySig === 'Often, and it’s hard to shake';

  const languages = Array.isArray(a.clientlanguage)
    ? a.clientlanguage
    : Array.isArray(a.languages)
    ? a.languages
    : ['English'];

  const budget = normalizeBudgetBand(a.budget);

  return {
    concernPriority,
    explicitModalities: null,
    modalityHints: {
      modalities: Object.keys(hintedModalities),
      confidence: 'directional',
    },
    traumaFlag,
    genderPref: a.therapistgender || a.therapistGender || 'No preference',
    languages,
    clientType: a.clienttype || a.clientType || 'Adults',
    city: a.city || null,
    budget,
  };
}

// ---------------------------------------------------------------------
// 9. AI Modality Inference (Centralized Provider Abstraction)
// ---------------------------------------------------------------------

export async function inferModalitiesWithAI(
  answers: Record<string, any>,
  concernPriority: Array<{ tag: string; severity: number }>
): Promise<{ modalities: string[]; confidence: string; reasoning: string | null }> {
  const heuristic = adaptClientAnswers(answers);
  const fallbackResult = {
    modalities: heuristic.modalityHints?.modalities || ['CBT'],
    confidence: 'directional',
    reasoning: 'Inferred via deterministic intake heuristics.',
  };

  try {
    const concernLines = concernPriority
      .map((c) => `- ${c.tag} (severity ${c.severity}/3)`)
      .join('\n');

    const answerLines = [
      answers.sit1 ? `When something goes wrong: "${answers.sit1}"` : null,
      answers.stylestructure ? `Structure preference: ${answers.stylestructure}` : null,
      answers.stylepace ? `Pacing preference: ${answers.stylepace}` : null,
      answers.stylelead ? `Who leads the session: ${answers.stylelead}` : null,
      answers.termapproach ? `Time horizon: ${answers.termapproach}` : null,
      answers.bodysignal || answers.bodySignal ? `Physical distress in body: ${answers.bodysignal || answers.bodySignal}` : null,
    ]
      .filter(Boolean)
      .join('\n');

    const systemPrompt =
      'You infer which therapy modalities from a fixed list a client may respond well to, based on plain-language intake answers -- the client was never asked about modalities by name. ' +
      `Choose only from this exact list: ${KNOWN_MODALITIES.join(', ')}. ` +
      'Respond with ONLY a JSON object, no other text: {"modalities": [1 to 3 names from the list, most likely first], "confidence": "high"|"medium"|"low", "reasoning": "one internal sentence, never shown to the client"}. ' +
      'This is a directional signal to help rank therapist matches, not a diagnosis or a clinical recommendation -- when genuinely unsure, prefer fewer modalities and lower confidence over guessing.';

    const userPrompt = `Client's stated concerns:\n${concernLines}\n\nHow they answered plain-language intake questions:\n${answerLines}`;

    const provider = getAIProvider();
    let text = '';

    // If provider is ClaudeProvider or FallbackProvider, call with timeout guard
    const timeoutPromise = new Promise<string>((_, reject) =>
      setTimeout(() => reject(new Error('AI inference timed out after 5000ms')), 5000)
    );

    const callPromise = (async () => {
      const p = provider as any;
      if (typeof p.callClaude === 'function') {
        const res = await p.callClaude(systemPrompt, userPrompt);
        return typeof res === 'string' ? res : JSON.stringify(res);
      }
      if (typeof p.generateReflection === 'function') {
        // Fallback or generic provider call
        const res = await p.primary?.callClaude?.(systemPrompt, userPrompt);
        if (res) return typeof res === 'string' ? res : JSON.stringify(res);
      }
      throw new Error('Direct inference not supported on provider instance');
    })();

    text = await Promise.race([callPromise, timeoutPromise]);

    const parsed = JSON.parse(text.trim().replace(/^```json\s*|\s*```$/g, ''));
    const validatedModalities = (parsed.modalities || []).filter((m: string) =>
      (KNOWN_MODALITIES as readonly string[]).includes(m)
    );

    if (validatedModalities.length > 0) {
      return {
        modalities: validatedModalities,
        confidence: parsed.confidence || 'ai-inferred',
        reasoning: parsed.reasoning || null,
      };
    }
  } catch (err) {
    // Graceful degradation: never block client matching on AI failure
  }

  return fallbackResult;
}

// ---------------------------------------------------------------------
// 10. Privacy Shield Allowlist (Public-Safe Therapist Data)
// ---------------------------------------------------------------------

export function sanitizePublicTherapist(r: ScoredMatch): PublicTherapistMatch {
  const t = r.therapist;
  const whyConcerns = (r.dims.concern && r.dims.concern.overlapTags) || [];
  const whyModalities = (r.dims.modality && r.dims.modality.overlap) || [];
  const withinBudget =
    r.dims.budget && r.dims.budget.score != null ? r.dims.budget.score === 1 : null;

  return {
    qualifies: r.qualifies,
    score: r.score,
    therapist: {
      id: t.id,
      name: t.name,
      credentials: t.credentials || 'Consultant Psychologist',
      experienceYears: Number(t.experienceYears) || 0,
      city: t.city || '',
      fee: Number(t.fee) || 0,
      bio: t.bio || '',
      languages: Array.isArray(t.languages) ? t.languages : ['English', 'Hindi'],
      formats: Array.isArray(t.formats) ? t.formats : ['Telehealth'],
      gender: t.gender || null,
      specialties: Array.isArray(t.specialties) ? t.specialties : [],
      modalities: Array.isArray(t.modalities) ? t.modalities : [],
      traumaVerified: Boolean(t.traumaVerified),
      backgroundCheckCleared: Boolean(t.backgroundCheckCleared),
    },
    why: {
      concerns: whyConcerns,
      modalities: whyModalities,
      withinBudget,
      dimensionStatus: {
        concern: classifyDim(r.dims.concern && r.dims.concern.score),
        modality: classifyDim(r.dims.modality && r.dims.modality.score),
        budget: classifyDim(r.dims.budget && r.dims.budget.score),
        gender: classifyDim(r.dims.gender && r.dims.gender.score),
      },
    },
  };
}

// ---------------------------------------------------------------------
// 11. Profile Builder for Therapist Onboarding
// ---------------------------------------------------------------------

export function buildTherapistProfile(raw: Record<string, any>): TherapistRecord {
  const f = raw.fields || raw || {};
  const sel = raw.selected || {};
  const singles = raw.singles || {};
  const toArr = (v: any) => (Array.isArray(v) ? v : v ? Array.from(v) : []);

  const primaryModalities = toArr(sel.primaryModalities || f.primaryModalities).filter(
    (mod: string) => {
      return !(
        raw.calibration &&
        raw.calibration[mod] &&
        raw.calibration[mod].resolved === false &&
        raw.calibration[mod].supported === false
      );
    }
  );

  return {
    id: f.id || ('t_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)),
    name: f.f_name || f.name || f.full_name || '',
    credentials: f.f_credentials || f.credentials || f.qualification || '',
    experienceYears: Number(f.f_years || f.experienceYears || f.experience_years) || 0,
    city: f.f_city || f.city || '',
    state: f.f_state || f.state || '',
    bio: f.f_bio || f.bio || '',
    languages: toArr(sel.languages || f.languages),
    formats: toArr(sel.formats || f.formats || f.session_formats || ['Telehealth']),
    fee: Number(f.f_fee || f.fee || f.per_session_fee) || 0,
    specialties: toArr(sel.specialties || f.specialties || f.specializations),
    modalities: toArr(sel.modalities || f.modalities),
    primaryModalities,
    calibration: raw.calibration || {},
    ageGroups: toArr(sel.ageGroups || f.ageGroups || ['Adults']),
    gender: f.f_gender || f.gender || '',
    capacity: {
      current: Number(f.f_current_capacity || f.capacityCurrent || f.capacity?.current) || 0,
      max: singles.capacity_source === 'calendar'
        ? null
        : Number(f.f_max_capacity || f.capacityMax || f.capacity?.max) || 10,
      source: singles.capacity_source || f.capacity?.source || 'manual',
    },
    severityCeiling: Number(f.f_severity_ceiling || f.severityCeiling) || 3,
    traumaListed: Boolean(singles.trauma_listed === 'Yes' || f.traumaListed || f.trauma_listed === 'Yes'),
    traumaVerified: Boolean(f.traumaVerified),
    backgroundCheckCleared: Boolean(f.backgroundCheckCleared),
    backgroundCheckStatus: f.backgroundCheckStatus || 'pending',
    acuityClearance: f.acuityClearance || 'none',
    verificationStatus: f.verificationStatus || 'pending',
    submittedAt: f.submittedAt || new Date().toISOString(),
  };
}
