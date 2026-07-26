---
name: Firebase Admin configuration
description: Imported auth routes initialize Firebase Admin at module load and require Firebase service-account environment variables.
---

# Firebase Admin Configuration

## The Rule
The imported login and register API routes initialize Firebase Admin when their modules load. They require `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, and `FIREBASE_PRIVATE_KEY`.

**Why:** Firebase Admin initialization happens before the route handler runs, so missing service-account variables can prevent production builds even when the affected auth route is not being used.

## Demo Accounts
Seeded by seed.js on every startup: admin@demo.com / vendor@demo.com / customer@demo.com — password: demo123.
Migration (migrate.js) must NOT delete demo accounts; that deletion block was removed.

## How to Apply
- Configure the three Firebase service-account variables before relying on production builds or Firebase-authenticated requests.
