import React, { useState } from 'react';
import {
  Layers,
  Settings,
  Bell,
  Sun,
  Moon,
  Search,
  Plus,
  Compass,
  Laptop
} from 'lucide-react';
import { AppSettings } from '../../types';
import { useNotifications } from '../../context/NotificationContext';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenCatalog: () => void;
  onToggleTheme: () => void;
  activeTabsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  onOpenSettings,
  onOpenCatalog,
  onToggleTheme,
  activeTabsCount,
}) => {
  const { unreadCount } = useNotifications();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="relative z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3">
      {/* Brand & Identity */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-xs bg-accent">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-50">
                KitStack<span className="text-accent">.org</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60">
                Tool Repository
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 hidden sm:block">
              Unified components & multi-tab workspace
            </span>
          </div>
        </div>
      </div>

      {/* Center Search / Tool Quick Opener (Desktop) */}
      <div className="hidden md:flex items-center">
        <button
          onClick={onOpenCatalog}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 bg-neutral-100/70 dark:bg-neutral-800/60 hover:bg-neutral-200/60 dark:hover:bg-neutral-700/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 transition-all w-64 justify-between"
        >
          <div className="flex items-center gap-2">
            <Search className="w-3.5 h-3.5" />
            <span>Search or add tools...</span>
          </div>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-500 dark:text-neutral-300">
            Catalog
          </kbd>
        </button>
      </div>

      {/* Right Actions: Catalog, Theme, Notifications, Settings */}
      <div className="flex items-center gap-1.5">
        {/* Quick Add Tool Button for Mobile & Desktop */}
        <button
          onClick={onOpenCatalog}
          className="md:hidden p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Browse Tool Catalog"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Quick Theme Toggle */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={`Switch Theme (Current: ${settings.theme})`}
        >
          {settings.theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-neutral-600" />
          )}
        </button>

        {/* Notifications Dropdown Button */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2 rounded-xl text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors relative"
            title="Notifications & Activity"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent ring-2 ring-white dark:ring-neutral-900 animate-pulse" />
            )}
          </button>

          <NotificationCenter isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
        </div>

        {/* Settings Button */}
        <button
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700/80 bg-neutral-50/50 dark:bg-neutral-800/50 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 text-xs font-semibold transition-all shadow-2xs"
          title="Configure Color Preferences and Notifications"
        >
          <Settings className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
};
