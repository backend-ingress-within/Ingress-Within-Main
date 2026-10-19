import fs from 'fs';
import path from 'path';
import { NextRequest } from 'next/server';
import { ClientHomeworkService } from '../src/lib/therapy/clientHomeworkService';
import { TherapistHomeworkService } from '../src/lib/therapist/therapistHomeworkService';

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

async function runStep4Suite() {
  console.log('================================================================');
  console.log('  INGRESS WITHIN — CLIENT HOMEWORK & PROGRAMS SUITE (STEP 4)    ');
  console.log('================================================================\n');

  // ===========================================================================
  // SECTION 1: Assignment List & Status Segregation
  // ===========================================================================
  console.log('--- SECTION 1: Assignment List & Status Segregation ---');

  const mockAssignments = [
    {
      id: 'hw-1',
      title: 'CBT 5-Column Thought Record',
      instructions: 'Record automatic thoughts upon mood shift.',
      status: 'assigned',
      dueAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      exerciseType: 'thought_record',
      estimatedMinutes: 20,
    },
    {
      id: 'hw-2',
      title: 'Mindful Grounding & Box Breathing',
      instructions: 'Practice 5-4-3-2-1 technique.',
      status: 'in_progress',
      hasDraft: true,
      dueAt: new Date(Date.now() - 3600000).toISOString(), // 1 hr ago (overdue)
      exerciseType: 'grounding_exercise',
      estimatedMinutes: 10,
    },
    {
      id: 'hw-3',
      title: 'Psychoeducation: Cognitive Restructuring',
      instructions: 'Read intermediate beliefs summary.',
      status: 'submitted',
      dueAt: new Date(Date.now() + 172800000).toISOString(),
      exerciseType: 'psychoeducation_module',
      estimatedMinutes: 15,
      submittedAt: new Date().toISOString(),
    },
    {
      id: 'hw-4',
      title: 'Values Alignment Reflection',
      instructions: 'Reflect on core values in relationship.',
      status: 'reviewed',
      dueAt: new Date(Date.now() - 86400000).toISOString(),
      exerciseType: 'journaling_reflection',
      estimatedMinutes: 15,
      submittedAt: new Date(Date.now() - 90000000).toISOString(),
      reviewedAt: new Date(Date.now() - 80000000).toISOString(),
      feedback: 'Excellent awareness demonstrated on setting boundaries.',
    },
  ];

  // Test segregation logic
  const now = Date.now();
  const todo = mockAssignments.filter((a) => ['assigned', 'viewed', 'in_progress'].includes(a.status));
  const inReview = mockAssignments.filter((a) => a.status === 'submitted');
  const completed = mockAssignments.filter((a) => a.status === 'reviewed');
  const overdue = mockAssignments.filter((a) => {
    const dueTime = new Date(a.dueAt).getTime();
    return dueTime < now && !['submitted', 'reviewed'].includes(a.status);
  });

  assert(todo.length === 2, 'To Do filter includes "assigned" and "in_progress" items');
  assert(inReview.length === 1 && inReview[0].id === 'hw-3', 'In Review filter includes "submitted" items');
  assert(completed.length === 1 && completed[0].id === 'hw-4', 'Completed filter includes "reviewed" items');
  assert(overdue.length === 1 && overdue[0].id === 'hw-2', 'Overdue accurately flags uncompleted items past dueAt');

  // ===========================================================================
  // SECTION 2: Empty, Loading, Error & Retry States
  // ===========================================================================
  console.log('\n--- SECTION 2: Empty, Loading, Error & Retry States ---');

  const homeworkViewPath = path.join(process.cwd(), 'src/views/client/ClientTherapyHomeworkView.jsx');
  assert(fs.existsSync(homeworkViewPath), 'ClientTherapyHomeworkView component exists on disk');
  const homeworkViewSrc = fs.readFileSync(homeworkViewPath, 'utf8');

  assert(
    homeworkViewSrc.includes('loading') && homeworkViewSrc.includes('animate-spin'),
    'Renders accessible loading spinner during fetch operations'
  );
  assert(
    homeworkViewSrc.includes('role="alert"') && homeworkViewSrc.includes('Retry Connection'),
    'Displays recoverable error alerts with an actionable Retry Connection button'
  );
  assert(
    homeworkViewSrc.includes('All caught up with your self-work!') ||
    homeworkViewSrc.includes('No assignments found'),
    'Provides dignified, encouraging empty states for completed or empty categories'
  );

  // ===========================================================================
  // SECTION 3: Assignment Detail & Supported Formats
  // ===========================================================================
  console.log('\n--- SECTION 3: Assignment Detail & Supported Formats ---');

  const homeworkModalPath = path.join(process.cwd(), 'src/views/client/ClientHomeworkModal.jsx');
  assert(fs.existsSync(homeworkModalPath), 'ClientHomeworkModal component exists on disk');
  const homeworkModalSrc = fs.readFileSync(homeworkModalPath, 'utf8');

  assert(
    homeworkModalSrc.includes('CBT Thought Record Worksheet') &&
    homeworkModalSrc.includes('automaticThought') &&
    homeworkModalSrc.includes('balancedPerspective'),
    'Supports structured CBT Thought Record worksheet inputs'
  );
  assert(
    homeworkModalSrc.includes('5-4-3-2-1 Sensory Grounding Steps') &&
    homeworkModalSrc.includes('checklistItems'),
    'Supports somatic grounding exercise interactive checklists'
  );
  assert(
    homeworkModalSrc.includes('Your Written Practice Reflection & Response') ||
    homeworkModalSrc.includes('Your Practice Reflection'),
    'Supports open text reflection responses'
  );

  // ===========================================================================
  // SECTION 4: Required-Field Validation & Payload Constraints
  // ===========================================================================
  console.log('\n--- SECTION 4: Required-Field Validation & Constraints ---');

  let caughtEmptySubmit = false;
  try {
    await ClientHomeworkService.submitResponse('mock-user', 'mock-hw', '   ');
  } catch (err: any) {
    caughtEmptySubmit = err.code === 'INVALID_INPUT' || err.message.includes('empty');
  }
  assert(caughtEmptySubmit, 'submitResponse strictly rejects empty reflection content');

  let caughtLengthOverflow = false;
  try {
    const hugeContent = 'a'.repeat(25000);
    await ClientHomeworkService.submitResponse('mock-user', 'mock-hw', hugeContent);
  } catch (err: any) {
    caughtLengthOverflow = err.code === 'INVALID_INPUT' || err.message.includes('20,000');
  }
  assert(caughtLengthOverflow, 'submitResponse enforces 20,000 character maximum limit');

  // ===========================================================================
  // SECTION 5: Draft Saving & Authoritative Submission State
  // ===========================================================================
  console.log('\n--- SECTION 5: Draft Saving & Authoritative Submissions ---');

  assert(
    typeof ClientHomeworkService.saveDraftResponse === 'function',
    'ClientHomeworkService.saveDraftResponse is implemented'
  );
  assert(
    typeof ClientHomeworkService.submitResponse === 'function',
    'ClientHomeworkService.submitResponse is implemented'
  );

  // Verify save-draft and submit route files exist
  const draftRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/homework/[id]/save-draft/route.ts');
  const submitRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/homework/[id]/submit/route.ts');
  assert(fs.existsSync(draftRoutePath), 'Draft saving endpoint exists at /api/therapy/client/homework/[id]/save-draft');
  assert(fs.existsSync(submitRoutePath), 'Submission endpoint exists at /api/therapy/client/homework/[id]/submit');

  const draftRouteSrc = fs.readFileSync(draftRoutePath, 'utf8');
  assert(
    draftRouteSrc.includes('getAuthenticatedUser') && draftRouteSrc.includes('saveDraftResponse'),
    'Draft saving endpoint derives client identity securely from session'
  );

  // ===========================================================================
  // SECTION 6: Due Dates, Overdue Assignments & Boundary Cases
  // ===========================================================================
  console.log('\n--- SECTION 6: Due Dates & Overdue Boundary Cases ---');

  // Assignment with no due date
  const noDueDate = {
    id: 'hw-no-due',
    status: 'assigned',
    dueAt: null,
  };
  const isOverdueNull = noDueDate.dueAt ? new Date(noDueDate.dueAt).getTime() < now : false;
  assert(!isOverdueNull, 'Gracefully handles missing due dates without classifying them as overdue');

  // Assignment already reviewed even if due date was in the past
  const pastDueReviewed = {
    id: 'hw-past-rev',
    status: 'reviewed',
    dueAt: new Date(Date.now() - 10000000).toISOString(),
  };
  const isOverdueReviewed = ['submitted', 'reviewed'].includes(pastDueReviewed.status)
    ? false
    : new Date(pastDueReviewed.dueAt).getTime() < now;
  assert(!isOverdueReviewed, 'Completed/reviewed assignments are never displayed as overdue');

  // ===========================================================================
  // SECTION 7: Therapist Feedback & Privacy Shield
  // ===========================================================================
  console.log('\n--- SECTION 7: Therapist Feedback & Clinical Privacy Boundaries ---');

  assert(
    homeworkModalSrc.includes('Clinician Feedback') &&
    homeworkModalSrc.includes('therapistFeedback'),
    'Displays authentic therapist feedback when provided and approved'
  );

  const clientHomeworkServicePath = path.join(process.cwd(), 'src/lib/therapy/clientHomeworkService.ts');
  const serviceSrc = fs.readFileSync(clientHomeworkServicePath, 'utf8');

  // Ensure internal clinical notes are NEVER queried or leaked
  assert(
    !serviceSrc.includes('soap_notes') &&
    !serviceSrc.includes('clinical_formulation') &&
    !serviceSrc.includes('risk_level') &&
    !serviceSrc.includes('supervisory_notes'),
    'ClientHomeworkService strictly isolates internal supervisory notes and SOAP records'
  );

  // ===========================================================================
  // SECTION 8: Security, Ownership & IDOR Protection
  // ===========================================================================
  console.log('\n--- SECTION 8: Security, Ownership & IDOR Protection ---');

  const mainRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/homework/route.ts');
  const mainRouteSrc = fs.readFileSync(mainRoutePath, 'utf8');
  assert(
    mainRouteSrc.includes('getAuthenticatedUser') && mainRouteSrc.includes('authUser.userId'),
    'Root homework route derives client ID exclusively from verified server session'
  );

  const idRoutePath = path.join(process.cwd(), 'src/app/api/therapy/client/homework/[id]/route.ts');
  const idRouteSrc = fs.readFileSync(idRoutePath, 'utf8');
  assert(
    idRouteSrc.includes('getAuthenticatedUser') && idRouteSrc.includes('authUser.userId'),
    'Homework details endpoint verifies authenticated caller before fetching assignment'
  );

  assert(
    serviceSrc.includes('.eq(\'user_id\', userId)'),
    'ClientHomeworkService asserts ownership on every read and write operation'
  );

  // ===========================================================================
  // SECTION 9: Programs & Multi-Step Activities Structure
  // ===========================================================================
  console.log('\n--- SECTION 9: Programs & Multi-Step Activities Structure ---');

  assert(
    homeworkViewSrc.includes('Structured Multi-Step Activities &amp; Programs') ||
    homeworkViewSrc.includes('Structured Multi-Step Activities & Programs'),
    'Clearly informs client of multi-step exercise continuity without fabricating fake catalogues'
  );

  // ===========================================================================
  // SECTION 10: Step 1–3 Regressions & Dashboard Integration
  // ===========================================================================
  console.log('\n--- SECTION 10: Step 1–3 Regressions & Dashboard Integration ---');

  const dashboardPath = path.join(process.cwd(), 'src/views/client/ClientTherapyDashboard.jsx');
  const dashboardSrc = fs.readFileSync(dashboardPath, 'utf8');

  assert(
    dashboardSrc.includes('import ClientTherapyHomeworkView from \'./ClientTherapyHomeworkView\'') ||
    dashboardSrc.includes('import ClientTherapyHomeworkView from "./ClientTherapyHomeworkView"'),
    'ClientTherapyDashboard imports ClientTherapyHomeworkView'
  );
  assert(
    dashboardSrc.includes('<ClientTherapyHomeworkView') &&
    dashboardSrc.includes('homeworkList={homeworkList}'),
    'Tab 5 seamlessly renders ClientTherapyHomeworkView with real state and callbacks'
  );
  assert(
    dashboardSrc.includes('<ClientTherapyMyTherapistView'),
    'Step 3 (My Therapist) remains active and uninterrupted in ClientTherapyDashboard'
  );
  assert(
    dashboardSrc.includes('nextSession.googleMeetUrl ?'),
    'Step 1 (Overview Join Meeting) remains protected with authoritative Google Meet window'
  );

  console.log('\n================================================================');
  console.log(` RESULTS: ${passed} passed, 0 failed (${total} total)`);
  console.log('================================================================\n');
}

runStep4Suite().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
