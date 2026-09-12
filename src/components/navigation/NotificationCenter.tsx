import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, Trash2, CheckCircle2, AlertTriangle, AlertCircle, Info, BellOff } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ isOpen, onClose }) => {
  const { notifications, unreadCount, markAllAsRead, clearAll, removeNotification } = useNotifications();

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible backdrop for dismissing */}
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.97 }}
        transition={{ duration: 0.15 }}
        className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">Notifications</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-accent">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 flex items-center gap-1"
                title="Mark all as read"
              >
                <Check className="w-3 h-3" />
                <span>Mark read</span>
              </button>
            )}
            {notifications.length > 0 && (
              <button
                onClick={clearAll}
                className="text-[11px] font-medium text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 flex items-center gap-1"
                title="Clear all notifications"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/60">
          {notifications.length === 0 ? (
            <div className="py-8 px-4 text-center text-neutral-400 dark:text-neutral-500">
              <BellOff className="w-7 h-7 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400">No recent notifications</p>
              <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">Tool activities will show here</p>
            </div>
          ) : (
            notifications.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={item.id}
                  className={`p-3.5 flex items-start gap-3 transition-colors ${
                    !item.read ? 'bg-accent-subtle' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/40'
                  }`}
                >
                  <div className="mt-0.5 flex-shrink-0">
                    {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                    {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                    {item.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-500" />}
                    {item.type === 'info' && <Info className="w-4 h-4 text-sky-500" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono flex-shrink-0">{dateStr}</span>
                    </div>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                    {item.toolSource && (
                      <span className="inline-block mt-1 text-[9px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                        {item.toolSource}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => removeNotification(item.id)}
                    className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                  >
                    <span className="sr-only">Remove</span>
                    <span className="text-xs">×</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </motion.div>
    </>
  );
};
