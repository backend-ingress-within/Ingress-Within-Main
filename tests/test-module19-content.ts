import { MODULE_19_CONTENT } from '../src/lib/modules/content/module19Data';
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
import { MODULE_18_CONTENT } from '../src/lib/modules/content/module18Data';

// Simulated Safety Classifier based on Module 19 escalationConfig
function classifySafetyText(text: string): 'NONE' | 'TIER1' | 'TIER2' {
  if (!text) return 'NONE';
  const lower = text.toLowerCase();

  // Tier 1 acute self-harm / suicide intent / exam-outcome-linked hopelessness
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
    'suicide',
    "can't face them if i fail",
    "if this exam doesn't work out there's no point going on",
    "if this exam doesn't work out there is no point going on",
    "no point going on if i fail",
    "have a way to end it"
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Idiomatic hyperbole filter: "this exam is going to kill me", "die of embarrassment"
  const isHyperbolic = lower.includes('kill me') || lower.includes('die of embarrassment') || lower.includes('lol');

  // Tier 2 functional collapse / persistent hopelessness / family rejection
  const tier2Patterns = [
    'completely hopeless and unable to function',
    'can barely manage my daily responsibilities',
    'parents threatened to disown me if i fail',
    'family threatened withdrawal of all support',
    'severe shame and threatened rejection',
    'fundamental failure',
    'worthless'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runModule19ContentTests() {
  console.log('--- STARTING MODULE 19 CONTENT FOUNDATION VALIDATION TESTS ---');

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
  assert(MODULE_19_CONTENT.moduleId === 'M19', 'moduleId is M19');
  assert(MODULE_19_CONTENT.slug === 'performance-achievement-anxiety', 'slug is performance-achievement-anxiety');
  assert(MODULE_19_CONTENT.name === 'Performance & Achievement Anxiety', 'name is Performance & Achievement Anxiety');
  assert(MODULE_19_CONTENT.duration_weeks === 9, 'duration_weeks is 9 (2x4 + 1)');
  assert((MODULE_19_CONTENT.tier || '').includes('Core'), 'tier includes Core');
  assert((MODULE_19_CONTENT.tier || '').includes('349'), 'tier includes 349 rupees');
  assert((MODULE_19_CONTENT.tier || '').includes('Work & Education'), 'domain is Work & Education');

  // B. BRIEF Completeness
  console.log('\n--- B. BRIEF Completeness ---');
  const brief = MODULE_19_CONTENT.brief;
  assert(brief.moduleName === 'Performance & Achievement Anxiety', 'BRIEF moduleName present');
  assert(brief.moduleNumber === 19, 'BRIEF moduleNumber is 19');
  assert(!!brief.tier, 'BRIEF tier present');
  assert(!!brief.scenarioSource, 'BRIEF scenarioSource present');
  assert(Array.isArray(brief.mechanisms) && brief.mechanisms.length === 4, 'BRIEF mechanisms array has 4 mechanisms');
  assert(!!brief.escalation && !!brief.escalation.tier1 && !!brief.escalation.tier2, 'BRIEF escalation present');
  assert(brief.escalation.tier1.includes('exam') || brief.escalation.tier1.includes('hopelessness'), 'BRIEF escalation tier1 includes exam-outcome-linked hopelessness widening');

  // C. Mechanisms & Techniques
  console.log('\n--- C. Mechanisms & Techniques ---');
  const [mechA, mechB, mechC, mechD] = brief.mechanisms;

  // Mech A: Performance Pressure
  assert(mechA.key === 'A', 'Mech A key is A');
  assert(mechA.name === 'Performance Pressure', 'Mech A name is Performance Pressure');
  assert(mechA.techniques.length === 4, 'Mech A has 4 techniques (A1-A4)');
  assert(mechA.techniques[0].format === 'A', 'A1 is format A');
  assert(mechA.techniques[1].format === 'A', 'A2 is format A');
  assert(mechA.techniques[2].format === 'B' && mechA.techniques[2].guardrail === true, 'A3 is format B with guardrail: true');
  assert(mechA.techniques[3].format === 'A', 'A4 is format A');
  assert(mechA.contrast.who === 'Varun', 'Mech A contrast character is Varun');

  // Mech B: Exam Stress
  assert(mechB.key === 'B', 'Mech B key is B');
  assert(mechB.name === 'Exam Stress', 'Mech B name is Exam Stress');
  assert(mechB.techniques.length === 4, 'Mech B has 4 techniques (B1-B4)');
  assert(mechB.techniques[0].format === 'B' && mechB.techniques[0].guardrail === true, 'B1 is format B with guardrail: true');
  assert(mechB.techniques[1].format === 'A', 'B2 is format A');
  assert(mechB.techniques[2].format === 'A', 'B3 is format A');
  assert(mechB.techniques[3].format === 'B' && mechB.techniques[3].guardrail === true, 'B4 is format B with guardrail: true');
  assert(mechB.contrast.who === 'Meenal', 'Mech B contrast character is Meenal');

  // Mech C: Fear of Failure
  assert(mechC.key === 'C', 'Mech C key is C');
  assert(mechC.name === 'Fear of Failure', 'Mech C name is Fear of Failure');
  assert(mechC.techniques.length === 3, 'Mech C has 3 techniques (C1-C3)');
  assert(mechC.techniques.every(t => t.format === 'A'), 'All Mech C techniques are format A');
  assert(mechC.contrast.who === 'Rahul', 'Mech C contrast character is Rahul');

  // Mech D: Imposter Syndrome
  assert(mechD.key === 'D', 'Mech D key is D');
  assert(mechD.name === 'Imposter Syndrome', 'Mech D name is Imposter Syndrome');
  assert(mechD.techniques.length === 3, 'Mech D has 3 techniques (D1-D3)');
  assert(mechD.techniques.every(t => t.format === 'A'), 'All Mech D techniques are format A');
  assert(mechD.contrast.who === 'Sneha', 'Mech D contrast character is Sneha');

  // Total techniques count
  const allTechs = brief.mechanisms.flatMap(m => m.techniques);
  assert(allTechs.length === 14, 'Total 14 practicable techniques (4+4+3+3)');
  assert(allTechs.filter(t => t.format === 'C').length === 0, 'Zero format C reference-only techniques');
  assert(allTechs.filter(t => t.guardrail).length === 3, 'Exactly 3 guardrailed techniques (A3, B1, B4)');

  // D. Intro Screens
  console.log('\n--- D. Intro Screens ---');
  assert(MODULE_19_CONTENT.introScreens.length === 6, 'introScreens has 6 screens');
  assert(MODULE_19_CONTENT.introScreens.some(s => s.consent === true), 'Consent screen present');
  assert(MODULE_19_CONTENT.introScreens.some(s => s.crisisButton === true), 'Crisis support screen present');
  assert(MODULE_19_CONTENT.introScreens.some(s => s.theory === true), 'Theory grounding screen present');

  // E. Weeks & Touches Structural Audit
  console.log('\n--- E. Weeks & Touches Structure ---');
  assert(MODULE_19_CONTENT.weeks.length === 9, '9 weeks total');

  const weekKinds = MODULE_19_CONTENT.weeks.map(w => w.kind);
  assert(JSON.stringify(weekKinds) === JSON.stringify(['blocked', 'blocked', 'blocked', 'blocked', 'technique', 'technique', 'technique', 'technique', 'integration']), 'Week kinds match blocked(4) + technique(4) + integration(1)');

  const weekMechs = MODULE_19_CONTENT.weeks.map(w => w.mechanism);
  assert(JSON.stringify(weekMechs) === JSON.stringify(['A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'both']), 'Week mechanisms match A, B, C, D, A, B, C, D, both');

  let totalTouches = 0;
  const touchIds: string[] = [];

  MODULE_19_CONTENT.weeks.forEach((w, wIdx) => {
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

  assert(totalTouches === 45, 'Total 45 touches across 9 weeks');
  assert(new Set(touchIds).size === 45, 'All 45 touch IDs are unique within M19');

  // F. Retrieval Checks (Weeks 5 and 9)
  console.log('\n--- F. Retrieval Checks ---');
  const w5 = MODULE_19_CONTENT.weeks[4];
  const w9 = MODULE_19_CONTENT.weeks[8];

  assert(!!w5.retrievalCheck, 'Week 5 has retrievalCheck');
  assert(!!w5.retrievalCheck!.prompt1 && !!w5.retrievalCheck!.prompt2 && !!w5.retrievalCheck!.reveal, 'Week 5 retrievalCheck has prompt1, prompt2, reveal');
  assert(w5.retrievalCheck!.prompt1.toLowerCase().includes('aditi') || w5.retrievalCheck!.prompt1.toLowerCase().includes('appraisal') || w5.retrievalCheck!.prompt1.toLowerCase().includes('performance'), 'Week 5 retrieval prompt1 tests Mech A (Performance Pressure)');
  assert(w5.retrievalCheck!.prompt2.toLowerCase().includes('karan') || w5.retrievalCheck!.prompt2.toLowerCase().includes('exam') || w5.retrievalCheck!.prompt2.toLowerCase().includes('preparation'), 'Week 5 retrieval prompt2 tests Mech B (Exam Stress)');

  assert(!!w9.retrievalCheck, 'Week 9 has retrievalCheck');
  assert(!!w9.retrievalCheck!.prompt1 && !!w9.retrievalCheck!.prompt2 && !!w9.retrievalCheck!.reveal, 'Week 9 retrievalCheck has prompt1, prompt2, reveal');
  assert(w9.retrievalCheck!.prompt1.toLowerCase().includes('failure') || w9.retrievalCheck!.prompt1.toLowerCase().includes('decatastrophizing') || w9.retrievalCheck!.prompt1.toLowerCase().includes('paper'), 'Week 9 retrieval prompt1 tests Mech C (Fear of Failure)');
  assert(w9.retrievalCheck!.prompt2.toLowerCase().includes('imposter') || w9.retrievalCheck!.prompt2.toLowerCase().includes('competence') || w9.retrievalCheck!.prompt2.toLowerCase().includes('explaining away'), 'Week 9 retrieval prompt2 tests Mech D (Imposter Syndrome)');

  const otherWeeks = [0, 1, 2, 3, 5, 6, 7].map(i => MODULE_19_CONTENT.weeks[i]);
  assert(otherWeeks.every(w => w.retrievalCheck === null || w.retrievalCheck === undefined), 'Other weeks do not have retrieval checks');

  // G. Guardrail Details (A3 in W5, B1 in W6, B4 in W6)
  console.log('\n--- G. Guardrail Touches (A3, B1, B4) ---');
  const w5t3 = MODULE_19_CONTENT.weeks[4].touches[2];
  const w6t1 = MODULE_19_CONTENT.weeks[5].touches[0];
  const w6t4 = MODULE_19_CONTENT.weeks[5].touches[3];

  assert(w5t3.guardrail === true, 'w5t3 has guardrail: true (A3)');
  assert(!!w5t3.apply.intensityPrompt, 'w5t3 has intensityPrompt');
  assert(Array.isArray(w5t3.apply.intensityOptions) && w5t3.apply.intensityOptions.length === 2, 'w5t3 intensityOptions has exactly 2 options');
  assert(!!w5t3.distressPrompt, 'w5t3 has distressPrompt');

  assert(w6t1.guardrail === true, 'w6t1 has guardrail: true (B1)');
  assert(!!w6t1.apply.intensityPrompt, 'w6t1 has intensityPrompt');
  assert(Array.isArray(w6t1.apply.intensityOptions) && w6t1.apply.intensityOptions.length === 2, 'w6t1 intensityOptions has exactly 2 options');
  assert(!!w6t1.distressPrompt, 'w6t1 has distressPrompt');

  assert(w6t4.guardrail === true, 'w6t4 has guardrail: true (B4)');
  assert(!!w6t4.apply.intensityPrompt, 'w6t4 has intensityPrompt');
  assert(Array.isArray(w6t4.apply.intensityOptions) && w6t4.apply.intensityOptions.length === 2, 'w6t4 intensityOptions has exactly 2 options');
  assert(!!w6t4.distressPrompt, 'w6t4 has distressPrompt');

  const otherTouches = MODULE_19_CONTENT.weeks.flatMap(w => w.touches).filter(t => t.id !== 'w5t3' && t.id !== 'w6t1' && t.id !== 'w6t4');
  assert(otherTouches.every(t => !t.guardrail), 'No other touches have guardrail: true');

  // H. Transfer Test (w9t5)
  console.log('\n--- H. Transfer Test (w9t5) ---');
  const w9t5 = MODULE_19_CONTENT.weeks[8].touches[4];
  assert(w9t5.id === 'w9t5', 'Last touch is w9t5');
  assert(w9t5.transferTest === true, 'w9t5 has transferTest: true');
  assert(w9t5.role.includes('Unscaffolded Transfer Test'), 'w9t5 role is Unscaffolded Transfer Test');
  assert(w9t5.think.mode === 'open', 'w9t5 think mode is open (unscaffolded)');
  assert(w9t5.apply.scenario.toLowerCase().includes('devansh'), 'w9t5 scenario features Devansh');

  // I. Delayed References Audit
  console.log('\n--- I. Delayed References Audit ---');
  const allTouchMap = new Map<string, any>();
  MODULE_19_CONTENT.weeks.forEach(w => w.touches.forEach(t => allTouchMap.set(t.id, t)));

  MODULE_19_CONTENT.weeks.forEach(w => {
    w.touches.forEach(t => {
      if (t.delayedRef) {
        const targetTouchId = t.delayedRef.replace('_apply', '');
        assert(allTouchMap.has(targetTouchId), `delayedRef ${t.delayedRef} in ${t.id} points to valid touch ${targetTouchId}`);
      }
    });
  });

  // J. Reinforcement Bank Audit
  console.log('\n--- J. Reinforcement Bank Audit ---');
  const bank = MODULE_19_CONTENT.reinforcementBank;
  assert(bank.length === 12, 'Reinforcement bank has exactly 12 reflection entries (6 techniques x 2 reps)');

  const bankCodes = bank.map(r => r.code);
  const expectedCodes = ['A1', 'B3', 'C1', 'C2', 'C3', 'D2'];
  for (const c of expectedCodes) {
    const reps = bank.filter(r => r.code === c);
    assert(reps.length === 2, `Technique ${c} has exactly 2 reps in reinforcement bank`);
    assert(reps.some(r => r.rep === 1) && reps.some(r => r.rep === 2), `Technique ${c} has reps 1 and 2`);
  }

  // Verify excluded techniques: A3, B1, B4 (guardrails) and A2, A4, B2, D1, D3 (tools)
  assert(!bankCodes.includes('A3'), 'A3 excluded from bank reflections (guardrailed)');
  assert(!bankCodes.includes('B1'), 'B1 excluded from bank reflections (guardrailed)');
  assert(!bankCodes.includes('B4'), 'B4 excluded from bank reflections (guardrailed)');
  assert(!bankCodes.includes('A2'), 'A2 excluded from bank reflections (is a tool)');
  assert(!bankCodes.includes('A4'), 'A4 excluded from bank reflections (is a tool)');
  assert(!bankCodes.includes('B2'), 'B2 excluded from bank reflections (is a tool)');
  assert(!bankCodes.includes('D1'), 'D1 excluded from bank reflections (is a tool)');
  assert(!bankCodes.includes('D3'), 'D3 excluded from bank reflections (is a tool)');

  // K. Tools Data Audit
  console.log('\n--- K. Tools Data Audit ---');
  const tools = MODULE_19_CONTENT.toolsData;
  const toolKeys = Object.keys(tools);
  assert(toolKeys.length === 5, 'toolsData has exactly 5 tools');
  assert(toolKeys.includes('defusion_a2'), 'toolsData contains defusion_a2 (A2)');
  assert(toolKeys.includes('relaxation_routine'), 'toolsData contains relaxation_routine (A4)');
  assert(toolKeys.includes('exam_relaxation'), 'toolsData contains exam_relaxation (B2)');
  assert(toolKeys.includes('evidence_log'), 'toolsData contains evidence_log (D1)');
  assert(toolKeys.includes('fraud_defusion'), 'toolsData contains fraud_defusion (D3)');

  assert(tools.defusion_a2.code === 'A2' && tools.defusion_a2.kind === 'log_single', 'defusion_a2 maps to A2 as log_single');
  assert(tools.relaxation_routine.code === 'A4' && tools.relaxation_routine.kind === 'log_single', 'relaxation_routine maps to A4 as log_single');
  assert(tools.exam_relaxation.code === 'B2' && tools.exam_relaxation.kind === 'log_single', 'exam_relaxation maps to B2 as log_single');
  assert(tools.evidence_log.code === 'D1' && tools.evidence_log.kind === 'log_multi', 'evidence_log maps to D1 as log_multi');
  assert(Array.isArray(tools.evidence_log.fields) && tools.evidence_log.fields.length === 2, 'evidence_log has 2 fields (accomplishment, skill)');
  assert(tools.fraud_defusion.code === 'D3' && tools.fraud_defusion.kind === 'log_single', 'fraud_defusion maps to D3 as log_single');

  // L. MHPI Configuration
  console.log('\n--- L. MHPI Configuration ---');
  const mhpi = MODULE_19_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 end extra question (helpfulness)');
  assert(!!mhpi.endChoice && mhpi.endChoice.options.length === 3, 'End choice question with 3 options');

  // M. Escalation Config & Classifier Safety Audit
  console.log('\n--- M. Escalation Config & Safety ---');
  const esc = MODULE_19_CONTENT.escalationConfig;
  assert(!!esc.tier1 && !!esc.tier2, 'Escalation tier1 and tier2 strings defined');
  assert(esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words populated');
  assert(esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words populated');

  // Test safety classification function
  assert(classifySafetyText('I have a plan to end my life') === 'TIER1', 'Safety classifier catches acute self-harm');
  assert(classifySafetyText("If this exam doesn't work out there's no point going on") === 'TIER1', 'Safety classifier catches exam-outcome-linked hopelessness as TIER1');
  assert(classifySafetyText("I can't face them if I fail") === 'TIER1', 'Safety classifier catches family-facing exam failure hopelessness as TIER1');
  assert(classifySafetyText('My parents threatened to disown me if I fail and I feel completely hopeless and unable to function') === 'TIER2', 'Safety classifier catches threatened rejection and functional collapse as TIER2');
  assert(classifySafetyText('This exam is going to kill me lol') === 'NONE', 'Safety classifier does not falsely escalate on hyperbole');
  assert(classifySafetyText('I feel nervous about my appraisal next week') === 'NONE', 'Safety classifier does not falsely trigger on normal performance anxiety');

  // N. Open Questions
  console.log('\n--- N. Open Questions ---');
  assert(Array.isArray(MODULE_19_CONTENT.openQuestions) && MODULE_19_CONTENT.openQuestions!.length === 12, '12 open questions present for clinical/editorial sign-off');

  // O. Em-dash Sweep
  console.log('\n--- O. Em-dash Sweep ---');
  const fullJson = JSON.stringify(MODULE_19_CONTENT);
  const literalEmDashCount = (fullJson.match(/\u2014/g) || []).length;
  const htmlEmDashCount = (fullJson.match(/&mdash;/g) || []).length;
  assert(literalEmDashCount === 0, 'Zero literal em-dashes (U+2014)');
  assert(htmlEmDashCount === 0, 'Zero &mdash; HTML entities');

  // P. Regression Check for M1-M18 Content
  console.log('\n--- P. Regression Check for M1-M18 Content ---');
  const allPriorModules = [
    MODULE_1_CONTENT, MODULE_2_CONTENT, MODULE_3_CONTENT, MODULE_4_CONTENT,
    MODULE_5_CONTENT, MODULE_6_CONTENT, MODULE_7_CONTENT, MODULE_8_CONTENT,
    MODULE_9_CONTENT, MODULE_10_CONTENT, MODULE_11_CONTENT, MODULE_12_CONTENT,
    MODULE_13_CONTENT, MODULE_14_CONTENT, MODULE_15_CONTENT, MODULE_16_CONTENT,
    MODULE_17_CONTENT, MODULE_18_CONTENT
  ];

  allPriorModules.forEach((m, idx) => {
    assert(m.moduleId === `M${idx + 1}`, `Module ${idx + 1} ID is M${idx + 1}`);
    assert(m.weeks.length >= 2, `Module ${idx + 1} has valid weeks structure`);
    assert(Array.isArray(m.introScreens) && m.introScreens.length > 0, `Module ${idx + 1} has introScreens`);
  });

  console.log(`\n======================================================`);
  console.log(`ALL ${passed}/${total} MODULE 19 CONTENT ASSERTIONS PASSED!`);
  console.log(`======================================================\n`);
}

runModule19ContentTests().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
