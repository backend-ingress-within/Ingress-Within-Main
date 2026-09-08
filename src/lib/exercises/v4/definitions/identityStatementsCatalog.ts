import { ExerciseDefinition } from '../types/exercise.types';

export const IDENTITY_STATEMENTS_DEFINITION: ExerciseDefinition = {
  id: 'identity_statements',
  exercise_type: 'identity_statements',
  title: 'Identity Statements',
  description: 'Examine foundational identity statements, internal rules, and evolving self-definitions.',
  unlock_rules: { day: 244, cycle: 8, strategy: 'day_offset' },
  cycle: 8,
  frequency: 'once_per_cycle',
  estimated_duration: 8,
  version: '1.0',
  active_status: true
};

export const IDENTITY_STATEMENTS_CONFIG = {
  exercise_id: 'identity_statements',
  title: 'Identity Statements',
  slug: 'identity-statements',
  timing: 'Month 8',
  unlock_day: 244,
  duration: '6–8 min',
  description: 'Examine foundational identity statements, internal rules, and evolving self-definitions.'
};
