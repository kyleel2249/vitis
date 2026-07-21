---
name: Next.js Replit allowedDevOrigins
description: How to configure Next.js dev server to allow Replit proxy domains for chunk loading.
---

# Next.js allowedDevOrigins on Replit

## The Rule
Set `allowedDevOrigins` in next.config.js using the actual env vars, not wildcards.
Wildcards like `'*'` or `'*.replit.dev'` are silently ignored by Next.js 15.

## How to Apply
```js
const replitDevDomain = process.env.REPLIT_DEV_DOMAIN || '';
const replitDomains = process.env.REPLIT_DOMAINS || '';
const allowedDevOrigins = [
  '127.0.0.1', 'localhost',
  ...replitDevDomain ? [replitDevDomain] : [],
  ...replitDomains ? replitDomains.split(',').map(d => d.trim()).filter(Boolean) : [],
];
```

**Why:** Replit proxies the preview through its own domain. Next.js 15 blocks cross-origin chunk requests unless the exact origin is listed. Without this, the page renders blank (server HTML loads but JS chunks time out).
