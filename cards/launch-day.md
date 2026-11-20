# Launch day — one-page card

## 1. Fresh-session readiness review (before fixing anything)

Never let the sessions that wrote the code sign off on launch. Open a fresh worktree (`claude -w launch-review`) and run two-axis `/code-review`:
- **Inputs:** fixed-point diff (`<pre-prod-tag>..HEAD`), production spec, open launch blockers, read-only live check (`.claude/skills/verify/PRODUCTION.md` — never touch the production DB).
- **Axes:** **Standards** (repo conventions + smells) in parallel with **Spec** (missing, extra, weak).
- **Output:** unmerged leads + an honest **Go / No-Go** verdict. Check every lead against real evidence.

## 2. Clear every launch blocker honestly (one worktree = one PR)

- **Additive-only migrations in CI:** fail renames, type changes, `DROP CASCADE`, `NOT NULL` without default, and added constraints on existing tables; allow pure drops only with `Stops using: #N` where `#N` is already serving in production and no code references the column/table.
- **Accepted-risk ADRs:** record platform trade-offs explicitly (e.g., Vercel Hobby 1h logs vs Pro 1d/30d; hard rule that any future log drain must drop `/g/` requests whole).
- **Production seed guard:** refuse `VERCEL_ENV=production` unconditionally and refuse remote Postgres hosts unless an explicit override env var is set (`pg` uses the *last* `?host=` parameter).
- **Hosting settings alignment:** match Vercel Project Settings `nodeVersion` to `package.json` `engines` (`24.x`) so production builds run cleanly without version warnings.

## 3. The 6-check Go-Live Gate (proof, never memory)

| # | Check of `"independent"` | Required live proof |
|---|---|---|
| 1 | Runs without our laptop | `/api/live` HTTP `200`, `/api/health` `schemaCurrent: true` |
| 2 | Own database & secrets | Scoped Vercel + GitHub `production` env names only, offline `mode 600` `age` key |
| 3 | Deploys only from `main` | Active branch ruleset, build source guard, additive-migration CI, green smoke test |
| 4 | Can be restored | Real encrypted nightly artifact + logged timed scratch-branch restore drill |
| 5 | Tells us when it breaks | Sentry errors (scrubbed) + 5-min uptime + nightly cron + hourly health workflow |
| 6 | One command rolls back | Tested `vercel rollback` + `vercel promote` incident drill |

Only when **0 blockers** remain and all 6 carry live evidence does a human merge the launch PR (one-way door).

## 4. Launch-day privacy & free-tier telemetry

**Guardrail:** Never show, paste, or log real visitors' group tokens or personal data. Use your own clean test group to verify launch, and always scrub `/g/<token>` → `/g/[token]`.

- **Traffic & 5xx:** `npx vercel logs requests --project <p> --environment production --since 59m | sed -E 's#/g/[^ ?]+#/g/[token]#g'` and `--query 'httpStatus >= 500'`.
- **Errors (1h / 30d):** `npx vercel logs runtime --query 'level:error' --since 59m` + Sentry Issues (`is:unresolved`).
- **Slowest routes:** Hobby Observability has no latency percentiles — measure directly with `curl -w "%{time_total}s ttfb=%{time_starttransfer}s HTTP %{http_code} $p\n" ... | sort -rn`.
- **Heartbeats:** Sentry Uptime (5 min on `/api/live`) + Sentry Cron (`potluck-nightly-backup`).
- **Custom domain (optional):** Vercel Hobby supports custom domains with automatic HTTPS (personal, non-commercial use only).

---
Built on the open-source [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License; unofficial, not affiliated).
