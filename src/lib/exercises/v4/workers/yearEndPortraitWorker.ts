import { ExerciseRepository } from '../repository/exerciseRepository';
import { ExerciseLifecycleService } from '../services/exerciseLifecycleService';
import { ExerciseResultService } from '../services/exerciseResultService';
import { YearEndPortraitPrompt } from '../ai/yearEndPortraitPrompt';
import {
  YEAR_END_ANCHORS,
  YearEndAnchorResponse,
  YearEndSynthesisAnswers,
  YearEndPortraitAnalysis
} from '../definitions/yearEndPortraitCatalog';
import { aiProvider } from '../../../ai/factory';

export interface YearEndWorkerPayload {
  anchors?: Record<string, YearEndAnchorResponse>;
  closer_reflection?: string;
  synthesis?: YearEndSynthesisAnswers;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
}

export class YearEndPortraitWorker {
  public static async processInstance(instanceId: string, payload?: YearEndWorkerPayload): Promise<any> {
    console.log(`[YearEndPortraitWorker] Processing instance: ${instanceId}`);

    // 1. Check existing result
    const existingResult = await ExerciseResultService.getResult(instanceId);
    if (existingResult) {
      console.log(`[YearEndPortraitWorker] Stored result already exists for ${instanceId}. Returning.`);
      return existingResult;
    }

    // 2. Fetch instance
    const instance = await ExerciseRepository.getInstance(instanceId);
    if (!instance) throw new Error(`Instance not found: ${instanceId}`);
    const userId = instance.user_id;

    // 3. Transition to processing
    if (instance.status !== 'processing' && instance.status !== 'completed') {
      await ExerciseLifecycleService.transitionTo(instanceId, 'processing');
    }

    // 4. Gather responses from payload or DB
    const responses = await ExerciseRepository.getResponsesForInstance(instanceId);
    const dbAnswers: Record<string, any> = {};
    responses.forEach(r => {
      const qKey = r.question_id || '';
      try {
        dbAnswers[qKey] = JSON.parse(r.response);
      } catch {
        dbAnswers[qKey] = r.response;
      }
    });

    const anchors: Record<string, YearEndAnchorResponse> = payload?.anchors || dbAnswers['anchors'] || {};
    // Ensure all 8 anchors are present
    YEAR_END_ANCHORS.forEach(anchor => {
      if (!anchors[anchor.id]) {
        if (dbAnswers[anchor.id]) {
          anchors[anchor.id] = typeof dbAnswers[anchor.id] === 'object'
            ? dbAnswers[anchor.id]
            : { anchor_id: anchor.id, judgment: 'still_true', note: dbAnswers[anchor.id] };
        } else {
          anchors[anchor.id] = { anchor_id: anchor.id, judgment: 'still_true', note: '' };
        }
      }
    });

    const closerReflection: string = payload?.closer_reflection || dbAnswers['universal_closer'] || dbAnswers['closer_reflection'] || '';

    const synthesis: YearEndSynthesisAnswers = {
      q1: payload?.synthesis?.q1 || payload?.q1 || dbAnswers['synthesis_q1'] || dbAnswers['q1'] || '',
      q2: payload?.synthesis?.q2 || payload?.q2 || dbAnswers['synthesis_q2'] || dbAnswers['q2'] || '',
      q3: payload?.synthesis?.q3 || payload?.q3 || dbAnswers['synthesis_q3'] || dbAnswers['q3'] || '',
      q4: payload?.synthesis?.q4 || payload?.q4 || dbAnswers['synthesis_q4'] || dbAnswers['q4'] || '',
      q5: payload?.synthesis?.q5 || payload?.q5 || dbAnswers['synthesis_q5'] || dbAnswers['q5'] || ''
    };

    // Calculate anchor statistics
    let stillTrueCount = 0;
    let changedCount = 0;
    let complicatedCount = 0;

    Object.values(anchors).forEach(a => {
      if (a.judgment === 'still_true') stillTrueCount++;
      else if (a.judgment === 'changed') changedCount++;
      else if (a.judgment === 'complicated') complicatedCount++;
    });

    // 5. Build AI Prompt
    const { system, user } = YearEndPortraitPrompt.buildPrompt({
      anchors,
      closerReflection,
      synthesis
    });

    // 6. Execute AI Call with Fallback Timeout
    let parsedAI: any = null;
    let summaryText = '';

    try {
      const aiPromise = aiProvider.callRaw(`${system}\n\n${user}`);
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout (12s)')), 12000)
      );

      const rawText = await Promise.race([aiPromise, timeoutPromise]);
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAI = JSON.parse(jsonMatch[0]);
        summaryText = parsedAI.summary || '';
      } else {
        summaryText = rawText.trim();
      }
    } catch (err: any) {
      console.warn(`[YearEndPortraitWorker] AI generation fallback triggered: ${err.message}`);
    }

    // High quality deterministic fallback if AI is unavailable or fails schema
    if (!parsedAI || !parsedAI.part1_ground || !parsedAI.part2_shift || !parsedAI.part3_motion) {
      const startSentence = synthesis.q1 || 'You began this year navigating subtle emotional undercurrents and habitual patterns.';
      const keyInsight = synthesis.q2 || 'You uncovered deeper awareness around your emotional reactions and relational boundaries.';
      const resistantPattern = synthesis.q3 || 'Automatic defensiveness and hesitation under relational friction.';
      const readyToExamine = synthesis.q4 || 'Unexamined assumptions about control and emotional self-reliance.';
      const advice = synthesis.q5 || 'Trust the gradual clarity that comes with honest observation.';

      parsedAI = {
        part1_ground: `At the start of this year, you described your emotional state with clarity: "${startSentence}". Looking across your foundational anchors, ${stillTrueCount} dynamic${stillTrueCount === 1 ? '' : 's'} remained steady, while ${changedCount} shifted and ${complicatedCount} revealed layered complexity. Your self-perception and primary priorities formed the initial compass by which you oriented through difficulty and relational demands.`,
        part2_shift: `Over 12 months of structured reflection, your central realization crystallized around understanding that ${keyInsight}. Alongside this shift, you encountered your most persistent pattern: "${resistantPattern}". Recognizing the recurring contexts where this pattern triggers allowed you to observe its costs rather than reacting on autopilot.`,
        part3_motion: `As you complete this annual cycle, you have reached a vantage point where you are now prepared to examine "${readyToExamine}" — territory that felt out of reach at the beginning. The advice you offered to your past self ("${advice}") reflects not just retrospective wisdom, but an integrated framework for the road ahead.`,
        closing_question: closerReflection
          ? `When you reflect on "${closerReflection}", what is the first small, concrete truth you are ready to acknowledge without needing to immediately resolve it?`
          : "What is the quietest truth about yourself that you are now ready to live with?",
        summary: summaryText || `Your Year-End Self-Portrait synthesizes 12 months of practice into three distinct dimensions: foundational stability, conscious pattern recognition, and emerging willingness to explore previously avoided terrain.`
      };
      summaryText = parsedAI.summary;
    }

    const fullAnalysisData: YearEndPortraitAnalysis = {
      exercise_type: 'year_end_portrait',
      exercise_id: 'year_end_portrait',
      anchors,
      closer_reflection: closerReflection,
      synthesis_answers: synthesis,
      anchors_summary: {
        still_true_count: stillTrueCount,
        changed_count: changedCount,
        complicated_count: complicatedCount
      },
      part1_ground: parsedAI.part1_ground,
      part2_shift: parsedAI.part2_shift,
      part3_motion: parsedAI.part3_motion,
      closing_question: parsedAI.closing_question || "What is the quietest truth about yourself that you are now ready to live with?",
      summary: summaryText,
      completed_at: new Date().toISOString()
    };

    // 7. Store Exercise Result
    const storedResult = await ExerciseResultService.storeResult({
      instanceId,
      userId,
      summary: summaryText,
      analysis: fullAnalysisData,
      score: changedCount,
      model: process.env.AI_MODEL || 'claude-sonnet-4-6',
      provider: process.env.AI_PROVIDER || 'groq'
    });

    // 8. Transition Instance Lifecycle Status to completed
    await ExerciseLifecycleService.transitionTo(instanceId, 'completed');
    console.log(`[YearEndPortraitWorker] Successfully completed instance ${instanceId}.`);

    return storedResult;
  }
}
