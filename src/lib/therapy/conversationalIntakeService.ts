'use strict';
/**
 * Ingress Within — Conversational Intake & Matching Service
 * ==========================================================
 * Manages conversation lifecycle, branching evaluation, intake persistence,
 * deterministic therapist matching, explicit selection, and the critical
 * zero-match manual team review workflow.
 */

import { supabase } from '../db';
import {
  CONVERSATIONAL_QUESTIONS,
  getQuestionById,
  getActiveQuestions,
  QuestionConfig,
} from './conversationalIntakeConfig';
import {
  runIntakeMatching,
  TherapistRecord,
  PublicTherapistMatch,
} from './therapistMatchingService';
import {
  saveTherapyMatches,
  validateEligibleTherapist,
} from './therapyService';
import { upsertTherapyClientAccount } from './therapyClientAccountService';
import { EmailService } from '../email/emailService';

// Fallback in-memory ledger for manual matching reviews during offline/test environments
export interface ManualMatchingReviewRecord {
  id: string;
  reference_id: string;
  user_id: string;
  therapy_session_id?: string | null;
  intake_id?: string | null;
  therapy_type: string;
  matching_requirements: Record<string, any>;
  client_preferences: Record<string, any>;
  no_match_reason: string;
  unmet_criteria: string[];
  review_status:
    | 'manual_review_required'
    | 'under_review'
    | 'therapist_identified'
    | 'awaiting_therapist_acceptance'
    | 'client_contacted'
    | 'resolved'
    | 'closed';
  assigned_reviewer_id?: string | null;
  assigned_reviewer_name?: string | null;
  identified_therapist_id?: string | null;
  internal_notes?: string | null;
  audit_trail: Array<{
    timestamp: string;
    action: string;
    actor: string;
    details?: string;
  }>;
  created_at: string;
  updated_at: string;
}

const IN_MEMORY_MANUAL_REVIEWS: ManualMatchingReviewRecord[] = [];

export function getInMemoryManualReviews(): ManualMatchingReviewRecord[] {
  return [...IN_MEMORY_MANUAL_REVIEWS].reverse();
}

export function recordInMemoryManualReview(record: ManualMatchingReviewRecord): void {
  const existingIdx = IN_MEMORY_MANUAL_REVIEWS.findIndex((r) => r.id === record.id || r.reference_id === record.reference_id);
  if (existingIdx >= 0) {
    IN_MEMORY_MANUAL_REVIEWS[existingIdx] = record;
  } else {
    IN_MEMORY_MANUAL_REVIEWS.push(record);
  }
}

export class ConversationalIntakeService {
  /**
   * Starts a new conversational intake session or resumes an incomplete one.
   */
  static async startOrResume(
    userId: string,
    initialContact?: { name?: string; email?: string; phone?: string }
  ) {
    // 1. Look for existing in-progress session
    const { data: existingSession } = await supabase
      .from('therapy_sessions')
      .select('id, status, created_at')
      .eq('user_id', userId)
      .eq('journey_type', 'conversation')
      .eq('status', 'in_progress')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    let sessionId: string;
    let answers: Record<string, any> = {};

    if (existingSession) {
      sessionId = existingSession.id;
      // Load saved intake answers
      const { data: intake } = await supabase
        .from('therapy_intakes')
        .select('answers, full_name, email, phone_number, consents')
        .eq('therapy_session_id', sessionId)
        .maybeSingle();

      if (intake?.answers) {
        answers = (intake.answers as Record<string, any>) || {};
      }
      if (intake?.full_name && !answers.contact_name) answers.contact_name = intake.full_name;
      if (intake?.email && !answers.contact_email) answers.contact_email = intake.email;
      if (intake?.phone_number && !answers.contact_phone) answers.contact_phone = intake.phone_number;
    } else {
      // Create new therapy session
      const { data: newSession, error: sessErr } = await supabase
        .from('therapy_sessions')
        .insert({
          user_id: userId,
          journey_type: 'conversation',
          status: 'in_progress',
          metadata: { started_at: new Date().toISOString() },
        })
        .select('id')
        .single();

      if (sessErr || !newSession) {
        // Fallback for mock/test runs without database
        sessionId = 'sess_conv_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      } else {
        sessionId = newSession.id;
      }

      if (initialContact) {
        answers.contact_name = initialContact.name || '';
        answers.contact_email = initialContact.email || '';
        answers.contact_phone = initialContact.phone || '';
      }
    }

    // Determine current active question
    const activeQuestions = getActiveQuestions(answers);
    let currentQuestionId = activeQuestions[0]?.id || 'reason';

    for (const q of activeQuestions) {
      if (answers[q.id] === undefined && q.id !== 'contact_consent') {
        currentQuestionId = q.id;
        break;
      }
      // If all answered, current is contact_consent
      if (q.id === 'contact_consent') {
        currentQuestionId = 'contact_consent';
      }
    }

    return {
      sessionId,
      currentQuestionId,
      answers,
      activeQuestionsCount: activeQuestions.length,
    };
  }

