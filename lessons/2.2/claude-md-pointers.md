# CLAUDE.md as a map: the pattern from Lesson 2.2

## The request we pasted (one line)

```text
Write a CLAUDE.md for this folder: at most five one-line pointers (where things live, how to check a change). No explanations.
```

## What Claude wrote on camera (seven lines)

```markdown
# Potluck

- `logic.js`: pure money math (amounts are integers in minor units); runs in Node via `require('./logic.js')`.
- `app.js`: UI, rendering and actions; state is saved in localStorage under `potluck.v1`.
- `index.html` + `styles.css`: page shell and styles; no build step, no dependencies.
- Check logic changes: `node -e "const L=require('./logic.js'); console.log(L.toMinor('12,50','EUR'))"`.
- Check UI changes: open `index.html` in a browser.
```

Yours will differ: Claude writes from your files. Check every pointer against the folder before you keep it.

## Why pointers

`CLAUDE.md` loads into the context of every session, on every turn. A long manual fills the context and its later lines
get followed less; five pointers cost almost nothing, and Claude opens a file only when the task needs it. On camera a
fresh session answered "Where is the money maths, and how do I check a change?" from this file alone: "I took this from
CLAUDE.md and didn't open logic.js or run the command."

## Keeping it useful

- You write it, or you approve what Claude wrote.
- Add a line when Claude makes the same mistake twice.
- Keep it far under 200 lines.
- It is guidance, not a lock: rules that must hold belong in deny rules and hooks (later in the course).
- Auto memory is the other system: notes Claude keeps for itself. `/memory` shows both.
