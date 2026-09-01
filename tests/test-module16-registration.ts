import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_16_CONTENT } from '../src/lib/modules/content/module16Data';

async function runModule16RegistrationTests() {
  console.log('--- STARTING MODULE 16 APPLICATION REGISTRATION VALIDATION TESTS ---');

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
  assert(catalog.length === 16, 'Catalog contains exactly 16 modules');

  const m16Catalog = catalog.find(m => m.id === 'M16');
  assert(m16Catalog !== undefined, 'M16 exists in catalog');
  assert(m16Catalog?.id === 'M16', 'M16 catalog ID is M16');
  assert(m16Catalog?.slug === 'arranged-long-distance-realities', 'M16 catalog slug is arranged-long-distance-realities');
  assert(m16Catalog?.name === 'Arranged & Long-Distance Realities', 'M16 catalog name is correct');
  assert((MODULE_16_CONTENT.tier || '').includes('Relationships'), 'M16 domain is Relationships');
  assert((MODULE_16_CONTENT.tier || '').includes('Common'), 'M16 tier is Common');
  assert(m16Catalog?.price === 499.00, 'M16 catalog price is 499.00');
  assert(m16Catalog?.currency === 'INR', 'M16 catalog currency is INR');
  assert(m16Catalog?.status === 'active', 'M16 catalog status is active');
  assert(m16Catalog?.version === '1.0', 'M16 catalog version is 1.0');
  assert(m16Catalog?.duration_weeks === 5, 'M16 catalog duration is 5 weeks');
  assert(m16Catalog?.taxonomy_concerns.length === 2, 'M16 catalog has 2 taxonomy concerns');
  assert(!!m16Catalog?.taxonomy_concerns.includes('M16-C01'), 'Includes M16-C01');
  assert(!!m16Catalog?.taxonomy_concerns.includes('M16-C02'), 'Includes M16-C02');

  const allIds = catalog.map(m => m.id);
  const allSlugs = catalog.map(m => m.slug);
  assert(new Set(allIds).size === 16, 'No duplicate module IDs in catalog');
  assert(new Set(allSlugs).size === 16, 'No duplicate module slugs in catalog');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution Tests ---');
  const contentById = ModuleContentService.getModuleContent('M16');
  const contentBySlug = ModuleContentService.getModuleContent('arranged-long-distance-realities');
  const allContents = ModuleContentService.getAllModuleContents();

  assert(contentById !== null, 'getModuleContent("M16") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("arranged-long-distance-realities") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to exact same content instance');
  assert(contentById === MODULE_16_CONTENT, 'Resolved content matches MODULE_16_CONTENT');
  assert(allContents.length === 16, 'getAllModuleContents() returns exactly 16 modules');

  const contentIds = allContents.map(m => m.moduleId);
  for (let i = 1; i <= 16; i++) {
    const expectedId = `M${i}`;
    assert(contentIds.includes(expectedId), `getAllModuleContents() includes ${expectedId}`);
  }

  // 3. Recommendation Mapping Tests
  console.log('\n--- 3. Recommendation Mapping Tests ---');
  const c01Keywords = [
    'M16-C01', 'arranged_marriage', 'arranged-marriage',
    'arranged_marriage_stress', 'arranged-marriage-stress',
    'arranged_marriage_anxiety', 'arranged-marriage-anxiety',
    'arranged_marriage_compatibility', 'arranged-marriage-compatibility',
    'arranged_marriage_decision', 'arranged-marriage-decision',
    'arranged_marriage_doubt', 'arranged-marriage-doubt',
    'arranged_marriage_uncertainty', 'arranged-marriage-uncertainty',
    'arranged_match', 'arranged-match',
    'arranged_match_doubt', 'arranged-match-doubt',
    'marriage_compatibility', 'marriage-compatibility',
    'compatibility_doubt', 'compatibility-doubt',
    'partner_compatibility', 'partner-compatibility',
    'marriage_decision_pressure', 'marriage-decision-pressure',
    'fear_of_wrong_partner', 'fear-of-wrong-partner',
    'fear_of_wrong_decision', 'fear-of-wrong-decision',
    'family_marriage_expectations', 'family-marriage-expectations',
    'marriage_ambivalence', 'marriage-ambivalence',
    'uncertain_about_marriage', 'uncertain-about-marriage',
    'arranged_long_distance_realities', 'arranged-long-distance-realities'
  ];

  c01Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M16' && mapping.concernId === 'M16-C01', `Keyword "${kw}" maps to M16-C01`);
  });

  const c02Keywords = [
    'M16-C02', 'long_distance_relationship', 'long-distance-relationship',
    'long_distance', 'long-distance', 'ldr',
    'relationship_distance', 'relationship-distance',
    'long_distance_strain', 'long-distance-strain',
    'long_distance_relationship_stress', 'long-distance-relationship-stress',
    'long_distance_anxiety', 'long-distance-anxiety',
    'missing_partner', 'missing-partner',
    'partner_far_away', 'partner-far-away',
    'partner_abroad', 'partner-abroad',
    'distance_relationship', 'distance-relationship',
    'communication_distance', 'communication-distance',
    'long_distance_communication', 'long-distance-communication',
    'time_zone_relationship', 'time-zone-relationship',
    'timezone_relationship', 'timezone-relationship',
    'delayed_reply_anxiety', 'delayed-reply-anxiety',
    'distance_insecurity', 'distance-insecurity',
    'long_distance_insecurity', 'long-distance-insecurity',
    'long_distance_jealousy', 'long-distance-jealousy',
    'relationship_jealousy_distance', 'relationship-jealousy-distance',
    'attachment_insecurity_distance', 'attachment-insecurity-distance',
    'relationship_uncertainty_distance', 'relationship-uncertainty-distance'
  ];

  c02Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M16' && mapping.concernId === 'M16-C02', `Keyword "${kw}" maps to M16-C02`);
  });

  // 4. Boundary Verification Tests
  console.log('\n--- 4. Boundary Verification Tests ---');
  assert(ModuleRecommendationService.mapConcernToModule('marriage_pressure')?.moduleId === 'M10', 'General marriage_pressure maps to M10');
  assert(ModuleRecommendationService.mapConcernToModule('inter_caste_relationship')?.moduleId === 'M13', 'inter_caste_relationship maps to M13');
  assert(ModuleRecommendationService.mapConcernToModule('interfaith_relationship')?.moduleId === 'M13', 'interfaith_relationship maps to M13');
  assert(ModuleRecommendationService.mapConcernToModule('family_acceptance_lgbtq')?.moduleId === 'M13', 'family_acceptance_lgbtq maps to M13');
  assert(ModuleRecommendationService.mapConcernToModule('grief')?.moduleId === 'M14', 'grief maps to M14');
  assert(ModuleRecommendationService.mapConcernToModule('bereavement')?.moduleId === 'M14', 'bereavement maps to M14');
  assert(ModuleRecommendationService.mapConcernToModule('breakup')?.moduleId === 'M15', 'breakup maps to M15');
  assert(ModuleRecommendationService.mapConcernToModule('heartbreak')?.moduleId === 'M15', 'heartbreak maps to M15');
  assert(ModuleRecommendationService.mapConcernToModule('divorce')?.moduleId === 'M15', 'divorce maps to M15');
  assert(ModuleRecommendationService.mapConcernToModule('marital_separation')?.moduleId === 'M15', 'marital_separation maps to M15');

  // 5. Recommendation Isolation Tests
  console.log('\n--- 5. Recommendation Isolation Tests ---');
  const isolationCases = [
    { kw: 'self_criticism', mod: 'M1' },
    { kw: 'perfectionism', mod: 'M2' },
    { kw: 'generalised_anxiety', mod: 'M3' },
    { kw: 'low_mood', mod: 'M4' },
    { kw: 'identity_confusion', mod: 'M5' },
    { kw: 'trauma', mod: 'M6' },
    { kw: 'emotional_suppression', mod: 'M7' },
    { kw: 'neurodivergence', mod: 'M8' },
    { kw: 'criticism', mod: 'M9' },
    { kw: 'marriage_pressure', mod: 'M10' },
    { kw: 'misunderstood', mod: 'M11' },
    { kw: 'caregiver_burden', mod: 'M12' },
    { kw: 'inter_caste_relationship', mod: 'M13' },
    { kw: 'grief', mod: 'M14' },
    { kw: 'breakup', mod: 'M15' }
  ];

  isolationCases.forEach(({ kw, mod }) => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === mod, `Existing keyword "${kw}" still resolves to ${mod}`);
  });

  // 6. Full M1–M16 Regression
  console.log('\n--- 6. Full M1–M16 Regression ---');
  for (let i = 1; i <= 16; i++) {
    const id = `M${i}`;
    const item = catalog.find(m => m.id === id);
    const content = ModuleContentService.getModuleContent(id);

    assert(item !== undefined, `Catalog entry for ${id} exists`);
    assert(content !== null, `Content dataset for ${id} resolves`);
    assert(content?.moduleId === id, `Content moduleId for ${id} matches`);
  }

  console.log(`\n========================================`);
  console.log(`ALL MODULE 16 REGISTRATION TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule16RegistrationTests().catch(err => {
  console.error('Module 16 registration test execution failed:', err);
  process.exit(1);
});
