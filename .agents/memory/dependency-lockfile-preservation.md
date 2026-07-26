---
name: Dependency lockfile preservation
description: Preserving imported dependency lockfiles after installing packages in Replit
---

When setting up an imported project, install from the existing dependency declarations, but inspect the diff afterward. The package installer may rewrite platform-specific optional dependency entries even when no dependency was intentionally changed; keep those changes only when they are part of the requested setup.

**Why:** Imported projects should retain their original dependency resolution unless setup explicitly requires updating it, and platform-specific lockfile churn can obscure the actual code change.

**How to apply:** After package installation, run `git diff -- package-lock.json` (or the equivalent lockfile), revert unrelated platform-only rewrites, and verify the application with the restored lockfile.