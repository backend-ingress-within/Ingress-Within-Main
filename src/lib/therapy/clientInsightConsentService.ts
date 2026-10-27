import { supabase } from '../db';
import { PatternIntelligenceService } from '../patterns/patternIntelligenceService';
import { VocabularyIntelligenceService } from '../vocab/vocabIntelligenceService';
import { resolveCycleAndEntries, compileRealCycleReport } from '../reports/cycleReportBuilder';

export type ClientInsightCategory =
  | 'pattern_summary'
  | 'emotional_vocabulary'
  | 'weekly_reports'
  | 'monthly_reports';

export interface ClientInsightSharingConsent {
  id: string;
  client_id: string;
  therapist_account_id: string | null;
  relationship_id: string | null;
  is_enabled: boolean;
  share_pattern_summary: boolean;
  share_emotional_vocabulary: boolean;
  share_weekly_reports: boolean;
  share_monthly_reports: boolean;
  consent_version: string;
  consented_at: string | null;
  revoked_at: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ConsentVerificationResult {
  authorized: boolean;
  reason?: string;
  relationshipActive: boolean;
  consentGranted: boolean;
  categoryAuthorized: boolean;
  consent?: ClientInsightSharingConsent | null;
  clientId?: string;
  relationshipId?: string;
}

export class ClientInsightConsentService {
  // In-memory fallback map for environments or test suites without table migrations
  private static inMemoryConsents: Map<string, ClientInsightSharingConsent> = new Map();
  private static inMemoryRelationships: Map<string, any> = new Map();

  /**
   * Helper for tests to reset state.
   */
  static _resetMemoryState() {
    this.inMemoryConsents.clear();
    this.inMemoryRelationships.clear();
  }

  /**
   * Registers an in-memory relationship for testing or dev isolation.
   */
  static registerMockRelationship(relationship: {
    id: string;
    therapist_account_id: string;
    user_id: string;
    status: string;
    therapist_name?: string;
  }) {
    const key = `${relationship.therapist_account_id}:${relationship.user_id}`;
    this.inMemoryRelationships.set(key, relationship);
    this.inMemoryRelationships.set(`client:${relationship.user_id}`, relationship);
  }

  /**
   * Authoritative lookup of a client's currently active therapist and care relationship.
   */
  static async getActiveRelationship(clientId: string): Promise<{
    relationshipId: string | null;
    therapistAccountId: string | null;
    therapistName: string | null;
    status: string | null;
  }> {
    if (!clientId) {
      return { relationshipId: null, therapistAccountId: null, therapistName: null, status: null };
    }

    const mockRel = this.inMemoryRelationships.get(`client:${clientId}`);
    if (mockRel) {
      return {
        relationshipId: mockRel.id,
        therapistAccountId: mockRel.therapist_account_id,
        therapistName: mockRel.therapist_name || 'Assigned Therapist',
        status: mockRel.status,
      };
    }

    try {
      const { data, error } = await supabase
        .from('therapy_care_relationships')
        .select(`
          id,
          therapist_account_id,
          status,
          started_at,
          therapist_accounts (
            id,
            therapist_profiles (
              full_name
            )
          )
        `)
        .eq('user_id', clientId)
        .order('started_at', { ascending: false });

      const activeOrLatestRel = (data || []).find((r: any) => r.status === 'active') || (data || [])[0];

      if (error || !activeOrLatestRel) {
        return { relationshipId: null, therapistAccountId: null, therapistName: null, status: null };
      }

      const ta: any = activeOrLatestRel.therapist_accounts;
      const profile = Array.isArray(ta?.therapist_profiles)
        ? ta?.therapist_profiles[0]
        : ta?.therapist_profiles;

      return {
        relationshipId: activeOrLatestRel.id,
        therapistAccountId: activeOrLatestRel.therapist_account_id,
        therapistName: profile?.full_name || 'Assigned Therapist',
        status: activeOrLatestRel.status,
      };
    } catch {
      return { relationshipId: null, therapistAccountId: null, therapistName: null, status: null };
    }
  }

