/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Building2,
  HeartPulse,
  Sparkles,
  Terminal,
  ShoppingBag,
  Columns,
  Layers,
  Copy,
  Check,
  Download,
  RotateCcw,
  Eye,
  Code,
  Bot,
  ArrowUp,
  ArrowDown,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Smartphone,
  Tablet,
  Monitor,
  Laptop,
  Sliders,
  Palette,
  FileCode,
  ShieldCheck,
  Send,
  ExternalLink,
  Info
} from 'lucide-react';
import { SharedToolbar } from '../shared/SharedToolbar';
import { BubbleHint } from '../shared/BubbleHint';
import { useNotifications } from '../../context/NotificationContext';
import {
  FooterConfig,
  FooterPresetId,
  FooterBlock,
  FOOTER_PRESETS,
  generateSemanticHtml,
  generateModularCss,
  generateTailwindHtml,
  generateReactComponent,
  generateCompleteHtmlDoc,
  generateLlmPrompt,
} from '../../utils/footerEngine';

export interface FooterDesignerToolProps {
  accentColor: string;
}

type StudioTab = 'preview' | 'html-css' | 'tailwind' | 'react' | 'llm-prompt';
type DeviceWidth = 'desktop' | 'laptop' | 'tablet' | 'mobile';

const PRESET_OPTIONS: Array<{
  id: FooterPresetId;
  name: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}> = [
  {
    id: 'corporate',
    name: 'Corporate Enterprise',
    desc: 'Authority, compliance badges & governance',
    icon: Building2,
    color: '#3B82F6',
  },
  {
    id: 'medical',
    name: 'Medical & Healthcare',
    desc: '24/7 emergency hotline & clinical credentials',
    icon: HeartPulse,
    color: '#0D9488',
  },
  {
    id: 'creative',
    name: 'Creative Studio',
    desc: 'Brutalist typography & studio availability',
    icon: Sparkles,
    color: '#F97316',
  },
  {
    id: 'saas-developer',
    name: 'SaaS & Developer',
    desc: 'CLI snippet, system uptime & docs links',
    icon: Terminal,
    color: '#6366F1',
  },
  {
    id: 'ecommerce',
    name: 'E-Commerce Flagship',
    desc: 'VIP 15% discount & payment badges',
    icon: ShoppingBag,
    color: '#D97706',
  },
];

