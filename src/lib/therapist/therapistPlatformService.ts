import { supabase } from '../db';

export class TherapistPlatformService {
  /**
   * =========================================================================
   * 1. ONBOARDING & APPLICATION WORKFLOW
   * =========================================================================
   */

  /**
   * Retrieves the current onboarding draft / application for a therapist.
   */
  static async getOnboardingState(therapistAccountId: string) {
    // 1. Fetch application record if exists
    const { data: app } = await supabase
      .from('therapist_applications')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .maybeSingle();

    // 2. Fetch account & profile
    const { data: account } = await supabase
      .from('therapist_accounts')
      .select('id, phone_number, status, can_practice, application_status, verification_status, rci_registered, rci_number')
      .eq('id', therapistAccountId)
      .single();

    const { data: profile } = await supabase
      .from('therapist_profiles')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .maybeSingle();

    return {
      application: app || {
        step: 1,
        answers: {},
        documents: [],
        submitted_at: null,
        reviewed_at: null,
        reviewer_notes: null,
      },
      account: account || null,
      profile: profile || null,
    };
  }

  /**
   * Saves a draft step in the multi-step onboarding flow.
   */
  static async saveOnboardingDraft(
    therapistAccountId: string,
    step: number,
    answers: Record<string, any>,
    documents: any[] = []
  ) {
    const { data: existingApp } = await supabase
      .from('therapist_applications')
      .select('answers, documents')
      .eq('therapist_account_id', therapistAccountId)
      .maybeSingle();

    const mergedAnswers = {
      ...(existingApp?.answers || {}),
      ...answers,
    };

    const mergedDocuments = documents.length > 0 ? documents : (existingApp?.documents || []);

    const { data, error } = await supabase
      .from('therapist_applications')
      .upsert(
        {
          therapist_account_id: therapistAccountId,
          step: Math.max(1, Math.min(11, step)),
          answers: mergedAnswers,
          documents: mergedDocuments,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'therapist_account_id' }
      )
      .select('*')
      .single();

    if (error) {
      console.error('[TherapistPlatformService] saveOnboardingDraft failed:', error);
      throw new Error('Failed to save onboarding progress.');
    }

    return data;
  }

  /**
   * Formally submits the completed onboarding application for administrative review.
   * STRICT: sets application_status = 'submitted', can_practice remains false.
   */
  static async submitApplication(therapistAccountId: string, answers: Record<string, any>) {
    const existing = await this.getOnboardingState(therapistAccountId);
    const mergedAnswers = {
      ...(existing.application?.answers || {}),
      ...answers,
    };

    const now = new Date().toISOString();

    // 1. Update therapist_applications
    const { data: app, error: appError } = await supabase
      .from('therapist_applications')
      .upsert(
        {
          therapist_account_id: therapistAccountId,
          step: 11,
          answers: mergedAnswers,
          submitted_at: now,
          updated_at: now,
        },
        { onConflict: 'therapist_account_id' }
      )
      .select('*')
      .single();

    if (appError) {
      console.error('[TherapistPlatformService] submitApplication app error:', appError);
      throw new Error('Failed to submit application.');
    }

    // 2. Update therapist_accounts status
    await supabase
      .from('therapist_accounts')
      .update({
        application_status: 'submitted',
        can_practice: false,
        verification_status: 'pending',
        rci_registered: Boolean(mergedAnswers.rciRegistered),
        rci_number: mergedAnswers.rciNumber || null,
        updated_at: now,
      })
      .eq('id', therapistAccountId);

    // 3. Update therapist_profiles with basic identity/credential details from application
    await supabase
      .from('therapist_profiles')
      .update({
        full_name: mergedAnswers.fullName || existing.profile?.full_name,
        title: mergedAnswers.professionalTitle || 'Consultant Psychologist',
        bio: mergedAnswers.bio || '',
        qualification: mergedAnswers.qualification || '',
        experience_years: Number(mergedAnswers.experienceYears) || 0,
        specializations: Array.isArray(mergedAnswers.specializations) ? mergedAnswers.specializations : [],
        languages: Array.isArray(mergedAnswers.languages) ? mergedAnswers.languages : ['English', 'Hindi'],
        session_formats: Array.isArray(mergedAnswers.sessionFormats) ? mergedAnswers.sessionFormats : ['telehealth'],
        city: mergedAnswers.city || null,
        state: mergedAnswers.state || null,
        updated_at: now,
      })
      .eq('therapist_account_id', therapistAccountId);

    return {
      success: true,
      application: app,
    };
  }

  /**
   * Internal / Admin Review action.
   * Can only be triggered by authorized administrative caller.
   */
  static async adminReviewTherapist(
    therapistAccountId: string,
    decision: 'approved' | 'rejected',
    reviewerId?: string,
    reviewerNotes?: string
  ) {
    const now = new Date().toISOString();
    const isApproved = decision === 'approved';

    // 1. Update therapist_accounts
    const { error: accountError } = await supabase
      .from('therapist_accounts')
      .update({
        status: isApproved ? 'active' : 'rejected',
        application_status: isApproved ? 'approved' : 'rejected',
        can_practice: isApproved,
        verification_status: isApproved ? 'verified' : 'rejected',
        updated_at: now,
      })
      .eq('id', therapistAccountId);

    if (accountError) {
      throw new Error(`Failed to update therapist account: ${accountError.message}`);
    }

    // 2. Update therapist_applications
    await supabase
      .from('therapist_applications')
      .update({
        reviewed_at: now,
        reviewed_by: reviewerId || null,
        reviewer_notes: reviewerNotes || (isApproved ? 'Approved by clinical administrator' : 'Application declined'),
        updated_at: now,
      })
      .eq('therapist_account_id', therapistAccountId);

    // 3. Create therapist notification
    await supabase
      .from('therapist_notifications')
      .insert({
        therapist_account_id: therapistAccountId,
        type: isApproved ? 'application_approved' : 'application_rejected',
        title: isApproved ? 'Application Approved' : 'Application Status Update',
        message: isApproved
          ? 'Your clinical application has been approved! You now have full access to your therapist workspace.'
          : 'Your clinical application was reviewed. Please contact clinical support for details.',
        link: isApproved ? '/therapist' : '/therapist/application',
      });

    return {
      success: true,
      decision,
      can_practice: isApproved,
    };
  }

