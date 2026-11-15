# Potluck at the tag `lesson-8.1`

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it). The tag `lesson-8.1` points at
`8c2522d`, the merge of pull request #29 on `main`.

## What this lesson added to `main`

| Pull request | Ticket | How it landed |
|---|---|---|
| #26 Give each worktree its own setup, database and port | (no ticket: one prompt) | auto-merge after the required check, `a97dc21` |
| #27 | #23 Unknown group link logs a dev error | auto-merge, `067ec14`; the merge closed #23 |
| #28 | #9 Privacy and hardening | behind `main` → `gh pr update-branch` → auto-merge, `877dfeb`; closed #9 |
| #29 Record an expense and see balances | #4 | a migration (`drizzle/0002_expenses.sql`): merged by hand after a merge with `main` (`46cc900`), `8c2522d` |

`git log --oneline --first-parent -4 lesson-8.1` lists them, newest first.

## Files to look at

- `scripts/setup-worktree.mjs` and the `setup:worktree` script in `package.json`: refuses to run in the main checkout; installs
  dependencies (which also turns the pre-commit hook on); creates `potluck_<worktree name>`, migrates and seeds it; picks the
  first free port from 3100 up that no other worktree holds; writes both into `.env.local`. Safe to run again.
- `.worktreeinclude`: `.env.local`.
- `CLAUDE.md`: the "Worktree setup" line that makes new sessions run the command first.
- `.claude/skills/verify/SKILL.md`: step 1 now starts with `npm run setup:worktree`.
- `src/group/limits.ts` and `e2e/helpers.ts`: the two files that conflicted in #29, as resolved (all three expense caps and
  one description limit; the shared helpers once, plus `createGroup`).

## Open after this lesson

- The frontier: #5 and #6 are ready (lesson 8.2).
- Issue #19 (the dev server reload loop) now has a second cause noted: Playwright's output inside the project. The logs test
  from #9 can't pass under `npm run dev` until it is fixed.
