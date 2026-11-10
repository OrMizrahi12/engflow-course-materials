# Student kit: Lesson 3.1, /grill-me: get interviewed about your idea

In this lesson Claude interviews you about an idea before anything is built. `/grill-me` hands its work to the
`grilling` skill: Claude keeps a design tree of decisions and asks in rounds. Each round is the frontier, every
decision whose prerequisites are already settled, numbered, with a recommended answer you accept with "yes". You read
the skill file first, make an empty folder for Potluck, start a named session there, answer four rounds by number
(with "no", "I don't know" and "park it" where they fit), and end on a shared understanding you confirm, with nothing
written to disk. The repository comes in lesson 3.2, from this same session.

## Files in this kit

| File | What it is |
|---|---|
| `potluck-decisions.md` | the answers given on camera, round by round, and the agreed design Claude handed back, word for word |
| `grilling-prompts.md` | the lines used in the lesson (the idea, the scope line, the wrap-up line, the confirmation) and the ways to answer |
| `grilling.md` | the lesson's card |

The card is also `cards/grilling.md` in the course materials.

## Before you start

- Claude Code and the `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera). Check with `/skills`: it
  lists `mattpocock-skills:grill-me`.
- Plan mode off. Plan mode pushes Claude to produce a plan, and here you want it to keep asking questions.
- Your best model. On camera: Opus 5.5.

## The steps, as typed on camera (Ubuntu)

**1. A window for the interview.** The terminal from lesson 2.4 stays as it is. Press Ctrl+Shift+N in it to open a
second window (in the Ubuntu terminal, Ctrl+Shift+N opens a new window; any new terminal window works), and make it full
screen.

**2. Read the skill first.** Paste:

```bash
cat ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/productivity/grilling/SKILL.md
```

If your plugin version is newer, change `1.3.1` to the folder you have (`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).
The file is longer than one screen, so scroll up to its top. What it says, in short:

- interview until you reach a shared understanding, mapped as a design tree;
- work the tree in rounds; the frontier is every decision whose prerequisites are settled; ask the whole frontier in one
  round, number each question, give a recommended answer, then wait;
- the format: `❓ **Q1** - **title**: question`, then `➡️ recommended answer`;
- word each question so "yes" accepts the recommendation;
- finding facts is Claude's job (with a sub-agent when needed), the decisions are yours;
- done when the frontier is empty; nothing happens until you confirm a shared understanding.

**3. An empty folder.** Press Ctrl+L to clear the screen, then type:

```bash
mkdir ~/potluck && cd ~/potluck
ls -a
```

On camera `ls -a` printed only `.  ..`: the folder is empty. `/grill-me` needs no files and no repository.

**4. A named session.**

```bash
claude -n planning
```

`-n` names the session, so you can find it again later (`/resume`). This conversation stays open for the next lessons.
A new folder brings the trust question from lesson 2.2: "Yes, I trust this folder" (Down, then Enter). On camera the
header showed Opus 5.5 and `~/potluck`, and the prompt box was labelled `planning`.

**5. Start the grilling.** Type `/grill-me`. The menu shows `/mattpocock-skills:grill-me` ("A relentless interview to
sharpen a plan or design.") and `/mattpocock-skills:grill-with-docs` (lesson 3.3). Take `grill-me`, add a space and
paste one sentence:

```text
/grill-me Potluck: a web app where a group splits shared expenses: who paid what, and who owes whom.
```

Press Enter. On camera Claude loaded the `grilling` skill, listed the folder by itself (a fact it can check), said "The
project directory is empty, so we're starting from scratch", and asked round 1: seven numbered questions, each with a
recommendation. The footer said "Sautéed for 20s". Your questions will differ: it is a real conversation.

**6. Answer a round in one line, by number.** Read the round, then answer every question by its number: `yes` accepts
the recommendation, `no` with a reason pushes back, `I don't know` asks for the trade-offs, `park it` leaves a decision
open on purpose. Add a scope line for anything you don't want decided today. Keep it on one line: a multi-line paste
shows up as one `[Pasted text]` chip. The round 1 answer on camera:

```text
1 No: a public app. Real people on the internet create their own groups, and it runs on free tiers. 2 I don't know. What does each option cost? 3 No: equal split among a chosen subset only, exact amounts later. 4 Yes. 5 Yes. 6 Yes. 7 Yes. Host and stack: not today, we pick those later.
```

Claude acknowledged the scope line ("You said not to decide host and stack today, so I've parked those"), answered the
"I don't know" with the cost of each option, and asked round 2 (questions 8 to 13). Question 9, identity and accounts,
came only now, because it depends on "public". The answers to rounds 2 and 3 are in `potluck-decisions.md`.

**7. Wrap up.** After round 3 the answer line ended with:

```text
Now wrap up: ask only what is still open for the first version.
```

Claude replied "This is the last round" and asked six last questions. Typed answer:

```text
23 yes, 24 yes, 25 yes, 26 yes, 27 yes, 28 yes
```

**8. The shared understanding.** Claude handed back "Potluck v1: the agreed design" (product, groups and access, members,
expenses and settlements, balances, safety and privacy, deferred, and two items still open: the odd cent and host and
stack), ending "Do we have a shared understanding?" Typed answer:

```text
Yes, it matches. Write nothing yet: the repo comes first.
```

Reply: "Okay, I'll hold off writing anything until the repo exists." The folder is still empty. Leave this session
open: lesson 3.2 creates the repository from it.

On camera the whole interview was 28 questions in 4 rounds, and Claude's own footer timed each reply at 20, 27, 24, 17,
11 and 2 seconds. The video trims these waits.

## Pause and try

Make an empty folder, start Claude Code in it, and type `/grill-me` with one sentence about an idea (Potluck or your
own). Answer the first round in one line, by number, with at least one "no" and a reason, and one "I don't know". Stop
when it asks you to confirm.

**Checkpoint (it's working if):** you disagreed at least once, the next round built on your answers, and you could
defend each decision to someone who wasn't there.

## If something goes differently

- **Claude starts researching or picking a host or a framework.** Say "not today" for anything outside the scope you
  want (on a practice run without the scope line, Claude started a hosting study by itself).
- **The rounds never end.** Count rounds, not questions. Tell it to wrap up; if it is still huge, the idea is too big:
  ask it to split the work first.
- **You'd rather get one question at a time.** The skill's docs suggest one line in your global `CLAUDE.md`:
  `When grilling, ask one question at a time.` Without it, it asks whole rounds, as on camera.
- **It starts writing a spec or files after the summary.** Say "write nothing yet" in your confirmation, as on camera.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`); a new terminal window is Ctrl+Shift+N in Windows Terminal too. On macOS a new Terminal
window is Cmd+N; the paths under `~/.claude` are the same. Scroll back through a long reply with Shift+Page Up (or the
mouse wheel, depending on your terminal).

## Potluck repository

There is no Potluck repository yet: this lesson writes no files. Lesson 3.2 creates it from the same `planning` session,
in the same `~/potluck` folder. If you are joining here, `potluck-decisions.md` holds the decisions made on camera, so you
can start 3.2 from the same place.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. The grilling on
  camera was six turns of Opus 5.5; the context ended at 46.5k tokens (5% of the window).
- The skills are free and open source (MIT License).

## Credits

The `grill-me` and `grilling` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License; they are described here in our own words, with short quotes of the installed 1.3.1 files. This
course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
