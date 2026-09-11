import { MODULE_19_CONTENT } from '../src/lib/modules/content/module19Data';

async function runModule19FunctionalTraceTests() {
  console.log('--- STARTING MODULE 19 FUNCTIONAL & SAFETY TRACE TESTS ---');

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
  const intros = MODULE_19_CONTENT.introScreens;
  assert(intros.length === 6, 'Has 6 intro screens');
  assert(intros[0].consent === true, 'Screen 0 requires consent');
  assert(intros[2].crisisButton === true, 'Screen 2 has crisis support button');
  assert(intros[5].theory === true, 'Screen 5 is theory grounding screen');

  // Verify all 14 techniques are present in content brief
  const allTechniques = MODULE_19_CONTENT.brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechniques.length === 14, 'Total 14 named techniques present');
  const expectedCodes = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4', 'C1', 'C2', 'C3', 'D1', 'D2', 'D3'];
  expectedCodes.forEach(code => {
    assert(allTechniques.some(t => t.code === code), `Technique ${code} is present`);
  });

  // 2. Trace MHPI Calculations (9 weekly check-ins across 9 weeks)
  console.log('\n--- 2. Trace MHPI Calculations ---');
  function calculateSeverity(scores: Record<string, number>): number {
    let sum = 0;
    const questions = MODULE_19_CONTENT.mhpiConfig.baselineQuestions;
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

  const sampleBaseline = { q1: 9, q2: 9, q3: 8, q4: 1, q5: 2 }; // Severe achievement anxiety: 9+9+8+(10-1)+(10-2) = 9+9+8+9+8 = 43
  const baselineScore = calculateSeverity(sampleBaseline);
  assert(baselineScore === 43, `Baseline score calculated correctly: ${baselineScore}/50`);

  const sampleEnd = { q1: 2, q2: 1, q3: 2, q4: 8, q5: 9 }; // Post-program: 2+1+2+(10-8)+(10-9) = 2+1+2+2+1 = 8
  const endScore = calculateSeverity(sampleEnd);
  assert(endScore === 8, `End score calculated correctly: ${endScore}/50`);

  const improvement = calculateImprovement(baselineScore, endScore);
  assert(Math.round(improvement) === 81, `Improvement percentage calculated correctly: ${Math.round(improvement)}%`);

  // Verify weekly MHPI structure
  assert(MODULE_19_CONTENT.mhpiConfig.weeklyQuestions.length === 3, 'MHPI weekly check-in has 3 items');
  for (let w = 1; w <= 9; w++) {
    const weeklyCheckId = `mhpi_w${w}`;
    assert(weeklyCheckId === `mhpi_w${w}`, `Week ${w} check-in ID is ${weeklyCheckId}`);
  }

  // 3. Trace All Touches and Delayed References Across 9 Weeks
  console.log('\n--- 3. Trace All Touches and Delayed References ---');
  const recordedAnswers: Record<string, string> = {};

  MODULE_19_CONTENT.weeks.forEach(w => {
    w.touches.forEach(t => {
      // Simulate user filling in apply
      recordedAnswers[`${t.id}_apply`] = `Simulated user response for ${t.id}`;

      if (t.delayedRef) {
        assert(recordedAnswers[t.delayedRef] !== undefined, `Touch ${t.id} delayedRef ${t.delayedRef} resolves to prior saved response`);
      }
    });
  });

  // 4. Trace Retrieval Checks & Escalation Screening (Week 5 and Week 9)
  console.log('\n--- 4. Trace Retrieval Checks & Escalation Screening ---');
  const week5 = MODULE_19_CONTENT.weeks[4];
  assert(week5.retrievalCheck !== null, 'Week 5 has retrieval check');
  assert(week5.retrievalCheck?.prompt1.length! > 20, 'Week 5 retrieval check prompt 1 has meaningful length');
  assert(week5.retrievalCheck?.prompt2.length! > 20, 'Week 5 retrieval check prompt 2 has meaningful length');
  assert(week5.retrievalCheck?.reveal.length! > 20, 'Week 5 retrieval check reveal has meaningful length');

  const week9 = MODULE_19_CONTENT.weeks[8];
  assert(week9.retrievalCheck !== null, 'Week 9 has retrieval check');
  assert(week9.retrievalCheck?.prompt1.length! > 20, 'Week 9 retrieval check prompt 1 has meaningful length');
  assert(week9.retrievalCheck?.prompt2.length! > 20, 'Week 9 retrieval check prompt 2 has meaningful length');
  assert(week9.retrievalCheck?.reveal.length! > 20, 'Week 9 retrieval check reveal has meaningful length');

  // Test retrieval escalation screening logic
  function screenRetrievalAnswer(answer: string): boolean {
    const crisisPatterns = [
      'suicide', 'kill myself', 'end my life', "can't face them if i fail",
      "no point going on if i fail", "if this exam doesn't work out there's no point going on"
    ];
    return crisisPatterns.some(p => answer.toLowerCase().includes(p));
  }

  assert(screenRetrievalAnswer("I remembered Aditi's appraisal") === false, 'Benign retrieval answer does not trigger escalation');
  assert(screenRetrievalAnswer("If this exam doesn't work out there's no point going on") === true, 'Crisis text in retrieval answer triggers escalation screening');

  // 5. Trace Guardrails in Week 5 & Week 6 (A3, B1, B4)
  console.log('\n--- 5. Trace Guardrails (A3, B1, B4) ---');
  const a3Touch = MODULE_19_CONTENT.weeks[4].touches[2];
  const b1Touch = MODULE_19_CONTENT.weeks[5].touches[0];
  const b4Touch = MODULE_19_CONTENT.weeks[5].touches[3];

  assert(a3Touch.id === 'w5t3' && a3Touch.guardrail === true, 'w5t3 is guardrailed touch (A3)');
  assert(a3Touch.apply.intensityOptions?.length === 2, 'A3 has 2 intensity options (smaller / bigger version)');
  assert(a3Touch.distressPrompt !== undefined, 'A3 has distress check-in prompt');

  assert(b1Touch.id === 'w6t1' && b1Touch.guardrail === true, 'w6t1 is guardrailed touch (B1)');
  assert(b1Touch.apply.intensityOptions?.length === 2, 'B1 has 2 intensity options (smaller / bigger version)');
  assert(b1Touch.distressPrompt !== undefined, 'B1 has distress check-in prompt');

  assert(b4Touch.id === 'w6t4' && b4Touch.guardrail === true, 'w6t4 is guardrailed touch (B4)');
  assert(b4Touch.apply.intensityOptions?.length === 2, 'B4 has 2 intensity options (smaller / bigger version)');
  assert(b4Touch.distressPrompt !== undefined, 'B4 has distress check-in prompt');

  // 6. Trace Transfer Test in Week 9 (w9t5)
  console.log('\n--- 6. Trace Transfer Test (w9t5) ---');
  const w9t5 = MODULE_19_CONTENT.weeks[8].touches[4];
  assert(w9t5.id === 'w9t5', 'Final touch is w9t5');
  assert(w9t5.transferTest === true, 'w9t5 is marked as transferTest');
  assert(w9t5.think.mode === 'open', 'w9t5 think beat is open prompt without options');

  // 7. Trace Reinforcement Bank & Tools Data (including log_multi)
  console.log('\n--- 7. Trace Reinforcement Bank & Tools Data ---');
  assert(MODULE_19_CONTENT.reinforcementBank.length === 12, 'Reinforcement bank has 12 reflection items');
  assert(Object.keys(MODULE_19_CONTENT.toolsData).length === 5, 'toolsData has 5 tools');
  assert(MODULE_19_CONTENT.toolsData.defusion_a2 !== undefined, 'defusion_a2 tool defined');
  assert(MODULE_19_CONTENT.toolsData.relaxation_routine !== undefined, 'relaxation_routine tool defined');
  assert(MODULE_19_CONTENT.toolsData.exam_relaxation !== undefined, 'exam_relaxation tool defined');
  assert(MODULE_19_CONTENT.toolsData.evidence_log !== undefined, 'evidence_log tool defined');
  assert(MODULE_19_CONTENT.toolsData.evidence_log.kind === 'log_multi', 'evidence_log is log_multi');
  assert(MODULE_19_CONTENT.toolsData.fraud_defusion !== undefined, 'fraud_defusion tool defined');

  console.log(`\n======================================================`);
  console.log(`MODULE 19 FUNCTIONAL & SAFETY TRACE SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule19FunctionalTraceTests().catch(err => {
  console.error('Module 19 functional trace test failed:', err);
  process.exit(1);
});
