# Card: /handoff

One page from Lesson 4.2. When the work has to move somewhere your session can't follow, send one file with it.

## In and out

- **In:** your current conversation, and one sentence about what the next session is for. On camera: "a fresh session in
  its own folder builds a logic prototype … That folder won't load your memory notes, so write down every rule the model
  needs."
- **Out:** one Markdown file in the temp folder that a fresh session can read cold, and a short reply with its path.

## The skill, in one look

- Description: "Compact the current conversation into a handoff document for another agent to pick up."
- You start it yourself: `disable-model-invocation: true`.
- It saves the document to the OS temporary directory (`$TMPDIR`, else `/tmp`; `%TEMP%` on Windows), away from the
  workspace: it is a message in transit, and it doesn't belong in the repo.
- It includes a **suggested skills** section: which skills the next session should call.
- It doesn't duplicate what specs, plans, ADRs, issues or commits already hold: it points to them by path or URL.
- It redacts keys, passwords and personal details.
- Your argument says what the next session will focus on, and the document is tailored to it.

## When to reach for it

| The work moves to | Use |
|---|---|
| a new folder (a prototype folder is the common case) | `/handoff` |
| a different tool or harness | `/handoff` |
| a colleague | `/handoff` |
| a side task you run while this conversation keeps going | `/handoff`, and the answer comes back with a second one |
| the same folder, the same task | `/compact` |

## Why the sentence matters

Claude Code keeps its memory notes per project folder. A session in another folder starts without them. On camera every
money rule decided since lesson 3.1 lived only in the planning folder's notes, so the sentence asked for every rule to be
written out, and the document carried them.

## How it ran (on camera)

1. `/handoff` and the pasted sentence. 55 seconds later: `/tmp/potluck-prototype-handoff.md`, 105 lines: the task, what
   to read first (by path), every rule written out, the known tension, places the idea may break, what's out of scope,
   suggested skills.
2. Read before handing over: its structure with `grep`, the first lines, the odd-cent rule, the suggested skills.
3. A fresh session in a new folder, pointed at the path. It started working without asking for anything.
4. On the way back, a second `/handoff` from the prototype session carried the findings to the planning session.

## Rules of thumb

- **Say what the next session is for**, and what it can't see.
- **Read it before you hand it over.** A summary can state things the session only assumed: correct them first.
- **Point the new session at the path.** Don't paste the summary into a shell command.
- **The temp folder gets cleaned up.** If the next session won't start soon, copy the file somewhere you keep.
- **Reading outside the folder may ask first.** A session asks before it reads a file outside its working directories;
  a one-time yes is enough.

**It's working if** the document is small and readable cold, the fresh session starts working without you explaining
again, your original session is unchanged, the suggested skills fit, and nothing secret is in it.

---
The `handoff` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed
by Matt Pocock.
