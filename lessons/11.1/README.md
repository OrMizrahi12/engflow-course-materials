# Student kit: Lesson 11.1, A label starts the work

This lesson moves one stretch of the flow, from a ticket to a pull request, into GitHub Actions. A worktree session writes
`.github/workflows/claude-build.yml` with Anthropic's official action, `anthropics/claude-code-action@v1`. We read every line
of it ourselves and send back four fixes before it lands through the same pull request loop as every change. Then we make
ticket #40 name a seam CI can run, create the maintainer-only label `claude-build`, and put it on. The first run goes green
and opens nothing. Its log names no denials and lists a model we never chose. The second run goes green too, and still opens
nothing: a long command moved to the background and the action took that as the end of the run. The third run opens its own
pull request, from Claude's GitHub app, and our required check runs on it. We read its report, its log and its files, and
merge it by hand.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/write-the-workflow.txt` | the brief for the workflow (pasted into the worktree session) |
| `prompts/four-fixes.txt` | the four fixes after reading the file, then "land it" |
| `prompts/seam.txt` | make #40's second "Done when" line name a seam CI can run |
| `prompts/why-no-pr.txt` | after run 1: find out why from the log, the action's prompt and our CLAUDE.md, then fix it narrowly |
| `prompts/land-it.txt` | "Looks right. Land it." |
| `prompts/foreground.txt` | after run 2: the guess about long commands, to check against the docs before anything changes |
| `workflow-line-by-line.md` | the workflow as merged, part by part: what each line does and why it is there |
| `the-runs.md` | the three runs with their real times, what each log said, and the fix that followed |
| `label-starts-the-work.md` | the card: when a label may start unattended work, the safety list, how to read a run |
| `potluck/.github/workflows/claude-build.yml` | the workflow exactly as it is in Potluck at the tag `lesson-11.1` |

The card is also in `cards/` in the course materials.

## Before you start

- Your Potluck clone from the earlier lessons (a repository of your own on GitHub, cloned, **not a fork**), with the
  required check `Type-check, lint and service tests` on `main` (lesson 6.3) and at least one issue labelled
  `ready-for-agent` (lesson 5.3). The finished state of this lesson is the tag `lesson-11.1` in the course's Potluck
  repository.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.326,
  Opus 5.5). The worktree session ran in auto mode.
- The GitHub CLI `gh` signed in to your own account, with write access to your repository.
- Claude's GitHub app installed on your repository (below). On my account it was installed before this lesson.

## One-time setup (not shown on camera)

1. **Install Claude's GitHub app.** Open https://github.com/apps/claude, choose Install (or Configure if it is already
   installed), pick your account, then "Only select repositories" and your Potluck repository. The app gives the action its
   own short-lived token, and a pull request it opens starts your CI. A pull request opened with the workflow's own token
   would not.
2. **Store your token as a secret.** In a terminal, run `claude setup-token`, follow the browser sign-in, and copy the
   token it prints. Then `gh secret set CLAUDE_CODE_OAUTH_TOKEN` and paste it when gh asks. Never paste it into a file, an
   issue, a chat or a screen recording. The workflow reads it from the repository's secrets, so it never appears in the
   file or in the log.

## Install the tools (Windows WSL, macOS, Linux)

- **Linux and Windows (WSL, Ubuntu):** the GitHub CLI from cli.github.com, then `gh auth login`. Run Claude Code and `gh`
  inside WSL; `claude setup-token` opens the sign-in page in your Windows browser.
- **macOS:** `brew install gh`, then `gh auth login`.

Everything else runs on GitHub's own runners: you install nothing for the workflow itself.

## Free and not free

Free: GitHub Actions on a public repository, and on a private one within the free monthly allowance; the action and the
skills. Not free: the Claude plan. Each run uses your plan's allowance through the token, like a session of its own: here
each of the three runs took between 6 and 12 minutes.

## The steps, as on camera (Ubuntu)

**1. The ticket.** In my own shell, in `~/potluck`:

```bash
gh issue view 40
```

#40, "Dev log still writes group tokens in server-function lines", carries one label: `ready-for-agent`. Its second "Done
when" line asks for a test next to the existing masking test, which is a browser test. Hold on to that.

**2. A worktree session writes the workflow.** In a new terminal tab:

```bash
cd ~/potluck
claude -w claude-build
```

Paste `prompts/write-the-workflow.txt`. A minute and ten seconds later the file exists, uncommitted. Its reply says the
YAML parses, the workflow hasn't run on GitHub yet, and it set a `GH_TOKEN` so `gh pr create` can log in. Hold on to that
one too.

**3. Read every line yourself.** In your own shell (Tab completes the path into the worktree):

```bash
less .claude/worktrees/claude-build/.github/workflows/claude-build.yml
```

Space for the next page, `q` to quit. What to look for is in `workflow-line-by-line.md`. On camera: no job timeout; a
`GH_TOKEN` env on the action step (a pull request made with the workflow's token starts no CI, so our required check would
never run on Claude's pull request); tool lists without quotes (the spaces split each rule in two); no permission mode, so
the action runs in auto mode, where a safety review can approve a command you never listed.

**4. Four fixes, then land it.** Back in the worktree session, paste `prompts/four-fixes.txt`. It edits, commits through
the pre-commit hook, pushes, writes the pull request with the `pr` skill and queues auto-merge; the required check passes
and it merges (13 minutes 47 seconds in all on camera; the hook ran short of memory twice on this machine, and no test
failed).

**5. A seam CI can run.** Paste `prompts/seam.txt`. It rewrites only #40's second "Done when" line, on GitHub: a Vitest test
of the log cleaner, run by `npm run check`. It also writes down two facts you didn't ask for: the cleaner sits in a script
that starts Next when imported, and Vitest only collects tests under `src/`. The label, it says, is yours to put on.

**6. The label, and the go.** In your own shell:

```bash
gh issue view 40
gh label create claude-build --color 5319E7 --description "Maintainers only: Claude builds this ticket in CI"
gh issue edit 40 --add-label claude-build
gh run watch
```

Pick the new run in the picker. Anyone who opens the label list should know this label starts a build the moment it goes on.

**7. Run 1: green, no pull request.**

```bash
gh pr list
gh issue view 40 --comments
gh run view <run-id> --log | grep -E 'permission_denials_count|claude-haiku|Z Model: '
```

No pull request. Claude's checklist on the issue stops before `npm run check`. The log: 7 permission denials, none named;
a Haiku model in the usage (Claude Code's small model for side jobs); the print step says Opus 5.5 because it only read the
replies.

**8. Diagnose from evidence.** In the worktree session, paste `prompts/why-no-pr.txt` (with your run's id). Read the reply:
it marks its causes as inferred. Then read the diff yourself:

```bash
git --no-pager -C .claude/worktrees/claude-build diff -U1
```

Then type `Looks right. Land it.` (`prompts/land-it.txt`).

**9. Run 2.** Take the label off and put it back on (adding a label that is already there is not an event):

```bash
gh issue edit 40 --remove-label claude-build
gh issue edit 40 --add-label claude-build
gh run watch
gh pr list
gh run view <run-id> --log | grep -E 'Z Model: |Z Denied: |no commits from Claude|Auto-commit'
```

Green again, no pull request. Only Opus now; one denial, named (`git ls-files`); "no commits from Claude"; the action saved
the work itself as an Auto-commit on a branch with no pull request.

**10. Check a guess against the docs.** Paste `prompts/foreground.txt`. It reads the Claude Code docs and the action's
source, confirms the chain, adds three settings to the action step, and lands the change through a pull request.

**11. Run 3: the pull request.**

```bash
gh issue edit 40 --remove-label claude-build
gh issue edit 40 --add-label claude-build
gh run watch
gh pr list
gh pr view 61 --json title,author,headRefName,body --jq '"\(.title)\nby \(.author.login) from \(.headRefName)\n" + (.body | split("\n") | map(select(test("Closes"))) | join("\n"))'
gh pr checks 61 --required --watch
```

The author is `app/claude`, from a branch named after the issue, with `Closes #40` in the body. The required check runs on it
(5 minutes 45 seconds on camera) and passes, because the push and the pull request came from Claude's app.

