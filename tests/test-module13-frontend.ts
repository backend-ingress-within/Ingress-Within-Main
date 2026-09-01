import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';
import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
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

async function runModule13FrontendTests() {
  console.log('--- STARTING MODULE 13 FRONTEND INTEGRATION VALIDATION TESTS ---');

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

  // 1. Module Resolution & Overview Metadata
  console.log('\n--- 1. Module Resolution & Overview Metadata ---');
  const contentById = ModuleContentService.getModuleContent('M13');
  const contentBySlug = ModuleContentService.getModuleContent('identity-belonging-family-acceptance');
  const catalogItem = ModuleCatalogService.getAllCatalogItems().find(m => m.id === 'M13');

  assert(contentById !== null, 'M13 resolves content by ID');
  assert(contentBySlug !== null, 'M13 resolves content by slug');
  assert(contentById === contentBySlug, 'M13 ID and slug resolve to exact same content instance');
  assert(!!catalogItem, 'M13 catalog entry exists');

  assert(catalogItem?.name === 'Identity, Belonging & Family Acceptance', 'Overview name matches');
  assert(catalogItem?.price === 399.00, 'Overview price is 399.00');
  assert(catalogItem?.duration_weeks === 5, 'Overview duration is 5 weeks');
  assert((MODULE_13_CONTENT.tier || '').includes('Family'), 'Overview domain is Family');
  assert((MODULE_13_CONTENT.tier || '').includes('Specialized'), 'Overview tier is Specialized');

  const mechs = MODULE_13_CONTENT.brief.mechanisms;
  assert(mechs.length === 2, 'Exactly 2 mechanisms surfaced');
  assert(mechs[0].key === 'A' && mechs[0].name === 'Inter-Caste / Inter-Religion Family Rejection', 'Mechanism A matches');
  assert(mechs[1].key === 'B' && mechs[1].name === 'Sexual Orientation / Gender Identity & Family Acceptance', 'Mechanism B matches');

  // 2. Intro Sequence
  console.log('\n--- 2. Intro Sequence ---');
  const introScreens = MODULE_13_CONTENT.introScreens;
  assert(introScreens.length === 6, 'Intro sequence contains 6 reachable screens');
  assert(introScreens[0].consent === true, 'Screen 1 requires consent');
  assert(introScreens[2].crisisButton === true, 'Screen 3 surfaces crisis resources');
  assert(introScreens[4].title.includes('5 weeks'), 'Screen 5 presents 5-week roadmap');
  assert(introScreens[5].theory === true, 'Screen 6 displays theory grounding');

  // 3. Roadmap & Touch Count
  console.log('\n--- 3. Roadmap & Touch Count ---');
  const weeks = MODULE_13_CONTENT.weeks;
  assert(weeks.length === 5, 'Roadmap has exactly 5 weeks');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 25, 'Roadmap has exactly 25 teaching touches');

  assert(weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');
  assert(weeks[2].mechanism === 'A' && weeks[2].kind === 'technique', 'Week 3 is Technique Mechanism A');
  assert(weeks[3].mechanism === 'B' && weeks[3].kind === 'technique', 'Week 4 is Technique Mechanism B');
  assert(weeks[4].mechanism === 'both' && weeks[4].kind === 'integration', 'Week 5 is Integration & Review');

  // 4. Format A Techniques
  console.log('\n--- 4. Format A Techniques ---');
  const formatATechniqueCodes = ['A1', 'A2', 'A3', 'B2', 'B3', 'B4'];
  formatATechniqueCodes.forEach(code => {
    let foundTech: any = null;
    mechs.forEach(m => {
      const t = m.techniques.find(item => item.code === code);
      if (t) foundTech = t;
    });
    assert(foundTech !== null, `Technique ${code} exists`);
    assert((foundTech as any)?.format === 'A', `Technique ${code} is Format A`);
    assert(!(foundTech as any)?.guardrail, `Technique ${code} has no guardrail flag`);
  });

  // 5. Format B Guardrail (B1)
  console.log('\n--- 5. Format B Guardrail (B1) ---');
  let b1Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'B1');
    if (t) b1Tech = t;
  });

  assert(b1Tech !== null, 'Technique B1 exists');
  assert(b1Tech?.format === 'B', 'Technique B1 is Format B');
  assert(b1Tech?.guardrail === true, 'Technique B1 has guardrail === true');

  const w4t4 = weeks[3].touches.find(t => t.id === 'w4t4');
  assert(w4t4 !== undefined, 'Touch w4t4 exists in Week 4');
  assert(w4t4?.guardrail === true, 'Touch w4t4 carries guardrail === true');
  assert(!!w4t4?.apply.intensityPrompt, 'Touch w4t4 has intensityPrompt');
  assert(w4t4?.apply.intensityOptions?.length === 2, 'Touch w4t4 has 2 intensity options');
  assert(!!w4t4?.distressPrompt, 'Touch w4t4 has distressPrompt');

  // 6. Format C Reference-Only (A4)
  console.log('\n--- 6. Format C Reference-Only (A4) ---');
  let a4Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'A4');
    if (t) a4Tech = t;
  });

  assert(a4Tech !== null, 'Technique A4 exists');
  assert(a4Tech?.format === 'C', 'Technique A4 is Format C');
  assert(!!a4Tech?.professionalNote, 'Technique A4 has professionalNote');
  assert(weeks[2].hasReferenceCard === true, 'Week 3 has reference card flag for A4');

  const a4InTouches = weeks.flatMap(w => w.touches).some(t => t.id === 'A4');
  assert(!a4InTouches, 'A4 does not exist as an interactive teaching touch');

  // 7. Retrieval Check
  console.log('\n--- 7. Retrieval Check ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck !== null, 'Week 3 has retrieval check testing A & B');
  assert(weeks[3].retrievalCheck === null, 'Week 4 retrievalCheck is null');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null');

  // 8. Transfer Test (w5t5)
  console.log('\n--- 8. Transfer Test (w5t5) ---');
  const w5t5 = weeks[4].touches[4];
  assert(w5t5.id === 'w5t5', 'w5t5 is the final touch');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest === true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // 9. MHPI Configuration
  console.log('\n--- 9. MHPI Configuration ---');
  const mhpi = MODULE_13_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end has 1 extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // 10. Toolkit & Reinforcement Bank Accounting
  console.log('\n--- 10. Toolkit & Reinforcement Bank Accounting ---');
  const bank = MODULE_13_CONTENT.reinforcementBank;
  assert(bank.length === 8, 'Reinforcement bank has 8 reflection reps');

  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A3,B2,B4', 'Reflections bank contains exactly A1, A3, B2, B4');

  const toolsData = MODULE_13_CONTENT.toolsData;
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools (A2, B3)');
  assert(toolsData.values_clarity_log.code === 'A2', 'Tool values_clarity_log has code A2');
  assert(toolsData.disclosure_log.code === 'B3', 'Tool disclosure_log has code B3');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A2,B3', 'Tools contain exactly A2, B3');

  assert(!refCodes.includes('A4') && !toolCodes.includes('A4'), 'A4 (Format C reference-only) is excluded from reflections & tools');
  assert(!refCodes.includes('B1') && !toolCodes.includes('B1'), 'B1 (Format B guardrailed) is excluded from reflections & tools');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  // 11. M1–M13 Full Regression Check
  console.log('\n--- 11. M1–M13 Full Regression Check ---');
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

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 13 FRONTEND TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule13FrontendTests().catch(err => {
  console.error('Module 13 frontend test execution failed:', err);
  process.exit(1);
});
