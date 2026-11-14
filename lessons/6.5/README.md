# Student kit: Lesson 6.5, Give Claude eyes

Ticket #3 is the first thing a Potluck user can touch: create a group, get a long, unguessable link, and open the group by
that link. We build it with `/implement` in a fresh Claude Code session in its own worktree, and the reply is honest: the
service tests pass, but Claude checked the page with `curl` and never saw it drawn. So we give Claude the two things it
can't get by itself. First, what the dev server prints: `npm run dev` now copies everything to a log file Claude can read
(it lands as its own small pull request, auto-merged). Then a browser of its own: Playwright, headless, with a test of the
user's path at desktop and phone width, one forced red to prove the test can fail, and screenshots Claude looks at itself.
The log shows something the page couldn't: every group link is written to it in full. We open the pull request with those
screenshots as evidence, review the preview ourselves like a user, with test data only, and merge it by hand, because it
carries a migration.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/implement-3.txt` | the request after `/implement #3`: leave the browser steps out for now, build until the service tests pass and the page works, stop any server, commit, don't push |
| `prompts/dev-log.txt` | make `npm run dev` also write everything to `.data/logs/dev-latest.log`, as its own pull request with auto-merge |
| `prompts/give-yourself-eyes.txt` | install Playwright, write the ticket's browser test against the running dev server, screenshots, read the log |
| `prompts/open-the-pr.txt` | the request after `/mattpocock-skills:pr`: screenshots in Evidence, no auto-merge (a migration) |
| `potluck-at-lesson-6.5.md` | what the Potluck repository holds at the tag `lesson-6.5`: the two pull requests, the commits, what is still open |
| `potluck/scripts/dev.mjs` | the dev-server wrapper as committed: the terminal keeps its colours, the log gets plain text |
| `potluck/playwright.config.ts` | the Playwright config as committed: a desktop and a phone project, against a running server |
| `potluck/e2e/create-group.spec.ts` | the browser test as committed: create, copy the link, open it in a fresh browser, see the members |
| `potluck/CLAUDE.md` | Potluck's `CLAUDE.md` at the tag, with the new line saying where the dev server's log is |
| `give-claude-eyes.md` | the card: the three things Claude can see, how to give it the two it can't, when to skip it |
| `review-the-preview.md` | the card: your own look at the preview, like a user, before you merge |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 6.4: `main` at the tag `lesson-6.3` (the walking skeleton, merged), ticket #3
  open, signed in to GitHub with `gh`, the repository connected to Vercel with preview deployments (lesson 6.2).
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.323). On camera it ran in auto
  mode on Opus 5.5. In default mode you approve each command as it comes.
- Two terminals (or two tabs): one for the Claude Code session, one that is yours, for the dev server and your own checks.
- A browser signed in to GitHub, for the pull request, the preview and the merge.

## The steps, as on camera (Ubuntu)

**1. The ticket.** In your terminal, at the repository:

```bash
cd ~/potluck
gh issue view 3
```

"Create a group and open it by its link". The criteria: a random link token of at least 128 bits, the only way to reach the
group; a create form (name, currency, members); a group page that works at phone width, with a copy or share control; and
"The Playwright test passes on the preview".

**2. A worktree and `/implement`.** In the first terminal:

```bash
claude -w create-group
```

The header shows the version, Opus 5.5 and the session's folder, `~/potluck/.claude/worktrees/create-group`. Type
`/implement`, a space, `#3`, a space, and paste `prompts/implement-3.txt`. The browser test in the ticket runs on the preview,
and the preview needs the bypass secret from ticket #12, which doesn't exist yet; so the request leaves the browser steps out
for now. On camera the turn took 11 minutes 57 seconds (a time-lapse in the video): it read the ticket, the spec and #12,
fetched the official ISO 4217 currency list and found exactly the 13 "N.A." codes the ticket names, read the Next.js docs
that ship with the project, and wrote the group service test-first on PGlite (one red on accented names, fixed, green). Then
the migration, the create form, the group page, a check with `curl` against a throwaway database, `npm run check`, a commit,
and two review agents (code standards and spec). The fixes after the review, about three minutes, aren't in the video; the
reply sums them up.

