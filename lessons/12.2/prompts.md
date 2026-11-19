# Commands and prompts: Lesson 12.2

Every command and prompt typed or pasted on camera, in order, with what came back.

## 1. Check where Potluck stands (shell)

```bash
git log --oneline -1
cat vercel.json
ls drizzle
grep -n -A1 "Walking-skeleton" src/db/schema.ts
gh issue view 64 --json title --jq .title
```

Output: `e873988` (`lesson-12.1`), `buildCommand` = `npm run db:migrate && npm run build`, migrations `0000` through `0006`, the `app_info` comment ("stays because migrations may only add things"), and `#64` (`Fail CI on a migration that doesn't only add`).

## 2. Re-enact both failures on a throwaway local database (`claude -w schema-safety`)

```bash
claude -w schema-safety
```

Pasted (`prompts/reenact-brief.txt`):

> Before we change production's schema, I want to see how a schema change can hurt it. Re-enact two failures on a throwaway local database called potluck_reenact (never Neon, never production), with Potluck's real code and real migrations: 1) code that reads a column the database doesn't have yet, the way that could happen here even though our build migrates first; 2) a migration that drops something the version still serving reads, and what a rollback would and wouldn't fix. Show me each error as it really comes out. Then drop the database and leave git status clean. Keep the report short: what broke, why, and which check would have stopped it.

Wait: 3 min 54 s. Failure 1 staged `0005_rate_lookups` ahead of `0004_expense_foreign_amounts` (38 minutes older): both builds printed `Migrations applied.`, then group reads failed with `42703: column "foreign_amount" does not exist`. Failure 2 dropped `settlements.exchange_rate` while current code served: every group page crashed with `42703: column "exchange_rate" does not exist`; rollback moved only the code; a revert PR applied nothing; adding the column back lost the `0.92` rate and check constraint.

Verify cleanup in your shell:

```bash
git -C .claude/worktrees/schema-safety status -sb
psql -d postgres -Atc "select datname from pg_database" | grep -c reenact
```

Output: `## worktree-schema-safety` (clean) and `0`.

## 3. File the gap tickets (`/to-tickets #63`, same session)

Typed `/to-tickets #63 `, then pasted (`prompts/to-tickets-brief.txt`):

> Only the gaps from this session, not the whole spec again: #64 to #71 already exist. Three things: back up production before the production build migrates; the production build refuses to go live with code whose migrations production doesn't have; and drop the app_info table the safe way, expand-contract, in two PRs. Say how #64 should treat a drop that follows a merged stop-using PR.

Wait: 2 min 36 s. Claude drafted four tickets and opened its four-tab quiz; we chose **4. Chat about this** to reshape the backup design and merge tickets 1 and 2.

Pasted live answer (`prompts/quiz-answer.txt`):

> Merge 1 and 2 into one build ticket, ready-for-human: one step in the production build, restore point, migrate, verify, with the journal-order test. No Actions job, no dump, no new secret: only in production and only when a migration is pending, the build records production's restore point (LSN and time) and prints the Neon restore step. Don't call it a backup: the glossary keeps that word for #11's encrypted copy. 3 ready-for-agent. 4 ready-for-human, blocked by the build ticket and 3, not by #64; I merge it once 3 is what production serves. #64: your "released" rule, as a comment; leave #63 as it is. Only the build ticket blocks #71. Publish them.

Wait: 1 min 38 s. Published `#73` (`ready-for-human`), `#74` (`ready-for-agent`), `#75` (`ready-for-human`, blocked by `#73`, `#74`), and commented on `#64`.

Typed when Claude asked about editing `#71`'s prose:

```text
Leave #71 as it is.
```

Verify in your shell:

```bash
gh issue list --label ready-for-human --limit 5
gh issue list --label ready-for-agent --limit 5
```

## 4. Build the guarded migrate step (`claude -w migrate-safely`)

```bash
export VITEST_MAX_WORKERS=4
claude -w migrate-safely
```

