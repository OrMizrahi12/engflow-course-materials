# Potluck at Lesson 12.2

Tag `lesson-12.2` points to commit `a9ebd22` (merge of PR #78, after PR #76 and PR #77).

Clone the repository (never fork it, so your issues and pull requests stay in your own copy):

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-12.2
```

To follow the lesson from its starting point instead, check out `lesson-12.1` (`e873988`):

```bash
git checkout lesson-12.1
```

## Key files changed in this lesson

- `src/db/migration-journal.ts` and `src/db/migration-journal.test.ts` — `readJournal`, `journalOutOfOrder`, `missingMigrations`
- `src/db/migrate.ts`, `src/db/migrate.test.ts`, `scripts/migrate.mts` — `migrateAndVerify` (restore point, migrate, full-journal verify)
- `eslint.config.mjs` — allow glossary terms listed under another term's _Avoid_ list
- `src/db/schema.ts`, `src/db/seed.ts` (and removed `src/db/greeting.ts`, `src/db/greeting.test.ts`) — expand–contract removal of `app_info`
- `drizzle/0007_drop_app_info.sql` — `DROP TABLE "app_info";` (without `CASCADE`)
