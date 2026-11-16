# Card: five moves at a phase boundary

## When

A phase just ended: a job is done and the next one hasn't started. Claude Code may suggest `/clear`. Before you take that
suggestion, decide what the conversation should become.

## The five questions, top to bottom: the first yes wins

| # | Question | Move | What survives |
|---|---|---|---|
| 1 | Does the next phase need this conversation as a primary source (the reasoning as it happened), and is there still room? | **Continue** | everything |
| 2 | Is all of it disposable: the exploration, the decisions, the dead ends? | **`/clear`** | nothing (the cheapest move) |
| 3 | Is the work traveling: a new tool, a new folder, a colleague, or a side task you found mid-phase? | **`/handoff`** (or `/fork`, below) | a portable document |
| 4 | Can it run with nobody steering? | **A subagent**; for a whole ticket that ends in a pull request, **a background session** | the result it reports back |
| 5 | Otherwise | **`/compact <what comes next>`** | a summary aimed at the next phase |

Every move except Continue turns the conversation into something shorter, so the question is always: what has to survive?

`/compact` sits last on purpose: the four above it are cheaper or more precise. When you do use it, give it the next job:

```text
/compact we're going to file the decisions you left for me in PR #30 as ready-for-human tickets
```

After it, the counter shows `0.0k` until the next turn; the real number comes with the next reply.

## `/fork`: the light handoff

On the same machine, in the same folder, a side task doesn't need a handoff document. `/fork <task>` copies this conversation
into a new background session and keeps you where you are. The copy's work never flows back into this conversation: ask it to
leave its result somewhere you can read (a comment on a ticket, a file).

## The same tree, two answers

- A session at 130k tokens whose next job is filing its own decisions: no room (1), not disposable (2), nothing travels (3), the
  decisions are yours (4), so compact with an instruction (5).
- A session at 52k tokens whose next job is landing what it filed: question 1 already says yes, so continue.

## It's working if

You can name the question that said yes, and what the move kept.

Adapted in our own words from `PHASE-BOUNDARIES.md` in the `ask-matt` skill of
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License). Unofficial, and not affiliated with or
endorsed by Matt Pocock.
