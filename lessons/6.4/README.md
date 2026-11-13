# Student kit: Lesson 6.4, /tdd live

The balance engine is the arithmetic at the heart of Potluck: who owes what, and who should pay whom. Tickets #4 and #6 both
need it, and ticket #3 (the group service they will call it from) isn't built yet. This lesson builds the engine test-first
with `/tdd`, in one Claude Code session in its own worktree. Claude proposes the seams first, each with what it catches and
what it misses, and waits; we pick one and overrule our own spec on the record. One slice at walking pace shows a red that
proves nothing (a missing file), so we make a rule: every red fails on a value. Six more slices follow, one commit each,
with expected values from published test vectors and the spec's worked examples. Then a removal check (take each line out,
run the tests) finds seven bits of code no test notices, all redundant; we leave them for the review, because the skill's
loop has no refactor step. We push, CI passes, and a comment on spec #1 records why the engine got its own seam. No pull
request yet: the review comes first.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/seams-request.txt` | the request after `/tdd`: what goes in and out, who will call it, propose the seams and wait |
| `prompts/seam-answer.txt` | our answer: seam A, kept, with the reasons; expected values from outside the code; one slice, then stop |
| `prompts/red-on-the-value.txt` | the rule for the rest: a red fails on the value; the slices to go; commit each green slice |
| `prompts/removal-check.txt` | the removal check: take each line or condition out, run the tests, show what no test notices |
| `prompts/leave-push-record.txt` | leave the seven, push and watch CI, comment on spec #1, no pull request |
| `slices-and-sources.md` | the seams as Claude proposed them, the seven slices with their reds, where each expected value comes from, the removal check's result |
| `potluck-at-lesson-6.4.md` | what the Potluck repository holds at the tag `lesson-6.4`: the branch, the seven commits, the spec comment |
| `potluck/src/money/group-money.ts` | the engine exactly as it is at the tag (seven redundant bits still in it, on purpose) |
| `potluck/src/money/group-money.test.ts` | its seven tests exactly as they are at the tag |
| `tdd.md` | the card: what `/tdd` takes in and gives back, the rules of the loop, when to use it, it's working if |
| `catch-untested-code.md` | the card: the removal check and the tautological test, two ways to check the tests themselves |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 6.3: `main` with the walking skeleton merged, spec #1 and tickets #3, #4 and #6
  open, signed in to GitHub with `gh`. The prototype branch `prototype/balances` from lesson 4.2 is on GitHub.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.323). On camera it ran in auto
  mode on Opus 5.5. In default mode you approve each command as it comes.
- Two terminals (or two tabs): one for the Claude Code session, one for your own checks.

## The steps, as on camera (Ubuntu)

**1. A worktree for the change.** In the first terminal, in your main checkout:

```bash
cd ~/potluck
claude -w balance-engine
```

The header shows the version, Opus 5.5 and the session's folder, `~/potluck/.claude/worktrees/balance-engine`, on a new
branch `worktree-balance-engine`.

**2. /tdd and the request.** Type `/tdd`. The menu shows one entry, `/mattpocock-skills:tdd (tdd)`: in this version the
short name works (in some versions only the full name is found). Add a space and paste `prompts/seams-request.txt`. On
camera the turn took 1 minute 7 seconds: it read the glossary and listed the decision records, read spec #1 and tickets #3,
#4 and #6 with `gh`, had one compound git command refused by the worktree guard (so it split it into plain commands), and
fetched the prototype branch to see how it hashes an expense id. Its reply opens with "I haven't written any tests yet",
then something to settle first: the spec puts the money core inside the group service, tested through it on PGlite, and #3
hasn't built that service. Then the interface it would test (one pure function, `computeGroupMoney`, every amount in whole
minor units), seams A, B and C with what each catches and misses, and three questions. It stops and waits.
`slices-and-sources.md` has the seams in our words.

**3. Our answer.** Paste `prompts/seam-answer.txt`: seam A, kept for good, because the engine is pure arithmetic and #3 only
blocks the service; the spec gets a note when this lands; expected values come from published vectors and the spec's
examples, never from the prototype's code; one slice, then stop. It wrote the first test (Ana pays 9,000 minor units for
herself, Ben and Cy, so each share is 3,000). The first run failed for the wrong reason: the new worktree had no
dependencies installed, so it ran `npm ci` and ran the test again. Red: the module didn't exist yet. Then 23 lines of code,
and `Tests 1 passed (1)`. Its report says so itself: that red failed on a missing file, not on a value.

**4. The rule, and the run.** Paste `prompts/red-on-the-value.txt`. (On camera the first try of this message stopped on an
API error, a yellow line in the session; we sent it again.) The turn took 4 minutes 58 seconds: it committed slice 1, and
the pre-commit hook from lesson 6.1 ran on every commit; then six more slices, each with a red on a value (where a test
needed a new field, it added it as an empty stub first, so the red is a wrong value and not a missing name), the least code,
green, and a commit. It also replaced `6000 - 3000` in a test input with the plain `3000`, so the test reads as data. Its
report: 7 green slices in 7 commits, nothing pushed, no pull request, the spec unchanged; a table of each commit and what
its red showed; where the expected values come from; the rules that ended up without a test of their own.

**5. Check it from outside the session.** In the second terminal:

```bash
cd ~/potluck/.claude/worktrees/balance-engine/
git log --oneline -8
npx vitest run src/money --reporter=verbose
grep -n -A2 "test vector\|Spec #1" src/money/group-money.test.ts
```

On camera the `cd` was typed as `cd .cl`, Tab, `w`, Tab, `b`, Tab from `~/potluck`. The log shows seven commits on top of
`a20746d (origin/main, main)`, the oldest "Split an expense evenly among its participants", the newest "Suggest settlements
by greedy matching". The verbose reporter lists the seven tests by name and `Tests 7 passed (7)`. The grep shows where the
numbers come from: the published FNV-1a test vectors (Go's `hash/fnv` tests) and spec #1's five-member example worked by
hand in a comment.

**6. The removal check.** Back in the session, paste `prompts/removal-check.txt`. (Its first try also stopped on an API
error; we sent it again.) The turn took 5 minutes 29 seconds: it wrote a small mutation script in its scratch folder,
outside the repository, which deletes one line at a time, then takes out one condition at a time, runs the tests after
each change and puts the file back. Each change is caught, doesn't parse, or survives. Then it checked that the engine was
back exactly as committed (`git status`, `Tests 7 passed (7)`). Seven changes survive, and none of them hides a missing
test: each one is redundant, so taking it out can't change a result. Everything else is caught on a value. It suggested one
more commit to remove the seven, and asked.

**7. The skill's own rules.** In the second terminal:

```bash
grep -A6 "## Rules of the loop" ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/tdd/SKILL.md
```

Three rules: red before green; one slice at a time; refactoring is not part of the loop, it belongs to the review stage.
The plugin's version folder may differ on your machine (`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).

