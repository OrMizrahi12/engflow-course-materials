# Card: the landing loop

## The loop

1. **A worktree per change.** `claude -w <name>`: its own folder, its own branch, its own session.
2. **Commit, push, open a pull request** with the body from `/pr` (`Closes #N` when there is a ticket).
3. **The required check runs** on a branch that is up to date with `main`.
4. **The merge.** It deploys production and closes the ticket.
5. **Remove the worktree** (`/exit` → Remove worktree). Merged commits live on in `main`.

## The gate (GitHub)

- A **ruleset** on `main`: changes only through a pull request; a required check; the branch up to date; no deletion, no
  force push. It holds for everyone and every tool.
- **Auto-merge**: queue it right after opening (`gh pr merge <N> --auto --merge`); GitHub merges the moment the check is
  green. **Automatically delete head branches** keeps the branch list clean.

## At the merge, the path splits

| The pull request | Who merges |
|---|---|
| no migration | auto-merge, once its check is green |
| adds a migration (a new file under `drizzle/`) | a person: a one-way door |

## Fell behind

When `main` moves, a queued pull request is **behind**: it misses what `main` learned (in our case, the workflow that runs
the check). `gh pr update-branch <N>` merges `main` into it, the check runs again, and auto-merge finishes the job.

## Two locks on main

- **Lock 1, deny rules** in `.claude/settings.json`: Claude's own commands for force pushes, pushes to `main` and
  `git reset --hard` are refused, on this machine, in every permission mode. They match the command text: a seatbelt.
- **Lock 2, the ruleset** on GitHub: the wall, for every push from anyone.

Test deny rules live with harmless forms (`--dry-run`, a reset on a clean tree) and keep one allowed control.

## After the merge

Read the production deploy of the merge commit from GitHub (Vercel posts it as a commit status) and open production
yourself. A session's own notes can be out of date: it wrote its context before you changed the settings.

## It's working if

- Every change arrived through a pull request with a green check; nothing was pushed to `main`.
- Pull requests without a migration merged themselves; the one with a migration was merged by a person.
- The ticket closed itself on merge, the merge commit's deploy reports success, and `git worktree list` shows only the main
  checkout at the end.

Ideas from how Matt Pocock's public repositories land changes, described in our own words; the `/pr` and
`writing-for-agents` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License). Unofficial, not
affiliated with or endorsed by Matt Pocock. First used in lesson 6.3.
