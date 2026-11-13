# Lesson 6.2: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. Every command runs in the
walking-skeleton worktree, `~/potluck/.claude/worktrees/walking-skeleton`. "The session" is the Claude Code session started
in step 2; "the wizard tab" is a second terminal tab in the same folder.

## 1. The ticket's Hosting part

```bash
gh issue view 2
```

Ticket #2's Hosting criteria: a Vercel Hobby project linked to the repo and building on Node 24; a Neon Free project on
Postgres 18 (production on the root branch; a `development` branch created from the root while it's empty, then seeded and
made the default branch); Neon's Vercel integration giving each pull request's preview its own branch copied from
`development`, deleted when the pull request merges; migrations inside the Vercel build (production's against the root
branch, each preview's against its own branch; a failing migration fails the build).

## 2. /wizard, scoped (a fresh session in the worktree)

```bash
claude
```

The header: Opus 5.5, `~/potluck/.claude/worktrees/walking-skeleton`. Then type `/wizard` (the menu shows
`/mattpocock-skills:wizard`), a space, and paste `prompts/wizard-hosting.txt`:

```text
Set up where Potluck runs, for ticket #2's Hosting criteria: Vercel and Neon, so we get local, preview and production. Show me the stages before you write anything. Code that belongs to it, like migrations in the Vercel build, you write; the wizard is only for what I have to click. Playwright, the CI checks, branch protection and the firewall rule come later, not today.
```

It read the repo and ticket #2 (`git ls-files`, `package.json`, `gh issue view 2`), the decision records and the README,
then fetched Neon's docs for the Vercel integration and for branches. Worked for 1 minute 26 seconds. Its plan, with
nothing written yet:

- **Code it writes itself (no clicking):** `vercel.json` with `buildCommand: "npm run db:migrate && npm run build"` (a failed
  migration stops the `&&` chain, so the build fails); migrations on the direct (unpooled) connection, because the advisory
  lock is held for a whole session and Neon's pooled endpoint hands out connections per transaction; a short Hosting section
  in the README; `scripts/setup-hosting.sh`, the wizard.
- **Wizard stages (only the parts you click):** 1 Neon project; 2 `development` branch from the empty production, set as the
  default; 3 seed `development`; 4 Vercel project (its first production build of `main` expected to fail); 5 the Neon
  Vercel integration with Production branch = `production`; 6 check the preview.
- **Three things to decide:** production isn't proven until the branch merges; may it commit and push; the region (US East,
  or somewhere closer to your users).

## 3. Our answers (in the session)

Paste `prompts/wizard-answers.txt`:

```text
Region: Frankfurt for both, Neon's AWS Europe Central 1 and Vercel's fra1. Every page talks to the database several times, so the two must sit together, and our first group, my flat, is far closer to Frankfurt than to Washington. Production can wait for the merge. Commit on this branch, but no push in the wizard and no PR: I'll ask you to push after it, so the first preview comes after the link. Stage 2: Neon's console sets a new branch to delete itself after a day; say to untick that. Replace stage 6 with signing the Vercel CLI in and linking this folder, so after the push you can check which database each environment really got, host names only. Commit the wizard, linked from the README. And don't test-run it: it opens pages in my browser.
```

About two minutes on camera. It read the skill's `template.sh`, pinned `vercel@65.5.0` (the newest release was published
that day, so it took one at least two weeks old), wrote `src/db/env.ts`, `scripts/migrate.mts` and `vercel.json`, copied the
template's library unchanged and wrote six stages below it, checked a shell-set `DATABASE_URL` overrides the one in
`.env.local`, ran `bash -n` and `shellcheck`, added the README section and committed. Its report: committed on
`worktree-walking-skeleton` as `8ebefe8`, nothing pushed; stage 3 takes the development connection string hidden, rejects
the pooled one and forgets it after the seed; stage 5 sets Production branch = `production`, not the default; nothing goes
into `.env.local` or GitHub, the integration puts the connection strings into Vercel.

## 4. The wizard (the wizard tab: Ctrl+Shift+T)

```bash
scripts/setup-hosting.sh
```

