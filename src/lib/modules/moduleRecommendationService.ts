import { supabase } from '../db';
import { ModuleCatalogService } from './moduleCatalogService';
import { ModuleProgressService } from './moduleProgressService';
import {
  MonthlyPatternInput,
  RecommendationRecord,
  RecommendationResponse,
  RecommendationStatus
} from '../../types/moduleRecommendation';

// Stable Taxonomy ID Mapping Lookup Table
const TAXONOMY_PATTERN_MAPPINGS: Record<string, { moduleId: string; concernId: string }> = {
  // M1 Concerns — Self-Worth & Self-Talk
  'M1-C01': { moduleId: 'M1', concernId: 'M1-C01' },
  'self_criticism': { moduleId: 'M1', concernId: 'M1-C01' },
  'self-criticism': { moduleId: 'M1', concernId: 'M1-C01' },
  'self_pressure': { moduleId: 'M1', concernId: 'M1-C01' },
  'self-pressure': { moduleId: 'M1', concernId: 'M1-C01' },
  'harsh_self_talk': { moduleId: 'M1', concernId: 'M1-C01' },
  'harsh-self-talk': { moduleId: 'M1', concernId: 'M1-C01' },
  'inner_critic': { moduleId: 'M1', concernId: 'M1-C01' },
  'shame_cycles': { moduleId: 'M1', concernId: 'M1-C01' },

  'M1-C02': { moduleId: 'M1', concernId: 'M1-C02' },
  'low_self_worth': { moduleId: 'M1', concernId: 'M1-C02' },
  'low-self-worth': { moduleId: 'M1', concernId: 'M1-C02' },
  'low self-agency': { moduleId: 'M1', concernId: 'M1-C02' },
  'low_self_agency': { moduleId: 'M1', concernId: 'M1-C02' },
  'imposter_syndrome': { moduleId: 'M1', concernId: 'M1-C02' },
  'feeling_defective': { moduleId: 'M1', concernId: 'M1-C02' },

  'M1-C03': { moduleId: 'M1', concernId: 'M1-C03' },
  'social_comparison': { moduleId: 'M1', concernId: 'M1-C03' },
  'approval_seeking': { moduleId: 'M1', concernId: 'M1-C03' },
  'people_pleasing': { moduleId: 'M1', concernId: 'M1-C03' },
  'people pleasing': { moduleId: 'M1', concernId: 'M1-C03' },
  'hypervigilance to others': { moduleId: 'M1', concernId: 'M1-C03' },

  // M2 Concerns — Perfectionism & Avoidance
  'M2-C01': { moduleId: 'M2', concernId: 'M2-C01' },
  'perfectionism': { moduleId: 'M2', concernId: 'M2-C01' },
  'perfectionism as deflection': { moduleId: 'M2', concernId: 'M2-C01' },
  'rigid_standards': { moduleId: 'M2', concernId: 'M2-C01' },
  'over_polishing': { moduleId: 'M2', concernId: 'M2-C01' },

  'M2-C02': { moduleId: 'M2', concernId: 'M2-C02' },
  'procrastination': { moduleId: 'M2', concernId: 'M2-C02' },
  'avoidance': { moduleId: 'M2', concernId: 'M2-C02' },
  'task_avoidance': { moduleId: 'M2', concernId: 'M2-C02' },
  'avoidance_procrastination': { moduleId: 'M2', concernId: 'M2-C02' },
  'conflict aversion': { moduleId: 'M2', concernId: 'M2-C02' },
  'conflict_aversion': { moduleId: 'M2', concernId: 'M2-C02' },

  // M3 Concerns — Anxiety & Worry
  'M3-C01': { moduleId: 'M3', concernId: 'M3-C01' },
  'rumination': { moduleId: 'M3', concernId: 'M3-C01' },
  'overthinking': { moduleId: 'M3', concernId: 'M3-C01' },
  'calling it "overthinking"': { moduleId: 'M3', concernId: 'M3-C01' },
  'catastrophising': { moduleId: 'M3', concernId: 'M3-C01' },
  'catastrophizing': { moduleId: 'M3', concernId: 'M3-C01' },
  'mental_loops': { moduleId: 'M3', concernId: 'M3-C01' },

  'M3-C02': { moduleId: 'M3', concernId: 'M3-C02' },
  'generalised_anxiety': { moduleId: 'M3', concernId: 'M3-C02' },
  'gad_worry': { moduleId: 'M3', concernId: 'M3-C02' },
  'constant_what_if': { moduleId: 'M3', concernId: 'M3-C02' },

  'M3-C03': { moduleId: 'M3', concernId: 'M3-C03' },
  'panic_attacks': { moduleId: 'M3', concernId: 'M3-C03' },
  'panic_disorder': { moduleId: 'M3', concernId: 'M3-C03' },

  'M3-C04': { moduleId: 'M3', concernId: 'M3-C04' },
  'intrusive_thoughts': { moduleId: 'M3', concernId: 'M3-C04' },
  'ocd_checking': { moduleId: 'M3', concernId: 'M3-C04' },

  // M4 Concerns — Mood & Emotional Regulation
  'M4-C01': { moduleId: 'M4', concernId: 'M4-C01' },
  'emotional_overwhelm': { moduleId: 'M4', concernId: 'M4-C01' },
  'emotional-overwhelm': { moduleId: 'M4', concernId: 'M4-C01' },
  'overwhelm': { moduleId: 'M4', concernId: 'M4-C01' },
  'dysregulation': { moduleId: 'M4', concernId: 'M4-C01' },
  'flooding': { moduleId: 'M4', concernId: 'M4-C01' },
  'emotional_flooding': { moduleId: 'M4', concernId: 'M4-C01' },

  'M4-C02': { moduleId: 'M4', concernId: 'M4-C02' },
  'anger': { moduleId: 'M4', concernId: 'M4-C02' },
  'irritability': { moduleId: 'M4', concernId: 'M4-C02' },
  'anger_irritability': { moduleId: 'M4', concernId: 'M4-C02' },
  'short_fuse': { moduleId: 'M4', concernId: 'M4-C02' },

  'M4-C03': { moduleId: 'M4', concernId: 'M4-C03' },
  'low_mood': { moduleId: 'M4', concernId: 'M4-C03' },
  'low-mood': { moduleId: 'M4', concernId: 'M4-C03' },
  'depressive_symptoms': { moduleId: 'M4', concernId: 'M4-C03' },
  'depression': { moduleId: 'M4', concernId: 'M4-C03' },
  'hopelessness': { moduleId: 'M4', concernId: 'M4-C03' },

  // M5 Concerns — Identity & Purpose
  'M5-C01': { moduleId: 'M5', concernId: 'M5-C01' },
  'identity_confusion': { moduleId: 'M5', concernId: 'M5-C01' },
  'identity-confusion': { moduleId: 'M5', concernId: 'M5-C01' },
  'values_conflict': { moduleId: 'M5', concernId: 'M5-C01' },
  'values-conflict': { moduleId: 'M5', concernId: 'M5-C01' },
  'cultural_conflict': { moduleId: 'M5', concernId: 'M5-C01' },
  'who_am_i': { moduleId: 'M5', concernId: 'M5-C01' },
  'identity_crisis': { moduleId: 'M5', concernId: 'M5-C01' },

  'M5-C02': { moduleId: 'M5', concernId: 'M5-C02' },
  'lack_of_motivation': { moduleId: 'M5', concernId: 'M5-C02' },
  'lack-of-motivation': { moduleId: 'M5', concernId: 'M5-C02' },
  'unmotivated': { moduleId: 'M5', concernId: 'M5-C02' },
  'no_direction': { moduleId: 'M5', concernId: 'M5-C02' },
  'aimless': { moduleId: 'M5', concernId: 'M5-C02' },
  'stalled': { moduleId: 'M5', concernId: 'M5-C02' },
  'lack_of_purpose': { moduleId: 'M5', concernId: 'M5-C02' },

  // M6 Concerns — Trauma & Past Experiences
  'M6-C01': { moduleId: 'M6', concernId: 'M6-C01' },
  'trauma': { moduleId: 'M6', concernId: 'M6-C01' },
  'past_experiences': { moduleId: 'M6', concernId: 'M6-C01' },
  'past-experiences': { moduleId: 'M6', concernId: 'M6-C01' },
  'ptsd_symptoms': { moduleId: 'M6', concernId: 'M6-C01' },
  'ptsd': { moduleId: 'M6', concernId: 'M6-C01' },
  'hypervigilance': { moduleId: 'M6', concernId: 'M6-C01' },
  'startle_response': { moduleId: 'M6', concernId: 'M6-C01' },
  'trauma_avoidance': { moduleId: 'M6', concernId: 'M6-C01' },
  'flashbacks': { moduleId: 'M6', concernId: 'M6-C01' },
  'past_difficult_experiences': { moduleId: 'M6', concernId: 'M6-C01' },

  // M7 Concerns — Emotional Suppression & Masculinity Norms
  'M7-C01': { moduleId: 'M7', concernId: 'M7-C01' },
  'emotional_suppression': { moduleId: 'M7', concernId: 'M7-C01' },
  'emotional-suppression': { moduleId: 'M7', concernId: 'M7-C01' },
  'masculinity_norms': { moduleId: 'M7', concernId: 'M7-C01' },
  'masculinity-norms': { moduleId: 'M7', concernId: 'M7-C01' },
  'toughness_script': { moduleId: 'M7', concernId: 'M7-C01' },
  'toughness-script': { moduleId: 'M7', concernId: 'M7-C01' },
  'vulnerability_avoidance': { moduleId: 'M7', concernId: 'M7-C01' },
  'stoicism': { moduleId: 'M7', concernId: 'M7-C01' },
  'suppression': { moduleId: 'M7', concernId: 'M7-C01' },
  'holding_it_in': { moduleId: 'M7', concernId: 'M7-C01' },
  'unexpressed_emotions': { moduleId: 'M7', concernId: 'M7-C01' },

  // M8 Concerns — Neurodivergence & Adult Diagnosis
  'M8-C01': { moduleId: 'M8', concernId: 'M8-C01' },
  'neurodivergence': { moduleId: 'M8', concernId: 'M8-C01' },
  'neurodivergent': { moduleId: 'M8', concernId: 'M8-C01' },
  'adhd': { moduleId: 'M8', concernId: 'M8-C01' },
  'adult_adhd': { moduleId: 'M8', concernId: 'M8-C01' },
  'adult-adhd': { moduleId: 'M8', concernId: 'M8-C01' },
  'autism': { moduleId: 'M8', concernId: 'M8-C01' },
  'adult_autism': { moduleId: 'M8', concernId: 'M8-C01' },
  'adult-autism': { moduleId: 'M8', concernId: 'M8-C01' },
  'executive_dysfunction': { moduleId: 'M8', concernId: 'M8-C01' },
  'executive-dysfunction': { moduleId: 'M8', concernId: 'M8-C01' },
  'chronic_lateness': { moduleId: 'M8', concernId: 'M8-C01' },
  'disorganization': { moduleId: 'M8', concernId: 'M8-C01' },
  'task_initiation': { moduleId: 'M8', concernId: 'M8-C01' },
  'adult_diagnosis': { moduleId: 'M8', concernId: 'M8-C01' },
  'adult-diagnosis': { moduleId: 'M8', concernId: 'M8-C01' },
  'late_diagnosis': { moduleId: 'M8', concernId: 'M8-C01' },

  // M9 Concerns — Judged & Compared (Family Domain)
  'M9-C01': { moduleId: 'M9', concernId: 'M9-C01' },
  'criticism': { moduleId: 'M9', concernId: 'M9-C01' },
  'family_criticism': { moduleId: 'M9', concernId: 'M9-C01' },
  'family-criticism': { moduleId: 'M9', concernId: 'M9-C01' },
  'constant_criticism': { moduleId: 'M9', concernId: 'M9-C01' },
  'constant-criticism': { moduleId: 'M9', concernId: 'M9-C01' },
  'being_judged': { moduleId: 'M9', concernId: 'M9-C01' },
  'being-judged': { moduleId: 'M9', concernId: 'M9-C01' },
  'feeling_judged': { moduleId: 'M9', concernId: 'M9-C01' },
  'judged_and_compared': { moduleId: 'M9', concernId: 'M9-C01' },

  'M9-C02': { moduleId: 'M9', concernId: 'M9-C02' },
  'comparison_relatives': { moduleId: 'M9', concernId: 'M9-C02' },
  'comparison_with_relatives': { moduleId: 'M9', concernId: 'M9-C02' },
  'relative_comparison': { moduleId: 'M9', concernId: 'M9-C02' },
  'relative-comparison': { moduleId: 'M9', concernId: 'M9-C02' },
  'family_comparison': { moduleId: 'M9', concernId: 'M9-C02' },
  'family-comparison': { moduleId: 'M9', concernId: 'M9-C02' },
  'compared_to_others': { moduleId: 'M9', concernId: 'M9-C02' },

  'M9-C03': { moduleId: 'M9', concernId: 'M9-C03' },
  'high_expectations': { moduleId: 'M9', concernId: 'M9-C03' },
  'high-expectations': { moduleId: 'M9', concernId: 'M9-C03' },
  'expectations_to_succeed': { moduleId: 'M9', concernId: 'M9-C03' },
  'pressure_to_succeed': { moduleId: 'M9', concernId: 'M9-C03' },
  'achievement_pressure': { moduleId: 'M9', concernId: 'M9-C03' },
  'parental_pressure': { moduleId: 'M9', concernId: 'M9-C03' },
  'family_expectations': { moduleId: 'M9', concernId: 'M9-C03' },

  // M10 Concerns — Autonomy & Boundaries (Family Domain)
  'M10-C01': { moduleId: 'M10', concernId: 'M10-C01' },
  'marriage_pressure': { moduleId: 'M10', concernId: 'M10-C01' },
  'marriage-pressure': { moduleId: 'M10', concernId: 'M10-C01' },
  'arranged_marriage_pressure': { moduleId: 'M10', concernId: 'M10-C01' },
  'family_marriage_pressure': { moduleId: 'M10', concernId: 'M10-C01' },
  'timeline_pressure': { moduleId: 'M10', concernId: 'M10-C01' },

  'M10-C02': { moduleId: 'M10', concernId: 'M10-C02' },
  'privacy_boundaries': { moduleId: 'M10', concernId: 'M10-C02' },
  'privacy-boundaries': { moduleId: 'M10', concernId: 'M10-C02' },
  'lack_of_privacy': { moduleId: 'M10', concernId: 'M10-C02' },
  'lack-of-privacy': { moduleId: 'M10', concernId: 'M10-C02' },
  'boundary_setting': { moduleId: 'M10', concernId: 'M10-C02' },
  'boundary-setting': { moduleId: 'M10', concernId: 'M10-C02' },
  'family_boundaries': { moduleId: 'M10', concernId: 'M10-C02' },
  'family-boundaries': { moduleId: 'M10', concernId: 'M10-C02' },
  'personal_boundaries': { moduleId: 'M10', concernId: 'M10-C02' },

  'M10-C03': { moduleId: 'M10', concernId: 'M10-C03' },
  'career_pressure': { moduleId: 'M10', concernId: 'M10-C03' },
  'career-pressure': { moduleId: 'M10', concernId: 'M10-C03' },
  'forced_career': { moduleId: 'M10', concernId: 'M10-C03' },
  'forced-career': { moduleId: 'M10', concernId: 'M10-C03' },
  'family_career_pressure': { moduleId: 'M10', concernId: 'M10-C03' },
  'family_business_pressure': { moduleId: 'M10', concernId: 'M10-C03' },
  'autonomy_boundaries': { moduleId: 'M10', concernId: 'M10-C03' },
  'autonomy-boundaries': { moduleId: 'M10', concernId: 'M10-C03' }
};

