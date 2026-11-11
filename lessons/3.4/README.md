# Student kit: Lesson 3.4, The project's language

In this lesson the glossary from lesson 3.3 gets put under pressure. You measure it first, then run `/domain-modeling`
on its own with one line that names no word and no case: finding them is the skill's job. Claude finds six places where
a word does two jobs and invents an edge case for each. One of its examples is wrong, and `/wait-what` gets it re-pitched
with the mistake admitted. You answer by number, ask whether anything needs an ADR (nothing passes the three tests), and
cut the glossary down to words only. It grows from 9 terms and 278 words to 10 and 327, then shrinks to 11 terms and 211
words, and every rule it loses is kept for the spec.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `potluck-at-lesson-3.4.md` | what the Potluck repository holds at the tag `lesson-3.4`, and how to start from it |
| `potluck/GLOSSARY.md` | Potluck's glossary after the cut (11 terms, 211 words) |
| `domain-modeling.md` | the card for `/domain-modeling` |
| `wait-what.md` | the card for `/wait-what` |

The cards are also in `cards/` in the course materials.

## Before you start

- The `planning` session from lessons 3.1 to 3.3, still open in `~/potluck`. If you closed it,
  `cd ~/potluck && claude --resume` and pick `planning`.
- A `GLOSSARY.md` from lesson 3.3 (or your own project's glossary).
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera). `/skills` lists
  `mattpocock-skills:domain-modeling` and `mattpocock-skills:wait-what`.
- On camera Claude Code ran in auto mode, so no permission prompts appeared. In default mode you approve each command.

## The steps, as on camera (Ubuntu)

**1. Measure first.** In the lesson terminal, in `~/potluck`: `grep -F '**' GLOSSARY.md` lists the terms (each one starts
with two asterisks): Group and Member, then Expense, Payer, Participant, Share, Balance, Settlement and Suggested
settlement. `wc -w GLOSSARY.md` gives the size: 278 words. Write both numbers down.

**2. Put the words under pressure.** In the planning session type `/domain-modeling`, pick it from the menu ("Build and
sharpen a project's domain model"), add a space and the line (full text in `prompts.md`). The line asks for words that do
two jobs and edge cases at the borders, and names no word: finding them is the skill's job.

**3. Read the round.** On camera Claude thought for about half a minute, used no tool (the glossary was already in the
conversation) and sent six questions, W1 to W6: settlement's "toward zero" clause (an overpayment, a loan), "settle up" as
an action and a state, the payer as the only participant, what "inactive" covers, "member" as an entry and as the person
holding the phone, and a repayment in another currency. Each has a recommended answer after the arrow, and the reply
ends with: rules that aren't definitions belong in the spec.

**4. Repair what didn't land.** W2's example didn't add up (Alice paying for a lunch can't bring her balance down to
zero). Typed: `/wait-what W2`. The re-pitch started with "W2, again. My first example was wrong", then gave the context
in the glossary's words, the two meanings side by side, a corrected example one short line per step, and the same
recommendation: "settled up" is only the state; the action is "record a settlement".

**5. Read the repair skill.** In the lesson terminal, paste the `cat` of the installed `wait-what/SKILL.md` (path in
`prompts.md`). Its description: "Stop. That last message did not land: re-pitch it." `disable-model-invocation: true`:
only you know when you stopped following. The body is one paragraph: re-pitch that, a little context, ASD-STE100
Simplified Technical English (short, plain sentences), and the ubiquitous language from `GLOSSARY.md`.

**6. Answer by number.** One line, written after reading the round (full text in `prompts.md`): all six yes, W2 with the
corrected example, W3 and W4 marked as rules for the spec. Claude edited `GLOSSARY.md` in place (7 lines in, 3 out),
summed up each change and held two rules for the spec: an expense needs a participant other than its payer, and an
inactive member still appears in the balances.

**7. Measure again.** The Up arrow brings back the `grep`: 10 terms (Settled up is new). `wc -w GLOSSARY.md`: 327 words.
Member and Settlement kept their names but changed their definitions, which the list can't show.

**8. Ask about an ADR.** Typed: `Does any of this need an ADR?` The answer: no, with each change checked against the three
tests (hard to reverse, surprising without context, a real trade-off). W6, one currency per group, came closest: several
currencies later means a migration, but one currency is the obvious default, so it isn't surprising.

**9. Cut to words only.** Typed: `Then cut GLOSSARY.md down to words only.` Claude rewrote the file (12 lines in, 8 out),
made Inactive member its own term, and listed the rules it took out of the definitions (how a balance is calculated, one
currency per group, a loan recorded as a settlement, the smallest set of suggested settlements and more): none dropped,
all kept in its notes for the spec.

**10. Check it on disk.** In the lesson terminal: `git status -sb` (one modified file), `git diff --stat` (15 insertions,
7 deletions), `git diff GLOSSARY.md` (minus lines are the old text, plus lines the new; Space for the next page, `q` to
quit), then `wc -w GLOSSARY.md`: 211 words, with 11 terms.

**11. Commit, look, push.** `Commit it.` → `183fe54` "Cut glossary to definitions only; add inactive member and settled
up", not pushed. Then `Push it.` → `3b3ad78..183fe54`. In the lesson terminal, `git log --oneline -4` and `git status -sb`:
in sync. The planning session stays open for the next lesson.

The video trims the waits; the narration says how long each one took.

## Pause and try

Note your glossary's word count first. Type `/domain-modeling` and ask it to find the words that do two jobs, with an
edge case each. Answer by number, with at least one no. Use `/wait-what` on the reply you followed least. Ask whether
anything needs an ADR, then ask it to cut the glossary down to words only, and count again.

**Checkpoint (it's working if):** the file changed while you talked, every ADR you were offered passed all three tests,
and your last count isn't your biggest.

## If something goes differently

- **Different questions.** The skill invents its own edge cases, so your round will differ, and the labels may be numbers
  or letters. Answer by whatever label it uses.
- **Every example adds up.** Use `/wait-what` on the reply you followed least anyway; a good re-pitch adds the premise,
  not only fewer words.
- **It offers an ADR.** Check the three tests yourself. A rule you can change in one pull request goes in the spec.
- **The glossary didn't shrink.** Ask again, more directly: definitions only, no rules, no implementation details.
- **No glossary yet.** `/domain-modeling` can start one, but on an existing project `/grill-with-docs` (lesson 3.3) builds
  it faster.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS the paths under `~/.claude` are the same.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`, tag `lesson-3.4` (commit
`183fe54`). Clone it to look or to start from here; don't fork it. `potluck-at-lesson-3.4.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera this
  lesson was seven requests to Opus 5.5 in the same session, with no background agents; the context went from 93.0k to
  106.7k tokens (11% of the window).
- A GitHub account, `gh` and git are free. The skills are free and open source (MIT License).

## Credits

The `domain-modeling` and `wait-what` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt
Pocock, under the MIT License. They are described here in our own words, with short quotes of the installed 1.3.1 files.
The file in `potluck/` was written in the lesson. This course is independent: unofficial, and not affiliated with or
endorsed by Matt Pocock.

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
