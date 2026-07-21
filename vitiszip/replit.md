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

## User preferences
