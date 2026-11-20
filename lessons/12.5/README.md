# Lesson 12.5: Safe by default

The lesson's files, exactly as they were typed on camera (commit `a814202, tag lesson-12.5`).

| File | What it is |
|---|---|
| `prompts.md` | every prompt and shell command from the lesson, in order, with expected outputs |
| `prompts/p_tickets.txt` | prompt pasted after `/to-tickets #63` |
| `prompts/p_answer_tickets.txt` | live quiz answer merging the three slices into #89 |
| `prompts/p_impl89.txt` | handoff note pasted after `/implement #89` |
| `prompts/p_secreview.txt` | whole-app scope pasted after `/security-review` |
| `prompts/p_impl70.txt` | specifics pasted after `/implement #70` |
| `prompts/p_impl11.txt` | backup workflow spec pasted after `/implement #11` (replace `age1…` with your own public key) |
| `files/next.config.ts` | `next.config.ts` with all five HTTP security headers |
| `files/security-headers.spec.ts` | Playwright header verification across `/`, a live group link, proxy 404, and `/api/health` |
| `files/dependabot.yml` | `.github/dependabot.yml` (npm only, weekly, one group, max 1 PR) |
| `files/privacy-page.tsx` | updated `/privacy` page (deletion steps, 14-day encrypted backup retention, no single-group restore) |
| `files/production.md` | `docs/production.md` production runbook, plan-limits table, and quarterly restore-drill calendar |
| `files/0004-nightly-backups-as-encrypted-artifacts.md` | ADR 0004 recording the `age` public-key encrypted artifact design |
| `files/backup.yml` | `.github/workflows/backup.yml` (03:23 UTC nightly + manual, `pg_dump` piped into `age -r`, 30 MB cap, Sentry Cron check-in) |
| `files/check-backup-recipient.mjs` | CI check enforcing the workflow's `age` recipient matches ADR 0004 |
| `files/sentry-check-in.mjs` | Sentry Cron HTTP check-in helper derived from `SENTRY_DSN` |
| `safe-by-default.md` | reference card: four defense layers, 10-branch Dependabot rule, `/security-review`, `age` backups, RPO/RTO |
| `potluck-at-lesson-12.5.md` | what tag `lesson-12.5` holds (`a814202`) and how to check it out |

Run it from your `potluck` project (at tag lesson-12.4, deployed to your own Vercel Hobby project with its Neon Free database and Sentry free project, gh and npx vercel@65.5.0 signed in, age and Postgres 18 client tools installed):

```bash
git log --oneline -1                                                                         # start from lesson-12.4
export VITEST_MAX_WORKERS=4; claude -w safe-by-default                                       # /to-tickets #63 + prompts/p_tickets.txt -> ticket #89
gh api -X PUT repos/<you>/potluck/vulnerability-alerts                                       # enable GitHub secret scanning, push protection, alerts, CodeQL
export VITEST_MAX_WORKERS=4; claude -w security-hardening                                    # /implement #89 + prompts/p_impl89.txt, merge PR #90
npx vercel@65.5.0 firewall publish --project potluck --scope "$T" --yes                      # publish POST 20/60s rate limit and prove HTTP 429
claude -w security-audit                                                                     # /security-review + prompts/p_secreview.txt (whole app)
export VITEST_MAX_WORKERS=4; claude -w privacy-runbook                                       # /implement #70 + prompts/p_impl70.txt (PR #92)
age-keygen -o ~/.config/potluck/backup.agekey && chmod 600 ~/.config/potluck/backup.agekey   # offline keypair + main-locked production env
export VITEST_MAX_WORKERS=4; claude -w nightly-backups                                       # /implement #11 + prompts/p_impl11.txt, merge PR #93
gh workflow run backup.yml                                                                   # trigger encrypted backup, verify Sentry Cron green, run timed scratch restore drill
```

Free: Potluck, gh, GitHub Free on a public repository (secret scanning, push protection, vulnerability alerts, CodeQL, environment branch rules, Actions), Vercel CLI, Vercel Hobby (personal and non-commercial use only; 1 rate-limit rule), Neon Free, Sentry Developer free tier (1 Cron monitor), age, and the skills. Not free: a paid Claude plan. The student kit has the steps for Windows (WSL), macOS and Linux, and what the lesson printed.
