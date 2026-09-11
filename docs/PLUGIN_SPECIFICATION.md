# KitStack.org — Plug-and-Play Plugin Architecture Specification (v1.0)

## 1. Executive Summary & Design Principles

The **KitStack Plugin Architecture** defines an open, modular, zero-touch runtime specification for micro-tools running inside the KitStack workbench. It enables any developer to construct, package, and hot-plug a new design, layout, or data utility without modifying the host application's routing, shell components, or state handlers.

### Core Principles
1. **Zero-Touch Host Integration**: The host app (`App.tsx`) never hardcodes `switch/case` statements or static component imports for tools. All tools are registered dynamically via a central `PluginRegistry`.
2. **Predictable Sandboxing**: Every plugin receives an isolated, namespaced local storage sandbox (`kitstack:plugin:<pluginId>:<key>`), preventing namespace collisions and cross-tool data corruption.
3. **Cohesive Design Language**: Plugins consume pre-styled, accessibility-certified shared primitives (e.g. `ColorPicker`, `SharedToolbar`, `SegmentedControl`) and automatically inherit the host's active theme (light/dark/system), accent color, and interface density.
4. **Type-Safe Contract**: Strict TypeScript interfaces govern the plugin manifest, lifecycle hooks, and runtime context.

---

## 2. System Topology

```
┌────────────────────────────────────────────────────────────────────────┐
│                        KitStack Shell (Host)                           │
│  - Top Tabbar (Multi-tab management, pinning, reordering)              │
│  - Settings Manager (Theme, Accent Color, Density, Notifications)      │
│  - Tool Catalog (Search, Category filtering, One-click launch)         │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
                     ┌─────────────▼──────────────┐
                     │    PluginRegistry (Host)   │
                     │  - register(plugin)        │
                     │  - get(id) / getAll()      │
                     │  - validate(manifest)      │
                     └─────────────┬──────────────┘
                                   │
          ┌────────────────────────┼────────────────────────┐
          │                        │                        │
┌─────────▼───────────┐  ┌─────────▼───────────┐  ┌─────────▼───────────┐
│ Color Studio Plugin │  │ Shadow Glow Plugin  │  │ Third-Party Plugin  │
│ - Manifest          │  │ - Manifest          │  │ - Manifest          │
│ - Component         │  │ - Component         │  │ - Component         │
│ - Namespaced Store  │  │ - Namespaced Store  │  │ - Namespaced Store  │
└─────────────────────┘  └─────────────────────┘  └─────────────────────┘
```

---

## 3. The Plugin Contract (TypeScript Interfaces)

### 3.1 Plugin Manifest (`PluginManifest`)
The manifest describes the plugin's identity, metadata, UI badges, and required capabilities.

```typescript
export type PluginCategory =
  | 'Design & Color'
  | 'CSS & Layout'
  | 'Code & Data'
  | 'Typography & Text'
  | 'Library & Docs'
  | 'Utilities';

export type PluginPermission =
  | 'storage'       // Persistent local storage access
  | 'notifications' // Dispatch floating alerts and sounds
  | 'clipboard'     // Read/write system clipboard
  | 'audio'         // Play synthesized audio feedback
  | 'file-export';  // Trigger browser file downloads

export interface PluginManifest {
  /** Unique reverse-domain or kebab-case identifier (e.g. 'org.kitstack.color-studio') */
  readonly id: string;

  /** Human-readable display title */
  readonly name: string;

  /** Short one-line summary displayed in catalog cards */
  readonly tagline: string;

  /** Detailed functional description for tool tooltips and documentation */
  readonly description: string;

  /** Semver string (e.g. '1.0.0') */
  readonly version: string;

  /** Primary functional category for directory grouping */
  readonly category: PluginCategory;

  /** Lucide icon identifier string (e.g. 'Palette', 'Sliders', 'FileCode') */
  readonly icon: string;

  /** Optional pill badge displayed in tab headers and catalog (e.g. 'Beta', 'Pro', 'Shared Lib') */
  readonly badge?: string;

  /** Author or maintainer attribution */
  readonly author?: {
    name: string;
    url?: string;
  };

  /** Declared platform permissions */
  readonly permissions?: readonly PluginPermission[];

  /** Default configuration or initial preset options */
  readonly defaultConfig?: Record<string, unknown>;
}
```

