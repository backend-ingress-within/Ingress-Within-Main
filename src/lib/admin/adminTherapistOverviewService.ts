import { supabase } from '../db';

export interface TherapistOverviewAggregateMetrics {
  totalRegisteredTherapists: number;
  totalTherapistsWithClients: number;
  totalActiveTherapists: number;
  totalUniqueClientsAcrossTherapists: number;
  totalActiveRelationships: number;
  totalDormantRelationships: number;
  totalCompletedRelationships: number;
  totalValidSessions: number;
}

export interface TherapistOverviewItem {
  id: string; // therapist_account_id
  name: string;
  email: string | null;
  phone: string | null;
  title: string | null;
  qualification: string | null;
  experienceYears: number | null;
  status: string; // 'active', 'pending', 'suspended'
  verificationStatus: string; // 'verified', 'pending', etc.
  canPractice: boolean;
  perSessionFee: number;
  rciRegistered: boolean;
  rciNumber: string | null;
  
  // Client stats
  totalHistoricalClients: number; // Unique clients ever assigned
  totalRelationships: number; // Total care relationships
  activeClients: number;
  dormantClients: number;
  completedClients: number;
  
  // Session stats
  totalValidSessions: number;
  completedSessions: number;
  upcomingSessions: number;
  cancelledSessions: number;
  noShowSessions: number;
  firstSessionDate: string | null;
  lastCompletedSessionDate: string | null;
  
  createdAt: string;
}

export interface TherapistClientItem {
  relationshipId: string;
  clientId: string;
  clientName: string;
  clientEmail: string | null;
  clientPhone: string | null;
  requestDate: string | null;
  intakeCompleted: boolean;
  matchingStatus: string;
  matchingDate: string | null;
  therapistAcceptanceStatus: string;
  therapistAcceptedAt: string | null;
  mutualAccepted: boolean;
  mutualAcceptedAt: string | null;
  hasConsent: boolean;
  consentStatus: 'Consented' | 'Pending';
  consentDate: string | null;
  firstSessionBooked: boolean;
  firstSessionDate: string | null;
  totalValidSessions: number;
  completedSessions: number;
  lastCompletedSessionDate: string | null;
  relationshipStatus: 'Active' | 'Dormant' | 'Completed';
  rawStatus: string;
  careStage: string;
  startedAt: string | null;
  endedAt: string | null;
  createdAt: string;
}

export interface TherapistSanitizedSessionItem {
  id: string;
  relationshipId: string | null;
  clientId: string;
  clientName: string;
  scheduledStart: string;
  scheduledEnd: string;
  status: string;
  sessionType: string;
  attendanceStatus: string | null;
  paymentStatus: string | null;
  meetingLink: string | null;
  createdAt: string;
}

export interface TherapistDetailPayload {
  therapist: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
    title: string | null;
    qualification: string | null;
    experienceYears: number | null;
    bio: string | null;
    city: string | null;
    state: string | null;
    specializations: string[];
    languages: string[];
    status: string;
    verificationStatus: string;
    canPractice: boolean;
    perSessionFee: number;
    rciRegistered: boolean;
    rciNumber: string | null;
    commissionRate: number;
    createdAt: string;
  };
  clientStats: {
    uniqueClientsEver: number;
    activeClients: number;
    dormantRelationships: number;
    completedRelationships: number;
    totalRelationships: number;
  };
  sessionStats: {
    totalValidSessions: number;
    completedSessions: number;
    upcomingConfirmedSessions: number;
    cancelledSessions: number;
    noShowSessions: number;
    firstCompletedSessionDate: string | null;
    mostRecentCompletedSessionDate: string | null;
  };
  clients: TherapistClientItem[];
  sessions: TherapistSanitizedSessionItem[];
}

export class AdminTherapistOverviewService {
  /**
   * Helper: Normalize Care Relationship Status
   */
  private static normalizeRelationshipStatus(rawStatus?: string, careStage?: string): 'Active' | 'Dormant' | 'Completed' {
    const s = (rawStatus || '').toLowerCase();
    const stage = (careStage || '').toLowerCase();

    if (s === 'completed' || s === 'terminated' || s === 'transferred' || stage === 'completed') {
      return 'Completed';
    }
    if (s === 'paused' || s === 'dormant' || stage === 'paused') {
      return 'Dormant';
    }
    return 'Active';
  }

