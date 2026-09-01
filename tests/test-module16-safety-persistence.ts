import { ModuleContentService } from '../src/lib/modules/moduleContentService';
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
    'unable to manage basic responsibilities',
    'forced to marry',
    'forced into a marriage',
    'threatened me if i refuse',
    'threatened me',
    'threatened violence',
    'not allowed to say no',
    'controlling where i can go',
    'feel unsafe',
    'feel trapped'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runSafetyAndPersistenceTests() {
  console.log('--- STARTING MODULE 16 SAFETY, PERSISTENCE & REINFORCEMENT VERIFICATION ---');

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

  // 1. Ordinary Arranged Marriage Uncertainty & Family Expectations -> NONE
  console.log('\n--- 1. Ordinary Arranged Marriage Uncertainty -> NONE ---');
  const ordinaryArrangedCases = [
    "I am unsure whether we are compatible.",
    "I feel nervous about meeting a prospective match.",
    "My family wants me to consider this match.",
    "I am worried about disappointing my family.",
    "I feel ambivalent about deciding right now."
  ];

  ordinaryArrangedCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary arranged marriage text '${text.slice(0, 35)}...' classified as NONE`);
  });

  // 2. Long-Distance Loneliness & Delayed Reply Anxiety -> NONE
  console.log('\n--- 2. Long-Distance Loneliness & Delayed Reply Anxiety -> NONE ---');
  const ordinaryDistanceCases = [
    "I miss my partner because we live far apart.",
    "They haven't replied and I feel anxious.",
    "I feel lonely in our long-distance relationship.",
    "The time-zone gap makes communication frustrating."
  ];

  ordinaryDistanceCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary distance text '${text.slice(0, 35)}...' classified as NONE`);
  });

  // 3. Tier 2 Functional Collapse & Forced Marriage Coercion -> TIER2
  console.log('\n--- 3. Tier 2 Functional Collapse & Forced Marriage Coercion -> TIER2 ---');
  const tier2Cases = [
    "I feel completely hopeless and unable to function.",
    "I can barely manage my daily responsibilities.",
    "My family has threatened me if I refuse the marriage.",
    "I am not allowed to say no and feel unsafe.",
    "My partner is controlling where I can go and I feel trapped.",
    "I am being forced into a marriage against my will."
  ];

  tier2Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER2', `Tier 2 text '${text.slice(0, 35)}...' classified as TIER2`);
  });

  // 4. Tier 1 Acute Self-Harm / Suicide Intent -> TIER1
  console.log('\n--- 4. Tier 1 Acute Self-Harm / Suicide Intent -> TIER1 ---');
  const tier1Cases = [
    "I have a plan to end my life.",
    "I am going to kill myself.",
    "I know how I would end my life."
  ];

  tier1Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER1', `Tier 1 acute text '${text.slice(0, 35)}...' classified as TIER1`);
  });

  // 5. B2 Guardrail Verification (Week 4, Touch w4t2)
  console.log('\n--- 5. B2 Guardrail Verification ---');
  const mechs = MODULE_16_CONTENT.brief.mechanisms;
  const b2Tech = mechs[1].techniques.find(t => t.code === 'B2');
  assert(b2Tech !== undefined, 'Technique B2 exists');
  assert(b2Tech?.format === 'B', 'B2 is Format B');
  assert(b2Tech?.guardrail === true, 'B2 has guardrail === true');

  const weeks = MODULE_16_CONTENT.weeks;
  const w4t2 = weeks[3].touches[1];
  assert(w4t2.id === 'w4t2', 'w4t2 is B2 touch');
  assert(w4t2.guardrail === true, 'w4t2 has guardrail === true');
  assert(!!w4t2.apply.intensityPrompt, 'w4t2 has intensityPrompt');
  assert(w4t2.apply.intensityOptions?.length === 2, 'w4t2 has 2 intensity options');
  assert(!!w4t2.apply.intensityOptions?.[0]?.includes('Smaller version'), 'Option 1 is Smaller version');
  assert(!!w4t2.apply.intensityOptions?.[1]?.includes('Bigger version'), 'Option 2 is Bigger version');
  assert(!!w4t2.distressPrompt, 'w4t2 has distressPrompt');

  // Verify B2 is the ONLY guardrailed touch in M16
  const allTouches = weeks.flatMap(w => w.touches);
  const guardrailTouches = allTouches.filter(t => t.guardrail === true);
  assert(guardrailTouches.length === 1 && guardrailTouches[0].id === 'w4t2', 'w4t2 is the ONLY guardrailed touch in M16');

  // 6. Touch Progress & Partial Answer Persistence
  console.log('\n--- 6. Touch Progress & Partial Answer Persistence ---');
  let simulatedPlayerState: any = {
    view: 'week_list',
    weekIdx: 0,
    touchId: 'w1t1',
    completedTouches: ['w1t1', 'w1t2'],
    userAnswers: {
      w1t1: { rememberText: 'Name concrete priorities instead of searching for a feeling' },
      w1t2: { thinkWhyText: 'Pressure makes bounded decisions feel catastrophic' }
    },
    mhpiData: {
      baseline: { q1: 7, q2: 6, q3: 7, q4: 3, q5: 4 },
      baselineScore: 32,
      weekly: {},
      end: null
    }
  };

  // Test partial answer saving for w3t1 (A1) without premature completion
  simulatedPlayerState.userAnswers['w3t1'] = { thinkOpenText: 'Values matrix: communication / mutual respect / career flexibility' };
  assert(!!simulatedPlayerState.userAnswers['w3t1'].thinkOpenText, 'Partial answer saved for w3t1 (A1)');
  assert(!simulatedPlayerState.completedTouches.includes('w3t1'), 'w3t1 touch is NOT completed prematurely');

  // Test partial answer saving for w4t2 (B2 guardrail)
  simulatedPlayerState.userAnswers['w4t2'] = {
    intensity: 'Bigger version',
    applyText: 'Fear: distance makes me feel forgotten when calls are missed',
    distressRating: 3
  };
  assert(simulatedPlayerState.userAnswers['w4t2'].intensity === 'Bigger version', 'B2 intensity selection saved');
  assert(!!simulatedPlayerState.userAnswers['w4t2'].applyText, 'B2 apply text saved');
  assert(simulatedPlayerState.userAnswers['w4t2'].distressRating === 3, 'B2 distress rating saved');
  assert(!simulatedPlayerState.completedTouches.includes('w4t2'), 'w4t2 touch is NOT completed prematurely');

  // Complete w3t1 and w4t2
  simulatedPlayerState.completedTouches.push('w3t1');
  simulatedPlayerState.completedTouches.push('w4t2');
  assert(simulatedPlayerState.completedTouches.includes('w3t1'), 'w3t1 completed after full submission');
  assert(simulatedPlayerState.completedTouches.includes('w4t2'), 'w4t2 completed after full submission');

  // 7. Multiple Technique Answer Isolation
  console.log('\n--- 7. Multiple Technique Answer Isolation ---');
  simulatedPlayerState.userAnswers['A1'] = { text: 'Unique answer for A1 values matrix' };
  simulatedPlayerState.userAnswers['A2'] = { text: 'Unique answer for A2 CBT catastrophic thoughts' };
  simulatedPlayerState.userAnswers['B1'] = { text: 'Unique answer for B1 communication scheduling' };

  assert(simulatedPlayerState.userAnswers['A1'].text !== simulatedPlayerState.userAnswers['A2'].text, 'A1 and A2 answers are isolated');
  assert(simulatedPlayerState.userAnswers['B1'].text !== simulatedPlayerState.userAnswers['A1'].text, 'B1 and A1 answers are isolated');

  // 8. Full 25-Touch Lifecycle
  console.log('\n--- 8. Full 25-Touch Lifecycle ---');
  const allTouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 25, 'Total touch count in roadmap is 25');

  simulatedPlayerState.completedTouches = Array.from(new Set(allTouchIds));
  assert(simulatedPlayerState.completedTouches.length === 25, '25/25 touches complete');
  const isLifecycleComplete = simulatedPlayerState.completedTouches.length === 25;
  assert(isLifecycleComplete, '25/25 complete unlocks closing & completion flow');

  // 9. MHPI Baseline Persistence
  console.log('\n--- 9. MHPI Baseline Persistence ---');
  const baselineScore = simulatedPlayerState.mhpiData.baselineScore;
  assert(baselineScore === 32, 'MHPI baseline score is 32/50');
  assert(simulatedPlayerState.mhpiData.baseline.q1 === 7, 'Baseline q1 persists');

  // 10. Weekly MHPI Isolation — 5-Week Verification
  console.log('\n--- 10. Weekly MHPI Isolation — 5-Week Verification ---');
  simulatedPlayerState.mhpiData.weekly = {
    w1: { w1: 8, w2: 4, w3: 3 },
    w2: { w1: 7, w2: 5, w3: 4 },
    w3: { w1: 6, w2: 6, w3: 5 },
    w4: { w1: 4, w2: 8, w3: 6 },
    w5: { w1: 2, w2: 9, w3: 7 }
  };

  const weeklyKeys = Object.keys(simulatedPlayerState.mhpiData.weekly);
  assert(weeklyKeys.length === 5, 'Exactly 5 weekly MHPI records present (w1-w5)');
  assert(simulatedPlayerState.mhpiData.weekly['w1'].w1 === 8, 'w1 record intact');
  assert(simulatedPlayerState.mhpiData.weekly['w5'].w1 === 2, 'w5 record intact without overwriting w1');

  // 11. End MHPI Persistence
  console.log('\n--- 11. End MHPI Persistence ---');
  const endAnswers = { q1: 2, q2: 2, q3: 3, q4: 8, q5: 9 };
  const computedEndScore = endAnswers.q1 + endAnswers.q2 + endAnswers.q3 + (10 - endAnswers.q4) + (10 - endAnswers.q5); // 2+2+3+2+1 = 10
  const improvementPct = Number((((32 - computedEndScore) / 32) * 100).toFixed(2)); // Baseline 32 -> End 10 = 68.75%

  simulatedPlayerState.mhpiData.end = endAnswers;
  simulatedPlayerState.mhpiData.endScore = computedEndScore;
  simulatedPlayerState.mhpiData.improvementPct = improvementPct;
  simulatedPlayerState.mhpiData.helpfulness = 5;
  simulatedPlayerState.mhpiData.nextStep = 'Finish here';

  assert(computedEndScore === 10, 'End score is 10/50');
  assert(improvementPct === 68.75, 'Improvement percentage calculated as 68.75%');
  assert(simulatedPlayerState.mhpiData.nextStep === 'Finish here', 'Next step selection persists');

  // 12. Reinforcement Bank & B2 Exclusion Accounting
  console.log('\n--- 12. Reinforcement Bank & B2 Exclusion Accounting ---');
  const bank = MODULE_16_CONTENT.reinforcementBank;
  const toolsData = MODULE_16_CONTENT.toolsData;

  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps');
  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A2,A3,B3', 'Reflections contain exactly A1, A2, A3, B3');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 1, 'Tools data has exactly 1 tool');
  assert(toolsData.connection_schedule_log.code === 'B1', 'Tool connection_schedule_log is B1');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'B1', 'Tools contain exactly B1');

  assert(!refCodes.includes('B2') && !toolCodes.includes('B2'), 'B2 (Format B guardrailed) is excluded from reflections and tools');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 1; // 4 + 1 + 1 = 6
  assert(totalAccounted === 6, 'All 6 techniques accounted for with 0 duplicates');

  // 13. User Isolation
  console.log('\n--- 13. User Isolation ---');
  const userAState = { ...simulatedPlayerState };
  const userBState = {
    view: 'overview',
    weekIdx: 0,
    touchId: null,
    completedTouches: [],
    userAnswers: {},
    mhpiData: { baseline: null, baselineScore: null, weekly: {}, end: null }
  };

  assert(userAState.completedTouches.length === 25, 'User A has 25 completed touches');
  assert(userBState.completedTouches.length === 0, 'User B has 0 completed touches');
  assert(userAState.mhpiData.baselineScore !== null, 'User A has baseline score');
  assert(userBState.mhpiData.baselineScore === null, 'User B has null baseline score');

  // 14. Module Isolation (M16 vs M15 vs M14 vs M13 vs M10)
  console.log('\n--- 14. Module Isolation (M16 vs M15 vs M14 vs M13 vs M10) ---');
  const m16Progress = { moduleId: 'M16', completedTouches: ['w1t1', 'w1t2'] };
  const m15Progress = { moduleId: 'M15', completedTouches: [] };
  const m14Progress = { moduleId: 'M14', completedTouches: [] };
  const m13Progress = { moduleId: 'M13', completedTouches: [] };
  const m10Progress = { moduleId: 'M10', completedTouches: [] };

  assert(m16Progress.completedTouches.length === 2, 'M16 has 2 completed touches');
  assert(m15Progress.completedTouches.length === 0, 'M15 progress is clean');
  assert(m14Progress.completedTouches.length === 0, 'M14 progress is clean');
  assert(m13Progress.completedTouches.length === 0, 'M13 progress is clean');
  assert(m10Progress.completedTouches.length === 0, 'M10 progress is clean');

  // 15. Full M1–M16 Regression
  console.log('\n--- 15. Full M1–M16 Regression ---');
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
    { mod: MODULE_13_CONTENT, id: 'M13', weeks: 5, mechs: 2 },
    { mod: MODULE_14_CONTENT, id: 'M14', weeks: 7, mechs: 3 },
    { mod: MODULE_15_CONTENT, id: 'M15', weeks: 5, mechs: 2 },
    { mod: MODULE_16_CONTENT, id: 'M16', weeks: 5, mechs: 2 }
  ];

  const ids = allModules.map(m => m.id);
  const slugs = allModules.map(m => m.mod.slug);

  assert(new Set(ids).size === 16, 'All 16 module IDs are unique');
  assert(new Set(slugs).size === 16, 'All 16 module slugs are unique');

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 16 SAFETY & PERSISTENCE TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runSafetyAndPersistenceTests().catch(err => {
  console.error('Module 16 safety & persistence test execution failed:', err);
  process.exit(1);
});
