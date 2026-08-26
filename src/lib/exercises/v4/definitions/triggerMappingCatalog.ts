import { ExerciseDefinition } from '../types/exercise.types';

export const TRIGGER_MAPPING_DEFINITION: ExerciseDefinition = {
  id: 'trigger_mapping',
  exercise_type: 'trigger_mapping',
  title: 'Trigger Mapping',
  description: 'Map 3 to 5 moments when something triggered a bigger reaction than it seemed to call for. Explore your first somatic/cognitive reaction, what you wanted to avoid, and patterns across them.',
  unlock_rules: { day: 152, cycle: 6, strategy: 'day_locked' },
  cycle: 6,
  frequency: 'once_per_cycle',
  estimated_duration: 8,
  version: '1.0',
  active_status: true
};

export const TRIGGER_MAPPING_CONFIG = {
  minMoments: 2, // minimum required with stall bypass
  standardMinMoments: 3, // standard default minimum
  maxMoments: 5,
  minChars: 3,
  maxChars: 500,
  exercise_id: 'trigger_mapping',
  title: 'Trigger Mapping',
  unlock_day: 152
};

export interface TriggerMappingMomentInput {
  moment_text: string;
  q1: string; // First reaction — in body or thinking
  q2: string; // What they most wanted to avoid in that moment
}

export interface TriggerMappingInput {
  moments: TriggerMappingMomentInput[];
  synthesis_answer: string;
  support_pause_used?: boolean;
}

export interface TriggerMappingWorthSittingWith {
  label: string;
  note: string;
}

export interface TriggerMappingAnalysis {
  reflection_text: string | null;
  worth_sitting_with: TriggerMappingWorthSittingWith[];
  analysisStatus: 'complete' | 'partial' | 'unavailable';
}

export interface TriggerMappingResultData {
  exerciseType: 'trigger_mapping';
  moments: TriggerMappingMomentInput[];
  synthesis_answer: string;
  reflection_text: string | null;
  worth_sitting_with: TriggerMappingWorthSittingWith[];
  completedAt: string;
  analysisStatus: 'complete' | 'partial' | 'unavailable';
  support_pause_used?: boolean;
}
