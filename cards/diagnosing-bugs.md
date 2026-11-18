# Card: diagnosing bugs, from the loop to a regression test

One page from Lesson 10.3. A bug report is something a person saw; a feedback loop is one command that answers one question
about it. `/diagnosing-bugs` builds the loop before it allows any theory. Lesson 10.4 adds phases 3 to 6 and `/retro`
after the fix: the second half of this card.

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


## Lesson 10.4: from hypotheses to a regression test

The same session picks up after phase 2, with the loop and the minimal repro from Lesson 10.3.

### Phase 3: guesses you can prove wrong

- **Three to five**, ranked. One guess anchors you on the first idea that sounds right.
- Each one with a **prediction**: "if this is the cause, then this check comes out this way". A guess that nothing could prove
  wrong can't be tested; the skill calls it a vibe.
- The guess you already believe (from triage, from a teammate, from yourself) gets a check like the others.
- Ask it to stop after the list, and read it before anything is tested.

### Phase 4: probes, one variable each

| Rule | Why |
|---|---|
| One variable per probe | so the result points at one guess |
| One unique tag on every debug line (`[DEBUG-14a1]` on camera) | so one search finds them all at cleanup |
| Probes in scratch scripts, or reverted against a pristine copy | the repository stays clean |
| Stop when one hypothesis is left standing, before any fix | ask for this stop yourself |

Accept the survivor when every probe pointed the same way and the one test it couldn't run is named.

### Phase 5: the test before the fix

- **The right seam**: the place where a test reaches the code the bug runs through, for every caller. On camera: the browser
  form, `groups.create` and `groups.update` all pass the name to one schema, so the test sits at the schema.
- **Too shallow**: a test of one caller only can pass while another caller is still broken.
- **No correct seam?** That is itself the finding: report it instead of writing a shallow test.
- **Red before green**: run the test before the fix and watch it fail (10 failures on camera). A test that never failed
  hasn't shown it can see the bug.
- Then the fix, the test green, the full suite, and the original loop from phase 1 green again.
- Check it by hand once, the reporter's own steps.

### Phase 6: clean up and close

| Checklist | On camera |
|---|---|
| The original repro no longer reproduces | the phase 1 scenario and the minimised loop are green |
| The regression test passes | 28/28 in the file, 518/518 in the suite |
| Every tagged probe is gone | `git grep -n "DEBUG-"` prints nothing |
| Throwaway scripts and copies are deleted | the scratch folder is empty, the loop included |
| Side effects the skill can't know about | the test groups in the dev database, deleted by explicit ID after reading the list |
| The commit message names the cause | the hypothesis that held, the callers, `Closes #14` |

Then check it yourself: the message, the grep, `git status`, the test file, the issue state, the CI run.

### After the fix: `/retro`

Ask what in the repository let the bug reach a user and what would have caught it first. Each candidate lands in the
environment, not the code: a mechanical pattern becomes an automated check (a grep in CI), a judgment call becomes a
reviewer's standard, a missing pointer goes into the agent's notes, missing information becomes something the agent can
reach. It only proposes; pick one and file it as an issue.

**It's working if** every hypothesis had a prediction, every probe changed one thing, the test failed before the fix and passed
after it at the seam every caller shares, one search for the tag comes back empty, the commit tells the next reader the cause,
and the retro's pick is an issue in the tracker.

---
The `diagnosing-bugs` and `retro` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License, described here in our own words. Spliit is open source under the MIT License, by Sebastien Castiel and
contributors. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
