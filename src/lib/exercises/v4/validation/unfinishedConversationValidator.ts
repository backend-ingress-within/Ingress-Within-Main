export interface UnfinishedConversationAnswerPayload {
  person_name: string;
  relationship_type: string;
  unfinished_duration?: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export class UnfinishedConversationValidator {
  public static validateAnswers(payload: Partial<UnfinishedConversationAnswerPayload>): ValidationResult {
    const errors: string[] = [];

    if (!payload.q1 || typeof payload.q1 !== 'string' || payload.q1.trim().length < 3) {
      errors.push("Question 1 context (person & duration) is required.");
    }

    if (!payload.q2 || typeof payload.q2 !== 'string' || payload.q2.trim().length < 3) {
      errors.push("Question 2 direct statement is required.");
    }

    if (!payload.q3 || typeof payload.q3 !== 'string' || payload.q3.trim().length < 3) {
      errors.push("Question 3 (what silence protects) is required.");
    }

    if (!payload.q4 || typeof payload.q4 !== 'string' || payload.q4.trim().length < 3) {
      errors.push("Question 4 (cost of remaining unsaid) is required.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}
