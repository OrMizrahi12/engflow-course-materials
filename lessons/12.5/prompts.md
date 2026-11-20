# Prompts and commands typed on camera — Lesson 12.5: Safe by default

Every prompt and shell command used in Lesson 12.5, in order. Replace `OrMizrahi12/potluck`, `https://potluck-zeta.vercel.app`, and the public `age1…` key with your own repository, deployment URL, and generated public key.

## 1. Baseline state check (Shell)

```bash
git log --oneline -1
T=$(npx vercel@65.5.0 api /v2/user 2>/dev/null | jq -r .user.defaultTeamId)
npx vercel@65.5.0 api "/v9/projects/potluck/env?teamId=$T" 2>/dev/null \
  | jq -r '.envs[] | "\(.key) [\(.target|join(","))]"' | sort -u | grep -E 'DATABASE_URL|SENTRY_DSN'
grep -n -A2 'function newLinkToken' src/group/service.ts
cat src/group/limits.ts
curl -sI https://potluck-zeta.vercel.app/ | head -n 12
gh api repos/OrMizrahi12/potluck --jq .security_and_analysis
gh api repos/OrMizrahi12/potluck/code-scanning/default-setup --jq '{state,languages}'
```

## 2. File the missing hardening ticket (`claude -w safe-by-default`)

Start in a fresh tab:

```bash
export VITEST_MAX_WORKERS=4
claude -w safe-by-default
```

Type `/to-tickets #63 ` and paste [`prompts/p_tickets.txt`](prompts/p_tickets.txt):

> Scope this only to what's still unfiled for hardening the repo and app: HTTP security headers in next.config.ts (CSP with frame-ancestors none and object-src none, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy) and grouped weekly Dependabot PRs in .github/dependabot.yml (one weekly PR so previews don't exhaust Neon's 10 branches). Note the human-only GitHub security settings (secret scanning, push protection, CodeQL default setup) and Vercel write rate-limit (#12). Don't publish yet: show the quiz and wait for my answers.

Answer the quiz by pasting [`prompts/p_answer_tickets.txt`](prompts/p_answer_tickets.txt):

> A: Merge 1, 2, and 3 into one ready-for-human ticket under #63 (headers, grouped weekly Dependabot, and GitHub security settings), so it lands as one hardening pass. B: Yes to no-referrer and base-uri 'none'. C: Label it ready-for-human (edits .github/ and repo settings); watch npm only (we update Actions by hand) and include security updates in the weekly group so it's strictly one PR; leave the #12 bypass note on #12. D: No blockers; make the new ticket block #71 (Launch). Publish it, then stop.

Result on camera: ticket `#89` published (`ready-for-human`, sub-issue of `#63`, blocks `#71`), noting that Dependabot security-fix auto-PRs stay OFF while vulnerability alerts stay ON so weekly updates stay strictly one PR.

## 3. Switch on GitHub repository security (Shell, human door)

```bash
printf '{"security_and_analysis":{"secret_scanning":{"status":"enabled"},"secret_scanning_push_protection":{"status":"enabled"}}}' \
  | gh api -X PATCH repos/OrMizrahi12/potluck --input - --jq .security_and_analysis
gh api -X PUT repos/OrMizrahi12/potluck/vulnerability-alerts \
  && gh api -i repos/OrMizrahi12/potluck/vulnerability-alerts | head -n 1
printf '{"state":"configured","query_suite":"default"}' \
  | gh api -X PATCH repos/OrMizrahi12/potluck/code-scanning/default-setup --input -
gh api repos/OrMizrahi12/potluck --jq .security_and_analysis
gh api repos/OrMizrahi12/potluck/code-scanning/default-setup --jq '{state,query_suite,languages}'
```

## 4. Implement ticket #89 (`claude -w security-hardening`) and verify live headers

```bash
export VITEST_MAX_WORKERS=4
claude -w security-hardening
```

Type `/implement #89 ` and paste [`prompts/p_impl89.txt`](prompts/p_impl89.txt). After PR `#90` opens without auto-merge, verify checks, merge, and test live headers:

```bash
gh pr checks 90
gh pr merge 90 --merge
git pull -q && git log --oneline -1
curl -sI https://potluck-zeta.vercel.app/ \
  | grep -iE '^(HTTP/|content-security-policy|x-frame-options|x-content-type-options|referrer-policy|permissions-policy|strict-transport-security):'
```

## 5. Vercel Hobby write rate-limit rule and live HTTP 429 proof (Shell, human door)

```bash
T=$(npx vercel@65.5.0 api /v2/user 2>/dev/null | jq -r .user.defaultTeamId)
npx vercel@65.5.0 firewall rules add "Rate limit writes" \
  --condition '{"type":"method","op":"eq","value":"POST"}' \
  --action rate_limit --rate-limit-requests 20 --rate-limit-window 60 --rate-limit-keys ip \
  --project potluck --scope "$T" --yes
npx vercel@65.5.0 firewall publish --project potluck --scope "$T" --yes
npx vercel@65.5.0 firewall rules list --project potluck --scope "$T"
for i in $(seq 1 25); do curl -s -o /dev/null -w "%{http_code} " -X POST https://potluck-zeta.vercel.app/; done; echo
gh issue comment 12 --body "Done in production: Vercel Firewall rate-limit rule 'Rate limit writes' published (POST, 20 req / 60 s per IP -> HTTP 429, verified live)."
```

