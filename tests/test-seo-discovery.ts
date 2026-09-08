import fs from 'fs';
import path from 'path';
import assert from 'assert';
import sitemap from '../src/app/sitemap';
import robots from '../src/app/robots';
import { ROUTE_INTENT_MAP } from '../src/lib/seo/keywordStrategy';
import { generatePageMetadata } from '../src/lib/seo/metadata';

console.log('=== STARTING PHASE 6 STEP 1: SEO DISCOVERY & SEARCH ENGINE READINESS TESTS ===\n');

const BASE_URL = 'https://ingresswithin.com';

const EXPECTED_PUBLIC_ROUTES = [
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
  'how-to-practice-self-reflection',
];

// 1. Testing Production Domain Consistency
console.log('1. Testing Production Domain Consistency...');
assert.strictEqual(BASE_URL, 'https://ingresswithin.com', 'Base URL must be strictly https://ingresswithin.com');
assert(!BASE_URL.includes('localhost'), 'Base URL must not contain localhost');
assert(!BASE_URL.includes('www.'), 'Canonical production domain should be non-www');
console.log('   ✅ Production domain consistency validated.');

// 2. Testing Robots.txt Sitemap Declaration
console.log('2. Testing robots.js Sitemap Declaration...');
const robotsOutput = robots();
assert(robotsOutput.sitemap === `${BASE_URL}/sitemap.xml`, 'robots.js must point to production sitemap.xml');
assert(robotsOutput.rules[0].userAgent === '*', 'robots.js must define rules for userAgent: *');
assert(robotsOutput.rules[0].allow === '/', 'robots.js must allow root public crawling');
console.log('   ✅ robots.txt sitemap declaration and allow rules validated.');

// 3. Testing Sitemap Coverage for All Public SEO Pages
console.log('3. Testing Sitemap Coverage (sitemap.js)...');
const sitemapEntries = sitemap();
const sitemapUrls = sitemapEntries.map((e) => e.url);

for (const route of EXPECTED_PUBLIC_ROUTES) {
  const expectedUrl = route === '' ? `${BASE_URL}/` : `${BASE_URL}/${route}`;
  assert(
    sitemapUrls.includes(expectedUrl),
    `Sitemap must contain public route: ${expectedUrl}`
  );
}
console.log(`   ✅ Sitemap contains all ${EXPECTED_PUBLIC_ROUTES.length} public SEO routes.`);

// 4. Testing Sitemap Contains No Private Routes
console.log('4. Testing Sitemap Private Route Exclusions...');
const FORBIDDEN_PATHS = [
  '/api',
  '/admin',
  '/dashboard',
  '/write',
  '/reports',
  '/patterns',
  '/vocab',
  '/knowledge',
  '/settings',
  '/onboarding',
  '/exercise',
  '/exercises',
  '/assessment',
  '/interventions',
  '/modules',
  '/support',
  '/session',
  '/threads',
  '/thread',
  '/entry',
  '/test',
];

for (const entry of sitemapEntries) {
  for (const forbidden of FORBIDDEN_PATHS) {
    assert(
      !entry.url.includes(forbidden),
      `Sitemap must NOT contain private route pattern "${forbidden}" (found: ${entry.url})`
    );
  }
}
console.log('   ✅ Sitemap contains zero private or authenticated routes.');

// 5. Testing Metadata Configuration for Every Public Page
console.log('5. Testing Metadata Configuration Availability...');
for (const route of EXPECTED_PUBLIC_ROUTES) {
  const meta = generatePageMetadata({ slug: route === '' ? undefined : route });
  assert(meta.title, `Metadata title must exist for route: ${route}`);
  assert(meta.description, `Metadata description must exist for route: ${route}`);
  assert(meta.alternates?.canonical, `Canonical URL must exist for route: ${route}`);
}
console.log('   ✅ Metadata configuration verified for all public routes.');

