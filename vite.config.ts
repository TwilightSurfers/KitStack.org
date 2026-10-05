import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function inspectApiPlugin(): Plugin {
  return {
    name: 'inspect-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/inspect', async (req, res) => {
        // Handle OPTIONS
        if (req.method === 'OPTIONS') {
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          res.statusCode = 204;
          return res.end();
        }

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

        // Parse query or body
        let targetUrl = '';
        let honeypot = '';
        let clientTimestamp = 0;

        if (req.method === 'POST') {
          const bodyStr = await new Promise<string>((resolve) => {
            let data = '';
            req.on('data', (chunk: any) => {
              data += chunk;
            });
            req.on('end', () => resolve(data));
          });
          try {
            const parsed = JSON.parse(bodyStr);
            targetUrl = parsed.url || '';
            honeypot = parsed.honeypot || '';
            clientTimestamp = Number(parsed.timestamp || 0);
          } catch {
            // ignore
          }
        } else {
          const urlObj = new URL(req.url || '', 'http://localhost');
          targetUrl = urlObj.searchParams.get('url') || '';
          honeypot = urlObj.searchParams.get('hp') || '';
          clientTimestamp = Number(urlObj.searchParams.get('ts') || 0);
        }

        // 1. Honeypot Bot Trap check
        if (honeypot && honeypot.trim().length > 0) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Automated submission rejected' }));
        }

        // 2. Minimum human interaction time (bots submit instantly < 300ms)
        if (clientTimestamp > 0 && Date.now() - clientTimestamp < 300) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'Interaction too fast, bot submission suspected' }));
        }

        if (!targetUrl) {
          res.statusCode = 400;
          return res.end(JSON.stringify({ error: 'A valid URL is required' }));
        }

        let normalized = targetUrl.trim();
        if (!/^https?:\/\//i.test(normalized)) {
          normalized = 'https://' + normalized;
        }

        try {
          const parsed = new URL(normalized);
          const host = parsed.hostname.toLowerCase();

          // SSRF Guard
          if (
            host === 'localhost' ||
            host === '127.0.0.1' ||
            host === '0.0.0.0' ||
            host === '::1' ||
            host.startsWith('192.168.') ||
            host.startsWith('10.') ||
            host.startsWith('169.254.')
          ) {
            res.statusCode = 403;
            return res.end(
              JSON.stringify({
                error: 'Testing internal, local, or private IP networks is blocked for security.',
              })
            );
          }

          const fetchUrl = new URL(parsed.href);
          fetchUrl.searchParams.set('_ks_cb', Date.now().toString());

          const startTime = Date.now();
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 8000);

          const response = await fetch(fetchUrl.toString(), {
            headers: {
              'User-Agent':
                'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 (compatible; KitStack-Bot/1.0; +https://kitstack.org)',
              'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
            },
            signal: controller.signal,
            redirect: 'follow',
          });
          clearTimeout(timeout);

          const durationMs = Date.now() - startTime;
          if (!response.ok) {
            res.statusCode = 400;
            return res.end(
              JSON.stringify({
                error: `Remote server responded with HTTP status ${response.status} (${response.statusText})`,
                status: response.status,
                durationMs,
              })
            );
          }

          const text = await response.text();
          const headMatch = text.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
          const headContent = headMatch ? headMatch[1] : text.slice(0, 30000);

          res.statusCode = 200;
          return res.end(
            JSON.stringify({
              success: true,
              url: parsed.href,
              finalUrl: response.url || parsed.href,
              durationMs,
              status: response.status,
              htmlHead: headContent.slice(0, 40000),
            })
          );
        } catch (err: any) {
          res.statusCode = 500;
          const isTimeout = err?.name === 'AbortError';
          return res.end(
            JSON.stringify({
              error: isTimeout
                ? 'Request timed out after 8 seconds. The target website took too long to respond.'
                : err?.message || 'Failed to fetch the specified URL',
            })
          );
        }
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), inspectApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
