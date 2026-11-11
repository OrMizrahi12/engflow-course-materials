# Student kit: Lesson 4.1, /research and /to-questionnaire

Module 4 is a side door off grilling, for when the answer isn't in your head. This lesson closes one question parked
since lesson 3.1: when an equal split doesn't come out even, who pays the extra cent? `/research` hands that question to a
background agent of the same session, which reads primary sources and leaves one cited file in the repo while the
planning session stays free. You check the file, follow two of its links to the page that owns the claim, and make the
decision yourself. Then `/to-questionnaire` turns a question only another person can answer into a document for them:
it asks you two things about the send (who it goes to, what you need back) and nothing about the subject. The research
file is committed and pushed; the questionnaire stays local and out of git.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `potluck-at-lesson-4.1.md` | what the Potluck repository holds at the tag `lesson-4.1`, and how to start from it |
| `potluck/docs/research/odd-cent-rounding.md` | the research file as the agent wrote it (dated 2026-11-11, 12 sources) |
| `potluck/.gitignore` | the one-line `.gitignore` that keeps the questionnaire out of git |
| `questionnaire-template.md` | a blank questionnaire in the skill's structure, to fill in for your own question |
| `example-to-questionnaire-first-group.md` | the questionnaire from the lesson, as written (never sent, no answers) |
| `research.md` | the card for `/research` |
| `to-questionnaire.md` | the card for `/to-questionnaire` |

The cards are also in `cards/` in the course materials.

## Before you start

- The `planning` session from lessons 3.1 to 3.4, still open in `~/potluck`. If you closed it,
  `cd ~/potluck && claude --resume` and pick `planning`.
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera). `/skills` lists
  `mattpocock-skills:research` and `mattpocock-skills:to-questionnaire`.
- A second terminal in `~/potluck` (the lesson terminal) and a browser.
- On camera Claude Code ran in auto mode, so no permission prompts appeared. In default mode you approve each command,
  and the background agent asks too (for its web fetches and its shell commands).

## The steps, as on camera (Ubuntu)

**1. Read the research skill.** In the lesson terminal, paste the `cat` of the installed `research/SKILL.md` (path in
`prompts.md`). Its description: "Investigate a question against high-trust primary sources and capture the findings as a
Markdown file in the repo." The body is short: spin up a background agent so you keep working while it reads; its job is
(1) primary sources only, every claim followed back to the page that owns it, (2) one Markdown file citing each claim,
(3) saved where the repo already keeps such notes, or somewhere sensible, said out loud.

**2. Ask one narrow question.** In the planning session type `/research` and a space, then paste the question (full text
in `prompts.md`). It names the question, says where to look, and ends with two sentences that do most of the work: "Stop
when we can pick a rule." and "Cite only pages you opened." Claude thought for about 18 seconds, then showed
`Agent(Research odd-cent split rules)`, "Backgrounded agent", and its plan: the split code of two open-source apps
(Spliit, IHateMoney), the docs of three others (Splitwise, Tricount, Settle Up), three money libraries, the official ISO
4217 list. The repo had no notes folder, so the file would go to `docs/research/`.

**3. Watch the session stay free.** The prompt is empty and ready, "Waiting for 1 background agent to finish" sits above
it, and the footer shows the agent: what it is doing right now, how long it has run, its token count. You could keep
working in the same session. On camera I watched, because a narrow question shouldn't take long.

**4. The agent comes back.** After 4 minutes 25 seconds: "Agent "Research odd-cent split rules" finished · 4m 25s".
Claude read the file and reported in the same conversation: every source rounds each share down and hands the leftover
out one unit at a time; the money libraries (Ruby `money`, Dinero.js) give it to the first people on the list; Spliit
rotates the starting person, seeded by the expense; Splitwise said "random" in a 2018 forum reply; no source gives it to
the payer. Its recommendation: the Spliit rule. A second finding: the browser formats some currencies with different
decimals than ISO 4217 (the Hungarian forint, for one), with options (a) keep ISO decimals and always tell the formatter,
or (b) use the browser's data. It ended with a question: which rule, and (a) or (b)?

**5. Check the file.** In the lesson terminal: `git status -sb` shows `?? docs/research/` (untracked, nothing
committed). `grep -c 'https://' docs/research/odd-cent-rounding.md` counts the lines with a link: 12 (Tab completes the
file name). `cat` it and scroll to the top: a date ("Researched 2026-11-11"), the answer in one paragraph, a table of seven
candidate rules checked for three things (deterministic? stable when an expense is edited? fair over time?), and 12
sources at the bottom, most code links pinned to one exact commit.

**6. Follow two links.** In the browser, paste citation 3 narrowed to the lines about the leftover (`#L44-L49`): Spliit's
`src/lib/shares.ts` at commit `73478ed` with those lines highlighted. The comment says each share gets the floor, the
leftover goes out one by one, and ties rotate, "otherwise the same participants would absorb the extra unit every single
time". Then citation 8: ECMA-402 §16.5.1 CurrencyDigits, "implementation-defined", so a browser doesn't have to follow the
ISO list. Both links held.

