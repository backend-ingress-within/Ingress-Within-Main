import { MODULE_14_CONTENT } from '../src/lib/modules/content/module14Data';
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
import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';

async function runModule14FrontendTests() {
  console.log('--- STARTING MODULE 14 FRONTEND INTEGRATION VALIDATION TESTS ---');

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
  const contentById = ModuleContentService.getModuleContent('M14');
  const contentBySlug = ModuleContentService.getModuleContent('grief-loss-life-transitions');
  const catalogItem = ModuleCatalogService.getAllCatalogItems().find(m => m.id === 'M14');

  assert(contentById !== null, 'M14 resolves content by ID');
  assert(contentBySlug !== null, 'M14 resolves content by slug');
  assert(contentById === contentBySlug, 'M14 ID and slug resolve to exact same content instance');
  assert(!!catalogItem, 'M14 catalog entry exists');

  assert(catalogItem?.name === 'Grief, Loss & Life Transitions', 'Overview name matches');
  assert(catalogItem?.price === 499.00, 'Overview price is 499.00');
  assert(catalogItem?.duration_weeks === 7, 'Overview duration is 7 weeks');
  assert((MODULE_14_CONTENT.tier || '').includes('Life Experiences'), 'Overview domain is Life Experiences');
  assert((MODULE_14_CONTENT.tier || '').includes('Common'), 'Overview tier is Common');

  const mechs = MODULE_14_CONTENT.brief.mechanisms;
  assert(mechs.length === 3, 'Exactly 3 mechanisms surfaced');
  assert(mechs[0].key === 'A' && mechs[0].name === 'Grief & Bereavement', 'Mechanism A matches');
  assert(mechs[1].key === 'B' && mechs[1].name === 'Major Life Transitions', 'Mechanism B matches');
  assert(mechs[2].key === 'C' && mechs[2].name === 'Ambiguous Loss & Unfinished Change', 'Mechanism C matches');

  // 2. Intro Sequence
  console.log('\n--- 2. Intro Sequence ---');
  const introScreens = MODULE_14_CONTENT.introScreens;
  assert(introScreens.length === 6, 'Intro sequence contains 6 reachable screens');
  assert(introScreens[0].consent === true, 'Screen 1 requires consent');
  assert(introScreens[2].crisisButton === true, 'Screen 3 surfaces crisis resources');
  assert(introScreens[4].title.includes('7 weeks'), 'Screen 5 presents 7-week roadmap');
  assert(introScreens[5].theory === true, 'Screen 6 displays theory grounding');

  // 3. Roadmap & Touch Count
  console.log('\n--- 3. Roadmap & Touch Count ---');
  const weeks = MODULE_14_CONTENT.weeks;
  assert(weeks.length === 7, 'Roadmap has exactly 7 weeks');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 35, 'Roadmap has exactly 35 teaching touches (7 x 5)');

  assert(weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');
  assert(weeks[2].mechanism === 'C' && weeks[2].kind === 'blocked', 'Week 3 is Blocked Mechanism C');
  assert(weeks[3].mechanism === 'A' && weeks[3].kind === 'technique', 'Week 4 is Technique Mechanism A');
  assert(weeks[4].mechanism === 'B' && weeks[4].kind === 'technique', 'Week 5 is Technique Mechanism B');
  assert(weeks[5].mechanism === 'C' && weeks[5].kind === 'technique', 'Week 6 is Technique Mechanism C');
  assert(weeks[6].mechanism === 'both' && weeks[6].kind === 'integration', 'Week 7 is Integration & Review');

  // 4. Format A Techniques
  console.log('\n--- 4. Format A Techniques ---');
  const formatATechniqueCodes = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C2', 'C3'];
  formatATechniqueCodes.forEach(code => {
    let foundTech: any = null;
    mechs.forEach(m => {
      const t = m.techniques.find(item => item.code === code);
      if (t) foundTech = t;
    });
    assert(foundTech !== null, `Technique ${code} exists`);
    assert(foundTech?.format === 'A', `Technique ${code} is Format A`);
    assert(!foundTech?.guardrail, `Technique ${code} has no guardrail flag`);
  });

  // 5. Format B Guardrail (C1)
  console.log('\n--- 5. Format B Guardrail (C1) ---');
  let c1Tech: any = null;
  mechs.forEach(m => {
    const t = m.techniques.find(item => item.code === 'C1');
    if (t) c1Tech = t;
  });

  assert(c1Tech !== null, 'Technique C1 exists');
  assert(c1Tech?.format === 'B', 'Technique C1 is Format B');
  assert(c1Tech?.guardrail === true, 'Technique C1 has guardrail === true');

  const w6t3 = weeks[5].touches.find(t => t.id === 'w6t3');
  assert(w6t3 !== undefined, 'Touch w6t3 exists in Week 6');
  assert(w6t3?.guardrail === true, 'Touch w6t3 carries guardrail === true');
  assert(!!w6t3?.apply.intensityPrompt, 'Touch w6t3 has intensityPrompt');
  assert(w6t3?.apply.intensityOptions?.length === 2, 'Touch w6t3 has 2 intensity options');
  assert(!!w6t3?.distressPrompt, 'Touch w6t3 has distressPrompt');

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
  assert(weeks[3].hasReferenceCard === true, 'Week 4 has reference card flag for A4');

  const a4InTouches = weeks.flatMap(w => w.touches).some(t => t.id === 'A4');
  assert(!a4InTouches, 'A4 does not exist as an interactive teaching touch');

  // 7. Retrieval Check
  console.log('\n--- 7. Retrieval Check ---');
  assert(weeks[0].retrievalCheck === null, 'Week 1 retrievalCheck is null');
  assert(weeks[1].retrievalCheck === null, 'Week 2 retrievalCheck is null');
  assert(weeks[2].retrievalCheck === null, 'Week 3 retrievalCheck is null');
  assert(weeks[3].retrievalCheck !== null, 'Week 4 has retrieval check testing A, B & C');
  assert(weeks[4].retrievalCheck === null, 'Week 5 retrievalCheck is null');
  assert(weeks[5].retrievalCheck === null, 'Week 6 retrievalCheck is null');
  assert(weeks[6].retrievalCheck === null, 'Week 7 retrievalCheck is null');

  // 8. Transfer Test (w7t5)
  console.log('\n--- 8. Transfer Test (w7t5) ---');
  const w7t5 = weeks[6].touches[4];
  assert(w7t5.id === 'w7t5', 'w7t5 is the final touch');
  assert(w7t5.transferTest === true, 'w7t5 has transferTest === true');
  assert(w7t5.think.mode === 'open', 'w7t5 think mode is open (unscaffolded reasoning)');

  // 9. MHPI Configuration
  console.log('\n--- 9. MHPI Configuration ---');
  const mhpi = MODULE_14_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end has 1 extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // 10. Toolkit & Reinforcement Bank Accounting
  console.log('\n--- 10. Toolkit & Reinforcement Bank Accounting ---');
  const bank = MODULE_14_CONTENT.reinforcementBank;
  assert(bank.length === 12, 'Reinforcement bank has 12 reflection reps');

  const refCodes = Array.from(new Set(bank.map(r => r.code))).sort();
  assert(refCodes.join(',') === 'A1,A2,B1,B3,C2,C3', 'Reflections bank contains exactly A1, A2, B1, B3, C2, C3');

  const toolsData = MODULE_14_CONTENT.toolsData;
  const toolKeys = Object.keys(toolsData);
  assert(toolKeys.length === 2, 'Tools data has exactly 2 tools');
  assert(toolsData.reengagement_log.code === 'A3', 'Tool reengagement_log has code A3');
  assert(toolsData.transition_map_log.code === 'B2', 'Tool transition_map_log has code B2');

  const toolCodes = toolKeys.map(k => toolsData[k].code).sort();
  assert(toolCodes.join(',') === 'A3,B2', 'Tools contain exactly A3, B2');

  assert(!refCodes.includes('A4') && !toolCodes.includes('A4'), 'A4 (Format C reference-only) is excluded from reflections & tools');
  assert(!refCodes.includes('C1') && !toolCodes.includes('C1'), 'C1 (Format B guardrailed) is excluded from reflections & tools');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  // 11. Completion Threshold & Progress Calculations
  console.log('\n--- 11. Completion Threshold & Progress Calculations ---');
  const allTouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 35, 'Total touch count is 35');

  const progress34 = Math.round((34 / 35) * 100);
  const progress35 = Math.round((35 / 35) * 100);
  assert(progress34 === 97, '34/35 touches is 97% progress (incomplete)');
  assert(progress35 === 100, '35/35 touches is 100% progress (complete)');

  // 12. M1–M14 Full Regression Check
  console.log('\n--- 12. M1–M14 Full Regression Check ---');
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

  allModules.forEach(({ mod, id, weeks: wCount, mechs: mCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
    assert(mod.brief.mechanisms.length === mCount, `${id} mechanisms count is ${mCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 14 FRONTEND TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule14FrontendTests().catch(err => {
  console.error('Module 14 frontend test execution failed:', err);
  process.exit(1);
});
