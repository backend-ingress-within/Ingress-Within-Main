import { supabase } from '../../../../lib/db';
import { ExerciseRepository } from '../repository/exerciseRepository';
import { ExerciseLifecycleService } from '../services/exerciseLifecycleService';
import { ExerciseResultService } from '../services/exerciseResultService';
import { RecurringScenarioPrompt } from '../ai/recurringScenarioPrompt';
import { RecurringScenarioInputData, RecurringScenarioAnalysis, RecurringScenarioResultData } from '../definitions/recurringScenarioCatalog';
import { aiProvider } from '../../../ai/factory';

export interface RecurringScenarioWorkerPayload {
  prompt_rehearse?: string;
  prompt_replay?: string;
  prompt_inevitable?: string;
  prompt_avoid?: string;
}

export class RecurringScenarioWorker {
  public static async processInstance(instanceId: string, payload?: RecurringScenarioWorkerPayload): Promise<any> {
    console.log(`[RecurringScenarioWorker] Processing instance: ${instanceId}`);

    // 1. Check existing result
    const existingResult = await ExerciseResultService.getResult(instanceId);
    if (existingResult) {
      console.log(`[RecurringScenarioWorker] Stored result already exists for ${instanceId}. Returning.`);
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

    // 4. Gather answers (from payload, DB exercise_responses, or instance metadata)
    const responses = await ExerciseRepository.getResponsesForInstance(instanceId);
    const dbAnswers: Record<string, string> = {};
    responses.forEach(r => {
      const qKey = r.question_id || '';
      if (r.response) dbAnswers[qKey] = r.response;
    });

    const prompt_rehearse = payload?.prompt_rehearse || dbAnswers['prompt_rehearse'] || instance.metadata?.prompt_rehearse || '';
    const prompt_replay = payload?.prompt_replay || dbAnswers['prompt_replay'] || instance.metadata?.prompt_replay || '';
    const prompt_inevitable = payload?.prompt_inevitable || dbAnswers['prompt_inevitable'] || instance.metadata?.prompt_inevitable || '';
    const prompt_avoid = payload?.prompt_avoid || dbAnswers['prompt_avoid'] || instance.metadata?.prompt_avoid || '';

    const answers: RecurringScenarioInputData = {
      prompt_rehearse,
      prompt_replay,
      prompt_inevitable,
      prompt_avoid
    };

    // 5. Gather journal context
    let relevantMentions: string[] = [];
    let totalEntriesCount = 0;
    try {
      const { data: journalEntries } = await supabase
        .from('journal_entries')
        .select('content, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(25);

      if (journalEntries && journalEntries.length > 0) {
        totalEntriesCount = journalEntries.length;
        const keywords = [
          prompt_rehearse.slice(0, 15),
          prompt_replay.slice(0, 15),
          prompt_inevitable.slice(0, 15)
        ].filter(k => k && k.trim().length > 3);

        relevantMentions = journalEntries
          .filter(e => e.content && keywords.some(kw => e.content.toLowerCase().includes(kw.toLowerCase())))
          .slice(0, 3)
          .map(e => e.content.slice(0, 200));
      }
    } catch (jErr) {
      console.warn('[RecurringScenarioWorker] Journal fetch warning:', jErr);
    }

    // 6. Build prompt and query AI
    let analysis: RecurringScenarioAnalysis;
    let analysisStatus: 'complete' | 'partial' | 'unavailable' = 'complete';

    try {
      const promptObj = RecurringScenarioPrompt.buildPrompt({
        answers,
        relevantJournalMentions: relevantMentions,
        totalJournalEntriesCount: totalEntriesCount
      });

      const aiPromise = aiProvider.callRaw(`${promptObj.system}\n\n${promptObj.user}`);
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout (10s)')), 10000)
      );

      const responseText = await Promise.race([aiPromise, timeoutPromise]);
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};

      analysis = {
        strongest_pattern: parsed.strongest_pattern || `Rehearsing "${answers.prompt_rehearse.slice(0, 40)}..." and replaying past outcomes.`,
        entry_appearance: ['repeatedly', 'sometimes', 'not_visible'].includes(parsed.entry_appearance) ? parsed.entry_appearance : (relevantMentions.length > 0 ? 'sometimes' : 'not_visible'),
        expectation_behaviour_connection: parsed.expectation_behaviour_connection || `Anticipating "${answers.prompt_inevitable.slice(0, 40)}..." leads to protective steps before interactions occur.`,
        unimagined_scenario_analysis: parsed.unimagined_scenario_analysis || `Holding back from imagining "${answers.prompt_avoid.slice(0, 40)}..." keeps expectations bounded within safe territory.`,
        one_thing_to_notice: parsed.one_thing_to_notice || `Notice how mentally preparing for scenarios creates a familiar framework long before events unfold.`,
        summary_text: parsed.summary_text || `Your responses highlight an active pattern of preparing for scenarios before they occur and re-examining them afterward.`
      };
    } catch (aiErr) {
      console.warn('[RecurringScenarioWorker] AI analysis failed or unavailable, using fallback:', aiErr);
      analysisStatus = 'partial';
      analysis = {
        strongest_pattern: `Mental rehearsal centers around preparing for "${answers.prompt_rehearse.slice(0, 50)}..." and re-examining "${answers.prompt_replay.slice(0, 50)}...".`,
        entry_appearance: relevantMentions.length > 0 ? 'sometimes' : 'not_visible',
        expectation_behaviour_connection: `Expecting "${answers.prompt_inevitable.slice(0, 50)}..." shapes how you approach or prepare for interactions in advance.`,
        unimagined_scenario_analysis: `Avoiding imagining "${answers.prompt_avoid.slice(0, 50)}..." protects against unexpected vulnerability or disappointment.`,
        one_thing_to_notice: `Notice the quiet energy used in mental rehearsal and replay across familiar situations.`,
        summary_text: `You have mapped four distinct modes of mental preparation: pre-event rehearsal, post-event replay, assumed inevitability, and guarded avoidance.`
      };
    }

    const completedAt = new Date().toISOString();

    const resultData: RecurringScenarioResultData = {
      exerciseType: 'recurring_scenario',
      exerciseId: 'recurring_scenario',
      answers,
      analysis,
      completedAt,
      analysisStatus
    };

    // 7. Save result
    const savedResult = await ExerciseResultService.storeResult({
      instanceId,
      userId,
      summary: analysis.summary_text,
      analysis: resultData as any,
      score: 100
    });

    // 8. Transition to completed
    await ExerciseLifecycleService.transitionTo(instanceId, 'completed');

    return savedResult;
  }
}
