# The One-Page Playbook: From First Prompt to Production (Lesson 12.8)

The full twelve-module workflow on one printable page. Keep it beside your terminal: every working day runs the same calm,
repeatable seven-step loop — regardless of how much work runs interactively, in the background, or unattended in CI.

## The Seven-Step Operating Loop

### 1. CHECK — Two-minute morning production sweep (before touching features)
- **Live pulse:** `curl -sS https://<your-app>/api/live` (process only, never touches the DB) and `/api/health` (`schemaCurrent`,
  commit SHA, DB size vs cap). Confirm uptime heartbeats and encrypted nightly backup artifacts (`health.yml`, `backup.yml`).
- **Overnight errors:** check Sentry Issues (`0` new), Sentry Monitors (liveness + backup cron), and Vercel 5xx logs (`--since 59m`
  on Hobby's 1-hour log window).
- **Free-tier budgets:** check Neon compute (CU-hours), storage, and **branch count** (prune stale PR/CI branches before hitting
  the 10-branch cap); check Sentry monthly event quota and Vercel Firewall write rate-limits.
- **Waiting bot PRs:** triage failing Dependabot PRs first. Never merge red CI or bypass lint — salvage safe minor/patch updates
  and hold back breaking major bumps deliberately.

### 2. ALIGN — Shared language and decisions before code
- **Bring real signal into `/triage`:** combine backlog items, read-only Sentry MCP issues, and feedback from your own demo/test
  sessions (never expose real visitors' personal data).
- **Check the vocabulary first:** match `GLOSSARY.md` and `docs/adr/` so features, UI copy, and code speak the same words.
- **Resolve open decisions with `/grill-me`:** one sharp interview round covering edge cases, data shapes, security boundaries
  (e.g. never leaking capability links), accessibility/fallbacks, and verification seams before writing a line of code.

### 3. PLAN — Spec and parallel-friendly frontier
- **Write the contract with `/to-spec`:** push back on any detail that breaks existing UX patterns or ticket boundaries before
  publishing the spec issue.
- **Split into tracer bullets with `/to-tickets`:** create small, vertical, non-overlapping sub-issues with native GitHub blocking
  edges and clear file boundaries. Remove `ready-for-agent` from the parent spec so bots never pick up the umbrella issue.
- **Keep labels honest:** `ready-for-agent` marks frontier readiness; only a human applies `claude-build` to kick off CI.

### 4. BUILD — Pick the right execution lane (one lane per task)
| Lane | Command / trigger | Best fit | Isolation & safety |
|---|---|---|---|
| **Steered worktree** | `claude -w <name>` | UI, glossary/domain copy, service seams, anything needing human judgment | Fresh branch + isolated git worktree; `npm run setup:worktree` |
| **Background session** | `claude --bg --name <id>` (`claude agents`) | Bounded read-only triage, log/codebase investigation, parallel prep | Detached non-blocking run tracked locally |
| **Unattended CI** | Maintainer adds `claude-build` label | Pure modules with tight unit seams — zero DB, browser, or one-way-door files | Explicit `--allowedTools`, `--disallowedTools`, narrow scope |

- Work test-first (`/tdd`) at the real seam, keep sessions in the **smart zone** (fresh session per phase or clean handoff),
  and give Claude eyes (Playwright screenshots, desktop + phone) on UI work.

### 5. GATE — One shared quality bar for every lane
- **Layer 1 (Mechanical):** `npm run check` (typecheck + lint + unit/service tests), `npm run build`, Playwright E2E against
  preview, and CodeQL — identical whether a human, a local session, or `app/claude` wrote the branch.
- **Layer 2 (Independent review):** open a **fresh** session for `/code-review` across two axes (repo Standards/Glossary and
  Ticket/Spec acceptance criteria). Never grade an agent's PR only in the session that wrote it.
- **Layer 3 (Human one-way doors):** humans exclusively own merging to `main`, editing `.github/**` workflows or Dependabot
  config, database migrations (`src/db/migrate.ts`), production secrets, `vercel rollback` / `vercel promote`, and resolving
  Sentry alerts.

### 6. SHIP — Deploy, smoke test, observe (and incident order if it breaks)
- **Deploy path:** merge to `main` → automatic production deploy → automated `Smoke test` → manual live verification on a
  non-personal demo group.
- **If production breaks, order beats speed:** (1) capture fleeting runtime logs (Vercel Hobby keeps 1 hour), (2) open an
  incident issue and **roll back FIRST** (`vercel rollback <last-good-dpl> --yes`), (3) verify live recovery, (4) diagnose
  **read-only** in a fresh worktree with `/diagnosing-bugs` (never touch the prod DB), (5) ship a test-first fix,
  (6) `vercel promote <fix-dpl> --yes` if Hobby pinned the domain, (7) resolve the alert by hand and post a 7-field blameless
  incident note.

### 7. COMPOUND — End-of-day `/retro`
- Run `/retro` against today's real snags (failed CI runs, pre-commit timeouts, quota warnings, incident surprises).
- **Prefer mechanical guardrails over prose:** land fixes in `.husky/pre-commit`, `.github/dependabot.yml`, `tsconfig`, lint
  rules, CI checks, or focused `docs/` runbooks — keep `CLAUDE.md` short and pointer-driven.
- Close completed specs, delete temporary worktrees and stale branches, and finish the day with `0` open PRs and green `/api/live`
  and `/api/health`.

## Quick Skill Picker

| When you need to... | Run |
|---|---|
| Decide what deserves attention next | `/triage` |
| Surface hidden decisions before building | `/grill-me` |
| Turn agreed decisions into a spec issue | `/to-spec` |
| Split a spec into a parallel frontier | `/to-tickets` |
| Build test-first at the right seam | `/tdd` · `/implement` |
| Diagnose a live bug read-only | `/diagnosing-bugs` |
| Get an independent two-axis PR review | `/code-review` (fresh session) |
| Package a clean branch for human merge | `/pr` |
| Turn friction into permanent guardrails | `/retro` |

---
Uses the open-source `triage`, `grill-me`, `to-spec`, `to-tickets`, `implement`, `tdd`, `diagnosing-bugs`, `code-review`,
`pr`, and `retro` skills from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License).
Independent course: unofficial, not affiliated with or endorsed by Matt Pocock.
