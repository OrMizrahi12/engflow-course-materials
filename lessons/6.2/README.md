# Student kit: Lesson 6.2, Three environments

Ticket #2 has a Hosting part we skipped in lesson 6.1: a Vercel Hobby project, a Neon Free project on Postgres 18, Neon's
Vercel integration giving every pull request's preview its own copy of the database, and migrations that run inside the
Vercel build. This lesson sets it up. `/wizard` reads the repo and the ticket, writes the code half itself (`vercel.json`,
migrations on Neon's direct connection) and turns the dashboard half into a six-stage script that we run ourselves. Then we
push the branch and check which database each place really got: local is our own Postgres, the preview has its own copy of
`development`, and production runs on Neon's root branch.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/wizard-hosting.txt` | the scope pasted after `/wizard` |
| `prompts/wizard-answers.txt` | our answers to its plan (region, commit without push, the expiry, the last stage) |
| `prompts/push-and-check-databases.txt` | the last request: push, then check which database each environment got |
| `potluck-at-lesson-6.2.md` | what the Potluck repository holds at the tag `lesson-6.2`, the commit, the hosting it set up |
| `potluck/scripts/setup-hosting.sh` | the wizard Claude wrote, exactly as it is at the tag (the library above the marker, six stages below) |
| `potluck/vercel.json` | Next.js, the build command (migrations first) and the region `fra1` |
| `potluck/src/db/env.ts` | `migrationDatabaseUrl()`: on Vercel, migrations take `DATABASE_URL_UNPOOLED` or stop with a clear error |
| `potluck/scripts/migrate.mts` | the migration script, now on that connection string |
| `wizard.md` | the card: what `/wizard` takes in and gives back, when to reach for it, it's working if |
| `three-environments.md` | the card: local, preview, production, which database each uses, the order, the safe path for migrations |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 6.1: the branch `worktree-walking-skeleton` in its worktree
  (`~/potluck/.claude/worktrees/walking-skeleton`), with `npm install` done, Postgres 18 running locally, signed in to
  GitHub with `gh`.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera), in auto mode on camera.
