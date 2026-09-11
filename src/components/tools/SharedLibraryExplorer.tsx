import React, { useState } from 'react';
import { ColorPicker } from '../shared/ColorPicker';
import { SharedToolbar } from '../shared/SharedToolbar';
import { useNotifications } from '../../context/NotificationContext';
import { pluginRegistry } from '../../plugins/registry';
import { KitStackPlugin } from '../../plugins/types';
import {
  Boxes,
  Code,
  Sliders,
  Bell,
  Copy,
  Check,
  Download,
  BookOpen,
  Terminal,
  ShieldCheck,
  Layers,
  Sparkles,
  Plus,
  Radio,
  FileText
} from 'lucide-react';

interface SharedLibraryExplorerProps {
  accentColor: string;
}

type ExplorerSection = 'spec' | 'primitives' | 'registry';

export const SharedLibraryExplorer: React.FC<SharedLibraryExplorerProps> = ({ accentColor }) => {
  const [activeSection, setActiveSection] = useState<ExplorerSection>('spec');
  const [demoColor, setDemoColor] = useState('#06B6D4');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [registeredPlugins, setRegisteredPlugins] = useState(() => pluginRegistry.getAll());
  const [customToolName, setCustomToolName] = useState('Markdown Previewer');
  const [customToolCategory, setCustomToolCategory] = useState<'Code & Data' | 'Utilities'>('Utilities');
  const { addNotification } = useNotifications();

  const handleCopyCode = (id: string, code: string, label: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippet(id);
    addNotification({
      title: `${label} Copied`,
      message: 'Code contract copied to system clipboard',
      type: 'info',
      toolSource: 'Plugin Architecture',
    });
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const handleRegisterLivePlugin = () => {
    const slug = customToolName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newPluginId = `plugin-${slug}-${Math.random().toString(36).substring(2, 5)}`;

    const newPlugin: KitStackPlugin = {
      manifest: {
        id: newPluginId,
        name: customToolName || 'Custom Sandbox Tool',
        tagline: 'Hot-plugged sandbox utility',
        description: `Dynamically registered into KitStack.org plugin registry at runtime.`,
        version: '1.0.0',
        category: customToolCategory,
        icon: 'Sparkles',
        badge: 'Plug & Play',
        permissions: ['storage', 'notifications', 'clipboard'],
      },
      component: ({ context }) => {
        const [counter, setCounter] = useState(() => context.storage.get('test_count', 0));
        return (
          <div className="space-y-4">
            <SharedToolbar
              title={context.manifest.name}
              badge={context.manifest.badge}
              accentColor={context.accentColor}
              onCopy={() => context.copyToClipboard(`Count: ${counter}`, 'Counter Value')}
            />
            <div className="p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 mx-auto">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  {context.manifest.name} (Live Plugin Instance)
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-md mx-auto">
                  This tool was dynamically registered at runtime without restarting or editing core routing!
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const next = counter + 1;
                    setCounter(next);
                    context.storage.set('test_count', next);
                    context.notify({
                      title: 'State Updated',
                      message: `Saved ${next} to isolated sandbox`,
                      type: 'success',
                    });
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
                  style={{ backgroundColor: context.accentColor }}
                >
                  Increment Counter: {counter}
                </button>
              </div>
            </div>
          </div>
        );
      },
    };

    try {
      pluginRegistry.register(newPlugin);
      setRegisteredPlugins(pluginRegistry.getAll());
      addNotification({
        title: 'Plug & Play Registered!',
        message: `Registered "${customToolName}" into central registry. You can open it in the Tool Catalog.`,
        type: 'success',
        toolSource: 'Registry',
      });
    } catch (err: any) {
      addNotification({
        title: 'Registration Error',
        message: err?.message || 'Failed to register plugin',
        type: 'error',
      });
    }
  };

  const handleDownloadSpec = () => {
    fetch('/docs/PLUGIN_SPECIFICATION.md')
      .then((res) => {
        if (!res.ok) throw new Error('File fetch fallback');
        return res.text();
      })
      .then((markdown) => {
        const blob = new Blob([markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'PLUGIN_SPECIFICATION.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      })
      .catch(() => {
        addNotification({
          title: 'Spec Available in /docs',
          message: 'Spec is stored at /docs/PLUGIN_SPECIFICATION.md',
          type: 'info',
        });
      });
  };

  const samplePluginBoilerplate = `import React, { useState } from 'react';
import { KitStackPlugin, PluginComponentProps } from '../../plugins/types';
import { SharedToolbar } from '../../components/shared/SharedToolbar';
import { ColorPicker } from '../../components/shared/ColorPicker';

// 1. Tool Component: consumes injected context
export const MyCustomTool: React.FC<PluginComponentProps> = ({ context }) => {
  // Uses sandboxed key-value store scoped to this plugin
  const [accent, setAccent] = useState(() => context.storage.get('custom_color', context.accentColor));

  const handleSave = () => {
    context.storage.set('custom_color', accent);
    context.notify({
      title: 'Preset Stored',
      message: \`Saved \${accent} into plugin isolated sandbox\`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-4">
      <SharedToolbar
        title={context.manifest.name}
        badge={context.manifest.badge}
        accentColor={context.accentColor}
        onCopy={() => context.copyToClipboard(accent, 'Primary Color')}
      />
      <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
        <ColorPicker value={accent} onChange={setAccent} label="Tool Accent" />
        <button
          onClick={handleSave}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white shadow-xs"
          style={{ backgroundColor: context.accentColor }}
        >
          Save to Isolated Sandbox
        </button>
      </div>
    </div>
  );
};

// 2. Plugin Contract Export
export const MyCustomPlugin: KitStackPlugin = {
  manifest: {
    id: 'my-custom-tool',
    name: 'Custom Utility Tool',
    tagline: 'Instant plug-and-play reactive utility',
    description: 'Calculates fluid metrics and persists preferences safely.',
    version: '1.0.0',
    category: 'Utilities',
    icon: 'Sparkles',
    badge: 'Custom',
    permissions: ['storage', 'notifications', 'clipboard'],
  },
  component: MyCustomTool,
};`;

  return (
    <div className="space-y-6">
      <SharedToolbar
        title="KitStack Plugin Architecture & Shared Library"
        badge="Spec v1.0 • Plug & Play"
        accentColor={accentColor}
        onDownload={handleDownloadSpec}
      />

      {/* Navigation Pills between Spec, Live Registry & Shared Primitives */}
      <div className="flex items-center gap-2 p-1.5 rounded-xl bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-300/60 dark:border-neutral-800 w-fit">
        <button
          type="button"
          onClick={() => setActiveSection('spec')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'spec'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Plugin Specification (v1.0)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('registry')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'registry'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <Radio className="w-3.5 h-3.5" />
          <span>Live Registry & Sandbox ({registeredPlugins.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('primitives')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            activeSection === 'primitives'
              ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
              : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
          }`}
        >
          <Boxes className="w-3.5 h-3.5" />
          <span>Shared UI Primitives</span>
        </button>
      </div>

      {/* SECTION 1: THE PLUGIN ARCHITECTURE SPECIFICATION */}
      {activeSection === 'spec' && (
        <div className="space-y-6">
          {/* Executive Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                <Terminal className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                1. Zero-Touch Host
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                App shell routing contains no hardcoded switch-cases. Tools are discovered and rendered directly from the singleton <code className="font-mono text-indigo-500">PluginRegistry</code>.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                2. Isolated Sandbox
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Every plugin receives an isolated storage namespace <code className="font-mono text-emerald-600">kitstack:plugin:&lt;id&gt;:*</code> preventing cross-tool collisions.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                3. Unified Design Kit
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Plugins inherit global light/dark mode, accent color tokens, density controls, and shared primitives (<code className="font-mono text-amber-600">ColorPicker</code>, <code className="font-mono text-amber-600">SharedToolbar</code>).
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center">
                <Code className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                4. Strict TypeScript Spec
              </h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Strongly typed contracts for <code className="font-mono text-rose-500">KitStackPlugin</code>, <code className="font-mono text-rose-500">PluginManifest</code>, and <code className="font-mono text-rose-500">PluginContext</code> guarantee runtime safety.
              </p>
            </div>
          </div>

          {/* Architectural Topology Diagram */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                  Architectural Topology & Runtime Ingress
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-900/50">
                docs/PLUGIN_SPECIFICATION.md
              </span>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-950/80 border border-neutral-200/70 dark:border-neutral-800 font-mono text-[11px] text-neutral-700 dark:text-neutral-300 leading-relaxed overflow-x-auto whitespace-pre">
{`┌────────────────────────────────────────────────────────────────────────┐
│                        KitStack Shell (Host)                           │
│  - Multi-tab management (reorder, pin, close, duplicate)               │
│  - Global State: ThemeMode, AccentColor, Density, Notifications        │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │  Requests active tool
                     ┌─────────────▼──────────────┐
                     │    PluginRegistry (Host)   │
                     │  - register(plugin)        │
                     │  - get(id) / getAll()      │
                     └─────────────┬──────────────┘
                                   │  Injects PluginContext
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────▼───────────┐  ┌─────────▼───────────┐  ┌─────────▼───────────┐
│ Color Studio Plugin │  │ Shadow Glow Plugin  │  │ Third-Party Plugin  │
│ - Manifest          │  │ - Manifest          │  │ - Manifest          │
│ - Component         │  │ - Component         │  │ - Component         │
│ - Namespaced Store  │  │ - Namespaced Store  │  │ - Namespaced Store  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘`}
            </div>
          </div>

          {/* Plugin Template & Contract Code */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  Plug & Play Starter Template (KitStackPlugin Contract)
                </span>
              </div>
              <button
                onClick={() => handleCopyCode('boilerplate', samplePluginBoilerplate, 'Plugin Boilerplate')}
                className="text-xs flex items-center gap-1.5 font-mono px-2.5 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                style={{ color: accentColor }}
              >
                {copiedSnippet === 'boilerplate' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy TypeScript Starter</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-neutral-800 dark:text-neutral-300 p-4 rounded-lg bg-neutral-50 dark:bg-black/40 overflow-x-auto whitespace-pre leading-relaxed">
              {samplePluginBoilerplate}
            </pre>
          </div>
        </div>
      )}

      {/* SECTION 2: LIVE REGISTRY & SANDBOX TESTER */}
      {activeSection === 'registry' && (
        <div className="space-y-6">
          {/* Hot-Plug Interactive Sandbox */}
          <div className="p-5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/20 dark:bg-indigo-950/20 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  Interactive Hot-Plugging Sandbox
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Live Hot Registration
              </span>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400">
              Test runtime plug-and-play behavior: Type a tool name and category below to register a brand new plugin into the memory registry without restarting the server or touching <code className="font-mono text-indigo-500">App.tsx</code>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Plugin Display Name
                </label>
                <input
                  type="text"
                  value={customToolName}
                  onChange={(e) => setCustomToolName(e.target.value)}
                  placeholder="e.g. Markdown Previewer"
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                  Category
                </label>
                <select
                  value={customToolCategory}
                  onChange={(e) => setCustomToolCategory(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="Utilities">Utilities</option>
                  <option value="Code & Data">Code & Data</option>
                  <option value="Design & Color">Design & Color</option>
                  <option value="CSS & Layout">CSS & Layout</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleRegisterLivePlugin}
                  className="w-full py-2 px-4 rounded-lg text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Register Tool into Registry</span>
                </button>
              </div>
            </div>
          </div>

          {/* Currently Registered Plugins Table */}
          <div className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                Currently Active Plugins ({registeredPlugins.length})
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">
                Singleton: pluginRegistry.getAll()
              </span>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {registeredPlugins.map((plugin) => (
                <div key={plugin.manifest.id} className="py-3 flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {plugin.manifest.name}
                      </span>
                      {plugin.manifest.badge && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                          {plugin.manifest.badge}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-neutral-400">
                        {plugin.manifest.version}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                      {plugin.manifest.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                      ID: {plugin.manifest.id}
                    </span>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/40 dark:border-indigo-900/40">
                      {plugin.manifest.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SHARED UI PRIMITIVES */}
      {activeSection === 'primitives' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Component 1: Shared ColorPicker */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  1. Shared ColorPicker
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                components/shared/ColorPicker.tsx
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Interactive color engine with Hex input, Hue gradient track, Luminance slider, live WCAG AA/AAA ratings, and eyedropper support.
            </p>

            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/60 dark:border-neutral-700/60">
              <ColorPicker value={demoColor} onChange={setDemoColor} label="Shared Picker Demo" />
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-neutral-400 font-mono">Current: {demoColor}</span>
              <button
                onClick={() => handleCopyCode('color', `<ColorPicker value={color} onChange={setColor} />`, 'ColorPicker')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copiedSnippet === 'color' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy JSX</span>
              </button>
            </div>
          </div>

          {/* Component 2: Toast & Notification Engine */}
          <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-amber-500" />
                <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                  2. Notification & Audio Engine
                </h4>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                context.notify() / context.playChime()
              </span>
            </div>

            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Dispatches floating toasts with auto-dismiss and built-in Web Audio API sound feedback configured through user preferences.
            </p>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  addNotification({
                    title: 'Action Succeeded',
                    message: 'Generated clean assets for your tool tab',
                    type: 'success',
                    toolSource: 'Shared Lib',
                  });
                }}
                className="py-2 px-3 rounded-lg border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold hover:opacity-90"
              >
                Trigger Success Toast
              </button>

              <button
                onClick={() => {
                  addNotification({
                    title: 'Warning Alert',
                    message: 'Parameter outside optimal design bounds',
                    type: 'warning',
                    toolSource: 'Shared Lib',
                  });
                }}
                className="py-2 px-3 rounded-lg border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 text-xs font-semibold hover:opacity-90"
              >
                Trigger Warning Toast
              </button>
            </div>

            <div className="flex justify-between items-center text-xs pt-1">
              <span className="text-neutral-400 font-mono">context.notify(...)</span>
              <button
                onClick={() =>
                  handleCopyCode(
                    'notif',
                    `context.notify({ title: 'Saved', message: 'Asset exported', type: 'success' });`,
                    'Toast Snippet'
                  )
                }
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                {copiedSnippet === 'notif' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Copy Snippet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
