import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  X,
  Pin,
  PinOff,
  ChevronLeft,
  ChevronRight,
  Palette,
  Layers,
  FileCode,
  Ruler,
  Boxes,
  Sparkles,
  Copy,
  LayoutGrid,
  FileText
} from 'lucide-react';
import { OpenTab, TabStyle, ToolDefinition } from '../../types';
import { REPOSITORY_TOOLS } from '../../data/tools';

interface TabBarProps {
  tabs: OpenTab[];
  activeTabId: string;
  onSelectTab: (tabId: string) => void;
  onCloseTab: (tabId: string) => void;
  onPinTab: (tabId: string) => void;
  onDuplicateTab: (tabId: string) => void;
  onOpenCatalog: () => void;
  onOpenMobileSwitcher: () => void;
  tabStyle: TabStyle;
  accentColor: string;
}

const getToolDef = (toolId: string): ToolDefinition => {
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
    case 'FileText':
      return FileText;
    default:
      return Sparkles;
  }
};

export const TabBar: React.FC<TabBarProps> = ({
  tabs,
  activeTabId,
  onSelectTab,
  onCloseTab,
  onPinTab,
  onDuplicateTab,
  onOpenCatalog,
  onOpenMobileSwitcher,
  tabStyle,
  accentColor,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [contextMenuTabId, setContextMenuTabId] = useState<string | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll boundary availability for chevrons and gradient fade overlays
  const updateScrollState = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    const maxScroll = Math.max(0, scrollWidth - clientWidth);
    setCanScrollLeft(scrollLeft > 2);
    setCanScrollRight(scrollLeft < maxScroll - 2);
  }, []);

  // Stop active auto-scroll loop
  const stopAutoScroll = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    updateScrollState();
  }, [updateScrollState]);

  // Continuous auto-scroll exclusively while hovering on chevrons
  const startAutoScroll = useCallback(
    (direction: 'left' | 'right') => {
      stopAutoScroll();
      const el = scrollContainerRef.current;
      if (!el) return;

      // Silky glide speed in pixels per animation frame (~360px-450px/sec)
      const stepPixels = direction === 'left' ? -6 : 6;

      const step = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollLeft, scrollWidth, clientWidth } = container;
        const maxScroll = Math.max(0, scrollWidth - clientWidth);

        if (direction === 'left') {
          if (scrollLeft <= 0) {
            stopAutoScroll();
            return;
          }
          container.scrollLeft = Math.max(0, scrollLeft + stepPixels);
        } else {
          if (scrollLeft >= maxScroll - 1) {
            stopAutoScroll();
            return;
          }
          container.scrollLeft = Math.min(maxScroll, scrollLeft + stepPixels);
        }

        animationFrameRef.current = requestAnimationFrame(step);
      };

      animationFrameRef.current = requestAnimationFrame(step);
    },
    [stopAutoScroll]
  );

  // Single step scroll on click for accessibility
  const stepScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -220 : 220;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Keep scroll bounds synchronized on tabs update, window resize, or container dimension shift
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    updateScrollState();

    const resizeObserver = new ResizeObserver(() => {
      updateScrollState();
    });
    resizeObserver.observe(el);

    window.addEventListener('resize', updateScrollState);
    window.addEventListener('pointerup', stopAutoScroll);

    return () => {
      stopAutoScroll();
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateScrollState);
      window.removeEventListener('pointerup', stopAutoScroll);
    };
  }, [tabs, updateScrollState, stopAutoScroll]);

  // Ensure newly active tab is scrolled into view smoothly
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const activeEl = el.querySelector(`[data-tab-id="${activeTabId}"]`) as HTMLElement | null;
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      // Update state after scrolling completes
      setTimeout(updateScrollState, 300);
    }
  }, [activeTabId, updateScrollState]);

  return (
    <div className="relative border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/90 dark:bg-neutral-900/90 backdrop-blur-md select-none">
      <div className="flex items-center px-1 sm:px-2">
        {/* Scroll Left Button: 33% bigger chevron (21.3px), hover-triggered auto-scroll */}
        <div className="flex-shrink-0 z-20 flex items-center pr-1">
          <button
            type="button"
            onMouseEnter={() => {
              if (canScrollLeft) startAutoScroll('left');
            }}
            onMouseMove={() => {
              if (!animationFrameRef.current && canScrollLeft) startAutoScroll('left');
            }}
            onMouseLeave={stopAutoScroll}
            onPointerUp={stopAutoScroll}
            onClick={() => stepScroll('left')}
            disabled={!canScrollLeft}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
              canScrollLeft
                ? 'text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-800 cursor-pointer shadow-xs active:scale-95'
                : 'text-neutral-300 dark:text-neutral-700 opacity-30 cursor-default pointer-events-none'
            }`}
            title={canScrollLeft ? 'Hover to auto-scroll left' : 'Start of tabs'}
            aria-label="Auto-scroll tabs left"
          >
            {/* 33% larger than standard 16px (16px * 1.33 = 21.3px) */}
            <ChevronLeft className="w-[21.3px] h-[21.3px] flex-shrink-0" strokeWidth={2.25} />
          </button>
        </div>

        {/* Scrollable Tabs Track Container with Left & Right Gradient Fades */}
        <div className="relative flex-1 min-w-0 flex items-center">
          {/* Left Fade Overlay: Visible only when tabs overflow to the left */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-neutral-50/95 dark:from-neutral-900/95 to-transparent z-10 transition-opacity duration-200 ${
              canScrollLeft ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Scrollable Track */}
          <div
            ref={scrollContainerRef}
            onScroll={updateScrollState}
            className="w-full flex items-center gap-1.5 overflow-x-auto py-2 px-1 scrollbar-none touch-pan-x"
          >
            <AnimatePresence initial={false}>
              {tabs.map((tab) => {
                const tool = getToolDef(tab.toolId);
                const Icon = getToolIcon(tool.icon);
                const isActive = tab.tabId === activeTabId;
                const isPinned = tab.isPinned;

                // Different styling variants based on user settings
                let tabClasses = '';
                if (tabStyle === 'modern-pill') {
                  tabClasses = isActive
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs border border-neutral-200/90 dark:border-neutral-700/80'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/60 dark:hover:bg-neutral-800/60 border border-transparent';
                } else if (tabStyle === 'chrome-tab') {
                  tabClasses = isActive
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border-t-2 border-accent border-x border-neutral-200 dark:border-neutral-700 rounded-t-lg -mb-px'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/40 dark:hover:bg-neutral-800/40 border border-transparent';
                } else {
                  // minimal-line
                  tabClasses = isActive
                    ? 'text-neutral-900 dark:text-neutral-100 border-b-2 border-accent font-semibold'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 border-b-2 border-transparent';
                }

                return (
                  <motion.div
                    key={tab.tabId}
                    data-tab-id={tab.tabId}
                    layout
                    initial={{ opacity: 0, scale: 0.9, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.15 } }}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    className="relative group flex-shrink-0"
                  >
                    <button
                      type="button"
                      onClick={() => onSelectTab(tab.tabId)}
                      onContextMenu={(e) => {
                        e.preventDefault();
                        setContextMenuTabId(contextMenuTabId === tab.tabId ? null : tab.tabId);
                      }}
                      className={`h-9 px-3 min-w-[44px] rounded-lg text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${tabClasses}`}
                      title={`${tool.name} (Right-click for options)`}
                    >
                      {/* Active Accent Indicator Dot for modern-pill */}
                      {isActive && tabStyle === 'modern-pill' && (
                        <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-accent" />
                      )}

                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isActive ? 'text-accent' : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      />

                      <span className="truncate max-w-[110px] sm:max-w-[140px] text-left">
                        {tab.customTitle || tool.name}
                      </span>

                      {/* Pin icon if pinned */}
                      {isPinned && (
                        <Pin className="w-3 h-3 text-neutral-400 dark:text-neutral-500 rotate-45 flex-shrink-0" />
                      )}

                      {/* Close Tab Button */}
                      {!isPinned && (
                        <span
                          role="button"
                          tabIndex={0}
                          onClick={(e) => {
                            e.stopPropagation();
                            onCloseTab(tab.tabId);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.stopPropagation();
                              onCloseTab(tab.tabId);
                            }
                          }}
                          className={`p-0.5 rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-opacity ${
                            isActive ? 'opacity-90' : 'opacity-40 group-hover:opacity-100'
                          }`}
                          title="Close Tab"
                        >
                          <X className="w-3 h-3" />
                        </span>
                      )}
                    </button>

                    {/* Context Menu for Tab actions */}
                    {contextMenuTabId === tab.tabId && (
                      <>
                        <div
                          className="fixed inset-0 z-30"
                          onClick={() => setContextMenuTabId(null)}
                        />
                        <div className="absolute top-10 left-0 z-40 w-44 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl py-1 text-xs text-neutral-700 dark:text-neutral-200">
                          <button
                            type="button"
                            onClick={() => {
                              onPinTab(tab.tabId);
                              setContextMenuTabId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                          >
                            {isPinned ? <PinOff className="w-3.5 h-3.5" /> : <Pin className="w-3.5 h-3.5" />}
                            <span>{isPinned ? 'Unpin Tab' : 'Pin Tab'}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onDuplicateTab(tab.tabId);
                              setContextMenuTabId(null);
                            }}
                            className="w-full px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 flex items-center gap-2"
                          >
                            <Copy className="w-3.5 h-3.5" />
                            <span>Duplicate Tool Tab</span>
                          </button>
                          {!isPinned && (
                            <button
                              type="button"
                              onClick={() => {
                                onCloseTab(tab.tabId);
                                setContextMenuTabId(null);
                              }}
                              className="w-full px-3 py-2 text-left hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 border-t border-neutral-100 dark:border-neutral-800"
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Close Tab</span>
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* New Tab Button */}
            <button
              type="button"
              onClick={onOpenCatalog}
              className="h-9 px-2.5 rounded-lg border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 hover:bg-white dark:hover:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1 text-xs font-medium transition-all flex-shrink-0 cursor-pointer"
              title="Open Tool Catalog to Add New Tab"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Tool</span>
            </button>
          </div>

          {/* Right Fade Overlay: Visible only when tabs overflow to the right */}
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-neutral-50/95 dark:from-neutral-900/95 to-transparent z-10 transition-opacity duration-200 ${
              canScrollRight ? 'opacity-100' : 'opacity-0'
            }`}
          />
        </div>

        {/* Scroll Right Button: 33% bigger chevron (21.3px), hover-triggered auto-scroll */}
        <div className="flex-shrink-0 z-20 flex items-center gap-1 pl-1">
          <button
            type="button"
            onMouseEnter={() => {
              if (canScrollRight) startAutoScroll('right');
            }}
            onMouseMove={() => {
              if (!animationFrameRef.current && canScrollRight) startAutoScroll('right');
            }}
            onMouseLeave={stopAutoScroll}
            onPointerUp={stopAutoScroll}
            onClick={() => stepScroll('right')}
            disabled={!canScrollRight}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition-all ${
              canScrollRight
                ? 'text-neutral-700 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-200/80 dark:hover:bg-neutral-800 cursor-pointer shadow-xs active:scale-95'
                : 'text-neutral-300 dark:text-neutral-700 opacity-30 cursor-default pointer-events-none'
            }`}
            title={canScrollRight ? 'Hover to auto-scroll right' : 'End of tabs'}
            aria-label="Auto-scroll tabs right"
          >
            {/* 33% larger than standard 16px (16px * 1.33 = 21.3px) */}
            <ChevronRight className="w-[21.3px] h-[21.3px] flex-shrink-0" strokeWidth={2.25} />
          </button>

          {/* Mobile All-Tabs Grid Trigger */}
          <button
            type="button"
            onClick={onOpenMobileSwitcher}
            className="flex sm:hidden h-9 w-9 items-center justify-center rounded-lg text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors"
            title="View open tabs grid"
            aria-label="View open tabs grid"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
