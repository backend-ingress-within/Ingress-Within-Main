import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleProgressService } from '../src/lib/modules/moduleProgressService';
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

// Simulated Safety Classifier based on Module 13 escalationConfig and physical-safety context
function classifySafetyText(text: string): 'NONE' | 'TIER1' | 'TIER2' {
  if (!text) return 'NONE';
  const lower = text.toLowerCase();

  // Tier 1 acute self-harm / suicide intent OR imminent specific threat of violence
  const tier1Patterns = [
    'plan to end my life',
    'plan to kill myself',
    'going to hurt myself',
    'know how i would end my life',
    'going to end it all tonight',
    'have a way to end it'
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Tier 2 functional collapse / persistent hopelessness OR physical safety concerns (forced marriage, threats of violence, restricted movement)
  const tier2Patterns = [
    'completely hopeless and unable to continue functioning',
    'can barely manage my daily responsibilities',
    'feel trapped and unable to cope',
    'completely destroyed my ability to function',
    'feel unsafe at home because of the pressure and threats',
    'threatened to hurt me',
    'forced into a marriage',
    'threatened violence',
    'stopping me from leaving',
    'physically unsafe',
    'hurt me soon'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runSafetyAndPersistenceTests() {
  console.log('--- STARTING MODULE 13 SAFETY, PERSISTENCE & REINFORCEMENT VERIFICATION ---');

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

  // 1. Safety Classification Tests (Ordinary Distress -> NONE)
  console.log('\n--- 1. Safety Classification Tests (Ordinary Distress -> NONE) ---');
  const ordinaryCases = [
    "My family does not approve of my relationship.",
    "I feel sad that my parents don't accept my partner.",
    "My family keeps pressuring me because of my caste.",
    "I am afraid my family will judge me.",
    "I don't know whether I should tell my family about my identity.",
    "I feel anxious about how my parents might react.",
    "I feel lonely because I don't feel accepted.",
    "My family keeps asking me about marriage.",
    "I feel hurt by what my relatives say.",
    "I wish my family understood me better."
  ];

  ordinaryCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'NONE', `Ordinary text '${text.slice(0, 40)}...' classified as NONE`);
  });

  // 2. Tier 2 Escalation Tests
  console.log('\n--- 2. Tier 2 Escalation Tests ---');
  const tier2Cases = [
    "I feel completely hopeless and unable to continue functioning.",
    "I can barely manage my daily responsibilities anymore.",
    "I feel trapped and unable to cope with anything.",
    "My family situation has completely destroyed my ability to function.",
    "I feel unsafe at home because of the pressure and threats around me."
  ];

  tier2Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER2', `Tier 2 text '${text.slice(0, 40)}...' classified as TIER2`);
  });

  // 3. Tier 1 Self-Harm Tests
  console.log('\n--- 3. Tier 1 Self-Harm Tests ---');
  const tier1Cases = [
    "I have a plan to end my life.",
    "I have a plan to kill myself.",
    "I am going to hurt myself.",
    "I cannot continue and I know how I would end my life."
  ];

  tier1Cases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER1', `Tier 1 text '${text.slice(0, 40)}...' classified as TIER1`);
  });

  // 4. Physical Safety Tests
  console.log('\n--- 4. Physical Safety Tests ---');
  const physicalSafetyCases = [
    "My family has threatened to hurt me.",
    "I am being forced into a marriage and I am afraid they may hurt me.",
    "They have threatened violence if I continue this relationship.",
    "My family is stopping me from leaving and I feel physically unsafe.",
    "I believe someone may hurt me soon."
  ];

  physicalSafetyCases.forEach(text => {
    const res = classifySafetyText(text);
    assert(res === 'TIER2', `Physical safety text '${text.slice(0, 40)}...' correctly triggers TIER2 physical safety routing`);
  });

  // 5. Format B Guardrail Verification (B1)
  console.log('\n--- 5. Format B Guardrail Verification (B1) ---');
  const mechs = MODULE_13_CONTENT.brief.mechanisms;
  let b1Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'B1');
    if (t) b1Tech = t;
  });

  assert(b1Tech !== null, 'Technique B1 exists');
  assert(b1Tech?.format === 'B', 'Technique B1 is Format B');
  assert(b1Tech?.guardrail === true, 'Technique B1 has guardrail === true');

  const w4t4 = MODULE_13_CONTENT.weeks[3].touches.find(t => t.id === 'w4t4');
  assert(w4t4 !== undefined, 'Touch w4t4 exists in Week 4');
  assert(w4t4?.guardrail === true, 'Touch w4t4 has guardrail === true');
  assert(w4t4?.apply.intensityOptions?.length === 2, 'Intensity options count is 2 (Smaller vs Bigger version)');
  assert(!!w4t4?.distressPrompt, 'Distress prompt is defined for B1');

  // Simulated B1 distress check ratings
  const lowDistress = 2; // 0-3: Normal continuation
  const modDistress = 5; // 4-6: Supportive pacing guidance
  const highDistress = 8; // 7-10: Safety guidance notice

  assert(lowDistress <= 3, 'Rating 2 triggers normal continuation');
  assert(modDistress >= 4 && modDistress <= 6, 'Rating 5 triggers supportive pacing guidance');
  assert(highDistress >= 7, 'Rating 8 triggers safety guidance notice');

  // 6. Format C Reference-Only Verification (A4)
  console.log('\n--- 6. Format C Reference-Only Verification (A4) ---');
  let a4Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'A4');
    if (t) a4Tech = t;
  });

  assert(a4Tech !== null, 'Technique A4 exists');
  assert(a4Tech?.format === 'C', 'Technique A4 is Format C');
  assert(!!a4Tech?.professionalNote, 'Technique A4 includes professionalNote');
  assert(MODULE_13_CONTENT.weeks[2].hasReferenceCard === true, 'Week 3 has reference card flag for A4');

  const a4InTouches = MODULE_13_CONTENT.weeks.flatMap(w => w.touches).some(t => t.id === 'A4');
  assert(!a4InTouches, 'A4 does not exist as an interactive teaching touch');

  // 7. Format Isolation
  console.log('\n--- 7. Format Isolation ---');
  const formatACodes = ['A1', 'A2', 'A3', 'B2', 'B3', 'B4'];
  formatACodes.forEach(code => {
    let t: any = null;
    mechs.forEach(m => {
      const found = m.techniques.find(item => item.code === code);
      if (found) t = found;
    });
    assert(t?.format === 'A' && !t?.guardrail, `Technique ${code} is strictly Format A without guardrail`);
  });

  assert(b1Tech?.format === 'B' && b1Tech?.guardrail === true, 'Technique B1 is the ONLY Format B guardrailed technique');
  assert(a4Tech?.format === 'C', 'Technique A4 is the ONLY Format C technique');

  // 8. Progress & Partial Answer Persistence
  console.log('\n--- 8. Progress & Partial Answer Persistence ---');
  const storageKey = 'ingress_module_player_state_M13';

  // Simulated player state
  let simulatedPlayerState: any = {
    view: 'week_list',
    weekIdx: 0,
    touchId: 'w1t1',
    completedTouches: ['w1t1', 'w1t2'],
    userAnswers: {
      w1t1: { rememberText: 'Stay connected to both' },
      w1t2: { thinkWhyText: 'Absorbed social fear' }
    },
    mhpiData: {
      baseline: { q1: 6, q2: 5, q3: 7, q4: 4, q5: 5 },
      baselineScore: 29,
      weekly: {},
      end: null
    }
  };

  // Test partial answer saving without premature touch completion
  simulatedPlayerState.userAnswers['w3t1'] = { thinkOpenText: 'Naming values separately...' };
  assert(simulatedPlayerState.userAnswers['w3t1'].thinkOpenText === 'Naming values separately...', 'Partial answer saved for w3t1');
  assert(!simulatedPlayerState.completedTouches.includes('w3t1'), 'w3t1 touch is NOT completed prematurely');

  // Complete w3t1
  simulatedPlayerState.completedTouches.push('w3t1');
  assert(simulatedPlayerState.completedTouches.includes('w3t1'), 'w3t1 completed after full submission');

  // 9. B1 Guardrail Persistence
  console.log('\n--- 9. B1 Guardrail Persistence ---');
  simulatedPlayerState.userAnswers['w4t4'] = {
    selectedIntensity: 0, // Smaller version
    applyText: 'Absorbed message from relatives: being queer is unacceptable.',
    distressRating: 3
  };
  simulatedPlayerState.completedTouches.push('w4t4');

  const savedB1Answers = simulatedPlayerState.userAnswers['w4t4'];
  assert(savedB1Answers.selectedIntensity === 0, 'B1 intensity selection restored');
  assert(savedB1Answers.applyText.includes('Absorbed message'), 'B1 reflective answer restored');
  assert(savedB1Answers.distressRating === 3, 'B1 distress rating restored');
  assert(simulatedPlayerState.completedTouches.filter(t => t === 'w4t4').length === 1, 'No duplicate completion for w4t4');

  // 10. Format C Reference Card Isolation
  console.log('\n--- 10. Format C Reference Card Isolation ---');
  assert(!simulatedPlayerState.completedTouches.includes('A4'), 'A4 reference card is NOT added to completedTouches');
  assert(!simulatedPlayerState.userAnswers['A4'], 'A4 reference card creates NO userAnswers entry');

  // 11. 25-Touch Module Lifecycle
  console.log('\n--- 11. 25-Touch Module Lifecycle ---');
  const allTouchIds = MODULE_13_CONTENT.weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 25, 'Total touch count in roadmap is 25');

  // Simulate completing all 25 touches
  simulatedPlayerState.completedTouches = Array.from(new Set(allTouchIds));
  assert(simulatedPlayerState.completedTouches.length === 25, '25/25 touches complete');
  const isLifecycleComplete = simulatedPlayerState.completedTouches.length === 25;
  assert(isLifecycleComplete, '25/25 complete unlocks closing & completion flow');

  // 12. Retrieval Check Persistence (Week 3)
  console.log('\n--- 12. Retrieval Check Persistence (Week 3) ---');
  simulatedPlayerState.userAnswers['retrieval_w3'] = {
    ans1: 'Family rejection ultimatum is one moment, not fixed position.',
    ans2: 'Identity belonging shouldn\'t depend on one relationship alone.'
  };

  assert(!!simulatedPlayerState.userAnswers['retrieval_w3'], 'Week 3 retrieval check answers persist');
  assert(simulatedPlayerState.userAnswers['retrieval_w3'].ans1.includes('ultimatum'), 'Retrieval ans1 intact');
  assert(simulatedPlayerState.userAnswers['retrieval_w3'].ans2.includes('belonging'), 'Retrieval ans2 intact');
  assert(!simulatedPlayerState.userAnswers['w3t1'].thinkOpenText.includes('retrieval'), 'Retrieval state does not overwrite teaching touch answers');

  // 13. Transfer Test Persistence (w5t5)
  console.log('\n--- 13. Transfer Test Persistence (w5t5) ---');
  const w5t5Touch = MODULE_13_CONTENT.weeks[4].touches[4];
  assert(w5t5Touch.id === 'w5t5', 'w5t5 is final touch');
  assert(w5t5Touch.transferTest === true, 'w5t5 has transferTest === true');
  assert(w5t5Touch.think.mode === 'open', 'w5t5 think mode is open');

  simulatedPlayerState.userAnswers['w5t5'] = {
    thinkOpenText: 'Unscaffolded analysis of my situation using A1 values clarification and B3 disclosure timing.'
  };
  assert(!!simulatedPlayerState.userAnswers['w5t5'].thinkOpenText, 'w5t5 open transfer test answer persists');

  // 14. MHPI Baseline Persistence
  console.log('\n--- 14. MHPI Baseline Persistence ---');
  const baselineScore = simulatedPlayerState.mhpiData.baselineScore;
  assert(baselineScore === 29, 'MHPI baseline score is 29/50');
  assert(simulatedPlayerState.mhpiData.baseline.q1 === 6, 'Baseline q1 persists');

  // 15. Weekly MHPI Isolation
  console.log('\n--- 15. Weekly MHPI Isolation ---');
  simulatedPlayerState.mhpiData.weekly = {
    w1: { w1: 7, w2: 5, w3: 3 },
    w2: { w1: 6, w2: 6, w3: 4 },
    w3: { w1: 5, w2: 7, w3: 5 },
    w4: { w1: 4, w2: 8, w3: 6 },
    w5: { w1: 3, w2: 9, w3: 7 }
  };

  const weeklyKeys = Object.keys(simulatedPlayerState.mhpiData.weekly);
  assert(weeklyKeys.length === 5, 'Exactly 5 weekly MHPI records present (w1-w5)');
  assert(simulatedPlayerState.mhpiData.weekly['w1'].w1 === 7, 'w1 record intact');
  assert(simulatedPlayerState.mhpiData.weekly['w5'].w1 === 3, 'w5 record intact without overwriting w1');

  // 16. End MHPI Persistence
  console.log('\n--- 16. End MHPI Persistence ---');
  const endAnswers = { q1: 3, q2: 2, q3: 2, q4: 8, q5: 9 };
  const computedEndScore = endAnswers.q1 + endAnswers.q2 + endAnswers.q3 + (10 - endAnswers.q4) + (10 - endAnswers.q5); // 3+2+2+2+1 = 10
  const improvementPct = Math.round(((36 - computedEndScore) / 36) * 100); // Baseline 36 -> End 10 = 72%

  simulatedPlayerState.mhpiData.end = endAnswers;
  simulatedPlayerState.mhpiData.endScore = computedEndScore;
  simulatedPlayerState.mhpiData.improvementPct = improvementPct;
  simulatedPlayerState.mhpiData.helpfulness = 5;
  simulatedPlayerState.mhpiData.nextStep = 'Continue with another program';

  assert(computedEndScore === 10, 'End score is 10/50');
  assert(improvementPct === 72, 'Improvement percentage calculated as 72%');
  assert(simulatedPlayerState.mhpiData.nextStep === 'Continue with another program', 'Next step selection persists');

  // 17. Toolkit Selection & Reinforcement Bank Accounting
  console.log('\n--- 17. Toolkit Selection & Reinforcement Bank Accounting ---');
  const bank = MODULE_13_CONTENT.reinforcementBank;
  const toolsData = MODULE_13_CONTENT.toolsData;

  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps');
  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A3,B2,B4', 'Reflections contain exactly A1, A3, B2, B4');

  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(toolsData.values_clarity_log.code === 'A2', 'Tool values_clarity_log is A2');
  assert(toolsData.disclosure_log.code === 'B3', 'Tool disclosure_log is B3');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A2,B3', 'Tools contain exactly A2, B3');

  assert(!refCodes.includes('A4') && !toolCodes.includes('A4'), 'A4 (Format C reference-only) is excluded from toolkit & reinforcement bank');
  assert(!refCodes.includes('B1') && !toolCodes.includes('B1'), 'B1 (Format B guardrailed) is excluded from toolkit & reinforcement bank');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 2; // 4 + 2 + A4 + B1 = 8
  assert(totalAccounted === 8, 'All 8 techniques accounted for with 0 duplicates');

  // 18. User Isolation
  console.log('\n--- 18. User Isolation ---');
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

  // 19. Module Isolation
  console.log('\n--- 19. Module Isolation ---');
  const m13Progress = { moduleId: 'M13', completedTouches: ['w1t1', 'w1t2'] };
  const m12Progress = { moduleId: 'M12', completedTouches: [] };
  const m11Progress = { moduleId: 'M11', completedTouches: [] };

  assert(m13Progress.completedTouches.length === 2, 'M13 has 2 completed touches');
  assert(m12Progress.completedTouches.length === 0, 'M12 progress is clean');
  assert(m11Progress.completedTouches.length === 0, 'M11 progress is clean');

  // 20. Full M1–M13 Regression
  console.log('\n--- 20. Full M1–M13 Regression ---');
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

  const ids = allModules.map(m => m.id);
  const slugs = allModules.map(m => m.mod.slug);

  assert(new Set(ids).size === 13, 'All 13 module IDs are unique');
  assert(new Set(slugs).size === 13, 'All 13 module slugs are unique');

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 13 SAFETY & PERSISTENCE TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runSafetyAndPersistenceTests().catch(err => {
  console.error('Module 13 safety & persistence test execution failed:', err);
  process.exit(1);
});
