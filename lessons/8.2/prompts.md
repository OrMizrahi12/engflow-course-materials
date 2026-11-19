# Lesson 8.2: every line, in order

Where each line was typed, and what came back. "Shell" is the main checkout (`~/potluck`); windows A, B and C are lesson 8.1's
three sessions; "orchestrator" is the new window running `claude -w spec-v1`.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | window A | `/exit`, then Down, Enter (Remove worktree); `exit` | "Worktree removed. 3 commits on worktree-group-link-error were discarded." (they are on `main`) |
| 2 | window B | the same | 8 commits discarded, already on `main` |
| 3 | window C | the same | 19 commits discarded, already on `main` (the removal took almost two minutes) |
| 4 | shell | `git worktree list` | group-link-error, privacy and expenses gone; older lessons' worktrees, some `locked` (open sessions) |
| 5 | shell | `prompts/frontier-loop.sh` (Up brought it back from lesson 8.1) | `#5 ready`, `#6 ready`, `#7 blocked by #6`, `#8 blocked by #6`, `#10 blocked by #7 #8` |
| 6 | shell | `gh issue list -l ready-for-human` | #12 (gate merges with four checks and protect production), #11 (real backups before launch) |
| 7 | shell | `cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1` | the plugin's own folder |
| 8 | shell | `sed -n '7,17p' skills/engineering/implement-spec/SKILL.md` | the goal, the task graph and its frontier, implementers in the background |
| 9 | shell | `sed -n '19,30p' skills/engineering/implement-spec/SKILL.md` | steps 1-4: read the spec, the integration branch, a draft PR after the first merge, an implementer per ticket in its own worktree |
| 10 | shell | `sed -n '32,40p' skills/engineering/implement-spec/SKILL.md` | steps 5-9: merger, more implementers when the frontier changes, one review and one fixer, clean up |
| 11 | shell | `grep -A2 "Blocked tickets never start" docs/engineering/implement-spec.md` | the tracker only unblocks a ticket when its blocker closes; track merges into the integration branch |
| 12 | shell | `grep -o "Worktrees don't remove collisions[^.]*\.[^.]*\." docs/engineering/implement-spec.md` | worktrees postpone collisions to merge time |
| 13 | shell | `grep -o "One user reported a five[^.]*\.[^.]*\." docs/engineering/implement-spec.md` | a review and fix loop of roughly four hours; ask for focused checks, then stop |
| 14 | shell | `cd ~/potluck` | back in the main checkout |
| 15 | new window | `claude -w spec-v1` | a session in `~/potluck/.claude/worktrees/spec-v1` (Opus 5.5) |
| 16 | orchestrator | `/implement-spec` (menu row `mattpocock-skills:implement-spec`), `#1.`, then `prompts/implement-spec-p1.txt` | reads `landing.md`, the spec, every ticket and its blocking edges; "The frontier is #5 and #6"; two background agents |
| 17 | orchestrator | (waiting) | 26 min 37 s: #6 done (migration `0003_settlements`), merged; "Frontier is now {#7, #8}"; draft PR #30 |
| 18 | shell | `git worktree list` | four agent worktrees, each on its own branch, next to `spec-v1` |
| 19 | shell | `git log --oneline -5 worktree-spec-v1` | `Merge #5` on top of `Merge #6` |
| 20 | shell | `for n in 6 7 8; do ...; done` (README step 8) | `#6 OPEN`, `#7 OPEN blocked by: #6`, `#8 OPEN blocked by: #6`, while #7 is already running |
| 21 | orchestrator | (waiting) | #5 merged (the merger fixed #6's settle-up test, `4c88fc1`); #8 merged (146 tests); #7 merged (185 tests); #10 merged (196 tests, the seed loads) |
| 22 | shell | `git log --oneline --graph --merges main..worktree-spec-v1` | #6, #5, #8, #7, #10; `6a33da0` on #7's branch: it merged the integration branch first |
| 23 | shell | `git show --stat --format="%h %s" 4c88fc1` | "Say who you are first in the settle-up browser test", `e2e/settle-up.spec.ts` |
| 24 | shell | `git show --remerge-diff --stat --format="%h %s" aa27b39` | `src/app/globals.css` resolved in #5's merge |
| 25 | shell | `git show --remerge-diff --stat --format="%h %s" 6a33da0` | `expense-form.tsx` and `src/group/service.ts` resolved where #7 met #8 |
| 26 | orchestrator | (waiting) | `Skill(mattpocock-skills:code-review)`; fixed point `main`: 51 commits, 80 files; Standards and Spec reviews in parallel |
| 27 | orchestrator | (waiting) | one fixer, five fixes; focused checks: 172 service tests, 12 browser tests; PR #30 ready; six worktrees removed; "Churned for 2h 43m 12s" |
| 28 | shell | `gh pr view 30 --json state,isDraft,mergeStateStatus,closingIssuesReferences --jq '...'` | closes 5, 6, 7, 8, 10; `"isDraft": false`; `"mergeStateStatus": "CLEAN"` |
| 29 | shell | `gh pr diff 30 --name-only \| grep '^drizzle/'` | `drizzle/0003_settlements.sql`, `drizzle/meta/0003_snapshot.json`, `drizzle/meta/_journal.json` |
| 30 | shell | `gh pr checks 30` | "All checks were successful": 3 successful |
| 31 | shell | `gh pr merge 30 --merge` | "Merged pull request ... #30"; merge commit `18cb54a` |
| 32 | orchestrator | `prompts/confirm-deploy.txt` | Vercel success for `18cb54a`; `0003_settlements` applied in the build; #5-#10 closed, #1 open; the re-seed step is yours |
| 33 | shell | `git pull -q`, `git log --oneline --first-parent -3` | `18cb54a` (#30), then `8c2522d` (#29, tag `lesson-8.1`) |
| 34 | shell | `gh issue list -l ready-for-agent`, `gh issue list -l ready-for-human` | "no issues match your search"; #12 and #11 |
| 35 | shell | `git worktree list` | the implementer worktrees gone; `spec-v1` still there (its session is open) |
