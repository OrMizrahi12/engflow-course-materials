# Lesson 10.5 prompts and commands, in order

Everything typed or pasted on camera, in order, with what came back. Lines in the new Claude Code session
`spliit-architecture` are marked "session"; shell lines run inside your standalone copy of Spliit. Times are the turn's own
clock.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | shell, new tab | `claude -n spliit-architecture` | a fresh session; the header shows Opus 5.5 and the Spliit folder |
| 2 | session | `/improve-codebase-architecture`, picked `/mattpocock-skills:improve-codebase-architecture` from the menu, then the sentence (below) | "Crunched for 3m 41s": the `codebase-design` skill, one git count (427 commits; the 18-month hot spots), an Explore sub-agent in the background (1 m 48 s), a check of `schemas.ts` and `api.ts`, the HTML report opened in the browser; a reply ending "Which of these would you like to explore?" |
| 3 | browser | Ctrl+Plus (175 %) | "spliit: where to deepen", the hot spots, the legend, seven candidates, the top recommendation |
| 4 | shell tab 5 | `git log --oneline \| wc -l` | `427` |
| 5 | shell | the 18-month count (below), pasted | `24 src/app/groups/[groupId]/expenses/expense-form.tsx` first, then `README.md` 13, `.github/workflows/cd.yml` 12, `src/lib/api.ts` 9 ... |
| 6 | session | `Let's explore 1, the expense form model.` | "Worked for 32s": the `grilling` skill, the form's logic read, one more fact, round 1: Q1 to Q7 with recommended answers |
| 7 | session | `Yes to all seven.` | "Sautéed for 22s": three facts it looked up itself, round 2: Q8 to Q13 |
| 8 | session | the second answer (below), pasted | "Sautéed for 13s", no tools: Questions 1–12 settled, Decided, Still open (the interface, tracking), an offer of three or four sub-agents for the interface |
| 9 | shell tab 5 | `git status` | `nothing to commit, working tree clean` |
| 10 | shell | `git log --oneline -1` | `59c41d7 (HEAD -> main, tag: lesson-10.4, origin/main) Reject group names ...`: the commit from lesson 10.4 |

## Prompt 1: the command and its sentence

```
/mattpocock-skills:improve-codebase-architecture We're new here: let the git history pick the hot spots.
```

No module and no pain point. The skill scopes before it scans: a direction you name is taken as is, and without one it walks
the commit history and looks first where the code keeps changing.

## The two shell commands (step 5)

```bash
git log --oneline | wc -l
git log --since="18 months ago" --name-only --format= | grep -vE 'messages/|package-lock|\.json$' | sort | uniq -c | sort -rn | head -8
```

The same window and the same filter the session used (translations, the lock file and other JSON left out), so the two counts
can be compared line by line. `spliit/hotspots.sh` has them with the output on camera.

## Prompt 2: the pick

```
Let's explore 1, the expense form model.
```

Short on purpose. It's the report's top recommendation, the busiest file, it has no unit tests, its interface could take
several real shapes, and its dependency category is in-process, so nothing needs mocking.

## Prompt 3: round 1

```
Yes to all seven.
```

Every question came with a recommended answer worded so that "yes" accepts it. I agreed with all seven because each keeps the
change small and testable. Answer by number when you don't: "Yes to 1-3, on 4: ...".

## Prompt 4: round 2, and a stop

```
Yes to 8 through 12. On 13: not yet. Before any issue, I want to see a few radically different interfaces for this model and pick one, so leave the interface open for now. Sum up what we've decided and what's still open.
```

Q13 asked to file an issue and start a branch. Too early: the interface is a design job of its own (lesson 10.6), so the
grilling stops on purpose and the summary records what is open.

---
The skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License); this course is
unofficial and not affiliated with him. Spliit is MIT-licensed, by Sebastien Castiel and contributors.
