# Workflow card: When production breaks (Lesson 12.6)

## 1. Incident response order (order beats speed)
1. **Alert arrives** — Sentry issue (source-mapped stack, release SHA, scrubbed route) and runtime error logs (`level:error`),
   even when `/api/live` and `/api/health` stay HTTP 200 (Next.js Cache Components streams the shell as 200 before a server component throws).
2. **Capture fleeting logs** — on Vercel Hobby, runtime logs expire after **1 hour** (`vercel logs --since 30m --query 'level:error'`).
   Sentry's free tier preserves issues for **30 days**.
3. **Open a tracking issue and roll back FIRST** — before investigating code:
   ```bash
   npx --yes vercel@65.5.0 rollback <last-good-dpl> --yes
   ```
   Moves the production address back one release in seconds; **never touches the database schema or settings**.
4. **Verify live recovery** — check `/api/health` (previous commit), `/api/live` (`200`), and reload the affected page.
5. **Diagnose SECOND** — calmly, while users are unblocked.

## 2. Vercel Hobby post-rollback pin
- `vercel rollback` turns **off** automatic production domain assignment for subsequent merges to `main`.
- Merging your fix PR builds a `READY` deployment, while `/api/health` keeps serving the rolled-back commit and `Smoke test`
  waits on `pending`.
- Run `vercel promote <fix-dpl> --yes` to move production traffic onto the fix deployment, turn `Smoke test` green, and
  **re-enable automatic domain assignment** for future merges.

## 3. `/diagnosing-bugs` on read-only production evidence
- **Allowed inputs (read-only):** Sentry MCP ("Inspect Issues & Events" only), Vercel CLI deploys/logs, `git show <bad-sha>`.
- **Off-limits:** NEVER connect an agent to the production database; NEVER run `vercel env pull` for production.
- **Phases 1–4 (stop before fixing):** build a tight local red repro loop (~1 s), minimise to the smallest failing matrix, rank
  3–5 falsifiable hypotheses, confirm with one reversible tagged probe (`[DEBUG-...]`), revert, and review the diagnosis.
- **Phases 5–6 (`/tdd` + `/code-review` + `/pr`):** write failing unit + browser regression tests at the right seam first,
  apply the minimal explicit fix, delete temporary probes, run full checks + parallel `/code-review`, commit naming the
  winning hypothesis, and open a PR with auto-merge off (`Part of #<incident>`).
- **Resolving alerts stays human:** click **Resolve** in Sentry only after verifying the live fix yourself.

## 4. Seven-field blameless incident note (`docs/production.md`)
Write facts and systems — zero finger-pointing — as a comment on the tracking issue before closing it:
- **Incident:** one line describing what users saw
- **From / to:** exact UTC alert → rollback → fix promoted times
- **Alert:** which signal caught it (and what stayed green)
- **Cause:** exact code / data-shape root cause
- **Fix:** rollback, diagnosis, fix PR, promote, verification
- **Data lost:** none, or exact scope
- **Next time:** mechanical check to land via `/retro`

## 5. `/retro` → mechanical guardrail (over `CLAUDE.md` prose)
- Point a fresh worktree (`/retro`) at the incident issue, PRs, and the diagnosis session log.
- Ask *why every gate stayed green* (typecheck, lint, unit tests, E2E, seeded previews, smoke tests, CodeQL).
- Prefer a **mechanical check** wired into `npm run check` / CI (e.g. `tsconfig.source.json` enabling
  `noUncheckedIndexedAccess` for `src/`) over adding another prose rule to `CLAUDE.md`.
- Never seed production just to appease smoke tests (one-way door); review any one-way-door file diff (such as
  `src/db/migrate.ts`) yourself before merging.

---
Uses the open-source `diagnosing-bugs`, `tdd`, `retro`, and `pr` skills from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License). Independent course: unofficial, not
affiliated with or endorsed by Matt Pocock.
