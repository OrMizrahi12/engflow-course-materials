# Lesson 8.3: every line, in order

What was typed (or pasted from `prompts/`) on camera, and what came back. `<id>` stands for a session id; yours will differ.

## The orchestrator from lesson 8.2 (its worktree window)

Before: the footer reads `130.1k (13%)`; Claude Code's hint: `new task? /clear to save 130.6k tokens`.

## Shell: the phase-boundary tree

```bash
sed -n '9,25p' ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/ask-matt/PHASE-BOUNDARIES.md
sed -n '27,40p' ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/ask-matt/PHASE-BOUNDARIES.md
```
The five options, "the first yes wins", and the five questions.

## The orchestrator

```text
/compact we're going to file the decisions you left for me in PR #30 as ready-for-human tickets
```
(`prompts/compact.txt`) `Compacted (ctrl+o to see full summary)`, the files read again,
`Skills restored (mattpocock-skills:pr, mattpocock-skills:code-review, mattpocock-skills:implement-spec)`; the counter `0.0k (0%)`.

```text
File each decision you left for me in PR #30 as its own ready-for-human ticket, the way docs/agents/issue-tracker.md says. Then tell me the numbers.
```
(`prompts/decisions.txt`) `53.4k (5%)` after its first step; `I filed the four decisions from PR #30 as tickets #31 to #34.`, a
table; `58.9k (6%)`.

```text
/exit
```
`Exiting worktree session` · `You have 57 commits on worktree-spec-v1.` → Down, Return on "Remove worktree" → `Worktree removed.` ·
`Resume this session with: claude --resume <id>`.

```bash
exit
```

## A new window: the named session

```bash
claude -n leftovers
```
Then `prompts/leftovers.txt`. 1 minute 22 seconds: #35 and #36 (`ready-for-agent`), #37 (`ready-for-human`); `52.2k (5%)`.

```text
/fork From Vercel's public docs only: how long are request logs kept, and can a path be kept out of them? Add what you find, with links, as a comment on the ready-for-human ticket about Vercel's logs. Don't name our team or project, and change no code.
```
(`/fork`, a space, then `prompts/fork.txt`) `session running · leftovers ⑂ From Vercel's public docs only … · <id>`.

## The first window: background sessions

```bash
gh issue list -l ready-for-agent
```
`Showing 2 of 2 issues`: #36, #35.

```bash
claude --bg --name dev-log "/mattpocock-skills:implement #35, then open a draft PR"
```
`backgrounded · <id> · dev-log`, then `claude attach <id>`, `claude logs <id>`, `claude stop <id>`.

```bash
claude --bg --name repin-note "/mattpocock-skills:implement #36, then open a draft PR"
```
`backgrounded · <id> · repin-note`.

```bash
claude agents
```
`New sessions: Opus 5.5 · medium effort` · `0 awaiting input · 2 working · 1 completed`. The fork's row: Space (peek), Enter
(attach: the retention table), Left (back: "Vercel log retention and path findings posted to #37"). dev-log: Space, Enter (browser
tests green, a vitest worker killed mid-run, all 196 tests pass, committing "Mask group tokens in the dev log"), Left.

## The leftovers window

```text
/usage
```
`7% used` for the current week (all models), its reset date, and what has been using it. Esc.

```text
/exit
```
`Resume this session with: …`

## The first window: the watch

dev-log, after 17 minutes: `PR #38 draft: log masks group tokens, tests green`. repin-note: `pre-commit tests OOM; waiting on
other job, then recommit`, for about 27 minutes. Its row, Space, then:

```text
The other session finished long ago. Your wait loop's pgrep matches its own command line, so it never ends. Stop it and commit again.
```
(`prompts/reply-stuck.txt`, Enter) `Checking memory and top processes`; then `suite passes on 4 workers; retrying the commit`,
`Standards and Spec reviews running`, `The Standards review found one hard violation`, and draft PR #39.

## The first window: landing

```bash
gh pr list
gh pr diff 38 --name-only
gh pr checks 38
gh pr ready 38
gh pr merge 38 --auto --merge
gh pr diff 39 --name-only
gh pr checks 39
gh pr view 38 --json state,mergedAt
gh pr ready 39
gh pr merge 39 --auto --merge
gh pr view 39 --json mergeStateStatus
gh pr update-branch 39
gh pr checks 39 --watch
gh pr view 39 --json state,mergedAt
```
#38: `e2e/logs.spec.ts`, `scripts/dev.mjs`; `All checks were successful`; `is marked as "ready for review"`; merged at once.
#39: `THIRD_PARTY_NOTICES.md`; checks green. #38 `"state": "MERGED"`. #39: `will be automatically merged when all requirements are
met`; `"mergeStateStatus": "BEHIND"`; after `update-branch` and 2 minutes 40 seconds of CI, `All checks were successful`;
`"state": "OPEN"` for a few seconds more, then merged by auto-merge.

## The leftovers window again

```bash
claude --resume leftovers
```
The same conversation, `52.2k (5%)`.

```text
Both PRs are merged. Confirm the deploys the way docs/agents/landing.md says.
```
(`prompts/resume.txt`) #38's merge commit `2fae063`: success. #39's, `2ce5739`: success, and production serves #39. The merges closed
#35 and #36. "I can't see what the fork did", so it doesn't know whether its comment reached #37.

## The first window: cleanup

```bash
claude agents
```
`0 awaiting input · 0 working · 3 completed`; Ctrl+X, Ctrl+X on each row; `0 awaiting input · 0 working · 0 completed` and the
three section explanations; Esc.

```bash
git pull -q
git log --oneline --first-parent -3
gh issue list -l ready-for-agent
git worktree list
```
`2ce5739 … Merge pull request #39 …`, `2fae063 Merge pull request #38 …`, `18cb54a (tag: lesson-8.2) Merge pull request #30 …`;
`no issues match your search`; the worktree list without `spec-v1` or the two background worktrees.
