# Vitis — Deployment Guide

Vitis is a Next.js 15 (App Router) app with a PostgreSQL database. It runs on any **Node 20+** host
(Docker, Render, Railway, Fly.io, Cloud Run, a VPS, Vercel, Replit). Local build, migration, seed, login,
cart sync and admin-guard checks were run against this exact code before packaging.

## 1. Required environment variables
Copy `.env.example` and fill it in. Minimum to boot: `DATABASE_URL`, `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL`.

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Postgres connection string (TLS auto-enabled for `sslmode=require`) |
| `SESSION_SECRET` | Signs login sessions — `openssl rand -hex 32`. Without it every login fails (by design) |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL (metadata, social cards). Build-time variable |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | First admin, created by `npm run db:seed` |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Checkout + webhook |
| `RESEND_API_KEY` | Order / newsletter email (optional) |
| `NEXT_PUBLIC_FIREBASE_*`, `FIREBASE_*` | Firebase sign-in (optional; email/password works without it) |

`NEXT_PUBLIC_*` values are baked in at **build time** — set them in the build environment, not only at runtime.

## 2. Database (once per environment)
```bash
npm ci
DATABASE_URL=... npm run db:migrate
DATABASE_URL=... ADMIN_EMAIL=you@company.com ADMIN_PASSWORD='long-secret' NODE_ENV=production npm run db:seed
```
In production the demo accounts (`admin@demo.com` / `demo123` …) are **not** created unless `SEED_DEMO_USERS=true`.
The seed also loads sample categories/products/coupons only when the products table is empty.

## 3. Deploy

### Option A — Docker (recommended)
```bash
docker build -t vitis \
  --build-arg NEXT_PUBLIC_SITE_URL=https://your-domain.com \
  --build-arg NEXT_PUBLIC_SUPPORT_EMAIL=support@your-domain.com .
docker run -p 8080:8080 --env-file .env vitis
```
Run `node scripts/migrate.js` as the host's release/pre-deploy command.

### Option B — Plain Node host (Render / Railway / VPS / Vercel)
Build: `npm ci && npm run build` · Start: `npm start` (honours `$PORT`, default 5000).
Set the variables above in the host dashboard.

### Option C — Replit
Unchanged: the **Start App** workflow still works; Stripe/Resend fall back to the Replit connectors when
`STRIPE_SECRET_KEY` / `RESEND_API_KEY` are not set.

## 4. Stripe webhook
Dashboard → Developers → Webhooks → add `https://your-domain.com/api/stripe/webhook` with events
`payment_intent.succeeded` and `payment_intent.payment_failed`; put the signing secret in `STRIPE_WEBHOOK_SECRET`.

## 5. Cloudflare
Cloudflare DNS/CDN/proxy in front of any option above works as-is. Running the app **on Cloudflare Workers/Pages**
(OpenNext) was tested and currently fails at bundling (`firebase-admin` → `jwks-rsa` cannot resolve `jose`), and
`pg` TCP/`sharp` need Workers-specific setup (Hyperdrive, `IMAGES_UNOPTIMIZED=true`). Use a Node host for the app
and Cloudflare as the edge until that migration is done deliberately.

## 6. Post-deploy checklist
- `/` loads, `/api/products` returns data, `/auth/login` signs in the admin, `/admin` opens.
- A Stripe test payment (card 4242 4242 4242 4242) creates an order with `payment_status = paid`.
- Change/rotate any secret that was ever committed (see CHANGES below).
