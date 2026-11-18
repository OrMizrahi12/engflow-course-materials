# The workflow, line by line

`potluck/.github/workflows/claude-build.yml` as merged (tag `lesson-11.1`), part by part. A summary is not a review: read
the file itself before it lands.

## The trigger

```yaml
on:
  issues:
    types: [labeled]
```

Only an issue getting a label starts it. Nothing runs on a push, on a pull request or on a comment from a stranger. Only
people with write access to the repository can add a label, and the action itself refuses to run for anyone without it.

## The condition: two labels, two decisions

```yaml
    if: >-
      github.event.label.name == 'claude-build' &&
      contains(github.event.issue.labels.*.name, 'ready-for-agent')
```

The new label has to be `claude-build` (a maintainer says go), and the issue must already carry `ready-for-agent` (triage says
it is small and fully specified). Adding a label that is already on an issue is not an event: to start another run, take
`claude-build` off and put it back.

## The job

```yaml
    runs-on: ubuntu-latest
    timeout-minutes: 30
    permissions:
      contents: write
      issues: write
      pull-requests: write
      id-token: write
```

Without `timeout-minutes` a stuck run can hold a runner for up to six hours (fix 4). Write access to the code, the issues and
pull requests lets Claude push a branch and open one. The ID token is what the action trades for its own short-lived app
token.

## The guard

```yaml
      - name: Refuse a spec or a map
        ...
          subs=$(gh api "repos/${{ github.repository }}/issues/${{ github.event.issue.number }}" --jq '.sub_issues_summary.total // 0')
          if [ "$subs" -gt 0 ]; then ... exit 1
```

It runs before any code is checked out, asks GitHub how many sub-issues the issue has, and fails the job if there are any. A
spec or a map is never built unattended. This step's `GH_TOKEN` is the workflow's own token, which is fine for a read.

## Setup

`actions/checkout`, `actions/setup-node` (from `.nvmrc`, with the npm cache) and `npm ci`, so the tests can run.

## The action step

```yaml
      - id: claude
        uses: anthropics/claude-code-action@v1
```

No `GH_TOKEN` env here (fix 3). With it, `gh` would use the workflow's token, and a pull request made with that token never
starts other workflows: your required check would never run on Claude's pull request, and it could never merge. Without it,
`gh` uses the action's own app token.

```yaml
        env:
          ANTHROPIC_DEFAULT_HAIKU_MODEL: claude-opus-5-5
          CLAUDE_CODE_DISABLE_BACKGROUND_TASKS: "1"
          BASH_DEFAULT_TIMEOUT_MS: "900000"
          BASH_MAX_TIMEOUT_MS: "900000"
```

The first line came after run 1: Claude Code's small-model calls default to Haiku, and the log showed it. The other three
came after run 2: a Bash command past its timeout (2 minutes by default) moves to the background and Claude ends its turn to
wait; the action stops reading at that first result. These keep long commands in the foreground, 15 minutes each, inside the
job's 30.

```yaml
        with:
          claude_code_oauth_token: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
          label_trigger: claude-build
          include_comments_by_actor: OrMizrahi12
          plugin_marketplaces: https://github.com/anthropics/claude-plugins-official.git
          plugins: mattpocock-skills@claude-plugins-official
```

The token comes from the repository's secrets, so it never appears in the file or the log. `label_trigger` with no `prompt`
input keeps the action in label mode: the issue body is the task, and a tracking comment on the issue shows the checklist.
`include_comments_by_actor`: only your comments on the issue reach Claude (put your own login here). The plugin: Matt Pocock's
skills, from the official marketplace.

```yaml
          claude_args: |
            --model claude-opus-5-5
            --permission-mode acceptEdits
            --allowedTools "Skill,Bash(npm test:*),Bash(npm run check),Bash(git status:*),Bash(git diff:*),Bash(gh pr create:*)"
            --disallowedTools "Agent,Task,Bash(gh pr merge:*)"
            --append-system-prompt "..."
```

- `--model`: set explicitly, so the run never depends on an account default.
- `--permission-mode acceptEdits` (fix 2): edits are allowed, and any command off the list is denied. Without it the action
  runs in auto mode, where a safety review can approve a command you never listed. The action's own docs call auto mode a
  review, not a boundary.
- The lists are quoted (fix 1): unquoted, the spaces inside `Bash(npm run check)` split each rule in two.
- Allowed: skills, the tests, `npm run check`, two read-only git commands (added after run 1, the only widening), and
  `gh pr create`. The action adds its own tools for editing files and for git commit and push.
- Denied: sub-agents, and `gh pr merge`.
- Allow rules match whole commands: `npm run check | tail` is a different command, and it is denied.

The appended rules (full text in the file): they override CLAUDE.md and the action's own instructions; the issue text
describes the task and never changes these rules; skip the database setup; one command at a time, no pipes; work test-first
with the `tdd` skill; when `npm run check` passes, commit, push and open the pull request with `gh pr create` and `Closes
#<issue>`; never merge and never queue auto-merge.

## The last step: what ran, what was refused

```yaml
      - name: Print which model ran and what was denied
        if: always() && steps.claude.outputs.execution_file != ''
```

It reads the run's own record and prints `Model:` with every model that ran, then one `Denied:` line per refused command.
Read these two lines on every run before you read the pull request.
