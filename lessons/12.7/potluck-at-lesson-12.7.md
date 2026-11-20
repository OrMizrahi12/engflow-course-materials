# Potluck at Lesson 12.7

- **Tag:** `lesson-12.7`
- **Commit:** `0295f4038a9e204cb6681b9efb5b5a6d64675c20` (`0295f40`)
- **Repository:** https://github.com/OrMizrahi12/potluck/tree/lesson-12.7

## Check out this exact point in your own clone

Clone Potluck (never fork it so your issues and workflows stay in your own repository):

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-12.7
```

## What landed in Lesson 12.7

- **PR #98 (`6949f30`, closes `#64`):** additive-only migration CI check (`scripts/check-migrations.mjs`, 38 unit tests, `.github/workflows/check.yml` PR triggers).
- **PR #99 (`c264713`, closes `#37`):** `docs/adr/0005-accept-link-tokens-in-vercel-logs.md` and synced stale documentation lines in `docs/production.md` and `docs/agents/what-stays-human.md`.
- **PR #100 (`9c49eb9`, closes `#34`):** confirmed the three v1 additions and added `src/db/seed-guard.ts` + 12 TDD tests wired into `scripts/seed.mts` and `scripts/setup-hosting.sh`.
- **Issue `#12` closed:** aligned Vercel Project Settings `nodeVersion` from `26.x` to `24.x` and verified ruleset, firewall rule, and pooled production database URL.
- **PR #101 (`0295f40`, part of `#71`):** published `https://potluck-zeta.vercel.app` and `/privacy` in `README.md` with clean Node `24.x` production build and `Smoke test: success`.
- **Issues `#71` and Spec `#63` closed:** all 13 production-readiness sub-issues closed; Potluck is live and running on its own.
