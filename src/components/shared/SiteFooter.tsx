/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type LegalView = 'privacy' | 'terms' | 'contact';

interface SiteFooterProps {
  onOpenLegal: (view: LegalView) => void;
}

/**
 * Site-wide footer — Tailwind only, matches KitStack shell neutrals.
 */
export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLegal }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4 space-y-1.5 text-xs text-neutral-500 dark:text-neutral-400">
        {/* Brand / SEO line */}
        <p className="font-semibold text-neutral-700 dark:text-neutral-200 tracking-tight">
          Free Build Tools @ KitStack
          <span className="font-normal text-neutral-400 dark:text-neutral-500">
            {' '}
            · twilight-grade utilities, zero fluff — surf the stack &amp; ship
          </span>
        </p>

        {/* Copyright line */}
        <p className="leading-relaxed">
          <a
            href="https://kitstack.org/"
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            © Copyright 2006–{year}
          </a>
          <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
          <a
            href="https://x.com/TwilightSurfers"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-violet-600 dark:text-violet-400 hover:text-violet-500 dark:hover:text-violet-300 transition-colors"
          >
            Twilight Surfers Development
          </a>
          <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
          <span>All Rights Reserved.</span>
        </p>

        {/* Legal nav — in-app page switch */}
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5" aria-label="Legal">
          <button
            type="button"
            onClick={() => onOpenLegal('privacy')}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors underline-offset-2 hover:underline"
          >
            Privacy
          </button>
          <span className="text-neutral-300 dark:text-neutral-600" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => onOpenLegal('terms')}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors underline-offset-2 hover:underline"
          >
            Terms
          </button>
          <span className="text-neutral-300 dark:text-neutral-600" aria-hidden>
            ·
          </span>
          <button
            type="button"
            onClick={() => onOpenLegal('contact')}
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors underline-offset-2 hover:underline"
          >
            Contact
          </button>
        </nav>
      </div>
    </footer>
  );
};