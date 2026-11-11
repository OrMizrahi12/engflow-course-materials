# Potluck at lesson 3.4

The Potluck repository is public: <https://github.com/OrMizrahi12/potluck>. The tag `lesson-3.4` marks it as it was at
the end of this lesson (commit `183fe54`).

## What it holds

| Commit | Message | What it adds |
|---|---|---|
| `9eea3cd` | Add README | `README.md`: the name and one sentence (lesson 3.2) |
| `12deed8` | Configure agent skills: GitHub issues, triage labels, domain docs | `CLAUDE.md` and three files in `docs/agents/` (lesson 3.2) |
| `3b3ad78` | Add glossary, stack ADRs and MIT license | `GLOSSARY.md`, `LICENSE`, three ADRs in `docs/adr/` (lesson 3.3) |
| `183fe54` | Cut glossary to definitions only; add inactive member and settled up | `GLOSSARY.md` rewritten: 15 lines in, 7 out (this lesson) |

Every commit carries the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`: Claude Code adds it to every
commit it makes.

- **`GLOSSARY.md`** (11 terms, 211 words, a copy is in `potluck/GLOSSARY.md`): Potluck in one sentence, then People
  (Group, Member, Inactive member) and Money (Expense, Payer, Participant, Share, Balance, Settlement, Suggested
  settlement, Settled up). Each term is one plain definition and an `_Avoid_` line. No rules, no formulas.
- **`docs/adr/`**: the three ADRs from lesson 3.3, unchanged. Nothing in this lesson passed all three tests.
- **`LICENSE`**, `CLAUDE.md`, `docs/agents/`: unchanged.
- Branch: `main` only. Issues, pull requests, Actions: none yet. No app code yet.

The rules taken out of the glossary (how a balance is calculated, one currency per group, a loan recorded as a
settlement, an expense needs a participant other than its payer, what an inactive member can still do, and the rest) are
not in the repository: they are in the planning session, for the spec in module 5.

## Start from here

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-3.4
```

Clone it; don't fork it. To build your own along the course, keep working in your own repository and run
`/domain-modeling` there.