  /**
   * Fetch current sharing consent preferences for a client.
   */
  static async getConsentForClient(clientId: string): Promise<{
    consent: ClientInsightSharingConsent;
    activeTherapist: {
      relationshipId: string | null;
      therapistAccountId: string | null;
      therapistName: string | null;
      status: string | null;
    };
  }> {
    if (!clientId) {
      throw new Error('clientId is required');
    }

    const activeTherapist = await this.getActiveRelationship(clientId);

    // 1. Check in-memory store first
    if (this.inMemoryConsents.has(clientId)) {
      return {
        consent: this.inMemoryConsents.get(clientId)!,
        activeTherapist,
      };
    }

    // 2. Query database
    try {
      const { data, error } = await supabase
        .from('client_insight_sharing_consents')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const consentObj: ClientInsightSharingConsent = {
          id: data.id,
          client_id: data.client_id,
          therapist_account_id: data.therapist_account_id,
          relationship_id: data.relationship_id,
          is_enabled: Boolean(data.is_enabled),
          share_pattern_summary: Boolean(data.share_pattern_summary),
          share_emotional_vocabulary: Boolean(data.share_emotional_vocabulary),
          share_weekly_reports: Boolean(data.share_weekly_reports),
          share_monthly_reports: Boolean(data.share_monthly_reports),
          consent_version: data.consent_version || 'v1.0.0',
          consented_at: data.consented_at,
          revoked_at: data.revoked_at,
          ip_address: data.ip_address,
          user_agent: data.user_agent,
          metadata: data.metadata || {},
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        this.inMemoryConsents.set(clientId, consentObj);
        return { consent: consentObj, activeTherapist };
      }
    } catch (err: any) {
      console.warn('[ClientInsightConsentService] DB lookup notice:', err.message);
    }

    // Default: Disabled and unconsented
    const defaultConsent: ClientInsightSharingConsent = {
      id: `consent-${clientId}`,
      client_id: clientId,
      therapist_account_id: activeTherapist.therapistAccountId,
      relationship_id: activeTherapist.relationshipId,
      is_enabled: false,
      share_pattern_summary: false,
      share_emotional_vocabulary: false,
      share_weekly_reports: false,
      share_monthly_reports: false,
      consent_version: 'v1.0.0',
      consented_at: null,
      revoked_at: null,
      metadata: {},
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return { consent: defaultConsent, activeTherapist };
  }

  /**
   * Update or grant explicit affirmative consent for sharing categories.
   */
  static async updateConsent(params: {
    clientId: string;
    isEnabled: boolean;
    categories: {
      patternSummary?: boolean;
      emotionalVocabulary?: boolean;
      weeklyReports?: boolean;
      monthlyReports?: boolean;
    };
    therapistAccountId?: string | null;
    relationshipId?: string | null;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ClientInsightSharingConsent> {
    const { clientId, isEnabled, categories, ipAddress, userAgent } = params;

    if (!clientId) {
      throw new Error('clientId is required to update sharing consent');
    }

    const activeTherapist = await this.getActiveRelationship(clientId);
    const therapistAccountId =
      params.therapistAccountId !== undefined
        ? params.therapistAccountId
        : activeTherapist.therapistAccountId;
    const relationshipId =
      params.relationshipId !== undefined
        ? params.relationshipId
        : activeTherapist.relationshipId;

    const nowIso = new Date().toISOString();
    const consentVersion = 'v1.0.0';

    const sharePattern = isEnabled ? Boolean(categories.patternSummary) : false;
    const shareVocab = isEnabled ? Boolean(categories.emotionalVocabulary) : false;
    const shareWeekly = isEnabled ? Boolean(categories.weeklyReports) : false;
    const shareMonthly = isEnabled ? Boolean(categories.monthlyReports) : false;

    // Check if any category was enabled
    const anyCategoryActive = sharePattern || shareVocab || shareWeekly || shareMonthly;
    const effectiveIsEnabled = isEnabled && anyCategoryActive;

    const consentRecord: ClientInsightSharingConsent = {
      id: `consent-${clientId}-${Date.now()}`,
      client_id: clientId,
      therapist_account_id: therapistAccountId || null,
      relationship_id: relationshipId || null,
      is_enabled: effectiveIsEnabled,
      share_pattern_summary: sharePattern,
      share_emotional_vocabulary: shareVocab,
      share_weekly_reports: shareWeekly,
      share_monthly_reports: shareMonthly,
      consent_version: consentVersion,
      consented_at: effectiveIsEnabled ? nowIso : null,
      revoked_at: !effectiveIsEnabled ? nowIso : null,
      ip_address: ipAddress || null,
      user_agent: userAgent || null,
      metadata: {
        last_action: effectiveIsEnabled ? 'granted' : 'disabled',
        selected_count: [sharePattern, shareVocab, shareWeekly, shareMonthly].filter(Boolean).length,
      },
      created_at: nowIso,
      updated_at: nowIso,
    };

    // 1. Update in-memory store immediately
    this.inMemoryConsents.set(clientId, consentRecord);

    // 2. Persist to DB table
    try {
      const { data: existing } = await supabase
        .from('client_insight_sharing_consents')
        .select('id')
        .eq('client_id', clientId)
        .maybeSingle();

      if (existing) {
        consentRecord.id = existing.id;
        await supabase
          .from('client_insight_sharing_consents')
          .update({
            therapist_account_id: consentRecord.therapist_account_id,
            relationship_id: consentRecord.relationship_id,
            is_enabled: consentRecord.is_enabled,
            share_pattern_summary: consentRecord.share_pattern_summary,
            share_emotional_vocabulary: consentRecord.share_emotional_vocabulary,
            share_weekly_reports: consentRecord.share_weekly_reports,
            share_monthly_reports: consentRecord.share_monthly_reports,
            consent_version: consentRecord.consent_version,
            consented_at: consentRecord.consented_at,
            revoked_at: consentRecord.revoked_at,
            ip_address: consentRecord.ip_address,
            user_agent: consentRecord.user_agent,
            metadata: consentRecord.metadata,
            updated_at: nowIso,
          })
          .eq('id', existing.id);
      } else {
        await supabase.from('client_insight_sharing_consents').insert({
          client_id: consentRecord.client_id,
          therapist_account_id: consentRecord.therapist_account_id,
          relationship_id: consentRecord.relationship_id,
          is_enabled: consentRecord.is_enabled,
          share_pattern_summary: consentRecord.share_pattern_summary,
          share_emotional_vocabulary: consentRecord.share_emotional_vocabulary,
          share_weekly_reports: consentRecord.share_weekly_reports,
          share_monthly_reports: consentRecord.share_monthly_reports,
          consent_version: consentRecord.consent_version,
          consented_at: consentRecord.consented_at,
          revoked_at: consentRecord.revoked_at,
          ip_address: consentRecord.ip_address,
          user_agent: consentRecord.user_agent,
          metadata: consentRecord.metadata,
          created_at: nowIso,
          updated_at: nowIso,
        });
      }
    } catch (dbErr: any) {
      console.warn('[ClientInsightConsentService] DB update notice:', dbErr.message);
    }

    // 3. Log audit records into existing consents audit trail & audit_logs
    try {
      await supabase.from('consents').insert({
        user_id: clientId,
        consent_type: 'client_insight_sharing',
        version: consentVersion,
        ip_address: ipAddress || null,
        consented_at: nowIso,
      });

      await supabase.from('audit_logs').insert({
        user_id: clientId,
        action: effectiveIsEnabled ? 'CLIENT_INSIGHT_CONSENT_GRANTED' : 'CLIENT_INSIGHT_CONSENT_UPDATED',
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
        metadata: {
          is_enabled: effectiveIsEnabled,
          categories: {
            pattern_summary: sharePattern,
            emotional_vocabulary: shareVocab,
            weekly_reports: shareWeekly,
            monthly_reports: shareMonthly,
          },
          therapist_account_id: therapistAccountId,
          relationship_id: relationshipId,
        },
        created_at: nowIso,
      });
    } catch (auditErr: any) {
      console.warn('[ClientInsightConsentService] Audit logging notice:', auditErr.message);
    }

    return consentRecord;
  }

  /**
   * Explicitly withdraw all insight sharing consent.
   */
  static async withdrawConsent(params: {
    clientId: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<ClientInsightSharingConsent> {
    return this.updateConsent({
      clientId: params.clientId,
      isEnabled: false,
      categories: {
        patternSummary: false,
        emotionalVocabulary: false,
        weeklyReports: false,
        monthlyReports: false,
      },
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  }

  /**
   * Server-side authorization check for therapist access to a specific insight category.
   *
   * Verifies:
   * 1. Active care relationship in `therapy_care_relationships`
   * 2. Relationship status is 'active' (not ended, terminated, transferred, or completed)
   * 3. Consent is active (`is_enabled === true`)
   * 4. Consent matches the specific therapist/relationship (if client was reassigned, previous consent does NOT carry over)
   * 5. The requested category is explicitly enabled.
   */
  static async verifyTherapistAccess(params: {
    therapistAccountId: string;
    clientId: string;
    category: ClientInsightCategory;
  }): Promise<ConsentVerificationResult> {
    const { therapistAccountId, clientId, category } = params;

    if (!therapistAccountId || !clientId) {
      return {
        authorized: false,
        reason: 'Missing therapist or client identity.',
        relationshipActive: false,
        consentGranted: false,
        categoryAuthorized: false,
      };
    }

    // 1. Verify that this therapist has an ACTIVE care relationship with this client
    let activeRel: any = this.inMemoryRelationships.get(`${therapistAccountId}:${clientId}`) || null;
    if (!activeRel) {
      try {
        const { data: rels, error } = await supabase
          .from('therapy_care_relationships')
          .select('id, therapist_account_id, user_id, status')
          .eq('therapist_account_id', therapistAccountId)
          .or(`id.eq.${clientId},user_id.eq.${clientId}`)
          .order('started_at', { ascending: false });

        if (!error && rels && rels.length > 0) {
          activeRel = rels.find((r: any) => r.status === 'active') || rels[0];
        }
      } catch (dbErr: any) {
        console.warn('[ClientInsightConsentService] Relationship check notice:', dbErr.message);
      }
    }

    if (!activeRel && this.inMemoryRelationships.size > 0) {
      for (const [key, rel] of this.inMemoryRelationships.entries()) {
        if (rel.therapist_account_id === therapistAccountId && (rel.user_id === clientId || rel.id === clientId)) {
          activeRel = rel;
          break;
        }
      }
    }

    // If no relationship was found
    if (!activeRel) {
      return {
        authorized: false,
        reason: 'Client is not in your clinical caseload.',
        relationshipActive: false,
        consentGranted: false,
        categoryAuthorized: false,
      };
    }

    if (activeRel.status !== 'active') {
      return {
        authorized: false,
        reason: `Clinical relationship is ${activeRel.status}. Insight access is only permitted during active care.`,
        relationshipActive: false,
        consentGranted: false,
        categoryAuthorized: false,
      };
    }

    const resolvedClientId = activeRel.user_id;

    // 2. Fetch client's current sharing consent
    const { consent } = await this.getConsentForClient(resolvedClientId);

    if (!consent || !consent.is_enabled) {
      return {
        authorized: false,
        reason: 'Client has not enabled insight sharing.',
        relationshipActive: true,
        consentGranted: false,
        categoryAuthorized: false,
        consent,
        clientId: resolvedClientId,
        relationshipId: activeRel.id,
      };
    }

    // 3. Clinical Tenancy & Reassignment Safety Guard:
    // If the consent record was authorized specifically for another therapist (e.g. prior clinician before reassignment),
    // access is strictly blocked until the client explicitly grants consent for the current clinician.
    if (
      consent.therapist_account_id &&
      consent.therapist_account_id !== therapistAccountId
    ) {
      return {
        authorized: false,
        reason: 'Client sharing consent was authorized for a different clinician. A renewed authorization is required for reassigned care.',
        relationshipActive: true,
        consentGranted: false,
        categoryAuthorized: false,
        consent,
        clientId: resolvedClientId,
        relationshipId: activeRel.id,
      };
    }

    // 4. Category-specific authorization check
    let categoryAllowed = false;
    switch (category) {
      case 'pattern_summary':
        categoryAllowed = consent.share_pattern_summary;
        break;
      case 'emotional_vocabulary':
        categoryAllowed = consent.share_emotional_vocabulary;
        break;
      case 'weekly_reports':
        categoryAllowed = consent.share_weekly_reports;
        break;
      case 'monthly_reports':
        categoryAllowed = consent.share_monthly_reports;
        break;
    }

    if (!categoryAllowed) {
      return {
        authorized: false,
        reason: `Client has not authorized sharing for ${category.replace(/_/g, ' ')}.`,
        relationshipActive: true,
        consentGranted: true,
        categoryAuthorized: false,
        consent,
      };
    }

    return {
      authorized: true,
      relationshipActive: true,
      consentGranted: true,
      categoryAuthorized: true,
      consent,
    };
  }

  /**
   * Fetch all four categories for the Therapist Portal "Client Insights" view.
   * Granularly respects consent for each category and strips raw personal notes.
   */
  static async getTherapistClientInsights(therapistAccountId: string, clientId: string): Promise<any> {
    // 1. Check baseline relationship (resilient lookup supporting userId or relationshipId)
    let relationship: any = this.inMemoryRelationships.get(`${therapistAccountId}:${clientId}`) || null;
    if (!relationship) {
      const { data: rels } = await supabase
        .from('therapy_care_relationships')
        .select('id, therapist_account_id, user_id, status, started_at')
        .eq('therapist_account_id', therapistAccountId)
        .or(`id.eq.${clientId},user_id.eq.${clientId}`)
        .order('started_at', { ascending: false });
      if (rels && rels.length > 0) {
        relationship = rels.find((r: any) => r.status === 'active') || rels[0];
      }
    }

    if (!relationship && this.inMemoryRelationships.size > 0) {
      for (const [key, rel] of this.inMemoryRelationships.entries()) {
        if (rel.therapist_account_id === therapistAccountId && (rel.user_id === clientId || rel.id === clientId)) {
          relationship = rel;
          break;
        }
      }
    }

    if (!relationship) {
      const err: any = new Error('Client not found or not in your clinical caseload.');
      err.status = 404;
      err.code = 'CLIENT_NOT_AUTHORIZED';
      throw err;
    }

    const resolvedClientId = relationship.user_id;

    if (relationship.status !== 'active') {
      return {
        authorized: false,
        reason: `Clinical relationship is ${relationship.status}. Insight sharing is only accessible during active care.`,
        relationshipStatus: relationship.status,
        insights: null,
      };
    }

    // 2. Check client consent
    const { consent } = await this.getConsentForClient(resolvedClientId);

    if (!consent || !consent.is_enabled) {
      return {
        authorized: false,
        reason: 'Client has not enabled insight sharing. They can choose to share selected summaries anytime from their Privacy & Sharing settings.',
        consentStatus: 'disabled',
        insights: null,
      };
    }

    // Guard against reassignment leakage
    if (
      consent.therapist_account_id &&
      consent.therapist_account_id !== therapistAccountId
    ) {
      return {
        authorized: false,
        reason: 'Sharing consent was granted for a prior clinician relationship. Renewed consent from the client is required.',
        consentStatus: 'reassignment_pending',
        insights: null,
      };
    }

    // 3. Category A: Pattern Summary (Existing summary at the top of Pattern Summary experience)
    let patternSummary: any = { consented: false };
    if (consent.share_pattern_summary) {
      try {
        const patternOverview = await PatternIntelligenceService.getPatternOverview(resolvedClientId);
        patternSummary = {
          consented: true,
          isAvailable: patternOverview.isAvailable,
          summary: patternOverview.summary,
          totalCyclesObserved: patternOverview.totalCyclesObserved,
          updatedAt: (patternOverview as any).updatedAt || consent.updated_at,
        };
      } catch (err: any) {
        patternSummary = {
          consented: true,
          isAvailable: false,
          error: 'Failed to retrieve pattern summary.',
        };
      }
    } else {
      patternSummary = {
        consented: false,
        reason: 'Client has not authorized sharing of Pattern Summaries.',
      };
    }

    // 4. Category B: Emotional Vocabulary Summary (Existing summary at the top of Emotional Vocabulary experience)
    let emotionalVocabulary: any = { consented: false };
    if (consent.share_emotional_vocabulary) {
      try {
        const vocabOverview = await VocabularyIntelligenceService.getVocabularyOverview(resolvedClientId);
        emotionalVocabulary = {
          consented: true,
          isAvailable: vocabOverview.isAvailable,
          stats: vocabOverview.stats,
          mostUsed: (vocabOverview.mostUsed || []).slice(0, 8),
          updatedAt: vocabOverview.updatedAt || vocabOverview.generated_at || consent.updated_at,
        };
      } catch (err: any) {
        emotionalVocabulary = {
          consented: true,
          isAvailable: false,
          error: 'Failed to retrieve emotional vocabulary overview.',
        };
      }
    } else {
      emotionalVocabulary = {
        consented: false,
        reason: 'Client has not authorized sharing of Emotional Vocabulary.',
      };
    }

    // 5. Category C: Weekly Reports (List of available weekly reports)
    let weeklyReports: any = { consented: false };
    if (consent.share_weekly_reports) {
      try {
        const { data: reports, error: reportsErr } = await supabase
          .from('weekly_summaries')
          .select('id, cycle_id, week_number, day_start, day_end, status, created_at, report_data')
          .eq('user_id', resolvedClientId)
          .order('week_number', { ascending: false });

        if (reportsErr) throw reportsErr;

        weeklyReports = {
          consented: true,
          reports: (reports || []).map((r) => ({
            id: r.id,
            cycle_id: r.cycle_id,
            week_number: r.week_number,
            day_start: r.day_start,
            day_end: r.day_end,
            status: r.status,
            created_at: r.created_at,
            // Include high-level synthesize metrics from report_data, but omit private notes
            metrics: r.report_data?.metrics || r.report_data?.stats || null,
          })),
        };
      } catch (err: any) {
        weeklyReports = {
          consented: true,
          reports: [],
          error: 'Failed to retrieve weekly reports list.',
        };
      }
    } else {
      weeklyReports = {
        consented: false,
        reason: 'Client has not authorized sharing of Weekly Reports.',
      };
    }

    // 6. Category D: Monthly Reports (Cycle assessment reports)
    let monthlyReports: any = { consented: false };
    if (consent.share_monthly_reports) {
      try {
        // Query assessments and cycles
        const { data: assessments, error: aErr } = await supabase
          .from('assessments')
          .select('id, cycle_id, created_at, generation_status, report_text')
          .eq('user_id', resolvedClientId)
          .order('created_at', { ascending: false });

        if (aErr) throw aErr;

        const { data: cycles } = await supabase
          .from('cycles')
          .select('id, cycle_number, start_date, total_days, status')
          .eq('user_id', resolvedClientId);

        const cycleMap = new Map((cycles || []).map((c) => [c.id, c]));

        monthlyReports = {
          consented: true,
          reports: (assessments || []).map((a) => {
            const cycle = cycleMap.get(a.cycle_id) || {
              cycle_number: 1,
              start_date: a.created_at,
              total_days: 30,
              status: 'COMPLETED',
            };
            return {
              id: a.id,
              cycle_id: a.cycle_id,
              cycle_number: cycle.cycle_number,
              status: a.generation_status || cycle.status || 'COMPLETED',
              created_at: a.created_at,
              start_date: cycle.start_date,
            };
          }),
        };
      } catch (err: any) {
        monthlyReports = {
          consented: true,
          reports: [],
          error: 'Failed to retrieve monthly reports list.',
        };
      }
    } else {
      monthlyReports = {
        consented: false,
        reason: 'Client has not authorized sharing of Monthly Reports.',
      };
    }

    return {
      authorized: true,
      consentStatus: 'active',
      consentUpdatedAt: consent.updated_at,
      disclaimer:
        'These insights are derived from the client’s self-reflection practice and platform activity. They are not clinical diagnoses or standardized psychological evaluations.',
      patternSummary,
      emotionalVocabulary,
      weeklyReports,
      monthlyReports,
    };
  }

  /**
   * Fetch a single weekly report for an authorized therapist.
   */
  static async getWeeklyReportDetailForTherapist(
    therapistAccountId: string,
    clientId: string,
    reportId: string
  ): Promise<any> {
    const authCheck = await this.verifyTherapistAccess({
      therapistAccountId,
      clientId,
      category: 'weekly_reports',
    });

    if (!authCheck.authorized) {
      const err: any = new Error(authCheck.reason || 'Unauthorized access to weekly report.');
      err.status = 403;
      err.code = 'CATEGORY_NOT_AUTHORIZED';
      throw err;
    }

    const resolvedClientId = authCheck.clientId || clientId;

    const { data: report, error } = await supabase
      .from('weekly_summaries')
      .select('*')
      .eq('id', reportId)
      .eq('user_id', resolvedClientId)
      .maybeSingle();

    if (error || !report) {
      const err: any = new Error('Weekly report not found for this client.');
      err.status = 404;
      err.code = 'REPORT_NOT_FOUND';
      throw err;
    }

    return {
      success: true,
      report,
      disclaimer: 'This weekly report reflects the client’s self-journaling activity.',
    };
  }

  /**
   * Fetch a single monthly/cycle assessment report for an authorized therapist.
   */
  static async getMonthlyReportDetailForTherapist(
    therapistAccountId: string,
    clientId: string,
    cycleId: string
  ): Promise<any> {
    const authCheck = await this.verifyTherapistAccess({
      therapistAccountId,
      clientId,
      category: 'monthly_reports',
    });

    if (!authCheck.authorized) {
      const err: any = new Error(authCheck.reason || 'Unauthorized access to monthly report.');
      err.status = 403;
      err.code = 'CATEGORY_NOT_AUTHORIZED';
      throw err;
    }

    const resolvedClientId = authCheck.clientId || clientId;

    // Resolve cycle assessment strictly for this client
    let assessment: any = null;
    const { data: a1 } = await supabase
      .from('assessments')
      .select('*')
      .eq('user_id', resolvedClientId)
      .eq('cycle_id', cycleId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (a1) assessment = a1;

    if (!assessment) {
      const { data: a2 } = await supabase
        .from('assessments')
        .select('*')
        .eq('user_id', resolvedClientId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (a2) assessment = a2;
    }

    if (!assessment) {
      const err: any = new Error('Monthly assessment report not found for this client.');
      err.status = 404;
      err.code = 'REPORT_NOT_FOUND';
      throw err;
    }

    return {
      success: true,
      assessment,
      disclaimer:
        'This monthly report is synthesized from 30-day reflection cycles. It is an observational summary, not a clinical diagnostic assessment.',
    };
  }
}
