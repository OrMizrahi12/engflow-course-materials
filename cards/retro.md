# Card: /retro, look back at one session and fix the environment

## What goes in, what comes out

| In | Out |
|---|---|
| One session's record: what you asked for, what went wrong, what the reviewers found, what you decided | A list of candidates, most severe first |
| The repo's own checks and steering files (`CLAUDE.md`, `CODING_STANDARDS.md`, lint, hooks) | Each one pinned to a moment in that session, with a category and a suggested change |

It only proposes: nothing changes until you pick. You start it; Claude never does (the skill is user-invoked).

Type `/retro` (in some versions only the plugin's full name, `/mattpocock-skills:retro`, is found), a space, then the
scope: "This session, from … to …. Tie each suggestion to the moment in it that shows it."

## The four lanes

| The candidate is | It becomes | Because |
|---|---|---|
| **Mechanical**: a fixed pattern a script can find | a check that fails, inside `npm run check` | CI enforces it for everyone |
| **A judgment call**: it needs a reader | a line in `CODING_STANDARDS.md` | only the reviewer reads that file |
| **Steering in `CLAUDE.md`** | moved out | that file loads into every session |
| **Not pinned to a moment** | the bin | you can't check it |

`CLAUDE.md` holds navigation pointers (short lines that say where to look); standards are for the reviewer; checks are for
everyone.

## Reach for it when

- A session was harder than it should have been. Run it **before you clear**, while the struggles are still in the context.
- The session left the smart zone (compacted, very long)? Clear, and point a fresh `/retro` at that session's log.

## Not for

- A smooth session: it has little to teach.
- A verdict on the code: that is code review.

## After a bug fix (lesson 10.4)

The same skill, pointed at one fixed bug instead of a whole session: "What in this repo let #14 reach a user, and what would
have caught it first?" It reads the workflows, the history of the broken rule and the tests, and sorts each candidate the
same way.

| On camera | What it becomes |
|---|---|
| The same flaw is live in three more fields, found by one grep | mechanical: one shared helper and a CI step that fails on the grep |
| No test ever exercised the rule | the regression test from phase 5 covers it now |
| CI checks `main` only after the code lands | a local pre-commit hook, the cheapest gate on that plan |
| End-to-end tests run only on release tags | they can't be the first catch |

It still only proposes ("I haven't made any of these changes"). Pick one and have it filed as an issue with `needs-triage`, so
it waits in the tracker like any other report.

## It's working if

- Every candidate you keep points at a moment you can find, and you checked at least one yourself.
- A new check fails on the old mistake and passes on good code before it can block a merge.
- Whatever it finds on `main` is fixed or explained, not silenced.
- `CLAUDE.md` didn't grow.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. Unofficial, not
affiliated with or endorsed by Matt Pocock. First used in lesson 7.2; after a bug fix in lesson 10.4.
