# Card: what "in production" really means

One page from Lesson 12.1. Deployed means it runs. In production means people can count on it.

## Six checks you can test

An app is *independent* when each of these is a yes:

| # | Check | Potluck before lesson 12.1 |
|---|---|---|
| 1 | It runs without my laptop or terminal. | yes |
| 2 | It has its own database and secrets. | yes |
| 3 | It deploys only from `main`. | yes |
| 4 | It can be restored. | not yet: a ticket (#11, nightly encrypted backups) |
| 5 | It tells us when it breaks. | not yet: tickets (#65, #66, #67, #68) |
| 6 | One command rolls a bad deploy back. | not yet: a ticket (#69, the release gate) and `vercel rollback`, run by a person |

A definition only helps if you can check it. Score your own app today; the "not yet" rows become the work.

## The words, one line each

| Word | Meaning |
|---|---|
| Deploy | a build of `main` on production's database, reachable at its own address |
| Release | the production address moving to a deploy (only after its smoke tests pass) |
| Rollback | a person moving the address back one release; the schema stays as it is |
| Revert | a new commit that undoes an earlier one: it goes through the normal path, like any change |
| Backup | an encrypted copy of production data, kept outside the database |
| Restore | overwriting production data with an earlier state (never to undo one user's delete) |
| Launch | the first time the production address reaches anyone outside the repo |
| Incident | production failing its users, from the alert until the fix is released and a short note is written |

Because a rollback leaves the schema where it is, old code must work with the new schema: migrations may only add. Make that a
CI check, not a habit.

## What users must never lose, with honest numbers

Say what you protect and how much a disaster could still take. Potluck's answer: a saved entry and a group link that worked.
On free plans the honest number is any point in Neon's last 6 hours, and beyond that the last nightly backup, so up to a day
in the worst case. Backups are for operator disasters (a bad migration), not for undoing a user's delete.

## The free plans' rules

- **No money on Vercel Hobby.** Non-commercial only: no ads, no paid features, no payments; a donation link is allowed. Adding
  money means a paid plan first.
- **At a limit, things stop; nothing is billed.** Vercel pauses production (503). Neon stops writes at 1 GB of storage, and
  past its compute or egress allowance everything fails, dumps included, until next month. Sentry drops errors past 5k a
  month. GitHub disables scheduled workflows after 60 days without activity in a public repository.
- **Nothing responds to a limit automatically.** Write the table down, with what you see and what you do for each row.

## One-way doors stay with a person

Production settings and secrets, workflow files, copying production data out, restoring a backup, seeding production, and
the launch. A ticket that walks through one of them is `ready-for-human`; code-only tickets can be `ready-for-agent`.

## How to get there

1. A fresh session in a worktree: `claude -w production-readiness`.
2. `/grill-with-docs` with one brief: deployed, not launched; the plans you stay on; what "independent" means, what users
   must never lose, deploy versus release, what each plan allows. New words in their own glossary section.
3. Answer each round in one line, by number; put your own definition where a recommendation is vague.
4. `/to-spec`, then `/to-tickets` (its quiz comes before anything is published). Check the labels: every account or settings
   ticket `ready-for-human`.
5. Land the glossary change by pull request. If a hook fails, fix the cause or work around it; don't skip the hook.

## It's working if

- your six-checks score is written down, with a ticket for each "not yet";
- you can say how much a disaster could lose, in hours;
- every ticket that touches an account, a secret, a workflow or the launch waits for a person.

---
`/grill-with-docs`, `grilling`, `domain-modeling`, `to-spec` and `to-tickets` are skills from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, described here in our own
words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
