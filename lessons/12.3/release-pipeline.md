# Workflow card: The release pipeline

**When to use:** any web app real people rely on.
**When to skip:** throwaway prototypes or preview-only experiments.

## 1. Only `main` reaches production (two signals, before the database)
A production build (`VERCEL_ENV=production`) must pass **both** checks before reading `DATABASE_URL` or running migrations:
1. Vercel's system variables report **GitHub**, **your repo**, **`main`**, and a **commit SHA**.
2. `git rev-parse HEAD` in the build's checkout equals that SHA.

A CLI upload from a laptop carries no `.git` directory, so it fails closed even if Git metadata is sent. Preview builds and local
runs pass untouched. Prove it once with a deliberate `vercel deploy --prod --skip-domain` drill.

## 2. Smoke-test every release (read-only in production)
- **Dispatch:** enable Vercel `repository_dispatch` (`disableRepositoryDispatchEvents: false` via PATCH `--silent`).
- **Workflow on `main`:** `.github/workflows/smoke.yml` listens to `vercel.deployment.success` (after-release check, zero new
  secrets) or `vercel.deployment.ready` (pre-release Deployment Check with `VERCEL_AUTOMATION_BYPASS_SECRET`).
- **Checks (strictly read-only):** `/api/health` reports the expected `commit`, the home page renders, and a made-up `/g/<token>`
  returns `404` ("No group at this link", proving a database read). Tests that write data stay on previews and your laptop.
- **Always report:** post a `Smoke test` commit status on pass, failure, or cancellation so a commit never hangs in `pending`.
  Never add `Smoke test` as a required PR check in branch protection (it only runs after a commit reaches `main`).
- **Previews:** protected by Standard Protection (`302` to raw `curl`); use `vercel curl <path> --deployment <id>`.

## 3. Roll back in one command — and know what stays put
- `vercel rollback <prev-dpl-id>` moves the production address one release back in seconds.
- **Three things stay put:** the database schema, environment variables and project settings, and any new merges to `main`
  (auto-assignment pauses until you run `vercel promote <dpl-id>`).
- **Hobby limit:** one deployment back. Further back: merge a revert PR and fix forward.

## 4. Cut a real release
Verify `/api/health` serves the target commit and its `Smoke test` status is green, then generate release notes from merged PR
bodies (user-visible changes first, operator changes second) and publish a GitHub release (`gh release create v0.1.0 --target <sha>`).

---
Built for Potluck with the open-source skills in [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License,
unofficial, not affiliated).
