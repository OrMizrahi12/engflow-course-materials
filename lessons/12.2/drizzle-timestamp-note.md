# Why Drizzle can skip a migration silently

Checked against `drizzle-orm` **0.45.4** (`pg-core/dialect.js`, November 17, 2026).

1. Drizzle records each applied migration's journal timestamp (`when` / `folderMillis`) in `drizzle.__drizzle_migrations.created_at`.
2. On the next migrate run, Drizzle reads only the **newest** `created_at` already in `drizzle.__drizzle_migrations` and runs journal entries whose `when` is strictly newer than that value.
3. If two worktrees each run `drizzle-kit generate`, and the branch generated **later** merges to `main` first, production's newest `created_at` moves past the first branch's timestamp.
4. When the earlier branch later resolves its `_journal.json` conflict and merges, Drizzle skips its older migration silently and still prints `Migrations applied.`.
5. Local tests miss this because they migrate an empty database from scratch in journal order.

## The two checks added in PR #76

- **PR time (`npm test`):** `journalOutOfOrder` in `src/db/migration-journal.ts` fails if `_journal.json` timestamps do not strictly increase in journal order.
- **Every deploy (`src/db/migrate.ts`):** `missingMigrations` compares **every** entry in `_journal.json` against `drizzle.__drizzle_migrations` after migrating. If any entry is missing, the build fails and names it, so the broken deploy never replaces the live release.
