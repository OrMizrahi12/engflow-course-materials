# Lesson 1.1: The tour

Welcome to **Claude Code: The Professional Engineering Workflow**. This opening lesson is a fast guided tour of the
entire workflow using real footage from across all twelve modules, from a first idea to a live production site. Nothing
is installed or changed on your machine in this lesson.

## What you build in this course

1. **Potluck (Modules 1–9, 11–12):** a real group-expense-splitting web app shared by link (no user accounts), taken
   from an empty folder and first prompt all the way to a live, independent production deployment on your own free
   hosting, database, and monitoring accounts.
2. **Spliit (Module 10):** a standalone copy of [spliit-app/spliit](https://github.com/spliit-app/spliit) (MIT License),
   a real ~20,000-line open-source expense splitter with real history and real user issues, used to practice pulling a
   glossary from unfamiliar code, triaging real issues, diagnosing a live bug, and improving module architecture.
   Nothing from this course is ever filed upstream.

You do not need to write code by hand in this course. You keep talking to Claude Code, while learning to steer
decisions, read evidence, and run a professional engineering process around every change.

## The nine tour beats and twelve-module map

| Stage | Module(s) | What happens on screen | Key skills & tools |
|---|---|---|---|
| 0. Contrast | 1 (1.2–1.3) | Build Potluck v0 from one prompt, test with real numbers (`12,50` → `€1,250.00`), reverse-engineer Matt Pocock's workflow | Vibe coding contrast, ten operating rules |
| 1. Workbench | 2 (2.1–2.4) | Install Claude Code, Git, Node 24, `gh`, `jq`; permission modes; the ~150K smart zone; install `mattpocock-skills` | `/context`, `/usage`, `/plugin`, `/ask-matt` |
| 2. Align first (Beat 1 & 2) | 3–4 (3.1–4.2) | Interview rounds before writing code; grow and sharpen `GLOSSARY.md` with `_Avoid_` lists; ADRs; background research and logic prototypes | `/grill-me`, `/setup-matt-pocock-skills`, `/grill-with-docs`, `/domain-modeling`, `/wait-what`, `/research`, `/handoff`, `/prototype` |
| 3. Plan on GitHub (Beat 3) | 5 (5.1–5.3) | Tests, seams, and deep modules in plain words; spec issue split into vertical tracer-bullet sub-issues with native blocking links | `/to-spec`, `/to-tickets` |
| 4. Build, test, and land (Beat 5 & 6) | 6–7 (6.1–7.5) | Isolated worktrees; walking skeleton on local, preview, and production; red-to-green TDD; PR with Before/After evidence, one-way door check, auto-merge on green, deploy to production; three review layers; `/retro` | `/implement`, `/wizard`, `/pr`, `/tdd`, `/code-review`, `/retro`, `/writing-for-agents`, `/teach` |
| 5. Parallel & foggy work (Beat 4) | 8–9 (8.1–9.3) | Native worktrees and background Agent View (`claude --bg`, no tmux); `/implement-spec` across a frontier; charting foggy multi-currency work with decision maps and UI prototypes | `claude --worktree`, `claude --bg`, `/implement-spec`, `/wayfinder` |
| 6. Real open-source code | 10 (10.1–10.6) | Run a standalone copy of Spliit; reverse-engineer a glossary; triage real issues; diagnose a live bug with ranked hypotheses; design-it-twice architecture | `/triage`, `/diagnosing-bugs`, `/improve-codebase-architecture`, `/codebase-design` |
| 7. Unattended CI (Beat 7) | 11 (11.1–11.2) | Add a maintainer-only `claude-build` label to trigger `anthropics/claude-code-action@v1` in GitHub Actions; keep one-way doors human | GitHub Actions, `claude-build` label, one-way door list |
| 8. Production, incidents & launch (Beat 8 & 9) | 12 (12.1–12.8) | Expand–contract migrations; release pipeline with smoke tests; Sentry errors & uptime monitors; rate limits & encrypted nightly backups; incident drill + one-command `vercel rollback`; launch day live on the internet; one full working day on the live product | `vercel rollback`, `vercel promote`, Sentry MCP (read-only), live playbook |

A printable one-page version of the flow map also lives in [`cards/flow-map.md`](../../cards/flow-map.md).

## Prerequisites, tools, and what is free

| Account / tool | Cost | Notes |
|---|---|---|
| **Claude Code** | **Paid required** | Requires a paid Claude plan (Pro or higher) or a paid Claude Console account billed by usage. Parallel and background sessions spend usage faster. |
| **GitHub** | Free tier | Public repositories include GitHub Actions, rulesets, auto-merge, code scanning, and secret scanning on GitHub Free. |
| **Vercel** | Free tier (Hobby) | **Non-commercial use only.** A commercial or paying product requires Vercel Pro. Free runtime logs retain 1 hour; rollback goes 1 deploy back. |
| **Neon** | Free tier | Postgres 18 with preview branches (up to 10 branches, 100 compute-hours/month, 6-hour history — covered by nightly encrypted backups in Module 12). |
| **Sentry** | Free tier | Error tracking with source maps (30-day retention), 1 uptime monitor, and 1 cron monitor. |
| **Custom domain** | Optional | Not required; the course launches on Vercel's free `*.vercel.app` address. |

## Operating systems (Windows, macOS, Linux)

- **Linux (Ubuntu):** All on-camera terminal steps run natively on Ubuntu.
- **macOS:** Run commands directly in Terminal or iTerm; macOS-specific install notes are included in Lesson 2.1 and later kits.
- **Windows:** Use Ubuntu inside **Windows Subsystem for Linux (WSL 2)** so every shell, Git, Node, and Claude Code command matches the lessons cleanly.

## Pause and try

1. Read through the twelve-module table above and star the two stages you want most in your own workflow (for example: test-first slices, parallel worktrees, or production rollbacks).
2. Check your account readiness from the cost table above: confirm your paid Claude plan or Console account, and note that you will create or connect your free GitHub, Vercel, Neon, and Sentry accounts as each module introduces them.
3. Write down one concrete bug, regression, or headache you have hit in an AI-built app, and keep that note beside you through Module 1.

**Checkpoint:** You have picked your top two workflow stages from the map, confirmed you know what requires a paid Claude plan versus free tiers, and written down one real pain point to watch for.

## The Potluck repository

No Potluck repository exists yet in Lesson 1.1; the real repository starts from scratch in Lesson 3.2. When you work with the course repository in later lessons, always **clone** your own standalone repository (never fork) so your issues, labels, and pull requests stay in your own account.

## Credits and independence

This course teaches the open-source skills in [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. **This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.**
Any file in this course-materials repository that copies part of a skill keeps that skill's MIT license notice.

Module 10 uses a standalone copy of [Spliit](https://github.com/spliit-app/spliit) (MIT License) and credits it where
used. Nothing from this course is filed into either upstream repository.