**12. Review, then merge it yourself.**

```bash
gh issue view 40 --comments
gh run view <run-id> --log | grep -E 'Z Model: |Z Denied: '
gh pr diff 61 --name-only
gh pr merge 61 --merge
gh pr view 61 --json state,mergedBy --jq '.state + " by " + .mergedBy.login'
gh issue view 40 --json state,labels --jq '.state + "  " + ([.labels[].name] | join(", "))'
```

The report says, in its own words, that it saw the test fail on the old cleaner and pass on the new one, and that it didn't
merge. The log: one model line, four denials, every one the list holding. Four files, nothing outside the ticket. Then
`MERGED by` you, and #40 `CLOSED` with both labels still on it.

## Use it on your own repository

- Change `include_comments_by_actor: OrMizrahi12` to your own GitHub login: only that person's comments reach Claude.
- The appended rules name Potluck's commands (`npm run check`, `npm test`, `npm run setup:worktree`). Use your project's.
- Keep `--model` explicit and keep the last step: every run then prints which models ran and what was denied.

## Side effects

- Three pull requests merged on `main` (the workflow, then two fixes) and one more from Claude (#40's fix), merged by you.
- A label `claude-build` in your repository, and #40 closed with both labels on it.
- A branch left on GitHub by run 2's Auto-commit (`claude/issue-40-…`), never a pull request: delete it when convenient.
- One repository secret, `CLAUDE_CODE_OAUTH_TOKEN`.

## Pause and try

On your own copy: install Claude's GitHub app on your repository, run `claude setup-token` and store the result with
`gh secret set CLAUDE_CODE_OAUTH_TOKEN` (never on screen), add the workflow from this kit (with your login), and create the
`claude-build` label. Pick one small ticket marked `ready-for-agent` with a seam CI can run. Label it and watch the run. Read
the model and denied lines, then read the pull request before you merge it. You're done when the pull request's author is
`app/claude`, your required check ran on it, and you merged it yourself.

---
The `tdd` and `pr` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. `anthropics/claude-code-action` is Anthropic's official GitHub Action. This course
is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
