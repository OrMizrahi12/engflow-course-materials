# Student kit: Lesson 11.2, What stays human

Lesson 11.1 let a label start unattended work on Potluck. Before Potluck meets real people, this lesson writes down what never
goes to that run: the **one-way doors**, the acts a revert can't undo. We find the doors we already keep (the `ready-for-human`
tickets and their reason lines, the landing rule for migrations, the deny rules in the settings file), then a fresh worktree
session writes them into one list, `docs/agents/what-stays-human.md`: ten doors, each with why a revert can't undo it and what
enforces it today. The same session fences the unattended workflow: it refuses `ready-for-human` tickets, and its deny list
takes away edits to the files behind the doors. A headless test on a scratch copy proves the fence with two harmless control
files. We drop the one claim nobody had checked, and the change lands as a two-way door: auto-merge on its required check.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted to Claude in the lesson, in order, with what came back |
| `prompts/list-what-stays-human.txt` | the brief, as pasted (one line) |
| `prompts/show-the-table.txt` | the second prompt, as typed |
| `prompts/land-it.txt` | the third prompt, as typed |
| `test-the-fence.md` | how to prove a deny rule on a scratch copy, with controls, and what the test can't prove |
| `what-stays-human.md` | the card: one-way and two-way doors, the list, the fence, the seatbelt and the wall |
| `potluck/docs/agents/what-stays-human.md` | the list as it landed: ten one-way doors, the ticket map, adding a door |
| `potluck/.github/workflows/claude-build.yml` | the unattended workflow as it landed: the refusal step and the new deny list |
| `potluck/CLAUDE.md` | Potluck's CLAUDE.md with the new "What stays human" line |

