**Incident:** Group page crashed with a server error for groups with settlements recorded before any expenses.
**From / to:** 2026-11-19 18:56 UTC -> 2026-11-19 23:39 UTC (rolled back at 19:03 UTC; fix promoted at 23:39 UTC)
**Alert:** Sentry POTLUCK-2 (and matching client event POTLUCK-3); /api/live and /api/health stayed green because the crash depended on group data shape.
**Cause:** latestActivityDate in src/app/g/[token]/latest-activity.ts (PR #94, 11abb4f) returned early only when both lists were empty, then indexed group.expenses[0].date without checking whether expenses was empty.
**Fix:** Rolled back production to a814202 (dpl_mbRcZZZxaXz6F66CGQxfuhTXJkZZ) first; diagnosed read-only via /diagnosing-bugs; fixed test-first in PR #96 (e59e78f) with unit and Playwright E2E tests; ran vercel promote dpl_A4ZVQL7fwCiJAvmyk9L48DVBkz19 to lift the post-rollback pin; verified /api/health, Smoke test, and the live group page; resolved POTLUCK-2.
**Data lost:** None.
**Next time:** Running /retro next to add a mechanical guardrail covering valid production-only group shapes and unsafe array indexing before merge.

