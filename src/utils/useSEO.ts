import { PageSEO } from '../data/seoData';

export interface SEOPayload {
  title: string;
  metaDescription: string;
  keywords?: string[];
  canonicalUrl?: string;
  h1?: string;
  faqs?: { question: string; answer: string }[];
  breadcrumbs?: { name: string; url: string }[];
}

export function updateDocumentSEO(
  seo?: SEOPayload | PageSEO,
  explicitUrl?: string
) {
  if (typeof document === 'undefined') return;

  if (!seo) {
    document.title = 'Material Yardage — Material & Fabric Yardage Calculator';
    return;
  }

  const currentUrl =
    explicitUrl ||
    ('canonicalUrl' in seo && seo.canonicalUrl ? seo.canonicalUrl : '') ||
    ('fullUrl' in seo && (seo as any).fullUrl ? (seo as any).fullUrl : '') ||
    (typeof window !== 'undefined' ? window.location.href : 'https://www.materialyardage.com');

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
  if (seo.keywords && seo.keywords.length > 0) {
    setMeta('keywords', seo.keywords.join(', '));
  }

  // OpenGraph
  setMeta('og:title', seo.title, true);
  setMeta('og:description', seo.metaDescription, true);
  setMeta('og:type', 'website', true);
  setMeta('og:url', currentUrl, true);
  setMeta('og:site_name', 'Material Yardage', true);
  setMeta('og:image', 'https://www.materialyardage.com/og-image.svg', true);
  setMeta('og:image:width', '1200', true);
  setMeta('og:image:height', '630', true);

  // Twitter Cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', seo.title);
  setMeta('twitter:description', seo.metaDescription);
  setMeta('twitter:image', 'https://www.materialyardage.com/og-image.svg');

  // Canonical Link
  let canonicalEl = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalEl) {
    canonicalEl = document.createElement('link');
    canonicalEl.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute('href', currentUrl);

  // Schema.org Structured Data (WebApplication + AggregateRating + BreadcrumbList + FAQPage + HowTo)
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
      image: 'https://www.materialyardage.com/og-image.svg',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '1420',
        bestRating: '5',
        worstRating: '1',
      },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement:
        'breadcrumbs' in seo && seo.breadcrumbs && seo.breadcrumbs.length > 0
          ? seo.breadcrumbs.map((b: { name: string; url: string }, idx: number) => ({
              '@type': 'ListItem',
              position: idx + 1,
              name: b.name,
              item: b.url.startsWith('http')
                ? b.url
                : `https://www.materialyardage.com${b.url === '/' ? '' : b.url}`,
            }))
          : [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: typeof window !== 'undefined' ? window.location.origin : 'https://www.materialyardage.com',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: seo.h1 || seo.title,
                item: currentUrl,
              },
            ],
    },
  ];

  // If page has workedExample, inject rich HowTo schema
  if ('workedExample' in seo && seo.workedExample && seo.workedExample.steps && seo.workedExample.steps.length > 0) {
    schemaGraph.push({
      '@type': 'HowTo',
      '@id': `${currentUrl}#howto`,
      name: `How to Calculate: ${seo.workedExample.title}`,
      description: seo.workedExample.scenario,
      totalTime: 'PT5M',
      step: seo.workedExample.steps.map((stepText: string, idx: number) => ({
        '@type': 'HowToStep',
        position: idx + 1,
        name: `Step ${idx + 1}`,
        text: stepText,
        url: `${currentUrl}#step-${idx + 1}`,
      })),
    });
  }

  // If page has FAQs, add FAQPage schema
  if (seo.faqs && seo.faqs.length > 0) {
    schemaGraph.push({
      '@type': 'FAQPage',
      '@id': `${currentUrl}#faq`,
      mainEntity: seo.faqs.map((faq: { question: string; answer: string }) => ({
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
