# Test a document after trimming it

An agent asked to trim a document can cut the very thing that made it work. So settle what a skill or a `CLAUDE.md` does by
running it, in a session that has never seen the conversation that wrote it.

## The setup

1. Commit the skill and the pruned `CLAUDE.md` on the change's branch (on camera: the `verify-skill` worktree).
2. Open a new terminal tab in the same worktree and start `claude` there. A fresh session loads `CLAUDE.md` and one line per
   skill, and nothing else from the author session.
3. Optional: type the skill's slash name without sending it. If the menu shows your description, the project skill is the
   one that answers.

## Test 1: does the skill fire by itself?

Ask for the job in plain words, the way a teammate would, without the skill's name or any hint:

```text
Check that creating a group and opening its link still works in the running app. Don't commit anything.
```

Look for: the skill loading first (`Skill(verify)`, "Successfully loaded skill"), and the steps followed in order, each
ending where its done-when says. If the skill doesn't load, the description is the thing to fix.

## Test 2: do the pointers lead to the rules?

Ask how a real ticket would go from start to merge, and where the rules for each step live:

```text
Next I'll hand you #4. Without writing any code, tell me how you'd take it from ticket to merged here, and where the rules for each step live.
```

Make a list of every file `CLAUDE.md` points at. Tick each one the answer reached. Anything left unticked that the work
needs is a missing or badly worded pointer.

## Sort what you find

- **A bug in the app** (on camera: the dev server reloading the page in a loop): its own issue, out of this branch.
- **A gap in the document** (on camera: nothing pointed at Next's `AGENTS.md`): fix the document, leading word first, and
  say plainly that the fix itself hasn't been tested in a fresh session yet.

## Done when

- A plain request loaded the skill without its name.
- Every file `CLAUDE.md` points at was reached, or the gap is now a pointer.
- Each finding is either an issue or a commit, and you can name one thing the test found and one it didn't.
