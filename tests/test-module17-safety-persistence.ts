import { MODULE_17_CONTENT } from '../src/lib/modules/content/module17Data';

async function runModule17FunctionalTraceTests() {
  console.log('--- STARTING MODULE 17 FUNCTIONAL & SAFETY TRACE TESTS ---');

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
  const intros = MODULE_17_CONTENT.introScreens;
  assert(intros.length === 6, 'Has 6 intro screens');
  assert(intros[0].consent === true, 'Screen 0 requires consent');
  assert(intros[2].crisisButton === true, 'Screen 2 has crisis support button');
  assert(intros[5].theory === true, 'Screen 5 is theory grounding screen');

  // Verify all 8 techniques are present in content brief
  const allTechniques = MODULE_17_CONTENT.brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechniques.length === 8, 'Total 8 named techniques present');
  const expectedCodes = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3', 'B4'];
  expectedCodes.forEach(code => {
    assert(allTechniques.some(t => t.code === code), `Technique ${code} is present`);
  });

  // 2. Trace MHPI Calculations
  console.log('\n--- 2. Trace MHPI Calculations ---');
  function calculateSeverity(scores: Record<string, number>): number {
    let sum = 0;
    const questions = MODULE_17_CONTENT.mhpiConfig.baselineQuestions;
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

  const sampleBaseline = { q1: 8, q2: 7, q3: 8, q4: 2, q5: 3 }; // High severity: 8+7+8+(10-2)+(10-3) = 8+7+8+8+7 = 38
  const baselineScore = calculateSeverity(sampleBaseline);
  assert(baselineScore === 38, `Baseline score calculated correctly: ${baselineScore}/50`);

  const sampleEnd = { q1: 3, q2: 2, q3: 2, q4: 8, q5: 8 }; // Low severity: 3+2+2+(10-8)+(10-8) = 3+2+2+2+2 = 11
  const endScore = calculateSeverity(sampleEnd);
  assert(endScore === 11, `End score calculated correctly: ${endScore}/50`);

  const improvement = calculateImprovement(baselineScore, endScore);
  assert(Math.round(improvement) === 71, `Improvement percentage calculated correctly: ${Math.round(improvement)}%`);

  // 3. Trace All Touches and Delayed References
  console.log('\n--- 3. Trace All Touches and Delayed References ---');
  const recordedAnswers: Record<string, string> = {};

  MODULE_17_CONTENT.weeks.forEach(w => {
    w.touches.forEach(t => {
      // Simulate user filling in apply
      recordedAnswers[`${t.id}_apply`] = `Simulated user response for ${t.id}`;

      if (t.delayedRef) {
        assert(recordedAnswers[t.delayedRef] !== undefined, `Touch ${t.id} delayedRef ${t.delayedRef} resolves to prior saved response`);
      }
    });
  });

  // 4. Trace Retrieval Check
  console.log('\n--- 4. Trace Retrieval Check ---');
  const week3 = MODULE_17_CONTENT.weeks[2];
  assert(week3.retrievalCheck !== null, 'Week 3 has retrieval check');
  assert(week3.retrievalCheck?.prompt1.length! > 20, 'Retrieval check prompt 1 has meaningful length');
  assert(week3.retrievalCheck?.prompt2.length! > 20, 'Retrieval check prompt 2 has meaningful length');
  assert(week3.retrievalCheck?.reveal.length! > 20, 'Retrieval check reveal has meaningful length');

  // 5. Trace Guardrail & Reference Cards
  console.log('\n--- 5. Trace Guardrail & Reference Cards ---');
  const week4 = MODULE_17_CONTENT.weeks[3];
  assert(week4.hasReferenceCard === true, 'Week 4 has hasReferenceCard: true');

  const b1Touch = week4.touches[0];
  assert(b1Touch.guardrail === true, 'B1 touch has guardrail: true');
  assert(b1Touch.apply.intensityOptions?.length === 2, 'B1 has 2 intensity options (smaller / bigger version)');

  const bridgeTouch = week4.touches[2];
  assert(bridgeTouch.role.toLowerCase().includes('bridge'), 'w4t3 is bridge touch');
  const refB3 = MODULE_17_CONTENT.brief.mechanisms[1].techniques.find(t => t.code === 'B3');
  const refB4 = MODULE_17_CONTENT.brief.mechanisms[1].techniques.find(t => t.code === 'B4');
  assert(refB3?.format === 'C' && refB3.professionalNote !== undefined, 'B3 is reference-only with professionalNote');
  assert(refB4?.format === 'C' && refB4.professionalNote !== undefined, 'B4 is reference-only with professionalNote');

  // 6. Trace Transfer Test
  console.log('\n--- 6. Trace Transfer Test ---');
  const week5 = MODULE_17_CONTENT.weeks[4];
  const finalTouch = week5.touches[4];
  assert(finalTouch.id === 'w5t5', 'Final touch is w5t5');
  assert(finalTouch.transferTest === true, 'Final touch has transferTest: true');
  assert(finalTouch.think.mode === 'open', 'Transfer test has open think mode (unscaffolded)');

  // 7. Trace Reinforcement Bank
  console.log('\n--- 7. Trace Reinforcement Bank ---');
  const bank = MODULE_17_CONTENT.reinforcementBank;
  assert(bank.length === 10, 'Bank contains 10 items');
  const countsByCode: Record<string, number> = {};
  bank.forEach(r => {
    countsByCode[r.code] = (countsByCode[r.code] || 0) + 1;
    assert(r.type === 'reflection', 'All bank items are reflection type');
  });

  assert(countsByCode['A1'] === 2, 'A1 has 2 reps');
  assert(countsByCode['A2'] === 2, 'A2 has 2 reps');
  assert(countsByCode['A3'] === 2, 'A3 has 2 reps');
  assert(countsByCode['A4'] === 2, 'A4 has 2 reps');
  assert(countsByCode['B2'] === 2, 'B2 has 2 reps');
  assert(countsByCode['B1'] === undefined, 'B1 has 0 reps');
  assert(countsByCode['B3'] === undefined, 'B3 has 0 reps');
  assert(countsByCode['B4'] === undefined, 'B4 has 0 reps');

  console.log(`\n======================================================`);
  console.log(`MODULE 17 FUNCTIONAL TRACE SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule17FunctionalTraceTests().catch(err => {
  console.error('Functional trace test failed:', err);
  process.exit(1);
});
