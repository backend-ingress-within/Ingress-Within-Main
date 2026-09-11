import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_17_CONTENT } from '../src/lib/modules/content/module17Data';

async function runModule17RegistrationTests() {
  console.log('--- STARTING MODULE 17 APPLICATION REGISTRATION VALIDATION TESTS ---');

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
  assert(catalog.length === 17, 'Catalog contains exactly 17 modules');

  const m17Catalog = catalog.find(m => m.id === 'M17');
  assert(m17Catalog !== undefined, 'M17 exists in catalog');
  assert(m17Catalog?.id === 'M17', 'M17 catalog ID is M17');
  assert(m17Catalog?.slug === 'communication-intimacy', 'M17 catalog slug is communication-intimacy');
  assert(m17Catalog?.name === 'Communication & Intimacy', 'M17 catalog name is correct');
  assert((MODULE_17_CONTENT.tier || '').includes('Relationships'), 'M17 domain is Relationships');
  assert((MODULE_17_CONTENT.tier || '').includes('Core'), 'M17 tier is Core');
  assert(m17Catalog?.price === 349.00, 'M17 catalog price is 349.00');
  assert(m17Catalog?.currency === 'INR', 'M17 catalog currency is INR');
  assert(m17Catalog?.status === 'active', 'M17 catalog status is active');
  assert(m17Catalog?.version === '1.0', 'M17 catalog version is 1.0');
  assert(m17Catalog?.duration_weeks === 5, 'M17 catalog duration is 5 weeks');
  assert(m17Catalog?.taxonomy_concerns.length === 2, 'M17 catalog has 2 taxonomy concerns');
  assert(!!m17Catalog?.taxonomy_concerns.includes('M17-C01'), 'Includes M17-C01');
  assert(!!m17Catalog?.taxonomy_concerns.includes('M17-C02'), 'Includes M17-C02');

  const allIds = catalog.map(m => m.id);
  const allSlugs = catalog.map(m => m.slug);
  assert(new Set(allIds).size === 17, 'No duplicate module IDs in catalog');
  assert(new Set(allSlugs).size === 17, 'No duplicate module slugs in catalog');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution Tests ---');
  const contentById = ModuleContentService.getModuleContent('M17');
  const contentBySlug = ModuleContentService.getModuleContent('communication-intimacy');
  const allContents = ModuleContentService.getAllModuleContents();

  assert(contentById !== null, 'getModuleContent("M17") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("communication-intimacy") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to exact same content instance');
  assert(contentById === MODULE_17_CONTENT, 'Resolved content matches MODULE_17_CONTENT');
  assert(allContents.length === 17, 'getAllModuleContents() returns exactly 17 modules');

  // 3. Recommendation Keyword Mapping Tests
  console.log('\n--- 3. Recommendation Keyword Mapping Tests ---');
  const m17C01 = ModuleRecommendationService.mapConcernToModule('M17-C01');
  const m17C02 = ModuleRecommendationService.mapConcernToModule('M17-C02');
  const kwComm = ModuleRecommendationService.mapConcernToModule('communication_difficulties');
  const kwIntimacy = ModuleRecommendationService.mapConcernToModule('intimacy_concerns');

  assert(m17C01?.moduleId === 'M17' && m17C01.concernId === 'M17-C01', 'M17-C01 maps to M17/M17-C01');
  assert(m17C02?.moduleId === 'M17' && m17C02.concernId === 'M17-C02', 'M17-C02 maps to M17/M17-C02');
  assert(kwComm?.moduleId === 'M17' && kwComm.concernId === 'M17-C01', 'communication_difficulties keyword maps to M17');
  assert(kwIntimacy?.moduleId === 'M17' && kwIntimacy.concernId === 'M17-C02', 'intimacy_concerns keyword maps to M17');

  console.log(`\n======================================================`);
  console.log(`MODULE 17 REGISTRATION TEST SUMMARY: ${passed}/${total} ASSERTIONS PASSED`);
  console.log(`======================================================\n`);
}

runModule17RegistrationTests().catch(err => {
  console.error('Module 17 registration test failed:', err);
  process.exit(1);
});
