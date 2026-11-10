# Card: Claude Code controls

## Permission modes (Shift+Tab cycles them; the footer names the current one)

| Mode | Runs without asking | Asks you | Use it for |
|---|---|---|---|
| Manual | reading | edits and other commands | unfamiliar or sensitive code |
| Accept edits | reading, file edits in this folder | other commands | work whose diff you'll read afterwards |
| Plan | reading and planning | everything else, until you approve the plan | any change bigger than one line |
| Auto | everything, checked by a second model that blocks risky actions | blocked actions | longer work whose direction you trust |

Deny rules and hooks block in every mode. Auto mode stops dangerous actions; a safe but wrong change still gets through,
so you still review.

## Model and effort

`/model` picks the model, `/effort` the effort (low · medium · high · xhigh · max). Medium is the default; high costs more
(on camera "~1.5x the estimated cost of medium") and suits a bug in code you didn't write. Press `s` to change it for
this session only.

## Plan mode

your request → Claude reads the code (no edits) → a written plan → you decide: **Yes, and use auto mode** ·
**Yes, manually approve edits** · **Tell Claude what to change** (back to planning) → edits → Claude checks its work.
Ctrl+O shows the full plan. Read the plan's rules: its caveats follow from them.

## Rewind (Esc Esc or /rewind)

- Every prompt is a checkpoint. Restore code, conversation, or both.
- It restores files Claude changed with its file tools, and later Bash changes to those files.
- A file only a Bash command changed is not undone. Rewind is not version control: git is.

## CLAUDE.md is a map, not a manual

A short file of pointers (where things live, how to check a change) that loads into every session. Add a line when Claude
makes the same mistake twice; keep it far under 200 lines; enforce rules with deny rules and hooks.

## Check the cost

`/usage`: the session block (list-price cost, API and wall time, lines changed), plan bars, and recommendations such as
"See what fills your context · run /context".
