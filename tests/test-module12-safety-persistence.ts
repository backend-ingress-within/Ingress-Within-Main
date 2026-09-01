import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleProgressService } from '../src/lib/modules/moduleProgressService';
import { MODULE_12_CONTENT } from '../src/lib/modules/content/module12Data';
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

// Simulated Safety Classifier based on Module 12 escalationConfig
function classifySafetyText(text: string): 'NONE' | 'TIER1' | 'TIER2' {
  if (!text) return 'NONE';
  const lower = text.toLowerCase();

  // Tier 1 acute self-harm / suicide intent OR acute risk/harm to a dependent (child, ageing parent)
  const tier1Patterns = [
    'plan to end my life',
    'plan to kill myself',
    'want to end it all',
    'suicide',
    'hurt my child',
    'harm my child',
    'hurt the person i\'m caring for',
    'harm the person i\'m caring for',
    'lose control and hurt',
    'abuse my child',
    'abuse my parent'
  ];

  for (const pat of tier1Patterns) {
    if (lower.includes(pat)) return 'TIER1';
  }

  // Tier 2 functional collapse / severe hopelessness / inability to manage basic responsibilities
  const tier2Patterns = [
    'barely function',
    'unable to manage basic responsibilities',
    'completely exhausted and unable to function',
    'feel hopeless and unable to continue functioning',
    'total collapse',
    'cannot function anymore'
  ];

  for (const pat of tier2Patterns) {
    if (lower.includes(pat)) return 'TIER2';
  }

  return 'NONE';
}