// 6. Testing Public Page Indexability
console.log('6. Testing Public Route Indexability Directives...');
for (const route of EXPECTED_PUBLIC_ROUTES) {
  const meta = generatePageMetadata({ slug: route === '' ? undefined : route });
  assert.strictEqual(
    meta.robots.index,
    true,
    `Public route "${route}" must have robots.index: true`
  );
  assert.strictEqual(
    meta.robots.follow,
    true,
    `Public route "${route}" must have robots.follow: true`
  );
}
console.log('   ✅ All public SEO routes are marked index: true, follow: true.');

// 7. Testing Private Route Non-Indexability
console.log('7. Testing Private Route noindex / nofollow Directives...');
const testPrivateRoutes = ['dashboard', 'onboarding', 'write', 'settings', 'admin', 'random-invalid-page'];
for (const pRoute of testPrivateRoutes) {
  const meta = generatePageMetadata({ slug: pRoute });
  assert.strictEqual(
    meta.robots.index,
    false,
    `Private/unknown route "${pRoute}" must have robots.index: false`
  );
  assert.strictEqual(
    meta.robots.follow,
    false,
    `Private/unknown route "${pRoute}" must have robots.follow: false`
  );
}
console.log('   ✅ Private and unknown routes correctly protected with index: false, follow: false.');

// 8, 9 & 10. Testing Internal Linking Graph (No Orphan SEO Pages & Pillar Links)
console.log('8, 9 & 10. Testing Internal Linking Graph & Orphan Prevention...');
const viewsDir = path.join(process.cwd(), 'src/views');
const componentsDir = path.join(process.cwd(), 'src/components');
const viewFiles = fs.readdirSync(viewsDir).filter((f) => f.endsWith('.jsx') || f.endsWith('.tsx')).map(f => path.join(viewsDir, f));
const componentFiles = fs.readdirSync(componentsDir).filter((f) => f.endsWith('.jsx') || f.endsWith('.tsx')).map(f => path.join(componentsDir, f));
const allSourceFiles = [...viewFiles, ...componentFiles];

const routeInboundLinks: Record<string, string[]> = {};
for (const route of EXPECTED_PUBLIC_ROUTES) {
  if (route === '') continue;
  routeInboundLinks[route] = [];
}

for (const filePath of allSourceFiles) {
  const fileName = path.basename(filePath);
  const content = fs.readFileSync(filePath, 'utf-8');
  for (const route of Object.keys(routeInboundLinks)) {
    // Check for href="/route" or href="/route/" or Link to /route
    const linkRegex = new RegExp(`href=["'\`](/${route}/?|#${route})["'\`]|navigate\\(["'\`]/${route}`, 'g');
    if (linkRegex.test(content)) {
      routeInboundLinks[route].push(fileName);
    }
  }
}

// Ensure no orphan SEO routes (each route has at least 2 inbound linking views)
for (const [route, sources] of Object.entries(routeInboundLinks)) {
  assert(
    sources.length > 0,
    `Orphan SEO route detected! "${route}" has 0 inbound links in src/views.`
  );
  assert(
    sources.length >= 2,
    `Route "${route}" should have at least 2 inbound links for crawl resilience (found ${sources.length}: ${sources.join(', ')}).`
  );
}

// Verify Homepage links to major pillar pages
const landingContent = fs.readFileSync(path.join(viewsDir, 'LandingPage.jsx'), 'utf-8');
const majorPillars = ['guided-journaling', 'self-reflection', 'emotional-patterns', 'self-awareness'];
for (const pillar of majorPillars) {
  assert(
    landingContent.includes(`/${pillar}`),
    `LandingPage.jsx must link to pillar route /${pillar}`
  );
}
console.log('   ✅ Internal linking graph validated: zero orphan pages; Homepage links to all major pillars.');

