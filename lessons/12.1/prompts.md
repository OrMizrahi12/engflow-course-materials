# Lesson 12.1 prompts and commands, in order

Everything typed or pasted on camera, in order, with what came back. "Shell" is a plain terminal tab in your clone of Potluck
(`~/potluck`); "session" is the Claude Code session started in step 5, in its own worktree. Times are each turn's own clock.

| # | Where | Typed or pasted | What came back |
|---|---|---|---|
| 1 | shell | Ctrl+L, then `git log --oneline -1` | `39a76fc (HEAD -> main, tag: lesson-11.2, origin/main, origin/HEAD) Merge pull request #62 ...` |
| 2 | shell | `curl -s https://potluck-zeta.vercel.app/api/health; echo` | `{"status":"ok"}`: up on Vercel, and the health route reaches the database |
| 3 | shell | `gh issue list --label ready-for-human` | 7 issues; four about production: #11 Real backups before launch, #12 Gate merges with four checks and protect production, #34 Confirm three additions made beyond the v1 tickets, #37 Group link tokens in Vercel's production request logs (plus #31, #32, #33) |
| 4 | shell | Ctrl+Shift+T (a new tab) | a new shell tab in `~/potluck` |
| 5 | shell | `claude -w production-readiness` | a fresh Claude Code session in the worktree `.claude/worktrees/production-readiness` |
| 6 | session | `/grill-with-docs` typed, a space, then the brief (`prompts/brief.txt`) pasted after it | about 3 minutes: two skills loaded (`grilling`, `domain-modeling`); it read the glossary, `docs/agents/what-stays-human.md`, spec #1, the four tickets and the decision records; a background agent checked the four plans' limits in the vendors' docs while round one was asked; Q1 to Q4, then the facts and Q5 to Q8 |
| 7 | session | my answers to round one (`prompts/answers-round-1.txt`) | under a minute: a Running Potluck section written into `GLOSSARY.md`, then round two, Q9 to Q15 |
| 8 | session | my answers to round two (`prompts/answers-round-2.txt`) | "Brewed for 12m 46s": incident added to the glossary; spec #63 published; eight tickets #64 to #71 as its sub-issues, labelled, with "blocked by" links; #11 rewritten, a comment on #37; the glossary commit blocked by the pre-commit hook (3 runs of 3), and a question |
| 9 | shell (the first tab) | `sed -n 1,3p docs/adr/0001-host-on-vercel-hobby.md` | the title and first paragraph of decision record 0001: Hobby forbids commercial use; no ads, no paid features, no payments; a paid plan first |
| 10 | shell | `gh issue view 63 --json body --jq .body \| sed -n '/## Plan limits/,/^Nothing/p'` | the spec's Plan limits table (`free-plan-limits.md`) |
| 11 | session | my answer to its question (`prompts/dont-skip-the-hook.txt`) | "Sautéed for 3m 22s": the hook passed with 4 workers (21 test files, 309 tests); the commit; the push; PR #72 opened with auto-merge queued; a memory note; "Not done yet": the production deploy after the merge was not checked yet |
| 12 | shell, a few minutes later | Ctrl+L, then `git pull` | `Updating 39a76fc..e873988`, Fast-forward, `GLOSSARY.md`, 1 file changed, 38 insertions(+) |
| 13 | shell | `gh pr list --state merged --limit 1` | `#72 Add the words for running Potluck to the glossary  worktree-production-readiness` |
| 14 | shell | Ctrl+L, then `gh issue list --label ready-for-agent` | 3 issues: #70, #66, #65 |
| 15 | shell | `gh issue list --label ready-for-human` | 12 issues: #71 Launch on top, #69, #68, #67, #64, #37, #34, #33, #32, #31, #12, #11 (now "Nightly encrypted backups before launch") |
| 16 | shell | Ctrl+L, then `less -p 'Running Potluck' GLOSSARY.md` | the nine words (`glossary-running-potluck.md`); space for the next page, `q` to quit |

## Prompt 1: the brief (after `/grill-with-docs`)

```
Potluck is deployed but not launched: nobody outside this repo has the link yet. Before real people get it, grill me on what running it in production really means. Start from spec #1, the ADRs, docs/agents/what-stays-human.md and the open tickets #11, #12, #34 and #37. We stay on the free plans we have: Vercel Hobby, Neon Free, GitHub Actions, and Sentry's free plan for errors. Cover what "independent" means for Potluck, what a user must never lose, deploy versus release, and what those plans allow and what happens at each limit. Add the words we settle on to the glossary, in a section of their own. Keep it short. When we're done, this becomes a production-readiness spec with tickets, the one-way doors marked.
```

