# Student kit: Lesson 7.2, /retro

At the end of lesson 7.1 the review session was still open: about 132k tokens of context, never cleared or compacted, and
Claude Code's footer offering `/clear`. This lesson runs `/retro` inside that session, before it is cleared, while the
struggles are still in the context. It gives six candidates, each tied to a moment in the session. We check one trace by
hand, then sort them: a mechanical mistake (a fixed pattern a script can find) becomes a check that fails, a judgment call
becomes a line in `CODING_STANDARDS.md` for the reviewer, and steering comes out of `CLAUDE.md`. The new check is tried
before it becomes a rule: it flags all four slips the reviewers had found in the engine as it was before the review, and
one real slip on `main` that nobody had seen, which gets renamed. Then both waiting branches land on `main`, the engine
first, each by auto-merge after a branch update and green CI.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/retro-scope.txt` | the scope pasted after `/retro`: which part of the session, and the trace rule |
| `prompts/decide.txt` | our decision: which candidates, on which branch, try the rule first, leave two for later |
| `prompts/land.txt` | push the standards branch, then land both the way `docs/agents/landing.md` says |
| `candidates-and-lanes.md` | the six candidates in our words, the lane each went to, the trial table, the five commits, the landing |
| `try-a-check-first.md` | how to try a new check against real code before it can block a merge |
| `potluck-at-lesson-7.2.md` | what the Potluck repository holds at the tag `lesson-7.2`: the two merges, the new rule, the files |
| `potluck/eslint.config.mjs` | the ESLint config at the tag, with the rule that reads the glossary's _Avoid_ lists |
| `potluck/.lintstagedrc` | the pre-commit step at the tag: Prettier, then ESLint on staged scripts |
| `potluck/CODING_STANDARDS.md` | the coding standards at the tag: the Words section cut to what lint can't see, the kept decisions |
| `potluck/CLAUDE.md` | `CLAUDE.md` at the tag: 19 lines, the same as before the lesson |
| `retro.md` | the card: what `/retro` takes in and gives back, the four lanes, when to run it, it's working if |

The card is also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 7.1: the balance-engine branch reviewed and pushed, the standards branch
  (`worktree-coding-standards`) pushed with `CODING_STANDARDS.md` and the `CLAUDE.md` pointer, neither merged.
- A session to look back on, still open. On camera it was the 7.1 review session (Opus 5.5, about 132k tokens, never
  cleared or compacted). Any session that was harder than it should have been works.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.323), in auto mode. In default
  mode you approve each command as it comes.
- Two terminals (or two tabs): the Claude Code session, and a shell of your own for checks.

## The steps, as on camera (Ubuntu)

**1. The session you look back on.** Don't clear it yet. The footer on camera read "new task? /clear to save 132.5k
tokens": `/retro` reads what is in that context, so it runs first.

**2. What the skill is, from its own file.** In the second terminal:

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/retro
head -5 SKILL.md
grep -oP '^- \*\*\K[^*]+' SKILL.md
```

