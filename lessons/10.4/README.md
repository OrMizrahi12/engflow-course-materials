# Student kit: Lesson 10.4, Diagnosing bugs II: from hypotheses to a regression test

Lesson 10.3 ended with one command that goes red on #14 (a group name of only spaces creates a group with no visible name)
and the smallest request that still shows it. This lesson finishes the job in the same `/diagnosing-bugs` session: five
ranked hypotheses, each with the prediction that would prove it wrong; four probes, one variable each, every debug line
carrying the same tag, until one hypothesis is left standing; a regression test at the seam all three callers share, red
before the fix and green after; a check by hand in the browser; the cleanup, a commit that names the cause and closes #14, and
the push. Then `/retro` asks what in the repository let the bug reach a user, and one of its candidates is filed as an issue.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `diagnosing-bugs.md` | the card for phases 3 to 6: guesses you can prove wrong, tagged probes, the right seam, red before green, the cleanup, the commit |
| `spliit/fix-59c41d7.diff` | the fix and the regression test exactly as committed (`src/lib/schemas.ts`, `src/lib/schemas.test.ts`) |
| `spliit/commit-message.txt` | the commit message exactly as committed: the cause, the three callers, `Closes #14` |
| `spliit/own-check.sh` | my own check after the push: the seven commands typed on camera, in order |
| `spliit/issue-16.md` | the follow-up issue the session filed for participant names, as filed |
| `spliit/issue-17.md` | the issue filed from the retro's first candidate (a shared visible-text rule and a CI check), as filed |

To apply the fix to your copy instead of having your own session write it: `git apply spliit/fix-59c41d7.diff` from the root
of your Spliit copy, at the commit you left in lesson 10.3. Your session's own fix may differ; what matters is that its test
went red first.

## Before you start

- Your standalone copy of Spliit from lessons 10.1 to 10.3 (a private repository of your own, **not a fork**), with #14 in
  its tracker (your number may differ), the dev server running, and the `/diagnosing-bugs` session from lesson 10.3 still open,
  or the loop's command and minimal input from that lesson at hand.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.326,
  Opus 5.5), in auto mode. In default mode you approve each command as it comes.
- Node.js and npm, `git`, and the GitHub CLI `gh` signed in to your own account. A browser for the check by hand.
- Your copy's CI workflow enabled on GitHub (lesson 10.1), so the push runs it.

Free: Spliit, Node.js, PostgreSQL, `gh`, GitHub Actions minutes on a private repository within the free allowance, and the
skills. Not free: the Claude plan. This lesson is six turns in one session, from about 55k to 108k tokens of context; that
fits comfortably in one session, but it is a bigger share of an allowance than lesson 10.3.

## Install the tools (Windows WSL, macOS, Linux)

- **Linux and Windows (WSL, Ubuntu):** the GitHub CLI from cli.github.com, then `gh auth login`. Run Spliit and Claude Code
  inside WSL, and open `http://localhost:3000` in your Windows browser (WSL forwards the port).
- **macOS:** `brew install gh`, then `gh auth login`.

`git grep` and `jest` need nothing extra: `git` is already installed, and `npx jest` uses Spliit's own dev dependencies.

## The steps, as on camera (Ubuntu)

**1. Where we stopped.** Tab 4, the session `spliit-diagnose`, shows the end of lesson 10.3: the cuts table, the smallest
red request (a name of two spaces, a currency `$`, one participant `John`), and "Next is Phase 3".

**2. Phase 3: hypotheses.** Paste:

```
Go ahead with Phase 3: three to five ranked hypotheses, each with the prediction that would prove it wrong. Show me the list and stop before you test any of them.
```

"Baked for 27s" on camera. It read only code (`src/lib/schemas.ts:10`, `src/lib/api.ts:15-34`, the uses of `groupFormSchema`)
and came back with five hypotheses, each with a *Prediction* and a *Proves it wrong*:

