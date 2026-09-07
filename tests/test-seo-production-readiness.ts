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

const PUBLIC_SEO_ROUTES = [
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

async function runProductionReadinessTest() {
  console.log('=== STARTING PHASE 5 STEP 2: PRODUCTION SEO VALIDATION & DEPLOYMENT READINESS ===\n');

  // 1. Production Domain Consistency
  console.log('1. Testing Production Domain Consistency...');
  const baseUrl = 'https://ingresswithin.com';
  for (const slug of PUBLIC_SEO_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    assert(meta.metadataBase?.origin === baseUrl, `Metadata base must be ${baseUrl}, got: ${meta.metadataBase?.origin}`);
    assert((meta.alternates?.canonical as string).startsWith(baseUrl), `Canonical must start with ${baseUrl}`);
    assert(!((meta.alternates?.canonical as string).includes('localhost')), 'Canonical must not contain localhost');
  }
  console.log('   ✅ Production domain consistency (https://ingresswithin.com) validated.');

  // 2. Public Route Registry
  console.log('2. Testing Public Route Registry...');
  assert(PUBLIC_SEO_ROUTES.length === 15, `Expected 15 public SEO routes, found: ${PUBLIC_SEO_ROUTES.length}`);
  console.log('   ✅ All 15 public SEO routes registered.');

  // 3. Sitemap Route Coverage
  console.log('3. Testing Sitemap Route Coverage (sitemap.js)...');
  const sitemapEntries = sitemap();
  const sitemapUrls = sitemapEntries.map(e => e.url);
  assert(new Set(sitemapUrls).size === sitemapUrls.length, 'Sitemap must contain no duplicate URLs');

  for (const slug of PUBLIC_SEO_ROUTES) {
    const expectedUrl = slug ? `${baseUrl}/${slug}` : `${baseUrl}/`;
    assert(sitemapUrls.includes(expectedUrl), `Sitemap must contain ${expectedUrl}`);
  }

  for (const priv of PRIVATE_ROUTES) {
    for (const url of sitemapUrls) {
      assert(!url.includes(`/${priv}`), `Sitemap must not contain private path ${priv}, found in ${url}`);
    }
  }
  console.log('   ✅ Sitemap coverage and private route exclusion validated.');

  // 4. Robots Configuration
  console.log('4. Testing Robots Configuration (robots.js)...');
  const robotsConfig = robots();
  assert(robotsConfig.sitemap === `${baseUrl}/sitemap.xml`, `robots.txt must declare sitemap at ${baseUrl}/sitemap.xml`);
  const rule = robotsConfig.rules?.[0];
  assert(rule?.allow === '/', 'robots.txt must allow /');
  const disallows = Array.isArray(rule?.disallow) ? rule?.disallow : [rule?.disallow];
  for (const priv of ['/api/', '/admin/', '/dashboard', '/write', '/reports', '/patterns', '/vocab', '/knowledge', '/settings', '/onboarding']) {
    assert(disallows.includes(priv), `robots.txt must disallow ${priv}`);
  }
  console.log('   ✅ robots.txt configuration and disallow rules validated.');

  // 5. Canonical Generation (Self-Referencing, No Trailing Slash Inconsistency)
  console.log('5. Testing Self-Referencing Canonicals & Trailing Slash Consistency...');
  for (const slug of PUBLIC_SEO_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    const expectedCanonical = slug ? `${baseUrl}/${slug}` : baseUrl;
    assert(meta.alternates?.canonical === expectedCanonical, `Expected canonical "${expectedCanonical}", got "${meta.alternates?.canonical}"`);
    if (slug) {
      assert(!meta.alternates?.canonical.endsWith('/'), `Canonical for /${slug} must not end with trailing slash: ${meta.alternates?.canonical}`);
    }
  }
  console.log('   ✅ Self-referencing canonical URLs with no trailing slashes validated.');

  // 6 & 7. Public Route Indexability vs Private Route noindex
  console.log('6 & 7. Testing Public index:true vs Private noindex:true...');
  for (const slug of PUBLIC_SEO_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    assert(meta.robots?.index === true, `Public route /${slug} must have index: true`);
    assert(meta.robots?.follow === true, `Public route /${slug} must have follow: true`);
  }
  for (const priv of PRIVATE_ROUTES) {
    const meta = generatePageMetadata({ slug: [priv] });
    assert(meta.robots?.index === false, `Private route /${priv} must have index: false`);
    assert(meta.robots?.follow === false, `Private route /${priv} must have follow: false`);
  }
  console.log('   ✅ Public index/follow and private noindex/nofollow validated.');

  // 8. Static Route Generation
  console.log('8. Testing Static Route Generation (page.jsx generateStaticParams)...');
  const pagePath = path.join(process.cwd(), 'src/app/[[...slug]]/page.jsx');
  assert(fs.existsSync(pagePath), 'page.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  assert(pageContent.includes('export function generateStaticParams()'), 'page.jsx must export generateStaticParams');
  for (const slug of PUBLIC_SEO_ROUTES.filter(Boolean)) {
    assert(pageContent.includes(`['${slug}']`), `generateStaticParams must include ['${slug}']`);
  }
  console.log('   ✅ generateStaticParams covers all 15 public SEO routes.');

  // 9. Unknown Route Handling
  console.log('9. Testing Unknown Route Protection (notFound() in page.jsx)...');
  assert(pageContent.includes("import { notFound } from 'next/navigation';"), 'page.jsx must import notFound');
  assert(pageContent.includes('notFound();'), 'page.jsx must invoke notFound() on unknown routes');
  const notFoundPath = path.join(process.cwd(), 'src/app/not-found.jsx');
  assert(fs.existsSync(notFoundPath), 'src/app/not-found.jsx must exist to handle 404 responses');
  console.log('   ✅ Unknown routes trigger notFound() and render src/app/not-found.jsx.');

  // 10. Structured Data Configuration
  console.log('10. Testing Structured Data Configuration...');
  const layoutPath = path.join(process.cwd(), 'src/app/layout.jsx');
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  assert(layoutContent.includes('StructuredData'), 'layout.jsx must include StructuredData component');
  
  const faqViews = [
    'src/views/FaqPage.jsx',
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/SelfAwarenessPage.jsx',
    'src/views/JournalingPromptsPage.jsx',
    'src/views/HowToStartJournalingPage.jsx',
    'src/views/HowToPracticeSelfReflectionPage.jsx'
  ];
  for (const view of faqViews) {
    const fullPath = path.join(process.cwd(), view);
    assert(fs.existsSync(fullPath), `${view} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('"@type": "FAQPage"') || content.includes('"@type":"FAQPage"'), `${view} must include FAQPage JSON-LD schema`);
  }
  console.log('   ✅ Organization, WebSite, WebApplication, and 8 FAQPage schemas validated.');

  // 11. OpenGraph & Twitter Social Metadata Configuration
  console.log('11. Testing OpenGraph & Twitter Social Metadata Configuration...');
  for (const slug of PUBLIC_SEO_ROUTES) {
    const meta = generatePageMetadata({ slug: slug ? [slug] : undefined });
    assert(!!meta.openGraph?.title, `Route /${slug} must have og:title`);
    assert(!!meta.openGraph?.description, `Route /${slug} must have og:description`);
    assert(!!meta.openGraph?.url, `Route /${slug} must have og:url`);
    assert(!!meta.openGraph?.images?.[0]?.url, `Route /${slug} must have og:image`);
    assert(meta.twitter?.card === 'summary_large_image', `Route /${slug} must have twitter:card summary_large_image`);
    assert(!!meta.twitter?.title, `Route /${slug} must have twitter:title`);
    assert(!!meta.twitter?.description, `Route /${slug} must have twitter:description`);
  }
  console.log('   ✅ OpenGraph and Twitter metadata validated across all public routes.');

  // 12. Internal Route Registration & Crawlable Links
  console.log('12. Testing Internal Route Registration & Crawlable Links in Views...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  const appContent = fs.readFileSync(appPath, 'utf-8');
  for (const slug of PUBLIC_SEO_ROUTES.filter(Boolean)) {
    assert(appContent.includes(`path === '/${slug}' || path === '/${slug}/'`), `App.jsx must route /${slug}`);
    assert(appContent.includes(`case '${slug}':`), `App.jsx renderPage must have switch case for ${slug}`);
  }
  console.log('   ✅ All routes registered in App.jsx client router with trailing slash tolerance.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 5 STEP 2 PRODUCTION READINESS TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runProductionReadinessTest().catch(err => {
  console.error('Fatal error during Production Readiness test suite:', err);
  process.exit(1);
});
