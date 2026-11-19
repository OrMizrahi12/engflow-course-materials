# Spec #63: production readiness, as published

Issue #63 in the Potluck repository, title `Spec: production readiness`, no label (its eight tickets carry the labels).
The body below is exactly as the grilling session published it during lesson 12.1, read back on 2026-11-18.

---

## Problem Statement

Potluck is deployed but not launched: nobody outside the repo has the production address. Once real people have a group link, it can't be recalled, and their data rides on whatever production does. Today a merge goes live untested, nothing tells the operator when production breaks, the only backup is Neon's ~6-hour history, and the free plans' limits fail silently.

## Solution

Before the **launch**, Potluck becomes **independent** (see `GLOSSARY.md`, *Running Potluck*). That means six checks, each testable:

1. It runs without the operator's laptop or terminal.
2. It has its own database and secrets.
3. It deploys only from `main`.
4. It can be restored.
5. It tells us when it breaks.
6. One command rolls a bad deploy back.

We stay on the free plans we have: Vercel Hobby, Neon Free, GitHub Actions and Sentry's free plan.

## What a user must never lose

- **A saved entry.** It survives anything except a link holder changing or deleting it. That holds up to a stated window: any point in Neon's last 6 hours, and beyond that the last nightly **backup**, so up to a day.
- **The group link.** A link that worked keeps working.
- A device's my-groups list and "who are you?" may be lost (spec #1). So may anything a link holder deletes. A deleted group lingers in backups for up to 14 days, and the privacy page says so.
- Backups exist for operator disasters. A **restore** never undoes one user's delete.

## Deploy, release, rollback

- A merge to `main` builds a **deploy**, which also runs its migrations against production. A **release** is the production address moving to that deploy. Vercel's deployment checks hold the address until a **smoke test** check passes on that commit. No Vercel token is needed.
- Smoke tests are read-only. They check that the home page renders, that `/api/health` reaches the database at the current schema, that a made-up `/g/<token>` shows "No group at this link", and that a demo group, created by hand in production, opens.
- **Rollback** is `vercel rollback`, run by a person. It moves the address back one release and never touches the schema. The fix is then released through the normal path. Past one step, we fix forward.
- Because old code meets new schema, migrations may only add. This stops being "a rule of this spec that can be changed" (spec #1) and becomes a CI check.

## Knowing it broke

- **Sentry**, in the existing org, collects errors only: no tracing and no replays. IP collection is off. `/g/<token>` is rewritten to `/g/[token]` in events and breadcrumbs before sending. The privacy page names the org's region, which we read when wiring it up.
- **Sentry uptime monitor**: every 5 minutes, on a route that never touches the database.
- **Hourly GitHub Actions check** on `/api/health`, which touches the database and reports Neon storage use. A failure, or storage at 80% of 1 GB, opens or updates a GitHub issue.
- **Sentry cron monitor** (the plan's one): the nightly backup checks in, and a missed check-in alerts.
- An **incident** runs from the alert until the fix is released and a short note about it is written.

## Backups

- Nightly, in this repo's GitHub Actions: a `pg_dump` of the root branch, encrypted with `age` to a public recipient in the repo. It's kept as an artifact for 14 days. The private key stays offline with the operator.
- This reverses #11's "artifacts ruled out". An ADR records the trade-off: anyone can download the ciphertext, a leaked key exposes 14 days of dumps, and a lost key means no backups.
- The job fails loudly if a dump is over 30 MB, keeping 14 copies under the 500 MB artifact quota.
- A restore into a scratch Neon branch is drilled once, and the steps are written down.

## Plan limits (checked 2026-11-17) and what happens at each

| Plan | Limit | At the limit | Our response |
|---|---|---|---|
| Vercel Hobby | 1M invocations, 4 active CPU-h, 100 GB transfer a month | Production paused (503). May need a manual unpause. Warning not guaranteed. | Uptime monitor alerts; unpause by hand. Write rate limit (#12). |
| Vercel Hobby | Runtime logs kept 1 h, no drains | Logs hold `/g/<token>` paths | Accepted (#37, ADR) |
| Vercel Hobby | Non-commercial terms | Breach | No monetization (ADR 0001) |
| Neon Free | 1 GB storage | Writes fail; reads and dumps work | Alert at 80%; per-group caps |
| Neon Free | 100 CU-h compute, 5 GB egress a month | Everything fails, dumps included, until next month | Wait; the hourly check alerts |
| Neon Free | 10 branches | 11th fails | 8 open PRs with previews (ADR 0003) |
| GitHub Actions | 500 MB artifacts; schedules may be dropped, disabled after 60 days without activity | Upload fails; backups and health checks stop quietly | 30 MB guard; Sentry cron check-in |
| Sentry free | 5k errors a month, 1 uptime and 1 cron monitor | Extra events dropped | Accepted |

Nothing responds to a limit automatically. The table goes in `docs/production.md` with the response for each limit.

## One-way doors (from `docs/agents/what-stays-human.md`)

| Door | Where it is in this spec |
|---|---|
| Changing production settings or secrets | Vercel deployment checks; Sentry DSN; uptime and cron monitors; health-check and backup secrets |
| Copying production data out | Adding the nightly backup job and its `age` recipient; Sentry events (scrubbed) |
| Restoring a backup | The restore drill targets a scratch branch only. A real restore stays human. |
| Seeding production | #34 is still open and undecided |
| The launch | The last ticket, blocked by every other one |

Every ticket below that walks through one of these is `ready-for-human`.

## Out of Scope

- Paid plans, a custom domain, log drains, or feature flags.
- A rollback script, or rolling back more than one release.
- Restoring a single group on request.
- Automatic responses to plan limits.
- A soft launch: the first link in a real person's hands is the launch.

## Further Notes

- Supersedes spec #1 on: the add-only rule (now enforced), "Neon's history is the only backup", and #11's ban on artifacts.
- Not verified yet: whether Vercel's deployment checks are available on Hobby, and whether a pause clears after 30 days or needs a manual unpause. The release-gate ticket checks the first. If deployment checks aren't on Hobby, come back here: don't add a token without asking.
- Not grilled in this session, still launch blockers: #12 (four checks, pooled endpoint, rate limit, Node 24) and #34 (seed guard).
