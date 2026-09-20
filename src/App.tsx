/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { AppSettings, OpenTab, ThemeMode } from './types';
import { NotificationProvider } from './context/NotificationContext';
import { ToastBanner } from './components/shared/ToastBanner';
import { DesignerBadge } from './components/shared/DesignerBadge';
import { SiteFooter, LegalView } from './components/shared/SiteFooter';
import { LegalPages } from './components/legal/LegalPages';
import { Header } from './components/navigation/Header';
import { TabBar } from './components/navigation/TabBar';
import { SettingsModal } from './components/settings/SettingsModal';
import { ToolCatalogModal } from './components/navigation/ToolCatalogModal';
import { MobileTabSwitcher } from './components/navigation/MobileTabSwitcher';
import { pluginRegistry } from './plugins/registry';
import { createPluginContext } from './plugins/context';
import './plugins/core-plugins';
import { REPOSITORY_TOOLS } from './data/tools';
import { Plus, Boxes } from 'lucide-react';
import { useNotifications } from './context/NotificationContext';
import { applyThemeCssVariables } from './utils/color';

const PluginViewport: React.FC<{
  activeTab?: OpenTab;
  settings: AppSettings;
  onOpenCatalog: () => void;
}> = ({ activeTab, settings, onOpenCatalog }) => {
  const { addNotification } = useNotifications();

  if (!activeTab) {
    return (
      <div className="py-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-12 h-12 rounded-2xl mx-auto flex items-center justify-center shadow-md bg-accent">
          <Boxes className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
            No Active Tool Tab
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Select or launch a tool from the KitStack repository catalog to start your workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenCatalog}
          className="px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow-xs transition-opacity hover:opacity-90 bg-accent"
        >
          <Plus className="w-4 h-4" />
          <span>Open Tool Catalog</span>
        </button>
      </div>
    );
  }

  const plugin = pluginRegistry.get(activeTab.toolId);

  if (!plugin) {
    return (
      <div className="py-16 text-center space-y-3 max-w-md mx-auto">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
          <Boxes className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
          Plugin Not Found: {activeTab.toolId}
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          This tool was not registered with the KitStack PluginRegistry.
        </p>
      </div>
    );
  }

  const context = createPluginContext({
    manifest: plugin.manifest,
    theme: settings.theme === 'light' ? 'light' : 'dark',
    accentColor: settings.accentColor,
    density: settings.density,
    addNotification,
    isSoundEnabled: settings.notifications.sound && settings.notifications.enabled,
  });

  const PluginComponent = plugin.component;
  return <PluginComponent context={context} />;
};

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  accentColor: '#4F46E5',
  density: 'standard',
  tabStyle: 'modern-pill',
  notifications: {
    enabled: true,
    sound: true,
    toolAlerts: true,
    autoDismissSeconds: 4,
  },
  autoSaveTabs: true,
};

const DEFAULT_TABS: OpenTab[] = [
  { tabId: 'tab-1', toolId: 'color-studio', createdAt: 1, isPinned: true },
  { tabId: 'tab-2', toolId: 'sixty-four-px', createdAt: 2 },
  { tabId: 'tab-3', toolId: 'markdown-html', createdAt: 3 },
  { tabId: 'tab-4', toolId: 'shadow-glow', createdAt: 4 },
  { tabId: 'tab-5', toolId: 'json-format', createdAt: 5 },
  { tabId: 'tab-6', toolId: 'unit-converter', createdAt: 6 },
  { tabId: 'tab-7', toolId: 'library-explorer', createdAt: 7 },
];

