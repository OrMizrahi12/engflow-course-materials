# Card: background sessions and the agent view

## Which tickets can run unattended

Small enough for a session to build with nobody watching: one area, no migration, no production data, no product decision, and a
"Done when" that a check can prove. Label them `ready-for-agent`. Anything that needs your judgment is `ready-for-human`.

## Start one

```bash
gh issue list -l ready-for-agent
claude --bg --name dev-log "/mattpocock-skills:implement #35, then open a draft PR"
```

- `--bg` returns at once: `backgrounded · <id> · <name>`, plus the commands to attach (`claude attach <id>`), read the logs, or stop it.
- The prompt names the skill in full (there's no menu to pick from) and ends with ", then open a draft PR". Without that clause, a
  session in our dry run pushed its branch and stopped with no pull request.
- What it does on its own: it moves into its own worktree before it edits anything, commits, pushes, and opens a draft pull
  request. It never merges.

## The agent view: `claude agents`

| Key | What it does |
|---|---|
| Up / Down | select a row |
| Space | peek: the latest status, with a reply line |
| Enter | attach: you're inside its conversation |
| Left | back to the list (the session keeps going) |
| Ctrl+X, then Ctrl+X | remove the row along with its worktree |
| Esc | leave the agent view |

The header shows the model new sessions get (on camera: Opus 5.5, medium effort) and the counts: awaiting input, working,
completed. A completed row carries its pull request number.

## Watch it

Unattended still means watched. A row whose status stops changing is worth a peek. On camera one session waited in a loop that
could never end (its `pgrep` matched its own command line); a one-line reply from the peek box moved it on.

## Land it yourself

```bash
gh pr list
gh pr diff 38 --name-only          # which files? anything under drizzle/ means a migration
gh pr checks 38
gh pr ready 38
gh pr merge 38 --auto --merge
gh pr view 39 --json mergeStateStatus   # BEHIND after the first merge?
gh pr update-branch 39
gh pr checks 39 --watch
```

## Come back to a named session

```bash
claude -n leftovers           # start a named session
claude --resume leftovers     # back into the same conversation later
```

## Clean up

`claude agents`, then Ctrl+X twice on each finished row. Then `git pull -q`, `git log --oneline --first-parent -3` and
`git worktree list`.

## When not to run in parallel

- The work needs your decisions (a decision is steering).
- Two sessions would touch the same files.
- You can't review what comes back.
- Your plan or your machine can't carry them: ten agents use quota about ten times as fast as one (Claude Code's docs), and on
  our machine memory ran out before quota did. Check `/usage`.

## It's working if

Each session ran in its own worktree and stopped at a draft; you read the diff and the checks before you marked it ready; the
agent view is empty afterwards.
