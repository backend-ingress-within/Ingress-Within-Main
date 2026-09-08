import { ExerciseDefinition } from '../types/exercise.types';

export const YEAR_END_PORTRAIT_DEFINITION: ExerciseDefinition = {
  id: 'year_end_portrait',
  exercise_type: 'year_end_portrait',
  title: 'Year-End Self-Portrait',
  description: 'Synthesize 12 months of self-reflection, recurring patterns, and internal shifts into a comprehensive annual portrait.',
  unlock_rules: { day: 365, cycle: 12, strategy: 'day_offset' },
  cycle: 12,
  frequency: 'once_per_cycle',
  estimated_duration: 10,
  version: '1.0',
  active_status: true
};

export const YEAR_END_PORTRAIT_CONFIG = {
  exercise_id: 'year_end_portrait',
  title: 'Year-End Self-Portrait',
  slug: 'year-end-portrait',
  timing: 'Month 12',
  unlock_day: 365,
  duration: '8–10 min',
  description: 'Synthesize 12 months of self-reflection, recurring patterns, and internal shifts into a comprehensive annual portrait.'
};
