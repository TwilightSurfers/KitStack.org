/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FooterPresetId = 'corporate' | 'medical' | 'creative' | 'saas-developer' | 'ecommerce';

export type FooterBlockType =
  | 'brand'
  | 'links'
  | 'newsletter'
  | 'contact'
  | 'badges'
  | 'status'
  | 'bottom';

export interface FooterLinkItem {
  id: string;
  label: string;
  href: string;
  badge?: string;
}

export interface FooterBadgeItem {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

export interface FooterBlock {
  id: string;
  type: FooterBlockType;
  title: string;
  enabled: boolean;
  columnSpan?: number; // 1 to 6
  data: {
    // Brand Block Data
    brandName?: string;
    brandTagline?: string;
    brandDescription?: string;
    logoIcon?: string;
    officeLocations?: string[];

    // Links Block Data
    links?: FooterLinkItem[];

    // Newsletter Block Data
    newsletterHeading?: string;
    newsletterDescription?: string;
    newsletterPlaceholder?: string;
    newsletterButtonText?: string;
    newsletterDisclaimer?: string;

    // Contact Block Data
    contactHeading?: string;
    contactPhone?: string;
    contactEmail?: string;
    contactHours?: string;
    emergencyCallout?: string;
    clinicLocation?: string;

    // Badges & Accreditations Block Data
    badgesHeading?: string;
    badges?: FooterBadgeItem[];

    // Status & Dev Block Data
    statusHeading?: string;
    statusState?: 'operational' | 'busy' | 'available' | 'maintenance';
    statusText?: string;
    uptime?: string;
    cliCommand?: string;
    changelogVersion?: string;

    // Bottom Bar Data
    copyrightText?: string;
    legalLinks?: FooterLinkItem[];
    showCurrency?: boolean;
    showLanguage?: boolean;
    backToTop?: boolean;
    designerCredit?: string;
  };
}

export interface FooterConfig {
  id: string;
  presetId: FooterPresetId;
  name: string;
  tagline: string;
  columns: 1 | 2 | 3 | 4 | 5 | 6;
  theme: 'midnight' | 'dark' | 'light' | 'slate' | 'brand-tint';
  accentColor: string;
  bgColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  density: 'compact' | 'normal' | 'spacious';
  fontFamily: 'sans' | 'serif' | 'mono';
  borderTop: 'none' | 'subtle' | 'accent' | 'gradient' | 'dashed';
  blocks: FooterBlock[];
}

export const FOOTER_PRESETS: Record<FooterPresetId, FooterConfig> = {
  corporate: {
    id: 'corporate-preset',
    presetId: 'corporate',
    name: 'Corporate Enterprise',
    tagline: 'Authority, global compliance, multi-column navigation & investor governance',
    columns: 4,
    theme: 'midnight',
    accentColor: '#3B82F6',
    bgColor: '#0B0F19',
    textColor: '#F8FAFC',
    mutedTextColor: '#94A3B8',
    borderColor: '#1E293B',
    borderRadius: 'md',
    density: 'normal',
    fontFamily: 'sans',
    borderTop: 'subtle',
    blocks: [
      {
        id: 'block-brand',
        type: 'brand',
        title: 'Brand & Global Footprint',
        enabled: true,
        columnSpan: 1,
        data: {
          brandName: 'Aegis Global Enterprises',
          brandTagline: 'Institutional Intelligence & Enterprise Infrastructure',
          brandDescription:
            'Powering mission-critical operations for Fortune 500 enterprises across 42 countries with verifiable security and governance.',
          logoIcon: 'Shield',
          officeLocations: ['New York', 'London', 'Zurich', 'Singapore', 'Tokyo'],
        },
      },
      {
        id: 'block-links-1',
        type: 'links',
        title: 'Platform Solutions',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'l1', label: 'Enterprise Cloud Grid', href: '#cloud' },
            { id: 'l2', label: 'Autonomous Compliance', href: '#compliance', badge: 'v4.2' },
            { id: 'l3', label: 'Quantum Cryptography', href: '#crypto' },
            { id: 'l4', label: 'SLA & High Availability', href: '#sla' },
            { id: 'l5', label: 'Executive Security Suite', href: '#security' },
          ],
        },
      },
      {
        id: 'block-links-2',
        type: 'links',
        title: 'Governance & Company',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'l6', label: 'Board of Directors', href: '#board' },
            { id: 'l7', label: 'Investor Relations (SEC)', href: '#ir' },
            { id: 'l8', label: 'ESG & Sustainability', href: '#esg' },
            { id: 'l9', label: 'Global Careers', href: '#careers', badge: 'Hiring' },
            { id: 'l10', label: 'Press & Media Center', href: '#press' },
          ],
        },
      },
      {
        id: 'block-newsletter',
        type: 'newsletter',
        title: 'Quarterly Executive Digest',
        enabled: true,
        columnSpan: 1,
        data: {
          newsletterHeading: 'Quarterly Executive Digest',
          newsletterDescription:
            'Institutional macro analysis, regulatory updates, and C-suite technical strategy delivered to 120,000+ executives.',
          newsletterPlaceholder: 'corporate.email@organization.com',
          newsletterButtonText: 'Subscribe',
          newsletterDisclaimer: 'Strict zero-spam policy. Unsubscribe anytime.',
        },
      },
      {
        id: 'block-badges',
        type: 'badges',
        title: 'Certifications & Compliance',
        enabled: true,
        columnSpan: 4,
        data: {
          badgesHeading: 'Enterprise Compliance & Security Standards',
          badges: [
            { id: 'b1', label: 'SOC 2 Type II', sublabel: 'Certified & Audited', icon: 'ShieldCheck' },
            { id: 'b2', label: 'ISO/IEC 27001', sublabel: 'Information Security', icon: 'Award' },
            { id: 'b3', label: 'GDPR & CCPA', sublabel: 'Strict Privacy Compliant', icon: 'Lock' },
            { id: 'b4', label: 'FedRAMP Ready', sublabel: 'GovCloud Certified', icon: 'CheckCircle' },
          ],
        },
      },
      {
        id: 'block-bottom',
        type: 'bottom',
        title: 'Global Footer Bar',
        enabled: true,
        columnSpan: 4,
        data: {
          copyrightText: '© 2026 Aegis Global Enterprises Inc. All rights reserved.',
          legalLinks: [
            { id: 'll1', label: 'Privacy Statement', href: '#privacy' },
            { id: 'll2', label: 'Master Services Agreement', href: '#msa' },
            { id: 'll3', label: 'Trust & Transparency Portal', href: '#trust' },
            { id: 'll4', label: 'Cookie Preferences', href: '#cookies' },
          ],
          showCurrency: true,
          showLanguage: true,
        },
      },
    ],
  },

  medical: {
    id: 'medical-preset',
    presetId: 'medical',
    name: 'Medical & Healthcare Network',
    tagline: '24/7 emergency hotline, HIPAA verification, clinic hours & compassionate care',
    columns: 4,
    theme: 'brand-tint',
    accentColor: '#0D9488',
    bgColor: '#042F2E',
    textColor: '#F0FDFA',
    mutedTextColor: '#99F6E4',
    borderColor: '#134E4A',
    borderRadius: 'lg',
    density: 'normal',
    fontFamily: 'sans',
    borderTop: 'accent',
    blocks: [
      {
        id: 'block-contact',
        type: 'contact',
        title: '24/7 Urgent & Emergency Care',
        enabled: true,
        columnSpan: 1,
        data: {
          contactHeading: 'Emergency & Acute Care',
          emergencyCallout: 'Emergency Hotline: 1-800-BEACON-MD',
          contactPhone: '(555) 849-2020 (Main Hospital)',
          contactEmail: 'care-coordinator@beaconhealth.org',
          clinicLocation: '742 Mercy Way, Metro Pavilion Suite 400',
          contactHours: 'Urgent Care: 7:00 AM – 11:00 PM (Daily)\nTrauma Center: Open 24/7/365',
        },
      },
      {
        id: 'block-links-1',
        type: 'links',
        title: 'Patient Resources',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'ml1', label: 'MyHealth Patient Portal Login', href: '#portal', badge: 'Secure' },
            { id: 'ml2', label: 'Request Telehealth Consultation', href: '#telehealth' },
            { id: 'ml3', label: 'Online Bill Pay & Financial Aid', href: '#billing' },
            { id: 'ml4', label: 'Prescription Refills & Pharmacy', href: '#pharmacy' },
            { id: 'ml5', label: 'Insurances & Medicare Accepted', href: '#insurance' },
          ],
        },
      },
      {
        id: 'block-links-2',
        type: 'links',
        title: 'Clinical Specialties',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'ml6', label: 'Cardiology & Heart Center', href: '#cardiology' },
            { id: 'ml7', label: 'Neurology & Brain Sciences', href: '#neurology' },
            { id: 'ml8', label: 'Orthopedics & Sports Medicine', href: '#ortho' },
            { id: 'ml9', label: 'Pediatric & Neonatal Care', href: '#pediatrics' },
            { id: 'ml10', label: 'Oncology Comprehensive Center', href: '#oncology' },
          ],
        },
      },
      {
        id: 'block-brand',
        type: 'brand',
        title: 'Hospital System Overview',
        enabled: true,
        columnSpan: 1,
        data: {
          brandName: 'Beacon Healthcare Network',
          brandTagline: 'Compassionate Medicine, World-Class Clinical Science',
          brandDescription:
            'Nationally ranked university-affiliated medical teaching hospital and community health network dedicated to evidence-based healing.',
          logoIcon: 'HeartPulse',
        },
      },
      {
        id: 'block-badges',
        type: 'badges',
        title: 'Accreditations & Quality',
        enabled: true,
        columnSpan: 4,
        data: {
          badgesHeading: 'Recognized Clinical Excellence & Quality Standards',
          badges: [
            { id: 'mb1', label: 'HIPAA Compliant', sublabel: 'Encrypted Patient Data', icon: 'Lock' },
            { id: 'mb2', label: 'The Joint Commission', sublabel: 'National Gold Seal', icon: 'Award' },
            { id: 'mb3', label: 'Magnet Recognized', sublabel: 'Excellence in Nursing', icon: 'Heart' },
            { id: 'mb4', label: 'ADA Certified', sublabel: 'Equal Access Facilities', icon: 'CheckCircle' },
          ],
        },
      },
      {
        id: 'block-bottom',
        type: 'bottom',
        title: 'Medical Compliance Bar',
        enabled: true,
        columnSpan: 4,
        data: {
          copyrightText:
            '© 2026 Beacon Healthcare Health System. Medical Disclaimer: Information on this site is educational and does not substitute professional medical diagnosis.',
          legalLinks: [
            { id: 'mll1', label: 'Notice of Privacy Practices', href: '#privacy' },
            { id: 'mll2', label: 'Non-Discrimination Policy', href: '#nondiscrimination' },
            { id: 'mll3', label: 'Language Assistance (15+ Languages)', href: '#language' },
            { id: 'mll4', label: 'Patient Bill of Rights', href: '#rights' },
          ],
          showLanguage: true,
        },
      },
    ],
  },

  creative: {
    id: 'creative-preset',
    presetId: 'creative',
    name: 'Creative Studio & Agency',
    tagline: 'Brutalist typography, dynamic live availability, studio timezones & award ticker',
    columns: 3,
    theme: 'dark',
    accentColor: '#F97316',
    bgColor: '#121212',
    textColor: '#FFFFFF',
    mutedTextColor: '#A1A1AA',
    borderColor: '#27272A',
    borderRadius: 'none',
    density: 'spacious',
    fontFamily: 'sans',
    borderTop: 'gradient',
    blocks: [
      {
        id: 'block-status',
        type: 'status',
        title: 'Studio Availability & Clocks',
        enabled: true,
        columnSpan: 1,
        data: {
          statusHeading: 'Studio Status',
          statusState: 'available',
          statusText: 'Accepting select client collaborations for Q3/Q4 2026',
          uptime: 'Brooklyn 10:45 AM • Berlin 16:45 • Tokyo 23:45',
          changelogVersion: 'Independent Design Practice',
        },
      },
      {
        id: 'block-brand',
        type: 'brand',
        title: 'Big Typographic Call to Action',
        enabled: true,
        columnSpan: 2,
        data: {
          brandName: 'KINETIC APEX STUDIO',
          brandTagline: 'LET’S SHAPE SOMETHING UNFORGETTABLE.',
          brandDescription:
            'We craft high-fidelity digital brands, motion identity systems, and bespoke web platforms for ambitious cultural & tech pioneers.',
          officeLocations: ['Brooklyn, NY', 'Berlin, Germany', 'Tokyo, Japan'],
        },
      },
      {
        id: 'block-links-1',
        type: 'links',
        title: 'Featured Disciplines',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'cl1', label: 'Brand Architecture & Identity', href: '#brand' },
            { id: 'cl2', label: 'Webgl & Kinetic Interfaces', href: '#interfaces', badge: 'Awarded' },
            { id: 'cl3', label: 'Creative Direction & Films', href: '#film' },
            { id: 'cl4', label: 'Design Systems & Tokens', href: '#systems' },
            { id: 'cl5', label: 'Generative Soundscapes', href: '#sound' },
          ],
        },
      },
      {
        id: 'block-links-2',
        type: 'links',
        title: 'Network & Inquiries',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'cl6', label: 'New Business: hello@kinetic.studio', href: 'mailto:hello@kinetic.studio', badge: 'Direct' },
            { id: 'cl7', label: 'Instagram (@kinetic_apex)', href: '#ig' },
            { id: 'cl8', label: 'Read.cv Index', href: '#readcv' },
            { id: 'cl9', label: 'Behance Portfolio', href: '#behance' },
            { id: 'cl10', label: 'Open Studio Archive', href: '#archive' },
          ],
        },
      },
      {
        id: 'block-badges',
        type: 'badges',
        title: 'Honors & Recognitions',
        enabled: true,
        columnSpan: 1,
        data: {
          badgesHeading: 'Honors & Global Trophies',
          badges: [
            { id: 'cb1', label: 'Awwwards Site of the Year', sublabel: '2025 Nominee', icon: 'Award' },
            { id: 'cb2', label: 'FWA of the Day × 14', sublabel: 'Digital Innovation', icon: 'Sparkles' },
            { id: 'cb3', label: 'Cannes Lions Gold', sublabel: 'Interactive Design', icon: 'Star' },
          ],
        },
      },
      {
        id: 'block-bottom',
        type: 'bottom',
        title: 'Minimalist Signature',
        enabled: true,
        columnSpan: 3,
        data: {
          copyrightText: '© 2026 Kinetic Apex Studio LLC. Designed with deliberate intent and crafted in Brooklyn.',
          legalLinks: [
            { id: 'cll1', label: 'Colophon', href: '#colophon' },
            { id: 'cll2', label: 'Accessibility', href: '#accessibility' },
            { id: 'cll3', label: 'Terms & Licensing', href: '#terms' },
          ],
          backToTop: true,
        },
      },
    ],
  },

  'saas-developer': {
    id: 'saas-developer-preset',
    presetId: 'saas-developer',
    name: 'SaaS & Developer Platform',
    tagline: 'Terminal CLI snippets, 99.99% uptime status, docs navigation & GitHub community',
    columns: 4,
    theme: 'midnight',
    accentColor: '#6366F1',
    bgColor: '#090D16',
    textColor: '#F8FAFC',
    mutedTextColor: '#94A3B8',
    borderColor: '#1E293B',
    borderRadius: 'md',
    density: 'normal',
    fontFamily: 'mono',
    borderTop: 'subtle',
    blocks: [
      {
        id: 'block-brand',
        type: 'brand',
        title: 'Platform Overview',
        enabled: true,
        columnSpan: 1,
        data: {
          brandName: 'CloudScale Engine',
          brandTagline: 'Serverless Edge Compute & Real-time Vector Mesh',
          brandDescription:
            'Deploy zero-cold-start containers to 310+ edge PoPs with automated database sharding and sub-10ms global routing.',
          logoIcon: 'Terminal',
        },
      },
      {
        id: 'block-links-1',
        type: 'links',
        title: 'Developer Documentation',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'dl1', label: 'Quickstart Tutorial', href: '#quickstart' },
            { id: 'dl2', label: 'REST & GraphQL APIs', href: '#api' },
            { id: 'dl3', label: 'Node.js & Python SDKs', href: '#sdks', badge: 'v5.0' },
            { id: 'dl4', label: 'Next.js & Astro Adapters', href: '#frameworks' },
            { id: 'dl5', label: 'Architecture Blueprints', href: '#blueprints' },
          ],
        },
      },
      {
        id: 'block-links-2',
        type: 'links',
        title: 'Ecosystem & Community',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'dl6', label: 'GitHub Open Source (14.8k ★)', href: '#github' },
            { id: 'dl7', label: 'Developer Discord Community', href: '#discord', badge: 'Active' },
            { id: 'dl8', label: 'Changelog & RFCs', href: '#changelog' },
            { id: 'dl9', label: 'Community Showcase', href: '#showcase' },
            { id: 'dl10', label: 'Security & Bug Bounty', href: '#bounty' },
          ],
        },
      },
      {
        id: 'block-status',
        type: 'status',
        title: 'CLI Install & System Status',
        enabled: true,
        columnSpan: 1,
        data: {
          statusHeading: 'Infrastructure Status',
          statusState: 'operational',
          statusText: 'All Global Edge Systems Operational',
          uptime: '99.998% Uptime (Past 90 Days)',
          cliCommand: 'npm i -g @cloudscale/cli && cloudscale init',
          changelogVersion: 'Latest Engine: v4.18.2',
        },
      },
      {
        id: 'block-bottom',
        type: 'bottom',
        title: 'Developer Bottom Row',
        enabled: true,
        columnSpan: 4,
        data: {
          copyrightText: '© 2026 CloudScale Technologies Inc. Distributed under Apache 2.0 / MIT.',
          legalLinks: [
            { id: 'dll1', label: 'Service Level Agreement (SLA)', href: '#sla' },
            { id: 'dll2', label: 'Security & Vulnerability Policy', href: '#security' },
            { id: 'dll3', label: 'Privacy Center', href: '#privacy' },
            { id: 'dll4', label: 'Telemetry Settings', href: '#telemetry' },
          ],
          designerCredit: 'Press ⌘K for Command Bar',
        },
      },
    ],
  },

  ecommerce: {
    id: 'ecommerce-preset',
    presetId: 'ecommerce',
    name: 'Modern E-Commerce Flagship',
    tagline: 'VIP newsletter discount, value guarantees, payment method badges & order tracking',
    columns: 4,
    theme: 'slate',
    accentColor: '#D97706',
    bgColor: '#18181B',
    textColor: '#FAFAFA',
    mutedTextColor: '#A1A1AA',
    borderColor: '#27272A',
    borderRadius: 'lg',
    density: 'normal',
    fontFamily: 'sans',
    borderTop: 'subtle',
    blocks: [
      {
        id: 'block-newsletter',
        type: 'newsletter',
        title: 'VIP 15% Welcome Discount',
        enabled: true,
        columnSpan: 1,
        data: {
          newsletterHeading: 'Join the Collector Club',
          newsletterDescription:
            'Unlock 15% off your first curation, plus early private access to numbered drops and seasonal lookbooks.',
          newsletterPlaceholder: 'Enter your email address',
          newsletterButtonText: 'Claim 15% Off',
          newsletterDisclaimer: 'By signing up you agree to receive promotional updates. One-click unsubscribe.',
        },
      },
      {
        id: 'block-links-1',
        type: 'links',
        title: 'Customer Care & Orders',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'el1', label: 'Track Your Package Live', href: '#track', badge: 'Instant' },
            { id: 'el2', label: 'Returns & 30-Day Exchanges', href: '#returns' },
            { id: 'el3', label: 'Shipping Timelines & Rates', href: '#shipping' },
            { id: 'el4', label: 'Size, Fit & Material Guides', href: '#sizing' },
            { id: 'el5', label: 'Digital Gift Cards', href: '#giftcards' },
          ],
        },
      },
      {
        id: 'block-links-2',
        type: 'links',
        title: 'The Brand & Craft',
        enabled: true,
        columnSpan: 1,
        data: {
          links: [
            { id: 'el6', label: 'Ethical Sourcing & Mills', href: '#sourcing' },
            { id: 'el7', label: 'Flagship Store Locators', href: '#stores' },
            { id: 'el8', label: '1% For The Planet Mission', href: '#planet' },
            { id: 'el9', label: 'Recycling & Trade-In Program', href: '#tradein' },
            { id: 'el10', label: 'Journal & Behind The Scenes', href: '#journal' },
          ],
        },
      },
      {
        id: 'block-brand',
        type: 'brand',
        title: 'Store Philosophy',
        enabled: true,
        columnSpan: 1,
        data: {
          brandName: 'Nordic Living & Co.',
          brandTagline: 'Heirloom Craftsmanship for Intentional Living',
          brandDescription:
            'Handcrafted home textiles, organic ceramics, and architectural homeware made sustainably with master artisans.',
          logoIcon: 'ShoppingBag',
        },
      },
      {
        id: 'block-badges',
        type: 'badges',
        title: 'Customer Guarantees & Payments',
        enabled: true,
        columnSpan: 4,
        data: {
          badgesHeading: 'Shopping Guarantees & Encrypted Checkout',
          badges: [
            { id: 'eb1', label: 'Free Worldwide Shipping', sublabel: 'On all orders $75+', icon: 'Truck' },
            { id: 'eb2', label: '30-Day Happiness Guarantee', sublabel: 'Free return pickups', icon: 'RotateCcw' },
            { id: 'eb3', label: '256-bit Encrypted Checkout', sublabel: 'Apple Pay, Visa, MC, PayPal, Klarna', icon: 'ShieldCheck' },
            { id: 'eb4', label: '1% For The Planet', sublabel: 'Carbon neutral delivery', icon: 'Leaf' },
          ],
        },
      },
      {
        id: 'block-bottom',
        type: 'bottom',
        title: 'Store Footer Bar',
        enabled: true,
        columnSpan: 4,
        data: {
          copyrightText: '© 2026 Nordic Living Goods Inc. All rights reserved.',
          legalLinks: [
            { id: 'ell1', label: 'Privacy Policy', href: '#privacy' },
            { id: 'ell2', label: 'Terms of Sale', href: '#terms' },
            { id: 'ell3', label: 'Accessibility Statement', href: '#ada' },
            { id: 'ell4', label: 'Do Not Sell My Info (CA)', href: '#ccpa' },
          ],
          showCurrency: true,
          showLanguage: true,
        },
      },
    ],
  },
};

