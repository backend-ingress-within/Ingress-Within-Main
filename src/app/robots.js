export default function robots() {
  const baseUrl = 'https://ingresswithin.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/admin/',
          '/dashboard',
          '/write',
          '/write/',
          '/interventions',
          '/reports',
          '/patterns',
          '/vocab',
          '/knowledge',
          '/settings',
          '/session/',
          '/onboarding',
          '/exercise',
          '/exercises',
          '/assessment',
          '/modules',
          '/support',
          '/threads',
          '/thread/',
          '/entry/',
          '/test',
          '/test/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
