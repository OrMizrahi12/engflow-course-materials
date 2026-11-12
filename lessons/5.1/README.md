# Student kit: Lesson 5.1, Tests, seams and modules in plain words

The spec in lesson 5.2 will ask you to judge three things: its seams, its modules and what makes a good test. This lesson
shows those words working on Potluck's real balance logic, in a throwaway folder. A fresh Claude Code session lifts the
prototype's logic into its own file and writes four tests of one case (Ana pays $10.00 for Ana, Ben and Cai), chosen on
purpose. A planted bug (the leftover cent is never handed out) is caught by only one of the four; a harmless tidy-up that
changes nothing a user can see breaks two of them. Then the four get their names (good, coupled to the code, side channel,
tautological), the good one is kept, and the same drill shows a seam, where mocks belong and why Potluck's balance engine
should be a deep module. Nothing goes into the Potluck repository in this lesson.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `potluck-at-lesson-5.1.md` | what the Potluck repository holds at the tag `lesson-5.1` (nothing changed) |
| `drill/at-commit/potluck-logic.js` | the prototype's logic block lifted into a module (lines 77 to 495 plus one export line), as committed in the drill |
| `drill/at-commit/odd-cent.test.js` | the four tests of one case, as committed in the drill |
| `drill/at-end/potluck-logic.js` | the module after the harmless tidy-up (`computeShares` returns only `{ shares }`; the ledger keeps only each balance) |
| `drill/at-end/odd-cent.test.js` | the one test kept: "the balances add up to zero" |
| `tests-and-seams.md` | the card: a good test and the three bad kinds, seams, mocks at the edge |
| `deep-modules.md` | the card: deep and shallow modules, the interface, the deletion test, the three questions |

The cards are also in `cards/` in the course materials.

## Before you start

- Node 24 from lesson 2.1 (`node --version`). Its built-in test runner, `node --test`, needs nothing installed.
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera).
- The prototype from lesson 4.2. If you don't have `~/potluck-prototype`, take it from your clone of Potluck (below).
- On camera Claude Code ran in auto mode. In default mode you approve each command and each file the session writes.

## The steps, as on camera (Ubuntu)

**1. What the spec will ask.** The planning session from lessons 3.1 to 4.2 stays open and untouched. In the lesson
terminal, paste the `grep` of the installed `to-spec/SKILL.md` (in `prompts.md`). Line 15: sketch out the seams at which
you'll test the feature, use the highest seam possible, "the ideal number is one". Line 17: check with the user that these
seams match their expectations. Lines 47 and 48: the modules and their interfaces. Line 63: what makes a good test.

**2. A throwaway folder and a fresh session.** In a second window: `mkdir ~/test-drill`, copy the prototype into it,
`cd ~/test-drill`, `ls`, `claude -n drill`, and trust the new folder.

**3. Lift the logic.** Paste the first request. Claude copies the prototype's logic block, unchanged, into
`potluck-logic.js` with `export { Potluck };` at the end, checks the copy is identical and that Node imports it (22 members).

**4. Four tests.** Paste the second request: four tests of one case, each named after what it checks. Claude writes
`odd-cent.test.js` and doesn't run it.

**5. Read and run them yourself.** In the lesson terminal: `cd ~/test-drill`, `cat odd-cent.test.js`, `node --test`. Four
green ticks. Claude writes; you check.

**6. Plant a bug.** Paste the third request: commit, then delete the line that hands out the leftover cents, without
running or guessing the tests. In the lesson terminal: `git log --format="%h %an %s"` (check who authored the commit:
on camera the reply's claim about it was wrong), `git diff` (one red line), `node --test`. Only "the balances add up to
zero" fails: `1 !== 0`.

**7. A harmless tidy-up.** Paste the fourth request: undo the bug, then make `computeShares` return only the shares and the
ledger keep only each balance. `git diff --stat` (1 file, 15 lines), `node --test`: two tests fail, offset and paid
column, and nothing a user can see changed.

**8. The names.** `cd` into the plugin's skills folder and `grep` the tdd skill's notes (`prompts.md`). The good test
checks behavior through the public interface, and its expected answer comes from the spec. The offset test is coupled to
the code, the paid column checks through a side channel, and "Ana's balance equals 1000 minus her share as computeShares
reports it" is tautological: it can never fail.

**9. Keep the good one.** Type: `Delete every test except the balances one, then run it.` One test, one pass.

**10. Seams and mocks.** `grep` the prototype's two script blocks (the logic is "the liftable part"; the page "calls into
Potluck; nothing flows the other way"), the test file's `import` line, and the two seam definitions in the skills. Count
how often the logic touches the outside world (`0`), find the page's date, and read the first 14 lines of the tdd skill's
mocking notes.

**11. Deep modules.** `tail -8 potluck-logic.js` (22 exported names), the deep and shallow shapes and the principles in the
codebase-design skill, and "testing past the interface" in its deepening notes.

The video trims the waits; the narration says how long each one took.

## Pause and try

Make the same drill in your own folder: copy the prototype (from `~/potluck-prototype`, or with
`git -C ~/potluck show lesson-4.2:prototype/potluck-balances.PROTOTYPE.html > ~/test-drill/potluck-balances.PROTOTYPE.html`),
start Claude Code in `~/test-drill`, use the prompts from `prompts.md`, plant the bug, make the tidy-up and run
`node --test` after each step.

**Checkpoint (it's working if):** you can say which test told the truth both times, and why the other three didn't.

## If something goes differently

- **Claude runs the tests itself or guesses the results.** Run `node --test` in your own terminal anyway: your run is the
  evidence. Ask it again not to run or guess if you want the surprise.
- **Your file looks different.** Every session writes its own test file. Look for the four names; the setup may be longer
  or shorter.
- **The offset test fails at the start.** The offset is the hash of the expense id modulo the number of people. With the
  id `exp-1` it is 0, so it passed on camera; a different id can make it fail. That fragility is the lesson.
- **`git commit` asks who you are.** Set your git name and email once (lesson 2.1) or let Claude ask you.
- **`node --test` finds nothing.** Run it inside `~/test-drill`, where `odd-cent.test.js` is.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS use a second Terminal window (Cmd+N). The plugin path is the same on all three:
`~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/<version>/skills/engineering`.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-5.1` points at
`b7e1c03`, the same commit as `lesson-4.1`: this lesson changes nothing in it. The prototype is at the tag `lesson-4.2`.
Clone it to look or to start from here; don't fork it. `potluck-at-lesson-5.1.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the drill
  session made five short requests to Opus 5.5 and ended at 51.5k tokens of context; the planning session made none.
- Node's test runner, git and the skills are free (the skills are open source, MIT License).

## Credits

The `tdd`, `codebase-design` and `to-spec` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by
Matt Pocock, under the MIT License. They are described here in our own words, with short quotes of the installed 1.3.1
files. The drill files were written in the lesson from Potluck's prototype (lesson 4.2). This course is independent:
unofficial, and not affiliated with or endorsed by Matt Pocock.

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
