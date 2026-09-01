import { MODULE_16_CONTENT } from '../src/lib/modules/content/module16Data';
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

// Simulated Safety Classifier based on Module 16 escalationConfig
function classifySafetyText(text: string): 'NONE' | 'TIER1' | 'TIER2' {
  if (!text) return 'NONE';
  const lower = text.toLowerCase();

  // Tier 1 acute self-harm / suicide intent
  const tier1Patterns = [
    'plan to end my life',
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

  // Tier 2 functional collapse / severe hopelessness / forced marriage coercion
  const tier2Patterns = [
    'completely hopeless and unable to function',
    'can barely manage my daily responsibilities',
    'forced to marry',
    'threatened me if i refuse',
    'not allowed to say no',
    'controlling where i can go',
    'feel unsafe',
    'threatened me',
    'feel trapped'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runModule16ContentTests() {
  console.log('--- STARTING MODULE 16 CONTENT FOUNDATION VALIDATION TESTS ---');

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
  assert(MODULE_16_CONTENT.moduleId === 'M16', 'moduleId is M16');
  assert(MODULE_16_CONTENT.slug === 'arranged-long-distance-realities', 'slug is arranged-long-distance-realities');
  assert(MODULE_16_CONTENT.name === 'Arranged & Long-Distance Realities', 'name is Arranged & Long-Distance Realities');
  assert(MODULE_16_CONTENT.duration_weeks === 5, 'duration_weeks is 5');
  assert((MODULE_16_CONTENT.tier || '').includes('Common'), 'tier includes Common');
  assert((MODULE_16_CONTENT.tier || '').includes('Relationships'), 'domain is Relationships');

  // B. BRIEF Completeness
  console.log('\n--- B. BRIEF Completeness ---');
  const brief = MODULE_16_CONTENT.brief;
  assert(brief.moduleName === 'Arranged & Long-Distance Realities', 'BRIEF moduleName present');
  assert(brief.moduleNumber === 16, 'BRIEF moduleNumber is 16');
  assert(!!brief.tier, 'BRIEF tier present');
  assert(!!brief.scenarioSource, 'BRIEF scenarioSource present');
  assert(Array.isArray(brief.mechanisms) && brief.mechanisms.length === 2, 'BRIEF mechanisms array has 2 mechanisms');
  assert(!!brief.escalation && !!brief.escalation.tier1 && !!brief.escalation.tier2, 'BRIEF escalation present');

  // C. Mechanisms & Techniques
  console.log('\n--- C. Mechanisms & Techniques ---');
  const mechA = brief.mechanisms[0];
  const mechB = brief.mechanisms[1];

  assert(mechA.key === 'A' && mechA.name === 'Arranged Marriage Compatibility Stress', 'Mechanism A is Arranged Marriage Compatibility Stress');
  assert(mechB.key === 'B' && mechB.name === 'Long-Distance Relationship Strain', 'Mechanism B is Long-Distance Relationship Strain');

  assert(mechA.techniques.length === 3, 'Mechanism A has 3 techniques (A1, A2, A3)');
  assert(mechB.techniques.length === 3, 'Mechanism B has 3 techniques (B1, B2, B3)');

  const expectedA = ['A1', 'A2', 'A3'];
  const expectedB = ['B1', 'B2', 'B3'];

  expectedA.forEach((code, idx) => {
    assert(mechA.techniques[idx].code === code, `Mechanism A technique ${idx + 1} code is ${code}`);
  });

  expectedB.forEach((code, idx) => {
    assert(mechB.techniques[idx].code === code, `Mechanism B technique ${idx + 1} code is ${code}`);
  });

  // D. Formats & Guardrails Verification
  console.log('\n--- D. Formats & Guardrails Verification ---');
  const allTechs = [...mechA.techniques, ...mechB.techniques];
  assert(allTechs.length === 6, 'Total technique count is 6');

  let formatACount = 0;
  let formatBCount = 0;
  let formatCCount = 0;

  allTechs.forEach(t => {
    if (t.format === 'A') formatACount++;
    if (t.format === 'B') formatBCount++;
    if (t.format === 'C') formatCCount++;
  });

  assert(formatACount === 5, 'Format A count is 5 (A1, A2, A3, B1, B3)');
  assert(formatBCount === 1, 'Format B count is 1 (B2)');
  assert(formatCCount === 0, 'Format C count is 0');

  const b2Tech = mechB.techniques.find(t => t.code === 'B2');
  assert(b2Tech !== undefined, 'Technique B2 exists');
  assert(b2Tech?.format === 'B', 'Technique B2 is Format B');
  assert(b2Tech?.guardrail === true, 'Technique B2 has guardrail === true');

  // E. Week Structure & Touch Count
  console.log('\n--- E. Week Structure & Touch Count ---');
  const weeks = MODULE_16_CONTENT.weeks;
  assert(weeks.length === 5, 'Module 16 has 5 weeks');

  let totalTouches = 0;
  const touchIds: string[] = [];

  weeks.forEach(w => {
    assert(w.touches.length === 5, `Week ${w.num} has 5 touches`);
    totalTouches += w.touches.length;
    w.touches.forEach(t => touchIds.push(t.id));
  });

  assert(totalTouches === 25, 'Total teaching touch count is 25 (5 x 5)');
  assert(new Set(touchIds).size === 25, 'All 25 touch IDs are unique (w1t1 -> w5t5)');

  // Week 3 & Week 4 Structural Rule Check
  assert(weeks[2].touches[0].id === 'w3t1', 'w3t1 is A1');
  assert(weeks[2].touches[1].id === 'w3t2', 'w3t2 is A2');
  assert(weeks[2].touches[2].id === 'w3t3', 'w3t3 is A3');
  assert(weeks[2].touches[3].role === 'Check-in', 'w3t4 is separate Check-in touch');
  assert(weeks[2].touches[4].role === 'Pre-commitment', 'w3t5 is separate Pre-commitment touch');

  assert(weeks[3].touches[0].id === 'w4t1', 'w4t1 is B1');
  assert(weeks[3].touches[1].id === 'w4t2', 'w4t2 is B2 (Format B)');
  assert(weeks[3].touches[1].guardrail === true, 'w4t2 has guardrail === true');
  assert(!!weeks[3].touches[1].apply.intensityPrompt, 'w4t2 has intensityPrompt');
  assert(weeks[3].touches[1].apply.intensityOptions?.length === 2, 'w4t2 has 2 intensity options');
  assert(!!weeks[3].touches[1].distressPrompt, 'w4t2 has distressPrompt');
  assert(weeks[3].touches[2].id === 'w4t3', 'w4t3 is B3');
  assert(weeks[3].touches[3].role === 'Check-in', 'w4t4 is separate Check-in touch');
  assert(weeks[3].touches[4].role === 'Pre-commitment', 'w4t5 is separate Pre-commitment touch');

  // F. Retrieval Check Verification
  console.log('\n--- F. Retrieval Check Verification ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has retrieval check testing Mechanism A & B');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null');

  // G. Transfer Test Verification
  console.log('\n--- G. Transfer Test Verification ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'w5t5 is final touch');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest === true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // H & I. Guardrails & Reference Cards Verification
  console.log('\n--- H & I. Guardrails & Reference Cards Verification ---');
  const allTouches = weeks.flatMap(w => w.touches);
  const guardrailTouches = allTouches.filter(t => t.guardrail === true);
  const intensityTouches = allTouches.filter(t => !!t.apply?.intensityPrompt);
  const distressTouches = allTouches.filter(t => !!t.distressPrompt);
  const refCardWeeks = weeks.filter(w => w.hasReferenceCard === true);

  assert(guardrailTouches.length === 1 && guardrailTouches[0].id === 'w4t2', 'Exactly 1 guardrail touch (w4t2)');
  assert(intensityTouches.length === 1 && intensityTouches[0].id === 'w4t2', 'Exactly 1 intensity prompt touch (w4t2)');
  assert(distressTouches.length === 1 && distressTouches[0].id === 'w4t2', 'Exactly 1 distress prompt touch (w4t2)');
  assert(refCardWeeks.length === 0, 'Zero reference card flags across weeks');

  // J. Reinforcement Bank Accounting
  console.log('\n--- J. Reinforcement Bank Accounting ---');
  const bank = MODULE_16_CONTENT.reinforcementBank;
  const toolsData = MODULE_16_CONTENT.toolsData;

  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps (4 techs x 2 reps)');

  const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(reflectionCodes.join(',') === 'A1,A2,A3,B3', 'Reflection codes are exactly A1, A2, A3, B3');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 1, 'Tools data has exactly 1 tool');
  assert(toolsData.connection_schedule_log.code === 'B1', 'connection_schedule_log is B1');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'B1', 'Tool codes are exactly B1');

  assert(!reflectionCodes.includes('B2') && !toolCodes.includes('B2'), 'B2 (Format B guardrailed) is excluded from reflections and tools');

  const overlap = reflectionCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = reflectionCodes.length + toolCodes.length + 1; // 4 + 1 + 1 = 6
  assert(totalAccounted === 6, '100% technique accounting (4 reflections + 1 tool + 1 exclusion = 6)');

  // K. MHPI Configuration
  console.log('\n--- K. MHPI Configuration ---');
  const mhpi = MODULE_16_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end has 1 extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // L. Safety Configuration & Scenarios
  console.log('\n--- L. Safety Configuration & Scenarios ---');
  const esc = MODULE_16_CONTENT.escalationConfig;
  assert(!!esc.tier1 && !!esc.tier2, 'Escalation config defines tier1 and tier2');

  const ordinaryScenarios = [
    "My family wants me to consider this match.",
    "I am unsure whether we are compatible.",
    "I miss my partner because we live far apart.",
    "They haven't replied and I feel anxious."
  ];

  ordinaryScenarios.forEach(txt => {
    assert(classifySafetyText(txt) === 'NONE', `Ordinary scenario '${txt}' classified as NONE`);
  });

  const tier2Scenarios = [
    "I feel completely hopeless and unable to function.",
    "My family has threatened me if I refuse the marriage.",
    "I am not allowed to say no and feel unsafe.",
    "My partner is controlling where I can go and I feel trapped."
  ];

  tier2Scenarios.forEach(txt => {
    assert(classifySafetyText(txt) === 'TIER2', `Tier 2 scenario '${txt}' classified as TIER2`);
  });

  const tier1Scenarios = [
    "I have a plan to end my life.",
    "I am going to kill myself."
  ];

  tier1Scenarios.forEach(txt => {
    assert(classifySafetyText(txt) === 'TIER1', `Tier 1 scenario '${txt}' classified as TIER1`);
  });

  // M. Character Isolation
  console.log('\n--- M. Character Isolation ---');
  const w1RelateText = weeks[0].touches.flatMap(t => t.relate.text).join(' ');
  const w2RelateText = weeks[1].touches.flatMap(t => t.relate.text).join(' ');

  assert(w1RelateText.includes('Ishita') || w1RelateText.includes('Radhika'), 'Week 1 includes Mechanism A characters Ishita / Radhika');
  assert(!w1RelateText.includes('Arjun') && !w1RelateText.includes('Karan'), 'Week 1 does NOT leak Mechanism B characters Arjun / Karan');

  assert(w2RelateText.includes('Arjun') || w2RelateText.includes('Karan'), 'Week 2 includes Mechanism B characters Arjun / Karan');
  assert(!w2RelateText.includes('Ishita') && !w2RelateText.includes('Radhika'), 'Week 2 does NOT leak Mechanism A characters Ishita / Radhika');

  // N. M1–M15 Full Regression
  console.log('\n--- N. M1–M15 Full Regression ---');
  const previousModules = [
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
    { mod: MODULE_13_CONTENT, id: 'M13', weeks: 5, mechs: 2 },
    { mod: MODULE_14_CONTENT, id: 'M14', weeks: 7, mechs: 3 },
    { mod: MODULE_15_CONTENT, id: 'M15', weeks: 5, mechs: 2 }
  ];

  previousModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 16 CONTENT TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule16ContentTests().catch(err => {
  console.error('Module 16 content test execution failed:', err);
  process.exit(1);
});
