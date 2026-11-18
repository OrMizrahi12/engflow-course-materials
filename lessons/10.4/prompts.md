# Lesson 10.4 prompts and commands, in order

Everything typed or pasted on camera, in order, with what came back. Lines in the Claude Code session `spliit-diagnose`
(continued from lesson 10.3) are marked "session"; shell lines run inside your standalone copy of Spliit. Times are the
turn's own clock.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | session | the Phase 3 request (below) | "Baked for 27s": five ranked hypotheses, each with a prediction and what proves it wrong; an order (H1 and H2 first) and a stop |
| 2 | session | the Phase 4 request (below) | "Cogitated for 1m 17s": four probes tagged `[DEBUG-14a1]`, a probe table; H1 left standing, H2 ruled out; no fix written |
| 3 | session | the Phase 5 request (below) | "Sautéed for 1m 38s": the test in `src/lib/schemas.test.ts`, 10 failures before the fix, the one-rule fix, 28/28 and 518/518 after, the loop green; decisions handed back |
| 4 | browser | `localhost:3000/groups/create`, reload, five spaces in Group name, Create | "Enter at least two characters.", no group |
| 5 | session | the Phase 6 request (below) | "Brewed for 1m 40s": 23 test groups deleted by ID, #16 filed, scratch folder emptied, 518 passed, the commit, the push; #14 closed |
| 6 | shell tab 5 | `git log -1 --format=%B` | the message: the cause (H1), the three callers, checked not trimmed, #16, `Closes #14` |
| 7 | shell | `git grep -n "DEBUG-"` | nothing |
| 8 | shell | `git status --short` | nothing |
| 9 | shell | `npx jest src/lib/schemas.test.ts` | 2 suites, 28 passed, 0.336 s |
| 10 | shell | `gh issue view 14 --json state -q .state` | `CLOSED` |
| 11 | shell | `gh run list -L 1` | a check mark, `Reject group names with no visible characters`, CI, main, push, 50s |
| 12 | shell | `gh issue view 16 --json title -q .title` | `A participant name of only spaces (or other invisible characters) passes validation` |
| 13 | session | `/retro`, picked `/mattpocock-skills:retro (retro)` from the menu, then the scope (below) | "Cooked for 1m 1s": what let it through, five candidates most severe first, "I haven't made any of these changes." |
| 14 | session | the pick (below), typed | "Churned for 17s": #17 filed, `needs-triage` |

## Prompt 1: Phase 3, hypotheses

```
Go ahead with Phase 3: three to five ranked hypotheses, each with the prediction that would prove it wrong. Show me the list and stop before you test any of them.
```

Three to five, because a single guess anchors you on the first idea that sounds right. A prediction, because a guess that
nothing could prove wrong can't be tested. "Stop before you test" keeps you in the loop between ranking and probing.

## Prompt 2: Phase 4, probes

```
Nothing to add: triage guessed H1 as well, so test it like the others. Phase 4: probe them one variable at a time, and tag every debug log. Stop when one hypothesis is left standing and tell me which one, before you write any fix.
```

The guess you already believe is the one you'd be tempted to skip, so it gets probed too. One variable per probe, so each
result points at one guess. One tag on every debug line, so one search finds them all at cleanup. The stop is asked for
explicitly: on its own the skill pauses only after phase 3.

## Prompt 3: Phase 5, the regression test first

```
Agreed, H1. Keep this fix to the group name, which also covers editing a group; participant names get their own issue. Phase 5: write the regression test first, at the right seam, or tell me there is no correct seam. Watch it fail, apply the fix, watch it pass, then re-run the original loop. Don't commit yet.
```

A seam is the place where a test can reach the code the bug runs through. "Or tell me there is no correct seam" leaves room for
the honest answer: if there is none, that is the finding. "Watch it fail" proves the test can see the bug. "Don't commit yet",
because you check it by hand first.

## Prompt 4: Phase 6, clean up and close

```
Checked, not trimmed, is right, and leave U+3164 out. File participant names as their own issue in our tracker, needs-triage, and mention U+3164 there. Phase 6: clean up everything the skill lists, including the test groups we left in the dev database while reproducing it. Then commit on main with a message that names the hypothesis that turned out right and closes #14, and push.
```

It answers the decisions handed back in Phase 5 first, then asks for the skill's cleanup plus the side effect the skill can't
know about (test data in the dev database), and a commit message that teaches the next reader the cause.

## Prompt 5: the retro's scope

```
What in this repo let #14 reach a user, and what would have caught it first?
```

Typed after `/retro` in the same session, on purpose: everything that happened is still in its context.

## Prompt 6: the pick

```
File item 1 as an issue, title and currency included.
```

Short, because the list already says everything. Item 1, because one check guards three fields at once.

---
The `diagnosing-bugs` and `retro` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License, described here in our own words. Spliit is open source under the MIT License, by Sebastien Castiel and
contributors. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
