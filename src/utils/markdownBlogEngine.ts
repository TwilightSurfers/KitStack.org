/**
 * Markdown to Clean Semantic HTML Engine & AI Character Sanitizer
 * Designed specifically for bloggers, content creators, and CMS publishing.
 */

export interface SanitizerOptions {
  cleanAiCharacters: boolean;
  emDashMode: 'spaced-comma' | 'hyphen' | 'space' | 'strip' | 'keep';
  straightenQuotes: boolean;
  stripInvisibleSpaces: boolean;
  escapeCmsBrackets: boolean;
  normalizeEllipsis: boolean;
  generateAnchorIds: boolean;
  externalLinksNewTab: boolean;
  wrapInArticleTag: boolean;
  outputFullDoc: boolean;
}

export interface SanitizationStats {
  emDashesCleaned: number;
  enDashesCleaned: number;
  curlyQuotesCleaned: number;
  curlyApostrophesCleaned: number;
  invisibleSpacesCleaned: number;
  cmsBracketsEscaped: number;
  ellipsisCleaned: number;
  totalCleaned: number;
}

export interface ArticleMetrics {
  wordCount: number;
  charCount: number;
  readingTimeMinutes: number;
  paragraphCount: number;
  headingCount: number;
}

export const DEFAULT_SANITIZER_OPTIONS: SanitizerOptions = {
  cleanAiCharacters: true,
  emDashMode: 'spaced-comma',
  straightenQuotes: true,
  stripInvisibleSpaces: true,
  escapeCmsBrackets: true,
  normalizeEllipsis: true,
  generateAnchorIds: true,
  externalLinksNewTab: true,
  wrapInArticleTag: false,
  outputFullDoc: false,
};

/**
 * Normalizes AI-style characters and tracks exact replacement counts.
 */
export function sanitizeAiCharacters(
  markdown: string,
  options: SanitizerOptions
): { text: string; stats: SanitizationStats } {
  let text = markdown;
  let emDashesCleaned = 0;
  let enDashesCleaned = 0;
  let curlyQuotesCleaned = 0;
  let curlyApostrophesCleaned = 0;
  let invisibleSpacesCleaned = 0;
  let cmsBracketsEscaped = 0;
  let ellipsisCleaned = 0;

  if (!options.cleanAiCharacters) {
    return {
      text,
      stats: {
        emDashesCleaned: 0,
        enDashesCleaned: 0,
        curlyQuotesCleaned: 0,
        curlyApostrophesCleaned: 0,
        invisibleSpacesCleaned: 0,
        cmsBracketsEscaped: 0,
        ellipsisCleaned: 0,
        totalCleaned: 0,
      },
    };
  }

  // 1. Invisible & non-breaking spaces (\u200B zero-width, \uFEFF byte order mark, \u00A0 nbsp, \u200C, \u200D, \u00AD soft hyphen)
  if (options.stripInvisibleSpaces) {
    const zeroWidthMatches = text.match(/[\u200B\u200C\u200D\uFEFF\u00AD]/g);
    if (zeroWidthMatches) invisibleSpacesCleaned += zeroWidthMatches.length;
    text = text.replace(/[\u200B\u200C\u200D\uFEFF\u00AD]/g, '');

    const nbspMatches = text.match(/\u00A0/g);
    if (nbspMatches) invisibleSpacesCleaned += nbspMatches.length;
    text = text.replace(/\u00A0/g, ' ');
  }

  // 2. Em dashes (\u2014) and En dashes (\u2013)
  if (options.emDashMode !== 'keep') {
    const emMatches = text.match(/—/g);
    if (emMatches) emDashesCleaned = emMatches.length;

    const enMatches = text.match(/–/g);
    if (enMatches) enDashesCleaned = enMatches.length;

    let emReplacement = ', ';
    let enReplacement = '-';

    if (options.emDashMode === 'hyphen') {
      emReplacement = ' - ';
      enReplacement = '-';
    } else if (options.emDashMode === 'space') {
      emReplacement = ' ';
      enReplacement = ' ';
    } else if (options.emDashMode === 'strip') {
      emReplacement = '';
      enReplacement = '';
    }

    text = text.replace(/—/g, emReplacement);
    text = text.replace(/–/g, enReplacement);
  }

  // 3. Curly double quotes (“ ” \u201C \u201D)
  if (options.straightenQuotes) {
    const doubleQuoteMatches = text.match(/[“”]/g);
    if (doubleQuoteMatches) curlyQuotesCleaned = doubleQuoteMatches.length;
    text = text.replace(/[“”]/g, '"');

    // Curly single quotes & apostrophes (‘ ’ \u2018 \u2019)
    const singleQuoteMatches = text.match(/[‘’]/g);
    if (singleQuoteMatches) curlyApostrophesCleaned = singleQuoteMatches.length;
    text = text.replace(/[‘’]/g, "'");
  }

  // 4. Normalize Ellipsis (… \u2026 -> ...)
  if (options.normalizeEllipsis) {
    const ellipsisMatches = text.match(/…/g);
    if (ellipsisMatches) ellipsisCleaned = ellipsisMatches.length;
    text = text.replace(/…/g, '...');
  }

  // 5. Escape CMS curly brackets ({ and } -> &#123; and &#125;) in regular text (outside markdown code blocks)
  if (options.escapeCmsBrackets) {
    // Only escape if outside code fences
    const parts = text.split(/(```[\s\S]*?```|`[^`]+`)/g);
    text = parts
      .map((part) => {
        if (part.startsWith('`')) return part;
        const matches = part.match(/[{}]/g);
        if (matches) cmsBracketsEscaped += matches.length;
        return part.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;');
      })
      .join('');
  }

  // Normalize excessive spaces introduced by replacements
  text = text.replace(/ {3,}/g, '  ');

  const totalCleaned =
    emDashesCleaned +
    enDashesCleaned +
    curlyQuotesCleaned +
    curlyApostrophesCleaned +
    invisibleSpacesCleaned +
    cmsBracketsEscaped +
    ellipsisCleaned;

  return {
    text,
    stats: {
      emDashesCleaned,
      enDashesCleaned,
      curlyQuotesCleaned,
      curlyApostrophesCleaned,
      invisibleSpacesCleaned,
      cmsBracketsEscaped,
      ellipsisCleaned,
      totalCleaned,
    },
  };
}