| | Hypothesis | Proves it wrong |
|---|---|---|
| H1 | the name rule counts characters, not visible ones (`z.string().min(2)`) | a direct check of the schema rejects two spaces |
| H2 | the request layer reshapes the name before the schema sees it | the schema and the endpoint give the same verdict |
| H3 | the spaces are stored exactly as typed, so the blank name is how spaces render | the stored name is not two spaces |
| H4 | the form and the server share one rule: one bug, one fix | the form and the endpoint disagree |
| H5 | any invisible characters pass (tabs, U+00A0, U+200B); a plain trim would miss U+200B | one of them is rejected |

Triage's guess in lesson 10.2 ("no trim") is H1, ranked first, and it still gets a check that could kill it. A guess with no
such prediction can't be tested: the skill calls it a vibe.

**3. Phase 4: probes.** Paste:

```
Nothing to add: triage guessed H1 as well, so test it like the others. Phase 4: probe them one variable at a time, and tag every debug log. Stop when one hypothesis is left standing and tell me which one, before you write any fix.
```

"Cogitated for 1m 17s" on camera. Every line its probes printed started with the same tag, `[DEBUG-14a1]`; yours will have
its own.

| Probe | What changed | Result | Verdict |
|---|---|---|---|
| 1 | the schema checked directly, no server or request layer | two spaces accepted, one space rejected: the same verdict as the endpoint | H1 holds, H2 ruled out |
| 2 | a red group read back | the stored name is code points `[32,32]`: two plain spaces | H3 holds |
| 3 | only the kind of invisible character (tab, U+00A0, U+200B) | all red | H5 holds |
| 4 | the real form in a headless browser (a cached build, nothing downloaded) | two spaces submitted, one space blocked | H4 consistent |

H1 is left standing; the others follow from it. "A `.trim()` alone isn't enough": a zero-width space is not whitespace. The
tag lived only in its scratch scripts, a search of the repository for it found nothing, and `git status` was clean.

**4. Phase 5: the regression test first.** Paste:

```
Agreed, H1. Keep this fix to the group name, which also covers editing a group; participant names get their own issue. Phase 5: write the regression test first, at the right seam, or tell me there is no correct seam. Watch it fail, apply the fix, watch it pass, then re-run the original loop. Don't commit yet.
```

