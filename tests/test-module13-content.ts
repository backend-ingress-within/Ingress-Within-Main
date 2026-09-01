import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';
import { MODULE_1_CONTENT } from '../src/lib/modules/content/module1Data';
import { MODULE_2_CONTENT } from '../src/lib/modules/content/module2Data';
import { MODULE_3_CONTENT } from '../src/lib/modules/content/module3Data';
import { MODULE_4_CONTENT } from '../src/lib/modules/content/module4Data';
import { MODULE_5_CONTENT } from '../src/lib/modules/content/module5Data';
import { MODULE_6_CONTENT } from '../src/lib/modules/content/module6Data';
import { MODULE_7_CONTENT } from '../src/lib/modules/content/module7Data';
import { MODULE_8_CONTENT } from '../src/lib/modules/content/module8Data';
import { MODULE_9_CONTENT } from '../src/lib/modules/content/module9Data';
import { MODULE_10_CONTENT } from '../src/lib/modules/content/module10Data';
import { MODULE_11_CONTENT } from '../src/lib/modules/content/module11Data';
import { MODULE_12_CONTENT } from '../src/lib/modules/content/module12Data';

async function runModule13ContentTests() {
  console.log('--- STARTING MODULE 13 CONTENT FOUNDATION VALIDATION TESTS ---');

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

  // 1. Module Identity
  console.log('\n--- 1. Module Identity ---');
  assert(MODULE_13_CONTENT.moduleId === 'M13', 'moduleId is M13');
  assert(MODULE_13_CONTENT.slug === 'identity-belonging-family-acceptance', 'slug is identity-belonging-family-acceptance');
  assert(MODULE_13_CONTENT.name === 'Identity, Belonging & Family Acceptance', 'name matches prototype');
  assert(MODULE_13_CONTENT.duration_weeks === 5, 'duration_weeks is 5');
  assert((MODULE_13_CONTENT.tier || '').includes('Specialized*'), 'tier specifies Specialized* (safety-adjacent)');
  assert(MODULE_13_CONTENT.brief.moduleName === 'Identity, Belonging & Family Acceptance', 'brief.moduleName is set');
  assert(MODULE_13_CONTENT.brief.moduleNumber === 13, 'brief.moduleNumber is 13');
  assert(MODULE_13_CONTENT.brief.scenarioSource.includes('Pan-India'), 'scenarioSource specifies Pan-India context');

  // 2. Mechanisms
  console.log('\n--- 2. Mechanisms ---');
  const mechs = MODULE_13_CONTENT.brief.mechanisms;
  assert(mechs.length === 2, 'Exactly 2 mechanisms present');

  const mechA = mechs[0];
  assert(mechA.key === 'A', 'Mechanism A key is A');
  assert(mechA.name === 'Inter-Caste / Inter-Religion Family Rejection', 'Mechanism A name matches');
  assert(mechA.short === 'Family Rejection', 'Mechanism A short is Family Rejection');
  assert(mechA.contrast.who === 'Divya', 'Mechanism A contrast character is Divya');

  const mechB = mechs[1];
  assert(mechB.key === 'B', 'Mechanism B key is B');
  assert(mechB.name === 'Sexual Orientation / Gender Identity & Family Acceptance', 'Mechanism B name matches');
  assert(mechB.short === 'Identity & Family Acceptance', 'Mechanism B short is Identity & Family Acceptance');
  assert(mechB.contrast.who === 'Farah', 'Mechanism B contrast character is Farah');

  // 3. Technique Structure & Formats
  console.log('\n--- 3. Technique Structure & Formats ---');
  const techA = mechA.techniques;
  assert(techA.length === 4, 'Mechanism A has 4 techniques (3 practicable + 1 Format C)');
  assert(techA[0].code === 'A1' && techA[0].format === 'A', 'A1 is Format A');
  assert(techA[1].code === 'A2' && techA[1].format === 'A', 'A2 is Format A');
  assert(techA[2].code === 'A3' && techA[2].format === 'A', 'A3 is Format A');
  assert(techA[3].code === 'A4' && techA[3].format === 'C', 'A4 is Format C reference-only');
  assert(!!techA[3].professionalNote, 'A4 Format C has professionalNote');

  const techB = mechB.techniques;
  assert(techB.length === 4, 'Mechanism B has 4 techniques');
  assert(techB[0].code === 'B1' && techB[0].format === 'B' && techB[0].guardrail === true, 'B1 is Format B guardrailed');
  assert(techB[1].code === 'B2' && techB[1].format === 'A', 'B2 is Format A');
  assert(techB[2].code === 'B3' && techB[2].format === 'A', 'B3 is Format A');
  assert(techB[3].code === 'B4' && techB[3].format === 'A', 'B4 is Format A');

  const allPracticable = [...techA.filter(t => t.format !== 'C'), ...techB.filter(t => t.format !== 'C')];
  assert(allPracticable.length === 7, 'Exactly 7 practicable techniques (3 Format A + 3 Format A + 1 Format B)');

  // 4. Intro Sequence
  console.log('\n--- 4. Intro Sequence ---');
  const introScreens = MODULE_13_CONTENT.introScreens;
  assert(introScreens.length === 6, 'Intro sequence contains 6 screens');
  assert(introScreens[0].consent === true, 'Screen 1 has consent: true');
  assert(introScreens[2].crisisButton === true, 'Screen 3 has crisisButton: true');
  assert(introScreens[5].theory === true, 'Screen 6 has theory: true');

  // 5. Week & Touch Structure
  console.log('\n--- 5. Week & Touch Structure ---');
  const weeks = MODULE_13_CONTENT.weeks;
  assert(weeks.length === 5, 'Exactly 5 weeks in roadmap');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 25, 'Exactly 25 teaching touches in roadmap (5 × 5)');

  weeks.forEach((w, wIdx) => {
    assert(w.num === wIdx + 1, `Week ${wIdx + 1} has num ${wIdx + 1}`);
    assert(w.touches.length === 5, `Week ${wIdx + 1} has exactly 5 touches`);
    w.touches.forEach((t, tIdx) => {
      const expectedId = `w${wIdx + 1}t${tIdx + 1}`;
      assert(t.id === expectedId, `Touch has expected ID ${expectedId}`);
      assert(!!t.title, `Touch ${t.id} has title`);
      assert(!!t.role, `Touch ${t.id} has role`);
      assert(t.relate.text.length > 0, `Touch ${t.id} has relate text`);
      assert(!!t.think.prompt, `Touch ${t.id} has think prompt`);
      assert(!!t.apply.scenario && !!t.apply.prompt, `Touch ${t.id} has apply step`);
      assert(!!t.reveal.text, `Touch ${t.id} has reveal text`);
      assert(!!t.remember.prompt, `Touch ${t.id} has remember prompt`);
    });
  });

  // Week 3 reference card flag
  assert(weeks[2].hasReferenceCard === true, 'Week 3 has hasReferenceCard === true (for A4)');
  assert(!weeks[0].hasReferenceCard, 'Week 1 does not have reference card');
  assert(!weeks[1].hasReferenceCard, 'Week 2 does not have reference card');
  assert(!weeks[3].hasReferenceCard, 'Week 4 does not have reference card');
  assert(!weeks[4].hasReferenceCard, 'Week 5 does not have reference card');

  // 6. Retrieval Check Verification
  console.log('\n--- 6. Retrieval Check Verification ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has retrieval check testing A & B');
  assert(Boolean(weeks[2].retrievalCheck?.prompt1.includes('inter-caste') || weeks[2].retrievalCheck?.prompt1.includes('family rejection')), 'Week 3 retrieval check tests Mechanism A');
  assert(Boolean(weeks[2].retrievalCheck?.prompt2.includes('sexual orientation') || weeks[2].retrievalCheck?.prompt2.includes('family acceptance')), 'Week 3 retrieval check tests Mechanism B');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null (precedent for 2-mechanism structure)');

  // 7. Transfer Test
  console.log('\n--- 7. Transfer Test ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'w5t5 is the final touch');
  assert(w5t5.transferTest === true, 'w5t5 is marked transferTest: true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // 8. Delayed Reference Continuity
  console.log('\n--- 8. Delayed Reference Continuity ---');
  const allTouches = weeks.flatMap(w => w.touches);
  allTouches.forEach((t, idx) => {
    if (idx === 0) {
      assert(!t.delayedRef, `Touch ${t.id} (w1t1) has no delayedRef`);
    } else {
      assert(!!t.delayedRef, `Touch ${t.id} has delayedRef`);
      const refTouchId = (t.delayedRef || '').replace('_apply', '');
      const refExists = allTouches.some(prev => prev.id === refTouchId);
      assert(refExists, `Touch ${t.id} references existing earlier touch ${refTouchId}`);
    }
  });

  // 9. Format B Guardrail Verification (B1)
  console.log('\n--- 9. Format B Guardrail Verification (B1) ---');
  const w4t4 = allTouches.find(t => t.id === 'w4t4');
  assert(!!w4t4, 'Touch w4t4 (B1) exists');
  assert(w4t4?.guardrail === true, 'Touch w4t4 has guardrail === true');
  assert(!!w4t4?.apply.intensityPrompt, 'Touch w4t4 has intensityPrompt');
  assert(w4t4?.apply.intensityOptions?.length === 2, 'Touch w4t4 has 2 intensity options');
  assert(!!w4t4?.distressPrompt, 'Touch w4t4 has distressPrompt');

  const otherGuardrails = allTouches.filter(t => t.id !== 'w4t4' && t.guardrail === true);
  assert(otherGuardrails.length === 0, 'No other touches have guardrail === true');

  // 10. Reinforcement Bank Accounting
  console.log('\n--- 10. Reinforcement Bank Accounting ---');
  const bank = MODULE_13_CONTENT.reinforcementBank;
  assert(bank.length === 8, 'Reinforcement Bank has exactly 8 reflection reps');

  const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(reflectionCodes.join(',') === 'A1,A3,B2,B4', 'Reflections bank contains exactly A1, A3, B2, B4');

  ['A1', 'A3', 'B2', 'B4'].forEach(code => {
    const count = bank.filter(r => r.code === code).length;
    assert(count === 2, `Technique ${code} has exactly 2 reflection repetitions in bank`);
  });

  const toolsData = MODULE_13_CONTENT.toolsData;
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools (A2, B3)');
  assert(toolsData.values_clarity_log.code === 'A2', 'Tool values_clarity_log has code A2');
  assert(toolsData.disclosure_log.code === 'B3', 'Tool disclosure_log has code B3');

  toolKeys.forEach(k => {
    assert(toolsData[k].kind === 'log_single', `Tool ${k} has kind: 'log_single'`);
  });

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A2,B3', 'Tools contain exactly A2, B3');

  const accountedPracticable = new Set([...reflectionCodes, ...toolCodes]);
  assert(accountedPracticable.size === 6, '6 practicable techniques accounted for in reflections and tools');

  // Excluded techniques check
  assert(!accountedPracticable.has('A4'), 'A4 (Format C reference-only) is excluded from bank & tools');
  assert(!accountedPracticable.has('B1'), 'B1 (Format B guardrailed) is excluded from bank & tools per project rules');

  const totalTechniquesAccounted = accountedPracticable.size + 2; // 6 + A4 + B1 = 8
  assert(totalTechniquesAccounted === 8, 'All 8 techniques (7 practicable + 1 reference) accounted for with 0 duplicates');

  const overlap = reflectionCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlapping techniques between reflections and tools');

  // 11. MHPI Config
  console.log('\n--- 11. MHPI Config ---');
  const mhpi = MODULE_13_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 extra question at end');
  assert(mhpi.endChoice.options.length === 3, '3 options in endChoice');

  // 12. Safety & Escalation Configuration
  console.log('\n--- 12. Safety & Escalation Configuration ---');
  const esc = MODULE_13_CONTENT.escalationConfig;
  assert(!!esc && !!esc.tier1, 'Escalation Tier 1 definition exists');
  assert(!!esc && !!esc.tier2, 'Escalation Tier 2 definition exists');
  assert((esc?.tier2 || '').includes('physical danger') || (esc?.tier2 || '').includes('forced marriage') || (esc?.tier2 || '').includes('threats of violence'), 'Escalation configuration captures physical-safety context');
  assert(!!esc && !!esc.systemPrompt, 'Escalation system prompt exists');
  assert(!!esc && esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words exist');
  assert(!!esc && esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words exist');

  // 13. Regression Check (M1–M12)
  console.log('\n--- 13. Regression Check (M1–M12) ---');
  const allModules = [
    { mod: MODULE_1_CONTENT, id: 'M1', weeks: 7, mechs: 3 },
    { mod: MODULE_2_CONTENT, id: 'M2', weeks: 5, mechs: 2 },
    { mod: MODULE_3_CONTENT, id: 'M3', weeks: 9, mechs: 4 },
    { mod: MODULE_4_CONTENT, id: 'M4', weeks: 7, mechs: 3 },
    { mod: MODULE_5_CONTENT, id: 'M5', weeks: 5, mechs: 2 },
    { mod: MODULE_6_CONTENT, id: 'M6', weeks: 2, mechs: 1 },
    { mod: MODULE_7_CONTENT, id: 'M7', weeks: 2, mechs: 1 },
    { mod: MODULE_8_CONTENT, id: 'M8', weeks: 2, mechs: 1 },
    { mod: MODULE_9_CONTENT, id: 'M9', weeks: 7, mechs: 3 },
    { mod: MODULE_10_CONTENT, id: 'M10', weeks: 7, mechs: 3 },
    { mod: MODULE_11_CONTENT, id: 'M11', weeks: 9, mechs: 4 },
    { mod: MODULE_12_CONTENT, id: 'M12', weeks: 5, mechs: 2 },
    { mod: MODULE_13_CONTENT, id: 'M13', weeks: 5, mechs: 2 }
  ];

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId is intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 13 CONTENT TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule13ContentTests().catch(err => {
  console.error('Module 13 content test execution failed:', err);
  process.exit(1);
});