**7. Decide.** Typed: `The Spliit rule, and (a). Both go in the spec.` (12 seconds). Claude updated its notes on the
design and wrote both rules out (shares rounded down, the leftover one each in a fixed order starting from a hash of the
expense's id; ISO decimals, the formatter always told how many, the currency picker leaves out the 13 codes with no minor
unit), then: "The odd cent is no longer open."

**8. A question only a person can answer.** Typed: `/to-questionnaire Questions for the first group that will use
Potluck.` (4 seconds). Its first question was about the send: "Who is it going to?", with four bullets (one person or the
whole group, how you know them, what kind of group, how technical).

**9. Answer one: who.** Pasted A1, written before recording (full text in `prompts.md`). Eight seconds later: "What do you
need back from them?" with nine candidates drawn from where version one assumes how a real group behaves.

**10. Answer two: what back.** Pasted A2, written after reading the list: keep 2, 4 and 7, cut the rest, add one (does a
rotating extra cent feel fair to them?), and most of all, do one currency per group and one payer per expense hold up.
In 32 seconds Claude wrote `to-questionnaire-first-group.md` (83 lines): four sections, most important first (trips and
other currencies, more than one payer, mistakes, the extra cent), 13 questions and a catch-all. It added two things to
sort out before sending: fill in the deadline, and don't commit the answered copy, because the repo is public.

**11. Keep it out of git.** Typed: `Add it to .gitignore.` (5 seconds): a new `.gitignore` with one line, the
questionnaire's file name. It offered `to-questionnaire-*.md` for later questionnaires; not taken.

**12. Why only two questions?** In the lesson terminal, paste the `cat` of the installed `to-questionnaire/SKILL.md`.
Description: "Turn a decision you can't fully answer into a questionnaire for someone else to fill in."
`disable-model-invocation: true`: it runs only when you type it. The rule: "Grill the send, not the subject." Step 1 who
it goes to, step 2 what you need back (one exchange each), step 3 writes `to-questionnaire-<slug>.md` in the current
folder from a template: purpose, how to answer, one idea per question, and a "why this matters" line only where a question
could be misread.

**13. Read the questionnaire.** `grep '^#' to-questionnaire-first-group.md` lists its headings: the title, Context, How to
answer, the four themes with their questions, Anything else? Then `cat` it from the top. It has not gone to anyone and
stays in the folder, outside git.

**14. Commit, push, look.** Typed: `Commit the research and the .gitignore.` → `b7e1c03` "Add odd-cent rounding research;
ignore the first-group questionnaire", the questionnaire stays out. `Push it.` → `183fe54..b7e1c03`. In the lesson
terminal, `git log --oneline -3` (our commit on top, `origin/main` at the same place) and `git status -sb` (clean, because
the questionnaire is ignored). The planning session stays open, at 12% of its context.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy of Potluck, or any repo, type `/research` with one narrow question that a decision of yours is waiting
on, a stopping point, and "cite only pages you opened". When the file arrives, follow two links to the page that owns the
claim, then decide. Then run `/to-questionnaire` for one person who knows something you don't.

**Checkpoint (it's working if):** your session stayed free while it read, the file links every claim, and the
questionnaire asked you nothing about the subject.

## If something goes differently

- **It is still reading after ten minutes.** The question is too broad. A broader version of this lesson's question ran
  for 13 minutes without writing a file. Narrow it to one question and add a stopping point ("stop when we can pick a
  rule").
- **The agent starts a second agent.** Nothing in the skill forbids it, and it can make a run long and costly. If the
  footer shows more than one agent and you didn't ask for that, stop it and ask again with "one agent, no sub-agents".
- **A link doesn't land on the claim.** Tell Claude which one and ask for the exact page or line range, or mark the claim
  as unverified. A link nobody opened proves nothing.
- **The file lands somewhere else.** The skill follows the repo's own convention for notes; if there is none it picks a
  place and says where. Move it if you want it elsewhere.
- **The questionnaire asks you about the subject.** Answer only who it goes to and what you need back; the questions in
  the document are for the other person.
- **Answers come back.** They go into a grilling round in the session (lesson 3.1), not straight into the code.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS the paths under `~/.claude` are the same. Any browser works for step 6.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`, tag `lesson-4.1` (commit
`b7e1c03`). Clone it to look or to start from here; don't fork it. `potluck-at-lesson-4.1.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the
  planning session made 16 requests to Opus 5.5 (its context went from 106.7k to 123.9k tokens, 12% of the window), and
  the background agent made 37 more of its own while it read. A background agent uses your plan like any other request.
- The pages it read are public. A GitHub account, `gh` and git are free. The skills are free and open source (MIT
  License).

## Credits

The `research` and `to-questionnaire` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt
Pocock, under the MIT License. They are described here in our own words, with short quotes of the installed 1.3.1 files.
`questionnaire-template.md` follows the structure of the skill's template. The research file, the `.gitignore` and the
example questionnaire were written in the lesson. This course is independent: unofficial, and not affiliated with or
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
