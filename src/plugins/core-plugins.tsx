import React from 'react';
import { KitStackPlugin } from './types';
import { pluginRegistry } from './registry';
import { ColorStudioTool } from '../components/tools/ColorStudioTool';
import { ShadowGlowTool } from '../components/tools/ShadowGlowTool';
import { JsonFormatTool } from '../components/tools/JsonFormatTool';
import { UnitConverterTool } from '../components/tools/UnitConverterTool';
import { SharedLibraryExplorer } from '../components/tools/SharedLibraryExplorer';

export const colorStudioPlugin: KitStackPlugin = {
  manifest: {
    id: 'color-studio',
    name: 'Color & Palette Studio',
    tagline: 'Harmonic palettes, contrast tester & CSS export',
    description: 'Build tonal palettes (50-950), test WCAG AA/AAA compliance against light & dark backgrounds, and export CSS/Tailwind color maps.',
    category: 'Design & Color',
    icon: 'Palette',
    badge: 'Shared Lib',
    version: 'v2.4',
    permissions: ['storage', 'notifications', 'clipboard', 'file-export'],
  },
  component: ({ context }) => <ColorStudioTool accentColor={context.accentColor} />,
};

export const shadowGlowPlugin: KitStackPlugin = {
  manifest: {
    id: 'shadow-glow',
    name: 'CSS Shadow & Glow Builder',
    tagline: 'Multi-layer elevations, soft ambient glows & inner insets',
    description: 'Fine-tune elevation offsets, blur radii, spreads, and chromatic tints with live light & dark card rendering.',
    category: 'CSS & Layout',
    icon: 'Layers',
    badge: 'Interactive',
    version: 'v1.8',
    permissions: ['storage', 'notifications', 'clipboard'],
  },
  component: ({ context }) => <ShadowGlowTool accentColor={context.accentColor} />,
};

export const jsonFormatPlugin: KitStackPlugin = {
  manifest: {
    id: 'json-format',
    name: 'JSON & Token Inspector',
    tagline: 'Format, validate, minify and analyze payload structures',
    description: 'Clean, validate, inspect hierarchy, sort keys, and compute payload sizes with fast instant error highlighting.',
    category: 'Code & Data',
    icon: 'FileCode',
    badge: 'Utility',
    version: 'v1.5',
    permissions: ['storage', 'notifications', 'clipboard', 'file-export'],
  },
  component: ({ context }) => <JsonFormatTool accentColor={context.accentColor} />,
};

export const unitConverterPlugin: KitStackPlugin = {
  manifest: {
    id: 'unit-converter',
    name: 'Responsive Unit & Clamp() Tool',
    tagline: 'PX, REM, Viewport & Fluid Typography Clamp formula calculator',
    description: 'Convert between pixels, rems, viewport units, and calculate mathematically perfect fluid CSS clamp() equations.',
    category: 'CSS & Layout',
    icon: 'Ruler',
    badge: 'Responsive',
    version: 'v1.2',
    permissions: ['storage', 'notifications', 'clipboard'],
  },
  component: ({ context }) => <UnitConverterTool accentColor={context.accentColor} />,
};

export const libraryExplorerPlugin: KitStackPlugin = {
  manifest: {
    id: 'library-explorer',
    name: 'Shared Library & Plugin Architecture',
    tagline: 'Plugin specification, sandbox runner & shared component kit',
    description: 'Interactive architecture specification, plug-and-play manifest runner, and reusable widget library documentation.',
    category: 'Library & Docs',
    icon: 'Boxes',
    badge: 'Spec v1.0',
    version: 'v3.0',
    permissions: ['storage', 'notifications', 'clipboard'],
  },
  component: ({ context }) => <SharedLibraryExplorer accentColor={context.accentColor} />,
};

/**
 * Initializes and registers the core built-in plugins into the registry.
 */
export function registerCorePlugins(): void {
  const corePlugins = [
    colorStudioPlugin,
    shadowGlowPlugin,
    jsonFormatPlugin,
    unitConverterPlugin,
    libraryExplorerPlugin,
  ];

  corePlugins.forEach((plugin) => {
    if (!pluginRegistry.get(plugin.manifest.id)) {
      pluginRegistry.register(plugin);
    }
  });
}

// Auto-register core plugins on load
registerCorePlugins();