Typed: `/implement #73`. Wait: 1 min 53 s to the TDD seams question -> selected **1. Yes, those seams**. Wait: 10 min 15 s -> 318 tests passing, plus a separate commit (`f9d78d8`) fixing the glossary-avoid lint on `restore`/`deploy`/`release`.

Typed: `Land it.` Wait: ~3 min -> PR `#76` opened with auto-merge queued (because `landing.md` only held back new `drizzle/` files).

Typed to stop auto-merge on the one-way door:

```text
Turn auto-merge off. A one-way door: I merge it myself.
```

Claude disabled auto-merge, stopped its watcher, updated Merge Danger, and saved a memory note.

Inspect and merge `#76` in your shell:

```bash
gh pr view 76 --json body --jq .body | sed -n '/## Merge Danger/,/^Every/p'
gh pr checks 76 --json name,state --jq '.[] | "\(.name): \(.state)"'
gh pr merge 76 --merge
git fetch -q
gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq .state
id=$(gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq ".statuses[] | select(.context==\"Vercel\") | .target_url | split(\"/\") | last"); npx vercel@65.5.0 inspect dpl_$id --logs 2>&1 | grep -E "Running \"npm|[Rr]estore |LSN:|Time: |igrat|Build Completed"
```

Output: `Migrations applied and verified.`, `Build Completed in /vercel/output [13s]` (no restore point printed because nothing was pending).

## 5. Expand: stop using `app_info` (`claude -w stop-using-app-info`)

```bash
export VITEST_MAX_WORKERS=4
claude -w stop-using-app-info
```

Typed: `/implement #74`. Wait: 6 min 38 s -> greeting helper and test deleted, seed stops inserting, `@deprecated` added in `schema.ts`, no migration, 315 tests passing. Reviewers flagged a stale greeting note in `scripts/setup-hosting.sh:318` (a human-door file).

Typed:

```text
Land it. Leave setup-hosting.sh for a separate PR.
```

Wait: 7 min -> PR `#77` auto-merged (`93be2e5`), `#74` closed, production deployed.

## 6. Contract: drop `app_info` (`claude -w drop-app-info`)

```bash
export VITEST_MAX_WORKERS=4
claude -w drop-app-info
```

Typed: `/implement #75`. Wait: ~6 min -> rebased onto `93be2e5`, removed `appInfo`, generated `0007_drop_app_info.sql` (`DROP TABLE "app_info" CASCADE;`). Spec review flagged `CASCADE`.

Typed:

```text
Remove CASCADE, then land it. I will merge it.
```

Wait: 2 min 45 s -> commit `448a7f1` removed `CASCADE`, 10/10 Playwright browser tests passed locally, PR `#78` opened with `Stops using: #74`, `Closes #75`, auto-merge off.

## 7. Merge the drop, prove the restore point, close `#73` (shell)

```bash
git fetch -q
git log --oneline -1 origin/main
gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq .state
gh pr checks 78 --json name,state --jq '.[] | "\(.name): \(.state)"'
gh pr merge 78 --merge
git fetch -q
gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq .state
id=$(gh api repos/{owner}/{repo}/commits/$(git rev-parse origin/main)/status --jq ".statuses[] | select(.context==\"Vercel\") | .target_url | split(\"/\") | last"); npx vercel@65.5.0 inspect dpl_$id --logs 2>&1 | grep -E "Running \"npm|[Rr]estore |LSN:|Time: |igrat|Build Completed"
```

Deploy wait: 45 s to `success`. Build log printed `Restore point before migrating production (pending: 0007_drop_app_info)`, `LSN: 0/1F1B7B0`, `Time: 2026-11-18T16:09:31.872Z`, the `neon branches restore` command, `Migrations applied and verified.`, and `Build Completed in /vercel/output [15s]`.

Close `#73` and check live health:

```bash
gh issue close 73 --comment "Confirmed on the first real production migration (the app_info drop, a9ebd22): LSN, time and the Neon restore step printed before migrating, no secret in them."
curl -s https://<your-production-address>/api/health; echo
gh issue list --state closed --limit 4
```
