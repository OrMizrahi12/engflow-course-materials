#!/usr/bin/env bash
# Lesson 10.4: my own check after the fix was pushed, the same commands as typed on camera, in order.
# Run it from your standalone copy of Spliit, after the commit and the push. Use your own issue numbers.
set -u
git log -1 --format=%B                      # the message names the cause and ends with "Closes #14"
git grep -n "DEBUG-"                        # no output: no tagged probe line is left in the repository
git status --short                          # no output: the tree matches what was pushed
npx jest src/lib/schemas.test.ts            # 2 suites (one per time zone), 28 passed
gh issue view 14 --json state -q .state     # CLOSED, closed by the push
gh run list -L 1                            # CI on main, from the push, with a check mark
gh issue view 16 --json title -q .title     # the follow-up issue for participant names
