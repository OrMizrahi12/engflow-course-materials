# Lesson 6.5: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. One Claude Code session does the
work, in its own worktree; the second terminal is ours, for the dev server and our own checks; the browser is ours, for the
pull request, the preview and the merge.

## 1. The ticket (second terminal)

```bash
cd ~/potluck
gh issue view 3
```

"Create a group and open it by its link". What to build: an organizer creates a group from the home page (a name, a
currency, the first members) and gets a long, unguessable link; anyone who opens it sees the group page. The criteria
include a random token of at least 128 bits as the only way in, a create form, a group page that works at phone width with
a copy or share control, and "The Playwright test passes on the preview".

## 2. A worktree and /implement (first terminal)

```bash
claude -w create-group
```

The header: Claude Code v2.1.323, Opus 5.5, `~/potluck/.claude/worktrees/create-group`; auto mode on.

Type `/implement`, a space, `#3`, a space, then paste `prompts/implement-3.txt`:

```text
The browser test in #3 runs on the preview, and that needs the bypass secret from #12, which doesn't exist yet. So leave every browser step out for now: build #3 until its service tests pass and the page works, and we'll add the browser check together afterwards. Stop any server you start. Commit on this branch; don't push or open a PR.
```

"Baked for 11m 57s". In order: the ticket, spec #1 and ticket #12, then the code it builds on; the official ISO 4217 list
fetched with `curl` (exactly the 13 "N.A." codes the ticket names); the Next.js docs bundled with the project; the group
service test-first on PGlite (a red on accented names, fixed, green); the migration
`drizzle/0001_groups_and_members.sql`; the create form and the group page `/g/[token]`; the app started against a throwaway
database and checked with `curl`; `npm run check`; a commit; two review agents (code standards and spec). The fixes after
their findings (about three minutes) are off camera; the reply sums them up.

The reply, in order:

- Ticket #3 is built and committed in two commits; nothing pushed. 21 service tests pass on PGlite.
- The group service checks everything before it writes; the link token is 16 random bytes; the currency table comes from
  the official ISO list; the migration means a human merges the pull request.
- **Checked by hand**: the app run against a throwaway database, the form submitted with `curl`: a duplicate name refused,
  a valid group redirected to its page.
- **Not verified**: the phone-width layout, and whether Share and Copy work on a real phone. "Those need the browser check."
- **Code review**: two real bugs, both fixed: a dotted capital I (`İvo` and `ivo`) crashed group creation; the copied link
  could carry extra parts of the address.
- **Your call**: among others, an unknown link returns HTTP 200, because the page is streamed and the status is sent before
  the app knows there's no group.

## 3. The server's voice

Paste `prompts/dev-log.txt`:

```text
I'll run the dev server in my own terminal, so I see what it prints and you don't. Make npm run dev also write everything it prints to .data/logs/dev-latest.log, keep that folder out of git, and add one line to CLAUDE.md saying where the logs are. That isn't part of #3, so land it as its own PR from main with auto-merge, then bring main back into this branch.
```

About five minutes. The worktree guard kept it from writing outside its worktree, so it made a separate `dev-logs` worktree
from `main`; wrote `scripts/dev.mjs`, changed the `dev` script to `node scripts/dev.mjs`, added `/.data/` to `.gitignore`
and one line to `CLAUDE.md`; tried it on a spare port (a page request, Ctrl+C, nothing left listening); ran
`npm run check`; committed. Its first command, a push and a pull request in one, was denied by the project's permission
rules, so it ran them one at a time. Pull request #15, "Log the dev server's output to .data/logs/dev-latest.log", opened
with auto-merge; a monitor watched its check until it merged; `main` was merged back into `worktree-create-group`.

The reply: merged to `main` as #15 and merged back into this branch; what changed (the wrapper, the log, colours kept in
the terminal, plain text in the log, a fresh log each run); tested before the pull request; notes: the denied command, and
each worktree writes its own log.

## 4. Our dev server (second terminal)

```bash
cd ~/potluck/.claude/worktrees/create-group/
cp .env.example .env.local
npm run db:migrate
npm run dev
```

"Migrations applied." Then `node scripts/dev.mjs`: Next.js 16.4.6, "Ready", Local `http://localhost:3000`.

## 5. A browser of its own (first terminal)

Paste `prompts/give-yourself-eyes.txt`:

```text
Now give yourself eyes. My dev server is running on port 3000. Install Playwright with its Chromium and write #3's browser test against that server: create a group, copy the link, open it, see the members, at desktop width and at phone width. Run it headless, save a screenshot of each step a reviewer would want to see, and look at them yourself. Then read the dev log for anything the page didn't show you. Commit the test.
```

"Churned for 4m 2s". It checked which checkout the server on port 3000 runs from (this worktree, through the wrapper);
`npm install --save-dev @playwright/test` (1.65.0) and `npx playwright install chromium`; `playwright.config.ts` and
`e2e/create-group.spec.ts`; noted where the log ended; both projects green on the first run; read its screenshots; forced a
red (the members expected in reverse order), restored, green again with `npm run check`; read the new log lines; committed.

The reply: the test passes headless in Chromium at desktop width and on a Pixel 7 (412 pixels); what it does (three members,
Copy link, the clipboard read back, the link opened in a fresh browser, name, currency and members in order); **to prove it
can fail**, the reversed order went red and green again once restored; **the screenshots**: at phone width the long link is
cut off in its field (Copy copies all of it), and the Share button never appears headless, so it is untested on a real
phone; **the dev log**: every group link is written to the log in full, the token is the group's only credential, and
Vercel's request logs will record the same paths. It suggested a ticket of its own for that; in the lesson it is noted for
later, and nothing is filed.

## 6. The log from our side (second terminal, new tab)

```bash
tail -n 14 .data/logs/dev-latest.log
```

`POST /` with `createGroupAction`, and `GET /g/` followed by a token for each group page the test opened. (The tokens are
blurred in the video: each one opens a group.)

## 7. The pull request (first terminal)

Type `/mattpocock-skills:pr` (the short `/pr` is "Unknown command" in Claude Code 2.1.323), a space, then paste
`prompts/open-the-pr.txt`:

```text
Open the PR for #3. Commit the screenshots a reviewer needs on this branch (a branch of their own would get its own preview and database copy) and show them in Evidence. It adds a migration, so don't queue auto-merge: that one waits for me.
```

It listed the test run's screenshots, copied four into `docs/evidence/issue-3/`, read them, committed them, wrote the body
with image links pinned to that commit, pushed, and opened #16 without auto-merge. Its first watcher on the checks stopped
early (this machine's `grep` is a different program), so it re-armed it with `jq`. The reply: #16 open for #3; the body's
Summary, Evidence and Not covered yet; Merge Danger one-way; then, from the watcher, the required check and the preview
passed, and auto-merge stays off.

## 8. In the browser

- **The pull request**: "Carries a migration", Evidence (Before, After, four screenshots, "The test went red when it
  expected the members in the wrong order"), Not covered yet, Door: one-way, group links in request logs, Vercel's bot
  comment with the preview Ready, all checks passed, no conflicts.
- **The preview** (from the bot's comment): Group name `Lisbon trip`, Currency `EUR`, Members `Ana`, `Ben`, Add member,
  `Dana`, Create group; Copy link ("Link copied."); back; the link pasted into the address bar: the same group.
- **The merge**: Merge pull request, Confirm merge; Merged, three checks passed, the branch deleted; ticket #3 closed.
