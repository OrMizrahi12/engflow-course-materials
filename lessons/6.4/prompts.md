# Lesson 6.4: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. One Claude Code session does the
work, in its own worktree; a second terminal is ours, for checks from outside the session.

## 1. A worktree for the change (first terminal)

```bash
cd ~/potluck
claude -w balance-engine
```

The header: Claude Code v2.1.323, Opus 5.5 · Claude Ultra, `~/potluck/.claude/worktrees/balance-engine`; auto mode on.

## 2. /tdd and the request

Type `/tdd`. The menu shows one entry, `/mattpocock-skills:tdd (tdd)`. A space, then paste `prompts/seams-request.txt`:

```text
The balance engine for Potluck: a group's members, expenses and settlements go in; each expense's shares, every member's balance and the suggested settlements come out. Spec #1 has the rules and worked examples (Shares, Balances, Suggested settlements). Tickets #4 and #6 will call it from the group service, which #3 hasn't built yet. Before any test, propose the seams, each with what it catches and what it misses, and wait for my answer.
```

"Cogitated for 1m 7s". It said it would read the spec, the tickets and the glossary first; ran `cat GLOSSARY.md`, listed the
decision records, and read the issues with `gh issue view`. One compound git command was refused by the worktree guard
("this command names git in a form too complex to verify that it stays inside the worktree"), so it ran `git fetch` of
`prototype/balances` as a plain command, read the prototype's code in its scratch folder and found its hash function
(`function fnv1a(str)`). "Still reading" came in between.

The reply, in order:

- "I haven't written any tests yet." Then **something to settle first**: the spec puts the money core inside the group
  service, "not a separate seam", and every test goes through the service on PGlite; #3 hasn't built the service, so testing
  the engine now means making it a seam of its own. That changes the spec, so it wanted our call first.
- **The interface under test**: `computeGroupMoney({ members, expenses, settlements })` returning the shares per expense,
  the balances and the suggested settlements; one pure function, every amount in integer minor units, valid input assumed
  (the service validates).
