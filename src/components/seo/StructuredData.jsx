import React from 'react';

/**
 * StructuredData component renders production-safe JSON-LD scripts
 * for Organization, LocalBusiness, WebSite, and WebApplication schemas.
 * 
 * Complies with strict non-clinical guidelines (no medical/therapy claims)
 * while exposing complete machine-readable contact and location parameters
 * for automated agents and search indexes.
 */
export default function StructuredData() {
  const baseUrl = 'https://ingresswithin.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Ingress Within',
    'legalName': 'Ingress Within',
    'url': baseUrl,
    'logo': `${baseUrl}/logo-mark.png`,
    'image': `${baseUrl}/logo-mark.png`,
    'description': 'Start on your own, work with a therapist, or move between the two. Ingress Within is one connected space for self-guided work and professional mental health support.',
    'telephone': '+91 89556 05569',
    'email': 'contactus@ingresswithin.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Andheri West',
      'addressLocality': 'Mumbai',
      'addressRegion': 'Maharashtra',
      'postalCode': '400053',
      'addressCountry': 'IN'
    },
    'contactPoint': [
      {
        '@type': 'ContactPoint',
        'telephone': '+91 89556 05569',
        'contactType': 'customer support',
        'email': 'contactus@ingresswithin.com',
        'areaServed': 'IN',
        'availableLanguage': ['English', 'Hindi']
      }
    ],
    'sameAs': [
      'https://twitter.com/ingresswithin',
      'https://www.instagram.com/ingresswithin',
      'https://www.linkedin.com/company/ingress-within'
    ]
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    'name': 'Ingress Within',
    'url': baseUrl,
    'logo': `${baseUrl}/logo-mark.png`,
    'image': `${baseUrl}/logo-mark.png`,
    'description': 'Start on your own, work with a therapist, or move between the two. Ingress Within is one connected space for self-guided work and professional mental health support.',
    'telephone': '+91 89556 05569',
    'email': 'contactus@ingresswithin.com',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Andheri West',
      'addressLocality': 'Mumbai',
      'addressRegion': 'Maharashtra',
      'postalCode': '400053',
      'addressCountry': 'IN'
    },
    'priceRange': '₹₹',
    'currenciesAccepted': 'INR',
    'paymentAccepted': 'Credit Card, Debit Card, UPI, Net Banking',
    'openingHours': 'Mo-Sa 09:00-21:00'
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Ingress Within',
    'url': baseUrl
  };

  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Ingress Within',
    'url': baseUrl,
    'applicationCategory': 'HealthApplication',
    'operatingSystem': 'All',
    'description': 'Start on your own, work with a therapist, or move between the two. Ingress Within is one connected space for self-guided work and professional mental health support.'
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
    </>
  );
}
