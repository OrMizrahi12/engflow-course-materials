# Potluck at lesson 6.2

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-6.2
```

The tag `lesson-6.2` points at `8ebefe8`, the tip of the branch `worktree-walking-skeleton` (pushed in this lesson; its first
Vercel preview built from it). `main` is still `b7e1c03`: lesson 6.3 opens the pull request and merges it.

## The commit of this lesson (on `worktree-walking-skeleton`)

| Commit | Message | By |
|---|---|---|
| `8ebefe8` | Add the hosting setup: Vercel and Neon in Frankfurt | `/wizard`, after our answers |

It carries Claude Code's usual `Co-Authored-By` line, as earlier Potluck commits do.

## The files in `potluck/` of this kit

Exactly as they are at the tag:

| File | What changed |
|---|---|
| `scripts/setup-hosting.sh` | new: the wizard. Above the "STAGES" marker the skill's library (`stage`, `step`, `note`, `warn`, `open_url`, `ask_secret`, `pause`, `finish`), unchanged; below it the six stages. It must run from the repo root after `npm install`. |
| `vercel.json` | new: `"framework": "nextjs"`, `"buildCommand": "npm run db:migrate && npm run build"`, `"regions": ["fra1"]` |
| `src/db/env.ts` | adds `migrationDatabaseUrl()`: `DATABASE_URL_UNPOOLED` when it is set; on Vercel (`VERCEL` set) without it, a clear error; locally `DATABASE_URL` as before |
| `scripts/migrate.mts` | migrates on `migrationDatabaseUrl()` instead of `databaseUrl()`; still prints `Migrations applied.` |

The README gains a Hosting section (not in this kit; read it in the repository): run `scripts/setup-hosting.sh` from the repo
root, and a table of which database each environment uses.

| Environment | Database |
|---|---|
| Local | your own Postgres 18, loaded by `npm run db:seed` |
| Preview | its own Neon branch, copied from `development` and deleted on merge |
| Production | Neon's root branch, `production`; never seeded |

## What the wizard set up on camera (your accounts will differ)

- **Neon** (Free): project `potluck`, Postgres 18, AWS Europe Central 1 (Frankfurt), database `neondb`, role
  `neondb_owner`. Branches: `production` (the root, empty), `development` (copied from production while empty, never
  expires, migrated and seeded, the default), and after the push `preview/worktree-walking-skeleton` (copied from
  development by the integration).
- **Vercel** (Hobby): project `potluck` imported from GitHub (the Vercel GitHub app has access to this one repository), its
  functions in `fra1`. Production builds `main`.
- **The link**: Neon's Vercel integration, production branch `production`, automatic deletion of obsolete branches on, no
  branch for Vercel's development environment. It sets `DATABASE_URL` (pooled, for the app) and `DATABASE_URL_UNPOOLED`
  (direct, for migrations) for Production and for each preview.
- **This folder**: linked to the Vercel project (`.vercel/`, git-ignored); `.env.local` keeps your local Postgres and gains a
  short-lived `VERCEL_OIDC_TOKEN` from the Vercel command line (git-ignored, no database string).

## The ticket

Ticket #2 stays open: its Hosting criteria are set up, but the bar (the home page answering at the production URL after a
merged pull request whose four checks passed) needs the merge, the checks and branch protection, which come next.