/**
 * Generates semantic HTML representation with standard semantic tags:
 * <footer>, <nav aria-label="...">, <section>, <form>, <address>, <small>, <ul>, <li>, <a>
 */
export function generateSemanticHtml(config: FooterConfig): string {
  const enabledBlocks = config.blocks.filter((b) => b.enabled);
  const mainBlocks = enabledBlocks.filter((b) => b.type !== 'badges' && b.type !== 'bottom');
  const badgeBlock = enabledBlocks.find((b) => b.type === 'badges');
  const bottomBlock = enabledBlocks.find((b) => b.type === 'bottom');

  let html = `<!-- ========================================== -->\n`;
  html += `<!-- Semantic Website Footer: ${config.name} -->\n`;
  html += `<!-- Generated by KitStack Footer Designer -->\n`;
  html += `<!-- ========================================== -->\n`;
  html += `<footer class="ks-footer" role="contentinfo" aria-label="${escapeHtml(config.name)}">\n`;
  html += `  <div class="ks-footer-container">\n`;

  // Main grid
  if (mainBlocks.length > 0) {
    html += `    <!-- Main Footer Multi-Column Grid (${config.columns} Columns) -->\n`;
    html += `    <div class="ks-footer-grid ks-cols-${config.columns}">\n`;

    for (const block of mainBlocks) {
      const spanClass = block.columnSpan && block.columnSpan > 1 ? ` ks-col-span-${block.columnSpan}` : '';
      switch (block.type) {
        case 'brand': {
          const { brandName, brandTagline, brandDescription, officeLocations } = block.data;
          html += `      <!-- Brand & Identity Block -->\n`;
          html += `      <section class="ks-footer-block ks-brand-block${spanClass}" aria-label="Brand Overview">\n`;
          if (brandName) {
            html += `        <div class="ks-brand-header">\n`;
            html += `          <h2 class="ks-brand-title">${escapeHtml(brandName)}</h2>\n`;
            if (brandTagline) {
              html += `          <p class="ks-brand-tagline">${escapeHtml(brandTagline)}</p>\n`;
            }
            html += `        </div>\n`;
          }
          if (brandDescription) {
            html += `        <p class="ks-brand-desc">${escapeHtml(brandDescription)}</p>\n`;
          }
          if (officeLocations && officeLocations.length > 0) {
            html += `        <address class="ks-brand-locations">\n`;
            html += `          <span class="ks-locations-label">Global Presence:</span>\n`;
            html += `          <span class="ks-locations-list">${escapeHtml(officeLocations.join(' • '))}</span>\n`;
            html += `        </address>\n`;
          }
          html += `      </section>\n\n`;
          break;
        }

        case 'links': {
          const { links } = block.data;
          html += `      <!-- Navigation Link Group: ${escapeHtml(block.title)} -->\n`;
          html += `      <nav class="ks-footer-block ks-nav-block${spanClass}" aria-label="${escapeHtml(block.title)}">\n`;
          html += `        <h3 class="ks-block-heading">${escapeHtml(block.title)}</h3>\n`;
          if (links && links.length > 0) {
            html += `        <ul class="ks-nav-list">\n`;
            for (const link of links) {
              html += `          <li class="ks-nav-item">\n`;
              html += `            <a href="${escapeHtml(link.href)}" class="ks-nav-link">\n`;
              html += `              <span>${escapeHtml(link.label)}</span>\n`;
              if (link.badge) {
                html += `              <span class="ks-badge">${escapeHtml(link.badge)}</span>\n`;
              }
              html += `            </a>\n`;
              html += `          </li>\n`;
            }
            html += `        </ul>\n`;
          }
          html += `      </nav>\n\n`;
          break;
        }

        case 'newsletter': {
          const {
            newsletterHeading,
            newsletterDescription,
            newsletterPlaceholder,
            newsletterButtonText,
            newsletterDisclaimer,
          } = block.data;
          html += `      <!-- Newsletter Subscription Block -->\n`;
          html += `      <section class="ks-footer-block ks-newsletter-block${spanClass}" aria-label="Newsletter Subscription">\n`;
          if (newsletterHeading) {
            html += `        <h3 class="ks-block-heading">${escapeHtml(newsletterHeading)}</h3>\n`;
          }
          if (newsletterDescription) {
            html += `        <p class="ks-newsletter-desc">${escapeHtml(newsletterDescription)}</p>\n`;
          }
          html += `        <form class="ks-newsletter-form" action="#" method="post" onsubmit="event.preventDefault();">\n`;
          html += `          <div class="ks-input-group">\n`;
          html += `            <input type="email" required placeholder="${escapeHtml(newsletterPlaceholder || 'Enter your email')}" aria-label="Email address" class="ks-input" />\n`;
          html += `            <button type="submit" class="ks-btn-submit">${escapeHtml(newsletterButtonText || 'Subscribe')}</button>\n`;
          html += `          </div>\n`;
          if (newsletterDisclaimer) {
            html += `          <small class="ks-newsletter-disclaimer">${escapeHtml(newsletterDisclaimer)}</small>\n`;
          }
          html += `        </form>\n`;
          html += `      </section>\n\n`;
          break;
        }

        case 'contact': {
          const {
            contactHeading,
            emergencyCallout,
            contactPhone,
            contactEmail,
            contactHours,
            clinicLocation,
          } = block.data;
          html += `      <!-- Contact & Emergency Info -->\n`;
          html += `      <section class="ks-footer-block ks-contact-block${spanClass}" aria-label="Contact Information">\n`;
          if (contactHeading) {
            html += `        <h3 class="ks-block-heading">${escapeHtml(contactHeading)}</h3>\n`;
          }
          if (emergencyCallout) {
            html += `        <div class="ks-emergency-alert" role="alert">\n`;
            html += `          <strong class="ks-emergency-text">${escapeHtml(emergencyCallout)}</strong>\n`;
            html += `        </div>\n`;
          }
          html += `        <address class="ks-contact-info">\n`;
          if (clinicLocation) {
            html += `          <p class="ks-contact-row"><span class="ks-icon-bullet">📍</span> ${escapeHtml(clinicLocation)}</p>\n`;
          }
          if (contactPhone) {
            html += `          <p class="ks-contact-row"><span class="ks-icon-bullet">📞</span> <a href="tel:${escapeHtml(contactPhone.replace(/[^0-9+]/g, ''))}" class="ks-link">${escapeHtml(contactPhone)}</a></p>\n`;
          }
          if (contactEmail) {
            html += `          <p class="ks-contact-row"><span class="ks-icon-bullet">✉️</span> <a href="mailto:${escapeHtml(contactEmail)}" class="ks-link">${escapeHtml(contactEmail)}</a></p>\n`;
          }
          if (contactHours) {
            html += `          <p class="ks-contact-hours"><span class="ks-icon-bullet">🕒</span> ${escapeHtml(contactHours).replace(/\n/g, '<br />')}</p>\n`;
          }
          html += `        </address>\n`;
          html += `      </section>\n\n`;
          break;
        }

        case 'status': {
          const {
            statusHeading,
            statusState,
            statusText,
            uptime,
            cliCommand,
            changelogVersion,
          } = block.data;
          html += `      <!-- Status & Developer Block -->\n`;
          html += `      <section class="ks-footer-block ks-status-block${spanClass}" aria-label="System Status">\n`;
          if (statusHeading) {
            html += `        <h3 class="ks-block-heading">${escapeHtml(statusHeading)}</h3>\n`;
          }
          html += `        <div class="ks-status-indicator ks-status-${statusState || 'operational'}">\n`;
          html += `          <span class="ks-status-dot" aria-hidden="true"></span>\n`;
          html += `          <span class="ks-status-label">${escapeHtml(statusText || 'All Systems Operational')}</span>\n`;
          html += `        </div>\n`;
          if (uptime) {
            html += `        <p class="ks-status-uptime">${escapeHtml(uptime)}</p>\n`;
          }
          if (cliCommand) {
            html += `        <div class="ks-cli-box">\n`;
            html += `          <code>${escapeHtml(cliCommand)}</code>\n`;
            html += `        </div>\n`;
          }
          if (changelogVersion) {
            html += `        <div class="ks-changelog-note"><small>${escapeHtml(changelogVersion)}</small></div>\n`;
          }
          html += `      </section>\n\n`;
          break;
        }

        default:
          break;
      }
    }

    html += `    </div>\n`;
  }

  // Badges section
  if (badgeBlock && badgeBlock.data.badges && badgeBlock.data.badges.length > 0) {
    html += `\n    <!-- Trust & Verification Badges Section -->\n`;
    html += `    <section class="ks-footer-badges-divider" aria-label="Trust Certifications">\n`;
    if (badgeBlock.data.badgesHeading) {
      html += `      <h4 class="ks-badges-title">${escapeHtml(badgeBlock.data.badgesHeading)}</h4>\n`;
    }
    html += `      <div class="ks-badges-grid">\n`;
    for (const b of badgeBlock.data.badges) {
      html += `        <div class="ks-badge-card">\n`;
      html += `          <div class="ks-badge-card-icon" aria-hidden="true">✓</div>\n`;
      html += `          <div class="ks-badge-card-content">\n`;
      html += `            <strong class="ks-badge-name">${escapeHtml(b.label)}</strong>\n`;
      if (b.sublabel) {
        html += `            <span class="ks-badge-sublabel">${escapeHtml(b.sublabel)}</span>\n`;
      }
      html += `          </div>\n`;
      html += `        </div>\n`;
    }
    html += `      </div>\n`;
    html += `    </section>\n`;
  }

  // Bottom row
  if (bottomBlock) {
    const { copyrightText, legalLinks, showCurrency, showLanguage, backToTop, designerCredit } =
      bottomBlock.data;
    html += `\n    <!-- Bottom Bar (Legal, Copyright & Locale) -->\n`;
    html += `    <div class="ks-footer-bottom">\n`;
    html += `      <div class="ks-bottom-left">\n`;
    if (copyrightText) {
      html += `        <small class="ks-copyright">${escapeHtml(copyrightText)}</small>\n`;
    }
    if (legalLinks && legalLinks.length > 0) {
      html += `        <nav class="ks-legal-nav" aria-label="Legal Disclosures">\n`;
      html += `          <ul class="ks-legal-list">\n`;
      for (const link of legalLinks) {
        html += `            <li><a href="${escapeHtml(link.href)}" class="ks-legal-link">${escapeHtml(link.label)}</a></li>\n`;
      }
      html += `          </ul>\n`;
      html += `        </nav>\n`;
    }
    html += `      </div>\n`;

    html += `      <div class="ks-bottom-right">\n`;
    if (showCurrency) {
      html += `        <div class="ks-locale-item">\n`;
      html += `          <span class="ks-locale-label">Currency:</span>\n`;
      html += `          <span class="ks-locale-val">USD ($)</span>\n`;
      html += `        </div>\n`;
    }
    if (showLanguage) {
      html += `        <div class="ks-locale-item">\n`;
      html += `          <span class="ks-locale-label">Region:</span>\n`;
      html += `          <span class="ks-locale-val">English (US)</span>\n`;
      html += `        </div>\n`;
    }
    if (designerCredit) {
      html += `        <small class="ks-designer-credit">${escapeHtml(designerCredit)}</small>\n`;
    }
    if (backToTop) {
      html += `        <a href="#top" class="ks-back-to-top" aria-label="Back to top of page">↑ Back to Top</a>\n`;
    }
    html += `      </div>\n`;
    html += `    </div>\n`;
  }

  html += `  </div>\n`;
  html += `</footer>\n`;

  return html;
}

