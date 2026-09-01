import { ModuleCatalogService } from '../src/lib/modules/moduleCatalogService';
import { ModuleContentService } from '../src/lib/modules/moduleContentService';
import { ModuleRecommendationService } from '../src/lib/modules/moduleRecommendationService';
import { MODULE_14_CONTENT } from '../src/lib/modules/content/module14Data';

async function runModule14RegistrationTests() {
  console.log('--- STARTING MODULE 14 APPLICATION REGISTRATION VALIDATION TESTS ---');

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
  assert(catalog.length === 14, 'Catalog contains exactly 14 modules');

  const m14Catalog = catalog.find(m => m.id === 'M14');
  assert(m14Catalog !== undefined, 'M14 exists in catalog');
  assert(m14Catalog?.id === 'M14', 'M14 catalog ID is M14');
  assert(m14Catalog?.slug === 'grief-loss-life-transitions', 'M14 catalog slug is grief-loss-life-transitions');
  assert(m14Catalog?.name === 'Grief, Loss & Life Transitions', 'M14 catalog name is correct');
  assert(m14Catalog?.price === 499.00, 'M14 catalog price is 499.00');
  assert(m14Catalog?.currency === 'INR', 'M14 catalog currency is INR');
  assert(m14Catalog?.status === 'active', 'M14 catalog status is active');
  assert(m14Catalog?.version === '1.0', 'M14 catalog version is 1.0');
  assert(m14Catalog?.duration_weeks === 7, 'M14 catalog duration is 7 weeks');
  assert(m14Catalog?.taxonomy_concerns.length === 3, 'M14 catalog has 3 taxonomy concerns');
  assert(!!m14Catalog?.taxonomy_concerns.includes('M14-C01'), 'Includes M14-C01');
  assert(!!m14Catalog?.taxonomy_concerns.includes('M14-C02'), 'Includes M14-C02');
  assert(!!m14Catalog?.taxonomy_concerns.includes('M14-C03'), 'Includes M14-C03');

  const allIds = catalog.map(m => m.id);
  const allSlugs = catalog.map(m => m.slug);
  assert(new Set(allIds).size === 14, 'No duplicate module IDs in catalog');
  assert(new Set(allSlugs).size === 14, 'No duplicate module slugs in catalog');

  // 2. Content Resolution Tests
  console.log('\n--- 2. Content Resolution Tests ---');
  const contentById = ModuleContentService.getModuleContent('M14');
  const contentBySlug = ModuleContentService.getModuleContent('grief-loss-life-transitions');
  const allContents = ModuleContentService.getAllModuleContents();

  assert(contentById !== null, 'getModuleContent("M14") resolves content');
  assert(contentBySlug !== null, 'getModuleContent("grief-loss-life-transitions") resolves content');
  assert(contentById === contentBySlug, 'Both ID and slug resolve to exact same content instance');
  assert(contentById === MODULE_14_CONTENT, 'Resolved content matches MODULE_14_CONTENT');
  assert(allContents.length === 14, 'getAllModuleContents() returns exactly 14 modules');

  const contentIds = allContents.map(m => m.moduleId);
  for (let i = 1; i <= 14; i++) {
    const expectedId = `M${i}`;
    assert(contentIds.includes(expectedId), `getAllModuleContents() includes ${expectedId}`);
  }

  // 3. Recommendation Mapping Tests
  console.log('\n--- 3. Recommendation Mapping Tests ---');
  const c01Keywords = [
    'M14-C01', 'grief', 'bereavement', 'grief_and_loss', 'grief-and-loss',
    'loss_of_loved_one', 'loss-of-loved-one', 'death_of_loved_one', 'death-of-loved-one',
    'lost_someone', 'lost-someone', 'missing_someone', 'missing-someone', 'mourning',
    'bereavement_support', 'bereavement-support', 'recent_loss', 'recent-loss',
    'death_in_family', 'death-in-family', 'grieving'
  ];

  c01Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M14' && mapping.concernId === 'M14-C01', `Keyword "${kw}" maps to M14-C01`);
  });

  const c02Keywords = [
    'M14-C02', 'life_transition', 'life-transition', 'major_life_change', 'major-life-change',
    'life_changes', 'life-changes', 'career_transition', 'career-transition',
    'career_change', 'career-change', 'relocation', 'moving_to_new_city', 'moving-to-new-city',
    'retirement', 'role_change', 'role-change', 'identity_transition', 'identity-transition',
    'adjusting_to_change', 'adjusting-to-change', 'difficulty_with_change', 'difficulty-with-change',
    'uncertainty_about_future', 'uncertainty-about-future'
  ];

  c02Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M14' && mapping.concernId === 'M14-C02', `Keyword "${kw}" maps to M14-C02`);
  });

  const c03Keywords = [
    'M14-C03', 'ambiguous_loss', 'ambiguous-loss', 'unfinished_loss', 'unfinished-loss',
    'lack_of_closure', 'lack-of-closure', 'searching_for_closure', 'searching-for-closure',
    'unresolved_loss', 'unresolved-loss', 'estrangement', 'family_estrangement', 'family-estrangement',
    'no_closure', 'no-closure', 'unfulfilled_future', 'unfulfilled-future', 'lost_future', 'lost-future',
    'cognitive_decline_loss', 'cognitive-decline-loss', 'someone_changed', 'someone-changed',
    'relationship_without_closure', 'relationship-without-closure',
    'grief_loss_life_transitions', 'grief-loss-life-transitions'
  ];

  c03Keywords.forEach(kw => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === 'M14' && mapping.concernId === 'M14-C03', `Keyword "${kw}" maps to M14-C03`);
  });

  // 4. Recommendation Isolation Tests
  console.log('\n--- 4. Recommendation Isolation Tests ---');
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
    { kw: 'family_acceptance_lgbtq', mod: 'M13' }
  ];

  isolationCases.forEach(({ kw, mod }) => {
    const mapping = ModuleRecommendationService.mapConcernToModule(kw);
    assert(mapping !== null && mapping.moduleId === mod, `Existing keyword "${kw}" still resolves to ${mod}`);
  });

  // 5. Full M1–M14 Regression
  console.log('\n--- 5. Full M1–M14 Regression ---');
  for (let i = 1; i <= 14; i++) {
    const id = `M${i}`;
    const item = catalog.find(m => m.id === id);
    const content = ModuleContentService.getModuleContent(id);

    assert(item !== undefined, `Catalog entry for ${id} exists`);
    assert(content !== null, `Content dataset for ${id} resolves`);
    assert(content?.moduleId === id, `Content moduleId for ${id} matches`);
  }

  console.log(`\n========================================`);
  console.log(`ALL MODULE 14 REGISTRATION TESTS PASSED: ${passed}/${total}`);
  console.log(`========================================\n`);
}

runModule14RegistrationTests().catch(err => {
  console.error('Module 14 registration test execution failed:', err);
  process.exit(1);
});