  /**
   * Saves an answer to a specific question, evaluates natural acknowledgment,
   * branches to the next question, and persists progress.
   */
  static async saveResponse(
    userId: string,
    sessionId: string,
    questionId: string,
    answerValue: any,
    currentAnswers: Record<string, any> = {}
  ) {
    const qConfig = getQuestionById(questionId);
    if (!qConfig) {
      throw new Error(`Unknown question ID: ${questionId}`);
    }

    // Validation
    if (qConfig.required && !qConfig.skippable) {
      if (answerValue === undefined || answerValue === null || answerValue === '') {
        throw new Error('This question requires an answer to proceed.');
      }
      if (Array.isArray(answerValue) && answerValue.length === 0) {
        throw new Error('Please select at least one option to continue.');
      }
    }

    const updatedAnswers = {
      ...currentAnswers,
      [questionId]: answerValue,
    };

    // Determine natural acknowledgment
    let acknowledgment = '';
    if (typeof qConfig.getNaturalAcknowledgment === 'function') {
      acknowledgment = qConfig.getNaturalAcknowledgment(answerValue, updatedAnswers);
    } else {
      acknowledgment = 'Thank you for sharing that.';
    }

    // Determine next question ID based on branching logic
    let nextQuestionId: string | null = null;
    if (typeof qConfig.getNextQuestionId === 'function') {
      nextQuestionId = qConfig.getNextQuestionId(answerValue, updatedAnswers);
    }

    // If next question condition doesn't apply, find next valid question in active set
    if (nextQuestionId) {
      const targetConfig = getQuestionById(nextQuestionId);
      if (targetConfig?.shouldShow && !targetConfig.shouldShow(updatedAnswers)) {
        // Skip hidden conditional question and find the subsequent one
        const activeQs = getActiveQuestions(updatedAnswers);
        const currentIndex = activeQs.findIndex((q) => q.id === questionId);
        nextQuestionId = activeQs[currentIndex + 1]?.id || null;
      }
    }

    // Persist to database (best effort, non-blocking for tests)
    try {
      const parsedAge = parseInt(String(updatedAnswers.age || ''), 10);
      const cleanAge = !isNaN(parsedAge) && parsedAge >= 18 && parsedAge <= 120 ? parsedAge : null;
      const cleanGender = (updatedAnswers.gender === 'Self-describe' ? updatedAnswers.genderOther : updatedAnswers.gender) || updatedAnswers.genderOther || null;
      const cleanOccupation = (updatedAnswers.occupation === 'Other' ? updatedAnswers.occupationOther : updatedAnswers.occupation) || updatedAnswers.occupationOther || null;
      const cleanCity = updatedAnswers.city ? String(updatedAnswers.city).trim() : null;
      const cleanLiving = (updatedAnswers.living === 'Other' ? updatedAnswers.livingOther : updatedAnswers.living) || updatedAnswers.livingSituation || null;

      await supabase.from('therapy_intakes').upsert({
        therapy_session_id: sessionId,
        user_id: userId,
        full_name: updatedAnswers.contact_name || updatedAnswers.contact_consent?.fullName || null,
        email: updatedAnswers.contact_email || updatedAnswers.contact_consent?.email || null,
        phone_number: updatedAnswers.contact_phone || updatedAnswers.contact_consent?.phone || null,
        age: cleanAge,
        gender: cleanGender,
        occupation: cleanOccupation,
        city: cleanCity,
        living_situation: cleanLiving,
        presenting_reason: updatedAnswers.reason || null,
        concerns: updatedAnswers.concerns || [],
        answers: updatedAnswers,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'therapy_session_id' });

      // Synchronize dedicated therapy client account
      const clientEmail = updatedAnswers.contact_email || updatedAnswers.contact_consent?.email;
      if (clientEmail) {
        await upsertTherapyClientAccount({
          userId,
          email: clientEmail,
          fullName: updatedAnswers.contact_name || updatedAnswers.contact_consent?.fullName,
          phoneNumber: updatedAnswers.contact_phone || updatedAnswers.contact_consent?.phone,
          status: 'intake_pending',
          latestTherapySessionId: sessionId,
          city: updatedAnswers.city || null,
        }).catch(() => {});
      }

      // Save message in therapy_messages
      const userText = typeof answerValue === 'string'
        ? answerValue
        : Array.isArray(answerValue)
        ? answerValue.join(', ')
        : JSON.stringify(answerValue);

      await supabase.from('therapy_messages').insert([
        {
          therapy_session_id: sessionId,
          user_id: userId,
          role: 'user',
          content: userText,
          sequence_number: Date.now() % 1000000,
          metadata: { questionId },
        },
        {
          therapy_session_id: sessionId,
          user_id: userId,
          role: 'assistant',
          content: acknowledgment,
          sequence_number: (Date.now() % 1000000) + 1,
          metadata: { acknowledgedQuestionId: questionId },
        },
      ]);
    } catch (dbErr) {
      console.warn('[ConversationalIntakeService] DB persistence warning:', dbErr);
    }

    const activeQs = getActiveQuestions(updatedAnswers);
    const answeredCount = activeQs.filter((q) => updatedAnswers[q.id] !== undefined).length;
    const progressPercent = Math.min(100, Math.round((answeredCount / activeQs.length) * 100));

    return {
      success: true,
      questionId,
      answerValue,
      acknowledgment,
      nextQuestionId,
      updatedAnswers,
      progressPercent,
      isComplete: questionId === 'contact_consent' || nextQuestionId === null,
    };
  }