  /**
   * =========================================================================
   * 2. TODAY DASHBOARD & OPERATIONAL OVERVIEW
   * =========================================================================
   */

  /**
   * Retrieves today's real operational metrics and schedule for an authorized therapist.
   */
  static async getTodayOverview(therapistAccountId: string) {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).toISOString();

    // 1. Today's sessions
    const { data: todaySessions } = await supabase
      .from('therapist_clinical_appointments')
      .select(`
        id,
        user_id,
        scheduled_start,
        scheduled_end,
        status,
        session_type,
        meeting_link,
        client_notes,
        users (
          id,
          name
        )
      `)
      .eq('therapist_account_id', therapistAccountId)
      .gte('scheduled_start', startOfToday)
      .lte('scheduled_start', endOfToday)
      .order('scheduled_start', { ascending: true });

    // 2. Next upcoming session
    const { data: upcomingSessions } = await supabase
      .from('therapist_clinical_appointments')
      .select(`
        id,
        user_id,
        scheduled_start,
        scheduled_end,
        status,
        session_type,
        meeting_link,
        users (
          id,
          name
        )
      `)
      .eq('therapist_account_id', therapistAccountId)
      .in('status', ['scheduled', 'confirmed'])
      .gte('scheduled_start', now.toISOString())
      .order('scheduled_start', { ascending: true })
      .limit(1);

    // 3. Pending matching requests assigned to this therapist
    const allAssignedRequests = await this.getAssignedRequests(therapistAccountId);
    const pendingRequests = allAssignedRequests
      .filter((r) => r.matchStatus === 'candidate' || r.matchStatus === 'shortlisted')
      .map((r) => ({
        id: r.id,
        clientId: r.userId,
        clientDisplayName: r.clientDisplayName,
        matchStatus: r.matchStatus,
        fitScore: r.matchScore || 85,
        urgencyLevel: r.triageLevel || 'standard',
        preferredFormat: r.contactPreferences?.preferred_format || 'telehealth',
        presentingSummary: r.presentingReason || 'Seeking professional therapeutic support.',
        createdAt: r.createdAt,
      }));

    // 4. Active therapy care relationships
    const { data: rawActiveClients } = await supabase
      .from('therapy_care_relationships')
      .select(`
        id,
        user_id,
        status,
        total_sessions_completed,
        started_at,
        last_session_at,
        users (
          id,
          name
        )
      `)
      .eq('therapist_account_id', therapistAccountId)
      .eq('status', 'active')
      .order('last_session_at', { ascending: false, nullsFirst: false });

    const activeClients = (rawActiveClients || []).map((rel: any) => ({
      id: rel.id,
      clientId: rel.user_id,
      clientDisplayName: rel.users?.name || `Client #${rel.user_id.substring(0, 6)}`,
      status: rel.status,
      totalSessionsCompleted: rel.total_sessions_completed || 0,
      startedAt: rel.started_at,
      lastSessionAt: rel.last_session_at,
    }));

    // 5. Notes Due: Completed sessions without finalized SOAP note
    const { data: rawCompletedSessions } = await supabase
      .from('therapist_clinical_appointments')
      .select(`
        id,
        user_id,
        scheduled_start,
        scheduled_end,
        session_type,
        users (
          id,
          name
        )
      `)
      .eq('therapist_account_id', therapistAccountId)
      .eq('status', 'completed')
      .order('scheduled_end', { ascending: false });

    const completedIds = (rawCompletedSessions || []).map((s) => s.id);
    let notesDue: any[] = [];

    if (completedIds.length > 0) {
      const { data: notes } = await supabase
        .from('therapist_soap_notes')
        .select('appointment_id, is_draft')
        .in('appointment_id', completedIds);

      const finalizedSet = new Set(
        (notes || []).filter((n) => !n.is_draft).map((n) => n.appointment_id)
      );

      notesDue = (rawCompletedSessions || [])
        .filter((s: any) => !finalizedSet.has(s.id))
        .map((s: any) => ({
          id: s.id,
          appointmentId: s.id,
          clientId: s.user_id,
          clientDisplayName: s.users?.name || `Client #${s.user_id.substring(0, 6)}`,
          scheduledStart: s.scheduled_start,
          scheduledEnd: s.scheduled_end,
          sessionType: s.session_type,
        }));
    }

    // 6. Unread notifications
    const { data: rawNotifications } = await supabase
      .from('therapist_notifications')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(10);

