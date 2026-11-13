# Card: /to-tickets

One page from Lesson 5.3. A spec into tickets: thin slices you can each demo, linked by what blocks what.

## In and out

- **In:** a decided spec. Best when it is still in the window that wrote it (the docs: don't clear or compact between
  `/to-spec` and `/to-tickets`), together with the glossary, the ADRs and any prototype. You can also pass an issue number.
- **Out:** tickets on the tracker. On GitHub: one issue per ticket, each a **sub-issue** of the spec, with GitHub's native
  **blocking** links, published blockers first, with the `ready-for-agent` label unless you say otherwise.

`disable-model-invocation: true`: you type `/to-tickets`; Claude never starts it by itself. It never closes or modifies the
parent issue.

## Tracer bullets, not layers

A horizontal slice ships one layer (all the database, then all the service, then all the pages): nothing can be tried until
the last one lands. A **tracer bullet** cuts a narrow but complete path through every layer, so it can be demoed the day it
lands, and it fits in one fresh context window. Ask of every ticket: **what can I demo when this is done?** A ticket with no
answer is a layer.

## The walking skeleton first

The first ticket is the thinnest app that runs end to end, and it is done only when its page answers at its production URL.
On camera it needs your Vercel, Neon and GitHub settings, so it is steered (`ready-for-human`), and every feature waits
for it.

## The quiz is where you push back

Before anything is published it shows a numbered list (title, blocked by, what it delivers) and asks three things:

- **Granularity:** too coarse, too fine? Over-splitting is the problem users report most. Ask it to merge.
- **Blocking edges:** does each ticket wait only for tickets that really gate it?
- **Merge or split:** on camera, 11 tickets became 10 (one split, hosting merged into the skeleton, settings folded into
  members).

Ask for a draft file first on a public repository: "write all tickets to tickets-draft.md here, and don't publish yet."

## Criteria that can fail

For every acceptance criterion: **what would I see if it were false, and is it false at the commit the work starts from?**
If it is already true ("no trackers", "logs never contain IPs" in an empty repository), it grades nothing: rewrite it as a
check that fails when the behaviour breaks. Watch for invented details, and for rewrites that quietly add app behaviour.

## Steered or unattended

- `ready-for-agent`: a fresh session could finish it unattended.
- `ready-for-human`: we steer it (our accounts, a decision not made yet). Ask for the reason on every ticket.

## The frontier

Every ticket whose blockers are all done. Dispatch is manual: count the tickets on the frontier and start that many fresh
sessions, one ticket each.

## The spec's label

After the tickets exist, take `ready-for-agent` off the spec (`gh issue edit <n> --remove-label ready-for-agent`): an agent
watching for that label would try to build the whole spec in one go. The skill won't touch the parent, so you do it.

## When to reach for it

- **A decided spec that spans several sessions:** `/to-tickets`.
- **The change fits in one context window:** just build it.
- **Nothing is decided yet:** grill first, then `/to-spec`.

**It's working if** the top ticket has no blockers, every ticket answers "what can I demo when this is done?" with
behaviour, and the list came back to you before anything was published.

---
The `to-tickets` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed by
Matt Pocock.