export const FooterDesignerTool: React.FC<FooterDesignerToolProps> = ({ accentColor }) => {
  const { addNotification } = useNotifications();

  // Active configuration state (deep cloned from initial preset)
  const [config, setConfig] = useState<FooterConfig>(() =>
    JSON.parse(JSON.stringify(FOOTER_PRESETS.corporate))
  );

  // Active Studio Mode Tab
  const [activeTab, setActiveTab] = useState<StudioTab>('preview');

  // Preview Device Emulation Width
  const [deviceWidth, setDeviceWidth] = useState<DeviceWidth>('desktop');

  // Inspector Accordion states
  const [activeSection, setActiveSection] = useState<'presets' | 'layout' | 'style' | 'blocks'>('presets');
  const [expandedBlockId, setExpandedBlockId] = useState<string | null>('block-brand');

  // Copy feedback states
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Newsletter interactive test in preview
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  // Generated outputs
  const semanticHtml = useMemo(() => generateSemanticHtml(config), [config]);
  const modularCss = useMemo(() => generateModularCss(config), [config]);
  const tailwindHtml = useMemo(() => generateTailwindHtml(config), [config]);
  const reactComponent = useMemo(() => generateReactComponent(config), [config]);
  const htmlDoc = useMemo(() => generateCompleteHtmlDoc(config), [config]);
  const llmPrompt = useMemo(() => generateLlmPrompt(config), [config]);

  // Load a preset
  const handleSelectPreset = (presetId: FooterPresetId) => {
    const preset = FOOTER_PRESETS[presetId];
    if (preset) {
      setConfig(JSON.parse(JSON.stringify(preset)));
      addNotification({
        title: 'Preset Loaded',
        message: `Applied "${preset.name}" footer design template`,
        type: 'info',
        toolSource: 'Footer Designer',
      });
    }
  };

  // Reset to default
  const handleReset = () => {
    handleSelectPreset(config.presetId);
  };

  // Copy helper
  const handleCopy = (text: string, label: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    addNotification({
      title: `${label} Copied`,
      message: `Copied to clipboard successfully`,
      type: 'success',
      toolSource: 'Footer Designer',
    });
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  // Download helper
  const handleDownloadActive = () => {
    let content = '';
    let filename = '';
    let mimeType = 'text/plain';

    switch (activeTab) {
      case 'preview':
      case 'html-css':
        content = htmlDoc;
        filename = `${config.presetId}-footer.html`;
        mimeType = 'text/html';
        break;
      case 'tailwind':
        content = tailwindHtml;
        filename = `${config.presetId}-tailwind-footer.html`;
        mimeType = 'text/html';
        break;
      case 'react':
        content = reactComponent;
        filename = `WebsiteFooter.tsx`;
        mimeType = 'text/typescript';
        break;
      case 'llm-prompt':
        content = llmPrompt;
        filename = `${config.presetId}-footer-prompt.md`;
        mimeType = 'text/markdown';
        break;
    }

    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification({
      title: 'File Downloaded',
      message: `Exported ${filename} successfully`,
      type: 'success',
      toolSource: 'Footer Designer',
    });
  };

  // Block Reordering & Modification
  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newBlocks = [...config.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    const [removed] = newBlocks.splice(index, 1);
    newBlocks.splice(targetIndex, 0, removed);
    setConfig((prev) => ({ ...prev, blocks: newBlocks }));
  };

  const handleToggleBlock = (blockId: string) => {
    setConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, enabled: !b.enabled } : b)),
    }));
  };

  const handleUpdateBlockTitle = (blockId: string, title: string) => {
    setConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, title } : b)),
    }));
  };

  const handleUpdateBlockSpan = (blockId: string, span: number) => {
    setConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.map((b) => (b.id === blockId ? { ...b, columnSpan: span } : b)),
    }));
  };

  const handleRemoveBlock = (blockId: string) => {
    setConfig((prev) => ({
      ...prev,
      blocks: prev.blocks.filter((b) => b.id !== blockId),
    }));
  };

  const handleAddLinkBlock = () => {
    const newBlock: FooterBlock = {
      id: `block-links-${Date.now()}`,
      type: 'links',
      title: 'New Link Group',
      enabled: true,
      columnSpan: 1,
      data: {
        links: [
          { id: `l-${Date.now()}-1`, label: 'Quick Link 1', href: '#' },
          { id: `l-${Date.now()}-2`, label: 'Quick Link 2', href: '#' },
          { id: `l-${Date.now()}-3`, label: 'Quick Link 3', href: '#', badge: 'New' },
        ],
      },
    };
    setConfig((prev) => ({
      ...prev,
      blocks: [...prev.blocks, newBlock],
    }));
    setExpandedBlockId(newBlock.id);
  };

  // Width preview container class
  const previewWidthClass = useMemo(() => {
    switch (deviceWidth) {
      case 'mobile':
        return 'max-w-[375px]';
      case 'tablet':
        return 'max-w-[768px]';
      case 'laptop':
        return 'max-w-[1024px]';
      default:
        return 'w-full';
    }
  }, [deviceWidth]);

  return (
    <div className="space-y-6">
      {/* Top Header & Toolbar */}
      <SharedToolbar
        title="Website Footer Designer"
        badge="Semantic & Modular"
        onReset={handleReset}
        onExport={handleDownloadActive}
        exportLabel="Download"
        customActions={
          <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800/80 p-1 rounded-xl border border-neutral-200/80 dark:border-neutral-700/80">
            {PRESET_OPTIONS.map((preset) => {
              const Icon = preset.icon;
              const isSelected = config.presetId === preset.id;
              return (
                <BubbleHint key={preset.id} content={preset.name} placement="bottom">
                  <button
                    type="button"
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 shadow-xs'
                        : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: preset.color }} />
                    <span className="hidden md:inline font-semibold">{preset.name.split(' ')[0]}</span>
                  </button>
                </BubbleHint>
              );
            })}
          </div>
        }
      />

      {/* Main Studio Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Designer Studio & Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Quick Inspector Tabs */}
          <div className="flex rounded-xl bg-neutral-200/60 dark:bg-neutral-800/60 p-1 text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveSection('presets')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeSection === 'presets'
                  ? 'bg-white dark:bg-neutral-900 font-bold shadow-xs text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Archetypes
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('layout')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeSection === 'layout'
                  ? 'bg-white dark:bg-neutral-900 font-bold shadow-xs text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Columns & Grid
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('style')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeSection === 'style'
                  ? 'bg-white dark:bg-neutral-900 font-bold shadow-xs text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Colors & Style
            </button>
            <button
              type="button"
              onClick={() => setActiveSection('blocks')}
              className={`flex-1 py-1.5 rounded-lg transition-all ${
                activeSection === 'blocks'
                  ? 'bg-white dark:bg-neutral-900 font-bold shadow-xs text-neutral-900 dark:text-white'
                  : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              Blocks ({config.blocks.filter((b) => b.enabled).length})
            </button>
          </div>

          {/* SECTION 1: ARCHETYPES */}
          {activeSection === 'presets' && (
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                  Select Footer Archetype
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Five purpose-built, industry-tested footer layouts with specialized features.
                </p>
              </div>

              <div className="space-y-2.5">
                {PRESET_OPTIONS.map((p) => {
                  const Icon = p.icon;
                  const isSelected = config.presetId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPreset(p.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5 ${
                        isSelected
                          ? 'border-accent bg-accent-subtle/30 shadow-xs ring-1 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/40'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs"
                        style={{ backgroundColor: `${p.color}20`, color: p.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                            {p.name}
                          </h4>
                          {isSelected && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent text-white">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SECTION 2: COLUMNS & GRID */}
          {activeSection === 'layout' && (
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Columns className="w-4 h-4 text-accent" />
                  <span>Desktop Column Layout</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Choose between 1, 2, 3, 4, 5, or 6 columns. Grid automatically collapses on mobile & tablet.
                </p>
              </div>

              {/* Column Segmented Buttons */}
              <div className="grid grid-cols-6 gap-1.5">
                {([1, 2, 3, 4, 5, 6] as const).map((colCount) => {
                  const isSelected = config.columns === colCount;
                  return (
                    <button
                      key={colCount}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, columns: colCount }))}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all flex flex-col items-center justify-center gap-1 ${
                        isSelected
                          ? 'border-accent bg-accent text-white shadow-xs'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                      }`}
                    >
                      <span>{colCount}</span>
                      <span className="text-[9px] font-normal opacity-80">Col</span>
                    </button>
                  );
                })}
              </div>

              {/* Spacing / Density */}
              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  Vertical Padding & Spacing
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['compact', 'normal', 'spacious'] as const).map((density) => (
                    <button
                      key={density}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, density }))}
                      className={`py-2 rounded-lg text-xs font-medium capitalize border transition-all ${
                        config.density === density
                          ? 'border-accent bg-accent-subtle text-accent font-bold ring-1 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {density}
                    </button>
                  ))}
                </div>
              </div>

              {/* Top Divider Style */}
              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  Footer Top Border Style
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['subtle', 'accent', 'gradient', 'dashed', 'none'] as const).map((bTop) => (
                    <button
                      key={bTop}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, borderTop: bTop }))}
                      className={`py-1.5 rounded-lg text-xs capitalize border transition-all ${
                        config.borderTop === bTop
                          ? 'border-accent bg-accent-subtle text-accent font-bold ring-1 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {bTop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                  Element Border Radius
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(['none', 'sm', 'md', 'lg', 'full'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, borderRadius: r }))}
                      className={`py-1.5 rounded-lg text-xs uppercase border transition-all ${
                        config.borderRadius === r
                          ? 'border-accent bg-accent-subtle text-accent font-bold ring-1 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 3: COLORS & STYLE */}
          {activeSection === 'style' && (
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-4">
              <div>
                <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Palette className="w-4 h-4 text-accent" />
                  <span>Color Theme & Palette</span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Fine-tune colors or pick from curated palettes with compliant WCAG contrast.
                </p>
              </div>

              {/* Theme Quick Palettes */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Theme Preset Moods
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { name: 'Midnight Deep', bg: '#0B0F19', text: '#F8FAFC', accent: '#3B82F6', border: '#1E293B' },
                    { name: 'Obsidian Dark', bg: '#121212', text: '#FFFFFF', accent: '#F97316', border: '#27272A' },
                    { name: 'Medical Teal', bg: '#042F2E', text: '#F0FDFA', accent: '#0D9488', border: '#134E4A' },
                    { name: 'Terminal Cyber', bg: '#090D16', text: '#F8FAFC', accent: '#6366F1', border: '#1E293B' },
                    { name: 'Charcoal Modern', bg: '#18181B', text: '#FAFAFA', accent: '#D97706', border: '#27272A' },
                    { name: 'Clean Light Paper', bg: '#FFFFFF', text: '#0F172A', accent: '#2563EB', border: '#E2E8F0' },
                  ].map((mood) => (
                    <button
                      key={mood.name}
                      type="button"
                      onClick={() =>
                        setConfig((prev) => ({
                          ...prev,
                          bgColor: mood.bg,
                          textColor: mood.text,
                          accentColor: mood.accent,
                          borderColor: mood.border,
                        }))
                      }
                      className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-800 flex items-center gap-2 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors text-left"
                    >
                      <div
                        className="w-4 h-4 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: mood.bg }}
                      />
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: mood.accent }}
                      />
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {mood.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Color Inputs */}
              <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Background Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.bgColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={config.bgColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, bgColor: e.target.value }))}
                      className="w-20 px-2 py-1 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Accent / Brand Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.accentColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, accentColor: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={config.accentColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, accentColor: e.target.value }))}
                      className="w-20 px-2 py-1 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Text Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.textColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={config.textColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, textColor: e.target.value }))}
                      className="w-20 px-2 py-1 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                    Border Divider Color
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={config.borderColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, borderColor: e.target.value }))}
                      className="w-6 h-6 rounded cursor-pointer border-0 p-0"
                    />
                    <input
                      type="text"
                      value={config.borderColor}
                      onChange={(e) => setConfig((prev) => ({ ...prev, borderColor: e.target.value }))}
                      className="w-20 px-2 py-1 text-xs font-mono rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                    />
                  </div>
                </div>
              </div>

              {/* Font Family */}
              <div className="space-y-2 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block">
                  Typography Family
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['sans', 'serif', 'mono'] as const).map((font) => (
                    <button
                      key={font}
                      type="button"
                      onClick={() => setConfig((prev) => ({ ...prev, fontFamily: font }))}
                      className={`py-1.5 rounded-lg text-xs capitalize border transition-all ${
                        config.fontFamily === font
                          ? 'border-accent bg-accent-subtle text-accent font-bold ring-1 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {font}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: BLOCKS & REARRANGING */}
          {activeSection === 'blocks' && (
            <div className="p-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    Rearrange & Edit Blocks
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Use Up/Down arrows to rearrange order. Toggle checkboxes to hide/show.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddLinkBlock}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-accent flex items-center gap-1 shadow-xs transition-opacity hover:opacity-90"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Group</span>
                </button>
              </div>

              {/* List of Blocks */}
              <div className="space-y-2">
                {config.blocks.map((block, index) => {
                  const isExpanded = expandedBlockId === block.id;
                  const isFirst = index === 0;
                  const isLast = index === config.blocks.length - 1;

                  return (
                    <div
                      key={block.id}
                      className={`border rounded-xl transition-all ${
                        block.enabled
                          ? 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-800/40'
                          : 'border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-100/50 dark:bg-neutral-900/50 opacity-60'
                      }`}
                    >
                      {/* Block Header Row */}
                      <div className="p-2.5 flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <input
                            type="checkbox"
                            checked={block.enabled}
                            onChange={() => handleToggleBlock(block.id)}
                            className="rounded accent-theme cursor-pointer"
                          />
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 uppercase">
                            {block.type}
                          </span>
                          <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 truncate">
                            {block.title}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={isFirst}
                            onClick={() => handleMoveBlock(index, 'up')}
                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 disabled:opacity-20"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            disabled={isLast}
                            onClick={() => handleMoveBlock(index, 'down')}
                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 disabled:opacity-20"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setExpandedBlockId(isExpanded ? null : block.id)}
                            className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500"
                            title="Edit Block Content"
                          >
                            {isExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Expandable Block Content Editor */}
                      {isExpanded && (
                        <div className="p-3 pt-0 border-t border-neutral-200 dark:border-neutral-800 space-y-2.5 text-xs">
                          <div className="flex gap-2">
                            <div className="flex-1">
                              <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
                                Block Title / Label
                              </label>
                              <input
                                type="text"
                                value={block.title}
                                onChange={(e) => handleUpdateBlockTitle(block.id, e.target.value)}
                                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                            </div>
                            <div className="w-24">
                              <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 block mb-1">
                                Col Span
                              </label>
                              <select
                                value={block.columnSpan || 1}
                                onChange={(e) =>
                                  handleUpdateBlockSpan(block.id, parseInt(e.target.value, 10))
                                }
                                className="w-full px-2 py-1.5 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              >
                                <option value={1}>1 col</option>
                                <option value={2}>2 cols</option>
                                <option value={3}>3 cols</option>
                                <option value={4}>4 cols</option>
                              </select>
                            </div>
                          </div>

                          {/* Brand Editor */}
                          {block.type === 'brand' && (
                            <div className="space-y-2 pt-1">
                              <input
                                type="text"
                                placeholder="Brand Name"
                                value={block.data.brandName || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, brandName: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                              <input
                                type="text"
                                placeholder="Tagline"
                                value={block.data.brandTagline || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, brandTagline: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                              <textarea
                                rows={2}
                                placeholder="Description"
                                value={block.data.brandDescription || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, brandDescription: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                            </div>
                          )}

                          {/* Newsletter Editor */}
                          {block.type === 'newsletter' && (
                            <div className="space-y-2 pt-1">
                              <input
                                type="text"
                                placeholder="Newsletter Heading"
                                value={block.data.newsletterHeading || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, newsletterHeading: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                              <input
                                type="text"
                                placeholder="Button Text"
                                value={block.data.newsletterButtonText || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, newsletterButtonText: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                            </div>
                          )}

                          {/* Contact Editor */}
                          {block.type === 'contact' && (
                            <div className="space-y-2 pt-1">
                              <input
                                type="text"
                                placeholder="Emergency Callout (e.g. 1-800-CARE-NOW)"
                                value={block.data.emergencyCallout || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, emergencyCallout: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                              <input
                                type="text"
                                placeholder="Phone"
                                value={block.data.contactPhone || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, contactPhone: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900"
                              />
                            </div>
                          )}

                          {/* Status Editor */}
                          {block.type === 'status' && (
                            <div className="space-y-2 pt-1">
                              <input
                                type="text"
                                placeholder="CLI Command"
                                value={block.data.cliCommand || ''}
                                onChange={(e) =>
                                  setConfig((prev) => ({
                                    ...prev,
                                    blocks: prev.blocks.map((b) =>
                                      b.id === block.id
                                        ? { ...b, data: { ...b.data, cliCommand: e.target.value } }
                                        : b
                                    ),
                                  }))
                                }
                                className="w-full px-2.5 py-1.5 rounded border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 font-mono text-[11px]"
                              />
                            </div>
                          )}

                          {/* Delete block option if not bottom */}
                          {block.type !== 'bottom' && (
                            <div className="pt-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleRemoveBlock(block.id)}
                                className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 font-medium"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Delete Block</span>
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Interactive Canvas & Code Studio (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Studio Navigation Tabs & Responsive Switcher */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs">
            {/* Mode Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Live Preview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('html-css')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'html-css'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>Semantic HTML + CSS</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tailwind')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'tailwind'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Tailwind CSS</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('react')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'react'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>React TSX</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('llm-prompt')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'llm-prompt'
                    ? 'bg-accent text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Bot className="w-3.5 h-3.5" />
                <span>AI Prompt</span>
              </button>
            </div>

            {/* Responsive Viewport Switcher (When on Preview) */}
            {activeTab === 'preview' && (
              <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-end sm:self-auto">
                <button
                  type="button"
                  onClick={() => setDeviceWidth('desktop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceWidth === 'desktop'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                  title="Full Desktop"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceWidth('laptop')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceWidth === 'laptop'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                  title="Laptop (1024px)"
                >
                  <Laptop className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceWidth('tablet')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceWidth === 'tablet'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                  title="Tablet (768px)"
                >
                  <Tablet className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceWidth('mobile')}
                  className={`p-1.5 rounded-lg text-xs transition-colors ${
                    deviceWidth === 'mobile'
                      ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-xs'
                      : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-white'
                  }`}
                  title="Mobile (375px)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* TAB 1: LIVE INTERACTIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-neutral-900/5 dark:bg-neutral-800/30 rounded-2xl border border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                <span className="font-medium">
                  Rendering: <strong>{config.name}</strong> • {config.columns} Column Grid •{' '}
                  <span className="capitalize">{deviceWidth} viewport</span>
                </span>
                <span className="text-[11px] opacity-75 hidden sm:inline">
                  Interactive testing mode
                </span>
              </div>

              {/* Viewport Box */}
              <div className="w-full flex justify-center bg-neutral-950 p-2 sm:p-4 rounded-2xl border border-neutral-800 overflow-x-auto shadow-inner">
                <div
                  className={`transition-all duration-300 ${previewWidthClass} rounded-xl overflow-hidden shadow-2xl`}
                >
                  {/* Dynamic Rendered Footer Canvas */}
                  <div
                    style={{
                      backgroundColor: config.bgColor,
                      color: config.textColor,
                      borderColor: config.borderColor,
                      borderTopWidth: config.borderTop === 'none' ? 0 : config.borderTop === 'accent' ? 3 : 1,
                      borderTopStyle: config.borderTop === 'dashed' ? 'dashed' : 'solid',
                      borderTopColor: config.borderTop === 'accent' ? config.accentColor : config.borderColor,
                    }}
                    className={`w-full ${
                      config.density === 'compact'
                        ? 'p-6 sm:p-8'
                        : config.density === 'spacious'
                        ? 'p-10 sm:p-16'
                        : 'p-8 sm:p-12'
                    }`}
                  >
                    <div className="max-w-6xl mx-auto space-y-10">
                      {/* Grid for Main Blocks */}
                      <div
                        className={`grid gap-8 ${
                          deviceWidth === 'mobile'
                            ? 'grid-cols-1'
                            : deviceWidth === 'tablet'
                            ? 'grid-cols-2'
                            : config.columns === 1
                            ? 'grid-cols-1'
                            : config.columns === 2
                            ? 'grid-cols-1 md:grid-cols-2'
                            : config.columns === 3
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                            : config.columns === 5
                            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5'
                            : config.columns === 6
                            ? 'grid-cols-1 md:grid-cols-3 lg:grid-cols-6'
                            : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
                        }`}
                      >
                        {config.blocks
                          .filter((b) => b.enabled && b.type !== 'badges' && b.type !== 'bottom')
                          .map((block) => {
                            const spanClass =
                              deviceWidth === 'desktop' && block.columnSpan && block.columnSpan > 1
                                ? `col-span-${block.columnSpan}`
                                : '';

                            return (
                              <div key={block.id} className={`space-y-3 ${spanClass}`}>
                                {/* BRAND BLOCK */}
                                {block.type === 'brand' && (
                                  <>
                                    {block.data.brandName && (
                                      <h3 className="text-lg font-extrabold tracking-tight">
                                        {block.data.brandName}
                                      </h3>
                                    )}
                                    {block.data.brandTagline && (
                                      <p
                                        className="text-xs font-semibold tracking-wide"
                                        style={{ color: config.accentColor }}
                                      >
                                        {block.data.brandTagline}
                                      </p>
                                    )}
                                    {block.data.brandDescription && (
                                      <p
                                        className="text-xs leading-relaxed"
                                        style={{ color: config.mutedTextColor }}
                                      >
                                        {block.data.brandDescription}
                                      </p>
                                    )}
                                    {block.data.officeLocations && (
                                      <div
                                        className="pt-2 text-[11px] space-y-0.5"
                                        style={{ color: config.mutedTextColor }}
                                      >
                                        <span className="font-semibold block uppercase tracking-wider text-[10px]">
                                          Global Hubs:
                                        </span>
                                        <span>{block.data.officeLocations.join(' • ')}</span>
                                      </div>
                                    )}
                                  </>
                                )}

                                {/* LINKS BLOCK */}
                                {block.type === 'links' && (
                                  <>
                                    <h4 className="text-xs font-bold uppercase tracking-wider">
                                      {block.title}
                                    </h4>
                                    <ul className="space-y-2 text-xs">
                                      {block.data.links?.map((l) => (
                                        <li key={l.id}>
                                          <a
                                            href={l.href}
                                            onClick={(e) => e.preventDefault()}
                                            className="hover:underline transition-all inline-flex items-center gap-1.5"
                                            style={{ color: config.mutedTextColor }}
                                          >
                                            <span>{l.label}</span>
                                            {l.badge && (
                                              <span
                                                className="text-[10px] font-semibold px-1.5 py-0.2 rounded-full"
                                                style={{
                                                  backgroundColor: `${config.accentColor}25`,
                                                  color: config.accentColor,
                                                }}
                                              >
                                                {l.badge}
                                              </span>
                                            )}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </>
                                )}

                                {/* NEWSLETTER BLOCK */}
                                {block.type === 'newsletter' && (
                                  <>
                                    <h4 className="text-xs font-bold uppercase tracking-wider">
                                      {block.data.newsletterHeading || block.title}
                                    </h4>
                                    <p
                                      className="text-xs leading-relaxed"
                                      style={{ color: config.mutedTextColor }}
                                    >
                                      {block.data.newsletterDescription}
                                    </p>
                                    <form
                                      onSubmit={(e) => {
                                        e.preventDefault();
                                        setNewsletterSubmitted(true);
                                        addNotification({
                                          title: 'Newsletter Demo',
                                          message: `Simulated signup for ${newsletterEmail || 'user@example.com'}`,
                                          type: 'success',
                                          toolSource: 'Footer Designer',
                                        });
                                      }}
                                      className="space-y-2 pt-1"
                                    >
                                      <div className="flex gap-2">
                                        <input
                                          type="email"
                                          placeholder={block.data.newsletterPlaceholder || 'Email address'}
                                          value={newsletterEmail}
                                          onChange={(e) => {
                                            setNewsletterEmail(e.target.value);
                                            setNewsletterSubmitted(false);
                                          }}
                                          className="w-full px-3 py-2 text-xs rounded-lg border outline-none transition-colors"
                                          style={{
                                            backgroundColor: 'rgba(255, 255, 255, 0.07)',
                                            borderColor: config.borderColor,
                                            color: config.textColor,
                                          }}
                                        />
                                        <button
                                          type="submit"
                                          className="px-3 py-2 text-xs font-semibold rounded-lg text-white hover:opacity-90 transition-opacity whitespace-nowrap"
                                          style={{ backgroundColor: config.accentColor }}
                                        >
                                          {newsletterSubmitted ? (
                                            <Check className="w-3.5 h-3.5" />
                                          ) : (
                                            block.data.newsletterButtonText || 'Join'
                                          )}
                                        </button>
                                      </div>
                                      {newsletterSubmitted ? (
                                        <p className="text-[11px] text-emerald-400 font-medium">
                                          ✓ Subscribed! Welcome to the insider list.
                                        </p>
                                      ) : (
                                        block.data.newsletterDisclaimer && (
                                          <p
                                            className="text-[10px]"
                                            style={{ color: config.mutedTextColor }}
                                          >
                                            {block.data.newsletterDisclaimer}
                                          </p>
                                        )
                                      )}
                                    </form>
                                  </>
                                )}

                                {/* CONTACT BLOCK */}
                                {block.type === 'contact' && (
                                  <>
                                    <h4 className="text-xs font-bold uppercase tracking-wider">
                                      {block.data.contactHeading || block.title}
                                    </h4>
                                    {block.data.emergencyCallout && (
                                      <div
                                        className="p-2.5 rounded-lg border text-xs font-bold"
                                        style={{
                                          borderColor: `${config.accentColor}60`,
                                          backgroundColor: `${config.accentColor}18`,
                                          color: config.accentColor,
                                        }}
                                      >
                                        {block.data.emergencyCallout}
                                      </div>
                                    )}
                                    <div
                                      className="space-y-1.5 text-xs"
                                      style={{ color: config.mutedTextColor }}
                                    >
                                      {block.data.clinicLocation && (
                                        <p>📍 {block.data.clinicLocation}</p>
                                      )}
                                      {block.data.contactPhone && (
                                        <p>📞 {block.data.contactPhone}</p>
                                      )}
                                      {block.data.contactEmail && (
                                        <p>✉️ {block.data.contactEmail}</p>
                                      )}
                                      {block.data.contactHours && (
                                        <p className="text-[11px] pt-1">
                                          🕒 {block.data.contactHours}
                                        </p>
                                      )}
                                    </div>
                                  </>
                                )}

                                {/* STATUS / DEV BLOCK */}
                                {block.type === 'status' && (
                                  <>
                                    <h4 className="text-xs font-bold uppercase tracking-wider">
                                      {block.data.statusHeading || block.title}
                                    </h4>
                                    <div
                                      className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border text-xs"
                                      style={{ borderColor: config.borderColor }}
                                    >
                                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                      <span>{block.data.statusText || 'Operational'}</span>
                                    </div>
                                    {block.data.uptime && (
                                      <p
                                        className="text-xs"
                                        style={{ color: config.mutedTextColor }}
                                      >
                                        {block.data.uptime}
                                      </p>
                                    )}
                                    {block.data.cliCommand && (
                                      <div
                                        onClick={() =>
                                          handleCopy(block.data.cliCommand!, 'CLI Snippet', 'cli')
                                        }
                                        className="p-2 rounded-lg border font-mono text-[11px] cursor-pointer hover:border-neutral-500 transition-colors flex items-center justify-between"
                                        style={{
                                          backgroundColor: '#030712',
                                          borderColor: config.borderColor,
                                          color: '#38BDF8',
                                        }}
                                        title="Click to copy CLI command"
                                      >
                                        <span className="truncate">{block.data.cliCommand}</span>
                                        <Copy className="w-3 h-3 text-neutral-400 ml-1 shrink-0" />
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            );
                          })}
                      </div>

                      {/* BADGES BLOCK */}
                      {config.blocks
                        .filter((b) => b.enabled && b.type === 'badges')
                        .map((badgeBlock) => (
                          <div
                            key={badgeBlock.id}
                            className="pt-6 border-t"
                            style={{ borderColor: config.borderColor }}
                          >
                            {badgeBlock.data.badgesHeading && (
                              <h5
                                className="text-[11px] font-bold uppercase tracking-wider mb-3"
                                style={{ color: config.mutedTextColor }}
                              >
                                {badgeBlock.data.badgesHeading}
                              </h5>
                            )}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                              {badgeBlock.data.badges?.map((badge) => (
                                <div
                                  key={badge.id}
                                  className="flex items-center gap-2.5 p-2.5 rounded-xl border"
                                  style={{
                                    borderColor: config.borderColor,
                                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                  }}
                                >
                                  <div
                                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 text-white"
                                    style={{ backgroundColor: config.accentColor }}
                                  >
                                    ✓
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-xs font-bold truncate">{badge.label}</p>
                                    {badge.sublabel && (
                                      <p
                                        className="text-[10px] truncate"
                                        style={{ color: config.mutedTextColor }}
                                      >
                                        {badge.sublabel}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}

                      {/* BOTTOM ROW */}
                      {config.blocks
                        .filter((b) => b.enabled && b.type === 'bottom')
                        .map((bottomBlock) => (
                          <div
                            key={bottomBlock.id}
                            className="pt-6 border-t flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
                            style={{
                              borderColor: config.borderColor,
                              color: config.mutedTextColor,
                            }}
                          >
                            <div className="flex flex-col sm:flex-row items-center gap-3">
                              <span>{bottomBlock.data.copyrightText}</span>
                              <div className="flex flex-wrap gap-2.5">
                                {bottomBlock.data.legalLinks?.map((l) => (
                                  <a
                                    key={l.id}
                                    href={l.href}
                                    onClick={(e) => e.preventDefault()}
                                    className="hover:underline"
                                  >
                                    {l.label}
                                  </a>
                                ))}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              {bottomBlock.data.showCurrency && (
                                <span>
                                  Currency: <strong className="text-white">USD ($)</strong>
                                </span>
                              )}
                              {bottomBlock.data.showLanguage && (
                                <span>
                                  Region: <strong className="text-white">English (US)</strong>
                                </span>
                              )}
                              {bottomBlock.data.backToTop && (
                                <a
                                  href="#top"
                                  onClick={(e) => e.preventDefault()}
                                  className="font-bold hover:underline"
                                  style={{ color: config.accentColor }}
                                >
                                  ↑ Top
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SEMANTIC HTML + MODULAR CSS */}
          {activeTab === 'html-css' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Clean Semantic HTML5 & Modular Scoped CSS
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(semanticHtml, 'Semantic HTML', 'html')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1"
                  >
                    {copiedKey === 'html' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy HTML</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(modularCss, 'Modular CSS', 'css')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-1"
                  >
                    {copiedKey === 'css' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy CSS</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopy(htmlDoc, 'Full HTML Page', 'page')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-accent flex items-center gap-1 shadow-xs"
                  >
                    {copiedKey === 'page' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Full Page</span>
                  </button>
                </div>
              </div>

              {/* Code Views */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    Semantic HTML5 Output
                  </div>
                  <pre className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 font-mono text-[11px] h-[450px] overflow-auto leading-relaxed select-all">
                    <code>{semanticHtml}</code>
                  </pre>
                </div>

                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                    Modular Scoped CSS Output
                  </div>
                  <pre className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 font-mono text-[11px] h-[450px] overflow-auto leading-relaxed select-all">
                    <code>{modularCss}</code>
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TAILWIND CSS */}
          {activeTab === 'tailwind' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    Tailwind CSS (Utility Classes)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Semantic markup formatted with responsive Tailwind v3 / v4 utility classes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(tailwindHtml, 'Tailwind HTML', 'tailwind')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent flex items-center gap-1.5 shadow-xs"
                >
                  {copiedKey === 'tailwind' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy Tailwind HTML</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 font-mono text-xs h-[480px] overflow-auto leading-relaxed select-all">
                <code>{tailwindHtml}</code>
              </pre>
            </div>
          )}

          {/* TAB 4: REACT TSX */}
          {activeTab === 'react' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    React Component (TypeScript)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Exportable as <code>WebsiteFooter.tsx</code> with JSX-safe attributes.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(reactComponent, 'React Component', 'react')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent flex items-center gap-1.5 shadow-xs"
                >
                  {copiedKey === 'react' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy React TSX</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 font-mono text-xs h-[480px] overflow-auto leading-relaxed select-all">
                <code>{reactComponent}</code>
              </pre>
            </div>
          )}

          {/* TAB 5: AI / LLM RE-CREATE PROMPT */}
          {activeTab === 'llm-prompt' && (
            <div className="space-y-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2.5 text-amber-700 dark:text-amber-300 text-xs">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="block font-bold">LLM & Coding Agent Re-creation Prompt</strong>
                  <span>
                    Paste this exact prompt into Claude, ChatGPT, Gemini, Cursor, or your autonomous AI agent to rebuild, customize, or port this footer to any stack (Astro, Svelte, Vue, or Next.js).
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Ready-to-Use Agent Prompt
                </span>
                <button
                  type="button"
                  onClick={() => handleCopy(llmPrompt, 'LLM Prompt', 'prompt')}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent flex items-center gap-1.5 shadow-xs"
                >
                  {copiedKey === 'prompt' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Copy AI Prompt</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-100 font-mono text-xs h-[450px] overflow-auto leading-relaxed select-all whitespace-pre-wrap">
                <code>{llmPrompt}</code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
