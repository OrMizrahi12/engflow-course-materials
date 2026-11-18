# The run, ticket by ticket

One `/implement-spec #51` run built the whole spec. The times below are real, counted from the moment the prompt was sent
(0:00). The lesson shows the long stretches as time-lapses.

| Time | What happened |
|---|---|
| 0:00 | The prompt is sent (`prompts/implement-spec.txt`). The orchestrator reads #51 and its five tickets and builds a tracking table. Only #52 is on the frontier: one implementer starts, in its own worktree, with an exploration agent writing notes for #53 to #56. The table says the frontier comes from merges into the integration branch, not from GitHub closing issues. |
| 0:40 | #52 is merged into `worktree-multi-currency`. The orchestrator opens draft pull request #57 and starts #53, the only ticket blocked by #52 alone. |
| 1:37 | #53 (the Frankfurter lookup) is merged after 57 minutes. The orchestrator flags two rules of the spec that disagree: a future date's rate isn't checked against the 30-day limit. It calls the implementer's reading reasonable, leaves it ours to overrule, and says it will flag it again in the review. #54 starts. |
| 2:17 | #54 (settlements) is merged. The frontier now holds two tickets: #55 and #56 start side by side, each told to keep its edits to the shared amount field small and to merge in whichever lands first. |
| 3:48 | #56 (editing) is merged, after 1 hour 31 minutes. #55's commit waits: its pre-commit hook runs the whole test suite, and the machine is under heavy load. |
| 4:27 | The machine runs out of memory and restarts. Every agent stops mid-run. |
| after the restart | We resume the orchestrator's session by its ID and tell it what happened (`prompts/resume-after-restart.txt`). #55's implementer finishes in 10 minutes 24 seconds. All five tickets are on the integration branch; `npm run check` passes with 303 tests. As we asked, it stops before the review. |
| | `Start the review now, as planned.` It loads `code-review` with no plugin prefix: Potluck's own copy from lesson 7.5. Two reviewers run in parallel over 18 commits and about 100 files: Standards and Spec. |
| | The findings come back and a fixer starts on them. Then the machine restarts again; the fixer stops mid-run. |
| after the second restart | We resume once more, read the findings, and answer (`prompts/resume-after-second-restart.txt`). The orchestrator rewords #51 to match the code, finds the fixer had already committed both bug fixes test-first, and resumes it on the standards items. |
| | The fixer finishes (20 minutes 16 seconds of its own time); its commits are merged and pushed. Focused checks with the test workers capped: type check, lint, the dependency check, the 189 tests the fixes touched, and 22 browser tests on desktop and phone. The `pr` skill writes the body; `gh pr ready 57`. |
| 6:06 | Pull request #57 is ready for review. The six implementer worktrees are removed (their branches and test databases are kept). The final reply. |

## What the review found

- **Standards, four breaks of the written rules:** tests that shared their input; test names that read like labels, not
  sentences; commits without a body; and the word "trip" (on the glossary's avoid list) in a browser test, which the lint
  rule missed because it only covers `src/`.
- **Standards, six judgement calls:** three private functions all called `readRate`, each doing something different; the
  same code written twice (the foreign-part reading in both form readers, a database check, a test helper, the refusal
  messages); the three foreign-part values taken apart and rebuilt in three places; the rate lookup repeating the service's
  checks; and two minor notes about plain strings.
- **Spec, nothing missing:** every acceptance criterion has a test, and every ticket has screenshots. Four small extras, all
  kept (one is a TypeScript target change that BigInt needs).
- **Spec, two real bugs:** editing only who is in a settlement re-converted its amount from the saved rate, which could move
  the frozen group-currency amount by one minor unit and leave two members no longer settled up; and when a past date's rate
  wasn't published yet, the lookup cached the day before's rate forever.
- **Two departures from the spec, both judged acceptable:** for a future date, the 30-day limit counts back from today
  (counting from the entry's date would refuse any booking more than 30 days ahead); and the rate line uses the app's
  shared date format.
- **Can't be fixed:** the commit bodies, without rewriting pushed history, which Potluck's rules forbid. Left as they are.
- **Our call:** it offered to change #51's wording to match the code. We said yes.

## What the final reply said it did not do

- It didn't run the full test suite: only the focused checks above.
- The required check on GitHub was still pending when it stopped.
- It left the merge to us: the pull request carries three migrations.

It also reported that the full test run, with Vitest's default worker count, used about 21 GB of memory across 18 workers,
and that `VITEST_MAX_WORKERS=8` avoids it. That is its own observation; nothing in the repository caps the workers yet.

## Then, by hand

- Read the pull request: it closes #51 to #56, it isn't a draft, its merge state is `CLEAN`, it adds migrations 0004 to
  0006, and its three checks passed.
- Try the preview: a foreign-amount expense on the preview's own database.
- `gh pr merge 57 --merge`, then ask the orchestrator to confirm the deploy (`prompts/confirm-the-deploy.txt`): Vercel
  reports success for the merge commit `d360983`, and the merge closed the spec and its five tickets.
