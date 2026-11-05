import { useEffect } from 'react';
import { PageSEO } from '../data/seoData';

export function updateDocumentSEO(seo?: PageSEO, currentUrl: string = typeof window !== 'undefined' ? window.location.href : '') {
  if (typeof document === 'undefined') return;

  if (!seo) {
    document.title = 'Material Yardage — Material & Fabric Yardage Calculator';
    return;
  }

  // Update Title
  document.title = `${seo.title} | Material Yardage`;

  // Helper for meta tags
  const setMeta = (name: string, content: string, isProperty: boolean = false) => {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  // Standard Meta Description & Keywords
  setMeta('description', seo.metaDescription);
  setMeta('keywords', seo.keywords.join(', '));

  // OpenGraph
  setMeta('og:title', seo.title, true);
  setMeta('og:description', seo.metaDescription, true);
  setMeta('og:type', 'website', true);
  setMeta('og:url', currentUrl, true);
  setMeta('og:site_name', 'Material Yardage', true);

  // Twitter Cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', seo.title);
  setMeta('twitter:description', seo.metaDescription);

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', currentUrl);

  // Schema.org Structured Data (WebApplication + BreadcrumbList + FAQPage)
  const schemaGraph: any[] = [
    {
      '@type': 'WebApplication',
      '@id': `${currentUrl}#calculator`,
      name: seo.title,
      url: currentUrl,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      browserRequirements: 'Requires JavaScript and HTML5',
      description: seo.metaDescription,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: typeof window !== 'undefined' ? window.location.origin : 'https://www.materialyardage.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: seo.h1,
          item: currentUrl,
        },
      ],
    },
  ];

  // If page has FAQs, add FAQPage schema
  if (seo.faqs && seo.faqs.length > 0) {
    schemaGraph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      mainEntity: seo.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    });
  }

  // Inject into JSON-LD script tag
  let scriptEl = document.getElementById('seo-schema-script') as HTMLScriptElement | null;
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'seo-schema-script';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  scriptEl.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': schemaGraph,
  });
}
