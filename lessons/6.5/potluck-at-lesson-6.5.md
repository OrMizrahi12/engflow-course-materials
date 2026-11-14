# Potluck at lesson 6.5

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-6.5
```

The tag `lesson-6.5` points at `292703a`, the merge of pull request #16 into `main`. Production deploys from `main`, so at
the end of the lesson anyone can create a group on the production site: deployed, not announced.

## Two pull requests

| Pull request | Branch | What it adds | How it merged |
|---|---|---|---|
| #15 "Log the dev server's output to .data/logs/dev-latest.log" | `worktree-dev-logs`, from `main` | `scripts/dev.mjs`, `"dev": "node scripts/dev.mjs"` in `package.json`, `/.data/` in `.gitignore`, one line in `CLAUDE.md` | auto-merge, once its check passed |
| #16 "Create a group and open it by its link" (closes #3) | `worktree-create-group` | the group service and its tests, the ISO 4217 currency table, the migration, the create form, the group page, the browser test, four screenshots | by hand: it carries a migration |

## The commits, oldest first

| Commit | Message |
|---|---|
| `aa812ef` | Create a group and open it by its link (#3) |
| `9c333ae` | Refuse duplicate names the database catches; tidy the group link |
| `530a3e2` | Log the dev server's output to .data/logs/dev-latest.log (pull request #15) |
| `ba91b3c` | Merge pull request #15 from OrMizrahi12/worktree-dev-logs |
| `c8a6990` | Merge remote-tracking branch 'origin/main' into worktree-create-group |
| `e6f681c` | Add #3's browser test: create a group, copy the link, open it |
| `da790e6` | Add screenshots of #3's browser test for the PR |
| `292703a` | Merge pull request #16 from OrMizrahi12/worktree-create-group |

`aa812ef` and `9c333ae` are the two commits of `/implement #3`; the second holds the fixes after the code review (the
`İvo`/`ivo` crash and the copied link). The commits carry Claude Code's usual `Co-Authored-By` line, as earlier Potluck
commits do.

## Files worth reading

- `scripts/dev.mjs`, `playwright.config.ts`, `e2e/create-group.spec.ts`, `CLAUDE.md`: in `potluck/` of this kit, exactly
  as they are at the tag.
- `drizzle/0001_groups_and_members.sql`: the migration (two tables, `groups` and `members`; it only adds).
- `docs/evidence/issue-3/`: the four screenshots shown in the pull request (desktop create, desktop link copied, phone
  create, phone link opened elsewhere), committed in `da790e6` so the image links in the body keep working.
- `src/group/service.ts` and `src/group/service.test.ts`: the group service and its tests (18 of the 21 service
  tests, as the pull request counts them).

## Run it locally

```bash
npm ci
cp .env.example .env.local
npm run db:migrate
npm run dev
```

In a second terminal, with the server running:

```bash
npx playwright install chromium
npm run test:e2e
tail -n 14 .data/logs/dev-latest.log
```

## Issues

Ticket #3 is closed by the merge. Still open: spec #1, tickets #4 to #10 (`ready-for-agent`), #11 and #12
(`ready-for-human`; #12 includes running the browser test on the preview in GitHub Actions with Vercel's bypass secret).
Until #12, the browser test runs only on your machine. Carried forward from the lesson, not filed as tickets: group links
appear in full in request logs; an unknown link returns HTTP 200; the Share button is untested on a real phone.

The balance-engine branch from lesson 6.4 (`worktree-balance-engine`, tag `lesson-6.4`) is unchanged and not merged.
