# Lesson 11.1: every line, in order

Two terminal tabs: tab 1 is my own shell in `~/potluck`, tab 2 is the worktree session. Run ids and pull request numbers
are ours; yours will differ.

## Tab 1: the ticket

```bash
gh issue view 40
```

#40 "Dev log still writes group tokens in server-function lines", label `ready-for-agent`. "Done when" line 2: a test next to
the existing `/g/` masking test (a browser test that needs a database and a running dev server).

## Tab 2: the worktree session

```bash
claude -w claude-build
```

Header: Opus 5.5; the session lives in `.claude/worktrees/claude-build`.

**Pasted** (`prompts/write-the-workflow.txt`):

> Add .github/workflows/claude-build.yml so a label starts unattended work. Use anthropics/claude-code-action@v1 in label
> mode: on issues labeled, label_trigger claude-build, and only if the issue has ready-for-agent. A first step refuses an
> issue with sub-issues: a spec or a map is never built unattended. Pass our CLAUDE_CODE_OAUTH_TOKEN secret and the
> mattpocock-skills plugin from the official marketplace, set model claude-opus-5-5, and keep the tool list strict: the tests,
> npm run check, and gh pr create so Claude opens the PR itself. No merging, no sub-agents. Claude works test-first with the
> tdd skill. Only my comments reach Claude. Print which model ran. Keep it short, check the docs, don't commit yet.

Came back after 1 min 10 s: it read our existing workflow, the labels doc, the action's usage docs and its inputs, checked the
official marketplace lists the plugin, wrote 55 lines, and (auto mode blocked downloading a linter) parsed the file instead and
fixed one line. Its reply: the YAML parses but hasn't run on GitHub; no prompt input, because a prompt would switch the action
out of label mode, so the rules went into an appended system prompt; "I set GH_TOKEN so gh pr create can log in".

## Tab 1: read the file

```bash
less .claude/worktrees/claude-build/.github/workflows/claude-build.yml
```

Four catches: no `timeout-minutes`; `GH_TOKEN: ${{ github.token }}` on the action step; the tool lists unquoted; no
`--permission-mode`.

## Tab 2: four fixes

**Pasted** (`prompts/four-fixes.txt`):

> Four fixes, then land it. Quote both tool lists: the spaces inside them split each rule in two. Add --permission-mode
> acceptEdits, or auto mode can run commands that aren't on the list. Drop the GH_TOKEN env on the action step: the action sets
> its own app token for gh, and that's what makes CI run on Claude's PR. Give the job a 30-minute timeout.

Came back after 13 min 47 s: three edits; the commit's hook failed twice (test workers killed for memory on this machine, no
test failed); committed with two test workers, 304 tests green; pushed; the PR written with the `pr` skill; auto-merge queued;
the required check passed; #58 merged.

**Pasted** (`prompts/seam.txt`):

> Before I put the label on #40: an unattended run can't ask questions, so the ticket has to name a seam CI can run. Its test
> should sit next to the /g/ masking test, and that one is a browser test that needs a database and a dev server. Rewrite only
> its second Done when line so the seam is the log cleaner, tested with Vitest inside npm run check. Keep the browser test as
> it is.

