# CommerceOS — AI-Powered Commerce Operating System

A production-ready, full-stack commerce platform built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL.

## 🚀 Features

### Storefront
- **AI Shopping Assistant** — conversational commerce chatbot
- **Smart Search** — instant search with autocomplete, filters, sorting
- **Product Pages** — rich image galleries, variants, reviews, related products
- **Shopping Cart** — persistent cart with coupon engine
- **Checkout** — multi-step checkout with address, shipping, payment
- **Wishlist** — save products across sessions
- **Flash Sales** — countdown timers with live inventory tracking

### Commerce Modules
- **Multi-Vendor Marketplace** — vendor onboarding, dashboards, payouts
- **Order Management** — full order lifecycle from placement to delivery
- **Inventory Management** — stock tracking with low-stock alerts
- **Coupon Engine** — percentage, fixed, and free-shipping coupons

### Dashboards
- **Admin Panel** — full business overview, analytics, order management
- **Vendor Portal** — earnings, products, orders, analytics
- **Customer Account** — orders, addresses, wishlist, notifications

### Design
- Glassmorphism + modern card design
- Full dark mode support
- Responsive mobile-first
- Framer Motion animations
- Skeleton loading states

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TypeScript |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand (cart, wishlist) |
| Charts | Recharts |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Replit managed) |
| Auth | JWT (jose) + bcrypt |
| Icons | Lucide React |

## 📁 Project Structure

```
src/
├── app/
│   ├── (shop)/          # Public storefront pages
│   │   ├── page.tsx     # Homepage
│   │   ├── products/    # Product listing
│   │   ├── product/     # Product detail
│   │   ├── cart/        # Shopping cart
│   │   ├── checkout/    # Checkout flow
│   │   ├── wishlist/    # Wishlist
│   │   └── account/     # Customer account
│   ├── admin/           # Admin panel
│   ├── vendor/          # Vendor portal
│   ├── auth/            # Authentication pages
│   └── api/             # REST API routes
├── components/
│   ├── layout/          # Header, Footer
│   ├── home/            # Homepage sections
│   └── ui/              # Shared UI components
├── lib/
│   ├── db.ts            # PostgreSQL connection
│   ├── auth.ts          # JWT authentication
│   ├── cart.ts          # Cart state (Zustand)
│   ├── wishlist.ts      # Wishlist state
│   └── utils.ts         # Utilities
└── types/               # TypeScript types
```

## 🔐 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Customer | customer@demo.com | demo123 |
| Vendor | vendor@demo.com | demo123 |
| Admin | admin@demo.com | demo123 |

## 🌐 Key Routes

| Route | Description |
|-------|-------------|
| `/` | Homepage with hero, categories, products |
| `/products` | Product listing with search & filters |
| `/product/[slug]` | Product detail page |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/auth/login` | Sign in |
| `/auth/register` | Create account |
| `/admin` | Admin dashboard |
| `/vendor/dashboard` | Vendor dashboard |

## 🛠 Development

```bash
npm run dev          # Start development server (port 5000)
npm run build        # Production build
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed demo data
```

## 🔧 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (auto-set by Replit) |
| `SESSION_SECRET` | JWT signing secret |

## 🏛 Architecture

The platform follows a modular Next.js App Router architecture:
- **Server Components** handle data fetching from PostgreSQL
- **Client Components** manage interactivity (cart, wishlist, animations)
- **API Routes** provide REST endpoints for dynamic operations
- **Zustand stores** persist cart and wishlist to localStorage

## 🔮 Extending the Platform

The architecture is designed for incremental expansion:
1. **Payment Integration** — add Stripe/PayPal to `/api/payments`
2. **Email Notifications** — add SendGrid/Resend to `/api/notifications`  
3. **AI Search** — integrate OpenAI embeddings for semantic search
4. **Real-time** — add WebSockets for live inventory/chat
5. **Mobile App** — React Native with shared API layer