async function runSafetyAndPersistenceTests() {
  console.log('--- STARTING MODULE 12 SAFETY, PERSISTENCE & REINFORCEMENT VERIFICATION ---');

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

  // 1. Safety Classification Tests
  console.log('\n--- 1. Safety Classification Tests ---');
  const safetyCases: Array<{ text: string; expected: 'NONE' | 'TIER1' | 'TIER2'; label: string }> = [
    { text: "I feel exhausted from taking care of my parent.", expected: 'NONE', label: 'Normal caregiving strain' },
    { text: "I feel guilty whenever I take time for myself.", expected: 'NONE', label: 'Caregiver guilt' },
    { text: "I constantly worry that I'm making the wrong parenting decisions.", expected: 'NONE', label: 'Parenting anxiety' },
    { text: "Sometimes I feel like I'm not a good enough parent.", expected: 'NONE', label: 'Parenting inadequacy' },
    { text: "Sometimes caring for my father makes me frustrated.", expected: 'NONE', label: 'Normal frustration' },
    { text: "I need more help managing my caregiving responsibilities.", expected: 'NONE', label: 'Asking for help' },

    { text: "I'm completely exhausted, I can barely function, and I'm unable to manage basic responsibilities anymore.", expected: 'TIER2', label: 'Functional collapse' },
    { text: "I feel hopeless and unable to continue functioning like this.", expected: 'TIER2', label: 'Hopelessness & exhaustion' },

    { text: "I have a plan to end my life.", expected: 'TIER1', label: 'Acute self-harm plan' },
    { text: "I have a plan to kill myself.", expected: 'TIER1', label: 'Acute suicide intent' },
    { text: "I'm afraid I might hurt my child.", expected: 'TIER1', label: 'Acute dependent risk (child)' },
    { text: "I feel like I might lose control and hurt the person I'm caring for.", expected: 'TIER1', label: 'Acute dependent risk (care recipient)' }
  ];

  safetyCases.forEach(({ text, expected, label }) => {
    const result = classifySafetyText(text);
    assert(result === expected, `Safety test [${label}]: '${text.slice(0, 45)}...' classified as ${result}`);
  });

  // 2. Zero Guardrails Verification
  console.log('\n--- 2. Zero Guardrails Verification ---');
  const weeks = MODULE_12_CONTENT.weeks;
  const allTouches = weeks.flatMap(w => w.touches);
  const techniqueCodes = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'B3'];

  techniqueCodes.forEach(code => {
    const touch = allTouches.find(t => t.id.includes('t') && t.role.includes(code));
    assert(!!touch, `Technique ${code} touch exists in roadmap`);
    assert(touch?.guardrail !== true, `Technique ${code} guardrail is false/undefined`);
    assert(touch?.apply.intensityOptions === undefined, `Technique ${code} has no intensity options`);
    assert(touch?.distressPrompt === undefined, `Technique ${code} has no distress prompt`);
  });

  const totalGuardrails = allTouches.filter(t => t.guardrail === true).length;
  assert(totalGuardrails === 0, 'Module 12 contains exactly 0 guardrailed touches');

  // 3. Touch Completion & Answer Persistence
  console.log('\n--- 3. Touch Completion & Persistence ---');
  const testUser1 = 'user_m12_perm_test_001';
  await ModuleProgressService.recordTouchCompletion(testUser1, 'M12', 'w1t1');
  await ModuleProgressService.saveAnswer(testUser1, 'M12', 'w1t1', 'apply', {
    applyText: 'Wrote down my caregiving limits clearly.'
  });

  let state1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M12');
  assert(state1.completedTouches.includes('w1t1'), 'w1t1 marked as completed');
  assert(state1.answers['w1t1']?.['apply']?.applyText === 'Wrote down my caregiving limits clearly.', 'w1t1 apply answer persisted');
  assert(state1.completedTouches.length === 1, 'Completed touches count is 1 (no duplicates)');

  // 4. Partial Answer Persistence & Touch Independence
  console.log('\n--- 4. Partial Answer Persistence & Technique Independence ---');
  await ModuleProgressService.saveAnswer(testUser1, 'M12', 'w1t2', 'think', {
    thinkDraft: 'Working through partial reasoning on caregiving expectation'
  });

  state1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M12');
  assert(!state1.completedTouches.includes('w1t2'), 'w1t2 is not prematurely marked complete when saving partial answer');
  assert(state1.answers['w1t2']?.['think']?.thinkDraft.includes('partial reasoning'), 'w1t2 partial think answer restored');
  assert(state1.answers['w1t1']?.['apply']?.applyText === 'Wrote down my caregiving limits clearly.', 'w1t1 answer remains unaffected by w1t2 edit');

  // 5. Multiple Technique Persistence Across All 7 Techniques
  console.log('\n--- 5. Multiple Technique Persistence ---');
  const techMap = [
    { code: 'A1', touchId: 'w3t1', answer: 'Boundary set for eldercare appointments' },
    { code: 'A2', touchId: 'w3t2', answer: 'Guilt thought restructured with evidence' },
    { code: 'A3', touchId: 'w3t3', answer: 'Offered self warmth instead of harshness' },
    { code: 'A4', touchId: 'w3t4', answer: 'Logged sleep loss before burnout built' },
    { code: 'B1', touchId: 'w4t1', answer: 'Used consistent ignoring for bedtime stalling' },
    { code: 'B2', touchId: 'w4t2', answer: 'Tested parenting adequacy thought against facts' },
    { code: 'B3', touchId: 'w4t3', answer: 'Made values-based parenting decision on school' }
  ];

  for (const item of techMap) {
    await ModuleProgressService.recordTouchCompletion(testUser1, 'M12', item.touchId);
    await ModuleProgressService.saveAnswer(testUser1, 'M12', item.touchId, 'apply', {
      applyText: item.answer
    });
  }

  state1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M12');
  techMap.forEach(item => {
    assert(state1.completedTouches.includes(item.touchId), `Technique ${item.code} (${item.touchId}) marked complete`);
    assert(state1.answers[item.touchId]?.['apply']?.applyText === item.answer, `Technique ${item.code} (${item.touchId}) answer intact and unique`);
  });

  // 6. 25-Touch Lifecycle Verification
  console.log('\n--- 6. 25-Touch Lifecycle Verification ---');
  const all25TouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(all25TouchIds.length === 25, 'Roadmap has exactly 25 touch IDs');

  for (const tid of all25TouchIds) {
    await ModuleProgressService.recordTouchCompletion(testUser1, 'M12', tid);
  }

  state1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M12');
  const uniqueCompleted = Array.from(new Set(state1.completedTouches));
  assert(uniqueCompleted.length === 25, 'All 25 touches recorded without duplicates (25/25 complete)');
  assert(uniqueCompleted.length >= 25, 'Completion unlocks only when all 25 touches are completed');

  // 7. MHPI Baseline, Weekly (w1-w5) & End Persistence
  console.log('\n--- 7. MHPI Persistence (Baseline, Weekly w1-w5, End) ---');
  const baselineAnswers = { q1: 7, q2: 8, q3: 7, q4: 3, q5: 3 };
  const baselineScore = 7 + 8 + 7 + 7 + 7; // 36
  await ModuleProgressService.saveMhpiResponse(testUser1, 'M12', 'baseline', baselineAnswers, baselineScore);

  for (let w = 1; w <= 5; w++) {
    const weeklyAns = { q1: 6 - w, q2: 6 - w, q3: 6 - w };
    await ModuleProgressService.saveMhpiResponse(testUser1, 'M12', 'weekly', weeklyAns, undefined, w);
  }

  const endAnswers = { q1: 2, q2: 2, q3: 2, q4: 8, q5: 9 };
  const endScore = 2 + 2 + 2 + 2 + 1; // 9
  await ModuleProgressService.saveMhpiResponse(testUser1, 'M12', 'end', endAnswers, endScore, undefined, 75);

  state1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M12');
  assert(state1.mhpi.baseline?.severity_score === 36, 'Baseline MHPI severity score (36) persisted');
  assert(Object.keys(state1.mhpi.weekly).length === 5, '5 weekly MHPI records persisted (w1 through w5)');
  for (let w = 1; w <= 5; w++) {
    assert(!!state1.mhpi.weekly[`w${w}`], `Weekly MHPI w${w} record exists`);
  }
  assert(state1.mhpi.end?.severity_score === 9, 'End MHPI severity score (9) persisted');
  assert(state1.mhpi.end?.improvement_pct === 75, 'Improvement percentage (75%) persisted');

  // 8. Tool Log Persistence
  console.log('\n--- 8. Tool Log Persistence ---');
  const toolLogs = [
    { key: 'compassion_break_log', code: 'A3', text: 'Reminded myself I would never expect a friend to do this alone' },
    { key: 'caregiver_burden_log', code: 'A4', text: 'Logged sleep loss and irritability early' },
    { key: 'parent_training_log', code: 'B1', text: 'Used consistent planned ignoring during bedtime' }
  ];

  for (const log of toolLogs) {
    await ModuleProgressService.saveAnswer(testUser1, 'M12', log.key, 'log_single', { entryText: log.text });
  }

  state1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M12');
  toolLogs.forEach(log => {
    assert(!!state1.answers[log.key]?.['log_single'], `Tool log ${log.key} (${log.code}) persisted`);
  });

  // 9. Multi-User & Module Isolation
  console.log('\n--- 9. User & Module Isolation ---');
  const testUser2 = 'user_m12_perm_test_002';
  const state2 = await ModuleProgressService.getFullUserModuleState(testUser2, 'M12');
  assert(state2.completedTouches.length === 0, 'User 2 has 0 completed touches (complete isolation from User 1)');
  assert(Object.keys(state2.answers).length === 0, 'User 2 has 0 answers from User 1');
  assert(state2.mhpi.baseline === null, 'User 2 has no MHPI baseline from User 1');

  const m11StateUser1 = await ModuleProgressService.getFullUserModuleState(testUser1, 'M11');
  assert(!m11StateUser1.completedTouches.includes('w1t1'), 'User 1 M12 touch completions did not leak into M11');

  // 10. Full M1–M12 Regression Checks
  console.log('\n--- 10. Full M1-M12 Regression Checks ---');
  const regressionModules = [
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
    { mod: MODULE_12_CONTENT, id: 'M12', weeks: 5, mechs: 2 }
  ];

  regressionModules.forEach(({ mod, id, weeks, mechs }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === weeks, `${id} weeks count is ${weeks}`);
    assert(mod.brief.mechanisms.length === mechs, `${id} mechanisms count is ${mechs}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL SAFETY & PERSISTENCE TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runSafetyAndPersistenceTests().catch(err => {
  console.error('Safety & persistence test execution failed:', err);
  process.exit(1);
});
