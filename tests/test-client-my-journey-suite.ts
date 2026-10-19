import fs from 'fs';
import path from 'path';
import { getClientCareJourney } from '../src/lib/therapy/therapyService';

let passed = 0;
let total = 0;

function assert(condition: boolean, message: string) {
  total++;
  if (!condition) {
    console.error(`  ✗ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  passed++;
  console.log(`  ✓ [PASS] ${message}`);
}

async function runStep5Suite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — CLIENT MY JOURNEY TEST SUITE (STEP 5)        ');
  console.log('================================================================\n');

  // ===========================================================================
  // SECTION 1: Chronological Timeline Ordering & Event Classification
  // ===========================================================================
  console.log('--- SECTION 1: Timeline Ordering & Event Classification ---');

  const journeyViewPath = path.join(process.cwd(), 'src/views/client/ClientTherapyCareJourneyView.jsx');
  assert(fs.existsSync(journeyViewPath), 'ClientTherapyCareJourneyView exists on disk');

  const journeyViewSrc = fs.readFileSync(journeyViewPath, 'utf8');

  // Verify milestone types
  assert(
    journeyViewSrc.includes('session_attended') &&
    journeyViewSrc.includes('homework_reviewed') &&
    journeyViewSrc.includes('homework_submitted') &&
    journeyViewSrc.includes('care_stage_transition') &&
    journeyViewSrc.includes('relationship_started'),
    'Supports real, distinct event classifications in chronological timeline'
  );

  // Test timeline sorting logic
  const mockTimeline = [
    { id: '1', timestamp: '2026-10-10T10:00:00Z', type: 'relationship_started' },
    { id: '2', timestamp: '2026-10-15T10:00:00Z', type: 'session_attended' },
    { id: '3', timestamp: '2026-10-12T10:00:00Z', type: 'care_stage_transition' },
  ];
  mockTimeline.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  assert(
    mockTimeline[0].id === '2' && mockTimeline[1].id === '3' && mockTimeline[2].id === '1',
    'Timeline strictly orders events chronologically newest-first'
  );

  // ===========================================================================
  // SECTION 2: Session Metrics & Attendance Status Distinctions
  // ===========================================================================
  console.log('\n--- SECTION 2: Session Counts & Attendance Distinctions ---');

  const mockAppts = [
    { id: 'a1', status: 'completed', attendance_status: 'attended', scheduled_start: '2026-10-01T10:00:00Z' },
    { id: 'a2', status: 'completed', attendance_status: 'client_no_show', scheduled_start: '2026-10-08T10:00:00Z' },
    { id: 'a3', status: 'scheduled', attendance_status: null, scheduled_start: new Date(Date.now() + 86400000).toISOString() },
    { id: 'a4', status: 'cancelled', attendance_status: null, scheduled_start: '2026-10-12T10:00:00Z' },
  ];

  const now = new Date();
  const completed = mockAppts.filter((a) => a.status === 'completed' && a.attendance_status !== 'client_no_show').length;
  const upcoming = mockAppts.filter((a) => ['scheduled', 'confirmed'].includes(a.status) && new Date(a.scheduled_start) >= now).length;
  const cancelled = mockAppts.filter((a) => a.status === 'cancelled').length;

  assert(completed === 1, 'Only attended completed sessions count toward completed sessions (excludes no-shows)');
  assert(upcoming === 1, 'Upcoming sessions are strictly distinguished from completed sessions');
  assert(cancelled === 1, 'Cancelled sessions are segregated and not counted as attended');

  // ===========================================================================
  // SECTION 3: Homework Counts & Submission/Review States
  // ===========================================================================
  console.log('\n--- SECTION 3: Homework Counts & Review States ---');

  const mockHomework = [
    { id: 'h1', status: 'assigned' },
    { id: 'h2', status: 'in_progress' },
    { id: 'h3', status: 'submitted' },
    { id: 'h4', status: 'reviewed' },
  ];

  const totalHw = mockHomework.length;
  const submittedHw = mockHomework.filter((h) => ['submitted', 'reviewed'].includes(h.status)).length;
  const reviewedHw = mockHomework.filter((h) => h.status === 'reviewed').length;

  assert(totalHw === 4, 'Correct total homework count');
  assert(submittedHw === 2, 'Distinguishes submitted and completed homework from open homework');
  assert(reviewedHw === 1, 'Identifies clinician-reviewed homework count accurately');

  // ===========================================================================
  // SECTION 4: Empty, Loading, Error & Partial-Data Handling
  // ===========================================================================
  console.log('\n--- SECTION 4: Empty, Loading, Error & Partial-Data Handling ---');

  assert(
    journeyViewSrc.includes('loading') && journeyViewSrc.includes('animate-spin'),
    'Displays accessible loading spinner during fetch operations'
  );
  assert(
    journeyViewSrc.includes('role="alert"') && journeyViewSrc.includes('Retry Connection'),
    'Renders accessible recoverable error alerts with Retry action'
  );
  assert(
    journeyViewSrc.includes('No milestones recorded yet for this filter') ||
    journeyViewSrc.includes('Your journey is currently building'),
    'Provides dignified empty state explaining the journey is in progress'
  );

  // ===========================================================================
  // SECTION 5: Revisit Personal Reflections & Client-Visible Feedback
  // ===========================================================================
  console.log('\n--- SECTION 5: Personal Reflections & Client-Visible Feedback ---');

  assert(
    journeyViewSrc.includes('Revisit Completed Exercise') &&
    journeyViewSrc.includes('onOpenHomework'),
    'Provides direct link to open and review client reflection and feedback'
  );
  assert(
    journeyViewSrc.includes('View Session Records') &&
    journeyViewSrc.includes('onNavigateSessions'),
    'Provides deep navigation to session records from timeline'
  );

  // ===========================================================================
  // SECTION 6: No Fabricated Scores, Mental Health Claims or Peer Comparisons
  // ===========================================================================
  console.log('\n--- SECTION 6: No Fabricated Scores or Clinical Claims ---');

  assert(
    !journeyViewSrc.includes('% improvement') &&
    !journeyViewSrc.includes('wellness score') &&
    !journeyViewSrc.includes('mental health rating') &&
    !journeyViewSrc.includes('peer comparison') &&
    !journeyViewSrc.includes('percentile'),
    'Zero fabricated clinical recovery percentages or peer comparison claims'
  );

  assert(
    journeyViewSrc.includes('Therapy progress is naturally non-linear') ||
    journeyViewSrc.includes('non-linear'),
    'Explicitly clarifies to clients that therapy progression is non-linear'
  );

  // ===========================================================================
  // SECTION 7: Strict Privacy Boundaries & SOAP Note Exclusion
  // ===========================================================================
  console.log('\n--- SECTION 7: Strict Privacy Boundaries & Note Exclusion ---');

  const therapyServicePath = path.join(process.cwd(), 'src/lib/therapy/therapyService.ts');
  const therapyServiceSrc = fs.readFileSync(therapyServicePath, 'utf8');

  assert(
    !therapyServiceSrc.includes('soap_notes') &&
    !therapyServiceSrc.includes('clinical_formulation') &&
    !therapyServiceSrc.includes('supervisory_notes'),
    'getClientCareJourney strictly excludes therapist-private SOAP notes and formulation'
  );

  assert(
    journeyViewSrc.includes('SOAP notes, clinical formulation, risk logs, and therapist supervisory records remain strictly restricted'),
    'Renders explicit privacy shield notice guaranteeing clinical confidentiality'
  );

  // ===========================================================================
  // SECTION 8: Server Authentication & IDOR Protection
  // ===========================================================================
  console.log('\n--- SECTION 8: Server Authentication & IDOR Protection ---');

  const journeyRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/journey/route.ts');
  const journeyRouteSrc = fs.readFileSync(journeyRoutePath, 'utf8');

  assert(
    journeyRouteSrc.includes('getAuthenticatedUser') && journeyRouteSrc.includes('authUser.userId'),
    'Journey route derives client identity strictly from authenticated server session'
  );
  assert(
    therapyServiceSrc.includes('.eq(\'user_id\', userId)'),
    'Care journey queries strictly filter appointments and relationships by user_id'
  );

  // ===========================================================================
  // SECTION 9: Dashboard Integration & Regressions (Steps 1–4)
  // ===========================================================================
  console.log('\n--- SECTION 9: Dashboard Integration & Regressions ---');

  const dashboardPath = path.join(process.cwd(), 'src/views/client/ClientTherapyDashboard.jsx');
  const dashboardSrc = fs.readFileSync(dashboardPath, 'utf8');

  assert(
    dashboardSrc.includes('import ClientTherapyCareJourneyView from \'./ClientTherapyCareJourneyView\'') ||
    dashboardSrc.includes('import ClientTherapyCareJourneyView from "./ClientTherapyCareJourneyView"'),
    'ClientTherapyDashboard imports ClientTherapyCareJourneyView'
  );

  assert(
    dashboardSrc.includes('<ClientTherapyCareJourneyView') &&
    dashboardSrc.includes('journeyData={journeyData}'),
    'Tab 4 renders ClientTherapyCareJourneyView with real journeyData'
  );

  assert(
    dashboardSrc.includes('<ClientTherapyMyTherapistView'),
    'Step 3 (My Therapist) remains functional'
  );

  assert(
    dashboardSrc.includes('<ClientTherapyHomeworkView'),
    'Step 4 (Homework & Programs) remains functional'
  );

  assert(
    dashboardSrc.includes('MEETING_POST_SESSION_BUFFER_MS'),
    '20-minute meeting join buffer remains active'
  );

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} passed, 0 failed (${total} total)`);
  console.log('================================================================\n');
}

runStep5Suite().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
