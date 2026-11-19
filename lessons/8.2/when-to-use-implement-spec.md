# When to use /implement-spec, and the three lines a GitHub run needs

## Reach for it when

- a spec is already split into tickets, and
- the tickets have "blocked by" edges between them, so they form a task graph with a frontier, and
- every ticket in the run can be built without your accounts, keys or decisions.

## Use something else when

- there is one ticket, or the work has no graph: `/implement` (lessons 6.1 and 7.4);
- the tickets are independent and you want to watch each one: parallel worktree sessions (lesson 8.1);
- a ticket needs a person: label it `ready-for-human` and leave it out.

## The three lines

Add these to the request after `/implement-spec #<spec>`, in your own words:

1. **Compute the frontier from merges.** "GitHub only unblocks a ticket when its blocker closes, and these close when the PR
   merges at the end, so track which tickets have merged into the integration branch and compute the frontier from that."
2. **One review, then stop.** "Run the review once, at the end; after its fixes, run focused checks and stop."
3. **Your gate for migrations.** "Don't merge to main: the PR carries migrations, so that's ours (landing.md)."

The lesson's full prompt also names the tickets, leaves the human ones alone, asks each implementer to run the setup command
first, and says the pull request closes the tickets, not the spec: `prompts/implement-spec-p1.txt`.

## While it runs

- Compare `git log --oneline --graph --merges main..<integration branch>` with GitHub's "blocked by" list: the run moves on
  merges, GitHub on closed issues.
- Expect collisions at merge time, and read what the mergers resolved.
- Watch the cost: the lesson's run took 2 h 43 min and just under a million output tokens.

Built on the open-source [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License); unofficial, not affiliated
with Matt Pocock.