"Sautéed for 1m 38s" on camera. The seam: `groupFormSchema`, because the browser form, `groups.create` and `groups.update` all
pass the name to it unchanged. The test went into the existing `src/lib/schemas.test.ts`: a new block that must reject `""`,
`" "`, five spaces, two tabs, two no-break spaces, two zero-width spaces and `"   x"` (each with `min2`, the key an empty name
gets) and must accept `"Jo"`, `"Trip to Rome"` and `"  Trip  "`. **Before the fix: 10 failures** (5 invisible-name cases in
both of the project's time-zone setups). The fix (see `spliit/fix-59c41d7.diff`) keeps the maximum of 50 and counts only the
characters left after removing whitespace and format characters:

```ts
.refine((name) => name.replace(/[\s\p{Cf}]/gu, '').length >= 2, 'min2')
```

After: 28 of 28 in the file, the full suite 518 of 518, the project's checks clean (Prettier reformatted one line). The
original scenario from phase 1 and the minimised loop: green. A rename to spaces through the update endpoint: rejected. Its
decisions handed back: names are checked, not trimmed; U+3164 (Hangul Filler) still passes; the 50-character limit counts
everything; participant names untouched.

**5. Check it by hand.** In the browser, reload `http://localhost:3000/groups/create`, type five spaces into Group name,
select them (Shift+Home) to see they are there, scroll down and press **Create**: "Enter at least two characters." in red, and
no group. The dev server picked up the change by itself; if yours keeps serving the old code, restart `npm run dev`.

**6. Phase 6: clean up, commit, push.** Paste:

```
Checked, not trimmed, is right, and leave U+3164 out. File participant names as their own issue in our tracker, needs-triage, and mention U+3164 there. Phase 6: clean up everything the skill lists, including the test groups we left in the dev database while reproducing it. Then commit on main with a message that names the hypothesis that turned out right and closes #14, and push.
```

"Brewed for 1m 40s" on camera. It read the repository's notes on the tracker and labels, listed the groups whose names have
fewer than two visible characters (plus the ones named Trip), and deleted 23 by explicit ID, leaving one group (24 before, 1
after). It filed `spliit/issue-16.md` as #16, emptied its scratch folder (the probes, the pristine copy and the loop itself),
ran the full suite (518 passed), committed `Reject group names with no visible characters` (`spliit/commit-message.txt`) and
pushed it to `main`. #14 closed with the push.

**7. My own check.** In my own shell tab, the commands in `spliit/own-check.sh`, one at a time:

```bash
git log -1 --format=%B
git grep -n "DEBUG-"
git status --short
npx jest src/lib/schemas.test.ts
gh issue view 14 --json state -q .state
gh run list -L 1
gh issue view 16 --json title -q .title
```

On camera: the message names H1 and ends with `Closes #14` and the `Co-Authored-By` line Claude Code adds by default; the grep
and the status print nothing; 2 suites, 28 passed, 0.336 s; `CLOSED`; CI on `main` from the push, 50 s, with a check mark; and
the title of #16.

**8. `/retro`.** Type `/retro`, pick `/mattpocock-skills:retro (retro)` from the menu, then paste after it:

```
What in this repo let #14 reach a user, and what would have caught it first?
```

"Cooked for 1m 1s" on camera. It loaded `writing-for-agents` first, as the retro skill asks, then read the workflows, the
history of the name rule and the end-to-end tests. Its finding: nothing in the repository ever ran the group-name rule against a
name of spaces; the rule dates from the first commit. Candidates, most severe first: 1, the same flaw is live in three places
(participant name, already #16; expense title; currency symbol), so one visible-text helper and a CI step that fails on the grep
`\.min\([0-9]+, 'min[0-9]+'\)`; 2, no test ever exercised group-name validation; 3, CI checks `main` only after code lands
(branch protection was not available for this private repository on its plan, so a local pre-commit hook is the cheapest
gate); 4, the end-to-end tests run only on release tags; 5, local friction from the session. And: "I haven't made any of these
changes."

**9. Pick one.** Type:

```
File item 1 as an issue, title and currency included.
```

"Churned for 17s" on camera: one `gh issue create` with the `needs-triage` label, filed as #17 (`spliit/issue-17.md`). It waits
in the tracker, like any other report. The dim suggestion in the prompt box afterwards is only a guess at your next message.

## Side effects

- One commit on `main` of your copy (the fix and its test), pushed; your bug issue closed by it.
- Two new issues in your tracker (participant names; the retro's pick), both `needs-triage`.
- Test groups deleted from your **local** dev database, permanently, by explicit ID. Read the list it prints before it deletes:
  in ours, two groups it couldn't explain were our own runs from lesson 10.3. Keep any group you made on purpose.
- The loop script from lesson 10.3 is gone from the session's scratch folder; the regression test replaces it.
- Nothing is filed in Spliit's own repository upstream.

## Pause and try

Continue your session from lesson 10.3, or start one with your loop's command and minimal input pasted in. Ask for 3 to 5 ranked
hypotheses and stop; check that each has a prediction. Ask for probes with a tag and stop at the survivor. Ask for the regression
test first, at the seam, then the fix, and check it by hand in your browser. Clean up (grep your tag), commit naming the cause
with `Closes #<your issue>`, push. Run `/retro` and file the candidate you pick. You're done when the test failed before the fix,
`git grep -n "DEBUG-"` prints nothing, your issue was closed by the commit, and the candidate you picked is an issue.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors; the diff in this kit is a change to its
code under that license. The bug was reported by a Spliit user in https://github.com/spliit-app/spliit/issues/692; our tracker
holds a copy that links to it, and nothing was posted upstream. The `diagnosing-bugs` and `retro` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, described here in our own words.
This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock or by Spliit's authors.