The three Potluck files are copied from the repository at tag `lesson-11.2` (commit `39a76fc`, the merge of pull request #62).
Your list will differ: other doors, other wording, maybe nine rows or twelve. What should match is the shape: one row per door,
a reason a revert can't undo it, an honest "nothing yet" where nothing enforces it, and a deny for every file behind a door,
proved by a test that has controls.

## Before you start

- Potluck as lesson 11.1 left it: `main` at the tag `lesson-11.1`, clean, with the `claude-build` workflow merged and a
  "Protect main" ruleset with one required check. Clone the course's Potluck repository and check out `lesson-11.1` if you're
  catching up; never fork it. To land this lesson's change the way it lands on camera, auto-merge must be allowed in your
  repository's settings (lesson 6.3).
- Some issues labelled `ready-for-human`, each with a reason line at the top of its body (on camera: #2, closed, and #11, #12,
  #31 to #34, #37). If your copy has none, label one or two real tickets of your own first.
- Claude Code with the `mattpocock-skills` plugin (Claude Code 2.1.326 on camera, Opus 5.5), in auto mode, and `gh` signed in.
- In your copy of the workflow, `include_comments_by_actor` names the GitHub login allowed to steer the run: put your own.

Free: `git`, `gh`, GitHub Actions on a public repository, the skills. Not free: the Claude plan (Pro or higher). The first
turn is the heavy one: about seven and a half minutes, and its test starts nested headless Claude runs, which count against
the same plan. Vercel Hobby is free for non-commercial use only; the list itself names that as a door.

## Windows (WSL), macOS, Linux

Nothing differs: everything runs in the terminal. On Windows run Claude Code, `git` and `gh` inside WSL (Ubuntu), in the folder
where your Potluck lives. `jq`-style filters run inside `gh` (`--jq`), so nothing else needs installing. `less` (the pager of
`git diff`) is there on all three.

## The steps, as on camera (Ubuntu)

**1. The doors we already keep.** In your own shell, in the Potluck folder:

```bash
gh issue list --label ready-for-human --state all
gh issue list --label ready-for-human --state all --json number,body --jq '.[] | "#\(.number) \(.body | split("\n")[0] | sub("^[^.]*\\. "; ""))"'
grep --color=never -n "Migration PRs" docs/agents/landing.md
cat .claude/settings.json
```

Eight tickets (open and closed). The second command prints the first line of each ticket's body, its reason line, with the
first sentence cut. Every reason points outside the code: a production database, an account, a decision, a page real people
can open. `landing.md` keeps the migration rule from lesson 6.3 (a pull request that adds a file under `drizzle/` is left for a
human to merge). The settings file keeps the three locks: no force push, no push to `main`, no hard reset.

**2. A fresh worktree session.** A new terminal tab, in the Potluck folder:

```bash
claude -w what-stays-human
```

Paste the brief (`prompts/list-what-stays-human.txt`) and send it. On camera the turn took 7 min 41 s of real time. It read the
workflow, the decision records, the eight tickets, the spec, the migration scripts and the `main` ruleset, then wrote the doc,
the `CLAUDE.md` line and the workflow changes. Some of its commands come back red: a worktree session refuses git commands too
complex to check, and Claude splits them up.

The test it wrote is the part to watch. Its first run denied **everything**, the two harmless control files included. Claude
read that as a broken test, not a strong fence: its wrapper had split the flags, so the run had none. It fixed the script and
reran: 23 protected writes denied, both controls allowed. Then it read the action's own source, found that the action hands the
run a `git rm` command the file rules don't reach, and denied `git rm` outright.

**3. Read the answer.** Scroll up to the top of the reply: the list is written, the workflow refuses `ready-for-human` tickets
and denies edits to the protected files, and nothing is committed. Before landing, it names three honest limits:

- unattended runs can no longer touch migrations, dependencies or deleted files, so those tickets need a person or an attended
  session;
- the shell-command denials prove little, because those commands aren't on the run's allowed list anyway;
- attended sessions aren't bound by any of this: nothing checks that a migration only adds, and nothing stops an attended
  session from queuing auto-merge on one.

**4. The table, from the file.** Type `Show me the table from the file.` (47 seconds on camera). Ten doors: the four we started
with (merging a migration, production settings and secrets, restoring a backup, the launch) and six it found in the repo
(loosening the guardrails, rewriting `main`'s history, copying production data out, seeding production, changing the production
URL or the link shape, making money on Vercel Hobby). At the end, Claude flags one claim it did not check: that someone else can
claim a released `vercel.app` name.

**5. My call: drop the guess.** A rule file that agents read can't carry a guess: whoever reads it next treats every row as
checked. So the claim goes, and the rest of the row stays.

**6. Read the fence yourself.** In your own shell (Tab completes the path):

```bash
cd .claude/worktrees/what-stays-human
git status --short
git diff .github
```

Three files: the workflow and `CLAUDE.md` modified, the new doc untracked. In the diff (`space` for the next page, `q` to quit):
the new first step refuses a `ready-for-human` ticket and exits with 1 before checkout; the comment explains the fence; the
denied list grows from `Agent,Task,Bash(gh pr merge:*)` to `git rm` plus one `Edit(/…)` rule per path. A leading slash means the
path counts from the repo's root; `**` means everything under that folder, at any depth. `Edit` rules also cover the `Write`
tool.

**7. Land it.** Back in the session, type `Drop the unchecked claim, then land it. No deploy link.` On camera this took 12 min
49 s of real time: it edited the row, ran Prettier and committed. The commit hook failed twice because test workers were killed
for memory on the recording machine; Claude checked the free memory and reran with four workers, and all 309 tests passed, with
the hook still running, not skipped. It wrote the pull request body with the `pr` skill, opened #62, checked the diff for
migration files (none, so a two-way door) and queued auto-merge. The required check took 5 min 43 s, then auto-merge fired.

**8. On `main`.** Back in your own shell:

```bash
cd ~/potluck
git pull
gh api repos/{owner}/{repo}/commits/main/status --jq .state
git ls-files src e2e scripts | xargs cat | wc -l
gh pr list --state merged --limit 30
grep -n "What stays human" CLAUDE.md
sed -n '/## Ready-for-human/,$p' docs/agents/what-stays-human.md
```

A fast-forward with three files; the deploy status `success` (its state only, so no link is printed); 15,649 lines on camera;
"Showing 23 of 23" merged pull requests; the new `CLAUDE.md` line; and the doc's ticket map and "Adding a door".

## Side effects

- One branch, `worktree-what-stays-human`, one pull request (#62 on camera), auto-merged on its required check; GitHub deletes
  the branch on merge. One production deploy of the merge.
- A worktree under `.claude/worktrees/what-stays-human` with its own dependencies and local database (from `npm run
  setup:worktree`). Remove it with `git worktree remove` when you're done with the session.
- The test's scratch copy and scripts live in the session's scratch folder, outside the repository.
- No issue, label, secret or repository setting changes.

## Pause and try

On your own copy, list your own doors: your `ready-for-human` tickets with their reasons, your landing rules and your deny
rules. Ask a fresh worktree session for a what-stays-human file, with the brief in `prompts/list-what-stays-human.txt`. Add the
refusal step and the `Edit` denials to your workflow. Then prove the deny with a headless run on a scratch copy, with two
controls, before you land it (`test-the-fence.md`). You're done when a protected write is denied, both controls are allowed,
and every row of your list says what enforces it today, or "nothing yet".

---
The `pr` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License, used as
published and described here in our own words. "Dark factory" and his definition of vibe coding are his terms, described in
our own words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
