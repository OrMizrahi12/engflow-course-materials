# Student kit: Lesson 8.2, /implement-spec

One Claude Code session builds a whole spec. Potluck's spec #1 has five open tickets that are ready for an agent: #5, #6, #7,
#8 and #10, linked by "blocked by" edges into a task graph. `/implement-spec` runs one orchestrator session that starts an
implementer sub-agent for every ticket on the frontier, each in its own worktree and branch, building test-first. When a
ticket is done, a merger sub-agent merges it into one integration branch, and the frontier moves. At the end it reviews the
whole branch once, has one implementer fix what the review found, runs focused checks, and hands back a single pull request.
That pull request carries a migration, so you merge it yourself, through the same gate as any other.

The run on camera took 2 h 43 min for the orchestrator (2 h 52 min from the prompt to the deploy check), with 14 sub-agents,
all on Opus 5.5. The order came from what had merged, not from GitHub: #5 and #6 first, #7 and #8 once #6 had merged, then #10.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/frontier-loop.sh` | the loop that prints `ready` or `blocked by #N` for every ticket labelled `ready-for-agent` |
| `prompts/implement-spec-p1.txt` | the whole prompt: `/implement-spec #1.` and the lines that adapt the run to GitHub |
| `prompts/confirm-deploy.txt` | the line sent to the orchestrator after you merge the pull request |
| `implement-spec.md` | the card: what goes in, what comes out, the task graph and the frontier, collisions at merge time, when not to use it |
| `when-to-use-implement-spec.md` | one page: when to reach for `/implement-spec`, and the three lines a GitHub run needs |
| `potluck-at-lesson-8.2.md` | what the Potluck repository holds at the tag `lesson-8.2`: pull request #30, its files, the open decisions |
| `potluck/drizzle/0003_settlements.sql` | the migration pull request #30 added (from ticket #6), as it is at the tag |

The card is also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 8.1: the spec #1 with its tickets labelled `ready-for-agent` and their
  "blocked by" links on GitHub (lesson 5.3), the setup command `npm run setup:worktree` and `.worktreeinclude` (lesson 8.1).
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325), in auto mode. In default
  mode you approve each command as it comes, and a run this long asks many times.
- A local Postgres, as set up in lesson 6.2: every implementer's worktree gets its own database on it.
- One terminal window for your own commands (the main checkout, `~/potluck`) and one more for the run.

## The steps, as on camera (Ubuntu)

**1. Close what lesson 8.1 left.** In each of 8.1's three session windows: `/exit`, then Down and Enter on
"Remove worktree", then `exit`. Claude Code warns that the branch has commits (3, 8 and 19). They are already on `main`
inside the merge commits, so removing the worktree loses nothing. The biggest one took almost two minutes to remove.

**2. What is left.** In the main checkout:

```bash
git worktree list
```

The three worktrees are gone. The rest belong to older lessons; the ones marked `locked` still have a session open.

**3. The frontier.** Paste `prompts/frontier-loop.sh` (on camera, Up brought it back from lesson 8.1). It printed
`#5 ready`, `#6 ready`, `#7 blocked by #6`, `#8 blocked by #6`, `#10 blocked by #7 #8`: three waves. Then:

```bash
gh issue list -l ready-for-human
```

#11 (real backups before launch) and #12 (gate merges with four checks and protect production) need your accounts and keys,
so they stay with you. The run gets the five `ready-for-agent` tickets.

**4. Read the skill in place.** The plugin's files are on your disk:

```bash
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1
sed -n '7,17p' skills/engineering/implement-spec/SKILL.md
sed -n '19,30p' skills/engineering/implement-spec/SKILL.md
sed -n '32,40p' skills/engineering/implement-spec/SKILL.md
```

The goal (the whole spec on one integration branch), the idea (the tickets are a task graph, so there is always a frontier;
implementers run in the background), and the nine steps: integration branch, a draft pull request after the first merge, an
implementer per ticket in its own worktree (test-first, and it merges the integration branch into its own before it reports),
a merger per finished ticket, more implementers when the frontier changes, one code review at the end and one implementer
for all its fixes, then clean-up of the worktrees.

**5. Three warnings from its docs page.**

```bash
grep -A2 "Blocked tickets never start" docs/engineering/implement-spec.md
grep -o "Worktrees don't remove collisions[^.]*\.[^.]*\." docs/engineering/implement-spec.md
grep -o "One user reported a five[^.]*\.[^.]*\." docs/engineering/implement-spec.md
cd ~/potluck
```

