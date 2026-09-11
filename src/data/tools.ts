import { ToolDefinition } from '../types';
import { pluginRegistry } from '../plugins/registry';
import '../plugins/core-plugins'; // Ensure core plugins are registered

/**
 * Returns all active tool definitions from the central PluginRegistry.
 * Any newly plugged-in tool will automatically appear here.
 */
export const REPOSITORY_TOOLS: ToolDefinition[] = pluginRegistry.getManifests().map((m) => ({
  id: m.id,
  name: m.name,
  tagline: m.tagline,
  description: m.description,
  category: m.category,
  icon: m.icon,
  badge: m.badge,
  version: m.version,
}));

export const ACCENT_PRESETS = [
  { name: 'Indigo Core', value: '#4F46E5', label: 'Default modern Indigo' },
  { name: 'Cyan Wave', value: '#0891B2', label: 'Vibrant ocean cyan' },
  { name: 'Emerald Mint', value: '#059669', label: 'Clean botanical green' },
  { name: 'Violet Pulse', value: '#7C3AED', label: 'High contrast royal violet' },
  { name: 'Amber Forge', value: '#D97706', label: 'Warm amber gold' },
  { name: 'Rose Flare', value: '#E11D48', label: 'Electric crimson rose' },
  { name: 'Sky Tech', value: '#0284C7', label: 'Sharp engineering blue' },
];
