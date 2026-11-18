#!/bin/sh
# Lesson 10.5: my own check of the report's hot spots, typed in my shell inside the Spliit copy (run from its root).
# The same 18-month window and the same filter the session used: translations, the lock file and other JSON left out.

git log --oneline | wc -l
# on camera: 427

git log --since="18 months ago" --name-only --format= | grep -vE 'messages/|package-lock|\.json$' | sort | uniq -c | sort -rn | head -8
# on camera (2026-11-17):
#   24 src/app/groups/[groupId]/expenses/expense-form.tsx
#   13 README.md
#   12 .github/workflows/cd.yml
#    9 src/lib/api.ts
#    8 src/lib/currency.ts
#    7 src/lib/env.ts
#    7 src/components/group-form.tsx
#    7 src/app/groups/[groupId]/expenses/export/csv/route.ts
# Your numbers depend on the day you run it: "18 months ago" moves with the calendar.

# After the review and the grilling, nothing in the repository changed:
git status
git log --oneline -1
