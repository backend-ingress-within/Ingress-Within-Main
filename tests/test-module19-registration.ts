import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_19_CONTENT } from '../src/lib/modules/content/module19Data';

async function runModule19RegistrationTests() {
  console.log('--- STARTING MODULE 19 APPLICATION REGISTRATION VALIDATION TESTS ---');

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
  assert(catalog.length === 19, 'Catalog contains exactly 19 modules');

  const m19Catalog = catalog.find(m => m.id === 'M19');
  assert(m19Catalog !== undefined, 'M19 exists in catalog');
  assert(m19Catalog?.id === 'M19', 'M19 catalog ID is M19');
  assert(m19Catalog?.slug === 'performance-achievement-anxiety', 'M19 catalog slug is performance-achievement-anxiety');
  assert(m19Catalog?.name === 'Performance & Achievement Anxiety', 'M19 catalog name is correct');
  assert((MODULE_19_CONTENT.tier || '').includes('Work & Education'), 'M19 domain is Work & Education');
  assert((MODULE_19_CONTENT.tier || '').includes('Core'), 'M19 tier is Core');
  assert(m19Catalog?.price === 349.00, 'M19 catalog price is 349.00');
  assert(m19Catalog?.currency === 'INR', 'M19 catalog currency is INR');
  assert(m19Catalog?.status === 'active', 'M19 catalog status is active');
  assert(m19Catalog?.version === '1.0', 'M19 catalog version is 1.0');
  assert(m19Catalog?.duration_weeks === 9, 'M19 catalog duration is 9 weeks');
  assert(m19Catalog?.taxonomy_concerns.length === 4, 'M19 catalog has 4 taxonomy concerns');
  assert(!!m19Catalog?.taxonomy_concerns.includes('M19-C01'), 'Includes M19-C01');
  assert(!!m19Catalog?.taxonomy_concerns.includes('M19-C02'), 'Includes M19-C02');
  assert(!!m19Catalog?.taxonomy_concerns.includes('M19-C03'), 'Includes M19-C03');
  assert(!!m19Catalog?.taxonomy_concerns.includes('M19-C04'), 'Includes M19-C04');

  const allIds = catalog.map(m => m.id);
  const allSlugs = catalog.map(m => m.slug);
  assert(new Set(allIds).size === 19, 'No duplicate module IDs in catalog');
  assert(new Set(allSlugs).size === 19, 'No duplicate module slugs in catalog');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution Tests ---');
  const contentById = ModuleContentService.getModuleContent('M19');
  const contentBySlug = ModuleContentService.getModuleContent('performance-achievement-anxiety');
  const allContents = ModuleContentService.getAllModuleContents();

  assert(contentById !== null, 'getModuleContent("M19") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("performance-achievement-anxiety") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to exact same content instance');
  assert(contentById === MODULE_19_CONTENT, 'Resolved content matches MODULE_19_CONTENT');
  assert(allContents.length === 19, 'getAllModuleContents() returns exactly 19 modules');

  // 3. Recommendation Keyword Mapping Tests
  console.log('\n--- 3. Recommendation Keyword Mapping Tests ---');
  const m19C01 = ModuleRecommendationService.mapConcernToModule('M19-C01');
  const m19C02 = ModuleRecommendationService.mapConcernToModule('M19-C02');
  const m19C03 = ModuleRecommendationService.mapConcernToModule('M19-C03');
  const m19C04 = ModuleRecommendationService.mapConcernToModule('M19-C04');
  const kwPerf = ModuleRecommendationService.mapConcernToModule('performance_pressure');
  const kwExam = ModuleRecommendationService.mapConcernToModule('exam_stress');
  const kwUpsc = ModuleRecommendationService.mapConcernToModule('upsc_stress');
  const kwJee = ModuleRecommendationService.mapConcernToModule('jee_stress');
  const kwNeet = ModuleRecommendationService.mapConcernToModule('neet_stress');
  const kwFail = ModuleRecommendationService.mapConcernToModule('fear_of_failure');
  const kwImposter = ModuleRecommendationService.mapConcernToModule('impostor_syndrome');

  assert(m19C01?.moduleId === 'M19' && m19C01.concernId === 'M19-C01', 'M19-C01 maps to M19/M19-C01');
  assert(m19C02?.moduleId === 'M19' && m19C02.concernId === 'M19-C02', 'M19-C02 maps to M19/M19-C02');
  assert(m19C03?.moduleId === 'M19' && m19C03.concernId === 'M19-C03', 'M19-C03 maps to M19/M19-C03');
  assert(m19C04?.moduleId === 'M19' && m19C04.concernId === 'M19-C04', 'M19-C04 maps to M19/M19-C04');
  assert(kwPerf?.moduleId === 'M19' && kwPerf.concernId === 'M19-C01', 'performance_pressure maps to M19');
  assert(kwExam?.moduleId === 'M19' && kwExam.concernId === 'M19-C02', 'exam_stress maps to M19');
  assert(kwUpsc?.moduleId === 'M19' && kwUpsc.concernId === 'M19-C02', 'upsc_stress maps to M19');
  assert(kwJee?.moduleId === 'M19' && kwJee.concernId === 'M19-C02', 'jee_stress maps to M19');
  assert(kwNeet?.moduleId === 'M19' && kwNeet.concernId === 'M19-C02', 'neet_stress maps to M19');
  assert(kwFail?.moduleId === 'M19' && kwFail.concernId === 'M19-C03', 'fear_of_failure maps to M19');
  assert(kwImposter?.moduleId === 'M19' && kwImposter.concernId === 'M19-C04', 'impostor_syndrome maps to M19');

  console.log(`\n======================================================`);
  console.log(`MODULE 19 REGISTRATION TEST SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule19RegistrationTests().catch(err => {
  console.error('Module 19 registration test failed:', err);
  process.exit(1);
});
