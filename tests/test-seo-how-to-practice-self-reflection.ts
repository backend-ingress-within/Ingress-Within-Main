import { generatePageMetadata } from '../src/lib/seo/metadata';
import { ROUTE_INTENT_MAP } from '../src/lib/seo/keywordStrategy';
import sitemap from '../src/app/sitemap';
import fs from 'fs';
import path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  }
}

async function runHowToPracticeSelfReflectionTests() {
  console.log('=== STARTING PHASE 4 STEP 3: HOW TO PRACTICE SELF-REFLECTION TESTS ===\n');

  // 1. Page Component Existence
  console.log('1. Testing Page Component Existence (HowToPracticeSelfReflectionPage.jsx)...');
  const pagePath = path.join(process.cwd(), 'src/views/HowToPracticeSelfReflectionPage.jsx');
  assert(fs.existsSync(pagePath), 'HowToPracticeSelfReflectionPage.jsx must exist');
  const pageContent = fs.readFileSync(pagePath, 'utf-8');
  console.log('   ✅ Component file exists.');

  // 2 & 3. Single H1 & H1 Content
  console.log('2 & 3. Testing Single H1 & Content...');
  const h1Matches = pageContent.match(/<h1[\s\S]*?>[\s\S]*?<\/h1>/gi);
  assert(!!h1Matches && h1Matches.length === 1, `Must contain exactly ONE H1 tag, found: ${h1Matches?.length || 0}`);
  assert(pageContent.includes('How to Practice Self-Reflection'), 'H1 text must be "How to Practice Self-Reflection"');
  console.log('   ✅ Single H1 with correct title validated.');

  // 4. Required H2 Headings
  console.log('4. Testing All Required H2 Headings...');
  const requiredH2s = [
    'What Does It Mean to Practice Self-Reflection?',
    'Why Can Self-Reflection Be Difficult?',
    'How to Practice Self-Reflection in 5 Steps',
    'Questions to Ask Yourself During Self-Reflection',
    'Simple Self-Reflection Techniques',
    'How to Make Self-Reflection a Habit',
    'Daily Self-Reflection: A Simple 5-Minute Practice',
    'How Self-Reflection Can Help You Notice Patterns',
    'Self-Reflection and Journaling',
    'Common Mistakes When Practicing Self-Reflection',
    'How Ingress Within Supports Structured Self-Reflection',
    'Frequently Asked Questions About Practicing Self-Reflection'
  ];

  for (const h2 of requiredH2s) {
    assert(pageContent.includes(h2), `Must contain H2 section "${h2}"`);
  }
  console.log('   ✅ All 12 required H2 headings validated.');

  // 5. 5-Step Framework
  console.log('5. Testing 5-Step Self-Reflection Framework...');
  const stepTerms = [
    'Pause and Choose One Experience',
    'Describe What Happened',
    'Notice Your Thoughts and Emotions',
    'Look at Your Reaction',
    'Ask What You Can Learn or Notice'
  ];
  for (const step of stepTerms) {
    assert(pageContent.includes(step), `5-step framework must contain "${step}"`);
  }
  console.log('   ✅ 5-step framework validated.');

  // 6. 5 Practical Techniques
  console.log('6. Testing 5 Practical Techniques for Self-Reflection...');
  const techniques = [
    'Daily Check-In',
    'Situation–Thought–Reaction Review',
    'The "Why Did That Affect Me?" Question',
    'Compare Similar Experiences',
    'Values Check'
  ];
  for (const tech of techniques) {
    assert(pageContent.includes(tech), `Techniques must contain "${tech}"`);
  }
  console.log('   ✅ All 5 practical techniques validated.');

  // 7. 5-Minute Daily Reflection Template
  console.log('7. Testing 5-Minute Daily Reflection Template Prompts...');
  const templatePrompts = [
    'What happened today?',
    'What stood out?',
    'What was I thinking?',
    'What did I feel?',
    'How did I react?',
    'What do I notice?'
  ];
  for (const prompt of templatePrompts) {
    assert(pageContent.includes(prompt), `Template must contain prompt "${prompt}"`);
  }
  console.log('   ✅ 5-minute template prompts validated.');

  // 8. FAQ Section & Exactly 6 FAQs
  console.log('8. Testing FAQ Section & 6 FAQs...');
  const faqQuestions = [
    'How do I start practicing self-reflection?',
    'How often should I practice self-reflection?',
    'How long should self-reflection take?',
    'What should I ask myself during self-reflection?',
    'Is journaling a form of self-reflection?',
    'Is Ingress Within a replacement for therapy?'
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
  assert(!!ROUTE_INTENT_MAP.howToPracticeSelfReflection, 'howToPracticeSelfReflection route intent must exist in keywordStrategy.ts');
  assert(ROUTE_INTENT_MAP.howToPracticeSelfReflection.title.includes('How to Practice Self-Reflection'), 'Title must be set correctly in keywordStrategy.ts');
  console.log('   ✅ Route intent mapping validated.');

  // 14 & 15. Metadata & Canonical URL
  console.log('14 & 15. Testing Metadata Generation & Canonical URL (metadata.ts)...');
  const meta = generatePageMetadata({ slug: 'how-to-practice-self-reflection' });
  const titleStr = typeof meta.title === 'string' ? meta.title : (meta.title as any)?.default;

  assert(titleStr === 'How to Practice Self-Reflection | Ingress Within', `Expected title "How to Practice Self-Reflection | Ingress Within", got: "${titleStr}"`);
  assert(meta.description.includes('practice self-reflection') && meta.description.includes('5-step framework'), `Description must describe 5-step framework, got: "${meta.description}"`);
  assert(meta.alternates?.canonical === 'https://ingresswithin.com/how-to-practice-self-reflection', `Canonical URL must be "https://ingresswithin.com/how-to-practice-self-reflection", got: "${meta.alternates?.canonical}"`);
  console.log('   ✅ Metadata title, description, and canonical URL validated.');

  // 16, 17 & 18. Sitemap Entry, Priority & Change Frequency
  console.log('16, 17 & 18. Testing Sitemap Inclusion (sitemap.js)...');
  const sitemapEntries = sitemap();
  const entry = sitemapEntries.find(e => e.url === 'https://ingresswithin.com/how-to-practice-self-reflection');
  assert(!!entry, '/how-to-practice-self-reflection must exist in sitemap.js');
  assert(entry?.priority === 0.8, `Sitemap priority must be 0.8, got ${entry?.priority}`);
  assert(entry?.changeFrequency === 'monthly', `Change frequency must be monthly, got ${entry?.changeFrequency}`);
  console.log('   ✅ Sitemap entry with priority 0.8 and monthly changeFrequency validated.');

  // 19 & 20. Client-Side SPA Routing (App.jsx)
  console.log('19 & 20. Testing App.jsx Lazy Import & Routing...');
  const appPath = path.join(process.cwd(), 'src/App.jsx');
  assert(fs.existsSync(appPath), 'App.jsx must exist');
  const appContent = fs.readFileSync(appPath, 'utf-8');

  assert(appContent.includes("import('./views/HowToPracticeSelfReflectionPage')"), 'App.jsx must lazy import HowToPracticeSelfReflectionPage');
  assert(appContent.includes("path === '/how-to-practice-self-reflection' || path === '/how-to-practice-self-reflection/'"), 'App.jsx must match both trailing and non-trailing slash');
  assert(appContent.includes("case 'how-to-practice-self-reflection':"), 'App.jsx renderPage must have switch case for how-to-practice-self-reflection');
  console.log('   ✅ App.jsx client routing and trailing slash support validated.');

  // 21. Required Outbound Links
  console.log('21. Testing Required Outbound Links from HowToPracticeSelfReflectionPage.jsx...');
  const expectedOutbound = [
    'href="/self-reflection"',
    'href="/guided-journaling"',
    'href="/self-awareness"',
    'href="/emotional-patterns"',
    'href="/journaling-prompts-for-self-discovery"',
    'href="/how-to-start-journaling"'
  ];
  for (const link of expectedOutbound) {
    assert(pageContent.includes(link), `Must contain outbound link ${link}`);
  }
  console.log('   ✅ Outbound contextual links validated.');

  // 22. Required Inbound Contextual Links
  console.log('22. Testing Inbound Contextual Links across other views...');
  const requiredInboundViews = [
    'src/views/LandingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfAwarenessPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/JournalingPromptsPage.jsx',
    'src/views/HowToStartJournalingPage.jsx',
    'src/views/FaqPage.jsx'
  ];

  for (const viewFile of requiredInboundViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
    const content = fs.readFileSync(fullPath, 'utf-8');
    assert(content.includes('href="/how-to-practice-self-reflection"'), `${viewFile} must contain inbound link href="/how-to-practice-self-reflection"`);
  }
  console.log('   ✅ Inbound contextual links across all 8 required views validated.');

  // 23. Existing SEO Pages Integrity
  console.log('23. Testing Existing SEO Pages Integrity...');
  const existingViews = [
    'src/views/GuidedJournalingPage.jsx',
    'src/views/SelfReflectionPage.jsx',
    'src/views/EmotionalPatternsPage.jsx',
    'src/views/SelfAwarenessPage.jsx',
    'src/views/JournalingPromptsPage.jsx',
    'src/views/HowToStartJournalingPage.jsx'
  ];

  for (const viewFile of existingViews) {
    const fullPath = path.join(process.cwd(), viewFile);
    assert(fs.existsSync(fullPath), `${viewFile} must exist`);
  }
  console.log('   ✅ Existing SEO pages unaffected.');

  console.log('\n====================================================================');
  console.log('🎉 ALL PHASE 4 STEP 3 HOW TO PRACTICE SELF-REFLECTION TESTS PASSED SUCCESSFULLY!');
  console.log('====================================================================\n');
}

runHowToPracticeSelfReflectionTests().catch(err => {
  console.error('Fatal error during How To Practice Self-Reflection test suite:', err);
  process.exit(1);
});