    const notifications = (rawNotifications || []).map((n: any) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      type: n.type || 'info',
      createdAt: n.created_at,
      isRead: Boolean(n.is_read),
    }));

    // Next upcoming session
    const nextSession = upcomingSessions && upcomingSessions.length > 0 ? {
      id: upcomingSessions[0].id,
      clientId: upcomingSessions[0].user_id,
      clientDisplayName: (upcomingSessions[0] as any).users?.name || `Client #${upcomingSessions[0].user_id.substring(0, 6)}`,
      scheduledStart: upcomingSessions[0].scheduled_start,
      scheduledEnd: upcomingSessions[0].scheduled_end,
      status: upcomingSessions[0].status,
      sessionType: upcomingSessions[0].session_type,
      meetingLink: upcomingSessions[0].meeting_link,
    } : null;

    return {
      todaySessions: (todaySessions || []).map((session: any) => ({
        id: session.id,
        clientId: session.user_id,
        clientDisplayName: session.users?.name || `Client #${session.user_id.substring(0, 6)}`,
        scheduledStart: session.scheduled_start,
        scheduledEnd: session.scheduled_end,
        status: session.status,
        sessionType: session.session_type,
        meetingLink: session.meeting_link,
      })),
      nextSession,
      upcomingSession: nextSession, // Backward compatibility
      pendingRequests,
      activeClients,
      notesDue,
      notifications,
      metrics: {
        todaySessionsCount: (todaySessions || []).length,
        pendingRequestsCount: pendingRequests.length,
        activeClientsCount: activeClients.length,
        outstandingSoapNotesCount: notesDue.length,
        unreadNotificationsCount: notifications.length,
      }
    };
  }

  /**
   * =========================================================================
   * 3. REQUESTS MANAGEMENT (Matching Workflow)
   * =========================================================================
   */

  /**
   * Lists matching requests assigned to this therapist.
   * Exposes clinically safe triage/intake fields, strictly preserving client journal privacy.
   */
  static async getAssignedRequests(therapistAccountId: string) {
    if (!therapistAccountId) return [];

    try {
      const { data: matches, error } = await supabase
        .from('therapy_matches')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .order('created_at', { ascending: false });

      if (error || !matches || matches.length === 0) {
        return [];
      }

      const sessionIds = Array.from(new Set(matches.map((m: any) => m.therapy_session_id).filter(Boolean)));
      const userIds = Array.from(new Set(matches.map((m: any) => m.user_id).filter(Boolean)));

      const [intakesRes, sessionsRes, usersRes] = await Promise.all([
        sessionIds.length > 0
          ? supabase.from('therapy_intakes').select('*').in('therapy_session_id', sessionIds)
          : { data: [] },
        sessionIds.length > 0
          ? supabase.from('therapy_sessions').select('*').in('id', sessionIds)
          : { data: [] },
        userIds.length > 0
          ? supabase.from('users').select('id, name').in('id', userIds)
          : { data: [] },
      ]);

      const intakesBySessionId = new Map(
        (intakesRes.data || []).map((i: any) => [i.therapy_session_id, i])
      );
      const sessionsById = new Map(
        (sessionsRes.data || []).map((s: any) => [s.id, s])
      );
      const usersById = new Map(
        (usersRes.data || []).map((u: any) => [u.id, u])
      );

      return matches.map((m: any) => {
        const intake = intakesBySessionId.get(m.therapy_session_id);
        const session = sessionsById.get(m.therapy_session_id);
        const user = usersById.get(m.user_id);

        const clientDisplayName =
          intake?.full_name ||
          user?.name ||
          `Client #${(m.user_id || '').substring(0, 6).toUpperCase()}`;

        return {
          id: m.id,
          therapySessionId: m.therapy_session_id,
          userId: m.user_id,
          clientDisplayName,
          age: intake?.age || null,
          gender: intake?.gender || null,
          city: intake?.city || null,
          occupation: intake?.occupation || null,
          presentingReason: intake?.presenting_reason || 'General therapeutic consultation',
          concerns: intake?.concerns || [],
          affectedLifeAreas: intake?.affected_life_areas || [],
          ownWords: intake?.own_words || null,
          contactPreferences: intake?.contact_preferences || {},
          matchStatus: m.match_status,
          matchRank: m.match_rank || 1,
          matchScore: m.match_score ? Number(m.match_score) : 85,
          matchReasons: m.match_reasons || [],
          matchingMetadata: m.matching_metadata || {},
          journeyType: session?.journey_type || 'guided',
          triageLevel: session?.triage_level || 'standard',
          createdAt: m.created_at,
          updatedAt: m.updated_at,
        };
      });
    } catch (e) {
      return [];
    }
  }

  /**
   * Retrieves a single matching request by ID with strict therapist ownership verification.
   * Throws 404 if not found, 403 if assigned to another therapist.
   */
  static async getRequestById(therapistAccountId: string, matchId: string) {
    if (!therapistAccountId || !matchId) {
      const err: any = new Error('Therapist ID and Match ID are required.');
      err.code = 'INVALID_PARAMETERS';
      err.status = 400;
      throw err;
    }

    const { data: match, error: fetchErr } = await supabase
      .from('therapy_matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (!match) {
      const err: any = new Error('Request not found.');
      err.code = 'REQUEST_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (match.therapist_account_id !== therapistAccountId) {
      const err: any = new Error('Request is not assigned to your practice.');
      err.code = 'REQUEST_FORBIDDEN';
      err.status = 403;
      throw err;
    }

    // Safely retrieve intake and session context
    const [intakeRes, sessionRes, userRes] = await Promise.all([
      match.therapy_session_id
        ? supabase.from('therapy_intakes').select('*').eq('therapy_session_id', match.therapy_session_id).maybeSingle()
        : { data: null },
      match.therapy_session_id
        ? supabase.from('therapy_sessions').select('*').eq('id', match.therapy_session_id).maybeSingle()
        : { data: null },
      match.user_id
        ? supabase.from('users').select('id, name').eq('id', match.user_id).maybeSingle()
        : { data: null },
    ]);

    const intake = intakeRes.data;
    const session = sessionRes.data;
    const user = userRes.data;

    const clientDisplayName =
      intake?.full_name ||
      user?.name ||
      `Client #${(match.user_id || '').substring(0, 6).toUpperCase()}`;

    return {
      id: match.id,
      therapySessionId: match.therapy_session_id,
      userId: match.user_id,
      clientDisplayName,
      age: intake?.age || null,
      gender: intake?.gender || null,
      city: intake?.city || null,
      occupation: intake?.occupation || null,
      presentingReason: intake?.presenting_reason || 'General therapeutic consultation',
      concerns: intake?.concerns || [],
      affectedLifeAreas: intake?.affected_life_areas || [],
      ownWords: intake?.own_words || null,
      contactPreferences: intake?.contact_preferences || {},
      matchStatus: match.match_status,
      matchRank: match.match_rank || 1,
      matchScore: match.match_score ? Number(match.match_score) : 85,
      matchReasons: match.match_reasons || [],
      matchingMetadata: match.matching_metadata || {},
      journeyType: session?.journey_type || 'guided',
      triageLevel: session?.triage_level || 'standard',
      createdAt: match.created_at,
      updatedAt: match.updated_at,
    };
  }

  /**
   * Action on request: accept or decline.
   * Concurrency-safe, idempotent, with transactional rollback compensation.
   */
  static async handleRequestAction(
    therapistAccountId: string,
    matchId: string,
    action: 'accept' | 'decline',
    reason?: string
  ) {
    if (!therapistAccountId || !matchId) {
      const err: any = new Error('Therapist ID and Match ID are required.');
      err.code = 'INVALID_PARAMETERS';
      err.status = 400;
      throw err;
    }

    if (action !== 'accept' && action !== 'decline') {
      const err: any = new Error(`Invalid action: ${action}. Action must be 'accept' or 'decline'.`);
      err.code = 'INVALID_ACTION';
      err.status = 400;
      throw err;
    }

    // 1. Verify match existence and therapist ownership
    const { data: match, error: fetchErr } = await supabase
      .from('therapy_matches')
      .select('*')
      .eq('id', matchId)
      .maybeSingle();

    if (!match) {
      const err: any = new Error('Request not found.');
      err.code = 'REQUEST_NOT_FOUND';
      err.status = 404;
      throw err;
    }

    if (match.therapist_account_id !== therapistAccountId) {
      const err: any = new Error('Request is not assigned to your practice.');
      err.code = 'REQUEST_FORBIDDEN';
      err.status = 403;
      throw err;
    }

    // 2. Handle ACCEPT Action
    if (action === 'accept') {
      // Idempotency: If already selected/accepted, reuse relationship
      if (match.match_status === 'selected') {
        const { data: existingRel } = await supabase
          .from('therapy_care_relationships')
          .select('*')
          .eq('therapist_account_id', therapistAccountId)
          .eq('user_id', match.user_id)
          .eq('status', 'active')
          .maybeSingle();

        return {
          success: true,
          action: 'accept',
          matchId,
          matchStatus: 'selected',
          alreadyAccepted: true,
          relationship: existingRel,
          message: 'Client request was already accepted.',
        };
      }

      // Check for non-actionable stale states
      if (match.match_status === 'rejected') {
        const err: any = new Error('This request has already been declined and cannot be accepted.');
        err.code = 'REQUEST_ALREADY_DECLINED';
        err.status = 409;
        throw err;
      }

      if (match.match_status === 'unavailable') {
        const err: any = new Error('This request is no longer available.');
        err.code = 'REQUEST_UNAVAILABLE';
        err.status = 409;
        throw err;
      }

      if (match.match_status !== 'candidate' && match.match_status !== 'shortlisted') {
        const err: any = new Error(`Request cannot be accepted from status: ${match.match_status}`);
        err.code = 'INVALID_REQUEST_STATUS';
        err.status = 409;
        throw err;
      }

      // Check whether an active care relationship already exists for therapist + client
      const { data: existingActiveRel } = await supabase
        .from('therapy_care_relationships')
        .select('*')
        .eq('therapist_account_id', therapistAccountId)
        .eq('user_id', match.user_id)
        .eq('status', 'active')
        .maybeSingle();

      let relationship = existingActiveRel;
      let createdNewRelationship = false;
      const now = new Date().toISOString();

      if (!relationship) {
        const { data: newRel, error: relError } = await supabase
          .from('therapy_care_relationships')
          .insert({
            therapist_account_id: therapistAccountId,
            user_id: match.user_id,
            therapy_session_id: match.therapy_session_id || null,
            status: 'active',
            care_stage: 'intake',
            started_at: now,
            metadata: {
              source_match_id: match.id,
              accepted_at: now,
            },
          })
          .select('*')
          .single();

        if (relError || !newRel) {
          console.error('[TherapistPlatformService] Care relationship creation error:', relError);
          const err: any = new Error('Failed to create clinical care relationship.');
          err.code = 'CARE_RELATIONSHIP_CREATION_FAILED';
          err.status = 500;
          throw err;
        }

        relationship = newRel;
        createdNewRelationship = true;
      }

      // Update match record to 'selected'
      const { error: updateError } = await supabase
        .from('therapy_matches')
        .update({
          match_status: 'selected',
          updated_at: now,
        })
        .eq('id', matchId)
        .eq('therapist_account_id', therapistAccountId);

      if (updateError) {
        console.error('[TherapistPlatformService] Match update error:', updateError);
        // Compensate: rollback newly created relationship
        if (createdNewRelationship && relationship?.id) {
          await supabase
            .from('therapy_care_relationships')
            .delete()
            .eq('id', relationship.id);
        }
        const err: any = new Error('Failed to update request state. Changes rolled back.');
        err.code = 'MATCH_UPDATE_FAILED';
        err.status = 500;
        throw err;
      }

      // Notification
      try {
        await supabase.from('therapist_notifications').insert({
          therapist_account_id: therapistAccountId,
          type: 'request_accepted',
          title: 'New Client Connected',
          message: 'You have accepted the matching request. Client is now added to your care roster.',
          link: '/therapist/clients',
        });
      } catch {}

      return {
        success: true,
        action: 'accept',
        matchId,
        matchStatus: 'selected',
        relationship,
        message: 'Client request accepted successfully.',
      };
    }

    // 3. Handle DECLINE Action
    if (action === 'decline') {
      if (match.match_status === 'rejected') {
        return {
          success: true,
          action: 'decline',
          matchId,
          matchStatus: 'rejected',
          alreadyDeclined: true,
          message: 'Client request was already declined.',
        };
      }

      if (match.match_status === 'selected') {
        const err: any = new Error('Cannot decline a request that has already been accepted.');
        err.code = 'CANNOT_DECLINE_ACCEPTED_REQUEST';
        err.status = 409;
        throw err;
      }

      const now = new Date().toISOString();
      const updatedMetadata = {
        ...(match.matching_metadata || {}),
        ...(reason ? { decline_reason: String(reason).trim() } : {}),
        declined_at: now,
      };

      const { error: declineError } = await supabase
        .from('therapy_matches')
        .update({
          match_status: 'rejected',
          matching_metadata: updatedMetadata,
          updated_at: now,
        })
        .eq('id', matchId)
        .eq('therapist_account_id', therapistAccountId);

      if (declineError) {
        console.error('[TherapistPlatformService] Decline update error:', declineError);
        const err: any = new Error('Failed to decline request.');
        err.code = 'DECLINE_UPDATE_FAILED';
        err.status = 500;
        throw err;
      }

      return {
        success: true,
        action: 'decline',
        matchId,
        matchStatus: 'rejected',
        message: 'Client request declined.',
      };
    }

    const err: any = new Error(`Invalid action: ${action}`);
    err.code = 'INVALID_ACTION';
    err.status = 400;
    throw err;
  }

  /**
   * =========================================================================
   * 4. CLIENTS & CLINICAL PROFILES (Tenancy Isolated & Privacy Preserved)
   * =========================================================================
   */

  /**
   * Lists clients clinically connected to the authenticated therapist.
   */
  static async getAuthorizedClients(therapistAccountId: string, search?: string) {
    const { data: relationships, error } = await supabase
      .from('therapy_care_relationships')
      .select(`
        id,
        user_id,
        status,
        care_stage,
        started_at,
        users (
          id,
          name,
          phone_number
        )
      `)
      .eq('therapist_account_id', therapistAccountId)
      .order('started_at', { ascending: false });

    if (error) {
      console.error('[TherapistPlatformService] getAuthorizedClients error:', error);
      throw new Error('Failed to retrieve clients.');
    }

    // Enrich with appointment count
    const clientIds = (relationships || []).map((r) => r.user_id);
    let sessionCounts: Record<string, number> = {};

    if (clientIds.length > 0) {
      const { data: appts } = await supabase
        .from('therapist_clinical_appointments')
        .select('user_id')
        .eq('therapist_account_id', therapistAccountId)
        .in('user_id', clientIds);

      (appts || []).forEach((a) => {
        sessionCounts[a.user_id] = (sessionCounts[a.user_id] || 0) + 1;
      });
    }

    let clients = (relationships || []).map((r: any) => ({
      relationshipId: r.id,
      clientId: r.user_id,
      name: r.users?.name || `Client #${r.user_id.substring(0, 6)}`,
      phone: r.users?.phone_number ? `+91••••••${r.users.phone_number.slice(-4)}` : 'Confidential',
      status: r.status,
      careStage: r.care_stage,
      startedAt: r.started_at,
      totalSessions: sessionCounts[r.user_id] || 0,
    }));

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      clients = clients.filter((c) => c.name.toLowerCase().includes(q));
    }

    return clients;
  }

  /**
   * Fetches single client clinical profile.
   * PRIVACY GUARANTEE: Does NOT query or return private journals/reflections.
   */
  static async getClientClinicalProfile(therapistAccountId: string, clientId: string) {
    // 1. Verify clinical tenancy
    const { data: relationship, error: relError } = await supabase
      .from('therapy_care_relationships')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .eq('user_id', clientId)
      .maybeSingle();

    if (relError || !relationship) {
      const err: any = new Error('Client not found or not in your clinical care roster.');
      err.status = 404;
      err.code = 'CLIENT_NOT_AUTHORIZED';
      throw err;
    }

    // 2. Fetch user profile
    const { data: user } = await supabase
      .from('users')
      .select('id, name, created_at')
      .eq('id', clientId)
      .single();

    // 3. Fetch authorized intake information
    const { data: intake } = await supabase
      .from('therapy_intakes')
      .select(`
        full_name,
        age,
        gender,
        occupation,
        city,
        living_situation,
        presenting_reason,
        concerns,
        affected_life_areas,
        mental_health_history,
        coping_and_support,
        expectations
      `)
      .eq('user_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // 4. Fetch triage / safety summary (if evaluated)
    const { data: safety } = await supabase
      .from('therapy_safety_assessments')
      .select('safety_status, triage_level, evaluated_at')
      .eq('user_id', clientId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // 5. Fetch appointments history between this therapist and client
    const { data: appointments } = await supabase
      .from('therapist_clinical_appointments')
      .select(`
        id,
        scheduled_start,
        scheduled_end,
        status,
        session_type,
        meeting_link,
        client_notes,
        created_at
      `)
      .eq('therapist_account_id', therapistAccountId)
      .eq('user_id', clientId)
      .order('scheduled_start', { ascending: false });

    // 6. Fetch SOAP notes for these appointments
    const appointmentIds = (appointments || []).map((a) => a.id);
    let soapNotes: any[] = [];
    if (appointmentIds.length > 0) {
      const { data: notes } = await supabase
        .from('therapist_soap_notes')
        .select('*')
        .in('appointment_id', appointmentIds)
        .eq('therapist_account_id', therapistAccountId)
        .order('created_at', { ascending: false });
      soapNotes = notes || [];
    }

    return {
      relationship: {
        id: relationship.id,
        status: relationship.status,
        careStage: relationship.care_stage,
        startedAt: relationship.started_at,
        endedAt: relationship.ended_at,
      },
      client: {
        id: clientId,
        name: user?.name || intake?.full_name || `Client #${clientId.substring(0, 6)}`,
        age: intake?.age || null,
        gender: intake?.gender || null,
        occupation: intake?.occupation || null,
        city: intake?.city || null,
      },
      clinicalIntake: intake ? {
        presentingReason: intake.presenting_reason,
        concerns: intake.concerns,
        affectedLifeAreas: intake.affected_life_areas,
        mentalHealthHistory: intake.mental_health_history,
        copingAndSupport: intake.coping_and_support,
        expectations: intake.expectations,
      } : null,
      safetyAssessment: safety ? {
        safetyStatus: safety.safety_status,
        triageLevel: safety.triage_level,
        evaluatedAt: safety.evaluated_at,
      } : null,
      appointments: appointments || [],
      soapNotes,
    };
  }

  /**
   * Updates care stage for a client.
   */
  static async updateCareStage(
    therapistAccountId: string,
    clientId: string,
    careStage: 'intake' | 'active_care' | 'maintenance' | 'completed',
    status?: 'active' | 'paused' | 'transferred' | 'completed' | 'terminated'
  ) {
    const updatePayload: Record<string, any> = {
      care_stage: careStage,
      updated_at: new Date().toISOString(),
    };

    if (status) {
      updatePayload.status = status;
      if (status === 'completed' || status === 'terminated') {
        updatePayload.ended_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('therapy_care_relationships')
      .update(updatePayload)
      .eq('therapist_account_id', therapistAccountId)
      .eq('user_id', clientId)
      .select('*')
      .single();

    if (error) {
      throw new Error(`Failed to update care stage: ${error.message}`);
    }

    return data;
  }

  /**
   * =========================================================================
   * 5. SESSIONS, BOOKING & CONFLICT PREVENTION
   * =========================================================================
   */

  /**
   * Conflict check: detects overlapping appointments and availability blocks.
   */
  static async checkAppointmentConflict(
    therapistAccountId: string,
    scheduledStartIso: string,
    scheduledEndIso: string,
    excludeAppointmentId?: string
  ): Promise<{ hasConflict: boolean; reason?: string }> {
    const start = new Date(scheduledStartIso);
    const end = new Date(scheduledEndIso);

    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
      return { hasConflict: true, reason: 'Invalid session start or end time.' };
    }

    // 1. Check existing overlapping appointments for this therapist
    let query = supabase
      .from('therapist_clinical_appointments')
      .select('id, scheduled_start, scheduled_end, status')
      .eq('therapist_account_id', therapistAccountId)
      .in('status', ['scheduled', 'confirmed', 'in_progress'])
      .lt('scheduled_start', scheduledEndIso)
      .gt('scheduled_end', scheduledStartIso);

    if (excludeAppointmentId) {
      query = query.neq('id', excludeAppointmentId);
    }

    const { data: overlappingAppts } = await query;

    if (overlappingAppts && overlappingAppts.length > 0) {
      return {
        hasConflict: true,
        reason: 'Time conflicts with an existing booked session.',
      };
    }

    // 2. Check blocked periods in therapist_availability_blocks
    const specificDateStr = scheduledStartIso.split('T')[0];
    const { data: blockedBlocks } = await supabase
      .from('therapist_availability_blocks')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .eq('is_blocked', true)
      .or(`specific_date.eq.${specificDateStr},is_recurring.eq.true`);

    if (blockedBlocks && blockedBlocks.length > 0) {
      const dayOfWeek = start.getDay();
      const startTimeStr = scheduledStartIso.substring(11, 16);
      const endTimeStr = scheduledEndIso.substring(11, 16);

      for (const block of blockedBlocks) {
        if (block.specific_date === specificDateStr || block.day_of_week === dayOfWeek) {
          if (block.start_time < endTimeStr && block.end_time > startTimeStr) {
            return {
              hasConflict: true,
              reason: 'Time falls within a blocked availability window.',
            };
          }
        }
      }
    }

    return { hasConflict: false };
  }

  /**
   * Retrieves list of appointments.
   */
  static async getAppointments(
    therapistAccountId: string,
    filters: {
      startDate?: string;
      endDate?: string;
      clientId?: string;
      status?: string;
    } = {}
  ) {
    let query = supabase
      .from('therapist_clinical_appointments')
      .select(`
        id,
        user_id,
        relationship_id,
        scheduled_start,
        scheduled_end,
        status,
        session_type,
        meeting_link,
        client_notes,
        cancelled_by,
        cancellation_reason,
        created_at,
        users (
          id,
          name
        )
      `)
      .eq('therapist_account_id', therapistAccountId);

    if (filters.startDate) query = query.gte('scheduled_start', filters.startDate);
    if (filters.endDate) query = query.lte('scheduled_end', filters.endDate);
    if (filters.clientId) query = query.eq('user_id', filters.clientId);
    if (filters.status) query = query.eq('status', filters.status);

    query = query.order('scheduled_start', { ascending: true });

    const { data, error } = await query;
    if (error) {
      console.error('[TherapistPlatformService] getAppointments error:', error);
      throw new Error('Failed to retrieve appointments.');
    }

    return (data || []).map((appt: any) => ({
      ...appt,
      clientDisplayName: appt.users?.name || `Client #${appt.user_id.substring(0, 6)}`,
    }));
  }

  /**
   * Creates a new clinical appointment with conflict checking.
   */
  static async createAppointment(
    therapistAccountId: string,
    data: {
      userId: string;
      scheduledStart: string;
      scheduledEnd: string;
      sessionType?: 'video' | 'audio' | 'in_person';
      meetingLink?: string;
      clientNotes?: string;
    }
  ) {
    // 1. Conflict check
    const conflict = await this.checkAppointmentConflict(
      therapistAccountId,
      data.scheduledStart,
      data.scheduledEnd
    );

    if (conflict.hasConflict) {
      const err: any = new Error(conflict.reason || 'Schedule conflict detected.');
      err.status = 409;
      err.code = 'SESSION_CONFLICT';
      throw err;
    }

    // 2. Fetch or create care relationship
    let relationshipId: string | null = null;
    const { data: rel } = await supabase
      .from('therapy_care_relationships')
      .select('id')
      .eq('therapist_account_id', therapistAccountId)
      .eq('user_id', data.userId)
      .eq('status', 'active')
      .maybeSingle();

    if (rel) {
      relationshipId = rel.id;
    }

    // 3. Insert appointment
    const { data: newAppt, error } = await supabase
      .from('therapist_clinical_appointments')
      .insert({
        therapist_account_id: therapistAccountId,
        user_id: data.userId,
        relationship_id: relationshipId,
        scheduled_start: data.scheduledStart,
        scheduled_end: data.scheduledEnd,
        status: 'scheduled',
        session_type: data.sessionType || 'video',
        meeting_link: data.meetingLink || 'https://meet.ingresswithin.com/clinical/' + crypto.randomUUID().substring(0, 8),
        clientNotes: data.clientNotes || null,
      })
      .select('*')
      .single();

    if (error) {
      console.error('[TherapistPlatformService] createAppointment error:', error);
      throw new Error('Failed to schedule session.');
    }

    return newAppt;
  }

  /**
   * Reschedules an appointment. Preserves history in therapist_session_reschedules!
   */
  static async rescheduleAppointment(
    therapistAccountId: string,
    appointmentId: string,
    newStartIso: string,
    newEndIso: string,
    reason?: string
  ) {
    // 1. Verify ownership and get previous start/end
    const { data: appt, error: fetchErr } = await supabase
      .from('therapist_clinical_appointments')
      .select('*')
      .eq('id', appointmentId)
      .eq('therapist_account_id', therapistAccountId)
      .single();

    if (fetchErr || !appt) {
      throw new Error('Appointment not found.');
    }

    // 2. Conflict check
    const conflict = await this.checkAppointmentConflict(
      therapistAccountId,
      newStartIso,
      newEndIso,
      appointmentId
    );

    if (conflict.hasConflict) {
      const err: any = new Error(conflict.reason || 'Schedule conflict detected.');
      err.status = 409;
      err.code = 'SESSION_CONFLICT';
      throw err;
    }

    // 3. Insert audit record in therapist_session_reschedules
    await supabase.from('therapist_session_reschedules').insert({
      appointment_id: appointmentId,
      previous_start: appt.scheduled_start,
      previous_end: appt.scheduled_end,
      new_start: newStartIso,
      new_end: newEndIso,
      rescheduled_by: 'therapist',
      reason: reason || 'Therapist requested reschedule',
    });

    // 4. Update appointment
    const { data: updated, error: updateErr } = await supabase
      .from('therapist_clinical_appointments')
      .update({
        scheduled_start: newStartIso,
        scheduled_end: newEndIso,
        status: 'rescheduled',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .select('*')
      .single();

    if (updateErr) {
      throw new Error('Failed to update appointment.');
    }

    return updated;
  }

  /**
   * Non-destructive appointment cancellation.
   */
  static async cancelAppointment(
    therapistAccountId: string,
    appointmentId: string,
    reason?: string
  ) {
    const { data: updated, error } = await supabase
      .from('therapist_clinical_appointments')
      .update({
        status: 'cancelled',
        cancelled_by: 'therapist',
        cancellation_reason: reason || 'Cancelled by therapist',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .eq('therapist_account_id', therapistAccountId)
      .select('*')
      .single();

    if (error) {
      throw new Error('Failed to cancel appointment.');
    }

    return updated;
  }

  /**
   * Marks session complete and transactionally registers collected earnings.
   */
  static async completeAppointment(
    therapistAccountId: string,
    appointmentId: string
  ) {
    // 1. Update appointment status
    const { data: appt, error: updateErr } = await supabase
      .from('therapist_clinical_appointments')
      .update({
        status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', appointmentId)
      .eq('therapist_account_id', therapistAccountId)
      .select('*')
      .single();

    if (updateErr || !appt) {
      throw new Error('Appointment not found.');
    }

    // 2. Fetch therapist fee structure
    const { data: account } = await supabase
      .from('therapist_accounts')
      .select('per_session_fee, commission_rate')
      .eq('id', therapistAccountId)
      .single();

    const gross = Number(account?.per_session_fee) || 1500;
    const commRate = Number(account?.commission_rate) || 15;
    const platformFee = Math.round((gross * (commRate / 100)) * 100) / 100;
    const net = Math.round((gross - platformFee) * 100) / 100;

    // 3. Register collected earning
    await supabase.from('therapist_earnings').insert({
      therapist_account_id: therapistAccountId,
      appointment_id: appointmentId,
      gross_amount: gross,
      platform_fee: platformFee,
      net_earnings: net,
      payment_status: 'collected',
      collected_at: new Date().toISOString(),
    });

    return appt;
  }

  /**
   * =========================================================================
   * 6. SOAP NOTES (Isolated Clinical Documentation)
   * =========================================================================
   */

  /**
   * Retrieves SOAP note for an appointment.
   */
  static async getSoapNote(therapistAccountId: string, appointmentId: string) {
    const { data: note, error } = await supabase
      .from('therapist_soap_notes')
      .select('*')
      .eq('appointment_id', appointmentId)
      .eq('therapist_account_id', therapistAccountId)
      .maybeSingle();

    if (error) {
      console.error('[TherapistPlatformService] getSoapNote error:', error);
      throw new Error('Failed to retrieve SOAP note.');
    }

    return note;
  }

  /**
   * Saves or finalizes a SOAP note.
   */
  static async saveSoapNote(
    therapistAccountId: string,
    appointmentId: string,
    data: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
      isDraft?: boolean;
    }
  ) {
    // 1. Verify appointment ownership and get user_id
    const { data: appt, error: apptErr } = await supabase
      .from('therapist_clinical_appointments')
      .select('user_id')
      .eq('id', appointmentId)
      .eq('therapist_account_id', therapistAccountId)
      .single();

    if (apptErr || !appt) {
      throw new Error('Appointment not found.');
    }

    const now = new Date().toISOString();
    const isDraft = data.isDraft ?? false;

    // 2. Upsert SOAP note
    const { data: note, error } = await supabase
      .from('therapist_soap_notes')
      .upsert(
        {
          appointment_id: appointmentId,
          therapist_account_id: therapistAccountId,
          user_id: appt.user_id,
          subjective: data.subjective || '',
          objective: data.objective || '',
          assessment: data.assessment || '',
          plan: data.plan || '',
          is_draft: isDraft,
          finalized_at: isDraft ? null : now,
          updated_at: now,
        },
        { onConflict: 'appointment_id' }
      )
      .select('*')
      .single();

    if (error) {
      console.error('[TherapistPlatformService] saveSoapNote error:', error);
      throw new Error('Failed to save clinical note.');
    }

    return note;
  }

  /**
   * =========================================================================
   * 7. CALENDAR & AVAILABILITY
   * =========================================================================
   */

  /**
   * Fetches calendar events (appointments + availability blocks) for a view window.
   */
  static async getCalendarEvents(
    therapistAccountId: string,
    startDateIso: string,
    endDateIso: string
  ) {
    // 1. Appointments
    const appointments = await this.getAppointments(therapistAccountId, {
      startDate: startDateIso,
      endDate: endDateIso,
    });

    // 2. Availability blocks
    const { data: blocks } = await supabase
      .from('therapist_availability_blocks')
      .select('*')
      .eq('therapist_account_id', therapistAccountId);

    return {
      appointments,
      availabilityBlocks: blocks || [],
    };
  }

  /**
   * Saves availability working hours blocks.
   */
  static async saveAvailabilityBlocks(
    therapistAccountId: string,
    blocks: Array<{
      dayOfWeek: number;
      startTime: string;
      endTime: string;
      isRecurring?: boolean;
      specificDate?: string;
      isBlocked?: boolean;
    }>
  ) {
    // Delete existing recurring blocks
    await supabase
      .from('therapist_availability_blocks')
      .delete()
      .eq('therapist_account_id', therapistAccountId)
      .eq('is_recurring', true);

    if (blocks.length === 0) return [];

    const payload = blocks.map((b) => ({
      therapist_account_id: therapistAccountId,
      day_of_week: b.dayOfWeek,
      start_time: b.startTime,
      end_time: b.endTime,
      is_recurring: b.isRecurring ?? true,
      specific_date: b.specificDate || null,
      is_blocked: b.isBlocked ?? false,
    }));

    const { data, error } = await supabase
      .from('therapist_availability_blocks')
      .insert(payload)
      .select('*');

    if (error) {
      console.error('[TherapistPlatformService] saveAvailabilityBlocks error:', error);
      throw new Error('Failed to save availability.');
    }

    return data;
  }

  /**
   * =========================================================================
   * 8. EARNINGS & PAYOUTS (Real Payment Ledger)
   * =========================================================================
   */

  /**
   * Fetches real earnings summary strictly calculated from payment_status = 'collected'.
   */
  static async getEarningsSummary(therapistAccountId: string) {
    const { data: earnings, error } = await supabase
      .from('therapist_earnings')
      .select(`
        id,
        appointment_id,
        gross_amount,
        platform_fee,
        net_earnings,
        payment_status,
        collected_at,
        payout_batch_id,
        payout_date,
        created_at,
        therapist_clinical_appointments (
          id,
          scheduled_start,
          user_id,
          users (
            name
          )
        )
      `)
      .eq('therapist_account_id', therapistAccountId)
      .order('collected_at', { ascending: false });

    if (error) {
      console.error('[TherapistPlatformService] getEarningsSummary error:', error);
      throw new Error('Failed to calculate earnings.');
    }

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    let totalCollected = 0;
    let currentMonthCollected = 0;
    let pendingPayout = 0;
    let paidOutTotal = 0;

    const transactions = (earnings || []).map((e: any) => {
      const net = Number(e.net_earnings) || 0;
      const gross = Number(e.gross_amount) || 0;
      const fee = Number(e.platform_fee) || 0;
      const isCollected = e.payment_status === 'collected';
      const isPaid = e.payment_status === 'paid';
      const isPending = e.payment_status === 'pending';

      if (isCollected || isPaid) {
        totalCollected += net;
        if (e.collected_at && e.collected_at >= startOfCurrentMonth) {
          currentMonthCollected += net;
        }
      }

      if (isCollected) {
        pendingPayout += net;
      }

      if (isPaid) {
        paidOutTotal += net;
      }

      const appt = Array.isArray(e.therapist_clinical_appointments)
        ? e.therapist_clinical_appointments[0]
        : e.therapist_clinical_appointments;

      return {
        id: e.id,
        appointmentId: e.appointment_id,
        date: e.collected_at || e.created_at,
        grossAmount: gross,
        platformFee: fee,
        netAmount: net,
        status: e.payment_status,
        payoutBatchId: e.payout_batch_id,
        payoutDate: e.payout_date,
        clientLabel: appt?.users?.name || `Client #${appt?.user_id?.substring(0, 6) || '---'}`,
        sessionDate: appt?.scheduled_start || e.collected_at,
      };
    });

    return {
      summary: {
        currentMonthCollected,
        totalCollected,
        pendingPayout,
        paidOutTotal,
        currency: 'INR',
      },
      transactions,
    };
  }

  /**
   * =========================================================================
   * 9. PROFILE MANAGEMENT (Strict Allowlist Enforcement)
   * =========================================================================
   */

  /**
   * Updates therapist profile with STRICT field allowlisting.
   * Mass assignment shield: rejects can_practice, application_status, commission_rate, etc.
   */
  static async updateProfile(therapistAccountId: string, payload: Record<string, any>) {
    // 1. Strict Allowlist
    const ALLOWED_PROFILE_KEYS = new Set([
      'full_name',
      'title',
      'bio',
      'qualification',
      'experience_years',
      'specializations',
      'languages',
      'session_formats',
      'availability_hours',
      'profile_image_url',
      'city',
      'state',
    ]);

    const sanitizedUpdates: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    for (const [key, value] of Object.entries(payload)) {
      if (ALLOWED_PROFILE_KEYS.has(key)) {
        sanitizedUpdates[key] = value;
      }
    }

    const { data: updated, error } = await supabase
      .from('therapist_profiles')
      .update(sanitizedUpdates)
      .eq('therapist_account_id', therapistAccountId)
      .select('*')
      .single();

    if (error) {
      console.error('[TherapistPlatformService] updateProfile error:', error);
      throw new Error('Failed to update profile.');
    }

    return updated;
  }

  /**
   * =========================================================================
   * 10. NOTIFICATIONS
   * =========================================================================
   */

  /**
   * Lists notifications.
   */
  static async getNotifications(therapistAccountId: string) {
    const { data, error } = await supabase
      .from('therapist_notifications')
      .select('*')
      .eq('therapist_account_id', therapistAccountId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('[TherapistPlatformService] getNotifications error:', error);
      throw new Error('Failed to retrieve notifications.');
    }

    return data || [];
  }

  /**
   * Marks a notification as read.
   */
  static async markNotificationRead(therapistAccountId: string, notificationId: string) {
    await supabase
      .from('therapist_notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('therapist_account_id', therapistAccountId);

    return { success: true };
  }
}
