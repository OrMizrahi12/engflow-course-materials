# Lesson 9.1: every line typed or pasted, in order

Two terminals: the shell (for checks) and the Claude Code terminal. Times are how long each turn took on camera.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | shell | `gh issue list` | the open issues: small leftovers, each one session (#31, #11, #40, ...) |
| 2 | shell | `clear` · `cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/wayfinder` (pasted) · `ls` | `SKILL.md` |
| 3 | shell | `sed -n '1,13p' SKILL.md` | the description, `disable-model-invocation: true`, "Plan, don't do" |
| 4 | shell | `clear` · `sed -n '19,25p;65,69p' SKILL.md` | the map issue (an index, not a store), ticket labels, claim, native blocking, frontier |
| 5 | shell | `clear` · `sed -n '73,80p' SKILL.md` | ticket types: research, prototype, grilling, task (HITL / AFK) |
| 6 | shell | `clear` · `sed -n '82,91p' SKILL.md` | the fog of war, "Not yet specified", the fog-or-ticket test |
| 7 | shell | `clear` · `sed -n '103,116p' SKILL.md` | one ticket per session; the six steps of charting |
| 8 | shell | `cd ~/potluck` | |
| 9 | old session | `/exit` | "Resume this session with: claude --resume ..." |
| 10 | Claude terminal | `claude -n wayfinder` | a new session named `wayfinder`, Opus 5.5 |
| 11 | session | `/wayfinder` + a space + `potluck/idea.txt` (pasted) | 24 s: round 1, five questions about the destination, each with a recommended answer |
| 12 | session | `potluck/answer-round-1.txt` | 31 s: round 2, six candidate decisions, then five scope questions |
| 13 | session | `potluck/answer-round-2.txt` | 1 min 45 s: labels, map #41, tickets #42-#45, blocking (second pass), two background agents, a memory note |
| 14 | (wait) | | the agents finish after 6 min 50 s and 11 min 29 s; the whole turn 13 min 12 s; both reports in the session |
| 15 | browser | the map issue #41, then #44, #45, #42 | sections, the sub-issue counter, "marked this as blocked by 2 issues", "Blocked by:", the claim and the resolution comment |
| 16 | shell | `potluck/check-research.sh`, one line at a time | two `research/*` branches, one file each (145 and 129 lines), "no open pull requests", the findings' head |
| 17 | shell | `potluck/frontier.sh` | #44 open, blocked_by=0, assignees=0: the frontier |
| 18 | session | `potluck/cleanup.txt` | 41 s: both worktrees removed, their two local databases dropped, branches kept |
| 19 | session | `/exit` | the resume line |

## The idea (`potluck/idea.txt`)

> Multi-currency trips. Today every amount in a Potluck group is in the group's one currency, fixed once it's used. But the
> classic Potluck group is a trip abroad: in Tokyo someone pays the hotel in yen, someone books the train home in euros, and
> back home we settle up in our own currency. I want Potluck to handle that properly. It's too big for one session, and I
> can't see the whole route yet.

## Round 1 answer (`potluck/answer-round-1.txt`)

> Yes to all. On 5: free, and no account needed.

## Round 2 answer (`potluck/answer-round-2.txt`)

> Yes. On 5: also research other apps; grill after both.

Why: the conversion model is the decision everything else hangs on, and other expense apps have already lived with their
choice and its complaints. Reading what they learned costs far less than picking the wrong model.

## Cleanup (`potluck/cleanup.txt`)

> Remove the two research worktrees; keep the branches.
