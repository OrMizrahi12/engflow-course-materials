# The eight tickets of spec #63, and the four that were already open

All eight are sub-issues of spec #63, published by the grilling session in lesson 12.1 with GitHub's native "blocked by"
links. Read back on 2026-11-18.

| # | Title | Label | Blocked by | Why this label |
|---|---|---|---|---|
| #64 | Fail CI on a migration that doesn't only add | `ready-for-human` | none | it edits the workflow files |
| #65 | Liveness route, and schema and storage in /api/health | `ready-for-agent` | none | code only |
| #66 | Report errors to Sentry without link tokens or IPs | `ready-for-agent` | none | code only |
| #67 | Wire Sentry to production: DSN, uptime monitor, privacy page | `ready-for-human` | #65, #66 | production settings and secrets |
| #68 | Hourly health check opens an issue when production breaks | `ready-for-human` | #65 | it edits the workflow files |
| #69 | Release only after smoke tests pass | `ready-for-human` | #65 | production settings, and the demo group created by hand in production |
| #70 | Production runbook and backup retention on the privacy page | `ready-for-agent` | none | documentation and copy |
| #71 | Launch: give the production address to the first group | `ready-for-human` | #11, #12, #34, #37, #64, #65, #66, #67, #68, #69, #70 | the launch is a one-way door |

Five of the eight wait for a person, three can go to an agent today. The order the session gave: #67 waits on #65 and #66;
#68 and #69 wait on #65; #11 waits on #67 and #70; #71 waits on everything above, plus #12, #34 and #37.

## The four tickets that were already open

| # | Title (after lesson 12.1) | Label | What changed in this lesson |
|---|---|---|---|
| #11 | Nightly encrypted backups before launch | `ready-for-human` | now waits on #67 and #70; rewritten by the session: a nightly `pg_dump`, encrypted with `age`, kept as an artifact for 14 days, key offline (this reverses its old "artifacts ruled out") |
| #12 | Gate merges with four checks and protect production | `ready-for-human` | not discussed in the grilling; still a launch blocker as written |
| #34 | Confirm three additions made beyond the v1 tickets | `ready-for-human` | not discussed; still a launch blocker as written |
| #37 | Group link tokens in Vercel's production request logs | `ready-for-human` | a comment from the session: the risk is accepted (Hobby keeps runtime logs for one hour) |

`gh issue list --label ready-for-human` printed 7 issues before the lesson and 12 after it; `--label ready-for-agent` printed
three (#70, #66, #65).

## What did not happen

`/to-spec` and `/to-tickets` were not run. The round-two answer ended with "Then wrap up.", meant as the end of the grilling;
the session took it as the go for the whole job and wrote the spec and tickets itself, from the grilling. That skipped the
quiz `/to-tickets` would have asked before publishing (is each ticket a slice you can demo, are the blocking links right?),
so we did that review afterwards, from the table in its reply. In your own run, use the two skills.
