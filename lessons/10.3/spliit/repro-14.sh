#!/usr/bin/env bash
# Repro for #14: a whitespace-only group name must be rejected like an empty one.
# Drives the real groups.create tRPC mutation on the running dev server.
#
# Usage: repro-14.sh [NAME_JSON] [FORM_JSON]
#   NAME_JSON  JSON string literal for the group name   (default: "  ", 2 spaces)  
#   FORM_JSON  groupFormValues without "name"           (default: minimal form)  
#
# Exit 0 GREEN : rejected with 400 whose zod issue path is groupFormValues.name
# Exit 1 RED   : accepted (200 + groupId)  <- the bug
# Exit 2 BROKEN: anything else (control failed, 400 on a different field, 5xx...)
set -u
BASE="${BASE:-http://localhost:3000}"
DIR="$(dirname "$0")"
NAME="${1:-\"  \"}"
FORM='{"currency":"$","participants":[{"name":"John"}]}'
[ -n "${2:-}" ] && FORM="$2"

# verdict NAME_JSON -> prints GREEN|RED|BROKEN:<why>
verdict() {
  local payload code
  payload=$(jq -cn --argjson f "$FORM" --argjson n "$1" '{json:{groupFormValues:($f + {name:$n})}}') \
    || { echo "BROKEN:bad-json"; return; }
  code=$(curl -s -o "$DIR/last-body.json" -w '%{http_code}' -X POST "$BASE/api/trpc/groups.create" \
    -H 'content-type: application/json' -d "$payload")
  case "$code" in
    200) jq -e '.result.data.json.groupId' "$DIR/last-body.json" >/dev/null && echo RED || echo "BROKEN:200-no-groupId" ;;
    400) paths=$(jq -r '.error.json.message | fromjson | map(.path|join(".")) | unique | join(",")' "$DIR/last-body.json" 2>/dev/null)
         [ "$paths" = "groupFormValues.name" ] && echo GREEN || echo "BROKEN:400-on-[$paths]" ;;
    *)   echo "BROKEN:http-$code" ;;
  esac
}

control=$(verdict '""')
if [ "$control" != GREEN ]; then
  echo "LOOP BROKEN: empty-name control gave $control (expected 400 on name)"; exit 2
fi

v=$(verdict "$NAME")
case "$v" in
  GREEN) echo "GREEN: name=$NAME rejected on groupFormValues.name"; exit 0 ;;
  RED)   echo "RED: name=$NAME accepted, $(jq -c .result.data.json "$DIR/last-body.json")"; exit 1 ;;
  *)     echo "LOOP BROKEN: name=$NAME gave $v"; exit 2 ;;
esac
