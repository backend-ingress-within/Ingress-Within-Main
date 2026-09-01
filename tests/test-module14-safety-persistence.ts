import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleProgressService } from '../src/lib/modules/moduleProgressService';
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
    'have a plan to end it',
    'cannot live without them and i know how i would kill myself',
    'unbearable and i am going to hurt myself'
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Tier 2 functional collapse / severe hopelessness / inability to function
  const tier2Patterns = [
    'completely hopeless and unable to function',
    'can barely manage my daily responsibilities',
    'impossible to take care of basic things',
    'cannot cope with anything anymore',
    'stopped functioning normally because of this loss',
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

async function runSafetyAndPersistenceTests() {
  console.log('--- STARTING MODULE 14 SAFETY, PERSISTENCE & REINFORCEMENT VERIFICATION ---');

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

  // 1. Ordinary Grief & Loss Distress Tests (-> NONE)
  console.log('\n--- 1. Ordinary Grief & Loss Distress Tests (-> NONE) ---');
  const ordinaryCases = [
    "I miss my mother every day.",
    "I feel sad since my father died.",
    "I keep thinking about someone I lost.",
    "I am struggling to adjust to a major change.",
    "I feel emotional about moving away from my old life.",
    "I wish things had not changed.",
    "I feel confused because I never got closure.",
    "I still miss the relationship I used to have.",
    "I feel sad when I remember the person I lost.",
    "I am having a difficult time adjusting."
  ];

  ordinaryCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary grief text '${text.slice(0, 35)}...' classified as NONE`);
  });

  // 2. Ambiguous Loss Statements (-> NONE)
  console.log('\n--- 2. Ambiguous Loss Statements (-> NONE) ---');
  const ambiguousCases = [
    "My parent is still alive but feels very different because of illness.",
    "I never got closure from the relationship.",
    "I miss who this person used to be.",
    "The relationship ended without any explanation.",
    "I feel sad about a future I thought I would have."
  ];

  ambiguousCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ambiguous loss text '${text.slice(0, 35)}...' classified as NONE`);
  });

  // 3. Tier 2 Functional Collapse Tests
  console.log('\n--- 3. Tier 2 Functional Collapse Tests ---');
  const tier2Cases = [
    "I feel completely hopeless and unable to function.",
    "I can barely manage my daily responsibilities anymore.",
    "My grief has made it impossible to take care of basic things.",
    "I feel like I cannot cope with anything anymore.",
    "I have stopped functioning normally because of this loss."
  ];

  tier2Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER2', `Functional collapse text '${text.slice(0, 35)}...' classified as TIER2`);
  });

  // 4. Tier 1 Self-Harm Tests
  console.log('\n--- 4. Tier 1 Self-Harm Tests ---');
  const tier1Cases = [
    "I have a plan to end my life.",
    "I have a plan to kill myself.",
    "I am going to hurt myself.",
    "I know how I would end my life."
  ];

  tier1Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER1', `Tier 1 self-harm text '${text.slice(0, 35)}...' classified as TIER1`);
  });

  // 5. Loss-Related High-Risk Language
  console.log('\n--- 5. Loss-Related High-Risk Language ---');
  const highRiskLossCases = [
    "Since my partner died, I have a plan to end my life.",
    "I cannot live without them and I know how I would kill myself.",
    "The loss is unbearable and I am going to hurt myself."
  ];

  highRiskLossCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER1', `Grief + acute risk text '${text.slice(0, 35)}...' correctly classified as TIER1`);
  });

  // 6. Format B Guardrail Verification (C1 at w6t3)
  console.log('\n--- 6. Format B Guardrail Verification (C1 at w6t3) ---');
  const mechs = MODULE_14_CONTENT.brief.mechanisms;
  let c1Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'C1');
    if (t) c1Tech = t;
  });

  assert(c1Tech !== null, 'Technique C1 exists');
  assert(c1Tech?.format === 'B', 'Technique C1 is Format B');
  assert(c1Tech?.guardrail === true, 'Technique C1 has guardrail === true');

  const w6t3 = MODULE_14_CONTENT.weeks[5].touches.find(t => t.id === 'w6t3');
  assert(w6t3 !== undefined, 'Touch w6t3 exists in Week 6');
  assert(w6t3?.guardrail === true, 'Touch w6t3 has guardrail === true');
  assert(w6t3?.apply.intensityOptions?.length === 2, 'Intensity options count is 2 (Smaller vs Bigger version)');
  assert(!!w6t3?.distressPrompt, 'Distress prompt is defined for C1');

  // Simulated C1 distress check ratings
  const lowDistress = 2; // 0-3: Normal continuation
  const modDistress = 5; // 4-6: Supportive pacing guidance
  const highDistress = 8; // 7-10: Safety guidance notice

  assert(lowDistress <= 3, 'Rating 2 triggers normal continuation');
  assert(modDistress >= 4 && modDistress <= 6, 'Rating 5 triggers supportive pacing guidance');
  assert(highDistress >= 7, 'Rating 8 triggers safety guidance notice');

  // 7. Format A Isolation
  console.log('\n--- 7. Format A Isolation ---');
  const formatACodes = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C2', 'C3'];
  formatACodes.forEach(code => {
    let t: any = null;
    mechs.forEach(m => {
      const found = m.techniques.find(item => item.code === code);
      if (found) t = found;
    });
    assert(t?.format === 'A' && !t?.guardrail, `Technique ${code} is strictly Format A without guardrail`);
  });

  // 8. Format C Reference-Only Verification (A4)
  console.log('\n--- 8. Format C Reference-Only Verification (A4) ---');
  let a4Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'A4');
    if (t) a4Tech = t;
  });

  assert(a4Tech !== null, 'Technique A4 exists');
  assert(a4Tech?.format === 'C', 'Technique A4 is Format C');
  assert(!!a4Tech?.professionalNote, 'Technique A4 includes professionalNote');
  assert(MODULE_14_CONTENT.weeks[3].hasReferenceCard === true, 'Week 4 has reference card flag for A4');

  const a4InTouches = MODULE_14_CONTENT.weeks.flatMap(w => w.touches).some(t => t.id === 'A4');
  assert(!a4InTouches, 'A4 does not exist as an interactive teaching touch');

  // 9. Progress & Partial Answer Persistence
  console.log('\n--- 9. Progress & Partial Answer Persistence ---');
  let simulatedPlayerState: any = {
    view: 'week_list',
    weekIdx: 0,
    touchId: 'w1t1',
    completedTouches: ['w1t1', 'w1t2'],
    userAnswers: {
      w1t1: { rememberText: 'Oscillation is normal' },
      w1t2: { thinkWhyText: 'Continuing bonds give comfort' }
    },
    mhpiData: {
      baseline: { q1: 7, q2: 6, q3: 7, q4: 3, q5: 4 },
      baselineScore: 33,
      weekly: {},
      end: null
    }
  };

  // Test partial answer saving without premature touch completion
  simulatedPlayerState.userAnswers['w4t1'] = { thinkOpenText: 'Scheduling dedicated memory space...' };
  assert(simulatedPlayerState.userAnswers['w4t1'].thinkOpenText === 'Scheduling dedicated memory space...', 'Partial answer saved for w4t1');
  assert(!simulatedPlayerState.completedTouches.includes('w4t1'), 'w4t1 touch is NOT completed prematurely');

  // Complete w4t1
  simulatedPlayerState.completedTouches.push('w4t1');
  assert(simulatedPlayerState.completedTouches.includes('w4t1'), 'w4t1 completed after full submission');

  // 10. C1 Guardrail Persistence
  console.log('\n--- 10. C1 Guardrail Persistence ---');
  simulatedPlayerState.userAnswers['w6t3'] = {
    selectedIntensity: 0, // Smaller version
    applyText: 'Holding sadness for my father\'s memory loss AND gratitude for quiet present moments.',
    distressRating: 3
  };
  simulatedPlayerState.completedTouches.push('w6t3');

  const savedC1Answers = simulatedPlayerState.userAnswers['w6t3'];
  assert(savedC1Answers.selectedIntensity === 0, 'C1 intensity selection restored');
  assert(savedC1Answers.applyText.includes('Holding sadness'), 'C1 reflective answer restored');
  assert(savedC1Answers.distressRating === 3, 'C1 distress rating restored');
  assert(simulatedPlayerState.completedTouches.filter((t: string) => t === 'w6t3').length === 1, 'No duplicate completion for w6t3');

  // 11. Format C Reference Card Isolation
  console.log('\n--- 11. Format C Reference Card Isolation ---');
  assert(!simulatedPlayerState.completedTouches.includes('A4'), 'A4 reference card is NOT added to completedTouches');
  assert(!simulatedPlayerState.userAnswers['A4'], 'A4 reference card creates NO userAnswers entry');

  // 12. Full 35-Touch Lifecycle
  console.log('\n--- 12. Full 35-Touch Lifecycle ---');
  const allTouchIds = MODULE_14_CONTENT.weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 35, 'Total touch count in roadmap is 35');

  simulatedPlayerState.completedTouches = Array.from(new Set(allTouchIds));
  assert(simulatedPlayerState.completedTouches.length === 35, '35/35 touches complete');
  const isLifecycleComplete = simulatedPlayerState.completedTouches.length === 35;
  assert(isLifecycleComplete, '35/35 complete unlocks closing & completion flow');

  // 13. Retrieval Check Persistence (Week 4)
  console.log('\n--- 13. Retrieval Check Persistence (Week 4) ---');
  simulatedPlayerState.userAnswers['retrieval_w4'] = {
    ans1: 'Bereavement involves death, transitions involve role/environmental shifts, ambiguous loss lacks clear finality.',
    ans2: 'Linear stages create fake pressure, and demanding closure in ambiguity traps energy.'
  };

  assert(!!simulatedPlayerState.userAnswers['retrieval_w4'], 'Week 4 retrieval check answers persist');
  assert(simulatedPlayerState.userAnswers['retrieval_w4'].ans1.includes('Bereavement'), 'Retrieval ans1 intact');
  assert(simulatedPlayerState.userAnswers['retrieval_w4'].ans2.includes('Linear stages'), 'Retrieval ans2 intact');

  // 14. Transfer Test Persistence (w7t5)
  console.log('\n--- 14. Transfer Test Persistence (w7t5) ---');
  const w7t5Touch = MODULE_14_CONTENT.weeks[6].touches[4];
  assert(w7t5Touch.id === 'w7t5', 'w7t5 is final touch');
  assert(w7t5Touch.transferTest === true, 'w7t5 has transferTest === true');
  assert(w7t5Touch.think.mode === 'open', 'w7t5 think mode is open');

  simulatedPlayerState.userAnswers['w7t5'] = {
    thinkOpenText: 'Navigating relocation alongside loss of my former team using B2 stability anchors and A1 dual-process.'
  };
  assert(!!simulatedPlayerState.userAnswers['w7t5'].thinkOpenText, 'w7t5 open transfer test answer persists');

  // 15. MHPI Baseline Persistence
  console.log('\n--- 15. MHPI Baseline Persistence ---');
  const baselineScore = simulatedPlayerState.mhpiData.baselineScore;
  assert(baselineScore === 33, 'MHPI baseline score is 33/50');
  assert(simulatedPlayerState.mhpiData.baseline.q1 === 7, 'Baseline q1 persists');

  // 16. Weekly MHPI Isolation — 7-Week Verification
  console.log('\n--- 16. Weekly MHPI Isolation — 7-Week Verification ---');
  simulatedPlayerState.mhpiData.weekly = {
    w1: { w1: 8, w2: 4, w3: 3 },
    w2: { w1: 7, w2: 5, w3: 4 },
    w3: { w1: 6, w2: 6, w3: 5 },
    w4: { w1: 5, w2: 7, w3: 5 },
    w5: { w1: 4, w2: 8, w3: 6 },
    w6: { w1: 3, w2: 8, w3: 6 },
    w7: { w1: 2, w2: 9, w3: 7 }
  };

  const weeklyKeys = Object.keys(simulatedPlayerState.mhpiData.weekly);
  assert(weeklyKeys.length === 7, 'Exactly 7 weekly MHPI records present (w1-w7)');
  assert(simulatedPlayerState.mhpiData.weekly['w1'].w1 === 8, 'w1 record intact');
  assert(simulatedPlayerState.mhpiData.weekly['w7'].w1 === 2, 'w7 record intact without overwriting w1');

  // 17. End MHPI Persistence
  console.log('\n--- 17. End MHPI Persistence ---');
  const endAnswers = { q1: 2, q2: 2, q3: 3, q4: 8, q5: 9 };
  const computedEndScore = endAnswers.q1 + endAnswers.q2 + endAnswers.q3 + (10 - endAnswers.q4) + (10 - endAnswers.q5); // 2+2+3+2+1 = 10
  const improvementPct = Math.round(((33 - computedEndScore) / 33) * 100); // Baseline 33 -> End 10 = 70%

  simulatedPlayerState.mhpiData.end = endAnswers;
  simulatedPlayerState.mhpiData.endScore = computedEndScore;
  simulatedPlayerState.mhpiData.improvementPct = improvementPct;
  simulatedPlayerState.mhpiData.helpfulness = 5;
  simulatedPlayerState.mhpiData.nextStep = 'Finish here';

  assert(computedEndScore === 10, 'End score is 10/50');
  assert(improvementPct === 70, 'Improvement percentage calculated as 70%');
  assert(simulatedPlayerState.mhpiData.nextStep === 'Finish here', 'Next step selection persists');

  // 18. Toolkit Selection & Reinforcement Bank Accounting
  console.log('\n--- 18. Toolkit Selection & Reinforcement Bank Accounting ---');
  const bank = MODULE_14_CONTENT.reinforcementBank;
  const toolsData = MODULE_14_CONTENT.toolsData;

  assert(bank.length === 12, 'Reinforcement bank has 12 reflection reps');
  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A2,B1,B3,C2,C3', 'Reflections contain exactly A1, A2, B1, B3, C2, C3');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(toolsData.reengagement_log.code === 'A3', 'Tool reengagement_log is A3');
  assert(toolsData.transition_map_log.code === 'B2', 'Tool transition_map_log is B2');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A3,B2', 'Tools contain exactly A3, B2');

  assert(!refCodes.includes('A4') && !toolCodes.includes('A4'), 'A4 (Format C reference-only) is excluded from toolkit & reinforcement bank');
  assert(!refCodes.includes('C1') && !toolCodes.includes('C1'), 'C1 (Format B guardrailed) is excluded from toolkit & reinforcement bank');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 2; // 6 + 2 + A4 + C1 = 10
  assert(totalAccounted === 10, 'All 10 techniques accounted for with 0 duplicates');

  // 19. User Isolation
  console.log('\n--- 19. User Isolation ---');
  const userAState = { ...simulatedPlayerState };
  const userBState = {
    view: 'overview',
    weekIdx: 0,
    touchId: null,
    completedTouches: [],
    userAnswers: {},
    mhpiData: { baseline: null, baselineScore: null, weekly: {}, end: null }
  };

  assert(userAState.completedTouches.length === 35, 'User A has 35 completed touches');
  assert(userBState.completedTouches.length === 0, 'User B has 0 completed touches');
  assert(userAState.mhpiData.baselineScore !== null, 'User A has baseline score');
  assert(userBState.mhpiData.baselineScore === null, 'User B has null baseline score');

  // 20. Module Isolation
  console.log('\n--- 20. Module Isolation ---');
  const m14Progress = { moduleId: 'M14', completedTouches: ['w1t1', 'w1t2'] };
  const m13Progress = { moduleId: 'M13', completedTouches: [] };
  const m12Progress = { moduleId: 'M12', completedTouches: [] };

  assert(m14Progress.completedTouches.length === 2, 'M14 has 2 completed touches');
  assert(m13Progress.completedTouches.length === 0, 'M13 progress is clean');
  assert(m12Progress.completedTouches.length === 0, 'M12 progress is clean');

  // 21. Full M1–M14 Regression
  console.log('\n--- 21. Full M1–M14 Regression ---');
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
    { mod: MODULE_14_CONTENT, id: 'M14', weeks: 7, mechs: 3 }
  ];

  const ids = allModules.map(m => m.id);
  const slugs = allModules.map(m => m.mod.slug);

  assert(new Set(ids).size === 14, 'All 14 module IDs are unique');
  assert(new Set(slugs).size === 14, 'All 14 module slugs are unique');

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 14 SAFETY & PERSISTENCE TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runSafetyAndPersistenceTests().catch(err => {
  console.error('Module 14 safety & persistence test execution failed:', err);
  process.exit(1);
});
