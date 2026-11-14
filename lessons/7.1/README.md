# Student kit: Lesson 7.1, Three kinds of review

The balance engine from lesson 6.4 is written, tested and pushed, but nobody has reviewed it yet, and its pull request
waits for that review. This lesson reviews the branch three ways, in a fresh Claude Code session in the same worktree. First
we close the session that wrote the code: a model that reviews its own work tends to agree with itself. Then the plugin's
`code-review` skill reviews the branch since `main` on two separate axes: Standards (is it built right, by the repo's written
rules and a list of classic code smells?) and Spec (is it the right thing, by the issue it implements?). Then Claude Code's
own two reviewers run on the same branch: `/code-review`, which hunts for bugs, and `/security-review`, which looks for attack
paths (it fails first in our repo, and one git command fixes that). Every finding is a lead: we check one by hand, ask for the
evidence behind the rest, act on the ones with a rule or a failure behind them, and write the rules the review relied on into
a new `CODING_STANDARDS.md`. A second pass reads that file and finds something new, including in our own fixes. We act on what
it cites, push both branches, and stop. No pull requests yet.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/check-the-leads.txt` | check every finding against what it cites, one line each, with evidence; no edits yet |
| `prompts/decide-and-write-standards.txt` | the decisions: what to fix, what to leave, and `CODING_STANDARDS.md` as its own commit |
| `prompts/split-and-stop.txt` | after the second pass: one commit per change, the standards on their own branch, a comment on #4, no third review |
| `prompts/push-and-watch.txt` | push both branches and watch CI, no pull requests yet |
| `what-the-reviews-found.md` | the three reviews, the evidence check and the second pass, in our words: what each found and what we decided |
| `potluck-at-lesson-7.1.md` | what the Potluck repository holds at the tag `lesson-7.1`: the six one-change commits, the standards branch, the comment on #4 |
| `potluck/src/money/group-money.ts` | the engine exactly as it is at the tag |
| `potluck/src/money/group-money.test.ts` | its tests (now nine) exactly as they are at the tag |
| `potluck-coding-standards/CODING_STANDARDS.md` | the new standards file exactly as it is on the branch `worktree-coding-standards` (`f59760d`) |
| `code-review.md` | the card: the plugin's two-axis review, what it needs, how to read it, it's working if |
| `three-reviewers.md` | the card: the three reviewers side by side, and the same four steps after any of them |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 6.5, with the branch `worktree-balance-engine` from lesson 6.4 pushed and not yet
  merged, and its worktree at `~/potluck/.claude/worktrees/balance-engine`. Signed in to GitHub with `gh`.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.323). On camera it ran in auto
  mode on Opus 5.5. In default mode you approve each command as it comes.
- Two terminals (or two tabs): one for the Claude Code session, one for your own checks.

## The steps, as on camera (Ubuntu)

**1. Close the author's session.** The session that wrote the engine was still open in the worktree. Its last words: there's
no PR yet, and it left the seven redundant bits in place for the review session. Type `/exit` in it. That leaves the shell in
the same worktree folder.

**2. A fresh session in the same folder.**

```bash
clear
claude
```

The header shows Opus 5.5 and the path `~/potluck/.claude/worktrees/balance-engine`, and the status line shows `0.0k (0%)`:
the context is empty. It knows the code and nothing of the conversation that wrote it.

**3. The plugin's review, since `main`.** Type `/code-review` and look at the menu. In this version the first entry is
Claude Code's own reviewer ("Review the current diff or a PR for bugs and cleanups"); the second is the plugin's skill,
`/mattpocock-skills:code-review` ("Review the changes since a fixed point"). The short name belongs to Claude Code, so the
plugin skill needs its full name. Press Down to pick the second row, Tab to complete it, and give it the fixed point:

```text
/mattpocock-skills:code-review main
```

On camera this took 3 minutes 20 seconds. It listed the seven commits since `main`, read the repo's tracker doc and spec #1
with its comments, and started two reviewers in the background, side by side. Standards checked the diff against the repo's
written rules (`AGENTS.md`, `GLOSSARY.md`, the docs under `docs/agents`, the decision records) and skipped anything the linter
or the formatter enforces; Spec checked it against spec #1 and its latest comment. Standards came back first, after 28
seconds, and the session checked its main finding itself: the glossary lists "net" as a word to avoid for a balance, and line
51 names the balance map `net`. The full report: two findings that break a documented rule (`net`, a clear break;
debtor/creditor, a probable one, because the glossary has no word for a member who owes), six possible code smells marked as
opinion, and on the Spec side seven tests passing, nothing built beyond the spec, nothing wrong, five test gaps, and one
caveat: the hash reads an expense id's UTF-16 code units, so it matches the spec only for ASCII ids. The summary names the
worst issue on each side, never one blended score.

**4. Claude Code's bug hunter.** Type `/code-review` again and press Return on the first row, with no level, so it runs at its
default. In this version it runs in the background as a separate agent ("Running in the background as @code-review"); on
camera it took 47 seconds. What you see is the session's triage of its 8 findings, not the reviewer's raw list: six describe
input spec #1's comment says the engine doesn't have to handle (zero participants, an unknown member id, negative or
fractional amounts, two expenses with one id), and two are worth acting on (the UTF-16 hash, the same caveat as the Spec
review, and the missing tests). It noted that the simpler code one finding suggested still stands.

**5. The security reviewer, and the one-time fix.** Type `/security-review`. In our repo it failed before any model saw
anything:

```text
Shell command failed for pattern "!`git diff origin/HEAD...`": [stderr]
fatal: ambiguous argument 'origin/HEAD...': unknown revision or path not in the working tree.
```

The command compares the branch against `origin/HEAD`, the remote's default branch. Our repository was created with
`git init` and never cloned, so it had none. A clone has one. In the second terminal:

```bash
cd ~/potluck/.claude/worktrees/balance-engine/
git remote set-head origin --auto
```

It prints `origin/HEAD set to main`, exactly what a clone does for you. (On camera the second terminal was in another
worktree, so the `cd` was `cd ../balance-engine/` with Tab.) Back in the session, `/security-review` again: it started a
security scan in the background and said each finding would get a separate false-positive check, keeping only the ones that
score 8 or higher. The verdict: no high or medium vulnerabilities. It's one pure function with no input or output, and nothing
calls it yet; prototype pollution isn't possible because each member's figures live in a `Map`; the hash only picks who gets
the odd cent, so nothing secret depends on it; and for bad input, its advice is for later: when the group service calls the
engine, check whole cents above zero, at least one participant and ids that belong to the group.

**6. One lead, checked by hand.** In the second terminal:

```bash
grep -n -B2 -iE 'debtor|creditor' GLOSSARY.md
```

Payer: "The member who paid for an expense", avoid "Spender, buyer, creditor". Participant: "A member an expense is split
among", avoid "Debtor, beneficiary". So the finding holds, in part: those words are banned as names for the payer and the
participant, and the engine uses them for something else, a member who owes or is owed, which the glossary has no word for.

**7. The evidence for every lead.** Checking every finding by hand would take all afternoon. Paste
`prompts/check-the-leads.txt`. It read the glossary again, the engine with line numbers and the spec's section on the odd-cent
rule: under a minute. Its answer: of the roughly 30 findings, only a few call for changes; the rest are out of scope under the
spec, mirror the spec's own wording, or are opinion. One correction to its own earlier report: two Standards findings point
at wording the code took straight from the spec. Then one table per reviewer with "Holds?" and the evidence, and a "Worth
changing" list at the bottom. One row worth noticing: it checked the bug hunter's arithmetic itself (100.5 split three ways
gives 101), real, but out of scope, because amounts are whole minor units and parsing stays with ticket #4.

**8. The decisions, and the rules written down.** Paste `prompts/decide-and-write-standards.txt`. I'd leave the rest, because
none of it has a rule or a failure behind it. On camera this took 1 minute 39 seconds: it read the repo's landing rules,
edited the engine and the test names, added the two tests, ran the tests and the type check, committed the fixes through the
pre-commit hook, then wrote `CODING_STANDARDS.md` (36 lines) and committed it on its own. It ended with a fair point: nothing
tells agents to read the file (the review skill finds it on its own), and a one-line pointer in `CLAUDE.md` would close that.

**9. Look from outside the session.** In the second terminal:

```bash
git log --oneline -3
less CODING_STANDARDS.md
```

Two new commits on top of `aedf1b4` (the tag `lesson-6.4`): the fixes and the standards. The file has six short sections:
Words, Money, Pure functions and preconditions, Determinism, Tests, Commits. Space for the next page, `q` to quit.

**10. The same review again.** In the session, the same menu, the plugin skill, and `main`. On camera this took 2 minutes 57
seconds. It started both reviewers over nine commits, with `CODING_STANDARDS.md` as the main standard. Standards came back
after 32 seconds; its strongest point: the fix commit does several things at once, which breaks the rule we just wrote down,
one behaviour per commit (Claude owned it: "This is my doing: I bundled your fixes into one commit"). It also found that the
glossary itself still defines a balance as a "net position", the word the new standard bans, and that `landing.md` says never
mix two changes in one PR while the standards file rides on the engine's branch. The Spec side found nothing wrong and even
ran a scratch check: across 2,000 random groups, the shares always added up. Not asked for: the standards file probably
belongs in its own PR, and ticket #4 should know about the ASCII precondition.

**11. Act on what it cites, and stop.** Paste `prompts/split-and-stop.txt`. About three minutes on camera: it fetched first,
noticed that `main` on GitHub had moved on, and made the standards branch off `origin/main` in a fresh worktree with three
commits; then it put the engine's files back at `aedf1b4` and replayed the fixes one commit at a time, six in all. Along the
way it caught its own mistake: the preconditions comment said the service refuses every one of them, but the service is the
one that assigns expense ids, so it now says "guarantees". Then it commented on ticket #4. Nothing pushed; one thing public,
that comment.

**12. Push both branches.** Type:

```text
Push both branches and watch CI. No PRs yet.
```

It checked that CI runs on every push, pushed both branches and watched both runs: a little over a minute. Both green, no
pull requests: `worktree-balance-engine` at `d1808ed`, `worktree-coding-standards` at `f59760d`. Merge the engine first when
the time comes, because the standards file uses its code as examples.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy, on a branch with a few commits and no PR: open a fresh session and run the plugin's `code-review` with `main`
as the fixed point. Pick one finding and check what it cites yourself. Write one rule you agree with into a
`CODING_STANDARDS.md`. Then run `/code-review` and `/security-review` on the same branch and compare what each one found.

**Checkpoint (it's working if):** the review runs in a session that didn't write the code; its report has two separate
sections, Standards and Spec, each with its worst issue; every finding you act on has a rule, a spec line or a real failure
behind it that you looked at; your `CODING_STANDARDS.md` holds rules the code already follows, not wishes; and a second run of
the same review reads that file (it says so in its plan).

## If something goes differently

- **Plain `/code-review` runs a different reviewer.** In this version the short name is Claude Code's own bug hunter. The
  plugin's skill is `/mattpocock-skills:code-review`, the second row of the menu.
- **`/security-review` fails with "ambiguous argument 'origin/HEAD...'".** Your repository has no `origin/HEAD` (it was
  created with `git init`, not cloned). Run `git remote set-head origin --auto` once in the repository.
- **The built-in `/code-review` shows no list of its own.** In this version it runs in the background and the session reports
  what it found, triaged. Ask the session for the full list if you want it.
- **Your findings differ from ours.** Expected: every run finds something new, and yours depends on your code and your spec.
  What should match is the shape: two axes, cited findings, a triage, and a stop.
- **The review sees nothing.** It reads commits, so it won't see work you haven't committed. Commit first, or review the
  uncommitted changes another way.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-7.1` points at
`d1808ed`, the tip of the branch `worktree-balance-engine` (not merged into `main`). The new standards are on the branch
`worktree-coding-standards` (`f59760d`). Clone it to look or to start from here; don't fork it. `potluck-at-lesson-7.1.md` has
the details. A clone already has `origin/HEAD`, so `/security-review` works in it from the start.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage; its built-in
  `/code-review` and `/security-review` come with it. On camera the review session ran on Opus 5.5; by the end of the lesson
  its context was about 132k tokens (13% of the window).
- git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT License) are free.
- Vercel and Neon aren't used in this lesson. (Vercel's free Hobby plan is for non-commercial use.)

## Credits

The `code-review` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License. It is described here in our own words; `code-review.md` paraphrases how it works. This course is independent:
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