On GitHub a ticket stays "blocked" until its blocker closes, and tickets close when the pull request merges at the very end,
so the run must track what has merged into the integration branch itself. Worktrees postpone collisions to merge time. And a
second broad review can turn the end of a run into hours: ask for focused checks on the fixes, then stop.

**6. Start the orchestrator.** A new window (Ctrl+Shift+N) from the up-to-date main checkout:

```bash
claude -w spec-v1
```

The header shows Opus 5.5 and the new worktree, `~/potluck/.claude/worktrees/spec-v1`; the main checkout never moves. Type
`/implement-spec`, pick the `mattpocock-skills:implement-spec` row, type `#1.` and paste the rest of
`prompts/implement-spec-p1.txt`. Before you send it: five tickets, how many implementers will it start first?

**7. The run.** It read `docs/agents/landing.md`, the spec and every ticket, asked GitHub for the blocking edges, checked how
migrations are numbered, ran the setup command in its own worktree, and answered: the frontier is #5 and #6, and
`worktree-spec-v1` is the integration branch. Two background agents: "Implement ticket #5", "Implement ticket #6". On camera:

- 26 min 37 s: #6 done (it adds `drizzle/0003_settlements.sql`), handed to a merger. It flagged a decision for later: a
  suggested settlement can be bigger than the cap on a single settlement.
- 2 min later, #6 is on the integration branch: "Frontier is now {#7, #8}". It started a merger for #5 and implementers for
  #7 and #8, and opened draft pull request #30.
- #5's merge: the merger also fixed #6's settle-up browser test, which now has to answer "who are you?" first (ticket #5 added
  that question). Commit `4c88fc1`.
- 41 min later: #8 done, no migration. Before merging it, the orchestrator sent #7's still-running implementer the reason code
  #8 uses for a stale edit (`stale-version`), so both refuse it the same way. #8 merged; the check passed with 146 tests.
- #7 took 1 h 6 min 53 s, the longest ticket. It had already merged the integration branch into its own; its merger landed
  it (185 tests), and #10 started.
- #10 (seed data for every edge case) took 32 min 7 s, with no migration, and handed over a re-seed step for Neon's
  `development` branch with a placeholder for the connection string. All five on the integration branch: 196 tests, the seed
  loads.

**8. Look from outside while it runs.** In the main checkout:

```bash
git worktree list
git log --oneline -5 worktree-spec-v1
for n in 6 7 8; do echo "#$n $(gh issue view $n --json state -q .state)  blocked by: $(gh api repos/{owner}/{repo}/issues/$n/dependencies/blocked_by -q 'map(select(.state=="open")) | map("#\(.number)") | join(" ")')"; done
```

Four agent worktrees, each on its own branch, next to `spec-v1`. The integration branch has the merge of #6 (and #5 on top).
GitHub still says #6 is open and #7 and #8 are blocked by #6, while #7 is already running: the run counts merges, GitHub
counts closed issues.

**9. How they got there.** Once all five are in:

```bash
git log --oneline --graph --merges main..worktree-spec-v1
git show --stat --format="%h %s" 4c88fc1
git show --remerge-diff --stat --format="%h %s" aa27b39
git show --remerge-diff --stat --format="%h %s" 6a33da0
```

