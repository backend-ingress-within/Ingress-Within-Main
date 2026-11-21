import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getPageMarkdown } from './lib/seo/agentMarkdown';
import { getSubdomain, DOMAINS, SUBDOMAIN_ORIGINS } from './config/subdomains';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions (e.g. .png, .jpg, .svg, .webp)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|txt|xml|json)$).*)',
  ],
};

const RFC_8288_LINK_HEADER = '<https://ingresswithin.com/llms.txt>; rel="describedby"; type="text/markdown", </llms.txt>; rel="describedby"';

const MARKETING_PATHS = new Set([
  '/solution',
  '/what-it-is',
  '/how',
  '/how-it-works',
  '/about',
  '/pricing',
  '/faq',
  '/contact',
  '/start',
  '/ai',
  '/ai-data',
  '/evidence',
  '/policies',
  '/crisis',
  '/feedback',
  '/guided-journaling',
  '/self-reflection',
  '/emotional-patterns',
  '/self-awareness',
  '/journaling-prompts-for-self-discovery',
  '/how-to-start-journaling',
  '/how-to-practice-self-reflection',
  '/privacy-policy',
  '/privacy',
  '/terms',
  '/terms-of-service',
]);

const SELF_HELP_PREFIXES = [
  '/dashboard',
  '/write',
  '/patterns',
  '/reports',
  '/vocab',
  '/knowledge',
  '/kb',
  '/exercise',
  '/exercises',
  '/interventions',
  '/modules',
  '/support',
  '/session',
  '/threads',
  '/thread',
  '/entry',
  '/settings',
  '/onboarding',
  '/auth',
  '/login',
  '/signup',
  '/user/login',
  '/user/auth',
  '/user/signup',
];

function isSelfHelpPath(pathname: string): boolean {
  return SELF_HELP_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(prefix + '/'));
}

