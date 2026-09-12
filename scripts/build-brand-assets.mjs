import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const ROOT = path.resolve('.');
const FAVICONS_DIR = path.join(ROOT, 'public', 'favicons');
const SPLASH_DIR = path.join(ROOT, 'public', 'images', 'splash');
const SRC_ASSETS_DIR = path.join(ROOT, 'src', 'assets');

// Ensure directories exist
fs.mkdirSync(FAVICONS_DIR, { recursive: true });
fs.mkdirSync(SPLASH_DIR, { recursive: true });
fs.mkdirSync(SRC_ASSETS_DIR, { recursive: true });

// 1. Master Brand SVG Icon (Black squircle, crisp white Layers icon, subtle edge contour for any background)
function getBrandSvg({ isFaviconSmall = false } = {}) {
  const scale = isFaviconSmall ? 14.5 : 13.5;
  const strokeWidth = isFaviconSmall ? 2.4 : 2.1;
  const offset = 256 - 12 * scale;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <!-- Deep obsidian squircle background -->
    <linearGradient id="kitstack-sq-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161619" />
      <stop offset="100%" stop-color="#050506" />
    </linearGradient>

    <!-- Subtle border highlight so the squircle boundary is visible even against pitch-black OLED / dark tab bars -->
    <linearGradient id="kitstack-sq-border" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#44444c" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#24242a" stop-opacity="0.5" />
    </linearGradient>
  </defs>

  <!-- Squircle Base -->
  <rect 
    x="12" 
    y="12" 
    width="488" 
    height="488" 
    rx="112" 
    ry="112" 
    fill="url(#kitstack-sq-bg)" 
    stroke="url(#kitstack-sq-border)" 
    stroke-width="12"
  />

  <!-- White KitStack Layers Brand Symbol -->
  <g 
    transform="translate(${offset}, ${offset}) scale(${scale})" 
    fill="none" 
    stroke="#FFFFFF" 
    stroke-width="${strokeWidth}" 
    stroke-linecap="round" 
    stroke-linejoin="round"
  >
    <!-- Top layer diamond -->
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
    <!-- Middle layer chevron -->
    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
    <!-- Bottom layer chevron -->
    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
  </g>
</svg>
`;
}

// 2. Monochrome Safari Pinned Tab Mask SVG
function getSafariPinnedSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <g fill="none" stroke="#000000" stroke-width="28" stroke-linecap="round" stroke-linejoin="round" transform="translate(46, 46) scale(17.5)">
    <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
    <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
    <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
  </g>
</svg>
`;
}

