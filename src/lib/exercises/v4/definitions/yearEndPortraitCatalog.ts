import { ExerciseDefinition } from '../types/exercise.types';

export type AnchorJudgment = 'still_true' | 'changed' | 'complicated';

export interface AnchorItem {
  id: string;
  categoryNumber: number;
  title: string;
  subtitle: string;
  prompt: string;
  factPrompt: string;
  judgmentPrompt: string;
  notePlaceholder: string;
}

export interface YearEndAnchorResponse {
  anchor_id: string;
  judgment: AnchorJudgment;
  note?: string;
}

export interface YearEndSynthesisAnswers {
  q1: string; // Who were you emotionally at the start of this year — in one honest sentence?
  q2: string; // What is the single most important thing you've understood about yourself in the past 12 months?
  q3: string; // What pattern has been most resistant to change, despite your awareness of it?
  q4: string; // What are you ready to examine that you weren't ready for at the start of the year?
  q5: string; // What would you tell someone standing where you were a year ago?
}

export interface YearEndPortraitAnalysis {
  exercise_type: 'year_end_portrait';
  exercise_id: 'year_end_portrait';
  anchors: Record<string, YearEndAnchorResponse>;
  closer_reflection: string;
  synthesis_answers: YearEndSynthesisAnswers;
  anchors_summary: {
    still_true_count: number;
    changed_count: number;
    complicated_count: number;
  };
  part1_ground: string; // Part 1: The Ground You Stood On
  part2_shift: string;  // Part 2: The Shape of the Shift
  part3_motion: string; // Part 3: What Remains in Motion
  closing_question: string;
  summary: string;
  completed_at: string;
}

export const YEAR_END_PORTRAIT_DEFINITION: ExerciseDefinition = {
  id: 'year_end_portrait',
  exercise_type: 'year_end_portrait',
  title: 'Year-End Self-Portrait',
  description: 'Synthesize 12 months of self-reflection, recurring patterns, and internal shifts into a comprehensive annual portrait.',
  unlock_rules: { day: 365, cycle: 12, strategy: 'day_offset' },
  cycle: 12,
  frequency: 'once_per_cycle',
  estimated_duration: 12,
  version: '1.0',
  active_status: true
};

export const YEAR_END_PORTRAIT_CONFIG = {
  exercise_id: 'year_end_portrait',
  title: 'Year-End Self-Portrait',
  slug: 'year-end-portrait',
  timing: 'Month 12',
  unlock_day: 365,
  duration: '10–15 min',
  description: 'Synthesize 12 months of self-reflection, recurring patterns, and internal shifts into a comprehensive annual portrait.'
};

export const ANCHOR_JUDGMENT_OPTIONS: { value: AnchorJudgment; label: string; description: string }[] = [
  {
    value: 'still_true',
    label: 'Still true',
    description: 'This dynamic or perception remains largely intact and accurate for you today.'
  },
  {
    value: 'changed',
    label: "Something's changed",
    description: 'A meaningful shift has occurred in how you relate to, feel, or handle this.'
  },
  {
    value: 'complicated',
    label: "It's complicated",
    description: 'Not entirely resolved, evolved in some contexts but persistent in others.'
  }
];

