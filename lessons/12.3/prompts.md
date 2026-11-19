# Prompts and commands from Lesson 12.3

Every prompt typed or pasted into Claude Code on camera, in order, with what came back.

1. **Tab 1 — Check where Potluck stands**
   - `git log --oneline -1` → `a9ebd22` (`lesson-12.2`, PR #78 drop `app_info`)
   - `gh issue view 63 --json body --jq .body | grep -n "only from"` → `11:3. It deploys only from \`main\`.`
   - `gh issue list --label ready-for-human --limit 12` → `#69 Release only after smoke tests pass` near top
   - `curl -s https://<your-production-address>/api/health; echo` → `{"status":"ok"}`

2. **Session `release-pipeline` (`claude -w release-pipeline`) — `/to-tickets #63`**
   - Typed `/to-tickets #63 ` + pasted `prompts/to-tickets-brief.txt`.
   - Came back (2 min 22 s) with a quiz and published nothing: 1 ticket for the source check, `#69` Vercel docs findings (Standard Protection needs the automation bypass secret to test a held deployment URL), and 4 questions.
   - Pasted `prompts/quiz-answer.txt` → published `#79` (`ready-for-human`, sub-issue of `#63`, blocks `#71`), added our decision comment on `#69`, and stopped (63 s).

3. **Session `production-from-main` (`export VITEST_MAX_WORKERS=4; claude -w production-from-main`) — `/implement #79`**
   - Typed `/implement #79`.
   - Approved seam 1 (`guardProductionBuild(env, readHead)` in `src/db/build-source.ts`, called first in `scripts/migrate.mts`).
   - Built red-to-green, ran Standards and Spec code reviews (Spec caught missing `VERCEL_ENV` letting builds through; fixed to fail closed), 328 tests passing (10 min 12 s).
   - Pasted `prompts/land-source.txt` → added `src/db/build-source.ts` to `docs/agents/what-stays-human.md`, added the build-log pass line, opened PR #80 with auto-merge off (3 min 58 s).
   - Merged PR #80 manually (`6beb87f`), checked Vercel production build logs (pass line printed before `Migrations applied and verified.`).
   - Ran deliberate CLI-upload drill (`vercel deploy --prod --skip-domain` from a fresh temp clone of `main`): refused with `exit 1` (`checkout HEAD: (no .git)`), production untouched.

4. **Session `smoke-gate` (`export VITEST_MAX_WORKERS=4; claude -w smoke-gate`) — `/implement #69`**
   - Typed `/implement #69 ` + pasted `prompts/implement-69.txt`.
   - Answered `#65 first?` with `prompts/q65-answer.txt`; approved `Both seams`; after reviews answered `Superseded` → `Success, marked skipped` and `Glossary` → `Only fix my comments` (20 min 11 s, 339 tests).
   - Refused `PRODUCTION_URL` secret via `prompts/land-smoke.txt` → wrote public URL into `.github/workflows/smoke.yml`, verified read-only against production, fixed missing-commit message test-first (340 tests), opened PR #81 with auto-merge off (11 min 3 s).
   - Verified preview protection (`curl` → `302`; `vercel curl /api/health --deployment $id` → `200` with commit), switched on Vercel repository dispatch (`disableRepositoryDispatchEvents: false`), and merged PR #81 (`397a5c7`).

5. **Diagnose and fix the quoting bug (still in `smoke-gate`)**
   - `Smoke test` stayed `pending` for > 3.5 min. Pasted `prompts/read-outcome.txt` → Claude read GitHub + CLI (48 s): all 3 smoke checks passed in run `44445737758`, but the report step failed with `unexpected EOF` on the apostrophe in `${SUMMARY:-Smoke test didn't finish: see the run}`.
   - Pasted `prompts/fix-pr.txt` → Claude fixed the step with an `if` block, verified every `run:` block with `bash -n` and a fake `gh`, opened PR #82 with auto-merge off (8 min 15 s).
   - Merged PR #82 (`1f60b51`): `Smoke test: success Smoke test passed`.

6. **Instant rollback and promote drill (Tab 1)**
   - `vercel rollback <prev-dpl> --yes` → `/api/health` flipped from `1f60b51` to `397a5c7` (~5–10 s).
   - `vercel promote <cur-dpl> --yes` → `/api/health` flipped back to `1f60b51`.

7. **Release notes `v0.1.0` (back in `release-pipeline`)**
   - Pasted `prompts/release-notes.txt` → Claude verified live `/api/health` and green `Smoke test`, drafted notes from PRs `#76–#78` and `#80–#82`, published `v0.1.0` on `1f60b51` (57 s).
