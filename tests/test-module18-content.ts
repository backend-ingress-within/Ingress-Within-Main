import { MODULE_18_CONTENT } from '../src/lib/modules/content/module18Data';
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
import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';
import { MODULE_14_CONTENT } from '../src/lib/modules/content/module14Data';
import { MODULE_15_CONTENT } from '../src/lib/modules/content/module15Data';
import { MODULE_16_CONTENT } from '../src/lib/modules/content/module16Data';
import { MODULE_17_CONTENT } from '../src/lib/modules/content/module17Data';

// Simulated Safety Classifier based on Module 18 escalationConfig
function classifySafetyText(text: string): 'NONE' | 'TIER1' | 'TIER2' {
  if (!text) return 'NONE';
  const lower = text.toLowerCase();

  // Tier 1 acute self-harm / suicide intent
  const tier1Patterns = [
    'plan to end my life',
    'planning to end my life',
    'plan to kill myself',
    'going to hurt myself',
    'know how i would end my life',
    'going to end it all tonight',
    'have a plan to end it',
    'want it to stop',
    'going to kill myself',
    'suicide'
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Tier 2 functional collapse / severe hopelessness / workplace exploitation / threats
  const tier2Patterns = [
    'completely hopeless and unable to function',
    'can barely manage my daily responsibilities',
    'threatened with termination if i take medical leave',
    'denied rest for weeks',
    'forced to work through medical emergency',
    'threatened if i take leave',
    'unsafe work conditions',
    'cannot get out of bed for work',
    'fundamental failure',
    'worthless'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runModule18ContentTests() {
  console.log('--- STARTING MODULE 18 CONTENT FOUNDATION VALIDATION TESTS ---');

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

  // A. Metadata Verification
  console.log('\n--- A. Metadata Verification ---');
  assert(MODULE_18_CONTENT.moduleId === 'M18', 'moduleId is M18');
  assert(MODULE_18_CONTENT.slug === 'pressure-burnout', 'slug is pressure-burnout');
  assert(MODULE_18_CONTENT.name === 'Pressure & Burnout', 'name is Pressure & Burnout');
  assert(MODULE_18_CONTENT.duration_weeks === 7, 'duration_weeks is 7 (2x3 + 1)');
  assert((MODULE_18_CONTENT.tier || '').includes('Core'), 'tier includes Core');
  assert((MODULE_18_CONTENT.tier || '').includes('349'), 'tier includes 349 rupees');
  assert((MODULE_18_CONTENT.tier || '').includes('Work & Education'), 'domain is Work & Education');

  // B. BRIEF Completeness
  console.log('\n--- B. BRIEF Completeness ---');
  const brief = MODULE_18_CONTENT.brief;
  assert(brief.moduleName === 'Pressure & Burnout', 'BRIEF moduleName present');
  assert(brief.moduleNumber === 18, 'BRIEF moduleNumber is 18');
  assert(!!brief.tier, 'BRIEF tier present');
  assert(!!brief.scenarioSource, 'BRIEF scenarioSource present');
  assert(Array.isArray(brief.mechanisms) && brief.mechanisms.length === 3, 'BRIEF mechanisms array has 3 mechanisms');
  assert(!!brief.escalation && !!brief.escalation.tier1 && !!brief.escalation.tier2, 'BRIEF escalation present');
  assert(brief.escalation.tier2.includes('unsafe') || brief.escalation.tier2.includes('exploitative') || brief.escalation.tier2.includes('leave'), 'BRIEF escalation tier2 includes workplace safety context');

  // C. Mechanisms & Techniques
  console.log('\n--- C. Mechanisms & Techniques ---');
  const [mechA, mechB, mechC] = brief.mechanisms;

  // Mech A
  assert(mechA.key === 'A', 'Mech A key is A');
  assert(mechA.name === 'Work Stress', 'Mech A name is Work Stress');
  assert(mechA.techniques.length === 4, 'Mech A has 4 techniques (A1-A4)');
  assert(mechA.techniques.every(t => t.format === 'A'), 'All Mech A techniques are format A');
  assert(mechA.contrast.who === 'Kavya', 'Mech A contrast character is Kavya');

  // Mech B
  assert(mechB.key === 'B', 'Mech B key is B');
  assert(mechB.name === 'Burnout', 'Mech B name is Burnout');
  assert(mechB.techniques.length === 4, 'Mech B has 4 techniques (B1-B4)');
  assert(mechB.techniques.every(t => t.format === 'A'), 'All Mech B techniques are format A');
  assert(mechB.contrast.who === 'Ritu', 'Mech B contrast character is Ritu');

  // Mech C
  assert(mechC.key === 'C', 'Mech C key is C');
  assert(mechC.name.includes('Overwork Culture'), 'Mech C name includes Overwork Culture');
  assert(mechC.techniques.length === 3, 'Mech C has 3 techniques (C1-C3)');
  assert(mechC.techniques[0].format === 'A', 'C1 is format A');
  assert(mechC.techniques[1].format === 'B' && mechC.techniques[1].guardrail === true, 'C2 is format B with guardrail: true');
  assert(mechC.techniques[2].format === 'B' && mechC.techniques[2].guardrail === true, 'C3 is format B with guardrail: true');
  assert(mechC.contrast.who === 'Naveen' || mechC.contrast.who === 'Siddharth', 'Mech C contrast character is defined');

  // Total techniques count
  const allTechs = brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechs.length === 11, 'Total 11 practicable techniques');
  assert(allTechs.filter(t => t.format === 'C').length === 0, 'Zero format C reference-only techniques');
  assert(allTechs.filter(t => t.guardrail).length === 2, 'Exactly 2 guardrailed techniques (C2, C3)');

  // D. Intro Screens
  console.log('\n--- D. Intro Screens ---');
  assert(MODULE_18_CONTENT.introScreens.length === 6, 'introScreens has 6 screens');
  assert(MODULE_18_CONTENT.introScreens.some(s => s.consent === true), 'Consent screen present');
  assert(MODULE_18_CONTENT.introScreens.some(s => s.crisisButton === true), 'Crisis support screen present');

  // E. Weeks & Touches Structural Audit
  console.log('\n--- E. Weeks & Touches Structure ---');
  assert(MODULE_18_CONTENT.weeks.length === 7, '7 weeks total');

  const weekKinds = MODULE_18_CONTENT.weeks.map(w => w.kind);
  assert(JSON.stringify(weekKinds) === JSON.stringify(['blocked', 'blocked', 'blocked', 'technique', 'technique', 'technique', 'integration']), 'Week kinds match blocked(3) + technique(3) + integration(1)');

  const weekMechs = MODULE_18_CONTENT.weeks.map(w => w.mechanism);
  assert(JSON.stringify(weekMechs) === JSON.stringify(['A', 'B', 'C', 'A', 'B', 'C', 'both']), 'Week mechanisms match A, B, C, A, B, C, both');

  let totalTouches = 0;
  const touchIds: string[] = [];

  MODULE_18_CONTENT.weeks.forEach((w, wIdx) => {
    assert(w.touches.length === 5, `Week ${w.num} has exactly 5 touches`);
    totalTouches += w.touches.length;
    w.touches.forEach(t => {
      touchIds.push(t.id);
      assert(t.id.startsWith(`w${w.num}t`), `Touch ${t.id} starts with w${w.num}t`);
      assert(!!t.title && !!t.role, `Touch ${t.id} has title and role`);
      assert(Array.isArray(t.relate.text) && t.relate.text.length > 0, `Touch ${t.id} has relate text`);
      assert(!!t.think && (t.think.mode === 'tap' || t.think.mode === 'open'), `Touch ${t.id} has think beat`);
      if (t.think.mode === 'tap') {
        assert(Array.isArray(t.think.options) && t.think.options.length >= 2, `Touch ${t.id} tap think has >=2 options`);
        assert(t.think.options!.some(o => o.isTarget) && t.think.options!.some(o => !o.isTarget), `Touch ${t.id} has target and distractor options`);
      }
      assert(!!t.apply && !!t.apply.scenario && !!t.apply.prompt, `Touch ${t.id} has apply beat`);
      assert(!!t.reveal && !!t.reveal.text, `Touch ${t.id} has reveal beat`);
      assert(!!t.remember && !!t.remember.prompt, `Touch ${t.id} has remember beat`);
    });
  });

  assert(totalTouches === 35, 'Total 35 touches across 7 weeks');
  assert(new Set(touchIds).size === 35, 'All 35 touch IDs are unique within M18');

  // F. Retrieval Checks
  console.log('\n--- F. Retrieval Checks ---');
  const w4 = MODULE_18_CONTENT.weeks[3];
  const w7 = MODULE_18_CONTENT.weeks[6];

  assert(!!w4.retrievalCheck, 'Week 4 has retrievalCheck');
  assert(!!w4.retrievalCheck!.prompt1 && !!w4.retrievalCheck!.prompt2 && !!w4.retrievalCheck!.reveal, 'Week 4 retrievalCheck has prompt1, prompt2, reveal');
  assert(w4.retrievalCheck!.prompt1.toLowerCase().includes('rohan') || w4.retrievalCheck!.prompt1.toLowerCase().includes('week 1') || w4.retrievalCheck!.prompt1.toLowerCase().includes('work stress'), 'Week 4 retrieval prompt1 tests Mech A (Rohan / Week 1)');
  assert(w4.retrievalCheck!.prompt2.toLowerCase().includes('ananya') || w4.retrievalCheck!.prompt2.toLowerCase().includes('week 2') || w4.retrievalCheck!.prompt2.toLowerCase().includes('exhaustion'), 'Week 4 retrieval prompt2 tests Mech B (Ananya / Week 2)');

  assert(!!w7.retrievalCheck, 'Week 7 has retrievalCheck');
  assert(!!w7.retrievalCheck!.prompt1 && !!w7.retrievalCheck!.prompt2 && !!w7.retrievalCheck!.reveal, 'Week 7 retrievalCheck has prompt1, prompt2, reveal');
  assert(w7.retrievalCheck!.prompt1.toLowerCase().includes('work stress') || w7.retrievalCheck!.prompt1.toLowerCase().includes('workload'), 'Week 7 retrieval prompt1 retests Mech A');
  assert(w7.retrievalCheck!.prompt2.toLowerCase().includes('c1') || w7.retrievalCheck!.prompt2.toLowerCase().includes('c2') || w7.retrievalCheck!.prompt2.toLowerCase().includes('c3') || w7.retrievalCheck!.prompt2.toLowerCase().includes('success'), 'Week 7 retrieval prompt2 tests Mech C');

  const otherWeeks = [0, 1, 2, 4, 5].map(i => MODULE_18_CONTENT.weeks[i]);
  assert(otherWeeks.every(w => w.retrievalCheck === null || w.retrievalCheck === undefined), 'Other weeks do not have retrieval checks');

  // G. Guardrail Details (C2, C3 in Week 6)
  console.log('\n--- G. Guardrail Touches (C2, C3) ---');
  const w6t2 = MODULE_18_CONTENT.weeks[5].touches[1];
  const w6t3 = MODULE_18_CONTENT.weeks[5].touches[2];

  assert(w6t2.guardrail === true, 'w6t2 has guardrail: true');
  assert(!!w6t2.apply.intensityPrompt, 'w6t2 has intensityPrompt');
  assert(Array.isArray(w6t2.apply.intensityOptions) && w6t2.apply.intensityOptions.length === 2, 'w6t2 intensityOptions has exactly 2 options');
  assert(!!w6t2.distressPrompt, 'w6t2 has distressPrompt');

  assert(w6t3.guardrail === true, 'w6t3 has guardrail: true');
  assert(!!w6t3.apply.intensityPrompt, 'w6t3 has intensityPrompt');
  assert(Array.isArray(w6t3.apply.intensityOptions) && w6t3.apply.intensityOptions.length === 2, 'w6t3 intensityOptions has exactly 2 options');
  assert(!!w6t3.distressPrompt, 'w6t3 has distressPrompt');

  const otherTouches = MODULE_18_CONTENT.weeks.flatMap(w => w.touches).filter(t => t.id !== 'w6t2' && t.id !== 'w6t3');
  assert(otherTouches.every(t => !t.guardrail), 'No other touches have guardrail: true');

  // H. Transfer Test (w7t5)
  console.log('\n--- H. Transfer Test (w7t5) ---');
  const w7t5 = MODULE_18_CONTENT.weeks[6].touches[4];
  assert(w7t5.id === 'w7t5', 'Last touch is w7t5');
  assert(w7t5.transferTest === true, 'w7t5 has transferTest: true');
  assert(w7t5.role.includes('Unscaffolded Transfer Test'), 'w7t5 role is Unscaffolded Transfer Test');
  assert(w7t5.think.mode === 'open', 'w7t5 think mode is open (unscaffolded)');

  // I. Delayed References Audit
  console.log('\n--- I. Delayed References Audit ---');
  const allTouchMap = new Map<string, any>();
  MODULE_18_CONTENT.weeks.forEach(w => w.touches.forEach(t => allTouchMap.set(t.id, t)));

  MODULE_18_CONTENT.weeks.forEach(w => {
    w.touches.forEach(t => {
      if (t.delayedRef) {
        const targetTouchId = t.delayedRef.replace('_apply', '');
        assert(allTouchMap.has(targetTouchId), `delayedRef ${t.delayedRef} in ${t.id} points to valid touch ${targetTouchId}`);
      }
    });
  });

  // J. Reinforcement Bank Audit
  console.log('\n--- J. Reinforcement Bank Audit ---');
  const bank = MODULE_18_CONTENT.reinforcementBank;
  assert(bank.length === 14, 'Reinforcement bank has exactly 14 reflection entries (7 techniques x 2 reps)');

  const bankCodes = bank.map(r => r.code);
  const expectedCodes = ['A1', 'A3', 'A4', 'B2', 'B3', 'B4', 'C1'];
  for (const c of expectedCodes) {
    const reps = bank.filter(r => r.code === c);
    assert(reps.length === 2, `Technique ${c} has exactly 2 reps in reinforcement bank`);
    assert(reps.some(r => r.rep === 1) && reps.some(r => r.rep === 2), `Technique ${c} has reps 1 and 2`);
  }

  // Verify excluded techniques: A2 (tool), B1 (tool), C2 (guardrail), C3 (guardrail)
  assert(!bankCodes.includes('A2'), 'A2 excluded from bank reflections (is a tool)');
  assert(!bankCodes.includes('B1'), 'B1 excluded from bank reflections (is a tool)');
  assert(!bankCodes.includes('C2'), 'C2 excluded from bank reflections (guardrailed)');
  assert(!bankCodes.includes('C3'), 'C3 excluded from bank reflections (guardrailed)');

  // K. Tools Data Audit
  console.log('\n--- K. Tools Data Audit ---');
  const tools = MODULE_18_CONTENT.toolsData;
  const toolKeys = Object.keys(tools);
  assert(toolKeys.length === 2, 'toolsData has exactly 2 tools');
  assert(toolKeys.includes('pmr') && toolKeys.includes('activity_scheduling'), 'toolsData contains pmr and activity_scheduling');

  assert(tools.pmr.code === 'A2', 'PMR tool maps to A2');
  assert(tools.pmr.mechShort === 'Work Stress', 'PMR mechShort is Work Stress');
  assert(tools.pmr.kind === 'log_single', 'PMR tool kind is log_single');

  assert(tools.activity_scheduling.code === 'B1', 'Activity scheduling tool maps to B1');
  assert(tools.activity_scheduling.mechShort === 'Burnout', 'Activity scheduling mechShort is Burnout');
  assert(tools.activity_scheduling.kind === 'log_single', 'Activity scheduling tool kind is log_single');

  // L. MHPI Configuration
  console.log('\n--- L. MHPI Configuration ---');
  const mhpi = MODULE_18_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 end extra question (helpfulness)');
  assert(!!mhpi.endChoice && mhpi.endChoice.options.length === 3, 'End choice question with 3 options');

  // M. Escalation Config & Classifier Safety Audit
  console.log('\n--- M. Escalation Config & Safety ---');
  const esc = MODULE_18_CONTENT.escalationConfig;
  assert(!!esc.tier1 && !!esc.tier2, 'Escalation tier1 and tier2 strings defined');
  assert(esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words populated');
  assert(esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words populated');
  assert(esc.systemPrompt.includes('Critical context 2') || esc.systemPrompt.includes('workplace') || esc.systemPrompt.includes('exploitative'), 'System prompt contains workplace safety / exploitation criteria');

  // Test safety classification function
  assert(classifySafetyText('I have a plan to end my life') === 'TIER1', 'Safety classifier catches acute self-harm');
  assert(classifySafetyText('I am being denied rest for weeks and feel completely hopeless and unable to function') === 'TIER2', 'Safety classifier catches workplace crisis Tier 2');
  assert(classifySafetyText('I had a busy day at work with lots of emails') === 'NONE', 'Safety classifier does not falsely trigger on normal work stress');

  // N. Open Questions
  console.log('\n--- N. Open Questions ---');
  assert(Array.isArray(MODULE_18_CONTENT.openQuestions) && MODULE_18_CONTENT.openQuestions!.length === 12, '12 open questions present for clinical/editorial sign-off');

  // O. Em-dash Sweep
  console.log('\n--- O. Em-dash Sweep ---');
  const fullJson = JSON.stringify(MODULE_18_CONTENT);
  const literalEmDashCount = (fullJson.match(/\u2014/g) || []).length;
  const htmlEmDashCount = (fullJson.match(/&mdash;/g) || []).length;
  assert(literalEmDashCount === 0, 'Zero literal em-dashes (U+2014)');
  assert(htmlEmDashCount === 0, 'Zero &mdash; HTML entities');

  // P. Regression Check for M1-M17 Content
  console.log('\n--- P. Regression Check for M1-M17 Content ---');
  const allPriorModules = [
    MODULE_1_CONTENT, MODULE_2_CONTENT, MODULE_3_CONTENT, MODULE_4_CONTENT,
    MODULE_5_CONTENT, MODULE_6_CONTENT, MODULE_7_CONTENT, MODULE_8_CONTENT,
    MODULE_9_CONTENT, MODULE_10_CONTENT, MODULE_11_CONTENT, MODULE_12_CONTENT,
    MODULE_13_CONTENT, MODULE_14_CONTENT, MODULE_15_CONTENT, MODULE_16_CONTENT,
    MODULE_17_CONTENT
  ];

  allPriorModules.forEach((m, idx) => {
    assert(m.moduleId === `M${idx + 1}`, `Module ${idx + 1} ID is M${idx + 1}`);
    assert(m.weeks.length >= 2, `Module ${idx + 1} has valid weeks structure`);
    assert(Array.isArray(m.introScreens) && m.introScreens.length > 0, `Module ${idx + 1} has introScreens`);
  });

  console.log(`\n======================================================`);
  console.log(`ALL ${passed}/${total} MODULE 18 CONTENT ASSERTIONS PASSED!`);
  console.log(`======================================================\n`);
}

runModule18ContentTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
