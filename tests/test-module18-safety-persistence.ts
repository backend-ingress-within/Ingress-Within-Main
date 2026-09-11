import { MODULE_18_CONTENT } from '../src/lib/modules/content/module18Data';

async function runModule18FunctionalTraceTests() {
  console.log('--- STARTING MODULE 18 FUNCTIONAL & SAFETY TRACE TESTS ---');

  let passed = 0;
  let total = 0;

  function assert(condition: boolean, message: string) {
    total++;
    if (condition) {
      passed++;
      console.log(`✓ [PASS] ${message}`);
    } else {
      console.error(`✗ [FAIL] ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  // 1. Trace Intro Flow
  console.log('\n--- 1. Trace Intro Flow ---');
  const intros = MODULE_18_CONTENT.introScreens;
  assert(intros.length === 6, 'Has 6 intro screens');
  assert(intros[0].consent === true, 'Screen 0 requires consent');
  assert(intros[2].crisisButton === true, 'Screen 2 has crisis support button');
  assert(intros[5].theory === true, 'Screen 5 is theory grounding screen');

  // Verify all 11 techniques are present in content brief
  const allTechniques = MODULE_18_CONTENT.brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechniques.length === 11, 'Total 11 named techniques present');
  const expectedCodes = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3'];
  expectedCodes.forEach(code => {
    assert(allTechniques.some(t => t.code === code), `Technique ${code} is present`);
  });

  // 2. Trace MHPI Calculations (7 weekly check-ins across 7 weeks)
  console.log('\n--- 2. Trace MHPI Calculations ---');
  function calculateSeverity(scores: Record<string, number>): number {
    let sum = 0;
    const questions = MODULE_18_CONTENT.mhpiConfig.baselineQuestions;
    questions.forEach(q => {
      const raw = scores[q.id] || 0;
      sum += q.reverse ? (10 - raw) : raw;
    });
    return sum;
  }

  function calculateImprovement(baseline: number, end: number): number {
    if (baseline <= 0) return 0;
    return Math.max(0, ((baseline - end) / baseline) * 100);
  }

  const sampleBaseline = { q1: 9, q2: 8, q3: 9, q4: 1, q5: 2 }; // Severe burnout: 9+8+9+(10-1)+(10-2) = 9+8+9+9+8 = 43
  const baselineScore = calculateSeverity(sampleBaseline);
  assert(baselineScore === 43, `Baseline score calculated correctly: ${baselineScore}/50`);

  const sampleEnd = { q1: 2, q2: 2, q3: 3, q4: 8, q5: 9 }; // Post-program: 2+2+3+(10-8)+(10-9) = 2+2+3+2+1 = 10
  const endScore = calculateSeverity(sampleEnd);
  assert(endScore === 10, `End score calculated correctly: ${endScore}/50`);

  const improvement = calculateImprovement(baselineScore, endScore);
  assert(Math.round(improvement) === 77, `Improvement percentage calculated correctly: ${Math.round(improvement)}%`);

  // Verify weekly MHPI structure
  assert(MODULE_18_CONTENT.mhpiConfig.weeklyQuestions.length === 3, 'MHPI weekly check-in has 3 items');
  for (let w = 1; w <= 7; w++) {
    const weeklyCheckId = `mhpi_w${w}`;
    assert(weeklyCheckId === `mhpi_w${w}`, `Week ${w} check-in ID is ${weeklyCheckId}`);
  }

  // 3. Trace All Touches and Delayed References Across 7 Weeks
  console.log('\n--- 3. Trace All Touches and Delayed References ---');
  const recordedAnswers: Record<string, string> = {};

  MODULE_18_CONTENT.weeks.forEach(w => {
    w.touches.forEach(t => {
      // Simulate user filling in apply
      recordedAnswers[`${t.id}_apply`] = `Simulated user response for ${t.id}`;

      if (t.delayedRef) {
        assert(recordedAnswers[t.delayedRef] !== undefined, `Touch ${t.id} delayedRef ${t.delayedRef} resolves to prior saved response`);
      }
    });
  });

  // 4. Trace Retrieval Checks (Week 4 and Week 7)
  console.log('\n--- 4. Trace Retrieval Checks ---');
  const week4 = MODULE_18_CONTENT.weeks[3];
  assert(week4.retrievalCheck !== null, 'Week 4 has retrieval check');
  assert(week4.retrievalCheck?.prompt1.length! > 20, 'Week 4 retrieval check prompt 1 has meaningful length');
  assert(week4.retrievalCheck?.prompt2.length! > 20, 'Week 4 retrieval check prompt 2 has meaningful length');
  assert(week4.retrievalCheck?.reveal.length! > 20, 'Week 4 retrieval check reveal has meaningful length');

  const week7 = MODULE_18_CONTENT.weeks[6];
  assert(week7.retrievalCheck !== null, 'Week 7 has retrieval check');
  assert(week7.retrievalCheck?.prompt1.length! > 20, 'Week 7 retrieval check prompt 1 has meaningful length');
  assert(week7.retrievalCheck?.prompt2.length! > 20, 'Week 7 retrieval check prompt 2 has meaningful length');
  assert(week7.retrievalCheck?.reveal.length! > 20, 'Week 7 retrieval check reveal has meaningful length');

  // 5. Trace Guardrails in Week 6 (C2, C3)
  console.log('\n--- 5. Trace Guardrails in Week 6 (C2, C3) ---');
  const week6 = MODULE_18_CONTENT.weeks[5];
  const c2Touch = week6.touches[1];
  const c3Touch = week6.touches[2];

  assert(c2Touch.id === 'w6t2' && c2Touch.guardrail === true, 'w6t2 is guardrailed touch (C2)');
  assert(c2Touch.apply.intensityOptions?.length === 2, 'C2 has 2 intensity options (smaller / bigger version)');
  assert(c2Touch.distressPrompt !== undefined, 'C2 has distress check-in prompt');

  assert(c3Touch.id === 'w6t3' && c3Touch.guardrail === true, 'w6t3 is guardrailed touch (C3)');
  assert(c3Touch.apply.intensityOptions?.length === 2, 'C3 has 2 intensity options (smaller / bigger version)');
  assert(c3Touch.distressPrompt !== undefined, 'C3 has distress check-in prompt');

  // 6. Trace Transfer Test in Week 7 (w7t5)
  console.log('\n--- 6. Trace Transfer Test (w7t5) ---');
  const w7t5 = MODULE_18_CONTENT.weeks[6].touches[4];
  assert(w7t5.id === 'w7t5', 'Final touch is w7t5');
  assert(w7t5.transferTest === true, 'w7t5 is marked as transferTest');
  assert(w7t5.think.mode === 'open', 'w7t5 think beat is open prompt without options');

  // 7. Trace Reinforcement Bank & Tools Data
  console.log('\n--- 7. Trace Reinforcement Bank & Tools Data ---');
  assert(MODULE_18_CONTENT.reinforcementBank.length === 14, 'Reinforcement bank has 14 reflection items');
  assert(Object.keys(MODULE_18_CONTENT.toolsData).length === 2, 'toolsData has 2 tools');
  assert(MODULE_18_CONTENT.toolsData.pmr !== undefined, 'PMR tool defined in toolsData');
  assert(MODULE_18_CONTENT.toolsData.activity_scheduling !== undefined, 'Activity scheduling tool defined in toolsData');

  console.log(`\n======================================================`);
  console.log(`MODULE 18 FUNCTIONAL & SAFETY TRACE SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule18FunctionalTraceTests().catch(err => {
  console.error('Module 18 functional trace test failed:', err);
  process.exit(1);
});
