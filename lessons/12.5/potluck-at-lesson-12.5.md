# Potluck at Lesson 12.5 (`lesson-12.5`)

- Repository: https://github.com/OrMizrahi12/potluck
- Tag: `lesson-12.5`
- Commit: `a8142022181cd80bbabf7369830255831bbfa28e` (merge of PR #93)

Clone the repository (never fork it so your own Actions, security settings, and Vercel project stay independent) and check out the tag:

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-12.5
```

## What changed between `lesson-12.4` and `lesson-12.5`

- **PR #90 (closes #89):** `next.config.ts` (five HTTP security headers), `e2e/security-headers.spec.ts`, `.github/dependabot.yml` (npm only, weekly, one group, max 1 PR).
- **PR #92 (closes #70):** `src/app/privacy/page.tsx` (group deletion steps, 14-day encrypted backup retention, no single-group restore), `docs/production.md` (plan limits, rollback, incident template, quarterly restore drill), `e2e/privacy.spec.ts`, desktop/phone screenshots under `docs/evidence/issue-70/`.
- **PR #93 (part of #11, closed after restore drill):** `.github/workflows/backup.yml`, `docs/adr/0004-nightly-backups-as-encrypted-artifacts.md`, `scripts/check-backup-recipient.mjs` (+ tests), `scripts/sentry-check-in.mjs` (+ tests), `scripts/backup-check-in.mjs`, restore steps in `docs/production.md`, and updates to `docs/agents/what-stays-human.md`.
- **Account / repo settings flipped by hand:** GitHub secret scanning, push protection, vulnerability alerts, CodeQL default setup, GitHub `production` environment locked to `main` (`BACKUP_DATABASE_URL`, `SENTRY_DSN`), Vercel Firewall rule `"Rate limit writes"` (`POST`, 20 req / 60 s per IP → HTTP 429), and Sentry Cron monitor `potluck-nightly-backup`.
