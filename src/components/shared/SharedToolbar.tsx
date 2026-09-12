import React from 'react';
import { Copy, Check, RotateCcw, Download, Sparkles, Share2 } from 'lucide-react';
import { BubbleHint } from './BubbleHint';

export interface SharedToolbarProps {
  title: string;
  badge?: string;
  onCopy?: () => void;
  copied?: boolean;
  onReset?: () => void;
  onExport?: () => void;
  exportLabel?: string;
  customActions?: React.ReactNode;
  accentColor?: string;
}

export const SharedToolbar: React.FC<SharedToolbarProps> = ({
  title,
  badge,
  onCopy,
  copied = false,
  onReset,
  onExport,
  exportLabel = 'Export',
  customActions,
  accentColor,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/80 dark:border-neutral-700/80">
            {badge}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {customActions}

        {onCopy && (
          <BubbleHint content="Copy output to clipboard" placement="bottom">
            <button
              type="button"
              onClick={onCopy}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </BubbleHint>
        )}

        {onExport && (
          <BubbleHint content={`Export / ${exportLabel}`} placement="bottom">
            <button
              type="button"
              onClick={onExport}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-opacity hover:opacity-90 bg-accent"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exportLabel}</span>
            </button>
          </BubbleHint>
        )}

        {onReset && (
          <BubbleHint content="Reset tool to default values" placement="bottom">
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </BubbleHint>
        )}
      </div>
    </div>
  );
};
