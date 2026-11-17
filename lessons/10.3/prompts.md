# Lesson 10.3 prompts and commands, in order

Everything typed or pasted on camera, in order, with what came back. Shell lines run inside your standalone copy of Spliit;
lines in a Claude Code session are marked. Times are the turn's own clock.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | shell | `gh issue view 14` | the report: steps, Expected, Actual, a control and a likely cause |
| 2 | shell | `npm run dev` | `Ready in 166ms`, `http://localhost:3000` |
| 3 | browser | `localhost:3000/groups/create`, Create with the name empty | "Enter at least two characters.", no group (the control) |
| 4 | browser | five spaces in the group name, Create; then Groups | a group with no name: tab title `Expenses · · Spliit`, a Recent groups card with only the count and the date |
| 5 | new shell tab | `claude -n spliit-diagnose` | a named Claude Code session (Opus 5.5) |
| 6 | session | `/mattpocock-skills:diagnosing-bugs` + the loop-first request (below), typed `/diagnosing-bugs` and picked from the menu | "Crunched for 37s": `repro-14.sh` in its scratch folder, red three times (0.093 / 0.034 / 0.036 s), its limits named, stopped |
| 7 | session | the tighten-and-minimise request (below) | "Cooked for 1m 5s": GREEN only for a rejection on the name, RED for accepted, BROKEN otherwise; the cuts table; smallest red request: two spaces, a currency, one participant |
| 8 | new shell tab | `S=<the script's path from Claude's reply>` | nothing printed |
| 9 | shell tab | `time $S` | `RED: name="  " accepted, {"groupId":"…"}`, real 0.070 s |
| 10 | shell tab | Up, Enter | red again, real 0.064 s |
| 11 | shell tab | `$S '" "'` | `GREEN: name=" " rejected on groupFormValues.name` |
| 12 | shell tab | `git status --short` | nothing |

## Prompt 6: loop first

```
#14 in our tracker: a group name of only spaces creates a group with no visible name. I just reproduced it by hand in the browser, and the dev server is still running. Loop first: stop as soon as you have one command that goes red on this bug, and show it to me. No hypotheses yet.
```

The issue number, the symptom in one line, and two facts it can use (you reproduced it by hand; the dev server is running).
"Stop as soon as" and "No hypotheses yet" keep it to phase 1: on its own the skill only pauses at its hypothesis list.

## Prompt 7: tighten and minimise

```
Good. Now tighten it and minimise the repro, one cut at a time. Still no hypotheses.
```

Tighten: faster, sharper, more deterministic. Minimise: take parts out of the request until every part left is needed. "One
cut at a time", because two cuts at once can't tell you which one changed the result.

---
The `diagnosing-bugs` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
