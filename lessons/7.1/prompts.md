# Lesson 7.1: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. The review runs in one fresh Claude
Code session in the engine's worktree; a second terminal is ours, for checks from outside the session.

## 1. Close the author's session (first terminal, the lesson 6.4 session)

```text
/exit
```

The shell is back in `~/potluck/.claude/worktrees/balance-engine`, with the line to resume that session if you ever need it.

## 2. A fresh session in the same folder

```bash
clear
claude
```

The header: Claude Code v2.1.323, Opus 5.5 · Claude Ultra, `~/potluck/.claude/worktrees/balance-engine`; the status line
`Opus 5.5 | 0.0k (0%)`.

## 3. The plugin's review

Type `/code-review`; the menu lists `/code-review` (Claude Code's own: "Review the current diff or a PR for bugs and
cleanups") first and `/mattpocock-skills:code-review` ("Review the changes since a fixed point (commit, branch, tag, or
merge-base) along two axes") second. Down, Tab, then:

```text
/mattpocock-skills:code-review main
```

3 minutes 20 seconds. `git log main..HEAD` (seven commits), the tracker doc, `gh issue view 1 --comments`, then "2 background
agents launched": Standards review and Spec review of the balance engine. Standards back after 28 seconds ("Its main finding
checks out: GLOSSARY.md lists "net" as a word to avoid for Balance (line 39), and src/money/group-money.ts:51 names the balance
map net"). The full report under **Standards** and **Spec**, then a one-line summary with the worst issue on each side.

## 4. Claude Code's bug hunter

Type `/code-review` and press Return on the first row (no level, so it runs at its default).

"Running in the background as @code-review"; 47 seconds; then the session's triage: "The background /code-review returned 8
findings. Six of them describe input the spec says the engine doesn't have to handle, so I'd only act on two." Out of scope by
the spec's decision: #1 zero participants, #2 an unknown payer or participant id, #5 negative or too-small amounts, #4
non-integer amounts, #3 two expenses with the same id (with a fair point about simpler code), #6 re-sorting in `suggest()`.
Worth acting on: #7 the UTF-16 hash, #8 missing tests.

## 5. The security reviewer

```text
/security-review
```

"Shell command failed for pattern ... `git diff origin/HEAD...`", "fatal: ambiguous argument 'origin/HEAD...'". In the second
terminal (on camera it was in another worktree):

```bash
cd ../balance-engine/
git remote set-head origin --auto
```

`origin/HEAD set to main`. Back in the session:

```text
/security-review
```

A security scan in the background ("Once it reports back, I'll send each vulnerability it finds through a separate
false-positive check and keep only the ones that score 8 or higher"), then: "No High or Medium vulnerabilities found."
Prototype pollution not possible (a `Map`), the FNV-1a hash only decides who gets the odd cent, bad input for the group service
to refuse when it's wired up; "There were no findings, so no false-positive checks were needed."

## 6. One lead by hand (second terminal)

```bash
clear
grep -n -B2 -iE 'debtor|creditor' GLOSSARY.md
```

```text
25-**Payer**:
26-The member who paid for an expense.
27:_Avoid_: Spender, buyer, creditor
--
29-**Participant**:
30-A member an expense is split among.
31:_Avoid_: Debtor, beneficiary
```

## 7. The evidence for every lead

Paste `prompts/check-the-leads.txt`:

```text
Three reviews, a lot of findings. Before we change anything, check each one against what it cites: the glossary, the spec and its comments, the code. One line per finding: does it hold up, and what's your evidence? Don't edit any files yet.
```

Under a minute. "Of the roughly 30 findings, only a few call for changes; the rest are out of scope under the spec, mirror its
own wording, or are opinion." Four tables (Standards S1–S8, Spec P1–P7, `/code-review` C1–C8, `/security-review` X1) with
Finding, Holds? and Evidence; then "Worth changing: S1 rename net; S2 fix the debtor/creditor wording in the spec and the code
together; P2 and P4 add the two missing tests; P6 record that expense ids are ASCII, or hash the UTF-8 bytes. Optional: S3, S6,
and C3's simplification." `what-the-reviews-found.md` has the rows in our words.

## 8. The decisions

Paste `prompts/decide-and-write-standards.txt`:

```text
Good. Act on these: rename net, and replace debtor and creditor in the code and the test names with the glossary's words (the spec stays as written; it records the decision). Add the two tests: balances sum to zero, and a payer who isn't a participant. Take C3's simplification. State the ASCII assumption for expense ids next to the other preconditions. Leave the rest. Then write CODING_STANDARDS.md with the rules this review showed we follow but never wrote down, and commit it separately from the fixes. Don't push yet.
```

1 minute 39 seconds. Two commits, nothing pushed, tests, type-check and lint passing: `422e50e` "Use the glossary's words and
state the engine's preconditions" and `2d57b5a` "Write down the coding standards the code already follows". "Nothing tells
agents to read CODING_STANDARDS.md; the review skill finds it on its own. A one-line pointer in CLAUDE.md would close that. I
haven't added it, since you didn't ask."

## 9. From outside the session (second terminal)

```bash
clear
git log --oneline -3
less CODING_STANDARDS.md
```

`2d57b5a (HEAD -> worktree-balance-engine)`, `422e50e`, `aedf1b4 (tag: lesson-6.4, origin/worktree-balance-engine)`. The file:
Words, Money, Pure functions and preconditions, Determinism, Tests, Commits (Space for page 2, `q` to quit).

## 10. The same review again

Type `/code-review`, Down, Tab, `main`, Return:

```text
/mattpocock-skills:code-review main
```

2 minutes 57 seconds. "They now cover 9 commits, including the two from this round. Standards: CODING_STANDARDS.md is now the
main standard, alongside the glossary, repo docs and the code-smell list." It told the Spec reviewer that the code uses the
glossary's wording on purpose. Standards back after 32 seconds: "the fix commit 422e50e does several things at once, which
breaks the "one behaviour per commit" rule we just wrote down." The report: no correctness bugs, no new missing requirements;
"This is my doing: I bundled your fixes into one commit"; the glossary still defines Balance as "net position"; `landing.md`
says never mix two changes in one PR; the Spec side's scratch check over 2,000 random groups; not asked for: the standards
file in its own PR, the ASCII precondition for #4. "Both reviews point at the same problem from two sides: the standards file
mixed into this PR."

## 11. Split, and stop

Paste `prompts/split-and-stop.txt`:

```text
Yes, both. Split 422e50e into one commit per change, and move the standards commit to its own branch off main. On that branch, also fix the glossary's "net position" wording and add the one-line pointer to CODING_STANDARDS.md in CLAUDE.md. Comment on #4 that expense ids are assumed to be ASCII. Leave the old commit message and the rest as they are. No third review: we act on what this pass cited and stop. Don't push yet.
```

About 3 minutes. `git fetch`; "origin/main has moved on (#15, #16), so the standards branch goes off origin/main, not the stale
local main"; `git worktree add -b worktree-coding-standards .../coding-standards origin/main`; "Standards branch done: 3
commits"; "The files are back at aedf1b4. Commit 1 of 6: the rename." ... "The comment I wrote last round says the service
"refuses" every precondition, but expense ids are assigned by the service, not refused. I'm rewording it in this same unpushed
commit." The comment on #4 posted. "Both changes are done and nothing is pushed. One thing is now public: the comment on #4."
It also kept a local backup branch of the old commits and said so.

## 12. Push

Type `prompts/push-and-watch.txt`:

```text
Push both branches and watch CI. No PRs yet.
```

A little over a minute. "CI runs on every push, so pushing both branches will start it." `git push` of both, `gh run watch` of
both. "I pushed both branches, and CI passed on both. I haven't opened any PRs." `worktree-balance-engine d1808ed success`,
`worktree-coding-standards f59760d success`. "When you open the PRs, worktree-balance-engine will need gh pr update-branch
first, because it's still behind main. Merge it before the standards PR, since CODING_STANDARDS.md uses its code as examples."
