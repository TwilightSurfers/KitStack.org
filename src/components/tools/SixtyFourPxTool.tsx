import React, { useState, useMemo, useRef } from 'react';
import {
  Smartphone,
  Tablet,
  Monitor,
  RotateCw,
  LayoutGrid,
  Columns,
  Layers,
  Copy,
  Check,
  Download,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Sparkles,
  Sliders,
  Palette,
  Code,
  RefreshCw,
  Box,
  Settings2,
  Info
} from 'lucide-react';
import { SharedToolbar } from '../shared/SharedToolbar';
import { BubbleHint } from '../shared/BubbleHint';
import { useNotifications } from '../../context/NotificationContext';

export interface SixtyFourPxToolProps {
  accentColor: string;
}

// Color palettes for the 5 rows (3 columns each)
interface RowColorTheme {
  name: string;
  rows: [
    [string, string, string],
    [string, string, string],
    [string, string, string],
    [string, string, string],
    [string, string, string]
  ];
}

const PALETTES: RowColorTheme[] = [
  {
    name: 'Electric Prism (Default)',
    rows: [
      ['#6366F1', '#4F46E5', '#3730A3'], // Row 1: Indigo
      ['#06B6D4', '#0891B2', '#0E7490'], // Row 2: Cyan
      ['#10B981', '#059669', '#047857'], // Row 3: Emerald
      ['#F59E0B', '#D97706', '#B45309'], // Row 4: Amber
      ['#F43F5E', '#E11D48', '#BE123C'], // Row 5: Rose
    ],
  },
  {
    name: 'Neon Cyberpunk',
    rows: [
      ['#A855F7', '#9333EA', '#7E22CE'], // Row 1: Purple
      ['#3B82F6', '#2563EB', '#1D4ED8'], // Row 2: Blue
      ['#14B8A6', '#0D9488', '#0F766E'], // Row 3: Teal
      ['#EAB308', '#CA8A04', '#A16207'], // Row 4: Yellow
      ['#EC4899', '#DB2777', '#BE185D'], // Row 5: Pink
    ],
  },
  {
    name: 'Sunset Horizon',
    rows: [
      ['#8B5CF6', '#7C3AED', '#6D28D9'], // Row 1: Violet
      ['#EC4899', '#DB2777', '#BE185D'], // Row 2: Fuchsia
      ['#F97316', '#EA580C', '#C2410C'], // Row 3: Orange
      ['#F59E0B', '#D97706', '#B45309'], // Row 4: Amber
      ['#EF4444', '#DC2626', '#B91C1C'], // Row 5: Crimson
    ],
  },
  {
    name: 'Oceanic Depths',
    rows: [
      ['#38BDF8', '#0284C7', '#0369A1'], // Row 1: Sky
      ['#2DD4BF', '#0D9488', '#115E59'], // Row 2: Teal
      ['#34D399', '#059669', '#065F46'], // Row 3: Mint
      ['#818CF8', '#4F46E5', '#3730A3'], // Row 4: Indigo
      ['#64748B', '#475569', '#334155'], // Row 5: Slate
    ],
  },
  {
    name: 'Minimal Slate & Smoke',
    rows: [
      ['#94A3B8', '#64748B', '#475569'], // Row 1
      ['#71717A', '#52525B', '#3F3F46'], // Row 2
      ['#78716C', '#57534E', '#44403C'], // Row 3
      ['#6B7280', '#4B5563', '#374151'], // Row 4
      ['#475569', '#334155', '#1E293B'], // Row 5
    ],
  },
];

type DevicePreset = 'mobile-s' | 'mobile' | 'tablet' | 'laptop' | 'desktop' | 'custom';
type LayoutMode = 'grid' | 'flex';
type AspectRatioMode = '1/1' | '4/3' | '16/9' | 'auto';
type BaseSpacingPreset = 8 | 16 | 32 | 64;

interface BlockOverride {
  colSpan?: 1 | 2 | 3;
  hidden?: boolean;
}

