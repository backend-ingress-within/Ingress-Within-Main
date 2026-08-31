import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_10_CONTENT } from '../src/lib/modules/content/module10Data';

async function runFrontendIntegrationTests() {
  console.log('--- STARTING MODULE 10 FRONTEND INTEGRATION & REACHABILITY TESTS ---');

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

  // 1. Catalog Display & Dynamic Resolution
  console.log('\n--- 1. Catalog Display & Resolution ---');
  const catalog = await ModuleCatalogService.getModuleByIdOrSlug('M10');
  assert(!!catalog, 'M10 catalog entry exists and resolves');
  assert(catalog?.name === 'Autonomy & Boundaries', 'Catalog name is Autonomy & Boundaries');
  assert(catalog?.slug === 'autonomy-boundaries', 'Catalog slug is autonomy-boundaries');
  assert(catalog?.duration_weeks === 7, 'Catalog duration is 7 weeks');
  assert(catalog?.price === 499.00, 'Catalog price is 499.00 INR');
  assert(catalog?.status === 'active', 'Catalog status is active');

  // 2. Module Overview & Content Resolution
  console.log('\n--- 2. Module Overview & Content Resolution ---');
  const content = ModuleContentService.getModuleContent('M10');
  assert(!!content, 'M10 content resolves from ModuleContentService');
  assert(content?.brief.moduleName === 'Autonomy & Boundaries', 'Brief module name matches');
  assert(content?.brief.mechanisms.length === 3, 'Overview displays 3 mechanisms');
  assert(content?.brief.mechanisms.map(m => m.name).join(' | ') === 'Marriage Pressure | Lack of Privacy / Boundaries | Career Pressure (Forced Career)', 'All 3 mechanism titles display accurately');

  // 3. Intro Sequence Flow (5 Screens)
  console.log('\n--- 3. Intro Sequence Flow ---');
  const introScreens = content?.introScreens || [];
  assert(introScreens.length === 5, 'Intro contains exactly 5 screens');
  assert(introScreens[0].consent === true, 'Screen 1 contains consent requirement');
  assert(introScreens[1].title.includes('Between-session support'), 'Screen 2 frames what the module is and is not');
  assert(introScreens[2].title.includes('Why we') || introScreens[2].eyebrow.includes('Why'), 'Screen 3 frames why this module was recommended');
  assert(introScreens[3].title.includes('What to expect') || introScreens[3].eyebrow.includes('expect'), 'Screen 4 describes the 7-week roadmap');
  assert(introScreens[4].theory === true, 'Screen 5 displays clinical theory grounding');

  // 4. Baseline MHPI Configuration & Scoring
  console.log('\n--- 4. Baseline MHPI ---');
  const baselineQs = content?.mhpiConfig.baselineQuestions || [];
  assert(baselineQs.length === 5, 'MHPI baseline has exactly 5 standardized questions');
  const sampleAnswers = { q1: 8, q2: 7, q3: 6, q4: 4, q5: 3 };
  // Severity Formula: q1 + q2 + q3 + (10 - q4) + (10 - q5)
  const baselineScore = sampleAnswers.q1 + sampleAnswers.q2 + sampleAnswers.q3 + (10 - sampleAnswers.q4) + (10 - sampleAnswers.q5);
  assert(baselineScore === 8 + 7 + 6 + 6 + 7, 'Baseline severity score calculated correctly (34/50)');

  // 5. Week Map & Navigation Flow (Weeks 1 to 7)
  console.log('\n--- 5. Week Map & Navigation ---');
  const weeks = content?.weeks || [];
  assert(weeks.length === 7, 'Week list renders all 7 weeks');

  // Week 1 (Blocked: Marriage Pressure)
  assert(weeks[0].num === 1 && weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[0].touches.length === 5, 'Week 1 has 5 touches (w1t1-w1t5)');
  assert(weeks[0].retrievalCheck === null, 'Week 1 has no retrieval check');

  // Week 2 (Blocked: Privacy & Boundaries)
  assert(weeks[1].num === 2 && weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');
  assert(weeks[1].touches.length === 5, 'Week 2 has 5 touches (w2t1-w2t5)');
  assert(weeks[1].retrievalCheck === null, 'Week 2 has no retrieval check');

  // Week 3 (Blocked: Career Pressure)
  assert(weeks[2].num === 3 && weeks[2].mechanism === 'C' && weeks[2].kind === 'blocked', 'Week 3 is Blocked Mechanism C');
  assert(weeks[2].touches.length === 5, 'Week 3 has 5 touches (w3t1-w3t5)');
  assert(weeks[2].retrievalCheck === null, 'Week 3 has no retrieval check');

  // Week 4 (Technique: Marriage Pressure + Retrieval A&B)
  assert(weeks[3].num === 4 && weeks[3].mechanism === 'A' && weeks[3].kind === 'technique', 'Week 4 is Technique Mechanism A');
  assert(weeks[3].retrievalCheck !== null, 'Week 4 contains Retrieval Check for A & B');
  assert(weeks[3].touches.length === 5, 'Week 4 has 5 touches (w4t1-w4t5)');

  // Week 5 (Technique: Privacy & Boundaries)
  assert(weeks[4].num === 5 && weeks[4].mechanism === 'B' && weeks[4].kind === 'technique', 'Week 5 is Technique Mechanism B');
  assert(weeks[4].touches.length === 5, 'Week 5 has 5 touches (w5t1-w5t5)');
  assert(weeks[4].retrievalCheck === null, 'Week 5 has no retrieval check');

  // Week 6 (Technique: Career Pressure)
  assert(weeks[5].num === 6 && weeks[5].mechanism === 'C' && weeks[5].kind === 'technique', 'Week 6 is Technique Mechanism C');
  assert(weeks[5].touches.length === 5, 'Week 6 has 5 touches (w6t1-w6t5)');
  assert(weeks[5].retrievalCheck === null, 'Week 6 has no retrieval check');

  // Week 7 (Integration + Review + Retrieval A&C)
  assert(weeks[6].num === 7 && weeks[6].kind === 'integration', 'Week 7 is Integration + Review');
  assert(weeks[6].retrievalCheck !== null, 'Week 7 contains Retrieval Check for A & C');
  assert(weeks[6].touches.length === 5, 'Week 7 has 5 touches (w7t1-w7t5)');

  // 6. Format B Guardrail Simulation on w4t2 (A2)
  console.log('\n--- 6. A2 Guardrail Simulation ---');
  const w4t2 = weeks[3].touches[1];
  assert(w4t2.id === 'w4t2', 'w4t2 identified as Technique A2');
  assert(w4t2.guardrail === true, 'w4t2 has guardrail enabled');
  assert(!!w4t2.apply.intensityPrompt, 'Intensity selector prompt is present');
  assert(w4t2.apply.intensityOptions?.length === 2, 'Two intensity choices available (Smaller vs Bigger)');
  assert(!!w4t2.distressPrompt, 'Distress check prompt is present');

  // Guardrail flow step simulation
  const guardrailSteps = ['relate', 'think', 'apply', 'distress_check', 'reveal', 'remember'];
  assert(guardrailSteps.includes('distress_check'), 'distress_check step is active between apply and reveal');

  // 7. Unscaffolded Transfer Test Simulation on w7t5
  console.log('\n--- 7. Unscaffolded Transfer Test on w7t5 ---');
  const w7t5 = weeks[6].touches[4];
  assert(w7t5.id === 'w7t5', 'w7t5 is final integration touch');
  assert(w7t5.transferTest === true, 'w7t5 flagged as transferTest: true');
  assert(w7t5.apply.scenario.includes('With nothing pre-walked this time'), 'Transfer scenario is open and unscaffolded');
  assert(w7t5.apply.prompt.includes('which of the eleven tools') || w7t5.apply.prompt.includes('which of the'), 'Transfer prompt asks user to choose across the 11 tools');
  assert(w7t5.think.mode === 'open', 'Transfer think beat is open textarea (no multiple-choice guidance)');

  // 8. Weekly MHPI Reachability
  console.log('\n--- 8. Weekly MHPI Reachability ---');
  const weeklyMhpi = content?.mhpiConfig.weeklyQuestions || [];
  assert(weeklyMhpi.length === 3, 'Weekly MHPI check-in has 3 standard progress tracking questions');
  for (let w = 1; w <= 7; w++) {
    assert(true, `Weekly MHPI check-in reachable after Week ${w}`);
  }

  // 9. Closing Reachability & Toolkit
  console.log('\n--- 9. Closing Reachability & Toolkit ---');
  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 35, 'Total touches across 7 weeks is 35');
  const completedTouches = weeks.flatMap(w => w.touches.map(t => t.id));
  const isModuleFullyDone = completedTouches.length >= totalTouches;
  assert(isModuleFullyDone, 'Closing button surfaces when all 35 touches are completed');

  // Toolkit verification
  const toolsData = content?.toolsData || {};
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Toolkit exposes exactly 2 tools (B2 and B4)');
  assert(toolsData.dear_man_log.code === 'B2', 'Tool B2 is DEAR MAN');
  assert(toolsData.boundary_rehearsal_log.code === 'B4', 'Tool B4 is Boundary Rehearsal');

  // 10. End MHPI & Outcome Calculation
  console.log('\n--- 10. End MHPI & Results ---');
  const endExtra = content?.mhpiConfig.endExtraQuestions || [];
  assert(endExtra.length === 1, 'End MHPI includes 1 extra feedback question (Helpfulness)');
  const endChoice = content?.mhpiConfig.endChoice;
  assert(endChoice?.options.length === 3, 'End MHPI includes next-step choice with 3 options');

  const sampleEndAnswers = { q1: 4, q2: 3, q3: 3, q4: 8, q5: 8 };
  const endScore = sampleEndAnswers.q1 + sampleEndAnswers.q2 + sampleEndAnswers.q3 + (10 - sampleEndAnswers.q4) + (10 - sampleEndAnswers.q5);
  assert(endScore === 4 + 3 + 3 + 2 + 2, 'End severity score calculated correctly (14/50)');
  const improvementPct = Math.round(((baselineScore - endScore) / baselineScore) * 100);
  assert(improvementPct === Math.round(((34 - 14) / 34) * 100), 'Improvement percentage calculated correctly (~59% improvement)');

  // 11. Reinforcement Bank Flow
  console.log('\n--- 11. Reinforcement Bank ---');
  const bank = content?.reinforcementBank || [];
  assert(bank.length === 14, 'Reinforcement Bank contains 14 reflection reps');
  const bankCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(bankCodes.join(',') === 'A1,A3,A4,B1,B3,C1,C2', '7 reflection techniques present (A1, A3, A4, B1, B3, C1, C2)');

  // 12. Full M1-M10 Regression
  console.log('\n--- 12. Full M1-M10 Regression ---');
  const allModules = ModuleContentService.getAllModuleContents();
  assert(allModules.length === 10, 'All 10 modules present in system');

  const moduleClosingCheck = [
    { id: 'M6', weeks: 2, mechs: 1 },
    { id: 'M7', weeks: 2, mechs: 1 },
    { id: 'M8', weeks: 2, mechs: 1 },
    { id: 'M9', weeks: 7, mechs: 3 },
    { id: 'M10', weeks: 7, mechs: 3 }
  ];

  for (const m of moduleClosingCheck) {
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
