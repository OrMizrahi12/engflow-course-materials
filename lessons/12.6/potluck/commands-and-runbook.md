# Commands and incident runbook (Lesson 12.6)

Exact shell commands run on camera (replace `https://<your-production-url>` and `<your-github>/<repo>` with your own).

## 1. Check start state and seed blind spot
```bash
git log --oneline -1 && git describe --tags --exact-match
curl -s https://<your-production-url>/api/health; echo
curl -s -o /dev/null -w 'live: HTTP %{http_code}\n' https://<your-production-url>/api/live
grep -nE 'async function seed|addExpense\(' src/db/seed.ts
sed -n '/^## Rollback/,/^## Restore/p' docs/production.md | head -n 24
```

## 2. Capture live Vercel runtime error logs (before Hobby's 1-hour window expires)
```bash
V="npx --yes vercel@65.5.0"
S="--scope $(jq -r .currentTeam ~/.local/share/com.vercel.cli/config.json)"
$V logs --project potluck --environment production --since 30m --limit 20 --query 'level:error' --json $S 2>/dev/null \
  | jq -r 'select(.type=="log" and (.data.message | test("TypeError"))) | "\(.data.timestamp) \(.data.deploymentId) \(.data.level):\n\(.data.message)"' \
  | head -n 6
```

## 3. Open incident issue and roll back FIRST
```bash
gh issue create \
  --title "Incident: group page crashes on production" \
  --body "Production error on /g/[token] (Sentry POTLUCK-2, release 11abb4f, digest 1019320247). Rolling back first, diagnosing second."

$V rollback <last-good-deployment-id> --yes $S

# Poll until /api/health flips back to the rolled-back commit
while true; do
  h=$(curl -s https://<your-production-url>/api/health)
  if echo "$h" | grep -q <last-good-short-sha>; then echo "$h"; break; fi
  sleep 3
done
curl -s -o /dev/null -w 'live: HTTP %{http_code}\n' https://<your-production-url>/api/live
```

## 4. Merge fix PR, observe post-rollback pin, and run `vercel promote`
```bash
gh pr merge <fix-pr-number> --merge
git pull -q && git log --oneline -1

# Inspect live health & commit statuses (on Hobby, health still shows the rolled-back commit and Smoke test sits on pending)
curl -s https://<your-production-url>/api/health; echo
sha=$(git rev-parse HEAD)
gh api repos/<your-github>/potluck/commits/$sha/status --jq '.statuses[] | "\(.context): \(.state) — \(.description)"'

# Promote the READY fix deployment and restore automatic domain assignment
$V promote <fix-deployment-id> --yes $S
```

## 5. Post the 7-field blameless incident note and close the tracking issue
```bash
gh issue comment <incident-number> --body-file incident-95-note.md
gh issue close <incident-number> --reason completed
gh issue view <incident-number> --json number,state,stateReason,title
```

## 6. Human diff check on one-way-door `src/db/migrate.ts` before merging `/retro` PR
```bash
git diff main..origin/typecheck-unchecked-index -- src/db/migrate.ts
gh pr merge <retro-pr-number> --merge
git pull -q && git log --oneline -1
```

## 7. Verify temporary drill group deletion (`HTTP 404`) and final health
```bash
curl -s -o /dev/null -w 'drill group: HTTP %{http_code}\n' https://<your-production-url>/g/<drill-token>
gh issue list --state closed --limit 1 --json number,state,title
gh pr list --state open --json number,title
curl -s https://<your-production-url>/api/health; echo
curl -s -o /dev/null -w 'live: HTTP %{http_code}\n' https://<your-production-url>/api/live
```
