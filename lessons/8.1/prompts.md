# Lesson 8.1: every line, in order

Where each line was typed, and what came back. "Tab 1" is the main checkout (`~/potluck`); windows A, B and C are the three
sessions.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | tab 1 | `git status -sb` | `## main...origin/main [behind 47]` |
| 2 | tab 1 | `git pull -q`, then `git log --oneline -1` | `d58cb50 (HEAD -> main, tag: lesson-7.5, ...) Merge pull request #25 ...` |
| 3 | tab 1 | `git worktree list` | the main checkout, `dev-logs`, and four worktrees marked `locked` (open sessions) |
| 4 | tab 1 | `git worktree remove .claude/worktrees/dev-logs`, then `git worktree list` | `dev-logs` gone |
| 5 | tab 1 | `prompts/frontier-loop.sh` (pasted) | `#4 ready`, `#5 blocked by #4`, `#6 blocked by #4`, `#7 blocked by #4 #6`, `#8 blocked by #6`, `#9 ready`, `#10 blocked by #7 #8` |
| 6 | tab 1 | `gh issue list -l needs-triage` | #19 (dev server reloads the page in a loop), #23 (unknown group link logs a dev error) |
| 7 | tab 1 | `gh issue view 23 \| sed -n '/^## Done when/,/^## Browser/p'` | the "Done when" section: 404 with "No group at this link", no server or browser error |
| 8 | tab 1 | `gh issue edit 23 --remove-label needs-triage --add-label ready-for-agent` | the issue's link |
| 9 | tab 1 | `grep -o "Running several.\{0,500\}" ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/docs/engineering/implement.md \| fold -s -w 96` | the docs passage: several `/implement` sessions in one checkout "is worse than unsupported" |
| 10 | tab 1 | `sed -n '/^## 1. Run/,/^Done when/p' .claude/skills/verify/SKILL.md` | the verify skill's step 1: port 3100, the shared `potluck` database |
| 11 | tab 2 | `claude -w worktree-setup` | a session in `~/potluck/.claude/worktrees/worktree-setup` (Opus 5.5) |
| 12 | tab 2 session | `/implement` + `prompts/setup-command.txt` | 8 min 48 s: `npm run setup:worktree`, `.worktreeinclude`, three commits |
| 13 | tab 2 session | `Push it and land it the way landing.md says.` | 1 min 47 s: PR #26 merged by auto-merge (`a97dc21`), deploy success |
| 14 | tab 2 session | `/exit`, then Down, Enter (Remove worktree); `exit` | "Worktree removed. 3 commits on worktree-worktree-setup were discarded." (they are on `main`) |
| 15 | tab 1 | `git pull -q`, `git log --oneline -1` | `a97dc21 ... Merge pull request #26 ...` |
| 16 | tab 1 | `cat .worktreeinclude` | `.env.local` |
| 17 | tab 1 | `cp .env.example .env.local`, then `ls -a \| grep env` | `.env.example`, `.env.local` |
| 18 | window A | `cd ~/potluck`, `claude -w group-link-error`, `/implement #23` | ran `npm run setup:worktree` first; done in 5 min 5 s, three commits |
| 19 | window B | `cd ~/potluck`, `claude -w privacy`, `/implement #9` | ran the setup command; done in 11 min 17 s, six commits, 14 browser tests |
| 20 | window C | `cd ~/potluck`, `claude -w expenses`, `/implement #4` | ran the setup command; done in 19 min 28 s, 87 service tests, a migration |
| 21 | window A | `Push it and land it the way landing.md says.` | PR #27, auto-merge, merged (`067ec14`), #23 closed, deploy success |
| 22 | window B | `Push it and land it the way landing.md says.` | PR #28 behind `main` → `gh pr update-branch 28` → merged (`877dfeb`), #9 closed, deployed |
| 23 | window C | `Open the PR the way landing.md says, then stop.` | PR #29 opened, no auto-merge: it adds `drizzle/0002_expenses.sql` |
| 24 | tab 1 | `gh pr list --json number,title,mergeStateStatus` | #29, `"mergeStateStatus": "DIRTY"` |
| 25 | window C | `prompts/merge-main.txt` (pasted) | 3 min 8 s: two conflicts shown hunk by hunk, both changes kept, check green, merge commit `46cc900`, not pushed |
| 26 | window C | `Run the browser tests, then push.` | 10 min 38 s: not pushed; 18 of 20 pass; the 2 failures happen on unmodified `main` too; push or hold? |
| 27 | window C | `prompts/push-with-note.txt` (pasted) | pushed `46cc900`, a comment on PR #29, the second cause on issue #19; still a human merge |
| 28 | tab 1 | `git fetch -q`, `git log --graph --oneline -6 origin/worktree-expenses` | the merge commit on top, main's side below it |
| 29 | tab 1 | `gh pr checks 29 --watch` | "All checks were successful" |
| 30 | tab 1 | `gh pr merge 29 --merge`, `gh pr view 29 --json state,mergeCommit` | `"state": "MERGED"`, `8c2522d` |
| 31 | window C | `I merged it. Confirm the deploy the way landing.md says.` | Vercel success for `8c2522d`; the migration ran in the build |
| 32 | tab 1 | `git pull -q`, `git log --oneline --first-parent -4`, `prompts/frontier-loop.sh` | #29, #28, #27, #26; then `#5 ready`, `#6 ready` |
