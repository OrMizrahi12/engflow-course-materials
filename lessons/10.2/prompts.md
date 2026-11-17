# Lesson 10.2 prompts and commands, in order

Everything typed or pasted on camera, in order, with what came back. Shell lines run inside your standalone copy of Spliit;
lines in a Claude Code session are marked. Times are the turn's own clock.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | shell | `gh issue list -R spliit-app/spliit --state open --limit 300 --json labels --jq 'length, (map(select(.labels == [])) \| length)'` | `183`, `179` |
| 2 | shell | `head -5 ~/copy-issues.sh` | the script's header: copies real Spliit issues into your own copy, upstream only read |
| 3 | shell | `~/copy-issues.sh 9 183 257 286 309 374 489 527 670 678 691 692` | twelve lines, `upstream #9 -> .../issues/3` to `upstream #692 -> .../issues/14`, about half a minute |
| 4 | shell | `claude -n spliit-triage` | a named Claude Code session (Opus 5.5) |
| 5 | session | `/mattpocock-skills:triage show me anything that needs my attention` (typed `/tri`, picked from the menu) | 19 s: 12 need attention, all unlabeled, oldest first; likely duplicates #4/#9 and #6/#10; highest stakes #11 and #8; suggests #11 |
| 6 | session | `Let's look at #14` | 35 s: a throwaway Jest test; the claim confirmed (and two more cases); the checks; recommends `bug` + `ready-for-agent`; two decisions of its own; asks first |
| 7 | session | `Yes, label it and post the brief with both decisions.` | 29 s: the agent brief posted on #14 (see `spliit/issue-14-agent-brief.md`), both labels |
| 8 | session | the one-pass prompt (below) | 1 min 57 s: one block per issue for #3-#13, nothing changed, three decisions for you |
| 9 | session | the decisions (below) | 2 min 26 s: `.out-of-scope/accounts.md` written, all eleven labelled and commented, six closed; asks main or a branch |
| 10 | session | `Commit it straight to main and push.` | 7 s: `49db10d` Record accounts/authentication as out of scope, pushed |
| 11 | new shell tab | `~/copy-issues.sh 478` | about 6 s: `upstream #478 -> .../issues/15` |
| 12 | session | `/clear` | an empty conversation |
| 13 | session | `/mattpocock-skills:triage let's look at #15` | 20 s: "Prior rejection: this is already on record" (the out-of-scope file, ADR-0001, #5); recommends `enhancement` + `wontfix`; asks about an optional follow-up |
| 14 | session | `Go ahead with the wontfix, no follow-up. Commit and push the file.` | 23 s: #15 added to Prior requests, `c76d93a` pushed, #15 closed with both labels |
| 15 | shell tab | `gh issue list --state all --limit 50 --json number,state,labels --jq 'sort_by(.number)[] \| "#\(.number) \(.state) \([.labels[].name] \| join(", "))"'` | 13 rows, one category and one state each |
| 16 | shell tab | `git log --oneline -3` | `c76d93a`, `49db10d`, `4e4d83b (tag: lesson-10.1)` |

## Prompt 8: the other eleven, in one pass

```
Now the other eleven, one at a time. Read every comment on each issue, not just the body, and check the code and the other issues before you decide. Then give me one table: issue, category, state and why. Apply nothing yet.
```

"Read every comment" is the warning the skill's documentation gives: on a real tracker the detail that matters is often a
few comments down. "Apply nothing yet" keeps the decisions yours.

## Prompt 9: the decisions

```
1. Yes: we keep Spliit account-free, as ADR-0001 says. Write the out-of-scope file and close #5. 2. Close #3 as already implemented, no new issue: nobody here has asked for auto-deletion. 3. Agreed, the server refuses. Leave #6, #9 and #12 in needs-triage with your design questions as a comment on each. Apply it all now.
```

The three numbers answer the three questions at the bottom of its table. Your table may ask different ones: answer what it
asks, each with a reason, then say "apply it all now".

## Not typed

Claude Code shows a dim suggestion in the prompt box after most replies (on camera: "let's look at #11", "Commit and push
the out-of-scope file to main", "go ahead with wontfix, skip the follow-up"). It is only a guess at your next message; none
of them was sent.