/**
 * Generates scoped, modular Vanilla CSS using CSS custom properties
 */
export function generateModularCss(config: FooterConfig): string {
  const padMap = {
    compact: '2.5rem 1rem 1.5rem',
    normal: '4rem 1.5rem 2.5rem',
    spacious: '6rem 2rem 3.5rem',
  };

  const radiusMap = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px',
  };

  const fontMap = {
    sans: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
  };

  const borderTopStyles: Record<string, string> = {
    none: 'none',
    subtle: `1px solid ${config.borderColor}`,
    accent: `2px solid ${config.accentColor}`,
    gradient: `2px solid transparent; border-image: linear-gradient(90deg, transparent, ${config.accentColor}, transparent) 1`,
    dashed: `1px dashed ${config.borderColor}`,
  };

  return `/* ====================================================== */
/* KitStack Modular Footer Styles: ${config.name} */
/* Scoped BEM architecture with CSS Variables */
/* ====================================================== */

:root {
  --ks-footer-bg: ${config.bgColor};
  --ks-footer-text: ${config.textColor};
  --ks-footer-muted: ${config.mutedTextColor};
  --ks-footer-accent: ${config.accentColor};
  --ks-footer-border: ${config.borderColor};
  --ks-footer-radius: ${radiusMap[config.borderRadius]};
  --ks-footer-font: ${fontMap[config.fontFamily]};
  --ks-footer-padding: ${padMap[config.density]};
}

.ks-footer {
  box-sizing: border-box;
  width: 100%;
  background-color: var(--ks-footer-bg);
  color: var(--ks-footer-text);
  font-family: var(--ks-footer-font);
  border-top: ${borderTopStyles[config.borderTop]};
  padding: var(--ks-footer-padding);
  line-height: 1.5;
}

.ks-footer *,
.ks-footer *::before,
.ks-footer *::after {
  box-sizing: border-box;
}

.ks-footer-container {
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

/* Multi-Column Responsive Grid */
.ks-footer-grid {
  display: grid;
  gap: 2.5rem;
  grid-template-columns: 1fr;
}

@media (min-width: 640px) {
  .ks-footer-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .ks-cols-1 { grid-template-columns: 1fr; }
  .ks-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .ks-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .ks-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .ks-cols-5 { grid-template-columns: repeat(5, minmax(0, 1fr)); }
  .ks-cols-6 { grid-template-columns: repeat(6, minmax(0, 1fr)); }

  .ks-col-span-2 { grid-column: span 2 / span 2; }
  .ks-col-span-3 { grid-column: span 3 / span 3; }
  .ks-col-span-4 { grid-column: span 4 / span 4; }
}

/* Block Base & Headings */
.ks-footer-block {
  display: flex;
  flex-direction: column;
  gap: 0.875rem;
}

.ks-block-heading {
  font-size: 0.875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ks-footer-text);
  margin: 0 0 0.5rem 0;
}

/* Brand Section */
.ks-brand-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--ks-footer-text);
  margin: 0;
  letter-spacing: -0.02em;
}

.ks-brand-tagline {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ks-footer-accent);
  margin: 0.25rem 0 0 0;
}

.ks-brand-desc {
  font-size: 0.875rem;
  color: var(--ks-footer-muted);
  margin: 0;
  line-height: 1.6;
}

.ks-brand-locations {
  font-style: normal;
  font-size: 0.8125rem;
  color: var(--ks-footer-muted);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.ks-locations-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ks-footer-text);
}

/* Navigation Links */
.ks-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
}

.ks-nav-link {
  color: var(--ks-footer-muted);
  text-decoration: none;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  transition: color 0.15s ease, transform 0.15s ease;
}

.ks-nav-link:hover {
  color: var(--ks-footer-text);
  transform: translateX(2px);
}

.ks-badge {
  font-size: 0.6875rem;
  font-weight: 600;
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--ks-footer-accent) 20%, transparent);
  color: var(--ks-footer-accent);
  border: 1px solid color-mix(in srgb, var(--ks-footer-accent) 40%, transparent);
}

/* Newsletter Subscription */
.ks-newsletter-desc {
  font-size: 0.875rem;
  color: var(--ks-footer-muted);
  margin: 0;
}

.ks-newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ks-input-group {
  display: flex;
  gap: 0.5rem;
}

.ks-input {
  flex: 1;
  min-width: 0;
  padding: 0.625rem 0.875rem;
  background-color: color-mix(in srgb, var(--ks-footer-bg) 60%, white 10%);
  border: 1px solid var(--ks-footer-border);
  border-radius: var(--ks-footer-radius);
  color: var(--ks-footer-text);
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s ease;
}

.ks-input:focus {
  border-color: var(--ks-footer-accent);
}

.ks-btn-submit {
  padding: 0.625rem 1.125rem;
  background-color: var(--ks-footer-accent);
  color: #ffffff;
  border: none;
  border-radius: var(--ks-footer-radius);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
  white-space: nowrap;
}

.ks-btn-submit:hover {
  opacity: 0.9;
}

.ks-newsletter-disclaimer {
  font-size: 0.75rem;
  color: var(--ks-footer-muted);
}

/* Emergency Alert & Contact */
.ks-emergency-alert {
  padding: 0.75rem;
  border-radius: var(--ks-footer-radius);
  background-color: color-mix(in srgb, var(--ks-footer-accent) 15%, transparent);
  border: 1px solid var(--ks-footer-accent);
}

.ks-emergency-text {
  font-size: 0.875rem;
  color: var(--ks-footer-accent);
}

.ks-contact-info {
  font-style: normal;
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  color: var(--ks-footer-muted);
}

.ks-link {
  color: var(--ks-footer-text);
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Status & CLI Box */
.ks-status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  background-color: color-mix(in srgb, var(--ks-footer-border) 40%, transparent);
  border: 1px solid var(--ks-footer-border);
  font-size: 0.8125rem;
  width: fit-content;
}

.ks-status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 9999px;
  background-color: #10B981;
  box-shadow: 0 0 8px #10B981;
}

.ks-status-uptime {
  font-size: 0.8125rem;
  color: var(--ks-footer-muted);
  margin: 0;
}

.ks-cli-box {
  background-color: #030712;
  border: 1px solid var(--ks-footer-border);
  border-radius: var(--ks-footer-radius);
  padding: 0.625rem 0.875rem;
  overflow-x: auto;
  font-family: ui-monospace, SFMono-Regular, monospace;
  font-size: 0.8125rem;
  color: #38BDF8;
}

/* Badges Grid */
.ks-footer-badges-divider {
  margin-top: 3.5rem;
  padding-top: 2rem;
  border-top: 1px solid var(--ks-footer-border);
}

.ks-badges-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--ks-footer-muted);
  margin: 0 0 1rem 0;
}

.ks-badges-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.ks-badge-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: color-mix(in srgb, var(--ks-footer-border) 20%, transparent);
  border: 1px solid var(--ks-footer-border);
  border-radius: var(--ks-footer-radius);
}

.ks-badge-card-icon {
  width: 1.5rem;
  height: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--ks-footer-accent);
  color: #ffffff;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: bold;
}

.ks-badge-card-content {
  display: flex;
  flex-direction: column;
}

.ks-badge-name {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--ks-footer-text);
}

.ks-badge-sublabel {
  font-size: 0.6875rem;
  color: var(--ks-footer-muted);
}

/* Bottom Bar */
.ks-footer-bottom {
  margin-top: 3rem;
  padding-top: 1.75rem;
  border-top: 1px solid var(--ks-footer-border);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

@media (min-width: 768px) {
  .ks-footer-bottom {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
}

.ks-bottom-left {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

@media (min-width: 768px) {
  .ks-bottom-left {
    flex-direction: row;
    align-items: center;
    gap: 1.5rem;
  }
}

.ks-copyright {
  font-size: 0.8125rem;
  color: var(--ks-footer-muted);
}

.ks-legal-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.ks-legal-link {
  color: var(--ks-footer-muted);
  text-decoration: none;
  font-size: 0.75rem;
  transition: color 0.15s ease;
}

.ks-legal-link:hover {
  color: var(--ks-footer-text);
  text-decoration: underline;
}

.ks-bottom-right {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.ks-locale-item {
  font-size: 0.75rem;
  color: var(--ks-footer-muted);
}

.ks-locale-label {
  margin-right: 0.25rem;
}

.ks-locale-val {
  font-weight: 600;
  color: var(--ks-footer-text);
}

.ks-back-to-top {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ks-footer-accent);
  text-decoration: none;
}
`;
}

