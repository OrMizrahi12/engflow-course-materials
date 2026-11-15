# Card: parallel sessions in worktrees

**One ticket, one worktree, one session, and they land one at a time.**

## What it is

`claude -w <name>` (or `--worktree <name>`) starts a Claude Code session in a new git worktree under
`.claude/worktrees/<name>`, on its own branch `worktree-<name>`, from the remote's `main`. Each session gets its own files and
its own branch on top of the same history. Several sessions in one folder would share one working directory, one index and
one HEAD, so one session's commit can land on another's branch.

## What a worktree doesn't give you

Everything outside git: a dev server port, a database, ignored files such as `.env.local`, and the installed packages. So:

- **One setup command per worktree** (Potluck: `npm run setup:worktree`): install, its own database, its own port, written to
  its `.env.local`. Tell sessions to run it in `CLAUDE.md`.
- **`.worktreeinclude`** in the main checkout lists ignored files Claude Code copies into each new worktree (gitignore syntax).
  The main checkout needs those files itself.

## When to reach for it

- The tickets are on the frontier: open, with nothing open in their way, and independent of each other.
- Not when one ticket blocks another, or when two sessions would work on the same ticket: keep that to one session.
- Sessions side by side multiply your usage.

## Landing in turn

Every merge moves `main`, so the next pull request is behind.

1. Git can combine them (`BEHIND`): `gh pr update-branch`, and the check runs again.
2. They conflict (`DIRTY`): merge `origin/main` into the branch in its own worktree, look at each hunk, keep both changes,
   run the check, push.
3. Either way, the check decides. A pull request with a migration waits for a person to merge it.

## It's working if

- each session works in its own folder and branch, with its own port and database, and your main database is untouched;
- the setup command runs in every new worktree before anything else;
- every pull request is up to date with `main` and green before it merges;
- a conflict is resolved in its branch's own worktree, by the session that wrote it, never by overwriting one side.

Uses the open-source `implement` skill from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described
in our own words. Unofficial, not affiliated with Matt Pocock.
