import { supabase } from '../../../db';
import { aiProvider } from '../../../ai/factory';
import { ExerciseResultService } from '../services/exerciseResultService';
import { ExerciseRepository } from '../repository/exerciseRepository';
import { TriggerMappingPrompt } from '../ai/triggerMappingPrompt';
import {
  TriggerMappingMomentInput,
  TriggerMappingResultData,
  TriggerMappingWorthSittingWith
} from '../definitions/triggerMappingCatalog';

function extractTriggerMappingJson(raw: string): any {
  // 1. Try markdown fenced code block
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch (_) {}
  }

  // 2. Look specifically for {"worth_sitting_with"
  const startIdx = raw.search(/\{[\s\r\n]*"worth_sitting_with"/i);
  if (startIdx !== -1) {
    const endIdx = raw.lastIndexOf('}');
    if (endIdx > startIdx) {
      try {
        return JSON.parse(raw.substring(startIdx, endIdx + 1).trim());
      } catch (_) {}
    }
  }

  // 3. Fallback find outer first { and last }
  const firstBrace = raw.indexOf('{');
  const lastBrace = raw.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(raw.substring(firstBrace, lastBrace + 1).trim());
    } catch (_) {}
  }

  return null;
}

export class TriggerMappingWorker {
  public static async processInstance(instanceId: string, payload?: any): Promise<any> {
    console.log(`[TriggerMappingWorker] Processing instance: ${instanceId}`);

    const instance = await ExerciseRepository.getInstance(instanceId);
    if (!instance) {
      throw new Error(`Instance not found: ${instanceId}`);
    }

    let existingResult = await ExerciseResultService.getResult(instanceId);
    const existingAnalysis = existingResult?.analysis || existingResult?.data || {};

    // 1. Resolve moments & synthesis input
    let moments: TriggerMappingMomentInput[] = [];
    if (Array.isArray(payload?.moments) && payload.moments.length > 0) {
      moments = payload.moments.map((m: any) => ({
        moment_text: typeof m.moment_text === 'string' ? m.moment_text.trim() : '',
        q1: typeof m.q1 === 'string' ? m.q1.trim() : (m.answers?.first_reaction || ''),
        q2: typeof m.q2 === 'string' ? m.q2.trim() : (m.answers?.avoidance_goal || '')
      }));
    } else if (Array.isArray(existingAnalysis?.moments) && existingAnalysis.moments.length > 0) {
      moments = existingAnalysis.moments;
    } else if (Array.isArray(payload?.entry_answers)) {
      moments = payload.entry_answers.map((ea: any, i: number) => ({
        moment_text: ea.excerpt || `Moment #${i + 1}`,
        q1: ea.first_reaction || '',
        q2: ea.avoidance_goal || ''
      }));
    }

    const synthesisAnswer =
      typeof payload?.synthesis_answer === 'string'
        ? payload.synthesis_answer.trim()
        : typeof existingAnalysis?.synthesis_answer === 'string'
        ? existingAnalysis.synthesis_answer.trim()
        : '';

    const supportPauseUsed = Boolean(payload?.support_pause_used || existingAnalysis?.support_pause_used);

    // 2. Immediate Primary Persistence: Ensure user responses are saved BEFORE AI invocation
    const nowIso = new Date().toISOString();
    const initialResultData: TriggerMappingResultData = {
      exerciseType: 'trigger_mapping',
      moments,
      synthesis_answer: synthesisAnswer,
      reflection_text: existingAnalysis?.reflection_text || null,
      worth_sitting_with: existingAnalysis?.worth_sitting_with || [],
      completedAt: nowIso,
      analysisStatus: existingAnalysis?.reflection_text ? 'complete' : 'partial',
      support_pause_used: supportPauseUsed
    };

    let storedResult: any = null;
    if (existingResult) {
      const { data: updated } = await supabase
        .from('exercise_results')
        .update({
          summary: existingResult.summary || 'Your responses have been recorded below.',
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
        exerciseId: 'trigger_mapping',
        summary: 'Your responses have been recorded below.',
        analysis: initialResultData,
        model: process.env.AI_MODEL || 'claude-sonnet-5',
        provider: process.env.AI_PROVIDER || 'claude'
      } as any);
    }

    // Update instance status to completed
    await supabase
      .from('exercise_instances')
      .update({
        status: 'completed',
        completed_at: nowIso,
        submitted_at: instance.submitted_at || nowIso,
        updated_at: nowIso
      })
      .eq('id', instanceId);

    // 3. AI Execution with partial failure resilience
    if (moments.length >= 2 && synthesisAnswer.length >= 3) {
      try {
        console.log(`[TriggerMappingWorker] Generating AI reflection for ${moments.length} moments...`);
        const prompt = TriggerMappingPrompt.buildPrompt(moments, synthesisAnswer);

        const aiResponseRaw = await Promise.race([
          aiProvider.callRaw(prompt),
          new Promise<string>((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timed out after 45 seconds.')), 45000)
          )
        ]);

        const raw = (aiResponseRaw || '').trim();
        console.log(`[TriggerMappingWorker] Raw AI output length: ${raw.length}`);

        // Extract PART 1: ANALYSIS text
        let analysisText = '';
        const aMatch =
          raw.match(/PART 1[^\n]*\n*ANALYSIS:\s*([\s\S]*?)(?=(?:PART 2|WORTH SITTING WITH|```|\{))/i) ||
          raw.match(/ANALYSIS:\s*([\s\S]*?)(?=(?:PART 2|WORTH SITTING WITH|```|\{))/i);

        if (aMatch && aMatch[1].trim().length > 0) {
          analysisText = aMatch[1].trim();
        } else {
          const firstBrace = raw.indexOf('{');
          const textBeforeJson = firstBrace !== -1 ? raw.substring(0, firstBrace) : raw;
          analysisText = textBeforeJson
            .replace(/^[\s\S]*?ANALYSIS:\s*/i, '')
            .replace(/PART 1[^\n]*/gi, '')
            .replace(/PART 2[^\n]*/gi, '')
            .replace(/WORTH SITTING WITH[^\n]*/gi, '')
            .trim();
        }

        analysisText = analysisText.split('**').join('').split('*').join('').trim();
        if (!analysisText || analysisText.length < 5) {
          analysisText = 'Your responses have been recorded below.';
        }

        // Extract PART 2: WORTH SITTING WITH (JSON)
        let worthSittingWith: TriggerMappingWorthSittingWith[] = [];
        const parsedJson = extractTriggerMappingJson(raw);
        if (Array.isArray(parsedJson?.worth_sitting_with)) {
          worthSittingWith = parsedJson.worth_sitting_with.map((item: any) => ({
            label: typeof item.label === 'string' ? item.label.trim() : '',
            note: typeof item.note === 'string' ? item.note.split('**').join('').split('*').join('').trim() : ''
          }));
        }

        const finalResultData: TriggerMappingResultData = {
          exerciseType: 'trigger_mapping',
          moments,
          synthesis_answer: synthesisAnswer,
          reflection_text: analysisText,
          worth_sitting_with: worthSittingWith,
          completedAt: nowIso,
          analysisStatus: 'complete',
          support_pause_used: supportPauseUsed
        };

        const targetResultId = storedResult?.id;
        let updateQuery = supabase.from('exercise_results').update({
          summary: analysisText,
          analysis: finalResultData
        });

        if (targetResultId) {
          updateQuery = updateQuery.eq('id', targetResultId);
        } else {
          updateQuery = updateQuery.eq('instance_id', instanceId);
        }

        const { data: finalUpdated, error: updateErr } = await updateQuery.select().single();
        if (updateErr) {
          console.error('[TriggerMappingWorker] Error updating exercise_results:', updateErr);
        }
        if (finalUpdated) {
          storedResult = finalUpdated;
        }
      } catch (aiErr) {
        console.error('[TriggerMappingWorker] AI generation error (responses safely preserved):', aiErr);
        const fallbackData: TriggerMappingResultData = {
          ...initialResultData,
          analysisStatus: 'unavailable',
          reflection_text: 'Your responses have been recorded below.'
        };
        const targetResultId = storedResult?.id;
        let fallbackQuery = supabase.from('exercise_results').update({
          summary: 'Your responses have been recorded below.',
          analysis: fallbackData
        });

        if (targetResultId) {
          fallbackQuery = fallbackQuery.eq('id', targetResultId);
        } else {
          fallbackQuery = fallbackQuery.eq('instance_id', instanceId);
        }

        const { data: fallbackUpdated } = await fallbackQuery.select().single();
        if (fallbackUpdated) {
          storedResult = fallbackUpdated;
        }
      }
    }

    // 4. Emit Orchestrator Event
    try {
      const { IntelligenceOrchestrator } = await import('../../../orchestrator/intelligenceOrchestrator');
      await IntelligenceOrchestrator.emitEvent(instance.user_id, 'ExerciseCompleted', {
        instance_id: instanceId,
        exercise_id: 'trigger_mapping',
        moments_count: moments.length,
        has_ai_reflection: Boolean(storedResult?.analysis?.reflection_text)
      });
    } catch (eventErr) {
      console.warn('[TriggerMappingWorker] Orchestrator event emission warning:', eventErr);
    }

    return storedResult;
  }
}