**3. Read the reply.** Built and committed in two commits, nothing pushed, 21 service tests passing on PGlite, a 16-byte
random link token, the currency table from the ISO list, and a note that the migration means a human merges the pull
request. "Checked by hand": the form submitted with `curl` (a duplicate name refused, a valid group redirected to its page).
"Not verified": the phone-width layout, and whether Share and Copy work on a real phone. Curl fetched the page's text, but
nothing ever drew it. The review found two real bugs, fixed in those minutes: a dotted capital I (`İvo` and `ivo`) crashed
group creation, and the copied link could carry extra parts of the address.

**4. The server's voice.** Paste `prompts/dev-log.txt`. About five minutes on camera. The change starts from `main`; the
worktree guard won't let the session write outside its worktree, so it made a separate `dev-logs` worktree for it. It wrote
`scripts/dev.mjs` (in this kit), which starts `next dev` and copies every line to `.data/logs/dev-latest.log` with the colour
codes stripped, tried it on a spare port (a page request, Ctrl+C, nothing left running), ran the full check and committed.
Its first command, a push and a pull request in one go, was denied by the project's permission rules, so it ran them one at
a time. Pull request #15 opened with auto-merge, merged when its check passed, and `main` came back into the ticket's branch.

**5. Your dev server.** In your second terminal:

```bash
cd ~/potluck/.claude/worktrees/create-group/
cp .env.example .env.local
npm run db:migrate
npm run dev
```

On camera the `cd` was typed as `cd .cl`, Tab, `w`, Tab, `c`, Tab from `~/potluck`. A fresh worktree has no local settings,
so the example file is copied (it points at your local database; keep real values out of anything you share), and the local
database doesn't have ticket #3's tables yet, so the migration runs first: "Migrations applied." Then `npm run dev`, which now
runs the wrapper: "Ready", Local `http://localhost:3000`. Everything this server prints in your terminal also lands in the log.

**6. A browser of its own.** Back in the session, paste `prompts/give-yourself-eyes.txt`. 4 minutes 2 seconds on camera: it
found which checkout the server runs from (this worktree, through the new wrapper), ran

```bash
npm install --save-dev @playwright/test
npx playwright install chromium
```

wrote `playwright.config.ts` (a desktop and a Pixel 7 phone project) and `e2e/create-group.spec.ts` (both in this kit),
noted where the log ended, and ran the test headless. Both projects passed on the first run. A first-run pass proves less
than a red-then-green, so it looked at the screenshots, then forced a failure: it expected the members in the reverse order,
got its red, restored the order, and both went green again, along with `npm run check`. Then it read the new lines of the
dev log and committed the test. Its reply: the test creates a group with three members, clicks Copy link, reads the
clipboard back, opens the link in a fresh browser and checks the name, the currency and the members in order. From the
screenshots: at phone width the long link is cut off inside its field (Copy copies all of it), and the Share button never
appears, because headless Chromium has no share sheet. From the log: every group link is written to it in full.

To run the test yourself, with your dev server running:

```bash
npm run test:e2e
```

**7. The log from your side.** In a second tab of your terminal, in the worktree:

```bash
tail -n 14 .data/logs/dev-latest.log
```

A `POST /` with `createGroupAction`, then `GET /g/` followed by the group's token, one line per page the test opened. That
token is the group's only credential, and Vercel's request logs will record the same paths in production. In the lesson it
is noted for later: nothing is fixed and no ticket is filed yet.

**8. The pull request.** In the session, type `/mattpocock-skills:pr` (in Claude Code 2.1.323 the short `/pr` isn't found),
a space, and paste `prompts/open-the-pr.txt`. About three minutes on camera: it copied four of the screenshots into
`docs/evidence/issue-3/`, read all four, committed them, wrote the body with image links pinned to that commit, pushed, and
opened pull request #16 without auto-merge. Its first watcher on the checks stopped early (this machine's `grep` is a
different program), so it re-armed it with `jq` and waited in the background. The reply: Merge Danger "one-way" (the
migration), the required check and the preview passed, auto-merge off.

