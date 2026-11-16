# Student kit: Lesson 9.1, /wayfinder: chart the map

Potluck version one is built and live, and every feature so far fit in one session: grill it, write a spec, split it into
tickets, build. Multi-currency trips don't. This lesson hands `/wayfinder` a loose idea that is too big for one session and
whose route you can't see yet. It settles a bounded destination first, then runs one breadth-first round over the whole
space, and charts a map on GitHub: one map issue (Destination, Notes, Decisions so far, Not yet specified, Out of scope)
and four decision tickets, wired with GitHub's own "blocked by" links. Two research tickets run as background agents and
push their findings to `research/*` branches with no pull request. The lesson ends with one ticket on the frontier and no
code changed.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `wayfinder.md` | the card: when to reach for `/wayfinder`, the map's five sections, ticket types, claim, native blocking, fog or ticket, the six steps, it's working if |
| `when-to-reach-for-wayfinder.md` | one page: `/wayfinder`, `/grill-with-docs` or straight to a spec |
| `what-the-map-created.md` | what the charting session created in our repository: labels, the map, the four tickets, the blocking, the two research branches |
| `potluck-at-lesson-9.1.md` | what the Potluck repository holds at the tag `lesson-9.1` (no code changed) and on GitHub after the lesson |
| `potluck/idea.txt` | the idea pasted after `/wayfinder `: one paragraph, no tickets, no answers |
| `potluck/answer-round-1.txt` | our answer to round 1 (the destination), with our one constraint |
| `potluck/answer-round-2.txt` | our answer to round 2 (scope and order): research other apps too, grill after both |
| `potluck/cleanup.txt` | the last instruction: remove the two research worktrees, keep the branches |
| `potluck/check-research.sh` | the shell commands that check what the research agents left behind |
| `potluck/frontier.sh` | the one-line frontier query: each sub-issue's state, open blockers and assignees |

The card is also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 8.3 (the tag `lesson-8.3`, `2ce5739`), with the tracker doc
  `docs/agents/issue-tracker.md` from lesson 3.2's setup. Its "Wayfinding operations" section tells the skill how to make a
  map, sub-issues, blocking links and claims with `gh`.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325), in auto mode. In default
  mode you approve each command as it comes.
- `gh` signed in to your GitHub account (lesson 2.1). Sub-issues and issue dependencies are GitHub features; on camera they
  were on for a public repository.
- Two terminals (or two tabs): one for Claude Code, and a shell of your own for checks.

## The steps, as on camera (Ubuntu)

**1. Where Potluck stands.** In the shell, from `~/potluck`:

```bash
gh issue list
```

What's left is small and fits one session each: suggested settlements over the cap (#31), real backups before launch
(#11), the dev log (#40). The new idea doesn't fit.

**2. What the skill is, from its own file.** In the shell:

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/wayfinder
ls
sed -n '1,13p' SKILL.md
```

The description says it plans a huge chunk of work as a map of decisions. `disable-model-invocation: true` means only you
start it; Claude never does. "Plan, don't do": a map session produces decisions, not deliverables. The plugin's version
folder may differ on your machine (`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).

```bash
clear
sed -n '19,25p;65,69p' SKILL.md
```

The map is a single issue in the repo's tracker, labelled `wayfinder:map`, and it is an index, not a store: the detail
lives in the tickets. Every ticket carries one `wayfinder:<type>` label, never a triage label. A session claims a ticket by
assigning it. Blocking uses the tracker's native dependency link. The frontier is the open, unblocked, unclaimed tickets.

```bash
clear
sed -n '73,80p' SKILL.md
clear
sed -n '82,91p' SKILL.md
clear
sed -n '103,116p' SKILL.md
cd ~/potluck
```

Ticket types: research (away from keyboard), prototype and grilling (human in the loop), task (either). The fog: the
map's "Not yet specified" section, deliberately incomplete. The test is whether you can state the question precisely now:
a ticket when the question is already sharp, fog when you can only name the area. Then the six steps of charting: name the
destination, map the frontier with one breadth-first round (no fog, no map: it stops and asks), create the map, create the
tickets and wire the blocking in a second pass, fire the research agents (each pushes its findings to a branch and opens
no pull request), stop. Never more than one ticket per session.

