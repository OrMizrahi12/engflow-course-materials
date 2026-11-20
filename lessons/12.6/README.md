# Student kit: Lesson 12.6, When production breaks

In this lesson we run a planned production incident drill plainly end to end: we create a synthetic, non-personal group on
live production (`Cabin advance (drill)`, 0 expenses and 1 settlement), ship a realistic small feature (`PR #94`, `11abb4f`)
that passes every check — typecheck, lint, `386/386` tests, CodeQL, preview deploy, and live `Smoke test` — and watch it
crash on that production-only shape (`ERROR 1019320247`, Sentry `POTLUCK-2`). We capture the live Vercel runtime error log,
open incident `#95`, roll production back FIRST with `vercel rollback` so users recover in seconds, diagnose read-only in a
fresh worktree with `/diagnosing-bugs` (never touching the production database), fix test-first with `/tdd` and parallel
`/code-review` (`PR #96`, `e59e78f`), see Vercel Hobby's post-rollback domain pin live before lifting it with
`vercel promote`, resolve `POTLUCK-2` by hand, post a seven-field blameless incident note to close `#95`, run `/retro` to
land a permanent `noUncheckedIndexedAccess` compiler guardrail (`PR #97`, `bf8c128`), and delete the temporary drill group
cleanly (`HTTP 404`).

## Files in this kit

| File | What it is |
|---|---|
| `potluck/prompts/p_diagnose.txt` | prompt pasted in `incident-diagnose` for read-only `/diagnosing-bugs` Phases 1–4 |
| `potluck/prompts/p_fix.txt` | prompt pasted for Phases 5–6 with `/tdd`, Playwright E2E, `/code-review`, and `/pr` |
| `potluck/prompts/p_retro.txt` | prompt pasted after `/retro` in `incident-retro` to rank lasting mechanical guardrails |
| `potluck/prompts/p_retro_pick.txt` | follow-up prompt choosing Candidate #1 (`tsconfig.source.json` for `src/`) |
| `potluck/drill-latest-activity-before.ts` | the drill's unguarded `latestActivityDate` from PR #94 (`11abb4f`) |
| `potluck/src/app/g/token/latest-activity.ts` | the explicit fixed `latestActivityDate` from PR #96 (`e59e78f`) |
| `potluck/src/app/g/token/latest-activity.test.ts` | unit tests including the red→green settlements-only regression test |
| `potluck/e2e/latest-activity.spec.ts` | Playwright browser regression test for a settlements-only group |
| `potluck/tsconfig.source.json` | `/retro` guardrail enabling `noUncheckedIndexedAccess` for production `src/` |
| `potluck/src/db/only-row.ts` | single-row assertion helper added while fixing the 18 source errors in PR #97 |
| `potluck/src/db/only-row.test.ts` | unit tests covering 0, 1, and >1 rows in `onlyRow` |
| `potluck/incident-95-note.md` | the filled 7-field blameless incident note posted to close issue `#95` |
| `potluck/commands-and-runbook.md` | exact rollback, runtime logs, promote, diff check, and cleanup commands as typed |
| `potluck/retro-guardrail-diff.md` | key `package.json` and one-way-door `src/db/migrate.ts` diff from PR #97 |
| `potluck/when-production-breaks.md` | one-page workflow card: incident order, Hobby pin, read-only diagnosis, blameless note, `/retro` |
| `potluck/potluck-at-lesson-12.6.md` | Potluck tag `lesson-12.6` (`bf8c128`) and how to clone it |

## Before you start

- Your own clone of Potluck at tag `lesson-12.5` (clone it, never fork it, so your issues, PRs, and Actions workflows run in
  your own repository), deployed to your own Vercel Hobby project, Neon Free database, and Sentry Developer project with
  read-only Sentry MCP ("Inspect Issues & Events" only), `gh`, and `npx vercel@65.5.0` signed in.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (v1.3.1 as filmed, Opus 5.5, auto mode).

**What is free and what is not:** Potluck, `gh`, Vercel CLI, Vercel Hobby (personal and non-commercial use only — no ads, no
paid features, no payments), Neon Free, Sentry Developer free tier (30-day issue retention), GitHub Actions on a public
repository, and `mattpocock/skills` are free. Claude Code requires a paid Claude plan (Pro or higher) or a Console account.

