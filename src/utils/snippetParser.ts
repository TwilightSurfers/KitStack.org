/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SocialMetadata {
  url: string;
  title: string;
  description: string;
  siteName: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogImageUrl: string;
  ogImageWidth: string;
  ogImageHeight: string;
  ogImageAlt: string;
  ogType: string;
  ogUrl: string;
  ogSiteName?: string;
  twitterCard: 'summary_large_image' | 'summary' | string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  twitterImageUrl: string;
  twitterSite: string;
  twitterCreator: string;
  canonical: string;
  favicon: string;
  themeColor: string;
  author: string;
  keywords: string;
  robots: string;
}

export type PlatformType =
  | 'x-large'
  | 'x-summary'
  | 'facebook'
  | 'linkedin'
  | 'discord'
  | 'slack'
  | 'google'
  | 'whatsapp';

export interface AuditCheck {
  id: string;
  category: 'image' | 'title' | 'description' | 'card' | 'url';
  title: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  recommendation: string;
}

export interface AuditReport {
  score: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  checks: AuditCheck[];
  passCount: number;
  warningCount: number;
  failCount: number;
}

export interface PresetSnippet {
  id: string;
  name: string;
  description: string;
  data: SocialMetadata;
}

export const EMPTY_METADATA: SocialMetadata = {
  url: 'https://example.com',
  title: '',
  description: '',
  siteName: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogImageUrl: '',
  ogImageWidth: '',
  ogImageHeight: '',
  ogImageAlt: '',
  ogType: 'website',
  ogUrl: '',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
  twitterImageUrl: '',
  twitterSite: '',
  twitterCreator: '',
  canonical: '',
  favicon: '',
  themeColor: '#4F46E5',
  author: '',
  keywords: '',
  robots: 'index, follow',
};

