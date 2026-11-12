# Prompts (Lesson 5.1)

Every line typed or pasted in the lesson, in order, with what came back. Use your own words; these are the ones from camera.
On camera the drill ran in a throwaway folder, `~/test-drill`, that never goes into Potluck.

## In the lesson terminal (`~/potluck`): what the spec will ask

Pasted (one line):

```bash
grep -n -i -E "seam|good test|modules" ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/to-spec/SKILL.md
```

Six lines came back: 15 (sketch out the seams you will test at; use the highest seam possible; the ideal number is one),
17 (check with the user that these seams match their expectations), 47 and 48 (the modules that will be built or modified,
and their interfaces), 63 (what makes a good test: only external behavior) and 64 (which modules will be tested). If your
plugin version differs, change `1.3.1` in the path (`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).

## In the prototype's window: a throwaway folder and a fresh session

Typed (Tab completed the file name):

```bash
mkdir ~/test-drill
cp potluck-balances.PROTOTYPE.html ~/test-drill/
cd ~/test-drill
ls
claude -n drill
```

`ls` showed the prototype only. The new folder asked for trust: **Yes, I trust this folder**. The session started at 0 tokens.
Run the `cp` from the folder that holds the prototype (on camera `~/potluck-prototype`, from lesson 4.2). Without it:
`git -C ~/potluck show lesson-4.2:prototype/potluck-balances.PROTOTYPE.html > ~/test-drill/potluck-balances.PROTOTYPE.html`.

## In the drill session (Claude Code, `~/test-drill`)

**1. Lift the logic** (pasted):

```text
Copy the logic block of potluck-balances.PROTOTYPE.html (the script with id potluck-logic) into potluck-logic.js, unchanged, with an export at the end.
```

11 seconds later: `potluck-logic.js` made from lines 77 to 495 of the prototype plus one line, `export { Potluck };`. Claude
compared the copy with the original ("identical"), and Node imported it: "Potluck comes through with all 22 of its members."

**2. Four tests of one case** (pasted, one line):

```text
Now write odd-cent.test.js for Node's built-in test runner. One case: Ana pays $10.00 for Ana, Ben and Cai. Four tests of it, each named after what it checks: the balances add up to zero; computeShares reports offset 0; the ledger's paid column for Ana is 1000; Ana's balance equals 1000 minus her share as computeShares reports it. Don't run them yet.
```

The four tests are chosen on purpose: one of each kind the lesson compares. 18 seconds later: `odd-cent.test.js` (49 lines;
`drill/at-commit/odd-cent.test.js` in this kit). The reply listed the four and added: "The offset test may fail … I wrote it
as you specified and haven't worked out the actual value."

## In the lesson terminal: read and run them

```bash
cd ~/test-drill
ls
cat odd-cent.test.js
node --test
```

Four green ticks, `tests 4`, `pass 4`. `node --test` finds every `*.test.js` file by itself; Node 24 needs nothing installed.

## In the drill session: plant a bug

**3. Commit, then break one thing** (pasted):

```text
Put this folder under git and commit it, so we can undo. Then plant a bug on purpose: the leftover cents are never handed out. Don't touch or run the tests, and don't guess what they'll do.
```

13 seconds later: a local git repository with one commit (on camera `284072c`, never pushed) and one deleted line in
`computeShares`, the line that hands out the leftover cents. The reply also made a claim about the commit's author that
`git log` below showed to be wrong: check what Claude tells you.

## In the lesson terminal: the bug run

```bash
git log --format="%h %an %s"
git diff
node --test
```

`git log` shows the commit under your git name. `git diff`: one removed red line. The run: **only "the balances add up to
zero" fails**, `1 !== 0` (the balances add up to one cent), `fail 1`. The other three stay green with a real bug in the code.

## In the drill session: a harmless tidy-up

**4. Undo, then tidy** (pasted):

```text
Undo the bug. Then a tidy-up that changes nothing a user can see: computeShares returns only { shares }, without n, q, r and offset, and the ledger keeps only each member's balance. Update anything inside that used them. Don't touch or run the tests, and don't guess what they'll do.
```

27 seconds later: `git checkout potluck-logic.js` (bug undone), the tidy-up in three places, "The module still loads." The
reply also noted that the prototype page still runs on its own copy of the logic, and that the page reads what was removed,
"so if the page is ever switched to load potluck-logic.js, it would break and users would see the difference."

## In the lesson terminal: the tidy-up run

```bash
git diff --stat
node --test
```

`1 file changed, 7 insertions(+), 8 deletions(-)`. The run: **two tests fail** (`undefined !== 0` for the offset test,
`undefined !== 1000` for the paid column), `fail 2`, although nothing a user can see changed. The balances test and the
"Ana's balance" test stay green.

## In the lesson terminal: the names, in the tdd skill

```bash
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering
grep -n -E "BAD|GOOD|^\*\*" tdd/tests.md
grep -n -E "public interfaces|independent source" tdd/SKILL.md
```

The first `cd` was pasted. `tests.md`: good tests check observable behavior through the interface; implementation-detail
tests, tests that bypass the interface to verify, and tautological tests (the expected value is recomputed the way the code
computes it) are the bad kinds. `SKILL.md` line 14: tests verify behavior through public interfaces; line 31: expected
values must come from an independent source of truth (a known-good literal, a worked example, the spec).

## In the drill session: keep the good one

**5. Typed:**

```text
Delete every test except the balances one, then run it.
```

10 seconds later: one test, `tests 1 pass 1 fail 0` (`drill/at-end/odd-cent.test.js`). Nothing was committed after the
first commit, which still holds all four tests.

## In the lesson terminal: seams and mocks

```bash
cd ~/test-drill
grep -n -A1 "<script id" potluck-balances.PROTOTYPE.html
grep -n import odd-cent.test.js
cd -
grep -n -E '^\*\*Seam|A \*\*seam' codebase-design/SKILL.md tdd/SKILL.md
grep -c -E "new Date|fetch|localStorage" ~/test-drill/potluck-logic.js
grep -n "TODAY =" ~/test-drill/potluck-balances.PROTOTYPE.html
head -14 tdd/mocking.md
```

The prototype's two script blocks (line 77: "Potluck logic module (pure: no DOM). This is the liftable part."; line 498:
"Page shell (throwaway). Calls into Potluck; nothing flows the other way."); the test's line 3 imports Potluck from the
logic file; the two seam definitions (codebase-design line 22, tdd line 20); `0` (the logic never reads the clock, the
network or browser storage); the page's own date, line 501; and the mocking notes (mock at system boundaries only, never
your own modules). The two long `grep` lines were pasted.

## In the lesson terminal: deep modules

```bash
tail -8 ~/test-drill/potluck-logic.js
sed -n 30,58p codebase-design/SKILL.md
sed -n 62,65p codebase-design/SKILL.md
grep -n "testing past" codebase-design/DEEPENING.md
```

The export list (22 names), the deep and shallow shapes with the three questions, the principles (depth is a property of
the interface; the deletion test; the interface is the test surface), and DEEPENING.md line 37: "If a test has to change
when the implementation changes, it's testing past the interface."

The skill files are from mattpocock/skills (MIT License, see `README.md`); the lines above are short quotes of the
installed 1.3.1 files.
