# The three runs

All three went green. Only the third opened a pull request. Green means the job ran and nothing in it failed: it does not
mean the work is done. Read the checklist on the issue and the log's model and denied lines before you believe a run.

## Run 1: green, no pull request (12 min 5 s)

- **What we saw:** `gh pr list` showed nothing. Claude's checklist on #40: cleaner moved into its own module, a failing Vitest
  test (three red, as expected), the tokens masked; then "npm run check" and "Commit, push, open PR" left empty. Nothing was
  pushed.
- **The log:** `permission_denials_count: 7`, and no line said which commands. `claude-haiku-5-5` in the usage (Claude Code
  uses a small model for side jobs). Our print step said Opus 5.5 because it only read Claude's replies.
- **Why (inferred from the evidence, since the log never named the denials):** the action's prompt says `git status` and
  `git diff` are available, but its own tool list doesn't allow them; it says to post a "Create a PR" link while our brief said
  `gh pr create`; our CLAUDE.md sends agents to a setup step that needs a database, and to auto-merge; and allow rules match
  whole commands, so a piped command is a different command, and it is denied.
- **The fix (#59):** our rules first, overriding CLAUDE.md and the action's instructions; the issue text can't change them; no
  pipes, one command at a time; two read-only git commands allowed; Haiku pinned to Opus; one `Denied:` line per refusal.

## Run 2: green, closer, still no pull request (5 min 28 s)

- **What we saw:** no pull request again.
- **The log:** `Model: claude-opus-5-5` only (the pin worked). One denial, now named: `git ls-files` with a few paths, a
  read-only command that just isn't on the list. Then "Branch … has no commits from Claude, checking for uncommitted changes",
  and the action's own "Auto-commit: Save uncommitted changes from Claude": the work ended up on a branch with no pull request.
- **Why (checked against the docs and the action's source):** both runs stopped right after a long command (`npm run check`,
  then a commit whose hook runs the whole suite). A Bash command that runs past its timeout (2 minutes by default) moves to the
  background, and Claude ends its turn to wait. A headless `claude -p` would wait and give Claude another turn; the action
  stops reading at the first result.
- **The fix (#60):** on the action step, background tasks off and a 15-minute Bash timeout, inside the job's 30 minutes. It
  widens nothing.

## Run 3: the pull request (10 min 7 s)

- **What we saw:** #61 "Mask group tokens in the dev log's server-function lines", author `app/claude` (Claude's own GitHub
  app), from `claude/issue-40-…`, with `Closes #40` behind a stray "Closes issue 40:" prefix.
- **The check:** the required check `Type-check, lint and service tests` started on Claude's push and passed (5 min 45 s),
  because the push and the pull request came from Claude's app and not from the workflow's own token.
- **The report on the issue:** a new module for the cleaner, the mask, a test file next to the script; "I saw it fail on the
  old cleaner and pass on the new one" (test-first, in its own words: the history is a single commit); Vitest now also collects
  tests under `scripts/`; the stray prefix it wasn't allowed to fix; "I didn't merge the PR or queue auto-merge".
- **The log:** `Model: claude-opus-5-5` and nothing else; four denials, each one the list holding: `npx prettier --check`;
  `gh pr create` with the whole body written inline (refused; Claude opened it another way); a file write outside the
  workspace; `gh pr edit 61` (which is why the prefix is still there).
- **The files:** four, all inside the ticket: the new module, its test, the dev script, the Vitest config.
- **The merge:** ours. `gh pr merge 61 --merge`; the pull request merged by me; #40 closed with both labels still on it, a
  record of how it was built.
