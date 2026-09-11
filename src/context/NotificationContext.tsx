import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { NotificationItem, NotificationSettings } from '../types';
import { playNotificationChime } from '../utils/sound';

interface NotificationContextValue {
  notifications: NotificationItem[];
  unreadCount: number;
  addNotification: (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  removeNotification: (id: string) => void;
  activeToast: NotificationItem | null;
  dismissToast: () => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const NotificationProvider: React.FC<{
  children: React.ReactNode;
  settings: NotificationSettings;
}> = ({ children, settings }) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('kitstack_notifications');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'welcome-init',
        title: 'KitStack.org Initialized',
        message: 'Shared tool shell ready. Customizable tabs and component library loaded.',
        type: 'success',
        timestamp: Date.now() - 1000 * 60 * 5,
        read: false,
        toolSource: 'System',
      },
    ];
  });

  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('kitstack_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  const addNotification = useCallback(
    (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
      if (!settings.enabled) return;

      const newItem: NotificationItem = {
        ...item,
        id: 'notif_' + Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        read: false,
      };

      setNotifications((prev) => [newItem, ...prev].slice(0, 50));
      setActiveToast(newItem);

      if (settings.sound) {
        playNotificationChime(newItem.type);
      }
    },
    [settings]
  );

  // Handle toast auto-dismiss
  useEffect(() => {
    if (!activeToast) return;
    const duration = (settings.autoDismissSeconds || 4) * 1000;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, duration);
    return () => clearTimeout(timer);
  }, [activeToast, settings.autoDismissSeconds]);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAllAsRead,
        clearAll,
        removeNotification,
        activeToast,
        dismissToast,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
