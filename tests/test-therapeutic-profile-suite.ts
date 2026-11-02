/**
 * Comprehensive Test Suite: Therapeutic Profile & Longitudinal Client Journey
 *
 * Verifies all modules and requirements:
 * 1. Module A: Intake Form & Background (retrieval, permitted client updates, version preservation, therapist clarification flags).
 * 2. Module B: Collaborative Goals Management (creation, progress %, status transitions, therapist feedback, revision audit trail).
 * 3. Module C: Personal Life Events & Milestones (creation, impact rating, discuss flag, strict privacy boundary: therapist CANNOT see private events).
 * 4. Module D: Periodic Session Reviews (cadence, client reflections, therapist review completion, strict clinical note privacy boundary).
 * 5. Multi-Tenant & IDOR Security (relationship-scoped access, unauthorized client and therapist rejections).
 * 6. Profile Overview & Metrics (active goals, achieved goals, life events, review status).
 * 7. Migration 029 DDL & RLS Policy Integrity.
 */

import fs from 'fs';
import path from 'path';
import { TherapeuticProfileService } from '../src/lib/therapy/therapeuticProfileService';

let totalAssertions = 0;
let passedAssertions = 0;
let failedAssertions = 0;

function assert(condition: boolean, message: string) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  [OK] ${message}`);
  } else {
    failedAssertions++;
    console.error(`  [FAIL] ${message}`);
  }
}

async function runTestSuite() {
  console.log('================================================================================');
  console.log('TEST SUITE: THERAPEUTIC PROFILE & LONGITUDINAL CLIENT JOURNEY');
  console.log('================================================================================\n');

  // Reset in-memory state for clean deterministic testing
  TherapeuticProfileService._resetMemoryState();

  // Test Entities
  const CLIENT_A_ID = 'client_usr_001';
  const CLIENT_B_ID = 'client_usr_002'; // Outsider / unauthorized client
  const THERAPIST_A_ID = 'therapist_acc_101';
  const THERAPIST_B_ID = 'therapist_acc_102'; // Outsider / unauthorized therapist
  const RELATIONSHIP_A_ID = 'rel_care_abc_001';
  const RELATIONSHIP_B_ID = 'rel_care_xyz_002';

  TherapeuticProfileService.registerMockRelationship({
    id: RELATIONSHIP_A_ID,
    user_id: CLIENT_A_ID,
    therapist_account_id: THERAPIST_A_ID,
    status: 'active',
    care_stage: 'active_therapy',
  });

  TherapeuticProfileService.registerMockRelationship({
    id: RELATIONSHIP_B_ID,
    user_id: CLIENT_B_ID,
    therapist_account_id: THERAPIST_B_ID,
    status: 'active',
    care_stage: 'active_therapy',
  });

  // --------------------------------------------------------------------------------
  // 1. Migration 029 Schema Verification
  // --------------------------------------------------------------------------------
  console.log('--- Area 1: Migration 029 DDL & RLS Policy Integrity ---');
  {
    const migrationPath = path.join(
      process.cwd(),
      'src',
      'lib',
      'auth',
      'migrations',
      '029_therapeutic_profile_and_longitudinal_journey.sql'
    );
    assert(fs.existsSync(migrationPath), 'Migration 029 SQL file exists');

    const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
    assert(sqlContent.includes('therapeutic_profiles'), 'Defines therapeutic_profiles table');
    assert(sqlContent.includes('therapeutic_intake_versions'), 'Defines therapeutic_intake_versions table');
    assert(sqlContent.includes('therapeutic_goals'), 'Defines therapeutic_goals table');
    assert(sqlContent.includes('therapeutic_goal_history'), 'Defines therapeutic_goal_history table');
    assert(sqlContent.includes('therapeutic_life_events'), 'Defines therapeutic_life_events table');
    assert(sqlContent.includes('therapeutic_periodic_reviews'), 'Defines therapeutic_periodic_reviews table');
    assert(sqlContent.includes('therapeutic_review_clinical_notes'), 'Defines therapeutic_review_clinical_notes table');
    assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Enables Row Level Security on tables');
    assert(sqlContent.includes('is_shared_with_therapist = true'), 'RLS strictly filters shared life events for therapists');
  }

  // --------------------------------------------------------------------------------
  // 2. Module A: Intake Form & Background
  // --------------------------------------------------------------------------------
  console.log('\n--- Area 2: Module A - Intake Form & Background ---');
  {
    TherapeuticProfileService.setMockIntake(CLIENT_A_ID, {
      id: 'intake_mock_001',
      user_id: CLIENT_A_ID,
      full_name: 'Aarav Patel',
      presenting_reason: 'Anxiety and panic attacks before work presentations',
      concerns: ['anxiety', 'panic', 'sleep'],
      living_situation: 'Living alone in rented apartment',
      created_at: '2026-01-05T12:00:00Z',
      updated_at: '2026-01-05T12:00:00Z',
    });

    // Fetch initial intake for relationship A
    const initialIntake = await TherapeuticProfileService.getRelationshipIntake({
      relationshipId: RELATIONSHIP_A_ID,
      accessorRole: 'client',
      accessorId: CLIENT_A_ID,
    });
    assert(initialIntake.relationshipId === RELATIONSHIP_A_ID, 'Intake is correctly scoped to relationship');
    assert(initialIntake.versionCount === 1, 'Initial version count is 1');
    assert(Array.isArray(initialIntake.clarificationFlags), 'Clarification flags list is returned');
    assert(initialIntake.lastReviewedByTherapistAt === null, 'Initially not reviewed by therapist');

    // Client updates permitted intake fields
    const updateResult = await TherapeuticProfileService.updateClientIntake({
      userId: CLIENT_A_ID,
      relationshipId: RELATIONSHIP_A_ID,
      updates: {
        ownWords: 'Updated presenting concern: experiencing heightened anxiety during morning standups.',
        contactPreferences: { preferredMethod: 'email', emergencyContact: '+91 98765 43210' },
      },
      updateSummary: 'Client updated presenting concern and emergency contact.',
    });
    assert(updateResult.success === true, 'Client can update permitted intake fields');
    assert(updateResult.lastUpdatedAt !== undefined, 'Timestamp of update is returned');

    // Therapist adds clarification questions and marks intake as reviewed
    const clarifyResult = await TherapeuticProfileService.setTherapistIntakeClarification({
      therapistAccountId: THERAPIST_A_ID,
      relationshipId: RELATIONSHIP_A_ID,
      clarificationFlags: [
        { field: 'mental_health_history', note: 'Clarify timeline of prior SSRI medication' },
        { field: 'concerns', note: 'Discuss severity of insomnia in next session' },
      ],
      markReviewed: true,
    });
    assert(clarifyResult.success === true, 'Therapist can set clarification flags and mark reviewed');
    assert(clarifyResult.intakeLastReviewedAt !== null, 'Reviewed timestamp is set');
    assert(clarifyResult.clarificationFlags.length === 2, '2 clarification flags recorded');

    // Fetch intake again to verify flags and review timestamp
    const reviewedIntake = await TherapeuticProfileService.getRelationshipIntake({
      relationshipId: RELATIONSHIP_A_ID,
      accessorRole: 'client',
      accessorId: CLIENT_A_ID,
    });
    assert(reviewedIntake.clarificationFlags.length === 2, 'Clarification flags visible in intake profile');
    assert(reviewedIntake.lastReviewedByTherapistAt !== null, 'Therapist review timestamp visible in intake profile');
    assert(reviewedIntake.versionCount === 2, 'Version count incremented to 2 after update');
  }

  // --------------------------------------------------------------------------------
  // 3. Module B: Collaborative Goals Management & History Auditing
  // --------------------------------------------------------------------------------
  console.log('\n--- Area 3: Module B - Collaborative Goals Management & History Auditing ---');
  let goal1Id = '';
  let goal2Id = '';
  {
    // Client creates a goal
    const createdGoal1 = await TherapeuticProfileService.createGoal({
      relationshipId: RELATIONSHIP_A_ID,
      creatorRole: 'client',
      creatorId: CLIENT_A_ID,
      title: 'Master box breathing and grounding techniques',
      description: 'Use the 5-4-3-2-1 technique when heart rate spikes above 100 bpm before meetings.',
      whyItMatters: 'Panic attacks are impacting my confidence during project presentations.',
      category: 'anxiety_management',
      targetDate: '2026-05-01',
      status: 'in_progress',
      progressPercentage: 25,
      clientNotes: 'Practiced 3 times this week; helped reduce duration of panic.',
    });
    assert(createdGoal1.id !== undefined, 'Goal 1 successfully created');
    goal1Id = createdGoal1.id;
    assert(createdGoal1.progress_percentage === 25, 'Initial progress percentage is 25%');
    assert(createdGoal1.created_by_role === 'client', 'Creator role recorded as client');

    // Therapist reviews and updates goal with clinical feedback
    const updatedGoal1 = await TherapeuticProfileService.updateGoal({
      relationshipId: RELATIONSHIP_A_ID,
      goalId: goal1Id,
      updaterRole: 'therapist',
      updaterId: THERAPIST_A_ID,
      updates: {
        progressPercentage: 60,
        therapistFeedback: 'Excellent progress with grounding. Next step: add progressive muscle relaxation.',
      },
      changeReason: 'Session 4 clinical progress review',
    });
    assert(updatedGoal1.progress_percentage === 60, 'Therapist updated progress to 60%');
    assert(updatedGoal1.therapist_feedback.includes('Excellent progress'), 'Therapist feedback attached');

    // Client marks goal as achieved (100%)
    const achievedGoal1 = await TherapeuticProfileService.updateGoal({
      relationshipId: RELATIONSHIP_A_ID,
      goalId: goal1Id,
      updaterRole: 'client',
      updaterId: CLIENT_A_ID,
      updates: {
        status: 'achieved',
        clientNotes: 'No longer experience debilitating panic attacks before morning standups!',
      },
      changeReason: 'Goal achieved successfully after 6 weeks of consistent practice.',
    });
    assert(achievedGoal1.status === 'achieved', 'Goal status transitioned to achieved');
    assert(achievedGoal1.progress_percentage === 100, 'Achieved goal automatically sets progress to 100%');
    assert(achievedGoal1.completed_at !== null, 'Completed timestamp is recorded');

    // Verify Goal History Audit Trail
    const history = await TherapeuticProfileService.getGoalHistory({
      relationshipId: RELATIONSHIP_A_ID,
      goalId: goal1Id,
      accessorRole: 'client',
      accessorId: CLIENT_A_ID,
    });
    assert(history.length >= 3, 'Audit trail contains at least 3 history revisions');
    const latestHist = history[0]; // sorted descending by created_at
    assert(latestHist.new_status === 'achieved', 'Audit trail records status transition to achieved');
    assert(latestHist.change_reason.includes('Goal achieved successfully'), 'Audit trail preserves change reason');

    // Therapist creates a second active goal
    const createdGoal2 = await TherapeuticProfileService.createGoal({
      relationshipId: RELATIONSHIP_A_ID,
      creatorRole: 'therapist',
      creatorId: THERAPIST_A_ID,
      title: 'Assertive communication boundaries in workplace',
      description: 'Practice structured "I" statements when pushback occurs on project deadlines.',
      whyItMatters: 'Prevent burnout and reduce chronic resentment.',
      category: 'interpersonal_relationships',
      targetDate: '2026-06-30',
      status: 'in_progress',
      progressPercentage: 20,
    });
    goal2Id = createdGoal2.id;
    assert(createdGoal2.id !== undefined, 'Goal 2 successfully created by therapist');

    // Retrieve relationship goals
    const allGoals = await TherapeuticProfileService.getRelationshipGoals({
      relationshipId: RELATIONSHIP_A_ID,
      accessorRole: 'client',
      accessorId: CLIENT_A_ID,
    });
    assert(allGoals.totalCount === 2, 'Total goals count is 2');
    assert(allGoals.achieved.length === 1, '1 goal is in achieved status');
    assert(allGoals.active.length === 1, '1 goal is in active status');
  }

  // --------------------------------------------------------------------------------
  // 4. Module C: Personal Life Events & Strict Privacy Boundaries
  // --------------------------------------------------------------------------------
  console.log('\n--- Area 4: Module C - Personal Life Events & Strict Privacy Boundaries ---');
  let privateEventId = '';
  let sharedEventId = '';
  {
    // Client creates a SHARED life event
    const sharedEvent = await TherapeuticProfileService.createLifeEvent({
      userId: CLIENT_A_ID,
      relationshipId: RELATIONSHIP_A_ID,
      title: 'Promoted to Senior Product Designer',
      category: 'career_education',
      eventDate: '2026-02-15',
      description: 'Received promotion; excited but feeling heightened workload pressure.',
      emotionalImpact: 'mixed',
      discussInSession: true,
      isSharedWithTherapist: true,
    });
    sharedEventId = sharedEvent.id;
    assert(sharedEvent.is_shared_with_therapist === true, 'Shared event recorded');
    assert(sharedEvent.discuss_in_session === true, 'Discuss in session flag set');

    // Client creates a strictly PRIVATE life event
    const privateEvent = await TherapeuticProfileService.createLifeEvent({
      userId: CLIENT_A_ID,
      relationshipId: RELATIONSHIP_A_ID,
      title: 'Personal Journal Entry: Disagreement with family member',
      category: 'relationships_family',
      eventDate: '2026-02-20',
      description: 'Private reflection; not ready to discuss in therapy yet.',
      emotionalImpact: 'challenging',
      discussInSession: false,
      isSharedWithTherapist: false, // STRICTLY PRIVATE
    });
    privateEventId = privateEvent.id;
    assert(privateEvent.is_shared_with_therapist === false, 'Private event recorded');

    // Client views their own life events: MUST see both private and shared
    const clientEvents = await TherapeuticProfileService.getClientLifeEvents(CLIENT_A_ID);
    const clientEventIds = clientEvents.map(e => e.id);
    assert(clientEventIds.includes(sharedEventId), 'Client sees shared event');
    assert(clientEventIds.includes(privateEventId), 'Client sees private event');
    assert(clientEvents.length === 2, 'Client sees all 2 personal life events');

    // Therapist views shared life events: MUST ONLY see shared event, NEVER private event
    const therapistSharedEvents = await TherapeuticProfileService.getTherapistSharedLifeEvents(
      THERAPIST_A_ID,
      RELATIONSHIP_A_ID
    );
    const therapistEventIds = therapistSharedEvents.map(e => e.id);
    assert(therapistEventIds.includes(sharedEventId), 'Therapist sees shared event');
    assert(!therapistEventIds.includes(privateEventId), 'CRITICAL PRIVACY: Therapist CANNOT see private event');
    assert(therapistSharedEvents.length === 1, 'Therapist only received 1 shared event');

    // Client updates sharing preference of private event to shared
    const toggledEvent = await TherapeuticProfileService.updateLifeEvent({
      userId: CLIENT_A_ID,
      eventId: privateEventId,
      updates: {
        isSharedWithTherapist: true,
        discussInSession: true,
      },
    });
    assert(toggledEvent.is_shared_with_therapist === true, 'Client toggled event to shared');

    // Therapist now sees both events because client explicitly shared it
    const therapistEventsAfterToggle = await TherapeuticProfileService.getTherapistSharedLifeEvents(
      THERAPIST_A_ID,
      RELATIONSHIP_A_ID
    );
    assert(therapistEventsAfterToggle.length === 2, 'Therapist sees event after client explicitly shares it');

    // Client deletes the second event
    const deleteRes = await TherapeuticProfileService.deleteLifeEvent(CLIENT_A_ID, privateEventId);
    assert(deleteRes.success === true, 'Client successfully deletes life event');

    const clientEventsAfterDelete = await TherapeuticProfileService.getClientLifeEvents(CLIENT_A_ID);
    assert(clientEventsAfterDelete.length === 1, 'Only 1 event remains after deletion');
  }

  // --------------------------------------------------------------------------------
  // 5. Module D: Periodic Session Reviews & Strict Clinical Note Isolation
  // --------------------------------------------------------------------------------
  console.log('\n--- Area 5: Module D - Periodic Session Reviews & Clinical Note Isolation ---');
  let reviewId = '';
  {
    // Therapist initiates periodic review #1 (Session 6 milestone)
    const initiatedReview = await TherapeuticProfileService.initiatePeriodicReview({
      therapistAccountId: THERAPIST_A_ID,
      relationshipId: RELATIONSHIP_A_ID,
      reviewPeriodLabel: 'Session 1 to 6 Longitudinal Review',
      sessionsIncluded: 6,
      nextReviewDueDate: '2026-04-15',
    });
    reviewId = initiatedReview.id;
    assert(initiatedReview.status === 'pending_client_input', 'Review status is pending_client_input');
    assert(initiatedReview.sessions_included === 6, 'Recorded 6 sessions included');

    // Client submits their reflection
    const submittedReview = await TherapeuticProfileService.submitClientReviewResponse({
      userId: CLIENT_A_ID,
      reviewId: reviewId,
      responses: {
        whatFeelsBetter: 'Panic attacks have substantially subsided; feeling much more in control of body responses.',
        whatRemainsDifficult: 'Setting firm boundaries with superiors at work remains challenging.',
        whatHasChanged: 'I sleep better on Sunday nights before the work week begins.',
        nextFocus: 'Role-playing assertive boundary conversations.',
        meetingNeedsRating: 'yes',
      },
    });
    assert(submittedReview.status === 'client_submitted', 'Review status transitioned to client_submitted');
    assert(submittedReview.client_submitted_at !== null, 'Client submission timestamp recorded');

    // Therapist completes the review: provides shared summary and strictly private internal clinical notes
    const completedReview = await TherapeuticProfileService.completePeriodicReview({
      therapistAccountId: THERAPIST_A_ID,
      reviewId: reviewId,
      feedback: {
        progressObserved: 'Significant mastery of panic regulation tools; high treatment engagement.',
        goalsProgressSummary: 'Goal 1 achieved (100%); Goal 2 underway (20%).',
        barriersAndChallenges: 'Workplace authority figure anxiety triggers defensive avoidance.',
        collaborativeNextSteps: 'Introduce assertiveness scripts and cognitive restructuring.',
        feedbackForClient: 'You have done exceptional work establishing baseline somatic safety.',
      },
      internalClinicalNotes: {
        clinicalNotesInternal: 'CONFIDENTIAL CLINICAL RECORD: Client displays traits of perfectionism and fear of negative evaluation. Monitor passive avoidance.',
        clinicalRiskAssessmentNotes: 'No suicidal or self-harm ideation reported. Risk low.',
        diagnosticImpressions: 'F41.0 Panic Disorder without agoraphobia (in partial remission); Generalized Anxiety traits.',
      },
    });
    assert(completedReview.status === 'completed', 'Review status transitioned to completed');
    assert(completedReview.completed_at !== null, 'Completed timestamp recorded');

    // Fetch reviews as THERAPIST: MUST contain internal clinical notes
    const therapistReviews = await TherapeuticProfileService.getPeriodicReviews({
      relationshipId: RELATIONSHIP_A_ID,
      accessorRole: 'therapist',
      accessorId: THERAPIST_A_ID,
    });
    assert(therapistReviews.length === 1, 'Therapist retrieves 1 completed review');
    assert(
      therapistReviews[0].internal_notes?.clinical_notes_internal.includes('CONFIDENTIAL CLINICAL RECORD'),
      'Therapist CAN access internal clinical notes'
    );

    // Fetch reviews as CLIENT: MUST NEVER contain internal clinical notes
    const clientReviews = await TherapeuticProfileService.getPeriodicReviews({
      relationshipId: RELATIONSHIP_A_ID,
      accessorRole: 'client',
      accessorId: CLIENT_A_ID,
    });
    assert(clientReviews.length === 1, 'Client retrieves 1 completed review');
    assert(
      clientReviews[0].feedback_for_client?.includes('exceptional work'),
      'Client sees shared collaborative feedback'
    );
    assert(
      clientReviews[0].internal_notes === undefined,
      'CRITICAL PRIVACY: Client CANNOT see internal clinical notes'
    );
  }

  // --------------------------------------------------------------------------------
  // 6. Cross-Tenant IDOR & Relationship Scoping Defense
  // --------------------------------------------------------------------------------
  console.log('\n--- Area 6: Multi-Tenant IDOR & Access Control Security ---');
  {
    // Attacker Client B attempts to update Goal 1 belonging to Relationship A
    let clientTamperError = false;
    try {
      await TherapeuticProfileService.updateGoal({
        relationshipId: RELATIONSHIP_A_ID,
        goalId: goal1Id,
        updaterRole: 'client',
        updaterId: CLIENT_B_ID, // Unauthorized
        updates: { progressPercentage: 0 },
      });
    } catch (err: any) {
      clientTamperError = true;
      assert(err.code === 'UNAUTHORIZED_ACCESS', 'Cross-tenant client goal tampering rejected with UNAUTHORIZED_ACCESS');
    }
    assert(clientTamperError, 'Unauthorized client was blocked from modifying relationship A goal');

    // Attacker Therapist B attempts to access Relationship A's periodic reviews
    let therapistTamperError = false;
    try {
      await TherapeuticProfileService.getPeriodicReviews({
        relationshipId: RELATIONSHIP_A_ID,
        accessorRole: 'therapist',
        accessorId: THERAPIST_B_ID, // Unauthorized
      });
    } catch (err: any) {
      therapistTamperError = true;
      assert(err.code === 'UNAUTHORIZED_ACCESS', 'Cross-tenant therapist review access rejected with UNAUTHORIZED_ACCESS');
    }
    assert(therapistTamperError, 'Unauthorized therapist was blocked from accessing relationship A reviews');

    // Attacker Client B attempts to delete Client A's life event
    let lifeEventTamperError = false;
    try {
      await TherapeuticProfileService.deleteLifeEvent(CLIENT_B_ID, sharedEventId);
    } catch (err: any) {
      lifeEventTamperError = true;
      assert(err.code === 'NOT_FOUND_OR_FORBIDDEN', 'Cross-tenant life event deletion rejected');
    }
    assert(lifeEventTamperError, 'Unauthorized client was blocked from deleting another client’s life event');
  }

  // --------------------------------------------------------------------------------
  // 7. Overview Summary Calculation
  // --------------------------------------------------------------------------------
  console.log('\n--- Area 7: Overview Summary Calculation ---');
  {
    const overview = await TherapeuticProfileService.getTherapeuticProfileOverview(CLIENT_A_ID);
    assert(overview.hasProfile === true, 'Profile exists for client A');
    assert(overview.relationshipId === RELATIONSHIP_A_ID, 'Overview scoped to relationship A');
    assert(overview.activeGoalsCount === 1, 'Counts 1 active goal');
    assert(overview.recentlyAchievedGoals.length === 1, 'Reports 1 recently achieved goal');
    assert(overview.sharedLifeEventsCount === 1, 'Counts 1 shared life event');
    assert(overview.lastCompletedReview !== null, 'Reports last completed review');
    assert(
      overview.lastCompletedReview?.label === 'Session 1 to 6 Longitudinal Review',
      'Correct review period label in overview'
    );
  }

  // --------------------------------------------------------------------------------
  // SUMMARY
  // --------------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`TOTAL ASSERTIONS: ${totalAssertions}`);
  console.log(`PASSED: ${passedAssertions}`);
  console.log(`FAILED: ${failedAssertions}`);
  console.log('================================================================================\n');

  if (failedAssertions > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal error in test suite:', err);
  process.exit(1);
});
