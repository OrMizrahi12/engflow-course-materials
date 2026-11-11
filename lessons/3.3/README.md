# Student kit: Lesson 3.3, /grill-with-docs

In this lesson the planning session moves into the repository and starts writing things down. You read the skill before
running it: `grill-with-docs` is one line that loads two skills, `grilling` (the interview from lesson 3.1) and
`domain-modeling` (which challenges the words and writes them down). You run `/grill-with-docs` with one opening line,
check that both skills loaded, and answer its rounds by number, including a few no's. Every settled word goes straight
into `GLOSSARY.md`; only the decisions that pass three tests become ADRs in `docs/adr/`. A fact Claude looked up from the
vendors' own docs changes one decision on the way. You read the files on disk, add an MIT license, commit, look, and only
then push.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `potluck-at-lesson-3.3.md` | what the Potluck repository holds at the tag `lesson-3.3`, and how to start from it |
| `potluck/GLOSSARY.md` | Potluck's glossary as written in the lesson (43 lines) |
| `potluck/docs/adr/0001-host-on-vercel-hobby.md` | ADR 0001: host on Vercel's Hobby plan, which forbids commercial use |
| `potluck/docs/adr/0002-postgres-on-neon-free.md` | ADR 0002: Postgres on Neon's free plan |
| `potluck/docs/adr/0003-per-pr-database-copies.md` | ADR 0003: a database copy per pull request, production on the root branch |
| `potluck/LICENSE` | the MIT license added in the lesson |
| `grill-with-docs.md` | the card for `/grill-with-docs` |
| `glossary-and-adr.md` | the card for the two kinds of file it writes |

The cards are also in `cards/` in the course materials.

## Before you start

- The `planning` session from lessons 3.1 and 3.2, still open in `~/potluck`. If you closed it,
  `cd ~/potluck && claude --resume` and pick `planning`.
- A repository with the setup from lesson 3.2 (`CLAUDE.md` with an `## Agent skills` block, `docs/agents/`).
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera). `/skills` lists
  `mattpocock-skills:grill-with-docs`, `mattpocock-skills:grilling` and `mattpocock-skills:domain-modeling`.
- On camera Claude Code ran in auto mode, so no permission prompts appeared. In default mode you approve each command.

## The steps, as on camera (Ubuntu)

