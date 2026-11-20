# Potluck at tag `lesson-12.4`

- Repository: https://github.com/OrMizrahi12/potluck
- Tag: `lesson-12.4`
- Commit: `12ea020141bf979dc5d886d21db14228dfc2a4b0`

## Check out this state in your own clone

Clone the repo (never fork it so your issues and Actions stay independent):

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-12.4
```

To start from the **beginning** of Lesson 12.4 and follow along yourself, check out the previous lesson's tag (`lesson-12.3`) instead.

## What landed in Lesson 12.4

- **PR #84** (closed `#65`): `GET /api/live` (zero database imports) and deep `GET /api/health` (reachability, schema currency, storage against `1,000,000,000` bytes, `503` on 10 s stall or missing migration).
- **PR #83** (closed `#66`): production-only Sentry SDK (`11.11.0`), errors only, token/cookie/header/IP scrubbing, protected `/api/test-error/g/[token]` route (`404` publicly, `500` only on deployment's own protected URL).
- **PR #85** (`Part of #67`; `#67` closed by hand after proving `POTLUCK-1` and uptime monitor): `scripts/setup-monitoring.sh`, `SENTRY_DSN` name fix, and the Privacy page's Error reports section (`US`, 30 days, errors only, tokens and IPs stripped).
- **PR #86**: `.claude/skills/verify/PRODUCTION.md` (80 lines, 6 read-only steps + production DB ban) and 6-line pointer in `.claude/skills/verify/SKILL.md`.
- **PR #87** (closed `#68`): `.github/workflows/health.yml` (hourly at `:17`, 30 s retry, opens/comments/closes `Production health check failing`, manual `url` input proved by `#88` opening and closing).
