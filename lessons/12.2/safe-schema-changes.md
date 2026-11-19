# Safe schema changes

One-page reference for Lesson 12.2 (`Schema changes that can't hurt production`).

## The two ways a schema change breaks production

1. **New code ahead of production's schema:** code reads a column production does not have yet (e.g., Drizzle skipped an older-timestamped migration while still printing `Migrations applied.`) -> `42703: column "..." does not exist`.
2. **A drop while old code still serves:** the build migrates before the new app replaces the old one, so dropping a column or table breaks live traffic immediately -> `42703` / `42P01`.

## Rollback rule

**Rollback moves code, never schema.** On Vercel Hobby, Instant Rollback moves one deployment back (and turns off auto-assignment until `vercel promote`), while the database stays forward. A revert PR runs no "undo" migration in Drizzle. Every migration must stay safe for the version still serving.

## The guarded production build step

```text
migrations pending?
  ├── no  -> verify every journal entry -> build
  └── yes -> (production only) print restore point (LSN, UTC time, Neon restore step; no secret)
          -> take advisory lock -> migrate
          -> verify every journal entry is recorded -> build
```

Any failure stops the build and leaves the previous deployment serving.

- **Restore point vs backup:** a restore point uses Neon Free's ~6-hour / 1 GB point-in-time history with no extra secret. Teams with a project-scoped Neon API key can create a pre-migration branch per deploy to outlive 6 hours. Neither replaces an encrypted external backup.

## Expand–contract (drops, renames, tightened constraints)

- **Drop in two PRs:**
  1. **PR 1 (stop using it):** remove all reads and writes; keep the table/column in the schema (`@deprecated`). Code-only, two-way door, auto-merge. Wait until it is **the release production serves** (and safe as the rollback target).
  2. **PR 2 (drop it):** remove the schema definition, generate the `DROP` migration (strip `CASCADE` so unexpected dependents fail loudly), name the stop-using PR (`Stops using: #N`), one-way door, **a person merges**.
- **Rename in four steps:** add the new column -> copy/backfill the data -> switch the code -> drop the old column.
- **Safe in one PR (purely additive):** a new table, a nullable column, or a column with a default.

## Ownership

**A person merges a migration.** Never auto-merge any PR that adds a migration or changes the migration runner.

---

*Independent course built on open-source [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License; unofficial, not affiliated).*
