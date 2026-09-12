import React, { useState } from 'react';
import { ColorPicker } from '../shared/ColorPicker';
import { SharedToolbar } from '../shared/SharedToolbar';
import { generateTonalPalette, getContrastRatio, hexToRgb } from '../../utils/color';
import { useNotifications } from '../../context/NotificationContext';
import { Sparkles, Check, Copy, Sliders, ShieldCheck } from 'lucide-react';

interface ColorStudioToolProps {
  accentColor: string;
}

export const ColorStudioTool: React.FC<ColorStudioToolProps> = ({ accentColor }) => {
  const [baseColor, setBaseColor] = useState('#4F46E5');
  const [copiedCode, setCopiedCode] = useState(false);
  const [colorFormat, setColorFormat] = useState<'css' | 'tailwind' | 'json'>('tailwind');
  const { addNotification } = useNotifications();

  const tones = generateTonalPalette(baseColor);
  const contrastAgainstWhite = getContrastRatio(baseColor, '#FFFFFF');
  const contrastAgainstBlack = getContrastRatio(baseColor, '#000000');

  const getExportCode = () => {
    if (colorFormat === 'tailwind') {
      return `@theme {
  --color-brand-50: ${tones[0]?.hex};
  --color-brand-100: ${tones[1]?.hex};
  --color-brand-200: ${tones[2]?.hex};
  --color-brand-300: ${tones[3]?.hex};
  --color-brand-400: ${tones[4]?.hex};
  --color-brand-500: ${tones[5]?.hex}; /* Base */
  --color-brand-600: ${tones[6]?.hex};
  --color-brand-700: ${tones[7]?.hex};
  --color-brand-800: ${tones[8]?.hex};
  --color-brand-900: ${tones[9]?.hex};
  --color-brand-950: ${tones[10]?.hex};
}`;
    }
    if (colorFormat === 'css') {
      return `:root {
  --brand-primary: ${baseColor};
  --brand-rgb: ${hexToRgb(baseColor).r}, ${hexToRgb(baseColor).g}, ${hexToRgb(baseColor).b};
  ${tones.map((t) => `--brand-${t.label}: ${t.hex};`).join('\n  ')}
}`;
    }
    return JSON.stringify(
      {
        base: baseColor,
        shades: Object.fromEntries(tones.map((t) => [t.label, t.hex])),
      },
      null,
      2
    );
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getExportCode());
    setCopiedCode(true);
    addNotification({
      title: 'Palette Code Copied',
      message: `Exported ${colorFormat.toUpperCase()} variables for ${baseColor}`,
      type: 'success',
      toolSource: 'Color Studio',
    });
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleExportFile = () => {
    const code = getExportCode();
    const ext = colorFormat === 'json' ? 'json' : 'css';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kitstack-palette-${baseColor.replace('#', '')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    addNotification({
      title: 'Palette File Downloaded',
      message: `Saved kitstack-palette-${baseColor.replace('#', '')}.${ext}`,
      type: 'info',
      toolSource: 'Color Studio',
    });
  };

  return (
    <div className="space-y-6">
      <SharedToolbar
        title="Color & Palette Studio"
        badge="Shared Library Powered"
        onCopy={handleCopyCode}
        copied={copiedCode}
        onExport={handleExportFile}
        exportLabel="Download Map"
        onReset={() => setBaseColor('#4F46E5')}
        accentColor={accentColor}
        customActions={
          <div className="flex rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 p-0.5">
            {(['tailwind', 'css', 'json'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setColorFormat(fmt)}
                className={`px-2 py-1 text-[11px] font-mono font-medium rounded-md uppercase transition-colors ${
                  colorFormat === fmt
                    ? 'bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 shadow-2xs font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        }
      />

      {/* Main Grid: Shared ColorPicker on Left, Tonal Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Embedded Shared ColorPicker */}
        <div className="lg:col-span-5 space-y-4">
          <div>
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block mb-1">
              Shared ColorPicker Component
            </span>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              This component is imported directly from <code className="font-mono text-accent">@kitstack/shared</code> and reusable by any tool tab.
            </p>
            <ColorPicker
              value={baseColor}
              onChange={setBaseColor}
              label="Active Primary Seed"
              showPresets
            />
          </div>

          {/* Accessibility Card */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                WCAG Contrast Ratings
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-neutral-600 dark:text-neutral-300">On White</span>
                  <span className="font-mono font-bold">{contrastAgainstWhite}:1</span>
                </div>
                <div className="flex gap-1.5 text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-mono ${contrastAgainstWhite >= 4.5 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'}`}>
                    AA {contrastAgainstWhite >= 4.5 ? 'Pass' : 'Fail'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-mono ${contrastAgainstWhite >= 7 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'}`}>
                    AAA {contrastAgainstWhite >= 7 ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-neutral-600 dark:text-neutral-300">On Black</span>
                  <span className="font-mono font-bold">{contrastAgainstBlack}:1</span>
                </div>
                <div className="flex gap-1.5 text-[10px]">
                  <span className={`px-1.5 py-0.5 rounded font-mono ${contrastAgainstBlack >= 4.5 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'}`}>
                    AA {contrastAgainstBlack >= 4.5 ? 'Pass' : 'Fail'}
                  </span>
                  <span className={`px-1.5 py-0.5 rounded font-mono ${contrastAgainstBlack >= 7 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300' : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-500'}`}>
                    AAA {contrastAgainstBlack >= 7 ? 'Pass' : 'Fail'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Tonal Scale & Live Output */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-3">
              Generated Tonal Harmony Scale
            </h3>

            {/* Tonal Bars */}
            <div className="grid grid-cols-11 gap-1 h-20 rounded-xl overflow-hidden shadow-inner border border-neutral-200 dark:border-neutral-700 mb-4">
              {tones.map((tone) => (
                <div
                  key={tone.label}
                  onClick={() => setBaseColor(tone.hex)}
                  className="h-full group relative cursor-pointer transition-transform hover:scale-y-105"
                  style={{ backgroundColor: tone.hex }}
                  title={`${tone.label}: ${tone.hex}`}
                >
                  <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity bg-black/75 text-white px-1 rounded">
                    {tone.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Swatch detail rows */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tones.map((tone) => (
                <div
                  key={tone.label}
                  onClick={() => setBaseColor(tone.hex)}
                  className="flex items-center justify-between p-2 rounded-lg border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-md border border-neutral-300 dark:border-neutral-700"
                      style={{ backgroundColor: tone.hex }}
                    />
                    <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      {tone.label}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-neutral-400">{tone.hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Export Code Box */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
                Export: {colorFormat.toUpperCase()} Variables
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-xs flex items-center gap-1 font-mono hover:opacity-80 text-accent"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-neutral-800 dark:text-neutral-300 overflow-x-auto p-2 rounded bg-neutral-50 dark:bg-black/40 max-h-48 scrollbar-thin">
              {getExportCode()}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
