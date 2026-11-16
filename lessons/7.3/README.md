# Student kit: Lesson 7.3, Writing for agents

Every Claude Code session in Potluck starts with two things already loaded: `CLAUDE.md`, and one line per skill, its
description. This lesson writes for that reader on purpose. With the `/writing-for-agents` skill as the reference, Claude
writes Potluck's own `verify` skill (how an agent checks a change in the running app and leaves screenshots a reviewer can
see), gives its last two steps a done-when, and prunes `CLAUDE.md` from 19 lines to pointers. Then both are tested in a fresh
session with plain requests that never name the skill or the files. The skill fires without being named and runs into a real
bug (the dev server reloads the page in a loop under `npm run dev`), which becomes issue #19. The second test reaches every
doc `CLAUDE.md` points at, but never the Next.js docs, because nothing points at `AGENTS.md`; that gap becomes the new first
line. The change lands by auto-merge as pull request #20, and `main` ends with an 8-line `CLAUDE.md` and a skill of its own.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/p1-verify-skill.txt` | after `/writing-for-agents`: write Potluck's own verify skill, and say whether the agent may reach it alone |
| `prompts/p2-done-whens-and-claude-md.txt` | after `/writing-for-agents`: done-whens for steps 5 and 6, then `CLAUDE.md` as pointers |
| `prompts/tp1-plain-check.txt` | test 1, in a fresh session: a plain request that never says "verify" |
| `prompts/tp2-ticket-route.txt` | test 2, same session: how would you take ticket #4 to merged, and where do the rules live |
| `prompts/p3a-file-the-loop.txt` | in the test session: file the reload loop as its own issue |
| `prompts/p3b-add-the-pointer.txt` | in the author session: add the pointer the test missed |
| `prompts/p4-land.txt` | push it and land it the way `docs/agents/landing.md` says |
| `test-after-trimming.md` | how to test a skill and a pruned `CLAUDE.md` in a fresh session, and what to look for |
| `potluck-at-lesson-7.3.md` | what the Potluck repository holds at the tag `lesson-7.3`: the merge, the four commits, issue #19 |
| `potluck/CLAUDE.md` | `CLAUDE.md` at the tag: 8 lines, `## Agent skills` and six pointers |
| `potluck/skills/verify/SKILL.md` | the verify skill at the tag (in the repository it lives at `.claude/skills/verify/SKILL.md`) |
| `writing-for-agents.md` | the card: what goes in, what comes out, the two loads, the ladder, prune and test |

The card is also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 7.2 (both branches landed, `CLAUDE.md` at 19 lines, no `.claude/skills/` on
  `main`).
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325, Opus 5.5), in auto mode. In
  default mode you approve each command as it comes.
- Two terminals (or two tabs): the Claude Code session, and a shell of your own for checks. The tests use a third tab.
- Claude Code 2.1.325 and later ship a generic `/verify` of their own ("Try your change and report if it works"). A project
  skill named `verify` takes its place in that repository.

## The steps, as on camera (Ubuntu)

**1. What every session reads.** In the second terminal:

```bash
clear
cd ~/potluck
git show origin/main:CLAUDE.md
git show origin/main:CLAUDE.md | wc -l
git ls-tree --name-only origin/main .claude/
```

`## Agent skills`, the issue tracker, the triage labels (all five listed), the domain docs, landing a change, and one long
line about the dev server's log. Each section sums up a doc and then points to it, so the same rule lives in two places.
`19`, and `.claude/settings.json` only: no project skills yet.

**2. A fresh session for a new change.** The lesson 7.2 session's work was done (its footer offered `/clear`), so it was
closed with `/exit`. Then:

```bash
clear
cd ~/potluck
claude -w verify-skill
```

`-w` gives the change its own worktree and branch (`worktree-verify-skill`), starting from `main` on GitHub. Type `/verify`
without sending it: the row is Claude Code's own, "Try your change and report if it works". Delete it.

