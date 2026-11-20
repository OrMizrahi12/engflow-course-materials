# Prompts and shell commands: Lesson 12.4, Eyes on production

Every prompt and key shell command run on camera, in order. Replace `<your-production-address>` and `<your-sentry-org>` with your own values.

## 1. Starting state & Vercel Hobby 1-hour log ceiling (shell)

```bash
curl -s https://<your-production-address>/api/health; echo
gh issue list --label ready-for-agent --limit 6
gh issue list --label ready-for-human --limit 20
T=$(npx vercel@65.5.0 api /v2/user 2>/dev/null | jq -r .user.defaultTeamId)
npx vercel@65.5.0 logs --scope $T --project potluck --environment production --since 2h --json 2>&1 | jq -r .data.serverMessage
```

Result: `The hobby plan does not retain runtime logs for the requested time range.`

## 2. Ticket #65 — liveness & deep health (tab 2, `claude -w liveness`)

```bash
export VITEST_MAX_WORKERS=4
claude -w liveness
```

Type `/implement #65 `, then paste `prompts/p_impl65.txt`:

> Keep what the smoke test relies on in /api/health (the commit it reports) and keep that test passing. The new liveness route is what Sentry's uptime monitor will call every 5 minutes, so it must never touch the database. On this machine the browser tests need --workers=2. When the review is done, land it.

Shipped: PR #84 merged (`9627224`), closing `#65`.

## 3. Ticket #66 — Sentry SDK & scrubbing (tab 3, `claude -w sentry-errors`)

```bash
export VITEST_MAX_WORKERS=4
claude -w sentry-errors
```

Type `/implement #66 `, then paste `prompts/p_impl66.txt`:

> The DSN will come from Sentry's Vercel integration as NEXT_PUBLIC_SENTRY_DSN, with SENTRY_AUTH_TOKEN, SENTRY_ORG and SENTRY_PROJECT for source maps: read those names. Send events and upload source maps only from production builds (VERCEL_ENV), whatever a preview has set. Add one test-error route for #67's last step: it throws only when reached on a deployment's own protected URL (host not VERCEL_PROJECT_PRODUCTION_URL), answers 404 on the public address, and its request carries a made-up /g/ link so we can watch the scrubber work. On this machine the browser tests need --workers=2. When the review is done, land it.

Shipped: PR #83 merged (`abf3299`), closing `#66`.

## 4. Ticket #67 — `/wizard` scope (tab 4, `claude -w sentry-wizard`)

```bash
export VITEST_MAX_WORKERS=2
claude -w sentry-wizard
```

Type `/wizard `, then paste `prompts/p_wizard.txt`:

> #67: wire Sentry to production. Read #67, the Sentry code #66 added and docs/agents/what-stays-human.md first. Use Sentry's Vercel integration so the DSN and the build token go from Sentry to Vercel without anyone copying a key. Our Sentry org already exists; the project doesn't. The uptime monitor watches the liveness route from #65 every 5 minutes. Show me the stages, what each one produces and your questions first. Write nothing until I answer.

## 5. Answering the wizard's six questions (tab 4)

Paste `prompts/p_answer_wizard.txt`:

> Skip stage 4, keep 3. Drop 7 and 9: the privacy PR's merge is the production build, and I throw the test error from my terminal with vercel curl. 1: delete nothing; list the variable names and targets with the vercel CLI through jq, never values. Previews send nothing by #66's code; the token reaching previews waits for our secrets work. 4: keep the new-issue email alert. 5: privacy page after the run. Stage 5's real path: vercel.com/integrations/sentry lands on the Marketplace page, whose Install offers Link Existing Sentry Account. Switch off automatic uptime monitors if offered. Commit it as scripts/setup-monitoring.sh, leave claude-build.yml alone, and don't test-run it: it opens my browser. Write it, check it, commit it, then stop: I run it, then you land it.

## 6. Removing `vercel link` from stage 5 (tab 4)

Paste `prompts/p_fix_link.txt`:

> One change before I run it: stage 5 mustn't run vercel link, which can pull development variables into a file. Read the names and targets with npx vercel@65.5.0 api /v9/projects/potluck/env through jq instead: that needs no link. Then commit and stop.

## 7. Running the wizard by hand (shell)

```bash
cd .claude/worktrees/sentry-wizard
scripts/setup-monitoring.sh
```

Stage 5 catches `SENTRY_DSN` vs `NEXT_PUBLIC_SENTRY_DSN` before any deploy.

## 8. Fixing the DSN name & privacy page (tab 4)

Paste `prompts/p_land_wizard.txt`:

