import { supabase } from '../db';

function hasLiveDatabase(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return Boolean(url && !url.includes('placeholder') && !url.includes('example.com'));
}

export type GoalStatus =
  | 'not_started'
  | 'in_progress'
  | 'needs_attention'
  | 'achieved'
  | 'paused'
  | 'revised';

export type GoalCategory =
  | 'anxiety_management'
  | 'emotional_regulation'
  | 'interpersonal_relationships'
  | 'life_transition'
  | 'career_academics'
  | 'habits_routines'
  | 'mindfulness_acceptance'
  | 'trauma_processing'
  | 'other';

export type LifeEventCategory =
  | 'career_education'
  | 'relationships_family'
  | 'health_wellness'
  | 'loss_bereavement'
  | 'relocation_home'
  | 'achievement_milestone'
  | 'financial_stress'
  | 'other';

export type EmotionalImpact =
  | 'positive'
  | 'neutral'
  | 'challenging'
  | 'mixed'
  | 'severe_distress';

export type ReviewStatus =
  | 'initiated'
  | 'pending_client_input'
  | 'client_submitted'
  | 'in_discussion'
  | 'completed';

export interface TherapeuticProfileHeader {
  id: string;
  relationship_id: string;
  therapist_account_id: string;
  user_id: string;
  review_cadence: string;
  intake_clarification_flags: Array<{ field: string; note: string; flagged_at: string }>;
  intake_last_reviewed_at: string | null;
  next_review_due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TherapeuticGoal {
  id: string;
  relationship_id: string;
  user_id: string;
  therapist_account_id: string;
  title: string;
  description: string;
  why_it_matters: string;
  category: GoalCategory;
  target_date: string | null;
  status: GoalStatus;
  progress_percentage: number;
  client_notes: string;
  therapist_feedback: string;
  created_by_role: 'client' | 'therapist';
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  history_count?: number;
}

export interface TherapeuticGoalHistory {
  id: string;
  goal_id: string;
  relationship_id: string;
  changed_by_role: 'client' | 'therapist';
  changed_by_id: string;
  previous_status: GoalStatus | null;
  new_status: GoalStatus;
  previous_progress: number | null;
  new_progress: number;
  change_reason: string;
  snapshot: Partial<TherapeuticGoal>;
  created_at: string;
}

export interface TherapeuticLifeEvent {
  id: string;
  relationship_id: string;
  user_id: string;
  therapist_account_id: string;
  title: string;
  category: LifeEventCategory;
  event_date: string;
  description: string;
  emotional_impact: EmotionalImpact;
  discuss_in_session: boolean;
  is_shared_with_therapist: boolean;
  created_at: string;
  updated_at: string;
}

export interface TherapeuticPeriodicReview {
  id: string;
  relationship_id: string;
  user_id: string;
  therapist_account_id: string;
  review_period_label: string;
  sessions_included: number;
  status: ReviewStatus;
  initiated_by_role: 'client' | 'therapist';
  initiated_at: string;
  client_submitted_at: string | null;
  completed_at: string | null;
  next_review_due_date: string | null;

  // Client perspective (client-authored)
  what_feels_better: string;
  what_remains_difficult: string;
  what_has_changed: string;
  next_focus: string;
  meeting_needs_rating: 'yes' | 'partially' | 'needs_adjustment' | 'no';

  // Therapist collaborative summary (client-visible)
  progress_observed: string;
  goals_progress_summary: string;
  barriers_and_challenges: string;
  life_events_impact: string;
  collaborative_next_steps: string;
  feedback_for_client: string;

  // Therapist internal notes (strictly isolated)
  internal_notes?: {
    clinical_notes_internal: string;
    clinical_risk_assessment_notes: string;
    diagnostic_impressions: string;
  } | null;

  created_at: string;
  updated_at: string;
}

export class TherapeuticProfileService {
  // In-memory state for dev isolation & test suites
  private static inMemoryProfiles: Map<string, TherapeuticProfileHeader> = new Map();
  private static inMemoryIntakes: Map<string, any> = new Map();
  private static inMemoryIntakeVersions: Map<string, any[]> = new Map();
  private static inMemoryGoals: Map<string, TherapeuticGoal> = new Map();
  private static inMemoryGoalHistory: Map<string, TherapeuticGoalHistory[]> = new Map();
  private static inMemoryLifeEvents: Map<string, TherapeuticLifeEvent> = new Map();
  private static inMemoryReviews: Map<string, TherapeuticPeriodicReview> = new Map();
  private static inMemoryReviewClinicalNotes: Map<string, any> = new Map();
  private static inMemoryRelationships: Map<string, any> = new Map();

  /**
   * Test helper to reset in-memory state.
   */
  static _resetMemoryState() {
    this.inMemoryProfiles.clear();
    this.inMemoryIntakes.clear();
    this.inMemoryIntakeVersions.clear();
    this.inMemoryGoals.clear();
    this.inMemoryGoalHistory.clear();
    this.inMemoryLifeEvents.clear();
    this.inMemoryReviews.clear();
    this.inMemoryReviewClinicalNotes.clear();
    this.inMemoryRelationships.clear();
  }

  /**
   * Test helper to register mock active relationship.
   */
  static registerMockRelationship(rel: {
    id: string;
    therapist_account_id: string;
    user_id: string;
    status: string;
    care_stage?: string;
  }) {
    this.inMemoryRelationships.set(rel.id, rel);
    this.inMemoryRelationships.set(`client:${rel.user_id}`, rel);
    this.inMemoryRelationships.set(`therapist:${rel.therapist_account_id}:${rel.user_id}`, rel);
  }

