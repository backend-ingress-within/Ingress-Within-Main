export interface SixMonthAssessmentAnswerPayload {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  branch_code?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class SixMonthAssessmentValidator {
  public static validateAnswers(payload: Partial<SixMonthAssessmentAnswerPayload>): ValidationResult {
    const errors: string[] = [];

    const keys: (keyof SixMonthAssessmentAnswerPayload)[] = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const qNum = i + 1;
      const val = payload[key];

      if (!val || typeof val !== 'string' || val.trim().length === 0) {
        errors.push(`Question ${qNum} is required.`);
      } else if (val.trim().length < 20) {
        errors.push(`Question ${qNum} requires at least 20 characters of reflection.`);
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
