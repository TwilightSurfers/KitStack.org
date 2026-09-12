import React from 'react';

export type PluginCategory =
  | 'Design & Color'
  | 'CSS & Layout'
  | 'Code & Data'
  | 'Library & Docs'
  | 'Utilities';

export type PluginPermission =
  | 'storage'
  | 'notifications'
  | 'clipboard'
  | 'audio'
  | 'file-export';

export interface PluginManifest {
  /** Unique reverse-domain or kebab-case identifier (e.g. 'color-studio') */
  readonly id: string;

  /** Human-readable display title */
  readonly name: string;

  /** Short one-line summary displayed in catalog cards */
  readonly tagline: string;

  /** Detailed functional description for tool tooltips and documentation */
  readonly description: string;

  /** Semver or version string (e.g. 'v2.4') */
  readonly version: string;

  /** Primary functional category for directory grouping */
  readonly category: PluginCategory;

  /** Lucide icon identifier string (e.g. 'Palette', 'Layers', 'FileCode') */
  readonly icon: string;

  /** Optional pill badge displayed in tab headers and catalog */
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

export interface PluginStorage {
  /** Retrieve a typed value from the plugin's isolated sandbox */
  get<T = unknown>(key: string, defaultValue: T): T;

  /** Persist a typed value into the plugin's sandbox */
  set<T = unknown>(key: string, value: T): void;

  /** Remove a specific key from the plugin's sandbox */
  remove(key: string): void;

  /** Clear all keys belonging to this plugin only */
  clear(): void;
}

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

  /** Portable, collision-aware theme bubble hint tooltip component */
  BubbleHint: React.ComponentType<PluginBubbleHintProps>;
}

export interface PluginBubbleHintProps {
  content: React.ReactNode;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  disabled?: boolean;
  offset?: number;
  className?: string;
  children: React.ReactElement;
}

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
