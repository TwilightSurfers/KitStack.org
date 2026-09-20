**File:** `C:\Users\User\Desktop\Needs-Building\kitstack.org\README.md`
**When:** 9/11/2026, 2:01 PM CT
**Project:** KitStack.org
**Words:** Free browser tools. No accounts. No guarantees.

# KitStack.org

Public free browser tools and utilities by [Twilight Surfers](https://x.com/TwilightSurfers).

KitStack is a client-side tool shell: open tabs, pick a plugin, get work done in the browser. **No accounts. No backend required for the core tools.**

> **AS-IS / No warranties / No guarantees.** Use at your own risk. This software is provided without warranty of any kind, express or implied. Twilight Surfers is not responsible for data loss, incorrect output, or any other damages arising from use.

License headers in source use **Apache-2.0**.

## Tools (plugins)

| Tool | What it does |
|------|----------------|
| **Color & Palette Studio** | Harmonic palettes, WCAG contrast, CSS/Tailwind export |
| **CSS Shadow & Glow Builder** | Multi-layer elevations, ambient glows, inset shadows |
| **JSON & Token Inspector** | Format, validate, minify, inspect payload structure |
| **Responsive Unit & Clamp() Tool** | PX/REM/viewport conversion and fluid `clamp()` math |
| **Shared Library & Plugin Architecture** | Plugin spec, sandbox overview, shared component kit |

## Local development

Prerequisites: **Node.js 20+**

```bash
npm install
npm run dev
```

Open the URL Vite prints (default `http://localhost:3000`).

No `GEMINI_API_KEY` or other secrets are required for these free static tools.

## Build

```bash
npm run build
```

Output lands in `dist/` (static assets ready for any static host).

## Cloudflare Pages

| Setting | Value |
|---------|--------|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | 20+ |

Connect the GitHub repo, set the values above, and deploy. No environment variables are required for the free tools shell.

## Repository

https://github.com/TwilightSurfers/KitStack.org

## Credit

Design and Development by [@TwilightSurfers](https://x.com/TwilightSurfers) on X. Pushing deliberate systems.