/**
 * Generates Tailwind CSS markup for modern utility projects
 */
export function generateTailwindHtml(config: FooterConfig): string {
  const enabledBlocks = config.blocks.filter((b) => b.enabled);
  const mainBlocks = enabledBlocks.filter((b) => b.type !== 'badges' && b.type !== 'bottom');
  const badgeBlock = enabledBlocks.find((b) => b.type === 'badges');
  const bottomBlock = enabledBlocks.find((b) => b.type === 'bottom');

  const colClassMap: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6',
  };

  const colClass = colClassMap[config.columns] || 'grid-cols-1 md:grid-cols-4';

  let html = `<!-- ========================================== -->\n`;
  html += `<!-- Tailwind CSS Footer: ${config.name} -->\n`;
  html += `<!-- ========================================== -->\n`;
  html += `<footer class="w-full bg-[${config.bgColor}] text-[${config.textColor}] border-t border-[${config.borderColor}] py-12 px-4 sm:px-6 lg:px-8 font-sans" role="contentinfo">\n`;
  html += `  <div class="max-w-7xl mx-auto">\n`;

  if (mainBlocks.length > 0) {
    html += `    <!-- Main Columns Grid -->\n`;
    html += `    <div class="grid gap-10 ${colClass}">\n`;

    for (const block of mainBlocks) {
      const spanClass = block.columnSpan && block.columnSpan > 1 ? ` lg:col-span-${block.columnSpan}` : '';
      switch (block.type) {
        case 'brand': {
          const { brandName, brandTagline, brandDescription, officeLocations } = block.data;
          html += `      <!-- Brand Column -->\n`;
          html += `      <section class="space-y-3${spanClass}">\n`;
          if (brandName) {
            html += `        <h2 class="text-xl font-bold tracking-tight text-[${config.textColor}]">${escapeHtml(brandName)}</h2>\n`;
          }
          if (brandTagline) {
            html += `        <p class="text-xs font-semibold uppercase tracking-wider text-[${config.accentColor}]">${escapeHtml(brandTagline)}</p>\n`;
          }
          if (brandDescription) {
            html += `        <p class="text-sm text-[${config.mutedTextColor}] leading-relaxed">${escapeHtml(brandDescription)}</p>\n`;
          }
          if (officeLocations && officeLocations.length > 0) {
            html += `        <div class="pt-2 text-xs text-[${config.mutedTextColor}]">\n`;
            html += `          <span class="font-semibold block text-[${config.textColor}] mb-1">Global Presence:</span>\n`;
            html += `          <span>${escapeHtml(officeLocations.join(' • '))}</span>\n`;
            html += `        </div>\n`;
          }
          html += `      </section>\n\n`;
          break;
        }

        case 'links': {
          const { links } = block.data;
          html += `      <!-- Links: ${escapeHtml(block.title)} -->\n`;
          html += `      <nav class="space-y-3${spanClass}" aria-label="${escapeHtml(block.title)}">\n`;
          html += `        <h3 class="text-xs font-bold uppercase tracking-wider text-[${config.textColor}]">${escapeHtml(block.title)}</h3>\n`;
          if (links && links.length > 0) {
            html += `        <ul class="space-y-2.5 text-sm text-[${config.mutedTextColor}]">\n`;
            for (const link of links) {
              html += `          <li>\n`;
              html += `            <a href="${escapeHtml(link.href)}" class="hover:text-[${config.textColor}] transition-colors inline-flex items-center gap-2">\n`;
              html += `              <span>${escapeHtml(link.label)}</span>\n`;
              if (link.badge) {
                html += `              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[${config.accentColor}]/15 text-[${config.accentColor}] border border-[${config.accentColor}]/30">${escapeHtml(link.badge)}</span>\n`;
              }
              html += `            </a>\n`;
              html += `          </li>\n`;
            }
            html += `        </ul>\n`;
          }
          html += `      </nav>\n\n`;
          break;
        }

        case 'newsletter': {
          const {
            newsletterHeading,
            newsletterDescription,
            newsletterPlaceholder,
            newsletterButtonText,
            newsletterDisclaimer,
          } = block.data;
          html += `      <!-- Newsletter Column -->\n`;
          html += `      <section class="space-y-3${spanClass}">\n`;
          if (newsletterHeading) {
            html += `        <h3 class="text-xs font-bold uppercase tracking-wider text-[${config.textColor}]">${escapeHtml(newsletterHeading)}</h3>\n`;
          }
          if (newsletterDescription) {
            html += `        <p class="text-sm text-[${config.mutedTextColor}]">${escapeHtml(newsletterDescription)}</p>\n`;
          }
          html += `        <form class="space-y-2" onsubmit="event.preventDefault();">\n`;
          html += `          <div class="flex gap-2">\n`;
          html += `            <input type="email" placeholder="${escapeHtml(newsletterPlaceholder || 'Email address')}" required class="w-full px-3 py-2 text-sm rounded-lg bg-neutral-900 border border-[${config.borderColor}] text-[${config.textColor}] placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[${config.accentColor}]" />\n`;
          html += `            <button type="submit" class="px-4 py-2 text-sm font-semibold rounded-lg bg-[${config.accentColor}] text-white hover:opacity-90 transition-opacity whitespace-nowrap">${escapeHtml(newsletterButtonText || 'Join')}</button>\n`;
          html += `          </div>\n`;
          if (newsletterDisclaimer) {
            html += `          <p class="text-xs text-[${config.mutedTextColor}]">${escapeHtml(newsletterDisclaimer)}</p>\n`;
          }
          html += `        </form>\n`;
          html += `      </section>\n\n`;
          break;
        }

        case 'contact': {
          const {
            contactHeading,
            emergencyCallout,
            contactPhone,
            contactEmail,
            contactHours,
            clinicLocation,
          } = block.data;
          html += `      <!-- Contact Column -->\n`;
          html += `      <section class="space-y-3${spanClass}">\n`;
          if (contactHeading) {
            html += `        <h3 class="text-xs font-bold uppercase tracking-wider text-[${config.textColor}]">${escapeHtml(contactHeading)}</h3>\n`;
          }
          if (emergencyCallout) {
            html += `        <div class="p-3 rounded-lg border border-[${config.accentColor}]/40 bg-[${config.accentColor}]/10 text-xs font-bold text-[${config.accentColor}]">\n`;
            html += `          ${escapeHtml(emergencyCallout)}\n`;
            html += `        </div>\n`;
          }
          html += `        <div class="text-sm space-y-1.5 text-[${config.mutedTextColor}]">\n`;
          if (clinicLocation) {
            html += `          <p>📍 ${escapeHtml(clinicLocation)}</p>\n`;
          }
          if (contactPhone) {
            html += `          <p>📞 <a href="tel:${escapeHtml(contactPhone.replace(/[^0-9+]/g, ''))}" class="hover:underline">${escapeHtml(contactPhone)}</a></p>\n`;
          }
          if (contactEmail) {
            html += `          <p>✉️ <a href="mailto:${escapeHtml(contactEmail)}" class="hover:underline">${escapeHtml(contactEmail)}</a></p>\n`;
          }
          if (contactHours) {
            html += `          <p class="text-xs pt-1">${escapeHtml(contactHours).replace(/\n/g, '<br />')}</p>\n`;
          }
          html += `        </div>\n`;
          html += `      </section>\n\n`;
          break;
        }

        case 'status': {
          const {
            statusHeading,
            statusText,
            uptime,
            cliCommand,
            changelogVersion,
          } = block.data;
          html += `      <!-- Status / Dev Column -->\n`;
          html += `      <section class="space-y-3${spanClass}">\n`;
          if (statusHeading) {
            html += `        <h3 class="text-xs font-bold uppercase tracking-wider text-[${config.textColor}]">${escapeHtml(statusHeading)}</h3>\n`;
          }
          html += `        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[${config.borderColor}] bg-neutral-900/60 text-xs text-[${config.textColor}]">\n`;
          html += `          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>\n`;
          html += `          <span>${escapeHtml(statusText || 'Operational')}</span>\n`;
          html += `        </div>\n`;
          if (uptime) {
            html += `        <p class="text-xs text-[${config.mutedTextColor}]">${escapeHtml(uptime)}</p>\n`;
          }
          if (cliCommand) {
            html += `        <div class="p-2.5 rounded-lg bg-neutral-950 border border-[${config.borderColor}] font-mono text-xs text-sky-400 overflow-x-auto">\n`;
            html += `          <code>${escapeHtml(cliCommand)}</code>\n`;
            html += `        </div>\n`;
          }
          if (changelogVersion) {
            html += `        <p class="text-[11px] text-[${config.mutedTextColor}]">${escapeHtml(changelogVersion)}</p>\n`;
          }
          html += `      </section>\n\n`;
          break;
        }

        default:
          break;
      }
    }

    html += `    </div>\n`;
  }

  // Badges
  if (badgeBlock && badgeBlock.data.badges && badgeBlock.data.badges.length > 0) {
    html += `\n    <!-- Certifications & Trust Badges -->\n`;
    html += `    <div class="mt-12 pt-8 border-t border-[${config.borderColor}]">\n`;
    if (badgeBlock.data.badgesHeading) {
      html += `      <h4 class="text-xs font-bold uppercase tracking-wider text-[${config.mutedTextColor}] mb-4">${escapeHtml(badgeBlock.data.badgesHeading)}</h4>\n`;
    }
    html += `      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\n`;
    for (const b of badgeBlock.data.badges) {
      html += `        <div class="flex items-center gap-3 p-3 rounded-lg border border-[${config.borderColor}] bg-neutral-900/40">\n`;
      html += `          <div class="w-6 h-6 rounded-full bg-[${config.accentColor}] text-white flex items-center justify-center text-xs font-bold">✓</div>\n`;
      html += `          <div>\n`;
      html += `            <p class="text-xs font-bold text-[${config.textColor}]">${escapeHtml(b.label)}</p>\n`;
      if (b.sublabel) {
        html += `            <p class="text-[10px] text-[${config.mutedTextColor}]">${escapeHtml(b.sublabel)}</p>\n`;
      }
      html += `          </div>\n`;
      html += `        </div>\n`;
    }
    html += `      </div>\n`;
    html += `    </div>\n`;
  }

  // Bottom Row
  if (bottomBlock) {
    const { copyrightText, legalLinks, showCurrency, showLanguage, backToTop } = bottomBlock.data;
    html += `\n    <!-- Bottom Row -->\n`;
    html += `    <div class="mt-10 pt-6 border-t border-[${config.borderColor}] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[${config.mutedTextColor}]">\n`;
    html += `      <div class="flex flex-col sm:flex-row items-center gap-3">\n`;
    if (copyrightText) {
      html += `        <span>${escapeHtml(copyrightText)}</span>\n`;
    }
    if (legalLinks && legalLinks.length > 0) {
      html += `        <ul class="flex flex-wrap gap-3">\n`;
      for (const link of legalLinks) {
        html += `          <li><a href="${escapeHtml(link.href)}" class="hover:text-[${config.textColor}] hover:underline">${escapeHtml(link.label)}</a></li>\n`;
      }
      html += `        </ul>\n`;
    }
    html += `      </div>\n`;
    html += `      <div class="flex items-center gap-4">\n`;
    if (showCurrency) {
      html += `        <span>Currency: <strong class="text-[${config.textColor}]">USD ($)</strong></span>\n`;
    }
    if (showLanguage) {
      html += `        <span>Region: <strong class="text-[${config.textColor}]">English (US)</strong></span>\n`;
    }
    if (backToTop) {
      html += `        <a href="#top" class="text-[${config.accentColor}] hover:underline font-semibold">↑ Back to Top</a>\n`;
    }
    html += `      </div>\n`;
    html += `    </div>\n`;
  }

  html += `  </div>\n`;
  html += `</footer>\n`;

  return html;
}

