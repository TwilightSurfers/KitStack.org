import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

export const ToastBanner: React.FC = () => {
  const { activeToast, dismissToast } = useNotifications();

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {activeToast && (
          <motion.div
            key={activeToast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg backdrop-blur-md bg-white/95 dark:bg-neutral-900/95 border-neutral-200/80 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <div className="mt-0.5 flex-shrink-0">
              {activeToast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              {activeToast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-500" />}
              {activeToast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
              {activeToast.type === 'info' && <Info className="w-5 h-5 text-sky-500" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs tracking-tight">{activeToast.title}</span>
                {activeToast.toolSource && (
                  <span className="text-[10px] px-1.5 py-0.2 font-mono rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                    {activeToast.toolSource}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5 leading-relaxed">
                {activeToast.message}
              </p>
            </div>

            <button
              onClick={dismissToast}
              className="flex-shrink-0 p-1 rounded-md text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
