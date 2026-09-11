import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Search,
  Palette,
  Layers,
  FileCode,
  Ruler,
  Boxes,
  Plus,
  ArrowRight,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { REPOSITORY_TOOLS } from '../../data/tools';
import { ToolDefinition } from '../../types';

interface ToolCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (toolId: string) => void;
  openToolIds: string[];
  accentColor: string;
}

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

export const ToolCatalogModal: React.FC<ToolCatalogModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  openToolIds,
  accentColor,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  if (!isOpen) return null;

  const categories = ['All', 'Design & Color', 'CSS & Layout', 'Code & Data', 'Library & Docs'];

  const filteredTools = REPOSITORY_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(search.toLowerCase()) ||
      tool.description.toLowerCase().includes(search.toLowerCase()) ||
      tool.tagline.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-xs"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="p-5 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: accentColor }}
                >
                  KS
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    KitStack Tool Repository
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Select a tool to open in a new tab. All tools share the KitStack common library.
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

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search repository tools by name, utility, or keyword..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
              </div>

              <div className="flex gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === cat
                        ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900'
                        : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid of Tools */}
          <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredTools.map((tool) => {
              const Icon = getToolIcon(tool.icon);
              const isOpenAlready = openToolIds.includes(tool.id);

              return (
                <div
                  key={tool.id}
                  className="group relative p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 hover:bg-white dark:hover:bg-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-xs"
                          style={{ backgroundColor: accentColor }}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {tool.name}
                            </h4>
                            <span className="text-[10px] font-mono text-neutral-400">{tool.version}</span>
                          </div>
                          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block font-medium">
                            {tool.category}
                          </span>
                        </div>
                      </div>

                      {tool.badge && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200/60 dark:border-neutral-700/60">
                          {tool.badge}
                        </span>
                      )}
                    </div>

                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                      {tool.tagline}
                    </p>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between">
                    <span className="text-[10px] text-neutral-400 font-mono">
                      {isOpenAlready ? 'Currently open in tabset' : 'Ready to load'}
                    </span>

                    <button
                      onClick={() => {
                        onSelectTool(tool.id);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all shadow-xs text-white"
                      style={{ backgroundColor: accentColor }}
                    >
                      {isOpenAlready ? (
                        <>
                          <span>Switch to Tab</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Open in Tab</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
            <span>All repository tools utilize the unified shared component library.</span>
            <button
              onClick={onClose}
              className="text-xs font-medium hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Close catalog
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
