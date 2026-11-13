# Card: the walking skeleton, and one check in three places

## The walking skeleton

The thinnest version of the app that runs from end to end: a page that reads one value from the real database, real
migrations, a seed, and a health route. Nothing a user would call a feature yet, but every later feature has a working path
to production.

Potluck's, at lesson 6.1:

| Part | What it is |
|---|---|
| Page | the home page reads one greeting row from Postgres: "Potluck is connected to its database." |
| Database | Drizzle migrations in plain SQL, run under a Postgres advisory lock (a second run waits) |
| Seed | the only source of data for local and development databases |
| Health route | `GET /api/health` answers `{"status":"ok"}` without touching the database |
| Tests | each test gets a fresh PGlite (Postgres 18) database with the real migrations |

## One change, one worktree

`claude -w <name>` starts a session in its own worktree: a folder inside the repository
(`.claude/worktrees/<name>`), on its own branch (`worktree-<name>`), starting from `main` as it is on GitHub. Same history,
`main` untouched until you merge. A quick question about the code needs no worktree.

## One check in three places

`check` = types + lint + tests (Potluck adds a guard against Neon's HTTP-only driver), one command: `npm run check`.

| Where | When | What runs |
|---|---|---|
| By hand | whenever you want to know now | `npm run check` |
| Pre-commit hook | before every commit | the quick part: Prettier on staged files, the typecheck, the tests |
| CI (GitHub Actions) | on every push | `npm ci`, then the whole `npm run check` on a clean machine |

Later in module 6 the CI check becomes required before anything merges into `main`.

## When not to

Throwaway code (a prototype, a spike) needs none of this. A small change in a project that already has its skeleton just
uses it.