- Free accounts at [vercel.com](https://vercel.com) (Hobby) and [neon.com](https://neon.com) (Free), signed in in your
  browser, with no project called `potluck` yet. Vercel signs in with your GitHub account.

## The steps, as on camera (Ubuntu)

**1. The ticket's Hosting part.** `gh issue view 2`. Four lines: a Vercel Hobby project on Node 24; a Neon Free project on
Postgres 18, production on the root branch, a `development` branch copied from the root while it is empty, then seeded and
made the default; Neon's Vercel integration giving every preview its own branch copied from `development`; migrations inside
the Vercel build, a failing migration fails the build. The bar is unchanged: done when the home page answers in production
after a merge. Today is everything under it except the merge.

**2. /wizard.** In the worktree folder, start a fresh session with `claude`, type `/wizard` and paste the scope
(`prompts/wizard-hosting.txt`). Before it answers: by hand, would you set up the host first, or the database? It reads the
repo, ticket #2 and the decision records, and fetches Neon's docs for the integration (1 minute 26 seconds on camera). Its
plan writes nothing yet: the code it will write itself, then six stages (Neon project; `development` from the empty
production, set as the default; seed it; the Vercel project; the link with production picked by hand; check the preview),
and three questions: production waits for the merge, may it commit and push, and the region.

**3. Our answers.** Paste `prompts/wizard-answers.txt`: Frankfurt for both (every page talks to the database several times,
so the app and the database sit together), commit but don't push (the first preview must come after the link), untick the
new branch's one-day expiry, make the last stage sign in the Vercel command line and link the folder, and don't test-run it.
On camera it worked for about two minutes: it pinned a Vercel command-line release at least two weeks old (`vercel@65.5.0`),
wrote `src/db/env.ts`, `scripts/migrate.mts`, `vercel.json`, the wizard (the template's library unchanged) and a Hosting
section in the README, checked the script with `bash -n` and `shellcheck`, and committed `8ebefe8`. Nothing was pushed.

**4. Run the wizard yourself.** Open a second terminal tab (Ctrl+Shift+T), go to the worktree folder and run
`scripts/setup-hosting.sh` (Tab completes the name). Each stage opens its page and lists the clicks.

- **Stage 1, the Neon project.** Name `potluck`, Postgres 18, AWS Europe Central 1 (Frankfurt; the region starts on Ohio),
  database `neondb`. Created in 660 ms. Its one branch, `production`, is the root and, for now, the default.
- **Stage 2, `development`.** Branches → New branch → name `development`, parent `production` with its (empty) data.
  Change "Auto-delete after 1 day" to Never: a branch made in the console deletes itself otherwise. Create (forked in
  0.84 s). Then on the branch: ⋮ → Set as default → confirm. Past the free plan's limits only the default branch keeps
  running.
- **Stage 3, the seed.** Connect → branch `development` → Connection pooling off (the seed runs the migrations under the
  advisory lock, which needs a session) → copy the string with the copy button → paste it into the wizard's hidden prompt
  (Ctrl+Shift+V in the terminal; nothing shows). It seeds the development host and forgets the string.
- **Stage 4, the Vercel project.** vercel.com/new → GitHub → Install the Vercel app → Only select repositories → your
  `potluck` → Install. Then Import → project name `potluck` → leave the settings (the preset reads Other, because `main` has
  no app yet) → Deploy. GitHub and Vercel may ask you to confirm your identity first: that is yours to do. Stage 4 names our
  repository (`OrMizrahi12/potluck`); pick yours.
- **Stage 5, the link.** Neon → the potluck project → Integrations → Vercel → Add → Install from Vercel's Marketplace →
  Install → Link Existing Neon Account → Continue → your team → Specific Projects → potluck → Connect Account. In Neon's
  dialog: Vercel project potluck; **Production branch: pick `production` by hand** (it is filled in with `development`,
  because that is the default now); "Create a branch for the development environment" off; "Automatically delete obsolete
  Neon branches" on. Continue → Connect → Done (12 seconds on camera).
- **Stage 6, the Vercel command line.** `npx` fetches `vercel@65.5.0` (about half a minute), opens Vercel's device page with
  the code filled in → Allow Access. It offers a plugin for coding agents (we left it; the question times out after
  30 seconds), links the folder to the potluck project, and writes a short-lived Vercel token (`VERCEL_OIDC_TOKEN`) to
  `.env.local`, which git ignores. No database string goes there. Setup complete.

**5. Push and check.** Back in the session, paste `prompts/push-and-check-databases.txt`. It pushes; Vercel cancels the
first preview build and restarts it straight away (Claude reads it as the integration creating the preview's branch); it
polls in the background until the build is ready (the whole exchange: 1 minute 42 seconds). Its table, host names only:
production on `ep-muddy-frog…` (which should be the root branch; the host name alone can't prove it), the preview on
`ep-morning-math…` (its own copy of `development`), development with no database variables (local uses your own Postgres).

**6. Look for yourself.** In Neon: the Vercel panel says the production branch is `production` and lists one preview
branch, `preview/worktree-walking-skeleton`; Branches shows three (production, the root; development, the default, copied
from it; the preview's, copied from development, created by Vercel); production's page says "This branch backs your
Vercel Production environment". In Vercel: production is `main`, Ready, still a 404; Deployments shows the preview
(35 seconds) and production (1 second); Inspect the preview → Deploy Logs: `Running "npm run db:migrate && npm run build"`,
then `Migrations applied.`, then `next build`. Visit: "Potluck is connected to its database." (the seeded greeting).
Settings → Environment Variables: `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for Preview (scoped to the branch) and for
Production. The values stay hidden.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy at the tag `lesson-6.2` (or your own branch from lesson 6.1), with your own free Vercel and Neon accounts,
run `scripts/setup-hosting.sh`. Pick the region nearest your users, the same on both sides (`regions` in `vercel.json` and
Neon's region). Then push your branch and check which database your preview got.

**Checkpoint (it's working if):** Neon lists a `preview/<your-branch>` branch copied from `development`, the preview's build
log shows `Migrations applied.`, and the preview page shows the seeded greeting.

## If something goes differently

- **Your preview copied production.** The default branch was set after the link. Make `development` the default, then
  remove the integration and connect it again.
- **The link's Production branch reads `development`.** Expected: it is filled in with the default. Pick `production` by
  hand, or production will run on seed data.
- **Neon's confirm screen shows development's address for both variables.** We saw that too: go Back, check that the
  Production branch still says `production`, and check the real values after the push.
- **The first production build of `main`.** The wizard warns it will fail; on camera it succeeded in 1 second and served a
  404, because `main` has no app yet. Either way nothing real is served until the branch merges (lesson 6.3).
- **Neon's console shows an error toast** ("Cannot read properties of null") while the Create project dialog opens. It
  happened twice on camera and changed nothing; close it and carry on.
- **The seed prints a `SECURITY WARNING` about SSL modes.** It is a notice from the Postgres driver, not a failure: the
  seed still loads. The preview's build log shows the same line.
- **The wizard says "That's the pooled string."** Turn Connection pooling off in Neon's Connect dialog and copy again.
- **The browser doesn't open.** The wizard prints the address; open it yourself.
- **You stop halfway.** Ctrl+C, then run the wizard again; each stage says what to check before you press Enter.

## Windows (WSL), macOS and Linux

The wizard is a bash script: on Windows run it inside the Ubuntu (WSL) terminal from lesson 2.1, in your Linux home folder;
it opens pages in your Windows browser through `wslview` or `explorer.exe`. On macOS it uses `open`; paste with Cmd+V. The
dashboards are the same everywhere.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-6.2` points at
`8ebefe8`, the tip of the branch `worktree-walking-skeleton`; `main` is unchanged until lesson 6.3. Clone the repository to
look or to start from here; don't fork it, and connect your own Vercel and Neon projects. `potluck-at-lesson-6.2.md` has the
details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the session
  ran on Opus 5.5 and ended at 77.5k tokens of context.
- **Vercel Hobby** is free for non-commercial use. **Neon Free**, as its dialog showed: 1 GB of storage, scale to zero,
  autoscaling up to 2 CU, 10 branches per project. A preview's branch is deleted when its pull request merges.
- Postgres, Node, npm, git, `gh` and the skills (open source, MIT License) are free.

## Credits

The `wizard` skill and its `template.sh` library are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt
Pocock, under the MIT License. The wizard in this kit was generated by that skill on camera: the library above its marker is
the template's, unchanged. The skill is described here in our own words. This course is independent: unofficial, and not
affiliated with or endorsed by Matt Pocock.

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
