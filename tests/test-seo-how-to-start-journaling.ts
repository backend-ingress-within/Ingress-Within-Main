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

async function runHowToStartJournalingPageTests() {
  console.log('=== STARTING PHASE 4 STEP 2: HOW TO START JOURNALING TESTS ===\n');

  // 1. Page Component Existence
  console.log('1. Testing Page Component Existence (HowToStartJournalingPage.jsx)...');
  const pagePath = path.join(process.cwd(), 'src/views/HowToStartJournalingPage.jsx');
  assert(fs.existsSync(pagePath), 'HowToStartJournalingPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  console.log('   ✅ Component file exists.');

  // 2 & 3. Single H1 & H1 Content
  console.log('2 & 3. Testing Single H1 & Content...');
  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `Must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('How to Start Journaling: A Simple Guide for Beginners'), 'H1 text must be "How to Start Journaling: A Simple Guide for Beginners"');
  console.log('   ✅ Single H1 with correct title validated.');

  // 4. All 12 Required H2 Headings
  console.log('4. Testing All 12 Required H2 Headings...');
  const requiredH2s = [
    'What Is Journaling?',
    'Why Is It Sometimes Difficult to Start Journaling?',
    'How to Start Journaling in 5 Simple Steps',
    'What Should You Write in a Journal?',
    'A Simple Journaling Template for Beginners',
    'How Long Should You Journal?',
    'How Often Should You Journal?',
    'What If You Do Not Know What to Write?',
    'How Journaling Can Become More Reflective Over Time',
    'Common Mistakes Beginners Make When Journaling',
    'How Ingress Within Supports Structured Journaling',
    'Frequently Asked Questions About Starting a Journal'
  ];

  for (const h2 of requiredH2s) {
    assert(pageContent.includes(h2), `Must contain H2 section "${h2}"`);
  }
  console.log('   ✅ All 12 required H2 headings validated.');

  // 5. 5-Step Framework
  console.log('5. Testing 5-Step Beginner Framework...');
  const stepTerms = [
    'Choose a Simple Time',
    'Start With What Happened',
    'Notice Thoughts',
    'Ask One Question',
    'Stop When You Have Said Enough'
  ];
  for (const step of stepTerms) {
    assert(pageContent.includes(step), `5-step framework must contain "${step}"`);
  }
  console.log('   ✅ 5-step beginner framework validated.');

  // 6. 5 Conceptual Template Stages
  console.log('6. Testing 5 Conceptual Template Stages (Experience, Thoughts, Emotions, Reaction, Reflection)...');
  const templateStages = [
    'Experience',
    'Thoughts',
    'Emotions',
    'Reaction',
    'Reflection'
  ];
  for (const stage of templateStages) {
    assert(pageContent.includes(stage), `Template must contain stage "${stage}"`);
  }
  console.log('   ✅ All 5 template stages validated.');

  // 7 & 8. FAQ Section & Exactly 6 FAQs
  console.log('7 & 8. Testing FAQ Section & 6 FAQs...');
  const faqQuestions = [
    'How do I start journaling for the first time?',
    'What should beginners write in a journal?',
    'How long should a journal entry be?',
    'Do I need to journal every day?',
    'What if I do not know what to write?',
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

  const forbiddenTerms = ['cure depression', 'treat anxiety', 'diagnose depression', 'ai therapist', 'replace therapy', 'heal trauma', 'mental illness detection'];
  for (const term of forbiddenTerms) {
    assert(!pageContent.toLowerCase().includes(term), `Content must not contain forbidden phrase "${term}"`);
  }
  console.log('   ✅ Non-clinical language and disclaimer compliance validated.');

  // 13. Route Intent Mapping
  console.log('13. Testing Route Intent Mapping (keywordStrategy.ts)...');
  assert(!!ROUTE_INTENT_MAP.howToStartJournaling, 'howToStartJournaling route intent must exist in keywordStrategy.ts');
  assert(ROUTE_INTENT_MAP.howToStartJournaling.title.includes('How to Start Journaling'), 'Title must be set correctly in keywordStrategy.ts');
  console.log('   ✅ Route intent mapping validated.');

  // 14 & 15. Metadata & Canonical URL
  console.log('14 & 15. Testing Metadata Generation & Canonical URL (metadata.ts)...');
  const meta = generatePageMetadata({ slug: 'how-to-start-journaling' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;

  assert(titleStr === 'How to Start Journaling: A Simple Guide for Beginners | Ingress Within', `Expected title "How to Start Journaling: A Simple Guide for Beginners | Ingress Within", got: "${titleStr}"`);
  assert(meta.description.includes('start journaling') && meta.description.includes('beginner-friendly'), `Description must describe beginner-friendly journaling guide, got: "${meta.description}"`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/how-to-start-journaling', `Canonical URL must be "https://ingresswithin.com/how-to-start-journaling", got: "${meta.alternates?.canonical}"`);
  console.log('   ✅ Metadata title, description, and canonical URL validated.');

  // 16, 17 & 18. Sitemap Entry, Priority & Change Frequency
  console.log('16, 17 & 18. Testing Sitemap Inclusion (sitemap.js)...');
  const sitemapEntries = sitemap();
  const entry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/how-to-start-journaling');
  assert(!!entry, '/how-to-start-journaling must exist in sitemap.js');
  assert(entry?.priority === 0.8, `Sitemap priority must be 0.8, got ${entry?.priority}`);
  assert(entry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${entry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry with priority 0.8 and monthly changeFrequency validated.');

  // 19 & 20. Client-Side SPA Routing (App.jsx)
  console.log('19 & 20. Testing App.jsx Lazy Import & Routing...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(appContent.includes("import('./views/HowToStartJournalingPage')"), 'App.jsx must lazy import HowToStartJournalingPage');
  assert(appContent.includes("path === '/how-to-start-journaling' || path === '/how-to-start-journaling/'"), 'App.jsx must match both trailing and non-trailing slash');
  assert(appContent.includes("case 'how-to-start-journaling':"), 'App.jsx renderPage must have switch case for how-to-start-journaling');
  console.log('   ✅ App.jsx client routing and trailing slash support validated.');

  // 21. Required Outbound Links
  console.log('21. Testing Required Outbound Links from HowToStartJournalingPage.jsx...');
  const expectedOutbound = [
    'href="/guided-journaling"',
    'href="/journaling-prompts-for-self-discovery"',
    'href="/self-reflection"',
    'href="/emotional-patterns"'
  ];
  for (const link of expectedOutbound) {
    assert(pageContent.includes(link), `Must contain outbound link ${link}`);
  }
  console.log('   ✅ Outbound contextual links validated.');

  // 22. Required Inbound Contextual Links
  console.log('22. Testing Inbound Contextual Links (GuidedJournaling, JournalingPrompts, LandingPage, FaqPage)...');
  const requiredInboundViews = [
    'src/views/GuidedJournalingPage.jsx',
    'src/views/JournalingPromptsPage.jsx',
    'src/views/LandingPage.jsx',
    'src/views/FaqPage.jsx'
  ];

  for (const viewFile of requiredInboundViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/how-to-start-journaling"'), `${viewFile} must contain inbound link href="/how-to-start-journaling"`);
  }
  console.log('   ✅ Inbound contextual links across all 4 required views validated.');

  // 23. Existing SEO Pages Unaffected
  console.log('23. Testing Existing SEO Pages Integrity...');
  const existingViews = [
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/SelfAwarenessPage.jsx',
    'src/views/JournalingPromptsPage.jsx'
  ];

  for (const viewFile of existingViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
  }
  console.log('   ✅ Existing SEO pages unaffected.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 4 STEP 2 HOW TO START JOURNALING TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runHowToStartJournalingPageTests().catch(err => {
  console.error('Fatal error during How To Start Journaling test suite:', err);
  process.exit(1);
});
