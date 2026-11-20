# Student kit: Lesson 12.8, A day in the life of a live product

Launch day puts your product on the internet; the morning after is where the workflow earns its keep. In this capstone
lesson we run one complete working day on Potluck in live production from morning to evening: a two-minute morning health,
Sentry, and Neon quota sweep (catching a real `8 / 10` branches warning), salvaging failing Dependabot **PR `#91`**
(`1fce15b`), turning two real notes from our own `Friday Dinner` demo group into **Spec `#102`** and a three-ticket frontier
(`#103`, `#104`, `#105`), dispatching all three execution lanes in parallel (`claude-build` CI → **PR `#106`**, `claude --bg`
`triage-46` on `#46`, and `claude -w` worktree → **PR `#107`**), running a fresh two-axis `/code-review` before merging wave
1, shipping newly-unblocked `#105` (**PR `#108`**) and verifying **`Group spending: $64.00`** + **`Copy summary`** live with
zero secret link in the clipboard output, and closing the day with `/retro` landing guardrail **PR `#109`** (`59ce9c1`,
`Closes #46`) and **The One-Page Playbook: From First Prompt to Production**.

## Files in this kit

| File | What it is |
|---|---|
| `playbook-first-prompt-to-production.md` | **The One-Page Playbook: From First Prompt to Production** (also published in `cards/playbook-first-prompt-to-production.md`) |
| `potluck/commands-and-runbook.md` | parameterized morning sweep, Dependabot salvage, three-lane dispatch, merge, and clean-close commands |
| `potluck/potluck-at-lesson-12.8.md` | Potluck tag `lesson-12.8` (`59ce9c1`) summary and clone-not-fork instructions |
| `potluck/prompts/p_fix91.txt` | prompt salvaging Dependabot PR `#91` (keeping 5 safe updates, holding 3 breaking majors) |
| `potluck/prompts/p_triage.txt` | prompt for `/triage` folding in Sentry MCP and two `Friday Dinner` notes |
| `potluck/prompts/p_grill.txt` | prompt for `/grill-me` locking `group spending`, pagination, locale, zero link leak, and fallback |
| `potluck/prompts/p_answer_spec.txt` | prompt pushing back on Q10/Q11 and publishing Spec `#102` with `/to-spec` |
| `potluck/prompts/p_tickets.txt` | prompt for `/to-tickets` splitting `#102` into `#103`, `#104`, and natively-blocked `#105` |
| `potluck/prompts/p_impl104.txt` | prompt implementing `#104` (`Group spending`) in a steered local worktree |
| `potluck/prompts/p_review_ci.txt` | prompt for a fresh two-axis `/code-review` on unattended CI PR `#106` |
| `potluck/prompts/p_impl105.txt` | prompt implementing unblocked `#105` (`CopySummary`) with Playwright E2E coverage |
| `potluck/prompts/p_retro.txt` | prompt for end-of-day `/retro` auditing Dependabot, pre-commit `SIGKILL`, and Neon branches |
| `potluck/prompts/p_retro_land.txt` | prompt landing all three mechanical guardrails together in PR `#109` (`Closes #46`) |
| `potluck/src/money/summary.ts` | pure plain-text group summary formatter shipped by unattended CI in PR `#106` |
| `potluck/src/money/summary.test.ts` | unit tests enforcing exact formatting, ISO decimals, and zero link/token leakage |
| `potluck/src/app/g/[token]/copy-summary.tsx` | `CopySummary` client component (`role="status"` + read-only textarea fallback) from PR `#108` |
| `potluck/e2e/copy-summary.spec.ts` | Playwright browser tests (hidden at zero expenses, copy, clipboard fallback, phone layout) |
| `potluck/.husky/pre-commit` | `/retro` guardrail capping local pre-commit tests at `VITEST_MAX_WORKERS=2` (leaving CI uncapped) |
| `potluck/.github/dependabot.yml` | `/retro` guardrail grouping safe minor/patch updates while ignoring breaking semver-major bumps |

## Before you start

