#!/usr/bin/env bash
# copy-issues.sh: copy real Spliit issues into YOUR OWN copy's issue tracker, with a link to each original.
# Upstream is only read (GET requests); nothing is ever posted there.
# Run it inside your standalone copy (not a fork):   ~/copy-issues.sh 9 183 257 ...
# DRY=1 prints the issue bodies instead of creating them.
set -euo pipefail
UP=spliit-app/spliit
if [ -z "${DRY:-}" ]; then
  ME=$(gh repo view --json nameWithOwner,isFork --jq 'if .isFork then "FORK" else .nameWithOwner end')
  if [ "$ME" = FORK ] || [ "$ME" = "$UP" ]; then echo "Refusing: run this inside your own standalone copy." >&2; exit 1; fi
fi
TODAY=$(date -u +%F)
read -r -d '' FILTER <<'JQ' || true
# Keep links and mentions as code so nothing links back to the original or notifies anyone.
def safe:
  gsub("(?<!!)\\[(?<t>[^\\]\\n]*)\\]\\((?<u>https://github\\.com/(?!user-attachments/)[^)\\s]+)\\)"; "\(.t) (`\(.u)`)")
  | gsub("`?(?<u>https://github\\.com/(?!user-attachments/)[^\\s)`>\\]\"]+)`?"; "`\(.u)`")
  | gsub("(?<a>^|[\\s(\\[])(?<r>[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+)#(?<n>[0-9]+)\\b"; "\(.a)`\(.r)#\(.n)`")
  | gsub("(?<a>^|[\\s(\\[])#(?<n>[0-9]+)\\b"; "\(.a)`spliit-app/spliit#\(.n)`")
  | gsub("(?<a>^|[\\s(\\[])@(?<n>[A-Za-z0-9][A-Za-z0-9-]*)"; "\(.a)`@\(.n)`");
def who: if . == "OWNER" or . == "MEMBER" then "a maintainer" elif . == "COLLABORATOR" then "a collaborator"
  elif . == "CONTRIBUTOR" then "a contributor" else "a user" end;
def prs: [ $t[] | select(.event == "cross-referenced") | .source.issue
  | select(.pull_request != null and .repository.full_name == "spliit-app/spliit")
  | "`spliit-app/spliit#\(.number)` \(.title) (\(if .pull_request.merged_at then "merged" elif .state == "open" then "open" else "closed without merging" end))" ];
"> Copied from `\($i.html_url)` (opened \($i.created_at[:10])) on \($today), for our own tracker.",
"> The original is read-only for us: nothing is posted back. Mentions and #-references are kept as code so they don't link.",
"",
(($i.body // "") | safe),
"",
"---",
"**On the original, as of \($today):** \($i.state)"
  + (if ($i.labels | length) > 0 then " · labels: " + ([$i.labels[].name] | join(", ")) else " · no labels" end)
  + " · \($c | length) comment(s)" + (if ($c | length) > 0 then ", copied below" else "" end),
(prs | if length > 0 then "**Pull requests that reference it upstream:** " + join(" · ") else "**Pull requests that reference it upstream:** none" end),
($c[] | "", "#### Comment from \(.author_association | who), \(.created_at[:10])", "", (.body | safe))
JQ
for n in "$@"; do
  issue=$(gh api "repos/$UP/issues/$n")
  comments=$(gh api "repos/$UP/issues/$n/comments?per_page=100")
  timeline=$(gh api "repos/$UP/issues/$n/timeline?per_page=100")
  title=$(jq -r .title <<<"$issue")
  body=$(jq -rn --argjson i "$issue" --argjson c "$comments" --argjson t "$timeline" --arg today "$TODAY" "$FILTER")
  if [ -n "${DRY:-}" ]; then printf '==== %s | %s\n%s\n\n' "$n" "$title" "$body"; continue; fi
  url=$(gh issue create --title "$title" --body "$body")
  echo "upstream #$n  ->  $url"
done
