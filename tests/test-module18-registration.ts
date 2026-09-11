import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_18_CONTENT } from '../src/lib/modules/content/module18Data';

async function runModule18RegistrationTests() {
  console.log('--- STARTING MODULE 18 APPLICATION REGISTRATION VALIDATION TESTS ---');

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

  // 1. Catalog Tests
  console.log('\n--- 1. Catalog Tests ---');
  const catalog = ModuleCatalogService.getAllCatalogItems();
  assert(catalog.length === 18, 'Catalog contains exactly 18 modules');

  const m18Catalog = catalog.find(m => m.id === 'M18');
  assert(m18Catalog !== undefined, 'M18 exists in catalog');
  assert(m18Catalog?.id === 'M18', 'M18 catalog ID is M18');
  assert(m18Catalog?.slug === 'pressure-burnout', 'M18 catalog slug is pressure-burnout');
  assert(m18Catalog?.name === 'Pressure & Burnout', 'M18 catalog name is correct');
  assert((MODULE_18_CONTENT.tier || '').includes('Work & Education'), 'M18 domain is Work & Education');
  assert((MODULE_18_CONTENT.tier || '').includes('Core'), 'M18 tier is Core');
  assert(m18Catalog?.price === 349.00, 'M18 catalog price is 349.00');
  assert(m18Catalog?.currency === 'INR', 'M18 catalog currency is INR');
  assert(m18Catalog?.status === 'active', 'M18 catalog status is active');
  assert(m18Catalog?.version === '1.0', 'M18 catalog version is 1.0');
  assert(m18Catalog?.duration_weeks === 7, 'M18 catalog duration is 7 weeks');
  assert(m18Catalog?.taxonomy_concerns.length === 3, 'M18 catalog has 3 taxonomy concerns');
  assert(!!m18Catalog?.taxonomy_concerns.includes('M18-C01'), 'Includes M18-C01');
  assert(!!m18Catalog?.taxonomy_concerns.includes('M18-C02'), 'Includes M18-C02');
  assert(!!m18Catalog?.taxonomy_concerns.includes('M18-C03'), 'Includes M18-C03');

  const allIds = catalog.map(m => m.id);
  const allSlugs = catalog.map(m => m.slug);
  assert(new Set(allIds).size === 18, 'No duplicate module IDs in catalog');
  assert(new Set(allSlugs).size === 18, 'No duplicate module slugs in catalog');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution Tests ---');
  const contentById = ModuleContentService.getModuleContent('M18');
  const contentBySlug = ModuleContentService.getModuleContent('pressure-burnout');
  const allContents = ModuleContentService.getAllModuleContents();

  assert(contentById !== null, 'getModuleContent("M18") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("pressure-burnout") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to exact same content instance');
  assert(contentById === MODULE_18_CONTENT, 'Resolved content matches MODULE_18_CONTENT');
  assert(allContents.length === 18, 'getAllModuleContents() returns exactly 18 modules');

  // 3. Recommendation Keyword Mapping Tests
  console.log('\n--- 3. Recommendation Keyword Mapping Tests ---');
  const m18C01 = ModuleRecommendationService.mapConcernToModule('M18-C01');
  const m18C02 = ModuleRecommendationService.mapConcernToModule('M18-C02');
  const m18C03 = ModuleRecommendationService.mapConcernToModule('M18-C03');
  const kwWorkStress = ModuleRecommendationService.mapConcernToModule('work_stress');
  const kwBurnout = ModuleRecommendationService.mapConcernToModule('burnout');
  const kwOverwork = ModuleRecommendationService.mapConcernToModule('overwork_culture');
  const kwWorkLife = ModuleRecommendationService.mapConcernToModule('work_life_imbalance');
  const kwExhaustion = ModuleRecommendationService.mapConcernToModule('emotional_exhaustion');

  assert(m18C01?.moduleId === 'M18' && m18C01.concernId === 'M18-C01', 'M18-C01 maps to M18/M18-C01');
  assert(m18C02?.moduleId === 'M18' && m18C02.concernId === 'M18-C02', 'M18-C02 maps to M18/M18-C02');
  assert(m18C03?.moduleId === 'M18' && m18C03.concernId === 'M18-C03', 'M18-C03 maps to M18/M18-C03');
  assert(kwWorkStress?.moduleId === 'M18' && kwWorkStress.concernId === 'M18-C01', 'work_stress keyword maps to M18/M18-C01');
  assert(kwBurnout?.moduleId === 'M18' && kwBurnout.concernId === 'M18-C02', 'burnout keyword maps to M18/M18-C02');
  assert(kwOverwork?.moduleId === 'M18' && kwOverwork.concernId === 'M18-C03', 'overwork_culture keyword maps to M18/M18-C03');
  assert(kwWorkLife?.moduleId === 'M18' && kwWorkLife.concernId === 'M18-C03', 'work_life_imbalance keyword maps to M18/M18-C03');
  assert(kwExhaustion?.moduleId === 'M18' && kwExhaustion.concernId === 'M18-C02', 'emotional_exhaustion keyword maps to M18/M18-C02');

  console.log(`\n======================================================`);
  console.log(`MODULE 18 REGISTRATION TEST SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule18RegistrationTests().catch(err => {
  console.error('Module 18 registration test failed:', err);
  process.exit(1);
});
