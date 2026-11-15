# Student kit: Lesson 8.1, Three tickets at once

Three Claude Code sessions work on three Potluck tickets at the same time, each in its own git worktree with its own dev
server port and its own local database. First we find the frontier (the open tickets with nothing open in their way): it is
two tickets wide, #4 and #9, so a third, #23, comes out of triage. A worktree separates the files, but not the port, the
database, the ignored files or the installed packages, so one small session builds `npm run setup:worktree` and
`.worktreeinclude` first. Then `claude -w` starts the three sessions; each runs the setup command without being told. They
land in turn: #27 merges cleanly, #28 is behind `main` and gets `gh pr update-branch`, and #29 (a migration) hits a real merge
conflict, which its own session resolves in its own worktree before it is merged by hand.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/frontier-loop.sh` | the loop that prints `ready` or `blocked by #N` for every ticket labelled `ready-for-agent` |
| `prompts/setup-command.txt` | the request for one setup command per worktree (sent with `/implement` in its own session) |
| `prompts/merge-main.txt` | merge `origin/main` into the branch, show each conflicting hunk before resolving, keep both changes |
| `prompts/push-with-note.txt` | push, note the known test failure on the PR, add the second cause to issue #19 |
| `parallel-worktrees.md` | the card: one ticket, one worktree, one session; the setup step; landing in turn; it's working if |
| `potluck-at-lesson-8.1.md` | what the Potluck repository holds at the tag `lesson-8.1`: the four merges, the new files |
| `potluck/scripts/setup-worktree.mjs` | `npm run setup:worktree` at the tag: install, own database, own port, written to `.env.local` |
| `potluck/.worktreeinclude` | one line, `.env.local`: the ignored file Claude Code copies into every new worktree |
| `potluck/CLAUDE.md` | `CLAUDE.md` at the tag, with the new "Worktree setup" line |
| `potluck/verify-SKILL.md` | the project's verify skill at the tag (`.claude/skills/verify/SKILL.md`), now starting with the setup command |
| `potluck/landing.md` | `docs/agents/landing.md`, the landing procedure from lesson 6.3, unchanged |
| `potluck/src/group/limits.ts`, `potluck/e2e/helpers.ts` | the two files that conflicted, as resolved |

The card is also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 7.5, with tickets labelled `ready-for-agent` and their "blocked by" links on
  GitHub (lesson 5.3).
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325), in auto mode. In default
  mode you approve each command as it comes.
- A local Postgres, as set up in lesson 6.2: the setup command creates one database per worktree on it.
- One terminal with two tabs for your own commands, and a window for each session.

## The steps, as on camera (Ubuntu)

**1. Start of the day: the main checkout.** In `~/potluck`:

```bash
git status -sb
git pull -q
git log --oneline -1
```

It was `behind 47`: every pull request merged on GitHub, and this folder never pulled. It matters because `claude -w` starts
each new worktree from the remote's `main`, and copies files into it from the folder you start in. After the pull, the last
commit is the merge of pull request #25 (tag `lesson-7.5`).

**2. Tidy the worktrees.**

```bash
git worktree list
git worktree remove .claude/worktrees/dev-logs
git worktree list
```

`dev-logs` belonged to a pull request merged lessons ago. The ones marked `locked` belong to sessions that are still open:
Claude Code locks a worktree while its session runs, so leave them.

**3. The frontier.** Paste `prompts/frontier-loop.sh`. On camera: `#4 ready`, `#5 blocked by #4`, `#6 blocked by #4`,
`#7 blocked by #4 #6`, `#8 blocked by #6`, `#9 ready`, `#10 blocked by #7 #8`. Two tickets wide.

**4. A third ticket from triage.**

```bash
gh issue list -l needs-triage
gh issue view 23 | sed -n '/^## Done when/,/^## Browser/p'
gh issue edit 23 --remove-label needs-triage --add-label ready-for-agent
```

#19 (the dev server reloading the page in a loop) has no confirmed cause, so it stays in triage. #23 (an unknown group link
logs a dev error) has a "Done when" a session can test by itself: an unknown and a malformed link both answer 404 with "No
group at this link", in dev and in a production build, with no server or browser error.

**5. Why not three sessions in one folder.** The plugin's own docs say it:

```bash
grep -o "Running several.\{0,500\}" ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/docs/engineering/implement.md | fold -s -w 96
```

Several `/implement` sessions in one checkout share one working directory, one index and one HEAD; the stash is shared even
across worktrees. And Potluck's verify skill showed what a worktree alone doesn't separate:

```bash
sed -n '/^## 1. Run/,/^Done when/p' .claude/skills/verify/SKILL.md
```

Port 3100 for every worktree, and "the local `potluck` database is shared by every checkout".

**6. The setup command, in its own session.** In a second tab: `claude -w worktree-setup`, then `/implement` and paste
`prompts/setup-command.txt`. The turn took 8 min 48 s. It tried the command on two fresh worktrees at once (each got its own
database and port, the browser test passed in both, the shared database was untouched), then again with port 3100 busy and a
copied-in `PORT=3000`. Three commits, the pre-commit hook on each. Then: `Push it and land it the way landing.md says.` Pull
request #26 merged by auto-merge once the required check passed; Vercel's production deploy succeeded.

**7. Leave the session.** `/exit` asks whether to keep or remove the worktree. The three commits it warns about are already on
`main` inside the merge, so "Remove worktree" loses nothing. `exit` closes the tab.

