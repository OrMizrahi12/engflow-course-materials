# Every line typed or pasted in Lesson 9.2, in order

Typed lines are shown as typed; pasted prompts are in `prompts/`. Times are the real waits.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | shell | `cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/wayfinder` (pasted), then `sed -n '103,105p;118,123p' SKILL.md` | the one-ticket rule; "Work through the map", steps 1 and 2 (choose and claim) |
| 2 | shell | `sed -n '124,128p' SKILL.md` | steps 3 to 5 (resolve by label, record, graduate fog) and the parallel-sessions line |
| 3 | new window | `claude -n foreign-amount` | a named session, Opus 5.5, auto mode |
| 4 | foreign-amount | `/wayfinder` from the menu, a space, `41` | `gh issue edit 44 --add-assignee @me`; round 1: convert once and freeze, the rate from Frankfurter (51 s) |
| 5 | foreign-amount | `Yes to both.` | round 2: the rate date, the authoritative amount and its two overrides, show before saving, convert then split, rounding, three words (22 s) |
| 6 | foreign-amount | `Yes to all six.` | one question (no group setting), three threads to graduate, and `GLOSSARY.md` already edited (19 s) |
| 7 | foreign-amount | `prompts/steer-glossary.txt` (pasted) | the glossary reverted, #44 resolved and closed, #47-#50 created and wired, the map line, a memory note (1 min 4 s) |
| 8 | foreign-amount | `/exit` | the resume line |
| 9 | window A | `claude -n wayfinder-a`, then `/wayfinder 41` | claims #45; one question (35 s) |
| 10 | window B (Ctrl+Shift+N) | `claude -n wayfinder-b`, then `/wayfinder 41` | "already claimed, so possibly another session is working on it"; claims #47; round 1 (59 s) |
| 11 | A | `Yes, (a).` | round 2 (24 s) |
| 12 | B | `Yes to all six.` | round 2: caching, who may call the lookup, the wait, two messages (12 s) |
| 13 | A | `prompts/leave-the-lookup.txt` (pasted) | #45 resolved and closed; #48, #49, #50 widened; #47 left alone (48 s) |
| 14 | B | `Yes to all five.` | the proposed resolution, and a request to confirm (12 s) |
| 15 | B | `Yes, post it.` | #47 closed; the map read again before writing; A's line kept (39 s) |
| 16 | A | `/exit` | the resume line |
| 17 | shell | `cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/prototype` (pasted), then `sed -n '8p;12,15p' SKILL.md` | throwaway code that answers a question; logic vs UI |
| 18 | shell | `sed -n '18,20p;54p' UI.md`, then `sed -n '90p;94,96p' UI.md` | sub-shape A; structurally different variants; the bar hidden in production; hand it over as a URL |
| 19 | window A | `claude -w foreign-amount-ui` | a session in its own worktree |
| 20 | prototype session | `/wayfinder` from the menu, a space, `41 50` | claims #50, loads `prototype`, reads the forms, builds (14 min 39 s in all) |
| 21 | window B | `claude -n wayfinder-c`, then `/wayfinder 41` | claims #48; round 1 (53 s) |
| 22 | C | `Yes to all six.` | its understanding, and a request to confirm (7 s) |
| 23 | C | `Yes, post it.` | #48 closed; a comment on #50 (30 s) |
| 24 | browser | the URL from the hand-over, then the variant bar | A, B and C on the group page and the expense form (see `ui-prototype.md`) |
| 25 | prototype session | `prompts/verdict.txt` (pasted) | variant A recorded on #50, closed, a map line; B and C rejected; #48's line kept (33 s) |
| 26 | window B | `claude -n wayfinder-d`, then `/wayfinder 41` | "Frontier is one ticket"; claims #49; six questions (1 min) |
| 27 | D | `Yes to all six.` | #49 closed; all eight tickets closed; a question about writing the spec, left unanswered (42 s) |
| 28 | D | `/exit` | the resume line |
| 29 | prototype session | `/exit`, then "Remove worktree" | "Worktree removed."; the branch is kept |
| 30 | shell | `git fetch -q`, `git ls-remote origin 'prototype/*'`, `gh pr list`, `git log --oneline -1 origin/main` | `prototype/foreign-amount-ui` 545685e; no open pull requests; `2ce5739` (tags lesson-9.1, lesson-8.3) |
