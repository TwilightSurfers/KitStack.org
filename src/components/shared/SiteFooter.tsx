/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export type LegalView = 'privacy' | 'terms' | 'contact';

interface SiteFooterProps {
  onOpenLegal: (view: LegalView) => void;
  accentColor: string;
}

/**
 * Site-wide footer — three-column layout, top fade blend, theme accent.
 * Tailwind only (accent color uses the same style={{ color }} pattern as Header).
 */
export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLegal, accentColor }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto bg-neutral-100 dark:bg-neutral-950">
      <div
        className="h-8 bg-gradient-to-b from-transparent to-white/80 dark:to-neutral-900/80"
        aria-hidden
      />
      <div className="bg-white/80 dark:bg-neutral-900/80">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-5 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6 md:items-start text-xs text-neutral-500 dark:text-neutral-400">
          {/* 1) Brand / SEO */}
          <div className="md:text-left">
            <p className="font-semibold text-neutral-700 dark:text-neutral-200 tracking-tight">
              Free Build Tools @ KitStack
            </p>
            <p className="mt-1 font-normal text-neutral-400 dark:text-neutral-500">
              Twilight-grade utilities, zero fluff — surf the stack &amp; ship.
            </p>
          </div>

          {/* 2) Copyright */}
          <div className="md:text-center leading-relaxed">
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
              className="font-medium transition-opacity hover:opacity-80"
              style={{ color: accentColor }}
            >
              Twilight Surfers Development
            </a>
            <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">|</span>
            <span>All Rights Reserved.</span>
          </div>

          {/* 3) Legal nav */}
          <nav
            className="flex flex-wrap items-center gap-x-3 gap-y-1 md:justify-end"
            aria-label="Legal"
          >
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
      </div>
    </footer>
  );
};
