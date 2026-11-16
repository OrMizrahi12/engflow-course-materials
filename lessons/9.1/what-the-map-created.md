# What the map created (lesson 9.1)

One charting session, about 1 minute 45 seconds of work after our second answer, plus two background research agents.
Nothing was built: `main` did not move.

## Labels

Five new labels, because the repository had none: `wayfinder:map`, `wayfinder:research`, `wayfinder:prototype`,
`wayfinder:grilling`, `wayfinder:task`.

## The map: #41 "Map: multi-currency groups"

Label `wayfinder:map` and nothing else (no triage label, no `ready-for-agent`). Its body has five sections:

| Section | What it held on camera |
|---|---|
| Destination | A handoff-ready spec issue, "Spec: multi-currency groups", written like "Spec: Potluck v1": a group can record amounts in other currencies while balances and suggested settlements stay in one currency per group. The map ends when nothing is left to decide; building happens afterwards, through normal tickets. |
| Notes | What every later session reads first: the domain (Potluck v1, built; read `GLOSSARY.md` and the v1 spec), the glossary's "one currency" definition being what this effort reopens, how grilling tickets load their skills, and our standing constraints (one currency per group for balances; existing groups unchanged until someone adds another currency; a rate source must be free and need no account; a typed-in rate stays possible; a currency no source covers is handled by the design, not dropped from the picker). |
| Decisions so far | Empty at first. Each research agent added one line: a gist and a link to its ticket. |
| Not yet specified (the fog) | Rounding at conversion; the entry form and expense list (likely a prototype once the model is known); editing and changing the group's currency; caps; what happens when a rate source fails; the glossary words. |
| Out of scope | Per-member home currencies; bank or ATM fees as their own thing to split; crypto and other non-ISO 4217 currencies; rate charts or history in the UI. |

## The four tickets (sub-issues of #41)

Each body is one `## Question`. Each has exactly one `wayfinder:<type>` label.

| # | Title | Type | Blocked by | At the end of the lesson |
|---|---|---|---|---|
| 42 | Where exchange rates can come from | research (away from keyboard) | nothing | closed, assigned, resolution comment, line in Decisions so far |
| 43 | How other apps handle more than one currency | research (away from keyboard) | nothing | closed, assigned, resolution comment, line in Decisions so far |
| 44 | How a foreign amount becomes part of a balance | grilling (human in the loop) | #42, #43 (both closed) | open, unassigned: **the frontier** |
| 45 | Settlements in another currency | grilling (human in the loop) | #44 | open, still blocked |

The blocking links were added in a second pass, after all four tickets existed, with GitHub's native issue dependencies
(`.../issues/<child>/dependencies/blocked_by`, using the blocker's database id). That is why #45's page says "Blocked by:"
right under its title.

## What the research found (in our words)

- **Rate sources (#42):** four free sources that need no key. The best fit, Frankfurter version 2, covers 154 of the 164
  currencies in Potluck's picker and can be self-hosted; seven fund and accounting codes have no free source, so those need a
  typed-in rate. Two findings for the next decision: an official blended rate can be far from what a card actually charged,
  and fetching rates on the server keeps the privacy page's promise, while fetching them in the browser would show a
  member's IP address to the provider.
- **Other apps (#43):** the common pattern is to convert once, when the amount is entered, and keep the original amount and
  the rate on the expense (Spliit, Settle Up, Tricount). Keeping a balance per currency draws the most complaints. Overriding
  the rate is standard; nobody solves converted odd cents; settling in another currency barely exists.

## The research branches (pushed, no pull request, never merged)

| Branch | Commit | File | Lines |
|---|---|---|---|
| `research/exchange-rate-sources` | `483af88` | `docs/research/exchange-rate-sources.md` | 145 |
| `research/multi-currency-in-other-apps` | `14a0167` | `docs/research/multi-currency-in-other-apps.md` | 129 |

Each push ran the repository's Check workflow and a Vercel preview; both passed. The two worktrees the agents used were
removed at the end of the lesson, with the two local databases their setup had created; the branches stay, locally and on
GitHub.
