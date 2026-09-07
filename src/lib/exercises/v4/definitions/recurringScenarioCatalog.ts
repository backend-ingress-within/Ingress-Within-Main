import { ExerciseDefinition } from '../types/exercise.types';

export const RECURRING_SCENARIO_DEFINITION: ExerciseDefinition = {
  id: 'recurring_scenario',
  exercise_type: 'recurring_scenario',
  title: 'Recurring Scenario Exercise',
  description: 'Examine anticipatory cognition: scenarios rehearsed before, replayed after, assumed inevitable, or avoided entirely.',
  unlock_rules: { day: 304, cycle: 10, strategy: 'entries_and_day', min_entries: 15 },
  cycle: 10,
  frequency: 'once_per_cycle',
  estimated_duration: 8,
  version: '1.0',
  active_status: true
};

export const RECURRING_SCENARIO_CONFIG = {
  exercise_id: 'recurring_scenario',
  exercise_number: '10',
  title: 'Recurring Scenario Exercise',
  slug: 'recurring-scenario',
  timing: 'Month 10',
  unlock_day: 304,
  min_entries: 15,
  duration: '6–8 min',
  minCharsPerPrompt: 3,
  maxCharsPerPrompt: 600,
  description: 'Examine anticipatory cognition: scenarios rehearsed before, replayed after, assumed inevitable, or avoided entirely.'
};

export interface ScenarioPromptItem {
  id: number;
  key: 'prompt_rehearse' | 'prompt_replay' | 'prompt_inevitable' | 'prompt_avoid';
  label: string;
  stem: string;
  placeholder: string;
  guidance: string;
}

export const RECURRING_SCENARIO_PROMPTS: ScenarioPromptItem[] = [
  {
    id: 1,
    key: 'prompt_rehearse',
    label: 'Rehearsed Before',
    stem: 'The scenario I rehearse most often in my head before it happens is...',
    placeholder: 'Complete this sentence in your own words...',
    guidance: 'Think about moments you run through in advance—what conversation, event, or encounter do you mentally prepare for repeatedly?'
  },
  {
    id: 2,
    key: 'prompt_replay',
    label: 'Replayed After',
    stem: 'The scenario I replay most often after it’s happened is...',
    placeholder: 'Complete this sentence in your own words...',
    guidance: 'Reflect on past moments that stay active in your mind afterwards—what tone, response, or detail do you re-examine?'
  },
  {
    id: 3,
    key: 'prompt_inevitable',
    label: 'Assumed Inevitable',
    stem: 'The outcome I’m most convinced is inevitable in situations involving...',
    placeholder: 'Complete this sentence in your own words...',
    guidance: 'Identify a rule or ending you take for granted in certain interactions or circumstances.'
  },
  {
    id: 4,
    key: 'prompt_avoid',
    label: 'Avoided Imagining',
    stem: 'The scenario I avoid imagining entirely because it feels either too good or too frightening is...',
    placeholder: 'Complete this sentence in your own words...',
    guidance: 'Notice what your mind quietly skips over—a possibility that feels too dangerous to expect or too vulnerable to hope for.'
  }
];

export interface RecurringScenarioInputData {
  prompt_rehearse: string;
  prompt_replay: string;
  prompt_inevitable: string;
  prompt_avoid: string;
}

export interface RecurringScenarioAnalysis {
  strongest_pattern: string;
  entry_appearance: 'repeatedly' | 'sometimes' | 'not_visible';
  expectation_behaviour_connection: string;
  unimagined_scenario_analysis: string;
  one_thing_to_notice: string;
  summary_text: string;
}

export interface RecurringScenarioResultData {
  exerciseType: 'recurring_scenario';
  exerciseId: 'recurring_scenario';
  answers: RecurringScenarioInputData;
  analysis: RecurringScenarioAnalysis;
  completedAt: string;
  analysisStatus: 'complete' | 'partial' | 'unavailable';
}
