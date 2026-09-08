import { ExerciseDefinition } from '../types/exercise.types';

export const NARRATIVE_ARC_DEFINITION: ExerciseDefinition = {
  id: 'narrative_arc',
  exercise_type: 'narrative_arc',
  title: 'Narrative Arc Exercise',
  description: 'Identify stable structures beneath emotional variability across the past 3 months.',
  unlock_rules: { day: 274, cycle: 9, strategy: 'day_offset' },
  cycle: 9,
  frequency: 'once_per_cycle',
  estimated_duration: 8,
  version: '1.0',
  active_status: true
};

export const NARRATIVE_ARC_CONFIG = {
  exercise_id: 'narrative_arc',
  title: 'Narrative Arc Exercise',
  slug: 'narrative-arc',
  timing: 'Month 9',
  unlock_day: 274,
  duration: '6–8 min',
  description: 'Identify stable structures beneath emotional variability across the past 3 months.'
};
