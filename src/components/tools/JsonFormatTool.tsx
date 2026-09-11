import React, { useState } from 'react';
import { SharedToolbar } from '../shared/SharedToolbar';
import { useNotifications } from '../../context/NotificationContext';
import { Check, AlertCircle, Sparkles, Minimize2, ArrowUpDown } from 'lucide-react';

interface JsonFormatToolProps {
  accentColor: string;
}

const DEFAULT_SAMPLE = {
  repository: "KitStack.org",
  version: "3.0.0",
  architecture: {
    shell: "Modern Tabset with Responsive Mobile Drawer",
    sharedLibrary: [
      "ColorPicker (Hex, RGB, HSL, Alpha)",
      "SharedToolbar (Action Bar)",
      "ToastNotificationEngine",
      "WebAudioChimes"
    ],
    theming: {
      nativeDarkMode: true,
      customAccentPicker: true
    }
  },
  activeTabsCount: 4
};

export const JsonFormatTool: React.FC<JsonFormatToolProps> = ({ accentColor }) => {
  const [input, setInput] = useState(() => JSON.stringify(DEFAULT_SAMPLE, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { addNotification } = useNotifications();

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
      addNotification({
        title: 'JSON Formatted',
        message: 'Prettified JSON structure successfully',
        type: 'success',
        toolSource: 'JSON Inspector',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(message);
      addNotification({
        title: 'Format Error',
        message,
        type: 'error',
        toolSource: 'JSON Inspector',
      });
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
      addNotification({
        title: 'JSON Minified',
        message: 'Stripped whitespace and indentation',
        type: 'info',
        toolSource: 'JSON Inspector',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(message);
    }
  };

  const handleSortKeys = () => {
    try {
      const sortObject = (obj: any): any => {
        if (typeof obj !== 'object' || obj === null) return obj;
        if (Array.isArray(obj)) return obj.map(sortObject);
        return Object.keys(obj)
          .sort()
          .reduce((result: Record<string, any>, key) => {
            result[key] = sortObject(obj[key]);
            return result;
          }, {});
      };

      const parsed = JSON.parse(input);
      const sorted = sortObject(parsed);
      setInput(JSON.stringify(sorted, null, 2));
      setError(null);
      addNotification({
        title: 'Keys Sorted',
        message: 'Alphabetized all object properties recursively',
        type: 'success',
        toolSource: 'JSON Inspector',
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid JSON format';
      setError(message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(input);
    setCopied(true);
    addNotification({
      title: 'JSON Copied',
      message: 'Payload copied to clipboard',
      type: 'success',
      toolSource: 'JSON Inspector',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kitstack-payload.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Metrics
  const charCount = input.length;
  const lineCount = input.split('\n').length;
  const byteCount = new TextEncoder().encode(input).length;

  return (
    <div className="space-y-4">
      <SharedToolbar
        title="JSON & Token Inspector"
        badge="Data Utility"
        onCopy={handleCopy}
        copied={copied}
        onExport={handleExport}
        exportLabel="Export .json"
        onReset={() => setInput(JSON.stringify(DEFAULT_SAMPLE, null, 2))}
        accentColor={accentColor}
        customActions={
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFormat}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              <span>Prettify</span>
            </button>
            <button
              onClick={handleMinify}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minify</span>
            </button>
            <button
              onClick={handleSortKeys}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-200 flex items-center gap-1"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort Keys</span>
            </button>
          </div>
        }
      />

      {/* Payload Metrics Bar */}
      <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/60 text-[11px] font-mono text-neutral-600 dark:text-neutral-300">
        <div className="flex items-center gap-3">
          <span>{charCount.toLocaleString()} chars</span>
          <span>•</span>
          <span>{lineCount} lines</span>
          <span>•</span>
          <span>{(byteCount / 1024).toFixed(2)} KB</span>
        </div>
        {error ? (
          <span className="text-rose-500 flex items-center gap-1 font-sans font-medium text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Invalid JSON</span>
          </span>
        ) : (
          <span className="text-emerald-500 flex items-center gap-1 font-sans font-medium text-xs">
            <Check className="w-3.5 h-3.5" />
            <span>Valid JSON</span>
          </span>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-300 font-mono">
          {error}
        </div>
      )}

      {/* Editor Area */}
      <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-xs">
        <textarea
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            try {
              JSON.parse(e.target.value);
              setError(null);
            } catch (err: unknown) {
              setError(err instanceof Error ? err.message : 'Invalid JSON');
            }
          }}
          className="w-full h-96 p-4 font-mono text-xs bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 caret-neutral-900 dark:caret-neutral-100 placeholder:text-neutral-400 border-none outline-none resize-y focus:ring-0 leading-relaxed"
          placeholder="Paste or write raw JSON here..."
          spellCheck={false}
        />
      </div>
    </div>
  );
};
