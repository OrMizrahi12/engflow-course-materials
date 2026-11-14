# Lesson 7.2: the candidates, where each went, and what the check found

Our own summary of what `/retro` returned on camera and what we did with it. Your list will differ: it comes from your
session.

## The six candidates (most severe first)

| # | Candidate | Category | The moment it points at | Lane |
|---|---|---|---|---|
| 1 | New worktrees skip every pre-commit check | automated checks | three commits in the standards worktree printed no hook output: that worktree had no `node_modules` | real, but a separate change: kept for later |
| 2 | The glossary's _Avoid_ words are half mechanical | coding standards → automated checks | `net` (group-money.ts:51) survived seven commits and the pre-commit checks; only the first standards review caught it | **check** |
| 3 | The `CLAUDE.md` pointer aims at the wrong agent | context load | the line "Read CODING_STANDARDS.md before writing code" loads the reviewer's file into every implementing session | **out of `CLAUDE.md`** |
| 4 | Reviewers raise findings we already decided to leave | coding standards | in the second standards pass, 3 of 9 findings were things we had decided to keep | **`CODING_STANDARDS.md`** |
| 5 | The spec's body contradicts its latest comment | navigation | the spec still says the money core is inside the group service | real, but a separate change: kept for later |
| 6 | Lint runs only in CI | automated checks | the hook runs Prettier, type-check and tests, but not ESLint | **check** (ESLint in the pre-commit step) |

Before deciding, we checked candidate 2's trace by hand: `git grep -n -w net aedf1b4 -- src/money/group-money.ts` finds
line 51; the same grep on `d1808ed` prints `none`.

## The four lanes

- **Mechanical** (a fixed pattern a script can find) → a check that fails, inside `npm run check`, so CI enforces it for
  everyone. Ours: 2 and 6.
- **Judgment call** (needs a reader) → a line in `CODING_STANDARDS.md`, which only the reviewer reads. Ours: 4.
- **Steering in `CLAUDE.md`** → out, because that file loads into every session. Ours: 3.
- **No moment you can point at** → the bin.

## The trial (before the rule could block anything)

| Code tested | What the rule flagged |
|---|---|
| The engine as it was before the review (`aedf1b4`) | 4 hits, exactly the ones the review found: `net` (:51), `creditor` (:82), `debtor` (:83) and a test name (test file :148) |
| `main` with the engine merged in | 1 hit: `const trip` in `src/group/service.test.ts:31`, from pull request #16 |

The `trip` hit is real: the glossary avoids "trip" for Group, and no review had seen it. With the rule in, `main` itself
would fail lint on that line, so the input was renamed `lisbonGroup` in its own commit first. The "Lisbon trip" strings in
the test data are data and stayed.

## The five commits on the standards branch

| Commit | What it does |
|---|---|
| `0de7a38` | Name the create-group test input `lisbonGroup` |
| `7ee9afe` | Reject glossary-avoided words in names and test names (the rule reads `GLOSSARY.md`'s _Avoid_ lists); the Words section of `CODING_STANDARDS.md` now covers only what lint can't see |
| `a6b5ca8` | Lint staged scripts in the pre-commit hook |
| `cd3aa73` | Record the review findings we chose to keep as they are (names copied from the spec's code, plain string and number types, the separate suggested-settlement type) |
| `836ba0a` | Remove the `CODING_STANDARDS.md` pointer from `CLAUDE.md` (23 → 19 lines on the branch) |

Fixed inside the turn before committing (its own slips, as its report listed them): the first rename also rewrote the
"Lisbon trip" strings (restored); the first parser banned "split" in every sense (entries with a qualifier now stay with the
reviewer); a new standards line contradicted the lint rule (it now says the glossary wins).

## The landing

| PR | Merge commit | CI | Production deploy |
|---|---|---|---|
| #17 Balance engine | `065b270` | green after a branch update | success |
| #18 Coding standards and glossary lint | `ae08090` | green after a branch update | success |

Neither PR carries a migration, so auto-merge was allowed for both. #17 says "Part of #4 and #6", because those tickets still
need their service tests. #18's CI ran the new rule over `main` with the engine merged in, and passed. `CLAUDE.md` on `main`
is 19 lines, before and after.
