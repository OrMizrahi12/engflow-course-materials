# Card: diagnosing bugs, the loop first

One page from Lesson 10.3. A bug report is something a person saw; a feedback loop is one command that answers one question
about it. `/diagnosing-bugs` builds the loop before it allows any theory. Lesson 10.4 adds the phases after it.

## The six phases, and the gate

1. **Build a feedback loop**
2. Reproduce and minimise
3. Form hypotheses
4. Probe them
5. Fix it, with a regression test
6. Clean up

The gate sits after phase 1: **no command that goes red, no theory.** Reading code to build a theory before that command
exists is the exact mistake the skill is there to stop. On its own the skill pauses only at its hypothesis list, so if you want
to judge the loop first, ask it to stop as soon as it has one.

## Red, green, and broken

- **Red:** the bug is present.
- **Green:** the bug is gone.
- **Broken:** the run failed for some other reason. A good loop says so instead of choosing red or green.

A **control** is a case that must behave normally (here: an empty name must be rejected). If the control fails, the loop is
broken, whatever the bug case says.

## The four checks

| Check | Ask |
|---|---|
| Red on the user's symptom | does it fail on what the reporter actually saw, not on something nearby or on "didn't crash"? |
| Same verdict every run | run it again: same answer? |
| Seconds, not minutes | fast enough to run after every change? |
| Runs without you | no clicks, no reading by eye? |

A test that only checks "didn't crash" fails the first check when the bug never crashes anything.

## Ways to build one, roughly in the skill's order

A failing test at whatever level reaches the bug · an HTTP call to the running dev server · a CLI run compared with a known
good output · a headless browser script · replaying a captured request · a small throwaway harness · random inputs (fuzzing) ·
a bisect script between a good and a bad version · the same input through two versions, compared · and last, a script that
walks a person through the clicks. In Lesson 10.3 Claude chose the second: two requests to the create endpoint on the dev
server, in under a tenth of a second.

## Tighten

Faster, sharper, more deterministic. Sharper means the verdict names the exact symptom: green only for the right rejection,
not for any rejection.

## Minimise, one cut at a time

| Step | |
|---|---|
| Lay the repro out as parts | the name, the participants, the currency, the currency code |
| Cut one part, run the loop | one cut per run, so you know which cut changed the result |
| Still red | that part had nothing to do with the bug: it stays out |
| Any other answer | the part is load-bearing: it goes back |
| Done | when every part left is load-bearing |

**The false green:** a cut that turns green because the request broke somewhere else, not because the bug went away. In the
lesson, dropping the currency would have read green under the first loop; after tightening, it reads broken.

## Run it yourself

Claude says it ran the loop; run it yourself anyway. Twice, for the same verdict, then the control. Where it lives matters too:
a throwaway loop outside the repository leaves `git status` clean.

**It's working if** one command went red before any theory, on what the reporter saw, the same way twice, in seconds, with
nobody touching the app, and your minimal input has nothing left you could remove.

---
The `diagnosing-bugs` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. Spliit is open source under the MIT License, by Sebastien Castiel and contributors.
This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
