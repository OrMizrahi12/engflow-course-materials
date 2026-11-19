# Lesson 12.3: The release pipeline

The lesson's files, exactly as they were typed on camera (commit `1f60b51, tag lesson-12.3`).

| File | What it is |
|---|---|
| `prompts.md` | every prompt and shell command from the lesson, in order, with outcomes |
| `prompts/to-tickets-brief.txt` | the brief pasted after `/to-tickets #63` |
| `prompts/quiz-answer.txt` | my answers to the `/to-tickets` quiz (source check + #69 decision) |
| `prompts/land-source.txt` | the landing reply for PR #80 (guardrails doc, pass line, no auto-merge) |
| `prompts/implement-69.txt` | the note pasted after `/implement #69` |
| `prompts/q65-answer.txt` | my option-4 answer keeping #65 separate for lesson 12.4 |
| `prompts/land-smoke.txt` | refusing an unnecessary `PRODUCTION_URL` secret and landing PR #81 |
| `prompts/read-outcome.txt` | asking Claude to diagnose the stuck `pending` status from GitHub and CLI |
| `prompts/fix-pr.txt` | opening fix PR #82 while keeping `397a5c7` as the record |
| `prompts/release-notes.txt` | generating `v0.1.0` release notes from merged PR bodies |
| `ticket-79.md` | issue #79 as published under spec #63 |
| `issue-69-comment.md` | the #69 re-scope comment with Vercel docs findings |
| `pr-80-81-82.md` | PR #80, #81, and #82 bodies including their Merge Danger sections |
| `src/db/build-source.ts` | `guardProductionBuild(env, readHead)` and `readCheckoutHead()` |
| `src/db/build-source.test.ts` | 13 unit tests covering every refused shape and pass case |
| `scripts/migrate.mts` | migration runner calling the source check before reading `DATABASE_URL` |
| `src/app/api/health/route.ts` | `/api/health` route handler |
| `src/app/api/health/health-report.ts` | `healthReport(env)` returning `{ status: "ok", commit }` |
| `src/app/api/health/health-report.test.ts` | unit tests for `/api/health` commit reporting |
| `scripts/smoke.mjs` | read-only `runSmoke` checker (health commit, home page, 404 group link) |
| `scripts/smoke-production.mjs` | workflow entrypoint reading `PRODUCTION_URL` and `SMOKE_COMMIT` |
| `scripts/smoke.test.ts` | unit tests running `runSmoke` against a local HTTP server |
| `.github/workflows/smoke.yml` | GitHub Actions smoke workflow triggered by `vercel.deployment.success` |
| `settings-and-rollback.md` | exact Vercel API, `vercel curl`, Deployment Check, drill, and rollback commands |
| `release-v0.1.0-notes.md` | release `v0.1.0` notes as published on GitHub |
| `release-pipeline.md` | one-page workflow card for the release pipeline |
| `potluck-at-lesson-12.3.md` | tag `lesson-12.3` (`1f60b51`) and how to clone it |

Run it from your `potluck` project (at the tag lesson-12.2, deployed to your own Vercel Hobby project with its Neon database, gh and npx vercel@65.5.0 signed in):

```bash
git log --oneline -1                                                                        # start from lesson-12.2
gh issue view 63 --json body --jq .body | grep -n 'only from'                               # confirm spec #63 release rule
claude -w release-pipeline                                                                  # /to-tickets #63 + prompts/to-tickets-brief.txt
export VITEST_MAX_WORKERS=4; claude -w production-from-main                                 # /implement #79, merge PR #80 yourself
npx vercel@65.5.0 deploy --prod --skip-domain --yes --project <your-project>                # laptop CLI-upload drill (expect exit 1)
export VITEST_MAX_WORKERS=4; claude -w smoke-gate                                           # /implement #69 + prompts/implement-69.txt, merge PR #81 yourself
npx vercel@65.5.0 api /v9/projects/<your-project> 2>/dev/null | jq -c .gitProviderOptions   # inspect dispatch without printing secrets
npx vercel@65.5.0 rollback <prev-dpl> --yes                                                 # instant rollback drill, then vercel promote <cur-dpl> --yes
gh release list --limit 3                                                                   # verify v0.1.0 Latest and /api/health commit
```

Free: Potluck, gh, Vercel CLI, Vercel Hobby (personal and non-commercial use only), Neon Free, GitHub Actions on a public repository and the skills. Not free: a paid Claude plan. The student kit has the steps for Windows (WSL), macOS and Linux, and what the lesson printed.
