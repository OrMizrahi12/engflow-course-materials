# Lesson 7.2: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. The Claude Code session is the
lesson 7.1 review session, still open; the second terminal is ours, for checks from outside the session.

## 1. The session we look back on (first terminal)

Nothing typed. The session sits where lesson 7.1 left it: the last reply says both branches are pushed and no pull request
is open; the status line shows Opus 5.5 and 132.0k of context; the footer reads "new task? /clear to save 132.5k tokens".

## 2. The skill's own file (second terminal)

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/retro
head -5 SKILL.md
grep -oP '^- \*\*\K[^*]+' SKILL.md
```

```text
name: retro
description: "Conduct a retrospective on a coding session."
disable-model-invocation: true
```

Then the seven category names: Navigation, Automated checks, Coding standards, Global AGENTS.md, Tool economy, No-ops,
Information access.

## 3. /retro (first terminal)

Type `/retro`. The menu shows `/mattpocock-skills:retro (retro)`. A space, then paste `prompts/retro-scope.txt`:

```text
This session, from the first review to pushing both branches. Tie each suggestion to the moment in it that shows it.
```

It loaded the plugin's `writing-for-agents` skill, looked at the hook setup in each worktree, and answered after 1 minute
12 seconds. The reply opens: two problems stand out, a new worktree commits with no pre-commit checks at all, and the
glossary's banned words are a rule a linter could enforce, yet only a reviewer caught them. Then six candidates in order of
severity, each with "Moment:" and "Change:" (see `candidates-and-lanes.md`), and a short "Already fixed during the session"
note. Context: 140.3k.

## 4. One trace by hand (second terminal)

```bash
clear
cd ~/potluck
git grep -n -w net aedf1b4 -- src/money/group-money.ts
git grep -n -w net d1808ed -- src/money || echo none
```

```text
aedf1b4:src/money/group-money.ts:51:  const net = new Map(input.members.map((m) => [m.id, 0]));
aedf1b4:src/money/group-money.ts:53:    net.set(memberId, (net.get(memberId) ?? 0) + amount);
aedf1b4:src/money/group-money.ts:64:    balance: net.get(m.id) ?? 0,
none
```

## 5. The decision (first terminal)

Paste `prompts/decide.txt`:

```text
Do 2, 3, 4 and 6 on the standards branch, because the Words rule and the CLAUDE.md line live only there. Before the ESLint rule goes in, try it: run it over the engine as it was before the review (aedf1b4) and over main with the engine merged in, and show me what it flags in each. Delete the CLAUDE.md section. Leave 1 and 5 for now. Commit, but don't push.
```

"Crunched for 7m 14s". Two questions to read files outside the working directories, each answered with option 4, "Yes, but
ask again next time" (one read, no setting written). It built the rule, tried it in temporary worktrees, renamed `const trip`
in its own commit, installed dependencies in the standards worktree so its hook runs, added ESLint to the pre-commit step,
checked that a probe file with a banned word is blocked at commit, wrote the kept decisions and removed the `CLAUDE.md`
section. The report: "What the trial flagged" (4 hits on `aedf1b4`, 1 hit on `main` with the engine merged in), the five
commits, three slips it fixed before committing, and "Decision for you" (test names stay checked unless they start to
produce false positives). Context: 171.6k.

## 6. What the branch holds now (second terminal)

```bash
cd ~/potluck
clear
cd .claude/worktrees/coding-standards
git status -sb | head -1
git log --oneline -6
git diff --stat origin/worktree-coding-standards
wc -l CLAUDE.md
```

```text
## worktree-coding-standards...origin/worktree-coding-standards [ahead 5]
836ba0a (HEAD -> worktree-coding-standards) Remove the CODING_STANDARDS.md pointer from CLAUDE.md
cd3aa73 Record the review findings we chose to keep as they are
a6b5ca8 Lint staged scripts in the pre-commit hook
7ee9afe Reject glossary-avoided words in names and test names
0de7a38 Name the create-group test input lisbonGroup
...
 5 files changed, 98 insertions(+), 26 deletions(-)
19 CLAUDE.md
```

## 7. Land both (first terminal)

Paste `prompts/land.txt`:

```text
Push the standards branch, then land both the way docs/agents/landing.md says: the engine first, the standards branch once main has the engine.
```

"Brewed for 4m 42s". It pushed, loaded the `pr` skill to write the PR bodies, opened #17 with auto-merge queued, checked
for a migration (none), updated the branch when GitHub reported it behind `main`, watched CI go green, saw it merge as
`065b270`, and checked the production deploy. Then the same for #18 (`ae08090`). The reply's table: both merged, CI green
after a branch update, both deploys a success. It listed local leftovers to clean up later (the two worktrees, a backup
branch, the local `main` checkout). Context: 179.3k.

## 8. Main (second terminal)

```bash
clear
cd ~/potluck
git fetch -q
git log --oneline --first-parent -4 origin/main
git show origin/main:CLAUDE.md | wc -l
```

```text
ae08090 (origin/main, origin/HEAD) Merge pull request #18 from OrMizrahi12/worktree-coding-standards
065b270 Merge pull request #17 from OrMizrahi12/worktree-balance-engine
292703a (tag: lesson-6.5) Merge pull request #16 from OrMizrahi12/worktree-create-group
ba91b3c Merge pull request #15 from OrMizrahi12/worktree-dev-logs
19
```
