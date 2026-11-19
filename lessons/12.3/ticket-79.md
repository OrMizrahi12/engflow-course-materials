# Issue #79: Production build refuses a deploy GitHub didn't build from main

**Label:** `ready-for-human`. **One-way door:** merging a change to what runs migrations (the build command or the migration runner). The unattended run is denied these files, and the operator merges it.

## Parent
#63

## What to build
#63's third check of **independent**: Potluck deploys only from `main`. A production build that GitHub didn't trigger from `main` fails before anything connects to production's database. That covers a CLI upload from someone's laptop, and another branch (including a preview promoted to production, which rebuilds with production's variables). Nothing is migrated, the deploy never exists, and the current release keeps serving.

The first step of a production build (`VERCEL_ENV=production`) requires all of:
- Vercel's system variables say GitHub triggered it, from this repo, from `main`, with a commit SHA.
- `git rev-parse HEAD` in the build's checkout equals the SHA Vercel reports. A CLI upload carries no `.git`, so metadata passed with `vercel deploy -m …` can't satisfy this.

Missing variables or a missing `.git` refuse the build. The check fails closed, and its message says what it saw. Preview builds and local runs are untouched. `vercel rollback` doesn't rebuild, so it's untouched too.

This stops mistakes, not someone deliberately faking a build. No GitHub API call: a dashboard redeploy of an earlier `main` build may pass.

## Acceptance criteria
- [ ] Tests refuse each of these without opening a database connection:
  - no Git variables (CLI upload, or system variables switched off);
  - a branch other than `main`;
  - another repo;
  - a provider other than GitHub;
  - no `.git`, or a `HEAD` that differs from the reported SHA.
- [ ] A test passes a GitHub build of `main` whose `HEAD` matches.
- [ ] The refusal message names what was seen. It prints no connection string or other secret.
- [ ] Drill, done by the operator: `vercel deploy --prod --skip-domain` from a laptop checkout fails at this step, and nothing touches the database. Note the result here.
- [ ] The first real merge to `main` after this passes the step. That proves `.git` is present in Vercel's Git builds. If it isn't, the release is held, not broken: come back here, don't add a token.
