# Student kit: Lesson 9.2, Work the map

Lesson 9.1 charted a map on GitHub: issue #41, multi-currency groups, with two research tickets closed and one decision
ticket on the frontier. This lesson works that map to the end, one decision per session. Every session is fresh, runs
`/wayfinder 41`, claims a ticket by assigning it before any work, resolves it the way its label says, and records the
answer on the ticket (a resolution comment, then closed) and on the map (one line in Decisions so far). Then it stops. Two
sessions run on the same map at once, and the assignee alone keeps them apart. The one "how should it look?" ticket gets
a throwaway UI prototype: three versions of the real page behind `?variant=`, judged in the browser, with the verdict on
the ticket and the code on a `prototype/` branch that never merges. At the end all eight tickets are closed, the fog holds
only "Writing the spec", and `main` hasn't moved. No production code is written in this lesson.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/steer-glossary.txt` | our answer when the first session edited `GLOSSARY.md` in the middle of the map |
| `prompts/leave-the-lookup.txt` | session A's second answer: widen the tickets, but leave the one another session has open |
| `prompts/verdict.txt` | the prototype verdict: variant A, plus one rule taken from B |
| `decisions.md` | what each of the eight tickets decided, in our words, in the order they closed |
| `map-at-lesson-9.2.md` | the map at the end: Decisions so far, Not yet specified, the sub-issues |
| `ui-prototype.md` | how a prototype ticket ran: the question, the three variants, what we tried, the verdict |
| `potluck-at-lesson-9.2.md` | what the Potluck repository holds at the tag `lesson-9.2`, the prototype branch, the issues |
| `wayfinder-work.md` | the card: the work loop, one decision per session, claims, parallel sessions, it's working if |

The card is also in `cards/` in the course materials, next to the `/prototype` card (which now has a UI section).

## Before you start

- Your map from lesson 9.1: one map issue with its children, at least one ticket on the frontier (open, nothing blocking
  it, nobody assigned).
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325), in auto mode. In default
  mode you approve each command as it comes.
- Terminal windows: one per session (on camera, a second window opened with Ctrl+Shift+N), a shell of your own for checks,
  and a browser for GitHub.
- For the prototype ticket: your project runs locally (`npm run dev` works), because the variants render on the real page.

## The steps, as on camera (Ubuntu)

**1. Read the map first.** Open the map issue on GitHub and reload it. On camera: Destination (a spec issue), Decisions so
far with two lines, the fog under "Not yet specified", Out of scope, and the sub-issues: 2 of 4 closed, #44 open with both
of its blockers closed (the frontier), #45 blocked by #44.

**2. Read the part of the skill you haven't used.** In the shell:

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/wayfinder
sed -n '103,105p;118,123p' SKILL.md
clear
sed -n '124,128p' SKILL.md
```

The rule: never resolve more than one ticket per session (research tickets are the only exception). "Work through the
map": invoke it with the map; a ticket is optional; it loads the low-res map, picks the first frontier ticket, claims it by
assigning it, resolves it as its label says, records the resolution, graduates fog, and lets unblocked tickets run in
parallel. The plugin's version folder may differ on your machine
(`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).

**3. One session, one decision.** In a new terminal window:

```bash
claude -n foreign-amount
```

Then `/wayfinder` from the menu (the row reads `/mattpocock-skills:wayfinder`), a space, and `41`. No ticket. Before any
question it ran `gh issue edit 44 --add-assignee @me` (the claim), loaded the `grilling` and `domain-modeling` skills and
read the glossary (51 seconds). Round 1 had the two root decisions, each with a recommended answer. We typed `Yes to both.`
(22 seconds), then `Yes to all six.` for round 2 (19 seconds).

**4. Steer when it steps outside the map's rules.** The reply asked one last question, listed three threads to make into
tickets, and showed it had already added the new words to `GLOSSARY.md`, uncommitted. The map's notes say the glossary
changes only once the model is decided, so we pasted `prompts/steer-glossary.txt`. The turn took 1 minute 4 seconds: it
reverted the file (a clean tree), posted the resolution comment, closed #44, created four tickets (#47 when a rate can't be
looked up, #48 editing, #49 caps, #50 what the form and the list show, a prototype ticket blocked by #47), wired the
blocking, added its line to the map, and saved our rule as a memory. Then `/exit`: it prints the line that resumes the
session.

**5. Check the record on GitHub.** #44: closed, "self-assigned this" (the claim), a resolution comment that opens with the
decision and lists one bullet per question, closed as completed. The map: Decisions so far has a third line, "Not yet
specified" holds only "Writing the spec", sub-issues 3 of 8.

**6. Two sessions at once.** Window A: `claude -n wayfinder-a`, `/wayfinder 41`, no ticket: it claimed #45 (35 seconds).
Ctrl+Shift+N for window B: `claude -n wayfinder-b`, the same command: it said "Settlements in another currency" is already
claimed, so possibly another session is working on it, and claimed #47 instead (59 seconds). On GitHub, #45 and #47 each
have an assignee; #48 and #49 have none; #50 is still blocked.

**7. Answer them in turns.** A: `Yes, (a).` B: `Yes to all six.` (12 seconds). A's second round (24 seconds) asked to
widen four open tickets; we pasted `prompts/leave-the-lookup.txt`. B: `Yes to all five.`: it proposed its resolution
first (12 seconds). A closed #45, widened #48, #49 and #50, added its line and left #47 alone (48 seconds). B:
`Yes, post it.`: it closed #47, read the map again right before writing, and kept the line A had added meanwhile (39
seconds). `/exit` in A.