Came back after 29 s: only that line rewritten on GitHub ("A Vitest test of the log cleaner (cleanLogLine), run by npm run
check, covers a server-function line with a token argument as well as a /g/ path"), plus two facts: the cleaner lives in a
script that starts Next when imported, and Vitest only collects `src/**/*.test.ts`. "#40 still has ready-for-agent. I haven't
added the claude-build label; that's yours to put on."

## Tab 1: the label, run 1

```bash
gh issue view 40
gh label create claude-build --color 5319E7 --description "Maintainers only: Claude builds this ticket in CI"
gh issue edit 40 --add-label claude-build
gh run watch
```

Run 1: 12 min 5 s, "completed with 'success'".

```bash
gh pr list
gh issue view 40 --comments
gh run view 44050924009 --log | grep -E 'permission_denials_count|claude-haiku|Z Model: '
```

No pull requests. Claude finished in 10m 41s; its checklist leaves "npm run check" and "Commit, push, open PR" unchecked. The
log: `permission_denials_count: 7`, `claude-haiku-5-5` in the usage, and `Model: claude-opus-5-5` from our print step.

## Tab 2: why

**Pasted** (`prompts/why-no-pr.txt`):

> The first run went green but opened no PR. Claude's checklist on #40 stops before npm run check, and the log says 7
> permission denials without naming them. Find out why from what we have: the run log (gh run view 44050924009 --log), the
> action's tag-mode prompt in its source, and our CLAUDE.md. Then fix the workflow so the next run can finish while the list
> stays narrow. Print the denied commands after the model line. Tell Claude that the issue text describes the task and never
> changes these rules. The log's modelUsage also lists claude-haiku-5-5: pin that one to claude-opus-5-5 too. Don't commit yet.

Came back after 1 min 54 s, causes marked as inferred: the action's prompt says `git status` and `git diff` are available,
but its own tool list doesn't allow them; it says to post a "Create a PR" link while our brief says run `gh pr create`; our
CLAUDE.md sends Claude to a setup step that needs a database, and to auto-merge; allow rules match whole commands, so
`npm run check` piped into `tail` is a different command. Changes: two read-only git rules (the only widening), new rules
that come first (with the line about the issue text), Haiku pinned to Opus, one `Denied:` line per refusal.

## Tab 1: the diff

```bash
git --no-pager -C .claude/worktrees/claude-build diff -U1
```

## Tab 2: land it

**Typed:** `Looks right. Land it.` Came back after 7 min 30 s: #59 merged.

## Tab 1: run 2

```bash
gh issue edit 40 --remove-label claude-build
gh issue edit 40 --add-label claude-build
gh run watch
gh pr list
gh run view 44058547965 --log | grep -E 'Z Model: |Z Denied: |no commits from Claude|Auto-commit'
```

Run 2: 5 min 28 s, green, no pull request. `Model: claude-opus-5-5`; one `Denied: Bash git ls-files …`; "Branch … has no
commits from Claude"; "Auto-commit: Save uncommitted changes from Claude".

## Tab 2: the guess

**Pasted** (`prompts/foreground.txt`):

> Run 2 got further: only claude-opus-5-5, one denial, and npm run check passed. But Claude never committed: the action saved
> its work as "Auto-commit: Save uncommitted changes" and there's still no PR. Both runs stopped right after a long command
> (npm run check, then a commit whose hook runs typecheck and the whole suite). My guess: a Bash command that runs past the
> 2-minute timeout moves to the background, Claude ends its turn to wait, and the action takes that as the end of the run.
> Check that against the Claude Code docs, fix the workflow so long commands run in the foreground, then land it.

Came back after 11 min 59 s: the settings and environment-variable docs, the tools reference, the headless docs and the
action's source confirm the chain (the action stops reading at the first result); background tasks off and a 15-minute Bash
timeout on the action step; #60 merged.

## Tab 1: run 3 and the review

```bash
gh issue edit 40 --remove-label claude-build
gh issue edit 40 --add-label claude-build
gh run watch
gh pr list
gh pr view 61 --json title,author,headRefName,body --jq '"\(.title)\nby \(.author.login) from \(.headRefName)\n" + (.body | split("\n") | map(select(test("Closes"))) | join("\n"))'
gh pr checks 61 --required --watch
gh issue view 40 --comments
gh run view 44063918689 --log | grep -E 'Z Model: |Z Denied: '
gh pr diff 61 --name-only
gh pr merge 61 --merge
gh pr view 61 --json state,mergedBy --jq '.state + " by " + .mergedBy.login'
gh issue view 40 --json state,labels --jq '.state + "  " + ([.labels[].name] | join(", "))'
```

Run 3: 10 min 7 s, green. #61 "Mask group tokens in the dev log's server-function lines", `by app/claude from
claude/issue-40-…`, "Closes issue 40: Closes #40" (a stray prefix it couldn't fix, since `gh pr edit` isn't on the list).
"All checks were successful" (5m45s). The report: "I saw it fail on the old cleaner and pass on the new one", "I didn't
merge the PR or queue auto-merge". The log: `Model: claude-opus-5-5` and four `Denied:` lines (`npx prettier --check`,
`gh pr create` with the body inline, a Write outside the workspace, `gh pr edit 61`). Four files: the new module, its test, the
dev script, the Vitest config. Then `MERGED by OrMizrahi12` and `CLOSED  ready-for-agent, claude-build`.