/**
 * Calculates article metrics for bloggers.
 */
export function calculateArticleMetrics(markdown: string): ArticleMetrics {
  const clean = markdown.trim();
  if (!clean) {
    return {
      wordCount: 0,
      charCount: 0,
      readingTimeMinutes: 0,
      paragraphCount: 0,
      headingCount: 0,
    };
  }

  const words = clean.match(/\b[A-Za-z0-9_-]+\b/g) || [];
  const wordCount = words.length;
  const charCount = clean.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  const paragraphs = clean.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  const paragraphCount = paragraphs.length;

  const headings = clean.match(/^#{1,6}\s+.+$/gm) || [];
  const headingCount = headings.length;

  return {
    wordCount,
    charCount,
    readingTimeMinutes,
    paragraphCount,
    headingCount,
  };
}

/**
 * Escapes HTML characters safely.
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Slugifies text for heading anchor IDs.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Parses inline markdown (bold, italic, strikethrough, inline code, links, images).
 */
function parseInline(text: string, options: SanitizerOptions): string {
  let res = text;

  // Inline code: `code`
  res = res.replace(/`([^`]+)`/g, (_, code) => `<code>${escapeHtml(code)}</code>`);

  // Images: ![alt](url "title") or ![alt](url)
  res = res.replace(/!\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, (_, alt, url, title) => {
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<img src="${escapeHtml(url)}" alt="${escapeHtml(alt)}"${titleAttr} loading="lazy" class="blog-image" />`;
  });

  // Links: [text](url "title") or [text](url)
  res = res.replace(/\[(.*?)\]\((.*?)(?:\s+"(.*?)")?\)/g, (_, label, url, title) => {
    const target = options.externalLinksNewTab ? ' target="_blank" rel="noopener noreferrer"' : '';
    const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
    return `<a href="${escapeHtml(url)}"${target}${titleAttr}>${parseInline(label, options)}</a>`;
  });

  // Bold + Italic: ***text*** or ___text___
  res = res.replace(/(\*\*\*|___)(.*?)\1/g, '<strong><em>$2</em></strong>');

  // Bold: **text** or __text__
  res = res.replace(/(\*\*|__)(.*?)\1/g, '<strong>$2</strong>');

  // Italic: *text* or _text_
  res = res.replace(/(\*|_)(.*?)\1/g, '<em>$2</em>');

  // Strikethrough: ~~text~~
  res = res.replace(/~~(.*?)~~/g, '<del>$1</del>');

  return res;
}