- Your own clone of Potluck at tag `lesson-12.7` (clone it, never fork it, so your issues, PRs, Dependabot updates, and
  Actions workflows run in your own repository), deployed to your own Vercel Hobby project, Neon Free database, and Sentry
  Developer project with read-only Sentry MCP ("Inspect Issues & Events" only), `gh`, and `npx vercel@65.5.0` signed in.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (v1.3.1 as filmed, Opus 5.5, auto mode).

**What is free and what is not:** Potluck, `gh`, Vercel CLI, Vercel Hobby (personal and non-commercial use only — no ads, no
paid features, no payments), Neon Free, Sentry Developer free tier, GitHub Actions and Dependabot on a public repository, and
`mattpocock/skills` are free. Claude Code requires a paid Claude plan (Pro or higher) or a Console account.

## Install the tools (Windows WSL, macOS, Linux)

No new tools beyond Lesson 12.7: `git`, `gh`, `curl`, `jq`, and Node 24 (`npx vercel@65.5.0`).
- **Linux (Ubuntu):** `sudo apt install git gh curl jq`
- **macOS:** `brew install git gh jq` (`curl` is built in)
- **Windows:** run everything inside WSL (Ubuntu) using the Linux command above.

## The steps, as on camera

1. **Run the two-minute morning production check:** hit `/api/health`, `/api/live`, Vercel 5xx logs (`--since 59m`), Firewall
   status, GitHub Actions `health.yml` and latest encrypted `backup.yml` artifact, Sentry Issues/Monitors/Stats, and Neon
   CU-hours/storage/branches (spot branch counts creeping toward `10 / 10` before previews fail).
2. **Triage and salvage a failing Dependabot PR:** inspect the failed check (`npm run check` catching breaking majors even when
   a Vercel preview passes), prune any stale remote branch to reclaim a Neon branch slot, keep the safe minor/patch updates in a
   fresh `claude -w` worktree while reverting incompatible majors, review the `package.json` diff yourself, and merge live.
3. **Turn demo-group feedback into a clean frontier:** bring notes from your own non-personal demo group (never real visitors'
   data) into `/triage` (checking Sentry MCP and `GLOSSARY.md`), align edge cases with `/grill-me`, push back on UX and ticket
   splits in `/to-spec`, and publish sub-issues with native blocking edges via `/to-tickets` (removing `ready-for-agent` from
   the parent spec).
4. **Drive all three execution lanes in parallel:** apply `claude-build` by hand ONLY to a pure-module ticket (zero DB, browser,
   or one-way-door files), launch a bounded read-only `claude --bg` session tracked via `claude agents`, and implement the
   companion UI/glossary ticket in a steered `claude -w` worktree.
5. **Review fresh, merge through the gate, ship, and verify live:** open a fresh Claude session for two-axis `/code-review` on
   the unattended CI PR before merging, update the second PR cleanly against `main`, ship the newly-unblocked dependent ticket
   with Playwright E2E coverage, and confirm live behavior and clipboard output on your demo group (verifying zero secret link).
6. **Compound with `/retro` and close clean:** run `/retro` in a fresh worktree against today's real friction, land mechanical
   config/hook guardrails (`.husky/pre-commit`, `.github/dependabot.yml`, `docs/production.md`) instead of bloating `CLAUDE.md`,
   review `.github/**` diffs yourself before merging, close your spec, confirm `0` open PRs and green `/api/health` + `/api/live`,
   and keep `playbook-first-prompt-to-production.md` beside your terminal.

## Pause and try

Run one full working day on your own live Potluck deployment: start with the two-minute morning sweep, salvage or merge a
waiting Dependabot PR, run a small improvement for your own demo group through `/triage` → `/grill-me` → `/to-spec` →
`/to-tickets`, drive one pure ticket in unattended CI alongside a steered worktree and a `claude --bg` triage session, review
the bot PR in a fresh session, ship live, and close the day with `/retro`.

---
The skills used here (`triage`, `grill-me`, `to-spec`, `to-tickets`, `implement`, `tdd`, `code-review`, `pr`, `retro`) are
from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. This course is
independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
