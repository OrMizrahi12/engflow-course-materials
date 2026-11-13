# Student kit: Lesson 6.1, The walking skeleton

Module 6 starts building. Ticket #2, "Walking skeleton, live at the production URL", is the one ticket that can start, and
it is done only when the home page answers in production after a merged pull request. This lesson builds its local half:
Postgres 18 on our own machine, a fresh Claude Code session in its own worktree (`claude -w walking-skeleton`), and
`/implement #2` with one scope paragraph. It states the ticket's title, tests first, commits, runs two reviewers and asks us
about their findings; we decide (the greeting row moves into the seed). We check it ourselves (`npm run check`, the page,
the health route), add the author's pre-commit hook, push, and watch CI pass on GitHub. Ticket #2 stays open: it closes
when lesson 6.3 ships it.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `postgres-18.md` | Postgres 18 on Ubuntu, WSL and macOS, and the connection string for each |
| `potluck-at-lesson-6.1.md` | what the Potluck repository holds at the tag `lesson-6.1`, the three commits, the ticket |
| `potluck/` | the walking skeleton's new files exactly as they are at the tag (workflow, hook, scripts, database, tests, health route) |
| `implement.md` | the card: what `/implement` does and what it leaves to you, when to use it, it's working if |
| `walking-skeleton.md` | the card: the walking skeleton, one change per worktree, one check in three places |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck in `~/potluck` with the spec (#1) and the tickets (#2 to #11) from lesson 5.3, signed in to GitHub
  with `gh` (lesson 3.2).
- Node 24 and npm (lesson 2.1), Claude Code, and the `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera).
- On camera Claude Code ran in auto mode. In default mode you approve each command as it comes.

## The steps, as on camera (Ubuntu)

**1. The ticket.** In the lesson terminal: `gh issue view 2`. Read the criteria in groups (app and tooling, database,
tests, hosting, CI and protection) and the bar: done when the home page answers at the production URL after a merged pull
request whose four checks passed. Half of it needs Vercel and Neon accounts, so today is the local half.

**2. Postgres 18.** Install it, start it if needed, make a role named after you and a database `potluck` (`prompts.md`,
step 2; macOS in `postgres-18.md`). On camera: PostgreSQL 18.6. The installs took 25, 10 and 21 seconds.

**3. A worktree.** In the main terminal, in `~/potluck`: `claude -w walking-skeleton`. The header shows the folder
`~/potluck/.claude/worktrees/walking-skeleton`; the branch is `worktree-walking-skeleton`, from `main` as it is on GitHub.

**4. /implement.** Type `/implement`, a space, `#2 `, and paste the scope paragraph (`prompts.md`, step 4). Before it
starts: will it make a branch for you? It reads #2 and states the title, calls `tdd`, writes a failing test on PGlite,
generates the migration, proves the advisory lock by hand, builds the app, checks the health route with the database
unreachable, commits, and runs `code-review` as two reviewers. On camera: 8 minutes 14 seconds (a time-lapse in the video).
It made no branch: it commits to the branch it is on, and the worktree gave us that branch.

**5. The review is yours.** It asks about the findings. Ours: the spec says the seed is the only source of data, so the
greeting row moves into the seed; fix the glossary wording and the naming too, then commit (`prompts.md`, step 5).

**6. Check it yourself.** In the lesson terminal, `cd` into the worktree, `git log --oneline -5` (two commits on top of
`main`), `npm run check` (3 tests passed), `npm run db:seed`, `npm run dev`, then the page in the browser and
`curl -s localhost:3000/api/health` in a second tab. Ctrl+C stops the server.

**7. A pre-commit hook.** Paste the request with the path to the author's `setup-pre-commit` skill (`prompts.md`, step 7).
Its commit runs through the new hook. Read its notes: the hook applies to every checkout of the repository, existing files
aren't in Prettier's style yet, and lint runs only in `check` and CI.

**8. Push and CI.** Paste: push this branch and watch CI, no pull request yet. The run passed in 1 minute 10 seconds.

**9. Still open.** `gh issue view 2 --json state,title` says `OPEN`; 24 boxes unticked; `git worktree list` shows `main`
and the worktree. Leave the session open: lesson 6.3 writes the pull request from it.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy: install Postgres 18, `claude -w walking-skeleton`, `/implement #2` with the scope paragraph, then
`npm run check`, open the page, push, and watch your own Actions run go green.

**Checkpoint (it's working if):** your page answers locally, your Actions run is green, and ticket #2 is still open.

## If something goes differently

- **It works on something else, or states another title.** Stop it and pass the full reference (`owner/repo#2` or the
  issue's URL).
- **It stops to ask about the seams.** The spec agreed them: the group service on PGlite, Playwright later on previews.
- **Its review finds other things.** Decide each one yourself; the reason matters more than the choice.
- **A command is refused because the session is isolated in the worktree.** That is the worktree protecting `main`; let it
  split the command, or approve it if it is safe.
- **`npm run dev` can't reach the database.** Check `.env.local` against `postgres-18.md`, and that the server is up
  (`pg_lsclusters` on Ubuntu).
- **CI fails on GitHub but not locally.** Ask the session to read the failed run (`gh run view --log-failed`) and fix it.
- **Your run takes longer or uses more tokens.** A non-trivial ticket often passes 100k tokens; that is normal.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1, in
your Linux home folder (`~`), and open `http://localhost:3000` in your Windows browser. On macOS install Postgres with
Homebrew or Postgres.app and use `host=/tmp` in the connection string (`postgres-18.md`); use a second Terminal window
(Cmd+N) for the lesson terminal.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-6.1` points at
`39ae8dd`, the tip of the branch `worktree-walking-skeleton`; `main` is unchanged until lesson 6.3. Clone the repository to
look or to start from here; don't fork it. `potluck-at-lesson-6.1.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the worktree
  session made 69 requests to Opus 5.5 and its two reviewers 9 more; the session ended at 121.9k tokens of context.
- Postgres, Node, npm, git, `gh`, the skills (open source, MIT License) and GitHub Actions on a public repository are free.
- Vercel and Neon come in the next lessons; Vercel's free Hobby plan is for non-commercial use.

## Credits

The `implement`, `tdd`, `code-review` and `setup-pre-commit` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. They are described here in
our own words, with short quotes of the installed 1.3.1 files and their documentation; the hook files follow the
`setup-pre-commit` skill. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
