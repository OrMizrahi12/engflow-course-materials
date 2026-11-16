# Student kit: Lesson 7.4, The small-change path

At the end of lesson 6.5 a link to a group that doesn't exist showed the right screen, "No group at this link", but answered
HTTP 200: a soft 404, left as an open call. Lesson 6.5 also left issue #19, a dev server that reloads the page in a loop. This
lesson takes the 404 from a question to production with no spec and no tickets. First we ask the plugin's router, `/ask-matt`,
which path each item needs, and when its answer disagrees with its own map, we quote the map back and it corrects itself.
Then a short `/grill-with-docs` settles the decisions and files them as a small issue (#21), `/implement #21` builds it in
the same window (test-first at the agreed seam, a review, two commits), and a production build catches its first approach.
A fresh session reviews the branch, the author session lands it (PR #22), and the behavior we deferred, a shape check for
links that can't be real, goes test-first with `/tdd` on its own, in its own worktree (PR #24). Its `/verify` run finds a real
dev error nobody planted, filed as issue #23. At the end the live site answers 404.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/ask-matt.txt` | the question for `/ask-matt`: the two items, which one is small, the shortest proper path, a spec or not |
| `prompts/check-the-map.txt` | the router's own map quoted back: a one-session build goes to `/implement`, here |
| `prompts/grill.txt` | the two lines after `/grill-with-docs`: grill until the answer is picked, then file a small issue |
| `prompts/answers-1.txt` | the answers to Q1 and Q2 (the Proxy; the glossary entry without URL on its Avoid list) |
| `prompts/answers-2.txt` | the answers to Q3 to Q6 (the shape check deferred to its own test-first change) |
| `prompts/answer-q7.txt` | the answer to Q7, and "file it" |
| `prompts/shape-check-first.txt` | the shape check, first asked in the author session with `/tdd` |
| `prompts/branch-answer.txt` | our own answer to "where should the commit go?" |
| `prompts/no-ticket.txt` | the answer to "should I file it as a ticket?" |
| `prompts/land.txt` | push and land #21, with the fresh review's main point in it |
| `prompts/shape-check.txt` | the shape check again, in its own worktree off `main`, with `/tdd` |
| `prompts/decision.txt` | the decision after `/verify` found the dev error: land this change, file the error |
| `issue-21.md` | issue #21 as the grilling filed it: the problem, four decisions, testing, out of scope, done when |
| `potluck-at-lesson-7.4.md` | what the Potluck repository holds at the tag `lesson-7.4`: the five commits, PRs #22 and #24, issue #23 |
| `potluck/src/proxy.ts` | the Proxy adapter exactly as it is at the tag |
| `potluck/src/app/g/group-link-proxy.ts` | the Proxy's handler, `answerGroupLink(db, request)`, exactly as it is at the tag |
| `potluck/src/app/g/group-link-proxy.test.ts` | its tests (unknown, real, and malformed with a closed PGlite) exactly as they are at the tag |
| `potluck/src/app/g/no-group/page.tsx` | the prerendered 404 page unknown links are sent to, exactly as it is at the tag |
| `small-change-path.md` | the card: the small-change path, the router, `/tdd` on its own, it's working if |

The card is also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 7.3 (the tag `lesson-7.3`, `7c3f5d2`), with `main` deployed to production and
  `npm run dev` working. Signed in to GitHub with `gh`.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325). On camera every session ran
  in auto mode on Opus 5.5. In default mode you approve each command as it comes.
- Two tabs in your terminal: a shell at the repository, and one for Claude Code. The lesson opens two more (a fresh reviewer
  and the second worktree); the steps say when.

## The steps, as on camera (Ubuntu)

**1. The soft 404.** In the shell, ask your production site for a group that doesn't exist (on camera the shell was in the
`verify-skill` worktree from lesson 6.5; any folder works):

```bash
curl -s https://<your-production-domain>/g/no-such-group | grep -o "No group at this link"
curl -sI https://<your-production-domain>/g/no-such-group | head -1
gh issue list --limit 3
```