Expected output of the 25-request loop: twenty `405` responses followed by five `429` responses.

## 6. Whole-app `/security-review` (`claude -w security-audit`)

```bash
claude -w security-audit
```

Type `/security-review ` and paste [`prompts/p_secreview.txt`](prompts/p_secreview.txt). Result on camera: zero high-confidence vulnerabilities found, plus three below-bar awareness notes.

## 7. Privacy page and production runbook (`claude -w privacy-runbook`)

```bash
export VITEST_MAX_WORKERS=4
claude -w privacy-runbook
```

Type `/implement #70 ` and paste [`prompts/p_impl70.txt`](prompts/p_impl70.txt). Result on camera: PR `#92` auto-merged (`81af9f9`), updating `/privacy` and creating `docs/production.md`.

## 8. Offline `age` keypair & GitHub `production` environment (Shell, human door)

```bash
sudo apt-get update -qq && sudo apt-get install -y -qq age && age --version
mkdir -p ~/.config/potluck && chmod 700 ~/.config/potluck
age-keygen -o ~/.config/potluck/backup.agekey && chmod 600 ~/.config/potluck/backup.agekey
ls -l ~/.config/potluck/backup.agekey
printf '{"deployment_branch_policy":{"protected_branches":false,"custom_branch_policies":true}}' \
  | gh api -X PUT repos/OrMizrahi12/potluck/environments/production --input - --jq '{name,deployment_branch_policy}'
printf '{"name":"main","type":"branch"}' \
  | gh api -X POST repos/OrMizrahi12/potluck/environments/production/deployment-branch-policies --input - --jq '{name,type}'
```

Set `BACKUP_DATABASE_URL` (your production unpooled Neon connection string) and `SENTRY_DSN` inside the `production` environment without printing them, then verify names only:

```bash
gh secret list --env production
```

## 9. Implement nightly encrypted backups (`claude -w nightly-backups`) & run live

```bash
export VITEST_MAX_WORKERS=4
claude -w nightly-backups
```

Type `/implement #11 ` and paste [`prompts/p_impl11.txt`](prompts/p_impl11.txt) (replacing the `age1…` recipient with your own public key). Merge PR `#93`, trigger one live backup run, and inspect the `.dump.age` artifact:

```bash
gh pr checks 93
gh pr merge 93 --merge
git pull -q && git log --oneline -1
gh workflow run backup.yml
RUN_ID=$(gh run list --workflow=backup.yml --limit 1 --json databaseId --jq '.[0].databaseId')
gh run watch "$RUN_ID" --exit-status
gh api "repos/OrMizrahi12/potluck/actions/runs/$RUN_ID/artifacts" --jq '.artifacts[] | {name,size_in_bytes,expires_at}'
```

Open Sentry → Monitors → `potluck-nightly-backup` to confirm the auto-created Cron monitor reports `Okay` in `production`.

## 10. Timed restore drill into a separate scratch Neon branch (Shell + Neon Console)

```bash
START=$(date +%s); mkdir -m 700 -p /tmp/potluck-restore-drill && cd /tmp/potluck-restore-drill
RUN_ID=$(gh run list --workflow=backup.yml --limit 1 --repo OrMizrahi12/potluck --json databaseId --jq '.[0].databaseId')
gh run download "$RUN_ID" --repo OrMizrahi12/potluck --dir . && ls -lh */*.dump.age
age --decrypt --identity ~/.config/potluck/backup.agekey --output potluck.dump potluck-*/potluck-*.dump.age
pg_restore --list potluck.dump | head -n 12
```

In Neon Console: Branches → `development` → **Create child branch** named `restore-drill` → leave **Connection pooling** OFF → click **Copy snippet** (password masked). Back in the shell:

```bash
read -rs SCRATCH_URL
# paste with Ctrl+Shift+V (or Cmd+V on macOS) and press Enter
pg_restore --clean --if-exists --no-owner --no-privileges --single-transaction --exit-on-error \
  --dbname="$SCRATCH_URL" potluck.dump && printf "DRILL_%s\n" "RESTORED"
psql "$SCRATCH_URL" -c "\dt" -c "SELECT (SELECT count(*) FROM groups) AS groups, (SELECT count(*) FROM expenses) AS expenses, (SELECT count(*) FROM drizzle.__drizzle_migrations) AS migrations;"
ELAPSED=$(( $(date +%s) - START ))
printf "Restore drill passed in %dm %02ds\n" $((ELAPSED/60)) $((ELAPSED%60))
unset SCRATCH_URL
cd ~/potluck && rm -f /tmp/potluck-restore-drill/potluck.dump /tmp/potluck-restore-drill/potluck-*/*.dump.age && rmdir /tmp/potluck-restore-drill/potluck-* /tmp/potluck-restore-drill
```

Delete the `restore-drill` branch in Neon Console, then close `#11` with your measured restore time.
