import { MODULE_17_CONTENT } from '../src/lib/modules/content/module17Data';
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

// Simulated Safety Classifier based on Module 17 escalationConfig
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
    'going to kill myself'
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Tier 2 functional collapse / severe hopelessness / coercion or lack of consent
  const tier2Patterns = [
    'completely hopeless and unable to function',
    'can barely manage my daily responsibilities',
    'forced into physical intimacy',
    'forced me',
    'threatened me',
    'forced to do things without consent',
    'non-consensual',
    'threatened me if i refuse intimacy',
    'not allowed to say no to sex',
    'coerced me',
    'feel unsafe and trapped'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runModule17ContentTests() {
  console.log('--- STARTING MODULE 17 CONTENT FOUNDATION VALIDATION TESTS ---');

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
  assert(MODULE_17_CONTENT.moduleId === 'M17', 'moduleId is M17');
  assert(MODULE_17_CONTENT.slug === 'communication-intimacy', 'slug is communication-intimacy');
  assert(MODULE_17_CONTENT.name === 'Communication & Intimacy', 'name is Communication & Intimacy');
  assert(MODULE_17_CONTENT.duration_weeks === 5, 'duration_weeks is 5');
  assert((MODULE_17_CONTENT.tier || '').includes('Core'), 'tier includes Core');
  assert((MODULE_17_CONTENT.tier || '').includes('349'), 'tier includes 349 rupees');
  assert((MODULE_17_CONTENT.tier || '').includes('Relationships'), 'domain is Relationships');

  // B. BRIEF Completeness
  console.log('\n--- B. BRIEF Completeness ---');
  const brief = MODULE_17_CONTENT.brief;
  assert(brief.moduleName === 'Communication & Intimacy', 'BRIEF moduleName present');
  assert(brief.moduleNumber === 17, 'BRIEF moduleNumber is 17');
  assert(!!brief.tier, 'BRIEF tier present');
  assert(!!brief.scenarioSource, 'BRIEF scenarioSource present');
  assert(Array.isArray(brief.mechanisms) && brief.mechanisms.length === 2, 'BRIEF mechanisms array has 2 mechanisms');
  assert(!!brief.escalation && !!brief.escalation.tier1 && !!brief.escalation.tier2, 'BRIEF escalation present');

  // C. Mechanisms & Techniques
  console.log('\n--- C. Mechanisms & Techniques ---');
  const mechA = brief.mechanisms[0];
  const mechB = brief.mechanisms[1];

  assert(mechA.key === 'A' && mechA.name === 'Communication Difficulties', 'Mechanism A is Communication Difficulties');
  assert(mechA.need === 'Connection', 'Mechanism A need is Connection');
  assert(mechA.contrast.who === 'Aparna', 'Mechanism A contrast character is Aparna');
  assert(mechA.techniques.length === 4, 'Mechanism A has 4 techniques');

  const expectedTechA = ['A1', 'A2', 'A3', 'A4'];
  mechA.techniques.forEach((t, i) => {
    assert(t.code === expectedTechA[i], `Mechanism A technique ${i+1} code is ${expectedTechA[i]}`);
    assert(t.format === 'A', `Mechanism A technique ${t.code} is format A`);
    assert(!!t.name && !!t.source && !!t.what && !!t.how && !!t.why, `Technique ${t.code} has all required fields`);
  });

  assert(mechB.key === 'B' && mechB.name === 'Intimacy & Sexual Concerns', 'Mechanism B is Intimacy & Sexual Concerns');
  assert(mechB.need === 'Connection, Safety', 'Mechanism B need is Connection, Safety');
  assert(mechB.contrast.who === 'Sonali', 'Mechanism B contrast character is Sonali');
  assert(mechB.techniques.length === 4, 'Mechanism B has 4 techniques (2 practicable + 2 reference-only)');

  const tB1 = mechB.techniques.find(t => t.code === 'B1');
  const tB2 = mechB.techniques.find(t => t.code === 'B2');
  const tB3 = mechB.techniques.find(t => t.code === 'B3');
  const tB4 = mechB.techniques.find(t => t.code === 'B4');

  assert(tB1 !== undefined && tB1.format === 'B' && tB1.guardrail === true, 'B1 is format B with guardrail: true (Somatic Experiencing)');
  assert(tB2 !== undefined && tB2.format === 'A', 'B2 is format A (CBT)');
  assert(tB3 !== undefined && tB3.format === 'C' && !!tB3.professionalNote, 'B3 is format C reference-only with professionalNote (Sensate-Focus)');
  assert(tB4 !== undefined && tB4.format === 'C' && !!tB4.professionalNote, 'B4 is format C reference-only with professionalNote (EFT)');

  // D. Intro Screens
  console.log('\n--- D. Intro Screens ---');
  assert(MODULE_17_CONTENT.introScreens.length === 6, 'introScreens has 6 screens');
  assert(MODULE_17_CONTENT.introScreens[0].consent === true, 'Intro screen 1 has consent: true');
  assert(MODULE_17_CONTENT.introScreens[2].crisisButton === true, 'Intro screen 3 has crisisButton: true');
  assert(MODULE_17_CONTENT.introScreens[5].theory === true, 'Intro screen 6 has theory: true');

  // E. 5-Week Structure & Touches Integrity
  console.log('\n--- E. 5-Week Structure & Touches Integrity ---');
  const weeks = MODULE_17_CONTENT.weeks;
  assert(weeks.length === 5, 'Exactly 5 weeks defined');

  assert(weeks[0].num === 1 && weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked' && weeks[0].retrievalCheck === null, 'Week 1 is blocked Mechanism A');
  assert(weeks[1].num === 2 && weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked' && weeks[1].retrievalCheck === null, 'Week 2 is blocked Mechanism B');
  assert(weeks[2].num === 3 && weeks[2].mechanism === 'A' && weeks[2].kind === 'technique' && !!weeks[2].retrievalCheck, 'Week 3 is technique Mechanism A with retrievalCheck');
  assert(weeks[3].num === 4 && weeks[3].mechanism === 'B' && weeks[3].kind === 'technique' && weeks[3].hasReferenceCard === true, 'Week 4 is technique Mechanism B with hasReferenceCard: true');
  assert(weeks[4].num === 5 && weeks[4].mechanism === 'both' && weeks[4].kind === 'integration', 'Week 5 is integration for both mechanisms');

  // Validate retrieval check in Week 3
  const rc = weeks[2].retrievalCheck;
  assert(!!rc && !!rc.prompt1 && !!rc.prompt2 && !!rc.reveal, 'Week 3 retrieval check has prompt1, prompt2, and reveal');
  assert(rc!.prompt1.includes('communication-difficulties'), 'Retrieval prompt1 covers communication difficulties');
  assert(rc!.prompt2.includes('intimacy and sexual concerns'), 'Retrieval prompt2 covers intimacy and sexual concerns');

  // Validate touches count and fields
  const allTouchIds = new Set<string>();
  const allTouches = weeks.flatMap(w => w.touches);
  assert(allTouches.length === 25, 'Total touch count is 25 (5 weeks × 5 touches)');

  weeks.forEach((w, wIdx) => {
    assert(w.touches.length === 5, `Week ${wIdx+1} has exactly 5 touches`);
    w.touches.forEach(t => {
      assert(!allTouchIds.has(t.id), `Touch ID ${t.id} is unique`);
      allTouchIds.add(t.id);
      assert(!!t.id && !!t.title && !!t.role, `Touch ${t.id} has id, title, role`);
      assert(!!t.relate && Array.isArray(t.relate.text) && t.relate.text.length > 0, `Touch ${t.id} has relate text`);
      assert(!!t.think && (t.think.mode === 'tap' || t.think.mode === 'open'), `Touch ${t.id} has valid think mode`);
      assert(!!t.apply && typeof t.apply.scenario === 'string' && typeof t.apply.prompt === 'string', `Touch ${t.id} has apply`);
      assert(!!t.reveal && typeof t.reveal.text === 'string', `Touch ${t.id} has reveal`);
      assert(!!t.remember && typeof t.remember.prompt === 'string', `Touch ${t.id} has remember`);

      // Verify delayedRef points to a valid prior touch
      if (t.delayedRef) {
        const refTouchId = t.delayedRef.replace('_apply', '');
        assert(allTouchIds.has(refTouchId) || refTouchId === t.id, `Touch ${t.id} delayedRef ${t.delayedRef} resolves to existing touch`);
      }
    });
  });

  // Validate Week 4 Touch 1 Guardrail (B1)
  const w4t1 = weeks[3].touches[0];
  assert(w4t1.id === 'w4t1', 'Week 4 touch 1 is w4t1');
  assert(w4t1.guardrail === true, 'w4t1 has guardrail: true');
  assert(!!w4t1.distressPrompt, 'w4t1 has distressPrompt');
  assert(!!w4t1.apply.intensityPrompt, 'w4t1 has apply.intensityPrompt');
  assert(Array.isArray(w4t1.apply.intensityOptions) && w4t1.apply.intensityOptions.length === 2, 'w4t1 has 2 intensity options');

  // Validate Week 4 Touch 3 Bridge naming B3 and B4
  const w4t3 = weeks[3].touches[2];
  assert(w4t3.id === 'w4t3', 'Week 4 touch 3 is w4t3');
  const bridgeText = w4t3.relate.text.join(' ');
  assert(bridgeText.includes('sensate-focus') && bridgeText.includes('EFT'), 'w4t3 bridge specifically names sensate-focus and EFT reference techniques');

  // Validate Week 5 Touch 5 Transfer Test
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'Week 5 touch 5 is w5t5');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest: true (unscaffolded)');

  // F. Reinforcement Bank
  console.log('\n--- F. Reinforcement Bank ---');
  const bank = MODULE_17_CONTENT.reinforcementBank;
  assert(bank.length === 10, 'Reinforcement Bank has exactly 10 repetitions (5 techniques × 2 reps)');

  const expectedReps = [
    { code: 'A1', rep: 1 }, { code: 'A1', rep: 2 },
    { code: 'A2', rep: 1 }, { code: 'A2', rep: 2 },
    { code: 'A3', rep: 1 }, { code: 'A3', rep: 2 },
    { code: 'A4', rep: 1 }, { code: 'A4', rep: 2 },
    { code: 'B2', rep: 1 }, { code: 'B2', rep: 2 }
  ];

  expectedReps.forEach(exp => {
    const found = bank.find(r => r.code === exp.code && r.rep === exp.rep);
    assert(found !== undefined, `Reinforcement Bank contains ${exp.code} rep ${exp.rep}`);
    assert(found?.type === 'reflection', `${exp.code} rep ${exp.rep} is reflection type`);
    assert(!!found?.scenario && !!found?.prompt && !!found?.reveal, `${exp.code} rep ${exp.rep} has scenario, prompt, reveal`);
  });

  // Verify B1 (guardrail) and B3, B4 (reference-only) are NOT in the bank
  assert(!bank.some(r => r.code === 'B1'), 'B1 (guardrailed) is NOT in Reinforcement Bank');
  assert(!bank.some(r => r.code === 'B3'), 'B3 (reference-only) is NOT in Reinforcement Bank');
  assert(!bank.some(r => r.code === 'B4'), 'B4 (reference-only) is NOT in Reinforcement Bank');

  // ToolsData must be empty object
  assert(Object.keys(MODULE_17_CONTENT.toolsData).length === 0, 'toolsData is empty (Module 17 intentionally has no tools)');

  // G. MHPI Configuration
  console.log('\n--- G. MHPI Configuration ---');
  const mhpi = MODULE_17_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI has 5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI has 3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI has 1 end extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // H. Escalation & Safety Configuration
  console.log('\n--- H. Escalation & Safety Configuration ---');
  const esc = MODULE_17_CONTENT.escalationConfig;
  assert(!!esc.tier1 && esc.tier1.includes('self-harm'), 'Escalation Tier 1 covers self-harm / suicide intent');
  assert(!!esc.tier2 && esc.tier2.includes('non-consensual activity') && esc.tier2.includes('coercion'), 'Escalation Tier 2 explicitly distinguishes coercion / lack of consent');
  assert(esc.tier1FallbackWords.length >= 5, 'tier1FallbackWords has at least 5 words');
  assert(esc.tier2FallbackWords.length >= 5, 'tier2FallbackWords has at least 5 words');

  // Test Classifier Logic
  assert(classifySafetyText('I am planning to end my life tonight') === 'TIER1', 'Classifier flags acute suicide intent as TIER1');
  assert(classifySafetyText('My partner forced me into intimacy and threatened me') === 'TIER2', 'Classifier flags coercion / non-consensual intimacy as TIER2');
  assert(classifySafetyText('I feel awkward discussing sexual preferences with my partner') === 'NONE', 'Ordinary consensual intimacy discomfort classified as NONE');
  assert(classifySafetyText('I avoided telling my partner that their comment bothered me') === 'NONE', 'Ordinary communication difficulty classified as NONE');

  // I. Content Safety Scan
  console.log('\n--- I. Content Safety Scan ---');
  const fullContentStr = JSON.stringify(MODULE_17_CONTENT);
  const explicitKeywords = ['graphic sex', 'erotic act', 'sexual positions', 'explicit anatomy'];
  explicitKeywords.forEach(kw => {
    assert(!fullContentStr.toLowerCase().includes(kw), `Content does not contain explicit phrase: "${kw}"`);
  });

  // J. Regression Check for M1-M16
  console.log('\n--- J. Regression Check for M1-M16 Content ---');
  const allModules = [
    MODULE_1_CONTENT, MODULE_2_CONTENT, MODULE_3_CONTENT, MODULE_4_CONTENT,
    MODULE_5_CONTENT, MODULE_6_CONTENT, MODULE_7_CONTENT, MODULE_8_CONTENT,
    MODULE_9_CONTENT, MODULE_10_CONTENT, MODULE_11_CONTENT, MODULE_12_CONTENT,
    MODULE_13_CONTENT, MODULE_14_CONTENT, MODULE_15_CONTENT, MODULE_16_CONTENT
  ];

  allModules.forEach((m, idx) => {
    assert(m.moduleId === `M${idx+1}`, `Module ${idx+1} ID is M${idx+1}`);
    assert(m.weeks.length >= 2, `Module ${idx+1} has valid weeks structure`);
  });

  console.log(`\n======================================================`);
  console.log(`MODULE 17 CONTENT TEST SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule17ContentTests().catch(err => {
  console.error('Module 17 content test failed:', err);
  process.exit(1);
});
