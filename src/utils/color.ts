/**
 * Robust Color Utilities for KitStack Shared Library
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
  a?: number;
}

export interface HslColor {
  h: number;
  s: number;
  l: number;
  a?: number;
}

export function hexToRgb(hex: string): RgbColor {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned.split('').map(c => c + c).join('');
  }
  if (cleaned.length === 8) {
    const r = parseInt(cleaned.substring(0, 2), 16) || 0;
    const g = parseInt(cleaned.substring(2, 4), 16) || 0;
    const b = parseInt(cleaned.substring(4, 6), 16) || 0;
    const a = Math.round((parseInt(cleaned.substring(6, 8), 16) / 255) * 100) / 100;
    return { r, g, b, a };
  }
  const num = parseInt(cleaned, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
    a: 1,
  };
}

export function rgbToHex(r: number, g: number, b: number, a: number = 1): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');

  if (a < 1) {
    const alphaHex = Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}${alphaHex}`.toUpperCase();
  }
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

export function rgbToHsl(r: number, g: number, b: number): HslColor {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(h: number, s: number, l: number): RgbColor {
  h = (h % 360) / 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const r = Math.round(hue2rgb(p, q, h + 1 / 3) * 255);
  const g = Math.round(hue2rgb(p, q, h) * 255);
  const b = Math.round(hue2rgb(p, q, h - 1 / 3) * 255);

  return { r, g, b };
}

export function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return Math.round(((brightest + 0.05) / (darkest + 0.05)) * 100) / 100;
}

export function generateTonalPalette(baseHex: string): { label: string; hex: string; contrast: number }[] {
  const rgb = hexToRgb(baseHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
  const stops = [
    { label: '50', l: 96 },
    { label: '100', l: 92 },
    { label: '200', l: 82 },
    { label: '300', l: 71 },
    { label: '400', l: 58 },
    { label: '500', l: 48 }, // close to base
    { label: '600', l: 38 },
    { label: '700', l: 29 },
    { label: '800', l: 20 },
    { label: '900', l: 12 },
    { label: '950', l: 7 },
  ];

  return stops.map(stop => {
    const stepRgb = hslToRgb(hsl.h, Math.min(100, Math.round(hsl.s * 1.05)), stop.l);
    const hex = rgbToHex(stepRgb.r, stepRgb.g, stepRgb.b);
    const contrast = getContrastRatio(hex, '#FFFFFF');
    return { label: stop.label, hex, contrast };
  });
}

export function applyThemeCssVariables(accentHex: string, isDark: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const rgb = hexToRgb(accentHex);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Compute hover and active shades
  const hoverL = isDark ? Math.min(95, hsl.l + 7) : Math.max(5, hsl.l - 7);
  const activeL = isDark ? Math.min(95, hsl.l + 14) : Math.max(5, hsl.l - 14);
  const hoverRgb = hslToRgb(hsl.h, hsl.s, hoverL);
  const activeRgb = hslToRgb(hsl.h, hsl.s, activeL);

  const hoverHex = rgbToHex(hoverRgb.r, hoverRgb.g, hoverRgb.b);
  const activeHex = rgbToHex(activeRgb.r, activeRgb.g, activeRgb.b);

  // Accessible text contrast color
  const lum = getLuminance(rgb.r, rgb.g, rgb.b);
  const contrastText = lum > 0.4 ? '#0a0a0a' : '#ffffff';

  const subtleRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isDark ? 0.2 : 0.12})`;
  const borderRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${isDark ? 0.45 : 0.35})`;
  const ringRgba = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.45)`;

  root.style.setProperty('--theme-accent', accentHex);
  root.style.setProperty('--theme-accent-hover', hoverHex);
  root.style.setProperty('--theme-accent-active', activeHex);
  root.style.setProperty('--theme-accent-contrast', contrastText);
  root.style.setProperty('--theme-accent-subtle', subtleRgba);
  root.style.setProperty('--theme-accent-border', borderRgba);
  root.style.setProperty('--theme-accent-ring', ringRgba);
}