export const PRESET_SNIPPETS: PresetSnippet[] = [
  {
    id: 'kitstack',
    name: 'KitStack.org (Production)',
    description: 'Optimal 1200×630 summary_large_image card with full OpenGraph parity',
    data: {
      url: 'https://kitstack.org',
      title: 'KitStack.org — Free Browser Tools & Modular Web Utilities',
      description: 'Zero-account, privacy-first developer & designer workbench. Color & Palette Studio, 64px Grid, Shadow Glow Builder, and live Markdown Blog cleaner.',
      siteName: 'KitStack.org',
      ogTitle: 'KitStack.org — Free Browser Tools & Modular Web Utilities',
      ogDescription: 'Zero-account, privacy-first developer & designer workbench. Color & Palette Studio, 64px Grid, Shadow Glow Builder, and live Markdown Blog cleaner.',
      ogImage: 'https://kitstack.org/og-preview.png',
      ogImageUrl: 'https://kitstack.org/og-preview.png',
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogImageAlt: 'KitStack.org multi-tool developer workbench interface preview',
      ogType: 'website',
      ogUrl: 'https://kitstack.org',
      twitterCard: 'summary_large_image',
      twitterTitle: 'KitStack.org — Free Browser Tools & Modular Web Utilities',
      twitterDescription: 'Zero-account, privacy-first developer & designer workbench. Built for engineers & designers.',
      twitterImage: 'https://kitstack.org/og-preview.png',
      twitterImageUrl: 'https://kitstack.org/og-preview.png',
      twitterSite: '@TwilightSurfers',
      twitterCreator: '@TwilightSurfers',
      canonical: 'https://kitstack.org',
      favicon: 'https://kitstack.org/favicon.ico',
      themeColor: '#4F46E5',
      author: 'Twilight Surfers',
      keywords: 'developer tools, color studio, open graph tester, css utilities',
      robots: 'index, follow',
    },
  },
  {
    id: 'blog-post',
    name: 'Tech Article / Blog Post',
    description: 'Long-form blog post with author attribution, reading time and publication tags',
    data: {
      url: 'https://blog.twilightsurfers.com/defeating-social-crawler-caches',
      title: 'Why Social Crawlers Cache Bad OG Images & How to Force Instant Refreshes',
      description: 'Deep dive into Xbot, Facebook scraper, and LinkedIn bot caching layers. Learn how URL version query tokens and edge cache-control headers guarantee accurate previews.',
      siteName: 'Twilight Surfers Engineering',
      ogTitle: 'Why Social Crawlers Cache Bad OG Images & How to Force Instant Refreshes',
      ogDescription: 'Deep dive into Xbot, Facebook scraper, and LinkedIn bot caching layers. Learn how URL version query tokens and edge cache-control headers guarantee accurate previews.',
      ogImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop&q=80',
      ogImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop&q=80',
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogImageAlt: 'Abstract neon wave graphics illustrating cache invalidation cycles',
      ogType: 'article',
      ogUrl: 'https://blog.twilightsurfers.com/defeating-social-crawler-caches',
      twitterCard: 'summary_large_image',
      twitterTitle: 'Why Social Crawlers Cache Bad OG Images & How to Force Instant Refreshes',
      twitterDescription: 'Deep dive into social crawler caches and how to force immediate updates.',
      twitterImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop&q=80',
      twitterImageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop&q=80',
      twitterSite: '@TwilightSurfers',
      twitterCreator: '@TwilightSurfers',
      canonical: 'https://blog.twilightsurfers.com/defeating-social-crawler-caches',
      favicon: 'https://kitstack.org/favicon.ico',
      themeColor: '#0891B2',
      author: 'Elmer Twilley',
      keywords: 'social crawlers, open graph, cache busting, web performance',
      robots: 'index, follow, max-image-preview:large',
    },
  },
  {
    id: 'saas-launch',
    name: 'SaaS Launch Homepage',
    description: 'High-conversion product card with vibrant screenshot and crisp benefit hook',
    data: {
      url: 'https://orbitflow.cloud',
      title: 'OrbitFlow — Event-Driven Orchestration for Modern Microservices',
      description: 'Trigger, transform, and trace backend workflows with sub-millisecond latencies. Replace fragile cron scripts with typed state machines.',
      siteName: 'OrbitFlow Cloud',
      ogTitle: 'OrbitFlow — Event-Driven Orchestration for Modern Microservices',
      ogDescription: 'Trigger, transform, and trace backend workflows with sub-millisecond latencies. Deploy in 60 seconds.',
      ogImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80',
      ogImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80',
      ogImageWidth: '1200',
      ogImageHeight: '630',
      ogImageAlt: 'OrbitFlow dashboard workflow graph visualization',
      ogType: 'website',
      ogUrl: 'https://orbitflow.cloud',
      twitterCard: 'summary_large_image',
      twitterTitle: 'OrbitFlow — Event-Driven Orchestration for Modern Microservices',
      twitterDescription: 'Trigger, transform, and trace backend workflows with sub-millisecond latencies.',
      twitterImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80',
      twitterImageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop&q=80',
      twitterSite: '@OrbitFlowHQ',
      twitterCreator: '@OrbitFlowHQ',
      canonical: 'https://orbitflow.cloud',
      favicon: 'https://kitstack.org/favicon.ico',
      themeColor: '#7C3AED',
      author: 'OrbitFlow Team',
      keywords: 'microservices, orchestration, serverless, workflows',
      robots: 'index, follow',
    },
  },
  {
    id: 'suboptimal',
    name: 'Suboptimal / Missing Tags (Audit Troubleshooter)',
    description: 'Demonstrates common mistakes: missing og:image, oversized title, no twitter:card',
    data: {
      url: 'http://test-unsecured-site.org/pages/post?id=9941',
      title: 'Welcome to our company website where we build amazing innovative solutions for businesses across multiple sectors with extreme efficiency and quality',
      description: 'Short desc',
      siteName: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '/relative-path-image-broken.png',
      ogImageUrl: 'http://test-unsecured-site.org/relative-path-image-broken.png',
      ogImageWidth: '',
      ogImageHeight: '',
      ogImageAlt: '',
      ogType: '',
      ogUrl: '',
      twitterCard: '',
      twitterTitle: '',
      twitterDescription: '',
      twitterImage: '',
      twitterImageUrl: '',
      twitterSite: '',
      twitterCreator: '',
      canonical: '',
      favicon: '',
      themeColor: '',
      author: '',
      keywords: '',
      robots: '',
    },
  },
];