**3. Write the skill.** Type `/writing-for-agents`. The menu row is the skill's description ("Writing documents for agents.
Use when creating or editing skills, or modifying AGENTS.md or CLAUDE.md."). A space, then paste
`prompts/p1-verify-skill.txt`. The turn took 3 minutes 18 seconds: it read the skill's notes on writing skills, the
Playwright setup and pull request #16, found no dev log and no server in the main checkout, started its own server on port
3100 from the worktree, ran both browser tests, wrote `.claude/skills/verify/SKILL.md` and committed it (`3776bfa`).

**4. Its report.** Seven steps, each ending on a check the agent can see; two lessons from running the flow (port 3000 is the
wrong server for an agent in a worktree; a passing test can still show a broken page); and its call on the question left
open: model-invoked, because no one is there to type `/verify` when changes land by auto-merge, and Claude Code's built-in
run skill can only find a project skill that has a description. The price: one line of description in every session.

**5. Read the skill from outside.** In the second terminal:

```bash
cd .claude/worktrees/verify-skill/
git log --oneline -2
cd .claude/skills/verify/
head -4 SKILL.md
grep -n -E '^## |^Done when' SKILL.md
cd -
```

On camera both `cd` lines were typed with Tab completion. The description is the pointer: "Check a change in the running
Potluck app and commit screenshots a reviewer can see. Use when a change alters what a page shows or does, before its PR
opens, or when a PR's Evidence needs screenshots." The `grep` shows that steps 5 and 6 have no "Done when" line.

**6. Prune `CLAUDE.md`.** Back in the session, `/writing-for-agents` again, a space, then paste
`prompts/p2-done-whens-and-claude-md.txt`. The turn took 2 minutes 56 seconds. Claude Code refused one git command that was
too complex to prove it stays inside the worktree, so the session split it into plain ones. Two commits: `7f6326d` (the two
done-whens; step 6's check is a `curl` on every image link, tried on pull request #16's body: all four answered 200) and
`ed24dab` (`CLAUDE.md` as five pointers, each starting with its leading word, the phrase the installed skills already use for
that material). It removed the label list and the landing summary (both already in their own docs), gave the verify skill no
line (its description does that job), and left one decision: a sixth line pointing at Next's `AGENTS.md`. We held it back
until a test shows it is needed.

**7. Check it from outside.** In the second terminal:

```bash
git log --oneline -3
git diff --stat HEAD~1
cat CLAUDE.md
wc -l CLAUDE.md
```

`1 file changed, 5 insertions(+), 17 deletions(-)` and `7 CLAUDE.md`.

**8. Test 1: does the skill fire by itself?** Open a new tab in the same worktree (`Ctrl+Shift+T` in most Linux terminals) and
start a fresh session there with `claude`. Type `/verify` without sending it: the row now shows our description, so the
project skill took the name. Delete it, paste `prompts/tp1-plain-check.txt` (it never says "verify") and send. The first
line of the work: `Skill(verify)`, "Successfully loaded skill". It started its own server on 3100, ran the existing browser
test, and both runs failed: the page reloaded itself 24 times and the log showed a recompile after almost every page load. A
plain `curl` didn't set it off; with `next dev` run directly, without the logging wrapper, the same test passed on desktop and
phone with zero recompiles. Its best guess, said as unconfirmed: the log is written inside the project, where the file
watcher sees it. 2 minutes 55 seconds; nothing committed.

