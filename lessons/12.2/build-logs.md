# Production build logs (PR #76 and PR #78)

## Command used to inspect the latest production build log

```bash
id=$(gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq ".statuses[] | select(.context==\"Vercel\") | .target_url | split(\"/\") | last"); npx vercel@65.5.0 inspect dpl_$id --logs 2>&1 | grep -E "Running \"npm|[Rr]estore |LSN:|Time: |igrat|Build Completed"
```

## PR #76 (`743b95b`) — nothing pending

No migration was added, so no restore point was printed:

```text
2026-11-18T15:14:50.082Z  Restored build cache from previous deployment
2026-11-18T15:14:53.635Z  Running "npm run db:migrate && npm run build"
2026-11-18T15:14:53.780Z  > potluck@0.1.0 db:migrate
2026-11-18T15:14:53.780Z  > tsx --env-file-if-exists=.env.local scripts/migrate.mts
2026-11-18T15:14:56.720Z  Migrations applied and verified.
2026-11-18T15:15:05.406Z  Build Completed in /vercel/output [13s]
```

## PR #78 (`a9ebd22`) — pending `0007_drop_app_info`

A migration was pending in production, so the build printed the restore point (LSN, UTC time, and Neon CLI restore command, zero secrets) before running the migration and verifying the journal:

```text
2026-11-18T16:09:29.639Z  Running "npm run db:migrate && npm run build"
2026-11-18T16:09:29.749Z  > potluck@0.1.0 db:migrate
2026-11-18T16:09:29.749Z  > tsx --env-file-if-exists=.env.local scripts/migrate.mts
2026-11-18T16:09:31.920Z  Restore point before migrating production (pending: 0007_drop_app_info)
2026-11-18T16:09:31.920Z    LSN:  0/1F1B7B0
2026-11-18T16:09:31.920Z    Time: 2026-11-18T16:09:31.872Z
2026-11-18T16:09:31.920Z  To restore production's root branch to this point (a person's call, only within Neon's ~6-hour history), run:
2026-11-18T16:09:31.920Z    neon branches restore production ^self@0/1F1B7B0 --preserve-under-name production_before_20261118_160931
2026-11-18T16:09:32.973Z  Migrations applied and verified.
2026-11-18T16:09:43.664Z  Build Completed in /vercel/output [15s]
```
