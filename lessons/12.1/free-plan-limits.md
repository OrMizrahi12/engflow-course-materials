# What the free plans allow, and what happens at each limit

The limits Potluck lives under, as checked on 2026-11-17 against each vendor's own pages, and the response spec #63 chose for
each. Plans and numbers change: check the linked pages on the day you plan your own app.

## The rule that comes first: no money on Vercel Hobby

Vercel's terms allow the Hobby plan for personal or non-commercial use only. Potluck's decision record 0001 says what that
means for us: no ads, no paid features and no taking payments from visitors; a donation link is allowed. Anyone adding money to
the app has to move to a paid plan first (on Vercel, Pro). Going over a Hobby limit pauses the site; it is not billed.

## The table (from spec #63, "Plan limits")

| Plan | Limit | At the limit | Our response |
|---|---|---|---|
| Vercel Hobby | 1M invocations, 4 active CPU-hours, 100 GB transfer a month | Production paused (503). May need a manual unpause. Warning not guaranteed. | Uptime monitor alerts; unpause by hand. Write rate limit (#12). |
| Vercel Hobby | Runtime logs kept 1 hour, no drains | Logs hold `/g/<token>` paths | Accepted (#37, ADR) |
| Vercel Hobby | Non-commercial terms | Breach | No monetization (ADR 0001) |
| Neon Free | 1 GB storage | Writes fail; reads and dumps work | Alert at 80%; per-group caps |
| Neon Free | 100 CU-hours compute, 5 GB egress a month | Everything fails, dumps included, until next month | Wait; the hourly check alerts |
| Neon Free | 10 branches | The 11th fails | 8 open PRs with previews (ADR 0003) |
| GitHub Actions | 500 MB artifacts; schedules may be dropped, disabled after 60 days without activity | Upload fails; backups and health checks stop quietly | 30 MB guard; Sentry cron check-in |
| Sentry free | 5k errors a month, 1 uptime and 1 cron monitor | Extra events dropped | Accepted |

Nothing responds to a limit automatically. A person reads this table and acts; ticket #70 puts it in `docs/production.md`.

## Sources (checked 2026-11-17)

| Plan | Page | What it says |
|---|---|---|
| Vercel Hobby | https://vercel.com/docs/plans/hobby | monthly included usage (1M invocations, 4 hours of active CPU, 100 GB of fast data transfer); past a limit you wait until 30 days have passed; runtime logs kept 1 hour |
| Vercel terms | https://vercel.com/legal/terms | the Hobby plan is for personal or non-commercial use only |
| Vercel help | "Why has my account or deployment been paused?" in Vercel's knowledge base | sustained usage past the limits can pause a deployment |
| Neon Free | https://neon.com/docs/introduction/plans | 10 branches, 100 CU-hours, 1 GB storage and 5 GB egress per project per month; restore window 6 hours (up to 1 GB of changes); over compute or egress the compute is suspended until the next billing period; over storage, writes fail; none of the limits delete your data |
| Sentry Developer (free) | https://sentry.io/pricing/ and https://docs.sentry.io/pricing/quotas/ | 5k errors, 1 uptime monitor, 1 cron monitor, 1 user; events over the quota are not accepted |
| GitHub Actions | https://docs.github.com/en/actions/writing-workflows/choosing-when-your-workflow-runs/events-that-trigger-workflows | in a public repository, scheduled workflows are disabled after 60 days with no repository activity |

Two things the spec marks as not verified yet: whether Vercel's deployment checks are available on Hobby (ticket #69 checks
that first and stops without adding a token), and whether a paused Hobby project clears by itself after 30 days or needs a
manual unpause.