**8. The main checkout hands out `.env.local`.** Back in the first tab:

```bash
git pull -q
git log --oneline -1
cat .worktreeinclude
cp .env.example .env.local
ls -a | grep env
```

Claude Code reads `.worktreeinclude` in the folder a session starts from and copies those ignored files into each new
worktree, so the main checkout needs its own `.env.local` (a local database address, no secrets; don't print yours). The
setup command then rewrites only the database and port lines in each copy.

**9. Three sessions.** For each ticket, a new window (Ctrl+Shift+N), then:

```bash
cd ~/potluck
claude -w group-link-error
```

and `/implement #23` (the menu row is `/mattpocock-skills:implement`). The same with `claude -w privacy` and `/implement #9`,
and `claude -w expenses` and `/implement #4`. Each session read the ticket and ran `npm run setup:worktree` before anything
else, because `CLAUDE.md` now says so. On camera: #23 took 5 min 5 s, #9 11 min 17 s, #4 19 min 28 s.

**10. Land in turn.** In #23's window: `Push it and land it the way landing.md says.` Pull request #27 merged once its check
passed, and the merge closed #23. Then the same line in #9's window: pull request #28 was behind `main` (the first merge had
moved it), so the session ran `gh pr update-branch`, the check ran again, and auto-merge landed it. #4 adds a migration, so:
`Open the PR the way landing.md says, then stop.` Pull request #29 opened without auto-merge.

**11. The conflict.** In the first tab: `gh pr list --json number,title,mergeStateStatus` showed #29 as `DIRTY`, a conflict
GitHub can't resolve by itself. In #4's window, paste `prompts/merge-main.txt`. The merge stopped on `src/group/limits.ts`
(both sides set the description limit to 100) and `e2e/helpers.ts` (both branches created it; the same three helpers, plus
this branch's `createGroup`). The session showed each hunk first, then kept both changes; `npm run check` passed with 87 tests
and the merge was committed. 3 min 8 s.

**12. The browser tests, then push.** `Run the browser tests, then push.` It didn't push: 19 of 20 failed under the reload loop
of issue #19, and it found a second trigger (Playwright's output inside the project). With that output moved outside, 18 of 20
passed; the 2 failures (#9's logs test) fail the same way on unmodified `main`. It asked: push now with a note, or hold? Our
call: push. Paste `prompts/push-with-note.txt`.

**13. Merge by hand.** In the first tab:

```bash
git fetch -q
git log --graph --oneline -6 origin/worktree-expenses
gh pr checks 29 --watch
gh pr merge 29 --merge
gh pr view 29 --json state,mergeCommit
```

`MERGED`, merge commit `8c2522d`. Then in #4's window: `I merged it. Confirm the deploy the way landing.md says.` Vercel
reported success, and since the migration runs inside the build, the new tables are in production.

**14. The next frontier.** `git pull -q`, `git log --oneline --first-parent -4` (#29, #28, #27, #26), and the frontier loop
again: `#5 ready`, `#6 ready`. Lesson 8.2 starts there.

## Pause and try

In your own Potluck clone: list your frontier with the loop, pull the main checkout, and start two `claude -w` sessions on two
unblocked tickets. Check that each one runs the setup command and gets its own port and database. Land the first, then bring
the second up to date and resolve whatever it hits.

**Checkpoint (it's working if):** each session works in its own folder under `.claude/worktrees/`, on its own branch; two dev
servers run at once on different ports with different databases, while your own `potluck` database stays untouched; the
second pull request is brought up to date (or merged with `main` in its own worktree) and passes its check before it merges;
and a pull request with a migration is merged by you, not by auto-merge.

## If something goes differently

- **`claude -w` starts from an old `main`.** It branches from the remote's default branch; run `git fetch` (or pull the main
  checkout) first.
- **A session doesn't run the setup command.** Check that `CLAUDE.md` has the "Worktree setup" line, or ask it to run
  `npm run setup:worktree` first.
- **`.env.local` is missing in a new worktree.** `.worktreeinclude` copies only files that exist in the folder the session
  starts from: create the main checkout's `.env.local` from `.env.example`.
- **Your frontier differs.** Expected: it depends on your tickets and their "blocked by" links. The point is the same: start
  only tickets with nothing open in their way.
- **`mergeStateStatus` is `BEHIND`, not `DIRTY`.** Git can combine the two: `gh pr update-branch` and let the check run again.
- **The browser tests reload over and over.** That is issue #19 on Potluck: run them with Playwright's output outside the
  project, as the session did.
- **Removing a worktree at `/exit` warns about commits.** Check they are on `main` first (`git log --oneline main | head`);
  if not, keep the worktree.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. New windows and tabs work the same
in any terminal; you can also run each session in its own tab.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-8.1` points at
`8c2522d`, the merge of pull request #29 on `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-8.1.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. Sessions side by side
  multiply your usage: the four sessions in this lesson wrote about 520,000 output tokens, all on Opus 5.5.
- Git worktrees, Postgres, Node, npm, `gh`, GitHub Actions on a public repository, Playwright and the skills (open source,
  MIT License) are free.
- Vercel deployed each merge to production, as set up in lesson 6.2 (Vercel's free Hobby plan is for non-commercial use).

## Credits

The `implement` and `pr` skills and the quoted docs line are from [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock, under the MIT License. They are described here in our own words. This course is independent: unofficial,
and not affiliated with or endorsed by Matt Pocock.

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
