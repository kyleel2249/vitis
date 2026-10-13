# Fix log (assessment of kyleel2249/vitis @ 2546dcb)

Nothing was removed; Replit-specific paths were kept as fallbacks.

| File | Problem → Fix |
|---|---|
| `src/lib/firebase.ts`, `components/layout/Header.tsx`, `app/admin/AdminSidebar.tsx` | Imported a non-existent `auth` export → logout crashed before clearing the session. Added `signOutFirebase()` (never throws) and used it. |
| `src/app/api/cart/sync/route.ts` (new) | Header called `/api/cart/sync` but the handler lived at `/api/cart` → 404, cart never merged. Route added (re-exports the existing handler). |
| `src/lib/stripeClient.ts`, `api/stripe/webhook/route.ts`, `instrumentation.ts` | Stripe only worked via the Replit connector; webhook had type errors and `https://undefined` startup URL. Now env vars first (`STRIPE_*`), Replit fallback, signature verified with Stripe directly. |
| `src/app/api/orders/route.ts` | Client could send `payment_status: "paid"`. Now verified with Stripe (status, amount match, no payment reuse). |
| `src/app/admin/layout.tsx` | Verified admin JWT with key `"undefined"` when `SESSION_SECRET` unset (forgeable). Now uses `verifyToken`. |
| `scripts/seed.js` | Reset `admin@demo.com` / `demo123` on every run, incl. production. Demo users now dev-only (or `SEED_DEMO_USERS=true`); real admin via `ADMIN_EMAIL`/`ADMIN_PASSWORD`. |
| `src/lib/db.ts`, `scripts/*.js` | No TLS support for managed Postgres, 2 s connect timeout, pool opened at import. TLS auto/explicit, 10 s timeout, lazy pool. |
| `api/orders/[id]`, `api/products/[id]` | Next 15 async `params` not awaited (type errors). Fixed. |
| `next.config.js` | `typescript.ignoreBuildErrors` hid errors → removed (tsc is now clean); standalone + image switches added. |
| `public/*`, `layout.tsx`, `manifest.json` | Missing favicon/icons/apple-touch (404s), stale CommerceOS branding, hard-coded `commerceos.app`. Icons generated from the Vitis logo; URL/email now env-driven. |
| `Dockerfile`, `.dockerignore`, `.env.example`, `DEPLOYMENT.md`, `package.json` | Added deployment assets; `start` honours `$PORT`; Node engine pinned. |

| `src/lib/firebase-admin.ts` | `firebase-admin` could not be bundled for Cloudflare. Token verification reimplemented with `jose` (same `adminAuth.verifyIdToken` API). |
| `src/lib/db.ts` | Workers cannot share sockets across requests (second request hung). Per-query connections on Workers, pool elsewhere. |
| `open-next.config.ts`, `wrangler.jsonc`, `package.json` (`cf:*` scripts) | Cloudflare Workers deployment added and verified locally on workerd. |

## Known remaining items
- `create-payment-intent` and order totals still come from the client cart (amount is bound to the payment, but prices are not re-derived from the DB).
- `.replit` is committed and contains the Firebase public config and service-account email; rotate if that project is shared.
- `npm audit` was not run (registry audit disabled in `.npmrc`).
