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

async function runContentValidation() {
  console.log('--- STARTING MODULE 12 CONTENT FOUNDATION VALIDATION ---');

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

  // 1. Identity Validation
  console.log('\n--- 1. Identity Validation ---');
  assert(MODULE_12_CONTENT.moduleId === 'M12', 'Module ID is M12');
  assert(MODULE_12_CONTENT.slug === 'caregiving-role-burden', 'Slug is caregiving-role-burden');
  assert(MODULE_12_CONTENT.name === 'Caregiving & Role Burden', 'Name is Caregiving & Role Burden');
  assert(MODULE_12_CONTENT.duration_weeks === 5, 'Duration is 5 weeks');
  assert(MODULE_12_CONTENT.tier === 'Common - 499 rupees - Family domain', 'Tier matches');

  // 2. Mechanisms Validation
  console.log('\n--- 2. Mechanisms Validation ---');
  const mechs = MODULE_12_CONTENT.brief.mechanisms;
  assert(mechs.length === 2, 'Exactly 2 mechanisms');

  const mechaA = mechs[0];
  const mechaB = mechs[1];

  // Mech A: Caregiving Responsibilities
  assert(mechaA.key === 'A', 'Mechanism A key is A');
  assert(mechaA.name === 'Caregiving Responsibilities', 'Mechanism A name matches');
  assert(mechaA.short === 'Caregiving', 'Mechanism A short matches');
  assert(!!mechaA.def, 'Mechanism A has definition');
  assert(!!mechaA.need, 'Mechanism A has underlying need');
  assert(mechaA.contrast.who === 'Kavita', 'Mechanism A contrast character is Kavita');
  assert(mechaA.techniques.length === 4, 'Mechanism A has 4 techniques (A1, A2, A3, A4)');

  // Mech B: Parenting Stress
  assert(mechaB.key === 'B', 'Mechanism B key is B');
  assert(mechaB.name === 'Parenting Stress', 'Mechanism B name matches');
  assert(mechaB.short === 'Parenting Stress', 'Mechanism B short matches');
  assert(!!mechaB.def, 'Mechanism B has definition');
  assert(!!mechaB.need, 'Mechanism B has underlying need');
  assert(mechaB.contrast.who === 'Sameer', 'Mechanism B contrast character is Sameer');
  assert(mechaB.techniques.length === 3, 'Mechanism B has 3 techniques (B1, B2, B3)');

  // 3. Technique Distribution & Format Validation
  console.log('\n--- 3. Technique Distribution & Format Validation ---');
  const allTechniques = mechs.flatMap(m => m.techniques);
  assert(allTechniques.length === 7, 'Total techniques across M12 is 7');

  const uniqueCodes = new Set(allTechniques.map(t => t.code));
  assert(uniqueCodes.size === 7, 'All 7 technique codes are unique (A1, A2, A3, A4, B1, B2, B3)');

  allTechniques.forEach(t => {
    assert(!!t.code, `Technique ${t.code} has code`);
    assert(!!t.name, `Technique ${t.code} has name`);
    assert(!!t.approach, `Technique ${t.code} has approach`);
    assert(!!t.source, `Technique ${t.code} has source attribution`);
    assert(!!t.what, `Technique ${t.code} has 'what' field`);
    assert(!!t.how, `Technique ${t.code} has 'how' field`);
    assert(!!t.why, `Technique ${t.code} has 'why' field`);
    assert(t.format === 'A', `Technique ${t.code} is Format A`);
    assert(t.guardrail !== true, `Technique ${t.code} has no guardrail (guardrail !== true)`);
  });

  const formatACount = allTechniques.filter(t => t.format === 'A').length;
  const formatBCount = allTechniques.filter(t => t.format === 'B').length;
  const formatCCount = allTechniques.filter(t => t.format === 'C').length;
  const guardrailCount = allTechniques.filter(t => t.guardrail === true).length;

  assert(formatACount === 7, 'Exactly 7 Format A techniques');
  assert(formatBCount === 0, 'Zero Format B techniques');
  assert(formatCCount === 0, 'Zero Format C techniques');
  assert(guardrailCount === 0, 'Zero guardrailed techniques');

  // 4. Intro Sequence
  console.log('\n--- 4. Intro Sequence ---');
  const introScreens = MODULE_12_CONTENT.introScreens;
  assert(introScreens.length === 6, 'Intro contains exactly 6 screens per prototype');
  assert(introScreens[0].consent === true, 'Screen 1 has consent requirement');
  assert(introScreens[1].crisisButton === true, 'Screen 2 has crisisButton');
  assert(introScreens[5].theory === true, 'Screen 6 has theory grounding');

  // 5. Weeks & Touches Architecture
  console.log('\n--- 5. Weeks & Touches Architecture ---');
  const weeks = MODULE_12_CONTENT.weeks;
  assert(weeks.length === 5, 'Exactly 5 weeks exist');

  let totalTouches = 0;
  weeks.forEach((w, idx) => {
    assert(w.num === idx + 1, `Week ${idx + 1} number matches index + 1`);
    assert(w.touches.length === 5, `Week ${idx + 1} contains exactly 5 touches`);
    assert(w.hasReferenceCard !== true, `Week ${idx + 1} hasReferenceCard is false/undefined (0 reference cards in M12)`);
    totalTouches += w.touches.length;
  });
  assert(totalTouches === 25, 'Total touches across M12 is exactly 25 (5 weeks × 5 touches)');

  // 6. Touch Structure & Step Validation
  console.log('\n--- 6. Touch Structure & Step Validation ---');
  weeks.forEach(w => {
    w.touches.forEach(t => {
      assert(!!t.id, `Touch ${t.id} has valid ID`);
      assert(!!t.title, `Touch ${t.id} has title`);
      assert(!!t.role, `Touch ${t.id} has role`);
      assert(!!t.relate && t.relate.text.length > 0, `Touch ${t.id} has relate text`);
      assert(!!t.think && !!t.think.prompt, `Touch ${t.id} has think prompt`);
      assert(!!t.apply && !!t.apply.scenario && !!t.apply.prompt, `Touch ${t.id} has apply step`);
      assert(!!t.reveal && !!t.reveal.text, `Touch ${t.id} has reveal text`);
      assert(!!t.remember && !!t.remember.prompt, `Touch ${t.id} has remember prompt`);
      assert(t.guardrail !== true, `Touch ${t.id} has guardrail !== true`);
      assert(!t.apply.intensityOptions, `Touch ${t.id} has no intensity options`);
      assert(!t.distressPrompt, `Touch ${t.id} has no distress prompt`);
    });
  });

  // 7. Retrieval Checks
  console.log('\n--- 7. Retrieval Checks ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has retrieval check for Caregiving (A) & Parenting Stress (B)');
  assert(!!weeks[2].retrievalCheck?.prompt1, 'Week 3 retrieval check has prompt1');
  assert(!!weeks[2].retrievalCheck?.prompt2, 'Week 3 retrieval check has prompt2');
  assert(!!weeks[2].retrievalCheck?.reveal, 'Week 3 retrieval check has reveal');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null (2-mechanism structure precedent)');

  // 8. Transfer Test
  console.log('\n--- 8. Transfer Test ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'Final touch is w5t5');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest: true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // 9. Delayed Reference Continuity
  console.log('\n--- 9. Delayed Reference Continuity ---');
  const allTouches = weeks.flatMap(w => w.touches);
  allTouches.forEach((t, idx) => {
    if (idx === 0) {
      assert(!t.delayedRef, `Touch ${t.id} (w1t1) has no delayedRef`);
    } else {
      assert(!!t.delayedRef, `Touch ${t.id} has delayedRef`);
      const refTouchId = (t.delayedRef || '').replace('_apply', '');
      const refExists = allTouches.some(prev => prev.id === refTouchId);
      assert(refExists, `Touch ${t.id} references existing earlier touch ${refTouchId}`);
    }
  });

  // 10. Reinforcement Bank Accounting
  console.log('\n--- 10. Reinforcement Bank Accounting ---');
  const bank = MODULE_12_CONTENT.reinforcementBank || [];
  assert(bank.length === 8, 'Reinforcement Bank has exactly 8 reflection reps (4 techniques × 2 reps)');

  const reflectionCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(reflectionCodes.join(',') === 'A1,A2,B2,B3', 'Reflections bank contains exactly A1, A2, B2, B3');

  ['A1', 'A2', 'B2', 'B3'].forEach(code => {
    const reps = bank.filter(r => r.code === code);
    assert(reps.length === 2, `Technique ${code} has exactly 2 reflection repetitions in bank`);
  });

  const toolsData = MODULE_12_CONTENT.toolsData || {};
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 3, 'Tools data has exactly 3 tools');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A3,A4,B1', 'Tools data contains exactly A3, A4, B1');

  toolKeys.forEach(k => {
    const tool = toolsData[k];
    assert(tool.kind === 'log_single', `Tool ${tool.code} (${k}) has kind: 'log_single'`);
    assert(!!tool.title, `Tool ${tool.code} has title`);
    assert(!!tool.mechShort, `Tool ${tool.code} has mechShort`);
    assert(!!tool.intro, `Tool ${tool.code} has intro`);
    assert(!!tool.logLabel, `Tool ${tool.code} has logLabel`);
  });

  // Check 100% accounting: 7 total techniques = 4 reflections + 3 tools
  const accounted = new Set([...reflectionCodes, ...toolCodes]);
  assert(accounted.size === 7, 'All 7 techniques are accounted for across reflections and tools with zero duplicates');
  const overlap = reflectionCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlapping techniques between reflections and tools');

  // 11. MHPI Config
  console.log('\n--- 11. MHPI Config ---');
  const mhpi = MODULE_12_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, '5 baseline questions');
  assert(mhpi.weeklyQuestions.length === 3, '3 weekly questions');
  assert(mhpi.endExtraQuestions.length === 1, '1 extra question at end');
  assert(mhpi.endChoice.options.length === 3, '3 options in endChoice');

  // 12. Safety & Escalation Configuration
  console.log('\n--- 12. Safety & Escalation Configuration ---');
  const esc = MODULE_12_CONTENT.escalationConfig;
  assert(!!esc && !!esc.tier1, 'Escalation Tier 1 definition exists');
  assert(!!esc && !!esc.tier2, 'Escalation Tier 2 definition exists');
  assert((esc?.tier1 || '').includes('dependent') || (esc?.tier2 || '').includes('dependent') || (esc?.tier2 || '').includes('child') || (esc?.tier1 || '').includes('child') || (esc?.tier2 || '').includes('parent'), 'Escalation configuration captures dependent-risk context');
  assert(!!esc && !!esc.systemPrompt, 'Escalation system prompt exists');
  assert(!!esc && esc.tier1FallbackWords.length > 0, 'Tier 1 fallback words exist');
  assert(!!esc && esc.tier2FallbackWords.length > 0, 'Tier 2 fallback words exist');

  // 13. Regression Check: M1–M11 Untouched
  console.log('\n--- 13. Regression Check (M1–M11) ---');
  const priorModules = [
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
    { mod: MODULE_11_CONTENT, id: 'M11', weeks: 9, mechs: 4 }
  ];

  priorModules.forEach(({ mod, id, weeks, mechs }) => {
    assert(mod.moduleId === id, `${id} moduleId is intact`);
    assert(mod.weeks.length === weeks, `${id} weeks count is ${weeks}`);
    assert(mod.brief.mechanisms.length === mechs, `${id} mechanisms count is ${mechs}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 12 CONTENT TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runContentValidation().catch(err => {
  console.error('Module 12 content validation failed:', err);
  process.exit(1);
});
