# Potluck at lesson 6.4

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-6.4
```

The tag `lesson-6.4` points at `aedf1b4`, the tip of the branch `worktree-balance-engine`. The branch is pushed and its
check passed, but it isn't merged: `main` is still `a20746d` (the tag `lesson-6.3`). No pull request was opened in this
lesson; the review comes first.

## The seven commits on the branch

| Commit | Message |
|---|---|
| `bb2a62a` | Split an expense evenly among its participants |
| `f5d032a` | Give an expense's leftover unit at its id's FNV-1a offset |
| `59e61e8` | Order an expense's shares by member creation order |
| `792447f` | Compute balances from expenses paid for and shares |
| `4280f07` | Count settlements in balances |
| `0f3729f` | Suggest settlements toward the member who is owed |
| `aedf1b4` | Suggest settlements by greedy matching |

They add two files and change nothing else: `src/money/group-money.ts` (the engine, 100 lines) and
`src/money/group-money.test.ts` (its seven tests). Both are in `potluck/` of this kit, exactly as they are at the tag. The
commits carry Claude Code's usual `Co-Authored-By` line, as earlier Potluck commits do. CI (the `Check` workflow, the
required check `Type-check, lint and service tests`) passed on `aedf1b4`.

The engine still holds the seven redundant bits the removal check found (`slices-and-sources.md`). They were left for the
review on purpose.

## The comment on spec #1

Spec #1 (the issue) keeps its text; the decision is recorded in a comment, posted by the session in this lesson:

> **Seam change: the money core is now a seam of its own.**
>
> The spec says the money core lives "inside the group service, not a separate seam", and that every test goes through the
> service on PGlite. That changes. The balance engine (`computeGroupMoney` in `src/money/group-money.ts`, on branch
> `worktree-balance-engine`) is tested directly: members, expenses and settlements in; each expense's shares, every
> member's balance and the suggested settlements out.
>
> **Why:** the engine is pure arithmetic, so it doesn't need the group service (#3) to exist, and its tests become the
> engine's contract. Its expected values come from the published FNV-1a test vectors and this spec's examples, including the
> five-member case (+20, +40, +30, −50, −40 give 4 suggestions), never from the prototype's code.
>
> **What stays where it was:**
> - The group service on PGlite is still the main seam. #4 and #6 add the service tests on top: refusals, caps, versions,
>   persistence and the group view.
> - The property test stays with #4, as its acceptance criteria say.
> - Parsing typed amounts stays with #4.
> - Invalid input (no participants, an amount smaller than the number of participants, an id that isn't a member) is an
>   untested precondition of the engine, because the service refuses it first.

## Issues

Tickets #3, #4 and #6 are unchanged and open (#3 is the one that can start; #4 is blocked by #3, #6 by #4). #11 and #12 are
open, `ready-for-human`. Nothing was closed in this lesson.

## Your own copy

Your branch, commits and comment will differ in their wording and hashes. What should match: one commit per slice, seven
named tests that pass, and a comment on your spec that says why the engine is its own seam.
