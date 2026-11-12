# Card: /to-spec

One page from Lesson 5.2. Decisions into a spec: one GitHub issue that a fresh session can work from.

## In and out

- **In:** what is already decided: the conversation you grilled in, Claude's notes, the glossary, the ADRs and the code
  (a prototype included). It asks nothing new: "no interview, just synthesis".
- **Out:** one issue on the project's tracker, with the `ready-for-agent` label, in a fixed shape: problem statement,
  solution, user stories (a long numbered list), implementation decisions, testing decisions, out of scope, further notes.

`disable-model-invocation: true`: you type `/to-spec`; Claude never starts it by itself.

## How it runs (on camera)

1. Run it **in the window where you grilled**: that is where the decisions are.
2. It explores the repository, then **proposes the seams** where tests will plug in (the highest seam possible, as few as
   possible, ideally one) and waits for you. It writes nothing until you agree.
3. It writes the spec and names the gaps it filled itself. Read that list first.
4. It publishes the issue and applies the label.

## Seams first

Ask one question of every proposed seam: **what does it catch, and what does it miss?** Keep a second seam only for what
the first one can't reach. On camera: the group service (every rule, against a real Postgres in PGlite) and Playwright on
each pull request's preview (only what happens in the browser). The money logic got no seam of its own: every extra seam is
one more interface to keep stable.

## On a public repository: draft first

Add one line to the command: "Write it to `spec-draft.md` in this folder first and don't publish yet." Read the draft,
then say "Publish it, then delete the draft." A published issue is visible at once.

## The check

A spec records what you decided. Read it against the decisions, not against your memory:

- **Start with the riskiest part:** decisions that live only in Claude's notes. Search for each rule's own words.
- **Read two parts above all:** the seams and Out of Scope. A wrong decision there is cheapest to catch now.
- **Look for inventions:** search for things you never decided (on camera: a hosting region, `0`, good). If the spec
  states something you never said, that's a defect.
- **Look for omissions:** something you decided that isn't there (on camera: TypeScript, `0`, a defect).
- **Send one correction** with every fix and an answer on the flagged gaps, then **search again** for all of them.

On camera the check caught four defects: an unsent questionnaire described as sent, "Recurring expenses" in Out of Scope
(never discussed), TypeScript missing, and members missing from the version rule.

## The label

`ready-for-agent` means "fully specified, ready for an AFK agent". An agent left running on its own and watching for that
label would try to build the whole spec in one go. The next step is to cut the spec into small tickets (lesson 5.3).

## When to reach for it

- **Everything is decided and the build takes several sessions:** `/to-spec`.
- **Nothing is decided yet:** grill first (`/grill-me`, `/grill-with-docs`).
- **It fits in one session:** just build it.

## Rules of thumb

- **Don't clear or compact between `/to-spec` and the tickets.** Grilling, spec and tickets belong to one conversation.
  Past 150k tokens the window is out of the smart zone, so read the output more carefully, not less.
- **The issue is the source of truth once it's published.** Delete the draft; edit the issue, not a copy.

**It's working if** you remember making every decision in the spec, and every line you don't remember is either fixed or
on the skill's own list of filled gaps.

---
The `to-spec` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License,
described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
