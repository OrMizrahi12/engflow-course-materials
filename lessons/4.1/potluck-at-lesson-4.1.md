# Potluck at lesson 4.1

The Potluck repository is public: <https://github.com/OrMizrahi12/potluck>. The tag `lesson-4.1` marks it as it was at
the end of this lesson (commit `b7e1c03`).

## What it holds

| Commit | Message | What it adds |
|---|---|---|
| `9eea3cd` | Add README | `README.md`: the name and one sentence (lesson 3.2) |
| `12deed8` | Configure agent skills: GitHub issues, triage labels, domain docs | `CLAUDE.md` and three files in `docs/agents/` (lesson 3.2) |
| `3b3ad78` | Add glossary, stack ADRs and MIT license | `GLOSSARY.md`, `LICENSE`, three ADRs in `docs/adr/` (lesson 3.3) |
| `183fe54` | Cut glossary to definitions only; add inactive member and settled up | `GLOSSARY.md` rewritten (lesson 3.4) |
| `b7e1c03` | Add odd-cent rounding research; ignore the first-group questionnaire | `docs/research/odd-cent-rounding.md` and `.gitignore` (this lesson) |

Every commit carries the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`: Claude Code adds it to every
commit it makes.

- **`docs/research/odd-cent-rounding.md`** (a copy is in `potluck/docs/research/`): dated 2026-11-11; the answer in one
  paragraph; what the apps (Spliit, IHateMoney, Splitwise, Tricount, Settle Up) and the libraries (Ruby `money`,
  Dinero.js, py-moneyed, Fowler's Money pattern) do; where a currency's decimals come from (ISO 4217, ECMA-402, CLDR, and
  the currencies where they differ); a table of seven candidate rules; 12 sources.
- **`.gitignore`** (a copy is in `potluck/.gitignore`): one line, `to-questionnaire-first-group.md`.
- **`GLOSSARY.md`**, `docs/adr/`, `LICENSE`, `CLAUDE.md`, `docs/agents/`: unchanged.
- Branch: `main` only. Issues, pull requests, Actions: none yet. No app code yet.

The questionnaire itself is not in the repository: it is ignored on purpose, so the answered copy can never reach a public
repo. A copy of the blank one, as written in the lesson, is `example-to-questionnaire-first-group.md` in this kit.

The two decisions from this lesson (the odd cent goes by the Spliit rule; currency decimals come from ISO 4217 and the
formatter is always told how many to show, and the currency picker leaves out the 13 codes with no minor unit) are not in
the repository either: they are in the planning session, for the spec in module 5.

## Start from here

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-4.1
```

Clone it; don't fork it. To build your own along the course, keep working in your own repository and run `/research`
there.