- **Seam A** (recommended), **Seam B** (advised against), **Seam C** (the spec's own seam, needs #3): see
  `slices-and-sources.md`.
- **What I need from you**: 1. seam A, and is it kept? (it recommends keeping it for good, which means changing spec #1);
  2. amount parsing: leave it to #4?; 3. invalid input such as zero participants: an untested precondition (its default,
  since the service refuses it first), or should the engine throw and be tested for that?

It stopped and waited.

## 3. Our answer

Paste `prompts/seam-answer.txt`:

```text
Seam A, and keep it: the engine is pure arithmetic, so it doesn't need #3, and its tests become the engine's contract. #4 adds the service tests on top, and the property test stays with #4 as its criteria say. Parsing stays with #4, and invalid input stays an untested precondition: the service refuses it first. Don't edit the spec yet: we'll record the seam change on it when this lands. Expected values come from published vectors and the spec's examples, never from the prototype's code. Start with one slice: write the test, run it and show me it failing, then write only enough code to pass it. Then stop.
```

It wrote the first test: an expense `dinner` of 9000 paid by Ana for Ana, Ben and Cy, so each share is 3000. The first
run failed for the wrong reason ("The worktree has no dependencies installed, so the run failed for the wrong reason"); it
ran `npm ci` and ran the test again. "That's red: the test fails because the engine doesn't exist yet." Then
`src/money/group-money.ts` with 23 lines, and `Tests 1 passed (1)`.

Its report: the first slice is done, nothing committed yet; the expected value is plain arithmetic, not taken from the
prototype; the red failed because `./group-money` didn't exist yet; the green divides each amount by the number of
participants and handles only even splits. For the next slice it proposed the leftover unit, from the FNV-1a test vector for
id "a" (`0xe40c292c`).

## 4. The rule, and the run

The first try of the next message stopped on an API error (the yellow line in the session); we sent the same message again.
Paste `prompts/red-on-the-value.txt`:

```text
Good. From now on a red has to fail on the value, not on a missing name. Carry on one slice at a time: the leftover unit, balances with settlements, then suggested settlements up to the spec's five-member example. Commit each green slice, and stop when the spec's examples pass.
```

"Brewed for 4m 58s". It committed slice 1 (the pre-commit hook ran the formatter, the type-check and the tests), then six
more slices, each red on a value, the least code, green, a commit. Where a test needed a new field (the balances, the
suggestions), it added the field as an empty stub first, so the red is a wrong value. One shell heredoc was refused by the
guard and it wrote the test with its file tool instead. In the settlements test it changed an input from `6000 - 3000` to the
plain literal `3000`. The table of the seven commits, the expected-value sources and the rules without a test of their own
are in `slices-and-sources.md`.

## 5. Check it from outside the session (second terminal)

```bash
cd ~/potluck/.claude/worktrees/balance-engine/
git log --oneline -8
```

(Typed as `cd .cl`, Tab, `w`, Tab, `b`, Tab from `~/potluck`.)

```text
aedf1b4 Suggest settlements by greedy matching
0f3729f Suggest settlements toward the member who is owed
4280f07 Count settlements in balances
792447f Compute balances from expenses paid for and shares
59e61e8 Order an expense's shares by member creation order
f5d032a Give an expense's leftover unit at its id's FNV-1a offset
bb2a62a Split an expense evenly among its participants
a20746d (origin/main, main) Merge pull request #14 from OrMizrahi12/worktree-landing-rules
```

```bash
npx vitest run src/money --reporter=verbose
```

Seven tests by name, all passed (`Tests 7 passed (7)`):

```text
an expense's shares > are equal when the amount divides evenly among the participants
an expense's shares > give the leftover unit to the participant at the expense id's hash offset
an expense's shares > follow member creation order, whatever order the participants are given in
balances > are what each member paid for expenses minus their shares, in creation order
balances > add settlements made and subtract settlements received
suggested settlements > have every member who owes pay the member who is owed, earlier-created first on a tie
suggested settlements > match the largest debtor with the largest creditor (spec's five-member example)
```

```bash
grep -n -A2 "test vector\|Spec #1" src/money/group-money.test.ts
```

The comments above the tests: FNV-1a 32-bit of "a" is `0xe40c292c` (published test vector, Go's `hash/fnv`), mod 3 = 1, so
the one leftover unit goes to the second participant; the same for "abc" (`0x1a47e90b`); and spec #1's known non-minimal
case, balances +20, +40, +30, −50, −40 giving 4 suggestions, with the greedy steps worked out by hand.

## 6. The removal check (the session)

The first try of this message also stopped on an API error; we sent it again. Paste `prompts/removal-check.txt`:

```text
One more check before we push: was any of this code written before a test asked for it? Take each line or condition of the engine out on its own, run the tests, put it back. Show me what no test notices.
```

"Cooked for 5m 29s". "I'm running a script that mutates the engine one change at a time (deleting each line, then each
condition), restoring the file after each run, and I'll only type-check the mutants the tests miss." The script lived in
its scratch folder, outside the repository; each line of its output reads "caught", "doesn't parse" or "survives". At the
end, `git status` was clean and `Tests 7 passed (7)`.

The reply: "Seven changes survive: no test notices them, and the type-check passes too." None of them hides a missing
test: each is redundant. The list is in `slices-and-sources.md`. What the tests catch: deleting any other line or taking
out any other condition makes a test fail on a value, including the floor, the leftover, the offset, the rotation's `% n`,
both halves of the `min`, the sign, `>>> 0` and FNV's xor. Its suggestion: one more commit before the push that removes the
redundancy, and a question, "Should I make that commit?"

## 7. The skill's own rules (second terminal)

```bash
grep -A6 "## Rules of the loop" ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/tdd/SKILL.md
```

Three rules, in our words: red before green (write the failing test first, then only enough code to pass it); one slice at a
time (one seam, one test, one minimal implementation per cycle); refactoring is not part of the loop, it belongs to the
review stage.

## 8. Leave them, push, record (the session)

Paste `prompts/leave-push-record.txt`:

```text
Leave them: none of the seven changes a result, and taking out code that no test notices is tidying. Tidying belongs to the review, in its own session, not to this loop. Next, push the branch and watch CI, and add a short comment to spec #1 that records the seam change and why. No PR yet.
```

`git push -u origin worktree-balance-engine` (`[new branch]`); `gh run list` found the run the push started (43411899477);
`gh run watch` ran in the background ("Running in the background"); it wrote the comment in its scratch folder and posted it
with `gh issue comment 1 --body-file …`, then reported: pushed, comment posted, CI still running on `aedf1b4`. A few seconds
later: 'Background command "Watch the CI run until it finishes" completed (exit code 0)', and Claude's second short turn:
CI passed on `aedf1b4`, "Type-check, lint and service tests in 24s", "and it's the check main requires." About 56 seconds
from the message to green.

## 9. The record on GitHub (second terminal)

```bash
gh issue view 1 --comments
```

The newest comment, by the repository's owner, is the one Claude posted. Its text is in `potluck-at-lesson-6.4.md`.

```bash
gh run list -L 2
```

Two rows: "Suggest settlements by greedy m…", workflow Check, branch `worktree-balance-engine`, event push, passed, 28s; and
the run for the tag `lesson-6.3` (the merge of #14). No pull request is open.
