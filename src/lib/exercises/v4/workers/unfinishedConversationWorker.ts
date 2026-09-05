import { supabase } from '../../../../lib/db';
import { ExerciseRepository } from '../repository/exerciseRepository';
import { ExerciseLifecycleService } from '../services/exerciseLifecycleService';
import { ExerciseResultService } from '../services/exerciseResultService';
import { UnfinishedConversationPrompt } from '../ai/unfinishedConversationPrompt';
import { aiProvider } from '../../../ai/factory';

export interface UnfinishedConversationWorkerPayload {
  person_name?: string;
  relationship_type?: string;
  unfinished_duration?: string;
  q1?: string;
  q2?: string;
  q3?: string;
  q4?: string;
}

export interface CandidatePerson {
  name: string;
  label: string;
  source: 'relationship_map' | 'journal';
  energy?: string;
  ambivalent?: boolean;
}

export class UnfinishedConversationWorker {
  /**
   * Helper function to surface relationship candidate candidates from Relationship Map & Journal history.
   * Handles missing Relationship Map or Journal data gracefully (returns []).
   */
  public static async getRelationshipCandidates(userId: string): Promise<CandidatePerson[]> {
    const candidates: CandidatePerson[] = [];

    try {
      // 1. Fetch latest completed Relationship Map result
      const { data: relMapRows } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId)
        .in('exercise_id', ['relationship_map', 'exercise_5'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (relMapRows && relMapRows.length > 0) {
        const mapItems: any[] = relMapRows[0]?.analysis?.relationship_map || [];
        mapItems.forEach(item => {
          const isDraining = item.energy === 'draining' || (typeof item.energy === 'string' && item.energy.toLowerCase().includes('drain'));
          const isAmbivalent = item.ambivalent || item.energy === 'ambivalent' || (typeof item.feeling === 'string' && item.feeling.toLowerCase().includes('mixed'));
          
          if (isDraining || isAmbivalent) {
            candidates.push({
              name: item.name,
              label: item.label || 'Relationship',
              source: 'relationship_map',
              energy: item.energy || (isDraining ? 'draining' : 'ambivalent'),
              ambivalent: Boolean(isAmbivalent)
            });
          }
        });
      }
    } catch (err) {
      console.warn('[UnfinishedConversationWorker] Candidate fetch warning:', err);
    }

    return candidates.slice(0, 5);
  }

  public static async processInstance(instanceId: string, payload?: UnfinishedConversationWorkerPayload): Promise<any> {
    console.log(`[UnfinishedConversationWorker] Processing instance: ${instanceId}`);

    // 1. Check existing result
    const existingResult = await ExerciseResultService.getResult(instanceId);
    if (existingResult) {
      console.log(`[UnfinishedConversationWorker] Stored result already exists for ${instanceId}. Returning.`);
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

    const personName = payload?.person_name || dbAnswers['person_name'] || instance.metadata?.person_name || 'Unspecified Person';
    const relationshipType = payload?.relationship_type || dbAnswers['relationship_type'] || instance.metadata?.relationship_type || 'Relationship';
    const unfinishedDuration = payload?.unfinished_duration || dbAnswers['unfinished_duration'] || 'Unspecified duration';

    const q1 = payload?.q1 || dbAnswers['question_1'] || dbAnswers['q1'] || `${personName} (${relationshipType}), ${unfinishedDuration}`;
    const q2 = payload?.q2 || dbAnswers['question_2'] || dbAnswers['q2'] || '';
    const q3 = payload?.q3 || dbAnswers['question_3'] || dbAnswers['q3'] || '';
    const q4 = payload?.q4 || dbAnswers['question_4'] || dbAnswers['q4'] || '';

    // 5. Fetch Relationship Map snapshot reference
    let relMapRef: any = null;
    try {
      const { data: relMapRows } = await supabase
        .from('exercise_results')
        .select('*')
        .eq('user_id', userId)
        .in('exercise_id', ['relationship_map', 'exercise_5'])
        .order('created_at', { ascending: false })
        .limit(1);

      if (relMapRows && relMapRows.length > 0) {
        const mapItems: any[] = relMapRows[0]?.analysis?.relationship_map || [];
        const matchedPerson = mapItems.find(p => p.name && p.name.toLowerCase().trim() === personName.toLowerCase().trim());
        if (matchedPerson) {
          relMapRef = matchedPerson;
        }
      }
    } catch (err) {
      console.warn('[UnfinishedConversationWorker] RelMap reference fetch error:', err);
    }

    // 6. Fetch journal entries mentioning personName
    let relevantJournalMentions: string[] = [];
    let entryFrequency = 0;
    try {
      const { data: entries } = await supabase
        .from('entries')
        .select('content')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(25);

      if (entries) {
        entries.forEach(e => {
          if (e.content && e.content.toLowerCase().includes(personName.toLowerCase())) {
            relevantJournalMentions.push(e.content);
            entryFrequency++;
          }
        });
      }
    } catch (err) {
      console.warn('[UnfinishedConversationWorker] Journal mentions fetch error:', err);
    }

    // 7. Build Prompt
    const { system, user } = UnfinishedConversationPrompt.buildPrompt({
      personName,
      relationshipType,
      unfinishedDuration,
      q1, q2, q3, q4,
      relationshipMapReference: relMapRef,
      entryFrequency,
      relevantJournalMentions
    });

    // 8. Execute AI call with 10s fallback timeout
    let parsedAnalysis: any = null;
    let summaryText = '';

    try {
      const aiPromise = aiProvider.callRaw(`${system}\n\n${user}`);
      const timeoutPromise = new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('AI request timeout (10s)')), 10000)
      );

      const rawText = await Promise.race([aiPromise, timeoutPromise]);

      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedAnalysis = JSON.parse(jsonMatch[0]);
        summaryText = parsedAnalysis.ai_analysis_text || parsedAnalysis.summary || '';
      } else {
        summaryText = rawText.trim();
      }
    } catch (err: any) {
      console.warn(`[UnfinishedConversationWorker] AI call failed: ${err.message}`);
    }

    // Fallback if AI unavailable or invalid
    if (!parsedAnalysis) {
      const isMatched = entryFrequency > 0 || Boolean(relMapRef);
      const matchVal = isMatched ? 'matched' : 'partial';

      parsedAnalysis = {
        conversation_summary: {
          person_name: personName,
          relationship_type: relationshipType,
          unfinished_duration: unfinishedDuration
        },
        what_remains_unsaid: `Expressing directly to ${personName}: "${q2 || 'Unspoken feelings'}"`,
        what_silence_protects: {
          self_protection: `Staying quiet protects against immediate discomfort, conflict, or vulnerability.`,
          other_protection: `It maintains current surface peace and protects the relationship from tension.`
        },
        what_it_costs: {
          emotional_cost: `Carrying unexpressed tension creates underlying emotional weight.`,
          relational_cost: `Maintains emotional distance and unaddressed boundaries.`,
          cognitive_cost: `Occupies ongoing mental space and background thoughts.`
        },
        pattern_match: matchVal,
        pattern_explanation: isMatched
          ? `Your journal writing and Relationship Map confirm ongoing mental space dedicated to this relationship dynamic.`
          : `This dynamic reflects a self-contained relational avoidance pattern.`,
        note_of_perspective: `This exercise does not ask you to contact or confront anyone. It only makes visible what keeping it unfinished appears to be doing.`,
        ai_analysis_text: summaryText || `Examining what remains unsaid with ${personName} clarifies the trade-off between surface peace and underlying emotional cost. Noticing what silence protects allows you to understand the relationship without pressure to act.`
      };
      summaryText = parsedAnalysis.ai_analysis_text;
    }

    const patternMatch = (parsedAnalysis.pattern_match || 'partial') as 'matched' | 'partial' | 'no_clear_match';
    const scoreVal = patternMatch === 'matched' ? 3 : patternMatch === 'partial' ? 2 : 1;

    const fullAnalysisData = {
      exercise_type: 'unfinished_conversation',
      exercise_id: 'unfinished_conversation',
      person_name: personName,
      relationship_type: relationshipType,
      unfinished_duration: unfinishedDuration,
      answers: { q1, q2, q3, q4 },
      direct_address_statement: q2,
      protection_mechanism: q3,
      cost_articulated: q4,
      relationship_map_reference: relMapRef,
      entry_frequency: entryFrequency,
      pattern_match: patternMatch,
      pattern_explanation: parsedAnalysis.pattern_explanation,
      what_remains_unsaid: parsedAnalysis.what_remains_unsaid,
      what_silence_protects: parsedAnalysis.what_silence_protects,
      what_it_costs: parsedAnalysis.what_it_costs,
      note_of_perspective: parsedAnalysis.note_of_perspective || 'This exercise does not ask you to contact or confront anyone. It only makes visible what keeping it unfinished appears to be doing.',
      summary: summaryText,
      completed_at: new Date().toISOString()
    };

    // 9. Store Exercise Result
    const storedResult = await ExerciseResultService.storeResult({
      instanceId,
      userId,
      summary: summaryText,
      analysis: fullAnalysisData,
      score: scoreVal,
      model: process.env.AI_MODEL || 'claude-sonnet-4-6',
      provider: process.env.AI_PROVIDER || 'groq'
    });

    // 10. Transition Instance Lifecycle Status to completed
    await ExerciseLifecycleService.transitionTo(instanceId, 'completed');
    console.log(`[UnfinishedConversationWorker] Successfully completed instance ${instanceId}.`);

    return storedResult;
  }
}
