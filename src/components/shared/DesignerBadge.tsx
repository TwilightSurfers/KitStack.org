/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';

const HINT = 'Designed & vibe-coded by @TwilightSurfers on X';

/**
 * Fixed bottom-right designer credit badge (almost1st.lol style).
 * Dark glass pill — stays dark in both light and dark app themes.
 * Lifted above SiteFooter (`bottom-24`) so links stay clickable.
 */
export const DesignerBadge: React.FC = () => {
  return (
    <a
      href="https://x.com/TwilightSurfers"
      target="_blank"
      rel="noopener noreferrer"
      data-hint={HINT}
      title={HINT}
      aria-label={HINT}
      className="fixed right-4 bottom-24 z-40 inline-flex items-center gap-2.5 rounded-full px-3 py-2 transition-all duration-200 group bg-[rgba(11,15,25,0.84)] backdrop-blur-[12px] border border-[rgba(168,85,247,0.4)] shadow-[0_0_20px_rgba(168,85,247,0.25),0_4px_16px_rgba(0,0,0,0.35)] hover:border-[rgba(192,132,252,0.7)] hover:shadow-[0_0_28px_rgba(168,85,247,0.45),0_4px_20px_rgba(0,0,0,0.4)]"
    >
      <img
        src="https://unavatar.io/x/TwilightSurfers"
        alt="@TwilightSurfers"
        width={34}
        height={34}
        className="rounded-full flex-shrink-0 object-cover w-[34px] h-[34px] border-2 border-[#c084fc]"
      />
      <span className="flex flex-col leading-tight min-w-0">
        <span className="text-[9px] font-semibold tracking-wider uppercase text-[rgba(196,181,253,0.75)]">
          Designed by
        </span>
        <span className="text-xs font-semibold text-white inline-flex items-center gap-1">
          @TwilightSurfers
          <ExternalLink
            className="w-3 h-3 opacity-60 group-hover:opacity-90 transition-opacity"
            aria-hidden
          />
        </span>
      </span>
    </a>
  );
};