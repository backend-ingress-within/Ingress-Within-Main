import robots from '../src/app/robots';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runSeoTests() {
  console.log('=== STARTING TECHNICAL SEO FOUNDATION VALIDATION TESTS ===\n');

  // 1. Production Domain & Layout Metadata File Tests
  console.log('1. Testing Root Layout Metadata Configuration (src/app/layout.jsx)...');
  const layoutPath = path.join(process.cwd(), 'src/app/layout.jsx');
  assert(fs.existsSync(layoutPath), 'src/app/layout.jsx must exist');
  
  const layoutContent = fs.readFileSync(layoutPath, 'utf-8');
  assert(layoutContent.includes("metadataBase: new URL('https://ingresswithin.com')"), 'metadataBase must be set to https://ingresswithin.com');
  assert(layoutContent.includes("canonical: 'https://ingresswithin.com'"), 'canonical URL must be set to https://ingresswithin.com');
  assert(layoutContent.includes("Ingress Within | Guided Journaling for Mental Wellness & Self-Understanding"), 'Title default must be configured');
  assert(layoutContent.includes("Ingress Within helps you understand yourself through guided journaling, psychology-informed exercises, emotional pattern insights, and structured self-reflection."), 'Description must be configured');

  // Verify non-clinical language compliance
  const lowerDesc = layoutContent.toLowerCase();
  assert(!lowerDesc.includes('cure depression'), 'Layout metadata must not contain clinical claim: cure depression');
  assert(!lowerDesc.includes('diagnose mental illness'), 'Layout metadata must not contain clinical claim: diagnose mental illness');
  assert(!lowerDesc.includes('replace therapy'), 'Layout metadata must not contain clinical claim: replace therapy');
  console.log('   ✅ Production domain and title/description metadata validated.');

  // 2. OpenGraph & Twitter Social Cards in Layout
  console.log('2. Testing OpenGraph & Twitter Social Cards in Layout...');
  assert(layoutContent.includes("url: 'https://ingresswithin.com'"), 'OpenGraph URL must be https://ingresswithin.com');
  assert(layoutContent.includes("siteName: 'Ingress Within'"), 'OpenGraph siteName must be Ingress Within');
  assert(layoutContent.includes("url: '/og-image.png'"), 'OpenGraph image must point to /og-image.png');
  assert(layoutContent.includes("card: 'summary_large_image'"), 'Twitter card must be summary_large_image');
  assert(layoutContent.includes("images: ['/og-image.png']"), 'Twitter image must point to /og-image.png');
  console.log('   ✅ OpenGraph and Twitter cards validated.');

  // 3. Robots.txt Configuration Tests
  console.log('3. Testing Robots.txt Configuration (src/app/robots.js)...');
  const robotsConfig = robots();
  assert(robotsConfig.sitemap === 'https://ingresswithin.com/sitemap.xml', 'Robots sitemap URL must be https://ingresswithin.com/sitemap.xml');
  
  const rule = robotsConfig.rules?.[0] as any;
  assert(rule.userAgent === '*', 'Robots userAgent must be *');
  assert(rule.allow === '/', 'Robots allow must be /');
  
  const disallowed: string[] = rule.disallow;
  const requiredDisallows = ['/api/', '/admin/', '/dashboard', '/write', '/reports', '/patterns', '/knowledge', '/settings', '/onboarding', '/exercise', '/interventions', '/modules', '/session/', '/threads', '/entry/', '/test'];
  for (const path of requiredDisallows) {
    assert(disallowed.includes(path), `Robots disallow array must include ${path}`);
  }
  console.log('   ✅ Robots.txt allow/disallow rules and sitemap declaration validated.');

  // 4. Sitemap.xml Output Tests
  console.log('4. Testing Sitemap.xml Entries (src/app/sitemap.js)...');
  const sitemapEntries = sitemap();
  const urls = sitemapEntries.map(e => e.url);

  assert(urls.includes('https://ingresswithin.com/'), 'Sitemap must include homepage https://ingresswithin.com/');
  assert(urls.includes('https://ingresswithin.com/what-it-is'), 'Sitemap must include /what-it-is');
  assert(urls.includes('https://ingresswithin.com/how-it-works'), 'Sitemap must include /how-it-works');
  assert(urls.includes('https://ingresswithin.com/about'), 'Sitemap must include /about');
  assert(urls.includes('https://ingresswithin.com/pricing'), 'Sitemap must include /pricing');
  assert(urls.includes('https://ingresswithin.com/faq'), 'Sitemap must include /faq');
  assert(urls.includes('https://ingresswithin.com/contact'), 'Sitemap must include /contact');
  assert(urls.includes('https://ingresswithin.com/ai-data'), 'Sitemap must include /ai-data');
  assert(urls.includes('https://ingresswithin.com/auth'), 'Sitemap must include /auth');

  // Verify NO private/authenticated routes are in sitemap
  const forbiddenInSitemap = ['/dashboard', '/write', '/reports', '/patterns', '/vocab', '/knowledge', '/settings', '/onboarding', '/exercise', '/interventions', '/modules', '/support', '/session', '/threads', '/thread', '/entry', '/admin', '/api'];
  for (const entry of sitemapEntries) {
    assert(entry.url.startsWith('https://ingresswithin.com'), `Sitemap URL ${entry.url} must start with https://ingresswithin.com`);
    for (const forbidden of forbiddenInSitemap) {
      assert(!entry.url.includes(forbidden), `Sitemap must NOT contain private route ${forbidden} (found: ${entry.url})`);
    }
  }
  console.log('   ✅ Sitemap public routes and private exclusions validated.');

  // 5. Structured Data Component Tests
  console.log('5. Testing Structured Data (src/components/seo/StructuredData.jsx)...');
  const structDataPath = path.join(process.cwd(), 'src/components/seo/StructuredData.jsx');
  assert(fs.existsSync(structDataPath), 'StructuredData.jsx component must exist');
  
  const structContent = fs.readFileSync(structDataPath, 'utf-8');
  assert(structContent.includes('Organization'), 'StructuredData must define Organization schema');
  assert(structContent.includes('WebSite'), 'StructuredData must define WebSite schema');
  assert(structContent.includes('WebApplication'), 'StructuredData must define WebApplication schema');
  assert(structContent.includes('https://ingresswithin.com'), 'StructuredData must reference production URL https://ingresswithin.com');
  
  // Non-clinical assertions
  const lowerContent = structContent.toLowerCase();
  assert(!lowerContent.includes('cure'), 'StructuredData must not contain unsupported clinical claim: cure');
  assert(!lowerContent.includes('diagnose'), 'StructuredData must not contain unsupported clinical claim: diagnose');
  assert(!lowerContent.includes('medical provider'), 'StructuredData must not contain unsupported clinical claim: medical provider');
  console.log('   ✅ StructuredData JSON-LD schemas validated.');

  console.log('\n==================================================');
  console.log('🎉 ALL TECHNICAL SEO FOUNDATION TESTS PASSED!');
  console.log('==================================================\n');
}

runSeoTests().catch(err => {
  console.error('Fatal error during SEO validation:', err);
  process.exit(1);
});