**9. Test 2: do the pointers lead to the rules?** Same session, paste `prompts/tp2-ticket-route.txt`. 20 seconds. Nine steps
from ticket to merge, each naming the file whose rules it follows: the issue tracker doc, `GLOSSARY.md` and the ADRs through
`docs/agents/domain.md`, a worktree per change from `landing.md`, the verify skill's way of checking, and the migration rule
(ticket #4 adds a file under `drizzle/`, so a person merges it). Unasked, it put the reload loop first, as its own change. It
never opened the Next.js docs.

**10. Two findings, two fixes.** The reload loop is a bug in the app: in the test session, paste
`prompts/p3a-file-the-loop.txt`. 28 seconds: issue #19, labeled `needs-triage`, with what happens, what narrows it down, the
suspected cause (marked unconfirmed, with how to check it), three fixes to weigh, why it matters, a done-when, and no machine
paths, server addresses or group links. The missing pointer is a change to the document: in the author session, paste
`prompts/p3b-add-the-pointer.txt`. 32 seconds: a new first line, `**Next.js**: this version breaks from your training. Read
AGENTS.md before writing code that touches Next.` (`960f575`). It points instead of copying, because `next dev` rewrites that
block itself; it goes first because almost every coding session needs it; and it is untested in a fresh session.

**11. Land it.** Type `prompts/p4-land.txt` (one sentence: the landing doc holds the procedure). 2 minutes 48 seconds: the
diff against `main` (2 files, no migration), push, the PR body written with the plugin's `pr` skill, pull request #20, a
second check that nothing changed under `drizzle/`, auto-merge queued, a background wait for the required check, merged
(`7c3f5d2`), then Vercel's status on the merge commit: pending, then success. The PR's Evidence section says plainly that
the Next.js pointer and steps 5 and 6 haven't run on a real change yet.

**12. Check main.** In the second terminal:

```bash
git fetch -q
git log --oneline -3 origin/main
git show origin/main:CLAUDE.md | wc -l
git ls-tree --name-only origin/main .claude/skills/
```

The merge of #20, the pointer commit below it, `8`, and `.claude/skills/verify`.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own Potluck clone: run `/writing-for-agents` and ask for your own verify skill. Read its description as a pointer:
what would make it fire? Then prune your `CLAUDE.md` and test both in a fresh session with a plain request that never names
the skill. Write down one thing it found and one thing it didn't.

**Checkpoint (it's working if):** a fresh session loads your skill from a plain request; every step of the skill ends on a
done-when; every file `CLAUDE.md` used to cover is still reachable through a pointer; each rule lives in one place; and you
can name one thing the test reached and one it missed.

## If something goes differently

- **Plain `/writing-for-agents` isn't found.** Type the plugin's full name, `/mattpocock-skills:writing-for-agents`.
- **Your skill differs from ours.** Expected: the reply depends on your repo and its state. What should match is the shape:
  a description that says when to use it, steps that each end on a done-when.
- **The fresh session doesn't load the skill.** Read the description again: does a plain request about a page change match
  its "Use when"? Fix the description, not the request.
- **`/verify` still shows Claude Code's own row.** The project skill must be in the session's working folder:
  `.claude/skills/verify/SKILL.md` in the worktree you started `claude` from.
- **Your browser test passes and nothing reloads.** Good: the loop on camera was real but depends on where the dev server's
  log is written and what the watcher sees. Issue #19 tracks it.
- **A permission question about reading outside the working directories.** "Yes, but ask again next time" allows that one
  read and changes no setting.
- **A pull request carries a file under `drizzle/`.** `landing.md` says a migration waits for a person: no auto-merge.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. A new terminal tab is
`Ctrl+Shift+T` in most Linux terminals and in Windows Terminal, `Cmd+T` in the macOS Terminal.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-7.3` points at
`7c3f5d2`, the merge of pull request #20 on `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-7.3.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera every turn
  ran on Opus 5.5; the author session went from 0 to about 109k tokens of context, the test session to about 73k.
- Playwright, Node, npm, git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT License) are free.
- Vercel deployed the merge to production, as set up in lesson 6.2 (Vercel's free Hobby plan is for non-commercial use). The
  local database is the one from earlier lessons.

## Credits

The `writing-for-agents` and `pr` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. They are described here in our own words; `writing-for-agents.md` paraphrases the ideas the lesson
uses. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock. The verify skill and
`CLAUDE.md` in `potluck/` are Potluck's own files, written in the lesson.

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