/**
 * Transforms Markdown string into clean, semantic HTML.
 */
export function markdownToCleanHtml(
  markdown: string,
  options: SanitizerOptions = DEFAULT_SANITIZER_OPTIONS
): string {
  const { text: sanitized } = sanitizeAiCharacters(markdown, options);
  const lines = sanitized.split(/\r?\n/);
  const output: string[] = [];

  let inList: 'ul' | 'ol' | null = null;
  let inBlockquote = false;
  let blockquoteLines: string[] = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockLines: string[] = [];
  let inTable = false;
  let tableHeaderParsed = false;

  const closeList = () => {
    if (inList) {
      output.push(`</${inList}>`);
      inList = null;
    }
  };

  const closeBlockquote = () => {
    if (inBlockquote) {
      const innerHtml = markdownToCleanHtml(blockquoteLines.join('\n'), {
        ...options,
        wrapInArticleTag: false,
        outputFullDoc: false,
      });
      output.push(`<blockquote>\n${innerHtml}\n</blockquote>`);
      inBlockquote = false;
      blockquoteLines = [];
    }
  };

  const closeTable = () => {
    if (inTable) {
      output.push(`</tbody>\n</table>`);
      inTable = false;
      tableHeaderParsed = false;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // 1. Fenced Code Block: ```lang ... ```
    if (trimmed.startsWith('```')) {
      closeList();
      closeBlockquote();
      closeTable();

      if (!inCodeBlock) {
        inCodeBlock = true;
        codeBlockLang = trimmed.slice(3).trim();
        codeBlockLines = [];
      } else {
        inCodeBlock = false;
        const langAttr = codeBlockLang ? ` class="language-${escapeHtml(codeBlockLang)}"` : '';
        output.push(
          `<pre><code${langAttr}>${escapeHtml(codeBlockLines.join('\n'))}</code></pre>`
        );
        codeBlockLang = '';
        codeBlockLines = [];
      }
      continue;
    }

    if (inCodeBlock) {
      codeBlockLines.push(line);
      continue;
    }

    // 2. Blockquote: > line
    if (trimmed.startsWith('>')) {
      closeList();
      closeTable();
      inBlockquote = true;
      blockquoteLines.push(trimmed.replace(/^>\s?/, ''));
      continue;
    } else if (inBlockquote) {
      closeBlockquote();
    }

    // 3. Tables (Markdown pipe tables)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      closeList();
      closeBlockquote();

      const cells = trimmed
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());

      // Check if divider row: |---|---|
      const isDivider = cells.every((c) => /^:?-+:?$/.test(c));

      if (isDivider) {
        tableHeaderParsed = true;
        output.push(`<tbody>`);
        continue;
      }

      if (!inTable) {
        inTable = true;
        tableHeaderParsed = false;
        output.push(`<table>\n<thead>\n<tr>`);
        cells.forEach((cell) => {
          output.push(`  <th>${parseInline(cell, options)}</th>`);
        });
        output.push(`</tr>\n</thead>`);
      } else {
        output.push(`<tr>`);
        cells.forEach((cell) => {
          output.push(`  <td>${parseInline(cell, options)}</td>`);
        });
        output.push(`</tr>`);
      }
      continue;
    } else if (inTable) {
      closeTable();
    }

    // 4. Blank line: flushes current lists
    if (trimmed === '') {
      closeList();
      continue;
    }

    // 5. Horizontal Rule: --- or *** or ___
    if (/^(?:---|\*\*\*|___)$/.test(trimmed)) {
      closeList();
      output.push('<hr />');
      continue;
    }

    // 6. Headings: # through ######
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const headingContent = headingMatch[2];
      const parsedContent = parseInline(headingContent, options);
      const idAttr = options.generateAnchorIds ? ` id="${slugify(headingContent)}"` : '';
      output.push(`<h${level}${idAttr}>${parsedContent}</h${level}>`);
      continue;
    }

    // 7. Unordered Lists: - or * or +
    const ulMatch = trimmed.match(/^[-*+]\s+(.+)$/);
    if (ulMatch) {
      if (inList !== 'ul') {
        closeList();
        inList = 'ul';
        output.push('<ul>');
      }
      output.push(`  <li>${parseInline(ulMatch[1], options)}</li>`);
      continue;
    }

    // 8. Ordered Lists: 1. 2. 3.
    const olMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (olMatch) {
      if (inList !== 'ol') {
        closeList();
        inList = 'ol';
        output.push('<ol>');
      }
      output.push(`  <li>${parseInline(olMatch[1], options)}</li>`);
      continue;
    }

    // 9. Standard Paragraph
    closeList();
    output.push(`<p>${parseInline(trimmed, options)}</p>`);
  }

  closeList();
  closeBlockquote();
  closeTable();

  let htmlBody = output.join('\n');

  if (options.wrapInArticleTag) {
    htmlBody = `<article class="blog-post">\n${htmlBody}\n</article>`;
  }

  if (options.outputFullDoc) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Blog Post</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.7;
      color: #1a1a1a;
      max-width: 760px;
      margin: 40px auto;
      padding: 0 20px;
    }
    h1, h2, h3, h4 { line-height: 1.3; font-weight: 700; }
    h1 { font-size: 2.25rem; margin-bottom: 1.5rem; }
    h2 { font-size: 1.75rem; margin-top: 2rem; margin-bottom: 1rem; }
    h3 { font-size: 1.35rem; margin-top: 1.5rem; margin-bottom: 0.75rem; }
    p { margin-bottom: 1.25rem; font-size: 1.05rem; }
    ul, ol { margin-bottom: 1.25rem; padding-left: 1.5rem; }
    li { margin-bottom: 0.35rem; }
    blockquote {
      border-left: 4px solid #4F46E5;
      padding-left: 1rem;
      margin: 1.5rem 0;
      color: #4b5563;
      font-style: italic;
    }
    pre {
      background: #f3f4f6;
      border-radius: 8px;
      padding: 1rem;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    code {
      font-family: monospace;
      background: #f3f4f6;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
    }
    pre code { background: none; padding: 0; }
    img { max-width: 100%; height: auto; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    th, td { border: 1px solid #e5e7eb; padding: 0.75rem; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 2rem 0; }
  </style>
</head>
<body>
${htmlBody}
</body>
</html>`;
  }

  return htmlBody;
}

/**
 * Realistic sample blog post containing common AI artifacts (em-dashes, curly quotes, zero-width space, etc.)
 */
export const SAMPLE_AI_BLOG_POST = `# The Rise of Agentic AI—Transforming Modern Engineering

In today’s fast-paced tech landscape, developers aren’t just writing code—they’re directing intelligent agents to build alongside them. This shift—often called "Agentic Engineering"—marks a pivotal transition from passive autocomplete to proactive, multi-step problem solving.

> "The true measure of developer productivity in the AI era isn't lines of code committed—it's how clearly you can articulate your architectural intent."

## Why AI Output Needs Clean Normalization

When modern LLMs generate blog posts or technical documentation, they frequently insert stylistic artifacts that look fine in a chat window—but trigger subtle formatting bugs when published to CMS platforms:

* **Em-dashes overuse**—often breaking natural sentence cadence in technical articles.
* **Curly quotes & apostrophes** (“smart quotes”) that don't match your brand’s typographic standards.
* **Hidden zero-width spaces** (\u200B) that secretly corrupt URL slugs or code snippets.
* **Template brace conflicts** like {user_id} that break Liquid, Ghost, or Hugo static site builders.

### Core Comparison Table

| Feature | Raw AI Markdown | KitStack Clean HTML |
| :--- | :--- | :--- |
| Punctuation Cadence | Overused em-dashes (—) | Natural commas or clean hyphens |
| Quote Styling | Curly “smart” quotes | Straight universal ASCII quotes |
| CMS Compatibility | Raw {brackets} cause build breaks | Clean escaped entities |
| SEO Readiness | Flat unstyled text | Semantic <h1> to <h3> with anchor IDs |

## Code Architecture Example

Here is how simple and clean the resulting component implementation becomes:

\`\`\`typescript
export function renderBlogPost(content: string): string {
  const cleanContent = sanitizeAiCharacters(content, {
    emDashMode: 'spaced-comma',
    straightenQuotes: true,
  });
  return markdownToCleanHtml(cleanContent.text);
}
\`\`\`

### Getting Started Today

Whether you’re writing on Substack, WordPress, Ghost, or your own bespoke static blog—publishing clean, semantic HTML ensures your content renders flawlessly on every reader’s screen!
`;
