# Card: /implement-spec

**One spec, one run, one pull request, and the merge to main is still yours.**

## What goes in, what comes out

- **In:** a spec already split into tickets, with "blocked by" edges between them (a task graph).
- **Out:** every ticket built and merged into one integration branch, reviewed once, fixed once, and handed back as a single
  pull request that closes the tickets and leaves the spec open.

## How it runs

1. One orchestrator session (start it with `claude -w <name>` from an up-to-date main checkout; its worktree's branch becomes
   the integration branch).
2. The **frontier**: the tickets with nothing open in their way. One **implementer sub-agent** per frontier ticket, each in its
   own worktree and branch, test-first, merging the integration branch into its own before it reports.
3. A **merger sub-agent** merges each finished ticket into the integration branch. If that changes the frontier, the next
   implementers start.
4. A draft pull request opens after the first merge (a branch with nothing ahead of `main` can't open one).
5. Once every ticket is in: one code review of the whole branch, one implementer for all its fixes, focused checks, the pull
   request marked ready, the implementer worktrees cleaned up.

## Three lines a GitHub run needs

- **The frontier from merges.** GitHub unblocks a ticket only when its blocker closes, and tickets close when the pull request
  merges, at the end. Tell it to track what has merged into the integration branch.
- **One review, then focused checks, then stop.** A second broad review can turn the end of a run into hours.
- **No merge to `main` when there are migrations.** The pull request goes through your gate like any other.

## Collisions at merge time

Worktrees keep the files apart while the tickets are built; two tickets that look independent can still change the same
lines or break each other's tests. That surfaces when they merge: read the merges and the final reply before you merge.

## When not to use it

- One ticket, or work with no graph: `/implement` is the better fit.
- Tickets that need your accounts, keys or decisions: label them for a human and leave them out of the run.
- A large spec on a tight usage budget: a run like this is long. Try a small spec first.

## It's working if

- the first wave is exactly your frontier, and a blocked ticket starts as soon as its blocker has merged into the integration
  branch, while GitHub still shows it blocked;
- each implementer has its own worktree, branch, port and database;
- the review runs once, on the whole branch;
- the single pull request closes every ticket of the run, leaves the spec open, and you merge it yourself when it carries a
  migration.

Uses the open-source `implement-spec`, `code-review` and `tdd` skills from [mattpocock/skills](https://github.com/mattpocock/skills)
(MIT License), described in our own words. Unofficial, not affiliated with Matt Pocock.
