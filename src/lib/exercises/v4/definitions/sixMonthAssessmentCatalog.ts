import { ExerciseDefinition } from '../types/exercise.types';

export const SIX_MONTH_ASSESSMENT_DEFINITION: ExerciseDefinition = {
  id: 'six_month_assessment',
  exercise_type: 'six_month_assessment',
  title: '6-Month Self-Assessment',
  description: 'Change tracking at the self-perception and identity level across 6 months of practice.',
  unlock_rules: { day: 183, cycle: 6, strategy: 'entries_and_day', min_entries: 20 },
  cycle: 6,
  frequency: 'once_per_cycle',
  estimated_duration: 16,
  version: '1.0',
  active_status: true
};

export const SIX_MONTH_ASSESSMENT_CONFIG = {
  exercise_id: 'six_month_assessment',
  title: '6-Month Self-Assessment',
  description: 'Change tracking at the self-perception and identity level across 6 months of practice.',
  unlock_day: 183,
  min_entries: 20,
  timing: 'Month 6',
  type: 'Anchor',
  branch: 'All',
  duration: '14–18 min'
};

export interface SixMonthQuestionItem {
  id: number;
  text: string;
  short: string;
  isBranchSpecific?: boolean;
  branchCode?: 'A' | 'B' | 'C' | 'D';
}

// Core Questions Q1-Q5 matching Exercise 3 (Day 24 Self-Perception vs Reality Check)
export const EXERCISE_9_BASE_QUESTIONS: SixMonthQuestionItem[] = [
  {
    id: 1,
    text: "In the last three weeks, when something felt hard, what did you do first — reach out, withdraw, distract yourself, or something else?",
    short: "How did you respond when things felt hard?"
  },
  {
    id: 2,
    text: "Think about a conflict or tension you had recently. How did you handle it — and how do you feel about how you handled it?",
    short: "How did you handle a recent conflict?"
  },
  {
    id: 3,
    text: "What is something you keep meaning to do or say that you haven't yet?",
    short: "What have you kept meaning to do or say?"
  },
  {
    id: 4,
    text: "In the last three weeks, whose needs did you prioritise more — yours or someone else's?",
    short: "Whose needs did you prioritise?"
  },
  {
    id: 5,
    text: "What's one thing about yourself you'd change if you could, and what's stopping you?",
    short: "What would you change and what stops you?"
  }
];

// Branch-specific Q6 options matching founder specifications
export const EXERCISE_9_BRANCH_Q6: Record<'A' | 'B' | 'C' | 'D', { text: string; short: string }> = {
  A: {
    text: "Which pattern identified in your Day 30 report feels most unchanged, and what would have to be different for it to shift?",
    short: "Unchanged pattern & required shift"
  },
  B: {
    text: "What is one thing you have chosen in the past 6 months — even if it felt like you had no choice at the time? What made that choice possible?",
    short: "Choice made in past 6 months"
  },
  C: {
    text: "What emotion, if you let yourself feel it fully right now, would be most inconvenient?",
    short: "Most inconvenient emotion"
  },
  D: {
    text: "What would you lose if you felt things less intensely?",
    short: "Feeling things less intensely"
  }
};

// Universal Q7 shown to all users
export const EXERCISE_9_UNIVERSAL_Q7: SixMonthQuestionItem = {
  id: 7,
  text: "What do you think you're still not seeing clearly?",
  short: "What you're still not seeing clearly"
};

/**
 * Resolves the 7 questions for Exercise 9 dynamically for a given user branch ('A' | 'B' | 'C' | 'D').
 */
export function getExercise9Questions(branch: string = 'A'): SixMonthQuestionItem[] {
  const normBranch = (branch || 'A').toUpperCase().trim() as 'A' | 'B' | 'C' | 'D';
  const q6Spec = EXERCISE_9_BRANCH_Q6[normBranch] || EXERCISE_9_BRANCH_Q6['A'];

  return [
    ...EXERCISE_9_BASE_QUESTIONS,
    {
      id: 6,
      text: q6Spec.text,
      short: q6Spec.short,
      isBranchSpecific: true,
      branchCode: normBranch
    },
    EXERCISE_9_UNIVERSAL_Q7
  ];
}