/**
 * Generates ready-to-use TypeScript React component
 */
export function generateReactComponent(config: FooterConfig): string {
  const semantic = generateSemanticHtml(config);
  // Transform standard HTML into JSX safe attributes (class -> className, onsubmit -> onSubmit, etc.)
  let jsx = semantic
    .replace(/class="/g, 'className="')
    .replace(/for="/g, 'htmlFor="')
    .replace(/onsubmit="event\.preventDefault\(\);"/g, 'onSubmit={(e) => e.preventDefault()}')
    .replace(/role="contentinfo"/g, 'role="contentinfo"')
    .replace(/aria-label=/g, 'aria-label=')
    .replace(/tabindex=/g, 'tabIndex=');

  return `import React from 'react';

/**
 * ${config.name} - Semantic Website Footer Component
 * Archetype: ${config.presetId}
 * Columns: ${config.columns}
 */
export const WebsiteFooter: React.FC = () => {
  return (
${jsx
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
  );
};

export default WebsiteFooter;
`;
}

/**
 * Generates a full standalone HTML document with embedded CSS and Google Fonts
 */
export function generateCompleteHtmlDoc(config: FooterConfig): string {
  const semantic = generateSemanticHtml(config);
  const css = generateModularCss(config);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(config.name)} - Semantic Footer</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
  <style>
    /* Reset & Demo Container Styles */
    *, *::before, *::after { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      background-color: #030712;
      color: #f3f4f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .demo-page-placeholder {
      padding: 4rem 1.5rem;
      text-align: center;
      max-width: 800px;
      margin: auto;
    }
    .demo-page-placeholder h1 {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
    }
    .demo-page-placeholder p {
      color: #9ca3af;
      font-size: 1.125rem;
    }

${css}
  </style>
</head>
<body>
  <div class="demo-page-placeholder">
    <h1>Page Content Area</h1>
    <p>Scroll down to inspect the custom styled ${escapeHtml(config.name)}.</p>
  </div>

${semantic}
</body>
</html>`;
}

/**
 * Generates an in-depth, structured prompt for any LLM (Claude, ChatGPT, Gemini, Cursor)
 * to recreate, extend, or port this footer to another framework.
 */
export function generateLlmPrompt(config: FooterConfig): string {
  const enabledBlocks = config.blocks.filter((b) => b.enabled);
  const blockSummary = enabledBlocks
    .map((b, i) => `${i + 1}. [${b.type.toUpperCase()}] "${b.title}" (Span: ${b.columnSpan || 1} cols)`)
    .join('\n');

  return `# AI Coding Agent Prompt: Build a Production-Grade "${config.name}" Website Footer

You are an expert Frontend Architect and UI Designer. Your task is to build a high-performance, fully accessible, and modular website footer inspired by the **"${config.name}"** archetype.

---

### 1. Architectural & Design System Specifications
- **Archetype / Personality**: ${config.presetId} ("${config.name}")
- **Tagline**: ${config.tagline}
- **Grid Layout**: ${config.columns} Desktop Columns (collapsing to 2 columns on tablet 768px, and 1 column on mobile 375px)
- **Visual Theme**: ${config.theme}
- **Color Tokens**:
  - Background: \`${config.bgColor}\`
  - Text Primary: \`${config.textColor}\`
  - Muted / Secondary: \`${config.mutedTextColor}\`
  - Accent / Focus: \`${config.accentColor}\`
  - Border: \`${config.borderColor}\`
- **Border Radius**: \`${config.borderRadius}\`
- **Padding Density**: \`${config.density}\`
- **Typography Scale**: \`${config.fontFamily}\` font family with high contrast headings and legible body sizes.

---

### 2. Functional Blocks to Include
${blockSummary}

---

### 3. Detailed Technical & Semantic Standards
1. **Semantic HTML5**:
   - Root container must be \`<footer role="contentinfo" aria-label="${config.name}">\`.
   - Use \`<nav aria-label="...">\` with unordered lists \`<ul>\` and \`<li>\` for navigation link groups.
   - Use \`<form action="#" method="post">\` with descriptive \`aria-label\` or \`<label>\` elements and proper input attributes (\`type="email"\`, \`required\`).
   - Use \`<address>\` for contact details and office locations.
   - Use \`<small>\` for copyright and legal disclosures.

2. **Accessibility (WCAG 2.1 AA Compliance)**:
   - All text colors must maintain at least 4.5:1 contrast against the background color (\`${config.bgColor}\`).
   - Interactive elements (\`<a>\`, \`<button>\`, \`<input>\`) must have distinct visible \`:focus-visible\` outline rings matching the accent color \`${config.accentColor}\`.
   - Status indicators must include semantic labels or \`role="alert"\` rather than relying solely on color.

3. **Responsive Collapse Rules**:
   - **Desktop (>= 1024px)**: Display as a clean ${config.columns}-column grid.
   - **Tablet (640px - 1023px)**: Automatically re-wrap to 2 columns.
   - **Mobile (< 640px)**: Collapse smoothly into a single column with accessible touch target heights (>= 44px).

---

### 4. Implementation Deliverables
Provide the solution in:
1. Clean, modular Semantic HTML.
2. Scoped, self-contained CSS using CSS Variables (\`--ks-footer-bg\`, \`--ks-footer-accent\`, etc.) or Tailwind CSS utility classes.
3. Interactive state handling (newsletter submit feedback, hover micro-transitions, keyboard navigation).
`;
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