The page is right ("No group at this link"), but the status line says `HTTP/2 200`: success. The issue list shows #19, "Dev
server reloads the page in a loop when run through npm run dev", labelled `needs-triage`, cause not confirmed.

**2. Close the finished session.** The tab with lesson 7.3's test session had done its job (it filed #19). Type `/exit` in it.
It prints `Resume this session with: claude --resume <id>`, in case you need it again.

**3. A fresh session in a new worktree.** In that tab:

```bash
clear
cd ~/potluck
claude -w unknown-links
```

The header shows Opus 5.5 and the path `~/potluck/.claude/worktrees/unknown-links`. One change, one worktree, one session.

**4. Ask the router.** Type `/ask-matt` (its menu row: "Ask which skill or flow fits your situation. A router over the skills
in this repo."), a space, and paste `prompts/ask-matt.txt`. On camera it read the plugin's skill list, both issues and the group
page: 49 seconds. Its answer: the 404 is the small one, because its cause is known: `src/app/g/[token]/page.tsx` calls
`notFound()` inside a `<Suspense>` boundary, so Next has already sent a 200 when it finds nothing. What's left is a real
choice: look the group up before the boundary, check the token in the Proxy and answer 404 there, or keep the 200 (the page is
already marked `noindex`). #19 has an unknown in it, so it goes to `/diagnosing-bugs`. Neither needs a spec: `/to-spec` exists
to feed `/to-tickets` for work that takes several sessions. Then the path it gave for the 404: talk the choice through, then
"use /tdd directly rather than /implement", because `/implement` works from a spec or a ticket.

**5. Check the answer against its own map.** That sounds reasonable, but the router's own map sends a build that fits in one
session to `/implement`, right in the same window. Paste `prompts/check-the-map.txt`. 17 seconds later: "You're right, and I
had it wrong." `/implement` runs `/tdd` at the agreed test points, then `/code-review`, then commits, so going straight to
`/tdd` would have skipped the review. Filing the decision as a small issue gives `/implement` a ticket to read and keeps the
decision written down once the window is cleared ("That isn't a spec. It just records what we decided."). `/tdd` on its own
is for a behavior that's already clear, with no choice left to make. The corrected path, all in this window:
`/grill-with-docs`, file the result as a small issue; `/implement #N`, which you type yourself, because the skill can't be
started by Claude; then `/pr` with `Closes #N` and the landing steps.

**6. Grill.** Type `/grill-with-docs` (its menu row: a relentless interview that creates docs as it goes, decision records
and the glossary), a space, and paste `prompts/grill.txt`. It loaded the `grilling` and `domain-modeling` skills and gathered
facts before asking anything: the glossary, and what this version of Next does when a page streams. Next's docs ship inside
`node_modules/next/dist/docs`; the new worktree had no `node_modules` yet, so it looked in the wrong folder first, then found
them in another worktree. 56 seconds. The facts: the app sets `cacheComponents: true`, so Next sends the prerendered shell,
and a 200 with it, before any lookup in the page runs; a real 404 needs a check that runs before the page renders, which is
the Proxy (`src/proxy.ts`, not there yet; the docs say to keep Proxy checks fast); every real link token is 22 characters
from `[A-Za-z0-9_-]`; and `GLOSSARY.md` has no word for the link itself. Then the questions, each with a recommendation. Q1:
is a real 404 worth a Proxy check on every group open (two database lookups instead of one)? It recommended (a), the Proxy
existence check. Q2: should "Group link" go into the glossary? It drafted the entry, with URL and token on its Avoid list.

**7. Answer Q1 and Q2.** Paste `prompts/answers-1.txt`. Leave URL off the Avoid list: lesson 7.2's lint bans every one-word
Avoid entry from code names, and the code already says `url` and `databaseUrl` for real URLs. It checked the lint (only
single-word entries are checked), added the glossary entry right away, and read how CI runs (`npm run check`: typecheck,
lint, the dependency check and Vitest; no Playwright). 53 seconds, then four more questions: Q3, must an unknown link still
show today's screen? Q4, should a link that can't be a real token get its 404 without asking the database? Q5, should the
page keep its own `notFound()` as a backstop? Q6, the test: a Vitest test at the Proxy's handler against a real PGlite
database, plus a curl in the PR as evidence.

**8. Answer Q3 to Q6.** Paste `prompts/answers-2.txt`. Q4 is one concrete behavior with nothing left to decide, so it stays
out of this change and gets built test-first on its own afterwards. One branch was still open, grown out of Q1. Q7: if the
database lookup fails inside the Proxy, what does the visitor get? Its recommendation: the same failure, never a pass-through
and never a 404. Then the issue it would file, labelled `bug` and `ready-for-agent`.

**9. File it.** Type the line in `prompts/answer-q7.txt`. It read `docs/agents/triage-labels.md` and filed #21, "An unknown
group link answers 404" (`issue-21.md` has it as filed). The decisions and the evidence from the docs live in the issue, and
so does the next change, the shape check. The glossary entry waits, uncommitted, in this worktree for #21's PR. No decision
record: the Proxy check is easy to undo. Next: type `/implement #21` here, because this window already holds the grilling.
(Claude Code may show an optional "How is Claude doing this session?" prompt; it doesn't affect anything.)

**10. Build it in the same window.** Type `/implement`. The menu offers two: `implement` (a piece of work from a spec or
tickets) and `implement-spec` (the result of `/to-spec` and `/to-tickets`). Pick the first, then the issue number and four
words, because the plan lives in this window:

```text
/implement #21 Here, in this window.
```

The whole build took 12 minutes 27 seconds on camera. In order: `npm ci`; the seam agreed in Q6, and the `tdd` skill loaded;
the Proxy split into a handler that takes the database (`answerGroupLink(db, request)`) and a thin `src/proxy.ts`, so a test
can pass in its own database; red first (the module didn't exist yet); the "before" on a dev server (both links answer 200);
a throwaway Proxy to find a way of answering 404 that keeps the group's own screen, checked in a headless browser; in dev,
one works. Then the full check, and the same requests against a production build (`next build`, `next start`): production
answered **200** for the unknown link. The Proxy does run there, but the prerendered page carries its own 200, so the 404
set on the rewrite is lost. It changed approach: a static page, `/g/no-group`, that calls `notFound()` at build time, with
`not-found.tsx` moved up to `src/app/g/`; unknown links are rewritten there. Production then answered 404. It fixed its own
test (the old one checked a status production ignores; the new one checks where the request is sent, with Next's
`isRewrite` and `getRewrittenUrl` testing helpers), proved the new test can fail by putting the dev-only version back for a
moment (red), then ran the full check (32 tests across 4 files) and the plugin's code review against `main`, with two
reviewers in the background. It fixed the finding rated most worth acting on: the handler read the token by position from a
path pattern defined in another file.

**11. The `/verify` question.** Before committing it stopped with a question: the repo says to run `/verify` before every
commit, but `/verify` drives a browser through `npm run dev`, and #19's reload loop blocks it. Its recommendation, option 1:
"Commit, curl as Evidence". Pick it (Return on the first option).

**12. The commits.** 2 minutes 23 seconds on camera. The first commit was refused by the pre-commit hook (lint-staged
refuses files staged with `--intent-to-add`, left from its review diff), and the retry swept the glossary entry into the
404 commit. It noticed, undid that commit while keeping the files (`git reset --soft HEAD~1`), and made the two commits in
order: `921d96b` "Name the group link in the glossary", then `6711c5b` "Answer 404 for a group link no group has" (with
`Closes #21`). Then it stopped the two servers it had started. Its report: #21 is built, in two commits, nothing pushed; the
approach it found first doesn't work in production, and only a production build caught it; one gap for the PR to state (the
test proves where an unknown link is sent, only the curl evidence proves the 404 itself); and its own slips along the way.

**13. The deferred behavior, first try.** In the same window, type `/tdd`, a space, and paste
`prompts/shape-check-first.txt`. Before writing a test it asked two questions. The seam: the same handler and Vitest file as
#21, and, to prove the database isn't touched, a real PGlite database that is closed first, so any query throws. Pick "Yes,
that seam". The branch: `docs/agents/landing.md` says one change per worktree and PR, and this builds on #21's Proxy, which
isn't on `main` yet. It offered a stacked worktree, this branch, or waiting for the merge. Choose "Type something" and paste
`prompts/branch-answer.txt`, then submit. It wrote no test and no code, and offered to file the shape check as a ticket so a
later session has something to work from. Type `prompts/no-ticket.txt`: the whole behaviour fits in one prompt. It saved that
to its memory ("Wrote 2 memories"), so it won't offer a ticket for a change this small again.

**14. A fresh reviewer.** #21 gets reviewed by a session that didn't write it. Open a new tab (Ctrl+Shift+T); it starts in
`~/potluck`:

```bash
cd .claude/worktrees/unknown-links
claude
```

The status line shows `0.0k (0%)`: an empty context. Type `/code-review`: Claude Code's own reviewer comes first in the menu
and the plugin's skill second. Press Down, Tab, and add the fixed point:

```text
/mattpocock-skills:code-review origin/main
```

About 1 minute 40 seconds: it found the two commits, worked out from the commit message that the spec is #21, and ran the
Standards and Spec reviewers in the background. Standards: no documented standard is broken; the Next.js parts check out
against the bundled docs, with one caveat: the Proxy docs say Proxy isn't meant for slow data fetching, and this adds a
database lookup to every group link, so the PR should name it as an accepted tradeoff. Then 4 judgment calls; the main one:
the test checks the rewrite, while the 404 a visitor actually sees goes untested. Spec: nothing implemented wrong and no scope
creep, but nothing automated proves the production 404, so the PR's curl evidence from a production build has to carry it.

**15. Land #21.** Back in the author's tab (Ctrl+PgUp), paste `prompts/land.txt`. 3 minutes 7 seconds on camera: it loaded
the `pr` skill, built two production copies (`main` as the before, this branch as the after, each on its own local port) and
curled both. Before: both links answer 200. After: the unknown link answers 404 (rewritten to `/g/no-group`) and the real one
still answers 200. It opened PR #22, checked there's no migration, turned on auto-merge, and the required check passed in 56
seconds; it merged and the production deploy succeeded. In the PR the real link appears as `<real group link>`, because a link
is a group's only credential; the tradeoff is named, and so is what the PR doesn't cover. One honest gap: it didn't curl the
live site, because the repo doesn't record the production address and it wouldn't guess.

**16. The shape check, in its own worktree.** In the reviewer's tab, `/exit`, then:

```bash
cd ~/potluck
git fetch -q
claude -w link-shape
```

The fetch makes sure the new worktree starts from a `main` that has the Proxy. Type `/tdd`, a space, and paste
`prompts/shape-check.txt`. 1 minute 32 seconds: this time there was no seam question. It read the earlier commit, wrote the
test with a closed PGlite database and ran it: red, the malformed link was looked up. Then the fix, next to the function that
makes the links (`LINK_TOKEN_SHAPE` beside `newLinkToken()` in `src/group/service.ts`; `hasGroup` returns false without a
query for anything that isn't 22 base64url characters), and green: 33 tests. The author session named the seam and waited for
a yes; this fresh session went straight to the test. Same skill, different session, so check what it did: it used the seam
we agreed.

**17. `/verify`, and a real bug.** The project's `CLAUDE.md` asks for `/verify` before every commit, so it ran it: a dev
server and a new browser walk. The walk found a real error: in dev, every unknown group link throws
`Route "/g/no-group": Could not validate instant because an error prevented the target segment from rendering`, from the
`/g/no-group` page PR #22 added. Nobody planted it. It stopped and asked: fix the dev error first, or commit this change now
and open an issue? It would fix the error first. We decided the other way, because this change didn't cause it and one PR
holds one change: paste `prompts/decision.txt`.

**18. Land the shape check.** 3 minutes 11 seconds: it read the landing doc, committed (`0c8919e`), filed issue #23 with the
browser walk in its body, opened PR #24 with auto-merge, the check passed in 52 seconds, it merged, and the production deploy
succeeded. Its report: any link that isn't 22 base64url characters now gets the same 404 with no database query; the dev
error is #23; and the PR has no browser test, because `/verify` can't pass until #23 is fixed. The PR says so.

**19. The check it couldn't do.** In your shell tab:

```bash
clear
curl -sI https://<your-production-domain>/g/no-such-group | head -1
curl -s https://<your-production-domain>/g/no-such-group | grep -o "No group at this link"
git fetch -q && git log --oneline -3 origin/main
```

`HTTP/2 404`, the page still says "No group at this link", and the log shows PR #24 and PR #22 merged.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy, pick one small change. Ask `/ask-matt` which path it is. If its answer disagrees with its own map, quote the
map back. Then grill, file the decisions as an issue, and run `/implement` with the issue's number in the same window.
Afterwards, run the plugin's `code-review` in a fresh session, and note one thing it saw that the build session didn't.

**Checkpoint (it's working if):** the decisions live in an issue (and the glossary, if a word was settled), not only in the
chat; `/implement` ran test-first at the seam you agreed, a review, and the commits; you checked the behavior where it
matters (for us, a production build); the review ran in a session that didn't write the code; and the PR holds one change
and says what it doesn't cover.

## If something goes differently

- **The router's path disagrees with its own map.** Paste the map's line back and ask which fits. On camera that took one
  prompt and 17 seconds.
- **Plain `/code-review` runs a different reviewer.** In this version the short name is Claude Code's own reviewer; the
  plugin's skill is `/mattpocock-skills:code-review`, the second row of the menu.
- **The menu shows `implement` and `implement-spec`.** Pick `implement` for one issue; `implement-spec` builds what `/to-spec`
  and `/to-tickets` produced.
- **It works in dev and fails in production.** Don't trust dev for anything Next prerenders: run a production build
  (`next build` and `next start`) before you believe a status code.
- **A new worktree has no `node_modules`.** Expected; the session runs `npm ci` first.
- **The pre-commit hook refuses files staged with `--intent-to-add`.** Stage them normally, or let the session redo the
  commit; check `git show --stat` after a retry, as it did.
- **"This session is isolated in the worktree ... Refusing to run it".** A worktree session refuses git commands it can't
  verify stay inside its worktree; it splits them into plain commands and carries on.
- **`/verify` can't pass because of #19.** The PR says so and carries curl evidence instead; the browser test waits for the
  fix.
- **Your answers differ from ours.** Expected: your questions and your app differ. What should match is the shape: a router
  checked against its map, a grilling that ends in an issue, one build in the same window, a fresh review, one change per PR.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. New tab and tab switching shortcuts
differ between terminals (on camera: Ctrl+Shift+T, Ctrl+PgUp, Ctrl+PgDn).

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-7.4` points at
`d2649a1`, `main` after PR #24. Clone it to look or to start from here; don't fork it. `potluck-at-lesson-7.4.md` has the
details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera every session
  ran on Opus 5.5; the author session, which grilled, built, answered the shape-check questions and landed #21, passed 150k
  tokens (about 15% of the window).
- git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT License) are free.
- Vercel's free Hobby plan (for non-commercial use) and Neon's free tier run the production site; the shape check exists
  because every guessed link used to wake the database, and the free tier's hours are a budget.

## Credits

The `ask-matt`, `grill-with-docs` (with `grilling` and `domain-modeling`), `implement`, `tdd`, `code-review` and `pr` skills are
from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. They are described here
in our own words; `small-change-path.md` paraphrases how they fit together. `/verify` is the Potluck repository's own skill.
This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
