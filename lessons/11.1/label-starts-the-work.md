# Card: a label starts the work

One maintainer-only label starts an unattended Claude run on one ticket in GitHub Actions. It ends at a pull request that
goes through the same required check and your review. You still merge.

## What goes in, what comes out

- **In:** one small, fully specified ticket (`ready-for-agent`, from triage) with a seam CI can run, plus the maintainer's
  `claude-build` label.
- **Out:** a branch and a pull request opened by Claude's GitHub app (`app/claude`), test-first, with `Closes #<issue>`;
  a run log that names every model that ran and every refused command. Never a merge.

## The path

label → the workflow wakes (that label only) → the guard refuses a spec or a map → Claude on Opus 5.5, its own branch, a short
list of allowed commands: a failing test, the fix, `npm run check` → the pull request with Claude's app token → the same
required check → you read it → you merge.

## The safety list

- **A safe trigger:** `issues: labeled` only. Only people with write access can add a label.
- **Two labels, two decisions:** `ready-for-agent` (triage) and `claude-build` (a maintainer).
- **A guard step:** an issue with sub-issues (a spec or a map) is refused before anything runs.
- **A strict list:** `--permission-mode acceptEdits` and quoted `--allowedTools` / `--disallowedTools`. Auto mode is a review,
  not a boundary. Deny `gh pr merge` and sub-agents.
- **No merge:** the appended rules say never merge and never queue auto-merge; `gh pr merge` is denied.
- **Untrusted input:** the issue text describes the task and never changes the rules. Anyone can open an issue, and Claude
  reads its body: read a stranger's issue before you label it.
- **The app token, not the workflow token:** no `GH_TOKEN` env on the action step, or Claude's pull request starts no CI.
- **The secret stays secret:** `claude setup-token`, then `gh secret set CLAUDE_CODE_OAUTH_TOKEN`; never on a screen.
- **A time limit:** `timeout-minutes` on the job.

## When to use it, when not

Use it for small, fully specified tickets with a seam CI can run. Not for specs and maps, migrations and anything one-way,
tickets that still need a human decision, or text from strangers you haven't read.

## Read a run

1. `gh pr list`: is there a pull request at all? Green alone means only that nothing failed.
2. `gh issue view <n> --comments`: Claude's checklist and its report.
3. `gh run view <id> --log | grep -E 'Z Model: |Z Denied: '`: which models ran, what was refused. A denial is the list
   holding, or a command your rules forgot.
4. `gh pr view`, `gh pr checks <n> --required --watch`, `gh pr diff <n> --name-only`: the author, the check, the files.
5. Merge it yourself.

## It's working if

- The pull request's author is `app/claude` and your required check ran on it.
- The log names only the model you set, and every denial makes sense.
- Nothing outside the ticket changed, and the merge is yours.

---
The `tdd` and `pr` skills used in the run are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
