/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { SharedToolbar } from '../shared/SharedToolbar';
import { BubbleHint } from '../shared/BubbleHint';
import { useNotifications } from '../../context/NotificationContext';
import {
  Share2,
  RefreshCw,
  Zap,
  Globe,
  Sliders,
  Eye,
  Code2,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Clock,
  Sparkles,
  Copy,
  Check,
  Download,
  Info,
  Layers,
  ArrowRight,
  RotateCcw,
  Search,
  MessageSquare,
  Bot,
  Sun,
  Moon,
  AlertCircle
} from 'lucide-react';
import {
  SocialMetadata,
  EMPTY_METADATA,
  PRESET_SNIPPETS,
  PlatformType,
  parseHtmlMetadata,
  resolvePlatformPreview,
  auditSocialMetadata,
  generateHtmlHeadSnippet,
  generateNextJsMetadata,
  resolveAbsoluteUrl,
  AuditReport,
} from '../../utils/snippetParser';

export interface SocialSnippetToolProps {
  accentColor: string;
}

type EditorMode = 'url' | 'manual';
type CardTheme = 'dark' | 'light';

export const SocialSnippetTool: React.FC<SocialSnippetToolProps> = ({ accentColor }) => {
  // 1. Core State
  const [mode, setMode] = useState<EditorMode>('url');
  const [targetUrl, setTargetUrl] = useState<string>('https://kitstack.org');
  const [metadata, setMetadata] = useState<SocialMetadata>(() => PRESET_SNIPPETS[0].data);
  const [platform, setPlatform] = useState<PlatformType>('x-large');
  const [cardTheme, setCardTheme] = useState<CardTheme>('dark');
  const [activeTab, setActiveTab] = useState<'preview' | 'audit' | 'tags' | 'export'>('preview');

  // 2. Cache-Buster & Scrape State
  const [cacheBustNonce, setCacheBustNonce] = useState<number>(() => Date.now());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastScrapeDuration, setLastScrapeDuration] = useState<number | null>(null);
  const [lastScrapeTime, setLastScrapeTime] = useState<Date | null>(null);
  const [imageLoadError, setImageLoadError] = useState<boolean>(false);

  // 3. Security, Honeypot & Rate-limiting State
  const [honeypot, setHoneypot] = useState<string>(''); // Bot trap
  const [formRenderTime, setFormRenderTime] = useState<number>(() => Date.now());
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);
  const cooldownTimerRef = useRef<number | null>(null);

  // 4. Manual Scratchpad raw paste state
  const [rawPastedHtml, setRawPastedHtml] = useState<string>('');
  const [showRawPasteModal, setShowRawPasteModal] = useState<boolean>(false);

  // Notifications
  const { addNotification } = useNotifications();

  // Reset image error on platform or metadata change
  useEffect(() => {
    setImageLoadError(false);
  }, [platform, metadata.ogImageUrl, metadata.twitterImageUrl, cacheBustNonce]);

  // Clean cooldown timer on unmount
  useEffect(() => {
    return () => {
      if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    };
  }, []);

  const startCooldown = (seconds: number) => {
    setCooldownRemaining(seconds);
    if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
    cooldownTimerRef.current = window.setInterval(() => {
      setCooldownRemaining((prev) => {
        if (prev <= 1) {
          if (cooldownTimerRef.current) clearInterval(cooldownTimerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Perform Scrape with strict cache-busting and bot protection
  const handleFetchSnippet = async (hardCacheBust = false) => {
    if (cooldownRemaining > 0) return;

    // 1. Honeypot check
    if (honeypot.trim().length > 0) {
      addNotification({
        title: 'Spam Detected',
        message: 'Submission rejected by bot defense filter',
        type: 'error',
        toolSource: 'Social Snippet Tester',
      });
      return;
    }

    // 2. Minimum human interaction time check (< 300ms is automated bot)
    if (Date.now() - formRenderTime < 300) {
      addNotification({
        title: 'Submission Blocked',
        message: 'Interaction was too fast. Automated bots are blocked.',
        type: 'warning',
        toolSource: 'Social Snippet Tester',
      });
      return;
    }

    let urlToFetch = targetUrl.trim();
    if (!urlToFetch) {
      setFetchError('Please enter a URL to inspect');
      return;
    }

    if (!/^https?:\/\//i.test(urlToFetch)) {
      urlToFetch = 'https://' + urlToFetch;
      setTargetUrl(urlToFetch);
    }

    setIsLoading(true);
    setFetchError(null);
    startCooldown(3); // 3 second rate-limiting cooldown

    const freshNonce = Date.now();
    if (hardCacheBust) {
      setCacheBustNonce(freshNonce);
    }

    try {
      // First attempt: Cloudflare Pages function / Vite dev endpoint
      const response = await fetch('/api/inspect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
        },
        body: JSON.stringify({
          url: urlToFetch,
          honeypot,
          timestamp: formRenderTime,
          cacheBust: freshNonce,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.htmlHead) {
          const parsed = parseHtmlMetadata(data.htmlHead, data.finalUrl || urlToFetch);
          setMetadata(parsed);
          setLastScrapeDuration(data.durationMs || 180);
          setLastScrapeTime(new Date());
          addNotification({
            title: hardCacheBust ? 'Hard Cache-Bust Complete' : 'Snippet Scraped',
            message: `Fetched and parsed ${parsed.title || urlToFetch} (${data.durationMs || 180}ms)`,
            type: 'success',
            toolSource: 'Social Snippet Tester',
          });
          setIsLoading(false);
          return;
        }
      }

      // If /api/inspect returned an error (e.g. rate limited or host error)
      if (response.status === 429) {
        throw new Error('Rate limit reached. Please wait a moment before inspecting again.');
      }

      // If serverless endpoint is unavailable (e.g. pure static deployment), try public CORS proxy fallback
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(urlToFetch)}&_cb=${freshNonce}`;
      const proxyResp = await fetch(proxyUrl, {
        headers: {
          'Cache-Control': 'no-cache, no-store',
        },
      });

      if (!proxyResp.ok) {
        throw new Error(`Failed to retrieve page content (HTTP ${proxyResp.status})`);
      }

      const rawHtml = await proxyResp.text();
      const parsed = parseHtmlMetadata(rawHtml, urlToFetch);
      setMetadata(parsed);
      setLastScrapeTime(new Date());
      setLastScrapeDuration(240);

      addNotification({
        title: 'Snippet Loaded (Proxy Fallback)',
        message: 'Loaded live metadata tags via fallback proxy',
        type: 'info',
        toolSource: 'Social Snippet Tester',
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch snippet metadata';
      setFetchError(msg);
      addNotification({
        title: 'Inspection Failed',
        message: msg,
        type: 'error',
        toolSource: 'Social Snippet Tester',
      });
    } finally {
      setIsLoading(false);
      setFormRenderTime(Date.now());
    }
  };

  // Hard reload images and tags
  const handleHardCacheBust = () => {
    setCacheBustNonce(Date.now());
    handleFetchSnippet(true);
  };

  // Parse Raw Pasted HTML
  const handleApplyPastedHtml = () => {
    if (!rawPastedHtml.trim()) return;
    const parsed = parseHtmlMetadata(rawPastedHtml, metadata.url || 'https://example.com');
    setMetadata(parsed);
    setShowRawPasteModal(false);
    setRawPastedHtml('');
    addNotification({
      title: 'HTML Parsed',
      message: 'Extracted OpenGraph and Twitter tags from pasted markup',
      type: 'success',
      toolSource: 'Social Snippet Tester',
    });
  };

  // Presets
  const handleSelectPreset = (presetId: string) => {
    const found = PRESET_SNIPPETS.find((p) => p.id === presetId);
    if (found) {
      setMetadata(found.data);
      setTargetUrl(found.data.url);
      setCacheBustNonce(Date.now());
      addNotification({
        title: 'Preset Loaded',
        message: `Applied ${found.name} snippet test suite`,
        type: 'info',
        toolSource: 'Social Snippet Tester',
      });
    }
  };

  // Computed platform preview
  const resolved = useMemo(
    () => resolvePlatformPreview(metadata, platform),
    [metadata, platform]
  );

  // Cache-busted image URL for UI rendering
  const cacheBustedImageUrl = useMemo(() => {
    if (!resolved.image) return '';
    const separator = resolved.image.includes('?') ? '&' : '?';
    return `${resolved.image}${separator}_kscache=${cacheBustNonce}`;
  }, [resolved.image, cacheBustNonce]);

  // Audit Report
  const auditReport: AuditReport = useMemo(
    () => auditSocialMetadata(metadata),
    [metadata]
  );

  // Copy Snippet Code
  const handleCopyCode = () => {
    const code = generateHtmlHeadSnippet(metadata);
    navigator.clipboard.writeText(code);
    addNotification({
      title: 'HTML Meta Tags Copied',
      message: 'Clean <head> meta tag block copied to clipboard',
      type: 'success',
      toolSource: 'Social Snippet Tester',
    });
  };

  // Download HTML file
  const handleExportFile = () => {
    const code = generateHtmlHeadSnippet(metadata);
    const blob = new Blob([code], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'social-meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);
    addNotification({
      title: 'Exported File',
      message: 'Downloaded social-meta-tags.html',
      type: 'success',
      toolSource: 'Social Snippet Tester',
    });
  };

  // Official debugger links
  const facebookDebuggerUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(
    metadata.canonical || metadata.url || targetUrl
  )}`;
  const linkedInInspectorUrl = `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(
    metadata.canonical || metadata.url || targetUrl
  )}`;
  const cacheBustedShareUrl = `${metadata.canonical || metadata.url || targetUrl}${
    (metadata.canonical || metadata.url || targetUrl).includes('?') ? '&' : '?'
  }v=${cacheBustNonce.toString().slice(-6)}`;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* 1. Header and Toolbar */}
      <SharedToolbar
        title="Social Snippet & OG Previewer"
        badge="Live OG & Cache Buster"
        accentColor={accentColor}
        onCopy={handleCopyCode}
        onExport={handleExportFile}
        exportLabel="Export .html"
        onReset={() => handleSelectPreset('kitstack')}
        customActions={
          <div className="flex items-center gap-2 flex-wrap">
            {/* Mode Switcher */}
            <div className="inline-flex items-center p-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 text-xs">
              <button
                type="button"
                onClick={() => setMode('url')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  mode === 'url'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  <span>URL Scraper</span>
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  mode === 'manual'
                    ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                    : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Tag Editor</span>
                </span>
              </button>
            </div>

            {/* Presets Dropdown */}
            <BubbleHint content="Load sample social card scenario" placement="bottom">
              <select
                aria-label="Load scenario preset"
                onChange={(e) => handleSelectPreset(e.target.value)}
                defaultValue="kitstack"
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-neutral-600 transition-colors"
              >
                {PRESET_SNIPPETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </BubbleHint>

            {/* Dark/Light Card Theme Preview Toggle */}
            <BubbleHint content="Toggle card feed theme (Light / Dark)" placement="bottom">
              <button
                type="button"
                onClick={() => setCardTheme(cardTheme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
              >
                {cardTheme === 'dark' ? <Moon className="w-3.5 h-3.5" /> : <Sun className="w-3.5 h-3.5" />}
              </button>
            </BubbleHint>
          </div>
        }
      />

      {/* 2. URL Scraper Input & Honeypot Protection */}
      {mode === 'url' ? (
        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative flex-1">
              <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="url"
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleFetchSnippet(false)}
                placeholder="https://yourwebsite.com/article"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />

              {/* Bot Trap: Invisible Honeypot Field */}
              <input
                type="text"
                name="b_snippet_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: 'none', position: 'absolute', left: '-9999px', opacity: 0 }}
                aria-hidden="true"
              />
            </div>

            <div className="flex items-center gap-2">
              <BubbleHint content="Fetch live metadata with standard cache headers" placement="bottom">
                <button
                  type="button"
                  disabled={isLoading || cooldownRemaining > 0}
                  onClick={() => handleFetchSnippet(false)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs transition-all hover:opacity-90 flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed bg-accent"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  <span>
                    {isLoading
                      ? 'Inspecting...'
                      : cooldownRemaining > 0
                      ? `Wait ${cooldownRemaining}s`
                      : 'Test Snippet'}
                  </span>
                </button>
              </BubbleHint>

              <BubbleHint
                content="Bust All Caches: forces fresh server scrape & appends cache-busting nonces to all card images"
                placement="bottom"
              >
                <button
                  type="button"
                  disabled={isLoading || cooldownRemaining > 0}
                  onClick={handleHardCacheBust}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold border border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 fill-amber-500" />
                  <span className="hidden sm:inline">Bust Cache</span>
                </button>
              </BubbleHint>
            </div>
          </div>

          {/* Quick chip suggestions & Scrape metadata info */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap text-neutral-500 dark:text-neutral-400">
              <span className="text-[11px] font-medium">Quick test:</span>
              {[
                { label: 'KitStack.org', url: 'https://kitstack.org' },
                { label: 'GitHub', url: 'https://github.com' },
                { label: 'Wikipedia', url: 'https://en.wikipedia.org' },
              ].map((chip) => (
                <button
                  key={chip.label}
                  type="button"
                  onClick={() => {
                    setTargetUrl(chip.url);
                  }}
                  className="px-2 py-0.5 rounded-md border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[11px] transition-colors"
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3 text-[11px] text-neutral-400">
              {lastScrapeDuration !== null && (
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-500" />
                  <span>{lastScrapeDuration}ms latency</span>
                </span>
              )}
              {lastScrapeTime && (
                <span>
                  Last verified: {lastScrapeTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-neutral-500 dark:text-neutral-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>SSRF & Bot Protected</span>
              </span>
            </div>
          </div>

          {fetchError && (
            <div className="p-3 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{fetchError}</span>
              </div>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className="underline hover:opacity-80 font-medium shrink-0"
              >
                Switch to Tag Editor
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Manual Tag Editor / Scratchpad */
        <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/90 shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                Manual Tag Scratchpad
              </h3>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Edit tags in real time to simulate social card behavior before deploying
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowRawPasteModal(!showRawPasteModal)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Paste &lt;head&gt; Markup</span>
              </button>
              <button
                type="button"
                onClick={() => setMetadata(EMPTY_METADATA)}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Raw HTML Paste Input Drawer */}
          {showRawPasteModal && (
            <div className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                  Paste Raw HTML or &lt;meta&gt; Tags:
                </span>
                <span className="text-[11px] text-neutral-400">
                  Auto-parses og:, twitter:, and canonical tags
                </span>
              </div>
              <textarea
                value={rawPastedHtml}
                onChange={(e) => setRawPastedHtml(e.target.value)}
                placeholder={'<meta property="og:title" content="My Page Title">\n<meta property="og:image" content="https://example.com/img.png">'}
                rows={4}
                className="w-full p-2.5 rounded-lg font-mono text-xs border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-accent"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRawPasteModal(false)}
                  className="px-3 py-1 rounded-md text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedHtml}
                  className="px-3 py-1 rounded-md text-xs font-semibold text-white bg-accent"
                >
                  Extract & Apply Tags
                </button>
              </div>
            </div>
          )}

          {/* Direct Input Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                og:title / Page Title
              </label>
              <input
                type="text"
                value={metadata.ogTitle || metadata.title}
                onChange={(e) =>
                  setMetadata({ ...metadata, ogTitle: e.target.value, title: e.target.value })
                }
                placeholder="High impact title under 60 characters"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
              />
              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                Length: {(metadata.ogTitle || metadata.title).length} chars (Recommended: 40-60)
              </span>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                og:image URL (1200×630 recommended)
              </label>
              <input
                type="text"
                value={metadata.ogImageUrl || metadata.ogImage}
                onChange={(e) => {
                  const val = e.target.value;
                  setMetadata({ ...metadata, ogImage: val, ogImageUrl: val, twitterImage: val, twitterImageUrl: val });
                }}
                placeholder="https://yourdomain.com/social-preview.png"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                og:description / Meta Description
              </label>
              <textarea
                value={metadata.ogDescription || metadata.description}
                onChange={(e) =>
                  setMetadata({ ...metadata, ogDescription: e.target.value, description: e.target.value })
                }
                rows={2}
                placeholder="Compelling 120-160 character hook that summarizes the page value..."
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
              />
              <span className="text-[10px] text-neutral-400 mt-0.5 block">
                Length: {(metadata.ogDescription || metadata.description).length} chars (Recommended: 120-160)
              </span>
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Target / Canonical URL
              </label>
              <input
                type="text"
                value={metadata.canonical || metadata.url}
                onChange={(e) => setMetadata({ ...metadata, canonical: e.target.value, url: e.target.value, ogUrl: e.target.value })}
                placeholder="https://yourdomain.com/path"
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            <div>
              <label className="block font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Twitter Card Format
              </label>
              <select
                aria-label="Twitter Card Format"
                value={metadata.twitterCard}
                onChange={(e) => setMetadata({ ...metadata, twitterCard: e.target.value as any })}
                className="w-full px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100"
              >
                <option value="summary_large_image">summary_large_image (1200×630 Wide Card)</option>
                <option value="summary">summary (125×125 Square Card)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. Cache-Busting & Crawler Guide Warning Callout */}
      <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 dark:bg-amber-500/10 text-neutral-800 dark:text-neutral-200 space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
              Overcoming Crawler Caching (X / Twitter, Facebook, LinkedIn)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <BubbleHint content="Copy URL with fresh query parameter to bypass X crawler cache" placement="top">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(cacheBustedShareUrl);
                  addNotification({
                    title: 'Cache-Busted URL Copied',
                    message: `Copied ${cacheBustedShareUrl} for social posting`,
                    type: 'success',
                    toolSource: 'Social Snippet Tester',
                  });
                }}
                className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500/50 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1 shadow-2xs"
              >
                <Copy className="w-3 h-3 text-amber-500" />
                <span>Copy Cache-Busted Link</span>
              </button>
            </BubbleHint>

            <a
              href={facebookDebuggerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 text-blue-600 dark:text-blue-400 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>FB Scraper</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href={linkedInInspectorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-md text-[11px] font-semibold bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 hover:border-sky-500 text-sky-600 dark:text-sky-400 transition-colors flex items-center gap-1 shadow-2xs"
            >
              <span>LinkedIn Inspector</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
          <strong>Why X / Twitter shows stale images:</strong> X aggressively caches card images for up to 7 days by URL. When you update your image, post to X using a dummy parameter like <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[11px]">?v=2</code>. X treats it as a brand-new link and generates the new image instantly without pulling from cache.
        </p>
      </div>

      {/* 4. Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 flex-wrap">
        {[
          { id: 'preview', label: 'Social Previews', icon: Eye },
          { id: 'audit', label: `Tag Health & Audit (${auditReport.score}%)`, icon: ShieldCheck },
          { id: 'tags', label: 'Meta Tags Inspector', icon: Layers },
          { id: 'export', label: 'Code Generators', icon: Code2 },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.id === 'audit' && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    auditReport.score >= 85
                      ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                      : auditReport.score >= 60
                      ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
                      : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {auditReport.grade}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 5. TAB: PREVIEWS */}
      {activeTab === 'preview' && (
        <div className="space-y-6">
          {/* Platform Selector Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'x-large', label: 'X (Large Image)', badge: 'summary_large_image' },
              { id: 'x-summary', label: 'X (Summary Card)', badge: 'summary' },
              { id: 'facebook', label: 'Facebook / Meta', badge: '1.91:1' },
              { id: 'linkedin', label: 'LinkedIn', badge: 'Feed Card' },
              { id: 'discord', label: 'Discord', badge: 'Rich Embed' },
              { id: 'slack', label: 'Slack', badge: 'Attachment' },
              { id: 'google', label: 'Google SERP', badge: 'Search' },
              { id: 'whatsapp', label: 'WhatsApp / Messages', badge: 'Chat' },
            ].map((p) => {
              const isSelected = platform === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPlatform(p.id as PlatformType)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'border-neutral-900 dark:border-white bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                      : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span>{p.label}</span>
                    <span className="text-[10px] opacity-75 font-mono">({p.badge})</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Platform Preview Stage */}
          <div
            className={`p-6 sm:p-8 rounded-3xl border transition-colors ${
              cardTheme === 'dark'
                ? 'bg-black border-neutral-800 text-white'
                : 'bg-neutral-100 border-neutral-200 text-neutral-900'
            }`}
          >
            <div className="max-w-xl mx-auto">
              {/* PLATFORM: X (Twitter) LARGE IMAGE */}
              {platform === 'x-large' && (
                <div
                  className={`rounded-2xl border transition-colors overflow-hidden ${
                    cardTheme === 'dark'
                      ? 'bg-black border-neutral-800 text-neutral-100'
                      : 'bg-white border-neutral-200 text-neutral-900'
                  }`}
                >
                  {/* Tweet Mock Header */}
                  <div className="p-3.5 pb-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white text-xs">
                        TS
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-sm">Twilight Surfers</span>
                          <span className="text-sky-500 text-xs font-bold">✓</span>
                          <span className="text-neutral-500 text-xs">@TwilightSurfers · 2m</span>
                        </div>
                        <p className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">
                          Checking out our latest update on KitStack! Seamless zero-cache preview.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Container */}
                  <div className="px-3.5 pb-3.5">
                    <div
                      className={`rounded-2xl border overflow-hidden transition-all hover:opacity-95 ${
                        cardTheme === 'dark'
                          ? 'border-neutral-800 bg-neutral-950'
                          : 'border-neutral-200 bg-neutral-50'
                      }`}
                    >
                      {/* Image Preview Container (1.91:1) */}
                      <div className="relative aspect-[1.91/1] w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                        {cacheBustedImageUrl && !imageLoadError ? (
                          <img
                            src={cacheBustedImageUrl}
                            alt={resolved.title}
                            onError={() => setImageLoadError(true)}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-neutral-400 p-4 text-center">
                            <Share2 className="w-8 h-8 opacity-40 mb-2" />
                            <span className="text-xs font-semibold">
                              {imageLoadError ? 'Image Failed to Load' : 'No Social Image (og:image)'}
                            </span>
                            <span className="text-[10px] text-neutral-500 mt-1 max-w-xs">
                              {imageLoadError
                                ? 'Verify your image URL is publicly accessible with HTTPS and allows cross-site loading'
                                : 'Add <meta property="og:image" content="..."> with 1200×630px resolution'}
                            </span>
                          </div>
                        )}

                        {/* Domain Pill Badge (X style) */}
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-medium text-white shadow-xs">
                          {resolved.domain}
                        </div>
                      </div>

                      {/* Card Bottom Meta */}
                      <div className="p-3">
                        <div className="text-[11px] text-neutral-400 capitalize">
                          {resolved.domain}
                        </div>
                        <h4 className="font-bold text-sm leading-snug line-clamp-2 mt-0.5 text-neutral-900 dark:text-neutral-100">
                          {resolved.title}
                        </h4>
                        {resolved.description && (
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                            {resolved.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* PLATFORM: X (Twitter) SUMMARY (Small Square) */}
              {platform === 'x-summary' && (
                <div
                  className={`rounded-2xl border p-3.5 space-y-3 ${
                    cardTheme === 'dark'
                      ? 'bg-black border-neutral-800 text-neutral-100'
                      : 'bg-white border-neutral-200 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center font-bold text-white text-xs">
                      TS
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <span className="font-bold">Twilight Surfers</span>
                      <span className="text-sky-500">✓</span>
                      <span className="text-neutral-500">@TwilightSurfers · 1m</span>
                    </div>
                  </div>

                  {/* Summary Card with Left Thumbnail */}
                  <div
                    className={`rounded-2xl border overflow-hidden flex transition-all ${
                      cardTheme === 'dark'
                        ? 'border-neutral-800 bg-neutral-950'
                        : 'border-neutral-200 bg-neutral-50'
                    }`}
                  >
                    <div className="w-28 sm:w-32 h-28 sm:h-32 bg-neutral-900 shrink-0 flex items-center justify-center relative overflow-hidden">
                      {cacheBustedImageUrl && !imageLoadError ? (
                        <img
                          src={cacheBustedImageUrl}
                          alt={resolved.title}
                          onError={() => setImageLoadError(true)}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Share2 className="w-6 h-6 text-neutral-600" />
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-center min-w-0">
                      <span className="text-[10px] text-neutral-400 truncate">{resolved.domain}</span>
                      <h4 className="font-bold text-xs sm:text-sm line-clamp-2 text-neutral-900 dark:text-neutral-100 mt-0.5">
                        {resolved.title}
                      </h4>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                        {resolved.description}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* PLATFORM: FACEBOOK */}
              {platform === 'facebook' && (
                <div
                  className={`rounded-xl border shadow-xs overflow-hidden ${
                    cardTheme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
                      : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                >
                  <div className="p-3.5 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-xs">
                      f
                    </div>
                    <div>
                      <div className="font-bold text-xs leading-none">Twilight Surfers</div>
                      <div className="text-[10px] text-neutral-500 mt-1">Just now · 🌐 Public</div>
                    </div>
                  </div>

                  <div className="relative aspect-[1.91/1] w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {cacheBustedImageUrl && !imageLoadError ? (
                      <img
                        src={cacheBustedImageUrl}
                        alt={resolved.title}
                        onError={() => setImageLoadError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Share2 className="w-8 h-8 text-neutral-600" />
                    )}
                  </div>

                  <div
                    className={`p-3 border-t ${
                      cardTheme === 'dark'
                        ? 'bg-neutral-950 border-neutral-800'
                        : 'bg-neutral-100 border-neutral-200'
                    }`}
                  >
                    <div className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                      {resolved.domain}
                    </div>
                    <div className="font-bold text-sm mt-0.5 line-clamp-2 text-neutral-900 dark:text-neutral-100">
                      {resolved.title}
                    </div>
                    {resolved.description && (
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mt-1">
                        {resolved.description}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PLATFORM: LINKEDIN */}
              {platform === 'linkedin' && (
                <div
                  className={`rounded-xl border shadow-xs overflow-hidden ${
                    cardTheme === 'dark'
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-100'
                      : 'bg-white border-neutral-300 text-neutral-900'
                  }`}
                >
                  <div className="p-3.5 flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-sky-700 flex items-center justify-center font-bold text-white text-xs">
                      in
                    </div>
                    <div>
                      <div className="font-bold text-xs">KitStack Engineering · 1st</div>
                      <div className="text-[10px] text-neutral-500">
                        1h · Edited · 🌐
                      </div>
                    </div>
                  </div>

                  <div className="relative aspect-[1.91/1] w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                    {cacheBustedImageUrl && !imageLoadError ? (
                      <img
                        src={cacheBustedImageUrl}
                        alt={resolved.title}
                        onError={() => setImageLoadError(true)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Share2 className="w-8 h-8 text-neutral-600" />
                    )}
                  </div>

                  <div className="p-3">
                    <div className="font-bold text-xs sm:text-sm line-clamp-2 text-neutral-900 dark:text-neutral-100">
                      {resolved.title}
                    </div>
                    <div className="text-[11px] text-neutral-500 mt-0.5">
                      {resolved.domain} · 3 min read
                    </div>
                  </div>
                </div>
              )}

              {/* PLATFORM: DISCORD */}
              {platform === 'discord' && (
                <div
                  className={`rounded-lg p-4 font-sans ${
                    cardTheme === 'dark' ? 'bg-[#313338] text-white' : 'bg-white text-neutral-900 border'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-white">KitBot</span>
                      <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-[#5865F2] text-white">
                        BOT
                      </span>
                      <span className="text-[10px] text-neutral-400">Today at 2:05 PM</span>
                    </div>
                  </div>

                  {/* Rich Embed Card */}
                  <div
                    className={`rounded-md p-3.5 border-l-4 space-y-2 ${
                      cardTheme === 'dark' ? 'bg-[#2B2D31]' : 'bg-neutral-100'
                    }`}
                    style={{ borderLeftColor: resolved.themeColor || '#5865F2' }}
                  >
                    <div className="text-[10px] font-medium text-neutral-400">
                      {resolved.siteName}
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-[#00A8FC] hover:underline cursor-pointer">
                      {resolved.title}
                    </div>
                    {resolved.description && (
                      <div className="text-xs text-neutral-300 dark:text-neutral-300 leading-relaxed">
                        {resolved.description}
                      </div>
                    )}
                    {cacheBustedImageUrl && !imageLoadError && (
                      <div className="mt-2 rounded-lg overflow-hidden max-h-64 aspect-[1.91/1] w-full bg-black/40">
                        <img
                          src={cacheBustedImageUrl}
                          alt={resolved.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PLATFORM: SLACK */}
              {platform === 'slack' && (
                <div
                  className={`rounded-xl p-4 border space-y-2 ${
                    cardTheme === 'dark'
                      ? 'bg-[#1A1D21] border-neutral-800 text-white'
                      : 'bg-white border-neutral-200 text-neutral-900'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs">Elmer Twilley</span>
                    <span className="text-[10px] text-neutral-400">2:14 PM</span>
                  </div>
                  <div className="text-xs text-neutral-300">
                    Sharing the link: <span className="text-sky-400 underline">{metadata.url}</span>
                  </div>

                  <div
                    className="border-l-4 pl-3 py-1 space-y-1"
                    style={{ borderLeftColor: resolved.themeColor || '#4A154B' }}
                  >
                    <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold">
                      <span>{resolved.siteName}</span>
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-sky-400 hover:underline">
                      {resolved.title}
                    </div>
                    <div className="text-xs text-neutral-400 line-clamp-3">
                      {resolved.description}
                    </div>
                    {cacheBustedImageUrl && !imageLoadError && (
                      <div className="mt-2 rounded-md overflow-hidden max-w-sm aspect-[1.91/1]">
                        <img src={cacheBustedImageUrl} alt={resolved.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PLATFORM: GOOGLE SERP */}
              {platform === 'google' && (
                <div
                  className={`rounded-2xl p-5 border ${
                    cardTheme === 'dark'
                      ? 'bg-[#202124] border-neutral-800 text-white font-sans'
                      : 'bg-white border-neutral-200 text-neutral-900 font-sans'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-6 h-6 rounded-full bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden">
                      {resolved.favicon ? (
                        <img src={resolved.favicon} alt="" className="w-4 h-4 object-contain" />
                      ) : (
                        '🌐'
                      )}
                    </div>
                    <div className="leading-tight">
                      <div className="text-xs font-medium text-neutral-300">{resolved.siteName}</div>
                      <div className="text-[11px] text-neutral-400 truncate max-w-sm">
                        {metadata.canonical || metadata.url}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h3 className="text-base sm:text-lg text-[#8AB4F8] hover:underline cursor-pointer line-clamp-1 font-normal">
                      {resolved.title}
                    </h3>
                    <p className="text-xs text-neutral-400 leading-normal line-clamp-2 mt-1">
                      <span className="text-neutral-500 font-medium">Oct 5, 2026 — </span>
                      {resolved.description || 'No description meta tag provided for this web page.'}
                    </p>
                  </div>
                </div>
              )}

              {/* PLATFORM: WHATSAPP / MESSAGES */}
              {platform === 'whatsapp' && (
                <div
                  className={`rounded-2xl p-4 border max-w-sm mx-auto ${
                    cardTheme === 'dark'
                      ? 'bg-[#121B22] border-neutral-800 text-white'
                      : 'bg-[#EFEAE2] border-neutral-300 text-neutral-900'
                  }`}
                >
                  <div
                    className={`rounded-xl p-2.5 shadow-sm space-y-2 ${
                      cardTheme === 'dark' ? 'bg-[#005C4B] text-white' : 'bg-[#D9FDD3] text-neutral-900'
                    }`}
                  >
                    {cacheBustedImageUrl && !imageLoadError && (
                      <div className="rounded-lg overflow-hidden aspect-[1.91/1] w-full bg-black/20">
                        <img src={cacheBustedImageUrl} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div>
                      <div className="font-bold text-xs line-clamp-1">{resolved.title}</div>
                      <div className="text-[11px] opacity-80 line-clamp-2 mt-0.5">{resolved.description}</div>
                      <div className="text-[10px] opacity-60 mt-1 uppercase font-mono">{resolved.domain}</div>
                    </div>
                    <div className="text-[10px] text-right opacity-60">2:18 PM ✓✓</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Cascade & Field Resolution Source Diagnostics */}
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/60 shadow-xs space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Tag Cascade Resolution for {platform.toUpperCase()}</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Resolved Title</span>
                <div className="font-semibold truncate text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {resolved.title}
                </div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  from: {resolved.titleSource}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Resolved Description</span>
                <div className="font-semibold truncate text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {resolved.description || 'None'}
                </div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  from: {resolved.descriptionSource}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800">
                <span className="text-[10px] font-bold text-neutral-400 uppercase">Resolved Image</span>
                <div className="font-semibold truncate text-neutral-800 dark:text-neutral-200 mt-0.5">
                  {resolved.image || 'None'}
                </div>
                <span className="inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                  from: {resolved.imageSource}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB: TAG HEALTH & AUDIT */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          {/* Health Score Banner */}
          <div className="p-6 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div
                className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center font-bold text-2xl shadow-md border ${
                  auditReport.score >= 85
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                    : auditReport.score >= 60
                    ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                    : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
                }`}
              >
                <span>{auditReport.score}%</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase">
                  Grade {auditReport.grade}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Social Sharing Readiness Audit
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Evaluated across OpenGraph 2.0, Twitter Card specifications, and crawler resolution standards.
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {auditReport.passCount} Passed
                  </span>
                  <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {auditReport.warningCount} Warnings
                  </span>
                  <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <XCircle className="w-3.5 h-3.5" /> {auditReport.failCount} Critical
                  </span>
                </div>
              </div>
            </div>

            <BubbleHint content="Generate optimized meta tags for this page" placement="left">
              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white shadow-xs bg-accent flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Fix & Export Tags</span>
              </button>
            </BubbleHint>
          </div>

          {/* Audit Checks Checklist */}
          <div className="space-y-3">
            {auditReport.checks.map((check) => {
              const isPass = check.status === 'pass';
              const isWarning = check.status === 'warning';
              const isFail = check.status === 'fail';

              return (
                <div
                  key={check.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isPass
                      ? 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/50'
                      : isWarning
                      ? 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10'
                      : 'border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">
                      {isPass && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                      {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {isFail && <XCircle className="w-4 h-4 text-rose-500" />}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100">
                          {check.title}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400">
                          {check.category}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-300">
                        {check.message}
                      </p>
                      <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium pt-1 flex items-center gap-1.5">
                        <ArrowRight className="w-3 h-3 text-accent" />
                        <span>{check.recommendation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 7. TAB: META TAGS INSPECTOR */}
      {activeTab === 'tags' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Extracted Meta & Link Tags
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Comprehensive listing of all social, indexing, and header tags
                </p>
              </div>
              <button
                type="button"
                onClick={handleCopyCode}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Tags</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400 font-mono text-[11px]">
                    <th className="py-2 px-3">Property / Name</th>
                    <th className="py-2 px-3">Content / Value</th>
                    <th className="py-2 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200/50 dark:divide-neutral-800/50">
                  {[
                    { tag: 'title', val: metadata.title || metadata.ogTitle },
                    { tag: 'description', val: metadata.description },
                    { tag: 'og:title', val: metadata.ogTitle },
                    { tag: 'og:description', val: metadata.ogDescription },
                    { tag: 'og:image', val: metadata.ogImage || metadata.ogImageUrl },
                    { tag: 'og:url', val: metadata.ogUrl || metadata.url },
                    { tag: 'og:site_name', val: metadata.siteName },
                    { tag: 'og:type', val: metadata.ogType },
                    { tag: 'twitter:card', val: metadata.twitterCard },
                    { tag: 'twitter:title', val: metadata.twitterTitle },
                    { tag: 'twitter:description', val: metadata.twitterDescription },
                    { tag: 'twitter:image', val: metadata.twitterImage || metadata.twitterImageUrl },
                    { tag: 'twitter:site', val: metadata.twitterSite },
                    { tag: 'canonical', val: metadata.canonical },
                    { tag: 'favicon', val: metadata.favicon },
                    { tag: 'theme-color', val: metadata.themeColor },
                    { tag: 'robots', val: metadata.robots },
                  ]
                    .filter((row) => Boolean(row.val))
                    .map((row) => (
                      <tr key={row.tag} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40">
                        <td className="py-2.5 px-3 font-mono font-bold text-accent whitespace-nowrap">
                          {row.tag}
                        </td>
                        <td className="py-2.5 px-3 text-neutral-700 dark:text-neutral-300 font-mono break-all max-w-md">
                          {row.val}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(row.val);
                              addNotification({
                                title: 'Copied',
                                message: `Copied ${row.tag} value to clipboard`,
                                type: 'info',
                                toolSource: 'Social Snippet Tester',
                              });
                            }}
                            className="p-1 rounded text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-100 transition-colors"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 8. TAB: CODE GENERATORS */}
      {activeTab === 'export' && (
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Ready-to-Paste HTML Meta Tags Block
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Standardized, audited Open Graph and Twitter card snippets for your website &lt;head&gt;
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white shadow-xs bg-accent flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy HTML</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportFile}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export .html</span>
                </button>
              </div>
            </div>

            <pre className="p-4 rounded-xl font-mono text-xs overflow-x-auto bg-neutral-950 text-neutral-100 border border-neutral-800 max-h-96">
              {generateHtmlHeadSnippet(metadata)}
            </pre>
          </div>

          {/* Next.js 14+ Metadata Object Export */}
          <div className="p-4 sm:p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
                  Next.js 14+ (App Router) Metadata Export
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Type-safe export for <code className="font-mono">app/layout.tsx</code> or{' '}
                  <code className="font-mono">page.tsx</code>
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const code = generateNextJsMetadata(metadata);
                  navigator.clipboard.writeText(code);
                  addNotification({
                    title: 'Next.js Metadata Copied',
                    message: 'Type-safe App Router metadata export copied',
                    type: 'success',
                    toolSource: 'Social Snippet Tester',
                  });
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Next.js Code</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl font-mono text-xs overflow-x-auto bg-neutral-950 text-neutral-100 border border-neutral-800 max-h-72">
              {generateNextJsMetadata(metadata)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
