import { MODULE_15_CONTENT } from '../src/lib/modules/content/module15Data';
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

async function runModule15ContentTests() {
  console.log('--- STARTING MODULE 15 CONTENT FOUNDATION VALIDATION TESTS ---');

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
  assert(MODULE_15_CONTENT.moduleId === 'M15', 'moduleId is M15');
  assert(MODULE_15_CONTENT.slug === 'loss-endings', 'slug is loss-endings');
  assert(MODULE_15_CONTENT.name === 'Loss & Endings', 'name is Loss & Endings');
  assert(MODULE_15_CONTENT.duration_weeks === 5, 'duration_weeks is 5');
  assert((MODULE_15_CONTENT.tier || '').includes('Specialized'), 'tier includes Specialized');
  assert((MODULE_15_CONTENT.tier || '').includes('Relationships'), 'domain is Relationships');

  // B. BRIEF Completeness
  console.log('\n--- B. BRIEF Completeness ---');
  const brief = MODULE_15_CONTENT.brief;
  assert(brief.moduleName === 'Loss & Endings', 'BRIEF moduleName present');
  assert(brief.moduleNumber === 15, 'BRIEF moduleNumber is 15');
  assert(!!brief.tier, 'BRIEF tier present');
  assert(!!brief.scenarioSource, 'BRIEF scenarioSource present');
  assert(Array.isArray(brief.mechanisms) && brief.mechanisms.length === 2, 'BRIEF mechanisms array has 2 mechanisms');
  assert(!!brief.escalation && !!brief.escalation.tier1 && !!brief.escalation.tier2, 'BRIEF escalation present');

  // C. Mechanisms & Techniques
  console.log('\n--- C. Mechanisms & Techniques ---');
  const mechA = brief.mechanisms[0];
  const mechB = brief.mechanisms[1];

  assert(mechA.key === 'A' && mechA.name === 'Breakup Distress', 'Mechanism A is Breakup Distress');
  assert(mechB.key === 'B' && mechB.name === 'Divorce / Separation Adjustment', 'Mechanism B is Divorce / Separation Adjustment');

  assert(mechA.techniques.length === 4, 'Mechanism A has 4 techniques (A1, A2, A3, A4)');
  assert(mechB.techniques.length === 3, 'Mechanism B has 3 techniques (B1, B2, B3)');

  const expectedA = ['A1', 'A2', 'A3', 'A4'];
  const expectedB = ['B1', 'B2', 'B3'];

  expectedA.forEach((code, idx) => {
    assert(mechA.techniques[idx].code === code, `Mechanism A technique ${idx + 1} code is ${code}`);
  });

  expectedB.forEach((code, idx) => {
    assert(mechB.techniques[idx].code === code, `Mechanism B technique ${idx + 1} code is ${code}`);
  });

  // D. Format Validation (7 Format A, 0 Format B, 0 Format C)
  console.log('\n--- D. Format Validation ---');
  const allTechs = [...mechA.techniques, ...mechB.techniques];
  assert(allTechs.length === 7, 'Total technique count is 7');

  let formatACount = 0;
  let formatBCount = 0;
  let formatCCount = 0;

  allTechs.forEach(t => {
    if (t.format === 'A') formatACount++;
    if (t.format === 'B') formatBCount++;
    if (t.format === 'C') formatCCount++;
    assert(!t.guardrail, `Technique ${t.code} has no guardrail flag`);
  });

  assert(formatACount === 7, 'Format A count is 7');
  assert(formatBCount === 0, 'Format B count is 0');
  assert(formatCCount === 0, 'Format C count is 0');

  // E. Week Structure & Touch Count
  console.log('\n--- E. Week Structure & Touch Count ---');
  const weeks = MODULE_15_CONTENT.weeks;
  assert(weeks.length === 5, 'Module 15 has 5 weeks');

  let totalTouches = 0;
  const touchIds: string[] = [];

  weeks.forEach(w => {
    assert(w.touches.length === 5, `Week ${w.num} has 5 touches`);
    totalTouches += w.touches.length;
    w.touches.forEach(t => touchIds.push(t.id));
  });

  assert(totalTouches === 25, 'Total teaching touch count is 25 (5 x 5)');
  assert(new Set(touchIds).size === 25, 'All 25 touch IDs are unique (w1t1 -> w5t5)');

  // F. Retrieval Check Verification
  console.log('\n--- F. Retrieval Check Verification ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has retrieval check (Mechanism A & B)');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null');

  // G. Transfer Test Verification
  console.log('\n--- G. Transfer Test Verification ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'w5t5 is the final touch');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest === true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // H & I. Guardrails & Reference Cards Verification
  console.log('\n--- H & I. Guardrails & Reference Cards Verification ---');
  const allTouches = weeks.flatMap(w => w.touches);
  const guardrailTouches = allTouches.filter(t => t.guardrail === true);
  const intensityTouches = allTouches.filter(t => !!t.apply?.intensityPrompt);
  const distressTouches = allTouches.filter(t => !!t.distressPrompt);
  const refCardWeeks = weeks.filter(w => w.hasReferenceCard === true);

  assert(guardrailTouches.length === 0, 'Zero guardrail touches');
  assert(intensityTouches.length === 0, 'Zero intensity prompt touches');
  assert(distressTouches.length === 0, 'Zero distress prompt touches');
  assert(refCardWeeks.length === 0, 'Zero reference card flags across weeks');

  // J. Reinforcement Bank Accounting
  console.log('\n--- J. Reinforcement Bank Accounting ---');
  const bank = MODULE_15_CONTENT.reinforcementBank;
  const toolsData = MODULE_15_CONTENT.toolsData;

  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps (4 techs x 2 reps)');

  const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(reflectionCodes.join(',') === 'A2,A3,B1,B2', 'Reflection codes are exactly A2, A3, B1, B2');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(toolsData.grief_processing_log.code === 'A4', 'grief_processing_log is A4');
  assert(toolsData.life_rebuilding_log.code === 'B3', 'life_rebuilding_log is B3');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A4,B3', 'Tool codes are exactly A4, B3');

  assert(!reflectionCodes.includes('A1') && !toolCodes.includes('A1'), 'A1 is deliberately excluded from reflections and tools');

  const overlap = reflectionCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = reflectionCodes.length + toolCodes.length + 1; // 4 + 2 + 1 = 7
  assert(totalAccounted === 7, '100% technique accounting (4 reflections + 2 tools + 1 exclusion = 7)');

  // K. MHPI Configuration
  console.log('\n--- K. MHPI Configuration ---');
  const mhpi = MODULE_15_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end has 1 extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // L. Safety Configuration
  console.log('\n--- L. Safety Configuration ---');
  const esc = MODULE_15_CONTENT.escalationConfig;
  assert(!!esc.tier1 && !!esc.tier2, 'Escalation config defines tier1 and tier2');
  assert(esc.tier2FallbackWords.includes('threatened to hurt me'), 'Tier 2 includes partner safety threats');
  assert(esc.tier2FallbackWords.includes('coercing custody'), 'Tier 2 includes custody coercion');
  assert(esc.tier2FallbackWords.includes('financial control'), 'Tier 2 includes financial control');

  // M. Character Isolation
  console.log('\n--- M. Character Isolation ---');
  const w1RelateText = weeks[0].touches.flatMap(t => t.relate.text).join(' ');
  const w2RelateText = weeks[1].touches.flatMap(t => t.relate.text).join(' ');

  assert(w1RelateText.includes('Aisha') || w1RelateText.includes('Meera'), 'Week 1 includes Mechanism A characters Aisha / Meera');
  assert(!w1RelateText.includes('Sanjay') && !w1RelateText.includes('Rekha'), 'Week 1 does NOT leak Mechanism B characters Sanjay / Rekha');

  assert(w2RelateText.includes('Sanjay') || w2RelateText.includes('Rekha'), 'Week 2 includes Mechanism B characters Sanjay / Rekha');
  assert(!w2RelateText.includes('Aisha') && !w2RelateText.includes('Meera'), 'Week 2 does NOT leak Mechanism A characters Aisha / Meera');

  // N. M1–M14 Full Regression
  console.log('\n--- N. M1–M14 Full Regression ---');
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
    { mod: MODULE_14_CONTENT, id: 'M14', weeks: 7, mechs: 3 }
  ];

  previousModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 15 CONTENT TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule15ContentTests().catch(err => {
  console.error('Module 15 content test execution failed:', err);
  process.exit(1);
});
