# Potluck at Lesson 12.8

- **Repository:** https://github.com/OrMizrahi12/potluck
- **Tag:** `lesson-12.8`
- **Commit:** `59ce9c132fc4ad5982d2cfbce3bbd90e82073d20` (`59ce9c1`)
- **Browse at this tag:** https://github.com/OrMizrahi12/potluck/tree/lesson-12.8

## What landed between `lesson-12.7` (`0295f40`) and `lesson-12.8` (`59ce9c1`)

1. **PR `#91` (`1fce15b`)** — Salvaged Dependabot weekly update: 5 safe minor/patch updates (`@sentry/nextjs 11.13.0`,
   `react` & `react-dom 19.3.1`, `@playwright/test 1.65.1`, `lint-staged 17.6.1`); 3 breaking majors (`typescript`,
   `eslint`, `@types/node`) held back cleanly.
2. **PR `#106` (`3799314`)** — Unattended CI (`claude-build`, `app/claude`) implementing `#103`: pure plain-text formatter
   `src/money/summary.ts` + `src/money/summary.test.ts` (zero DB/browser/one-way-door files, zero secret link leakage).
3. **PR `#107` (`1b4d6d7`)** — Steered worktree implementing `#104`: `Group spending` glossary term, `groupSpending` in
   `computeGroupMoney` & `readGroupView`, `"Group spending: <amount>"` on the group page, and `e2e/group-spending.spec.ts`.
4. **PR `#108` (`3dcc31c`)** — Steered worktree implementing `#105`: `CopySummary` client component (`role="status"`
   `"Summary copied."` + read-only selected textarea fallback, hidden when spending is 0, zero link/token) + `e2e/copy-summary.spec.ts`.
5. **PR `#109` (`59ce9c1`)** — End-of-day `/retro` guardrails (Closes `#46`): `.husky/pre-commit` (`VITEST_MAX_WORKERS=2`),
   `.github/dependabot.yml` (minor/patch group + `version-update:semver-major` ignore), and `docs/production.md` Neon 10-branches
   & monthly `npm outdated` guidance.

## Clone it cleanly (clone, never fork)

```bash
git clone https://github.com/OrMizrahi12/potluck.git potluck-12.8
cd potluck-12.8
git checkout lesson-12.8
```

To follow the full working day yourself from the start of Lesson 12.8, check out `lesson-12.7` instead (`git checkout lesson-12.7`)
and push to your own new empty GitHub repository so your issues, PRs, Actions workflows, and Dependabot alerts run privately in
your own project.
