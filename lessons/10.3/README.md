# Student kit: Lesson 10.3, Diagnosing bugs I: the loop first

A bug report is something a person saw. Before anyone guesses at a cause, `/diagnosing-bugs` wants one command that shows the
bug: red while it's there, green when it's gone. This lesson takes #14 from the tracker you triaged in lesson 10.2 (a group
name of only spaces creates a group with no visible name; a copy of Spliit's upstream issue #692), reproduces it by hand in the
browser, then asks Claude for that one command and nothing else. It comes back with a script that goes red three times in
under a tenth of a second. We judge it with four checks, ask for it to be tightened and the repro minimised one cut at a time,
and run it ourselves: red, red again, and a green control. Nothing is fixed and nothing is committed in this lesson; the
hypotheses and the fix are lesson 10.4.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `diagnosing-bugs.md` | the card: the gate, the four checks, the ways to build a loop, minimising, the false green, it's working if |
| `spliit/repro-14.sh` | the loop exactly as Claude left it at the end of the second turn (a throwaway red loop, not the fix) |

`spliit/repro-14.sh` is there so you can compare it with the one your own session writes, or run it if your session can't
build one. It is a throwaway: it lives outside the repository, it is not a test and it is not the fix. Lesson 10.4 uses it
to prove the fix.

## Before you start

- Your standalone copy of Spliit from lessons 10.1 and 10.2 (a private repository of your own, **not a fork**), with the
  issue copied from upstream #692 in its tracker (our #14; your number may differ) and its local database set up as in 10.1.
- A paid Claude plan and Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.326,
  Opus 5.5), in auto mode. In default mode you approve each command as it comes.
- `bash`, `curl`, `jq`, Node.js and npm, and the GitHub CLI `gh` signed in to your own account.
- A browser for the by-hand reproduction.

Free: Spliit, Node.js, PostgreSQL, `gh`, `curl`, `jq` and the skills. Not free: the Claude plan. Both turns in this lesson are
short (a few files read and a script run a handful of times), a small share of a session's allowance.

## Install the tools (Windows WSL, macOS, Linux)

- **Linux and Windows (WSL, Ubuntu):** `sudo apt install curl jq` and the GitHub CLI from cli.github.com; then `gh auth login`.
  Run Spliit and Claude Code inside WSL, and open `http://localhost:3000` in your Windows browser (WSL forwards the port).
- **macOS:** `brew install jq gh` (`curl` is already there); then `gh auth login`.

`time` is built into `bash` and `zsh`, so there is nothing to install for it. If your shell prints the timing in a different
layout, the numbers mean the same thing.

## The steps, as on camera (Ubuntu)

**1. Read the report.** In a shell, inside your copy:

```bash
clear
gh issue view 14
```

Scroll up to the reporter's steps: open the create-group page, type only spaces into the group name (five in their runs),
leave the participants, press Create, open My groups. Expected: "Enter at least two characters." as for an empty name, and no
group. Actual: no message, the group is created, the tab title has an empty slot, and the Recent groups card shows only the
participant count and the date. A control (an empty name is rejected) and a likely cause (a length check that never trims).
The cause is a guess: it waits until something goes red.

**2. Start the dev server.**

```bash
clear
npm run dev
```

"Ready in 166ms" on camera, on `http://localhost:3000`. Leave it running in this tab: the browser needs it now, and the loop
needs it later.

**3. Reproduce it by hand.** In the browser, open `http://localhost:3000/groups/create`.

- Leave the group name empty (the grey text is only a placeholder), scroll down and press **Create**: "Enter at least two
  characters." in red under the field, and the form stays. That's the control.
- Click into the field and type five spaces. Select them (Shift+Home) to see that they are there. Press **Create**: the page
  moves to the new group's Expenses, with no message. The tab title reads `Expenses · · Spliit`.
- Click **Groups** at the top: under Recent groups, the new card has no name, only the count of people and today's date.

That's the symptom, exactly as reported. Repeating these clicks after every change would cost about twenty seconds each time.

**4. A fresh session, loop first.** Open a new terminal tab in your copy:

```bash
claude -n spliit-diagnose
```

Type `/diagnosing-bugs`, pick it from the menu (it fills in `/mattpocock-skills:diagnosing-bugs `), then paste and send:

```
#14 in our tracker: a group name of only spaces creates a group with no visible name. I just reproduced it by hand in the browser, and the dev server is still running. Loop first: stop as soon as you have one command that goes red on this bug, and show it to me. No hypotheses yet.
```

Use your own issue number. "Stop as soon as" is there because the skill only pauses at its hypothesis list; ask for the stop
yourself if you want to judge the loop first.

