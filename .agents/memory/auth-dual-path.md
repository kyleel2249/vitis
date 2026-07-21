---
name: Auth dual path (email+password and Firebase)
description: Login/register support both direct email+password and Firebase ID token paths.
---

# Auth Dual Path

## The Rule
The login and register API routes support two paths:
1. `{ email, password }` — direct bcrypt check against DB, no Firebase required
2. `{ idToken }` — Firebase Admin token verification (requires FIREBASE_PRIVATE_KEY secret)

**Why:** FIREBASE_PRIVATE_KEY is often absent in new environments. The email+password path lets demo accounts and new registrations work immediately.

## Demo Accounts
Seeded by seed.js on every startup: admin@demo.com / vendor@demo.com / customer@demo.com — password: demo123.
Migration (migrate.js) must NOT delete demo accounts; that deletion block was removed.

## How to Apply
- Login: `src/app/api/auth/login/route.ts` — checks `body.email && body.password` first, falls back to `body.idToken`
- Register: `src/app/api/auth/register/route.ts` — same pattern
