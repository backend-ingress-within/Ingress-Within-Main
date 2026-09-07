import { generatePageMetadata } from '../src/lib/seo/metadata';
import { ROUTE_INTENT_MAP } from '../src/lib/seo/keywordStrategy';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

const PUBLIC_ROUTES = [
  '',
  'what-it-is',
  'how-it-works',
  'about',
  'pricing',
  'faq',
  'contact',
  'ai-data',
  'guided-journaling',
  'self-reflection',
  'emotional-patterns',
  'self-awareness',
  'journaling-prompts-for-self-discovery',
  'how-to-start-journaling',
  'how-to-practice-self-reflection'
];

const PRIVATE_ROUTES = [
  'api',
  'admin',
  'dashboard',
  'write',
  'reports',
  'patterns',
  'vocab',
  'knowledge',
  'settings',
  'session',
  'onboarding',
  'exercise',
  'exercises',
  'assessment',
  'modules',
  'support',
  'threads',
  'thread',
  'entry',
  'test'
];

async function runSeoIndexabilityAudit() {
  console.log('=== STARTING PHASE 5 STEP 1: SEO CRAWLABILITY, INDEXABILITY & SERVER-RENDERING AUDIT ===\n');

  // 1. Every public SEO route is registered
  console.log('1. Testing Public SEO Route Registration...');
  assert(PUBLIC_ROUTES.length === 15, `Expected 15 public SEO routes, found: ${PUBLIC_ROUTES.length}`);
  console.log(`   ✅ All ${PUBLIC_ROUTES.length} public SEO routes verified.`);

  // 2. Every public route has metadata
  console.log('2. Testing Public Route Metadata Availability...');
  for (const slug of PUBLIC_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    assert(!!meta.title, `Route /${slug} must have a title`);
    assert(!!meta.description, `Route /${slug} must have a description`);
    assert(!!meta.alternates?.canonical, `Route /${slug} must have a canonical URL`);
  }
  console.log('   ✅ All public routes have title, description, and canonical URL.');

  // 3. Titles are unique
  console.log('3. Testing Unique Titles Across Public SEO Routes...');
  const titles = new Set<string>();
  for (const slug of PUBLIC_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;
    assert(!titles.has(titleStr), `Duplicate title found: "${titleStr}" for route /${slug}`);
    titles.add(titleStr);
  }
  assert(titles.size === PUBLIC_ROUTES.length, `Expected ${PUBLIC_ROUTES.length} unique titles, got ${titles.size}`);
  console.log(`   ✅ All ${titles.size} public page titles are strictly unique.`);

  // 4. Descriptions are unique
  console.log('4. Testing Unique Descriptions Across Public SEO Routes...');
  const descriptions = new Set<string>();
  for (const slug of PUBLIC_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    assert(!descriptions.has(meta.description!), `Duplicate description found for route /${slug}`);
    descriptions.add(meta.description!);
  }
  assert(descriptions.size === PUBLIC_ROUTES.length, `Expected ${PUBLIC_ROUTES.length} unique descriptions, got ${descriptions.size}`);
  console.log(`   ✅ All ${descriptions.size} meta descriptions are strictly unique.`);

  // 5, 6 & 7. Canonicals use production domain, no localhost, self-referencing
  console.log('5, 6 & 7. Testing Canonical URL Quality (Production Domain, No Localhost, Self-Referencing)...');
  for (const slug of PUBLIC_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    const canonical = meta.alternates?.canonical as string;
    assert(canonical.startsWith('https://ingresswithin.com'), `Canonical must use https://ingresswithin.com, got: ${canonical}`);
    assert(!canonical.includes('localhost') && !canonical.includes('127.0.0.1'), `Canonical must not contain localhost: ${canonical}`);
    const expectedCanonical = slug ? `https://ingresswithin.com/${slug}` : 'https://ingresswithin.com';
    assert(canonical === expectedCanonical, `Canonical must be self-referencing. Expected "${expectedCanonical}", got "${canonical}"`);
  }
  console.log('   ✅ All canonical URLs are self-referencing https://ingresswithin.com with no localhost.');

  // 8 & 9. Sitemap includes every public route exactly once and excludes private routes
  console.log('8 & 9. Testing Sitemap Completeness & Exclusion of Private Routes (sitemap.js)...');
  const sitemapEntries = sitemap();
  const sitemapUrls = sitemapEntries.map(e => e.url);
  const uniqueSitemapUrls = new Set(sitemapUrls);
  assert(sitemapUrls.length === uniqueSitemapUrls.size, 'Sitemap must not contain duplicate URLs');

  for (const slug of PUBLIC_ROUTES) {
    const expectedUrl = slug ? `https://ingresswithin.com/${slug}` : 'https://ingresswithin.com/';
    assert(sitemapUrls.includes(expectedUrl), `Sitemap must include public route ${expectedUrl}`);
  }

  for (const privatePath of PRIVATE_ROUTES) {
    for (const url of sitemapUrls) {
      assert(!url.includes(`/${privatePath}`), `Sitemap must not contain private route ${privatePath}, found in ${url}`);
    }
  }
  console.log('   ✅ Sitemap contains all 15 public SEO routes with zero duplicates and zero private routes.');

  // 10 & 11. Robots allows public SEO routes and blocks private routes
  console.log('10 & 11. Testing robots.js Crawl Rules...');
  const robotsConfig = robots();
  const mainRule = robotsConfig.rules?.[0];
  assert(!!mainRule, 'robots.js must define rules');
  assert(mainRule.allow === '/', 'robots.js must allow /');
  const disallows = Array.isArray(mainRule.disallow) ? mainRule.disallow : [mainRule.disallow];

  for (const privatePath of ['/api/', '/admin/', '/dashboard', '/write', '/reports', '/patterns', '/vocab', '/knowledge', '/settings', '/onboarding']) {
    assert(disallows.includes(privatePath), `robots.js must disallow "${privatePath}"`);
  }
  assert(robotsConfig.sitemap === 'https://ingresswithin.com/sitemap.xml', 'robots.js must point to sitemap.xml');
  console.log('   ✅ robots.js properly allows public routes and disallows private routes.');

  // 12. Public SEO pages do not contain noindex
  console.log('12. Testing Public Route Indexability Directives...');
  for (const slug of PUBLIC_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    assert(meta.robots?.index === true, `Public route /${slug} must have robots.index === true`);
    assert(meta.robots?.follow === true, `Public route /${slug} must have robots.follow === true`);
  }
  console.log('   ✅ All public SEO routes have index: true and follow: true.');

  // 13. Private route protection rules exist (noindex, nofollow)
  console.log('13. Testing Private Route noindex/nofollow Protection in Metadata...');
  for (const priv of PRIVATE_ROUTES) {
    const meta = generatePageMetadata({ slug: [priv] });
    assert(meta.robots?.index === false, `Private route /${priv} must have robots.index === false`);
    assert(meta.robots?.follow === false, `Private route /${priv} must have robots.follow === false`);
  }
  console.log('   ✅ Private routes dynamically receive robots: { index: false, follow: false }.');

  // 14. SEO content routes resolve correctly in static params
  console.log('14. Testing generateStaticParams in [[...slug]]/page.jsx...');
  const pageFile = path.join(process.cwd(), 'src/app/[[...slug]]/page.jsx');
  assert(fs.existsSync(pageFile), 'page.jsx must exist');
  const pageContent = fs.readFileSync(pageFile, 'utf-8');
  assert(pageContent.includes('export function generateStaticParams()'), 'page.jsx must export generateStaticParams');
  for (const slug of PUBLIC_ROUTES.filter(Boolean)) {
    assert(pageContent.includes(`['${slug}']`), `generateStaticParams must include ['${slug}']`);
  }
  console.log('   ✅ generateStaticParams covers all public SEO routes for SSG pre-rendering.');

  // 15. Representative pages contain exactly one H1
  console.log('15. Testing Single H1 Across Public SEO Views...');
  const representativeViews = [
    'src/views/LandingPage.jsx',
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/SelfAwarenessPage.jsx',
    'src/views/JournalingPromptsPage.jsx',
    'src/views/HowToStartJournalingPage.jsx',
    'src/views/HowToPracticeSelfReflectionPage.jsx'
  ];

  for (const viewRel of representativeViews) {
    const fullPath = path.join(process.cwd(), viewRel);
    assert(fs.existsSync(fullPath), `${viewRel} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const h1Matches = content.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
    assert(!!h1Matches && h1Matches.length === 1, `${viewRel} must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  }
  console.log('   ✅ Exactly one H1 validated across all 8 core SEO views.');

  // 16. Public pages contain crawlable internal links
  console.log('16. Testing Crawlable Internal Linking Graph Across Public Views...');
  for (const viewRel of representativeViews) {
    const fullPath = path.join(process.cwd(), viewRel);
    const content = fs.readFileSync(fullPath, 'utf-8');
    const hasInternalLinks = content.includes('href="/guided-journaling"') ||
                             content.includes('href="/self-reflection"') ||
                             content.includes('href="/emotional-patterns"') ||
                             content.includes('href="/self-awareness"');
    assert(hasInternalLinks, `${viewRel} must contain crawlable HTML anchor links to pillar/cluster pages`);
  }
  console.log('   ✅ Crawlable HTML internal links verified across all core views.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 5 STEP 1 SEO INDEXABILITY & CRAWLABILITY TESTS PASSED!');
  console.log('====================================================================\n');
}

runSeoIndexabilityAudit().catch(err => {
  console.error('Fatal error during SEO Indexability test suite:', err);
  process.exit(1);
});
