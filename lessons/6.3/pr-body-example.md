# The body /pr wrote for pull request #13

Pull request #13, "Walking skeleton: app, database, CI and a live preview", in the Potluck repository, as published. It was
written on camera by the `pr` skill (from [mattpocock/skills](https://github.com/mattpocock/skills), MIT License) in the session
that built the branch. The three parts are the skill's template: Summary, Evidence, Merge Danger.

---

Closes #2. What #2 asks for that this PR doesn't do is in #12: Playwright, the four separate checks, branch protection, the pooled-endpoint check, the firewall rule, and confirming Node 24 on Vercel.

## Summary

The thinnest Potluck that goes from a push to a live preview with its own database copy:

```text
push
├── GitHub Actions: npm run check
│     typecheck · lint · guard against Neon's HTTP-only driver · service tests on PGlite (Postgres 18)
└── Vercel build (fra1), per vercel.json
      npm run db:migrate   advisory lock, Neon's direct connection
                           preview: its own branch, copied from development (seed data only)
                           production: the root branch, never seeded
      npm run build
```

```text
src/app/page.tsx            home page: reads the greeting from app_info
src/app/api/health/route.ts answers without touching the database
src/db/                     schema, client, migration runner (advisory lock), seed
src/test/db.ts              fresh PGlite per test, real migrations applied
drizzle/0000_skeleton.sql   first migration: creates app_info (no data)
scripts/setup-hosting.sh    wizard for the Neon and Vercel dashboard steps
.husky/pre-commit           Prettier on staged files, type-check, tests
```

The seed script is the only source of data, so the greeting the home page reads comes from the seed. The migration only creates the table.

## Evidence

- **Before:** production, serving `main` as it is now:

  ```text
  GET /            → 404 NOT_FOUND
  GET /api/health  → 404 NOT_FOUND
  ```

  **After:** this branch's preview, built from `8ebefe8` and fetched with `vercel curl`. Without the bypass it answers 302, so deployment protection is on.

  ```text
  GET /            → 200  <h1>Potluck</h1>  "Potluck is connected to its database."
  GET /api/health  → 200  {"status":"ok"}
  ```

  The greeting comes from the seed, so the preview is reading its own copy of `development`. The preview's build log:

  ```text
  Running "npm run db:migrate && npm run build"
  Migrations applied.
  Build Completed in /vercel/output [28s]
  ```

- **Before:** no checks. **After:** `npm run check` passed in GitHub Actions on `39ae8dd` and `8ebefe8`. It runs three service tests through the home page's read:

  ```text
  seeded database            → "Potluck is connected to its database."
  only migrated              → no greeting
  seeded twice               → still one greeting
  ```

- **Migration lock**, checked by hand on local Postgres 18. A run waited about 4 s while another session held the lock. Two runs started together on a fresh database both succeeded, with one row and one migration recorded.

## Merge Danger

**Door:** one-way

Merging deploys production for the first time. Its build applies `0000_skeleton` to Neon's root branch, creating `app_info` and Drizzle's migration log. The code can be reverted, but migrations only add, so the table stays until a later change removes it. Nothing is launched and production holds no data.

**Blast Radius:** production

- Production's home page will say "Potluck reached its database, which has no seed data." That's expected, because production is never seeded.
- Neon deletes this PR's preview branch when it merges.
- After `npm install`, every clone runs the pre-commit hook (Prettier, type-check, tests) on each commit.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

