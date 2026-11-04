'use strict';
/**
 * Ingress Within — Conversational Intake Question Bank & Branching Configuration
 * ============================================================================
 * Controlled question engine supporting:
 * - Assistant welcoming & natural conversational acknowledgment
 * - Adaptive branching based on client responses
 * - Rich input types: textarea, single_select, multi_select, yes_no, contact_consent
 * - Data field mapping to canonical therapy_intakes & therapy_safety_assessments
 * - Fallback deterministic acknowledgments (no hard LLM dependency)
 */

export type QuestionInputType =
  | 'textarea'
  | 'text'
  | 'single_select'
  | 'multi_select'
  | 'yes_no'
  | 'contact_consent';

export interface QuestionOption {
  value: string;
  label: string;
  description?: string;
}

export interface QuestionConfig {
  id: string;
  stepNumber: number;
  category: 'welcome' | 'concerns' | 'experience' | 'goals' | 'preferences' | 'safety' | 'consent';
  prompt: string;
  helperText?: string;
  inputType: QuestionInputType;
  options?: QuestionOption[];
  required: boolean;
  skippable?: boolean;
  skipLabel?: string;
  placeholder?: string;
  fieldMapping: string; // destination in answers / intake
  sensitivity: 'low' | 'medium' | 'high' | 'safety';
  shouldShow?: (answers: Record<string, any>) => boolean;
  getNextQuestionId?: (currentValue: any, answers: Record<string, any>) => string | null;
  getNaturalAcknowledgment?: (value: any, answers: Record<string, any>) => string;
}

