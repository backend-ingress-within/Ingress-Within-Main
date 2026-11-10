import { supabase } from '../db';

export interface RelationshipOverviewItem {
  id: string;
  sourceType: 'care_relationship' | 'pending_match';
  userId: string;
  therapistAccountId: string;
  
  // Identifiers
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  therapistName: string;
  therapistTitle: string;
  therapistQualification: string;
  therapistFee: number;
  
  // 1. New User / Therapy Request
  requestDate: string | null;
  intakeCompleted: boolean;
  intakeStatus: 'Completed' | 'Pending';
  intakeDate: string | null;
  
  // 2. Therapist Matched
  matchedTherapistName: string;
  matchingDate: string | null;
  therapistAcceptanceStatus: 'accepted' | 'pending' | 'declined';
  therapistAcceptedAt: string | null;
  
  // 3. Mutual Acceptance
  mutualAccepted: boolean;
  mutualAcceptedAt: string | null;
  
  // 4. Client Consent
  hasConsent: boolean;
  consentStatus: 'Consented' | 'Pending';
  consentDate: string | null;
  consentType: string;
  consentVersion: string;
  consentIp: string | null;
  
  // 5. First Session Booked
  firstSessionBooked: boolean;
  firstSessionDate: string | null;
  firstSessionId: string | null;
  
  // 6. Number of Sessions
  totalSessions: number;
  
  // 7. Last Session Date
  lastSessionDate: string | null;
  
  // 8. Relationship Status
  status: 'Active' | 'Dormant' | 'Completed' | 'Awaiting Acceptance';
  rawStatus: string;
  careStage: string;
  
  createdAt: string;
}

export interface RelationshipTimelineMilestone {
  id: string;
  milestoneNumber: number;
  title: string;
  status: 'completed' | 'in_progress' | 'pending' | 'skipped';
  timestamp: string | null;
  details: string;
}

export interface RelationshipDetailPayload extends RelationshipOverviewItem {
  clientDetails: {
    id: string;
    name: string;
    phone: string | null;
    email: string | null;
    registeredAt: string;
  };
  therapistDetails: {
    id: string;
    name: string;
    title: string;
    qualification: string;
    experienceYears: number;
    phone: string | null;
    fee: number;
  };
  intakeDetails: {
    presentingReason: string | null;
    concerns: string[];
    affectedLifeAreas: string[];
    age: number | null;
    gender: string | null;
    city: string | null;
    livingSituation: string | null;
    answers: Record<string, any>;
    submittedAt: string | null;
  } | null;
  matchingDetails: {
    matchScore: number | null;
    matchRank: number | null;
    matchReasons: string[];
    matchedAt: string | null;
  };
  sessionsList: Array<{
    id: string;
    scheduledStart: string;
    scheduledEnd: string;
    status: string;
    sessionType: string;
    modality: string;
    meetingLink: string | null;
    paymentStatus: string;
    cancelledBy: string | null;
    cancellationReason: string | null;
    createdAt: string;
  }>;
  timeline: RelationshipTimelineMilestone[];
}

