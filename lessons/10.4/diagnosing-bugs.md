# Card: diagnosing bugs, from hypotheses to a regression test

One page from Lesson 10.4, the second half of `/diagnosing-bugs`. Lesson 10.3 covers phases 1 and 2: one command that goes
red, and a minimal repro. Here: phases 3 to 6, and `/retro` after the fix.

## Phase 3: guesses you can prove wrong

- **Three to five**, ranked. One guess anchors you on the first idea that sounds right.
- Each one with a **prediction**: "if this is the cause, then this check comes out this way". A guess that nothing could prove
  wrong can't be tested; the skill calls it a vibe.
- The guess you already believe (from triage, from a teammate, from yourself) gets a check like the others.
- Ask it to stop after the list, and read it before anything is tested.

## Phase 4: probes, one variable each

| Rule | Why |
|---|---|
| One variable per probe | so the result points at one guess |
| One unique tag on every debug line (`[DEBUG-14a1]` on camera) | so one search finds them all at cleanup |
| Probes in scratch scripts, or reverted against a pristine copy | the repository stays clean |
| Stop when one hypothesis is left standing, before any fix | ask for this stop yourself |

Accept the survivor when every probe pointed the same way and the one test it couldn't run is named.

## Phase 5: the test before the fix

- **The right seam**: the place where a test reaches the code the bug runs through, for every caller. On camera: the browser
  form, `groups.create` and `groups.update` all pass the name to one schema, so the test sits at the schema.
- **Too shallow**: a test of one caller only can pass while another caller is still broken.
- **No correct seam?** That is itself the finding: report it instead of writing a shallow test.
- **Red before green**: run the test before the fix and watch it fail (10 failures on camera). A test that never failed
  hasn't shown it can see the bug.
- Then the fix, the test green, the full suite, and the original loop from phase 1 green again.
- Check it by hand once, the reporter's own steps.

## Phase 6: clean up and close

| Checklist | On camera |
|---|---|
| The original repro no longer reproduces | the phase 1 scenario and the minimised loop are green |
| The regression test passes | 28/28 in the file, 518/518 in the suite |
| Every tagged probe is gone | `git grep -n "DEBUG-"` prints nothing |
| Throwaway scripts and copies are deleted | the scratch folder is empty, the loop included |
| Side effects the skill can't know about | the test groups in the dev database, deleted by explicit ID after reading the list |
| The commit message names the cause | the hypothesis that held, the callers, `Closes #14` |

Then check it yourself: the message, the grep, `git status`, the test file, the issue state, the CI run.

## After the fix: `/retro`

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
