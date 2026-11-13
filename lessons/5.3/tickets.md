# Lesson 5.3: the tickets as published

Ten tickets, published in lesson 5.3 as sub-issues of the spec, issue #1 "Spec: Potluck v1", in
`https://github.com/OrMizrahi12/potluck`. "Blocked by" uses GitHub's native blocking links. Each body starts with the
label and the reason for it.

| # | Ticket | Label | Blocked by | Why this label (from the ticket) |
|---|---|---|---|---|
| 2 | Walking skeleton, live at the production URL | `ready-for-human` | none | It runs through your Vercel, Neon and GitHub settings and secrets, which a session can't sign into. Its code half could run unattended, but it isn't done until the page answers in production. |
| 3 | Create a group and open it by its link | `ready-for-agent` | #2 | Everything happens inside the repo, and the spec settles every decision. |
| 4 | Record an expense and see balances | `ready-for-agent` | #3 | The spec's rules and the prototype's share snippet pin the behaviour exactly. |
| 5 | "Who are you?" and my groups on this device | `ready-for-agent` | #4 | It's fully specified and runs in the browser only. |
| 6 | Settlements and suggested settlements | `ready-for-agent` | #4 | The rules and the prototype's greedy snippet are exact. |
| 7 | Edit and delete expenses and settlements safely | `ready-for-agent` | #4, #6 | |
| 8 | Group settings: members, currency, and deleting the group | `ready-for-agent` | #6 | |
| 9 | Privacy and hardening | `ready-for-agent` | #3 | You'll still read the privacy page wording in the PR. |
| 10 | Seed data that covers every edge case | `ready-for-agent` | #7, #8 | Re-seeding Neon's `development` branch afterwards is a one-line step for you, noted in the PR. |
| 11 | Real backups before launch | `ready-for-human` | #2 | Where backups go and how often hasn't been decided, and storage would use your accounts. GitHub artifacts on a public repo are public, so they're ruled out for group data. |

## The graph

```text
#1 Spec: Potluck v1   (parent; ready-for-agent removed at the end of the lesson)
└── #2 Walking skeleton  ── the frontier: the only ticket that can start
    ├── #11 Real backups before launch
    └── #3 Create a group
        ├── #9 Privacy and hardening
        └── #4 Record an expense
            ├── #5 "Who are you?"
            └── #6 Settlements
                ├── #7 Edit and delete      (also waits for #4)
                └── #8 Group settings
                    └── #10 Seed data       (waits for #7 and #8)
```

The **frontier** is every ticket whose blockers are all done. Today it is #2 alone. When #2 is closed, #3 and #11 join it.

## How the 11 became 10

| First breakdown (11) | What we answered at the quiz | Draft and issues (10) |
|---|---|---|
| 1 Walking skeleton: create a group and open it by its link | split, as Claude suggested | T1 / #2 the skeleton; T2 / #3 create a group |
| 2 Hosting and the path to production | merged into the skeleton: nothing to demo on its own | part of T1 / #2, done at the production URL |
| 7 Managing members, 8 Group settings | 8 folded into 7: one settings page in the spec | T7 / #8 Group settings: members, currency, deleting the group |

## The six criteria that were rewritten

| Draft line | Before (true before any code existed) | After (a check that fails when it breaks) |
|---|---|---|
| 31 | The app uses a standard Postgres driver over TCP, through Neon's pooler in production. Neon's HTTP-only driver isn't used. | A CI check fails if Neon's HTTP-only driver appears among the dependencies. A second CI check reads the production connection string from Vercel's environment settings and fails unless it points at Neon's pooled endpoint. |
| 160 | It's never sent to the server, and the server never relies on it. | A Playwright test records every request and cookie while a member is claimed and then changed. It fails if the claim appears in any cookie, header or query string. |
| 234 | There's no undo, no activity log and no soft delete. | A service test deletes an expense and a settlement, then queries the database directly. It fails if any row in any table still refers to either of them. |
| 320 | There are no third-party scripts, trackers or analytics cookies. | A Playwright test loads the home page, a group page and the privacy page. It fails if the browser requests anything from a host other than the app's own, or if any cookie is set. |
| 322 | App logs never contain IP addresses. | A test sends a group-service write carrying a known client IP, captures everything the app logs while handling it, and fails if that IP appears. |
| 383 (382 after) | Production data goes nowhere except the chosen backup store. | A CI check reads the backup job's configured destination and fails if it differs from the store recorded in the decision above. |

Also removed: a seed group nobody decided ("A four-member flat with a month of mixed expenses plus a trip").

To read any ticket in full from a clone: `gh issue view 2 -R OrMizrahi12/potluck` (any number from 2 to 11).