/**
 * Resolves a potentially relative URL against a base URL
 */
export function resolveAbsoluteUrl(path: string | undefined, baseUrl: string): string {
  if (!path || !path.trim()) return '';
  const trimmed = path.trim();
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) return trimmed;
  try {
    const parsed = new URL(trimmed, baseUrl);
    return parsed.href;
  } catch {
    return trimmed;
  }
}

/**
 * Parses raw HTML string into structured SocialMetadata using DOMParser
 */
export function parseHtmlMetadata(html: string, sourceUrl: string): SocialMetadata {
  const result: SocialMetadata = { ...EMPTY_METADATA, url: sourceUrl };

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Title tag
    const titleEl = doc.querySelector('title');
    if (titleEl && titleEl.textContent) {
      result.title = titleEl.textContent.trim();
    }

    // Helper for meta selectors
    const getMeta = (attribute: string, value: string): string => {
      const el = doc.querySelector(`meta[${attribute}="${value}" i]`);
      return el ? el.getAttribute('content')?.trim() || '' : '';
    };

    // Standard meta tags
    result.description = getMeta('name', 'description') || getMeta('property', 'description');
    result.author = getMeta('name', 'author');
    result.keywords = getMeta('name', 'keywords');
    result.robots = getMeta('name', 'robots');
    result.themeColor = getMeta('name', 'theme-color') || '#4F46E5';

    // Canonical link
    const canonicalEl = doc.querySelector('link[rel="canonical" i]');
    if (canonicalEl) {
      result.canonical = canonicalEl.getAttribute('href')?.trim() || '';
    }

    // Favicon link
    const iconEl =
      doc.querySelector('link[rel="icon" i]') ||
      doc.querySelector('link[rel="shortcut icon" i]') ||
      doc.querySelector('link[rel="apple-touch-icon" i]');
    if (iconEl) {
      const href = iconEl.getAttribute('href')?.trim() || '';
      result.favicon = resolveAbsoluteUrl(href, sourceUrl);
    }

    // Open Graph
    result.ogTitle = getMeta('property', 'og:title') || getMeta('name', 'og:title');
    result.ogDescription = getMeta('property', 'og:description') || getMeta('name', 'og:description');
    result.ogImage = getMeta('property', 'og:image') || getMeta('name', 'og:image');
    result.ogImageUrl = resolveAbsoluteUrl(result.ogImage, sourceUrl);
    result.ogImageWidth = getMeta('property', 'og:image:width');
    result.ogImageHeight = getMeta('property', 'og:image:height');
    result.ogImageAlt = getMeta('property', 'og:image:alt');
    result.ogType = getMeta('property', 'og:type') || 'website';
    result.ogUrl = getMeta('property', 'og:url') || getMeta('name', 'og:url');
    result.ogSiteName = getMeta('property', 'og:site_name') || getMeta('name', 'og:site_name');

    // Twitter Card
    result.twitterCard =
      getMeta('name', 'twitter:card') ||
      getMeta('property', 'twitter:card') ||
      'summary_large_image';
    result.twitterTitle = getMeta('name', 'twitter:title') || getMeta('property', 'twitter:title');
    result.twitterDescription =
      getMeta('name', 'twitter:description') || getMeta('property', 'twitter:description');
    result.twitterImage = getMeta('name', 'twitter:image') || getMeta('property', 'twitter:image');
    result.twitterImageUrl = resolveAbsoluteUrl(result.twitterImage, sourceUrl);
    result.twitterSite = getMeta('name', 'twitter:site') || getMeta('property', 'twitter:site');
    result.twitterCreator =
      getMeta('name', 'twitter:creator') || getMeta('property', 'twitter:creator');

    // Fallbacks
    if (!result.siteName && result.ogSiteName) {
      result.siteName = result.ogSiteName;
    }
  } catch (err) {
    console.error('[KitStack] Error parsing HTML metadata:', err);
  }

  return result;
}

/**
 * Computes platform-resolved preview fields with resolution fallback cascade
 */
