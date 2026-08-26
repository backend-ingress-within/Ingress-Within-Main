import {
  TriggerMappingInput,
  TriggerMappingMomentInput,
  TRIGGER_MAPPING_CONFIG
} from '../definitions/triggerMappingCatalog';

export interface TriggerMappingValidationResult {
  valid: boolean;
  errors: string[];
  sanitizedData?: TriggerMappingInput;
}

export class TriggerMappingValidator {
  public static validatePayload(payload: any): TriggerMappingValidationResult {
    const errors: string[] = [];

    if (!payload || typeof payload !== 'object') {
      return {
        valid: false,
        errors: ['Invalid request payload: payload must be a non-empty object.']
      };
    }

    const rawMoments = payload.moments;

    if (!Array.isArray(rawMoments)) {
      return {
        valid: false,
        errors: ['Invalid payload: "moments" must be an array of moment objects.']
      };
    }

    if (rawMoments.length < TRIGGER_MAPPING_CONFIG.minMoments) {
      errors.push(
        `At least ${TRIGGER_MAPPING_CONFIG.minMoments} moments are required (received ${rawMoments.length}).`
      );
    }

    if (rawMoments.length > TRIGGER_MAPPING_CONFIG.maxMoments) {
      errors.push(
        `Maximum ${TRIGGER_MAPPING_CONFIG.maxMoments} moments allowed (received ${rawMoments.length}).`
      );
    }

    const sanitizedMoments: TriggerMappingMomentInput[] = [];

    rawMoments.forEach((m: any, index: number) => {
      const momentNum = index + 1;

      if (!m || typeof m !== 'object') {
        errors.push(`Moment #${momentNum} is malformed: must be an object.`);
        return;
      }

      const momentText = typeof m.moment_text === 'string' ? m.moment_text.trim() : '';
      const q1 = typeof m.q1 === 'string' ? m.q1.trim() : '';
      const q2 = typeof m.q2 === 'string' ? m.q2.trim() : '';

      if (!momentText || momentText.length < TRIGGER_MAPPING_CONFIG.minChars) {
        errors.push(
          `Moment #${momentNum}: moment description must be at least ${TRIGGER_MAPPING_CONFIG.minChars} characters.`
        );
      } else if (momentText.length > TRIGGER_MAPPING_CONFIG.maxChars) {
        errors.push(
          `Moment #${momentNum}: moment description cannot exceed ${TRIGGER_MAPPING_CONFIG.maxChars} characters.`
        );
      }

      if (!q1 || q1.length < TRIGGER_MAPPING_CONFIG.minChars) {
        errors.push(
          `Moment #${momentNum}: first reaction (Q1) must be at least ${TRIGGER_MAPPING_CONFIG.minChars} characters.`
        );
      } else if (q1.length > TRIGGER_MAPPING_CONFIG.maxChars) {
        errors.push(
          `Moment #${momentNum}: first reaction (Q1) cannot exceed ${TRIGGER_MAPPING_CONFIG.maxChars} characters.`
        );
      }

      if (!q2 || q2.length < TRIGGER_MAPPING_CONFIG.minChars) {
        errors.push(
          `Moment #${momentNum}: what you wanted to avoid (Q2) must be at least ${TRIGGER_MAPPING_CONFIG.minChars} characters.`
        );
      } else if (q2.length > TRIGGER_MAPPING_CONFIG.maxChars) {
        errors.push(
          `Moment #${momentNum}: what you wanted to avoid (Q2) cannot exceed ${TRIGGER_MAPPING_CONFIG.maxChars} characters.`
        );
      }

      sanitizedMoments.push({
        moment_text: momentText,
        q1,
        q2
      });
    });

    // Validate synthesis answer
    const rawSynthesis = typeof payload.synthesis_answer === 'string' ? payload.synthesis_answer.trim() : '';
    if (!rawSynthesis || rawSynthesis.length < TRIGGER_MAPPING_CONFIG.minChars) {
      errors.push(
        `Synthesis answer must be at least ${TRIGGER_MAPPING_CONFIG.minChars} characters.`
      );
    } else if (rawSynthesis.length > TRIGGER_MAPPING_CONFIG.maxChars) {
      errors.push(
        `Synthesis answer cannot exceed ${TRIGGER_MAPPING_CONFIG.maxChars} characters.`
      );
    }

    const supportPauseUsed = Boolean(payload.support_pause_used);

    if (errors.length > 0) {
      return {
        valid: false,
        errors
      };
    }

    return {
      valid: true,
      errors: [],
      sanitizedData: {
        moments: sanitizedMoments,
        synthesis_answer: rawSynthesis,
        support_pause_used: supportPauseUsed
      }
    };
  }
}
