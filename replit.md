# CommerceOS

An AI-powered, full-stack commerce platform built with Next.js 15, TypeScript, Tailwind CSS, and PostgreSQL.

## How to run

The **Start App** workflow handles everything:
1. Runs database migrations (`scripts/migrate.js`)
2. Seeds demo data (`scripts/seed.js`)
3. Starts the Next.js dev server on port 5000

```bash
npm run dev          # Dev server only (port 5000)
npm run build        # Production build
node scripts/migrate.js   # Run migrations
node scripts/seed.js      # Seed demo data
```

## Environment variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string — auto-set by Replit |
| `SESSION_SECRET` | JWT signing secret — set in Replit Secrets |

## Demo accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | demo123 |
| Vendor | vendor@demo.com | demo123 |
| Customer | customer@demo.com | demo123 |

## Tech stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS, Framer Motion
- **State**: Zustand (cart & wishlist)
- **Charts**: Recharts
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Replit managed) via `pg`
- **Auth**: JWT (`jose`) + bcrypt

## Key routes

| Route | Description |
|-------|-------------|
| `/` | Homepage |
| `/products` | Product listing with search & filters |
| `/product/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/admin` | Admin dashboard |
| `/vendor/dashboard` | Vendor portal |

## AI assistant (Vitis AI)

The floating chat button (bottom-right on all shop pages) is powered by a real backend:

- **API route**: `src/app/api/ai/chat/route.ts`
- Queries the live PostgreSQL catalog for product search, deals, and categories
- The component is `src/components/home/AIAssistant.tsx`

To upgrade to a real LLM (e.g. OpenAI), replace the `buildReply()` function in the API route with an OpenAI/xAI call and keep the same response shape `{ success: true, reply: string }`.

## Visitor cookies

`src/middleware.ts` sets two cookies for every visitor on arrival:

| Cookie | Type | Purpose |
|--------|------|---------|
| `visitor_id` | Persistent (1 year) | Anonymous visitor identifier for analytics |
| `session_start` | Session (cleared on browser close) | Timestamp of current session start |

Auth cookies (`auth_token`) are set separately on login/register.

## User preferences