export function resolvePlatformPreview(meta: SocialMetadata, platform: PlatformType) {
  // Domain extraction
  let domain = 'example.com';
  try {
    const target = meta.canonical || meta.ogUrl || meta.url;
    if (target) {
      domain = new URL(target).hostname.replace(/^www\./, '');
    }
  } catch {
    domain = 'example.com';
  }

  // Title resolution
  let title = '';
  let titleSource = 'Default';
  if (platform === 'x-large' || platform === 'x-summary') {
    if (meta.twitterTitle) {
      title = meta.twitterTitle;
      titleSource = 'twitter:title';
    } else if (meta.ogTitle) {
      title = meta.ogTitle;
      titleSource = 'og:title (fallback)';
    } else if (meta.title) {
      title = meta.title;
      titleSource = '<title> (fallback)';
    }
  } else {
    if (meta.ogTitle) {
      title = meta.ogTitle;
      titleSource = 'og:title';
    } else if (meta.title) {
      title = meta.title;
      titleSource = '<title> (fallback)';
    } else if (meta.twitterTitle) {
      title = meta.twitterTitle;
      titleSource = 'twitter:title (fallback)';
    }
  }
  if (!title) {
    title = meta.title || 'Untitled Webpage';
  }

  // Description resolution
  let description = '';
  let descriptionSource = 'Default';
  if (platform === 'x-large' || platform === 'x-summary') {
    if (meta.twitterDescription) {
      description = meta.twitterDescription;
      descriptionSource = 'twitter:description';
    } else if (meta.ogDescription) {
      description = meta.ogDescription;
      descriptionSource = 'og:description (fallback)';
    } else if (meta.description) {
      description = meta.description;
      descriptionSource = 'meta description (fallback)';
    }
  } else {
    if (meta.ogDescription) {
      description = meta.ogDescription;
      descriptionSource = 'og:description';
    } else if (meta.description) {
      description = meta.description;
      descriptionSource = 'meta description (fallback)';
    } else if (meta.twitterDescription) {
      description = meta.twitterDescription;
      descriptionSource = 'twitter:description (fallback)';
    }
  }

  // Image resolution
  let image = '';
  let imageSource = 'None';
  if (platform === 'x-large' || platform === 'x-summary') {
    if (meta.twitterImageUrl || meta.twitterImage) {
      image = meta.twitterImageUrl || meta.twitterImage;
      imageSource = 'twitter:image';
    } else if (meta.ogImageUrl || meta.ogImage) {
      image = meta.ogImageUrl || meta.ogImage;
      imageSource = 'og:image (fallback)';
    }
  } else {
    if (meta.ogImageUrl || meta.ogImage) {
      image = meta.ogImageUrl || meta.ogImage;
      imageSource = 'og:image';
    } else if (meta.twitterImageUrl || meta.twitterImage) {
      image = meta.twitterImageUrl || meta.twitterImage;
      imageSource = 'twitter:image (fallback)';
    }
  }

  const siteName = meta.siteName || meta.ogSiteName || domain;

  return {
    domain,
    title,
    titleSource,
    description,
    descriptionSource,
    image,
    imageSource,
    siteName,
    favicon: meta.favicon,
    themeColor: meta.themeColor || '#4F46E5',
  };
}

/**
 * Audits the social metadata against industry SEO & social platform best practices
 */
