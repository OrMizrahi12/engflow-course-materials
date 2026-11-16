# Lesson 7.4: every line, in order

What was typed (or pasted from `prompts/`) on camera, and what came back. `<your-production-domain>` is your own Vercel
production address. A skill typed by its short name and completed from the menu (`/ask-matt`, `/grill-with-docs`,
`/implement`, `/tdd`) shows on screen with the plugin's prefix, for example `/mattpocock-skills:tdd`.

## Shell tab: the soft 404

```bash
curl -s https://<your-production-domain>/g/no-such-group | grep -o "No group at this link"
```
`No group at this link`

```bash
curl -sI https://<your-production-domain>/g/no-such-group | head -1
```
`HTTP/2 200`

```bash
gh issue list --limit 3
```
#19 "Dev server reloads the page in a loop when run through npm run dev" (`needs-triage`), #12, #11.

## Lesson 7.3's test session

```text
/exit
```
`Resume this session with: claude --resume <id>`

```bash
clear
cd ~/potluck
claude -w unknown-links
```
A new session: Opus 5.5, `~/potluck/.claude/worktrees/unknown-links`.

## The author session (`unknown-links`)

`/ask-matt` + `prompts/ask-matt.txt`:

```text
/ask-matt Two things are on my list. First, #19: the dev server reloads the page in a loop. The cause written in it is a guess that nobody has confirmed yet. Second, a call Claude left me when #3 landed: a link to a group that does not exist still answers HTTP 200. I want it to answer as not found. That one feels small: one session, no new screens, but there is a decision in it about how the page should answer. Which of the two is a small change, and what is the shortest proper path for each? Do I need a spec?
```
49 seconds. The 404 is the small one (its cause is known: `notFound()` inside `<Suspense>`); three options; #19 goes to
`/diagnosing-bugs`; no spec for either. For the 404: talk it through, then "/tdd directly rather than /implement".

`prompts/check-the-map.txt`:

```text
Check that against your own map before I act on it. It says a build that fits in one session goes to /implement right here, in this window. If the grill files its decisions as a small issue, /implement has a ticket to work from. Which fits then, and where does /tdd on its own belong?
```
17 seconds. "You're right, and I had it wrong." Corrected path: `/grill-with-docs`, file a small issue, `/implement #N`
(typed by you), `/pr` with `Closes #N`.

`/grill-with-docs` + `prompts/grill.txt`:

```text
/grill-with-docs The unknown-link 404. Grill me until we have picked how it should answer, then file the decisions as a small issue.
```
56 seconds of facts (Cache Components; a 404 needs a check before render, the Proxy; tokens are 22 characters; no glossary
word for the link), then Q1 (a Proxy check on every group open?) and Q2 (a "Group link" glossary entry).

`prompts/answers-1.txt`:

```text
Q1: a. Q2: yes, but leave URL off the Avoid list. Our lint bans every one-word Avoid entry from code names, and the code already says url and databaseUrl for real URLs.
```
53 seconds: the lint read, the glossary entry added, CI read. Q3 (today's screen?), Q4 (no database for impossible links?),
Q5 (keep `notFound()`?), Q6 (a Vitest test at the handler against PGlite, plus curl).

`prompts/answers-2.txt`:

```text
Q3: required, as you say. Q4: not in this change. It is one concrete behaviour with nothing left to decide, so I will build it test-first on its own afterwards. Q5: yes. Q6: yes.
```
Q7 (a database failure in the Proxy: the same failure, never a pass-through, never a 404) and the draft issue.

`prompts/answer-q7.txt`:

```text
Q7: yes. File it.
```
Issue #21, "An unknown group link answers 404", `bug` and `ready-for-agent` (see `issue-21.md`). Next: `/implement #21`
here.

```text
/implement #21 Here, in this window.
```
(`/implement` picked from the menu, the first of `implement` and `implement-spec`.) 12 minutes 27 seconds in all: red,
green in dev, a production build that answered 200, the switch to `/g/no-group`, 32 tests, a review with two reviewers, then
a question about `/verify`.

Answer to the question: option 1, "Commit, curl as Evidence (Recommended)". Two commits after one refusal by the pre-commit
hook: `921d96b` and `6711c5b`. Nothing pushed.

`/tdd` + `prompts/shape-check-first.txt`:

```text
/tdd One more behaviour, nothing left to decide: a link that cannot be a group link at all (not 22 base64url characters) gets the same 404 without touching the database. Every guessed link wakes the database now, and its free hours are a budget. Commit when green.
```
Two questions first. The seam: "Yes, that seam (Recommended)". The branch: "Type something", then `prompts/branch-answer.txt`:

```text
Wait for #21 to merge, but do not open its PR yet. A fresh session reviews #21 first, then it lands. This change comes after, in its own worktree off main.
```
Submitted. No test, no code; "Should I?" (file a ticket). `prompts/no-ticket.txt`:

```text
No ticket. The whole behaviour fits in one prompt.
```
"Wrote 2 memories": no ticket offered for a change this small again.

## A new tab: the fresh reviewer

```bash
cd .claude/worktrees/unknown-links
claude
```
`0.0k (0%)`.

```text
/mattpocock-skills:code-review origin/main
```
(`/code-review` typed, Down to the plugin's row, Tab, then ` origin/main`.) About 1 minute 40 seconds. Standards: no
documented standard broken, one caveat about the Proxy and slow data fetching, 4 judgment calls. Spec: nothing implemented
wrong; nothing automated proves the production 404.

## Back in the author's tab: land #21

`prompts/land.txt`:

```text
Push it and land it the way docs/agents/landing.md says. A fresh review is in: put curl output from a production build in the Evidence, and name the Proxy's database lookup on every group link as an accepted tradeoff.
```
3 minutes 7 seconds. PR #22, auto-merge, check passed in 56 seconds, merged, production deploy succeeded. No live curl.

## The reviewer's tab, then a second worktree: the shape check

```text
/exit
```

```bash
cd ~/potluck
git fetch -q
claude -w link-shape
```

`/tdd` + `prompts/shape-check.txt`:

```text
/tdd A link that cannot be a group link at all (not 22 base64url characters) gets the same 404 as an unknown one, without touching the database. Every guessed link wakes the database now, and its free hours are a budget. Commit when green.
```
1 minute 32 seconds to green (33 tests), then `/verify`: a dev server, a browser walk, and a real dev error from
`/g/no-group`. "Decision for you": fix it first, or commit and open an issue? `prompts/decision.txt`:

```text
Commit the shape check and its unit test now, and land it. File the dev error as its own issue: the browser walk and the helpers move go with that fix, not in this PR. Stop the dev server when you are done.
```
3 minutes 11 seconds. Commit `0c8919e`, issue #23, PR #24, auto-merge, check passed in 52 seconds, merged, production deploy
succeeded.

## Shell tab: the live site again

```bash
clear
curl -sI https://<your-production-domain>/g/no-such-group | head -1
```
`HTTP/2 404`

```bash
curl -s https://<your-production-domain>/g/no-such-group | grep -o "No group at this link"
```
`No group at this link`

```bash
git fetch -q && git log --oneline -3 origin/main
```
```text
d2649a1 (origin/main, origin/HEAD) Merge pull request #24 from OrMizrahi12/worktree-link-shape
0c8919e (origin/worktree-link-shape, worktree-link-shape) Answer a link that can't be a group link without the database
bd2b5c0 Merge pull request #22 from OrMizrahi12/worktree-unknown-links
```
