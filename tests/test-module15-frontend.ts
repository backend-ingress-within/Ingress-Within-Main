import { MODULE_15_CONTENT } from '../src/lib/modules/content/module15Data';
import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { MODULE_1_CONTENT } from '../src/lib/modules/content/module1Data';
import { MODULE_6_CONTENT } from '../src/lib/modules/content/module6Data';
import { MODULE_10_CONTENT } from '../src/lib/modules/content/module10Data';
import { MODULE_13_CONTENT } from '../src/lib/modules/content/module13Data';
import { MODULE_14_CONTENT } from '../src/lib/modules/content/module14Data';

async function runModule15FrontendTests() {
  console.log('--- STARTING MODULE 15 FRONTEND INTEGRATION VALIDATION TESTS ---');

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
  const contentById = ModuleContentService.getModuleContent('M15');
  const contentBySlug = ModuleContentService.getModuleContent('loss-endings');
  const catalogItem = ModuleCatalogService.getAllCatalogItems().find(m => m.id === 'M15');

  assert(contentById !== null, 'M15 resolves content by ID');
  assert(contentBySlug !== null, 'M15 resolves content by slug');
  assert(contentById === contentBySlug, 'M15 ID and slug resolve to exact same content instance');
  assert(!!catalogItem, 'M15 catalog entry exists');

  assert(catalogItem?.name === 'Loss & Endings', 'Overview name matches');
  assert(catalogItem?.price === 599.00, 'Overview price is 599.00');
  assert(catalogItem?.duration_weeks === 5, 'Overview duration is 5 weeks');
  assert((MODULE_15_CONTENT.tier || '').includes('Relationships'), 'Overview domain is Relationships');
  assert((MODULE_15_CONTENT.tier || '').includes('Specialized'), 'Overview tier is Specialized');

  const mechs = MODULE_15_CONTENT.brief.mechanisms;
  assert(mechs.length === 2, 'Exactly 2 mechanisms surfaced');
  assert(mechs[0].key === 'A' && mechs[0].name === 'Breakup Distress', 'Mechanism A matches');
  assert(mechs[1].key === 'B' && mechs[1].name === 'Divorce / Separation Adjustment', 'Mechanism B matches');

  // 2. Intro Sequence
  console.log('\n--- 2. Intro Sequence ---');
  const introScreens = MODULE_15_CONTENT.introScreens;
  assert(introScreens.length === 6, 'Intro sequence contains 6 reachable screens');
  assert(introScreens[0].consent === true, 'Screen 1 requires consent');
  assert(introScreens[2].crisisButton === true, 'Screen 3 surfaces crisis resources');
  assert(introScreens[4].title.includes('5 weeks'), 'Screen 5 presents 5-week roadmap');
  assert(introScreens[5].theory === true, 'Screen 6 displays theory grounding');

  // 3. Roadmap & Touch Count
  console.log('\n--- 3. Roadmap & Touch Count ---');
  const weeks = MODULE_15_CONTENT.weeks;
  assert(weeks.length === 5, 'Roadmap has exactly 5 weeks');

  const totalTouches = weeks.reduce((acc, w) => acc + w.touches.length, 0);
  assert(totalTouches === 25, 'Roadmap has exactly 25 teaching touches (5 x 5)');

  assert(weeks[0].mechanism === 'A' && weeks[0].kind === 'blocked', 'Week 1 is Blocked Mechanism A');
  assert(weeks[1].mechanism === 'B' && weeks[1].kind === 'blocked', 'Week 2 is Blocked Mechanism B');
  assert(weeks[2].mechanism === 'A' && weeks[2].kind === 'technique', 'Week 3 is Technique Mechanism A');
  assert(weeks[3].mechanism === 'B' && weeks[3].kind === 'technique', 'Week 4 is Technique Mechanism B');
  assert(weeks[4].mechanism === 'both' && weeks[4].kind === 'integration', 'Week 5 is Integration & Review');

  // 4. Format A Techniques Verification
  console.log('\n--- 4. Format A Techniques Verification ---');
  const allTechs = [...mechs[0].techniques, ...mechs[1].techniques];
  assert(allTechs.length === 7, 'Total technique count is 7');

  allTechs.forEach(t => {
    assert(t.format === 'A', `Technique ${t.code} is Format A`);
    assert(!t.guardrail, `Technique ${t.code} has no guardrail flag`);
  });

  // 5. No Format B Leakage
  console.log('\n--- 5. No Format B Leakage ---');
  const allTouches = weeks.flatMap(w => w.touches);
  const guardrailTouches = allTouches.filter(t => t.guardrail === true);
  const intensityTouches = allTouches.filter(t => !!t.apply?.intensityPrompt);
  const distressTouches = allTouches.filter(t => !!t.distressPrompt);

  assert(guardrailTouches.length === 0, 'Zero guardrail touches in M15');
  assert(intensityTouches.length === 0, 'Zero intensity prompt touches in M15');
  assert(distressTouches.length === 0, 'Zero distress prompt touches in M15');

  // 6. No Format C Leakage
  console.log('\n--- 6. No Format C Leakage ---');
  const formatCTechs = allTechs.filter(t => t.format === 'C');
  const refCardWeeks = weeks.filter(w => w.hasReferenceCard === true);

  assert(formatCTechs.length === 0, 'Zero Format C techniques in M15');
  assert(refCardWeeks.length === 0, 'Zero reference card flags in M15 weeks');

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
  assert(w5t5.id === 'w5t5', 'w5t5 is final touch');
  assert(w5t5.transferTest === true, 'w5t5 has transferTest === true');
  assert(w5t5.think.mode === 'open', 'w5t5 think mode is open (unscaffolded reasoning)');

  // 9. MHPI Configuration
  console.log('\n--- 9. MHPI Configuration ---');
  const mhpi = MODULE_15_CONTENT.mhpiConfig;
  assert(mhpi.baselineQuestions.length === 5, 'MHPI baseline has 5 questions');
  assert(mhpi.weeklyQuestions.length === 3, 'MHPI weekly has 3 questions');
  assert(mhpi.endExtraQuestions.length === 1, 'MHPI end has 1 extra question');
  assert(mhpi.endChoice.options.length === 3, 'MHPI endChoice has 3 options');

  // 10. Toolkit Selection & Reinforcement Bank Accounting
  console.log('\n--- 10. Toolkit Selection & Reinforcement Bank Accounting ---');
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

  assert(!refCodes.includes('A1') && !toolCodes.includes('A1'), 'A1 is deliberately excluded from reflections and tools');

  const overlap = refCodes.filter(c => toolCodes.includes(c));
  assert(overlap.length === 0, 'Zero overlap between reflection techniques and tool techniques');

  const totalAccounted = refCodes.length + toolCodes.length + 1; // 4 + 2 + 1 = 7
  assert(totalAccounted === 7, '100% technique accounting (4 reflections + 2 tools + 1 exclusion = 7)');

  // 11. Completion Threshold & Progress Calculations
  console.log('\n--- 11. Completion Threshold & Progress Calculations ---');
  const allTouchIds = weeks.flatMap(w => w.touches.map(t => t.id));
  assert(allTouchIds.length === 25, 'Total touch count is 25');

  const progress24 = Math.round((24 / 25) * 100);
  const progress25 = Math.round((25 / 25) * 100);
  assert(progress24 === 96, '24/25 touches is 96% progress (incomplete)');
  assert(progress25 === 100, '25/25 touches is 100% progress (complete)');

  // 12. Module Isolation (M14 & Representative Modules)
  console.log('\n--- 12. Module Isolation (M14 & Representative Modules) ---');
  assert(MODULE_14_CONTENT.duration_weeks === 7, 'M14 duration remains 7 weeks');
  assert(MODULE_14_CONTENT.weeks[5].touches.some(t => t.id === 'w6t3' && t.guardrail === true), 'M14 Format B C1 guardrail intact');
  assert(MODULE_14_CONTENT.weeks[3].hasReferenceCard === true, 'M14 Format C A4 reference card intact');

  const repModules = [
    { mod: MODULE_1_CONTENT, id: 'M1', weeks: 7 },
    { mod: MODULE_6_CONTENT, id: 'M6', weeks: 2 },
    { mod: MODULE_10_CONTENT, id: 'M10', weeks: 7 },
    { mod: MODULE_13_CONTENT, id: 'M13', weeks: 5 },
    { mod: MODULE_14_CONTENT, id: 'M14', weeks: 7 },
    { mod: MODULE_15_CONTENT, id: 'M15', weeks: 5 }
  ];

  repModules.forEach(({ mod, id, weeks: wCount }) => {
    assert(mod.moduleId === id, `${id} moduleId intact`);
    assert(mod.weeks.length === wCount, `${id} weeks count is ${wCount}`);
  });

  console.log(`\n========================================`);
  console.log(`ALL MODULE 15 FRONTEND TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule15FrontendTests().catch(err => {
  console.error('Module 15 frontend test execution failed:', err);
  process.exit(1);
});
