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

## 5. Cloudflare Workers (OpenNext) — verified build
The app builds with `@opennextjs/cloudflare` and was run locally on the Workers runtime (workerd) against Postgres:
home, product pages, `/api/products`, login, `/api/auth/me`, `/api/cart/sync` and `/admin` all returned correctly.
Worker size is ~1.8 MiB gzipped (fits the free plan's 3 MiB limit).

**Use a Workers project, not a Pages project.** Cloudflare Pages treats the `.next` folder as static files and fails with
"Pages only supports files up to 25 MiB" (the webpack cache); it also cannot run the API/database. Create it with
Workers & Pages → Create → **Import a repository** (Workers Builds), then set:

| Setting | Value |
|---|---|
| Build command | `npm run cf:build` |
| Deploy command | `npx wrangler deploy` |
| Root directory | `/` |
| Build variables | `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL`, `NEXT_PUBLIC_FIREBASE_*` |
| Runtime secrets (Settings → Variables and Secrets) | `DATABASE_URL`, `SESSION_SECRET`, `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `RESEND_API_KEY`, `FIREBASE_PROJECT_ID` |

Notes:
- Database: use a hosted Postgres reachable from Cloudflare (Neon, Supabase, RDS…). On Workers the app opens one short-lived
  connection per query (a shared pool hangs across requests); for heavy traffic put Hyperdrive or a pooled connection string
  (e.g. Neon pooler) in `DATABASE_URL`. Run `npm run db:migrate` / `db:seed` once from your machine.
- Firebase sign-in tokens are now verified with `jose` + Google's public keys (no `firebase-admin`, no private key needed;
  only `FIREBASE_PROJECT_ID`). Same behaviour, runs on Workers and Node.
- Images are served unoptimized on Workers (`IMAGES_UNOPTIMIZED=true` is set by `cf:build`).
- Local preview: copy `.dev.vars.example` to `.dev.vars`, then `npm run cf:preview`.
- Not tested here: live TLS to a managed Postgres from real Cloudflare edge, Stripe webhooks on Workers, Resend email.
  Run the checklist below after the first deploy.

## 6. Post-deploy checklist
- `/` loads, `/api/products` returns data, `/auth/login` signs in the admin, `/admin` opens.
- A Stripe test payment (card 4242 4242 4242 4242) creates an order with `payment_status = paid`.
- Change/rotate any secret that was ever committed (see CHANGES below).