Banner "Potluck hosting: Neon + Vercel in Frankfurt", 6 stages; Ctrl-C stops it any time and a re-run keeps saved values.
Press Enter to start; after each stage, Enter again.

| Stage | What you do | What came back on camera |
|---|---|---|
| 1 Neon: create the project | New project: `potluck`, Postgres 18, AWS Europe Central 1 (Frankfurt), database `neondb` → Create | "Your new project was created in 660 ms"; one branch, `production`, the default |
| 2 Neon: `development`, the default | Branches → New branch: parent `production`, current data, name `development`, Auto-delete **Never** → Create; then ⋮ → Set as default → Confirm | "Branch forked in 0.84 sec"; `development` wears the Default badge |
| 3 Neon: seed `development` | Connect → branch `development`, pooling **off** → copy → paste into the hidden prompt (Ctrl+Shift+V) | `Seeding ep-…`, `✓ development migrated and seeded`, "The string isn't saved anywhere." |
| 4 Vercel: import the repo | vercel.com/new → GitHub → Install the Vercel app, Only select repositories → `potluck` → Install; Import → name `potluck` → Deploy | "Deployed to Production … in 3 seconds"; the page: 404 NOT_FOUND (`main` has no app yet) |
| 5 Connect Neon to Vercel | Neon → Integrations → Vercel → Add → Install from Vercel Marketplace → Install → Link Existing Neon Account → Continue → team → Specific Projects → potluck → Connect Account → Production branch **`production`** (preset was `development`), dev-environment branch off, delete obsolete branches on → Continue → Connect → Done | Success |
| 6 Vercel CLI: sign in and link | Allow Access on Vercel's device page | "Congratulations! You are now signed in."; the plugin question: "No answer after 30 seconds"; Linked `potluck`; `.env.local` updated with a fresh `VERCEL_OIDC_TOKEN` (git-ignored); `✓ linked (.vercel/ is gitignored)`; Setup complete |

## 5. Push and check (in the session)

Paste `prompts/push-and-check-databases.txt`:

```text
The wizard is done. Push this branch, and when its preview is ready, check which Neon database production, the preview and Development really got. Host names only, never a password, and don't read .env.local.
```

It pushed, found the preview Vercel started (the first one was cancelled and restarted straight away, "which looks like the
integration creating its Neon branch first"), polled it in the background until Ready, read the variables with the Vercel
command line into scratch files it deleted, and fetched the protected preview through the command line. 1 minute 42 seconds
in all. Its table (host names shortened):

| Vercel environment | Neon host (pooled for the app / direct for migrations) | What it should be |
|---|---|---|
| Production | `ep-muddy-frog-…-pooler…` / `ep-muddy-frog-…` | the root branch, `production` |
| Preview (`worktree-walking-skeleton`) | `ep-morning-math-…-pooler…` / `ep-morning-math-…` | its own copy of `development` |
| Development | no database variables | none: local uses your own Postgres |

It also said the host name alone doesn't prove which Neon branch production is on (check in Neon), and corrected its earlier
wording: the production build of `main` succeeded (Ready, a 1-second build) and served nothing, because `main` has no app yet.

## 6. Look for yourself (browser)

- Neon → potluck → Integrations → Vercel: Production branch `production`; one preview branch,
  `preview/worktree-walking-skeleton`.
- Neon → Branches: `production` (root), `development` (Default, from production), `preview/worktree-walking-skeleton`
  (from development, created by Vercel). Open `production`: "This branch backs your Vercel Production environment."
- Vercel → potluck: production is `main`, Ready, a 404. Deployments: the preview (Ready, 35 s) and production (Ready, 1 s).
- The preview's ⋯ → Inspect Deployment → Deploy Logs: `Running "npm run db:migrate && npm run build"`, `Migrations applied.`,
  then `next build`.
- Visit: "Potluck is connected to its database."
- Settings → Environment Variables: `DATABASE_URL` and `DATABASE_URL_UNPOOLED` for Preview (scoped to
  `worktree-walking-skeleton`) and for Production; the values hidden.