export function auditSocialMetadata(meta: SocialMetadata): AuditReport {
  const checks: AuditCheck[] = [];

  // 1. OG Image presence & configuration
  const hasOgImage = Boolean(meta.ogImage || meta.ogImageUrl);
  const hasTwitterImage = Boolean(meta.twitterImage || meta.twitterImageUrl);
  const activeImage = meta.ogImageUrl || meta.ogImage || meta.twitterImageUrl || meta.twitterImage;

  if (!hasOgImage && !hasTwitterImage) {
    checks.push({
      id: 'img-missing',
      category: 'image',
      title: 'Missing Social Preview Image',
      status: 'fail',
      message: 'No og:image or twitter:image found. Platforms will display an empty link box or scrape an arbitrary icon.',
      recommendation: 'Add <meta property="og:image" content="https://yourdomain.com/social-image.png"> with 1200×630px dimensions.',
    });
  } else {
    // Check if HTTPS
    if (activeImage && !activeImage.startsWith('https://')) {
      checks.push({
        id: 'img-protocol',
        category: 'image',
        title: 'Insecure Image Protocol',
        status: 'warning',
        message: 'Social image is not hosted over HTTPS. Modern social bots may refuse to fetch insecure HTTP images.',
        recommendation: 'Ensure your image URL starts with https://.',
      });
    } else {
      checks.push({
        id: 'img-protocol',
        category: 'image',
        title: 'Secure Image Protocol (HTTPS)',
        status: 'pass',
        message: 'Preview image is securely served over HTTPS.',
        recommendation: 'Good job!',
      });
    }

    // Check if relative
    if (meta.ogImage && !meta.ogImage.startsWith('http://') && !meta.ogImage.startsWith('https://')) {
      checks.push({
        id: 'img-relative',
        category: 'image',
        title: 'Relative Image Path Detected',
        status: 'fail',
        message: `og:image is defined as "${meta.ogImage}". Social crawlers cannot resolve relative paths.`,
        recommendation: 'Use fully qualified absolute URLs like https://yourdomain.com/path/image.jpg.',
      });
    } else {
      checks.push({
        id: 'img-absolute',
        category: 'image',
        title: 'Absolute Image URL',
        status: 'pass',
        message: 'Image uses a fully qualified absolute domain URL.',
        recommendation: 'Ready for external scrapers.',
      });
    }
  }

  // 2. Title Audit
  const activeTitle = meta.ogTitle || meta.twitterTitle || meta.title;
  if (!activeTitle) {
    checks.push({
      id: 'title-missing',
      category: 'title',
      title: 'Missing Social Title',
      status: 'fail',
      message: 'No title, og:title, or twitter:title provided.',
      recommendation: 'Provide an engaging, clear title under 60 characters.',
    });
  } else if (activeTitle.length > 70) {
    checks.push({
      id: 'title-length',
      category: 'title',
      title: `Title May Truncate (${activeTitle.length} chars)`,
      status: 'warning',
      message: `Title is ${activeTitle.length} characters long. Most social platforms truncate titles after 60-70 characters.`,
      recommendation: 'Keep titles between 40 and 60 characters for maximum visual punch without ellipses.',
    });
  } else if (activeTitle.length < 15) {
    checks.push({
      id: 'title-length',
      category: 'title',
      title: `Title is Very Brief (${activeTitle.length} chars)`,
      status: 'warning',
      message: 'Very short titles often underperform in click-through rates and search clarity.',
      recommendation: 'Aim for a 35-60 character hook that describes your value proposition.',
    });
  } else {
    checks.push({
      id: 'title-length',
      category: 'title',
      title: `Optimal Title Length (${activeTitle.length} chars)`,
      status: 'pass',
      message: 'Title is within the ideal 40-70 character window and will render without truncation.',
      recommendation: 'Perfect length.',
    });
  }

  // 3. Description Audit
  const activeDesc = meta.ogDescription || meta.twitterDescription || meta.description;
  if (!activeDesc) {
    checks.push({
      id: 'desc-missing',
      category: 'description',
      title: 'Missing Meta Description',
      status: 'warning',
      message: 'No og:description or meta description defined. Social feeds will leave the text area empty.',
      recommendation: 'Add a 120-160 character description summarizing the page.',
    });
  } else if (activeDesc.length > 200) {
    checks.push({
      id: 'desc-length',
      category: 'description',
      title: `Description Length Exceeded (${activeDesc.length} chars)`,
      status: 'warning',
      message: `Description is ${activeDesc.length} characters long. Feeds like X, LinkedIn, and Facebook usually clamp after 160-180 characters.`,
      recommendation: 'Trim to 120-160 characters for crisp 2-line rendering.',
    });
  } else {
    checks.push({
      id: 'desc-length',
      category: 'description',
      title: `Balanced Description Length (${activeDesc.length} chars)`,
      status: 'pass',
      message: 'Description fits smoothly inside social snippet cards.',
      recommendation: 'Good length.',
    });
  }

  // 4. Twitter Card declaration
  if (!meta.twitterCard) {
    checks.push({
      id: 'tw-card',
      category: 'card',
      title: 'Missing twitter:card Type',
      status: 'warning',
      message: 'Without twitter:card, X defaults to a small square summary or generic link card.',
      recommendation: 'Set <meta name="twitter:card" content="summary_large_image"> for full-width cards.',
    });
  } else if (meta.twitterCard === 'summary_large_image') {
    checks.push({
      id: 'tw-card',
      category: 'card',
      title: 'X Large Image Card Enabled',
      status: 'pass',
      message: 'Configured for high-impact 1200×630 wide preview card on X / Twitter.',
      recommendation: 'Ideal for engagement.',
    });
  } else {
    checks.push({
      id: 'tw-card',
      category: 'card',
      title: `Twitter Card: ${meta.twitterCard}`,
      status: 'pass',
      message: `Using ${meta.twitterCard} card display type.`,
      recommendation: 'Make sure your image matches the intended ratio.',
    });
  }

  // 5. Canonical & URL
  const activeUrl = meta.canonical || meta.ogUrl || meta.url;
  if (!meta.canonical) {
    checks.push({
      id: 'canonical',
      category: 'url',
      title: 'Missing <link rel="canonical">',
      status: 'warning',
      message: 'No canonical URL declared. Search engines and crawlers may attribute social signals to duplicate query URLs.',
      recommendation: 'Add <link rel="canonical" href="https://yourdomain.com/canonical-path">.',
    });
  } else {
    checks.push({
      id: 'canonical',
      category: 'url',
      title: 'Canonical URL Specified',
      status: 'pass',
      message: `Signals definitive page address to crawlers: ${meta.canonical}`,
      recommendation: 'Prevents duplicate content splitting.',
    });
  }

  // Compute overall score
  let passCount = 0;
  let warningCount = 0;
  let failCount = 0;

  checks.forEach((c) => {
    if (c.status === 'pass') passCount++;
    else if (c.status === 'warning') warningCount++;
    else if (c.status === 'fail') failCount++;
  });

  const totalChecks = checks.length;
  // Weighting: pass = 100%, warning = 60%, fail = 0%
  const rawScore = totalChecks > 0 ? Math.round(((passCount * 100 + warningCount * 60) / (totalChecks * 100)) * 100) : 0;
  const score = Math.max(0, Math.min(100, rawScore));

  let grade: AuditReport['grade'] = 'F';
  if (score >= 95) grade = 'A+';
  else if (score >= 85) grade = 'A';
  else if (score >= 70) grade = 'B';
  else if (score >= 50) grade = 'C';
  else if (score >= 35) grade = 'D';

  return {
    score,
    grade,
    checks,
    passCount,
    warningCount,
    failCount,
  };
}

