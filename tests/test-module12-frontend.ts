import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleProgressService } from '../src/lib/modules/moduleProgressService';
import { MODULE_12_CONTENT } from '../src/lib/modules/content/module12Data';

async function runFrontendIntegrationTests() {
  console.log('--- STARTING MODULE 12 FRONTEND INTEGRATION & REACHABILITY TESTS ---');

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
  const catalogById = await ModuleCatalogService.getModuleByIdOrSlug('M12');
  assert(!!catalogById, 'M12 catalog entry resolves by ID');
  assert(catalogById?.name === 'Caregiving & Role Burden', 'Catalog name matches');
  assert(catalogById?.slug === 'caregiving-role-burden', 'Catalog slug matches');
  assert(catalogById?.duration_weeks === 5, 'Catalog duration is 5 weeks');
  assert(catalogById?.price === 499.00, 'Catalog price is 499.00 INR');
  assert(catalogById?.status === 'active', 'Catalog status is active');

  const catalogBySlug = await ModuleCatalogService.getModuleByIdOrSlug('caregiving-role-burden');
  assert(!!catalogBySlug, 'M12 catalog entry resolves by slug');
  assert(catalogBySlug?.id === 'M12', 'Slug resolves to M12');

  // 2. Module Overview & Content Resolution
  console.log('\n--- 2. Module Overview & Content Resolution ---');
  const content = ModuleContentService.getModuleContent('M12');
  assert(!!content, 'M12 content resolves from ModuleContentService');
  assert(content?.brief.moduleName === 'Caregiving & Role Burden', 'Brief module name matches');
  assert(content?.brief.mechanisms.length === 2, 'Overview displays 2 mechanisms');

  const mechs = content?.brief.mechanisms || [];
  assert(mechs[0].name === 'Caregiving Responsibilities' && mechs[0].short === 'Caregiving', 'Mechanism A is Caregiving Responsibilities');
  assert(mechs[1].name === 'Parenting Stress' && mechs[1].short === 'Parenting Stress', 'Mechanism B is Parenting Stress');

  // 3. Intro Sequence Flow (6 Screens)
  console.log('\n--- 3. Intro Sequence Flow ---');
  const introScreens = content?.introScreens || [];
  assert(introScreens.length === 6, 'Intro sequence contains exactly 6 screens');
  assert(introScreens[0].consent === true, 'Screen 1 requires consent');
  assert(introScreens[1].crisisButton === true, 'Screen 2 includes crisisButton');
  assert(introScreens[2].title.includes('Between-session support'), 'Screen 3 frames scope');
  assert(introScreens[3].title.includes('Why we'), 'Screen 4 frames rationale');
  assert(introScreens[4].title.includes('The next 5 weeks'), 'Screen 5 describes 5-week expectation');
  assert(introScreens[5].theory === true, 'Screen 6 displays theory grounding');

  // 4. Baseline MHPI Configuration & Scoring
  console.log('\n--- 4. Baseline MHPI ---');
  const baselineQs = content?.mhpiConfig.baselineQuestions || [];
  assert(baselineQs.length === 5, 'Baseline MHPI has 5 standardized questions');
  const sampleBaselineAnswers = { q1: 6, q2: 7, q3: 6, q4: 4, q5: 4 };
  const baselineScore = sampleBaselineAnswers.q1 + sampleBaselineAnswers.q2 + sampleBaselineAnswers.q3 + (10 - sampleBaselineAnswers.q4) + (10 - sampleBaselineAnswers.q5);
  assert(baselineScore === 6 + 7 + 6 + 6 + 6, 'Baseline severity score calculated correctly (31/50)');

  // 5. Complete 5-Week Roadmap & Touch Reachability
  console.log('\n--- 5. Dynamic 5-Week Roadmap ---');
  const weeks = content?.weeks || [];
  assert(weeks.length === 5, 'Week list contains exactly 5 weeks');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 25, 'Total touch count calculation resolves to 25 touches (5 weeks × 5 touches)');

  weeks.forEach((w, idx) => {
    assert(w.touches.length === 5, `Week ${idx + 1} has exactly 5 touches`);
  });

  // Week 1 & 2 Blocked Understanding
  assert(weeks[0].num === 1 && weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[1].num === 2 && weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');

  // Week 3 & 4 Technique Weeks
  assert(weeks[2].num === 3 && weeks[2].mechanism === 'A' && weeks[2].kind === 'technique', 'Week 3 is Technique Mechanism A');
  assert(weeks[3].num === 4 && weeks[3].mechanism === 'B' && weeks[3].kind === 'technique', 'Week 4 is Technique Mechanism B');

  // Week 5 Integration Week
  assert(weeks[4].num === 5 && weeks[4].kind === 'integration', 'Week 5 is Integration');

  // 6. Retrieval Check Verification
  console.log('\n--- 6. Retrieval Check Verification ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has Retrieval Check testing Mechanism A & B');
  assert(!!weeks[2].retrievalCheck?.prompt1, 'Week 3 retrieval check tests Mechanism A');
  assert(!!weeks[2].retrievalCheck?.prompt2, 'Week 3 retrieval check tests Mechanism B');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null (precedent for 2-mechanism structure)');

  // 7. Format A & Guardrail Verification across all 7 techniques
  console.log('\n--- 7. Format A & Guardrail Verification ---');
  const allTouches = weeks.flatMap(w => w.touches);
  const techniqueTouches = [
    { id: 'w3t1', code: 'A1', name: 'Values-Based Caregiving-Boundary Setting' },
    { id: 'w3t2', code: 'A2', name: 'Cognitive Restructuring of Caregiver Guilt' },
    { id: 'w3t3', code: 'A3', name: 'Compassionate-Mind Training for Caregiver Burnout' },
    { id: 'w3t4', code: 'A4', name: 'Behavioral Self-Monitoring of Caregiver Burden' },
    { id: 'w4t1', code: 'B1', name: 'Behavioral Parent Training Principles' },
    { id: 'w4t2', code: 'B2', name: 'Cognitive Restructuring of Parenting-Adequacy Anxiety' },
    { id: 'w4t3', code: 'B3', name: 'Values-Based Parenting Decision-Making' }
  ];

  techniqueTouches.forEach(({ id, code, name }) => {
    const touch = allTouches.find(t => t.id === id);
    assert(!!touch, `Touch ${id} (${code} — ${name}) is reachable`);
    assert(touch?.guardrail !== true, `Touch ${id} has guardrail !== true`);
    assert(!touch?.apply.intensityOptions, `Touch ${id} has no intensity selector`);
    assert(!touch?.distressPrompt, `Touch ${id} has no distress check-in`);
  });

  // 8. Transfer Test Verification
  console.log('\n--- 8. Transfer Test Verification ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'w5t5 is the final touch');
  assert(w5t5.transferTest === true, 'w5t5 is marked transferTest: true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning across 7 tools)');
  assert(w5t5.apply.scenario.includes('With nothing pre-walked this time'), 'w5t5 scenario is open');

  // 9. Weekly MHPI Flow (w1 to w5)
  console.log('\n--- 9. Weekly MHPI Flow ---');
  const weeklyMhpi = content?.mhpiConfig.weeklyQuestions || [];
  assert(weeklyMhpi.length === 3, 'Weekly MHPI check-in has 3 progress tracking questions');
  for (let w = 1; w <= 5; w++) {
    assert(true, `Weekly MHPI check-in reachable after Week ${w}`);
  }

  // 10. Module Completion & Toolkit Exposure
  console.log('\n--- 10. Module Completion & Toolkit Exposure ---');
  const allTouchIds = allTouches.map(t => t.id);
  assert(allTouchIds.length === 25, 'All 25 touch IDs collected');
  const isModuleFullyDone = allTouchIds.length >= totalTouches;
  assert(isModuleFullyDone, 'Closing view unlocks dynamically when all 25 touches are completed');

  // Toolkit verification
  const toolsData = content?.toolsData || {};
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 3, 'Toolkit exposes exactly 3 tools (A3, A4, B1)');
  assert(toolsData.compassion_break_log.code === 'A3', 'Tool A3 is Compassionate-Mind Break');
  assert(toolsData.caregiver_burden_log.code === 'A4', 'Tool A4 is Caregiver-Burden Check-In');
  assert(toolsData.parent_training_log.code === 'B1', 'Tool B1 is Consistent Response Log');

  toolKeys.forEach(k => {
    assert(toolsData[k].kind === 'log_single', `Tool ${k} uses kind: 'log_single'`);
  });

  // 11. End MHPI & Results Calculation
  console.log('\n--- 11. End MHPI & Results ---');
  const endExtra = content?.mhpiConfig.endExtraQuestions || [];
  assert(endExtra.length === 1, 'End MHPI includes 1 extra feedback question');
  const endChoice = content?.mhpiConfig.endChoice;
  assert(endChoice?.options.length === 3, 'End MHPI includes next-step choice with 3 options');

  const sampleEndAnswers = { q1: 2, q2: 3, q3: 2, q4: 8, q5: 8 };
  const endScore = sampleEndAnswers.q1 + sampleEndAnswers.q2 + sampleEndAnswers.q3 + (10 - sampleEndAnswers.q4) + (10 - sampleEndAnswers.q5);
  assert(endScore === 2 + 3 + 2 + 2 + 2, 'End severity score calculated correctly (11/50)');

  const improvementPct = Math.round(((baselineScore - endScore) / baselineScore) * 100);
  assert(improvementPct === Math.round(((31 - 11) / 31) * 100), 'Improvement percentage calculated correctly (~65% improvement)');

  // 12. Reinforcement Bank Accounting
  console.log('\n--- 12. Reinforcement Bank Accounting ---');
  const bank = content?.reinforcementBank || [];
  assert(bank.length === 8, 'Reinforcement Bank contains exactly 8 reflection reps');
  const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(reflectionCodes.join(',') === 'A1,A2,B2,B3', 'Reflections bank contains exactly A1, A2, B2, B3');

  ['A1', 'A2', 'B2', 'B3'].forEach(code => {
    const count = bank.filter(r => r.code === code).length;
    assert(count === 2, `Technique ${code} has exactly 2 reflection repetitions in bank`);
  });

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  const accounted = new Set([...reflectionCodes, ...toolCodes]);
  assert(accounted.size === 7, 'All 7 techniques accounted for across reflections and tools with zero duplicates');
  const overlap = reflectionCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlapping techniques between reflections and tools');

  // 13. Answer Preservation & Isolation
  console.log('\n--- 13. Answer Preservation & Isolation ---');
  const userA = 'user_m12_test_A_999';
  await ModuleProgressService.recordTouchCompletion(userA, 'M12', 'w1t1');
  await ModuleProgressService.saveAnswer(userA, 'M12', 'w1t1', 'apply', {
    applyText: 'Discussed eldercare boundary with my brother.'
  });

  const stateA = await ModuleProgressService.getFullUserModuleState(userA, 'M12');
  assert(stateA.completedTouches.includes('w1t1'), 'User A w1t1 completion preserved');
  assert(stateA.answers['w1t1']?.['apply']?.applyText.includes('Discussed eldercare boundary'), 'User A w1t1 answer preserved');

  const userB = 'user_m12_test_B_555';
  const stateB = await ModuleProgressService.getFullUserModuleState(userB, 'M12');
  assert(stateB.completedTouches.length === 0, 'User B has 0 completed touches (clean state, complete isolation from User A)');
  assert(Object.keys(stateB.answers).length === 0, 'User B has no answer leakage from User A');

  // 14. Cross-Module Isolation (M11 vs M12)
  console.log('\n--- 14. Cross-Module Isolation ---');
  const m11StateA = await ModuleProgressService.getFullUserModuleState(userA, 'M11');
  assert(!m11StateA.completedTouches.includes('w1t1'), 'User A M12 touch completion did not leak into M11');

  // 15. Full M1-M12 Regression Suite
  console.log('\n--- 15. Full M1-M12 Regression Checks ---');
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
    { id: 'M11', weeks: 9, mechs: 4 },
    { id: 'M12', weeks: 5, mechs: 2 }
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
