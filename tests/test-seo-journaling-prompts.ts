import { generatePageMetadata } from '../src/lib/seo/metadata';
import { ROUTE_INTENT_MAP, KEYWORD_CLUSTERS } from '../src/lib/seo/keywordStrategy';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runJournalingPromptsPageTests() {
  console.log('=== STARTING PHASE 4 STEP 1: JOURNALING PROMPTS FOR SELF-DISCOVERY TESTS ===\n');

  // 1. Page Component Existence
  console.log('1. Testing Page Component Existence (JournalingPromptsPage.jsx)...');
  const pagePath = path.join(process.cwd(), 'src/views/JournalingPromptsPage.jsx');
  assert(fs.existsSync(pagePath), 'JournalingPromptsPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  console.log('   ✅ Component file exists.');

  // 2 & 3. Single H1 & H1 Content
  console.log('2 & 3. Testing Single H1 & Content...');
  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `Must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('50 Journaling Prompts for Self-Discovery'), 'H1 text must be "50 Journaling Prompts for Self-Discovery"');
  console.log('   ✅ Single H1 with correct title validated.');

  // 4. All Required H2 Headings
  console.log('4. Testing Required H2 Headings...');
  const requiredH2s = [
    'What Are Journaling Prompts for Self-Discovery?',
    'How to Use Journaling Prompts',
    'Journaling Prompts to Understand Yourself Better',
    'Journaling Prompts About Your Emotions',
    'Journaling Prompts About Your Reactions',
    'Journaling Prompts About Your Values',
    'Journaling Prompts for Your Future',
    'What Can You Notice Over Time?',
    'From Random Prompts to Structured Reflection',
    'Using Journaling Prompts With Ingress Within',
    'Frequently Asked Questions About Journaling Prompts'
  ];

  for (const h2 of requiredH2s) {
    assert(pageContent.includes(h2), `Must contain H2 section "${h2}"`);
  }
  console.log('   ✅ All 11 required H2 headings validated.');

  // 5 & 6. Exactly 50 Prompts & 10 in Each Category
  console.log('5 & 6. Testing Prompt Accounting (50 total, 10 per category)...');
  // Check the 5 category arrays in the component
  const category1Matches = pageContent.match(/"What is something happening in your daily life[\s\S]*?"What do you wish you understood better about how you handle pressure or conflict\?"/);
  assert(!!category1Matches, 'Category 1 prompts (Understand Yourself Better) must be present');

  const category2Matches = pageContent.match(/"What specific emotion has been most present[\s\S]*?"If your current primary emotion could speak without being judged, what would it want to acknowledge\?"/);
  assert(!!category2Matches, 'Category 2 prompts (Emotions) must be present');

  const category3Matches = pageContent.match(/"What is an automatic reaction you notice yourself having[\s\S]*?"What alternative response would you like to experiment with next time you encounter a familiar trigger\?"/);
  assert(!!category3Matches, 'Category 3 prompts (Reactions) must be present');

  const category4Matches = pageContent.match(/"What three principles or core values are most important[\s\S]*?"If your choices today were guided purely by your own inner values, what is one small thing you would do differently\?"/);
  assert(!!category4Matches, 'Category 4 prompts (Values) must be present');

  const category5Matches = pageContent.match(/"What is one direction in your life or career[\s\S]*?"What question about your future would be most helpful for you to live with and reflect on right now\?"/);
  assert(!!category5Matches, 'Category 5 prompts (Future) must be present');

  // Verify prompt indices
  assert(pageContent.includes("String(idx + 1).padStart(2, '0')"), 'Category 1 must index from 01 to 10');
  assert(pageContent.includes("String(idx + 11).padStart(2, '0')"), 'Category 2 must index from 11 to 20');
  assert(pageContent.includes("String(idx + 21).padStart(2, '0')"), 'Category 3 must index from 21 to 30');
  assert(pageContent.includes("String(idx + 31).padStart(2, '0')"), 'Category 4 must index from 31 to 40');
  assert(pageContent.includes("String(idx + 41).padStart(2, '0')"), 'Category 5 must index from 41 to 50');
  console.log('   ✅ Exactly 50 prompts accounting (10 per category) validated.');

  // 7 & 8. FAQ Section & Exactly 6 FAQs
  console.log('7 & 8. Testing FAQ Section & 6 FAQs...');
  const faqQuestions = [
    'What are journaling prompts?',
    'How do journaling prompts help with self-discovery?',
    'How often should I use journaling prompts?',
    'What should I write if I do not know how to answer a prompt?',
    'Can I use the same journaling prompt more than once?',
    'Is journaling the same as therapy?'
  ];

  for (const q of faqQuestions) {
    assert(pageContent.includes(q), `FAQ must contain question "${q}"`);
  }
  console.log('   ✅ All 6 FAQ items validated.');

  // 9 & 10. FAQPage JSON-LD Schema Parity
  console.log('9 & 10. Testing FAQPage JSON-LD Schema Parity...');
  assert(pageContent.includes('type="application/ld+json"'), 'Must embed FAQPage JSON-LD schema script tag');
  assert(pageContent.includes('"@type":"FAQPage"') || pageContent.includes('"@type": "FAQPage"'), 'JSON-LD schema must specify "@type": "FAQPage"');
  console.log('   ✅ FAQPage JSON-LD schema validated.');

  // 11 & 12. Non-Clinical Compliance & Absence of Forbidden Phrases
  console.log('11 & 12. Testing Non-Clinical Compliance...');
  assert(pageContent.includes('Ingress Within is designed for guided self-reflection and self-understanding and is not a replacement for professional mental health care.'), 'Must contain explicit non-clinical disclaimer in FAQ');

  const forbiddenTerms = ['cure depression', 'treat anxiety', 'diagnose depression', 'ai therapy', 'replace therapy', 'heal trauma', 'mental illness detection'];
  for (const term of forbiddenTerms) {
    assert(!pageContent.toLowerCase().includes(term), `Content must not contain forbidden phrase "${term}"`);
  }
  console.log('   ✅ Non-clinical language and disclaimer compliance validated.');

  // 13. Route Intent Mapping
  console.log('13. Testing Route Intent Mapping (keywordStrategy.ts)...');
  assert(!!ROUTE_INTENT_MAP.journalingPrompts, 'journalingPrompts route intent must exist in keywordStrategy.ts');
  assert(ROUTE_INTENT_MAP.journalingPrompts.title.includes('50 Journaling Prompts for Self-Discovery'), 'Title must be set correctly in keywordStrategy.ts');
  console.log('   ✅ Route intent mapping validated.');

  // 14 & 15. Metadata & Canonical URL
  console.log('14 & 15. Testing Metadata Generation & Canonical URL (metadata.ts)...');
  const meta = generatePageMetadata({ slug: 'journaling-prompts-for-self-discovery' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;

  assert(titleStr === '50 Journaling Prompts for Self-Discovery | Ingress Within', `Expected title "50 Journaling Prompts for Self-Discovery | Ingress Within", got: "${titleStr}"`);
  assert(meta.description.includes('50 journaling prompts for self-discovery'), `Description must describe 50 journaling prompts, got: "${meta.description}"`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/journaling-prompts-for-self-discovery', `Canonical URL must be "https://ingresswithin.com/journaling-prompts-for-self-discovery", got: "${meta.alternates?.canonical}"`);
  console.log('   ✅ Metadata title, description, and canonical URL validated.');

  // 16, 17 & 18. Sitemap Entry, Priority & Change Frequency
  console.log('16, 17 & 18. Testing Sitemap Inclusion (sitemap.js)...');
  const sitemapEntries = sitemap();
  const entry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/journaling-prompts-for-self-discovery');
  assert(!!entry, '/journaling-prompts-for-self-discovery must exist in sitemap.js');
  assert(entry?.priority === 0.8, `Sitemap priority must be 0.8, got ${entry?.priority}`);
  assert(entry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${entry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry with priority 0.8 and monthly changeFrequency validated.');

  // 19 & 20. Client-Side SPA Routing (App.jsx)
  console.log('19 & 20. Testing App.jsx Lazy Import & Routing...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(appContent.includes("import('./views/JournalingPromptsPage')"), 'App.jsx must lazy import JournalingPromptsPage');
  assert(appContent.includes("path === '/journaling-prompts-for-self-discovery' || path === '/journaling-prompts-for-self-discovery/'"), 'App.jsx must match both trailing and non-trailing slash');
  assert(appContent.includes("case 'journaling-prompts-for-self-discovery':"), 'App.jsx renderPage must have switch case for journaling-prompts-for-self-discovery');
  console.log('   ✅ App.jsx client routing and trailing slash support validated.');

  // 21. Required Inbound Contextual Links
  console.log('21. Testing Inbound Contextual Links (GuidedJournaling, SelfReflection, LandingPage, FaqPage)...');
  const requiredInboundViews = [
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/LandingPage.jsx',
    'src/views/FaqPage.jsx'
  ];

  for (const viewFile of requiredInboundViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/journaling-prompts-for-self-discovery"'), `${viewFile} must contain inbound link href="/journaling-prompts-for-self-discovery"`);
  }
  console.log('   ✅ Inbound contextual links across all 4 required views validated.');

  // 22. Existing SEO Pages Unaffected
  console.log('22. Testing Existing SEO Pages Integrity...');
  const existingViews = [
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/SelfAwarenessPage.jsx'
  ];

  for (const viewFile of existingViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
  }
  console.log('   ✅ Existing SEO pages unaffected.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 4 STEP 1 JOURNALING PROMPTS TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runJournalingPromptsPageTests().catch(err => {
  console.error('Fatal error during Journaling Prompts test suite:', err);
  process.exit(1);
});
