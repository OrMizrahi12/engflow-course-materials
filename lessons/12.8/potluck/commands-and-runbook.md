# Commands and Runbook: Lesson 12.8

All shell commands from the lesson, parameterized for your own Potluck repository and free accounts.

## 1. Two-minute morning production check

```bash
# Confirm starting commit / tag
git log --oneline -1 && git describe --tags --exact-match

# Live endpoints (/api/live never touches Postgres; /api/health checks DB + schemaCurrent)
curl -sS https://<your-app>.vercel.app/api/health | jq .
curl -sS -o /dev/null -w 'api/live: HTTP %{http_code}\n' https://<your-app>.vercel.app/api/live

# Vercel Hobby 5xx check (1-hour log window) & active Firewall rules
V="npx --yes vercel@65.5.0"
$V logs requests --project <your-project> --environment production --since 59m --query 'httpStatus >= 500' --json | jq -c 'select(.type == "summary") | {errors5xx: .recordsReturned}'
$V api "/v1/security/firewall/config/active?projectId=<your-project-id>" | jq -c '.rules[] | {name, active}'

# GitHub Actions uptime heartbeat + latest encrypted nightly backup artifact
gh run list --workflow health.yml --limit 2 --json conclusion,createdAt --jq '.[] | "health: \(.conclusion) (\(.createdAt))"'
gh api 'repos/<owner>/<repo>/actions/artifacts?per_page=1' --jq '.artifacts[0] | "backup: \(.name) (\(.size_in_bytes) bytes, expires \(.expires_at))"'

# Open bot PRs and open backlog issues
gh pr list --state open --json number,title,author --jq '.[] | "#\(.number) [\(.author.login)] \(.title)"'
gh issue list --state open --json number,title,labels --jq '.[] | "#\(.number) [\([.labels[].name]|join(","))] \(.title)"'
```

Also open in your browser:
- **Sentry:** Issues (`0` new overnight), Crons / Monitors (`liveness` 5-min + nightly backup), and Stats (free monthly quota).
- **Neon:** Usage (`CU-hours`, storage, and **Branches vs 10-branch cap**). Delete stale remote branches (`git push origin --delete <stale-branch>`) before previews hit the limit.

## 2. Dependabot triage & safe salvage

```bash
# Inspect failing checks on the Dependabot PR
gh pr checks <pr-number>
gh run view <failed-run-id> --log-failed

# Reclaim a Neon branch slot by deleting a stale remote branch (if needed)
git push origin --delete <stale-branch>

# Worktree to keep safe minor/patch updates and revert breaking majors
claude -w deps-fix
# Paste prompts/p_fix91.txt, inspect the package.json diff yourself, then merge:
gh pr diff <pr-number> -- package.json
gh pr merge <pr-number> --squash --delete-branch
```

## 3. Align & plan (`Spec` → parallel frontier)

```bash
# Start fresh on main for /triage -> /grill-me -> /to-spec -> /to-tickets
git pull --ff-only
claude
# Paste prompts/p_triage.txt -> /triage
# Paste prompts/p_grill.txt  -> /grill-me
# Paste prompts/p_answer_spec.txt -> /to-spec
# Paste prompts/p_tickets.txt -> /to-tickets #<spec-number>
```

## 4. Dispatch three execution lanes in parallel

```bash
# Inspect native GitHub blocking edges across your frontier
for n in <t1> <t2> <t3>; do
  b=$(gh api repos/<owner>/<repo>/issues/$n/dependencies/blocked_by --jq '[.[].number]' 2>/dev/null)
  gh api repos/<owner>/<repo>/issues/$n --jq "\"#\(.number) [\(.state)] \(.title) — blocked by $b\""
done

# Lane 1 (Unattended CI): maintainer applies claude-build ONLY to pure-module tickets
gh issue edit <t1> --add-label claude-build
gh run list --workflow claude-build.yml --limit 1

# Lane 2 (Local background session): bounded read-only triage
claude --bg --name triage-46 --permission-mode auto "Read open issue #<backlog>, its test file, and .husky/pre-commit. Summarize in 4 short bullets whether it looks like memory pressure or a real bug, and post a brief triage comment. Do not edit code or open a PR."
claude agents --json --all

# Lane 3 (Steered local worktree): UI / glossary / service-seam ticket
claude -w group-spending
# Paste prompts/p_impl104.txt
```

## 5. Fresh two-axis `/code-review`, wave-1 merge, unblocked ticket, and live verification

```bash
# Fresh session reviewing the unattended CI PR (never grade in the author session)
git fetch origin <ci-branch>
claude
# Run /code-review with prompts/p_review_ci.txt

# Human merges wave 1 one PR at a time, updating the second branch cleanly
gh pr merge <ci-pr> --squash --delete-branch
gh pr update-branch <worktree-pr>
gh pr checks <worktree-pr> --watch
gh pr merge <worktree-pr> --squash --delete-branch

# Build the newly-unblocked ticket in a fresh worktree
claude -w copy-summary
# Paste prompts/p_impl105.txt, review, merge, and verify on your own demo group live
```

## 6. End-of-day `/retro` and clean close

```bash
# Fresh worktree for /retro
claude -w day-retro
# Paste prompts/p_retro.txt -> review ranked candidates -> paste prompts/p_retro_land.txt

# Human reviews .github/** diff before merging
gh pr diff <retro-pr> -- .github/dependabot.yml .husky/pre-commit
gh pr merge <retro-pr> --squash --delete-branch

# Clean close on main
git checkout main && git pull --ff-only
gh issue close <spec-number> --reason completed
gh pr list --state open
curl -sS https://<your-app>.vercel.app/api/health | jq '{status, commit, schemaCurrent}'
curl -sS -o /dev/null -w 'api/live: HTTP %{http_code}\n' https://<your-app>.vercel.app/api/live
```