**9. Read it on GitHub.** On the pull request page: "Carries a migration ... left for a human to merge" at the top; Evidence
with Before, After and the four screenshots (desktop create, desktop link copied, phone create, phone link opened
elsewhere); "The test went red when it expected the members in the wrong order"; Not covered yet (the browser test doesn't
run in CI until #12; the share button is untested); Door: one-way; "Group links appear in full in request logs"; Vercel's
bot comment with the preview Ready; all checks passed; no conflicts.

**10. Your own review of the preview.** From the Vercel bot's comment, open the preview. It's the pull request's own
deployment on its own copy of the database, so use test data only. On camera: group name "Lisbon trip", currency EUR, members
Ana and Ben, Add member, Dana; Create group; Copy link ("Link copied."); back to the home page; paste the link into the
address bar and open it: the same group, with Ana, Ben and Dana. `review-the-preview.md` has the checklist.

**11. Merge by hand.** Merge pull request, Confirm merge. Merged, three checks passed, and GitHub deleted the branch. The
pull request said "Closes #3", so ticket #3 is closed. Production deploys from the merge: group creation is live, deployed
but not announced.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy: start your dev server in your own terminal, and have Claude tee it into a log file it can read. Install
Playwright, have Claude write one browser test for a page you've built, run it headless, and look at its own screenshots.
Then open your pull request's preview yourself, and use the feature like a user before you merge.

**Checkpoint (it's working if):** `.data/logs/dev-latest.log` fills while your server runs, and `git status` doesn't list it;
the browser test passes headless at desktop and phone width; Claude has made it fail once on purpose and seen it go green
again; the screenshots it read are in your pull request's Evidence; and you've used the preview yourself before merging.

## If something goes differently

- **Plain `/pr` isn't found.** Type the plugin's full name, `/mattpocock-skills:pr`.
- **`npx playwright install chromium` asks for system libraries.** On a fresh Linux or WSL machine, run
  `npx playwright install --with-deps chromium`; it asks for your password (sudo) to install them. On camera nothing extra
  was needed.
- **The test can't reach the page.** Your dev server must be running on port 3000 in the same worktree, or set `BASE_URL`.
- **The worktree guard refuses a command.** Claude Code couldn't prove the command stays inside the worktree; Claude usually
  finds another way (on camera, a separate worktree for the log change).
- **A combined push and pull request is denied.** Potluck's permission rules deny it; plain separate commands go through.
- **The preview asks you to sign in to Vercel.** Previews are protected for people outside your Vercel team; open it while
  signed in to your own account.
- **Your reply, test or screenshots differ from ours.** Expected: they depend on your code and your answers. What should
  match is the shape: a log Claude can read, a test that went red once, screenshots in Evidence, your own look, your merge.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). Playwright's headless Chromium runs inside WSL without a display; on WSL and on a
fresh Linux machine it may need `--with-deps` once (above). On macOS no extra libraries are needed. The preview and the
merge happen in your usual browser on any system.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-6.5` points at
`292703a`, the merge of pull request #16 into `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-6.5.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the one
  session ran on Opus 5.5; by the end of the lesson its context was about 205k tokens (20% of the window).
- Playwright and its Chromium, Node, npm, git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT
  License) are free.
- **Vercel Hobby** is free for non-commercial use; **Neon Free** as in lesson 6.2 (each preview gets its own database
  branch, deleted when its pull request merges).

## Credits

The `implement` and `pr` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the
MIT License. They are described here in our own words; nothing in this kit copies a skill's text. Potluck's code in
`potluck/` is from the course's Potluck repository (MIT License, at the tag `lesson-6.5`). This course is independent:
unofficial, and not affiliated with or endorsed by Matt Pocock.
