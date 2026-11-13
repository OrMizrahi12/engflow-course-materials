# Card: /pr, a pull request a reviewer can judge in a minute

## What goes in, what comes out

| In | Out |
|---|---|
| A reviewed branch and its ticket | A pull request body in three parts |
| What you want as evidence (what to compare, what to run) | **Summary**: the smallest picture of the change (a tree, a diff sketch, pseudocode) |
| Anything left undone, for a follow-up issue | **Evidence**: a before and an after (output, a test run, a screenshot) |
| | **Merge Danger**: the door (one-way or two-way) and the blast radius (one word) |

## The door and the blast radius

- **A two-way door** can be walked back: revert the merge and you are where you were.
- **A one-way door** can't be fully undone by a revert. Our first production merge applied a migration: reverting the code
  would not remove the table it created on the production database.
- **The blast radius** says what a bad merge would touch: a file, a page, the CI, production.

## How it runs

1. It reads the branch, the ticket and the repository's language (its glossary) and keeps prose short.
2. It picks the smallest view that makes the change clear, gathers real evidence, then writes the door call.
3. It writes the body only. Opening the pull request or merging is a separate step, done by whoever asked for it.

In the plugin it may be called `/mattpocock-skills:pr` when the short name isn't found.

## Reach for it when

- Claude writes any pull request body, yours or an agent's.
- You review: read the door line first. A one-way door is a merge you do yourself.

## Not for

- Deciding whether to merge. The agent that wrote the change is the one grading it: be most suspicious when it says
  two-way and small.

## It's working if

- The summary fits on one screen and shows the change, not the process.
- The evidence is a real before and after from this branch, not a promise.
- The door and blast-radius lines are sentences you can check and disagree with.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words; the skill credits
its menu of summary visuals to Dex Horthy's `show-me`. Unofficial, not affiliated with or endorsed by Matt Pocock. First
used in lesson 6.3.
