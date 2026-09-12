import { PluginManifest, PluginContext, PluginNotificationOptions } from './types';
import { createPluginStorage } from './registry';
import { playNotificationChime } from '../utils/sound';
import { BubbleHint } from '../components/shared/BubbleHint';

interface CreatePluginContextArgs {
  manifest: PluginManifest;
  theme: 'dark' | 'light';
  accentColor: string;
  density: 'compact' | 'standard' | 'comfortable';
  addNotification: (params: {
    title: string;
    message: string;
    type?: 'info' | 'success' | 'warning' | 'error';
    toolSource?: string;
  }) => void;
  isSoundEnabled: boolean;
}

export function createPluginContext({
  manifest,
  theme,
  accentColor,
  density,
  addNotification,
  isSoundEnabled,
}: CreatePluginContextArgs): PluginContext {
  const storage = createPluginStorage(manifest.id);

  const notify = (options: PluginNotificationOptions) => {
    addNotification({
      title: options.title,
      message: options.message,
      type: options.type || 'info',
      toolSource: manifest.name,
    });
    if (options.sound !== false && isSoundEnabled) {
      playNotificationChime(options.type || 'info');
    }
  };

  const playChime = (tone: 'info' | 'success' | 'warning' | 'error' | 'pop' = 'info') => {
    if (isSoundEnabled) {
      playNotificationChime(tone);
    }
  };

  const copyToClipboard = async (text: string, label?: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text);
      notify({
        title: label ? `${label} Copied` : 'Copied to Clipboard',
        message: text.length > 50 ? `${text.slice(0, 48)}...` : text,
        type: 'success',
      });
      return true;
    } catch (err) {
      notify({
        title: 'Clipboard Error',
        message: 'Could not access system clipboard',
        type: 'error',
      });
      return false;
    }
  };

  const downloadFile = (filename: string, content: string, mimeType = 'text/plain') => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      notify({
        title: 'Download Started',
        message: `Exported "${filename}" successfully`,
        type: 'info',
      });
    } catch {
      notify({
        title: 'Download Failed',
        message: `Could not export file ${filename}`,
        type: 'error',
      });
    }
  };

  return {
    manifest,
    theme,
    accentColor,
    density,
    storage,
    notify,
    playChime,
    copyToClipboard,
    downloadFile,
    BubbleHint,
  };
}
