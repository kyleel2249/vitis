# Vitis — Cloudflare Pages Deployment

Vitis is a Next.js 15 app that runs on **Cloudflare Pages** (advanced mode) using the OpenNext Cloudflare adapter,
with a hosted PostgreSQL database. Pages output was run locally on the Workers runtime against Postgres:
home, product pages, registration (+ duplicate check), login (+ bad password), `/api/auth/me`, `/api/cart/sync`
and `/admin` (allowed when signed in as admin, no content for anonymous visitors) all behaved correctly.

## 1. Pages project settings
Workers & Pages → your Pages project → Settings → Builds:

| Setting | Value |
|---|---|
| Framework preset | None |
| Build command | `npm run cf:build` |
| Build output directory | `.open-next/pages` |
| Root directory | `/` |
| Node version | 20 or newer (the default 22 works) |

`npm run cf:build` runs the Next.js build, packages the app as `_worker.js` + static assets in `.open-next/pages`,
and never uploads the `.next` cache (this is what caused "Pages only supports files up to 25 MiB").
`wrangler.jsonc` sets `pages_build_output_dir` and the `nodejs_compat` flag, so no extra compatibility settings are needed.

## 2. Environment variables
Settings → Variables and Secrets (Production, and Preview if used). Copy names from `.env.example`.

| Variable | Type | Purpose |
|---|---|---|
| `DATABASE_URL` | Secret | Hosted Postgres URL (Neon, Supabase, RDS…; use the pooled URL) |
| `SESSION_SECRET` | Secret | Signs login sessions — `openssl rand -hex 32`. Logins fail without it (by design) |
| `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` | Secret | Checkout + webhook |
| `RESEND_API_KEY` | Secret | Order / newsletter email (optional) |
| `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_SUPPORT_EMAIL` | **Build** variable | Inlined at build time — must exist in the build environment |

## 3. Database (once per environment, from your machine)
```bash
npm ci
export DATABASE_URL='postgres://…?sslmode=require'
npm run db:migrate
ADMIN_EMAIL=you@company.com ADMIN_PASSWORD='long-secret' NODE_ENV=production npm run db:seed
```
Production seeding creates your admin from `ADMIN_EMAIL`/`ADMIN_PASSWORD`; the `admin@demo.com / demo123` demo accounts
are only created when `SEED_DEMO_USERS=true`. Sample products/categories/coupons load only into an empty database.
On Workers the app opens one short-lived connection per query; for heavy traffic use a pooled connection string.

## 4. Stripe webhook
Stripe Dashboard → Developers → Webhooks → `https://<your-domain>/api/stripe/webhook`, events
`payment_intent.succeeded` and `payment_intent.payment_failed`; put the signing secret in `STRIPE_WEBHOOK_SECRET`.

## 5. Local preview / manual deploy
```bash
cp .dev.vars.example .dev.vars     # local secrets, never committed
npm run cf:preview                 # build + wrangler pages dev
npm run cf:deploy                  # build + wrangler pages deploy (needs `wrangler login`)
```

## 6. Post-deploy checklist
- `/` loads, `/api/products` returns data, you can register an account, sign in as the admin, and `/admin` opens.
- A Stripe test payment (card 4242 4242 4242 4242) creates an order with `payment_status = paid`.
- Not testable outside Cloudflare, so confirm after the first deploy: TLS to your managed Postgres, Stripe webhook
  delivery, and Resend email.
