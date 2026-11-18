# Lesson 9.3: every line, in order

Where each line was typed, and what came back. "Shell" is the main checkout (`~/potluck`); "spec window" is the session that
writes the spec and the tickets (`claude -n mc-spec`); "orchestrator" is the window running `claude -w multi-currency`;
"browser" is GitHub and the Vercel preview.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | browser | reload map #41 | Destination: a spec ready to hand off; Decisions so far: eight lines; Not yet specified: "Writing the spec"; sub-issues 8 of 8 closed |
| 2 | shell | `D=~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/docs/engineering` | the docs folder of the installed plugin |
| 3 | shell | `sed -n 18p $D/to-spec.md` | the row for a cleared map: run `/to-spec` with the map's issue number |
| 4 | shell | `sed -n 66p $D/wayfinder.md \| fold -s -w 118` | `/to-spec` collapses the map's linked decisions into one spec; `/to-tickets` slices it |
| 5 | shell | `sed -n 28p $D/to-spec.md \| fold -s -w 118` | the spec records what you decided; a statement you never made is a defect |
| 6 | shell | `sed -n 63p $D/to-spec.md \| fold -s -w 118` | don't clear or compact between `/to-spec` and `/to-tickets` |
| 7 | spec window | `claude -n mc-spec` | a session in the main checkout, Opus 5.5 |
| 8 | spec window | `/to-spec` (menu row `/mattpocock-skills:to-spec`), `#41` | it reads the map, its eight closed tickets and their comments, spec #1, the glossary and the code; one question: do these four test seams match what you expect? |
| 9 | spec window | Down, Down, Enter: option 3, "Fake rate in Playwright" | issue #51 "Spec: multi-currency groups" published, `ready-for-agent`; four decisions it made while writing |
| 10 | spec window | `prompts/seams-answer.txt` | 33 s: #51 edited (previews call Frankfurter), map #41 "Reached: #51", the map closed with a comment |
| 11 | spec window | `prompts/ci-fix.txt` | 16 s: every browser test uses the fake; it also corrected the same wrong claim in an old note of its own |
| 12 | spec window | `/to-tickets` (menu row), no argument | "The source is spec #51, which I already have in context"; six tracer bullets and a quiz |
| 13 | spec window | Down, Down, Enter: option 3, "Fold 6 into 1 and 3" | five tickets #52 to #56 published as sub-issues of #51, with "blocked by" links: #52 → #53 → #54 → #55 and #56 |
| 14 | spec window | `prompts/take-the-label-off.txt` | 12 s: only #52 to #56 carry `ready-for-agent` |
| 15 | spec window | `/exit` | the resume line for `mc-spec` |
| 16 | browser | open map #41, then `github.com/OrMizrahi12/potluck/issues/51` | #41 Closed, "Reached: #51"; #51's Decisions with the words, the add-only migration, sub-issues with #52 free to start |
| 17 | new window (Ctrl+Shift+N) | `claude -w multi-currency` | a session in `~/potluck/.claude/worktrees/multi-currency`, Opus 5.5 |
| 18 | orchestrator | `/implement-spec` (menu row), `#51.` and the rest of `prompts/implement-spec.txt` | one implementer for #52 and an exploration agent; a tracking table: the frontier is computed from merges into the integration branch |
| 19 | (no typing for about four and a half hours) | | #52, #53 and #54 merged one after another; draft pull request #57; #55 and #56 side by side; #56 merged |
| 20 | new window, after the first restart (off camera) | `claude --worktree multi-currency --resume <session-id>`, then `prompts/resume-after-restart.txt`; later "When #55 is merged and pushed, stop there and wait for me before the review." | #55's implementer finishes (10 min 24 s); all five tickets on the integration branch, 303 tests passing, "Say when to start the review" |
| 21 | orchestrator | `prompts/start-the-review.txt` | `code-review` (Potluck's own copy) with two reviewers in parallel: Standards and Spec |
| 22 | new window, after the second restart | the same resume command; scroll up to the findings; `prompts/resume-after-second-restart.txt` | #51's 30-day rule reworded to match the code; the fixer resumed on the standards items |
| 23 | (no typing, 25 minutes) | | the fixes merged and pushed; focused checks pass (189 tests, 22 browser tests); the `pr` skill writes the body; `gh pr ready 57`; six implementer worktrees removed; the final reply |
| 24 | shell | `gh pr view 57 --json state,isDraft,mergeStateStatus,closingIssuesReferences --jq '{…}'` | `OPEN`, `isDraft: false`, `CLEAN`, closes 51 to 56 |
| 25 | shell | `gh pr diff 57 --name-only \| grep '^drizzle/'` | `drizzle/0004_expense_foreign_amounts.sql`, `0005_rate_lookups.sql`, `0006_settlement_foreign_amounts.sql` and the migration metadata |
| 26 | shell | `gh pr checks 57` | three checks, all passed |
| 27 | browser | the pull request page, Vercel's bot comment, **Preview** | the app on the preview's own database branch |
| 28 | browser | new group "Zermatt trip", currency EUR, members Ana and Ben; "I'm Ana"; expense "Fondue", CHF, 48 | "= €51.88 · 1 CHF = 1.0809 EUR · rate from Frankfurter"; saved: "You are owed €25.94"; row "Paid CHF 48.00 at 1 CHF = 1.0809 EUR" |
| 29 | shell | `gh pr merge 57 --merge` | "Merged pull request OrMizrahi12/potluck#57 (Multi-currency groups)" |
| 30 | orchestrator | `prompts/confirm-the-deploy.txt` | 16 s: #57 merged as `d360983`, Vercel reports success for it, #51 to #56 closed |
| 31 | shell | `git pull -q`, `git log --first-parent --oneline -3`, `gh issue list` | `d360983 Merge pull request #57 …` on top of the commit tagged `lesson-9.2`; 11 open issues, none from this feature |

The two restarts were not planned (see `the-run.md`). Your session ID comes from the line Claude Code prints when a session ends, or from `claude --resume` with no ID, which
lists the sessions to pick from.
