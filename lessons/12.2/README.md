# Lesson 12.2: Schema changes that can't hurt production

The lesson's files, exactly as they were typed on camera (commit `a9ebd22, tag lesson-12.2`).

| File | What it is |
|---|---|
| `prompts.md` | every shell command and prompt typed or pasted on camera, in order, with outcomes |
| `prompts/reenact-brief.txt` | the local throwaway re-enactment brief pasted into `claude -w schema-safety` |
| `prompts/to-tickets-brief.txt` | the scoped argument pasted after `/to-tickets #63 ` |
| `prompts/quiz-answer.txt` | the live quiz answer merging tickets 1 and 2 and choosing the restore-point design |
| `tickets-73-75.md` | published bodies of issues #73, #74, #75 and the drop-rule comment on #64 |
| `prs-76-78.md` | pull request bodies for #76 (build step), #77 (expand), and #78 (drop) with Merge Danger |
| `build-logs.md` | filtered production build logs from PR #76 (nothing pending) and PR #78 (restore point + LSN) |
| `drizzle-timestamp-note.md` | why Drizzle ORM 0.45.4 skips older-timestamped migrations and how our two checks close the gap |
| `safe-schema-changes.md` | one-page reference card: failures, rollback rule, build step, expand–contract, rename recipe |
| `potluck-at-lesson-12.2.md` | what tag `lesson-12.2` (`a9ebd22`) holds and how to check it out |

Run it from your `potluck` project (at tag lesson-12.1 (e873988), deployed to your own Vercel Hobby project with its Neon database, local Postgres running, gh signed in):

```bash
git log --oneline -1                                                                                                                                     # check start commit e873988 (tag lesson-12.1)
cat vercel.json && ls drizzle                                                                                                                            # verify migrate-before-build and existing migrations
claude -w schema-safety                                                                                                                                  # local throwaway re-enactment against potluck_reenact, then /to-tickets #63
export VITEST_MAX_WORKERS=4 && claude -w migrate-safely                                                                                                  # /implement #73 (restore point, migrate, verify + journal-order test)
gh pr merge 76 --merge                                                                                                                                   # merge the one-way-door migration runner PR by hand (auto-merge off)
claude -w stop-using-app-info                                                                                                                            # /implement #74 (PR #77 expand: stop reading & writing app_info, auto-merge)
claude -w drop-app-info                                                                                                                                  # /implement #75 (PR #78 contract: plain DROP TABLE, no CASCADE, auto-merge off)
git fetch -q && git log --oneline -1 origin/main && gh pr checks 78                                                                                      # verify stop-using release is live and #78 is green
gh pr merge 78 --merge                                                                                                                                   # merge the drop by hand, then inspect the production build log for the restore point
gh issue close 73 --comment "Confirmed on the first real production migration (a9ebd22)" && curl -s https://<your-production-address>/api/health; echo   # close #73 and check live health
```

Free: Potluck, gh, Vercel Hobby (personal and non-commercial use only), Neon Free (~6-hour point-in-time restore history), GitHub Actions on a public repository, Drizzle, and the skills. Not free: a paid Claude plan. The student kit has the steps for Windows (WSL), macOS and Linux, and what the lesson printed.
