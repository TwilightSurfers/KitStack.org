import React, { useState, useMemo } from 'react';
import { SharedToolbar } from '../shared/SharedToolbar';
import { useNotifications } from '../../context/NotificationContext';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  RotateCcw,
  FileCode,
  Eye,
  Columns,
  Wand2,
  Sliders,
  CheckCircle2,
  Clipboard,
  ShieldCheck,
  Hash,
  Clock,
  Type
} from 'lucide-react';
import {
  markdownToCleanHtml,
  sanitizeAiCharacters,
  calculateArticleMetrics,
  DEFAULT_SANITIZER_OPTIONS,
  SAMPLE_AI_BLOG_POST,
  SanitizerOptions
} from '../../utils/markdownBlogEngine';

interface MarkdownBlogToolProps {
  accentColor: string;
}

type ViewMode = 'split' | 'html' | 'preview';

export const MarkdownBlogTool: React.FC<MarkdownBlogToolProps> = ({ accentColor }) => {
  const [markdown, setMarkdown] = useState<string>(SAMPLE_AI_BLOG_POST);
  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [options, setOptions] = useState<SanitizerOptions>(DEFAULT_SANITIZER_OPTIONS);
  const [showOptions, setShowOptions] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const { addNotification } = useNotifications();

  // Compute metrics, sanitization, and clean HTML
  const metrics = useMemo(() => calculateArticleMetrics(markdown), [markdown]);

  const { stats } = useMemo(
    () => sanitizeAiCharacters(markdown, options),
    [markdown, options]
  );

  const cleanHtml = useMemo(
    () => markdownToCleanHtml(markdown, options),
    [markdown, options]
  );

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(cleanHtml);
    setCopied(true);
    addNotification({
      title: 'Clean HTML Copied',
      message: `Copied ${metrics.wordCount} words of semantic blog HTML to clipboard`,
      type: 'success',
      toolSource: 'Markdown to HTML',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadHtml = () => {
    const filename = options.outputFullDoc ? 'article-post.html' : 'article-fragment.html';
    const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    addNotification({
      title: 'HTML Exported',
      message: `Downloaded ${filename} successfully`,
      type: 'success',
      toolSource: 'Markdown to HTML',
    });
  };

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setMarkdown(text);
        addNotification({
          title: 'Markdown Loaded',
          message: 'Pasted article from clipboard into editor',
          type: 'info',
          toolSource: 'Markdown to HTML',
        });
      }
    } catch {
      addNotification({
        title: 'Clipboard Permission',
        message: 'Could not access clipboard. Please paste manually into the editor.',
        type: 'warning',
      });
    }
  };

  const handleLoadSample = () => {
    setMarkdown(SAMPLE_AI_BLOG_POST);
    addNotification({
      title: 'Sample Article Loaded',
      message: 'Loaded sample AI blog post with em-dashes and smart quotes',
      type: 'info',
      toolSource: 'Markdown to HTML',
    });
  };

  const handleClear = () => {
    setMarkdown('');
    addNotification({
      title: 'Editor Cleared',
      message: 'Markdown input has been cleared',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6">
      <SharedToolbar
        title="Markdown Blog to Clean HTML"
        badge="Semantic Publisher • AI Scrubber"
        accentColor={accentColor}
        onCopy={handleCopyHtml}
        onDownload={handleDownloadHtml}
        onClear={handleClear}
      />

      {/* Metrics & AI Cleaning Overview Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
            <Type className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              {metrics.wordCount.toLocaleString()}
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Total Words</div>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              {metrics.readingTimeMinutes} min read
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">Reading Time</div>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
            <Hash className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              {metrics.headingCount} Headings
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
              {metrics.paragraphCount} Paragraphs
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-300">
            <FileCode className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
              {cleanHtml.length.toLocaleString()} B
            </div>
            <div className="text-[10px] text-neutral-500 dark:text-neutral-400">HTML Output Size</div>
          </div>
        </div>

        {/* AI Sanitization Summary Card */}
        <div className="col-span-2 p-3 rounded-xl border border-accent-subtle bg-accent-subtle flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent text-accent-contrast flex items-center justify-center">
              <Wand2 className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <span>{stats.totalCleaned} AI Artifacts Cleaned</span>
                {stats.totalCleaned > 0 && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </div>
              <div className="text-[10px] text-neutral-600 dark:text-neutral-400">
                {stats.emDashesCleaned} em dashes • {stats.curlyQuotesCleaned + stats.curlyApostrophesCleaned} quotes • {stats.invisibleSpacesCleaned} hidden spaces
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-1 shadow-2xs"
          >
            <Sliders className="w-3 h-3" />
            <span>{showOptions ? 'Hide Settings' : 'Settings'}</span>
          </button>
        </div>
      </div>

      {/* AI Sanitization & Publisher Options Drawer */}
      {showOptions && (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-2.5">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                AI Sanitization & Publishing Settings
              </h3>
            </div>
            <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
              Tailored for WordPress, Ghost, Substack & Static CMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Option 1: Em Dash Mode */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                AI Em Dash (—) Normalization
              </label>
              <select
                value={options.emDashMode}
                onChange={(e) =>
                  setOptions({ ...options, emDashMode: e.target.value as any })
                }
                className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="spaced-comma">Replace with spaced comma (", ") [Recommended]</option>
                <option value="hyphen">Replace with standard hyphen (" - ")</option>
                <option value="space">Replace with simple space (" ")</option>
                <option value="strip">Strip completely ("")</option>
                <option value="keep">Keep original em dashes</option>
              </select>
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                Eliminates AI cadence overuse without altering sentence meaning.
              </p>
            </div>

            {/* Option 2: Curly Quotes */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="opt-straighten-quotes"
                type="checkbox"
                checked={options.straightenQuotes}
                onChange={(e) => setOptions({ ...options, straightenQuotes: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-accent accent-theme"
              />
              <label htmlFor="opt-straighten-quotes" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Straighten Curly Quotes & Apostrophes
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                  Converts “smart quotes” and ‘apostrophes’ to clean universal ASCII (" and ').
                </span>
              </label>
            </div>

            {/* Option 3: Strip Invisible Spaces */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="opt-invisible-spaces"
                type="checkbox"
                checked={options.stripInvisibleSpaces}
                onChange={(e) => setOptions({ ...options, stripInvisibleSpaces: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-accent accent-theme"
              />
              <label htmlFor="opt-invisible-spaces" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Scrub Zero-Width & Hidden Spaces
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                  Removes \u200B zero-width spaces, BOM markers, and soft hyphens.
                </span>
              </label>
            </div>

            {/* Option 4: Escape CMS Brackets */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="opt-escape-brackets"
                type="checkbox"
                checked={options.escapeCmsBrackets}
                onChange={(e) => setOptions({ ...options, escapeCmsBrackets: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-accent accent-theme"
              />
              <label htmlFor="opt-escape-brackets" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Escape CMS Brackets (&#123; and &#125;)
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                  Prevents build crashes in Liquid, Hugo, Astro, Ghost, and WordPress templates.
                </span>
              </label>
            </div>

            {/* Option 5: Anchor IDs */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="opt-anchor-ids"
                type="checkbox"
                checked={options.generateAnchorIds}
                onChange={(e) => setOptions({ ...options, generateAnchorIds: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-accent accent-theme"
              />
              <label htmlFor="opt-anchor-ids" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Generate Heading Anchor IDs
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                  Adds id="slug" attributes to &lt;h1&gt;-&lt;h6&gt; for easy Table of Contents linking.
                </span>
              </label>
            </div>

            {/* Option 6: Output Full Doc */}
            <div className="flex items-start gap-3 pt-1">
              <input
                id="opt-full-doc"
                type="checkbox"
                checked={options.outputFullDoc}
                onChange={(e) => setOptions({ ...options, outputFullDoc: e.target.checked })}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-accent accent-theme"
              />
              <label htmlFor="opt-full-doc" className="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span className="font-semibold block text-neutral-900 dark:text-neutral-100">
                  Full Standalone HTML Document
                </span>
                <span className="text-[10px] text-neutral-500 dark:text-neutral-400 block">
                  Unchecked outputs clean fragment; checked adds &lt;!DOCTYPE&gt;, head, and responsive styles.
                </span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Editor Controls & View Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* View Mode Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-neutral-200/60 dark:bg-neutral-900 border border-neutral-300/60 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'split'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Split Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('html')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'html'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Clean HTML Code</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'preview'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-xs'
                : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Reader Preview</span>
          </button>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePasteFromClipboard}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Clipboard className="w-3.5 h-3.5" />
            <span>Paste Markdown</span>
          </button>

          <button
            type="button"
            onClick={handleLoadSample}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Load Sample Post</span>
          </button>

          <button
            type="button"
            onClick={handleCopyHtml}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 bg-accent hover:opacity-90 transition-opacity"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'HTML Copied!' : 'Copy Clean HTML'}</span>
          </button>
        </div>
      </div>

      {/* WORKSPACE VIEWS */}
      {/* 1. SPLIT VIEW */}
      {viewMode === 'split' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Markdown Input */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Markdown Source (.md)
                </span>
              </div>
              <span className="text-[10px] font-mono text-neutral-400">
                {markdown.length} chars • {metrics.wordCount} words
              </span>
            </div>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              placeholder="Paste your blog article in markdown format here (# Heading, **bold**, lists, etc.)..."
              rows={24}
              className="w-full p-4 font-mono text-xs text-neutral-900 dark:text-neutral-100 bg-transparent border-0 focus:outline-none resize-y leading-relaxed"
            />
          </div>

          {/* Right: Live Reader Preview */}
          <div className="flex flex-col rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Live Blog Preview (Sanitized)
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold">
                Semantic HTML
              </span>
            </div>

            <div className="p-6 overflow-y-auto max-h-[580px] prose dark:prose-invert max-w-none text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed space-y-4">
              <div
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
                className="blog-preview-content space-y-3.5 [&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-neutral-900 [&_h1]:dark:text-neutral-50 [&_h1]:tracking-tight [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h2]:dark:text-neutral-100 [&_h2]:mt-6 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-neutral-800 [&_h3]:dark:text-neutral-200 [&_p]:text-neutral-700 [&_p]:dark:text-neutral-300 [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:text-neutral-700 [&_li]:dark:text-neutral-300 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_blockquote]:dark:text-neutral-400 [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:bg-neutral-100 [&_pre]:dark:bg-black/50 [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-xs [&_code]:font-mono [&_code]:text-xs [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:dark:bg-neutral-800 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-neutral-300 [&_th]:dark:border-neutral-700 [&_th]:p-2 [&_th]:text-left [&_th]:bg-neutral-50 [&_th]:dark:bg-neutral-800 [&_td]:border [&_td]:border-neutral-300 [&_td]:dark:border-neutral-700 [&_td]:p-2 [&_hr]:border-neutral-200 [&_hr]:dark:border-neutral-800 [&_a]:text-accent [&_a]:underline"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. CLEAN HTML CODE VIEW */}
      {viewMode === 'html' && (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-2xs space-y-0">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-950/50">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-accent" />
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                Generated Semantic HTML ({options.outputFullDoc ? 'Full Document' : 'Clean Fragment'})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="px-2.5 py-1 text-xs font-medium rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center gap-1 shadow-2xs"
              >
                <Download className="w-3 h-3" />
                <span>Download .html</span>
              </button>
              <button
                type="button"
                onClick={handleCopyHtml}
                className="px-3 py-1 text-xs font-semibold rounded-md shadow-xs flex items-center gap-1 bg-accent hover:opacity-90"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>Copy HTML</span>
              </button>
            </div>
          </div>

          <pre className="p-5 font-mono text-xs text-neutral-800 dark:text-neutral-200 bg-neutral-50/50 dark:bg-neutral-950 overflow-x-auto whitespace-pre leading-relaxed max-h-[640px]">
            {cleanHtml}
          </pre>
        </div>
      )}

      {/* 3. READER PREVIEW */}
      {viewMode === 'preview' && (
        <div className="max-w-3xl mx-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-8 sm:p-12 shadow-md space-y-6">
          <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-subtle text-accent border border-accent-subtle">
                Reader Simulation
              </span>
              <span className="text-xs text-neutral-400">• {metrics.readingTimeMinutes} min read</span>
            </div>
            <button
              type="button"
              onClick={handleCopyHtml}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-accent hover:opacity-90 flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy Article HTML</span>
            </button>
          </div>

          <div
            dangerouslySetInnerHTML={{ __html: cleanHtml }}
            className="blog-preview-content space-y-4 [&_h1]:text-3xl [&_h1]:font-extrabold [&_h1]:text-neutral-900 [&_h1]:dark:text-neutral-50 [&_h1]:tracking-tight [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h2]:dark:text-neutral-100 [&_h2]:mt-8 [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-neutral-800 [&_h3]:dark:text-neutral-200 [&_p]:text-neutral-700 [&_p]:dark:text-neutral-300 [&_p]:text-base [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:text-neutral-700 [&_li]:dark:text-neutral-300 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-neutral-600 [&_blockquote]:dark:text-neutral-400 [&_blockquote]:my-6 [&_pre]:p-4 [&_pre]:rounded-xl [&_pre]:bg-neutral-100 [&_pre]:dark:bg-black/50 [&_pre]:overflow-x-auto [&_pre]:font-mono [&_pre]:text-xs [&_code]:font-mono [&_code]:text-xs [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-neutral-100 [&_code]:dark:bg-neutral-800 [&_table]:w-full [&_table]:border-collapse [&_table]:my-6 [&_th]:border [&_th]:border-neutral-300 [&_th]:dark:border-neutral-700 [&_th]:p-3 [&_th]:text-left [&_th]:bg-neutral-50 [&_th]:dark:bg-neutral-800 [&_td]:border [&_td]:border-neutral-300 [&_td]:dark:border-neutral-700 [&_td]:p-3 [&_hr]:border-neutral-200 [&_hr]:dark:border-neutral-800 [&_hr]:my-8 [&_a]:text-accent [&_a]:underline"
          />
        </div>
      )}
    </div>
  );
};
