# Lesson 12.7: Prompts and commands

Replace `<OWNER>/<REPO>`, `<YOUR_APP_URL>` (e.g. `https://your-potluck.vercel.app`), `<YOUR_VERCEL_PROJECT_ID>`, and your issue/PR numbers with your own values.

## 1. Pre-launch state check

```bash
git log --oneline -1 && git describe --tags --exact-match
curl -s <YOUR_APP_URL>/api/health; echo
curl -s -o /dev/null -w 'live: HTTP %{http_code}\n' <YOUR_APP_URL>/api/live
gh issue view 71 --json number,state,title --jq '"#\(.number) [\(.state)] \(.title)"'
gh api repos/<OWNER>/<REPO>/issues/71/dependencies/blocked_by --jq '.[] | select(.state == "open") | "#\(.number) [\(.state)] \(.title)"'
gh pr list --state open --json number,title --jq '.[] | "#\(.number) \(.title)"'
sed -n '1,18p' README.md
```

## 2. Fresh-session readiness review (`claude -w launch-review`)

```bash
claude -w launch-review
```

Type `/code-review ` (Potluck's team copy in `.claude/skills/code-review/SKILL.md`) and paste `prompts/p_review.txt`:

> lesson-12.1 against spec #63. Review all production-readiness work since lesson-12.1 along both Standards and Spec axes. After the two-axis review, also check every open blocker of launch issue #71 (#12, #34, #37, #64) and live production read-only per .claude/skills/verify/PRODUCTION.md (never touch the production database or print any secrets or Vercel team URLs). End with an honest Go or No-Go launch verdict listing every remaining blocker or doc drift that must be resolved before we publish the live link. Read-only: change no files and open no PR.

Expected verdict before clearing blockers: **`No-Go`** naming `#12`, `#34`, `#37`, `#64` and stale doc lines.

## 3. Clear blocker `#64` — additive-only migration CI check (`claude -w additive-migrations`)

```bash
export VITEST_MAX_WORKERS=4
claude -w additive-migrations
```

Type `/implement #64 ` and paste `prompts/p_impl64.txt`. Once PR `#98` opens (auto-merge OFF because it edits `.github/`), review, verify checks, and merge by hand:

```bash
gh pr checks 98
gh pr merge 98 --merge
git pull -q && git log --oneline -1
SHA=$(git rev-parse HEAD)
gh api "repos/<OWNER>/<REPO>/commits/$SHA/status" --jq '.statuses[] | "\(.context): \(.state) — \(.description)"'
gh issue view 64 --json number,state,title --jq '"#\(.number) [\(.state)] \(.title)"'
```

## 4. Clear blocker `#37` — ADR 0005 & stale docs (`claude -w adr-log-tokens`)

```bash
export VITEST_MAX_WORKERS=4
claude -w adr-log-tokens
```

Paste `prompts/p_impl37.txt`. Review PR `#99` files, verify checks, merge by hand, and verify `#37 [CLOSED]`:

```bash
gh pr view 99 --json title,files --jq '"\(.title)\n" + ([.files[].path] | join("\n"))'
gh pr checks 99
gh pr merge 99 --merge
git pull -q
gh issue view 37 --json number,state,title --jq '"#\(.number) [\(.state)] \(.title)"'
```

## 5. Clear blocker `#34` — production seed guard (`claude -w seed-prod-guard`)

```bash
export VITEST_MAX_WORKERS=4
claude -w seed-prod-guard
```

Paste `prompts/p_impl34.txt`. Review PR `#100` files, verify checks, merge by hand, and verify `#34 [CLOSED]`:

```bash
gh pr view 100 --json title,files --jq '"\(.title)\n" + ([.files[].path] | join("\n"))'
gh pr checks 100
gh pr merge 100 --merge
git pull -q
gh issue view 34 --json number,state,title --jq '"#\(.number) [\(.state)] \(.title)"'
```

## 6. Clear blocker `#12` — align Vercel Node `24.x` & audit settings (human door)

```bash
V="npx vercel"
S="--scope $(jq -r .currentTeam ~/.local/share/com.vercel.cli/config.json)"
$V api /v9/projects/potluck $S 2>/dev/null | jq '{name, nodeVersion, autoAssignCustomDomains}'
$V api -X PATCH /v9/projects/potluck -f nodeVersion=24.x --silent $S 2>/dev/null && echo "PATCHED_NODE_24"
$V api /v9/projects/potluck $S 2>/dev/null | jq '{name, nodeVersion, autoAssignCustomDomains}'
gh api repos/<OWNER>/<REPO>/rulesets --jq '.[] | "\(.name): \(.enforcement)"'
$V api "/v1/security/firewall/config/active?projectId=<YOUR_VERCEL_PROJECT_ID>" $S 2>/dev/null | jq -c '.rules[] | {name, active}'
gh issue close 12 --reason completed --comment "Audited before launch (#71): Protect main active; Vercel Firewall rule 'Rate limit writes' live; Vercel Project Settings nodeVersion aligned to 24.x; production DATABASE_URL pooled (-pooler) and DATABASE_URL_UNPOOLED direct."
```

## 7. Walk all 6 checks of `"independent"` live & post on `#71`

```bash
echo "Open blockers on #71: $(gh api repos/<OWNER>/<REPO>/issues/71/dependencies/blocked_by --jq '[.[] | select(.state == "open")] | length')"
curl -s <YOUR_APP_URL>/api/health; echo
curl -s -o /dev/null -w '1. Runs on its own: /api/live HTTP %{http_code}\n' <YOUR_APP_URL>/api/live
gh secret list --env production && npm run -s check:backup-recipient && ls -l ~/.config/potluck/backup.agekey | awk '{print "2. Offline key:", $1, $9}'
gh api repos/<OWNER>/<REPO>/rulesets --jq '.[] | "3. Ruleset \(.name): \(.enforcement)"'
gh api repos/<OWNER>/<REPO>/commits/main/status --jq '.statuses[] | "3. \(.context): \(.state) — \(.description)"'
gh api 'repos/<OWNER>/<REPO>/actions/artifacts?per_page=3' --jq '.artifacts[0] | "4. Backup artifact: \(.name) (\(.size_in_bytes) bytes, expires \(.expires_at))"'
gh issue view 11 --json state,comments --jq '"4. Restore drill #11 [\(.state)]: " + (.comments[-1].body | split("\n")[0])'
gh run list --workflow health.yml --limit 1 --json databaseId,conclusion,createdAt --jq '.[] | "5. Hourly health run \(.databaseId): \(.conclusion) (\(.createdAt))"'
gh issue view 95 --json state,title --jq '"6. Rollback & promote proven on #95 [\(.state)]: \(.title)"'
```

Post the filled evidence checklist onto `#71` with `gh issue comment 71 --body-file checklist.md`.

## 8. Publish the live address in `README.md` (`claude -w publish-launch-link`)

```bash
export VITEST_MAX_WORKERS=4
claude -w publish-launch-link
```

Paste `prompts/p_publish.txt` (substitute your own `<YOUR_APP_URL>`). Review the diff, verify checks, merge PR `#101` by hand, and verify clean Node `24.x` build logs with zero `26.x` warning:

```bash
gh pr diff 101 | grep -E '^\+.*(Live|vercel\.app|privacy|Hobby)' | head -n 12
gh pr checks 101
gh pr merge 101 --merge
git pull -q && git log --oneline -1
SHA=$(git rev-parse HEAD)
gh api "repos/<OWNER>/<REPO>/commits/$SHA/status" --jq '.statuses[] | "\(.context): \(.state) — \(.description)"'
DPL=$($V inspect <YOUR_APP_HOST> $S 2>&1 | grep -oE 'dpl_[A-Za-z0-9]+' | head -n 1)
$V inspect "$DPL" --logs $S 2>&1 | grep -E 'Running "npm|Migrations applied|Build Completed|Warning: Due to' || true
```

## 9. Watch first traffic, errors & slowest requests (scrubbing `/g/[token]`)

```bash
# Scrubbed CDN request logs (never print real group tokens)
$V logs requests --project potluck --environment production --since 59m --limit 80 $S 2>/dev/null \
  | grep -vE '/_next/static|/favicon' \
  | sed -E 's#/g/[^ ?]+#/g/[token]#g' \
  | head -n 16

# Count 5xx responses
$V logs requests --project potluck --environment production --since 59m --query 'httpStatus >= 500' --json $S 2>/dev/null \
  | jq -c 'select(.type == "summary") | {errors5xx: .recordsReturned}'

# Runtime errors (scrubbed)
$V logs runtime --project potluck --environment production --since 59m --query 'level:error' --json $S 2>/dev/null \
  | jq -c 'if .type == "summary" then {runtimeStderrEntries: .recordsReturned} else {msg: (.data.message | sub("/g/[^ ?]+"; "/g/[token]") | .[0:95])} end' \
  | sort | uniq -c

# Slowest routes directly (Vercel Hobby Observability has no latency percentiles)
for p in /api/live /api/health / /privacy /g/not-a-real-group-check; do
  curl -s -o /dev/null -w "%{time_total}s  ttfb=%{time_starttransfer}s  HTTP %{http_code}  $p\n" "<YOUR_APP_URL>$p"
done | sort -rn
```

## 10. Close `#71` and Spec `#63`

```bash
gh issue close 71 --reason completed --comment "Launched on <YOUR_APP_URL>: all blockers closed, all 6 checks of 'independent' verified with live evidence, live link published in README.md, first test group running cleanly with 0 launch errors."
gh api repos/<OWNER>/<REPO>/issues/63/sub_issues --jq '.[] | "#\(.number) [\(.state)] \(.title)"'
gh issue close 63 --reason completed --comment "All sub-issues are closed and Potluck is live and running independently at <YOUR_APP_URL>."
curl -s <YOUR_APP_URL>/api/health; echo
curl -s -o /dev/null -w 'live: HTTP %{http_code}\n' <YOUR_APP_URL>/api/live
```