export default function App() {
  // 1. Settings State
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('kitstack_settings');
      return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  // 2. Open Tabs State
  const [tabs, setTabs] = useState<OpenTab[]>(() => {
    try {
      if (settings.autoSaveTabs) {
        const saved = localStorage.getItem('kitstack_open_tabs');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Auto-introduce newly added tools like sixty-four-px so returning users see them immediately
            const hasSixtyFour = parsed.some((t: OpenTab) => t.toolId === 'sixty-four-px');
            if (!hasSixtyFour) {
              parsed.splice(1, 0, {
                tabId: `tab-${Date.now()}`,
                toolId: 'sixty-four-px',
                createdAt: Date.now(),
              });
            }
            const hasMarkdown = parsed.some((t: OpenTab) => t.toolId === 'markdown-html');
            if (!hasMarkdown) {
              parsed.push({
                tabId: `tab-${Date.now() + 1}`,
                toolId: 'markdown-html',
                createdAt: Date.now() + 1,
              });
            }
            return parsed;
          }
        }
      }
    } catch {
      // fallback
    }
    return DEFAULT_TABS;
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    try {
      const savedActive = localStorage.getItem('kitstack_active_tab_id');
      if (savedActive && tabs.some((t) => t.tabId === savedActive)) {
        return savedActive;
      }
    } catch {
      // fallback
    }
    return tabs[0]?.tabId || 'tab-1';
  });

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [isMobileSwitcherOpen, setIsMobileSwitcherOpen] = useState(false);

  // In-app legal pages (no react-router)
  const [legalView, setLegalView] = useState<LegalView | null>(null);

  // Sync settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kitstack_settings', JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Sync activeTabId to localStorage
  useEffect(() => {
    try {
      if (activeTabId) {
        localStorage.setItem('kitstack_active_tab_id', activeTabId);
      }
    } catch {
      // ignore
    }
  }, [activeTabId]);

  // Fallback activeTabId if current active tab is closed
  useEffect(() => {
    if (tabs.length > 0 && !tabs.some((t) => t.tabId === activeTabId)) {
      setActiveTabId(tabs[0].tabId);
    }
  }, [tabs, activeTabId]);

  // Sync tabs to localStorage if enabled
  useEffect(() => {
    if (settings.autoSaveTabs) {
      try {
        localStorage.setItem('kitstack_open_tabs', JSON.stringify(tabs));
      } catch {
        // ignore
      }
    }
  }, [tabs, settings.autoSaveTabs]);

  // Handle Theme Mode (Dark/Light/System) and Accent Color Synchronization
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      applyThemeCssVariables(settings.accentColor, isDark);
    };

    if (settings.theme === 'dark') {
      applyTheme(true);
    } else if (settings.theme === 'light') {
      applyTheme(false);
    } else {
      // System mode
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(media.matches);
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }
  }, [settings.theme, settings.accentColor]);

  // Density padding configuration
  const densityContainerClass = useMemo(() => {
    switch (settings.density) {
      case 'compact':
        return 'p-3 sm:p-4 max-w-6xl';
      case 'comfortable':
        return 'p-6 sm:p-8 max-w-7xl';
      default:
        return 'p-4 sm:p-6 max-w-7xl';
    }
  }, [settings.density]);

  // Tab operations
  const handleSelectTab = (tabId: string) => {
    setLegalView(null);
    setActiveTabId(tabId);
  };

  const handleCloseTab = (tabIdToClose: string) => {
    const updated = tabs.filter((t) => t.tabId !== tabIdToClose);
    setTabs(updated);

    if (activeTabId === tabIdToClose) {
      // switch to another tab if available
      const nextTab = updated[updated.length - 1];
      if (nextTab) {
        setActiveTabId(nextTab.tabId);
      } else {
        setActiveTabId('');
      }
    }
  };

  const handlePinTab = (tabIdToPin: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.tabId === tabIdToPin ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const handleDuplicateTab = (tabIdToDup: string) => {
    const target = tabs.find((t) => t.tabId === tabIdToDup);
    if (!target) return;
    const newTabId = 'tab-' + Math.random().toString(36).substring(2, 7);
    const newTab: OpenTab = {
      tabId: newTabId,
      toolId: target.toolId,
      customTitle: `${target.customTitle || REPOSITORY_TOOLS.find((r) => r.id === target.toolId)?.name} (Copy)`,
      createdAt: Date.now(),
      isPinned: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
    setLegalView(null);
  };

  const handleOpenTool = (toolId: string) => {
    setLegalView(null);
    // If tool is already open, switch to it
    const existing = tabs.find((t) => t.toolId === toolId);
    if (existing) {
      setActiveTabId(existing.tabId);
      return;
    }

    // Otherwise create a new tab
    const newTabId = 'tab-' + Math.random().toString(36).substring(2, 7);
    const newTab: OpenTab = {
      tabId: newTabId,
      toolId,
      createdAt: Date.now(),
      isPinned: false,
    };
    setTabs((prev) => [...prev, newTab]);
    setActiveTabId(newTabId);
  };

  const handleToggleTheme = () => {
    const nextTheme: ThemeMode = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
  };

  const activeTab = tabs.find((t) => t.tabId === activeTabId);

  return (
    <NotificationProvider settings={settings.notifications}>
      <div className="min-h-screen flex flex-col bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
        {/* Header with Branding, Search, Theme, Notifications & Settings */}
        <Header
          settings={settings}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onToggleTheme={handleToggleTheme}
          activeTabsCount={tabs.length}
        />

        {/* Top Tabset Bar */}
        <TabBar
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
          onPinTab={handlePinTab}
          onDuplicateTab={handleDuplicateTab}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          onOpenMobileSwitcher={() => setIsMobileSwitcherOpen(true)}
          tabStyle={settings.tabStyle}
          accentColor={settings.accentColor}
        />

        {/* Main Content Viewport: legal panel or active tool via plugin registry */}
        <main className="flex-1 overflow-y-auto pb-6">
          <div className={`mx-auto w-full ${densityContainerClass}`}>
            {legalView ? (
              <LegalPages
                view={legalView}
                onBack={() => setLegalView(null)}
                accentColor={settings.accentColor}
              />
            ) : (
              <PluginViewport
                activeTab={activeTab}
                settings={settings}
                onOpenCatalog={() => setIsCatalogOpen(true)}
              />
            )}
          </div>
        </main>

        <SiteFooter onOpenLegal={setLegalView} accentColor={settings.accentColor} />

        {/* Floating Notification Toast */}
        <ToastBanner />

        {/* Designer credit badge (almost1st.lol style) */}
        <DesignerBadge />

        {/* Intuitive Settings Modal (Colors & Notifications) */}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings}
          onUpdateSettings={setSettings}
        />

        {/* Tool Catalog Modal for opening new tools in tabs */}
        <ToolCatalogModal
          isOpen={isCatalogOpen}
          onClose={() => setIsCatalogOpen(false)}
          onSelectTool={handleOpenTool}
          openToolIds={tabs.map((t) => t.toolId)}
          accentColor={settings.accentColor}
        />

        {/* Mobile Tab Switcher Drawer for small screens */}
        <MobileTabSwitcher
          isOpen={isMobileSwitcherOpen}
          onClose={() => setIsMobileSwitcherOpen(false)}
          tabs={tabs}
          activeTabId={activeTabId}
          onSelectTab={handleSelectTab}
          onCloseTab={handleCloseTab}
          onOpenCatalog={() => setIsCatalogOpen(true)}
          accentColor={settings.accentColor}
        />
      </div>
    </NotificationProvider>
  );
}