# Card: /implement

Builds work that is already decided: one ticket, one run, one commit on the branch you are on.

| | |
|---|---|
| **In** | one ticket (`/implement #2`), plus a sentence or two of scope when the ticket is bigger than one session |
| **Out** | a commit on the current branch, and a report with the review's findings |

## What one run does

1. Reads the ticket from the issue tracker and states its title before it starts (check it is the ticket you meant).
2. Drives `tdd` at the seams the spec agreed: a failing test first, then the code.
3. Typechecks and runs single test files as it goes; the full suite once, at the end.
4. Runs `code-review`: two reviewers in parallel, one for the repository's standards, one for the spec.
5. Commits to the current branch. (The review only sees committed work, so on camera it committed first and reviewed after.)

## What it leaves to you

- **No branch.** It commits to whatever branch you are on. Start it in a worktree (`claude -w <name>`), which gives the
  change its own folder and branch.
- **No push, no pull request.** Ask for them, or do them in the next step.
- **The review's findings.** It reports them and asks; the decisions are yours.
- **The ticket.** It never closes it and never ticks its boxes. Close it yourself when the work is really done.

## When to reach for it

- The work is decided: a ticket from `/to-tickets`, or a small spec. One ticket per session.
- Not decided yet: grill first (`/grill-with-docs`).
- Want it checked, not built: `code-review` on its own.

## It's working if

- The session opens by reading the ticket and restating what it will build, not by asking you what to build.
- You see an actual `tdd` Skill call in the trace, not only tests appearing in the diff.
- Typechecks and single test files run during the run, and the full suite once near the end.
- The run reaches a commit on your current branch without you nudging it.

From the open-source `implement` skill in mattpocock/skills (MIT License; the license notice is in the student kit's
README), described here in our own words. Independent course: unofficial, and not affiliated with Matt Pocock.
