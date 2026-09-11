import { KitStackPlugin, PluginManifest, PluginCategory, PluginStorage } from './types';

/**
 * Creates an isolated, sandboxed localStorage wrapper for a plugin.
 * All keys are automatically namespaced with `kitstack:plugin:<pluginId>:`
 */
export function createPluginStorage(pluginId: string): PluginStorage {
  const prefix = `kitstack:plugin:${pluginId}:`;

  return {
    get<T>(key: string, defaultValue: T): T {
      try {
        const item = localStorage.getItem(prefix + key);
        if (item === null) return defaultValue;
        return JSON.parse(item) as T;
      } catch {
        return defaultValue;
      }
    },
    set<T>(key: string, value: T): void {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      } catch (err) {
        console.warn(`[KitStack Storage] Failed to save key "${key}" for plugin "${pluginId}"`, err);
      }
    },
    remove(key: string): void {
      try {
        localStorage.removeItem(prefix + key);
      } catch {
        // ignore
      }
    },
    clear(): void {
      try {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && k.startsWith(prefix)) {
            keysToRemove.push(k);
          }
        }
        keysToRemove.forEach((k) => localStorage.removeItem(k));
      } catch {
        // ignore
      }
    },
  };
}

/**
 * Singleton PluginRegistry managing all plug-and-play tools.
 */
class PluginRegistry {
  private plugins = new Map<string, KitStackPlugin>();
  private listeners = new Set<() => void>();

  /**
   * Register a new plugin tool with the host shell.
   */
  public register(plugin: KitStackPlugin): void {
    if (!plugin || !plugin.manifest) {
      throw new Error('[KitStack Registry] Cannot register invalid plugin');
    }
    const { id, name } = plugin.manifest;
    if (!id) {
      throw new Error('[KitStack Registry] Plugin manifest must specify an "id"');
    }
    if (!name) {
      throw new Error(`[KitStack Registry] Plugin "${id}" must provide a display "name"`);
    }

    this.plugins.set(id, plugin);
    plugin.lifecycle?.onInit?.();
    this.notify();
  }

  /**
   * Unregisters a plugin and invokes its onDestroy lifecycle hook.
   */
  public unregister(id: string): boolean {
    const target = this.plugins.get(id);
    if (!target) return false;
    target.lifecycle?.onDestroy?.();
    const removed = this.plugins.delete(id);
    this.notify();
    return removed;
  }

  /**
   * Retrieve a plugin by its unique ID.
   */
  public get(id: string): KitStackPlugin | undefined {
    return this.plugins.get(id);
  }

  /**
   * Returns all currently registered plugins in registration order.
   */
  public getAll(): KitStackPlugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Returns list of all plugin manifests for catalog and search displays.
   */
  public getManifests(): PluginManifest[] {
    return this.getAll().map((p) => p.manifest);
  }

  /**
   * Filter registered plugins by category.
   */
  public getByCategory(category: PluginCategory): KitStackPlugin[] {
    return this.getAll().filter((p) => p.manifest.category === category);
  }

  /**
   * Subscribe to registry changes (new plugins added or removed).
   */
  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((fn) => fn());
  }
}

export const pluginRegistry = new PluginRegistry();