export const SixtyFourPxTool: React.FC<SixtyFourPxToolProps> = ({ accentColor }) => {
  const { addNotification } = useNotifications();

  // 1. Viewport Simulation State
  const [devicePreset, setDevicePreset] = useState<DevicePreset>('tablet');
  const [viewportWidth, setViewportWidth] = useState<number>(768);
  const [isLandscape, setIsLandscape] = useState<boolean>(false);
  const [showDeviceFrame, setShowDeviceFrame] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'preview' | 'css' | 'tailwind' | 'html'>('preview');

  // 2. Base 8/16/32/64px Spacing System
  const [containerPadding, setContainerPadding] = useState<number>(32);
  const [rowGap, setRowGap] = useState<number>(16);
  const [colGap, setColGap] = useState<number>(16);
  const [blockPadding, setBlockPadding] = useState<number>(16);

  // 3. Layout Engine & CSS Properties
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('grid');
  const [gridColumnsDesktop, setGridColumnsDesktop] = useState<number>(3);
  const [gridColumnsMobile, setGridColumnsMobile] = useState<number>(1);
  const [collapseBreakpoint, setCollapseBreakpoint] = useState<number>(640);
  const [flexDirection, setFlexDirection] = useState<'row' | 'column'>('row');
  const [flexWrap, setFlexWrap] = useState<'wrap' | 'nowrap'>('wrap');
  const [justifyContent, setJustifyContent] = useState<string>('stretch');
  const [alignItems, setAlignItems] = useState<string>('stretch');
  const [borderRadius, setBorderRadius] = useState<number>(16);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioMode>('1/1');
  const [shadowElevation, setShadowElevation] = useState<'none' | '8px' | '16px' | '32px'>('16px');
  const [selectedPaletteIndex, setSelectedPaletteIndex] = useState<number>(0);

  // 4. Per-Row Collapse & Visibility (Rows 1 to 5)
  const [collapsedRows, setCollapsedRows] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
  });

  // 5. Per-Block Custom Overrides (key: "r-c")
  const [blockOverrides, setBlockOverrides] = useState<Record<string, BlockOverride>>({});
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // 6. UI Helpers
  const [copied, setCopied] = useState<boolean>(false);

  // Device Width presets
  const applyDevice = (preset: DevicePreset) => {
    setDevicePreset(preset);
    switch (preset) {
      case 'mobile-s':
        setViewportWidth(isLandscape ? 640 : 360);
        break;
      case 'mobile':
        setViewportWidth(isLandscape ? 844 : 390);
        break;
      case 'tablet':
        setViewportWidth(isLandscape ? 1024 : 768);
        break;
      case 'laptop':
        setViewportWidth(1024);
        break;
      case 'desktop':
        setViewportWidth(1280);
        break;
      default:
        break;
    }
  };

  const toggleOrientation = () => {
    setIsLandscape((prev) => {
      const next = !prev;
      if (devicePreset === 'mobile-s') {
        setViewportWidth(next ? 640 : 360);
      } else if (devicePreset === 'mobile') {
        setViewportWidth(next ? 844 : 390);
      } else if (devicePreset === 'tablet') {
        setViewportWidth(next ? 1024 : 768);
      }
      return next;
    });
  };

  // Rhythm quick-apply
  const applyRhythmScale = (px: BaseSpacingPreset) => {
    setContainerPadding(px);
    setRowGap(Math.max(8, Math.round(px / 2)));
    setColGap(Math.max(8, Math.round(px / 2)));
    setBlockPadding(Math.max(8, Math.round(px / 2)));
    addNotification({
      title: `${px}px Base Rhythm Applied`,
      message: `Container padding: ${px}px · Gap & Block padding: ${Math.max(8, Math.round(px / 2))}px`,
      type: 'info',
      toolSource: '64 px Tool',
    });
  };

  // Reset entire tool to defaults
  const handleReset = () => {
    setDevicePreset('tablet');
    setViewportWidth(768);
    setIsLandscape(false);
    setShowDeviceFrame(true);
    setContainerPadding(32);
    setRowGap(16);
    setColGap(16);
    setBlockPadding(16);
    setLayoutMode('grid');
    setGridColumnsDesktop(3);
    setGridColumnsMobile(1);
    setCollapseBreakpoint(640);
    setFlexDirection('row');
    setFlexWrap('wrap');
    setJustifyContent('stretch');
    setAlignItems('stretch');
    setBorderRadius(16);
    setAspectRatio('1/1');
    setShadowElevation('16px');
    setSelectedPaletteIndex(0);
    setCollapsedRows({ 1: false, 2: false, 3: false, 4: false, 5: false });
    setBlockOverrides({});
    setSelectedBlockId(null);
    addNotification({
      title: 'Tool Reset',
      message: 'Restored 64 px simulator to standard 5×3 configuration',
      type: 'info',
      toolSource: '64 px Tool',
    });
  };

  // Toggle single row collapse
  const toggleRowCollapse = (rowNum: number) => {
    setCollapsedRows((prev) => ({
      ...prev,
      [rowNum]: !prev[rowNum],
    }));
  };

  // Current Palette
  const currentPalette = PALETTES[selectedPaletteIndex] || PALETTES[0];

  // Effective columns based on viewport simulation
  const isSimulatedMobile = viewportWidth < collapseBreakpoint;
  const effectiveGridCols = isSimulatedMobile ? gridColumnsMobile : gridColumnsDesktop;

  // Shadow styling lookup
  const shadowStyle = useMemo(() => {
    switch (shadowElevation) {
      case 'none':
        return 'none';
      case '8px':
        return '0 4px 8px -2px rgba(0, 0, 0, 0.25), 0 2px 4px -2px rgba(0, 0, 0, 0.15)';
      case '16px':
        return '0 10px 16px -3px rgba(0, 0, 0, 0.35), 0 4px 6px -4px rgba(0, 0, 0, 0.2)';
      case '32px':
        return '0 20px 32px -5px rgba(0, 0, 0, 0.45), 0 8px 12px -6px rgba(0, 0, 0, 0.25)';
      default:
        return 'none';
    }
  }, [shadowElevation]);

  // Selected Block Override Handler
  const updateSelectedBlock = (partial: Partial<BlockOverride>) => {
    if (!selectedBlockId) return;
    setBlockOverrides((prev) => ({
      ...prev,
      [selectedBlockId]: {
        ...(prev[selectedBlockId] || {}),
        ...partial,
      },
    }));
  };

  // Generate CSS Code Output
  const generatedCss = useMemo(() => {
    return `/* 64 px Layout Engine - Generated CSS */
:root {
  --space-8: 8px;
  --space-16: 16px;
  --space-32: 32px;
  --space-64: 64px;
}

/* Simulated Page Container */
.page-container {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: ${containerPadding}px;
  box-sizing: border-box;
}

/* 5-Row Section Layout */
.rows-wrapper {
  display: flex;
  flex-direction: column;
  gap: ${rowGap}px;
  width: 100%;
}

/* Individual Row (3 Columns default) */
.row-container {
  width: 100%;
  display: ${layoutMode};
  ${
    layoutMode === 'grid'
      ? `grid-template-columns: repeat(${gridColumnsDesktop}, minmax(0, 1fr));
  gap: ${colGap}px;`
      : `flex-direction: ${flexDirection};
  flex-wrap: ${flexWrap};
  gap: ${colGap}px;
  justify-content: ${justifyContent};
  align-items: ${alignItems};`
  }
}

/* Row Collapsed state */
.row-container.is-collapsed {
  display: none;
}

/* Modular Square Card (15 items) */
.grid-square {
  padding: ${blockPadding}px;
  border-radius: ${borderRadius}px;
  aspect-ratio: ${aspectRatio};
  box-shadow: ${shadowStyle};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.2s ease;
  box-sizing: border-box;
  color: #ffffff;
}

/* Responsive Mobile Collapse Rule */
@media (max-width: ${collapseBreakpoint}px) {
  .page-container {
    padding: ${Math.min(containerPadding, 16)}px;
  }
  
  .row-container {
    ${
      layoutMode === 'grid'
        ? `grid-template-columns: repeat(${gridColumnsMobile}, minmax(0, 1fr));
    gap: ${Math.min(colGap, 16)}px;`
        : `flex-direction: column;
    gap: ${Math.min(colGap, 16)}px;`
    }
  }

  .rows-wrapper {
    gap: ${Math.min(rowGap, 16)}px;
  }
}
`;
  }, [
    containerPadding,
    rowGap,
    colGap,
    blockPadding,
    layoutMode,
    gridColumnsDesktop,
    gridColumnsMobile,
    collapseBreakpoint,
    flexDirection,
    flexWrap,
    justifyContent,
    alignItems,
    borderRadius,
    aspectRatio,
    shadowStyle,
  ]);

  // Generate Tailwind snippet
  const generatedTailwind = useMemo(() => {
    const pClass =
      containerPadding === 8
        ? 'p-2'
        : containerPadding === 16
        ? 'p-4'
        : containerPadding === 32
        ? 'p-8'
        : containerPadding === 64
        ? 'p-16'
        : `p-[${containerPadding}px]`;

    const rowGapClass =
      rowGap === 8
        ? 'gap-2'
        : rowGap === 16
        ? 'gap-4'
        : rowGap === 32
        ? 'gap-8'
        : rowGap === 64
        ? 'gap-16'
        : `gap-[${rowGap}px]`;

    const colGapClass =
      colGap === 8
        ? 'gap-2'
        : colGap === 16
        ? 'gap-4'
        : colGap === 32
        ? 'gap-8'
        : colGap === 64
        ? 'gap-16'
        : `gap-[${colGap}px]`;

    return `<!-- 64 px Layout Engine - Tailwind HTML -->
<div class="w-full max-w-7xl mx-auto ${pClass} transition-all">
  <div class="flex flex-col ${rowGapClass}">
    <!-- 5 Rows (3 Columns each) -->
    ${[1, 2, 3, 4, 5]
      .map(
        (r) => `<!-- Row ${r} -->
    <div class="grid grid-cols-${gridColumnsMobile} sm:grid-cols-${gridColumnsDesktop} ${colGapClass} w-full">
      <div class="p-4 rounded-2xl aspect-square flex flex-col justify-between shadow-lg">R${r} · C1</div>
      <div class="p-4 rounded-2xl aspect-square flex flex-col justify-between shadow-lg">R${r} · C2</div>
      <div class="p-4 rounded-2xl aspect-square flex flex-col justify-between shadow-lg">R${r} · C3</div>
    </div>`
      )
      .join('\n    ')}
  </div>
</div>`;
  }, [containerPadding, rowGap, colGap, gridColumnsDesktop, gridColumnsMobile]);

  // Generate HTML snippet
  const generatedHtml = useMemo(() => {
    return `<div class="page-container">
  <div class="rows-wrapper">
    <!-- Row 1 -->
    <div class="row-container">
      <div class="grid-square" style="background-color: ${currentPalette.rows[0][0]}"><span>R1 · C1</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[0][1]}"><span>R1 · C2</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[0][2]}"><span>R1 · C3</span></div>
    </div>
    <!-- Row 2 -->
    <div class="row-container">
      <div class="grid-square" style="background-color: ${currentPalette.rows[1][0]}"><span>R2 · C1</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[1][1]}"><span>R2 · C2</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[1][2]}"><span>R2 · C3</span></div>
    </div>
    <!-- Row 3 -->
    <div class="row-container">
      <div class="grid-square" style="background-color: ${currentPalette.rows[2][0]}"><span>R3 · C1</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[2][1]}"><span>R3 · C2</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[2][2]}"><span>R3 · C3</span></div>
    </div>
    <!-- Row 4 -->
    <div class="row-container">
      <div class="grid-square" style="background-color: ${currentPalette.rows[3][0]}"><span>R4 · C1</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[3][1]}"><span>R4 · C2</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[3][2]}"><span>R4 · C3</span></div>
    </div>
    <!-- Row 5 -->
    <div class="row-container">
      <div class="grid-square" style="background-color: ${currentPalette.rows[4][0]}"><span>R5 · C1</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[4][1]}"><span>R5 · C2</span></div>
      <div class="grid-square" style="background-color: ${currentPalette.rows[4][2]}"><span>R5 · C3</span></div>
    </div>
  </div>
</div>`;
  }, [currentPalette]);

  // Copy code handler
  const handleCopyCode = () => {
    let content = generatedCss;
    if (activeTab === 'tailwind') content = generatedTailwind;
    if (activeTab === 'html') content = generatedHtml;

    navigator.clipboard.writeText(content);
    setCopied(true);
    addNotification({
      title: 'Code Copied',
      message: `Copied ${activeTab.toUpperCase()} snippet to clipboard`,
      type: 'success',
      toolSource: '64 px Tool',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  // Download CSS handler
  const handleDownload = () => {
    const blob = new Blob([generatedCss], { type: 'text/css' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '64px-layout.css';
    a.click();
    URL.revokeObjectURL(url);
    addNotification({
      title: 'CSS Exported',
      message: 'Downloaded 64px-layout.css file',
      type: 'success',
      toolSource: '64 px Tool',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Standard Toolbar */}
      <SharedToolbar
        title="64 px - Responsive Grid & Viewport Simulator"
        badge="8 / 16 / 32 / 64px Spacing Engine"
        accentColor={accentColor}
        onCopy={handleCopyCode}
        copied={copied}
        onExport={handleDownload}
        exportLabel="Export CSS"
        onReset={handleReset}
        customActions={
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 text-accent" />
              <span>Canvas</span>
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'css'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-accent" />
              <span>CSS</span>
            </button>
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                activeTab === 'tailwind'
                  ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <span>Tailwind</span>
            </button>
          </div>
        }
      />

      {/* Primary Layout: Left Configuration Controls (5 cols) & Right Viewport Canvas (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ============================================================ */}
        {/* LEFT COLUMN: CONTROLS & SPACING SYSTEM                       */}
        {/* ============================================================ */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card 1: 8/16/32/64px Master Spacing Rhythm */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-accent flex items-center justify-center text-xs font-black">
                  64
                </div>
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                  Base Spacing Scale (8 · 16 · 32 · 64px)
                </h3>
              </div>
              <BubbleHint content="Quick apply rhythm preset to all padding and gap metrics" placement="top">
                <Info className="w-3.5 h-3.5 text-neutral-400" />
              </BubbleHint>
            </div>

            {/* Quick Master Rhythm Selector */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                Apply Universal Base Rhythm
              </label>
              <div className="grid grid-cols-4 gap-2">
                {([8, 16, 32, 64] as BaseSpacingPreset[]).map((px) => (
                  <button
                    key={px}
                    type="button"
                    onClick={() => applyRhythmScale(px)}
                    className={`py-2 px-1 text-center rounded-lg border font-mono text-xs font-bold transition-all ${
                      containerPadding === px
                        ? 'border-accent bg-accent text-white shadow-xs'
                        : 'border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {px}px
                  </button>
                ))}
              </div>
            </div>

            {/* Granular 8/16/32/64px Controls */}
            <div className="space-y-3 pt-2">
              {/* Container Outer Padding */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Container Padding (Outer)
                  </span>
                  <span className="font-mono text-xs font-bold text-accent">{containerPadding}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {([8, 16, 32, 64] as BaseSpacingPreset[]).map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setContainerPadding(px)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded font-medium border ${
                          containerPadding === px
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="96"
                    step="8"
                    value={containerPadding}
                    onChange={(e) => setContainerPadding(parseInt(e.target.value, 10))}
                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                </div>
              </div>

              {/* Row Gap */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">Row Gap (Vertical)</span>
                  <span className="font-mono text-xs font-bold text-accent">{rowGap}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {([8, 16, 32, 64] as BaseSpacingPreset[]).map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setRowGap(px)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded font-medium border ${
                          rowGap === px
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="8"
                    value={rowGap}
                    onChange={(e) => setRowGap(parseInt(e.target.value, 10))}
                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                </div>
              </div>

              {/* Column Gap */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Column Gap (Horizontal)
                  </span>
                  <span className="font-mono text-xs font-bold text-accent">{colGap}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {([8, 16, 32, 64] as BaseSpacingPreset[]).map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setColGap(px)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded font-medium border ${
                          colGap === px
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="64"
                    step="8"
                    value={colGap}
                    onChange={(e) => setColGap(parseInt(e.target.value, 10))}
                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                </div>
              </div>

              {/* Square / Block Inner Padding */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                    Square Padding (Internal)
                  </span>
                  <span className="font-mono text-xs font-bold text-accent">{blockPadding}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {([8, 16, 32, 64] as BaseSpacingPreset[]).map((px) => (
                      <button
                        key={px}
                        type="button"
                        onClick={() => setBlockPadding(px)}
                        className={`px-2 py-0.5 text-[11px] font-mono rounded font-medium border ${
                          blockPadding === px
                            ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        {px}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="64"
                    step="4"
                    value={blockPadding}
                    onChange={(e) => setBlockPadding(parseInt(e.target.value, 10))}
                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Layout Engine & Mobile Collapse Rules */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <Sliders className="w-4 h-4 text-accent" />
              <span>Layout & Responsive Collapse</span>
            </h3>

            {/* CSS Grid vs Flexbox */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setLayoutMode('grid')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  layoutMode === 'grid'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span>CSS Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setLayoutMode('flex')}
                className={`py-2 px-3 rounded-lg border text-xs font-bold flex items-center justify-center gap-2 transition-colors ${
                  layoutMode === 'flex'
                    ? 'bg-accent text-white border-accent'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Columns className="w-4 h-4" />
                <span>Flexbox</span>
              </button>
            </div>

            {/* Grid-specific or Flex-specific controls */}
            {layoutMode === 'grid' ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Desktop Columns
                    </label>
                    <select
                      value={gridColumnsDesktop}
                      onChange={(e) => setGridColumnsDesktop(parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value={1}>1 Column</option>
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns (Standard)</option>
                      <option value={4}>4 Columns</option>
                      <option value={5}>5 Columns</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Mobile Collapsed Cols
                    </label>
                    <select
                      value={gridColumnsMobile}
                      onChange={(e) => setGridColumnsMobile(parseInt(e.target.value, 10))}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value={1}>1 Column (Stack)</option>
                      <option value={2}>2 Columns</option>
                      <option value={3}>3 Columns (No collapse)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      Auto-Collapse Trigger Breakpoint
                    </span>
                    <span className="font-mono text-xs font-bold text-accent">{collapseBreakpoint}px</span>
                  </div>
                  <input
                    type="range"
                    min="360"
                    max="900"
                    step="20"
                    value={collapseBreakpoint}
                    onChange={(e) => setCollapseBreakpoint(parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono mt-0.5">
                    <span>sm (640px)</span>
                    <span>md (768px)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Flex Direction
                    </label>
                    <select
                      value={flexDirection}
                      onChange={(e) => setFlexDirection(e.target.value as 'row' | 'column')}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="row">row (horizontal)</option>
                      <option value="column">column (stacked)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Flex Wrap
                    </label>
                    <select
                      value={flexWrap}
                      onChange={(e) => setFlexWrap(e.target.value as 'wrap' | 'nowrap')}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="wrap">wrap (responsive)</option>
                      <option value="nowrap">nowrap (overflow)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Justify Content
                    </label>
                    <select
                      value={justifyContent}
                      onChange={(e) => setJustifyContent(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="stretch">stretch</option>
                      <option value="flex-start">flex-start</option>
                      <option value="center">center</option>
                      <option value="space-between">space-between</option>
                      <option value="space-evenly">space-evenly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                      Align Items
                    </label>
                    <select
                      value={alignItems}
                      onChange={(e) => setAlignItems(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    >
                      <option value="stretch">stretch</option>
                      <option value="center">center</option>
                      <option value="flex-start">flex-start</option>
                      <option value="flex-end">flex-end</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Row Collapse Manager (Accordion / Visibility) */}
            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
                Collapsible Rows (5 Rows)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[1, 2, 3, 4, 5].map((rowNum) => {
                  const isCollapsed = collapsedRows[rowNum];
                  return (
                    <button
                      key={rowNum}
                      type="button"
                      onClick={() => toggleRowCollapse(rowNum)}
                      className={`py-1.5 px-1 rounded-md text-[11px] font-semibold flex flex-col items-center gap-0.5 transition-colors border ${
                        isCollapsed
                          ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 dark:text-rose-400'
                          : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      <span>Row {rowNum}</span>
                      <span className="text-[9px] uppercase font-mono">
                        {isCollapsed ? 'Closed' : 'Open'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 3: Visual Appearance & Geometry */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <Palette className="w-4 h-4 text-accent" />
              <span>Appearance & Geometry</span>
            </h3>

            {/* Color Scheme */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1.5">
                5-Row Color Harmony Preset
              </label>
              <div className="grid grid-cols-1 gap-1.5">
                {PALETTES.map((palette, idx) => (
                  <button
                    key={palette.name}
                    type="button"
                    onClick={() => setSelectedPaletteIndex(idx)}
                    className={`flex items-center justify-between p-2 rounded-lg border text-xs font-medium transition-all ${
                      selectedPaletteIndex === idx
                        ? 'border-accent bg-accent-subtle text-neutral-900 dark:text-neutral-100 font-bold'
                        : 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    <span>{palette.name}</span>
                    <div className="flex gap-1">
                      {palette.rows.map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="w-3.5 h-3.5 rounded-full shadow-xs border border-white/20"
                          style={{ backgroundColor: row[1] }}
                        />
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio & Corner Radius */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  Aspect Ratio
                </label>
                <div className="grid grid-cols-2 gap-1">
                  {(['1/1', '4/3', '16/9', 'auto'] as AspectRatioMode[]).map((ar) => (
                    <button
                      key={ar}
                      type="button"
                      onClick={() => setAspectRatio(ar)}
                      className={`py-1 text-[11px] font-mono rounded border ${
                        aspectRatio === ar
                          ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent font-bold'
                          : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  <span>Border Radius</span>
                  <span className="font-mono text-accent">{borderRadius}px</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setBorderRadius(0)}
                    className={`px-1.5 py-1 text-[10px] rounded border ${
                      borderRadius === 0 ? 'bg-accent text-white border-accent' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setBorderRadius(8)}
                    className={`px-1.5 py-1 text-[10px] rounded border ${
                      borderRadius === 8 ? 'bg-accent text-white border-accent' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                  >
                    8px
                  </button>
                  <button
                    type="button"
                    onClick={() => setBorderRadius(16)}
                    className={`px-1.5 py-1 text-[10px] rounded border ${
                      borderRadius === 16 ? 'bg-accent text-white border-accent' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                  >
                    16px
                  </button>
                  <button
                    type="button"
                    onClick={() => setBorderRadius(32)}
                    className={`px-1.5 py-1 text-[10px] rounded border ${
                      borderRadius === 32 ? 'bg-accent text-white border-accent' : 'bg-neutral-100 dark:bg-neutral-800'
                    }`}
                  >
                    32px
                  </button>
                </div>
              </div>
            </div>

            {/* Shadow Elevation */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                Shadow Depth (Elevation)
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['none', '8px', '16px', '32px'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setShadowElevation(lvl)}
                    className={`py-1 text-[11px] font-mono rounded border capitalize ${
                      shadowElevation === lvl
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 border-transparent font-bold'
                        : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Card 4: Selected Square Inspector */}
          {selectedBlockId && (
            <div className="p-4 rounded-xl border border-accent/40 bg-accent-subtle/30 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-700 pb-2">
                <div className="flex items-center gap-2">
                  <Box className="w-4 h-4 text-accent" />
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    Custom Inspector: {selectedBlockId.toUpperCase()}
                  </h4>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedBlockId(null)}
                  className="text-[10px] font-mono text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                    Column Span
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {([1, 2, 3] as const).map((span) => (
                      <button
                        key={span}
                        type="button"
                        onClick={() => updateSelectedBlock({ colSpan: span })}
                        className={`py-1 text-xs font-mono rounded border ${
                          (blockOverrides[selectedBlockId]?.colSpan || 1) === span
                            ? 'bg-accent text-white border-accent font-bold'
                            : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-700'
                        }`}
                      >
                        {span}x
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-300 mb-1">
                    Visibility
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      updateSelectedBlock({
                        hidden: !blockOverrides[selectedBlockId]?.hidden,
                      })
                    }
                    className={`w-full py-1.5 px-2 text-xs rounded border flex items-center justify-center gap-1.5 ${
                      blockOverrides[selectedBlockId]?.hidden
                        ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-400/40'
                        : 'bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border-neutral-300 dark:border-neutral-700'
                    }`}
                  >
                    {blockOverrides[selectedBlockId]?.hidden ? (
                      <>
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hidden</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-3.5 h-3.5" />
                        <span>Visible</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ============================================================ */}
        {/* RIGHT COLUMN: INTERACTIVE VIEWPORT SIMULATOR & CODE VIEWER  */}
        {/* ============================================================ */}
        <div className="lg:col-span-7 space-y-4">
          {activeTab === 'preview' ? (
            <div className="space-y-4">
              {/* Simulator Header Toolbar: Presets & Controls */}
              <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-wrap items-center justify-between gap-3">
                {/* Device Selector Buttons */}
                <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg border border-neutral-200 dark:border-neutral-700">
                  <BubbleHint content="Mobile Small (360px)" placement="top">
                    <button
                      type="button"
                      onClick={() => applyDevice('mobile-s')}
                      className={`p-1.5 rounded-md transition-colors ${
                        devicePreset === 'mobile-s'
                          ? 'bg-white dark:bg-neutral-900 text-accent shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </BubbleHint>

                  <BubbleHint content="Mobile Phone (390px)" placement="top">
                    <button
                      type="button"
                      onClick={() => applyDevice('mobile')}
                      className={`p-1.5 rounded-md transition-colors ${
                        devicePreset === 'mobile'
                          ? 'bg-white dark:bg-neutral-900 text-accent shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      <Smartphone className="w-4 h-4" />
                    </button>
                  </BubbleHint>

                  <BubbleHint content="Tablet (768px)" placement="top">
                    <button
                      type="button"
                      onClick={() => applyDevice('tablet')}
                      className={`p-1.5 rounded-md transition-colors ${
                        devicePreset === 'tablet'
                          ? 'bg-white dark:bg-neutral-900 text-accent shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      <Tablet className="w-4 h-4" />
                    </button>
                  </BubbleHint>

                  <BubbleHint content="Laptop (1024px)" placement="top">
                    <button
                      type="button"
                      onClick={() => applyDevice('laptop')}
                      className={`p-1.5 rounded-md transition-colors ${
                        devicePreset === 'laptop'
                          ? 'bg-white dark:bg-neutral-900 text-accent shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      <Monitor className="w-4 h-4" />
                    </button>
                  </BubbleHint>

                  <BubbleHint content="Fluid 100% Desktop (1280px)" placement="top">
                    <button
                      type="button"
                      onClick={() => applyDevice('desktop')}
                      className={`p-1.5 rounded-md transition-colors ${
                        devicePreset === 'desktop'
                          ? 'bg-white dark:bg-neutral-900 text-accent shadow-xs'
                          : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100'
                      }`}
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </BubbleHint>
                </div>

                {/* Viewport Width Slider & Readout */}
                <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-xs">
                  <span className="text-[10px] font-mono text-neutral-400">320px</span>
                  <input
                    type="range"
                    min="320"
                    max="1280"
                    step="10"
                    value={viewportWidth}
                    onChange={(e) => {
                      setViewportWidth(parseInt(e.target.value, 10));
                      setDevicePreset('custom');
                    }}
                    className="flex-1 h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                  <span className="text-[10px] font-mono text-neutral-400">1280px</span>
                </div>

                {/* Status Indicator & Frame Toggles */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleOrientation}
                    className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                      isLandscape
                        ? 'bg-accent text-white border-accent'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                    title="Rotate Device Orientation"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span className="text-[10px] hidden sm:inline">
                      {isLandscape ? 'Landscape' : 'Portrait'}
                    </span>
                  </button>

                  <div className="px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <span>{viewportWidth}px</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-sans font-semibold uppercase ${
                        isSimulatedMobile
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      }`}
                    >
                      {isSimulatedMobile ? 'Mobile' : 'Desktop'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Viewport Simulation Outer Stage */}
              <div className="w-full bg-neutral-200/60 dark:bg-neutral-950/80 rounded-2xl p-4 sm:p-6 border border-neutral-300 dark:border-neutral-800/80 overflow-x-auto flex justify-center items-start min-h-[640px]">
                {/* Simulated Device Frame Container */}
                <div
                  style={{ width: `${viewportWidth}px` }}
                  className={`transition-all duration-200 flex flex-col ${
                    showDeviceFrame
                      ? 'bg-white dark:bg-neutral-900 rounded-3xl border-4 border-neutral-800 dark:border-neutral-700 shadow-2xl overflow-hidden'
                      : 'bg-white dark:bg-neutral-900 rounded-xl border border-neutral-300 dark:border-neutral-800 shadow-lg'
                  }`}
                >
                  {/* Simulated Device Top Bar / Notch */}
                  {showDeviceFrame && (
                    <div className="bg-neutral-900 text-neutral-400 px-4 py-2 flex items-center justify-between text-[11px] font-mono border-b border-neutral-800 select-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span className="text-[10px] font-semibold text-neutral-300">9:41 AM</span>
                      </div>
                      <div className="px-3 py-0.5 rounded-full bg-neutral-800 text-[10px] text-neutral-400 font-sans font-medium">
                        64 px Simulator Viewport · {viewportWidth}px
                      </div>
                      <div className="flex items-center gap-1 text-[10px]">
                        <span>100%</span>
                      </div>
                    </div>
                  )}

                  {/* Simulated Page Container (The Core Layout Canvas) */}
                  <div
                    style={{ padding: `${containerPadding}px` }}
                    className="w-full transition-all duration-150 box-border bg-neutral-50 dark:bg-neutral-900/60"
                  >
                    {/* Header banner inside container */}
                    <div className="mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-wider">
                          5 Rows · 15 Color-Coordinated Modules
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Padding: {containerPadding}px · Gap: {colGap}px/{rowGap}px
                      </span>
                    </div>

                    {/* 5 Rows Wrapper */}
                    <div
                      style={{ gap: `${rowGap}px` }}
                      className="flex flex-col w-full transition-all duration-150"
                    >
                      {[1, 2, 3, 4, 5].map((rowNum) => {
                        const isRowCollapsed = collapsedRows[rowNum];
                        const rowColors = currentPalette.rows[rowNum - 1];

                        if (isRowCollapsed) {
                          return (
                            <div
                              key={rowNum}
                              onClick={() => toggleRowCollapse(rowNum)}
                              className="p-3 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-100/50 dark:bg-neutral-800/40 text-neutral-500 flex items-center justify-between cursor-pointer hover:bg-neutral-200/50 dark:hover:bg-neutral-800/80 transition-colors"
                            >
                              <div className="flex items-center gap-2 text-xs font-semibold">
                                <ChevronDown className="w-4 h-4 text-neutral-400" />
                                <span>Row {rowNum} (Collapsed)</span>
                              </div>
                              <span className="text-[10px] font-mono">Click to expand</span>
                            </div>
                          );
                        }

                        return (
                          <div key={rowNum} className="space-y-1">
                            {/* Row Label Header with Collapse Trigger */}
                            <div className="flex items-center justify-between px-1 text-[10px] text-neutral-400 font-mono">
                              <div className="flex items-center gap-1.5">
                                <span
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: rowColors[1] }}
                                />
                                <span className="font-bold text-neutral-600 dark:text-neutral-300">
                                  ROW {rowNum}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => toggleRowCollapse(rowNum)}
                                className="hover:text-accent flex items-center gap-0.5 text-[10px]"
                                title="Collapse Row"
                              >
                                <ChevronUp className="w-3 h-3" />
                                <span>Collapse</span>
                              </button>
                            </div>

                            {/* Row Container with 3 Columns */}
                            <div
                              style={
                                layoutMode === 'grid'
                                  ? {
                                      display: 'grid',
                                      gridTemplateColumns: `repeat(${effectiveGridCols}, minmax(0, 1fr))`,
                                      gap: `${colGap}px`,
                                    }
                                  : {
                                      display: 'flex',
                                      flexDirection,
                                      flexWrap,
                                      gap: `${colGap}px`,
                                      justifyContent,
                                      alignItems,
                                    }
                              }
                              className="w-full transition-all duration-200"
                            >
                              {[1, 2, 3].map((colNum) => {
                                const blockId = `r${rowNum}-c${colNum}`;
                                const globalIndex = (rowNum - 1) * 3 + colNum;
                                const color = rowColors[colNum - 1];
                                const override = blockOverrides[blockId] || {};

                                if (override.hidden) {
                                  return (
                                    <div
                                      key={colNum}
                                      onClick={() => setSelectedBlockId(blockId)}
                                      className="border border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-2 text-center text-[10px] text-neutral-400 cursor-pointer flex items-center justify-center gap-1"
                                    >
                                      <EyeOff className="w-3 h-3" />
                                      <span>Hidden #{globalIndex}</span>
                                    </div>
                                  );
                                }

                                const isSelected = selectedBlockId === blockId;
                                const colSpanClass =
                                  layoutMode === 'grid' && override.colSpan && override.colSpan > 1
                                    ? override.colSpan === 3
                                      ? 'col-span-full'
                                      : 'col-span-2'
                                    : '';

                                return (
                                  <div
                                    key={colNum}
                                    onClick={() => setSelectedBlockId(blockId)}
                                    style={{
                                      backgroundColor: color,
                                      padding: `${blockPadding}px`,
                                      borderRadius: `${borderRadius}px`,
                                      aspectRatio: aspectRatio === 'auto' ? undefined : aspectRatio,
                                      boxShadow: shadowStyle,
                                    }}
                                    className={`group relative text-white select-none transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between overflow-hidden ${colSpanClass} ${
                                      isSelected
                                        ? 'ring-4 ring-offset-2 ring-accent dark:ring-offset-neutral-900'
                                        : ''
                                    }`}
                                  >
                                    {/* Top Row: Coordinate Badge & Global Number */}
                                    <div className="flex items-start justify-between gap-1">
                                      <span className="px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-xs font-mono text-[11px] font-bold tracking-wider">
                                        R{rowNum} · C{colNum}
                                      </span>
                                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/20 font-semibold">
                                        #{globalIndex}
                                      </span>
                                    </div>

                                    {/* Middle Content: Spacing & Color Hex Visual */}
                                    <div className="py-2 text-center">
                                      <div className="text-sm font-black tracking-tight drop-shadow-xs">
                                        {blockPadding}px Pad
                                      </div>
                                      <div className="text-[10px] font-mono opacity-80 mt-0.5">
                                        {color}
                                      </div>
                                    </div>

                                    {/* Bottom Row: Footer Coordinates & Status */}
                                    <div className="flex items-center justify-between text-[10px] opacity-75 font-mono pt-1 border-t border-white/20">
                                      <span>{layoutMode.toUpperCase()}</span>
                                      <span>{aspectRatio}</span>
                                    </div>

                                    {/* Hover overlay hint */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                      <span className="text-[10px] font-bold px-2 py-1 rounded bg-black/60 text-white backdrop-blur-xs">
                                        Click to Configure
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'css' ? (
            /* CSS Code Output */
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 shadow-xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-neutral-300">Generated Pure CSS</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent text-white flex items-center gap-1.5 transition-opacity hover:opacity-90"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy CSS'}</span>
                </button>
              </div>
              <pre className="text-xs overflow-x-auto p-3 bg-neutral-950 rounded-lg text-emerald-400 leading-relaxed max-h-[540px]">
                {generatedCss}
              </pre>
            </div>
          ) : (
            /* Tailwind Code Output */
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-900 text-neutral-100 shadow-xl space-y-3 font-mono">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-neutral-300">Generated Tailwind HTML</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent text-white flex items-center gap-1.5 transition-opacity hover:opacity-90"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Tailwind'}</span>
                </button>
              </div>
              <pre className="text-xs overflow-x-auto p-3 bg-neutral-950 rounded-lg text-sky-400 leading-relaxed max-h-[540px]">
                {generatedTailwind}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