> It ran, and its check caught one thing: the integration names the DSN SENTRY_DSN now, not NEXT_PUBLIC_SENTRY_DSN, so #66's code would find nothing. Read SENTRY_DSN instead, keep the production-only gate and its tests, and fix the script's check to match. Then the privacy page part of #67: name Sentry, say it receives errors only, with link tokens and IP addresses removed, kept 30 days, stored in the US. On this machine the browser tests need --workers=2. Then land it.

Claude opens PR #85 without auto-merge (one-way-door reasoning) and marks it `Part of #67`.

## 9. Merging PR #85 & proving the live test error (shell)

```bash
cd ~/potluck
gh pr checks 85
gh pr merge 85 --merge
git pull -q && git log --oneline -1

# Wait for Vercel deploy, then filter build logs for migrations & Sentry source maps
id=$(gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq '.statuses[] | select(.context=="Vercel") | .target_url | split("/") | last')
npx vercel@65.5.0 inspect "dpl_$id" --logs 2>&1 | grep -E 'Running "npm|from main|[Rr]estore|igrat|[Ss]entry|ource map|Build Completed'

# Public URL -> 404; deployment's own protected URL via vercel curl -> 500
curl -s -o /dev/null -w "%{http_code}\n" "https://<your-production-address>/api/test-error/g/SentryTestNotARealLink"
npx vercel@65.5.0 curl "/api/test-error/g/SentryTestNotARealLink" --deployment "dpl_$id" -- -s -o /dev/null -w "%{http_code}\n" 2>/dev/null
```

## 10. Adding read-only Sentry MCP & reading production (shell + tab 5)

```bash
claude mcp add --transport http sentry "https://mcp.sentry.dev/mcp/<your-sentry-org>/potluck"
claude -w read-production
```

Inside tab 5: run `/mcp`, choose `sentry` -> `Authenticate`, tick **only** `Inspect Issues & Events` (49 read-only tools), Approve, Authorize.

Then paste `prompts/p_read.txt`:

> Read production the way you'd read a failing test, and change nothing anywhere: which commit is live and since when (the vercel CLI with the team's ID as --scope, never its name or project settings), the commit statuses on main, errors in the last hour of production logs, and Sentry's open issues for potluck, including the one I just threw. Then tell me which of these should wake a person and which are noise, and whether you could resolve that Sentry issue yourself.

## 11. Teaching Potluck's `verify` skill (tab 5)

Type `/writing-for-agents `, then paste `prompts/p_wfa.txt`:

> Write what you just did into the verify skill as a read-only production section: the deploy list and log query, the commit statuses, Sentry through its read-only connection, the live site without writing anything, and never a connection to the production database. Try that section once against the live site, then land it.

On the read-outside-working-directories prompt, choose `4. Yes, but ask again next time`.
When auto mode denies pushing `.claude/`, paste `prompts/p_push_verify.txt`:

> Push it and open the PR, without auto-merge: a change to how the agent reads production is one I read before it lands. I'll merge it myself.

Inspect diff and merge PR #86 in your shell:

```bash
git fetch -q && git diff --stat main origin/worktree-read-production
git show origin/worktree-read-production:.claude/skills/verify/PRODUCTION.md | head -8
gh pr checks 86 --watch >/dev/null 2>&1; gh pr checks 86 | cut -f1,2
gh pr merge 86 --merge && git pull -q
```

## 12. Ticket #68 — hourly health workflow & live proof (tab 6 + shell)

```bash
claude -w health-hourly
```

Type `/implement #68 `, then paste `prompts/p_impl68.txt`:

> It adds a workflow under .github, so land it without auto-merge: I'll merge it. Give it a manual run with a URL input, so I can force one failure on purpose. On this machine the browser tests need --workers=2.

Merge PR #87 and prove failure (`OPEN`) + recovery (`CLOSED`) live from `main`:

```bash
gh pr checks 87 --watch >/dev/null 2>&1; gh pr checks 87 | cut -f1,2
gh pr merge 87 --merge

# Force failure against a nonexistent URL -> opens alert issue
gh workflow run health.yml -f url=https://potluck-no-such-deploy.vercel.app
gh issue list --search "Production health check failing in:title" --json number,title,state --jq '.[] | "#\(.number) \(.title) \(.state)"'

# Run against real production -> closes alert issue automatically
gh workflow run health.yml
gh issue list --state all --search "Production health check failing in:title" --json number,title,state --jq '.[] | "#\(.number) \(.title) \(.state)"'

# Close #67 by hand and verify live /api/health
gh issue close 67 --comment "Done in production: POTLUCK-1 arrived with /g/[token] and no IP; uptime monitor checks /api/live every 5 minutes and emails on downtime."
curl -s https://<your-production-address>/api/health; echo
```
