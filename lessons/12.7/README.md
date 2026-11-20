# Lesson 12.7: Launch day

The lesson's files, exactly as they were typed on camera (commit `0295f40, tag lesson-12.7`).

| File | What it is |
|---|---|
| `prompts.md` | every prompt and shell command from the lesson, in order, with expected outputs |
| `prompts/p_review.txt` | prompt pasted after `/code-review` for the fresh-session readiness review |
| `prompts/p_impl64.txt` | handoff note pasted after `/implement #64` (additive-only migration CI check) |
| `prompts/p_impl37.txt` | prompt for `#37` (ADR 0005 + stale doc fixes) |
| `prompts/p_impl34.txt` | prompt for `#34` (confirm 3 v1 additions + test-first production seed guard) |
| `prompts/p_publish.txt` | prompt for PR `#101` (`README.md` `## Live` section + `what-stays-human.md` update) |
| `files/check-migrations.mjs` | `scripts/check-migrations.mjs` additive-only migration CI check (`#64`) |
| `files/check-migrations.test.ts` | 38 unit tests covering additive pass, refused shapes, and released `Stops using: #N` drops |
| `files/check.yml` | `.github/workflows/check.yml` wired to run migration checks on PR open/reopen/edit |
| `files/0005-accept-link-tokens-in-vercel-logs.md` | ADR 0005 recording Hobby 1h vs Pro retention and the hard rule that drains must drop `/g/` paths |
| `files/seed-guard.ts` | `src/db/seed-guard.ts` refusing `VERCEL_ENV=production` and remote Postgres hosts without `POTLUCK_ALLOW_REMOTE_SEED=1` |
| `files/seed-guard.test.ts` | 12 TDD tests including the `?host=localhost&host=<remote>` multi-host bypass fix |
| `files/seed.mts` | updated `scripts/seed.mts` calling `guardSeed` before connecting or migrating |
| `files/README.md` | launched `README.md` with `## Live` section, `/privacy` link, and non-commercial Hobby note |
| `files/production.md` | updated `docs/production.md` synced with live firewall rate limit and ADR 0005 |
| `files/what-stays-human.md` | updated `docs/agents/what-stays-human.md` with `#12`/`#34`/`#37`/`#64` closed and Launch row current |
| `custom-domain-optional.md` | optional guide to attach a custom domain to Vercel Hobby (DNS + automatic HTTPS) |
| `launch-day.md` | one-page reference card for launch day |
| `potluck-at-lesson-12.7.md` | what tag `lesson-12.7` holds (`0295f40`) and how to check it out |

Run it from your `potluck` project (at tag lesson-12.6, deployed to your own Vercel Hobby project with its Neon Free database and Sentry free project, gh and npx vercel@65.5.0 signed in):

```bash
git log --oneline -1 && git describe --tags --exact-match                                                             # start from lesson-12.6
claude -w launch-review                                                                                               # /code-review + prompts/p_review.txt -> Verdict: No-Go
export VITEST_MAX_WORKERS=4; claude -w additive-migrations                                                            # /implement #64 + prompts/p_impl64.txt, merge PR #98
export VITEST_MAX_WORKERS=4; claude -w adr-log-tokens                                                                 # prompts/p_impl37.txt (ADR 0005 + stale docs), merge PR #99
export VITEST_MAX_WORKERS=4; claude -w seed-prod-guard                                                                # prompts/p_impl34.txt (seed-guard.ts + 12 TDD tests), merge PR #100
npx vercel api -X PATCH /v9/projects/potluck -f nodeVersion=24.x                                                      # align Node 24.x, audit ruleset & firewall, close #12
gh issue comment 71 --body-file checklist.md                                                                          # post live proof for all 6 checks of independent
export VITEST_MAX_WORKERS=4; claude -w publish-launch-link                                                            # prompts/p_publish.txt (README ## Live), merge PR #101
npx vercel logs requests --project potluck --environment production --since 59m | sed -E 's#/g/[^ ?]+#/g/[token]#g'   # watch first traffic & Sentry monitors, close #71 and #63
```

Free: Potluck, gh, GitHub Free on a public repository, Vercel CLI, Vercel Hobby (personal and non-commercial use only; up to 50 custom domains per project if you purchase a domain), Neon Free, Sentry Developer free tier, curl, jq, and the open-source skills. Not free: a paid Claude plan. The student kit has the steps for Windows (WSL), macOS and Linux, and what the lesson printed.
