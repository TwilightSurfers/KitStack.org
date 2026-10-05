/**
 * Cloudflare Pages Function: /api/inspect
 * Safely fetches remote URLs to extract OpenGraph & Twitter Card snippet metadata.
 * Includes honeypot detection, sliding-window rate limiting, SSRF guard, and strict cache-busting.
 */

// In-memory sliding-window rate limiter per client IP (resets across worker recycles)
const ipRateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const MAX_REQUESTS_PER_WINDOW = 20;

// SSRF IP checks
function isPrivateOrLocalHost(hostname: string): boolean {
  const lower = hostname.toLowerCase().trim();
  if (
    lower === 'localhost' ||
    lower === '127.0.0.1' ||
    lower === '0.0.0.0' ||
    lower === '::1' ||
    lower.endsWith('.local') ||
    lower.endsWith('.internal')
  ) {
    return true;
  }

  // IPv4 check
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = lower.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);

    // 10.0.0.0/8
    if (octet1 === 10) return true;
    // 127.0.0.0/8
    if (octet1 === 127) return true;
    // 172.16.0.0/12
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) return true;
    // 192.168.0.0/16
    if (octet1 === 192 && octet2 === 168) return true;
    // 169.254.0.0/16 (Link Local / Cloud Metadata)
    if (octet1 === 169 && octet2 === 254) return true;
    // 0.0.0.0/8
    if (octet1 === 0) return true;
  }

  return false;
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRateLimitMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    ipRateLimitMap.set(ip, validTimestamps);
    return false; // Exceeded
  }

  validTimestamps.push(now);
  ipRateLimitMap.set(ip, validTimestamps);
  return true; // Allowed
}

export async function onRequest(context: { request: Request }): Promise<Response> {
  const { request } = context;

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0',
  };

  const clientIp =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '127.0.0.1';

  // Rate limit check
  if (!checkRateLimit(clientIp)) {
    return new Response(
      JSON.stringify({
        error: 'Rate limit exceeded. Please wait a few seconds before testing another URL.',
      }),
      { status: 429, headers: corsHeaders }
    );
  }

  let targetUrl = '';
  let honeypot = '';
  let clientTimestamp = 0;

  try {
    if (request.method === 'POST') {
      const body = await request.json().catch(() => ({}));
      targetUrl = (body as any)?.url || '';
      honeypot = (body as any)?.honeypot || '';
      clientTimestamp = Number((body as any)?.timestamp || 0);
    } else {
      const urlObj = new URL(request.url);
      targetUrl = urlObj.searchParams.get('url') || '';
      honeypot = urlObj.searchParams.get('hp') || '';
      clientTimestamp = Number(urlObj.searchParams.get('ts') || 0);
    }
  } catch {
    return new Response(
      JSON.stringify({ error: 'Malformed request payload' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 1. Honeypot Bot Trap: Reject if filled
  if (honeypot && honeypot.trim().length > 0) {
    return new Response(
      JSON.stringify({ error: 'Automated submission rejected' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 2. Minimum human interaction time (bots submit instantly < 300ms)
  if (clientTimestamp > 0 && Date.now() - clientTimestamp < 300) {
    return new Response(
      JSON.stringify({ error: 'Interaction too fast, automated submission suspected' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 3. URL Validation
  if (!targetUrl || typeof targetUrl !== 'string') {
    return new Response(
      JSON.stringify({ error: 'A valid URL is required' }),
      { status: 400, headers: corsHeaders }
    );
  }

  let parsedUrl: URL;
  try {
    // Prepend https:// if protocol was omitted
    let normalized = targetUrl.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = 'https://' + normalized;
    }
    parsedUrl = new URL(normalized);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid URL format' }),
      { status: 400, headers: corsHeaders }
    );
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return new Response(
      JSON.stringify({ error: 'Only http: and https: protocols are permitted' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 4. SSRF Guard
  if (isPrivateOrLocalHost(parsedUrl.hostname)) {
    return new Response(
      JSON.stringify({ error: 'Testing internal, local, or private IP networks is blocked for security.' }),
      { status: 403, headers: corsHeaders }
    );
  }

  // 5. Cache-busting URL parameter
  const fetchUrl = new URL(parsedUrl.href);
  fetchUrl.searchParams.set('_ks_cb', Date.now().toString());

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(fetchUrl.toString(), {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (compatible; KitStack-Bot/1.0; +https://kitstack.org)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeoutId);

    const durationMs = Date.now() - startTime;

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          error: `Remote server responded with HTTP status ${response.status} (${response.statusText})`,
          status: response.status,
          durationMs,
        }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Limit read size to first 512KB
    const reader = response.body?.getReader();
    let receivedBytes = 0;
    const maxBytes = 512 * 1024;
    const chunks: Uint8Array[] = [];

    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          receivedBytes += value.length;
          chunks.push(value);
          if (receivedBytes >= maxBytes) {
            reader.cancel();
            break;
          }
        }
      }
    }

    // Decode HTML
    const totalBuffer = new Uint8Array(receivedBytes);
    let offset = 0;
    for (const chunk of chunks) {
      totalBuffer.set(chunk, offset);
      offset += chunk.length;
    }
    const htmlText = new TextDecoder('utf-8').decode(totalBuffer);

    // Fast regex extraction of <head> and key meta tags
    const headMatch = htmlText.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    const headContent = headMatch ? headMatch[1] : htmlText.slice(0, 30000);

    return new Response(
      JSON.stringify({
        success: true,
        url: parsedUrl.href,
        finalUrl: response.url || parsedUrl.href,
        durationMs,
        status: response.status,
        htmlHead: headContent.slice(0, 40000), // Return head snippet for DOMParser in client
      }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err: unknown) {
    const isTimeout = (err as Error)?.name === 'AbortError';
    return new Response(
      JSON.stringify({
        error: isTimeout
          ? 'Request timed out after 8 seconds. The target website took too long to respond.'
          : (err as Error)?.message || 'Failed to fetch the specified URL',
      }),
      { status: 500, headers: corsHeaders }
    );
  }
}