The merges in order (#6, #5, #8, #7, #10), #7's branch merging the integration branch before it reported, the small fix from
#5's merge, and what two merges had to resolve by hand: `globals.css` in #5's merge, and `expense-form.tsx` and
`src/group/service.ts` when #7's branch took in #8. Collisions at merge time, as the docs warned.

**10. One review.** The orchestrator loaded `mattpocock-skills:code-review` (the plugin's copy; the worktree also had the team
copy from lesson 7.5, and both review along the same two axes). The fixed point: `main`, 51 commits and 80 files. Standards
(53 s) found one minor hard finding (Avoid-list words in comments and a test name); Spec (3 min 2 s) found a real bug (the edit
link of a deleted expense said "No group at this link" and the device then forgot a live group). One implementer fixed five
things in its own worktree; three items stayed for you. Then focused checks: the first run failed 7 service tests while a dev
server compiled on a busy machine; it checked the failures, reran with fewer workers (172 passed), then 12 browser tests. The
`pr` skill wrote the body, pull request #30 was marked ready, the six implementer worktrees and their branches were removed.
Name the review skill you want in your prompt if you have your own copy.

**11. The final reply.** Order of work, the review's fixes, the checks, and four decisions for you: the settlement cap,
deleting a group in the database, two words not in the glossary yet ("entry" and "claim"), and re-seeding Neon's
`development` branch. Lesson 8.3 turns them into tickets.

**12. Land it.** In the main checkout:

```bash
gh pr view 30 --json state,isDraft,mergeStateStatus,closingIssuesReferences --jq '{state, isDraft, mergeStateStatus, closes: [.closingIssuesReferences[].number]}'
gh pr diff 30 --name-only | grep '^drizzle/'
gh pr checks 30
gh pr merge 30 --merge
```

It closes 5, 6, 7, 8 and 10, it is no longer a draft, and its merge state is `CLEAN`. It adds
`drizzle/0003_settlements.sql`, its snapshot and the journal: a migration, so `landing.md` says a person merges it. All three
checks passed (type check, lint and service tests; Vercel's preview deploy; Vercel's preview comments). Merged with a merge
commit: `18cb54a`.

**13. The deploy.** In the orchestrator's window, paste `prompts/confirm-deploy.txt`. Vercel reported success for `18cb54a`;
migrations run inside the build and a failed one fails it, so `0003_settlements` is in production. #5, #6, #7, #8 and #10 are
closed; the spec #1 stays open. The re-seed of Neon's `development` branch is yours (connection pooling off; never paste the
connection string into a chat).

**14. One last look.**

```bash
git pull -q
git log --oneline --first-parent -3
gh issue list -l ready-for-agent
gh issue list -l ready-for-human
git worktree list
```

Pull request #30 on top, then #29 (tag `lesson-8.1`). No `ready-for-agent` issues left; #12 and #11 are still yours. The
implementer worktrees are gone; `spec-v1` stays while its session is open.

## Pause and try

In your own Potluck clone: list your frontier, start one worktree session from an up-to-date main checkout, and run
`/implement-spec` on your spec with the same three added lines (the frontier from merges, one review and then focused checks,
no merge to main when there are migrations). While it runs, compare the integration branch's log with GitHub's "blocked by"
list. Then land the pull request through your gate.

**Checkpoint (it's working if):** the first wave is exactly your frontier; a blocked ticket starts as soon as its blocker has
merged into the integration branch, while GitHub still shows it blocked; each implementer works in its own worktree and
database; the review runs once, on the whole branch, followed by one round of fixes and focused checks; and the single pull
request closes every ticket of the run, leaves the spec open, and is merged by you when it carries a migration.

## If something goes differently

- **Your frontier is wider or narrower.** Expected: it depends on your tickets and their links. The run starts whatever has
  nothing open in its way.
- **A blocked ticket never starts.** That is the GitHub problem from the docs: check that your prompt says to compute the
  frontier from what has merged into the integration branch.
- **A merge conflicts or a test breaks at a merge.** The merger resolves it on the integration branch and runs the check; the
  final reply lists what it changed. Read it before you merge.
- **The service tests fail on the first run.** On a loaded machine, check the reasons before you believe them; a rerun with
  fewer workers is the honest test.
- **The review calls a different copy of the skill than you expected.** Name the one you want in the prompt.
- **The pull request is behind `main` when you land it.** `gh pr update-branch 30`, and let the check run again.
- **Usage.** A run like this is long and expensive (see below). Try it on a small spec first.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. On macOS the plugin cache is in the
same place, `~/.claude/plugins/cache/`. A new window for the orchestrator can also be a new tab.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-8.2` points at
`18cb54a`, the merge of pull request #30 on `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-8.2.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. This run is the most
  expensive in the course so far: the orchestrator and its 14 sub-agents wrote just under a million output tokens, all on
  Opus 5.5, over 2 h 43 min.
- Git worktrees, Postgres, Node, npm, `gh`, GitHub Actions on a public repository, Playwright and the skills (open source,
  MIT License) are free.
- Vercel deployed the merge to production, as set up in lesson 6.2 (Vercel's free Hobby plan is for non-commercial use).
  Neon's free plan holds the databases.

## Credits

The `implement-spec`, `code-review`, `tdd` and `pr` skills and the docs lines quoted above are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. They are described here in
our own words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
