# Student kit: Lesson 9.3, From map to shipped feature

Lesson 9.2 cleared map #41 (multi-currency groups): eight decision tickets, all closed, and only "Writing the spec" left in
the fog. This lesson takes that map all the way to production. A fresh session runs `/to-spec #41`: it reads the map, its
closed tickets and the code, asks one question (do these test seams match what you expect?) and publishes spec #51. We
answer the four decisions it made by itself while writing, correct one claim, and it closes the map with a pointer to the
spec. In the same window, `/to-tickets` cuts the spec into tracer-bullet tickets; we push back once at its quiz (fold the
"refusals" ticket into the two forms it protects), and five tickets are published as sub-issues with "blocked by" links.
Then lesson 8.2's `/implement-spec` builds all five in one run, in worktrees, through two machine restarts, with one review at
the end that found two real bugs. We try the pull request's preview ourselves, merge it by hand (it carries three
migrations), and confirm the production deploy.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/seams-answer.txt` | our answer to the four decisions the spec made while writing, and "close the map" |
| `prompts/ci-fix.txt` | the one correction: CI doesn't run Playwright |
| `prompts/take-the-label-off.txt` | take `ready-for-agent` off the spec once it has tickets |
| `prompts/implement-spec.txt` | the `/implement-spec #51` line with the instructions for the run |
| `prompts/resume-after-restart.txt` | what we told the resumed session after the first restart |
| `prompts/start-the-review.txt` | the go-ahead for the one review |
| `prompts/resume-after-second-restart.txt` | the answer after the second restart: finish the fixes, and yes, reword the spec |
| `prompts/confirm-the-deploy.txt` | after our merge: confirm the deploy the way `landing.md` says |
| `spec-51.md` | the spec as published on GitHub, at the end of the lesson |
| `tickets-52-56.md` | the five tickets as published, with their "blocked by" links |
| `the-run.md` | how the run went, ticket by ticket, with the real times, the two restarts, the review and its fixes |
| `map-to-spec.md` | the card: when a map has cleared, from `/to-spec` to five tickets; it's working if |
| `potluck-at-lesson-9.3.md` | what the Potluck repository holds at the tag `lesson-9.3`, and how to see the feature locally |
| `potluck/GLOSSARY.md` | the glossary at the tag: Group reworded; Group currency, Foreign amount and Exchange rate added |
| `potluck/drizzle/0004_expense_foreign_amounts.sql`, `potluck/drizzle/0005_rate_lookups.sql`, `potluck/drizzle/0006_settlement_foreign_amounts.sql` | the three add-only migrations the pull request carried |

The card is also in `cards/` in the course materials, next to the `/to-spec` and `/to-tickets` cards.

## Before you start

- A cleared map from lesson 9.2: every ticket under it closed, and nothing left in its fog but writing the spec.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325), in auto mode. In default
  mode you approve each command as it comes.
- Potluck as set up in lessons 6.2 to 8.2: a local Postgres, `npm run setup:worktree`, `docs/agents/landing.md`, the
  required check on GitHub and Vercel previews.
- A shell of your own in the main checkout (`~/potluck`), a window per session (Ctrl+Shift+N opens one), and a browser.

## The steps, as on camera (Ubuntu)

**1. The cleared map.** Open map #41 on GitHub and reload it. Destination: a spec ready to hand off. Decisions so far: eight
lines, one per ticket. Not yet specified: only "Writing the spec", with its glossary change. Sub-issues: 8 of 8 closed.