// 3. OpenGraph / Twitter Splash SVG (1200 x 630)
function getOgSvg() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <!-- Background Gradients -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090a10" />
      <stop offset="50%" stop-color="#050608" />
      <stop offset="100%" stop-color="#020204" />
    </linearGradient>

    <!-- Radial Twilight Accent Glow -->
    <radialGradient id="twilightGlow" cx="24%" cy="46%" r="42%">
      <stop offset="0%" stop-color="#4f46e5" stop-opacity="0.32" />
      <stop offset="45%" stop-color="#3b82f6" stop-opacity="0.10" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <radialGradient id="secondaryGlow" cx="80%" cy="20%" r="35%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.12" />
      <stop offset="100%" stop-color="#000000" stop-opacity="0" />
    </radialGradient>

    <!-- Squircle Icon Gradients -->
    <linearGradient id="iconSqBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#18181b" />
      <stop offset="100%" stop-color="#060608" />
    </linearGradient>
    <linearGradient id="iconSqBorder" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#52525b" />
      <stop offset="100%" stop-color="#27272a" />
    </linearGradient>

    <!-- Card Shadow -->
    <filter id="iconShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="28" flood-color="#000000" flood-opacity="0.75" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="1200" height="630" fill="url(#bg)" />
  <rect width="1200" height="630" fill="url(#twilightGlow)" />
  <rect width="1200" height="630" fill="url(#secondaryGlow)" />

  <!-- Subtle Matrix / Technical Grid Lines -->
  <g stroke="#ffffff" stroke-opacity="0.03" stroke-width="1">
    <line x1="80" y1="0" x2="80" y2="630" />
    <line x1="240" y1="0" x2="240" y2="630" />
    <line x1="400" y1="0" x2="400" y2="630" />
    <line x1="560" y1="0" x2="560" y2="630" />
    <line x1="720" y1="0" x2="720" y2="630" />
    <line x1="880" y1="0" x2="880" y2="630" />
    <line x1="1040" y1="0" x2="1040" y2="630" />
    <line x1="0" y1="100" x2="1200" y2="100" />
    <line x1="0" y1="230" x2="1200" y2="230" />
    <line x1="0" y1="360" x2="1200" y2="360" />
    <line x1="0" y1="490" x2="1200" y2="490" />
  </g>

  <!-- Elegant Inner Border Perimeter -->
  <rect x="24" y="24" width="1152" height="582" rx="24" fill="none" stroke="#27272a" stroke-width="1.5" stroke-opacity="0.7" />

  <!-- Top Badge Pill -->
  <g transform="translate(80, 72)">
    <rect width="330" height="34" rx="17" fill="#18181b" stroke="#3f3f46" stroke-width="1" />
    <circle cx="20" cy="17" r="4.5" fill="#6366f1" />
    <text x="34" y="22" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="700" letter-spacing="1.5">TWILIGHT SURFERS TOOL REPO</text>
  </g>

  <!-- Left Hero: Squircle Brand Icon with Layers Glyph -->
  <g transform="translate(80, 142)" filter="url(#iconShadow)">
    <rect 
      x="0" 
      y="0" 
      width="156" 
      height="156" 
      rx="38" 
      ry="38" 
      fill="url(#iconSqBg)" 
      stroke="url(#iconSqBorder)" 
      stroke-width="3" 
    />
    <g transform="translate(27.6, 27.6) scale(4.2)" fill="none" stroke="#FFFFFF" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" />
      <path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" />
      <path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" />
    </g>
  </g>

  <!-- Hero Typography -->
  <g transform="translate(268, 142)">
    <!-- Title -->
    <text x="0" y="62" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="64" font-weight="800" letter-spacing="-1.5"><tspan fill="#FFFFFF">KitStack</tspan><tspan fill="#6366F1">.org</tspan></text>

    <!-- Subtitles -->
    <text x="0" y="105" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="600" letter-spacing="-0.3">
      Free In-Browser Developer &amp; Designer Utilities
    </text>
    <text x="0" y="138" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="400">
      Zero accounts. Zero backend required. Fast client-side tools with shared library architecture.
    </text>
  </g>

  <!-- Feature Tool Badges Row with SVG Vector Icons -->
  <g transform="translate(80, 350)">
    <!-- Pill 1: Color Studio -->
    <g transform="translate(0, 0)">
      <rect width="182" height="48" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
      <g transform="translate(18, 14) scale(0.85)" fill="none" stroke="#818cf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 10 10 0 0 0 9.5-6.5" />
      </g>
      <text x="46" y="30" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">Color Studio</text>
    </g>

    <!-- Pill 2: Shadow & Glow -->
    <g transform="translate(198, 0)">
      <rect width="194" height="48" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
      <g transform="translate(18, 14) scale(0.85)" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </g>
      <text x="46" y="30" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">Shadow &amp; Glow</text>
    </g>

    <!-- Pill 3: JSON Formatter -->
    <g transform="translate(408, 0)">
      <rect width="192" height="48" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
      <g transform="translate(18, 14) scale(0.85)" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </g>
      <text x="46" y="30" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">JSON Formatter</text>
    </g>

    <!-- Pill 4: Unit Converter -->
    <g transform="translate(616, 0)">
      <rect width="186" height="48" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
      <g transform="translate(18, 14) scale(0.85)" fill="none" stroke="#38bdf8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21.3 8.7 8.7 21.3a2.4 2.4 0 0 1-3.4 0l-2.6-2.6a2.4 2.4 0 0 1 0-3.4L15.3 2.7a2.4 2.4 0 0 1 3.4 0l2.6 2.6a2.4 2.4 0 0 1 0 3.4Z" />
      </g>
      <text x="46" y="30" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">Unit Converter</text>
    </g>

    <!-- Pill 5: Markdown Engine -->
    <g transform="translate(818, 0)">
      <rect width="202" height="48" rx="14" fill="#18181b" stroke="#27272a" stroke-width="1.5" />
      <g transform="translate(18, 14) scale(0.85)" fill="none" stroke="#f472b6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </g>
      <text x="46" y="30" fill="#f4f4f5" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600">Markdown Engine</text>
    </g>
  </g>

  <!-- Divider Line -->
  <line x1="80" y1="440" x2="1120" y2="440" stroke="#27272a" stroke-width="1" />

  <!-- Bottom Badges Bar -->
  <g transform="translate(80, 482)">
    <g transform="translate(0, 0)">
      <circle cx="6" cy="14" r="5" fill="#10b981" />
      <text x="22" y="19" fill="#d4d4d8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500">100% Client-Side In-Browser</text>
    </g>
    <g transform="translate(280, 0)">
      <circle cx="6" cy="14" r="5" fill="#6366f1" />
      <text x="22" y="19" fill="#d4d4d8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500">No Backend / Zero Telemetry</text>
    </g>
    <g transform="translate(570, 0)">
      <circle cx="6" cy="14" r="5" fill="#38bdf8" />
      <text x="22" y="19" fill="#d4d4d8" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500">Multi-Tab Workspaces</text>
    </g>
    <g transform="translate(890, 0)">
      <rect x="-16" y="-3" width="166" height="34" rx="8" fill="#27272a" fill-opacity="0.8" stroke="#3f3f46" stroke-width="1" />
      <text x="66" y="19" text-anchor="middle" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700">kitstack.org →</text>
    </g>
  </g>
