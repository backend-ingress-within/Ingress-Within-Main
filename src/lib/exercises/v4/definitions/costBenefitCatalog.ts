import { ExerciseDefinition } from '../types/exercise.types';

export const COST_BENEFIT_AUDIT_DEFINITION: ExerciseDefinition = {
  id: 'cost_benefit_audit',
  exercise_type: 'cost_benefit_audit',
  title: 'Cost-Benefit Audit',
  description: 'Examine 3 to 5 persistent behavioral or emotional patterns by exploring their hidden protective functions, origins, real costs, and ongoing validity.',
  unlock_rules: { day: 1, cycle: 1, strategy: 'immediate' },
  cycle: 1,
  frequency: 'once_per_cycle',
  estimated_duration: 8,
  version: '1.0',
  active_status: true
};

export const COST_BENEFIT_CONFIG = {
  minPatterns: 3,
  maxPatterns: 5,
  mandatoryCount: 3,
  optionalCount: 2,
  exercise_id: 'cost_benefit_audit',
  title: 'Cost-Benefit Audit'
};

export interface CostBenefitQuestionMeta {
  id: 'cost' | 'protection' | 'origin' | 'stillMakesSense';
  number: number;
  label: string;
  prompt: string;
  guidance?: string;
}

export const COST_BENEFIT_QUESTIONS: CostBenefitQuestionMeta[] = [
  {
    id: 'cost',
    number: 1,
    label: 'The Real Cost',
    prompt: 'What does holding onto this pattern cost you in your daily life, relationships, or energy?',
    guidance: 'Name specific, concrete costs rather than general frustrations.'
  },
  {
    id: 'protection',
    number: 2,
    label: 'The Protective Function',
    prompt: 'What does this pattern protect you from or keep you safe against?',
    guidance: 'Every persistent pattern originally developed to protect something important.'
  },
  {
    id: 'origin',
    number: 3,
    label: 'The Origin Context',
    prompt: 'When or where did this pattern first start making sense for you?',
    guidance: 'Recall the context or period in life where this response was adaptive or necessary.'
  },
  {
    id: 'stillMakesSense',
    number: 4,
    label: 'Ongoing Validity',
    prompt: 'Does this pattern still serve that same purpose today, or has the situation changed?',
    guidance: 'Assess whether the current environment still warrants the same protective response.'
  }
];

export interface CostBenefitPatternAnswers {
  cost: string;
  protection: string;
  origin: string;
  stillMakesSense: string;
}

export interface CostBenefitPatternInput {
  pattern: string;
  answers: CostBenefitPatternAnswers;
}

export interface CostBenefitPatternAnalysis {
  observation: string;
  protectionMechanism: string;
  relationship: string;
}

export interface CostBenefitPatternResult {
  pattern: string;
  answers: CostBenefitPatternAnswers;
  analysis: CostBenefitPatternAnalysis | null;
}

export interface CostBenefitResultData {
  exerciseType: 'cost_benefit_audit';
  patterns: CostBenefitPatternResult[];
  completedAt: string;
  analysisStatus: 'complete' | 'partial' | 'unavailable';
  overall_reflection?: string | null;
}