### 3.2 Namespaced Storage Sandbox (`PluginStorage`)
Plugins cannot access raw, unbounded `localStorage`. The host injects a sandboxed key-value store scoped to the plugin's unique `id`.

```typescript
export interface PluginStorage {
  /** Retrieve a typed value from the plugin's sandbox */
  get<T = unknown>(key: string, defaultValue: T): T;

  /** Persist a typed value into the plugin's sandbox */
  set<T = unknown>(key: string, value: T): void;

  /** Remove a specific key from the plugin's sandbox */
  remove(key: string): void;

  /** Clear all keys belonging to this plugin only */
  clear(): void;
}
```

### 3.3 Plugin Runtime Context (`PluginContext`)
Passed as props to the plugin component and accessible via the `usePluginContext()` hook.

```typescript
export interface PluginNotificationOptions {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  sound?: boolean;
}

export interface PluginContext {
  /** The plugin's registered manifest */
  manifest: PluginManifest;

  /** Active global theme ('dark' | 'light') */
  theme: 'dark' | 'light';

  /** Host primary accent hex color (e.g. '#4F46E5') */
  accentColor: string;

  /** Interface density preference */
  density: 'compact' | 'standard' | 'comfortable';

  /** Sandboxed storage provider */
  storage: PluginStorage;

  /** Dispatch user-facing toast alerts and audio chimes */
  notify: (options: PluginNotificationOptions) => void;

  /** Synthesized audio chime trigger */
  playChime: (tone?: 'info' | 'success' | 'warning' | 'error' | 'pop') => void;

  /** Copy text to clipboard and automatically emit success feedback */
  copyToClipboard: (text: string, label?: string) => Promise<boolean>;

  /** Download string or blob data as a file */
  downloadFile: (filename: string, content: string, mimeType?: string) => void;
}
```

### 3.4 The Master Plugin Definition (`KitStackPlugin`)

```typescript
export interface PluginComponentProps {
  /** Injected runtime context */
  context: PluginContext;
}

export interface KitStackPlugin {
  /** Static metadata manifest */
  readonly manifest: PluginManifest;

  /** The React component entrypoint */
  readonly component: React.ComponentType<PluginComponentProps>;

  /** Optional lifecycle hooks */
  readonly lifecycle?: {
    /** Executed once when plugin is registered */
    onInit?: () => void;
    /** Executed when the tool is opened in a tab */
    onMount?: (context: PluginContext) => void;
    /** Executed when the tab is closed */
    onDestroy?: () => void;
    /** Export current tool state for workspace saving */
    onExportState?: () => Record<string, unknown>;
    /** Restore tool state */
    onImportState?: (state: Record<string, unknown>) => void;
  };
}
```

---

## 4. Central Plugin Registry (`PluginRegistry`)

The `PluginRegistry` is a singleton service that registers, catalogs, and supplies plugins to the shell.

```typescript
class PluginRegistry {
  private plugins = new Map<string, KitStackPlugin>();
  private listeners = new Set<() => void>();

  /** Register a new plug-and-play tool */
  public register(plugin: KitStackPlugin): void {
    this.validate(plugin.manifest);
    this.plugins.set(plugin.manifest.id, plugin);
    plugin.lifecycle?.onInit?.();
    this.notifyListeners();
  }

  /** Unregister a tool */
  public unregister(pluginId: string): boolean {
    const target = this.plugins.get(pluginId);
    if (target) {
      target.lifecycle?.onDestroy?.();
      const removed = this.plugins.delete(pluginId);
      this.notifyListeners();
      return removed;
    }
    return false;
  }

  /** Retrieve a tool by its ID */
  public get(pluginId: string): KitStackPlugin | undefined {
    return this.plugins.get(pluginId);
  }

  /** Retrieve all registered tools */
  public getAll(): KitStackPlugin[] {
    return Array.from(this.plugins.values());
  }

  /** Retrieve tools filtered by category */
  public getByCategory(category: PluginCategory): KitStackPlugin[] {
    return this.getAll().filter((p) => p.manifest.category === category);
  }

  /** Subscribe to registry additions/removals */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private validate(manifest: PluginManifest): void {
    if (!manifest.id || typeof manifest.id !== 'string') {
      throw new Error(`[KitStack] Invalid plugin: 'id' is required`);
    }
    if (!manifest.name) {
      throw new Error(`[KitStack] Plugin '${manifest.id}' missing 'name'`);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const pluginRegistry = new PluginRegistry();
```

