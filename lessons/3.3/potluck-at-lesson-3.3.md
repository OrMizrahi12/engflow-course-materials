# Potluck at lesson 3.3

The Potluck repository is public: <https://github.com/OrMizrahi12/potluck>. The tag `lesson-3.3` marks it as it was at
the end of this lesson (commit `3b3ad78`).

## What it holds

| Commit | Message | What it adds |
|---|---|---|
| `9eea3cd` | Add README | `README.md`: the name and one sentence (lesson 3.2) |
| `12deed8` | Configure agent skills: GitHub issues, triage labels, domain docs | `CLAUDE.md` and three files in `docs/agents/` (lesson 3.2) |
| `3b3ad78` | Add glossary, stack ADRs and MIT license | `GLOSSARY.md`, `LICENSE`, `docs/adr/0001-host-on-vercel-hobby.md`, `docs/adr/0002-postgres-on-neon-free.md`, `docs/adr/0003-per-pr-database-copies.md` |

Every commit carries the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`: Claude Code adds it to every
commit it makes.

- **`GLOSSARY.md`** (43 lines): Potluck in one sentence, then two sections. People: Group, Member. Money: Expense, Payer,
  Participant, Share, Balance, Settlement, Suggested settlement. Each term has a short definition and an `_Avoid_` line;
  "payment" is on Settlement's avoid list.
- **`docs/adr/`**: three decision records, each one passing all three tests (hard to reverse, surprising without context,
  a real trade-off). 0001 hosting on Vercel Hobby (non-commercial only), 0002 Postgres on Neon Free, 0003 a database copy
  per pull request, with production on Neon's root branch.
- **`LICENSE`**: MIT, "Copyright (c) 2026 OrMizrahi12" (taken from the git name).
- Branch: `main` only. Issues, pull requests, Actions: none yet. No app code yet.

The ADRs record decisions; nothing was created on Vercel or Neon in this lesson. The rest of what was decided (how a
change reaches production, Postgres 18 and Node 24 everywhere, the seed script, the migration rule) is still in the
conversation, for the spec. Two things stay parked on purpose: how the odd cent is handled, and real backups before launch.

## Start from here

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-3.3
```

Clone it; don't fork it. To build your own along the course, keep working in your own repository from lesson 3.2 and
run `/grill-with-docs` there.

The same files are in `potluck/` in this kit.
