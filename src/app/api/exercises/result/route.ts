import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { ExerciseRepository } from '../../../../lib/exercises/v4/repository/exerciseRepository';
import { ExerciseResultService } from '../../../../lib/exercises/v4/services/exerciseResultService';

export async function GET(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);
    if (!authUser) {
      return NextResponse.json(
        { error: { code: 'AUTH_REQUIRED', message: 'Authentication is required.' } },
        { status: 401 }
      );
    }

    const instanceId = request.nextUrl.searchParams.get('instance_id');
    if (!instanceId) {
      return NextResponse.json(
        { error: { code: 'INVALID_INPUT', message: 'Must provide instance_id.' } },
        { status: 400 }
      );
    }

    let instance = await ExerciseRepository.getInstance(instanceId);

    // Auto-resolve synthetic or missing exercise_0 instances
    if (!instance && (instanceId.startsWith('inst_exercise_0') || instanceId === 'exercise_0')) {
      instance = await ExerciseRepository.getInstanceByUserAndExercise(authUser.userId, undefined, 'exercise_0');
      if (!instance) {
        // Create permanent completed instance for baseline assessment
        const nowIso = new Date().toISOString();
        const { supabase } = await import('../../../../lib/db');
        const { data: newInst } = await supabase
          .from('exercise_instances')
          .upsert({
            user_id: authUser.userId,
            exercise_id: 'exercise_0',
            status: 'completed',
            unlock_time: nowIso,
            completed_at: nowIso,
            updated_at: nowIso
          }, { onConflict: 'user_id,exercise_id' })
          .select()
          .single();
        instance = newInst;
      }
    }

    if (!instance) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'Exercise instance not found.' } },
        { status: 404 }
      );
    }

    if (instance.user_id !== authUser.userId) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'Access denied.' } },
        { status: 403 }
      );
    }

    const retry = request.nextUrl.searchParams.get('retry') === 'true';
    let result = await ExerciseResultService.getResult(instance.id);

    // Auto-synthesize exercise_0 results from users table if missing or incomplete
    if (instance.exercise_id === 'exercise_0' && (!result || !result.analysis || !result.analysis.scores)) {
      const { supabase } = await import('../../../../lib/db');
      const { data: userRow } = await supabase
        .from('users')
        .select('ocean_openness, ocean_conscientiousness, ocean_extraversion, ocean_agreeableness, ocean_neuroticism, personality_profile_json, personality_summary_text')
        .eq('id', authUser.userId)
        .maybeSingle();

      const rawO = userRow?.ocean_openness ?? 3.8;
      const rawC = userRow?.ocean_conscientiousness ?? 3.5;
      const rawE = userRow?.ocean_extraversion ?? 3.2;
      const rawA = userRow?.ocean_agreeableness ?? 4.0;
      const rawN = userRow?.ocean_neuroticism ?? 3.0;
      const summary = userRow?.personality_summary_text || 'Baseline assessment completed.';

      const synthScores = {
        openness: Math.round(rawO <= 5 ? rawO * 20 : rawO),
        conscientiousness: Math.round(rawC <= 5 ? rawC * 20 : rawC),
        extraversion: Math.round(rawE <= 5 ? rawE * 20 : rawE),
        agreeableness: Math.round(rawA <= 5 ? rawA * 20 : rawA),
        neuroticism: Math.round(rawN <= 5 ? rawN * 20 : rawN)
      };

      const synthAnalysis = {
        scores: synthScores,
        rawScores: { openness: rawO, conscientiousness: rawC, extraversion: rawE, agreeableness: rawA, neuroticism: rawN },
        summaryText: summary,
        reflection_text: summary
      };

      const nowIso = new Date().toISOString();
      const { data: savedResult } = await supabase
        .from('exercise_results')
        .upsert({
          instance_id: instance.id,
          user_id: authUser.userId,
          exercise_id: 'exercise_0',
          summary,
          analysis: synthAnalysis,
          metrics: {
            openness: rawO,
            conscientiousness: rawC,
            extraversion: rawE,
            agreeableness: rawA,
            neuroticism: rawN,
            calculated_at: nowIso
          },
          insights: [
            `Openness: ${synthScores.openness}%`,
            `Conscientiousness: ${synthScores.conscientiousness}%`,
            `Extraversion: ${synthScores.extraversion}%`,
            `Agreeableness: ${synthScores.agreeableness}%`,
            `Neuroticism: ${synthScores.neuroticism}%`
          ],
          created_at: nowIso
        }, { onConflict: 'instance_id' })
        .select()
        .single();

      result = savedResult || {
        instance_id: instance.id,
        user_id: authUser.userId,
        exercise_id: 'exercise_0',
        summary,
        analysis: synthAnalysis
      };
    }

    if (retry && result) {
      let analysis = result.analysis || result.data || {};
      if (typeof analysis === 'string') {
        try { analysis = JSON.parse(analysis); } catch (_) { analysis = {}; }
      }

      const isFallback =
        instance.exercise_id === 'cost_benefit_audit'
          ? !Array.isArray(analysis.patterns) || analysis.patterns.length === 0 || analysis.patterns.some((p: any) => !p.analysis?.observation) || analysis.analysisStatus !== 'complete'
          : !analysis.reflection_text || (result.summary && result.summary.includes('recorded below'));

      if (isFallback) {
        try {
          if (instance.exercise_id === 'relationship_map' || instance.exercise_id === 'exercise_5') {
            const { RelationshipMapWorker } = await import('../../../../lib/exercises/v4/workers/relationshipMapWorker');
            result = await RelationshipMapWorker.processInstance(instance.id);
          } else if (instance.exercise_id === 'cost_benefit_audit') {
            const { CostBenefitWorker } = await import('../../../../lib/exercises/v4/workers/costBenefitWorker');
            result = await CostBenefitWorker.processInstance(instance.id);
          } else if (instance.exercise_id === 'avoidance_audit' || instance.exercise_id === 'exercise_7') {
            const { AvoidanceAuditWorker } = await import('../../../../lib/exercises/v4/workers/avoidanceAuditWorker');
            result = await AvoidanceAuditWorker.processInstance(instance.id);
          } else if (instance.exercise_id === 'trigger_mapping') {
            const { TriggerMappingWorker } = await import('../../../../lib/exercises/v4/workers/triggerMappingWorker');
            result = await TriggerMappingWorker.processInstance(instance.id);
          } else if (instance.exercise_id === 'body_signal_inventory' || instance.exercise_id === 'exercise_6') {
            const { BodySignalWorker } = await import('../../../../lib/exercises/v4/workers/bodySignalWorker');
            result = await BodySignalWorker.processInstance(instance.id);
          } else if (instance.exercise_id === 'narrative_arc') {
            const { NarrativeArcWorker } = await import('../../../../lib/exercises/v4/workers/narrativeArcWorker');
            result = await NarrativeArcWorker.processInstance(instance.id);
          }
        } catch (retryErr) {
          console.warn('[GET /api/exercises/result] Retry worker failed:', retryErr);
        }
      }
    }

    if (result && typeof result.analysis === 'string') {
      try {
        result.analysis = JSON.parse(result.analysis);
      } catch (_) {}
    }

    return NextResponse.json({ success: true, result, instance });
  } catch (error: any) {
    console.error('[GET /api/exercises/result] Error:', error);
    return NextResponse.json(
      { error: { code: 'SERVER_ERROR', message: error.message || 'Internal error.' } },
      { status: 500 }
    );
  }
}
