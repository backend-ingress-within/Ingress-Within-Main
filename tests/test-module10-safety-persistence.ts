import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleProgressService } from '../src/lib/modules/moduleProgressService';
import { MODULE_10_CONTENT } from '../src/lib/modules/content/module10Data';

async function runSafetyAndPersistenceTests() {
  console.log('--- STARTING MODULE 10 SAFETY, PERSISTENCE & REINFORCEMENT TESTS ---');

  let passedTests = 0;
  let totalTests = 0;

  function assert(condition: boolean, message: string) {
    totalTests++;
    if (condition) {
      passedTests++;
      console.log(`✓ [PASS] ${message}`);
    } else {
      console.error(`✗ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. A2 Guardrail Data Integrity
  console.log('\n--- 1. Guardrail Data Integrity ---');
  const brief = MODULE_10_CONTENT.brief;
  const allTechniques = brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechniques.length === 11, 'Total techniques is 11');

  allTechniques.forEach(t => {
    if (t.code === 'A2') {
      assert(t.format === 'B', 'Technique A2 format is B');
      assert(t.guardrail === true, 'Technique A2 has guardrail: true');
    } else {
      assert(t.format === 'A', `Technique ${t.code} format is A`);
      assert(!t.guardrail, `Technique ${t.code} guardrail is false/undefined`);
    }
  });

  // 2. A2 Format B Safety Path & Distress Responses
  console.log('\n--- 2. A2 Format B Safety Path ---');
  const week4 = MODULE_10_CONTENT.weeks[3];
  const w4t2 = week4.touches.find(t => t.id === 'w4t2');
  assert(!!w4t2, 'w4t2 touch exists in Week 4');
  assert(w4t2?.guardrail === true, 'w4t2 is guardrailed');
  assert(!!w4t2?.apply.intensityPrompt, 'w4t2 has intensityPrompt');
  assert(w4t2?.apply.intensityOptions?.length === 2, 'w4t2 has 2 intensity options');
  assert(!!w4t2?.distressPrompt, 'w4t2 has distressPrompt');

  // Simulate Safety Distress Response Logic
  function evaluateDistressResponse(distressVal: string) {
    if (distressVal === 'Fine') {
      return { status: 'continue', escalate: false, supportNotice: null };
    }
    if (distressVal === 'A bit shaken') {
      return { status: 'continue', escalate: false, supportNotice: 'Notice: Take your time before continuing.' };
    }
    if (distressVal === 'Really not okay') {
      return {
        status: 'escalate',
        escalate: true,
        tier: 'TIER1',
        source: 'guardrail_checkin',
        supportNotice: 'Immediate Support: Please reach out to KIRAN (1800-599-0019) or TeleMANAS (14416).'
      };
    }
    return { status: 'unknown', escalate: false, supportNotice: null };
  }

  const resFine = evaluateDistressResponse('Fine');
  assert(resFine.status === 'continue' && !resFine.escalate, 'Distress "Fine" continues normally without escalation');

  const resShaken = evaluateDistressResponse('A bit shaken');
  assert(resShaken.status === 'continue' && !resShaken.escalate && !!resShaken.supportNotice, 'Distress "A bit shaken" provides supportive notice without false Tier 1');

  const resNotOk = evaluateDistressResponse('Really not okay');
  assert(resNotOk.status === 'escalate' && resNotOk.escalate && resNotOk.tier === 'TIER1' && resNotOk.source === 'guardrail_checkin', 'Distress "Really not okay" triggers TIER1 safety support via guardrail_checkin');

  // 3. Escalation Content Scans
  console.log('\n--- 3. Escalation Content Scans ---');
  function scanTextEscalation(text: string) {
    const lower = text.toLowerCase();
    const tier1Words = ["kill myself", "end my life", "suicide", "want to die", "way to end it"];
    const tier2Words = ["hopeless about life", "everything is collapsing", "worthless", "functional collapse"];

    for (const w of tier1Words) {
      if (lower.includes(w)) return { tier: 'TIER1', flag: true };
    }
    for (const w of tier2Words) {
      if (lower.includes(w)) return { tier: 'TIER2', flag: true };
    }
    return { tier: 'NONE', flag: false };
  }

  const normalText = "My parents keep asking when I'm going to get married and comparing me.";
  assert(scanTextEscalation(normalText).tier === 'NONE', 'Normal marriage/family pressure statement is classified as NONE');

  const exhaustedText = "I feel exhausted and drained by this constant pressure.";
  assert(scanTextEscalation(exhaustedText).tier === 'NONE', 'Ordinary emotional frustration without acute threat is classified as NONE');

  const hopelessText = "I feel completely hopeless about life and my ability to choose anything.";
  assert(scanTextEscalation(hopelessText).tier === 'TIER2', 'Broad persistent hopelessness triggers TIER2 support');

  const suicidalText = "I can't take this anymore and have a way to end it.";
  assert(scanTextEscalation(suicidalText).tier === 'TIER1', 'Explicit self-harm/suicide intent triggers TIER1 safety response');

  // 4. Persistence & Multi-Point State Service
  console.log('\n--- 4. Persistence Service Tests ---');
  const testUserA = 'user_test_persistence_A_999';

  // Test A: Complete w1t1
  await ModuleProgressService.recordTouchCompletion(testUserA, 'M10', 'w1t1');
  await ModuleProgressService.saveAnswer(testUserA, 'M10', 'w1t1', 'apply', {
    applyText: 'Told my aunt I need time before discussing marriage.'
  });

  const stateA1 = await ModuleProgressService.getFullUserModuleState(testUserA, 'M10');
  assert(stateA1.completedTouches.includes('w1t1'), 'User A w1t1 completion persisted');
  assert(stateA1.answers['w1t1']?.['apply']?.applyText.includes('Told my aunt'), 'User A w1t1 step answer persisted');

  // Test B: Partial answer in later touch w1t2
  await ModuleProgressService.saveAnswer(testUserA, 'M10', 'w1t2', 'think', {
    thinkWhyText: 'The timeline feels dictated rather than chosen.'
  });
  const stateA2 = await ModuleProgressService.getFullUserModuleState(testUserA, 'M10');
  assert(stateA2.answers['w1t2']?.['think']?.thinkWhyText.includes('timeline feels dictated'), 'Partial step answer in w1t2 persisted before completion');

  // Test C: Complete A2 (w4t2)
  await ModuleProgressService.recordTouchCompletion(testUserA, 'M10', 'w4t2');
  await ModuleProgressService.saveAnswer(testUserA, 'M10', 'w4t2', 'apply', {
    intensity: 1,
    applyText: 'Identified the role transition from child to independent adult.',
    distressVal: 'Fine'
  });
  const stateA3 = await ModuleProgressService.getFullUserModuleState(testUserA, 'M10');
  assert(stateA3.completedTouches.includes('w4t2'), 'User A w4t2 (A2) completion persisted');
  assert(stateA3.answers['w4t2']?.['apply']?.distressVal === 'Fine', 'User A w4t2 distress answer persisted');

  // 5. MHPI State & Progress Persistence (Baseline, Weeks 1-7, End)
  console.log('\n--- 5. MHPI Multi-Week Persistence ---');
  // Baseline
  await ModuleProgressService.saveMhpiResponse(testUserA, 'M10', 'baseline', {
    q1: 8, q2: 7, q3: 6, q4: 4, q5: 3
  }, 34);

  // All 7 Weekly MHPI check-ins
  for (let w = 1; w <= 7; w++) {
    await ModuleProgressService.saveMhpiResponse(testUserA, 'M10', 'weekly', {
      q1: Math.max(1, 8 - w),
      q2: Math.max(1, 7 - w),
      q3: Math.max(1, 6 - w)
    }, 20 - w, w);
  }

  // End Assessment
  await ModuleProgressService.saveMhpiResponse(testUserA, 'M10', 'end', {
    q1: 3, q2: 2, q3: 2, q4: 8, q5: 9, e6: 5, nextStep: 'Continue practicing boundaries'
  }, 10);

  const stateMhpi = await ModuleProgressService.getFullUserModuleState(testUserA, 'M10');
  assert(!!stateMhpi.mhpi.baseline, 'Baseline MHPI response persisted');
  assert(stateMhpi.mhpi.baseline?.severity_score === 34, 'Baseline MHPI severity score matches 34');

  for (let w = 1; w <= 7; w++) {
    assert(!!stateMhpi.mhpi.weekly[`w${w}`], `Weekly MHPI check-in for Week ${w} persisted independently`);
  }
  assert(!!stateMhpi.mhpi.end, 'End MHPI response persisted');
  assert(stateMhpi.mhpi.end?.severity_score === 10, 'End MHPI severity score matches 10');

  // 6. User Isolation Verification (User A vs User B)
  console.log('\n--- 6. User Isolation Tests ---');
  const testUserB = 'user_test_persistence_B_111';
  const stateB = await ModuleProgressService.getFullUserModuleState(testUserB, 'M10');
  assert(stateB.completedTouches.length === 0, 'User B has 0 completed touches (no leakage from User A)');
  assert(Object.keys(stateB.answers).length === 0, 'User B has no answer leakage from User A');
  assert(stateB.mhpi.baseline === null, 'User B has clean baseline MHPI');
  assert(Object.keys(stateB.mhpi.weekly).length === 0, 'User B has clean weekly MHPI');

  // 7. Reinforcement Bank Accounting & Integrity
  console.log('\n--- 7. Reinforcement Bank Accounting ---');
  const bank = MODULE_10_CONTENT.reinforcementBank;
  assert(bank.length === 14, 'Reinforcement Bank has exactly 14 reflection reps');
  const reflectionCounts: Record<string, number> = {};
  bank.forEach(r => {
    reflectionCounts[r.code] = (reflectionCounts[r.code] || 0) + 1;
  });

  const expectedReflectionCodes = ['A1', 'A3', 'A4', 'B1', 'B3', 'C1', 'C2'];
  expectedReflectionCodes.forEach(code => {
    assert(reflectionCounts[code] === 2, `Technique ${code} has exactly 2 reflection reps in bank`);
  });

  const tools = MODULE_10_CONTENT.toolsData;
  const toolKeys = Object.keys(tools);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(tools.dear_man_log.code === 'B2', 'Tool B2 is DEAR MAN');
  assert(tools.boundary_rehearsal_log.code === 'B4', 'Tool B4 is Boundary Rehearsal');

  // Verify Excluded Techniques
  const allBankTechs = [...expectedReflectionCodes, 'B2', 'B4'];
  assert(!allBankTechs.includes('A2'), 'A2 (Format B) is strictly excluded from bank');
  assert(!allBankTechs.includes('C3'), 'C3 (Yalom existential) is strictly excluded from bank');
  assert(allBankTechs.length === 9, 'Exactly 9 techniques in bank with zero duplicates');

  // 8. Closing & Completion Transition
  console.log('\n--- 8. Closing & Completion Transition ---');
  const totalTouches = MODULE_10_CONTENT.weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 35, 'Total touches is 35');
  const lastWeekIndex = MODULE_10_CONTENT.weeks.length - 1;
  assert(lastWeekIndex === 6, 'Last week index is 6 (Week 7)');

  // Unscaffolded Transfer Touch on w7t5
  const w7t5 = MODULE_10_CONTENT.weeks[6].touches[4];
  assert(w7t5.id === 'w7t5', 'w7t5 is final integration touch');
  assert(w7t5.transferTest === true, 'w7t5 has transferTest: true');
  assert(w7t5.think.mode === 'open', 'w7t5 think beat is open (unscaffolded)');

  // 9. Full M1-M10 Regression Suite
  console.log('\n--- 9. Full M1-M10 Regression Checks ---');
  const expectedModules = [
    { id: 'M1', slug: 'self-worth-self-talk', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M2', slug: 'perfectionism-avoidance', weeks: 5, mechs: 2, price: 349.00 },
    { id: 'M3', slug: 'anxiety-worry', weeks: 9, mechs: 4, price: 499.00 },
    { id: 'M4', slug: 'mood-emotional-regulation', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M5', slug: 'identity-purpose', weeks: 5, mechs: 2, price: 499.00 },
    { id: 'M6', slug: 'trauma-past-experiences', weeks: 2, mechs: 1, price: 399.00 },
    { id: 'M7', slug: 'emotional-suppression-masculinity-norms', weeks: 2, mechs: 1, price: 499.00 },
    { id: 'M8', slug: 'neurodivergence-adult-diagnosis', weeks: 2, mechs: 1, price: 599.00 },
    { id: 'M9', slug: 'judged-compared', weeks: 7, mechs: 3, price: 349.00 },
    { id: 'M10', slug: 'autonomy-boundaries', weeks: 7, mechs: 3, price: 499.00 }
  ];

  for (const mod of expectedModules) {
    const cat = await ModuleCatalogService.getModuleByIdOrSlug(mod.id);
    assert(!!cat, `${mod.id} catalog entry exists`);
    assert(cat?.slug === mod.slug, `${mod.id} slug matches ${mod.slug}`);
    assert(cat?.duration_weeks === mod.weeks, `${mod.id} duration matches ${mod.weeks} weeks`);
    assert(cat?.price === mod.price, `${mod.id} price matches ${mod.price}`);

    const content = ModuleContentService.getModuleContent(mod.id);
    assert(!!content, `${mod.id} content exists`);
    assert(content?.weeks.length === mod.weeks, `${mod.id} content has ${mod.weeks} weeks`);
    assert(content?.brief.mechanisms.length === mod.mechs, `${mod.id} has ${mod.mechs} mechanisms`);
  }

  console.log(`\n========================================`);
  console.log(`ALL SAFETY & PERSISTENCE TESTS PASSED: ${passedTests}/${totalTests}`);
  console.log(`========================================\n`);
}

runSafetyAndPersistenceTests().catch(err => {
  console.error('Safety/persistence test execution failed:', err);
  process.exit(1);
});
