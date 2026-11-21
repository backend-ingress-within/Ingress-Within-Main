/**
 * Authoritative Subdomain Routing Configuration for Ingress Within.
 * 
 * Domain architecture:
 * - ingresswithin.com / www.ingresswithin.com -> Landing / Marketing & Public SEO site
 * - app.ingresswithin.com                     -> Self-Help Web Application (journal, patterns, dashboard, modules)
 * - therapy.ingresswithin.com                 -> Client Therapy Portal (intake, matching, consultations, care plans)
 * - therapist.ingresswithin.com               -> Clinician / Therapist Portal (workspace, calendar, clients, notes)
 */

export type SubdomainType = 'main' | 'app' | 'therapy' | 'therapist';

export const DOMAINS = {
  MAIN: 'ingresswithin.com',
  APP: 'app.ingresswithin.com',
  THERAPY: 'therapy.ingresswithin.com',
  THERAPIST: 'therapist.ingresswithin.com',
} as const;

export const SUBDOMAIN_ORIGINS = {
  main: 'https://ingresswithin.com',
  app: 'https://app.ingresswithin.com',
  therapy: 'https://therapy.ingresswithin.com',
  therapist: 'https://therapist.ingresswithin.com',
} as const;

/**
 * Extracts subdomain type from hostname or Host header.
 * Handles production domains, staging, and local development (.localhost).
 */
export function getSubdomain(hostnameOrHost: string | null | undefined): SubdomainType {
  if (!hostnameOrHost) return 'main';

  // Strip port if present
  const host = hostnameOrHost.split(':')[0].toLowerCase().trim();

  // Explicit production domain matches
  if (host === 'app.ingresswithin.com') return 'app';
  if (host === 'therapy.ingresswithin.com') return 'therapy';
  if (host === 'therapist.ingresswithin.com') return 'therapist';
  if (host === 'ingresswithin.com' || host === 'www.ingresswithin.com') return 'main';

  // Development subdomains (e.g. app.localhost, therapy.localhost, therapist.localhost)
  if (host.startsWith('app.')) return 'app';
  if (host.startsWith('therapy.')) return 'therapy';
  if (host.startsWith('therapist.')) return 'therapist';

  // Default to main
  return 'main';
}

/**
 * Returns whether a hostname is one of our managed subdomains or main domain.
 */
export function isIngressHost(hostnameOrHost: string | null | undefined): boolean {
  if (!hostnameOrHost) return false;
  const host = hostnameOrHost.split(':')[0].toLowerCase().trim();
  return (
    host.endsWith('ingresswithin.com') ||
    host.endsWith('.localhost') ||
    host === 'localhost' ||
    host === '127.0.0.1'
  );
}

/**
 * Generates an authoritative full URL for a target subdomain.
 * In production or cross-domain, returns full https://[subdomain].ingresswithin.com/[path]
 * In local dev without subdomains (pure localhost), preserves relative path for smooth dev flow.
 */
export function getSubdomainUrl(
  subdomain: SubdomainType,
  path: string = '',
  currentHost?: string
): string {
  // Normalize app dashboard path to root '/'
  const normalizedPath = (subdomain === 'app' && (path === '/dashboard' || path === 'dashboard' || path === '')) ? '/' : path;
  const cleanPath = normalizedPath ? (normalizedPath.startsWith('/') ? normalizedPath : `/${normalizedPath}`) : '';

  // Detect runtime host
  const isBrowser = typeof window !== 'undefined';
  const host = currentHost || (isBrowser ? window.location.hostname : '');
  const isLocalhost = host.includes('localhost') || host === '127.0.0.1';

  if (isLocalhost && !host.includes('.')) {
    // Plain localhost:3000 in dev — map to local relative paths
    if (subdomain === 'therapy') {
      return `/therapy${cleanPath === '/' ? '' : cleanPath}`;
    }
    if (subdomain === 'therapist') {
      return `/therapist${cleanPath === '/' ? '' : cleanPath}`;
    }
    if (subdomain === 'app') {
      return cleanPath || '/';
    }
    return cleanPath || '/';
  }

  if (isLocalhost && host.includes('.')) {
    // Development with *.localhost subdomains (e.g. app.localhost:3000)
    const port = isBrowser && window.location.port ? `:${window.location.port}` : ':3000';
    if (subdomain === 'main') return `http://localhost${port}${cleanPath}`;
    return `http://${subdomain}.localhost${port}${cleanPath}`;
  }

  // Production
  const base = SUBDOMAIN_ORIGINS[subdomain] || SUBDOMAIN_ORIGINS.main;
  return `${base}${cleanPath}`;
}