export const CONVERSATIONAL_QUESTIONS: QuestionConfig[] = [
  // ---------------------------------------------------------------------------
  // 1. OPEN-ENDED REASON (Welcome)
  // ---------------------------------------------------------------------------
  {
    id: 'reason',
    stepNumber: 1,
    category: 'welcome',
    prompt: 'Hi, welcome to Ingress Within. We take this at your pace. What brings you to therapy today?',
    helperText: 'Take your time. You can write a few sentences or just a thought about what’s been on your mind.',
    inputType: 'textarea',
    placeholder: 'Share what has been weighing on you or what you hope to explore...',
    required: true,
    fieldMapping: 'presenting_reason',
    sensitivity: 'medium',
    getNextQuestionId: () => 'concerns',
    getNaturalAcknowledgment: (val: string) => {
      if (!val || val.trim().length < 10) {
        return 'Thank you for taking that first step with us.';
      }
      return 'Thank you for sharing that with me. It takes real openness to put these experiences into words.';
    },
  },

  // ---------------------------------------------------------------------------
  // 2. CONCERNS (Optional Category Categorization)
  // ---------------------------------------------------------------------------
  {
    id: 'concerns',
    stepNumber: 2,
    category: 'concerns',
    prompt: 'Which of these areas feel connected to what you’re moving through?',
    helperText: 'Select all that apply, or tap "My words above cover it" to move forward.',
    inputType: 'multi_select',
    options: [
      { value: 'Anxiety', label: 'Anxiety & Overthinking' },
      { value: 'Stress', label: 'Stress & Burnout' },
      { value: 'Low mood', label: 'Low Mood & Depression' },
      { value: 'Relationship issues', label: 'Relationship Concerns' },
      { value: 'Family issues', label: 'Family Difficulties' },
      { value: 'Work/Career', label: 'Work & Career Pressure' },
      { value: 'Self-confidence', label: 'Self-Confidence & Worth' },
      { value: 'Grief', label: 'Grief & Loss' },
      { value: 'Life transitions', label: 'Major Life Transitions' },
      { value: 'Emotional overwhelm', label: 'Emotional Overwhelm & Regulation' },
      { value: 'Sleep problems', label: 'Sleep Difficulties' },
      { value: 'Personal growth', label: 'Personal Growth & Self-Exploration' },
      { value: 'Other', label: 'Other areas' },
    ],
    required: false,
    skippable: true,
    skipLabel: 'My words above cover it',
    fieldMapping: 'concerns',
    sensitivity: 'medium',
    getNextQuestionId: () => 'duration',
    getNaturalAcknowledgment: (val: string[]) => {
      if (!val || !val.length) {
        return 'Understood — your personal description gives us good initial grounding.';
      }
      return `Noted. Having clarity on ${val.slice(0, 2).join(' and ')} helps us identify clinicians who work deeply in these areas.`;
    },
  },

  // ---------------------------------------------------------------------------
  // 3. DURATION
  // ---------------------------------------------------------------------------
  {
    id: 'duration',
    stepNumber: 3,
    category: 'experience',
    prompt: 'How long have you been experiencing this?',
    helperText: 'This gives the clinician context on onset and chronology.',
    inputType: 'single_select',
    options: [
      { value: 'Past few weeks', label: 'Just recently (past few weeks)' },
      { value: 'A few months', label: 'A few months' },
      { value: 'Over a year', label: 'Over a year' },
      { value: 'As long as I can remember', label: 'As long as I can remember' },
      { value: 'Comes and goes in waves', label: 'It comes and goes in waves' },
    ],
    required: true,
    fieldMapping: 'duration',
    sensitivity: 'low',
    getNextQuestionId: () => 'daily_impact',
    getNaturalAcknowledgment: (val: string) => {
      return `Thank you. Understanding that this has been present for ${val.toLowerCase()} helps calibrate the pace of care.`;
    },
  },

  // ---------------------------------------------------------------------------
  // 4. DAILY IMPACT
  // ---------------------------------------------------------------------------
  {
    id: 'daily_impact',
    stepNumber: 4,
    category: 'experience',
    prompt: 'How is this affecting your day-to-day life right now?',
    helperText: 'Consider your energy, focus, relationships, and routine.',
    inputType: 'single_select',
    options: [
      { value: 'Mild', label: 'Mildly — manageable, but consistently on my mind' },
      { value: 'Moderate', label: 'Moderately — impacting my work, sleep, or relationships' },
      { value: 'Significant', label: 'Significantly — day-to-day routines feel heavy or overwhelming' },
      { value: 'Prefer not to say', label: 'Prefer not to say right now' },
    ],
    required: true,
    fieldMapping: 'daily_impact',
    sensitivity: 'medium',
    getNextQuestionId: () => 'trajectory',
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'Significant') {
        return 'We hear you. Carrying that weight every day takes immense energy. Having the right support can lighten that load.';
      }
      return 'Got it. That helps us understand where you are starting from.';
    },
  },

  // ---------------------------------------------------------------------------
  // 5. TRAJECTORY
  // ---------------------------------------------------------------------------
  {
    id: 'trajectory',
    stepNumber: 5,
    category: 'experience',
    prompt: 'How would you describe the way things have been shifting lately?',
    inputType: 'single_select',
    options: [
      { value: 'Gradually improving', label: 'Gradually improving' },
      { value: 'Staying about the same', label: 'Staying about the same' },
      { value: 'Gradually getting harder', label: 'Gradually getting harder' },
      { value: 'Fluctuating unpredictably', label: 'Fluctuating unpredictably' },
    ],
    required: true,
    fieldMapping: 'trajectory',
    sensitivity: 'low',
    getNextQuestionId: () => 'past_therapy',
    getNaturalAcknowledgment: () => 'Understood.',
  },

  // ---------------------------------------------------------------------------
  // 6. PAST THERAPY EXPERIENCE
  // ---------------------------------------------------------------------------
  {
    id: 'past_therapy',
    stepNumber: 6,
    category: 'experience',
    prompt: 'Have you worked with a counselor or therapist before?',
    inputType: 'single_select',
    options: [
      { value: 'No', label: 'No, this would be my first time' },
      { value: 'Yes_past', label: 'Yes, in the past' },
      { value: 'Yes_recent', label: 'Yes, looking for a new practitioner' },
      { value: 'Prefer not to say', label: 'Prefer not to say' },
    ],
    required: true,
    fieldMapping: 'past_therapy',
    sensitivity: 'low',
    getNextQuestionId: (val) => {
      if (val === 'Yes_past' || val === 'Yes_recent') {
        return 'past_therapy_feedback';
      }
      return 'therapy_goals';
    },
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'No') {
        return 'Starting therapy for the first time is a significant step. Our clinicians are gentle and walk you through every step.';
      }
      return 'Got it. Having previous experience gives you a helpful reference point.';
    },
  },

  // ---------------------------------------------------------------------------
  // 6a. PAST THERAPY FEEDBACK (Conditional)
  // ---------------------------------------------------------------------------
  {
    id: 'past_therapy_feedback',
    stepNumber: 7,
    category: 'experience',
    prompt: 'How was that previous experience for you?',
    helperText: 'Knowing what did or didn’t work helps us recommend a better fit.',
    inputType: 'single_select',
    options: [
      { value: 'Helpful', label: 'Helpful — looking to build on what I learned' },
      { value: 'Mixed', label: 'Mixed — helped in some areas, but missed others' },
      { value: 'Not helpful', label: 'Not helpful — hoping for a different therapeutic style this time' },
    ],
    required: false,
    skippable: true,
    skipLabel: 'Skip this question',
    fieldMapping: 'past_therapy_feedback',
    sensitivity: 'low',
    shouldShow: (answers) => answers.past_therapy === 'Yes_past' || answers.past_therapy === 'Yes_recent',
    getNextQuestionId: () => 'therapy_goals',
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'Not helpful') {
        return 'We understand. The therapeutic relationship is deeply personal, and finding someone whose style clicks with you makes all the difference.';
      }
      return 'Thank you for that context.';
    },
  },

  // ---------------------------------------------------------------------------
  // 7. THERAPY GOALS & EXPECTATIONS
  // ---------------------------------------------------------------------------
  {
    id: 'therapy_goals',
    stepNumber: 8,
    category: 'goals',
    prompt: 'What would you most like to get out of your sessions?',
    helperText: 'Select up to 3 priorities.',
    inputType: 'multi_select',
    options: [
      { value: 'coping_strategies', label: 'Practical coping strategies & grounding tools' },
      { value: 'self_understanding', label: 'Deeper self-understanding & emotional clarity' },
      { value: 'safe_space', label: 'A safe, non-judgmental space to speak freely' },
      { value: 'life_transition', label: 'Navigating a major life transition or decision' },
      { value: 'healing_trauma', label: 'Healing from past experiences or relationship wounds' },
      { value: 'communication', label: 'Improving communication & relational boundaries' },
    ],
    required: true,
    fieldMapping: 'therapy_goals',
    sensitivity: 'low',
    getNextQuestionId: () => 'session_structure',
    getNaturalAcknowledgment: (val: string[]) => {
      return `Clear goals give therapy direction. We will align with clinicians who prioritize ${val && val.length ? 'these outcomes' : 'your goals'}.`;
    },
  },

  // ---------------------------------------------------------------------------
  // 8. SESSION STRUCTURE PREFERENCE
  // ---------------------------------------------------------------------------
  {
    id: 'session_structure',
    stepNumber: 9,
    category: 'preferences',
    prompt: 'What style of conversation feels most natural to you?',
    inputType: 'single_select',
    options: [
      { value: 'Structured', label: 'Structured — clear agendas, actionable tools, and between-session reflections' },
      { value: 'Exploratory', label: 'Exploratory — open-ended reflection guided by what arises naturally' },
      { value: 'Balanced', label: 'A balanced blend of both structure and open reflection' },
      { value: 'No preference', label: 'No preference — I trust the clinician’s clinical judgment' },
    ],
    required: true,
    fieldMapping: 'session_structure',
    sensitivity: 'low',
    getNextQuestionId: () => 'client_type',
    getNaturalAcknowledgment: (val: string) => {
      return `Noted. ${val === 'Structured' ? 'A structured, tools-first rhythm' : val === 'Exploratory' ? 'An open, space-holding style' : 'A flexible rhythm'} will be reflected in matching.`;
    },
  },

  // ---------------------------------------------------------------------------
  // 9. CLIENT TYPE (Individual, Couples, Family, Adolescent)
  // ---------------------------------------------------------------------------
  {
    id: 'client_type',
    stepNumber: 10,
    category: 'preferences',
    prompt: 'Who will be attending these therapy sessions?',
    inputType: 'single_select',
    options: [
      { value: 'Adults', label: 'Individual adult (for myself, 18+)' },
      { value: 'Couples', label: 'Couples / Relationship therapy (2 partners)' },
      { value: 'Family', label: 'Family therapy' },
      { value: 'Adolescent', label: 'Adolescent (13–17 years)' },
    ],
    required: true,
    fieldMapping: 'client_type',
    sensitivity: 'low',
    getNextQuestionId: (val) => {
      if (val === 'Adolescent') return 'minor_consent';
      if (val === 'Couples') return 'couples_context';
      return 'session_format';
    },
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'Couples') return 'Couples work requires certified relational practitioners. We will filter for clinicians trained in couples modalities.';
      if (val === 'Adolescent') return 'Adolescent therapy requires specialized developmental credentials.';
      return 'Understood.';
    },
  },

  // ---------------------------------------------------------------------------
  // 9a. MINOR GUARDIAN CONSENT (Conditional)
  // ---------------------------------------------------------------------------
  {
    id: 'minor_consent',
    stepNumber: 11,
    category: 'preferences',
    prompt: 'Sessions for minors require parental or legal guardian consent before session confirmation. Are you able to provide guardian authorization?',
    inputType: 'yes_no',
    required: true,
    fieldMapping: 'minor_consent',
    sensitivity: 'medium',
    shouldShow: (answers) => answers.client_type === 'Adolescent',
    getNextQuestionId: () => 'session_format',
    getNaturalAcknowledgment: () => 'Thank you for confirming guardian authorization requirements.',
  },

  // ---------------------------------------------------------------------------
  // 9b. COUPLES CONTEXT (Conditional)
  // ---------------------------------------------------------------------------
  {
    id: 'couples_context',
    stepNumber: 11,
    category: 'preferences',
    prompt: 'Are both partners willing and available to attend virtual sessions together?',
    inputType: 'single_select',
    options: [
      { value: 'Both aligned', label: 'Yes, both partners are aligned to participate' },
      { value: 'Hesitant but willing', label: 'One partner is hesitant but willing to try' },
      { value: 'Individual first', label: 'Seeking guidance individually before joint sessions' },
    ],
    required: true,
    fieldMapping: 'couples_context',
    sensitivity: 'medium',
    shouldShow: (answers) => answers.client_type === 'Couples',
    getNextQuestionId: () => 'session_format',
    getNaturalAcknowledgment: () => 'Understood. Our couples therapists are skilled in meeting both partners wherever they are.',
  },

  // ---------------------------------------------------------------------------
  // 10. SESSION FORMAT (Online vs In-Person)
  // ---------------------------------------------------------------------------
  {
    id: 'session_format',
    stepNumber: 12,
    category: 'preferences',
    prompt: 'How would you prefer to attend your sessions?',
    inputType: 'single_select',
    options: [
      { value: 'Telehealth', label: 'Online (Virtual video sessions via secure Google Meet)' },
      { value: 'In-Person', label: 'In-person clinic consultation' },
      { value: 'Either', label: 'Either format works for me' },
    ],
    required: true,
    fieldMapping: 'session_format',
    sensitivity: 'low',
    getNextQuestionId: (val) => {
      if (val === 'In-Person') return 'city';
      return 'therapist_gender';
    },
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'Telehealth') return 'Online telehealth provides full calendar integration and comfort from your private space.';
      if (val === 'In-Person') return 'In-person consultations are available at verified clinic spaces.';
      return 'Flexibility makes scheduling and finding the right match much easier.';
    },
  },

  // ---------------------------------------------------------------------------
  // 10a. CITY (Conditional for In-Person)
  // ---------------------------------------------------------------------------
  {
    id: 'city',
    stepNumber: 13,
    category: 'preferences',
    prompt: 'Which city are you located in for in-person clinic appointments?',
    inputType: 'single_select',
    options: [
      { value: 'Bengaluru', label: 'Bengaluru' },
      { value: 'Mumbai', label: 'Mumbai / Navi Mumbai' },
      { value: 'Delhi-NCR', label: 'Delhi-NCR (New Delhi, Gurugram, Noida)' },
      { value: 'Pune', label: 'Pune' },
      { value: 'Hyderabad', label: 'Hyderabad' },
      { value: 'Chennai', label: 'Chennai' },
      { value: 'Kolkata', label: 'Kolkata' },
      { value: 'Other City', label: 'Other location' },
    ],
    required: true,
    fieldMapping: 'city',
    sensitivity: 'low',
    shouldShow: (answers) => answers.session_format === 'In-Person',
    getNextQuestionId: () => 'therapist_gender',
    getNaturalAcknowledgment: (val: string) => `Looking up clinical locations in ${val}.`,
  },

  // ---------------------------------------------------------------------------
  // 11. THERAPIST GENDER PREFERENCE
  // ---------------------------------------------------------------------------
  {
    id: 'therapist_gender',
    stepNumber: 14,
    category: 'preferences',
    prompt: 'Do you have a preference regarding your therapist’s gender?',
    helperText: 'Your preference is respected as an eligibility alignment factor.',
    inputType: 'single_select',
    options: [
      { value: 'Female', label: 'Female therapist' },
      { value: 'Male', label: 'Male therapist' },
      { value: 'Non-binary', label: 'Non-binary / Queer-affirmative practitioner' },
      { value: 'No preference', label: 'No preference' },
    ],
    required: true,
    fieldMapping: 'therapist_gender',
    sensitivity: 'low',
    getNextQuestionId: () => 'languages',
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'No preference') return 'Got it — prioritizing clinical expertise and availability.';
      return `Preference noted for a ${val.toLowerCase()} therapist.`;
    },
  },

  // ---------------------------------------------------------------------------
  // 12. LANGUAGES
  // ---------------------------------------------------------------------------
  {
    id: 'languages',
    stepNumber: 15,
    category: 'preferences',
    prompt: 'Which language(s) are you most comfortable speaking in during sessions?',
    helperText: 'Select all languages you feel comfortable expressing yourself in.',
    inputType: 'multi_select',
    options: [
      { value: 'English', label: 'English' },
      { value: 'Hindi', label: 'Hindi' },
      { value: 'Marathi', label: 'Marathi' },
      { value: 'Kannada', label: 'Kannada' },
      { value: 'Tamil', label: 'Tamil' },
      { value: 'Telugu', label: 'Telugu' },
      { value: 'Bengali', label: 'Bengali' },
      { value: 'Gujarati', label: 'Gujarati' },
      { value: 'Malayalam', label: 'Malayalam' },
    ],
    required: true,
    fieldMapping: 'languages',
    sensitivity: 'low',
    getNextQuestionId: () => 'schedule',
    getNaturalAcknowledgment: (val: string[]) => {
      return `We will filter for clinicians fluent in ${val && val.length ? val.join(', ') : 'your chosen languages'}.`;
    },
  },

  // ---------------------------------------------------------------------------
  // 13. SCHEDULE PREFERENCE
  // ---------------------------------------------------------------------------
  {
    id: 'schedule',
    stepNumber: 16,
    category: 'preferences',
    prompt: 'What days or time windows generally work best for your schedule?',
    inputType: 'multi_select',
    options: [
      { value: 'Weekday mornings', label: 'Weekday mornings (8:00 AM – 12:00 PM)' },
      { value: 'Weekday afternoons', label: 'Weekday afternoons (12:00 PM – 5:00 PM)' },
      { value: 'Weekday evenings', label: 'Weekday evenings (5:00 PM – 9:00 PM)' },
      { value: 'Weekends', label: 'Weekends (Saturday or Sunday)' },
      { value: 'Flexible', label: 'Flexible / Open to clinician’s available calendar' },
    ],
    required: true,
    fieldMapping: 'schedule',
    sensitivity: 'low',
    getNextQuestionId: () => 'budget',
    getNaturalAcknowledgment: () => 'Noted. We will check real-time calendar availability in those slots.',
  },

  // ---------------------------------------------------------------------------
  // 14. BUDGET PER SESSION
  // ---------------------------------------------------------------------------
  {
    id: 'budget',
    stepNumber: 17,
    category: 'preferences',
    prompt: 'What is your comfortable fee range per 50-minute clinical session?',
    helperText: 'Fees are set transparently by licensed practitioners with no surprise charges.',
    inputType: 'single_select',
    options: [
      { value: 'Under ₹1,200', label: 'Under ₹1,200 per session' },
      { value: '₹1,200–₹1,800', label: '₹1,200 – ₹1,800 per session' },
      { value: '₹1,800–₹2,500', label: '₹1,800 – ₹2,500 per session' },
      { value: '₹2,500+', label: '₹2,500+ per session' },
      { value: 'Flexible', label: 'Flexible based on clinician expertise' },
    ],
    required: true,
    fieldMapping: 'budget',
    sensitivity: 'low',
    getNextQuestionId: () => 'modality_preference',
    getNaturalAcknowledgment: () => 'Thank you for indicating your fee range.',
  },

  // ---------------------------------------------------------------------------
  // 15. MODALITY PREFERENCE (Optional)
  // ---------------------------------------------------------------------------
  {
    id: 'modality_preference',
    stepNumber: 18,
    category: 'preferences',
    prompt: 'Do you have a specific therapeutic approach in mind?',
    helperText: 'If you’re unsure, choose "No preference" and our algorithm will suggest what fits best.',
    inputType: 'single_select',
    options: [
      { value: 'CBT', label: 'Cognitive Behavioral Therapy (CBT) — practical thoughts & habit loops' },
      { value: 'Psychodynamic', label: 'Psychodynamic / Relational — exploring unconscious patterns & past roots' },
      { value: 'Mindfulness', label: 'Mindfulness & Somatic Grounding — body-centered & nervous system regulation' },
      { value: 'ACT', label: 'Acceptance & Commitment Therapy (ACT) — values & psychological flexibility' },
      { value: 'Humanistic', label: 'Humanistic / Person-Centered — client-led, compassionate self-discovery' },
      { value: 'No preference', label: 'No preference — clinically recommended fit' },
    ],
    required: false,
    skippable: true,
    skipLabel: 'No preference',
    fieldMapping: 'modality_preference',
    sensitivity: 'low',
    getNextQuestionId: () => 'safety_check',
    getNaturalAcknowledgment: (val: string) => {
      if (val && val !== 'No preference') return `Noted — prioritizing clinicians certified in ${val}.`;
      return 'No problem. We will let your stated goals guide the therapeutic modality.';
    },
  },

  // ---------------------------------------------------------------------------
  // 16. SAFETY SCREENING & SUITABILITY
  // ---------------------------------------------------------------------------
  {
    id: 'safety_check',
    stepNumber: 19,
    category: 'safety',
    prompt: 'Are you currently in immediate physical danger, or experiencing severe urges to harm yourself or others?',
    helperText: 'Ingress Within provides scheduled outpatient therapy. If you are in immediate crisis, professional helplines are available right now.',
    inputType: 'single_select',
    options: [
      { value: 'Safe', label: 'No — I am physically safe and seeking outpatient therapy' },
      { value: 'Distressed', label: 'I feel heavy emotional distress, but have no intent or plan to harm myself' },
      { value: 'Immediate Crisis', label: 'Yes — I am in immediate distress and need urgent support' },
    ],
    required: true,
    fieldMapping: 'safety_check',
    sensitivity: 'safety',
    getNextQuestionId: () => 'contact_consent',
    getNaturalAcknowledgment: (val: string) => {
      if (val === 'Immediate Crisis') {
        return 'If you are in danger or urgent crisis, please reach out to Tele-MANAS (14416) or KIRAN (1800-599-0019) immediately. Ordinary outpatient matching is not an emergency response service.';
      }
      return 'Thank you for confirming your current safety context.';
    },
  },

  // ---------------------------------------------------------------------------
  // 17. CONTACT & EXPLICIT MATCHING CONSENT
  // ---------------------------------------------------------------------------
  {
    id: 'contact_consent',
    stepNumber: 20,
    category: 'consent',
    prompt: 'Confirm your details and authorization to find matching therapists.',
    helperText: 'Your answers will be evaluated deterministically against verified therapists. Your detailed intake is only shared with the therapist you explicitly choose.',
    inputType: 'contact_consent',
    required: true,
    fieldMapping: 'contact_consent',
    sensitivity: 'high',
    getNextQuestionId: () => null, // End of conversation, ready for match
    getNaturalAcknowledgment: () => 'All set. Evaluating verified therapists based on your preferences...',
  },
];

/**
 * Helper to look up a question by ID.
 */
export function getQuestionById(id: string): QuestionConfig | undefined {
  return CONVERSATIONAL_QUESTIONS.find((q) => q.id === id);
}

/**
 * Returns the ordered active questions for a given client state,
 * resolving conditional visibility.
 */
export function getActiveQuestions(answers: Record<string, any>): QuestionConfig[] {
  return CONVERSATIONAL_QUESTIONS.filter((q) => {
    if (typeof q.shouldShow === 'function') {
      return q.shouldShow(answers);
    }
    return true;
  });
}