---

## 5. Plug-and-Play Host Integration in `App.tsx`

With this architecture, **`App.tsx` requires ZERO edits when introducing new tools**:

```tsx
// Inside App.tsx — dynamic plugin viewport:
const activePlugin = pluginRegistry.get(activeTab.toolId);

return (
  <main className="flex-1 overflow-y-auto">
    {activePlugin ? (
      <activePlugin.component context={createPluginContext(activePlugin.manifest)} />
    ) : (
      <PluginNotFoundFallback toolId={activeTab.toolId} />
    )}
  </main>
);
```

---

## 6. How to Build a Plug-and-Play Plugin in 5 Minutes

### Step 1: Create your plugin directory
```
src/
└── plugins/
    └── my-converter/
        ├── index.tsx          # Master plugin export
        └── MyConverterUI.tsx  # Internal views & state
```

### Step 2: Implement the Plugin Interface (`index.tsx`)
```tsx
import React, { useState } from 'react';
import { KitStackPlugin, PluginComponentProps } from '../../plugins/types';
import { SharedToolbar } from '../../components/shared/SharedToolbar';
import { ColorPicker } from '../../components/shared/ColorPicker';

const MyConverterTool: React.FC<PluginComponentProps> = ({ context }) => {
  // Use sandboxed storage:
  const [value, setValue] = useState(() => context.storage.get('input_val', 16));

  const handleSave = () => {
    context.storage.set('input_val', value);
    context.notify({
      title: 'Value Saved',
      message: `Persisted ${value}px into plugin sandbox`,
      type: 'success',
    });
  };

  return (
    <div className="space-y-4">
      <SharedToolbar
        title={context.manifest.name}
        badge={context.manifest.badge}
        accentColor={context.accentColor}
        onCopy={() => context.copyToClipboard(String(value), 'Converted Value')}
      />
      <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <input
          type="number"
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="px-3 py-2 border rounded-lg"
        />
        <button
          onClick={handleSave}
          className="ml-2 px-4 py-2 rounded-lg text-white font-medium"
          style={{ backgroundColor: context.accentColor }}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export const MyConverterPlugin: KitStackPlugin = {
  manifest: {
    id: 'my-converter',
    name: 'Quick Pixel Converter',
    tagline: 'Instant mathematical conversions',
    description: 'Calculates viewport percentages and fluid rem equivalents.',
    version: '1.0.0',
    category: 'Utilities',
    icon: 'Calculator',
    badge: 'New',
    permissions: ['storage', 'notifications', 'clipboard'],
  },
  component: MyConverterTool,
};
```

### Step 3: Register Plugin
```typescript
import { pluginRegistry } from '../plugins/registry';
import { MyConverterPlugin } from './plugins/my-converter';

pluginRegistry.register(MyConverterPlugin);
```
That's it! The tool is immediately active in:
- The top Tabset
- The Tool Catalog modal
- Tab duplication & pin manager
- Search and keyboard navigation

---

## 7. Shared Component Primitives

All plugins should leverage the standardized KitStack UI components located in `src/components/shared/`:

| Component | Responsibility | Props Contract |
| :--- | :--- | :--- |
| `ColorPicker` | Hex, RGB, HSL, alpha, eyedropper, live WCAG ratings, history swatches | `value: string, onChange: (val: string) => void, label?: string` |
| `SharedToolbar` | Standardized header with badge, copy code button, download action, and reset | `title: string, badge?: string, accentColor?: string, onCopy?: () => void, onDownload?: () => void, onReset?: () => void` |
| `ToastBanner` | Host-managed notification alert toast | Automatic via `context.notify()` |
| `AudioSynthesizer` | Web Audio API earcons | Automatic via `context.playChime()` |

---

## 8. Quality & Certification Standards

To maintain high visual craftsmanship across all plugins:
1. **Dark & Light Mode Parity**: A plugin must support both dark and light modes with WCAG AA contrast (≥ 4.5:1 for body text).
2. **Touch Targets**: All interactive controls must meet minimum 44px touch targets on mobile viewports.
3. **No Unbounded Storage**: Do not read/write global `localStorage` directly; always use `context.storage`.
4. **No External Network Leaks**: Offline-first by default; no unsolicited third-party tracking scripts.
