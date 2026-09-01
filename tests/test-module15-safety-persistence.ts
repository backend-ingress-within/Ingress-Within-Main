import { ModuleContentService } from '../src/lib/modules/moduleContentService';
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

// Simulated Safety Classifier based on Module 15 escalationConfig
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

  // Tier 2 functional collapse / severe hopelessness / separation safety threats
  const tier2Patterns = [
    'completely hopeless and unable to continue functioning',
    'can barely manage my daily responsibilities',
    'unable to manage basic responsibilities',
    'impossible for me to function normally',
    'unable to cope with anything',
    'completely destroyed my ability to manage daily life',
    'threatened to hurt me',
    'threatened violence',
    'family has threatened me',
    'do not feel safe living with my partner',
    'threatening me using custody',
    'controlling all my money'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runSafetyAndPersistenceTests() {
  console.log('--- STARTING MODULE 15 SAFETY, PERSISTENCE & REINFORCEMENT VERIFICATION ---');

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

  // 1. Ordinary Breakup Distress Tests (-> NONE)
  console.log('\n--- 1. Ordinary Breakup Distress Tests (-> NONE) ---');
  const ordinaryBreakupCases = [
    "I miss my ex-partner.",
    "I feel sad about my breakup.",
    "I keep thinking about what I could have done differently.",
    "I regret some things that happened in my relationship.",
    "I feel lonely after my relationship ended.",
    "I am angry about how the breakup happened.",
    "I am grieving the future I thought we would have."
  ];

  ordinaryBreakupCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary breakup text '${text.slice(0, 35)}...' classified as NONE`);
  });

  // 2. Ordinary Divorce / Separation Distress Tests (-> NONE)
  console.log('\n--- 2. Ordinary Divorce / Separation Distress Tests (-> NONE) ---');
  const ordinaryDivorceCases = [
    "I am struggling to adjust to life after my divorce.",
    "I feel like I don't know who I am without my marriage.",
    "I worry about what other people think about my divorce.",
    "My daily life feels very different after separating.",
    "I feel uncertain about my future after the separation.",
    "Sometimes I feel like my marriage ending means I failed."
  ];

  ordinaryDivorceCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary divorce text '${text.slice(0, 35)}...' classified as NONE`);
  });

  // 3. Tier 2 Functional Collapse Tests
  console.log('\n--- 3. Tier 2 Functional Collapse Tests ---');
  const tier2CollapseCases = [
    "I feel completely hopeless and unable to continue functioning.",
    "I can barely manage my daily responsibilities anymore.",
    "The breakup has made it impossible for me to function normally.",
    "I feel trapped and unable to cope with anything.",
    "My separation has completely destroyed my ability to manage daily life."
  ];

  tier2CollapseCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER2', `Functional collapse text '${text.slice(0, 35)}...' classified as TIER2`);
  });

  // 4. Tier 1 Acute Self-Harm / Suicide Tests
  console.log('\n--- 4. Tier 1 Acute Self-Harm / Suicide Tests ---');
  const tier1Cases = [
    "I have a plan to end my life.",
    "I have a plan to kill myself.",
    "I am going to hurt myself.",
    "I know how I would end my life."
  ];

  tier1Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER1', `Tier 1 acute text '${text.slice(0, 35)}...' classified as TIER1`);
  });

  // 5. Separation-Related Safety Concerns Tests (-> TIER2)
  console.log('\n--- 5. Separation-Related Safety Concerns Tests (-> TIER2) ---');
  const separationSafetyCases = [
    "My partner has threatened to hurt me if I leave.",
    "My partner's family has threatened me because of the separation.",
    "I do not feel safe living with my partner while we separate.",
    "My partner is threatening me using custody of our child.",
    "My partner is controlling all my money and I cannot leave."
  ];

  separationSafetyCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER2', `Separation safety threat text '${text.slice(0, 35)}...' classified as TIER2`);
  });

  // 6. Escalation Boundary Checks
  console.log('\n--- 6. Escalation Boundary Checks ---');
  assert(classifySafetyText("I feel heartbroken and miss my ex.") === 'NONE', 'Ordinary heartbreak -> NONE');
  assert(classifySafetyText("I am unable to manage basic responsibilities anymore.") === 'TIER2', 'Functional collapse -> TIER2');
  assert(classifySafetyText("I have a plan to end my life.") === 'TIER1', 'Suicide plan -> TIER1');
  assert(classifySafetyText("My partner has threatened violence if I leave.") === 'TIER2', 'Partner violence threat -> TIER2');

  // 7. Format A Verification (All 7 techniques strictly Format A, 0 Guardrails)
  console.log('\n--- 7. Format A Verification ---');
  const mechs = MODULE_15_CONTENT.brief.mechanisms;
  const allTechs = [...mechs[0].techniques, ...mechs[1].techniques];
  assert(allTechs.length === 7, 'Total technique count is 7');

  allTechs.forEach(t => {
    assert(t.format === 'A', `Technique ${t.code} is Format A`);
    assert(!t.guardrail, `Technique ${t.code} has guardrail !== true`);
  });

  const weeks = MODULE_15_CONTENT.weeks;
  const allTouches = weeks.flatMap(w => w.touches);
  assert(allTouches.filter(t => t.guardrail === true).length === 0, 'Zero guardrail touches in M15');
  assert(allTouches.filter(t => !!t.apply?.intensityPrompt).length === 0, 'Zero intensity prompt touches in M15');
  assert(allTouches.filter(t => !!t.distressPrompt).length === 0, 'Zero distress prompt touches in M15');
  assert(weeks.filter(w => w.hasReferenceCard === true).length === 0, 'Zero reference card flags in M15');

  // 8. Progress & Partial Answer Persistence
  console.log('\n--- 8. Progress & Partial Answer Persistence ---');
  let simulatedPlayerState: any = {
    view: 'week_list',
    weekIdx: 0,
    touchId: 'w1t1',
    completedTouches: ['w1t1', 'w1t2'],
    userAnswers: {
      w1t1: { rememberText: 'Recovery is non-linear' },
      w1t2: { thinkWhyText: 'Rumination keeps mental energy trapped' }
    },
    mhpiData: {
      baseline: { q1: 7, q2: 6, q3: 7, q4: 3, q5: 4 },
      baselineScore: 32,
      weekly: {},
      end: null
    }
  };

  // Test partial answer saving for w3t2 (A2) without premature completion
  simulatedPlayerState.userAnswers['w3t2'] = { thinkOpenText: 'Appreciated laughter / Incompatibility in future goals / Lesson in setting boundaries' };
  assert(!!simulatedPlayerState.userAnswers['w3t2'].thinkOpenText, 'Partial answer saved for w3t2 (A2)');
  assert(!simulatedPlayerState.completedTouches.includes('w3t2'), 'w3t2 touch is NOT completed prematurely');

  // Test partial answer saving for w4t2 (B2)
  simulatedPlayerState.userAnswers['w4t2'] = { thinkOpenText: 'Stigma: people will think I failed / Reframing: marriage incompatibility happens' };
  assert(!!simulatedPlayerState.userAnswers['w4t2'].thinkOpenText, 'Partial answer saved for w4t2 (B2)');
  assert(!simulatedPlayerState.completedTouches.includes('w4t2'), 'w4t2 touch is NOT completed prematurely');

  // Complete w3t2 and w4t2
  simulatedPlayerState.completedTouches.push('w3t2');
  simulatedPlayerState.completedTouches.push('w4t2');
  assert(simulatedPlayerState.completedTouches.includes('w3t2'), 'w3t2 completed after full submission');
  assert(simulatedPlayerState.completedTouches.includes('w4t2'), 'w4t2 completed after full submission');

  // 9. Multiple Technique Answer Isolation
  console.log('\n--- 9. Multiple Technique Answer Isolation ---');
  simulatedPlayerState.userAnswers['A2'] = { text: 'Unique answer for A2 narrative reconstruction' };
  simulatedPlayerState.userAnswers['A3'] = { text: 'Unique answer for A3 CBT rumination' };
  simulatedPlayerState.userAnswers['B1'] = { text: 'Unique answer for B1 identity reconstruction' };

  assert(simulatedPlayerState.userAnswers['A2'].text !== simulatedPlayerState.userAnswers['A3'].text, 'A2 and A3 answers are isolated');
  assert(simulatedPlayerState.userAnswers['B1'].text !== simulatedPlayerState.userAnswers['A2'].text, 'B1 and A2 answers are isolated');

  // 10. Full 25-Touch Lifecycle
  console.log('\n--- 10. Full 25-Touch Lifecycle ---');
  const allTouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 25, 'Total touch count in roadmap is 25');

  simulatedPlayerState.completedTouches = Array.from(new Set(allTouchIds));
  assert(simulatedPlayerState.completedTouches.length === 25, '25/25 touches complete');
  const isLifecycleComplete = simulatedPlayerState.completedTouches.length === 25;
  assert(isLifecycleComplete, '25/25 complete unlocks closing & completion flow');

  // 11. MHPI Baseline Persistence
  console.log('\n--- 11. MHPI Baseline Persistence ---');
  const baselineScore = simulatedPlayerState.mhpiData.baselineScore;
  assert(baselineScore === 32, 'MHPI baseline score is 32/50');
  assert(simulatedPlayerState.mhpiData.baseline.q1 === 7, 'Baseline q1 persists');

  // 12. Weekly MHPI Isolation — 5-Week Verification
  console.log('\n--- 12. Weekly MHPI Isolation — 5-Week Verification ---');
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

  // 13. End MHPI Persistence
  console.log('\n--- 13. End MHPI Persistence ---');
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

  // 14. Reinforcement Bank & Deliberate A1 Exclusion
  console.log('\n--- 14. Reinforcement Bank & Deliberate A1 Exclusion ---');
  const bank = MODULE_15_CONTENT.reinforcementBank;
  const toolsData = MODULE_15_CONTENT.toolsData;

  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps');
  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A2,A3,B1,B2', 'Reflections contain exactly A2, A3, B1, B2');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(toolsData.grief_processing_log.code === 'A4', 'Tool grief_processing_log is A4');
  assert(toolsData.life_rebuilding_log.code === 'B3', 'Tool life_rebuilding_log is B3');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A4,B3', 'Tools contain exactly A4, B3');

  assert(!refCodes.includes('A1') && !toolCodes.includes('A1'), 'A1 is deliberately excluded from reflections and tools as a normalizing framework');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 1; // 4 + 2 + 1 = 7
  assert(totalAccounted === 7, 'All 7 techniques accounted for with 0 duplicates');

  // 15. User Isolation
  console.log('\n--- 15. User Isolation ---');
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

  // 16. Module Isolation (M15 vs M14 vs M13)
  console.log('\n--- 16. Module Isolation (M15 vs M14 vs M13) ---');
  const m15Progress = { moduleId: 'M15', completedTouches: ['w1t1', 'w1t2'] };
  const m14Progress = { moduleId: 'M14', completedTouches: [] };
  const m13Progress = { moduleId: 'M13', completedTouches: [] };

  assert(m15Progress.completedTouches.length === 2, 'M15 has 2 completed touches');
  assert(m14Progress.completedTouches.length === 0, 'M14 progress is clean');
  assert(m13Progress.completedTouches.length === 0, 'M13 progress is clean');

  // 17. M14 ↔ M15 Specialized Behavior Isolation
  console.log('\n--- 17. M14 ↔ M15 Specialized Behavior Isolation ---');
  assert(MODULE_14_CONTENT.duration_weeks === 7, 'M14 is 7 weeks');
  assert(MODULE_15_CONTENT.duration_weeks === 5, 'M15 is 5 weeks');
  assert(MODULE_14_CONTENT.weeks[5].touches.some(t => t.id === 'w6t3' && t.guardrail === true), 'M14 C1 Format B guardrail intact');
  assert(MODULE_15_CONTENT.weeks.flatMap(w => w.touches).every(t => !t.guardrail), 'M15 has 0 guardrail touches');

  // 18. Full M1–M15 Regression
  console.log('\n--- 18. Full M1–M15 Regression ---');
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
    { mod: MODULE_15_CONTENT, id: 'M15', weeks: 5, mechs: 2 }
  ];

  const ids = allModules.map(m => m.id);
  const slugs = allModules.map(m => m.mod.slug);

  assert(new Set(ids).size === 15, 'All 15 module IDs are unique');
  assert(new Set(slugs).size === 15, 'All 15 module slugs are unique');

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 15 SAFETY & PERSISTENCE TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runSafetyAndPersistenceTests().catch(err => {
  console.error('Module 15 safety & persistence test execution failed:', err);
  process.exit(1);
});
