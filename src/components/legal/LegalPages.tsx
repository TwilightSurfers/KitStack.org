/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowLeft, ExternalLink, Shield, ScrollText, Mail } from 'lucide-react';
import type { LegalView } from '../shared/SiteFooter';

interface LegalPagesProps {
  view: LegalView;
  onBack: () => void;
  accentColor: string;
}

const TITLES: Record<LegalView, string> = {
  privacy: 'Privacy',
  terms: 'Terms of Use',
  contact: 'Contact',
};

const ICONS: Record<LegalView, React.ReactNode> = {
  privacy: <Shield className="w-4 h-4" />,
  terms: <ScrollText className="w-4 h-4" />,
  contact: <Mail className="w-4 h-4" />,
};

export const LegalPages: React.FC<LegalPagesProps> = ({ view, onBack, accentColor }) => {
  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-xs font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to tools</span>
        </button>
      </div>

      <article className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs overflow-hidden">
        <header className="px-5 py-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0"
            style={{ backgroundColor: accentColor }}
          >
            {ICONS[view]}
          </div>
          <div>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 tracking-tight">
              {TITLES[view]}
            </h1>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
              KitStack.org · Twilight Surfers
            </p>
          </div>
        </header>

        <div className="px-5 py-5 space-y-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          {view === 'privacy' && <PrivacyBody />}
          {view === 'terms' && <TermsBody />}
          {view === 'contact' && <ContactBody />}
        </div>
      </article>
    </div>
  );
};

const PrivacyBody: React.FC = () => (
  <>
    <p>
      KitStack&apos;s free tools still don&apos;t require accounts or login. What you type into the
      tools stays in your browser — we&apos;re not building personal profiles off your work.
    </p>
    <p>
      We use privacy-friendly traffic analytics (MavenMVP analytics / Umami-style at{' '}
      <strong className="text-neutral-800 dark:text-neutral-100">analytics.mavenmvp.com</strong>) to
      understand who visits: broad aggregates like pages, referrers, countries, and devices — not
      sold-off personal dossiers.
    </p>
    <p>
      Preferences such as theme, open tabs, accent color, and related UI settings still use{' '}
      <strong className="text-neutral-800 dark:text-neutral-100">
        local browser storage
      </strong>{' '}
      on your device so your workspace persists between visits. That stays with you.
    </p>
    <p>We do not sell your data.</p>
    <p className="text-neutral-400 dark:text-neutral-500 text-[11px]">
      Third-party CDNs (for example avatar or font hosts) have their own policies for those requests.
    </p>
  </>
);

const TermsBody: React.FC = () => (
  <>
    <p>
      KitStack free tools are provided <strong className="text-neutral-800 dark:text-neutral-100">AS IS</strong>, with{' '}
      <strong className="text-neutral-800 dark:text-neutral-100">NO WARRANTIES</strong> and{' '}
      <strong className="text-neutral-800 dark:text-neutral-100">NO GUARANTEES</strong> of any kind —
      express or implied — including fitness for a particular purpose or uninterrupted availability.
    </p>
    <p>
      Use at your own risk. Do not rely on KitStack for critical production guarantees, compliance
      mandates, or life-safety systems. Double-check outputs before shipping them anywhere important.
    </p>
    <p>
      Twilight Surfers / KitStack are not liable for any damages arising from use of these tools,
      including lost data, downtime, or consequential loss — to the fullest extent permitted by law.
    </p>
    <p>By using this site you agree to these terms. If you do not agree, please stop using the tools.</p>
  </>
);

const ContactBody: React.FC = () => (
  <>
    <p>
      The best — and currently only practical — way to reach Twilight Surfers about KitStack is on X.
      No contact form and no support mailbox are required for these free tools.
    </p>
    <a
      href="https://x.com/TwilightSurfers"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-opacity hover:opacity-90 bg-violet-600 hover:bg-violet-500"
    >
      <span>@TwilightSurfers on X</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-80" aria-hidden />
    </a>
    <p className="text-neutral-400 dark:text-neutral-500 text-[11px]">
      Opens in a new window · https://x.com/TwilightSurfers
    </p>
  </>
);