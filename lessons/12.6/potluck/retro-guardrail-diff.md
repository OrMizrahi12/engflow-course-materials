# `/retro` guardrail summary & one-way-door diff (PR #97, `bf8c128`)

## What PR #97 wired into `npm run typecheck`
`tsconfig.source.json` extends `tsconfig.json` with `"noUncheckedIndexedAccess": true` for non-test `src/` files (excluding
`*.test.ts`, `*.spec.ts`, `src/db/seed.ts`, and `e2e/`).

In `package.json`:
```json
"typecheck": "next typegen && tsc --noEmit && tsc --noEmit -p tsconfig.source.json"
```
Because `npm run check`, the Husky pre-commit hook, and the required CI check all run `npm run typecheck`, every future PR
runs the stricter pass automatically. Verified against `11abb4f`'s `latest-activity.ts`: `npm run typecheck` exits `2` at
`src/app/g/[token]/latest-activity.ts(13,25): error TS2532: Object is possibly 'undefined'.`

## One-way-door human diff check (`src/db/migrate.ts`)
Because `docs/agents/what-stays-human.md` lists `src/db/migrate.ts` as a one-way door, we reviewed this exact diff before
merging PR #97:

```diff
--- a/src/db/migrate.ts
+++ b/src/db/migrate.ts
@@ -4,6 +4,7 @@ import { migrate } from "drizzle-orm/node-postgres/migrator";
 import { Client } from "pg";
 import { missingMigrations } from "./migration-journal";
 import { MIGRATIONS_FOLDER } from "./migrations-folder";
+import { onlyRow } from "./only-row";
 import * as schema from "./schema";
 import type { Db } from "./types";
@@ -45,7 +46,7 @@ async function takeRestorePoint(db: Db): Promise<RestorePoint> {
       to_char(clock_timestamp() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') as time`
   )) as { rows: RestorePoint[] };
-  return result.rows[0];
+  return onlyRow(result.rows);
 }
```