**8. Read the prototype skill.** In the shell:

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/prototype
sed -n '8p;12,15p' SKILL.md
clear
sed -n '18,20p;54p' UI.md
clear
sed -n '90p;94,96p' UI.md
```

**9. The prototype session, in its own worktree.** It writes code, so it gets a checkout of its own:

```bash
claude -w foreign-amount-ui
```

The header shows `~/potluck/.claude/worktrees/foreign-amount-ui`. Then `/wayfinder 41 50`, naming the ticket this time.
It claimed #50, loaded the `prototype` skill, read the forms, and built by itself for 14 minutes 39 seconds. A red
"Exit code 2" early on was a lookup that found nothing; it carried on.

**10. The map keeps moving.** While it built, window B: `claude -n wayfinder-c`, `/wayfinder 41`: it claimed #48 (53
seconds). `Yes to all six.`, then a written summary to confirm (7 seconds), `Yes, post it.`: #48 closed, plus a comment on
#50 so the edit form is covered too (30 seconds).

**11. The hand-over, and flipping the variants.** The prototype session gave a URL with `?variant=A` on the dev server in
its worktree, and three variants: A, quiet line; B, three linked fields; C, choose how it counts. `ui-prototype.md` has
what we tried in each. Its commit note: the pre-commit tests failed twice because the machine ran out of memory (test
workers killed, a different file each time), the full suite passed with two workers (196/196), and it committed the
throwaway branch with `--no-verify`. That is acceptable only because this branch never merges; on a real branch, fix the
test run first.

**12. The verdict.** Paste `prompts/verdict.txt` in the prototype session. 33 seconds: variant A recorded on #50, the
ticket closed, a map line added, B and C rejected with a reason each, and #48's line (added meanwhile) kept. The prototype
stays on `prototype/foreign-amount-ui`; the worktree's own branch has no changes.

**13. The last ticket.** Window B: `claude -n wayfinder-d`, `/wayfinder 41`: "Frontier is one ticket", it claimed #49 (1
minute). `Yes to all six.`: #49 closed (42 seconds), all eight tickets closed, only "Writing the spec" left. It asks
whether to write the spec in a fresh session: leave it unanswered (the grey text in the prompt is only a suggestion);
lesson 9.3 starts there.

**14. Close up.** `/exit` in D. `/exit` in the prototype session asks to keep or remove the worktree and says the branch is
kept either way; choose "Remove worktree" (the dev server ends with it).

**15. Check from the shell.**

```bash
clear
git fetch -q
git ls-remote origin 'prototype/*'
gh pr list
git log --oneline -1 origin/main
```

On camera: `prototype/foreign-amount-ui` (`545685e`) next to lesson 4.2's `prototype/balances`; "no open pull requests";
`2ce5739`, tagged `lesson-9.1` and `lesson-8.3`: `main` never moved.

The video trims the waits; the narration says how long each one took.

## Pause and try

Take your own map from lesson 9.1. Open a fresh session and run `/wayfinder` with your map's number and no ticket. Answer
its rounds and let it record the resolution. Check GitHub, then stop, and take the next ticket in a new session.

**Checkpoint (it's working if):** the ticket was assigned before any question; it closed with a resolution comment; the
map's Decisions so far has one new line that links to it; anything the answer made specific left "Not yet specified" and
became a ticket with its blocking wired; no production code changed; and the next session started from the tracker, not
from your chat.

## If something goes differently

- **Plain `/wayfinder` isn't found.** Type the plugin's full name, `/mattpocock-skills:wayfinder`.
- **It picks a different ticket than you expected.** It takes the first frontier ticket that nobody has claimed. Name a
  ticket after the map's number (`/wayfinder 41 50`) to choose it yourself.
- **Two sessions claim the same ticket.** A claim is an assignment, so it only works if each session reads the tracker
  before it starts. Start the second session after the first one's `gh issue edit --add-assignee` has run.
- **The session edits files in the repo mid-map** (a glossary, a spec). Say so and ask it to undo the edit; the answer
  belongs in the resolution comment until the spec is written.
- **Your resolution differs from ours.** Expected: your answers decide it. What should match is the shape: a claim, a
  resolution comment, a closed ticket, one map line.
- **The prototype's pre-commit hook fails for reasons unrelated to the prototype.** A throwaway branch may skip it, as on
  camera, if you say so plainly. Never on a branch that will merge.
- **The variant bar shows up in a production build.** It shouldn't: the skill gates it on the production check. Look for
  that check before you push anything.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`), and the dev server opens in your Windows browser at the same `localhost` address.
The commands are the same on macOS and Linux. A new terminal window is Ctrl+Shift+N in the Ubuntu terminal; on macOS's
Terminal it is Cmd+N; a new tab works just as well.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-9.2` points at
`2ce5739`, the same commit as `lesson-9.1` and `lesson-8.3`: this lesson changed no code on `main`. The prototype lives on
the branch `prototype/foreign-amount-ui` (`545685e`), never merged. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-9.2.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera every
  session ran on Opus 5.5; the grilling sessions stayed around 50k to 65k tokens of context, the prototype session reached
  about 150k.
- `gh`, git, GitHub issues with sub-issues and dependencies, GitHub Actions on a public repository, the skills (open
  source, MIT License) and the Frankfurter rate service are free.
- The pushed prototype branch got a Vercel preview, as set up in lesson 6.2 (Vercel's free Hobby plan is for
  non-commercial use). Neon isn't used in this lesson.

## Credits

The `wayfinder`, `grilling`, `domain-modeling` and `prototype` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. They are described here in
our own words; `wayfinder-work.md` and `ui-prototype.md` paraphrase how the skills work through a map and build a UI
prototype. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

```text
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