**1. Read the skill first.** In the lesson terminal (still in the setup skill's folder from lesson 3.2), clear the screen,
then `cd ../grill-with-docs`, `ls` and `cat SKILL.md`. The folder holds `SKILL.md` and an `agents` folder (a small
settings file for other agent tools). The description: a relentless interview to sharpen a plan or design, which also
creates docs (ADRs and a glossary) as you go. `disable-model-invocation: true`: Claude never starts it by itself; you type
it. The body is one line: call the Skill tool twice, for `grilling` and `domain-modeling`.

**2. Read the new half.** `cd ../domain-modeling`, `ls` (`ADR-FORMAT.md`, `GLOSSARY-FORMAT.md`, `SKILL.md`, `agents`),
`cat SKILL.md`. What to notice: it is the *active* discipline (challenge terms, invent edge-case scenarios, write things
down the moment they are settled); files are created lazily (no glossary before the first settled term, no `docs/adr/`
before the first ADR); three habits during the session (challenge against the glossary, sharpen fuzzy language, discuss
concrete scenarios); the glossary is updated inline and holds no implementation details; ADRs are offered sparingly,
only when a decision passes all three tests (see `glossary-and-adr.md`).

**3. Start it, with one opening line.** In the planning session type `/grill-with-docs`, pick it from the menu, add a
space and the opening line (written beforehand and pasted; the full text is in `prompts.md`): the words for the money
(expense, share, balance, settlement, payment), where Potluck runs and how a change gets to production, the leaning
(Next.js on Vercel's free plan, Postgres on Neon's free plan), and "The odd cent stays parked."

**4. Check that both skills loaded.** The transcript shows two Skill lines, `grilling` then `domain-modeling`, each with
"Successfully loaded skill". If you see only one, ask "Which skills did you load?" and type `/domain-modeling` yourself.

**5. Facts are Claude's job.** Claude read the two format files and the repo, then started a background agent ("Research
Vercel Hobby and Neon free limits") and asked the questions that don't depend on those facts first: the words. Round one:
Q1 Expense to Q6 Suggested settlement, each with a recommended answer and the words to avoid, and one clash to settle,
settlement versus payment ("payment" blurs with paying for an expense). When the research came back (Vercel Hobby is
non-commercial only and pauses rather than bills; Neon Free has 1 GB, 10 branches and sleeps after 5 idle minutes), the
stack questions joined the same round: Q7 Hosting to Q14 the address. On camera the whole turn took about two and a half
minutes.

**6. Answer by number.** One line, written after reading the round (full text in `prompts.md`): mostly yes, settlement is
the word and payment is out, add group and member now, and a no to Q11: each pull request gets its own database copy,
made from a seeded development branch and deleted after merge. Claude wrote `GLOSSARY.md` (43 lines) and two ADRs
(0001 hosting on Vercel Hobby, 0002 Postgres on Neon Free), then round two (Q15 to Q21).

**7. Read the glossary on disk.** In the lesson terminal: `cd ~/potluck`, `ls`, `cat GLOSSARY.md`. One sentence about
Potluck, then People (Group, Member) and Money (Expense, Payer, Participant, Share, Balance with its sign, Settlement,
Suggested settlement). Each term is bold, with a definition and an `_Avoid_` line. No code anywhere.

**8. Second answers, and a no to an ADR.** Pasted line two: development becomes Neon's default branch, a no to Q18
(Postgres 18 installed on the machine), yes to ADR 0003, no to ADR 0004 ("we can change that rule any day, so it goes in
the spec": it fails the first test), and the wrap-up line from lesson 3.1. Claude wrote ADR 0003 and started a second
background agent to check version facts. On camera this turn took about four minutes.

**9. A fact changes a decision.** Q22: Neon Free has no protected branches, and any branch with a parent can be reset
from that parent. With production as a child of development, one wrong click would replace real data with seed data. So
production stays on Neon's root branch. Then Q23 to Q25 (Postgres 18 everywhere, Node 24 pinned, Playwright against each
pull request's own preview). Typed: `Yes to all four. Update ADR 0003, then sum up.` The summary lists the words, where
Potluck runs (ADRs 0001 to 0003), how a change reaches production (for the spec, not an ADR), other settings, and "Still
parked": the odd cent and real backups.

**10. Look before you commit.** In the lesson terminal: `git status` (two untracked entries, `GLOSSARY.md` and `docs/adr/`),
`ls docs/adr` (three files), `cat` ADR 0001 and ADR 0003.

**11. License, commit, look, push.** Without a license the code is all rights reserved: nobody who clones it may reuse it.
Typed: `Yes. Add an MIT license, then commit it all.` Claude added `LICENSE` ("Copyright (c) 2026" plus your git name; it
offers to change it) and made one commit, `3b3ad78` "Add glossary, stack ADRs and MIT license". Nothing is pushed until
you say so. After looking over the commit: `Push it.` → `12deed8..3b3ad78 main -> main`.

**12. Check on GitHub.** Refresh the repository page: the newest commit, three new entries (`docs`, `GLOSSARY.md`,
`LICENSE`) and an "MIT license" tab next to the README. Open `GLOSSARY.md`: GitHub renders it. The planning session stays
open for the next lesson.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your clone, or in any repository after the setup from lesson 3.2, type `/grill-with-docs` and one line: the words you
use, and your leaning for where it runs. Check for the two Skill lines, and answer a round by number with at least one no.

**Checkpoint (it's working if):** `GLOSSARY.md` changes during the session, holds only words, and challenges at least one
of yours, and every ADR you get passes all three tests.

## If something goes differently

- **Only one Skill line.** Ask "Which skills did you load?" and type `/domain-modeling`.
- **More or fewer rounds.** The number of rounds depends on your answers. On camera it was three rounds plus a wrap-up.
- **No background agent.** Claude may look the facts up in the main conversation instead; the order is the same: words
  first, facts before the stack.
- **An ADR you don't want.** Say no and give the failed test, as on camera with 0004. Rules you can change any day go in
  the spec.
- **Different limits.** Vercel and Neon change their free plans. The numbers here were checked on November 11, 2026; trust
  what Claude reads from their pages on your day.
- **The copyright line.** It uses your git name. Ask Claude to change it before you push if you want another name.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS the paths under `~/.claude` are the same. In the browser, F5 (Cmd+R on macOS)
reloads the page and Alt+Left (Cmd+[) goes back.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`, tag `lesson-3.3` (commit
`3b3ad78`). Clone it to look or to start from here; don't fork it. `potluck-at-lesson-3.3.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera this
  lesson was six requests to Opus 5.5 in the same session, with two background agents; the context went from 59.2k to
  93.0k tokens (9% of the window).
- Vercel Hobby and Neon Free cost nothing, with limits (see ADRs 0001 and 0002). Hobby is for non-commercial use only.
  Nothing was created on either service in this lesson.
- A GitHub account, `gh` and git are free. The skills are free and open source (MIT License).

## Credits

The `grill-with-docs`, `grilling` and `domain-modeling` skills are from [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock, under the MIT License. They are described here in our own words, with short quotes of the installed 1.3.1
files. The files in `potluck/` were written in the lesson. This course is independent: unofficial, and not affiliated
with or endorsed by Matt Pocock.

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