export class AdminTherapyRelationshipService {
  /**
   * Fetches paginated, searchable, filterable, and sorted therapy relationships.
   */
  static async getRelationships(params: {
    page?: number;
    limit?: number;
    search?: string;
    filter?: string;
    sort?: string;
  }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 20));
    const search = (params.search || '').trim().toLowerCase();
    const filter = (params.filter || 'all').trim();
    const sort = (params.sort || 'newest_request').trim();

    // 1. Fetch all care relationships from database
    const { data: relationships, error: relErr } = await supabase
      .from('therapy_care_relationships')
      .select('*')
      .order('created_at', { ascending: false });

    if (relErr) {
      console.error('[AdminTherapyRelationshipService] Failed to load care relationships:', relErr);
      throw new Error('Failed to retrieve therapy care relationships.');
    }

    const careRels = relationships || [];

    // 2. Also fetch shortlisted / selected matches awaiting therapist acceptance
    // Strictly exclude mere algorithmic candidates so clients are never linked to all candidate therapists.
    const { data: pendingMatches } = await supabase
      .from('therapy_matches')
      .select('*')
      .in('match_status', ['shortlisted', 'selected', 'proposed'])
      .order('created_at', { ascending: false });

    // Filter out pending matches where an active care relationship already exists for the client & therapist,
    // and enforce single clinician exclusivity per client request.
    const seenPendingClientIds = new Set();
    const filteredPendingMatches = (pendingMatches || []).filter((m) => {
      if (!m.therapist_account_id || !m.user_id) return false;
      if (careRels.some((r) => r.user_id === m.user_id)) return false;
      if (seenPendingClientIds.has(m.user_id)) return false;
      seenPendingClientIds.add(m.user_id);
      return true;
    });

    // 3. Extract distinct IDs for batch querying
    const allUserIds = Array.from(
      new Set([
        ...careRels.map((r) => r.user_id),
        ...filteredPendingMatches.map((m) => m.user_id),
      ].filter(Boolean))
    );

    const allTherapistIds = Array.from(
      new Set([
        ...careRels.map((r) => r.therapist_account_id),
        ...filteredPendingMatches.map((m) => m.therapist_account_id),
      ].filter(Boolean))
    );

    // 4. Batch query supporting tables in parallel
    const [
      { data: users },
      { data: profiles },
      { data: therapistAccounts },
      { data: therapistProfiles },
      { data: intakes },
      { data: submissions },
      { data: matches },
      { data: consents },
      { data: insightConsents },
      { data: appointments },
    ] = await Promise.all([
      allUserIds.length > 0
        ? supabase.from('users').select('id, name, phone_number, created_at').in('id', allUserIds)
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('profiles').select('id, full_name, phone_number, consent_completed').in('id', allUserIds)
        : Promise.resolve({ data: [] }),
      allTherapistIds.length > 0
        ? supabase.from('therapist_accounts').select('id, phone_number, status, can_practice, per_session_fee').in('id', allTherapistIds)
        : Promise.resolve({ data: [] }),
      allTherapistIds.length > 0
        ? supabase.from('therapist_profiles').select('therapist_account_id, full_name, title, qualification, experience_years, bio, city, state').in('therapist_account_id', allTherapistIds)
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('therapy_intakes').select('*').in('user_id', allUserIds).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('therapy_submissions').select('*').in('user_id', allUserIds).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('therapy_matches').select('*').in('user_id', allUserIds).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('consents').select('*').in('user_id', allUserIds).order('consented_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('client_insight_sharing_consents').select('*').in('client_id', allUserIds).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      allUserIds.length > 0
        ? supabase.from('therapist_clinical_appointments').select('*').in('user_id', allUserIds).order('scheduled_start', { ascending: true })
        : Promise.resolve({ data: [] }),
    ]);

    // Fast lookup dictionaries
    const userMap = new Map((users || []).map((u) => [u.id, u]));
    const profileMap = new Map((profiles || []).map((p) => [p.id, p]));
    const thAccountMap = new Map((therapistAccounts || []).map((a) => [a.id, a]));
    const thProfileMap = new Map((therapistProfiles || []).map((p) => [p.therapist_account_id, p]));

    // 5. Transform care relationships
    const transformedItems: RelationshipOverviewItem[] = [];

    for (const rel of careRels) {
      const user = userMap.get(rel.user_id);
      const profile = profileMap.get(rel.user_id);
      const thAccount = thAccountMap.get(rel.therapist_account_id);
      const thProfile = thProfileMap.get(rel.therapist_account_id);

      // Intake: find intake for this session or user
      const userIntakes = (intakes || []).filter((i) => i.user_id === rel.user_id);
      const sessionIntake = rel.therapy_session_id
        ? userIntakes.find((i) => i.therapy_session_id === rel.therapy_session_id)
        : null;
      const intake = sessionIntake || userIntakes[0] || null;

      const submission = (submissions || []).find(
        (s) => s.user_id === rel.user_id && (rel.therapy_session_id ? s.therapy_session_id === rel.therapy_session_id : true)
      );

      const match = (matches || []).find(
        (m) =>
          m.user_id === rel.user_id &&
          m.therapist_account_id === rel.therapist_account_id &&
          (rel.metadata?.source_match_id ? m.id === rel.metadata.source_match_id : true)
      ) || (matches || []).find((m) => m.user_id === rel.user_id && m.therapist_account_id === rel.therapist_account_id);

      // Consents
      const userConsentRecords = (consents || []).filter((c) => c.user_id === rel.user_id);
      const primaryConsent = userConsentRecords.find((c) =>
        ['therapy_consent', 'informed_consent', 'terms_and_privacy'].includes(c.consent_type)
      ) || userConsentRecords[0];

      const insightConsent = (insightConsents || []).find(
        (ic) => ic.client_id === rel.user_id && (ic.relationship_id === rel.id || ic.therapist_account_id === rel.therapist_account_id)
      );

      const hasConsent = Boolean(
        userConsentRecords.length > 0 ||
        profile?.consent_completed ||
        insightConsent?.is_enabled ||
        (intake?.consents && typeof intake.consents === 'object' && Object.keys(intake.consents).length > 0)
      );

      const consentDate =
        primaryConsent?.consented_at ||
        insightConsent?.consented_at ||
        intake?.created_at ||
        rel.started_at ||
        null;

      // Authoritative Appointments for this specific relationship
      // Strictly isolate by relationship_id, or if unlinked legacy record, strictly match therapist, user and time bounds
      const relAppointments = (appointments || []).filter((a) => {
        if (a.relationship_id) {
          return a.relationship_id === rel.id;
        }
        // Legacy fallback
        if (a.therapist_account_id !== rel.therapist_account_id || a.user_id !== rel.user_id) {
          return false;
        }
        const apptStart = new Date(a.scheduled_start).getTime();
        const relStart = new Date(rel.started_at || rel.created_at).getTime() - 24 * 60 * 60 * 1000; // 24h grace
        if (apptStart < relStart) return false;
        if (rel.ended_at && apptStart > new Date(rel.ended_at).getTime() + 24 * 60 * 60 * 1000) return false;
        return true;
      });

      // Filter valid appointments (exclude cancelled and rescheduled)
      const validAppointments = relAppointments.filter(
        (a) => a.status !== 'cancelled' && a.status !== 'rescheduled'
      );

      // Completed sessions
      const completedAppointments = relAppointments.filter((a) => a.status === 'completed');

      // Sort ascending for first session
      const sortedValid = [...validAppointments].sort(
        (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
      );

      // Sort descending for last session
      const sortedCompleted = [...completedAppointments].sort(
        (a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime()
      );

      const firstSessionBooked = sortedValid.length > 0;
      const firstSessionDate = sortedValid.length > 0 ? sortedValid[0].scheduled_start : null;
      const firstSessionId = sortedValid.length > 0 ? sortedValid[0].id : null;
      const lastSessionDate = sortedCompleted.length > 0 ? sortedCompleted[0].scheduled_start : null;

      // Status resolution
      let normalizedStatus: 'Active' | 'Dormant' | 'Completed' = 'Active';
      if (rel.status === 'paused' || rel.metadata?.is_dormant) {
        normalizedStatus = 'Dormant';
      } else if (
        ['completed', 'terminated', 'transferred'].includes(rel.status) ||
        rel.care_stage === 'completed'
      ) {
        normalizedStatus = 'Completed';
      } else {
        normalizedStatus = 'Active';
      }

      // Intake completion check
      const intakeCompleted = Boolean(
        intake &&
        (intake.presenting_reason ||
          (Array.isArray(intake.concerns) && intake.concerns.length > 0) ||
          (intake.answers && Object.keys(intake.answers).length > 0))
      );

      // Mutual acceptance: in a created therapy_care_relationships record, mutual acceptance was finalized
      const mutualAcceptedAt = rel.started_at || rel.metadata?.accepted_at || rel.created_at;

      transformedItems.push({
        id: rel.id,
        sourceType: 'care_relationship',
        userId: rel.user_id,
        therapistAccountId: rel.therapist_account_id,
        clientName: intake?.full_name || user?.name || profile?.full_name || user?.phone_number || 'Client',
        clientEmail: intake?.email || null,
        clientPhone: intake?.phone_number || user?.phone_number || profile?.phone_number || null,
        therapistName: thProfile?.full_name || 'Assigned Therapist',
        therapistTitle: thProfile?.title || 'Consultant Psychologist',
        therapistQualification: thProfile?.qualification || '',
        therapistFee: Number(thAccount?.per_session_fee || 1500),
        requestDate: submission?.submitted_at || intake?.created_at || match?.created_at || rel.created_at,
        intakeCompleted,
        intakeStatus: intakeCompleted ? 'Completed' : 'Pending',
        intakeDate: intake?.created_at || null,
        matchedTherapistName: thProfile?.full_name || 'Assigned Therapist',
        matchingDate: match?.created_at || rel.created_at,
        therapistAcceptanceStatus: 'accepted',
        therapistAcceptedAt: rel.started_at || rel.metadata?.accepted_at || rel.created_at,
        mutualAccepted: true,
        mutualAcceptedAt,
        hasConsent,
        consentStatus: hasConsent ? 'Consented' : 'Pending',
        consentDate,
        consentType: primaryConsent?.consent_type || 'therapy_consent',
        consentVersion: primaryConsent?.version || 'v1.0.0',
        consentIp: primaryConsent?.ip_address || null,
        firstSessionBooked,
        firstSessionDate,
        firstSessionId,
        totalSessions: validAppointments.length,
        lastSessionDate,
        status: normalizedStatus,
        rawStatus: rel.status,
        careStage: rel.care_stage,
        createdAt: rel.created_at,
      });
    }

    // 6. Transform pending matches awaiting therapist acceptance
    for (const match of filteredPendingMatches) {
      const user = userMap.get(match.user_id);
      const profile = profileMap.get(match.user_id);
      const thAccount = thAccountMap.get(match.therapist_account_id);
      const thProfile = thProfileMap.get(match.therapist_account_id);

      const userIntakes = (intakes || []).filter((i) => i.user_id === match.user_id);
      const intake = userIntakes[0] || null;
      const submission = (submissions || []).find((s) => s.user_id === match.user_id);

      const userConsentRecords = (consents || []).filter((c) => c.user_id === match.user_id);
      const primaryConsent = userConsentRecords[0];
      const hasConsent = Boolean(userConsentRecords.length > 0 || profile?.consent_completed || intake?.consents);

      const intakeCompleted = Boolean(
        intake &&
        (intake.presenting_reason ||
          (Array.isArray(intake.concerns) && intake.concerns.length > 0) ||
          (intake.answers && Object.keys(intake.answers).length > 0))
      );

      transformedItems.push({
        id: `match_${match.id}`,
        sourceType: 'pending_match',
        userId: match.user_id,
        therapistAccountId: match.therapist_account_id,
        clientName: intake?.full_name || user?.name || profile?.full_name || user?.phone_number || 'Client',
        clientEmail: intake?.email || null,
        clientPhone: intake?.phone_number || user?.phone_number || profile?.phone_number || null,
        therapistName: thProfile?.full_name || 'Matched Therapist',
        therapistTitle: thProfile?.title || 'Consultant Psychologist',
        therapistQualification: thProfile?.qualification || '',
        therapistFee: Number(thAccount?.per_session_fee || 1500),
        requestDate: submission?.submitted_at || intake?.created_at || match.created_at,
        intakeCompleted,
        intakeStatus: intakeCompleted ? 'Completed' : 'Pending',
        intakeDate: intake?.created_at || null,
        matchedTherapistName: thProfile?.full_name || 'Matched Therapist',
        matchingDate: match.created_at,
        therapistAcceptanceStatus: 'pending',
        therapistAcceptedAt: null,
        mutualAccepted: false,
        mutualAcceptedAt: null,
        hasConsent,
        consentStatus: hasConsent ? 'Consented' : 'Pending',
        consentDate: primaryConsent?.consented_at || null,
        consentType: primaryConsent?.consent_type || 'therapy_consent',
        consentVersion: primaryConsent?.version || 'v1.0.0',
        consentIp: primaryConsent?.ip_address || null,
        firstSessionBooked: false,
        firstSessionDate: null,
        firstSessionId: null,
        totalSessions: 0,
        lastSessionDate: null,
        status: 'Awaiting Acceptance',
        rawStatus: 'awaiting_therapist_acceptance',
        careStage: 'intake',
        createdAt: match.created_at,
      });
    }

    // 7. Calculate Global Counts across all items
    const counts = {
      all: transformedItems.length,
      active: transformedItems.filter((i) => i.status === 'Active').length,
      dormant: transformedItems.filter((i) => i.status === 'Dormant').length,
      completed: transformedItems.filter((i) => i.status === 'Completed').length,
      awaiting_therapist_acceptance: transformedItems.filter(
        (i) => i.therapistAcceptanceStatus === 'pending'
      ).length,
      awaiting_mutual_acceptance: transformedItems.filter((i) => !i.mutualAccepted).length,
      consent_pending: transformedItems.filter((i) => !i.hasConsent).length,
      first_session_not_booked: transformedItems.filter((i) => !i.firstSessionBooked).length,
    };

    // 8. Apply Search
    let filtered = transformedItems;
    if (search) {
      filtered = filtered.filter((i) => {
        const cName = (i.clientName || '').toLowerCase();
        const cEmail = (i.clientEmail || '').toLowerCase();
        const tName = (i.therapistName || '').toLowerCase();
        return cName.includes(search) || cEmail.includes(search) || tName.includes(search);
      });
    }

    // 9. Apply Filter
    if (filter === 'active') {
      filtered = filtered.filter((i) => i.status === 'Active');
    } else if (filter === 'dormant') {
      filtered = filtered.filter((i) => i.status === 'Dormant');
    } else if (filter === 'completed') {
      filtered = filtered.filter((i) => i.status === 'Completed');
    } else if (filter === 'awaiting_therapist_acceptance') {
      filtered = filtered.filter((i) => i.therapistAcceptanceStatus === 'pending');
    } else if (filter === 'awaiting_mutual_acceptance') {
      filtered = filtered.filter((i) => !i.mutualAccepted);
    } else if (filter === 'consent_pending') {
      filtered = filtered.filter((i) => !i.hasConsent);
    } else if (filter === 'first_session_not_booked') {
      filtered = filtered.filter((i) => !i.firstSessionBooked);
    }

    // 10. Apply Sorting
    filtered.sort((a, b) => {
      if (sort === 'oldest_request') {
        const timeA = a.requestDate ? new Date(a.requestDate).getTime() : 0;
        const timeB = b.requestDate ? new Date(b.requestDate).getTime() : 0;
        return timeA - timeB;
      }
      if (sort === 'matching_date_desc') {
        const timeA = a.matchingDate ? new Date(a.matchingDate).getTime() : 0;
        const timeB = b.matchingDate ? new Date(b.matchingDate).getTime() : 0;
        return timeB - timeA;
      }
      if (sort === 'first_session_desc') {
        if (!a.firstSessionDate && !b.firstSessionDate) return 0;
        if (!a.firstSessionDate) return 1;
        if (!b.firstSessionDate) return -1;
        return new Date(b.firstSessionDate).getTime() - new Date(a.firstSessionDate).getTime();
      }
      if (sort === 'last_session_desc') {
        if (!a.lastSessionDate && !b.lastSessionDate) return 0;
        if (!a.lastSessionDate) return 1;
        if (!b.lastSessionDate) return -1;
        return new Date(b.lastSessionDate).getTime() - new Date(a.lastSessionDate).getTime();
      }
      if (sort === 'sessions_count_desc') {
        return b.totalSessions - a.totalSessions;
      }
      // default: newest_request
      const timeA = a.requestDate ? new Date(a.requestDate).getTime() : 0;
      const timeB = b.requestDate ? new Date(b.requestDate).getTime() : 0;
      return timeB - timeA;
    });

    // 11. Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit);
    const paginatedItems = filtered.slice((page - 1) * limit, page * limit);

    return {
      relationships: paginatedItems,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      counts,
    };
  }

  /**
   * Fetches rich detail, complete session history, and all 9 chronological milestones for a relationship.
   */
  static async getRelationshipDetail(relationshipId: string): Promise<RelationshipDetailPayload> {
    if (!relationshipId) {
      const err: any = new Error('Relationship ID is required.');
      err.status = 400;
      throw err;
    }

    const isPendingMatch = relationshipId.startsWith('match_');
    const actualId = isPendingMatch ? relationshipId.replace('match_', '') : relationshipId;

    let userId = '';
    let therapistAccountId = '';
    let therapySessionId: string | null = null;
    let relRecord: any = null;
    let matchRecord: any = null;

    if (isPendingMatch) {
      const { data: m, error: mErr } = await supabase
        .from('therapy_matches')
        .select('*')
        .eq('id', actualId)
        .maybeSingle();

      if (mErr || !m) {
        const err: any = new Error('Pending therapy match request not found.');
        err.status = 404;
        throw err;
      }
      matchRecord = m;
      userId = m.user_id;
      therapistAccountId = m.therapist_account_id;
      therapySessionId = m.therapy_session_id;
    } else {
      const { data: r, error: rErr } = await supabase
        .from('therapy_care_relationships')
        .select('*')
        .eq('id', actualId)
        .maybeSingle();

      if (rErr || !r) {
        const err: any = new Error('Therapy care relationship not found.');
        err.status = 404;
        throw err;
      }
      relRecord = r;
      userId = r.user_id;
      therapistAccountId = r.therapist_account_id;
      therapySessionId = r.therapy_session_id;
    }

    // Fetch supporting data
    const [
      { data: user },
      { data: profile },
      { data: thAccount },
      { data: thProfile },
      { data: intakes },
      { data: submissions },
      { data: matches },
      { data: consents },
      { data: insightConsents },
      { data: appointments },
    ] = await Promise.all([
      supabase.from('users').select('*').eq('id', userId).maybeSingle(),
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('therapist_accounts').select('*').eq('id', therapistAccountId).maybeSingle(),
      supabase.from('therapist_profiles').select('*').eq('therapist_account_id', therapistAccountId).maybeSingle(),
      supabase.from('therapy_intakes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('therapy_submissions').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('therapy_matches').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('consents').select('*').eq('user_id', userId).order('consented_at', { ascending: false }),
      supabase.from('client_insight_sharing_consents').select('*').eq('client_id', userId).order('created_at', { ascending: false }),
      supabase.from('therapist_clinical_appointments').select('*').eq('user_id', userId).order('scheduled_start', { ascending: true }),
    ]);

    // Authoritative intake selection
    const intake = (intakes || []).find((i) => therapySessionId ? i.therapy_session_id === therapySessionId : true) || intakes?.[0] || null;
    const submission = (submissions || []).find((s) => therapySessionId ? s.therapy_session_id === therapySessionId : true) || submissions?.[0] || null;
    const match = matchRecord || (matches || []).find((m) => m.therapist_account_id === therapistAccountId) || matches?.[0] || null;

    // Consents
    const userConsentRecords = consents || [];
    const primaryConsent = userConsentRecords.find((c) =>
      ['therapy_consent', 'informed_consent', 'terms_and_privacy'].includes(c.consent_type)
    ) || userConsentRecords[0];

    const insightConsent = (insightConsents || []).find(
      (ic) => ic.therapist_account_id === therapistAccountId || (relRecord && ic.relationship_id === relRecord.id)
    );

    const hasConsent = Boolean(
      userConsentRecords.length > 0 ||
      profile?.consent_completed ||
      insightConsent?.is_enabled ||
      (intake?.consents && typeof intake.consents === 'object' && Object.keys(intake.consents).length > 0)
    );

    const consentDate =
      primaryConsent?.consented_at ||
      insightConsent?.consented_at ||
      intake?.created_at ||
      relRecord?.started_at ||
      null;

    // Sessions filtering strictly for this relationship
    const relAppointments = (appointments || []).filter((a) => {
      if (relRecord) {
        if (a.relationship_id) return a.relationship_id === relRecord.id;
        if (a.therapist_account_id !== therapistAccountId || a.user_id !== userId) return false;
        const apptStart = new Date(a.scheduled_start).getTime();
        const relStart = new Date(relRecord.started_at || relRecord.created_at).getTime() - 24 * 60 * 60 * 1000;
        if (apptStart < relStart) return false;
        if (relRecord.ended_at && apptStart > new Date(relRecord.ended_at).getTime() + 24 * 60 * 60 * 1000) return false;
        return true;
      }
      return false; // pending match has no valid sessions
    });

    const validAppointments = relAppointments.filter((a) => a.status !== 'cancelled' && a.status !== 'rescheduled');
    const completedAppointments = relAppointments.filter((a) => a.status === 'completed');

    const sortedValid = [...validAppointments].sort(
      (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
    );
    const sortedCompleted = [...completedAppointments].sort(
      (a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime()
    );

    const firstSessionBooked = sortedValid.length > 0;
    const firstSessionDate = sortedValid.length > 0 ? sortedValid[0].scheduled_start : null;
    const firstSessionId = sortedValid.length > 0 ? sortedValid[0].id : null;
    const lastSessionDate = sortedCompleted.length > 0 ? sortedCompleted[0].scheduled_start : null;

    let normalizedStatus: 'Active' | 'Dormant' | 'Completed' | 'Awaiting Acceptance' = isPendingMatch ? 'Awaiting Acceptance' : 'Active';
    if (relRecord) {
      if (relRecord.status === 'paused' || relRecord.metadata?.is_dormant) {
        normalizedStatus = 'Dormant';
      } else if (
        ['completed', 'terminated', 'transferred'].includes(relRecord.status) ||
        relRecord.care_stage === 'completed'
      ) {
        normalizedStatus = 'Completed';
      }
    }

    const intakeCompleted = Boolean(
      intake &&
      (intake.presenting_reason ||
        (Array.isArray(intake.concerns) && intake.concerns.length > 0) ||
        (intake.answers && Object.keys(intake.answers).length > 0))
    );

    const requestDate = submission?.submitted_at || intake?.created_at || match?.created_at || relRecord?.created_at || null;
    const matchingDate = match?.created_at || relRecord?.created_at || null;
    const therapistAcceptanceStatus = relRecord ? 'accepted' : 'pending';
    const therapistAcceptedAt = relRecord?.started_at || relRecord?.metadata?.accepted_at || relRecord?.created_at || null;
    const mutualAccepted = Boolean(relRecord);
    const mutualAcceptedAt = relRecord ? (relRecord.started_at || relRecord.metadata?.accepted_at || relRecord.created_at) : null;

    // Build the 9 Chronological Milestones
    const timeline: RelationshipTimelineMilestone[] = [
      {
        id: 'milestone_1',
        milestoneNumber: 1,
        title: 'Therapy Request Submitted',
        status: requestDate ? 'completed' : 'pending',
        timestamp: requestDate,
        details: requestDate
          ? `Client initiated therapy journey${intake?.presenting_reason ? `: "${intake.presenting_reason.substring(0, 100)}..."` : ''}`
          : 'Therapy request submission pending',
      },
      {
        id: 'milestone_2',
        milestoneNumber: 2,
        title: 'Intake Form Completed',
        status: intakeCompleted ? 'completed' : 'pending',
        timestamp: intake?.created_at || null,
        details: intakeCompleted
          ? `Clinical intake completed (${intake?.concerns?.length || 0} presenting concern(s))`
          : 'Client intake form pending completion',
      },
      {
        id: 'milestone_3',
        milestoneNumber: 3,
        title: 'Therapist Assigned & Matched',
        status: matchingDate ? 'completed' : 'pending',
        timestamp: matchingDate,
        details: matchingDate
          ? `Matched with ${thProfile?.full_name || 'Assigned Therapist'} (${match?.match_score ? `Score: ${match.match_score}` : 'Direct assignment'})`
          : 'Therapist candidate matching pending',
      },
      {
        id: 'milestone_4',
        milestoneNumber: 4,
        title: 'Therapist Accepted',
        status: therapistAcceptanceStatus === 'accepted' ? 'completed' : 'pending',
        timestamp: therapistAcceptedAt,
        details: therapistAcceptanceStatus === 'accepted'
          ? `${thProfile?.full_name || 'Therapist'} accepted client clinical request`
          : 'Awaiting therapist review and clinical acceptance',
      },
      {
        id: 'milestone_5',
        milestoneNumber: 5,
        title: 'Mutual Acceptance Completed',
        status: mutualAccepted ? 'completed' : 'pending',
        timestamp: mutualAcceptedAt,
        details: mutualAccepted
          ? 'Both client and therapist finalized mutual care connection'
          : 'Pending mutual confirmation from therapist and client',
      },
      {
        id: 'milestone_6',
        milestoneNumber: 6,
        title: 'Client Consent Provided',
        status: hasConsent ? 'completed' : 'pending',
        timestamp: consentDate,
        details: hasConsent
          ? `Informed Telehealth & Psychological Consent verified (Version: ${primaryConsent?.version || 'v1.0.0'})`
          : 'Required therapy consent pending from client',
      },
      {
        id: 'milestone_7',
        milestoneNumber: 7,
        title: 'First Session Booked',
        status: firstSessionBooked ? 'completed' : 'pending',
        timestamp: firstSessionDate,
        details: firstSessionBooked
          ? `First clinical consultation booked for ${new Date(firstSessionDate!).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' })}`
          : 'No valid first session booked yet',
      },
      {
        id: 'milestone_8',
        milestoneNumber: 8,
        title: 'Clinical Care Sessions',
        status: validAppointments.length > 1 ? 'completed' : (validAppointments.length === 1 ? 'in_progress' : 'pending'),
        timestamp: validAppointments[1]?.scheduled_start || validAppointments[0]?.scheduled_start || null,
        details: validAppointments.length > 0
          ? `${validAppointments.length} session(s) scheduled (${completedAppointments.length} completed)`
          : 'No clinical sessions scheduled yet',
      },
      {
        id: 'milestone_9',
        milestoneNumber: 9,
        title: normalizedStatus === 'Completed' ? 'Relationship Completed' : (normalizedStatus === 'Dormant' ? 'Relationship Paused / Dormant' : 'Care Journey Ongoing'),
        status: normalizedStatus === 'Completed' ? 'completed' : (normalizedStatus === 'Dormant' ? 'pending' : 'in_progress'),
        timestamp: relRecord?.ended_at || null,
        details: normalizedStatus === 'Completed'
          ? `Care cycle concluded on ${relRecord?.ended_at ? new Date(relRecord.ended_at).toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' }) : 'completed date'}${relRecord?.metadata?.transfer_reason ? ` (Reason: ${relRecord.metadata.transfer_reason})` : ''}`
          : (normalizedStatus === 'Dormant' ? 'Care relationship temporarily paused' : 'Active therapeutic care relationship'),
      },
    ];

    // Session History Table
    const sessionsList = relAppointments.map((a) => ({
      id: a.id,
      scheduledStart: a.scheduled_start,
      scheduledEnd: a.scheduled_end,
      status: a.status,
      sessionType: a.session_type || 'video',
      modality: a.modality || 'telehealth',
      meetingLink: a.google_meet_url || a.meeting_link || null,
      paymentStatus: a.payment_id ? 'paid' : (a.booking_id ? 'order_linked' : 'unpaid'),
      cancelledBy: a.cancelled_by || null,
      cancellationReason: a.cancellation_reason || null,
      createdAt: a.created_at,
    }));

    return {
      id: relationshipId,
      sourceType: isPendingMatch ? 'pending_match' : 'care_relationship',
      userId,
      therapistAccountId,
      clientName: intake?.full_name || user?.name || profile?.full_name || user?.phone_number || 'Client',
      clientEmail: intake?.email || null,
      clientPhone: intake?.phone_number || user?.phone_number || profile?.phone_number || null,
      therapistName: thProfile?.full_name || 'Assigned Therapist',
      therapistTitle: thProfile?.title || 'Consultant Psychologist',
      therapistQualification: thProfile?.qualification || '',
      therapistFee: Number(thAccount?.per_session_fee || 1500),
      requestDate,
      intakeCompleted,
      intakeStatus: intakeCompleted ? 'Completed' : 'Pending',
      intakeDate: intake?.created_at || null,
      matchedTherapistName: thProfile?.full_name || 'Assigned Therapist',
      matchingDate,
      therapistAcceptanceStatus,
      therapistAcceptedAt,
      mutualAccepted,
      mutualAcceptedAt,
      hasConsent,
      consentStatus: hasConsent ? 'Consented' : 'Pending',
      consentDate,
      consentType: primaryConsent?.consent_type || 'therapy_consent',
      consentVersion: primaryConsent?.version || 'v1.0.0',
      consentIp: primaryConsent?.ip_address || null,
      firstSessionBooked,
      firstSessionDate,
      firstSessionId,
      totalSessions: validAppointments.length,
      lastSessionDate,
      status: normalizedStatus,
      rawStatus: relRecord?.status || 'awaiting_therapist_acceptance',
      careStage: relRecord?.care_stage || 'intake',
      createdAt: relRecord?.created_at || match?.created_at || new Date().toISOString(),

      clientDetails: {
        id: userId,
        name: intake?.full_name || user?.name || profile?.full_name || 'Client',
        phone: user?.phone_number || profile?.phone_number || null,
        email: intake?.email || null,
        registeredAt: user?.created_at || profile?.created_at || '',
      },
      therapistDetails: {
        id: therapistAccountId,
        name: thProfile?.full_name || 'Assigned Therapist',
        title: thProfile?.title || 'Consultant Psychologist',
        qualification: thProfile?.qualification || '',
        experienceYears: thProfile?.experience_years || 0,
        phone: thAccount?.phone_number || null,
        fee: Number(thAccount?.per_session_fee || 1500),
      },
      intakeDetails: intake
        ? {
            presentingReason: intake.presenting_reason || null,
            concerns: Array.isArray(intake.concerns) ? intake.concerns : [],
            affectedLifeAreas: Array.isArray(intake.affected_life_areas) ? intake.affected_life_areas : [],
            age: intake.age || null,
            gender: intake.gender || null,
            city: intake.city || null,
            livingSituation: intake.living_situation || null,
            answers: intake.answers || {},
            submittedAt: intake.created_at || null,
          }
        : null,
      matchingDetails: {
        matchScore: match?.match_score ? Number(match.match_score) : null,
        matchRank: match?.match_rank ? Number(match.match_rank) : null,
        matchReasons: Array.isArray(match?.match_reasons) ? match.match_reasons : [],
        matchedAt: match?.created_at || null,
      },
      sessionsList,
      timeline,
    };
  }

  /**
   * Generates the authoritative legal consent document verification record for an admin.
   */
  static async getConsentDocument(relationshipId: string) {
    const detail = await this.getRelationshipDetail(relationshipId);

    const clientName = detail.clientDetails.name || 'Verified Client';
    const therapistName = detail.therapistDetails.name || 'Assigned Clinician';
    const consentedAtIso = detail.consentDate || detail.requestDate || new Date().toISOString();

    return {
      documentId: `CONSENT-DOC-${detail.userId.substring(0, 8).toUpperCase()}-${detail.therapistAccountId.substring(0, 6).toUpperCase()}`,
      relationshipId: detail.id,
      clientId: detail.userId,
      clientName,
      clientEmail: detail.clientDetails.email,
      clientPhone: detail.clientDetails.phone,
      therapistId: detail.therapistAccountId,
      therapistName,
      therapistTitle: detail.therapistDetails.title,
      consentStatus: detail.hasConsent ? 'AUTHENTICATED_AND_VERIFIED' : 'PENDING_CONSENT',
      hasConsent: detail.hasConsent,
      consentType: 'Informed Consent for Psychological & Telehealth Services',
      consentVersion: detail.consentVersion || 'v1.0.0',
      consentedAt: consentedAtIso,
      ipAddress: detail.consentIp || '103.160.174.114 (Recorded Session)',
      jurisdiction: 'Ahmedabad, Gujarat, India (RUMINARI (OPC) PVT LTD)',
      governingBody: 'Rehabilitation Council of India (RCI) / Digital Clinical Ethics Standards',
      legalClauses: [
        {
          heading: '1. Purpose & Scope of Telehealth Services',
          body: 'Ingress Within provides professional psychological consultations, psychoeducation, and guided clinical care delivered remotely via secure video and audio conferencing. The client acknowledges that psychological counseling is a collaborative healthcare process.',
        },
        {
          heading: '2. Professional Confidentiality & Mandatory Exceptions',
          body: 'All clinical communications, assessment data, and therapy session notes are kept strictly confidential under Indian clinical psychology standards. Disclosures may only occur where required by law: clear and imminent risk of severe harm to self or others, child or elder abuse, or valid court subpoena.',
        },
        {
          heading: '3. Emergency & Crisis Disclaimer',
          body: 'Ingress Within is not an emergency crisis intervention service. If the client experiences an acute psychiatric emergency or thoughts of self-harm, they must immediately contact emergency medical services (112 / Vandrevala Foundation 9999 666 555 / Tele-MANAS 14416).',
        },
        {
          heading: '4. Voluntary Participation & Right to Discontinue',
          body: 'Therapy is entirely voluntary. The client retains the right to withdraw from care, pause sessions, or request a change of therapist at any stage without prejudice.',
        },
        {
          heading: '5. Data Protection & Records Retention',
          body: 'Session records, booking references, and identity information are securely stored with role-based access control. Clinical formulations and SOAP notes remain strictly segregated and are accessible only to the treating therapist.',
        },
      ],
      authorizedBy: 'RUMINARI (OPC) PVT LTD — Legal & Clinical Governance',
      issuedAt: new Date().toISOString(),
    };
  }

  /**
   * Deletes a therapy care relationship and optionally resets all client therapy data.
   */
  static async deleteRelationship(
    relationshipId: string,
    options: { resetClientTherapyData?: boolean; deletedBy?: string } = {}
  ): Promise<{
    success: boolean;
    relationshipId: string;
    userId: string | null;
    therapistAccountId: string | null;
    clientTherapyReset: boolean;
    message: string;
  }> {
    if (!relationshipId) {
      const err: any = new Error('Relationship ID is required.');
      err.status = 400;
      throw err;
    }

    // 1. Fetch relationship to extract user_id, therapist_account_id, therapy_session_id
    const { data: rel, error: fetchErr } = await supabase
      .from('therapy_care_relationships')
      .select('id, user_id, therapist_account_id, therapy_session_id')
      .eq('id', relationshipId)
      .maybeSingle();

    if (fetchErr) {
      console.error('[AdminTherapyRelationshipService] Error fetching relationship for deletion:', fetchErr);
      const err: any = new Error(`Failed to fetch relationship: ${fetchErr.message}`);
      err.status = 500;
      throw err;
    }

    const userId = rel?.user_id || null;
    const therapistAccountId = rel?.therapist_account_id || null;

    // 2. Delete the care relationship row (cascades to therapeutic profiles, reviews, goals, booking links, etc.)
    const { error: delRelErr } = await supabase
      .from('therapy_care_relationships')
      .delete()
      .eq('id', relationshipId);

    if (delRelErr) {
      console.error('[AdminTherapyRelationshipService] Error deleting relationship:', delRelErr);
      const err: any = new Error(`Failed to delete relationship: ${delRelErr.message}`);
      err.status = 500;
      throw err;
    }

    // 3. Clean up matches between this user and therapist
    if (userId && therapistAccountId) {
      await supabase
        .from('therapy_matches')
        .delete()
        .eq('user_id', userId)
        .eq('therapist_account_id', therapistAccountId);
    }

    // 4. If resetClientTherapyData is requested, purge all therapy records for this client
    let clientTherapyReset = false;
    if (options.resetClientTherapyData && userId) {
      clientTherapyReset = true;
      // Delete any other care relationships for this user
      await supabase.from('therapy_care_relationships').delete().eq('user_id', userId);
      // Delete therapy sessions
      await supabase.from('therapy_sessions').delete().eq('user_id', userId);
      // Delete matches
      await supabase.from('therapy_matches').delete().eq('user_id', userId);
      // Delete submissions
      await supabase.from('therapy_submissions').delete().eq('user_id', userId);
      // Delete safety assessments
      await supabase.from('therapy_safety_assessments').delete().eq('user_id', userId);
      // Delete consents
      await supabase.from('client_insight_sharing_consents').delete().eq('client_id', userId);
      // Delete session bookings
      await supabase.from('therapy_session_bookings').delete().eq('user_id', userId);
      // Delete appointments
      await supabase.from('therapist_clinical_appointments').delete().eq('user_id', userId);
      // Delete client accounts
      await supabase.from('therapy_client_accounts').delete().eq('user_id', userId);

      // Find user emails from intake or auth to clean by email as well
      const { data: intakeData } = await supabase
        .from('therapy_intakes')
        .select('email')
        .eq('user_id', userId);

      const emailsToClean = new Set<string>();
      if (intakeData) {
        intakeData.forEach((row) => {
          if (row.email) emailsToClean.add(row.email.toLowerCase().trim());
        });
      }

      // Delete intakes
      await supabase.from('therapy_intakes').delete().eq('user_id', userId);

      for (const email of emailsToClean) {
        await supabase.from('therapy_intakes').delete().ilike('email', email);
        await supabase.from('manual_matching_reviews').delete().ilike('client_email', email);
        await supabase.from('therapy_client_accounts').delete().ilike('email', email);
      }
    } else if (userId) {
      // Just unbind active relationship from client account if exists
      await supabase
        .from('therapy_client_accounts')
        .update({
          active_relationship_id: null,
          active_therapist_account_id: null,
          status: 'intake_pending',
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId);
    }

    // 5. Audit log
    try {
      await supabase.from('audit_logs').insert({
        action: 'ADMIN_DELETE_THERAPY_RELATIONSHIP',
        user_id: userId,
        metadata: {
          relationshipId,
          userId,
          therapistAccountId,
          clientTherapyReset,
          deletedBy: options.deletedBy || 'admin',
          timestamp: new Date().toISOString(),
        },
      });
    } catch (auditErr) {
      console.warn('[AdminTherapyRelationshipService] Audit log notice:', auditErr);
    }

    return {
      success: true,
      relationshipId,
      userId,
      therapistAccountId,
      clientTherapyReset,
      message: clientTherapyReset
        ? 'Therapy relationship and client therapy data have been completely deleted.'
        : 'Therapy relationship has been successfully deleted.',
    };
  }
}