On camera the turn showed "Crunched for 37s". It read the issue with `gh`, the create procedure and the code that shapes a
request, then wrote `repro-14.sh` in its own scratch folder, outside the repository. The script sends two requests to the
same create endpoint the form uses, on the running dev server: first an empty name, which must come back rejected (if it
doesn't, the script prints `LOOP BROKEN` and exits 2), then the five-space name: red if the server accepts it. Run three
times: red, red, red, in 0.093, 0.034 and 0.036 seconds. It named its limits (the form itself isn't checked; every red run
creates a real nameless group in your dev database) and stopped.

**5. Judge it with the four checks.**

| Check | On camera |
|---|---|
| Red on the user's symptom | yes: the server accepts the same request the form sends, and that's how the blank group appears |
| Same verdict every run | yes: three out of three |
| Seconds, not minutes | under a tenth of a second |
| Runs without you | nobody touches the browser |

It did not reuse the schema test from triage: it went to the server, the "HTTP call to the running dev server" way on the
skill's list. Your session may pick a different way (a Jest test, a Playwright spec); judge it with the same four checks.
The dim text in Claude Code's prompt box afterwards is only its guess at your next message. Type your own.

**6. Tighten and minimise.** Paste:

```
Good. Now tighten it and minimise the repro, one cut at a time. Still no hypotheses.
```

"Cooked for 1m 5s" on camera. It sent the empty-name request by hand, read the validation error that names the field, and
found a weakness in its own loop: any rejection counted as green, so a cut that broke the request on another field would have
looked like a fix (a false green). It tightened the verdict:

| Verdict | Means | Exit code |
|---|---|---|
| GREEN | rejected, and the rejection is about the group name | 0 |
| RED | accepted, with the new group's id | 1 |
| BROKEN | anything else (the control failed, a rejection on another field, a server error) | 2 |

Dropping the currency now reads broken, not green. Then one cut per run:

| Cut | Result | Kept out? |
|---|---|---|
| drop the currency code | red | yes |
| two participants to one | red | yes |
| one participant to none | broken | no, needed |
| drop the currency | broken | no, needed |
| five spaces to two | red | yes |
| two spaces to one | green | no, the second space is needed for the bug |

The smallest request that still goes red: a name of two spaces, a currency `$` and one participant, `John`. The tighter loop
runs in four to seven hundredths of a second. It reported ten more test groups in the dev database and stopped before phase 3.

**7. Run it yourself.** Open a new terminal tab in your copy. Claude prints the script's full path in its reply; store it in a
variable (the path into its scratch folder is long):

```bash
S=/path/from/claudes/reply/repro-14.sh
time $S
```

On camera: `RED: name="  " accepted, {"groupId":"…"}`, real time 0.070 s. Press Up and Enter: red again, 0.064 s. Then the
control, one space as the name:

```bash
$S '" "'
```

`GREEN: name=" " rejected on groupFormValues.name`. The argument is a JSON string, so the quotes are part of it. Last:

```bash
git status --short
```

Nothing at all: the loop lives outside the repository and nothing is committed.

To run this kit's copy instead: `bash spliit/repro-14.sh` (red while the bug is there) and `bash spliit/repro-14.sh '" "'`
(green). It needs `curl`, `jq` and the dev server on port 3000 (set `BASE=` for another address). It writes `last-body.json`
next to itself.

## Side effects

Every red run creates a real group with a blank name in your local dev database: after this lesson ours held 18 nameless
groups and one called "Trip" (Claude's own green check). Your browser's Recent groups list shows only the one you made by
hand (it is kept per browser). Nothing else changes: no file in the repository, no commit, no issue comment. Leave them for
now; lesson 10.4 decides what to do with them.

## Pause and try

Reproduce the bug by hand once, then start a fresh session and run `/diagnosing-bugs` with "loop first: stop as soon as you
have one command that goes red on this bug". Judge it with the four checks, then ask for tighten and minimise. Run the final
command yourself twice, and run its control. You're done when it went red before any theory, on what the reporter saw, the same
way twice, in seconds, and your minimal input has nothing left to remove. Claude's loop can differ from ours from run to run;
the four checks are what matter.

---
Spliit is open source under the MIT License, by Sebastien Castiel and contributors. The bug in this lesson was reported by a
Spliit user in https://github.com/spliit-app/spliit/issues/692; our tracker holds a copy that links to it, and nothing was
posted upstream. The `diagnosing-bugs` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License, described here in our own words. This course is independent: unofficial, and not affiliated with or
endorsed by Matt Pocock or by Spliit's authors.
