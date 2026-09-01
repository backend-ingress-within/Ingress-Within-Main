import { MODULE_11_CONTENT } from '../src/lib/modules/content/module11Data';

console.log('--- STARTING MODULE 11 CONTENT FOUNDATION VALIDATION ---');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, message: string) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`✓ [PASS] ${message}`);
  } else {
    console.error(`✗ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
}

// 1. Identity Validation
console.log('\n--- 1. Identity Validation ---');
assert(MODULE_11_CONTENT.moduleId === 'M11', 'Module ID is M11');
assert(MODULE_11_CONTENT.slug === 'conflict-communication', 'Slug is conflict-communication');
assert(MODULE_11_CONTENT.name === 'Conflict & Communication', 'Name is Conflict & Communication');
assert(MODULE_11_CONTENT.duration_weeks === 9, 'Duration is 9 weeks');

// 2. Mechanisms Validation
console.log('\n--- 2. Mechanisms Validation ---');
const brief = MODULE_11_CONTENT.brief;
assert(brief.mechanisms.length === 4, 'Exactly 4 mechanisms');

const [mechaA, mechaB, mechaC, mechaD] = brief.mechanisms;

// Mech A: Feeling Misunderstood
assert(mechaA.key === 'A', 'Mechanism A key is A');
assert(mechaA.name === 'Feeling Misunderstood', 'Mechanism A name matches');
assert(mechaA.short === 'Misunderstood', 'Mechanism A short matches');
assert(!!mechaA.def, 'Mechanism A has definition');
assert(!!mechaA.need, 'Mechanism A has underlying need');
assert(mechaA.contrast.who === 'Diya', 'Mechanism A contrast character is Diya');
assert(mechaA.techniques.length === 4, 'Mechanism A has 4 techniques (3 practicable + 1 format C)');

// Mech B: Frequent Arguments
assert(mechaB.key === 'B', 'Mechanism B key is B');
assert(mechaB.name === 'Frequent Arguments', 'Mechanism B name matches');
assert(mechaB.short === 'Frequent Arguments', 'Mechanism B short matches');
assert(!!mechaB.def, 'Mechanism B has definition');
assert(!!mechaB.need, 'Mechanism B has underlying need');
assert(mechaB.contrast.who === 'Ritu', 'Mechanism B contrast character is Ritu');
assert(mechaB.techniques.length === 4, 'Mechanism B has 4 techniques');

// Mech C: Joint Family / In-Law Conflict
assert(mechaC.key === 'C', 'Mechanism C key is C');
assert(mechaC.name === 'Joint Family / In-Law Conflict', 'Mechanism C name matches');
assert(mechaC.short === 'In-Law Conflict', 'Mechanism C short matches');
assert(!!mechaC.def, 'Mechanism C has definition');
assert(!!mechaC.need, 'Mechanism C has underlying need');
assert(mechaC.contrast.who === 'Nandini', 'Mechanism C contrast character is Nandini');
assert(mechaC.techniques.length === 3, 'Mechanism C has 3 techniques');

// Mech D: Sibling Conflict
assert(mechaD.key === 'D', 'Mechanism D key is D');
assert(mechaD.name === 'Sibling Conflict', 'Mechanism D name matches');
assert(mechaD.short === 'Sibling Conflict', 'Mechanism D short matches');
assert(!!mechaD.def, 'Mechanism D has definition');
assert(!!mechaD.need, 'Mechanism D has underlying need');
assert(mechaD.contrast.who === 'Amit', 'Mechanism D contrast character is Amit');
assert(mechaD.techniques.length === 3, 'Mechanism D has 3 techniques');

// 3. Technique Distribution & Format Accounting
console.log('\n--- 3. Technique Distribution & Accounting ---');
const allTechniques = brief.mechanisms.flatMap(m => m.techniques);
assert(allTechniques.length === 14, 'Total techniques across M11 is 14');

allTechniques.forEach(t => {
  assert(!!t.code, `Technique ${t.code} has code`);
  assert(!!t.name, `Technique ${t.code} has name`);
  assert(!!t.approach, `Technique ${t.code} has approach`);
  assert(!!t.source, `Technique ${t.code} has source attribution`);
  assert(!!t.what, `Technique ${t.code} has 'what' field`);
  assert(!!t.how, `Technique ${t.code} has 'how' field`);
  assert(!!t.why, `Technique ${t.code} has 'why' field`);
});

const formatA = allTechniques.filter(t => t.format === 'A');
const formatB = allTechniques.filter(t => t.format === 'B');
const formatC = allTechniques.filter(t => t.format === 'C');

assert(formatA.length === 8, 'Exactly 8 Format A techniques');
assert(formatB.length === 5, 'Exactly 5 Format B techniques');
assert(formatC.length === 1, 'Exactly 1 Format C technique');

const formatBCodes = formatB.map(t => t.code).sort().join(',');
assert(formatBCodes === 'A1,B3,C2,C3,D3', 'Format B guardrailed techniques are A1, B3, C2, C3, D3');

formatB.forEach(t => {
  assert(t.guardrail === true, `Format B technique ${t.code} has guardrail: true`);
});

assert(formatC[0].code === 'A4', 'Format C technique is A4');
assert(!!formatC[0].professionalNote, 'Format C technique A4 has professionalNote');

// 4. Intro Sequence
console.log('\n--- 4. Intro Sequence ---');
const introScreens = MODULE_11_CONTENT.introScreens;
assert(introScreens.length === 6, 'Intro contains exactly 6 screens per prototype');
assert(introScreens[0].consent === true, 'Screen 1 has consent');
assert(introScreens[1].crisisButton === true, 'Screen 2 has crisisButton');
assert(introScreens[5].theory === true, 'Screen 6 has theory grounding');

// 5. Weeks & Touches
console.log('\n--- 5. Weeks & Touches ---');
const weeks = MODULE_11_CONTENT.weeks;
assert(weeks.length === 9, 'Exactly 9 weeks');

// Weeks 1-4: Understanding
assert(weeks[0].kind === 'blocked' && weeks[0].mechanism === 'A', 'Week 1 is blocked Mechanism A');
assert(weeks[1].kind === 'blocked' && weeks[1].mechanism === 'B', 'Week 2 is blocked Mechanism B');
assert(weeks[2].kind === 'blocked' && weeks[2].mechanism === 'C', 'Week 3 is blocked Mechanism C');
assert(weeks[3].kind === 'blocked' && weeks[3].mechanism === 'D', 'Week 4 is blocked Mechanism D');

// Weeks 5-8: Technique
assert(weeks[4].kind === 'technique' && weeks[4].mechanism === 'A', 'Week 5 is technique Mechanism A');
assert(weeks[5].kind === 'technique' && weeks[5].mechanism === 'B', 'Week 6 is technique Mechanism B');
assert(weeks[6].kind === 'technique' && weeks[6].mechanism === 'C', 'Week 7 is technique Mechanism C');
assert(weeks[7].kind === 'technique' && weeks[7].mechanism === 'D', 'Week 8 is technique Mechanism D');

// Week 9: Integration
assert(weeks[8].kind === 'integration', 'Week 9 is integration');

weeks.forEach((w, idx) => {
  assert(w.touches.length === 5, `Week ${idx + 1} has exactly 5 touches`);
});
const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
assert(totalTouches === 45, 'Total touches is 45');

// 6. Retrieval Checks & Reference Cards
console.log('\n--- 6. Retrieval Checks & Reference Cards ---');
assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
assert(weeks[2].retrievalCheck === null, 'Week 3 retrievalCheck is null');
assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
assert(weeks[4].retrievalCheck !== null, 'Week 5 has retrievalCheck (tests A & B)');
assert(weeks[5].retrievalCheck === null, 'Week 6 retrievalCheck is null');
assert(weeks[6].retrievalCheck === null, 'Week 7 retrievalCheck is null');
assert(weeks[7].retrievalCheck === null, 'Week 8 retrievalCheck is null');
assert(weeks[8].retrievalCheck !== null, 'Week 9 has retrievalCheck (tests C & D)');

assert(weeks[4].hasReferenceCard === true, 'Week 5 hasReferenceCard is true (for A4)');
[0, 1, 2, 3, 5, 6, 7, 8].forEach(wIdx => {
  assert(!weeks[wIdx].hasReferenceCard, `Week ${wIdx + 1} hasReferenceCard is false/undefined`);
});

// 7. Guardrailed Touches Verification
console.log('\n--- 7. Guardrailed Touches ---');
const guardrailedTouchIds = ['w5t3', 'w6t3', 'w7t2', 'w7t3', 'w8t3'];
const allTouches = weeks.flatMap(w => w.touches);

allTouches.forEach(t => {
  if (guardrailedTouchIds.includes(t.id)) {
    assert(t.guardrail === true, `Touch ${t.id} has guardrail: true`);
    assert(!!t.apply.intensityPrompt, `Touch ${t.id} has intensityPrompt`);
    assert(t.apply.intensityOptions?.length === 2, `Touch ${t.id} has 2 intensityOptions`);
    assert(!!t.distressPrompt, `Touch ${t.id} has distressPrompt`);
  } else {
    assert(!t.guardrail, `Touch ${t.id} guardrail is false/undefined`);
  }
});

// 8. Transfer Test (w9t5)
console.log('\n--- 8. Transfer Test ---');
const w9t5 = weeks[8].touches[4];
assert(w9t5.id === 'w9t5', 'Final touch is w9t5');
assert(w9t5.transferTest === true, 'w9t5 has transferTest: true');
assert(w9t5.think.mode === 'open', 'w9t5 think mode is open (unscaffolded)');

// 9. Delayed Reference Continuity
console.log('\n--- 9. Delayed Reference Continuity ---');
const completedStepKeys = new Set<string>();

allTouches.forEach(t => {
  if (t.noDelayed) {
    assert(t.id === 'w1t1', `Touch ${t.id} has noDelayed`);
  } else {
    assert(!!t.delayedRef, `Touch ${t.id} has delayedRef`);
    assert(completedStepKeys.has(t.delayedRef!), `Touch ${t.id} references existing earlier step ${t.delayedRef}`);
  }
  completedStepKeys.add(`${t.id}_apply`);
});

// 10. Reinforcement Bank Accounting
console.log('\n--- 10. Reinforcement Bank Accounting ---');
const bank = MODULE_11_CONTENT.reinforcementBank;
assert(bank.length === 8, 'Reinforcement Bank has exactly 8 reflection reps (4 techniques × 2 reps)');

const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
assert(reflectionCodes.join(',') === 'A2,B4,C1,D1', 'Reflections bank contains exactly A2, B4, C1, D1');

const tools = MODULE_11_CONTENT.toolsData;
const toolCodes = Object.values(tools).map((t: any) => t.code).sort();
assert(toolCodes.length === 4, 'Tools data has exactly 4 tools');
assert(toolCodes.join(',') === 'A3,B1,B2,D2', 'Tools data contains exactly A3, B1, B2, D2');

const excludedCodes = ['A1', 'A4', 'B3', 'C2', 'C3', 'D3'].sort();
const accountedCodes = [...reflectionCodes, ...toolCodes, ...excludedCodes].sort();
assert(accountedCodes.join(',') === 'A1,A2,A3,A4,B1,B2,B3,B4,C1,C2,C3,D1,D2,D3', 'All 14 techniques accounted for with zero duplicate assignments');

// 11. MHPI Configuration
console.log('\n--- 11. MHPI Config ---');
const mhpi = MODULE_11_CONTENT.mhpiConfig;
assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
assert(mhpi.endExtraQuestions.length === 1, '1 extra question at end');
assert(mhpi.endChoice.options.length === 3, '3 options in endChoice');

console.log(`\n========================================`);
console.log(`ALL MODULE 11 CONTENT TESTS PASSED: ${passedTests}/${totalTests}`);
console.log(`========================================\n`);
