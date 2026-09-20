/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';

export type LegalView = 'privacy' | 'terms' | 'contact';

interface SiteFooterProps {
  onOpenLegal: (view: LegalView) => void;
  accentColor: string;
}

/**
 * Site-wide footer with multi-column layout, vertical site links,
 * Site Friends section, and a dedicated bottom copyright bar.
 */
export const SiteFooter: React.FC<SiteFooterProps> = ({ onOpenLegal, accentColor }) => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto bg-neutral-100 dark:bg-neutral-950 border-t border-neutral-200/60 dark:border-neutral-800/60">
      <div
        className="h-4 bg-gradient-to-b from-transparent to-white/60 dark:to-neutral-900/60"
        aria-hidden
      />
      <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xs">
        {/* Main Footer Contents Grid */}
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-xs">
          {/* 1) Brand & Mission */}
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black bg-accent text-white shadow-xs">
                KS
              </div>
              <span className="font-bold text-sm text-neutral-900 dark:text-neutral-100 tracking-tight">
                KitStack.org
              </span>
            </div>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              Twilight-grade utilities, precision calculators, and web tools. Zero fluff — built with deliberate systems.
            </p>
          </div>

          {/* 2) Site Links (Vertical) */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Site Links
            </h4>
            <nav className="flex flex-col space-y-2" aria-label="Legal & Site Links">
              <button
                type="button"
                onClick={() => onOpenLegal('privacy')}
                className="text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Privacy Policy
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal('terms')}
                className="text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Terms of Service
              </button>
              <button
                type="button"
                onClick={() => onOpenLegal('contact')}
                className="text-left text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                Contact
              </button>
            </nav>
          </div>

          {/* 3) Site Friends */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Site Friends
            </h4>
            <div className="flex flex-col space-y-1.5">
              <a
                href="https://hassleas.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 hover:text-accent font-medium transition-colors"
              >
                <span>Hassle as a Service</span>
                <ExternalLink className="w-3 h-3 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
              </a>
              <span className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
                hassleas.com
              </span>
            </div>
          </div>

          {/* 4) Design & Development */}
          <div className="space-y-2.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
              Crafted With Purpose
            </h4>
            <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed font-normal">
              Design and Development by{' '}
              <a
                href="https://x.com/TwilightSurfers"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-accent hover:opacity-80 transition-opacity inline-flex items-center gap-1"
              >
                <span>Twilight Surfers</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </p>
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
              Deliberate systems &amp; clean execution.
            </p>
          </div>
        </div>

        {/* Dedicated Bottom Copyright Bar — Completely separated from footer contents */}
        <div className="border-t border-neutral-200/80 dark:border-neutral-800/80 py-4 px-4 sm:px-6">
          <div className="mx-auto w-full max-w-7xl flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-neutral-500 dark:text-neutral-400 text-center">
            <a
              href="https://kitstack.org/"
              className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
            >
              © Copyright 2006–{year}
            </a>
            <span className="text-neutral-300 dark:text-neutral-600">·</span>
            <a
              href="https://x.com/TwilightSurfers"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium transition-opacity hover:opacity-80 text-accent"
            >
              Twilight Surfers Development
            </a>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <span>All Rights Reserved.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
