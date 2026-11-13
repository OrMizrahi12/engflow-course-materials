# Potluck at lesson 6.1

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-6.1
```

The tag `lesson-6.1` points at `39ae8dd`, the tip of the branch `worktree-walking-skeleton`. That branch is not merged yet:
`main` is still `b7e1c03` (the same commit as `lesson-5.3`). Lesson 6.3 opens the pull request and merges it.

## The three commits of this lesson (on `worktree-walking-skeleton`)

| Commit | Message | By |
|---|---|---|
| `4ac8c36` | Add the walking skeleton's local half (#2) | `/implement #2` |
| `4b10cd8` | Seed the greeting instead of migrating it; use glossary wording | our decision on the review |
| `39ae8dd` | Add pre-commit hooks (husky + lint-staged + prettier) | the author's `setup-pre-commit` skill, read by path |

Each commit carries Claude Code's usual `Co-Authored-By` line.

## The files in `potluck/` of this kit

The new files of the walking skeleton exactly as they are at the tag (the lockfile and the generated `drizzle/meta/` are
left out; take them from the repository):

| File | What it is |
|---|---|
| `potluck/package.json` | the scripts (`check` = `typecheck`, `lint`, `check:deps` and `test`; `db:generate`, `db:migrate`, `db:seed`; `dev`, `build`, `start`; `prepare` for Husky); Node 24 in `engines` |
| `potluck/.nvmrc` | Node 24, read by nvm and by CI |
| `potluck/.env.example` | the local connection string (copy it to `.env.local`) |
| `potluck/drizzle.config.ts`, `potluck/drizzle/0000_skeleton.sql` | the Drizzle config and the first migration (one table, `app_info`) |
| `potluck/src/db/` | schema, client, the migration runner with the advisory lock, the seed, the greeting read and its tests |
| `potluck/src/test/db.ts` | the harness: a fresh PGlite database with the real migrations for each test |
| `potluck/scripts/` | `migrate.mts`, `seed.mts`, and `check-deps.mjs` (fails if Neon's HTTP-only driver is a dependency) |
| `potluck/src/app/page.tsx`, `potluck/src/app/api/health/route.ts` | the home page and the health route |
| `potluck/vitest.config.mts` | the test runner's config |
| `potluck/.github/workflows/check.yml` | CI: `npm ci` and `npm run check` on every push |
| `potluck/.husky/pre-commit`, `potluck/.lintstagedrc`, `potluck/.prettierrc`, `potluck/.prettierignore` | the pre-commit hook and its config |

## Issues

Ticket #2 is still open, with all 24 boxes unticked: it is done only when the page answers in production (lesson 6.3).
The spec is issue #1. Tickets #3 to #11 from lesson 5.3 come after #2, the only one that could start.

## Your local database

Not in the repository: your own Postgres 18 with a database `potluck` (see `postgres-18.md`), and `.env.local`, which is
git-ignored.
