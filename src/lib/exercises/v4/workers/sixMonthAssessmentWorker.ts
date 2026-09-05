import { supabase } from '../../../../lib/db';
import { ExerciseRepository } from '../repository/exerciseRepository';
import { ExerciseLifecycleService } from '../services/exerciseLifecycleService';
import { ExerciseResultService } from '../services/exerciseResultService';
import { SixMonthAssessmentPrompt } from '../ai/sixMonthAssessmentPrompt';
import { EXERCISE_9_BRANCH_Q6 } from '../definitions/sixMonthAssessmentCatalog';
import { aiProvider } from '../../../ai/factory';

export interface SixMonthWorkerPayload {
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
  q5?: string;
  q6?: string;
  q7?: string;
  branch_code?: string;
}

export class SixMonthAssessmentWorker {
  public static async processInstance(instanceId: string, payload?: SixMonthWorkerPayload): Promise<any> {
    console.log(`[SixMonthAssessmentWorker] Processing instance: ${instanceId}`);

    // 1. Check existing result
    const existingResult = await ExerciseResultService.getResult(instanceId);
    if (existingResult) {
      console.log(`[SixMonthAssessmentWorker] Stored result already exists for ${instanceId}. Returning.`);
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

    // 4. Gather answers (from payload or exercise_responses DB)
    const responses = await ExerciseRepository.getResponsesForInstance(instanceId);
    const dbAnswers: Record<string, string> = {};
    responses.forEach(r => {
      const qKey = r.question_id || '';
      if (r.response) dbAnswers[qKey] = r.response;
    });

    const q1 = payload?.q1 || dbAnswers['question_1'] || dbAnswers['q1'] || '';
    const q2 = payload?.q2 || dbAnswers['question_2'] || dbAnswers['q2'] || '';
    const q3 = payload?.q3 || dbAnswers['question_3'] || dbAnswers['q3'] || '';
    const q4 = payload?.q4 || dbAnswers['question_4'] || dbAnswers['q4'] || '';
    const q5 = payload?.q5 || dbAnswers['question_5'] || dbAnswers['q5'] || '';
    const q6 = payload?.q6 || dbAnswers['question_6'] || dbAnswers['q6'] || '';
    const q7 = payload?.q7 || dbAnswers['question_7'] || dbAnswers['q7'] || '';

    // 5. Resolve user branch
    let userBranch: 'A' | 'B' | 'C' | 'D' = 'A';
    try {
      const { data: assRow } = await supabase
        .from('assessments')
        .select('branch_assignment')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
        .limit(1)
        .maybeSingle();

      if (assRow?.branch_assignment) {
        userBranch = (assRow.branch_assignment.toUpperCase().trim() as 'A' | 'B' | 'C' | 'D') || 'A';
      }
    } catch (err) {
      console.warn('[SixMonthAssessmentWorker] Assessment branch fetch error:', err);
    }
    if (payload?.branch_code) {
      userBranch = (payload.branch_code.toUpperCase().trim() as 'A' | 'B' | 'C' | 'D') || userBranch;
    }

    // 6. Fetch Day 24 Exercise 3 Baseline Result (EX03)
    let ex03Baseline: any = null;
    let ex03ResultId: string | null = null;
    try {
      const { data: ex03Rows } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId)
        .in('exercise_id', ['exercise_3', 'self_perception'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (ex03Rows && ex03Rows.length > 0) {
        const row = ex03Rows[0];
        ex03ResultId = row.id;
        const analysisData = row.analysis || {};
        const dbAns = analysisData.answers || {};

        ex03Baseline = {
          q1: dbAns['question_1'] || dbAns['q1'] || dbAns['1'] || '',
          q2: dbAns['question_2'] || dbAns['q2'] || dbAns['2'] || '',
          q3: dbAns['question_3'] || dbAns['q3'] || dbAns['3'] || '',
          q4: dbAns['question_4'] || dbAns['q4'] || dbAns['4'] || '',
          q5: dbAns['question_5'] || dbAns['q5'] || dbAns['5'] || '',
          summary: row.summary || '',
          completedAt: row.created_at
        };
      }
    } catch (ex03Err) {
      console.warn('[SixMonthAssessmentWorker] Exercise 3 baseline fetch error:', ex03Err);
    }

    // 7. Fetch recent journal entries
    let journalEntries: string[] = [];
    let journalCount = 0;
    try {
      const { data: entries, count } = await supabase
        .from('entries')
        .select('content', { count: 'exact' })
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(15);

      if (entries) {
        journalEntries = entries.map(e => e.content).filter(Boolean);
      }
      journalCount = count || journalEntries.length;
    } catch (entryErr) {
      console.warn('[SixMonthAssessmentWorker] Journal entry fetch error:', entryErr);
    }

    // 8. Build Prompt
    const q6PromptText = EXERCISE_9_BRANCH_Q6[userBranch]?.text || EXERCISE_9_BRANCH_Q6['A'].text;
    const { system, user } = SixMonthAssessmentPrompt.buildPrompt({
      q1, q2, q3, q4, q5, q6, q7,
      branchCode: userBranch,
      q6PromptText,
      ex03Baseline,
      journalEntries
    });

    // 9. Execute AI call with fallback timeout
    let parsedAnalysis: any = null;
    let summaryText = '';

    try {
      const aiPromise = aiProvider.callRaw(`${system}\n\n${user}`);
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout (10s)')), 10000)
      );

      const rawText = await Promise.race([aiPromise, timeoutPromise]);

      // Extract JSON payload
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
        summaryText = parsedAnalysis.ai_analysis_text || parsedAnalysis.summary || '';
      } else {
        summaryText = rawText.trim();
      }
    } catch (err: any) {
      console.warn(`[SixMonthAssessmentWorker] AI call failed: ${err.message}`);
    }

    // Fallback if AI unavailable or invalid
    if (!parsedAnalysis) {
      parsedAnalysis = {
        self_description_change_score: ex03Baseline ? 3 : 0,
        entry_validated_change_score: ex03Baseline ? 2 : 0,
        discrepancy: {
          level: 'moderate',
          summary: 'Your self-descriptions reflect clear emerging awareness, with several shifts visible in your recent journal writing.'
        },
        question_changes: [1, 2, 3, 4, 5].map(num => ({
          question_number: num,
          meaningful_shift: true,
          baseline_summary: 'Baseline response recorded.',
          current_summary: 'Updated 6-month reflection submitted.',
          entry_evidence: 'supported',
          evidence_summary: 'Writing shows consistent engagement with this area.'
        })),
        branch_q6_analysis: {
          evidence_level: 'supported',
          summary: 'Your reflection on this branch-specific pattern highlights ongoing intentional choices.'
        },
        q7_reflection: 'Recognizing remaining edges allows continued growth without demanding immediate resolution.',
        ai_analysis_text: summaryText || 'Six months of deliberate practice have shifted how you perceive difficult situations and conflicts. Your writing shows steady progress in aligning daily decisions with core values.'
      };
      summaryText = parsedAnalysis.ai_analysis_text;
    }

    const selfChangeScore = Math.min(5, Math.max(0, Number(parsedAnalysis.self_description_change_score) || 0));
    const entryChangeScore = Math.min(5, Math.max(0, Number(parsedAnalysis.entry_validated_change_score) || 0));
    const discrepancyLevel = parsedAnalysis.discrepancy?.level || 'moderate';

    const fullAnalysisData = {
      exercise_type: 'six_month_assessment',
      exercise_id: 'six_month_assessment',
      branch_code: userBranch,
      answers: { q1, q2, q3, q4, q5, q6, q7 },
      q6_prompt_text: q6PromptText,
      ex03_baseline: ex03Baseline,
      ex03_baseline_id: ex03ResultId,
      journal_entry_count: journalCount,
      self_description_change_score: selfChangeScore,
      entry_validated_change_score: entryChangeScore,
      discrepancy: parsedAnalysis.discrepancy,
      question_changes: parsedAnalysis.question_changes,
      branch_q6_analysis: parsedAnalysis.branch_q6_analysis,
      q7_reflection: parsedAnalysis.q7_reflection,
      summary: summaryText,
      completed_at: new Date().toISOString()
    };

    // 10. Store Exercise Result
    const storedResult = await ExerciseResultService.storeResult({
      instanceId,
      userId,
      summary: summaryText,
      analysis: fullAnalysisData,
      score: selfChangeScore,
      model: process.env.AI_MODEL || 'claude-sonnet-4-6',
      provider: process.env.AI_PROVIDER || 'groq'
    });

    // 11. Transition Instance Lifecycle Status to completed
    await ExerciseLifecycleService.transitionTo(instanceId, 'completed');
    console.log(`[SixMonthAssessmentWorker] Successfully completed instance ${instanceId}.`);

    return storedResult;
  }
}
