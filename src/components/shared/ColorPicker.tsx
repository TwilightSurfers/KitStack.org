import React, { useState, useEffect, useRef } from 'react';
import { Pipette, Check, Copy, RefreshCw } from 'lucide-react';
import { hexToRgb, rgbToHex, rgbToHsl, hslToRgb, getContrastRatio } from '../../utils/color';

export interface ColorPickerProps {
  value: string;
  onChange: (colorHex: string) => void;
  label?: string;
  showAlpha?: boolean;
  showPresets?: boolean;
  compact?: boolean;
  className?: string;
}

const DEFAULT_PRESETS = [
  '#4F46E5', '#3B82F6', '#06B6D4', '#10B981',
  '#F59E0B', '#EF4444', '#EC4899', '#8B5CF6',
  '#0F172A', '#475569', '#94A3B8', '#F1F5F9',
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  label,
  showAlpha = false,
  showPresets = true,
  compact = false,
  className = '',
}) => {
  const [hexInput, setHexInput] = useState(value);
  const [copied, setCopied] = useState(false);
  const [alpha, setAlpha] = useState(1);
  const [recentSwatches, setRecentSwatches] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('kitstack_color_swatches');
      return saved ? JSON.parse(saved) : DEFAULT_PRESETS.slice(0, 8);
    } catch {
      return DEFAULT_PRESETS.slice(0, 8);
    }
  });

  const isEyeDropperAvailable = typeof window !== 'undefined' && 'EyeDropper' in window;
  const rgb = hexToRgb(value);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  useEffect(() => {
    setHexInput(value);
  }, [value]);

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.trim();
    if (!val.startsWith('#') && /^[0-9A-Fa-f]/.test(val)) {
      val = '#' + val;
    }
    setHexInput(val);
    if (/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(val)) {
      onChange(val.toUpperCase());
      addToHistory(val.toUpperCase());
    }
  };

  const handleHueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newHue = parseInt(e.target.value, 10);
    const newRgb = hslToRgb(newHue, hsl.s || 80, hsl.l || 50);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b, showAlpha ? alpha : 1);
    onChange(newHex);
    setHexInput(newHex);
  };

  const handleLightnessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newL = parseInt(e.target.value, 10);
    const newRgb = hslToRgb(hsl.h, hsl.s || 80, newL);
    const newHex = rgbToHex(newRgb.r, newRgb.g, newRgb.b, showAlpha ? alpha : 1);
    onChange(newHex);
    setHexInput(newHex);
  };

  const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newA = parseFloat(e.target.value);
    setAlpha(newA);
    const newHex = rgbToHex(rgb.r, rgb.g, rgb.b, newA);
    onChange(newHex);
    setHexInput(newHex);
  };

  const addToHistory = (color: string) => {
    setRecentSwatches(prev => {
      const filtered = prev.filter(c => c.toLowerCase() !== color.toLowerCase());
      const updated = [color, ...filtered].slice(0, 10);
      try {
        localStorage.setItem('kitstack_color_swatches', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleEyeDropper = async () => {
    if (!isEyeDropperAvailable) return;
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dropper = new (window as any).EyeDropper();
      const result = await dropper.open();
      if (result?.sRGBHex) {
        const hex = result.sRGBHex.toUpperCase();
        onChange(hex);
        setHexInput(hex);
        addToHistory(hex);
      }
    } catch {
      // user canceled picker
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const contrastWhite = getContrastRatio(value, '#FFFFFF');
  const contrastBlack = getContrastRatio(value, '#000000');

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="relative group">
          <input
            type="color"
            value={value.slice(0, 7)}
            onChange={(e) => {
              onChange(e.target.value.toUpperCase());
              addToHistory(e.target.value.toUpperCase());
            }}
            className="w-8 h-8 rounded-lg cursor-pointer border border-neutral-300 dark:border-neutral-700 bg-transparent p-0 overflow-hidden"
            title="Pick color"
          />
        </div>
        <input
          type="text"
          value={hexInput}
          onChange={handleHexChange}
          className="w-24 px-2 py-1 text-xs font-mono rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 uppercase"
        />
      </div>
    );
  }

  return (
    <div className={`p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xs ${className}`}>
      {label && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
          <div className="flex items-center gap-1 text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
            <span className={contrastWhite >= 4.5 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
              W:{contrastWhite}:1
            </span>
            <span>•</span>
            <span className={contrastBlack >= 4.5 ? 'text-emerald-600 dark:text-emerald-400 font-medium' : ''}>
              B:{contrastBlack}:1
            </span>
          </div>
        </div>
      )}

      {/* Main Preview Swatch & Hex Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-14 h-14 rounded-xl border border-neutral-300 dark:border-neutral-700 shadow-inner flex-shrink-0 transition-all duration-150 relative overflow-hidden"
          style={{ backgroundColor: value }}
        >
          {/* Subtle checkerboard underlay for transparency preview */}
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:6px_6px] opacity-40" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1.5">
            <input
              type="text"
              value={hexInput}
              onChange={handleHexChange}
              placeholder="#4F46E5"
              className="w-full px-2.5 py-1.5 font-mono text-sm font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-accent uppercase"
            />
            <button
              type="button"
              onClick={handleCopy}
              title="Copy HEX Code"
              className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
            </button>
            {isEyeDropperAvailable && (
              <button
                type="button"
                onClick={handleEyeDropper}
                title="Eyedropper (Sample screen color)"
                className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300 transition-colors"
              >
                <Pipette className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 flex gap-2">
            <span>RGB({rgb.r}, {rgb.g}, {rgb.b})</span>
            <span>•</span>
            <span>HSL({hsl.h}°, {hsl.s}%, {hsl.l}%)</span>
          </div>
        </div>
      </div>

      {/* Hue Slider */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <span>Hue Spectrum</span>
          <span>{hsl.h}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          value={hsl.h}
          onChange={handleHueChange}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer outline-none shadow-inner"
          style={{
            background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)',
          }}
        />
      </div>

      {/* Lightness Slider */}
      <div className="mb-3">
        <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
          <span>Luminance / Shade</span>
          <span>{hsl.l}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={hsl.l}
          onChange={handleLightnessChange}
          className="w-full h-3 rounded-lg appearance-none cursor-pointer outline-none shadow-inner"
          style={{
            background: `linear-gradient(to right, #000000 0%, ${rgbToHex(
              hslToRgb(hsl.h, hsl.s || 80, 50).r,
              hslToRgb(hsl.h, hsl.s || 80, 50).g,
              hslToRgb(hsl.h, hsl.s || 80, 50).b
            )} 50%, #ffffff 100%)`,
          }}
        />
      </div>

      {/* Optional Alpha slider */}
      {showAlpha && (
        <div className="mb-3">
          <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
            <span>Opacity / Alpha</span>
            <span>{Math.round(alpha * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={alpha}
            onChange={handleAlphaChange}
            className="w-full h-3 rounded-lg appearance-none cursor-pointer outline-none shadow-inner bg-gradient-to-r from-transparent to-current text-accent accent-theme"
          />
        </div>
      )}

      {/* Preset and Recent Swatches */}
      {showPresets && (
        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800">
          <div className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-2 flex items-center justify-between">
            <span>Shared Swatches</span>
            <button
              type="button"
              onClick={() => {
                const randomHex = '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0').toUpperCase();
                onChange(randomHex);
                setHexInput(randomHex);
                addToHistory(randomHex);
              }}
              title="Random Color"
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {recentSwatches.map((preset, idx) => (
              <button
                key={`${preset}-${idx}`}
                type="button"
                onClick={() => {
                  onChange(preset);
                  setHexInput(preset);
                }}
                className={`w-6 h-6 rounded-md border transition-transform hover:scale-110 active:scale-95 ${
                  value.toLowerCase() === preset.toLowerCase()
                    ? 'ring-2 ring-accent ring-offset-1 dark:ring-offset-neutral-900 border-white'
                    : 'border-neutral-300 dark:border-neutral-700'
                }`}
                style={{ backgroundColor: preset }}
                title={preset}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
