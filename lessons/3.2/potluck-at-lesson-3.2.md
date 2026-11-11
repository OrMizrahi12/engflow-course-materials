# Potluck at lesson 3.2

The Potluck repository is public: <https://github.com/OrMizrahi12/potluck>. The tag `lesson-3.2` marks it as it was at
the end of this lesson (commit `12deed8`).

## What it holds

| Commit | Message | What it adds |
|---|---|---|
| `9eea3cd` | Add README | `README.md`: the name and one sentence |
| `12deed8` | Configure agent skills: GitHub issues, triage labels, domain docs | `CLAUDE.md`, `docs/agents/issue-tracker.md`, `docs/agents/triage-labels.md`, `docs/agents/domain.md` |

Both commits carry the trailer `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`: Claude Code adds it to every
commit it makes.

- Branch: `main` only.
- Labels on GitHub: 14, GitHub's 10 defaults plus `needs-triage`, `needs-info`, `ready-for-agent` and `ready-for-human`
  (`wontfix` is one of the defaults).
- Issues, pull requests, Actions: none yet. No app code yet: the agreed design from lesson 3.1 is still only in the
  conversation, and lesson 3.3 starts writing the project's language down.
- The three `docs/agents/` files are the setup skill's 1.3.1 templates, unchanged (MIT License, Matt Pocock).

## Start from here

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-3.2
```

Clone it; don't fork it. To build your own along the course, make your own repository as in step 1 of the lesson and run
the setup there: the labels live on GitHub, so they come with your repository, not with a clone.

The same files are in `potluck/` in this kit.