  /**
   * Test helper to register mock intake.
   */
  static setMockIntake(userId: string, intakeData: any) {
    this.inMemoryIntakes.set(userId, intakeData);
  }

  /**
   * Authoritatively resolves active relationship for client or therapist pair.
   */
  static async resolveRelationship(
    relationshipId?: string,
    userId?: string,
    therapistAccountId?: string
  ): Promise<any> {
    if (relationshipId) {
      const mock = this.inMemoryRelationships.get(relationshipId);
      if (mock) return mock;
    }

    if (therapistAccountId && userId) {
      const mockPair = this.inMemoryRelationships.get(`therapist:${therapistAccountId}:${userId}`);
      if (mockPair) return mockPair;
    }

    if (userId) {
      const mockClient = this.inMemoryRelationships.get(`client:${userId}`);
      if (mockClient) return mockClient;
    }

    if (!hasLiveDatabase()) return null;

    try {
      // Database lookup
      let query = supabase.from('therapy_care_relationships').select('*');
      if (relationshipId) {
        query = query.eq('id', relationshipId);
      } else if (therapistAccountId && userId) {
        query = query
          .eq('therapist_account_id', therapistAccountId)
          .eq('user_id', userId);
      } else if (userId) {
        query = query.eq('user_id', userId);
      } else {
        return null;
      }

      const { data: rels } = await query.order('started_at', { ascending: false });
      if (!rels || rels.length === 0) return null;
      return rels.find((r) => r.status === 'active') || rels[0];
    } catch {
      return null;
    }
  }

  // =========================================================================
  // MODULE A: INTAKE & BACKGROUND
  // =========================================================================

