import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedUser } from '../../../../lib/auth-helper';
import { createTherapySubmission } from '../../../../lib/therapy/therapyService';

const VALID_SUBMISSION_TYPES = [
  'conversation',
  'guided',
  'team',
] as const;

export async function POST(request: NextRequest) {
  try {
    const authUser = await getAuthenticatedUser(request);

    if (!authUser) {
      return NextResponse.json(
        {
          error: {
            code: 'AUTH_REQUIRED',
            message: 'Authentication is required.',
          },
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_REQUEST',
            message: 'Invalid request body.',
          },
        },
        { status: 400 }
      );
    }

    const {
      therapySessionId,
      submissionType,
      callbackPreference,
      notes,
      metadata,
      payload,
    } = body;

    if (
      typeof therapySessionId !== 'string' ||
      therapySessionId.trim().length === 0
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SESSION',
            message: 'therapySessionId is required.',
          },
        },
        { status: 400 }
      );
    }

    if (
      typeof submissionType !== 'string' ||
      !VALID_SUBMISSION_TYPES.includes(
        submissionType as (typeof VALID_SUBMISSION_TYPES)[number]
      )
    ) {
      return NextResponse.json(
        {
          error: {
            code: 'INVALID_SUBMISSION_TYPE',
            message: 'Invalid submissionType.',
          },
        },
        { status: 400 }
      );
    }

    const resolvedMetadata =
      metadata && typeof metadata === 'object' && !Array.isArray(metadata)
        ? metadata
        : payload && typeof payload === 'object' && !Array.isArray(payload)
          ? payload
          : {};

    const submission = await createTherapySubmission({
      therapySessionId: therapySessionId.trim(),
      userId: authUser.userId,
      submissionType:
        submissionType as Parameters<typeof createTherapySubmission>[0]['submissionType'],
      callbackPreference:
        typeof callbackPreference === 'string'
          ? callbackPreference
          : null,
      notes:
        typeof notes === 'string'
          ? notes
          : null,
      metadata: resolvedMetadata,
    });

    // Ensure selected therapist is tracked in therapy_matches with shortlisted status and notified
    const selectedTherapistId = resolvedMetadata.selectedTherapistAccountId || resolvedMetadata.selectedTherapistPrototypeId;
    if (typeof selectedTherapistId === 'string' && selectedTherapistId.trim()) {
      try {
        const cleanTherapistId = selectedTherapistId.trim();
        const { supabase } = await import('../../../../lib/db');
        const { EmailService } = await import('../../../../lib/email/emailService');

        // Check if match already exists
        const { data: existingMatch } = await supabase
          .from('therapy_matches')
          .select('*')
          .eq('therapy_session_id', therapySessionId.trim())
          .eq('therapist_account_id', cleanTherapistId)
          .maybeSingle();

        let targetMatchId = existingMatch?.id;

        if (!existingMatch) {
          const { data: newMatch } = await supabase
            .from('therapy_matches')
            .insert({
              therapy_session_id: therapySessionId.trim(),
              user_id: authUser.userId,
              therapist_account_id: cleanTherapistId,
              match_status: 'shortlisted',
              match_rank: 1,
              match_score: 95,
              match_reasons: ['Selected by client during guided intake'],
              matching_metadata: { source: 'client_intake_submission' },
            })
            .select('*')
            .single();
          targetMatchId = newMatch?.id;
        } else if (existingMatch.match_status !== 'selected') {
          await supabase
            .from('therapy_matches')
            .update({ match_status: 'shortlisted' })
            .eq('id', existingMatch.id);
        }

        if (targetMatchId) {
          const { data: profile } = await supabase
            .from('therapist_profiles')
            .select('full_name, contact_email')
            .eq('therapist_account_id', cleanTherapistId)
            .maybeSingle();

          let therapistEmail = profile?.contact_email;
          if (!therapistEmail) {
            const { data: app } = await supabase
              .from('therapist_applications')
              .select('contact_email, answers')
              .eq('therapist_account_id', cleanTherapistId)
              .maybeSingle();
            therapistEmail = app?.contact_email || (app?.answers as any)?.contact_email;
          }

          if (therapistEmail) {
            await EmailService.notifyTherapistMatchRequest({
              matchId: targetMatchId,
              therapistId: cleanTherapistId,
              therapistName: profile?.full_name || (resolvedMetadata.selectedTherapistName as string) || 'Therapist',
              therapistEmail,
              rank: 1,
              score: 95,
            });
          }
        }
      } catch (matchLinkErr) {
        console.warn('[Therapy Submission POST] Match linking/email notice:', matchLinkErr);
      }
    }

    // Handle submissionType === 'team' (Talk to the team / Direct Callback Request)
    let referenceId: string | null = null;
    if (submissionType === 'team') {
      try {
        const { supabase } = await import('../../../../lib/db');
        const { recordInMemoryManualReview } = await import('../../../../lib/therapy/conversationalIntakeService');
        const { EmailService } = await import('../../../../lib/email/emailService');

        // Fetch intake and safety assessment
        const [{ data: intake }, { data: safety }] = await Promise.all([
          supabase.from('therapy_intakes').select('*').eq('therapy_session_id', therapySessionId.trim()).maybeSingle(),
          supabase.from('therapy_safety_assessments').select('*').eq('therapy_session_id', therapySessionId.trim()).maybeSingle(),
        ]);

        const intakeSummary = (resolvedMetadata?.clientIntakeSummary as any) || (resolvedMetadata as any) || {};
        const clientName = intake?.full_name || intakeSummary.name || authUser.phoneNumber || 'Valued Client';
        const clientEmail = intake?.email || intakeSummary.email || null;
        const clientPhone = intake?.phone_number || intakeSummary.phone || authUser.phoneNumber || null;
        const triageLevel = safety?.triage_level || 'standard';
        referenceId = `TEAM-${Date.now().toString(36).toUpperCase()}`;

        const isMatchFallback = resolvedMetadata?.source === 'therapy_matches_fallback';
        const therapyType = isMatchFallback ? 'Guided Matches Review Request' : 'Direct Team Callback';
        const languagePref = intakeSummary.language || (intake?.answers as any)?.language || (intake?.expectations as any)?.language || 'No preference';
        const genderPref = intakeSummary.genderPreference || (intake?.expectations as any)?.therapistGender || 'No preference';
        const budgetPref = intakeSummary.budget || (intake?.expectations as any)?.budget || 'Flexible';
        const concernsList = intakeSummary.concerns || (Array.isArray(intake?.concerns) ? intake?.concerns : intake?.concerns?.selected) || [];

        const noMatchReason = isMatchFallback
          ? 'Client requested care team review from therapist matches screen (none of the automated matches suited them).'
          : 'Client requested direct assistance / callback from Ingress Within care team.';

        const fullNotes = [
          notes ? `Client Notes: ${notes}` : null,
          languagePref && languagePref !== 'No preference' ? `Preferred Language: ${languagePref}` : null,
          genderPref && genderPref !== 'No preference' ? `Preferred Clinician Gender: ${genderPref}` : null,
          budgetPref ? `Budget: ${budgetPref}` : null,
          Array.isArray(concernsList) && concernsList.length ? `Stated Concerns: ${concernsList.join(', ')}` : null,
        ].filter(Boolean).join(' | ');

        // Register in manual matching reviews so Admin sees it in Matching Reviews tab
        const manualRecord = {
          id: crypto.randomUUID(),
          reference_id: referenceId,
          user_id: authUser.userId,
          therapy_session_id: therapySessionId.trim(),
          intake_id: intake?.id || null,
          therapy_type: therapyType,
          matching_requirements: {
            callback_preference: callbackPreference || 'No preference',
            reason: notes || intake?.presenting_reason || '',
            triage_level: triageLevel,
            language: languagePref,
            gender_preference: genderPref,
            budget: budgetPref,
            concerns: concernsList,
          },
          client_preferences: {
            name: clientName,
            contact_name: clientName,
            email: clientEmail,
            contact_email: clientEmail,
            phone: clientPhone,
            contact_phone: clientPhone,
            callback: callbackPreference || 'No preference',
            callback_preference: callbackPreference || 'No preference',
            notes: fullNotes,
            reason: notes || intake?.presenting_reason || '',
            triage_level: triageLevel,
            language: languagePref,
            gender_preference: genderPref,
            budget: budgetPref,
            concerns: concernsList,
          },
          no_match_reason: noMatchReason,
          unmet_criteria: [],
          review_status: 'manual_review_required' as const,
          audit_trail: [
            {
              timestamp: new Date().toISOString(),
              action: isMatchFallback ? 'matches_fallback_team_requested' : 'team_callback_requested',
              actor: 'client',
              details: isMatchFallback
                ? `Client requested care team review after viewing matches. Preferred Language: ${languagePref}. Gender: ${genderPref}. Triage: ${triageLevel}.`
                : `Client submitted a direct callback request. Preferred window: ${callbackPreference || 'Anytime'}. Triage: ${triageLevel}.`,
            },
          ],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        recordInMemoryManualReview(manualRecord);

        // Also persist to Supabase if table exists
        try {
          await supabase.from('manual_matching_reviews').insert({
            reference_id: referenceId,
            user_id: authUser.userId,
            therapy_session_id: therapySessionId.trim(),
            therapy_type: manualRecord.therapy_type,
            matching_requirements: manualRecord.matching_requirements,
            client_preferences: manualRecord.client_preferences,
            no_match_reason: manualRecord.no_match_reason,
            unmet_criteria: [],
            review_status: 'manual_review_required',
            audit_trail: manualRecord.audit_trail,
          });
        } catch (dbErr) {
          console.warn('[Submission] manual_matching_reviews insert note:', dbErr);
        }

        // Email to Client confirming receipt & giving 24/7 helpline numbers
        if (clientEmail) {
          await EmailService.notifyTeamCallbackReceived({
            clientEmail,
            clientName,
            callbackPreference: callbackPreference || 'No preference',
            notes: isMatchFallback
              ? `We have received your request for personal clinician matching. A care coordinator will review your preferences (${languagePref !== 'No preference' ? `Language: ${languagePref}, ` : ''}${genderPref !== 'No preference' ? `Gender: ${genderPref}` : ''}) and reach out soon.`
              : (notes || intake?.presenting_reason || null),
            referenceCode: referenceId,
          });
        }

        // Alert Email to Admin / Care Coordinator
        await EmailService.notifyTeamCallbackAdminAlert({
          clientName,
          clientEmail,
          clientPhone,
          callbackPreference: callbackPreference || 'No preference',
          notes: fullNotes,
          triageLevel,
          referenceCode: referenceId,
        });
      } catch (teamSubmissionErr) {
        console.error('[Therapy Submission POST] Team callback notification error:', teamSubmissionErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        submission,
        referenceId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[Therapy Submission POST] Error:', error);

    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create Therapy submission.',
        },
      },
      { status: 500 }
    );
  }
}