function isMarketingPath(pathname: string): boolean {
  if (MARKETING_PATHS.has(pathname)) return true;
  if (pathname.startsWith('/v2')) return true;
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const acceptHeader = request.headers.get('accept') || '';
  const host = (request.headers.get('host') || request.nextUrl.hostname || '').toLowerCase();
  const subdomain = getSubdomain(host);

  // 1. Content Negotiation: Agent requesting Markdown representation (RFC 7763)
  const isMarkdownRequested =
    acceptHeader.includes('text/markdown') ||
    acceptHeader.includes('text/x-markdown');

  // Skip API routes and special paths from markdown content negotiation
  if (isMarkdownRequested && !pathname.startsWith('/api/')) {
    const markdownContent = getPageMarkdown(pathname);

    return new NextResponse(markdownContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Vary': 'Accept',
        'Link': RFC_8288_LINK_HEADER,
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  // 2. Bypass API routes from subdomain rewrites/redirects
  if (pathname.startsWith('/api/')) {
    const response = NextResponse.next();
    response.headers.set('x-subdomain', subdomain);
    return response;
  }

  const isProduction = host.includes('ingresswithin.com');

  // 3. WWW canonical redirect: www.ingresswithin.com -> ingresswithin.com
  if (host === 'www.ingresswithin.com') {
    const targetUrl = new URL(request.nextUrl);
    targetUrl.host = DOMAINS.MAIN;
    targetUrl.protocol = 'https:';
    return NextResponse.redirect(targetUrl, 308);
  }

  // =========================================================================
  // SUBDOMAIN ROUTING: therapy.ingresswithin.com (Client Therapy Portal)
  // =========================================================================
  if (subdomain === 'therapy') {
    // A. Root / -> rewrite to /therapy view
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/therapy';
      const response = NextResponse.rewrite(url);
      response.headers.set('Link', RFC_8288_LINK_HEADER);
      response.headers.set('x-subdomain', 'therapy');
      return response;
    }

    // B. /therapy or /therapy/ -> redirect to / for clean URL
    if (pathname === '/therapy' || pathname === '/therapy/') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url, 307);
    }

    // C. Clean subroutes on therapy domain
    if (pathname === '/login') {
      const url = request.nextUrl.clone();
      url.pathname = '/therapy/login';
      return NextResponse.rewrite(url);
    }
    if (pathname === '/claim-account') {
      const url = request.nextUrl.clone();
      url.pathname = '/therapy/claim-account';
      return NextResponse.rewrite(url);
    }

    // D. Cross-portal redirects: Self-help paths -> app.ingresswithin.com
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.APP}/${search}`, 307);
      }
    }
    if (isSelfHelpPath(pathname) && pathname !== '/login') {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.APP}${pathname}${search}`, 307);
      }
    }

    // E. Cross-portal redirects: Therapist paths -> therapist.ingresswithin.com
    if (pathname === '/therapist' || pathname.startsWith('/therapist/')) {
      const targetSubpath = pathname.replace(/^\/therapist/, '') || '/';
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.THERAPIST}${targetSubpath}${search}`, 307);
      }
    }

    // F. Marketing pages -> ingresswithin.com
    if (isMarketingPath(pathname)) {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.MAIN}${pathname}${search}`, 307);
      }
    }
  }

  // =========================================================================
  // SUBDOMAIN ROUTING: therapist.ingresswithin.com (Therapist Portal)
  // =========================================================================
  if (subdomain === 'therapist') {
    // A. Root / -> rewrite to /therapist view
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/therapist';
      const response = NextResponse.rewrite(url);
      response.headers.set('Link', RFC_8288_LINK_HEADER);
      response.headers.set('x-subdomain', 'therapist');
      return response;
    }

    // B. /therapist or /therapist/ -> redirect to / for clean URL
    if (pathname === '/therapist' || pathname === '/therapist/') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url, 307);
    }

    // C. Clean subroutes on therapist domain: /onboarding, /application, /login, /clients, etc.
    const therapistSubroutes = [
      '/onboarding',
      '/application',
      '/clients',
      '/calendar',
      '/sessions',
      '/earnings',
      '/profile',
      '/auth',
      '/login',
      '/today',
      '/requests',
    ];
    if (therapistSubroutes.some((sr) => pathname === sr || pathname.startsWith(sr + '/'))) {
      const url = request.nextUrl.clone();
      url.pathname = `/therapist${pathname}`;
      return NextResponse.rewrite(url);
    }

    // D. Cross-portal redirects: Self-help paths -> app.ingresswithin.com
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.APP}/${search}`, 307);
      }
    }
    if (isSelfHelpPath(pathname) && pathname !== '/login' && pathname !== '/auth') {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.APP}${pathname}${search}`, 307);
      }
    }

    // E. Cross-portal redirects: Therapy client paths -> therapy.ingresswithin.com
    if (pathname === '/therapy' || pathname.startsWith('/therapy/')) {
      const targetSubpath = pathname.replace(/^\/therapy/, '') || '/';
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.THERAPY}${targetSubpath}${search}`, 307);
      }
    }

    // F. Marketing pages -> ingresswithin.com
    if (isMarketingPath(pathname)) {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.MAIN}${pathname}${search}`, 307);
      }
    }
  }

  // =========================================================================
  // SUBDOMAIN ROUTING: app.ingresswithin.com (Self-Help Web Application)
  // =========================================================================
  if (subdomain === 'app') {
    // A. /dashboard or /dashboard/ -> redirect to root / (dashboard lives strictly at https://app.ingresswithin.com/)
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url, 307);
    }

    // B. Root / on self-help app:
    // If authenticated (cookie present), rewrite to /dashboard.
    // If unauthenticated, redirect to /login.
    if (pathname === '/') {
      const hasAuthCookie =
        request.cookies.has('__Host-iw-access') ||
        request.cookies.has('iw-access');

      if (hasAuthCookie) {
        const url = request.nextUrl.clone();
        url.pathname = '/dashboard';
        const response = NextResponse.rewrite(url);
        response.headers.set('Link', RFC_8288_LINK_HEADER);
        response.headers.set('x-subdomain', 'app');
        return response;
      } else {
        const url = request.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url, 307);
      }
    }

    // B. Cross-portal redirects: Therapy client paths -> therapy.ingresswithin.com
    if (pathname === '/therapy' || pathname.startsWith('/therapy/')) {
      const targetSubpath = pathname.replace(/^\/therapy/, '') || '/';
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.THERAPY}${targetSubpath}${search}`, 307);
      }
    }

    // C. Cross-portal redirects: Therapist paths -> therapist.ingresswithin.com
    if (pathname === '/therapist' || pathname.startsWith('/therapist/')) {
      const targetSubpath = pathname.replace(/^\/therapist/, '') || '/';
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.THERAPIST}${targetSubpath}${search}`, 307);
      }
    }

    // D. Marketing pages -> ingresswithin.com
    if (isMarketingPath(pathname)) {
      if (isProduction) {
        return NextResponse.redirect(`https://${DOMAINS.MAIN}${pathname}${search}`, 307);
      }
    }
  }

  // =========================================================================
  // MAIN DOMAIN: ingresswithin.com (Landing & Marketing Website)
  // =========================================================================
  if (subdomain === 'main' && isProduction) {
    // A. Cross-portal redirects: Self-help routes -> app.ingresswithin.com (root for dashboard)
    if (pathname === '/dashboard' || pathname === '/dashboard/') {
      return NextResponse.redirect(`https://${DOMAINS.APP}/${search}`, 307);
    }

    if (isSelfHelpPath(pathname)) {
      return NextResponse.redirect(`https://${DOMAINS.APP}${pathname}${search}`, 307);
    }

    // B. Cross-portal redirects: Therapy client routes -> therapy.ingresswithin.com
    if (pathname === '/therapy' || pathname.startsWith('/therapy/')) {
      const targetSubpath = pathname.replace(/^\/therapy/, '') || '/';
      return NextResponse.redirect(`https://${DOMAINS.THERAPY}${targetSubpath}${search}`, 307);
    }

    // C. Cross-portal redirects: Therapist routes -> therapist.ingresswithin.com
    if (pathname === '/therapist' || pathname.startsWith('/therapist/')) {
      const targetSubpath = pathname.replace(/^\/therapist/, '') || '/';
      return NextResponse.redirect(`https://${DOMAINS.THERAPIST}${targetSubpath}${search}`, 307);
    }

    // D. Booking tokens: /book/:token -> therapy.ingresswithin.com/book/:token
    if (pathname.startsWith('/book/')) {
      return NextResponse.redirect(`https://${DOMAINS.THERAPY}${pathname}${search}`, 307);
    }
  }

  // Default flow: emit RFC 8288 Link headers and Vary: Accept on public responses
  const response = NextResponse.next();
  response.headers.set('Link', RFC_8288_LINK_HEADER);
  response.headers.set('x-subdomain', subdomain);
  response.headers.append('Vary', 'Accept');

  return response;
}
