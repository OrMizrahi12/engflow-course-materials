# Potluck at lesson 6.3

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-6.3
```

The tag `lesson-6.3` points at `a20746d`, the tip of `main` after this lesson. Until lesson 6.3, `main` was `b7e1c03`; two
pull requests landed on it here.

## What landed on `main`

| Commit | What it is | How it landed |
|---|---|---|
| `8103e4d` | Merge pull request #13 from `worktree-walking-skeleton`: the walking skeleton from lessons 6.1 and 6.2 (4 commits: the app, the database and its first migration `drizzle/0000_skeleton.sql`, the tests, the CI check, the pre-commit hook, the hosting setup) | merged by hand: it carries a migration |
| `e12ee7b` | Document how a change lands; deny force-push, push to main and reset --hard | written by the landing session |
| `107a91b` | Merge branch 'main' into worktree-landing-rules | `gh pr update-branch 14`, after #13 merged |
| `a20746d` | Merge pull request #14 from `worktree-landing-rules` | auto-merge, once its required check passed |

The commits written by Claude carry Claude Code's usual `Co-Authored-By` line, as earlier Potluck commits do.

## The files in `potluck/` of this kit

Exactly as they are at the tag (pull request #14 changed only these three files):

| File | What it is |
|---|---|
| `docs/agents/landing.md` | new: how a change lands. One change, one worktree, one pull request; the body from `/pr` with `Closes #N`; auto-merge right after opening, except a pull request that adds a file under `drizzle/`; `gh pr update-branch` when behind; read the merge commit's production deploy from GitHub |
| `claude-settings.json` | the file `.claude/settings.json`: twelve deny rules for force pushes, pushes to `main` and `git reset --hard` |

`CLAUDE.md` gains a short section (read it in the repository):

```markdown
### Landing a change

One worktree, one PR, auto-merge on green; migrations wait for a human. Read `docs/agents/landing.md` before opening a PR or merging.
```

## Issues and pull requests

- **#2** "Walking skeleton, live at the production URL": closed as completed by #13.
- **#12** "Gate merges with four checks and protect production": open, `ready-for-human`. It holds what #2 asked for that the
  skeleton doesn't do yet (Playwright against the preview, four separate checks, branch protection, the pooled-endpoint
  check, the firewall rule, confirming Node 24 on Vercel). The ruleset of this lesson already covers part of its branch
  protection.
- **#13** merged by hand; **#14** merged by auto-merge. No pull request is open.

## GitHub settings on camera (yours are set the same way, by you)

- Ruleset **Protect main**: active, the default branch; deletions restricted, force pushes blocked, a pull request required
  (0 approvals), the status check `Type-check, lint and service tests` required on an up-to-date branch; no bypass list.
- Settings → General: **Allow auto-merge** on, **Automatically delete head branches** on.

`ruleset-and-auto-merge.md` has every setting and the commands.

## Hosting after the merges (your accounts will differ)

- **Vercel**: production now builds `main`. The merge of #13 was the first real production build: it ran the migration on
  Neon's root branch (`production`) and deployed; the merge of #14 deployed again. Production's page says "Potluck reached
  its database, which has no seed data.", because production is never seeded.
- **Neon**: `production` (the root, migrated, empty) and `development` (the default, seeded). The preview branch of #13 was
  deleted by the integration after the merge.
