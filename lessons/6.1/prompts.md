# Lesson 6.1: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. "Lesson terminal" is a second
terminal window in `~/potluck`; "the session" is the Claude Code session started in step 3.

## 1. The ticket (lesson terminal, `~/potluck`)

```bash
gh issue view 2
```

Ticket #2, "Walking skeleton, live at the production URL", label `ready-for-human`. Done when the home page answers at the
production URL after a merged pull request whose four checks all passed. This lesson builds its local half.

## 2. Postgres 18 on your own machine (lesson terminal, Ubuntu and WSL; macOS: `postgres-18.md`)

```bash
sudo apt install -y postgresql-common
sudo /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh      # pasted; press Enter at its prompt
sudo apt install -y postgresql-18
sudo pg_ctlcluster 18 main start                                     # only if the server is not running yet
sudo -u postgres createuser -s $USER
createdb potluck
psql potluck -c 'select version()'                                    # q leaves the pager
psql potluck -c 'show server_version'
```

On camera: `PostgreSQL 18.6 (Ubuntu 18.6-1.pgdg24.04+2)`, then `18.6`.

## 3. A session in its own worktree (main terminal, `~/potluck`)

```bash
claude -w walking-skeleton
```

The header shows the session's folder: `~/potluck/.claude/worktrees/walking-skeleton`, on a new branch
`worktree-walking-skeleton` that starts from `main` as it is on GitHub.

## 4. /implement, scoped (in the session)

Typed `/implement`, a space and `#2 `, then pasted:

```text
Only the local half today: the app, the database with its migrations and seed, the service tests on PGlite, a check script that runs types, lint and tests, and a GitHub Actions workflow that runs the same check on every push. Add a health route that answers without touching the database, and ignore .claude/worktrees/. Anything that needs Vercel or Neon, Playwright included, waits for the next step. My Postgres 18 runs on this machine: database potluck, as me, over the socket (postgresql:///potluck?host=/var/run/postgresql). Commit, but don't push.
```

On camera it worked for 8 minutes 14 seconds: it read ticket #2 and stated its title, called the `tdd` skill, wrote a failing
test on a fresh PGlite database before the code, proved the migration lock by hand, committed (`Add the walking skeleton's
local half (#2)`), then ran `code-review` as two parallel reviewers (standards, spec) and asked us about the findings.

## 5. Our decision on the review (in the session, pasted)

```text
Move the greeting row into the seed, since the spec says the seed is the only source of data. Fix the glossary wording and the naming too, then commit.
```

About a minute: three tests written first (all failed), then the change, then all three passed. Commit `Seed the greeting
instead of migrating it; use glossary wording`. It also rebuilt the local `potluck` database, because a migration that had
already run there had changed.

## 6. Check it yourself (lesson terminal)

```bash
cd .claude/worktrees/walking-skeleton/      # typed as: cd .cl<Tab>w<Tab>w<Tab>
git log --oneline -5
npm run check                                # typecheck, lint, check:deps, tests: 3 passed
npm run db:seed                              # Seed loaded.
npm run dev                                  # Next.js 16.4.6, http://localhost:3000, Ready
```

Open `http://localhost:3000` in the browser: "Potluck / Potluck is connected to its database." Then, in a second terminal tab:

```bash
curl -s localhost:3000/api/health            # {"status":"ok"}
exit
```

Back in the first tab, Ctrl+C stops the dev server.

## 7. A pre-commit hook the author's way (in the session, pasted)

```text
Now add a pre-commit hook the way the author's setup-pre-commit skill does it. It isn't one of the plugin's commands, so read it here and follow it: ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/misc/setup-pre-commit/SKILL.md
```

Use your own plugin version in the path (`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`). About a
minute: Husky, lint-staged and Prettier, the hook, and the commit `Add pre-commit hooks (husky + lint-staged + prettier)`,
which ran through the new hook (Prettier, typecheck, tests).

## 8. Push and watch CI (in the session, pasted)

```text
Push this branch and watch CI until it finishes. Don't open a PR: landing it is the next step.
```

It pushed the branch, watched the run, and reported back by itself: "CI passed on the pushed branch". The run took
1 minute 10 seconds on GitHub.

## 9. What is left (lesson terminal)

```bash
cat .husky/pre-commit
git log --oneline -4
gh run list -L 3
gh issue view 2 --json state,title                           # OPEN
gh issue view 2 --json body --jq .body | grep -c '\[ \]'     # pasted; 24 unticked boxes
git worktree list
```

Ticket #2 stays open: it closes when lesson 6.3 ships it.