/**
 * Generates ready-to-copy HTML <head> meta tags
 */
export function generateHtmlHeadSnippet(meta: SocialMetadata): string {
  const lines: string[] = [
    '<!-- Primary Meta Tags -->',
    `<title>${escapeHtml(meta.title || meta.ogTitle || 'Your Page Title')}</title>`,
    `<meta name="title" content="${escapeAttr(meta.title || meta.ogTitle)}" />`,
    `<meta name="description" content="${escapeAttr(meta.description || meta.ogDescription)}" />`,
  ];

  if (meta.canonical) {
    lines.push(`<link rel="canonical" href="${escapeAttr(meta.canonical)}" />`);
  }
  if (meta.favicon) {
    lines.push(`<link rel="icon" href="${escapeAttr(meta.favicon)}" />`);
  }
  if (meta.themeColor) {
    lines.push(`<meta name="theme-color" content="${escapeAttr(meta.themeColor)}" />`);
  }

  lines.push('', '<!-- Open Graph / Facebook -->');
  lines.push(`<meta property="og:type" content="${escapeAttr(meta.ogType || 'website')}" />`);
  if (meta.ogUrl || meta.url) {
    lines.push(`<meta property="og:url" content="${escapeAttr(meta.ogUrl || meta.url)}" />`);
  }
  lines.push(`<meta property="og:title" content="${escapeAttr(meta.ogTitle || meta.title)}" />`);
  lines.push(`<meta property="og:description" content="${escapeAttr(meta.ogDescription || meta.description)}" />`);
  if (meta.ogImageUrl || meta.ogImage) {
    lines.push(`<meta property="og:image" content="${escapeAttr(meta.ogImageUrl || meta.ogImage)}" />`);
    if (meta.ogImageWidth) lines.push(`<meta property="og:image:width" content="${escapeAttr(meta.ogImageWidth)}" />`);
    if (meta.ogImageHeight) lines.push(`<meta property="og:image:height" content="${escapeAttr(meta.ogImageHeight)}" />`);
    if (meta.ogImageAlt) lines.push(`<meta property="og:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`);
  }
  if (meta.siteName || meta.ogSiteName) {
    lines.push(`<meta property="og:site_name" content="${escapeAttr(meta.siteName || meta.ogSiteName)}" />`);
  }

  lines.push('', '<!-- Twitter / X -->');
  lines.push(`<meta name="twitter:card" content="${escapeAttr(meta.twitterCard || 'summary_large_image')}" />`);
  if (meta.url || meta.ogUrl) {
    lines.push(`<meta name="twitter:url" content="${escapeAttr(meta.ogUrl || meta.url)}" />`);
  }
  lines.push(`<meta name="twitter:title" content="${escapeAttr(meta.twitterTitle || meta.ogTitle || meta.title)}" />`);
  lines.push(`<meta name="twitter:description" content="${escapeAttr(meta.twitterDescription || meta.ogDescription || meta.description)}" />`);
  if (meta.twitterImageUrl || meta.twitterImage || meta.ogImageUrl || meta.ogImage) {
    lines.push(`<meta name="twitter:image" content="${escapeAttr(meta.twitterImageUrl || meta.twitterImage || meta.ogImageUrl || meta.ogImage)}" />`);
    if (meta.ogImageAlt) lines.push(`<meta name="twitter:image:alt" content="${escapeAttr(meta.ogImageAlt)}" />`);
  }
  if (meta.twitterSite) {
    lines.push(`<meta name="twitter:site" content="${escapeAttr(meta.twitterSite)}" />`);
  }
  if (meta.twitterCreator) {
    lines.push(`<meta name="twitter:creator" content="${escapeAttr(meta.twitterCreator)}" />`);
  }

  return lines.join('\n');
}

