import React, { useState } from 'react';
import { SharedToolbar } from '../shared/SharedToolbar';
import { useNotifications } from '../../context/NotificationContext';
import { Copy, Check, Calculator, ArrowRightLeft } from 'lucide-react';

interface UnitConverterToolProps {
  accentColor: string;
}

export const UnitConverterTool: React.FC<UnitConverterToolProps> = ({ accentColor }) => {
  const [basePx, setBasePx] = useState(16);
  const [inputPx, setInputPx] = useState(24);

  // Clamp Calculator parameters
  const [minViewport, setMinViewport] = useState(360);
  const [maxViewport, setMaxViewport] = useState(1280);
  const [minSizePx, setMinSizePx] = useState(16);
  const [maxSizePx, setMaxSizePx] = useState(32);

  const [copiedClamp, setCopiedClamp] = useState(false);
  const { addNotification } = useNotifications();

  // Conversions
  const remValue = (inputPx / basePx).toFixed(3).replace(/\.?0+$/, '');
  const ptValue = (inputPx * 0.75).toFixed(1).replace(/\.?0+$/, '');
  const percentValue = ((inputPx / basePx) * 100).toFixed(1).replace(/\.?0+$/, '');

  // Calculate clamp() formula
  // slope = (maxFontSize - minFontSize) / (maxViewport - minViewport)
  // yAxisIntersection = -minViewport * slope + minFontSize
  const slope = (maxSizePx - minSizePx) / (maxViewport - minViewport);
  const yAxisIntersection = -minViewport * slope + minSizePx;
  const slopeVw = (slope * 100).toFixed(4);
  const interceptRem = (yAxisIntersection / basePx).toFixed(4);
  const minRem = (minSizePx / basePx).toFixed(3).replace(/\.?0+$/, '');
  const maxRem = (maxSizePx / basePx).toFixed(3).replace(/\.?0+$/, '');

  const clampCss = `clamp(${minRem}rem, ${interceptRem}rem + ${slopeVw}vw, ${maxRem}rem)`;

  const handleCopyClamp = () => {
    navigator.clipboard.writeText(clampCss);
    setCopiedClamp(true);
    addNotification({
      title: 'CSS clamp() Copied',
      message: clampCss,
      type: 'success',
      toolSource: 'Unit Tool',
    });
    setTimeout(() => setCopiedClamp(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SharedToolbar
        title="Responsive Unit & Clamp() Calculator"
        badge="Layout Utility"
        accentColor={accentColor}
        onReset={() => {
          setBasePx(16);
          setInputPx(24);
          setMinViewport(360);
          setMaxViewport(1280);
          setMinSizePx(16);
          setMaxSizePx(32);
        }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Unit Conversion Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <ArrowRightLeft className="w-4 h-4 text-indigo-500" />
              <span>Pixel to REM / Percentage Converter</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Root Base Size (HTML)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={basePx}
                    onChange={(e) => setBasePx(Math.max(1, parseInt(e.target.value, 10) || 16))}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 caret-neutral-900 dark:caret-neutral-100"
                  />
                  <span className="text-xs font-mono text-neutral-400">px</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                  Target Value to Convert
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={inputPx}
                    onChange={(e) => setInputPx(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 caret-neutral-900 dark:caret-neutral-100"
                  />
                  <span className="text-xs font-mono text-neutral-400">px</span>
                </div>
              </div>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div
                onClick={() => {
                  navigator.clipboard.writeText(`${remValue}rem`);
                  addNotification({ title: 'Copied REM', message: `${remValue}rem`, type: 'info', toolSource: 'Unit Tool' });
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-center"
              >
                <span className="text-[10px] text-neutral-400 font-mono block">REM</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                  {remValue}rem
                </span>
              </div>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(`${ptValue}pt`);
                  addNotification({ title: 'Copied PT', message: `${ptValue}pt`, type: 'info', toolSource: 'Unit Tool' });
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-center"
              >
                <span className="text-[10px] text-neutral-400 font-mono block">Points</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                  {ptValue}pt
                </span>
              </div>

              <div
                onClick={() => {
                  navigator.clipboard.writeText(`${percentValue}%`);
                  addNotification({ title: 'Copied Percent', message: `${percentValue}%`, type: 'info', toolSource: 'Unit Tool' });
                }}
                className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors text-center"
              >
                <span className="text-[10px] text-neutral-400 font-mono block">Percent</span>
                <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                  {percentValue}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Fluid Clamp Generator Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-500" />
              <span>Fluid Responsive clamp() Generator</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Min Screen Viewport</label>
                <input
                  type="number"
                  value={minViewport}
                  onChange={(e) => setMinViewport(parseInt(e.target.value, 10) || 320)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Max Screen Viewport</label>
                <input
                  type="number"
                  value={maxViewport}
                  onChange={(e) => setMaxViewport(parseInt(e.target.value, 10) || 1280)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Min Font/Size (px)</label>
                <input
                  type="number"
                  value={minSizePx}
                  onChange={(e) => setMinSizePx(parseInt(e.target.value, 10) || 14)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>
              <div>
                <label className="block text-[11px] text-neutral-500 mb-1">Max Font/Size (px)</label>
                <input
                  type="number"
                  value={maxSizePx}
                  onChange={(e) => setMaxSizePx(parseInt(e.target.value, 10) || 36)}
                  className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
                />
              </div>
            </div>

            {/* Generated clamp preview */}
            <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 flex items-center justify-between gap-2">
              <code className="text-xs font-mono text-emerald-600 dark:text-emerald-400 truncate">
                {clampCss}
              </code>
              <button
                type="button"
                onClick={handleCopyClamp}
                className="px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs font-medium flex items-center gap-1 text-neutral-800 dark:text-neutral-100 flex-shrink-0"
              >
                {copiedClamp ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                <span>Copy</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
