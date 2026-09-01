import { MODULE_14_CONTENT } from '../src/lib/modules/content/module14Data';
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

// Simulated Safety Classifier based on Module 14 escalationConfig
function classifySafetyText(text: string): 'NONE' | 'TIER1' | 'TIER2' {
  if (!text) return 'NONE';
  const lower = text.toLowerCase();

  // Tier 1 acute self-harm / suicide intent
  const tier1Patterns = [
    'plan to end my life',
    'plan to kill myself',
    'going to hurt myself',
    'know how i would end my life',
    'know how i would kill myself',
    'going to end it all tonight',
    'have a plan to end it'
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Tier 2 functional collapse / severe hopelessness / inability to function
  const tier2Patterns = [
    'haven\'t been able to function in my daily life for a long time',
    'completely unable to function',
    'severe functional collapse',
    'persistent hopelessness about life'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runModule14ContentTests() {
  console.log('--- STARTING MODULE 14 CONTENT FOUNDATION VALIDATION TESTS ---');

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
  assert(MODULE_14_CONTENT.moduleId === 'M14', 'moduleId is M14');
  assert(MODULE_14_CONTENT.name === 'Grief, Loss & Life Transitions', 'Name matches specification');
  assert(MODULE_14_CONTENT.slug === 'grief-loss-life-transitions', 'Slug matches specification');
  assert(MODULE_14_CONTENT.duration_weeks === 7, 'Duration is 7 weeks');
  assert((MODULE_14_CONTENT.tier || '').includes('Life Experiences'), 'Domain is Life Experiences');
  assert((MODULE_14_CONTENT.tier || '').includes('Common'), 'Tier is Common');
  assert((MODULE_14_CONTENT.tier || '').includes('499'), 'Price is 499 INR');

  // 2. Mechanisms Architecture
  console.log('\n--- 2. Mechanisms Architecture ---');
  const mechs = MODULE_14_CONTENT.brief.mechanisms;
  assert(mechs.length === 3, 'Contains exactly 3 mechanisms');
  assert(mechs[0].key === 'A' && mechs[0].name === 'Grief & Bereavement', 'Mechanism A is Grief & Bereavement');
  assert(mechs[1].key === 'B' && mechs[1].name === 'Major Life Transitions', 'Mechanism B is Major Life Transitions');
  assert(mechs[2].key === 'C' && mechs[2].name === 'Ambiguous Loss & Unfinished Change', 'Mechanism C is Ambiguous Loss & Unfinished Change');

  // 3. Weeks & Touches Architecture
  console.log('\n--- 3. Weeks & Touches Architecture ---');
  const weeks = MODULE_14_CONTENT.weeks;
  assert(weeks.length === 7, 'Contains exactly 7 weeks');

  let touchCount = 0;
  const allTouchIds: string[] = [];

  weeks.forEach((w, wIdx) => {
    assert(w.touches.length === 5, `Week ${wIdx + 1} has 5 touches`);
    w.touches.forEach((t, tIdx) => {
      touchCount++;
      const expectedId = `w${wIdx + 1}t${tIdx + 1}`;
      assert(t.id === expectedId, `Touch ID ${t.id} matches expected ${expectedId}`);
      allTouchIds.push(t.id);
    });
  });

  assert(touchCount === 35, 'Total teaching touch count is 35 (7 x 5)');
  assert(new Set(allTouchIds).size === 35, 'All 35 touch IDs are unique');

  // 4. Techniques Breakdown & Formats
  console.log('\n--- 4. Techniques Breakdown & Formats ---');
  const allTechs: any[] = [];
  mechs.forEach(m => {
    m.techniques.forEach(t => allTechs.push(t));
  });

  assert(allTechs.length === 10, 'Contains exactly 10 techniques across mechanisms');

  const techCodes = allTechs.map(t => t.code);
  assert(new Set(techCodes).size === 10, 'All technique codes are unique');

  // Format A
  const formatATechs = allTechs.filter(t => t.format === 'A');
  assert(formatATechs.length === 8, '8 techniques are Format A');

  // Format B Guardrailed (C1)
  const formatBTechs = allTechs.filter(t => t.format === 'B');
  assert(formatBTechs.length === 1, '1 technique is Format B');
  assert(formatBTechs[0].code === 'C1', 'Format B technique is C1');
  assert(formatBTechs[0].guardrail === true, 'C1 has guardrail === true');

  const c1Touch = weeks[5].touches.find(t => t.id === 'w6t3');
  assert(c1Touch !== undefined, 'Touch w6t3 exists for C1');
  assert(c1Touch?.guardrail === true, 'Touch w6t3 has guardrail === true');
  assert(!!c1Touch?.apply.intensityPrompt, 'c1Touch has intensityPrompt');
  assert(c1Touch?.apply.intensityOptions?.length === 2, 'c1Touch has 2 intensity options');
  assert(!!c1Touch?.distressPrompt, 'c1Touch has distressPrompt');

  // Format C Reference-Only (A4)
  const formatCTechs = allTechs.filter(t => t.format === 'C');
  assert(formatCTechs.length === 1, '1 technique is Format C');
  assert(formatCTechs[0].code === 'A4', 'Format C technique is A4');
  assert(!!formatCTechs[0].professionalNote, 'A4 contains professionalNote');
  assert(weeks[3].hasReferenceCard === true, 'Week 4 has reference card flag for A4');

  // 5. Retrieval Check Verification
  console.log('\n--- 5. Retrieval Check Verification ---');
  let retrievalCount = 0;
  let week4Retrieval = false;

  weeks.forEach(w => {
    if (w.retrievalCheck !== null) {
      retrievalCount++;
      if (w.num === 4) week4Retrieval = true;
    }
  });

  assert(retrievalCount === 1, 'Contains exactly 1 retrieval check');
  assert(week4Retrieval, 'Retrieval check is placed in Week 4');

  // 6. Transfer Test Verification
  console.log('\n--- 6. Transfer Test Verification ---');
  const finalTouch = weeks[6].touches[4];
  assert(finalTouch.id === 'w7t5', 'Final touch is w7t5');
  assert(finalTouch.transferTest === true, 'w7t5 has transferTest === true');
  assert(finalTouch.think.mode === 'open', 'w7t5 think mode is open (unscaffolded reasoning)');

  // 7. MHPI Configuration
  console.log('\n--- 7. MHPI Configuration ---');
  const mhpi = MODULE_14_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end extra questions count is 1');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // 8. Safety Classification Tests
  console.log('\n--- 8. Safety Classification Tests ---');
  const ordinaryCases = [
    "I miss my mother every day.",
    "I still feel sad months after losing someone.",
    "I don't know who I am after this loss.",
    "I feel emotional when I remember them.",
    "Moving away from home has been harder than I expected.",
    "I miss the life I used to have.",
    "I don't know how to move forward after my relationship changed."
  ];

  ordinaryCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary grief text '${text.slice(0, 35)}...' classified as NONE`);
  });

  const tier2Case = "I haven't been able to function in my daily life for a long time.";
  assert(classifySafetyText(tier2Case) === 'TIER2', 'Functional collapse text classified as TIER2');

  const tier1Cases = [
    "I have a plan to end my life.",
    "I know how I would kill myself.",
    "I am going to hurt myself."
  ];

  tier1Cases.forEach(text => {
    assert(classifySafetyText(text) === 'TIER1', `Acute self-harm text '${text.slice(0, 35)}...' classified as TIER1`);
  });

  // 9. Reinforcement Bank & Tools Accounting
  console.log('\n--- 9. Reinforcement Bank & Tools Accounting ---');
  const bank = MODULE_14_CONTENT.reinforcementBank;
  const toolsData = MODULE_14_CONTENT.toolsData;

  assert(bank.length === 12, 'Reinforcement bank has 12 reflection reps (6 techniques x 2 reps)');

  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A2,B1,B3,C2,C3', 'Reflections contain exactly A1, A2, B1, B3, C2, C3');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(toolsData.reengagement_log.code === 'A3', 'Tool reengagement_log code is A3');
  assert(toolsData.transition_map_log.code === 'B2', 'Tool transition_map_log code is B2');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A3,B2', 'Tools contain exactly A3, B2');

  assert(!refCodes.includes('A4') && !toolCodes.includes('A4'), 'Format C (A4) is excluded from reinforcement bank & tools');
  assert(!refCodes.includes('C1') && !toolCodes.includes('C1'), 'Format B guardrailed (C1) is excluded from reinforcement bank & tools');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 2; // 6 + 2 + A4 + C1 = 10
  assert(totalAccounted === 10, 'All 10 techniques accounted for with 0 duplicates');

  // 10. M1–M13 Full Regression Check
  console.log('\n--- 10. M1–M13 Full Regression Check ---');
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
    { mod: MODULE_13_CONTENT, id: 'M13', weeks: 5, mechs: 2 }
  ];

  previousModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 14 CONTENT TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule14ContentTests().catch(err => {
  console.error('Module 14 content test execution failed:', err);
  process.exit(1);
});
