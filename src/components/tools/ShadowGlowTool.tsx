import React, { useState } from 'react';
import { ColorPicker } from '../shared/ColorPicker';
import { SharedToolbar } from '../shared/SharedToolbar';
import { useNotifications } from '../../context/NotificationContext';
import { Layers, Copy, Check, Eye, Sun, Moon } from 'lucide-react';

interface ShadowGlowToolProps {
  accentColor: string;
}

export const ShadowGlowTool: React.FC<ShadowGlowToolProps> = ({ accentColor }) => {
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(12);
  const [blur, setBlur] = useState(24);
  const [spread, setSpread] = useState(-4);
  const [shadowColor, setShadowColor] = useState('#4F46E5');
  const [ambientBlur, setAmbientBlur] = useState(48);
  const [ambientOpacity, setAmbientOpacity] = useState(25);
  const [isInset, setIsInset] = useState(false);
  const [previewDark, setPreviewDark] = useState(false);
  const [copied, setCopied] = useState(false);

  const { addNotification } = useNotifications();

  // Convert hex to rgb string for rgba shadow
  const getBoxShadowCss = () => {
    // Parse hex
    let hex = shadowColor.replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const num = parseInt(hex.substring(0, 6), 16) || 0;
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;

    const mainAlpha = 0.35;
    const ambAlpha = (ambientOpacity / 100) * 0.25;

    const insetStr = isInset ? 'inset ' : '';
    const mainShadow = `${insetStr}${xOffset}px ${yOffset}px ${blur}px ${spread}px rgba(${r}, ${g}, ${b}, ${mainAlpha})`;
    const ambientShadow = `${insetStr}0px ${Math.round(yOffset * 1.5)}px ${ambientBlur}px 0px rgba(${r}, ${g}, ${b}, ${ambAlpha})`;

    return `${mainShadow}, ${ambientShadow}`;
  };

  const cssValue = `box-shadow: ${getBoxShadowCss()};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cssValue);
    setCopied(true);
    addNotification({
      title: 'CSS Shadow Copied',
      message: 'Copied multi-layer box-shadow rule to clipboard',
      type: 'success',
      toolSource: 'Shadow Builder',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <SharedToolbar
        title="CSS Shadow & Glow Builder"
        badge="Shared Library Component"
        onCopy={handleCopy}
        copied={copied}
        onReset={() => {
          setXOffset(0);
          setYOffset(12);
          setBlur(24);
          setSpread(-4);
          setShadowColor('#4F46E5');
          setAmbientOpacity(25);
          setIsInset(false);
        }}
        accentColor={accentColor}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
              Geometry & Elevation
            </h3>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                <span>Horizontal Offset (X)</span>
                <span className="font-mono">{xOffset}px</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                value={xOffset}
                onChange={(e) => setXOffset(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                <span>Vertical Elevation (Y)</span>
                <span className="font-mono">{yOffset}px</span>
              </div>
              <input
                type="range"
                min="-40"
                max="80"
                value={yOffset}
                onChange={(e) => setYOffset(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                <span>Blur Radius</span>
                <span className="font-mono">{blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={blur}
                onChange={(e) => setBlur(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                <span>Spread Radius</span>
                <span className="font-mono">{spread}px</span>
              </div>
              <input
                type="range"
                min="-30"
                max="40"
                value={spread}
                onChange={(e) => setSpread(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                Inset Shadow Mode
              </span>
              <button
                type="button"
                onClick={() => setIsInset(!isInset)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                  isInset
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                    : 'border-neutral-300 dark:border-neutral-700 text-neutral-500'
                }`}
              >
                {isInset ? 'Inset Active' : 'Outset'}
              </button>
            </div>
          </div>

          {/* Shared ColorPicker for Shadow Color */}
          <ColorPicker
            value={shadowColor}
            onChange={setShadowColor}
            label="Shadow Tint (Shared Component)"
            showPresets
          />
        </div>

        {/* Live Preview Canvas & CSS Output */}
        <div className="lg:col-span-6 space-y-4">
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                Stage Preview
              </span>
              <button
                type="button"
                onClick={() => setPreviewDark(!previewDark)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {previewDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
                <span>{previewDark ? 'Light Backdrop' : 'Dark Backdrop'}</span>
              </button>
            </div>

            {/* Interactive Preview Container */}
            <div
              className={`h-72 rounded-xl flex items-center justify-center p-8 transition-colors duration-200 border border-neutral-200/60 dark:border-neutral-700/60 ${
                previewDark ? 'bg-neutral-950' : 'bg-neutral-100'
              }`}
            >
              <div
                className={`w-48 h-36 rounded-2xl flex flex-col items-center justify-center p-4 transition-all duration-150 ${
                  previewDark ? 'bg-neutral-900 text-neutral-100' : 'bg-white text-neutral-900'
                }`}
                style={{
                  boxShadow: getBoxShadowCss(),
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg mb-2 flex items-center justify-center text-white text-xs font-bold shadow-xs"
                  style={{ backgroundColor: shadowColor }}
                >
                  KS
                </div>
                <span className="text-xs font-bold">Interactive Card</span>
                <span className="text-[10px] text-neutral-400 font-mono mt-0.5">KitStack.org</span>
              </div>
            </div>
          </div>

          {/* Code snippet */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">CSS box-shadow</span>
              <button
                type="button"
                onClick={handleCopy}
                className="text-xs flex items-center gap-1 font-mono hover:opacity-80"
                style={{ color: accentColor }}
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy CSS'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-neutral-800 dark:text-neutral-300 p-2.5 rounded bg-neutral-50 dark:bg-black/40 overflow-x-auto whitespace-pre-wrap break-all">
              {cssValue}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