  /**
   * Retrieves intake form & background data for the therapeutic profile.
   */
  static async getRelationshipIntake(params: {
    relationshipId: string;
    accessorRole: 'client' | 'therapist';
    accessorId: string;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel) {
      const err: any = new Error('Relationship not found.');
      err.code = 'RELATIONSHIP_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    // Tenancy Check
    if (params.accessorRole === 'client' && rel.user_id !== params.accessorId) {
      const err: any = new Error('Unauthorized client access to relationship intake.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    if (
      params.accessorRole === 'therapist' &&
      rel.therapist_account_id !== params.accessorId
    ) {
      const err: any = new Error('Unauthorized therapist access to relationship intake.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    // 1. Fetch authoritative intake from in-memory or DB
    let intake: any = this.inMemoryIntakes.get(rel.user_id) || null;
    if (!intake) {
      try {
        const { data } = await supabase
          .from('therapy_intakes')
          .select('*')
          .eq('user_id', rel.user_id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        intake = data || null;
      } catch {}
    }

    // 2. Fetch profile metadata & flags
    let profile: TherapeuticProfileHeader | undefined = this.inMemoryProfiles.get(rel.id);
    if (!profile) {
      try {
        const { data: p } = await supabase
          .from('therapeutic_profiles')
          .select('*')
          .eq('relationship_id', rel.id)
          .maybeSingle();
        if (p) profile = p as TherapeuticProfileHeader;
      } catch {}
      if (!profile) {
        profile = {
          id: `prof_${rel.id}`,
          relationship_id: rel.id,
          therapist_account_id: rel.therapist_account_id,
          user_id: rel.user_id,
          review_cadence: 'every_6_sessions',
          intake_clarification_flags: [],
          intake_last_reviewed_at: null,
          next_review_due_date: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        this.inMemoryProfiles.set(rel.id, profile);
      }
    }
    const resolvedProfile: TherapeuticProfileHeader = profile;

    // 3. Fetch version history
    const versions = this.inMemoryIntakeVersions.get(rel.id) || [];

    const isSubmitted = Boolean(intake && (intake.presenting_reason || intake.concerns));
    const completionDate = intake?.created_at || rel.started_at || null;
    const lastUpdatedAt = intake?.updated_at || completionDate;

    return {
      relationshipId: rel.id,
      careStage: rel.care_stage,
      status: isSubmitted ? 'submitted' : 'incomplete',
      completionDate,
      lastUpdatedAt,
      versionCount: versions.length + 1,
      clarificationFlags: resolvedProfile.intake_clarification_flags || [],
      lastReviewedByTherapistAt: resolvedProfile.intake_last_reviewed_at || null,
      intake: intake
        ? {
            fullName: intake.full_name || '',
            age: intake.age || null,
            gender: intake.gender || '',
            occupation: intake.occupation || '',
            city: intake.city || '',
            livingSituation: intake.living_situation || '',
            presentingReason: intake.presenting_reason || '',
            concerns: intake.concerns || [],
            affectedLifeAreas: intake.affected_life_areas || [],
            ownWords: intake.own_words || '',
            mentalHealthHistory: intake.mental_health_history || {},
            copingAndSupport: intake.coping_and_support || {},
            expectations: intake.expectations || {},
            contactPreferences: intake.contact_preferences || {},
          }
        : null,
    };
  }

  /**
   * Allows the client to update permitted intake responses with version preservation.
   */
  static async updateClientIntake(params: {
    userId: string;
    relationshipId: string;
    updates: {
      concerns?: string[];
      affectedLifeAreas?: string[];
      ownWords?: string;
      expectations?: Record<string, any>;
      copingAndSupport?: Record<string, any>;
      contactPreferences?: Record<string, any>;
    };
    updateSummary?: string;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel || rel.user_id !== params.userId) {
      const err: any = new Error('Relationship not found or not owned by user.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    // Fetch existing intake from in-memory or DB
    let existing: any = this.inMemoryIntakes.get(params.userId) || null;
    if (!existing) {
      try {
        const { data } = await supabase
          .from('therapy_intakes')
          .select('*')
          .eq('user_id', params.userId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
        existing = data || null;
      } catch {}
    }

    const nowIso = new Date().toISOString();

    // Preserve previous version
    if (existing) {
      const versions = this.inMemoryIntakeVersions.get(rel.id) || [];
      const newVersion = {
        id: `v_${Date.now()}`,
        relationship_id: rel.id,
        user_id: params.userId,
        version_number: versions.length + 1,
        intake_data: existing,
        update_summary: params.updateSummary || 'Client updated intake responses',
        updated_by: params.userId,
        created_at: nowIso,
      };
      versions.push(newVersion);
      this.inMemoryIntakeVersions.set(rel.id, versions);

      try {
        await supabase.from('therapeutic_intake_versions').insert(newVersion);
      } catch {}
    }

    // Apply updates to therapy_intakes
    const updatedPayload: Record<string, any> = {
      updated_at: nowIso,
    };
    if (params.updates.concerns !== undefined) updatedPayload.concerns = params.updates.concerns;
    if (params.updates.affectedLifeAreas !== undefined)
      updatedPayload.affected_life_areas = params.updates.affectedLifeAreas;
    if (params.updates.ownWords !== undefined) updatedPayload.own_words = params.updates.ownWords;
    if (params.updates.expectations !== undefined)
      updatedPayload.expectations = params.updates.expectations;
    if (params.updates.copingAndSupport !== undefined)
      updatedPayload.coping_and_support = params.updates.copingAndSupport;
    if (params.updates.contactPreferences !== undefined)
      updatedPayload.contact_preferences = params.updates.contactPreferences;

    if (existing) {
      this.inMemoryIntakes.set(params.userId, { ...existing, ...updatedPayload });
    }

    if (existing?.id) {
      try {
        await supabase
          .from('therapy_intakes')
          .update(updatedPayload)
          .eq('id', existing.id);
      } catch {}
    }

    return {
      success: true,
      lastUpdatedAt: nowIso,
      versionCount: (this.inMemoryIntakeVersions.get(rel.id)?.length || 0) + 1,
    };
  }

  /**
   * Allows therapist to flag clarification questions or record intake review.
   */
  static async setTherapistIntakeClarification(params: {
    therapistAccountId: string;
    relationshipId: string;
    clarificationFlags?: Array<{ field: string; note: string }>;
    markReviewed?: boolean;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel || rel.therapist_account_id !== params.therapistAccountId) {
      const err: any = new Error('Relationship not found or therapist not assigned.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    const nowIso = new Date().toISOString();
    let profile = this.inMemoryProfiles.get(rel.id) || {
      id: `prof_${rel.id}`,
      relationship_id: rel.id,
      therapist_account_id: rel.therapist_account_id,
      user_id: rel.user_id,
      review_cadence: 'every_6_sessions',
      intake_clarification_flags: [],
      intake_last_reviewed_at: null,
      next_review_due_date: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    if (params.clarificationFlags !== undefined) {
      profile.intake_clarification_flags = params.clarificationFlags.map((f) => ({
        field: f.field,
        note: f.note,
        flagged_at: nowIso,
      }));
    }

    if (params.markReviewed) {
      profile.intake_last_reviewed_at = nowIso;
    }

    profile.updated_at = nowIso;
    this.inMemoryProfiles.set(rel.id, profile);

    try {
      await supabase
        .from('therapeutic_profiles')
        .upsert(profile, { onConflict: 'relationship_id' });
    } catch {}

    return {
      success: true,
      clarificationFlags: profile.intake_clarification_flags,
      intakeLastReviewedAt: profile.intake_last_reviewed_at,
    };
  }

  // =========================================================================
  // MODULE B: GOALS MANAGEMENT
  // =========================================================================

  /**
   * Retrieves goals for a relationship, sorted into active, achieved, and paused.
   */
  static async getRelationshipGoals(params: {
    relationshipId: string;
    accessorRole: 'client' | 'therapist';
    accessorId: string;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel) {
      const err: any = new Error('Relationship not found.');
      err.code = 'RELATIONSHIP_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (params.accessorRole === 'client' && rel.user_id !== params.accessorId) {
      const err: any = new Error('Unauthorized client access to goals.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    if (params.accessorRole === 'therapist' && rel.therapist_account_id !== params.accessorId) {
      const err: any = new Error('Unauthorized therapist access to goals.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    // Collect goals from in-memory and/or DB
    let goals: TherapeuticGoal[] = [];
    for (const g of this.inMemoryGoals.values()) {
      if (g.relationship_id === rel.id) {
        const hist = this.inMemoryGoalHistory.get(g.id) || [];
        goals.push({ ...g, history_count: hist.length });
      }
    }

    if (hasLiveDatabase()) {
      try {
        const { data: dbGoals } = await supabase
          .from('therapeutic_goals')
          .select('*')
          .eq('relationship_id', rel.id)
          .order('created_at', { ascending: false });

        if (dbGoals && dbGoals.length > 0) {
          const dbIds = new Set(goals.map((g) => g.id));
          for (const dg of dbGoals) {
            if (!dbIds.has(dg.id)) {
              goals.push({
                id: dg.id,
                relationship_id: dg.relationship_id,
                user_id: dg.user_id,
                therapist_account_id: dg.therapist_account_id,
                title: dg.title,
                description: dg.description || '',
                why_it_matters: dg.why_it_matters || '',
                category: dg.category || 'anxiety_management',
                target_date: dg.target_date || null,
                status: dg.status || 'in_progress',
                progress_percentage: dg.progress_percentage || 0,
                client_notes: dg.client_notes || '',
                therapist_feedback: dg.therapist_feedback || '',
                created_by_role: dg.created_by_role || 'client',
                completed_at: dg.completed_at || null,
                created_at: dg.created_at,
                updated_at: dg.updated_at,
              });
            }
          }
        }
      } catch {}
    }

    // Grouping
    const active = goals.filter((g) =>
      ['not_started', 'in_progress', 'needs_attention', 'revised'].includes(g.status)
    );
    const achieved = goals.filter((g) => g.status === 'achieved');
    const paused = goals.filter((g) => g.status === 'paused');

    return {
      relationshipId: rel.id,
      totalCount: goals.length,
      active,
      achieved,
      paused,
    };
  }

  /**
   * Creates a new collaborative goal.
   */
  static async createGoal(params: {
    relationshipId: string;
    creatorRole: 'client' | 'therapist';
    creatorId: string;
    title: string;
    description?: string;
    whyItMatters?: string;
    category?: GoalCategory;
    targetDate?: string | null;
    status?: GoalStatus;
    progressPercentage?: number;
    clientNotes?: string;
    therapistFeedback?: string;
  }) {
    if (!params.title || !params.title.trim()) {
      const err: any = new Error('Goal title is required.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel) {
      const err: any = new Error('Relationship not found.');
      err.code = 'RELATIONSHIP_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (params.creatorRole === 'client' && rel.user_id !== params.creatorId) {
      const err: any = new Error('Unauthorized: Client not associated with this relationship.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    if (params.creatorRole === 'therapist' && rel.therapist_account_id !== params.creatorId) {
      const err: any = new Error('Unauthorized: Therapist not assigned to this relationship.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    const nowIso = new Date().toISOString();
    const id = `goal_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const status: GoalStatus = params.status || 'in_progress';
    const progress = status === 'achieved' ? 100 : params.progressPercentage || 0;

    const goal: TherapeuticGoal = {
      id,
      relationship_id: rel.id,
      user_id: rel.user_id,
      therapist_account_id: rel.therapist_account_id,
      title: params.title.trim(),
      description: params.description?.trim() || '',
      why_it_matters: params.whyItMatters?.trim() || '',
      category: params.category || 'anxiety_management',
      target_date: params.targetDate || null,
      status,
      progress_percentage: progress,
      client_notes: params.clientNotes?.trim() || '',
      therapist_feedback: params.therapistFeedback?.trim() || '',
      created_by_role: params.creatorRole,
      completed_at: status === 'achieved' ? nowIso : null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    this.inMemoryGoals.set(id, goal);

    // Initial history record
    const histEntry: TherapeuticGoalHistory = {
      id: `gh_${Date.now()}`,
      goal_id: id,
      relationship_id: rel.id,
      changed_by_role: params.creatorRole,
      changed_by_id: params.creatorId,
      previous_status: null,
      new_status: status,
      previous_progress: null,
      new_progress: progress,
      change_reason: 'Goal created',
      snapshot: { ...goal },
      created_at: nowIso,
    };
    this.inMemoryGoalHistory.set(id, [histEntry]);

    if (hasLiveDatabase()) {
      try {
        await supabase.from('therapeutic_goals').insert(goal);
        await supabase.from('therapeutic_goal_history').insert(histEntry);
      } catch {}
    }

    return goal;
  }

  /**
   * Collaboratively updates a goal, preserving complete audit history.
   */
  static async updateGoal(params: {
    relationshipId: string;
    goalId: string;
    updaterRole: 'client' | 'therapist';
    updaterId: string;
    updates: {
      title?: string;
      description?: string;
      whyItMatters?: string;
      category?: GoalCategory;
      targetDate?: string | null;
      status?: GoalStatus;
      progressPercentage?: number;
      clientNotes?: string;
      therapistFeedback?: string;
    };
    changeReason?: string;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel) {
      const err: any = new Error('Relationship not found.');
      err.code = 'RELATIONSHIP_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (params.updaterRole === 'client' && rel.user_id !== params.updaterId) {
      const err: any = new Error('Unauthorized client.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    if (params.updaterRole === 'therapist' && rel.therapist_account_id !== params.updaterId) {
      const err: any = new Error('Unauthorized therapist.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    let goal = this.inMemoryGoals.get(params.goalId);
    if (!goal && hasLiveDatabase()) {
      try {
        const { data: dbGoal } = await supabase
          .from('therapeutic_goals')
          .select('*')
          .eq('id', params.goalId)
          .eq('relationship_id', rel.id)
          .maybeSingle();

          if (dbGoal) {
            goal = {
              id: dbGoal.id,
              relationship_id: dbGoal.relationship_id,
              user_id: dbGoal.user_id,
              therapist_account_id: dbGoal.therapist_account_id,
              title: dbGoal.title,
              description: dbGoal.description || '',
              why_it_matters: dbGoal.why_it_matters || '',
              category: dbGoal.category || 'anxiety_management',
              target_date: dbGoal.target_date || null,
              status: dbGoal.status || 'in_progress',
              progress_percentage: dbGoal.progress_percentage || 0,
              client_notes: dbGoal.client_notes || '',
              therapist_feedback: dbGoal.therapist_feedback || '',
              created_by_role: dbGoal.created_by_role || 'client',
              completed_at: dbGoal.completed_at || null,
              created_at: dbGoal.created_at,
              updated_at: dbGoal.updated_at,
            };
          }
        } catch {}
      }

    if (!goal || goal.relationship_id !== rel.id) {
      const err: any = new Error('Goal not found in this relationship.');
      err.code = 'GOAL_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    const previousStatus = goal.status;
    const previousProgress = goal.progress_percentage;
    const nowIso = new Date().toISOString();

    const newStatus = params.updates.status || goal.status;
    let newProgress =
      params.updates.progressPercentage !== undefined
        ? params.updates.progressPercentage
        : goal.progress_percentage;

    if (newStatus === 'achieved') {
      newProgress = 100;
    }

    const updatedGoal: TherapeuticGoal = {
      ...goal,
      title: params.updates.title !== undefined ? params.updates.title.trim() : goal.title,
      description:
        params.updates.description !== undefined
          ? params.updates.description.trim()
          : goal.description,
      why_it_matters:
        params.updates.whyItMatters !== undefined
          ? params.updates.whyItMatters.trim()
          : goal.why_it_matters,
      category: params.updates.category || goal.category,
      target_date:
        params.updates.targetDate !== undefined ? params.updates.targetDate : goal.target_date,
      status: newStatus,
      progress_percentage: newProgress,
      client_notes:
        params.updates.clientNotes !== undefined
          ? params.updates.clientNotes.trim()
          : goal.client_notes,
      therapist_feedback:
        params.updates.therapistFeedback !== undefined
          ? params.updates.therapistFeedback.trim()
          : goal.therapist_feedback,
      completed_at:
        newStatus === 'achieved'
          ? goal.completed_at || nowIso
          : null,
      updated_at: nowIso,
    };

    this.inMemoryGoals.set(goal.id, updatedGoal);

    // Save history
    const hist = this.inMemoryGoalHistory.get(goal.id) || [];
    const histEntry: TherapeuticGoalHistory = {
      id: `gh_${Date.now()}`,
      goal_id: goal.id,
      relationship_id: rel.id,
      changed_by_role: params.updaterRole,
      changed_by_id: params.updaterId,
      previous_status: previousStatus,
      new_status: newStatus,
      previous_progress: previousProgress,
      new_progress: newProgress,
      change_reason: params.changeReason || `Updated by ${params.updaterRole}`,
      snapshot: { ...updatedGoal },
      created_at: nowIso,
    };
    hist.push(histEntry);
    this.inMemoryGoalHistory.set(goal.id, hist);

    if (hasLiveDatabase()) {
      try {
        await supabase
          .from('therapeutic_goals')
          .update(updatedGoal)
          .eq('id', goal.id);
        await supabase.from('therapeutic_goal_history').insert(histEntry);
      } catch {}
    }

    return updatedGoal;
  }

  /**
   * Retrieves audit change history for a goal.
   */
  static async getGoalHistory(params: {
    relationshipId: string;
    goalId: string;
    accessorRole: 'client' | 'therapist';
    accessorId: string;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel) {
      const err: any = new Error('Relationship not found.');
      err.code = 'RELATIONSHIP_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (params.accessorRole === 'client' && rel.user_id !== params.accessorId) {
      const err: any = new Error('Unauthorized.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    if (params.accessorRole === 'therapist' && rel.therapist_account_id !== params.accessorId) {
      const err: any = new Error('Unauthorized.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    const hist = this.inMemoryGoalHistory.get(params.goalId) || [];
    return hist.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  // =========================================================================
  // MODULE C: PERSONAL LIFE EVENTS & MILESTONES
  // =========================================================================

  /**
   * Retrieves life events for the client (shows both private and shared).
   */
  static async getClientLifeEvents(userId: string, relationshipId?: string) {
    let events: TherapeuticLifeEvent[] = [];
    for (const e of this.inMemoryLifeEvents.values()) {
      if (e.user_id === userId) {
        if (!relationshipId || e.relationship_id === relationshipId) {
          events.push(e);
        }
      }
    }

    if (hasLiveDatabase()) {
      try {
        let query = supabase.from('therapeutic_life_events').select('*').eq('user_id', userId);
        if (relationshipId) query = query.eq('relationship_id', relationshipId);
        const { data: dbEvents } = await query.order('event_date', { ascending: false });

        if (dbEvents && dbEvents.length > 0) {
          const memIds = new Set(events.map((e) => e.id));
          for (const de of dbEvents) {
            if (!memIds.has(de.id)) events.push(de);
          }
        }
      } catch {}
    }

    return events.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  }

  /**
   * Retrieves life events for the therapist.
   * STRICT PRIVACY BOUNDARY: MUST filter `is_shared_with_therapist = true`.
   * Private events are strictly omitted.
   */
  static async getTherapistSharedLifeEvents(therapistAccountId: string, relationshipId: string) {
    const rel = await this.resolveRelationship(relationshipId);
    if (!rel || rel.therapist_account_id !== therapistAccountId) {
      const err: any = new Error('Unauthorized: Therapist not assigned to this relationship.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    let sharedEvents: TherapeuticLifeEvent[] = [];
    for (const e of this.inMemoryLifeEvents.values()) {
      if (
        e.relationship_id === rel.id &&
        e.therapist_account_id === therapistAccountId &&
        e.is_shared_with_therapist === true
      ) {
        sharedEvents.push(e);
      }
    }

    if (hasLiveDatabase()) {
      try {
        const { data: dbEvents } = await supabase
          .from('therapeutic_life_events')
          .select('*')
          .eq('relationship_id', rel.id)
          .eq('therapist_account_id', therapistAccountId)
          .eq('is_shared_with_therapist', true)
          .order('event_date', { ascending: false });

        if (dbEvents && dbEvents.length > 0) {
          const memIds = new Set(sharedEvents.map((e) => e.id));
          for (const de of dbEvents) {
            if (!memIds.has(de.id)) sharedEvents.push(de);
          }
        }
      } catch {}
    }

    return sharedEvents.sort((a, b) => new Date(b.event_date).getTime() - new Date(a.event_date).getTime());
  }

  /**
   * Client creates a new life event.
   */
  static async createLifeEvent(params: {
    userId: string;
    relationshipId: string;
    title: string;
    category?: LifeEventCategory;
    eventDate: string;
    description?: string;
    emotionalImpact?: EmotionalImpact;
    discussInSession?: boolean;
    isSharedWithTherapist?: boolean;
  }) {
    if (!params.title || !params.title.trim()) {
      const err: any = new Error('Life event title is required.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }
    if (!params.eventDate) {
      const err: any = new Error('Event date is required.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel || rel.user_id !== params.userId) {
      const err: any = new Error('Unauthorized client.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    const nowIso = new Date().toISOString();
    const id = `ev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const event: TherapeuticLifeEvent = {
      id,
      relationship_id: rel.id,
      user_id: params.userId,
      therapist_account_id: rel.therapist_account_id,
      title: params.title.trim(),
      category: params.category || 'other',
      event_date: params.eventDate,
      description: params.description?.trim() || '',
      emotional_impact: params.emotionalImpact || 'neutral',
      discuss_in_session: Boolean(params.discussInSession),
      is_shared_with_therapist: Boolean(params.isSharedWithTherapist),
      created_at: nowIso,
      updated_at: nowIso,
    };

    this.inMemoryLifeEvents.set(id, event);

    if (hasLiveDatabase()) {
      try {
        await supabase.from('therapeutic_life_events').insert(event);
      } catch {}
    }

    return event;
  }

  /**
   * Client updates their life event.
   */
  static async updateLifeEvent(params: {
    userId: string;
    eventId: string;
    updates: {
      title?: string;
      category?: LifeEventCategory;
      eventDate?: string;
      description?: string;
      emotionalImpact?: EmotionalImpact;
      discussInSession?: boolean;
      isSharedWithTherapist?: boolean;
    };
  }) {
    let event = this.inMemoryLifeEvents.get(params.eventId);
    if (!event && hasLiveDatabase()) {
      try {
        const { data: dbEv } = await supabase
          .from('therapeutic_life_events')
          .select('*')
          .eq('id', params.eventId)
          .maybeSingle();
        if (dbEv) event = dbEv;
      } catch {}
    }

    if (!event || event.user_id !== params.userId) {
      const err: any = new Error('Life event not found or not owned by user.');
      err.code = 'NOT_FOUND_OR_FORBIDDEN';
      err.status = 404;
      throw err;
    }

    const nowIso = new Date().toISOString();
    const updated: TherapeuticLifeEvent = {
      ...event,
      title: params.updates.title !== undefined ? params.updates.title.trim() : event.title,
      category: params.updates.category || event.category,
      event_date: params.updates.eventDate || event.event_date,
      description:
        params.updates.description !== undefined
          ? params.updates.description.trim()
          : event.description,
      emotional_impact: params.updates.emotionalImpact || event.emotional_impact,
      discuss_in_session:
        params.updates.discussInSession !== undefined
          ? params.updates.discussInSession
          : event.discuss_in_session,
      is_shared_with_therapist:
        params.updates.isSharedWithTherapist !== undefined
          ? params.updates.isSharedWithTherapist
          : event.is_shared_with_therapist,
      updated_at: nowIso,
    };

    this.inMemoryLifeEvents.set(params.eventId, updated);

    if (hasLiveDatabase()) {
      try {
        await supabase
          .from('therapeutic_life_events')
          .update(updated)
          .eq('id', params.eventId);
      } catch {}
    }

    return updated;
  }

  /**
   * Client deletes their life event.
   */
  static async deleteLifeEvent(userId: string, eventId: string) {
    let event = this.inMemoryLifeEvents.get(eventId);
    if (!event && hasLiveDatabase()) {
      try {
        const { data: dbEv } = await supabase
          .from('therapeutic_life_events')
          .select('*')
          .eq('id', eventId)
          .maybeSingle();
        if (dbEv) event = dbEv;
      } catch {}
    }

    if (!event || event.user_id !== userId) {
      const err: any = new Error('Life event not found or unauthorized.');
      err.code = 'NOT_FOUND_OR_FORBIDDEN';
      err.status = 404;
      throw err;
    }

    this.inMemoryLifeEvents.delete(eventId);

    if (hasLiveDatabase()) {
      try {
        await supabase
          .from('therapeutic_life_events')
          .delete()
          .eq('id', eventId)
          .eq('user_id', userId);
      } catch {}
    }

    return { success: true };
  }

  // =========================================================================
  // MODULE D: PERIODIC SESSION REVIEWS
  // =========================================================================

  /**
   * Retrieves periodic reviews for a relationship.
   * Separates client-facing summary from therapist internal notes.
   */
  static async getPeriodicReviews(params: {
    relationshipId: string;
    accessorRole: 'client' | 'therapist';
    accessorId: string;
  }) {
    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel) {
      const err: any = new Error('Relationship not found.');
      err.code = 'RELATIONSHIP_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (params.accessorRole === 'client' && rel.user_id !== params.accessorId) {
      const err: any = new Error('Unauthorized client.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    if (params.accessorRole === 'therapist' && rel.therapist_account_id !== params.accessorId) {
      const err: any = new Error('Unauthorized therapist.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    let reviews: TherapeuticPeriodicReview[] = [];
    for (const r of this.inMemoryReviews.values()) {
      if (r.relationship_id === rel.id) {
        if (params.accessorRole === 'therapist') {
          const notes = this.inMemoryReviewClinicalNotes.get(r.id) || null;
          reviews.push({ ...r, internal_notes: notes });
        } else {
          // PRIVACY: strip internal notes completely
          const { internal_notes, ...clientSafe } = r;
          reviews.push(clientSafe);
        }
      }
    }

    if (hasLiveDatabase()) {
      try {
        const { data: dbReviews } = await supabase
          .from('therapeutic_periodic_reviews')
          .select('*')
          .eq('relationship_id', rel.id)
          .order('created_at', { ascending: false });

        if (dbReviews && dbReviews.length > 0) {
          const memIds = new Set(reviews.map((r) => r.id));
          for (const dr of dbReviews) {
            if (!memIds.has(dr.id)) {
              let internalNotes = null;
              if (params.accessorRole === 'therapist') {
                const { data: n } = await supabase
                  .from('therapeutic_review_clinical_notes')
                  .select('*')
                  .eq('review_id', dr.id)
                  .maybeSingle();
                internalNotes = n || null;
              }

              reviews.push({
                ...dr,
                internal_notes: internalNotes,
              });
            }
          }
        }
      } catch {}
    }

    return reviews.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  /**
   * Therapist initiates a periodic review.
   */
  static async initiatePeriodicReview(params: {
    therapistAccountId: string;
    relationshipId: string;
    reviewPeriodLabel: string;
    sessionsIncluded?: number;
    nextReviewDueDate?: string | null;
  }) {
    if (!params.reviewPeriodLabel || !params.reviewPeriodLabel.trim()) {
      const err: any = new Error('Review period label is required.');
      err.code = 'INVALID_INPUT';
      err.status = 400;
      throw err;
    }

    const rel = await this.resolveRelationship(params.relationshipId);
    if (!rel || rel.therapist_account_id !== params.therapistAccountId) {
      const err: any = new Error('Unauthorized therapist.');
      err.code = 'UNAUTHORIZED_ACCESS';
      err.status = 403;
      throw err;
    }

    const nowIso = new Date().toISOString();
    const id = `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const review: TherapeuticPeriodicReview = {
      id,
      relationship_id: rel.id,
      user_id: rel.user_id,
      therapist_account_id: params.therapistAccountId,
      review_period_label: params.reviewPeriodLabel.trim(),
      sessions_included: params.sessionsIncluded || 0,
      status: 'pending_client_input',
      initiated_by_role: 'therapist',
      initiated_at: nowIso,
      client_submitted_at: null,
      completed_at: null,
      next_review_due_date: params.nextReviewDueDate || null,
      what_feels_better: '',
      what_remains_difficult: '',
      what_has_changed: '',
      next_focus: '',
      meeting_needs_rating: 'yes',
      progress_observed: '',
      goals_progress_summary: '',
      barriers_and_challenges: '',
      life_events_impact: '',
      collaborative_next_steps: '',
      feedback_for_client: '',
      created_at: nowIso,
      updated_at: nowIso,
    };

    this.inMemoryReviews.set(id, review);

    if (hasLiveDatabase()) {
      try {
        await supabase.from('therapeutic_periodic_reviews').insert(review);
      } catch {}
    }

    return review;
  }

  /**
   * Client submits their perspective for an initiated periodic review.
   */
  static async submitClientReviewResponse(params: {
    userId: string;
    reviewId: string;
    responses: {
      whatFeelsBetter: string;
      whatRemainsDifficult: string;
      whatHasChanged: string;
      nextFocus?: string;
      meetingNeedsRating?: 'yes' | 'partially' | 'needs_adjustment' | 'no';
    };
  }) {
    let review = this.inMemoryReviews.get(params.reviewId);
    if (!review && hasLiveDatabase()) {
      try {
        const { data: dbRev } = await supabase
          .from('therapeutic_periodic_reviews')
          .select('*')
          .eq('id', params.reviewId)
          .maybeSingle();
        if (dbRev) review = dbRev;
      } catch {}
    }

    if (!review || review.user_id !== params.userId) {
      const err: any = new Error('Review not found or unauthorized.');
      err.code = 'NOT_FOUND_OR_FORBIDDEN';
      err.status = 404;
      throw err;
    }

    const nowIso = new Date().toISOString();
    const updatedReview: TherapeuticPeriodicReview = {
      ...review,
      status: 'client_submitted',
      client_submitted_at: nowIso,
      what_feels_better: params.responses.whatFeelsBetter?.trim() || '',
      what_remains_difficult: params.responses.whatRemainsDifficult?.trim() || '',
      what_has_changed: params.responses.whatHasChanged?.trim() || '',
      next_focus: params.responses.nextFocus?.trim() || '',
      meeting_needs_rating: params.responses.meetingNeedsRating || 'yes',
      updated_at: nowIso,
    };

    this.inMemoryReviews.set(params.reviewId, updatedReview);

    if (hasLiveDatabase()) {
      try {
        await supabase
          .from('therapeutic_periodic_reviews')
          .update(updatedReview)
          .eq('id', params.reviewId);
      } catch {}
    }

    return updatedReview;
  }

  /**
   * Therapist completes the periodic review, recording collaborative client-visible feedback
   * and strictly isolated internal clinical notes.
   */
  static async completePeriodicReview(params: {
    therapistAccountId: string;
    reviewId: string;
    feedback: {
      progressObserved: string;
      goalsProgressSummary?: string;
      barriersAndChallenges?: string;
      lifeEventsImpact?: string;
      collaborativeNextSteps?: string;
      feedbackForClient?: string;
      nextReviewDueDate?: string | null;
    };
    internalClinicalNotes?: {
      clinicalNotesInternal: string;
      clinicalRiskAssessmentNotes?: string;
      diagnosticImpressions?: string;
    };
  }) {
    let review = this.inMemoryReviews.get(params.reviewId);
    if (!review && hasLiveDatabase()) {
      try {
        const { data: dbRev } = await supabase
          .from('therapeutic_periodic_reviews')
          .select('*')
          .eq('id', params.reviewId)
          .maybeSingle();
        if (dbRev) review = dbRev;
      } catch {}
    }

    if (!review || review.therapist_account_id !== params.therapistAccountId) {
      const err: any = new Error('Review not found or unauthorized therapist.');
      err.code = 'NOT_FOUND_OR_FORBIDDEN';
      err.status = 404;
      throw err;
    }

    const nowIso = new Date().toISOString();

    const updatedReview: TherapeuticPeriodicReview = {
      ...review,
      status: 'completed',
      completed_at: nowIso,
      next_review_due_date: params.feedback.nextReviewDueDate || review.next_review_due_date,
      progress_observed: params.feedback.progressObserved?.trim() || '',
      goals_progress_summary: params.feedback.goalsProgressSummary?.trim() || '',
      barriers_and_challenges: params.feedback.barriersAndChallenges?.trim() || '',
      life_events_impact: params.feedback.lifeEventsImpact?.trim() || '',
      collaborative_next_steps: params.feedback.collaborativeNextSteps?.trim() || '',
      feedback_for_client: params.feedback.feedbackForClient?.trim() || '',
      updated_at: nowIso,
    };

    this.inMemoryReviews.set(params.reviewId, updatedReview);

    // Save internal clinical notes in separate isolation store
    if (params.internalClinicalNotes) {
      const noteEntry = {
        id: `rcn_${params.reviewId}`,
        review_id: params.reviewId,
        relationship_id: review.relationship_id,
        therapist_account_id: params.therapistAccountId,
        clinical_notes_internal: params.internalClinicalNotes.clinicalNotesInternal?.trim() || '',
        clinical_risk_assessment_notes:
          params.internalClinicalNotes.clinicalRiskAssessmentNotes?.trim() || '',
        diagnostic_impressions: params.internalClinicalNotes.diagnosticImpressions?.trim() || '',
        created_at: nowIso,
        updated_at: nowIso,
      };
      this.inMemoryReviewClinicalNotes.set(params.reviewId, noteEntry);

      if (hasLiveDatabase()) {
        try {
          await supabase
            .from('therapeutic_review_clinical_notes')
            .upsert(noteEntry, { onConflict: 'review_id' });
        } catch {}
      }
    }

    if (hasLiveDatabase()) {
      try {
        await supabase
          .from('therapeutic_periodic_reviews')
          .update(updatedReview)
          .eq('id', params.reviewId);
      } catch {}
    }

    return updatedReview;
  }

  // =========================================================================
  // MODULE E: OVERVIEW & COMPACT SUMMARY
  // =========================================================================

  /**
   * Generates compact summary for the Client Portal Overview card.
   */
  static async getTherapeuticProfileOverview(userId: string) {
    const rel = await this.resolveRelationship(undefined, userId);
    if (!rel) {
      return {
        hasProfile: false,
        relationshipId: null,
        intakeStatus: 'not_started',
        intakeCompletedAt: null,
        activeGoalsCount: 0,
        recentlyAchievedGoals: [],
        sharedLifeEventsCount: 0,
        recentSharedLifeEvents: [],
        lastCompletedReview: null,
        nextReviewDueDate: null,
      };
    }

    // 1. Intake status
    const intakeRes = await this.getRelationshipIntake({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: userId,
    });

    // 2. Goals
    const goalsRes = await this.getRelationshipGoals({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: userId,
    });

    // 3. Life Events (shared only)
    const allEvents = await this.getClientLifeEvents(userId, rel.id);
    const sharedEvents = allEvents.filter((e) => e.is_shared_with_therapist);

    // 4. Periodic Reviews
    const reviews = await this.getPeriodicReviews({
      relationshipId: rel.id,
      accessorRole: 'client',
      accessorId: userId,
    });
    const completedReviews = reviews.filter((r) => r.status === 'completed');
    const lastCompleted = completedReviews[0] || null;
    const nextDue =
      lastCompleted?.next_review_due_date ||
      reviews.find((r) => r.next_review_due_date)?.next_review_due_date ||
      null;

    return {
      hasProfile: true,
      relationshipId: rel.id,
      therapistAccountId: rel.therapist_account_id,
      careStage: rel.care_stage,
      intakeStatus: intakeRes.status,
      intakeCompletedAt: intakeRes.completionDate,
      intakeLastUpdatedAt: intakeRes.lastUpdatedAt,
      activeGoalsCount: goalsRes.active.length,
      recentlyAchievedGoals: goalsRes.achieved.slice(0, 3).map((g) => ({
        id: g.id,
        title: g.title,
        completedAt: g.completed_at,
      })),
      sharedLifeEventsCount: sharedEvents.length,
      totalLifeEventsCount: allEvents.length,
      recentSharedLifeEvents: sharedEvents.slice(0, 3).map((e) => ({
        id: e.id,
        title: e.title,
        eventDate: e.event_date,
        discussInSession: e.discuss_in_session,
      })),
      lastCompletedReview: lastCompleted
        ? {
            id: lastCompleted.id,
            label: lastCompleted.review_period_label,
            completedAt: lastCompleted.completed_at,
          }
        : null,
      nextReviewDueDate: nextDue,
    };
  }
}

export const therapeuticProfileService = TherapeuticProfileService;

