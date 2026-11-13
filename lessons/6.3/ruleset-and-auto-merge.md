# The ruleset, auto-merge and the commands of the loop

What we set on GitHub in lesson 6.3, setting by setting, and the `gh` commands the landing doc uses. Your repository and
check names may differ; the check is the job name from your CI workflow (ours: `Type-check, lint and service tests`).

## The ruleset "Protect main"

Repository → Settings → Rules → Rulesets → New ruleset → **New branch ruleset**.

| Setting | Value |
|---|---|
| Ruleset Name | `Protect main` |
| Enforcement status | **Active** (a new ruleset starts out Disabled) |
| Bypass list | empty: the rules hold for everyone who pushes, the repository's owner included |
| Target branches | Add target → **Include default branch** (`main`) |
| Restrict deletions | ticked (by default): `main` can't be deleted |
| Block force pushes | ticked (by default): `main`'s history can't be rewritten |
| Require a pull request before merging | ticked; Required approvals **0** (one person on the repository: nobody else to approve) |
| Require status checks to pass | ticked |
| Require branches to be up to date before merging | ticked: a branch behind `main` takes `main`'s changes and passes again before it merges |
| Required status checks | Add checks → `Type-check, lint and service tests` (GitHub Actions) |

Create. GitHub may ask you to confirm it's you before it saves. The saved ruleset says "Applies to 1 target: main".

From then on, `main` only changes through a pull request with a green check. A push straight to `main`, from you or from an
agent, is rejected by GitHub.

## Settings → General → Pull Requests

| Setting | What it does |
|---|---|
| **Allow auto-merge** | a pull request can be queued to merge by itself the moment its required checks are green |
| **Automatically delete head branches** | the branch of a merged pull request is deleted on GitHub, so merged branches don't linger |

Both save as soon as you tick them.

## The commands of the loop

```bash
gh pr merge <N> --auto --merge      # queue auto-merge with a merge commit (not for a pull request that adds a migration)
gh pr view <N> --json mergeStateStatus,autoMergeRequest   # BLOCKED, BEHIND, CLEAN; is auto-merge queued
gh pr diff <N> --name-only | grep '^drizzle/'             # does it carry a migration? then a person merges it
gh pr update-branch <N>             # merge main into a branch that fell behind; the check runs again
gh pr checks <N> --watch            # wait for the checks
```

After a merge, the production deploy of the merge commit, as GitHub reports it (Vercel posts a commit status):

```bash
sha=$(gh pr view <N> --json mergeCommit --jq .mergeCommit.oid)
gh api repos/{owner}/{repo}/commits/$sha/status \
  --jq '.statuses[] | select(.context | test("vercel"; "i")) | {context, state, target_url}'
```

`success` means production deployed; `pending` means read again; `failure` or `error` means stop and look.

## The deny rules

The landing session put these in `.claude/settings.json` (the kit's `potluck/claude-settings.json`). They are committed, so
every clone and every worktree gets them. A deny rule stops Claude's own Bash commands in every permission mode; it matches
the command text, so it catches the forms Claude usually writes. The ruleset on GitHub is the wall behind it.

| Rule | Stops |
|---|---|
| `Bash(git push --force*)`, `Bash(git push -f*)`, `Bash(git push * --force*)`, `Bash(git push * -f*)` | force pushes, including `--force-with-lease`, wherever the flag sits |
| `Bash(git push *+*)` | a forced refspec like `+branch` (and any branch name with a `+` in it) |
| `Bash(git push * main)`, `Bash(git push * main *)`, `Bash(git push *:main)`, `Bash(git push *:main *)`, `Bash(git push *:refs/heads/main*)` | pushes to `main`, including `HEAD:main` and `refs/heads/main` |
| `Bash(git reset --hard*)`, `Bash(git reset * --hard*)` | `git reset --hard` with the flag in any position |

The live tests on camera (pushes with `--dry-run`, the reset on a clean tree, so nothing happened even if a rule had failed):
eight denied, and an ordinary dry-run push of the session's own branch allowed. The gap it named: a bare `git push` while you
are on `main` names no branch, so no rule matches it; the ruleset rejects it on GitHub.