**2. What the docs say comes next.** In the shell (the plugin's version folder may differ on your machine):

```bash
clear
D=~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/docs/engineering
sed -n 18p $D/to-spec.md
sed -n 66p $D/wayfinder.md | fold -s -w 118
clear
sed -n 28p $D/to-spec.md | fold -s -w 118
sed -n 63p $D/to-spec.md | fold -s -w 118
```

The row for a cleared map says: run `/to-spec` with the map's issue number. The wayfinder docs add that `/to-spec`
collapses the map's linked decisions into one spec and `/to-tickets` slices that spec. The spec records what you decided,
so a fresh session can pick up the work; if it states something you never said, that is a defect. And don't clear or
compact between `/to-spec` and `/to-tickets`: run them in the same window.

**3. The spec, in a fresh session.** In a new window, in the main checkout (this session writes no code):

```bash
cd ~/potluck
claude -n mc-spec
```

Then `/to-spec` from the menu (`/mattpocock-skills:to-spec`), and `#41`. Nothing else. It read the tracker notes, the map and
its eight closed tickets with their comments, the first spec (#1), the glossary and the code, in under a minute. No
grilling: every decision was already written down. It asked one question, a menu: do these four test seams match what you
expect? (1) the group service on PGlite, (2) a new rate lookup with a fake Frankfurter injected, (3) pure conversion
functions in `src/money`, (4) Playwright against the real Frankfurter. Our answer: option 3, "Fake rate in Playwright": a
browser test that calls a real rate service fails whenever that service has a bad day.

**4. Read what it decided by itself.** It published issue #51, "Spec: multi-currency groups", labelled `ready-for-agent`, and
listed four decisions the map's tickets hadn't made: how amounts must agree on save, how precise a rate is, the rate offered
when a date is edited, and where the fake rate source runs (it said: in previews and local dev). The docs call a statement
you never made a defect, so each one gets an answer. Paste `prompts/seams-answer.txt`: previews behave like production, so
they call Frankfurter; the other three are fine; point the map at the spec and close it. 33 seconds: the spec was edited,
the map's destination now reads "Reached: #51", the spec got a line in Decisions so far, Not yet specified is empty, and the
map closed with a comment.

**5. Correct a wrong claim.** Its last paragraph said CI runs Playwright against the preview. It doesn't: Potluck's check
workflow runs `npm run check`, and Playwright runs locally against the dev server. Paste `prompts/ci-fix.txt`. 16 seconds:
every browser test uses the fake, and it found the wrong claim in an old note of its own and corrected that too.

**6. Tickets, in the same window.** `/to-tickets` from the menu, no argument: "The source is spec #51, which I already have in
context". It proposed six tracer bullets, each through every layer: an expense at a typed rate (with the glossary change
and the pure conversion module), the Frankfurter lookup, settlements, switching a suggested settlement's currency, editing,
and refusals that name the converted figure. The quiz asked whether the sizes and blocking edges work. Ticket 6 held only
refusals, and each refusal belongs to the form it protects, so we picked option 3: "Fold 6 into 1 and 3". It published five
tickets, #52 to #56, as sub-issues of #51 with native "blocked by" links: #52 → #53 → #54 → (#55 and #56 side by side).

**7. Take the label off the spec, and leave.** Paste `prompts/take-the-label-off.txt` (12 seconds: only #52 to #56 carry
`ready-for-agent` now), then `/exit`.

**8. Check it on GitHub.** Map #41: Closed, its destination "Reached: #51". Spec #51: the Decisions open with the words
(Group reworded; Group currency, Foreign amount and Exchange rate added), the schema is an add-only migration, and the
sub-issues show #52 as the only one free to start. The glossary change ships with the first ticket that adds code, because
the lint rule rejects the old words from then on.

**9. One run builds it.** A new window (Ctrl+Shift+N):

```bash
cd ~/potluck
claude -w multi-currency
```

The header shows Opus 5.5 and the worktree path (`~/potluck/.claude/worktrees/multi-currency`). Pick `/implement-spec` from
the menu (`/mattpocock-skills:implement-spec`), type `#51.`, and paste the rest of `prompts/implement-spec.txt`. It started
one implementer: #52, the only ticket on the frontier, with an exploration agent writing notes for the later tickets. Its
tracking table said it outright: the frontier is computed from merges into the integration branch, not from GitHub closing
issues (they close only when the pull request merges).

**10. Let it run.** On camera (real times): #52 about 40 minutes, then merged into the integration branch, draft pull request
#57 opened, #53 started (the only ticket waiting on #52 alone). #53, the Frankfurter lookup, 57 minutes; at its merge the
orchestrator flagged two rules of the spec that disagree (a future date's rate isn't checked against the 30-day limit),
called its reading reasonable, and left it ours to overrule. #54, settlements, merged 40 minutes later; #55 and #56 then ran
side by side, each told to keep its edits to the shared amount field small and to merge in whichever landed first. #56,
editing, took an hour and a half. `the-run.md` has every step.

**11. When the machine restarts.** Four and a half hours into the run, the machine ran out of memory and restarted, and every
agent stopped mid-run. Resume the orchestrator's session by its ID, in its worktree:

```bash
cd ~/potluck
claude --worktree multi-currency --resume <session-id>
```

and tell it what happened (`prompts/resume-after-restart.txt`). #55's implementer finished in about ten minutes. The history
then shows where it stopped: all five tickets on the integration branch, 303 tests passing, three migrations, two departures
from the spec, and "Say when to start the review": while #55 finished, we had asked it to wait for us before the review.

**12. One review.** Type `Start the review now, as planned.` It loaded `code-review` with no plugin prefix: Potluck's own
copy from lesson 7.5. Two reviewers in parallel over 18 commits and about 100 files: Standards (the coding standards and
the glossary) and Spec (#51 and its tickets). Three minutes later the findings were back and a fixer had started; then the
machine restarted again. Resume the same way, scroll up to the findings: four breaches of the written rules (tests sharing
input, test names that read like labels, missing commit bodies, the avoided word "trip" in a browser test), judgement calls
(three functions all called `readRate`), nothing missing from the spec and four small extras, and two real bugs (editing
only who's in a settlement could move its frozen amount by one minor unit; an earlier day's rate could be cached forever).
The commit bodies can't be fixed without rewriting pushed history, which Potluck forbids. Our call on the spec's wording:
paste `prompts/resume-after-second-restart.txt`.

**13. The run's last stretch.** It reworded #51, found that the fixer had already committed both bug fixes test-first, resumed
it on the standards items (merged 20 minutes later), ran focused checks with the test workers capped (type check, lint, the
dependency check, 189 tests and 22 browser tests on desktop and phone), wrote the body with the `pr` skill, marked pull
request #57 ready, and removed the six implementer worktrees. Its final reply says what it didn't do: no full test run, and CI
was still pending. From our prompt to a ready pull request: 6 hours 6 minutes of real time, both restarts included.

**14. Read the pull request before landing it.** In the shell:

```bash
clear
gh pr view 57 --json state,isDraft,mergeStateStatus,closingIssuesReferences --jq '{state, isDraft, mergeStateStatus, closes: [.closingIssuesReferences[].number]}'
gh pr diff 57 --name-only | grep '^drizzle/'
gh pr checks 57
```

It closes #51 to #56, it's no longer a draft, its merge state is `CLEAN`, and it adds three migrations (0004, 0005, 0006):
that is why `landing.md` leaves the merge to a human. All three checks passed: the required check (type check, lint and service
tests), Vercel's preview deploy and Vercel's preview comments.

**15. Try the preview.** On the pull request's page, Vercel's bot comment says the preview is ready: open it. A preview runs on
its own branch of the database, so nothing you enter touches production. On camera: a new group "Zermatt trip" in EUR, with
Ana and Ben; "I'm Ana"; Add an expense: "Fondue", currency CHF, amount 48. The line under the amount: €51.88 · 1 CHF =
1.0809 EUR · rate from Frankfurter (the preview calls the real Frankfurter; every test uses the fake). Saved: Ana is owed
25.94, and the row keeps its euro amount with a quiet line, "Paid CHF 48.00 at 1 CHF = 1.0809 EUR". Your rate will differ:
it is that day's.

**16. Merge by hand, then confirm.**

```bash
gh pr merge 57 --merge
```

`Merged pull request #57`. Back in the orchestrator's window, paste `prompts/confirm-the-deploy.txt`. 16 seconds: the pull
request is merged, Vercel reports success for the merge commit, and the merge closed the spec and all five tickets.
Production builds run the migrations first and a failed one fails the build, so this success means all three are in
production.

**17. The main checkout.**

```bash
git pull -q
git log --first-parent --oneline -3
gh issue list
```

Pull request #57 sits on top of the commit tagged `lesson-9.2`. Eleven issues are open, and none is the map, the spec or one
of its tickets.

## Pause and try

With your own cleared map from lesson 9.2: open a fresh session, run `/to-spec` with your map's number, and answer the seams
question with how your tests avoid the network. Sign off on, or correct, anything it decided by itself. Then run
`/to-tickets` in the same window and push back at the quiz once. Building the tickets is lesson 8.2's run.

**Checkpoint (it's working if):** your spec is on GitHub with the decisions, the new words and the test seams; its tickets are
sub-issues with "blocked by" links, and only the first is free to start; the spec itself no longer carries
`ready-for-agent`; and your map is closed, its destination pointing at the spec.

## If something goes differently

- **It starts grilling you.** Something on the map isn't decided yet. Answer it, or go back to the map (lesson 9.2) first.
- **It asks more than one question.** Fine: the seams question is the one the skill must ask; anything else is a gap the
  map left.
- **The spec states something you never said.** That's a defect: correct it in the same window before `/to-tickets`.
- **`/to-tickets` asks for an issue number.** The window was cleared, or this is a new session; give it the spec's number,
  or run it in the window that wrote the spec.
- **A different breakdown.** Expected: the quiz is where you push back. Ask whether each ticket is a tracer bullet through
  every layer and whether its blocking edges are real.
- **The run stops mid-way** (a restart, a closed window). Resume the orchestrator's session by its ID in its worktree and say
  what happened; it tracks merges into the integration branch, so it picks up from there.
- **Many test workers at once use a lot of memory.** In the run, Vitest's default worker count used about 21 GB; capping it
  (`VITEST_MAX_WORKERS`) is what the focused checks did.
- **Your preview shows a different rate.** It's that day's rate from Frankfurter.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. New windows and tabs work the same
in any terminal; you can also run each session in its own tab.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-9.3` points at
`d360983`, the merge of pull request #57 on `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-9.3.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. A whole-spec run is the
  heaviest thing in the course so far: on camera it ran for six hours with an implementer subagent per ticket, an
  exploration agent, two reviewers and a fixer, all on Opus 5.5.
- Git worktrees, Postgres, Node, npm, `gh`, GitHub Issues and Actions on a public repository, Playwright, Frankfurter (a free
  exchange-rate service with no account) and the skills (open source, MIT License) are free.
- Vercel deployed the preview and then production, as set up in lesson 6.2 (Vercel's free Hobby plan is for non-commercial
  use); each preview gets its own Neon database branch.

## Credits

The `to-spec`, `to-tickets`, `implement-spec`, `wayfinder`, `code-review` and `pr` skills and the quoted docs lines are from
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