// In-memory store fallback for recommendations indexed by `${userId}:${cycleId}`
const IN_MEMORY_RECOMMENDATIONS: Record<string, RecommendationRecord> = {};

export class ModuleRecommendationService {
  /**
   * Helper to map a concern key or taxonomy code to its corresponding module.
   */
  public static mapConcernToModule(concernKey: string): { moduleId: string; concernId: string } | null {
    if (!concernKey) return null;
    const keyTrim = concernKey.trim();
    const keyUpper = keyTrim.toUpperCase();
    const keyLower = keyTrim.toLowerCase();

    if (TAXONOMY_PATTERN_MAPPINGS[keyUpper]) return TAXONOMY_PATTERN_MAPPINGS[keyUpper];
    if (TAXONOMY_PATTERN_MAPPINGS[keyLower]) return TAXONOMY_PATTERN_MAPPINGS[keyLower];
    if (TAXONOMY_PATTERN_MAPPINGS[keyTrim]) return TAXONOMY_PATTERN_MAPPINGS[keyTrim];

    return null;
  }

  /**
   * Generates or retrieves an existing idempotent recommendation for a monthly cycle/report.
   */
  public static async getOrGenerateRecommendation(
    userId: string,
    cycleId: string,
    topPatterns: MonthlyPatternInput[]
  ): Promise<RecommendationResponse> {
    const memoryKey = `${userId.trim()}:${cycleId.trim()}`;

    // Step 6: Check Idempotency (Existing recommendation check in memory)
    if (IN_MEMORY_RECOMMENDATIONS[memoryKey]) {
      const existing = IN_MEMORY_RECOMMENDATIONS[memoryKey];
      console.log(`[Developer Log] Found existing idempotent recommendation in memory for user ${userId}:`, existing);
      return this.buildResponseFromRecord(userId, existing);
    }

    try {
      let query = supabase
        .from('module_recommendations')
        .select('*')
        .eq('user_id', userId);

      if (cycleId && cycleId !== 'latest') {
        query = query.eq('cycle_id', cycleId);
      }

      const { data: dbRecord } = await query
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (dbRecord) {
        IN_MEMORY_RECOMMENDATIONS[memoryKey] = dbRecord as RecommendationRecord;
        console.log(`[Developer Log] Found existing idempotent recommendation in DB for user ${userId}:`, dbRecord);
        return this.buildResponseFromRecord(userId, dbRecord as RecommendationRecord);
      }
    } catch (err) {
      // DB check fallback
    }

    // If no explicit top patterns passed (e.g. initial GET call from Dashboard), attempt auto-loading user's top patterns
    if (!topPatterns || topPatterns.length === 0) {
      try {
        const { PatternIntelligenceService } = await import('../patterns/patternIntelligenceService');
        const overview = await PatternIntelligenceService.getPatternOverview(userId);
        if (overview?.patterns && overview.patterns.length > 0) {
          const activePatterns = overview.patterns.filter((p: any) =>
            p.status === 'present' || p.status === 'new' || p.status === 'shifting' || p.status === 'returned'
          );
          const selected = (activePatterns.length > 0 ? activePatterns : overview.patterns).slice(0, 3);
          topPatterns = selected.map((p: any, idx: number) => ({
            patternId: p.id || p.name,
            taxonomyId: p.taxonomyId || p.id || p.name,
            title: p.name,
            description: p.body || p.meta,
            score: 85 - (idx * 5),
            rank: idx + 1
          }));
        }
      } catch (patternErr) {
        console.warn('[ModuleRecommendationService] Auto-fetch patterns lookup warning:', patternErr);
      }
    }

    console.log(`[Developer Log] Running Psychoeducation Recommendation Engine for user ${userId}, cycle ${cycleId}`);
    console.log('[Developer Log] Top 3 Monthly Patterns:', JSON.stringify(topPatterns, null, 2));

    // Step 1: Safety Check
    const isCrisis = topPatterns.some(p =>
      p.isCrisis ||
      /crisis|suicide|suicidal|self_harm|self harm|end my life|severe_crisis/i.test(p.patternId || '') ||
      /crisis|suicide|suicidal|self_harm|self harm|end my life|severe_crisis/i.test(p.title || '') ||
      /crisis|suicide|suicidal|self_harm|self harm|end my life|severe_crisis/i.test(p.description || '')
    );

    if (isCrisis) {
      console.warn('[Developer Log] Crisis safety trigger matched! Routing to CRISIS_ROUTE.');
      const crisisRecord: RecommendationRecord = {
        id: `rec_crisis_${Date.now()}`,
        user_id: userId,
        cycle_id: cycleId,
        selected_module_id: null,
        triggering_pattern_id: 'CRISIS_TRIGGER',
        triggering_pattern_name: 'Safety Check Triggered',
        matched_taxonomy_concern: 'SAFETY_ESCALATION',
        match_confidence: 1.0,
        status: 'CRISIS_ROUTE',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      IN_MEMORY_RECOMMENDATIONS[memoryKey] = crisisRecord;
      this.persistRecordToDb(crisisRecord);

      return {
        status: 'CRISIS_ROUTE',
        recommendation: null
      };
    }

    // Step 2 & 3: Match Top Patterns Against Taxonomy & Determine Eligible Modules
    const taxonomyMatches: Array<{
      pattern: MonthlyPatternInput;
      moduleId: string;
      concernId: string;
      weight: number;
    }> = [];

    const moduleEvidence: Record<string, { totalWeight: number; triggeringPattern: MonthlyPatternInput; topConcern: string }> = {};

    for (const pattern of topPatterns) {
      const taxonomyCode = (pattern.taxonomyId || pattern.patternId || '').toUpperCase().trim();
      const pKeyLower = (pattern.taxonomyId || pattern.patternId || '').toLowerCase().trim();

      let match = TAXONOMY_PATTERN_MAPPINGS[taxonomyCode] || TAXONOMY_PATTERN_MAPPINGS[pKeyLower];

      // Fallback matching by pattern title/key/description containing taxonomy keywords
      if (!match) {
        for (const [key, val] of Object.entries(TAXONOMY_PATTERN_MAPPINGS)) {
          const keyUpper = key.toUpperCase();
          const keyLower = key.toLowerCase();
          const titleLower = (pattern.title || '').toLowerCase();
          const descLower = (pattern.description || '').toLowerCase();

          if (
            taxonomyCode === keyUpper ||
            pKeyLower === keyLower ||
            titleLower.includes(keyLower) ||
            descLower.includes(keyLower)
          ) {
            match = val;
            break;
          }
        }
      }

      if (match) {
        // Rank weight multiplier: rank 1 = 3.0, rank 2 = 2.0, rank 3 = 1.0
        const rankMultiplier = Math.max(1, 4 - (pattern.rank || 1));
        const patternScore = pattern.score || 80;
        const weight = (patternScore / 100) * rankMultiplier;

        taxonomyMatches.push({
          pattern,
          moduleId: match.moduleId,
          concernId: match.concernId,
          weight
        });

        if (!moduleEvidence[match.moduleId]) {
          moduleEvidence[match.moduleId] = {
            totalWeight: 0,
            triggeringPattern: pattern,
            topConcern: match.concernId
          };
        }

        // Accumulate evidence score if multiple top patterns map to the same module
        moduleEvidence[match.moduleId].totalWeight += weight;
      }
    }

    console.log('[Developer Log] Taxonomy Matches:', JSON.stringify(taxonomyMatches, null, 2));
    console.log('[Developer Log] Eligible Modules Evidence:', JSON.stringify(moduleEvidence, null, 2));

    // Step 4: Select ONE Module with Highest Evidence Score
    const eligibleModuleIds = Object.keys(moduleEvidence);
    if (eligibleModuleIds.length === 0) {
      console.log('[Developer Log] No confident taxonomy match found for top patterns.');
      const noRecRecord: RecommendationRecord = {
        id: `rec_none_${Date.now()}`,
        user_id: userId,
        cycle_id: cycleId,
        selected_module_id: null,
        triggering_pattern_id: 'NONE',
        triggering_pattern_name: 'No Match',
        matched_taxonomy_concern: 'NONE',
        match_confidence: 0.0,
        status: 'NO_RECOMMENDATION',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      IN_MEMORY_RECOMMENDATIONS[memoryKey] = noRecRecord;
      this.persistRecordToDb(noRecRecord);

      return {
        status: 'NO_RECOMMENDATION',
        recommendation: null
      };
    }

    // Find module with maximum total evidence weight
    let bestModuleId = eligibleModuleIds[0];
    let maxWeight = moduleEvidence[bestModuleId].totalWeight;

    for (const modId of eligibleModuleIds) {
      if (moduleEvidence[modId].totalWeight > maxWeight) {
        maxWeight = moduleEvidence[modId].totalWeight;
        bestModuleId = modId;
      }
    }

    const selectedEvidence = moduleEvidence[bestModuleId];
    console.log(`[Developer Log] Selected Module: ${bestModuleId} (Triggering Pattern: ${selectedEvidence.triggeringPattern.patternId}, Concern: ${selectedEvidence.topConcern})`);

    // Check user's current progress for this module to set appropriate status
    let status: RecommendationStatus = 'RECOMMENDED';
    const userState = await ModuleProgressService.getFullUserModuleState(userId, bestModuleId);
    if (userState.progress?.status === 'completed') {
      status = 'COMPLETED';
    } else if (userState.progress?.status === 'active' && userState.completedTouches.length > 0) {
      status = 'ACTIVE';
    }

    // Step 5: Persist Recommendation
    const newRecord: RecommendationRecord = {
      id: `rec_${Date.now()}`,
      user_id: userId,
      cycle_id: cycleId,
      selected_module_id: bestModuleId,
      triggering_pattern_id: selectedEvidence.triggeringPattern.patternId,
      triggering_pattern_name: selectedEvidence.triggeringPattern.title,
      matched_taxonomy_concern: selectedEvidence.topConcern,
      match_confidence: Math.round(maxWeight * 100) / 100,
      status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    IN_MEMORY_RECOMMENDATIONS[memoryKey] = newRecord;
    this.persistRecordToDb(newRecord);

    return this.buildResponseFromRecord(userId, newRecord);
  }

  /**
   * Helper to build clean backend response object from recommendation record.
   */
  private static async buildResponseFromRecord(
    userId: string,
    record: RecommendationRecord
  ): Promise<RecommendationResponse> {
    if (record.status === 'CRISIS_ROUTE' || record.status === 'NO_RECOMMENDATION' || !record.selected_module_id) {
      return {
        status: record.status,
        recommendation: null
      };
    }

    const catalogItem = await ModuleCatalogService.getModuleByIdOrSlug(record.selected_module_id);
    const userState = await ModuleProgressService.getFullUserModuleState(userId, record.selected_module_id);

    let purchaseStatus: 'unpurchased' | 'active' | 'completed' = 'unpurchased';
    if (userState.progress?.status === 'completed') {
      purchaseStatus = 'completed';
    } else if (userState.progress?.status === 'active') {
      purchaseStatus = 'active';
    }

    return {
      status: record.status,
      recommendation: {
        id: record.id,
        module: {
          id: catalogItem?.id || record.selected_module_id,
          name: catalogItem?.name || record.selected_module_id,
          slug: catalogItem?.slug || record.selected_module_id.toLowerCase(),
          price: catalogItem?.price || 349,
          currency: catalogItem?.currency || 'INR'
        },
        triggeringPattern: {
          patternId: record.triggering_pattern_id,
          title: record.triggering_pattern_name || record.triggering_pattern_id,
          score: 80
        },
        triggeringConcern: record.matched_taxonomy_concern,
        purchaseStatus
      }
    };
  }

  /**
   * Helper to asynchronously insert recommendation into Supabase DB.
   */
  private static async persistRecordToDb(record: RecommendationRecord) {
    try {
      await supabase
        .from('module_recommendations')
        .upsert(
          {
            id: record.id,
            user_id: record.user_id,
            cycle_id: record.cycle_id,
            selected_module_id: record.selected_module_id,
            triggering_pattern_id: record.triggering_pattern_id,
            triggering_pattern_name: record.triggering_pattern_name,
            matched_taxonomy_concern: record.matched_taxonomy_concern,
            match_confidence: record.match_confidence,
            status: record.status,
            updated_at: new Date().toISOString()
          },
          { onConflict: 'user_id,cycle_id' }
        );
    } catch (err) {
      console.warn('[ModuleRecommendationService] DB upsert failed, preserved in memory cache:', err);
    }
  }
}