export const YEAR_END_ANCHORS: AnchorItem[] = [
  {
    id: 'anchor_1',
    categoryNumber: 1,
    title: 'How you saw yourself',
    subtitle: 'Self-Perception & Identity Anchor',
    prompt: 'Look back at how you defined yourself at the start of this year.',
    factPrompt: 'How did you describe who you were, what you were capable of, and your internal rules?',
    judgmentPrompt: 'Looking at that self-description now, where does it stand today?',
    notePlaceholder: 'Describe what has held steady or what has quietly shifted about how you view yourself...'
  },
  {
    id: 'anchor_2',
    categoryNumber: 2,
    title: 'What mattered most',
    subtitle: 'Values & Priorities Anchor',
    prompt: 'Recall the core values, principles, or priorities you placed at the center of your life.',
    factPrompt: 'What were you optimizing for? What felt non-negotiable back then?',
    judgmentPrompt: 'Is this value hierarchy still active, or has your real compass evolved?',
    notePlaceholder: 'Note what still drives you versus what has lost its urgent grip...'
  },
  {
    id: 'anchor_3',
    categoryNumber: 3,
    title: 'Who drained your energy',
    subtitle: 'Relational Boundary Anchor',
    prompt: 'Reflect on the relational dynamics or encounters that consistently depleted you.',
    factPrompt: 'Where did you feel chronic friction, obligation, or unreciprocated effort?',
    judgmentPrompt: 'How has your boundary or emotional exposure in these relationships shifted?',
    notePlaceholder: 'Describe whether this drain continues or if boundaries have developed...'
  },
  {
    id: 'anchor_4',
    categoryNumber: 4,
    title: 'Who gave you energy',
    subtitle: 'Relational Vitality Anchor',
    prompt: 'Consider the people, connections, or spaces where you felt genuinely grounded and restored.',
    factPrompt: 'Who or what brought ease, honest dialogue, and genuine replenishment?',
    judgmentPrompt: 'Have these sources of energy remained your foundation or expanded?',
    notePlaceholder: 'Reflect on what sustains your vitality now...'
  },
  {
    id: 'anchor_5',
    categoryNumber: 5,
    title: 'Your most consistent signal',
    subtitle: 'Somatic & Body Signal Anchor',
    prompt: 'Recall the physical or physiological signals your body used to register stress or misalignment.',
    factPrompt: 'Where did tension, fatigue, constriction, or rapid reactivity first show up in your body?',
    judgmentPrompt: 'Do you still experience or respond to this somatic signal in the same way?',
    notePlaceholder: 'Describe your current relationship with this somatic signal...'
  },
  {
    id: 'anchor_6',
    categoryNumber: 6,
    title: 'What you were avoiding',
    subtitle: 'Avoidance & Defense Anchor',
    prompt: 'Think back to the difficult conversations, truths, or decisions you kept at arm’s length.',
    factPrompt: 'What were you keeping quiet about, postponing, or shielding yourself from facing?',
    judgmentPrompt: 'Are you still avoiding this, or has direct confrontation begun?',
    notePlaceholder: 'Reflect on whether this avoidance is still active or beginning to dismantle...'
  },
  {
    id: 'anchor_7',
    categoryNumber: 7,
    title: 'What a pattern was costing you',
    subtitle: 'Cost-Benefit & Impact Anchor',
    prompt: 'Revisit the hidden price you were paying for your default coping mechanisms or behavioral habits.',
    factPrompt: 'What was that recurring pattern taking from your peace, relationships, or clarity?',
    judgmentPrompt: 'Is the cost still being paid, or have you restructured the dynamic?',
    notePlaceholder: 'Describe what you now recognize about the actual cost of this pattern...'
  },
  {
    id: 'anchor_8',
    categoryNumber: 8,
    title: 'Where a pattern showed up',
    subtitle: 'Recurring Scenario Anchor',
    prompt: 'Identify the specific environments, roles, or situations that repeatedly triggered your default reaction.',
    factPrompt: 'In which exact contexts (work, family, conflict, uncertainty) did the pattern reliably trigger?',
    judgmentPrompt: 'When that context arrives now, does the same automatic reaction occur?',
    notePlaceholder: 'Note what happens when you find yourself in that context today...'
  }
];

export const UNIVERSAL_CLOSER_QUESTION = {
  id: 'universal_closer',
  title: 'Universal Closer Reflection',
  prompt: "Looking back, what do you think you're still not seeing clearly about yourself?",
  subtext: 'Consider the subtle blind spots, questions you avoid asking, or areas where your reflection is still incomplete.',
  placeholder: "Write your honest reflection on what remains obscured or half-seen..."
};

export const SYNTHESIS_QUESTIONS: { id: keyof YearEndSynthesisAnswers; questionNumber: number; prompt: string; placeholder: string; minChars: number }[] = [
  {
    id: 'q1',
    questionNumber: 1,
    prompt: 'Who were you emotionally at the start of this year — in one honest sentence?',
    placeholder: 'In one sentence, describe your emotional state and baseline at the year’s start...',
    minChars: 15
  },
  {
    id: 'q2',
    questionNumber: 2,
    prompt: "What is the single most important thing you've understood about yourself in the past 12 months?",
    placeholder: 'Describe the key realization or shift in understanding that anchored this year...',
    minChars: 20
  },
  {
    id: 'q3',
    questionNumber: 3,
    prompt: 'What pattern has been most resistant to change, despite your awareness of it?',
    placeholder: 'Identify the habit, defense, or reaction that still asserts itself even when noticed...',
    minChars: 20
  },
  {
    id: 'q4',
    questionNumber: 4,
    prompt: "What are you ready to examine that you weren't ready for at the start of the year?",
    placeholder: 'Name the theme, relationship, or internal truth you now have the capacity to face...',
    minChars: 20
  },
  {
    id: 'q5',
    questionNumber: 5,
    prompt: 'What would you tell someone standing where you were a year ago?',
    placeholder: 'Write the grounded, realistic insight you would pass back to your past self...',
    minChars: 20
  }
];
