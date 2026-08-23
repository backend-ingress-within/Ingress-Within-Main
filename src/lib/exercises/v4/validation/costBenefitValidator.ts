import { CostBenefitPatternInput, COST_BENEFIT_CONFIG } from '../definitions/costBenefitCatalog';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedPatterns: CostBenefitPatternInput[];
}

export class CostBenefitValidator {
  public static validatePayload(payload: any): ValidationResult {
    const errors: string[] = [];

    if (!payload || typeof payload !== 'object') {
      return {
        valid: false,
        errors: ['Invalid request payload: payload must be a non-empty object.'],
        sanitizedPatterns: []
      };
    }

    const rawPatterns = payload.patterns;

    if (!Array.isArray(rawPatterns)) {
      return {
        valid: false,
        errors: ['Invalid payload: "patterns" must be an array of pattern objects.'],
        sanitizedPatterns: []
      };
    }

    if (rawPatterns.length < COST_BENEFIT_CONFIG.minPatterns) {
      errors.push(
        `At least ${COST_BENEFIT_CONFIG.minPatterns} patterns are required (received ${rawPatterns.length}). The first 3 patterns are mandatory.`
      );
    }

    if (rawPatterns.length > COST_BENEFIT_CONFIG.maxPatterns) {
      errors.push(
        `Maximum ${COST_BENEFIT_CONFIG.maxPatterns} patterns allowed (received ${rawPatterns.length}).`
      );
    }

    const sanitizedPatterns: CostBenefitPatternInput[] = [];

    rawPatterns.forEach((p: any, index: number) => {
      const patternNum = index + 1;

      if (!p || typeof p !== 'object') {
        errors.push(`Pattern #${patternNum} is malformed: must be an object.`);
        return;
      }

      const rawName = typeof p.pattern === 'string' ? p.pattern.trim() : '';
      if (!rawName || rawName.length < 2) {
        errors.push(`Pattern #${patternNum}: pattern name cannot be empty (minimum 2 characters).`);
      }

      const rawAnswers = p.answers;
      if (!rawAnswers || typeof rawAnswers !== 'object' || Array.isArray(rawAnswers)) {
        errors.push(`Pattern #${patternNum} ("${rawName || 'Unnamed'}"): missing "answers" object.`);
        return;
      }

      const cost = typeof rawAnswers.cost === 'string' ? rawAnswers.cost.trim() : '';
      const protection = typeof rawAnswers.protection === 'string' ? rawAnswers.protection.trim() : '';
      const origin = typeof rawAnswers.origin === 'string' ? rawAnswers.origin.trim() : '';
      const stillMakesSense = typeof rawAnswers.stillMakesSense === 'string' ? rawAnswers.stillMakesSense.trim() : '';

      if (!cost || cost.length < 2) {
        errors.push(`Pattern #${patternNum} ("${rawName || 'Unnamed'}"): "cost" answer cannot be empty.`);
      }

      if (!protection || protection.length < 2) {
        errors.push(`Pattern #${patternNum} ("${rawName || 'Unnamed'}"): "protection" answer cannot be empty.`);
      }

      if (!origin || origin.length < 2) {
        errors.push(`Pattern #${patternNum} ("${rawName || 'Unnamed'}"): "origin" answer cannot be empty.`);
      }

      if (!stillMakesSense || stillMakesSense.length < 2) {
        errors.push(`Pattern #${patternNum} ("${rawName || 'Unnamed'}"): "stillMakesSense" answer cannot be empty.`);
      }

      sanitizedPatterns.push({
        pattern: rawName,
        answers: {
          cost,
          protection,
          origin,
          stillMakesSense
        }
      });
    });

    return {
      valid: errors.length === 0,
      errors,
      sanitizedPatterns
    };
  }
}
