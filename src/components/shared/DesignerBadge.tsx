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
      className="fixed z-40 inline-flex items-center gap-2.5 rounded-full px-3 py-2 transition-all duration-200 group"
      style={{
        right: 16,
        bottom: 16,
        backgroundColor: 'rgba(11, 15, 25, 0.84)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(168, 85, 247, 0.4)',
        boxShadow:
          '0 0 20px rgba(168, 85, 247, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35)',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(192, 132, 252, 0.7)';
        el.style.boxShadow =
          '0 0 28px rgba(168, 85, 247, 0.45), 0 4px 20px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.borderColor = 'rgba(168, 85, 247, 0.4)';
        el.style.boxShadow =
          '0 0 20px rgba(168, 85, 247, 0.25), 0 4px 16px rgba(0, 0, 0, 0.35)';
      }}
    >
      <img
        src="https://unavatar.io/x/TwilightSurfers"
        alt="@TwilightSurfers"
        width={34}
        height={34}
        className="rounded-full flex-shrink-0 object-cover"
        style={{
          width: 34,
          height: 34,
          border: '2px solid #c084fc',
        }}
      />
      <span className="flex flex-col leading-tight min-w-0">
        <span
          className="text-[9px] font-semibold tracking-wider uppercase"
          style={{ color: 'rgba(196, 181, 253, 0.75)' }}
        >
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
