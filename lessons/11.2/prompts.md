# Prompts: Lesson 11.2, What stays human

Every line sent to Claude in the lesson, in order, in one fresh worktree session (`claude -w what-stays-human`, Opus 5.5, auto
mode). The shell commands typed in my own tab are in `README.md`.

## 1. The brief (pasted, one line: `prompts/list-what-stays-human.txt`)

```
Before Potluck meets real people, I want one list of what stays human. Start from four doors: merging a migration, production settings and secrets, restoring a backup, the launch. Add any other the repo names: ready-for-human tickets, open and closed, with their reason lines; landing.md; .claude/settings.json; the claude-build workflow; the ADRs. Write docs/agents/what-stays-human.md: one table, a row per one-way door, why a revert can't undo it, and what enforces it today (a guard, a written rule, or nothing yet). Point to it from CLAUDE.md in one line. Then in claude-build.yml, deny the unattended run edits to the files behind those doors and refuse ready-for-human tickets. Prove the deny on a scratch copy with a headless run using its flags. Don't land it yet.
```

Why each part is there:

- **"Start from four doors"** names the doors we already keep, so the list can't miss them. Without it, a session tends to list
  what the repo talks about most and skip what lives outside it (backups, the launch).
- **"Any other the repo names"** sends it to the evidence: tickets with their reason lines, the landing rule, the settings file,
  the workflow, the decision records.
- **"What enforces it today (a guard, a written rule, or nothing yet)"** makes every row honest. "Nothing yet" is an answer.
- **"Prove the deny on a scratch copy with a headless run using its flags"**: a fence nobody tested is a guess. The scratch copy
  keeps the test away from your checkout, and "its flags" means the workflow's own arguments, not a hand-made version.
- **"Don't land it yet"** leaves room to read it first.

What came back (7 min 41 s of real time): `docs/agents/what-stays-human.md` with ten one-way doors; one line in `CLAUDE.md`; in
`claude-build.yml`, a first step that refuses `ready-for-human` tickets, `Edit(/…)` denies for the files behind the doors, and
`git rm` denied outright. Its test: the first run denied everything, controls included, and Claude called that a broken test
(its wrapper had split the flags, so the run had none). After the fix: all 23 protected attempts denied, both controls allowed.
Nothing committed. Three honest limits at the end (unattended runs can't touch migrations, dependencies or deleted files any
more; the shell-command denials prove little, since those commands aren't on the allowed list anyway; attended sessions aren't
bound).

## 2. The table, from the file (typed: `prompts/show-the-table.txt`)

```
Show me the table from the file.
```

A summary is Claude's memory of the file; this asks for the file. What came back (47 seconds): the table section, then each door
row by row: why a revert can't undo it and what enforces it today. At the end, one claim it flagged itself: it hadn't checked
Vercel's docs for "someone else can claim a released `vercel.app` name".

## 3. Drop the guess, then land it (typed: `prompts/land-it.txt`)

```
Drop the unchecked claim, then land it. No deploy link.
```

A rule file that agents read can't carry a guess, so the claim goes before the change lands. "No deploy link" keeps the deploy's
address off the screen; the deploy is checked afterwards from its status. What came back (12 min 49 s of real time): the row
edited, Prettier, a commit whose hook failed twice for memory on the recording machine and then passed with four test workers
(309 tests), the push, a pull request body written with the `pr` skill, pull request #62, no migration files in the diff (a
two-way door), auto-merge queued, the required check passed after 5 min 43 s, and the merge into `main`.
