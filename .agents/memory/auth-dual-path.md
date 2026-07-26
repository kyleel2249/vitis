---
name: Auth dual login paths
description: Direct email/password auth works without Firebase; Firebase Admin is loaded only for token-based requests.
---

# Auth Dual Paths

## The Rule
Login and registration support two paths:
1. Direct `{ email, password }` requests use the PostgreSQL user record and bcrypt.
2. Firebase `{ idToken }` requests dynamically load Firebase Admin and require `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.

**Why:** New Replit environments often do not have Firebase service-account variables. Direct auth keeps documented demo accounts and local admin workflows usable without that external setup.

## Demo Accounts
Seeded by seed.js on every startup: admin@demo.com / vendor@demo.com / customer@demo.com — password: demo123.
Migration (migrate.js) must NOT delete demo accounts; that deletion block was removed.

## How to Apply
- Use the direct email/password path for demo/local access. Configure the three Firebase service-account variables before relying on Firebase-authenticated requests.