/**
 * Generates Next.js 14+ App Router metadata object
 */
export function generateNextJsMetadata(meta: SocialMetadata): string {
  const imageUrl = meta.ogImageUrl || meta.ogImage || meta.twitterImageUrl || meta.twitterImage;

  return `import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: ${JSON.stringify(meta.title || meta.ogTitle || 'Your Page Title')},
  description: ${JSON.stringify(meta.description || meta.ogDescription || '')},
  metadataBase: new URL(${JSON.stringify(meta.canonical || meta.url || 'https://example.com')}),
  openGraph: {
    title: ${JSON.stringify(meta.ogTitle || meta.title || '')},
    description: ${JSON.stringify(meta.ogDescription || meta.description || '')},
    url: ${JSON.stringify(meta.ogUrl || meta.url || '/')},
    siteName: ${JSON.stringify(meta.siteName || meta.ogSiteName || '')},
    images: [
      {
        url: ${JSON.stringify(imageUrl || '')},
        width: 1200,
        height: 630,
        alt: ${JSON.stringify(meta.ogImageAlt || meta.title || '')},
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: ${JSON.stringify(meta.twitterCard || 'summary_large_image')},
    title: ${JSON.stringify(meta.twitterTitle || meta.ogTitle || meta.title || '')},
    description: ${JSON.stringify(meta.twitterDescription || meta.ogDescription || meta.description || '')},
    creator: ${JSON.stringify(meta.twitterCreator || '@TwilightSurfers')},
    images: [${JSON.stringify(imageUrl || '')}],
  },
};`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
