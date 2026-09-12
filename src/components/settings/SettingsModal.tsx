import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Palette,
  Bell,
  Sun,
  Moon,
  Monitor,
  Volume2,
  VolumeX,
  Sparkles,
  RotateCcw,
  Check,
  Sliders,
  Play
} from 'lucide-react';
import { AppSettings, ThemeMode, TabStyle, InterfaceDensity } from '../../types';
import { ACCENT_PRESETS } from '../../data/tools';
import { ColorPicker } from '../shared/ColorPicker';
import { useNotifications } from '../../context/NotificationContext';
import { playNotificationChime } from '../../utils/sound';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [activeTab, setActiveTab] = useState<'colors' | 'notifications' | 'workspace'>('colors');
  const [showCustomColorPicker, setShowCustomColorPicker] = useState(false);
  const { addNotification } = useNotifications();

  if (!isOpen) return null;

  const handleThemeChange = (mode: ThemeMode) => {
    onUpdateSettings({ ...settings, theme: mode });
  };

  const handleAccentChange = (hex: string) => {
    onUpdateSettings({ ...settings, accentColor: hex });
  };

  const handleDensityChange = (density: InterfaceDensity) => {
    onUpdateSettings({ ...settings, density });
  };

  const handleTabStyleChange = (tabStyle: TabStyle) => {
    onUpdateSettings({ ...settings, tabStyle });
  };

  const handleNotificationToggle = (field: keyof typeof settings.notifications, value: boolean | number) => {
    onUpdateSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value,
      },
    });
  };

  const handleTestNotification = () => {
    addNotification({
      title: 'Settings Verified',
      message: `Notification preferences confirmed active (${settings.notifications.sound ? 'Sound enabled' : 'Muted'}).`,
      type: 'success',
      toolSource: 'Settings',
    });
  };

  const handleTestChime = () => {
    playNotificationChime('info');
  };

  const handleResetDefaults = () => {
    const defaults: AppSettings = {
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
    onUpdateSettings(defaults);
    addNotification({
      title: 'Preferences Reset',
      message: 'Restored default settings configuration.',
      type: 'info',
      toolSource: 'Settings',
    });
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 10 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-accent">
                <Sliders className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                  Repository Settings
                </h2>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  KitStack.org workspace & interface preferences
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Subheader Navigation Tabs */}
          <div className="flex border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 px-6">
            <button
              onClick={() => setActiveTab('colors')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'colors'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
              }`}
            >
              <Palette className="w-4 h-4" />
              <span>Color & Appearance</span>
            </button>

            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'notifications'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span>Notifications & Sound</span>
            </button>

            <button
              onClick={() => setActiveTab('workspace')}
              className={`flex items-center gap-2 py-3 px-3 text-xs font-semibold border-b-2 transition-colors ${
                activeTab === 'workspace'
                  ? 'border-accent text-accent'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 dark:text-neutral-400'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Tabs & Workspace</span>
            </button>
          </div>

          {/* Modal Content Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {activeTab === 'colors' && (
              <>
                {/* Theme Mode Selector */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                    Interface Theme Mode
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                        settings.theme === 'dark'
                          ? 'border-accent bg-accent-subtle text-neutral-900 dark:text-neutral-100 ring-2 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <Moon className="w-5 h-5 mb-1.5" />
                      <span className="text-xs font-medium">Dark Mode</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Recommended</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                        settings.theme === 'light'
                          ? 'border-accent bg-accent-subtle text-neutral-900 dark:text-neutral-100 ring-2 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <Sun className="w-5 h-5 mb-1.5" />
                      <span className="text-xs font-medium">Light Mode</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">High Brightness</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleThemeChange('system')}
                      className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all ${
                        settings.theme === 'system'
                          ? 'border-accent bg-accent-subtle text-neutral-900 dark:text-neutral-100 ring-2 ring-accent'
                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400'
                      }`}
                    >
                      <Monitor className="w-5 h-5 mb-1.5" />
                      <span className="text-xs font-medium">System Auto</span>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">Match OS</span>
                    </button>
                  </div>
                </div>

                {/* Accent Color Customization */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  <div className="flex items-center justify-between mb-2.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                      Brand Accent Color
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomColorPicker(!showCustomColorPicker)}
                      className="text-xs font-medium text-accent hover:underline flex items-center gap-1"
                    >
                      {showCustomColorPicker ? 'Use Preset Grid' : 'Open Custom Color Picker'}
                    </button>
                  </div>

                  {!showCustomColorPicker ? (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {ACCENT_PRESETS.map((preset) => {
                        const isSelected = settings.accentColor.toLowerCase() === preset.value.toLowerCase();
                        return (
                          <button
                            key={preset.value}
                            type="button"
                            onClick={() => handleAccentChange(preset.value)}
                            className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-all text-left ${
                              isSelected
                                ? 'border-neutral-900 dark:border-white ring-2 ring-accent bg-neutral-50 dark:bg-neutral-800'
                                : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                            }`}
                          >
                            <span
                              className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-white text-[10px]"
                              style={{ backgroundColor: preset.value }}
                            >
                              {isSelected && <Check className="w-3 h-3" />}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                                {preset.name}
                              </p>
                              <p className="text-[10px] font-mono text-neutral-400">{preset.value}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="mt-2">
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                        Customize any hex value using the shared library ColorPicker:
                      </p>
                      <ColorPicker
                        value={settings.accentColor}
                        onChange={handleAccentChange}
                        label="Active Theme Color"
                      />
                    </div>
                  )}
                </div>

                {/* Tab Layout Style */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                    Tab Header Style
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'modern-pill', name: 'Modern Pill', desc: 'Floating rounded pills' },
                      { id: 'chrome-tab', name: 'Browser Tab', desc: 'Connected folder tabs' },
                      { id: 'minimal-line', name: 'Minimal Line', desc: 'Clean baseline indicator' },
                    ].map((style) => (
                      <button
                        key={style.id}
                        type="button"
                        onClick={() => handleTabStyleChange(style.id as TabStyle)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          settings.tabStyle === style.id
                            ? 'border-accent bg-accent-subtle ring-2 ring-accent'
                            : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        <p className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {style.name}
                        </p>
                        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {style.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interface Density */}
                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2.5">
                    Interface Density
                  </label>
                  <div className="flex gap-2">
                    {(['compact', 'standard', 'comfortable'] as InterfaceDensity[]).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => handleDensityChange(d)}
                        className={`flex-1 py-2 px-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                          settings.density === d
                            ? 'border-accent bg-accent-subtle text-neutral-900 dark:text-neutral-100 font-semibold'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                {/* Master Switch */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Enable In-App Notifications
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Show toast banners for tool completions, copy actions, and alerts
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationToggle('enabled', !settings.notifications.enabled)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      settings.notifications.enabled ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.notifications.enabled ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Sound Chimes */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                      {settings.notifications.sound ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                        Audio Feedback & Chimes
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Web Audio synthesizer blips for actions and alerts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleTestChime}
                      aria-label="Preview Chime Sound"
                      className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 text-xs flex items-center gap-1"
                    >
                      <Play className="w-3 h-3" />
                      <span>Test</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNotificationToggle('sound', !settings.notifications.sound)}
                      className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                        settings.notifications.sound ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
                      }`}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                          settings.notifications.sound ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Tool Completion Alerts */}
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Tool Operations & Export Alerts
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Show feedback whenever a tool generates CSS, exports a palette, or formats code
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleNotificationToggle('toolAlerts', !settings.notifications.toolAlerts)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      settings.notifications.toolAlerts ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.notifications.toolAlerts ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Auto Dismiss Duration */}
                <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Toast Auto-Dismiss Time
                    </label>
                    <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-400">
                      {settings.notifications.autoDismissSeconds} seconds
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="10"
                    step="1"
                    value={settings.notifications.autoDismissSeconds}
                    onChange={(e) => handleNotificationToggle('autoDismissSeconds', parseInt(e.target.value, 10))}
                    className="w-full h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-theme"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>2s (Quick)</span>
                    <span>5s (Balanced)</span>
                    <span>10s (Persistent)</span>
                  </div>
                </div>

                {/* Send Test Notification Button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleTestNotification}
                    className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-800 dark:text-neutral-200 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Bell className="w-4 h-4 text-accent" />
                    <span>Send Test Notification Banner</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'workspace' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
                  <div>
                    <h4 className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      Persist Open Tabs across Sessions
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      Automatically restore active tools and custom tab titles when reopening KitStack
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, autoSaveTabs: !settings.autoSaveTabs })}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                      settings.autoSaveTabs ? 'bg-accent' : 'bg-neutral-300 dark:bg-neutral-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        settings.autoSaveTabs ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/30 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-1">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    KitStack.org Architecture
                  </p>
                  <p>
                    Tools in this repository run in isolated tabs while utilizing the shared utility framework (ColorPicker, Dialogs, Audio Chimes, and Responsive Layout Containers).
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset All Settings to Defaults</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900">
            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Preferences automatically saved to localStorage</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold transition-opacity hover:opacity-90 shadow-xs bg-accent"
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