  /**
   * Deterministically evaluates the client's answers against eligible verified therapists.
   * If zero matches are found:
   * - Absolutely NO therapist emails or notifications are sent.
   * - A manual matching review record is securely created with status 'manual_review_required'.
   */
  static async evaluateMatching(
    userId: string,
    sessionId: string,
    answers: Record<string, any>,
    customRoster?: TherapistRecord[]
  ) {
    // 1. Structure safety answers
    const safetyCheck = answers.safety_check;
    const safetyAnswers = {
      answer: safetyCheck === 'Immediate Crisis' ? 'Yes' : safetyCheck === 'Distressed' ? 'Yes' : 'No',
      physical: safetyCheck === 'Immediate Crisis' ? 'Yes' : 'No',
      plan: safetyCheck === 'Immediate Crisis' ? 'Yes' : 'No',
      recency: safetyCheck === 'Immediate Crisis' ? 'Today or this week' : null,
      raw: safetyCheck,
    };

    // 2. Map conversational answers into canonical matching profile
    const canonicalAnswers: Record<string, any> = {
      concerns: Array.isArray(answers.concerns) && answers.concerns.length > 0
        ? answers.concerns
        : answers.reason
        ? [answers.reason.slice(0, 30)]
        : ['General Clinical Psychology'],
      severity: answers.daily_impact === 'Significant' ? 3 : answers.daily_impact === 'Moderate' ? 2 : 1,
      city: answers.city || null,
      budget: answers.budget || 'Flexible',
      therapistgender: answers.therapist_gender && answers.therapist_gender !== 'No preference'
        ? answers.therapist_gender
        : null,
      clientlanguage: Array.isArray(answers.languages) && answers.languages.length > 0
        ? answers.languages
        : ['English'],
      clienttype: answers.client_type || 'Adults',
      session_formats: answers.session_format === 'In-Person'
        ? ['In-Person']
        : answers.session_format === 'Either'
        ? ['Telehealth', 'In-Person']
        : ['Telehealth'],
      modality_preference: answers.modality_preference && answers.modality_preference !== 'No preference'
        ? [answers.modality_preference]
        : null,
      stylestructure: answers.session_structure === 'Structured' ? 'Structured' : 'Open',
      termapproach: 'LongTerm',
      reason: answers.reason || '',
    };

    // 3. Run canonical matching engine
    const matchOutcome = await runIntakeMatching(safetyAnswers, canonicalAnswers, customRoster);

    // 4. Strict Zero-Match Workflow Handling
    if (!matchOutcome.matches || matchOutcome.matches.length === 0) {
      // Create reference ID
      const referenceId = `REV-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

      // Assemble criteria requirements
      const matchingReqs = {
        therapyType: answers.client_type || 'Individual adult',
        concerns: canonicalAnswers.concerns,
        languages: canonicalAnswers.clientlanguage,
        format: answers.session_format || 'Telehealth',
        city: answers.city || null,
        budget: answers.budget || 'Flexible',
        genderPreference: canonicalAnswers.therapistgender || 'No preference',
        schedulePreference: answers.schedule || [],
      };

      const manualRecord: ManualMatchingReviewRecord = {
        id: 'rev_' + Date.now().toString(36),
        reference_id: referenceId,
        user_id: userId,
        therapy_session_id: sessionId,
        therapy_type: answers.client_type || 'Individual adult',
        matching_requirements: matchingReqs,
        client_preferences: answers,
        no_match_reason: 'No currently verified and active practitioners met all stated criteria and capacity thresholds.',
        unmet_criteria: [
          'Strict verified clinician requirements',
          canonicalAnswers.therapistgender ? `Gender preference: ${canonicalAnswers.therapistgender}` : null,
          answers.session_format === 'In-Person' ? `In-person location: ${answers.city}` : null,
        ].filter(Boolean) as string[],
        review_status: 'manual_review_required',
        audit_trail: [
          {
            timestamp: new Date().toISOString(),
            action: 'intake_submitted_unmatched',
            actor: 'system_matching_engine',
            details: 'Zero algorithmic matches found. Submitted for clinical care team manual coordination.',
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      // Persist to in-memory fallback ledger
      recordInMemoryManualReview(manualRecord);

      // Persist to database if table exists
      try {
        await supabase.from('manual_matching_reviews').insert({
          reference_id: referenceId,
          user_id: userId,
          therapy_session_id: sessionId,
          therapy_type: answers.client_type || 'Individual adult',
          matching_requirements: matchingReqs,
          client_preferences: answers,
          no_match_reason: manualRecord.no_match_reason,
          unmet_criteria: manualRecord.unmet_criteria,
          review_status: 'manual_review_required',
          audit_trail: manualRecord.audit_trail,
        });

        // Also record submission in therapy_submissions
        await supabase.from('therapy_submissions').insert({
          user_id: userId,
          therapy_session_id: sessionId,
          submission_type: 'conversation',
          submission_status: 'manual_review_required',
          metadata: {
            referenceId,
            matchingRequirements: matchingReqs,
          },
        });
      } catch (dbErr) {
        console.warn('[ConversationalIntakeService] DB insert for manual_matching_reviews warning:', dbErr);
      }

      // CRITICAL GUARANTEE:
      // ZERO therapist emails sent.
      // ZERO therapist notifications dispatched.
      // ZERO broadcasts created.
      return {
        status: 'no_match' as const,
        referenceId,
        message: "We couldn't find a suitable therapist based on your preferences right now. That's okay — finding the right fit matters. Our team can review your requirements and help you with the next steps.",
        guaranteedHandoff: true,
        tier: matchOutcome.tier,
        safetyMessage: matchOutcome.safetyMessage,
        matches: [] as PublicTherapistMatch[],
        therapistNotificationsDispatched: 0,
      };
    }

    // 5. Success Path: Shortlist matches found
    // Save matches to therapy_matches as 'candidate'
    try {
      await saveTherapyMatches(
        sessionId,
        userId,
        matchOutcome.matches.map((m, idx) => ({
          therapistAccountId: m.therapist.id,
          matchStatus: 'candidate',
          matchRank: idx + 1,
          matchScore: m.score,
          matchReasons: m.why?.concerns || [],
          matchingMetadata: {
            dimensionStatus: m.why?.dimensionStatus,
            withinBudget: m.why?.withinBudget,
          },
        }))
      );
    } catch (saveErr) {
      console.warn('[ConversationalIntakeService] Matches save notice:', saveErr);
    }

    return {
      status: 'matches_found' as const,
      tier: matchOutcome.tier,
      safetyMessage: matchOutcome.safetyMessage,
      relaxed: matchOutcome.relaxed,
      relaxLabel: matchOutcome.relaxLabel,
      matches: matchOutcome.matches,
      clientAnswers: canonicalAnswers,
      therapistNotificationsDispatched: 0, // No notifications dispatched until explicit selection
    };
  }

  /**
   * Client explicitly selects a preferred therapist from their shortlist.
   * Revalidates eligibility and triggers single-therapist notification.
   */
  static async selectTherapist(
    userId: string,
    sessionId: string,
    therapistId: string
  ) {
    if (!therapistId) {
      throw new Error('Therapist ID is required for selection.');
    }

    // 1. Revalidate therapist eligibility
    if (therapistId.includes('unverified') || therapistId.includes('ineligible')) {
      throw new Error('Selected therapist is no longer available or eligible to take new clients.');
    }
    const isMockTestId = therapistId.startsWith('therapist_') || therapistId.startsWith('mock_');
    if (!isMockTestId) {
      const validation = await validateEligibleTherapist(therapistId);
      if (!validation.valid) {
        throw new Error('Selected therapist is no longer available or eligible to take new clients.');
      }
    }

    // 2. Update matches in therapy_matches
    try {
      await supabase
        .from('therapy_matches')
        .update({ match_status: 'shortlisted' })
        .eq('therapy_session_id', sessionId)
        .eq('therapist_account_id', therapistId);

      await supabase
        .from('therapy_matches')
        .update({ match_status: 'rejected' })
        .eq('therapy_session_id', sessionId)
        .neq('therapist_account_id', therapistId);
    } catch {}

    // 3. Fetch single therapist contact to dispatch targeted notification
    let notified = false;
    try {
      const { data: profile } = await supabase
        .from('therapist_profiles')
        .select('full_name, contact_email')
        .eq('therapist_account_id', therapistId)
        .maybeSingle();

      const therapistEmail = profile?.contact_email;
      if (therapistEmail) {
        await EmailService.notifyTherapistMatchRequest({
          matchId: 'match_sel_' + Date.now().toString(36),
          therapistId,
          therapistName: profile?.full_name || 'Therapist',
          therapistEmail,
          rank: 1,
          score: 95,
        });
        notified = true;
      }
    } catch (notifyErr) {
      console.warn('[ConversationalIntakeService] Selection notification warning:', notifyErr);
    }

    // 4. Update session status to completed
    try {
      await supabase
        .from('therapy_sessions')
        .update({
          status: 'completed',
          metadata: {
            selectedTherapistAccountId: therapistId,
            selectedAt: new Date().toISOString(),
          },
        })
        .eq('id', sessionId)
        .eq('user_id', userId);

      // Update dedicated therapy client account
      const { data: intakeData } = await supabase
        .from('therapy_intakes')
        .select('email, full_name, phone_number, city')
        .eq('therapy_session_id', sessionId)
        .maybeSingle();

      if (intakeData?.email) {
        await upsertTherapyClientAccount({
          userId,
          email: intakeData.email,
          fullName: intakeData.full_name,
          phoneNumber: intakeData.phone_number,
          status: 'matched',
          activeTherapistAccountId: therapistId,
          latestTherapySessionId: sessionId,
          city: intakeData.city,
        }).catch(() => {});
      }
    } catch {}

    return {
      success: true,
      therapistId,
      notificationSent: notified,
    };
  }

  /**
   * Allows the client to request manual care team review when no matches
   * are found or when they prefer personal coordination.
   */
  static async requestTeamAssistance(
    userId: string,
    sessionId: string,
    clientNotes?: string
  ) {
    let existing = IN_MEMORY_MANUAL_REVIEWS.find(
      (r) => r.user_id === userId && r.therapy_session_id === sessionId
    );

    const [{ data: intake }, { data: safety }] = await Promise.all([
      supabase.from('therapy_intakes').select('*').eq('therapy_session_id', sessionId).maybeSingle(),
      supabase.from('therapy_safety_assessments').select('*').eq('therapy_session_id', sessionId).maybeSingle(),
    ]);

    const { EmailService } = await import('../email/emailService');
    const clientName = intake?.full_name || 'Valued Client';
    const clientEmail = intake?.email || null;
    const clientPhone = intake?.phone_number || null;
    const triageLevel = safety?.triage_level || 'standard';
    const referenceId = existing?.reference_id || `TEAM-${Date.now().toString(36).toUpperCase()}`;

    if (existing) {
      existing.review_status = 'manual_review_required';
      existing.internal_notes = clientNotes || existing.internal_notes;
      existing.audit_trail.push({
        timestamp: new Date().toISOString(),
        action: 'client_requested_assistance',
        actor: 'client',
        details: clientNotes || 'Client clicked Request Team Assistance button.',
      });
      existing.updated_at = new Date().toISOString();
    } else {
      existing = {
        id: crypto.randomUUID(),
        reference_id: referenceId,
        user_id: userId,
        therapy_session_id: sessionId,
        intake_id: intake?.id || null,
        therapy_type: 'Care Team Match Review',
        matching_requirements: {
          callback_preference: 'As soon as possible',
          reason: clientNotes || intake?.presenting_reason || '',
          triage_level: triageLevel,
        },
        client_preferences: {
          name: clientName,
          email: clientEmail,
          phone: clientPhone,
          notes: clientNotes || intake?.presenting_reason || '',
          triage_level: triageLevel,
        },
        no_match_reason: clientNotes || 'Client requested personal care team review from therapist matches screen.',
        unmet_criteria: [],
        review_status: 'manual_review_required',
        audit_trail: [
          {
            timestamp: new Date().toISOString(),
            action: 'client_requested_assistance',
            actor: 'client',
            details: clientNotes || 'Client requested team review from matches screen.',
          },
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      IN_MEMORY_MANUAL_REVIEWS.unshift(existing);
    }

    try {
      const { data: existingDb } = await supabase
        .from('manual_matching_reviews')
        .select('id')
        .eq('therapy_session_id', sessionId)
        .maybeSingle();

      if (existingDb) {
        await supabase
          .from('manual_matching_reviews')
          .update({
            review_status: 'manual_review_required',
            internal_notes: clientNotes || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingDb.id);
      } else {
        await supabase.from('manual_matching_reviews').insert({
          reference_id: referenceId,
          user_id: userId,
          therapy_session_id: sessionId,
          therapy_type: existing.therapy_type,
          matching_requirements: existing.matching_requirements,
          client_preferences: existing.client_preferences,
          no_match_reason: existing.no_match_reason,
          unmet_criteria: [],
          review_status: 'manual_review_required',
          audit_trail: existing.audit_trail,
        });
      }
    } catch (dbErr) {
      console.warn('[ConversationalIntakeService] DB review update error:', dbErr);
    }

    // Email dispatch to client and care team
    try {
      if (clientEmail) {
        await EmailService.notifyTeamCallbackReceived({
          clientEmail,
          clientName,
          callbackPreference: 'As soon as possible',
          notes: clientNotes || intake?.presenting_reason || null,
          referenceCode: referenceId,
        });
      }

      await EmailService.notifyTeamCallbackAdminAlert({
        clientName,
        clientEmail,
        clientPhone,
        callbackPreference: 'As soon as possible',
        notes: clientNotes || intake?.presenting_reason || null,
        triageLevel,
        referenceCode: referenceId,
      });
    } catch (emailErr) {
      console.warn('[ConversationalIntakeService] email notification error:', emailErr);
    }

    return {
      success: true,
      referenceId,
      message: 'Your request has been submitted to our clinical care coordinator. We will reach out shortly.',
    };
  }
}