**3. Close the old session.** On camera the 8.3 leftovers session was still open, its work done. In it, type `/exit`.
Claude Code prints "Resume this session with: claude --resume …", so it can come back. Clear the screen.

**4. A fresh, named session.** In the Claude Code terminal, from `~/potluck`:

```bash
claude -n wayfinder
```

The name shows on the input box's border and in the terminal title. Type `/wayfinder`; the menu shows one row,
`/mattpocock-skills:wayfinder (wayfinder)`. A space, then paste `potluck/idea.txt` and press Enter. The idea names no
tickets and no answers; its last sentence is the one the skill needs: too big for one session, and the route isn't visible.

**5. Round 1: the destination.** It read the tracker doc, the domain notes and its memory, then loaded the plugin's
`grilling` and `domain-modeling` skills. The turn took 24 seconds. Round 1 covers only what the destination depends on, five
questions, each with a recommended answer:

1. What the map ends in: a spec issue written like "Spec: Potluck v1", ready to split into build tickets.
2. "Trip" vs "group": keep the glossary's word, group, and reopen its "one currency" definition.
3. One currency to settle in per group; per-member home currencies out of scope.
4. Existing groups keep working exactly as today.
5. Is an outside exchange-rate source allowed at all? Allowed, but it has to earn its place.

Paste `potluck/answer-round-1.txt`. "Yes to all" accepts the recommended answers; the extra constraint (free, no account)
comes from how Potluck runs: free tiers, no sign-up.

**6. Round 2: breadth first, then scope.** 31 seconds. It looked at the code first (the repo's files and every place the
word currency appears), then listed six candidate decisions: how conversion works (the core one), where rates come from,
settlements in another currency, rounding, what the entry form shows (a prototype later), and editing, changing the
group's currency and caps. Round 2 asks about scope only: foreign settlements in scope; the rate your bank actually charged
stays as one possible design; a currency no free source covers can use a typed-in rate; four things to out of scope; an
order (rate research now, in the background, the conversion grilling as the frontier). Paste `potluck/answer-round-2.txt`.

**7. The map is charted.** One turn of 1 minute 45 seconds (a time-lapse in the video): the five `wayfinder:*` labels (the
repo had none), the map #41, four child tickets #42 to #45, then a second pass that wires the blocking (#44 blocked by #42
and #43, #45 blocked by #44), then two research tickets started as background agents, each in its own worktree, and a
memory note pointing to the map. Four tickets out of six candidates; the rest stays fog on purpose.
`what-the-map-created.md` lists it all.

**8. Wait for the research.** The session is idle while the two agents work below the prompt, each with its own timer.
The first finished after 6 minutes 50 seconds, the second after 11 minutes 29 seconds; the whole turn, with the waiting,
took 13 minutes 12 seconds. Each agent claimed its ticket (assigned it) before any work, wrote one Markdown file of
findings, pushed it to a `research/*` branch, posted the answer as a comment, closed the ticket and added one line to the
map's "Decisions so far".

**9. Read the map on GitHub.** Open the map issue. Under the title, the sub-issue counter (on camera it turned from 1/4 to
2/4 while we watched). The only label is `wayfinder:map`. Then Destination, Notes (domain, glossary words, the skills for
grilling tickets, our standing constraints), Decisions so far (one line per resolved ticket, with a link), Not yet
specified, Out of scope, and the Sub-issues list. Open #44: label `wayfinder:grilling`, a body of one `## Question`, and
in its timeline "marked this as blocked by 2 issues". Open #45: right under the title, "Blocked by: How a foreign amount
becomes part of a balance". Open #42: closed, assigned (the claim), a resolution comment ending in a link to the findings
file on the branch, then "closed this as completed".