## Install the tools (Windows WSL, macOS, Linux)

No new tools beyond Lesson 12.5: `git`, `gh`, `curl`, `jq`, and Node 24 (`npx vercel@65.5.0`).
- **Linux (Ubuntu):** `sudo apt install git gh curl jq`
- **macOS:** `brew install git gh jq` (`curl` is built in)
- **Windows:** run everything inside WSL (Ubuntu) using the Linux command above.

## The steps, as on camera

1. **Verify start state and seed blind spot:** confirm `git log --oneline -1` (`lesson-12.5`), live `/api/health` and
   `/api/live`, `grep -nE 'async function seed|addExpense\(' src/db/seed.ts` (all 5 seeded groups call `addExpense`), and
   `docs/production.md` Rollback + Incidents template.
2. **Create a temporary synthetic drill group on live production:** open your live Potluck site, create `Cabin advance (drill)`
   (USD, Alex & Sam), skip claiming a name, and record one settlement (`Alex paid Sam $25.00`) with zero expenses.
3. **Ship the drill PR past every check:** add `drill-latest-activity-before.ts` (`group.expenses[0].date`), commit through
   Husky (`386 passed`), open your drill PR, confirm all checks pass, merge, and verify `Vercel: success` and `Smoke test: success`.
4. **Trigger the real crash and inspect Sentry:** reload the live drill group (`This page couldn't load / A server error occurred`),
   then open your Sentry feed to inspect the source-mapped `TypeError`, release SHA, and scrubbed `/g/[token]` route.
5. **Roll back FIRST and verify recovery:** check `/api/live` (`200`) and `/api/health` (still `ok`), capture live Vercel
   runtime error logs (`vercel logs --since 30m --query 'level:error'`, before Hobby's 1-hour window expires), open an incident
   issue, run `vercel rollback <previous-dpl> --yes`, verify `/api/health` flips back, and reload your drill group cleanly.
6. **Diagnose read-only in a fresh worktree:** run `export VITEST_MAX_WORKERS=4; claude -w incident-diagnose`, paste
   `potluck/prompts/p_diagnose.txt` (zero production DB access, no `vercel env pull`), and review Phases 1–4 before any fix.
7. **Fix test-first with `/tdd` and `/code-review`:** paste `potluck/prompts/p_fix.txt` in `incident-diagnose` so Claude writes
   failing unit + Playwright regression tests first, applies the explicit fix, runs `npm run check` and Playwright `--workers=2`,
   runs parallel `/code-review`, and opens a fix PR referencing `Part of #<incident>` with auto-merge off.
8. **Merge, observe Hobby's post-rollback pin, and `vercel promote`:** merge the fix PR, wait for the deploy to report `READY`,
   confirm `/api/health` still serves the rolled-back commit and `Smoke test` waits on `pending`, run
   `vercel promote <fix-dpl> --yes`, watch `/api/health` and `Smoke test` flip green, reload the live drill group
   (`Latest activity: <today>`), and click **Resolve** in Sentry by hand.
9. **Post the 7-field blameless incident note and close the issue:** fill out `potluck/incident-95-note.md` with your real
   timestamps and SHAs, comment on your incident issue, and close it (`--reason completed`).
10. **Land a lasting mechanical check with `/retro`:** run `claude -w incident-retro`, invoke `/retro` with
    `potluck/prompts/p_retro.txt`, choose Candidate #1 via `potluck/prompts/p_retro_pick.txt`, inspect the one-line diff on
    one-way-door `src/db/migrate.ts` yourself before merging, and verify `Vercel: success` + `Smoke test: success` automatically.
11. **Delete your temporary drill group and verify clean production state:** in `Group settings → Delete this group → Delete for good`,
    confirm `HTTP 404` (`No group at this link`), incident closed, and live `/api/health` + `/api/live` green.

## Pause and try

Run the complete drill above on your own Potluck clone and free accounts. Make sure you delete your temporary drill group at
the end so your live database returns cleanly to zero groups.

---
The skills used here (`diagnosing-bugs`, `tdd`, `retro`, `pr`) are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. This course is independent:
unofficial, and not affiliated with or endorsed by Matt Pocock.
