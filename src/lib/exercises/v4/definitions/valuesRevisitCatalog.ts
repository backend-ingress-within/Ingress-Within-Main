import { ExerciseDefinition } from '../types/exercise.types';

export const VALUES_REVISIT_DEFINITION: ExerciseDefinition = {
  id: 'values_revisit',
  exercise_type: 'values_revisit',
  title: 'Values Revisit',
  description: 'Revisit your core values card sort results after 11 months of practice to measure developmental shifts.',
  unlock_rules: { day: 335, cycle: 11, strategy: 'day_offset' },
  cycle: 11,
  frequency: 'once_per_cycle',
  estimated_duration: 6,
  version: '1.0',
  active_status: true
};

export const VALUES_REVISIT_CONFIG = {
  exercise_id: 'values_revisit',
  title: 'Values Revisit',
  slug: 'values-revisit',
  timing: 'Month 11',
  unlock_day: 335,
  duration: '5–7 min',
  description: 'Revisit your core values card sort results after 11 months of practice to measure developmental shifts.'
};