**10. Check the research from the shell.** In the shell, run `potluck/check-research.sh` one line at a time. Two remote
branches; one commit and one file each (145 and 129 lines in `docs/research/`); `gh pr list` says no open pull requests;
the head of the first findings file names the ticket it answers, then its answer: four sources are free and need no key.
Each push ran the repo's Check workflow and a Vercel preview, and both passed.

**11. The frontier.** In the shell, run `potluck/frontier.sh`:

```text
#42 closed blocked_by=0 assignees=1 Where exchange rates can come from
#43 closed blocked_by=0 assignees=1 How other apps handle more than one currency
#44 open blocked_by=0 assignees=0 How a foreign amount becomes part of a balance
#45 open blocked_by=1 assignees=0 Settlements in another currency
```

Open, nothing blocking, nobody assigned: #44 is the frontier, exactly one ticket. Lesson 9.2 starts there.

**12. Clean up and exit.** Back in the session, paste `potluck/cleanup.txt`. It listed the worktrees, read the setup
script to see what each one created, checked both were clean and matched GitHub, then removed them and dropped the two
local databases their setup had made (41 seconds). It also found six older agent databases from earlier lessons and offered
to drop them; the grey suggestion in the input box ("Drop those six too.") was left alone. Type `/exit`: the session
prints its resume line. No code changed; `main` is where lesson 8.3 left it.

The video trims the waits; the narration says how long each one took.

## Pause and try

Pick an idea of your own that won't fit in one session, or chart the same multi-currency idea in your Potluck clone. Run
`/wayfinder` with the idea, settle the destination, answer one breadth-first round, and stop when the map exists.

**Checkpoint (it's working if):** one `wayfinder:map` issue; its open tickets all read as questions; a "Blocked by" you can
see without opening the map; a "Not yet specified" list longer than the ticket list; nothing built. Let the research tickets
finish before you start lesson 9.2.

## If something goes differently

- **Plain `/wayfinder` isn't found.** Type the plugin's full name, `/mattpocock-skills:wayfinder`.
- **Your rounds differ from ours.** Expected: the questions depend on your idea and your repo. What should match is the
  order: the destination first, then one breadth-first round, then the map.
- **The breadth-first round finds no fog.** The skill stops and tells you the effort is small enough to skip the map: use
  `/grill-with-docs` and a spec instead.
- **No "Wayfinding operations" section in your tracker doc.** The skill needs it to know how your tracker does maps,
  sub-issues and blocking. Re-run the setup from lesson 3.2, or copy the section from the Potluck repository.
- **A research agent asks for permission** (a web page on a new domain, a push). Read what it wants. A push should only
  ever go to a `research/*` branch; `main` stays protected by the deny rules from lesson 6.3.
- **The research takes a while.** On camera about 7 and 11 minutes. The session is free while they run; don't start the
  frontier ticket in the same session.
- **A commit hook fails once in an agent's worktree.** On camera one test (`src/group/edit-settlements.test.ts`) failed in
  the hook and passed on a rerun; the agent reported it as a loose end.
- **The research worktrees are still on disk afterwards.** Their findings are safe on the pushed branches; ask the session
  to remove the worktrees and keep the branches, as in step 12.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. GitHub pages open in any browser.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-9.1` points at
`2ce5739`, the same commit as `lesson-8.3`: this lesson changed no code. The map and its tickets are issues #41 to #45.
Clone it to look or to start from here; don't fork it. `potluck-at-lesson-9.1.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera every turn
  ran on Opus 5.5, including the two research agents; the charting session reached about 65k tokens of context when the
  map was done and about 79k at the end.
- `gh`, git, GitHub issues, sub-issues and dependencies on a public repository, GitHub Actions on a public repository and
  the skills (open source, MIT License) are free. The rate sources the research found are free and need no key.
- Each pushed research branch got a Vercel preview, as set up in lesson 6.2 (Vercel's free Hobby plan is for
  non-commercial use).

## Credits

The `wayfinder`, `grilling`, `domain-modeling` and `research` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. They are described here in
our own words; `wayfinder.md` paraphrases how `/wayfinder` charts a map. This course is independent: unofficial, and not
affiliated with or endorsed by Matt Pocock.

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