`head` shows `disable-model-invocation: true`: only you can start it, Claude never does. The `grep` prints the seven
headings it sorts every finding into: Navigation, Automated checks, Coding standards, Global AGENTS.md (for us,
`CLAUDE.md`), Tool economy, No-ops and Information access. The plugin's version folder may differ on your machine
(`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).

**3. Run it in the session.** Back in the session, type `/retro`. The menu shows one row,
`/mattpocock-skills:retro (retro)`: the short name works in this version. A space, then paste `prompts/retro-scope.txt`.
The turn took 1 minute 12 seconds and loaded the plugin's `writing-for-agents` skill first. Context went from 132.0k to
140.3k.

**4. Read the candidates.** Six, most severe first, each with "Moment:" (where in the session it happened) and "Change:".
`candidates-and-lanes.md` has them in our words. Throw away any you can't trace to a real moment.

**5. Check one trace by hand.** Candidate 2 says `net` was in the engine before the review. In the second terminal:

```bash
clear
cd ~/potluck
git grep -n -w net aedf1b4 -- src/money/group-money.ts
git grep -n -w net d1808ed -- src/money || echo none
```

`aedf1b4` (the engine as it was before the review) has `const net` at `src/money/group-money.ts:51`; `d1808ed` (the
reviewed engine pushed in lesson 7.1) prints `none`. The trace holds.

**6. Decide.** Paste `prompts/decide.txt`: candidates 2, 3, 4 and 6 on the standards branch (the Words rule and the
`CLAUDE.md` line live only there), the rule tried first on `aedf1b4` and on `main` with the engine merged in, the
`CLAUDE.md` section deleted, 1 and 5 left for now, commit but don't push. The turn took 7 minutes 14 seconds. Twice it
asked to read outside its working directories (the session started in the balance-engine worktree and the files are in the
coding-standards worktree); we answered "Yes, but ask again next time" both times, which allows one read and writes no
setting. The context passed 150k during the second question.

**7. The report.** The trial: 4 hits on `aedf1b4`, exactly the four the review found, and 1 hit on `main` with the engine
merged in, `const trip` in `src/group/service.test.ts`, which no review had seen. It renamed that input in its own commit
first, so `main` doesn't fail the new rule. Five commits, nothing pushed. It also listed three slips of its own that it
fixed before committing, and left one decision for us (whether test names stay checked; we kept them checked, because one
of the four real hits was a test name).

**8. See it yourself.** In the second terminal:

```bash
cd ~/potluck
clear
cd .claude/worktrees/coding-standards
git status -sb | head -1
git log --oneline -6
git diff --stat origin/worktree-coding-standards
wc -l CLAUDE.md
```

On camera the `cd` was typed with Tab completion. `[ahead 5]`; the five commits (the rename, the rule, ESLint in the
pre-commit step, the kept decisions, the pointer removed); `5 files changed, 98 insertions(+), 26 deletions(-)`, with
`CLAUDE.md` four lines lighter; `19 CLAUDE.md`, which is what `main` has too. The line added in lesson 7.1 came back out,
so `CLAUDE.md` didn't grow.

**9. Land both.** Paste `prompts/land.txt`. It pushed, loaded the plugin's `pr` skill for the PR body and opened pull
request #17 for the engine with auto-merge queued. No migration, so auto-merge was allowed. GitHub said the branch was
behind `main`, so it updated the branch, watched CI go green, and the PR merged (`065b270`); then it checked the production
deploy on Vercel. Then #18 for the standards branch, the same way (`ae08090`). #18's CI was the new rule's first real run,
over `main` with the engine in it: green. The whole landing took 4 minutes 42 seconds.

**10. Check main.** In the second terminal:

```bash
clear
cd ~/potluck
git fetch -q
git log --oneline --first-parent -4 origin/main
git show origin/main:CLAUDE.md | wc -l
```

`ae08090` Merge pull request #18 on top, `065b270` Merge pull request #17 below it, and `19`.

The video trims the waits; the narration says how long each one took.

## Pause and try

At the end of your next session that fought you, before you clear it: run `/retro`, name the scope, and ask for the moment
behind each suggestion. Throw away any you can't trace. Then turn one mechanical candidate into a check, and make it fail on
the old code before it joins `npm run check`.

**Checkpoint (it's working if):** every candidate you keep points at a moment you can find; the new check fails on the old
code and passes on good code before it can block a merge; whatever it finds on `main` is fixed or explained, not silenced;
judgment calls end up in `CODING_STANDARDS.md`, not in `CLAUDE.md`; and `wc -l CLAUDE.md` is no bigger than before.

## If something goes differently

- **Plain `/retro` isn't found.** Type the plugin's full name, `/mattpocock-skills:retro`.
- **Your candidates differ from ours.** Expected: the reply depends on your session. What should match is the shape: each
  candidate has a moment, a category and a change.
- **Your session was compacted or is very long.** Its details may be gone. Clear, and point a fresh `/retro` at that
  session's log instead (the skill can read session logs on your machine).
- **A permission question about reading outside the working directories.** The session's folder is one worktree and the
  files are in another. "Yes, but ask again next time" allows that one read and changes no setting.
- **The new check fires on lots of good code.** Those are false positives: narrow the rule (we left entries with a
  qualifier, like "Split (as a noun)", to the reviewer), or keep that part in `CODING_STANDARDS.md`.
- **A commit in a new worktree runs no pre-commit hook.** The worktree has no `node_modules`; `npm ci` in it fixes that.
  That is candidate 1, kept for later.
- **A pull request carries a file under `drizzle/`.** `landing.md` says a migration waits for a person: no auto-merge.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. On macOS the stock `grep` has no
`-P`: use `grep -o '^- \*\*[^*]*' SKILL.md` instead, or install GNU grep.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-7.2` points at
`ae08090`, the merge of pull request #18 on `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-7.2.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera every turn
  ran on Opus 5.5; the session's context went from about 132k to about 179k tokens.
- ESLint, lint-staged, Node, npm, git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT
  License) are free.
- Vercel deployed each merge to production, as set up in lesson 6.2 (Vercel's free Hobby plan is for non-commercial use).
  Neon isn't used in this lesson.

## Credits

The `retro` and `pr` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License. They are described here in our own words; `retro.md` paraphrases how `/retro` sorts what it finds. This course is
independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