One line, under the length at which Claude Code folds a paste into a chip. It names the starting documents, the plans we
stay on, the four things to settle and the end product. A fresh session instead of the old planning session: that one
closed at about 187,000 tokens, well past the smart zone, and everything it decided lives in the repo now. A worktree, because
the grilling writes the glossary, and `main` only takes changes through a pull request.

**Round one, as it came back.** Q1 what "independent" means (three readings: unattended, not tied to you, groups don't
affect each other; its recommendation: all three, with the test "you go offline for 30 days and nothing is lost"). Q2 what a
user must never lose (a saved entry; a link that worked keeps working; it caught a conflict between #11 and spec #1, and
answered that backups are for operator disasters). Q3 deploy versus release (today a merge is both; enforce add-only
migrations with a CI check). Q4 what the launch is (the first link in a real person's hands). The research: the plan limits
in `free-plan-limits.md`. Q5 finding out Potluck is down (an hourly GitHub Actions check that opens an issue). Q6 where
backups live (it proposed a separate private repo). Q7 Sentry (errors only, IP collection off, link tokens rewritten). Q8
accept the risk in #37 (Hobby keeps runtime logs for one hour).

## Prompt 2: answers to round one

```
Q1: no. For Potluck, independent means six checks we can test: it runs without my laptop or terminal; it has its own database and secrets; it deploys only from main; it can be restored; it tells us when it breaks; one command rolls a bad deploy back. Q2: yes, and honestly: any point in Neon's last 6 hours, beyond that the last nightly backup, so up to a day. Q3: a release is the production address moving to a deploy, only after its smoke tests pass; rollback moves it back one deploy, never the schema. Q4: yes. Q5: yes, plus Sentry's uptime monitor every 5 minutes on a route that never touches the database. Q6: no: an encrypted artifact in this repo, kept 14 days, key offline with me; record that trade-off. Q7: yes, in our existing Sentry org. Q8: yes.
```

Q1 is answered my own way, because a definition only helps if you can check it. The uptime route never touches the database
because a check every five minutes would keep Neon awake and burn the free compute hours. Q6: a second repository is one more
thing to keep alive.

**Round two, as it came back.** The glossary diff (Backup, Restore, Launch, each with words to avoid), a summary (a Running
Potluck section with eight words, and one overlap: spec #1 used "restore" for a user undoing a delete, so the glossary keeps
it for the operator). Q9 the release gate (its plan needed a Vercel token in GitHub's secrets). Q10 what the smoke tests
touch (read-only). Q11 the one rollback command (Hobby rolls back only to the previous deployment; past one step, fix
forward). Q12 the backup's check-in to Sentry's one cron monitor, and a size guard. Q13 the trade-off of encrypted dumps in a
public repository. Q14 a runbook for the limits. Q15 which region our Sentry org is in.

## Prompt 3: answers to round two

```
Q9: yes to the add-only check, but no token: Vercel's deployment checks hold the production address until the smoke-test check passes on that commit. Q10: yes, plus one demo group I create by hand, which the tests only read. Q11: no script: the one command is vercel rollback, run by a person, then the fix gets promoted. Q12, Q13, Q14: yes. Q15: I'll read the region when we wire Sentry up, and the privacy page names it then. Add incident to the glossary: production failing its users, from the alert until the fix is live and a short note is written. Then wrap up.
```

A token in GitHub is a one-way door; Vercel's deployment checks give the same gate without one.

**What came back, and what didn't happen.** "Then wrap up" was meant as the end of the grilling. The session took it as the
go for the whole job: it wrote and published spec #63 and the eight tickets itself (`spec-63.md`, `tickets-64-71.md`).
`/to-spec` and `/to-tickets` did not run, so the quiz `/to-tickets` asks before publishing never happened; we reviewed the
breakdown afterwards from the table in its reply. One combined shell command was refused along the way (the session could not
show it stayed inside its worktree), so it ran the steps as plain commands. Its reply was honest about two gaps: #12 and #34
were never discussed, so they stay launch blockers as written; and it had not confirmed that Vercel's deployment checks exist
on Hobby, so #69 checks that first. Last, its glossary commit was blocked: the pre-commit hook failed three times out of
three, with test workers killed and tests timing out, the problem already open as #46. It asked: commit with `--no-verify`
this once, or wait until #46 is fixed?

## Prompt 4: don't skip the hook

```
Don't skip the hook. Run it with fewer test workers, VITEST_MAX_WORKERS=4, then land it.
```

The change is only words, so one skip looks harmless. But the hook is the gate every change goes through, and the first skip
is how a gate turns into a suggestion. Fewer workers works around what #46 describes, and the gate stays. It passed: 21 test
files, 309 tests. A permission check stopped one combined push-and-open-PR command, so it pushed on its own, opened PR #72 and
queued auto-merge, which merged it on its check a few minutes later. It also saved a memory note for its next sessions: when
#46 shows up, rerun the hook with four workers, and never skip it.

---
The skills used here are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License,
described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
