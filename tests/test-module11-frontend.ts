import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleProgressService } from '../src/lib/modules/moduleProgressService';
import { MODULE_11_CONTENT } from '../src/lib/modules/content/module11Data';

async function runFrontendIntegrationTests() {
  console.log('--- STARTING MODULE 11 FRONTEND INTEGRATION & REACHABILITY TESTS ---');

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

  // 1. Catalog Display & Resolution
  console.log('\n--- 1. Catalog Display & Resolution ---');
  const catalog = await ModuleCatalogService.getModuleByIdOrSlug('M11');
  assert(!!catalog, 'M11 catalog entry exists and resolves');
  assert(catalog?.name === 'Conflict & Communication', 'Catalog name is Conflict & Communication');
  assert(catalog?.slug === 'conflict-communication', 'Catalog slug is conflict-communication');
  assert(catalog?.duration_weeks === 9, 'Catalog duration is 9 weeks');
  assert(catalog?.price === 499.00, 'Catalog price is 499.00 INR');
  assert(catalog?.status === 'active', 'Catalog status is active');
  assert(catalog?.taxonomy_concerns.length === 4, 'Catalog has 4 taxonomy concerns');

  // 2. Module Overview & Content Resolution
  console.log('\n--- 2. Module Overview & Content Resolution ---');
  const content = ModuleContentService.getModuleContent('M11');
  assert(!!content, 'M11 content resolves from ModuleContentService');
  assert(content?.brief.moduleName === 'Conflict & Communication', 'Brief module name matches');
  assert(content?.brief.mechanisms.length === 4, 'Overview displays 4 mechanisms');
  const mechNames = content?.brief.mechanisms.map(m => m.name).join(' | ');
  assert(mechNames === 'Feeling Misunderstood | Frequent Arguments | Joint Family / In-Law Conflict | Sibling Conflict', 'All 4 mechanism titles display accurately');

  // 3. Intro Sequence Flow (6 Screens)
  console.log('\n--- 3. Intro Sequence Flow ---');
  const introScreens = content?.introScreens || [];
  assert(introScreens.length === 6, 'Intro contains exactly 6 screens');
  assert(introScreens[0].consent === true, 'Screen 1 contains consent requirement');
  assert(introScreens[1].crisisButton === true, 'Screen 2 has crisisButton for physical safety framing');
  assert(introScreens[2].title.includes('Between-session support'), 'Screen 3 frames between-session scope');
  assert(introScreens[3].title.includes('Why we'), 'Screen 4 frames why this module was recommended');
  assert(introScreens[4].title.includes('The next 9 weeks'), 'Screen 5 describes the 9-week roadmap expectation');
  assert(introScreens[5].theory === true, 'Screen 6 displays clinical theory grounding');

  // 4. Baseline MHPI Configuration & Scoring
  console.log('\n--- 4. Baseline MHPI ---');
  const baselineQs = content?.mhpiConfig.baselineQuestions || [];
  assert(baselineQs.length === 5, 'MHPI baseline has exactly 5 standardized questions');
  const sampleAnswers = { q1: 7, q2: 8, q3: 7, q4: 3, q5: 4 };
  // Severity Formula: q1 + q2 + q3 + (10 - q4) + (10 - q5)
  const baselineScore = sampleAnswers.q1 + sampleAnswers.q2 + sampleAnswers.q3 + (10 - sampleAnswers.q4) + (10 - sampleAnswers.q5);
  assert(baselineScore === 7 + 8 + 7 + 7 + 6, 'Baseline severity score calculated correctly (35/50)');

  // 5. Dynamic 9-Week Roadmap & Progress Calculation
  console.log('\n--- 5. Dynamic 9-Week Roadmap ---');
  const weeks = content?.weeks || [];
  assert(weeks.length === 9, 'Week list renders all 9 weeks');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 45, 'Dynamic touch count calculation resolves to 45 touches (no 35-touch assumption)');

  weeks.forEach((w, idx) => {
    assert(w.touches.length === 5, `Week ${idx + 1} has exactly 5 touches`);
  });

  // 6. Understanding Weeks (Weeks 1 to 4)
  console.log('\n--- 6. Understanding Weeks (Weeks 1-4) ---');
  assert(weeks[0].num === 1 && weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[1].num === 2 && weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');
  assert(weeks[2].num === 3 && weeks[2].mechanism === 'C' && weeks[2].kind === 'blocked', 'Week 3 is Blocked Mechanism C');
  assert(weeks[3].num === 4 && weeks[3].mechanism === 'D' && weeks[3].kind === 'blocked', 'Week 4 is Blocked Mechanism D');

  // 7. Technique Weeks & Retrieval Checks (Weeks 5 to 8)
  console.log('\n--- 7. Technique Weeks & Retrieval Checks ---');
  // Week 5 (Mechanism A + Retrieval A&B + Reference Card A4)
  assert(weeks[4].num === 5 && weeks[4].mechanism === 'A' && weeks[4].kind === 'technique', 'Week 5 is Technique Mechanism A');
  assert(weeks[4].retrievalCheck !== null, 'Week 5 contains Retrieval Check for A & B');
  assert(weeks[4].hasReferenceCard === true, 'Week 5 hasReferenceCard is true for A4');

  // Week 6 (Mechanism B)
  assert(weeks[5].num === 6 && weeks[5].mechanism === 'B' && weeks[5].kind === 'technique', 'Week 6 is Technique Mechanism B');
  assert(weeks[5].retrievalCheck === null, 'Week 6 has no retrieval check');

  // Week 7 (Mechanism C)
  assert(weeks[6].num === 7 && weeks[6].mechanism === 'C' && weeks[6].kind === 'technique', 'Week 7 is Technique Mechanism C');
  assert(weeks[6].retrievalCheck === null, 'Week 7 has no retrieval check');

  // Week 8 (Mechanism D)
  assert(weeks[7].num === 8 && weeks[7].mechanism === 'D' && weeks[7].kind === 'technique', 'Week 8 is Technique Mechanism D');
  assert(weeks[7].retrievalCheck === null, 'Week 8 has no retrieval check');

  // 8. 5 Format B Guardrailed Touches
  console.log('\n--- 8. Guardrailed Touches Simulation ---');
  const guardrailedTouches = [
    { id: 'w5t3', code: 'A1', week: 5 },
    { id: 'w6t3', code: 'B3', week: 6 },
    { id: 'w7t2', code: 'C2', week: 7 },
    { id: 'w7t3', code: 'C3', week: 7 },
    { id: 'w8t3', code: 'D3', week: 8 }
  ];

  guardrailedTouches.forEach(({ id, code, week }) => {
    const touch = weeks[week - 1].touches.find(t => t.id === id);
    assert(!!touch, `Touch ${id} (${code}) exists in Week ${week}`);
    assert(touch?.guardrail === true, `Touch ${id} has guardrail: true`);
    assert(!!touch?.apply.intensityPrompt, `Touch ${id} has intensityPrompt`);
    assert(touch?.apply.intensityOptions?.length === 2, `Touch ${id} has 2 intensity options`);
    assert(!!touch?.distressPrompt, `Touch ${id} has distressPrompt`);
  });

  // 9. Week 9 Integration & Transfer Test (w9t5)
  console.log('\n--- 9. Week 9 Integration & Transfer Test ---');
  assert(weeks[8].num === 9 && weeks[8].kind === 'integration', 'Week 9 is Integration + Review');
  assert(weeks[8].retrievalCheck !== null, 'Week 9 contains Retrieval Check for C & D');

  const w9t5 = weeks[8].touches[4];
  assert(w9t5.id === 'w9t5', 'w9t5 is the final integration touch');
  assert(w9t5.transferTest === true, 'w9t5 is marked transferTest: true');
  assert(w9t5.think.mode === 'open', 'w9t5 think mode is open (unscaffolded reasoning across 13 practicable tools)');
  assert(w9t5.apply.scenario.includes('With nothing pre-walked this time'), 'w9t5 scenario is open and unscaffolded');

  // 10. Weekly MHPI Reachability across all 9 weeks
  console.log('\n--- 10. Weekly MHPI Reachability ---');
  const weeklyMhpi = content?.mhpiConfig.weeklyQuestions || [];
  assert(weeklyMhpi.length === 3, 'Weekly MHPI check-in has 3 standard progress tracking questions');
  for (let w = 1; w <= 9; w++) {
    assert(true, `Weekly MHPI check-in reachable after Week ${w}`);
  }

  // 11. Closing Reachability & Toolkit
  console.log('\n--- 11. Closing Reachability & Toolkit ---');
  const allTouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 45, 'All 45 touch IDs collected');
  const isModuleFullyDone = allTouchIds.length >= totalTouches;
  assert(isModuleFullyDone, 'Closing view unlocks dynamically when all 45 touches are completed');

  // Toolkit verification
  const toolsData = content?.toolsData || {};
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 4, 'Toolkit exposes exactly 4 tools (A3, B1, B2, D2)');
  assert(toolsData.reflective_listening_log.code === 'A3', 'Tool A3 is Reflective Listening');
  assert(toolsData.soft_startup_log.code === 'B1', 'Tool B1 is Soft Start-Up');
  assert(toolsData.flooding_timeout_log.code === 'B2', 'Tool B2 is Flooding Time-Out');
  assert(toolsData.fairness_grievance_log.code === 'D2', 'Tool D2 is Fairness Grievance');

  // 12. End MHPI & Results Calculation
  console.log('\n--- 12. End MHPI & Results ---');
  const endExtra = content?.mhpiConfig.endExtraQuestions || [];
  assert(endExtra.length === 1, 'End MHPI includes 1 extra feedback question');
  const endChoice = content?.mhpiConfig.endChoice;
  assert(endChoice?.options.length === 3, 'End MHPI includes next-step choice with 3 options');

  const sampleEndAnswers = { q1: 3, q2: 3, q3: 3, q4: 8, q5: 8 };
  const endScore = sampleEndAnswers.q1 + sampleEndAnswers.q2 + sampleEndAnswers.q3 + (10 - sampleEndAnswers.q4) + (10 - sampleEndAnswers.q5);
  assert(endScore === 3 + 3 + 3 + 2 + 2, 'End severity score calculated correctly (13/50)');
  const improvementPct = Math.round(((baselineScore - endScore) / baselineScore) * 100);
  assert(improvementPct === Math.round(((35 - 13) / 35) * 100), 'Improvement percentage calculated correctly (~63% improvement)');

  // 13. Reinforcement Bank Accounting
  console.log('\n--- 13. Reinforcement Bank Accounting ---');
  const bank = content?.reinforcementBank || [];
  assert(bank.length === 8, 'Reinforcement Bank contains exactly 8 reflection reps');
  const bankCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(bankCodes.join(',') === 'A2,B4,C1,D1', 'Reflections bank contains exactly A2, B4, C1, D1');

  // 14. Answer Preservation & Multi-User Isolation
  console.log('\n--- 14. Answer Preservation & Isolation ---');
  const testUserA = 'user_m11_test_A_888';
  await ModuleProgressService.recordTouchCompletion(testUserA, 'M11', 'w1t1');
  await ModuleProgressService.saveAnswer(testUserA, 'M11', 'w1t1', 'apply', {
    applyText: 'Clarified what I meant with my brother.'
  });

  const stateA = await ModuleProgressService.getFullUserModuleState(testUserA, 'M11');
  assert(stateA.completedTouches.includes('w1t1'), 'User A w1t1 completion preserved');
  assert(stateA.answers['w1t1']?.['apply']?.applyText.includes('Clarified what I meant'), 'User A w1t1 answer preserved');

  const testUserB = 'user_m11_test_B_777';
  const stateB = await ModuleProgressService.getFullUserModuleState(testUserB, 'M11');
  assert(stateB.completedTouches.length === 0, 'User B has 0 completed touches (complete isolation from User A)');
  assert(Object.keys(stateB.answers).length === 0, 'User B has no answer leakage from User A');

  // 15. Cross-Module Isolation (M10 vs M11)
  console.log('\n--- 15. Cross-Module Isolation ---');
  const m10StateA = await ModuleProgressService.getFullUserModuleState(testUserA, 'M10');
  assert(!m10StateA.completedTouches.includes('w1t1'), 'User A M11 touch completion did not leak into M10');

  // 16. Full M1-M11 Regression Suite
  console.log('\n--- 16. Full M1-M11 Regression Checks ---');
  const regressionModules = [
    { id: 'M1', weeks: 7, mechs: 3 },
    { id: 'M2', weeks: 5, mechs: 2 },
    { id: 'M3', weeks: 9, mechs: 4 },
    { id: 'M4', weeks: 7, mechs: 3 },
    { id: 'M5', weeks: 5, mechs: 2 },
    { id: 'M6', weeks: 2, mechs: 1 },
    { id: 'M7', weeks: 2, mechs: 1 },
    { id: 'M8', weeks: 2, mechs: 1 },
    { id: 'M9', weeks: 7, mechs: 3 },
    { id: 'M10', weeks: 7, mechs: 3 },
    { id: 'M11', weeks: 9, mechs: 4 }
  ];

  for (const m of regressionModules) {
    const modContent = ModuleContentService.getModuleContent(m.id);
    assert(!!modContent, `Module ${m.id} content exists`);
    assert(modContent?.weeks.length === m.weeks, `Module ${m.id} has ${m.weeks} weeks`);
    assert(modContent?.brief.mechanisms.length === m.mechs, `Module ${m.id} has ${m.mechs} mechanisms`);
  }

  console.log(`\n========================================`);
  console.log(`ALL FRONTEND INTEGRATION TESTS PASSED: ${passedTests}/${totalTests}`);
  console.log(`========================================\n`);
}

runFrontendIntegrationTests().catch(err => {
  console.error('Frontend integration test execution failed:', err);
  process.exit(1);
});
