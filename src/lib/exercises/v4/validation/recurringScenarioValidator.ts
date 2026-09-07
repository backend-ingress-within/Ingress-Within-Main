import { RecurringScenarioInputData } from '../definitions/recurringScenarioCatalog';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class RecurringScenarioValidator {
  public static validateAnswers(payload: Partial<RecurringScenarioInputData>): ValidationResult {
    const errors: string[] = [];

    if (!payload.prompt_rehearse || typeof payload.prompt_rehearse !== 'string' || payload.prompt_rehearse.trim().length < 3) {
      errors.push("Sentence completion 1 ('The scenario I rehearse most often...') must be at least 3 characters.");
    }

    if (!payload.prompt_replay || typeof payload.prompt_replay !== 'string' || payload.prompt_replay.trim().length < 3) {
      errors.push("Sentence completion 2 ('The scenario I replay most often...') must be at least 3 characters.");
    }

    if (!payload.prompt_inevitable || typeof payload.prompt_inevitable !== 'string' || payload.prompt_inevitable.trim().length < 3) {
      errors.push("Sentence completion 3 ('The outcome I'm most convinced is inevitable...') must be at least 3 characters.");
    }

    if (!payload.prompt_avoid || typeof payload.prompt_avoid !== 'string' || payload.prompt_avoid.trim().length < 3) {
      errors.push("Sentence completion 4 ('The scenario I avoid imagining entirely...') must be at least 3 characters.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
