# Published tickets (#73, #74, #75) and #64 drop-rule comment

## #73: Production build: restore point, migrate, verify every migration applied

- **Labels:** `ready-for-human`
- **State after lesson:** `CLOSED`

**Label:** `ready-for-human`. **One-way door:** merging a change to what runs migrations (the migration runner, the build command, the `db:migrate` script). The unattended run is denied these files.

## Parent
#63

## What to build
One step in the production build, run where the build migrates today: **restore point, migrate, verify**.

- **Restore point.** Only in production, and only when the commit has a migration production hasn't applied: before migrating, the build records production's current LSN and time and prints them with the Neon step that restores the root branch to that point within Neon's ~6-hour history. No dump, no Actions job, no new secret. This isn't a **backup** (the glossary keeps that word for #11's encrypted copy). Restoring stays a human act; the build only prints the step.
- **Migrate**, as today.
- **Verify.** After migrating, compare every migration in the commit's journal, not only the newest, with what production has recorded as applied. If any is missing, the build fails and names it, so the deploy never exists and the previous release keeps serving. This runs on every build, previews included.

Why: drizzle's migrator skips any migration whose timestamp is older than the newest one already applied, and still prints `Migrations applied.`. If two branches each generate a migration and the one generated later merges first, the other never runs, and the code that reads its columns goes live and fails with `42703 column "…" does not exist`. Re-enacted locally with the real `0004_expense_foreign_amounts` and `0005_rate_lookups`. Tests don't catch it: they migrate an empty database in journal order.

Also a test in `npm test` (no workflow change needed) that fails when the journal's timestamps don't strictly increase in journal order. That catches the out-of-order merge at PR time, before the build has to.

## Acceptance criteria
- [ ] A test re-enacts the skipped migration: a database migrated with the journal minus `0004`, then with the full journal. The verify step refuses and names `0004_expense_foreign_amounts`.
- [ ] A test that the verify step passes on a database migrated in order.
- [ ] The journal-order test fails on a journal whose timestamps go backwards, and passes on today's journal.
- [ ] Outside production, or with nothing pending, no restore point is recorded or printed.
- [ ] In production with a pending migration, the build log shows the LSN, the time and the Neon restore step before the first migration runs. Confirmed on the first real production migration (e.g. the `app_info` drop).
- [ ] The restore point printed contains no connection string or other secret.
- [ ] #65's "schema current" can use the same comparison (exported for it, not duplicated).

## #74: Stop using app_info

- **Labels:** `ready-for-agent`
- **State after lesson:** `CLOSED`

## Parent
#63

## What to build
The first half of dropping the `app_info` table, expand–contract: nothing reads or writes `app_info` any more, while the table stays in production.

`app_info` is the walking skeleton's one-row greeting table. Today only the seed writes it, and only the greeting helper and its test read it. No page does.

- The greeting helper and its test go. The seed stops inserting the greeting.
- The table's definition stays in the schema, marked for removal with a pointer to the drop ticket, so `drizzle-kit generate` produces no migration and this PR carries none.

This PR has to be **what production serves** before the drop is merged, so that a rollback after the drop lands on a release that doesn't read the table.

## Acceptance criteria
- [ ] Nothing outside the schema definition names `app_info`.
- [ ] `drizzle-kit generate` reports no changes, and the PR adds nothing under `drizzle/`.
- [ ] The seed still runs on a fresh database, and `npm run check` passes.

## #75: Drop app_info

- **Labels:** `ready-for-human`
- **State after lesson:** `CLOSED`

**Label:** `ready-for-human`. **One-way door:** merging a migration that drops a table. The schema change outlives any revert, and the table's contents are gone for good.

## Parent
#63

## What to build
The second half of dropping `app_info`, expand–contract: remove the table's definition from the schema and add the `DROP TABLE` migration `drizzle-kit generate` produces.

The operator merges it by hand, and only once #74 (stop using `app_info`) is **what production serves**: in the current release, not merely merged to `main`. Until then, the release still serving reads the table, and a drop breaks it the moment the build migrates, with `42703`/`42P01` errors that neither a rollback nor a revert fixes (re-enacted locally for a dropped column: a revert's build applies nothing, and adding the column back returns the shape but not the data).

It's also the first real production migration through #73's restore point and verify step.

## Acceptance criteria
- [ ] The PR says it carries a migration, names #74 as its stop-using PR (`Stops using: #74`), and is left for a human to merge, never auto-merged.
- [ ] The migration only drops `app_info` and its constraint: nothing else.
- [ ] Before merging, #74's merge commit is in production's current release.
- [ ] The production build log shows the restore point (LSN, time, Neon restore step) before the drop runs, and the verify step passes.
- [ ] After release, the home page and a group page work, and `app_info` no longer exists in production.

## Comment added to #64 (Fail CI on a migration that doesn't only add)

**A drop that follows a stop-using PR.** Drops stay refused by default. Expand–contract (#74 stops using `app_info`, #75 drops it) needs one way through, and "the stop-using PR is merged" isn't enough: a deploy that failed, or one held by the smoke test (#69), leaves the old release serving and still reading what's dropped, and a rollback moves back one release. So the rule is **released**, not merged.

A migration PR passes with a drop only when all of these hold:

- Its body names the stop-using PR: `Stops using: #N`.
- #N's merge commit is in the release production is serving now, according to the Production deployments GitHub records for Vercel. Readable with the workflow's default token on this public repo, so no new secret.
- Nothing in the PR's own code still names the dropped table or column.
- The migration is a pure drop. Renames and added or tightened constraints stay refused outright, with or without the line.

Proposed acceptance criteria to add:
- [ ] A drop without `Stops using: #N` fails.
- [ ] A drop naming a PR that's merged but not in production's current release fails, and the message says which release production serves.
- [ ] A drop naming a released PR passes, unless the PR's code still names what it drops.

#75 doesn't wait for this: the operator merges it by hand once #74 is what production serves.
