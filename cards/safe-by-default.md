# Reference card: Safe by default (Lesson 12.5)

## Four layers of defense (outside in)

| Layer | Controls | Free tier / cost |
|---|---|---|
| **1. Repo** | Secret scanning, push protection, vulnerability alerts, CodeQL default setup, 1 grouped weekly Dependabot PR | Free on a public GitHub repository |
| **2. Environments** | `DATABASE_URL` split across `production` and `preview`; GitHub `production` environment locked to `main` only | Free on Vercel Hobby, Neon Free, GitHub Public |
| **3. Edge** | Vercel Firewall custom rule (`method == POST`, 20 req / 60 s per IP → HTTP 429) | 1 rate-limit rule free on Vercel Hobby |
| **4. App** | 128-bit random links (`newLinkToken`), per-group caps (`limits.ts`), 5 HTTP security headers (`next.config.ts`) | Built into app code |

## Why Dependabot is grouped into one weekly PR

Neon Free caps a project at **10 database branches**, and every open Vercel preview PR claims a branch. Grouping all npm updates into one weekly Dependabot PR (`open-pull-requests-limit: 1`) keeps updates on a single branch. Keeping vulnerability alerts ON while leaving Dependabot's automatic security-fix PRs OFF prevents urgent ungrouped PRs from blowing past the branch limit (trade-off: fixes ride the weekly bundle and can wait up to a week).

## `/security-review` (built-in Claude Code command)

- **In:** current branch diff or whole codebase (`src/`, `scripts/`, `next.config.ts`, `vercel.json`, `.github/workflows/`).
- **Inside:** semantic trace across auth/link tokens, SQL queries, Server Actions, input caps, error scrubbing, headers, and workflow triggers; filters to high-confidence findings (≥ 0.8).
- **Out:** concrete file-and-line items to fix in a PR or file as tickets, cleanly separated from below-bar awareness notes.
- **When to use:** before launch and after security-sensitive changes.
- **When not:** never as a substitute for mechanical guards (CodeQL, push protection, firewall rules, automated tests).

## Public-repo encrypted nightly backups (`age` + Sentry Crons)

1. Neon Free keeps only **6 hours** of instant-restore history; GitHub Actions artifacts on a public repo are **publicly downloadable**.
2. Generate an offline `age` keypair (`age-keygen -o ~/.config/potluck/backup.agekey`, `chmod 600`). Commit ONLY the public `age1…` recipient in ADR 0004 and `.github/workflows/backup.yml`, verified on every PR by `scripts/check-backup-recipient.mjs`.
3. `backup.yml` runs nightly (`03:23 UTC`) and manually in the `main`-locked `production` environment: streams `pg_dump` directly into `age -r` (plaintext never touches disk), fails over 30 MB, uploads a 14-day ciphertext artifact, and sends HTTP check-ins (`in_progress` → `ok`/`error`) to Sentry Cron monitor `potluck-nightly-backup` (catching both failures and GitHub's 60-day schedule pause).

## Say both numbers out loud

- **Loss window (RPO):** up to **24 hours** of data can be lost past Neon Free's 6-hour history.
- **Restore time (RTO):** measured live in a timed drill into a **separate scratch Neon branch** (`5m 15s` wall-clock on camera; ~`2m 45s` active restore), then delete the scratch branch.
- **Hard boundary:** restoring production stays strictly a **human** job; schedule the scratch drill quarterly (first Monday of Jan, Apr, Jul, Oct).

---
Uses the open-source `to-tickets`, `implement`, `tdd`, `code-review`, and `pr` skills from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License, version 1.3.1) alongside Claude Code's built-in `/security-review`. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
