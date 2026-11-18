# What stays human: one-way doors

From Lesson 11.2 of "Claude Code: The Professional Engineering Workflow".

## The test that sorts them

- **Two-way door:** a revert undoes it. The loop may merge it on a green check; most changes are this.
- **One-way door:** a revert can't undo it. A person walks through it.

Typical one-way doors in a web app:

| Door | Why a revert can't undo it |
|---|---|
| Merging a migration | Once it has run against production, reverting the code doesn't un-run it. |
| Production settings and secrets | They live outside the repo; a leaked secret stays leaked. |
| Restoring a backup | It overwrites everything written since. |
| The launch | Links in real people's hands can't be recalled. |
| Loosening the guardrails | The file reverts, but whatever got through while it was loose stays done. |
| Rewriting `main`'s history | A force push drops commits a revert can't bring back. |
| Copying production data out | Copied data can't be recalled. |

A decision only a person can make is not automatically a one-way door: if a revert undoes it, it's a judgement call, not a door.

## Keep them in one list

- One file in the repo that people and agents both read (Potluck: `docs/agents/what-stays-human.md`), pointed to from
  `CLAUDE.md` in one line.
- One row per door: **why a revert can't undo it** and **what enforces it today**: a guard, a written rule, or "nothing yet".
  "Nothing yet" is the most useful entry: it is the to-do list.
- Start from the doors you already keep: tickets labelled `ready-for-human` and their reasons, landing rules, deny rules.
- **No guesses in a rule file.** Whoever reads it next treats every row as checked. Drop a claim nobody checked, or check it.

## Fence the unattended run

- The workflow refuses `ready-for-human` tickets in its first step, before checkout.
- `--disallowedTools` takes away the files behind the doors: `Edit(/path)` rules (they cover `Write` too; a leading `/` counts
  from the repo's root, `**` means everything under a folder), plus any command that reaches around them (`git rm`).
- Prove it on a scratch copy with the workflow's own arguments and **two controls** that must be allowed. A test that denies
  everything is broken, not strong.

## Seatbelt and wall

- **Seatbelt:** the deny list. It catches mistakes in Claude's own tools; a script a test runs could still write a file.
- **Wall:** a person at the merge. A pull request that carries a migration never auto-merges, and someone reads its door line.

## Who keeps the understanding

Claude can write every line. If nobody reads anything, you get what Matt Pocock calls a dark factory: code that merges with no
one looking, which soon means code nobody understands. A person reads the behaviour, the evidence and the door line of every
pull request, and the one-way doors never open without that person.

---
"Dark factory" is Matt Pocock's term, described here in our own words. This course is independent: unofficial, and not
affiliated with or endorsed by Matt Pocock.