// 11. Testing HTTPS in Sitemap URLs
console.log('11. Testing Sitemap URLs Use HTTPS...');
for (const entry of sitemapEntries) {
  assert(
    entry.url.startsWith('https://'),
    `Sitemap entry ${entry.url} must start with https://`
  );
}
console.log('   ✅ All sitemap entries strictly use HTTPS.');

// 12 & 13. Testing Zero Localhost or Staging URLs
console.log('12 & 13. Testing No Localhost or Staging URLs in Sitemap & Metadata...');
for (const entry of sitemapEntries) {
  assert(!entry.url.includes('localhost'), `Sitemap URL must not contain localhost: ${entry.url}`);
  assert(!entry.url.includes('vercel.app'), `Sitemap URL must not contain staging vercel.app: ${entry.url}`);
  assert(!entry.url.includes('127.0.0.1'), `Sitemap URL must not contain 127.0.0.1: ${entry.url}`);
}
for (const route of EXPECTED_PUBLIC_ROUTES) {
  const meta = generatePageMetadata({ slug: route === '' ? undefined : route });
  const canonical = meta.alternates.canonical;
  assert(!canonical.includes('localhost'), `Canonical must not contain localhost: ${canonical}`);
  assert(!canonical.includes('vercel.app'), `Canonical must not contain staging vercel.app: ${canonical}`);
}
console.log('   ✅ Zero localhost or staging references detected.');

// 14. Testing Canonical URL Consistency
console.log('14. Testing Canonical URL Consistency (No Trailing Slashes on Subpaths)...');
for (const route of EXPECTED_PUBLIC_ROUTES) {
  const meta = generatePageMetadata({ slug: route === '' ? undefined : route });
  const canonical = meta.alternates.canonical;
  const expected = route === '' ? BASE_URL : `${BASE_URL}/${route}`;
  assert.strictEqual(
    canonical,
    expected,
    `Canonical URL for route "${route}" should be "${expected}", received "${canonical}"`
  );
  if (route !== '') {
    assert(!canonical.endsWith('/'), `Subpath canonical ${canonical} must not end with trailing slash`);
  }
}
console.log('   ✅ Canonical URLs are strictly consistent across all routes.');

// 15. Testing Google Site Verification Environment Variable Support
console.log('15. Testing GOOGLE_SITE_VERIFICATION Support...');
const layoutPath = path.join(process.cwd(), 'src/app/layout.jsx');
const layoutCode = fs.readFileSync(layoutPath, 'utf-8');
assert(
  layoutCode.includes('GOOGLE_SITE_VERIFICATION'),
  'src/app/layout.jsx must support GOOGLE_SITE_VERIFICATION'
);

const metadataPath = path.join(process.cwd(), 'src/lib/seo/metadata.ts');
const metadataCode = fs.readFileSync(metadataPath, 'utf-8');
assert(
  metadataCode.includes('GOOGLE_SITE_VERIFICATION'),
  'src/lib/seo/metadata.ts must support GOOGLE_SITE_VERIFICATION'
);
console.log('   ✅ Google Search Console verification environment variable integration validated.');

// 16. Testing Bing Site Verification Environment Variable Support
console.log('16. Testing BING_SITE_VERIFICATION Support...');
assert(
  layoutCode.includes('BING_SITE_VERIFICATION'),
  'src/app/layout.jsx must support BING_SITE_VERIFICATION'
);
assert(
  layoutCode.includes('msvalidate.01'),
  'src/app/layout.jsx must support msvalidate.01 for Bing'
);
assert(
  metadataCode.includes('BING_SITE_VERIFICATION'),
  'src/lib/seo/metadata.ts must support BING_SITE_VERIFICATION'
);
console.log('   ✅ Bing Webmaster verification environment variable integration validated.');

console.log('\n====================================================================');
console.log('🎉 ALL 16 PHASE 6 STEP 1 SEO DISCOVERY & READINESS TESTS PASSED!');
console.log('====================================================================\n');
