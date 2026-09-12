import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Pin, Palette, Layers, FileCode, Ruler, Boxes, Sparkles, Check } from 'lucide-react';
import { OpenTab } from '../../types';
import { REPOSITORY_TOOLS } from '../../data/tools';

interface MobileTabSwitcherProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: OpenTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onOpenCatalog: () => void;
  accentColor: string;
}

const getToolDef = (toolId: string) => {
  return (
    REPOSITORY_TOOLS.find((t) => t.id === toolId) || {
      id: toolId,
      name: 'Custom Tool',
      tagline: 'Custom Tool Workspace',
      description: '',
      category: 'Design & Color',
      icon: 'Sparkles',
      version: 'v1.0',
    }
  );
};

const getToolIcon = (iconName: string) => {
  switch (iconName) {
    case 'Palette':
      return Palette;
    case 'Layers':
      return Layers;
    case 'FileCode':
      return FileCode;
    case 'Ruler':
      return Ruler;
    case 'Boxes':
      return Boxes;
    default:
      return Sparkles;
  }
};

export const MobileTabSwitcher: React.FC<MobileTabSwitcherProps> = ({
  isOpen,
  onClose,
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onOpenCatalog,
  accentColor,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex flex-col justify-end sm:hidden">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        {/* Bottom Drawer */}
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 26, stiffness: 300 }}
          className="relative w-full max-h-[80vh] bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 rounded-t-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Handlebar & Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                Open Tools ({tabs.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenCatalog();
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 shadow-xs bg-accent"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Tool</span>
              </button>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List of Open Tabs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {tabs.map((tab) => {
              const tool = getToolDef(tab.toolId);
              const Icon = getToolIcon(tool.icon);
              const isActive = tab.tabId === activeTabId;

              return (
                <div
                  key={tab.tabId}
                  onClick={() => {
                    onSelectTab(tab.tabId);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                    isActive
                      ? 'border-accent bg-accent-subtle ring-2 ring-accent'
                      : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-accent">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                          {tab.customTitle || tool.name}
                        </h4>
                        {tab.isPinned && <Pin className="w-3 h-3 text-neutral-400 rotate-45" />}
                        {isActive && <Check className="w-3.5 h-3.5 text-accent" />}
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                        {tool.tagline}
                      </p>
                    </div>
                  </div>

                  {!tab.isPinned && tabs.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCloseTab(tab.tabId);
                      }}
                      className="p-2 rounded-lg text-neutral-400 hover:text-rose-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                      title="Close Tab"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