</svg>
`;
}

// 4. Web Manifest Content
function getWebManifest() {
  return JSON.stringify({
    name: "KitStack.org — Free Browser Tools",
    short_name: "KitStack",
    description: "Twilight Surfers browser utilities for color palettes, CSS shadows, JSON inspection, responsive units, and more. No accounts required.",
    start_url: "/",
    display: "standalone",
    background_color: "#09090b",
    theme_color: "#09090b",
    orientation: "portrait-primary",
    icons: [
      {
        src: "/favicons/favicon-16x16.webp",
        sizes: "16x16",
        type: "image/webp"
      },
      {
        src: "/favicons/favicon-32x32.webp",
        sizes: "32x32",
        type: "image/webp"
      },
      {
        src: "/favicons/favicon-48x48.webp",
        sizes: "48x48",
        type: "image/webp"
      },
      {
        src: "/favicons/android-chrome-192x192.webp",
        sizes: "192x192",
        type: "image/webp",
        purpose: "any maskable"
      },
      {
        src: "/favicons/android-chrome-512x512.webp",
        sizes: "512x512",
        type: "image/webp",
        purpose: "any maskable"
      },
      {
        src: "/favicons/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/favicons/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  }, null, 2);
}

async function build() {
  console.log('--- Generating Brand SVG Assets ---');
  const standardSvg = getBrandSvg({ isFaviconSmall: false });
  const smallSvg = getBrandSvg({ isFaviconSmall: true });
  const safariSvg = getSafariPinnedSvg();
  const ogSvg = getOgSvg();

  // Save SVG files
  fs.writeFileSync(path.join(FAVICONS_DIR, 'favicon.svg'), standardSvg, 'utf8');
  fs.writeFileSync(path.join(FAVICONS_DIR, 'brand-icon.svg'), standardSvg, 'utf8');
  fs.writeFileSync(path.join(FAVICONS_DIR, 'safari-pinned-tab.svg'), safariSvg, 'utf8');
  fs.writeFileSync(path.join(SRC_ASSETS_DIR, 'brand-icon.svg'), standardSvg, 'utf8');
  fs.writeFileSync(path.join(SPLASH_DIR, 'og-image.svg'), ogSvg, 'utf8');
  // Copy favicon.svg to root public/ as well
  fs.writeFileSync(path.join(ROOT, 'public', 'favicon.svg'), standardSvg, 'utf8');

  console.log('✓ SVGs written');

  // Sizes to generate
  const SIZES = [
    { size: 16, name: 'favicon-16x16', useSmall: true },
    { size: 32, name: 'favicon-32x32', useSmall: true },
    { size: 48, name: 'favicon-48x48', useSmall: false },
    { size: 64, name: 'favicon-64x64', useSmall: false },
    { size: 96, name: 'favicon-96x96', useSmall: false },
    { size: 128, name: 'favicon-128x128', useSmall: false },
    { size: 180, name: 'apple-touch-icon', useSmall: false },
    { size: 180, name: 'apple-touch-icon-180x180', useSmall: false },
    { size: 192, name: 'android-chrome-192x192', useSmall: false },
    { size: 256, name: 'favicon-256x256', useSmall: false },
    { size: 384, name: 'android-chrome-384x384', useSmall: false },
    { size: 512, name: 'android-chrome-512x512', useSmall: false },
    { size: 512, name: 'favicon-512x512', useSmall: false }
  ];

  const pngBuffersForIco = [];

  for (const item of SIZES) {
    const svgStr = item.useSmall ? smallSvg : standardSvg;
    const buf = Buffer.from(svgStr);

    // PNG
    const pngPath = path.join(FAVICONS_DIR, `${item.name}.png`);
    await sharp(buf)
      .resize(item.size, item.size)
      .png({ compressionLevel: 9 })
      .toFile(pngPath);

    // WebP
    const webpPath = path.join(FAVICONS_DIR, `${item.name}.webp`);
    await sharp(buf)
      .resize(item.size, item.size)
      .webp({ quality: 95, lossless: true })
      .toFile(webpPath);

    if (item.size === 16 && item.name === 'favicon-16x16') {
      pngBuffersForIco.push(pngPath);
    }
    if (item.size === 32 && item.name === 'favicon-32x32') {
      pngBuffersForIco.push(pngPath);
    }
    if (item.size === 48 && item.name === 'favicon-48x48') {
      pngBuffersForIco.push(pngPath);
    }

    console.log(`✓ Generated ${item.name}.png and .webp (${item.size}x${item.size})`);
  }

  // Generate multi-resolution favicon.ico
  console.log('--- Generating multi-resolution favicon.ico ---');
  const icoBuf = await pngToIco(pngBuffersForIco);
  fs.writeFileSync(path.join(ROOT, 'public', 'favicon.ico'), icoBuf);
  fs.writeFileSync(path.join(FAVICONS_DIR, 'favicon.ico'), icoBuf);
  console.log('✓ Wrote favicon.ico to site root and /favicons/');

  // Generate OG Share Images in /images/splash/
  console.log('--- Generating OpenGraph & Splash Images ---');
  const ogBuf = Buffer.from(ogSvg);

  const ogPngPath = path.join(SPLASH_DIR, 'og-image.png');
  await sharp(ogBuf).resize(1200, 630).png({ quality: 95 }).toFile(ogPngPath);

  const ogWebpPath = path.join(SPLASH_DIR, 'og-image.webp');
  await sharp(ogBuf).resize(1200, 630).webp({ quality: 92 }).toFile(ogWebpPath);

  // Also create twitter-image aliases
  fs.copyFileSync(ogPngPath, path.join(SPLASH_DIR, 'twitter-image.png'));
  fs.copyFileSync(ogWebpPath, path.join(SPLASH_DIR, 'twitter-image.webp'));

  // Create splash icons for mobile
  await sharp(Buffer.from(standardSvg)).resize(512, 512).png().toFile(path.join(SPLASH_DIR, 'splash-512.png'));
  await sharp(Buffer.from(standardSvg)).resize(512, 512).webp().toFile(path.join(SPLASH_DIR, 'splash-512.webp'));

  console.log('✓ Generated OpenGraph and Splash images in /images/splash/');

  // Write Web Manifest
  const manifest = getWebManifest();
  fs.writeFileSync(path.join(FAVICONS_DIR, 'site.webmanifest'), manifest, 'utf8');
  fs.writeFileSync(path.join(ROOT, 'public', 'site.webmanifest'), manifest, 'utf8');
  console.log('✓ Generated site.webmanifest');

  // Clean test files
  const testFiles = ['test-16.png', 'test-32.png', 'test-48.png', 'test-180.png', 'test-16-v2.png', 'test-32-v2.png'];
  for (const f of testFiles) {
    const p = path.join(FAVICONS_DIR, f);
    if (fs.existsSync(p)) fs.unlinkSync(p);
  }

  console.log('=== All brand assets generated successfully! ===');
}

build().catch(err => {
  console.error('Asset generation failed:', err);
  process.exit(1);
});