  /**
   * Helper: Filter appointments strictly belonging to a specific relationship
   */
  private static filterRelationshipAppointments(
    appointments: any[],
    relationship: { id: string; therapist_account_id: string; user_id: string; started_at?: string; ended_at?: string; created_at: string }
  ): any[] {
    return appointments.filter((a) => {
      if (a.relationship_id) {
        return a.relationship_id === relationship.id;
      }
      // Legacy fallback
      if (a.therapist_account_id !== relationship.therapist_account_id || a.user_id !== relationship.user_id) {
        return false;
      }
      const apptStart = new Date(a.scheduled_start).getTime();
      const relStart = new Date(relationship.started_at || relationship.created_at).getTime() - 24 * 60 * 60 * 1000;
      if (apptStart < relStart) return false;
      if (relationship.ended_at && apptStart > new Date(relationship.ended_at).getTime() + 24 * 60 * 60 * 1000) return false;
      return true;
    });
  }

  /**
   * Fetch aggregate platform metrics and list of therapist summaries
   */
  static async getOverviewList(params: {
    page?: number;
    limit?: number;
    search?: string;
    verificationStatus?: string;
    activityFilter?: string;
    sort?: string;
  }): Promise<{
    aggregateMetrics: TherapistOverviewAggregateMetrics;
    therapists: TherapistOverviewItem[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(100, Math.max(1, params.limit || 15));
    const search = (params.search || '').trim().toLowerCase();
    const verificationStatus = params.verificationStatus || 'all';
    const activityFilter = params.activityFilter || 'all';
    const sort = params.sort || 'total_clients_desc';

    // 1. Batch query all required primary tables in parallel to avoid N+1 queries
    const [
      { data: accounts, error: accError },
      { data: profiles, error: profError },
      { data: careRels, error: relError },
      { data: appointments, error: apptError },
    ] = await Promise.all([
      supabase.from('therapist_accounts').select('*').order('created_at', { ascending: false }),
      supabase.from('therapist_profiles').select('*'),
      supabase.from('therapy_care_relationships').select('*'),
      supabase.from('therapist_clinical_appointments').select('*').order('scheduled_start', { ascending: true }),
    ]);

    if (accError) throw new Error(`Failed to query therapist accounts: ${accError.message}`);
    if (profError) throw new Error(`Failed to query therapist profiles: ${profError.message}`);
    if (relError) throw new Error(`Failed to query care relationships: ${relError.message}`);
    if (apptError) throw new Error(`Failed to query appointments: ${apptError.message}`);

    const safeAccounts = accounts || [];
    const safeProfiles = profiles || [];
    const safeCareRels = careRels || [];
    const safeAppts = appointments || [];

    // Map profiles by therapist_account_id
    const profileMap = new Map<string, any>(
      safeProfiles.map((p) => [p.therapist_account_id, p])
    );

    // Group care relationships by therapist_account_id
    const relsByTherapist = new Map<string, any[]>();
    for (const rel of safeCareRels) {
      if (!rel.therapist_account_id) continue;
      const list = relsByTherapist.get(rel.therapist_account_id) || [];
      list.push(rel);
      relsByTherapist.set(rel.therapist_account_id, list);
    }

    // Group appointments by therapist_account_id
    const apptsByTherapist = new Map<string, any[]>();
    for (const appt of safeAppts) {
      if (!appt.therapist_account_id) continue;
      const list = apptsByTherapist.get(appt.therapist_account_id) || [];
      list.push(appt);
      apptsByTherapist.set(appt.therapist_account_id, list);
    }

    // 2. Compute Platform-Wide Aggregate Metrics
    const totalRegisteredTherapists = safeAccounts.length;
    const totalActiveTherapists = safeAccounts.filter(
      (a) => a.status === 'active' && a.can_practice === true
    ).length;

    // Therapists with at least one client relationship
    const therapistsWithRelSet = new Set(safeCareRels.map((r) => r.therapist_account_id).filter(Boolean));
    const totalTherapistsWithClients = therapistsWithRelSet.size;

    // Total unique clients across all relationships (Do not silently count multi-therapist clients multiple times)
    const uniqueClientsSet = new Set(safeCareRels.map((r) => r.user_id).filter(Boolean));
    const totalUniqueClientsAcrossTherapists = uniqueClientsSet.size;

    // Relationship status aggregates
    let totalActiveRelationships = 0;
    let totalDormantRelationships = 0;
    let totalCompletedRelationships = 0;

    for (const r of safeCareRels) {
      const norm = this.normalizeRelationshipStatus(r.status, r.care_stage);
      if (norm === 'Active') totalActiveRelationships++;
      else if (norm === 'Dormant') totalDormantRelationships++;
      else if (norm === 'Completed') totalCompletedRelationships++;
    }

    // Total valid sessions across all therapists (excluding cancelled and rescheduled)
    const totalValidSessions = safeAppts.filter(
      (a) => a.status !== 'cancelled' && a.status !== 'rescheduled'
    ).length;

    const aggregateMetrics: TherapistOverviewAggregateMetrics = {
      totalRegisteredTherapists,
      totalTherapistsWithClients,
      totalActiveTherapists,
      totalUniqueClientsAcrossTherapists,
      totalActiveRelationships,
      totalDormantRelationships,
      totalCompletedRelationships,
      totalValidSessions,
    };

    // 3. Compute Per-Therapist Statistics
    const nowIso = new Date().toISOString();
    const items: TherapistOverviewItem[] = [];

    for (const account of safeAccounts) {
      const profile = profileMap.get(account.id) || {};
      const therapistRels = relsByTherapist.get(account.id) || [];
      const therapistAppts = apptsByTherapist.get(account.id) || [];

      // Unique clients ever assigned to this therapist
      const uniqueClientIds = new Set(therapistRels.map((r) => r.user_id).filter(Boolean));
      const totalHistoricalClients = uniqueClientIds.size;
      const totalRelationships = therapistRels.length;

      let activeClients = 0;
      let dormantClients = 0;
      let completedClients = 0;

      for (const r of therapistRels) {
        const norm = this.normalizeRelationshipStatus(r.status, r.care_stage);
        if (norm === 'Active') activeClients++;
        else if (norm === 'Dormant') dormantClients++;
        else if (norm === 'Completed') completedClients++;
      }

      // Valid sessions for this therapist
      const validAppts = therapistAppts.filter(
        (a) => a.status !== 'cancelled' && a.status !== 'rescheduled'
      );
      const completedAppts = therapistAppts.filter((a) => a.status === 'completed');
      const upcomingAppts = therapistAppts.filter(
        (a) => (a.status === 'scheduled' || a.status === 'confirmed') && a.scheduled_start >= nowIso
      );
      const cancelledAppts = therapistAppts.filter((a) => a.status === 'cancelled');
      const noShowAppts = therapistAppts.filter(
        (a) => a.status === 'no_show' || a.attendance_status === 'client_no_show'
      );

      // Chronological session timestamps
      const sortedValid = [...validAppts].sort(
        (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
      );
      const sortedCompleted = [...completedAppts].sort(
        (a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime()
      );

      const firstSessionDate = sortedValid.length > 0 ? sortedValid[0].scheduled_start : null;
      const lastCompletedSessionDate = sortedCompleted.length > 0 ? sortedCompleted[0].scheduled_start : null;

      const name = profile.full_name || 'Therapist';
      const email = profile.contact_email || null;
      const phone = account.phone_number || null;

      items.push({
        id: account.id,
        name,
        email,
        phone,
        title: profile.title || null,
        qualification: profile.qualification || null,
        experienceYears: profile.experience_years ? Number(profile.experience_years) : null,
        status: account.status || 'pending',
        verificationStatus: account.verification_status || 'pending',
        canPractice: Boolean(account.can_practice),
        perSessionFee: Number(account.per_session_fee || 1500),
        rciRegistered: Boolean(account.rci_registered),
        rciNumber: account.rci_number || null,
        totalHistoricalClients,
        totalRelationships,
        activeClients,
        dormantClients,
        completedClients,
        totalValidSessions: validAppts.length,
        completedSessions: completedAppts.length,
        upcomingSessions: upcomingAppts.length,
        cancelledSessions: cancelledAppts.length,
        noShowSessions: noShowAppts.length,
        firstSessionDate,
        lastCompletedSessionDate,
        createdAt: account.created_at,
      });
    }

    // 4. In-Memory Filter & Search
    let filtered = items;

    if (search) {
      filtered = filtered.filter(
        (t) =>
          t.name.toLowerCase().includes(search) ||
          (t.email && t.email.toLowerCase().includes(search)) ||
          (t.phone && t.phone.toLowerCase().includes(search))
      );
    }

    if (verificationStatus !== 'all') {
      filtered = filtered.filter((t) => {
        if (verificationStatus === 'verified' || verificationStatus === 'active') {
          return t.verificationStatus === 'verified' || t.status === 'active';
        }
        if (verificationStatus === 'pending') {
          return t.verificationStatus === 'pending' || t.status === 'pending';
        }
        if (verificationStatus === 'suspended') {
          return t.status === 'suspended' || t.verificationStatus === 'rejected';
        }
        return t.verificationStatus === verificationStatus || t.status === verificationStatus;
      });
    }

    if (activityFilter !== 'all') {
      filtered = filtered.filter((t) => {
        if (activityFilter === 'with_active_clients') return t.activeClients > 0;
        if (activityFilter === 'with_historical_clients') return t.totalHistoricalClients > 0;
        if (activityFilter === 'no_clients') return t.totalHistoricalClients === 0;
        return true;
      });
    }

    // 5. In-Memory Sorting
    filtered.sort((a, b) => {
      switch (sort) {
        case 'active_clients_desc':
          if (b.activeClients !== a.activeClients) return b.activeClients - a.activeClients;
          return b.totalHistoricalClients - a.totalHistoricalClients;
        case 'total_sessions_desc':
          if (b.totalValidSessions !== a.totalValidSessions) return b.totalValidSessions - a.totalValidSessions;
          return b.completedSessions - a.completedSessions;
        case 'last_session_desc': {
          if (!a.lastCompletedSessionDate && !b.lastCompletedSessionDate) return 0;
          if (!a.lastCompletedSessionDate) return 1;
          if (!b.lastCompletedSessionDate) return -1;
          return new Date(b.lastCompletedSessionDate).getTime() - new Date(a.lastCompletedSessionDate).getTime();
        }
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'total_clients_desc':
        default:
          if (b.totalHistoricalClients !== a.totalHistoricalClients) {
            return b.totalHistoricalClients - a.totalHistoricalClients;
          }
          return a.name.localeCompare(b.name);
      }
    });

    // 6. Pagination
    const total = filtered.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const offset = (page - 1) * limit;
    const paginatedTherapists = filtered.slice(offset, offset + limit);

    return {
      aggregateMetrics,
      therapists: paginatedTherapists,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Fetch detailed therapist profile, client list, session stats, and sanitized session history
   */
  static async getTherapistDetail(therapistAccountId: string): Promise<TherapistDetailPayload> {
    if (!therapistAccountId) {
      throw new Error('Therapist account ID is required');
    }

    // 1. Fetch account and profile
    const [
      { data: account, error: accError },
      { data: profile, error: profError },
    ] = await Promise.all([
      supabase.from('therapist_accounts').select('*').eq('id', therapistAccountId).maybeSingle(),
      supabase.from('therapist_profiles').select('*').eq('therapist_account_id', therapistAccountId).maybeSingle(),
    ]);

    if (accError) throw new Error(`Failed to query therapist account: ${accError.message}`);
    if (!account) throw new Error('Therapist account not found');

    const safeProfile = profile || {};

    // 2. Query care relationships and appointments for this therapist
    const [
      { data: careRels, error: relError },
      { data: appointments, error: apptError },
    ] = await Promise.all([
      supabase
        .from('therapy_care_relationships')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .order('created_at', { ascending: false }),
      supabase
        .from('therapist_clinical_appointments')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .order('scheduled_start', { ascending: false }),
    ]);

    if (relError) throw new Error(`Failed to query care relationships: ${relError.message}`);
    if (apptError) throw new Error(`Failed to query appointments: ${apptError.message}`);

    const safeCareRels = careRels || [];
    const safeAppts = appointments || [];

    // Distinct client IDs involved with this therapist
    const clientUserIds = Array.from(
      new Set([
        ...safeCareRels.map((r) => r.user_id),
        ...safeAppts.map((a) => a.user_id),
      ].filter(Boolean))
    );

    // 3. Batch query client details, intakes, submissions, matches, and consents
    const [
      { data: users },
      { data: profilesList },
      { data: intakes },
      { data: submissions },
      { data: matches },
      { data: consents },
    ] = await Promise.all([
      clientUserIds.length > 0
        ? supabase.from('users').select('id, name, phone_number, created_at').in('id', clientUserIds)
        : Promise.resolve({ data: [] }),
      clientUserIds.length > 0
        ? supabase.from('profiles').select('id, full_name, phone_number, consent_completed').in('id', clientUserIds)
        : Promise.resolve({ data: [] }),
      clientUserIds.length > 0
        ? supabase.from('therapy_intakes').select('*').in('user_id', clientUserIds).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      clientUserIds.length > 0
        ? supabase.from('therapy_submissions').select('*').in('user_id', clientUserIds).order('created_at', { ascending: false })
        : Promise.resolve({ data: [] }),
      clientUserIds.length > 0
        ? supabase.from('therapy_matches').select('*').eq('therapist_account_id', therapistAccountId).in('user_id', clientUserIds)
        : Promise.resolve({ data: [] }),
      clientUserIds.length > 0
        ? supabase.from('consents').select('*').in('user_id', clientUserIds).order('consented_at', { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

    const userMap = new Map((users || []).map((u) => [u.id, u]));
    const profileMap = new Map((profilesList || []).map((p) => [p.id, p]));

    // 4. Compute Aggregate Statistics
    const uniqueClientsEver = new Set(safeCareRels.map((r) => r.user_id).filter(Boolean)).size;
    let activeClients = 0;
    let dormantRelationships = 0;
    let completedRelationships = 0;

    for (const r of safeCareRels) {
      const norm = this.normalizeRelationshipStatus(r.status, r.care_stage);
      if (norm === 'Active') activeClients++;
      else if (norm === 'Dormant') dormantRelationships++;
      else if (norm === 'Completed') completedRelationships++;
    }

    const nowIso = new Date().toISOString();
    const validAppts = safeAppts.filter(
      (a) => a.status !== 'cancelled' && a.status !== 'rescheduled'
    );
    const completedAppts = safeAppts.filter((a) => a.status === 'completed');
    const upcomingConfirmedSessions = safeAppts.filter(
      (a) => (a.status === 'scheduled' || a.status === 'confirmed') && a.scheduled_start >= nowIso
    ).length;
    const cancelledSessions = safeAppts.filter((a) => a.status === 'cancelled').length;
    const noShowSessions = safeAppts.filter(
      (a) => a.status === 'no_show' || a.attendance_status === 'client_no_show'
    ).length;

    // Chronological completed sessions
    const sortedCompleted = [...completedAppts].sort(
      (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
    );
    const firstCompletedSessionDate = sortedCompleted.length > 0 ? sortedCompleted[0].scheduled_start : null;
    const mostRecentCompletedSessionDate =
      sortedCompleted.length > 0 ? sortedCompleted[sortedCompleted.length - 1].scheduled_start : null;

    // 5. Build Client List
    const clientItems: TherapistClientItem[] = [];

    for (const rel of safeCareRels) {
      const user = userMap.get(rel.user_id);
      const profileItem = profileMap.get(rel.user_id);
      const clientName = profileItem?.full_name || user?.name || 'Client';
      const clientPhone = profileItem?.phone_number || user?.phone_number || null;

      // Intake & submission
      const userIntakes = (intakes || []).filter((i) => i.user_id === rel.user_id);
      const intake = userIntakes[0] || null;
      const submission = (submissions || []).find((s) => s.user_id === rel.user_id);
      const clientEmail = (submission?.metadata?.client_email || submission?.client_email || intake?.answers?.email || null);
      const requestDate = intake?.created_at || submission?.created_at || rel.created_at;
      const intakeCompleted = Boolean(intake?.completed_at || intake?.status === 'completed' || intake?.presenting_concern);

      // Match info
      const match = (matches || []).find((m) => m.user_id === rel.user_id);
      const matchingStatus = match?.match_status || (rel.metadata?.source_match_id ? 'accepted' : 'assigned');
      const matchingDate = match?.created_at || rel.created_at;
      const therapistAcceptanceStatus = (match?.therapist_accepted ? 'accepted' : (match?.match_status === 'accepted' || rel.status === 'active' ? 'accepted' : 'pending'));
      const therapistAcceptedAt = match?.therapist_accepted_at || rel.started_at || rel.created_at;

      // Mutual Acceptance
      const mutualAccepted = Boolean(rel.started_at || (rel.metadata?.accepted_at && therapistAcceptanceStatus === 'accepted'));
      const mutualAcceptedAt = rel.metadata?.accepted_at || rel.started_at || null;

      // Consent
      const userConsents = (consents || []).filter((c) => c.user_id === rel.user_id);
      const primaryConsent = userConsents[0];
      const hasConsent = Boolean(userConsents.length > 0 || profileItem?.consent_completed || (intake?.consents && Object.keys(intake.consents).length > 0));
      const consentDate = primaryConsent?.consented_at || intake?.created_at || rel.started_at || null;

      // Sessions strictly isolated for this relationship
      const relAppts = this.filterRelationshipAppointments(safeAppts, rel);
      const validRelAppts = relAppts.filter((a) => a.status !== 'cancelled' && a.status !== 'rescheduled');
      const completedRelAppts = relAppts.filter((a) => a.status === 'completed');

      const sortedValidRelAppts = [...validRelAppts].sort(
        (a, b) => new Date(a.scheduled_start).getTime() - new Date(b.scheduled_start).getTime()
      );
      const sortedCompletedRelAppts = [...completedRelAppts].sort(
        (a, b) => new Date(b.scheduled_start).getTime() - new Date(a.scheduled_start).getTime()
      );

      const firstSessionDate = sortedValidRelAppts.length > 0 ? sortedValidRelAppts[0].scheduled_start : null;
      const lastCompletedSessionDate = sortedCompletedRelAppts.length > 0 ? sortedCompletedRelAppts[0].scheduled_start : null;

      const normStatus = this.normalizeRelationshipStatus(rel.status, rel.care_stage);

      clientItems.push({
        relationshipId: rel.id,
        clientId: rel.user_id,
        clientName,
        clientEmail,
        clientPhone,
        requestDate,
        intakeCompleted,
        matchingStatus,
        matchingDate,
        therapistAcceptanceStatus,
        therapistAcceptedAt,
        mutualAccepted,
        mutualAcceptedAt,
        hasConsent,
        consentStatus: hasConsent ? 'Consented' : 'Pending',
        consentDate,
        firstSessionBooked: Boolean(firstSessionDate),
        firstSessionDate,
        totalValidSessions: validRelAppts.length,
        completedSessions: completedRelAppts.length,
        lastCompletedSessionDate,
        relationshipStatus: normStatus,
        rawStatus: rel.status,
        careStage: rel.care_stage || 'active_care',
        startedAt: rel.started_at,
        endedAt: rel.ended_at,
        createdAt: rel.created_at,
      });
    }

    // 6. Build Sanitized Sessions (Strict clinical privacy: No SOAP notes, no formulations, no journals)
    const sanitizedSessions: TherapistSanitizedSessionItem[] = safeAppts.map((appt) => {
      const user = userMap.get(appt.user_id);
      const profileItem = profileMap.get(appt.user_id);
      const clientName = profileItem?.full_name || user?.name || 'Client';

      return {
        id: appt.id,
        relationshipId: appt.relationship_id || null,
        clientId: appt.user_id,
        clientName,
        scheduledStart: appt.scheduled_start,
        scheduledEnd: appt.scheduled_end,
        status: appt.status,
        sessionType: appt.session_type || 'video',
        attendanceStatus: appt.attendance_status || null,
        paymentStatus: appt.payment_id ? 'paid' : (appt.payment_status || 'unpaid'),
        meetingLink: appt.meeting_link || appt.google_meet_url || null,
        createdAt: appt.created_at,
      };
    });

    return {
      therapist: {
        id: account.id,
        name: safeProfile.full_name || 'Therapist',
        email: safeProfile.contact_email || null,
        phone: account.phone_number || null,
        title: safeProfile.title || null,
        qualification: safeProfile.qualification || null,
        experienceYears: safeProfile.experience_years ? Number(safeProfile.experience_years) : null,
        bio: safeProfile.bio || null,
        city: safeProfile.city || null,
        state: safeProfile.state || null,
        specializations: Array.isArray(safeProfile.specializations) ? safeProfile.specializations : [],
        languages: Array.isArray(safeProfile.languages) ? safeProfile.languages : [],
        status: account.status || 'pending',
        verificationStatus: account.verification_status || 'pending',
        canPractice: Boolean(account.can_practice),
        perSessionFee: Number(account.per_session_fee || 1500),
        rciRegistered: Boolean(account.rci_registered),
        rciNumber: account.rci_number || null,
        commissionRate: Number(account.commission_rate || 0.20),
        createdAt: account.created_at,
      },
      clientStats: {
        uniqueClientsEver,
        activeClients,
        dormantRelationships,
        completedRelationships,
        totalRelationships: safeCareRels.length,
      },
      sessionStats: {
        totalValidSessions: validAppts.length,
        completedSessions: completedAppts.length,
        upcomingConfirmedSessions,
        cancelledSessions,
        noShowSessions,
        firstCompletedSessionDate,
        mostRecentCompletedSessionDate,
      },
      clients: clientItems,
      sessions: sanitizedSessions,
    };
  }
}
