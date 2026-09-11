export type ThemeMode = 'dark' | 'light' | 'system';

export type InterfaceDensity = 'compact' | 'standard' | 'comfortable';

export type TabStyle = 'modern-pill' | 'chrome-tab' | 'minimal-line';

export interface AccentColorPreset {
  name: string;
  value: string; // hex
  label: string;
}

export interface NotificationSettings {
  enabled: boolean;
  sound: boolean;
  toolAlerts: boolean;
  autoDismissSeconds: number;
}

export interface AppSettings {
  theme: ThemeMode;
  accentColor: string;
  density: InterfaceDensity;
  tabStyle: TabStyle;
  notifications: NotificationSettings;
  autoSaveTabs: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
  read: boolean;
  toolSource?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  tagline: string;
  description: string;
  category: 'Design & Color' | 'CSS & Layout' | 'Code & Data' | 'Library & Docs' | 'Utilities';
  icon: string;
  badge?: string;
  version: string;
}

export interface OpenTab {
  tabId: string;
  toolId: string;
  customTitle?: string;
  isPinned?: boolean;
  createdAt: number;
}
