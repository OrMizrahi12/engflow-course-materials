# Eyes on production

One-page reference card for Lesson 12.4.

## 1. Two questions, two rhythms

| Question | Endpoint | Rhythm | Touches Postgres? | Why |
|---|---|---|---|---|
| **Is it up?** | `GET /api/live` | Every 5 minutes (Sentry uptime monitor, alerts after 3 misses = 15 min) | **No** (imports nothing from `src/db`) | Keeps Neon Free sleeping after 5 idle min |
| **Is it healthy?** | `GET /api/health` | Hourly (`.github/workflows/health.yml` at `:17`, retries once after 30 s) + release smoke tests | **Yes** (reachability, schema currency, storage against 1,000,000,000 B) | ~15 compute-hours/month instead of burning 100h in ~17 days (`0.25 CU × 24h = 6h/day`) |

## 2. How `/wizard` handles human-only production setup

1. **You bring human-only steps:** accounts, browser dashboards, OAuth links, production cutovers.
2. **Agent scopes and asks first:** lists stages and questions before writing anything.
3. **Agent writes, checks, and stops:** outputs a re-runnable shell script (`bash -n`, `shellcheck`, fake-JSON `jq` test), never runs it.
4. **You run it in your shell:** opens each page, tells you what to click, confirms before side effects, catches mismatches (like `SENTRY_DSN` vs `NEXT_PUBLIC_SENTRY_DSN`) before deploying.

Use `/wizard` for dashboard and cutover setup; skip it when the agent can run CLI/code changes directly.

## 3. Error reporting without leaking user data

- **Production builds only:** read `SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` only when `VERCEL_ENV === "production"`; preview bundles carry zero DSN references.
- **Errors only:** tracing, session replays, and sessions stay off.
- **Defense-in-depth scrubbing:** strip `/g/<token>` -> `/g/[token]` (without rewriting source-map file paths), disable cookies, headers (`x-forwarded-for`), request bodies, query strings, local variables, and DB query data separately, **and** enable Sentry's server-side **Prevent Storing of IP Addresses**.
- **Safe live proof:** a test-error route that returns `404` on the public address and throws `500` only when hit on a deployment's own protected URL via `vercel curl`.

## 4. Four read-only windows, one solid wall

| Window | Tool | What Claude reads |
|---|---|---|
| 1 | Vercel CLI (`--scope <team_id>`) | Live deploy, timestamp, region (`fra1`), last hour of runtime logs (`--since 59m` on Hobby) |
| 2 | GitHub CLI (`gh`) | Commit statuses on `main`, workflow runs, issues |
| 3 | Sentry HTTP MCP (`Inspect Issues & Events` only) | Open issues & events (49 read-only tools — cannot resolve or mutate) |
| 4 | Live site via `verify` | `GET` requests only (`/api/live`, `/api/health`, public routes) |

**The solid wall — the production database:** zero connection strings, zero `vercel env pull`, zero `psql`, zero Neon MCP (Neon's docs specify its MCP is for development and testing, never production).

## 5. Signal versus noise

- **Wake a person:** site down, new unhandled production error, database unreachable / schema drift / storage ≥ 80%.
- **Noise (log or ticket, don't page):** bots, preview builds, deliberate test errors, already-recovered past failures, known low-urgency warnings (e.g., `pg` SSL alias notice -> ticket, not page).

---
Uses the open-source `implement`, `wizard`, `writing-for-agents`, and `pr` skills from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License). Unofficial course; not affiliated with or endorsed by Matt Pocock.