**8. Leave them, push, record.** Paste `prompts/leave-push-record.txt`. It pushed the branch, found the CI run the push
started and watched it in the background, wrote the comment and posted it on spec #1 while CI ran, and reported. A few
seconds later the background watch finished and Claude picked that up by itself: CI passed on `aedf1b4` (Type-check, lint
and service tests, in 24 seconds). About 56 seconds from the message to green.

**9. The record on GitHub.** In the second terminal:

```bash
gh issue view 1 --comments
gh run list -L 2
```

The newest comment on spec #1: "Seam change: the money core is now a seam of its own.", why, and what stays where it was.
The top row of the run list is `worktree-balance-engine`, with its check passed. No pull request yet.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy, on a fresh worktree: run `/tdd` on the balance engine and ask for the seams, each with what it catches
and what it misses. Pick one, and say why. Make it show you one red that fails on the value, before any code. When the
slices are done, ask it to take each line out and tell you what no test notices.

**Checkpoint (it's working if):** no test exists until you've answered about the seams; every red after the first fails on
a value (a number, a list, an order), not on a missing name; `git log --oneline` shows one commit per slice; each expected
value in the test file can be traced to the spec or a published vector; and the removal check names every line no test
notices, with a reason for each.

## If something goes differently

- **Plain `/tdd` isn't found.** Type the plugin's full name, `/mattpocock-skills:tdd`.
- **The first test run fails because nothing is installed.** A new worktree has no `node_modules`; `npm ci` in it fixes
  that. A red caused by that says nothing about the code.
- **A red fails on a missing module or name.** It proves nothing about the value. Ask for an empty stub first, so the red
  is a wrong value.
- **A turn stops with an API error.** Send the same message again. If the session itself ends, `claude --resume` lists your
  sessions; a session started with `-w` is filed under the folder you launched it from, so start `claude --resume` there
  (or use the picker's view of all worktrees).
- **The worktree guard refuses a long shell command.** Claude Code couldn't prove the command stays inside the worktree;
  plain separate commands go through, and Claude usually splits them by itself.
- **Your removal check finds a real gap** (a line no test notices that does change a result). That's a missing test: ask
  for one test with its own red run, with the line taken out.
- **Your seams, slices or survivors differ from ours.** Expected: the reply depends on your spec and your answers. What
  should match is the shape: seams before tests, a red on a value, one commit per slice.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. Tab completion of the worktree path
works in bash and zsh alike.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-6.4` points at
`aedf1b4`, the tip of the branch `worktree-balance-engine` (not merged into `main`). Clone it to look or to start from here;
don't fork it. `potluck-at-lesson-6.4.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the one
  session ran on Opus 5.5; by the end of the lesson its context was about 108k tokens (11% of the window).
- Vitest, Node, npm, git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT License) are free.
- Vercel and Neon aren't used in this lesson. (Vercel's free Hobby plan is for non-commercial use.)

## Credits

The `tdd` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. It
is described here in our own words; `tdd.md` paraphrases its rules of the loop, and the engine and its tests were written by
the skill on camera. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
