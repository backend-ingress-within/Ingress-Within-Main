import { supabase } from '../../../db';
import { aiProvider } from '../../../ai/factory';
import { extractJson } from '../../../ai/utils';
import { ExerciseResultService } from '../services/exerciseResultService';
import { ExerciseRepository } from '../repository/exerciseRepository';
import { CostBenefitPrompt } from '../ai/costBenefitPrompt';
import { CostBenefitValidator } from '../validation/costBenefitValidator';
import {
  CostBenefitPatternInput,
  CostBenefitPatternResult,
  CostBenefitPatternAnalysis,
  CostBenefitResultData
} from '../definitions/costBenefitCatalog';

export class CostBenefitWorker {
  public static async processInstance(instanceId: string, payload?: any): Promise<any> {
    console.log(`[CostBenefitWorker] Processing instance: ${instanceId}`);

    const instance = await ExerciseRepository.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance not found: ${instanceId}`);
    }

    let existingResult = await ExerciseResultService.getResult(instanceId);
    const existingAnalysis: any = existingResult?.analysis || existingResult?.data || {};

    let patternsToProcess: CostBenefitPatternInput[] = [];

    // 1. Check if valid patterns provided in payload
    if (payload?.patterns) {
      const validation = CostBenefitValidator.validatePayload(payload);
      if (!validation.valid) {
        throw new Error(`Cost-Benefit validation failed: ${validation.errors.join('; ')}`);
      }
      patternsToProcess = validation.sanitizedPatterns;
    } else if (Array.isArray(existingAnalysis?.patterns) && existingAnalysis.patterns.length >= 3) {
      // Use previously persisted patterns for retry scenarios
      patternsToProcess = existingAnalysis.patterns.map((p: any) => ({
        pattern: p.pattern,
        answers: p.answers
      }));
    } else {
      // Attempt reading responses from exercise_responses table
      const responses = await ExerciseRepository.getResponsesForInstance(instanceId);
      if (responses && responses.length > 0) {
        const patternsMap = new Map<string, any>();
        responses.forEach(r => {
          const qId = r.question_id || '';
          if (qId.startsWith('pattern_')) {
            const parts = qId.split('_'); // pattern_0_cost
            const pIdx = parts[1];
            const field = parts[2];
            if (!patternsMap.has(pIdx)) {
              patternsMap.set(pIdx, { pattern: (r as any).metadata?.pattern_name || `Pattern ${Number(pIdx) + 1}`, answers: {} });
            }
            if (field) {
              patternsMap.get(pIdx).answers[field] = typeof r.response === 'string' ? r.response : JSON.stringify(r.response);
            }
          }
        });
        const extracted = Array.from(patternsMap.values());
        const validation = CostBenefitValidator.validatePayload({ patterns: extracted });
        if (validation.valid) {
          patternsToProcess = validation.sanitizedPatterns;
        }
      }
    }

    if (patternsToProcess.length < 3) {
      throw new Error(`Cost-Benefit Audit requires at least 3 completed patterns (received ${patternsToProcess.length}).`);
    }

    // 2. PHASE 4: PRE-AI RAW PERSISTENCE (Zero Data Loss Guarantee)
    const initialPatternsResult: CostBenefitPatternResult[] = patternsToProcess.map(p => ({
      pattern: p.pattern,
      answers: p.answers,
      analysis: existingAnalysis?.patterns?.find((ep: any) => ep.pattern === p.pattern)?.analysis || null
    }));

    const initialResultData: CostBenefitResultData = {
      exerciseType: 'cost_benefit_audit',
      patterns: initialPatternsResult,
      completedAt: existingAnalysis?.completedAt || new Date().toISOString(),
      analysisStatus: existingAnalysis?.analysisStatus || 'unavailable',
      overall_reflection: existingAnalysis?.overall_reflection || null
    };

    let storedResult: any = null;
    if (existingResult) {
      const { data: updated } = await supabase
        .from('exercise_results')
        .update({
          summary: existingResult.summary || 'Your Cost-Benefit Audit responses have been recorded.',
          analysis: initialResultData
        })
        .eq('id', existingResult.id)
        .select()
        .single();
      storedResult = updated || existingResult;
    } else {
      storedResult = await ExerciseResultService.storeResult({
        instanceId,
        userId: instance.user_id,
        exerciseId: 'cost_benefit_audit',
        summary: 'Your Cost-Benefit Audit responses have been recorded.',
        analysis: initialResultData,
        model: process.env.AI_MODEL || 'claude-sonnet-5',
        provider: process.env.AI_PROVIDER || 'claude'
      } as any);
    }

    // Always mark instance completed immediately so user status is never blocked
    await supabase
      .from('exercise_instances')
      .update({
        status: 'completed',
        completed_at: instance.completed_at || new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', instanceId);

    // 3. PHASE 5 & 6: PER-PATTERN INDEPENDENT AI ANALYSIS (Failure Isolation)
    const updatedPatterns: CostBenefitPatternResult[] = [];
    let successfulCount = 0;
    let failedCount = 0;

    for (let i = 0; i < patternsToProcess.length; i++) {
      const p = patternsToProcess[i];
      const existingPatternAnalysis = initialPatternsResult[i]?.analysis;

      if (existingPatternAnalysis && existingPatternAnalysis.observation) {
        // Re-use existing valid analysis
        updatedPatterns.push({
          pattern: p.pattern,
          answers: p.answers,
          analysis: existingPatternAnalysis
        });
        successfulCount++;
        continue;
      }

      try {
        console.log(`[CostBenefitWorker] Analyzing pattern ${i + 1}/${patternsToProcess.length}: "${p.pattern}"`);
        const prompt = CostBenefitPrompt.buildSinglePatternPrompt(p.pattern, p.answers);
        const response = await aiProvider.callRaw(prompt);
        const parsed = extractJson<CostBenefitPatternAnalysis>(response);

        if (parsed && typeof parsed.observation === 'string' && parsed.observation.trim().length > 0) {
          updatedPatterns.push({
            pattern: p.pattern,
            answers: p.answers,
            analysis: {
              observation: parsed.observation.trim(),
              protectionMechanism: (parsed.protectionMechanism || '').trim(),
              relationship: (parsed.relationship || '').trim()
            }
          });
          successfulCount++;
        } else {
          throw new Error('AI response missing required observation structure.');
        }
      } catch (patternErr: any) {
        console.warn(`[CostBenefitWorker] AI analysis failed for pattern "${p.pattern}":`, patternErr.message || patternErr);
        // Isolate failure: preserve answers with null analysis
        updatedPatterns.push({
          pattern: p.pattern,
          answers: p.answers,
          analysis: null
        });
        failedCount++;
      }
    }

    // 4. Overall Synthesis (Optional, isolated)
    let overallReflection = initialResultData.overall_reflection || null;
    if (!overallReflection && successfulCount > 0) {
      try {
        const synthPrompt = CostBenefitPrompt.buildOverallSynthesisPrompt(patternsToProcess);
        const synthResponse = await aiProvider.callRaw(synthPrompt);
        const parsedSynth = extractJson<{ overall_reflection?: string }>(synthResponse);
        if (parsedSynth?.overall_reflection) {
          overallReflection = parsedSynth.overall_reflection.trim();
        }
      } catch (synthErr: any) {
        console.warn('[CostBenefitWorker] Overall synthesis skipped:', synthErr.message || synthErr);
      }
    }

    // 5. PHASE 7: DETERMINE FINAL STATUS AND PERSIST
    const finalStatus: 'complete' | 'partial' | 'unavailable' =
      successfulCount === patternsToProcess.length
        ? 'complete'
        : successfulCount > 0
        ? 'partial'
        : 'unavailable';

    const finalResultData: CostBenefitResultData = {
      exerciseType: 'cost_benefit_audit',
      patterns: updatedPatterns,
      completedAt: initialResultData.completedAt,
      analysisStatus: finalStatus,
      overall_reflection: overallReflection
    };

    const finalSummary =
      finalStatus === 'complete'
        ? `Grounded observations generated across all ${updatedPatterns.length} patterns.`
        : finalStatus === 'partial'
        ? `Grounded observations generated for ${successfulCount} of ${updatedPatterns.length} patterns.`
        : 'Your responses have been recorded below.';

    const { data: finalStored, error: finalErr } = await supabase
      .from('exercise_results')
      .update({
        summary: finalSummary,
        analysis: finalResultData,
        model: process.env.AI_MODEL || 'claude-sonnet-5',
        provider: process.env.AI_PROVIDER || 'claude'
      })
      .eq('instance_id', instanceId)
      .select()
      .maybeSingle();

    if (finalErr) {
      console.error('[CostBenefitWorker] Error updating final exercise result:', finalErr.message);
    }

    const outputResult = finalStored || storedResult || {};
    return {
      ...outputResult,
      summary: finalSummary,
      analysis: finalResultData,
      exerciseType: 'cost_benefit_audit'
    };
  }
}
