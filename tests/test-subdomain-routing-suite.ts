import assert from 'assert';
import { NextRequest } from 'next/server';
import { getSubdomain, getSubdomainUrl, DOMAINS, SUBDOMAIN_ORIGINS } from '../src/config/subdomains';
import { middleware } from '../src/middleware';
import { APP_URLS } from '../src/lib/email/emailTemplates';

async function runSubdomainSuite() {
  console.log('================================================================');
  console.log('      INGRESS WITHIN — MULTI-SUBDOMAIN ROUTING TEST SUITE       ');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function test(condition: boolean, name: string, details?: any) {
    total++;
    if (condition) {
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ✗ [FAIL] ${name}`);
      if (details) console.error('    Details:', details);
    }
  }

  // --------------------------------------------------------------------------
  // TEST SECTION 1: Subdomain Detection
  // --------------------------------------------------------------------------
  console.log('TEST 1: Subdomain Detection (Production & Localhost)');
  test(getSubdomain('ingresswithin.com') === 'main', 'ingresswithin.com resolves to main');
  test(getSubdomain('www.ingresswithin.com') === 'main', 'www.ingresswithin.com resolves to main');
  test(getSubdomain('app.ingresswithin.com') === 'app', 'app.ingresswithin.com resolves to app');
  test(getSubdomain('therapy.ingresswithin.com') === 'therapy', 'therapy.ingresswithin.com resolves to therapy');
  test(getSubdomain('therapist.ingresswithin.com') === 'therapist', 'therapist.ingresswithin.com resolves to therapist');
  test(getSubdomain('localhost:3000') === 'main', 'localhost:3000 resolves to main');
  test(getSubdomain('127.0.0.1:3000') === 'main', '127.0.0.1:3000 resolves to main');
  test(getSubdomain('app.localhost:3000') === 'app', 'app.localhost:3000 resolves to app');
  test(getSubdomain('therapy.localhost:3000') === 'therapy', 'therapy.localhost:3000 resolves to therapy');
  test(getSubdomain('therapist.localhost:3000') === 'therapist', 'therapist.localhost:3000 resolves to therapist');

  // --------------------------------------------------------------------------
  // TEST SECTION 2: URL Builder
  // --------------------------------------------------------------------------
  console.log('\nTEST 2: Authoritative URL Builder (getSubdomainUrl)');
  test(
    getSubdomainUrl('main', '/', 'ingresswithin.com') === 'https://ingresswithin.com/',
    'Main URL resolves to https://ingresswithin.com/'
  );
  test(
    getSubdomainUrl('app', '/dashboard', 'ingresswithin.com') === 'https://app.ingresswithin.com/',
    'Self-help dashboard URL resolves to https://app.ingresswithin.com/'
  );
  test(
    getSubdomainUrl('therapy', '/', 'ingresswithin.com') === 'https://therapy.ingresswithin.com/',
    'Therapy URL resolves to https://therapy.ingresswithin.com/'
  );
  test(
    getSubdomainUrl('therapist', '/onboarding', 'ingresswithin.com') === 'https://therapist.ingresswithin.com/onboarding',
    'Therapist URL resolves to https://therapist.ingresswithin.com/onboarding'
  );
  test(
    getSubdomainUrl('therapy', '', 'localhost') === '/therapy',
    'Localhost fallback resolves /therapy for dev simplicity'
  );

  // --------------------------------------------------------------------------
  // TEST SECTION 3: Email Templates APP_URLS
  // --------------------------------------------------------------------------
  console.log('\nTEST 3: Email Templates Canonical Subdomains');
  test(APP_URLS.LANDING === 'https://ingresswithin.com', 'APP_URLS.LANDING is https://ingresswithin.com');
  test(APP_URLS.SELF_HELP === 'https://app.ingresswithin.com', 'APP_URLS.SELF_HELP is https://app.ingresswithin.com');
  test(APP_URLS.THERAPY_DASHBOARD === 'https://therapy.ingresswithin.com', 'APP_URLS.THERAPY_DASHBOARD is https://therapy.ingresswithin.com');
  test(APP_URLS.THERAPIST_DASHBOARD === 'https://therapist.ingresswithin.com', 'APP_URLS.THERAPIST_DASHBOARD is https://therapist.ingresswithin.com');

  // --------------------------------------------------------------------------
  // TEST SECTION 4: Middleware Routing on Main Domain (ingresswithin.com)
  // --------------------------------------------------------------------------
  console.log('\nTEST 4: Middleware on Main Domain (ingresswithin.com)');
  
  // WWW redirect
  const reqWww = new NextRequest('https://www.ingresswithin.com/');
  const resWww = middleware(reqWww);
  test(resWww.status === 308 && resWww.headers.get('location') === 'https://ingresswithin.com/', 'www.ingresswithin.com redirects (308) to https://ingresswithin.com/');

  // Main landing page stays
  const reqMainRoot = new NextRequest('https://ingresswithin.com/');
  const resMainRoot = middleware(reqMainRoot);
  test(resMainRoot.status === 200, 'ingresswithin.com/ renders homepage (200)');

  // Main marketing pages stay
  const reqMainAbout = new NextRequest('https://ingresswithin.com/about');
  const resMainAbout = middleware(reqMainAbout);
  test(resMainAbout.status === 200, 'ingresswithin.com/about renders marketing page (200)');

  // Main -> App redirect for self-help routes
  const reqMainDashboard = new NextRequest('https://ingresswithin.com/dashboard');
  const resMainDashboard = middleware(reqMainDashboard);
  test(
    resMainDashboard.status === 307 && resMainDashboard.headers.get('location') === 'https://app.ingresswithin.com/',
    'ingresswithin.com/dashboard redirects (307) to https://app.ingresswithin.com/'
  );

  const reqMainWrite = new NextRequest('https://ingresswithin.com/write');
  const resMainWrite = middleware(reqMainWrite);
  test(
    resMainWrite.status === 307 && resMainWrite.headers.get('location') === 'https://app.ingresswithin.com/write',
    'ingresswithin.com/write redirects (307) to https://app.ingresswithin.com/write'
  );

  // Main -> Therapy redirect
  const reqMainTherapy = new NextRequest('https://ingresswithin.com/therapy');
  const resMainTherapy = middleware(reqMainTherapy);
  test(
    resMainTherapy.status === 307 && resMainTherapy.headers.get('location') === 'https://therapy.ingresswithin.com/',
    'ingresswithin.com/therapy redirects (307) to https://therapy.ingresswithin.com/'
  );

  const reqMainTherapyLogin = new NextRequest('https://ingresswithin.com/therapy/login');
  const resMainTherapyLogin = middleware(reqMainTherapyLogin);
  test(
    resMainTherapyLogin.status === 307 && resMainTherapyLogin.headers.get('location') === 'https://therapy.ingresswithin.com/login',
    'ingresswithin.com/therapy/login redirects (307) to https://therapy.ingresswithin.com/login'
  );

  // Main -> Therapist redirect
  const reqMainTherapist = new NextRequest('https://ingresswithin.com/therapist');
  const resMainTherapist = middleware(reqMainTherapist);
  test(
    resMainTherapist.status === 307 && resMainTherapist.headers.get('location') === 'https://therapist.ingresswithin.com/',
    'ingresswithin.com/therapist redirects (307) to https://therapist.ingresswithin.com/'
  );

  const reqMainTherapistOnboarding = new NextRequest('https://ingresswithin.com/therapist/onboarding');
  const resMainTherapistOnboarding = middleware(reqMainTherapistOnboarding);
  test(
    resMainTherapistOnboarding.status === 307 && resMainTherapistOnboarding.headers.get('location') === 'https://therapist.ingresswithin.com/onboarding',
    'ingresswithin.com/therapist/onboarding redirects (307) to https://therapist.ingresswithin.com/onboarding'
  );

  // --------------------------------------------------------------------------
  // TEST SECTION 5: Middleware on Therapy Subdomain (therapy.ingresswithin.com)
  // --------------------------------------------------------------------------
  console.log('\nTEST 5: Middleware on Therapy Subdomain (therapy.ingresswithin.com)');

  // Root / rewrites to /therapy
  const reqTherapyRoot = new NextRequest('https://therapy.ingresswithin.com/');
  const resTherapyRoot = middleware(reqTherapyRoot);
  test(
    resTherapyRoot.headers.get('x-middleware-rewrite')?.endsWith('/therapy') === true,
    'therapy.ingresswithin.com/ rewrites to /therapy'
  );

  // Clean subroute /login rewrites to /therapy/login
  const reqTherapyLogin = new NextRequest('https://therapy.ingresswithin.com/login');
  const resTherapyLogin = middleware(reqTherapyLogin);
  test(
    resTherapyLogin.headers.get('x-middleware-rewrite')?.endsWith('/therapy/login') === true,
    'therapy.ingresswithin.com/login rewrites to /therapy/login'
  );

  // Clean subroute /claim-account rewrites to /therapy/claim-account
  const reqTherapyClaim = new NextRequest('https://therapy.ingresswithin.com/claim-account');
  const resTherapyClaim = middleware(reqTherapyClaim);
  test(
    resTherapyClaim.headers.get('x-middleware-rewrite')?.endsWith('/therapy/claim-account') === true,
    'therapy.ingresswithin.com/claim-account rewrites to /therapy/claim-account'
  );

  // Cross-portal redirect from therapy -> self-help
  const reqTherapyDashboard = new NextRequest('https://therapy.ingresswithin.com/dashboard');
  const resTherapyDashboard = middleware(reqTherapyDashboard);
  test(
    resTherapyDashboard.status === 307 && resTherapyDashboard.headers.get('location') === 'https://app.ingresswithin.com/',
    'therapy.ingresswithin.com/dashboard redirects (307) to https://app.ingresswithin.com/'
  );

  // Cross-portal redirect from therapy -> therapist
  const reqTherapyTherapist = new NextRequest('https://therapy.ingresswithin.com/therapist');
  const resTherapyTherapist = middleware(reqTherapyTherapist);
  test(
    resTherapyTherapist.status === 307 && resTherapyTherapist.headers.get('location') === 'https://therapist.ingresswithin.com/',
    'therapy.ingresswithin.com/therapist redirects (307) to https://therapist.ingresswithin.com/'
  );

  // Cross-portal redirect from therapy -> marketing page
  const reqTherapyAbout = new NextRequest('https://therapy.ingresswithin.com/about');
  const resTherapyAbout = middleware(reqTherapyAbout);
  test(
    resTherapyAbout.status === 307 && resTherapyAbout.headers.get('location') === 'https://ingresswithin.com/about',
    'therapy.ingresswithin.com/about redirects (307) to https://ingresswithin.com/about'
  );

  // --------------------------------------------------------------------------
  // TEST SECTION 6: Middleware on Therapist Subdomain (therapist.ingresswithin.com)
  // --------------------------------------------------------------------------
  console.log('\nTEST 6: Middleware on Therapist Subdomain (therapist.ingresswithin.com)');

  // Root / rewrites to /therapist
  const reqTherapistRoot = new NextRequest('https://therapist.ingresswithin.com/');
  const resTherapistRoot = middleware(reqTherapistRoot);
  test(
    resTherapistRoot.headers.get('x-middleware-rewrite')?.endsWith('/therapist') === true,
    'therapist.ingresswithin.com/ rewrites to /therapist'
  );

  // Clean subroute /onboarding rewrites to /therapist/onboarding
  const reqTherapistOnboardingClean = new NextRequest('https://therapist.ingresswithin.com/onboarding');
  const resTherapistOnboardingClean = middleware(reqTherapistOnboardingClean);
  test(
    resTherapistOnboardingClean.headers.get('x-middleware-rewrite')?.endsWith('/therapist/onboarding') === true,
    'therapist.ingresswithin.com/onboarding rewrites to /therapist/onboarding'
  );

  // Clean subroute /clients rewrites to /therapist/clients
  const reqTherapistClientsClean = new NextRequest('https://therapist.ingresswithin.com/clients');
  const resTherapistClientsClean = middleware(reqTherapistClientsClean);
  test(
    resTherapistClientsClean.headers.get('x-middleware-rewrite')?.endsWith('/therapist/clients') === true,
    'therapist.ingresswithin.com/clients rewrites to /therapist/clients'
  );

  // Cross-portal redirect from therapist -> self-help
  const reqTherapistDashboard = new NextRequest('https://therapist.ingresswithin.com/dashboard');
  const resTherapistDashboard = middleware(reqTherapistDashboard);
  test(
    resTherapistDashboard.status === 307 && resTherapistDashboard.headers.get('location') === 'https://app.ingresswithin.com/',
    'therapist.ingresswithin.com/dashboard redirects (307) to https://app.ingresswithin.com/'
  );

  // Cross-portal redirect from therapist -> therapy
  const reqTherapistTherapy = new NextRequest('https://therapist.ingresswithin.com/therapy');
  const resTherapistTherapy = middleware(reqTherapistTherapy);
  test(
    resTherapistTherapy.status === 307 && resTherapistTherapy.headers.get('location') === 'https://therapy.ingresswithin.com/',
    'therapist.ingresswithin.com/therapy redirects (307) to https://therapy.ingresswithin.com/'
  );

  // Cross-portal redirect from therapist -> marketing page
  const reqTherapistPricing = new NextRequest('https://therapist.ingresswithin.com/pricing');
  const resTherapistPricing = middleware(reqTherapistPricing);
  test(
    resTherapistPricing.status === 307 && resTherapistPricing.headers.get('location') === 'https://ingresswithin.com/pricing',
    'therapist.ingresswithin.com/pricing redirects (307) to https://ingresswithin.com/pricing'
  );

  // --------------------------------------------------------------------------
  // TEST SECTION 7: Middleware on Self-Help Subdomain (app.ingresswithin.com)
  // --------------------------------------------------------------------------
  console.log('\nTEST 7: Middleware on Self-Help Subdomain (app.ingresswithin.com)');

  // Root / unauthenticated redirects to /login
  const reqAppUnauth = new NextRequest('https://app.ingresswithin.com/');
  const resAppUnauth = middleware(reqAppUnauth);
  test(
    resAppUnauth.status === 307 && resAppUnauth.headers.get('location')?.endsWith('/login') === true,
    'app.ingresswithin.com/ unauthenticated redirects (307) to /login'
  );

  // Root / authenticated (with __Host-iw-access cookie) rewrites to /dashboard
  const reqAppAuth = new NextRequest('https://app.ingresswithin.com/', {
    headers: {
      cookie: '__Host-iw-access=test_valid_token_xyz',
    },
  });
  const resAppAuth = middleware(reqAppAuth);
  test(
    resAppAuth.headers.get('x-middleware-rewrite')?.endsWith('/dashboard') === true,
    'app.ingresswithin.com/ authenticated rewrites to /dashboard'
  );

  // Cross-portal redirect from app -> therapy
  const reqAppTherapy = new NextRequest('https://app.ingresswithin.com/therapy');
  const resAppTherapy = middleware(reqAppTherapy);
  test(
    resAppTherapy.status === 307 && resAppTherapy.headers.get('location') === 'https://therapy.ingresswithin.com/',
    'app.ingresswithin.com/therapy redirects (307) to https://therapy.ingresswithin.com/'
  );

  // Cross-portal redirect from app -> therapist
  const reqAppTherapist = new NextRequest('https://app.ingresswithin.com/therapist');
  const resAppTherapist = middleware(reqAppTherapist);
  test(
    resAppTherapist.status === 307 && resAppTherapist.headers.get('location') === 'https://therapist.ingresswithin.com/',
    'app.ingresswithin.com/therapist redirects (307) to https://therapist.ingresswithin.com/'
  );

  // Cross-portal redirect from app -> marketing page
  const reqAppSolution = new NextRequest('https://app.ingresswithin.com/solution');
  const resAppSolution = middleware(reqAppSolution);
  test(
    resAppSolution.status === 307 && resAppSolution.headers.get('location') === 'https://ingresswithin.com/solution',
    'app.ingresswithin.com/solution redirects (307) to https://ingresswithin.com/solution'
  );

  // --------------------------------------------------------------------------
  // TEST SECTION 8: API Routes & Content Negotiation Preservation
  // --------------------------------------------------------------------------
  console.log('\nTEST 8: API Routes & RFC 7763 Content Negotiation');

  const reqApi = new NextRequest('https://therapy.ingresswithin.com/api/therapy/auth/me');
  const resApi = middleware(reqApi);
  test(
    resApi.status === 200 && resApi.headers.get('x-subdomain') === 'therapy',
    'API routes bypass redirection on all subdomains and attach x-subdomain header'
  );

  const reqMarkdown = new NextRequest('https://ingresswithin.com/', {
    headers: { accept: 'text/markdown' },
  });
  const resMarkdown = middleware(reqMarkdown);
  test(
    resMarkdown.headers.get('content-type')?.includes('text/markdown') === true,
    'RFC 7763 Markdown content negotiation remains fully functional'
  );

  console.log('\n================================================================');
  console.log(`SUBDOMAIN SUITE RESULT: ${passed}/${total} passed (${((passed / total) * 100).toFixed(1)}%)`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runSubdomainSuite().catch((err) => {
  console.error('Test suite uncaught error:', err);
  process.exit(1);
});
