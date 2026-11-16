# Card: make a skill yours, a pinned copy you can edit

## Two ways to hold a skill

| | Plugin (managed install) | Your copy (editable copy) |
|---|---|---|
| Where | Claude Code's plugin cache | files in your repo: `.claude/skills/<name>/` |
| Who changes it | it updates itself; read-only | you edit it, Git tracks it |
| Who gets it | whoever installed the plugin | the whole team, with every clone |
| Its name | `/<plugin>:<name>`, e.g. `/mattpocock-skills:code-review` | plain `/<name>` inside this repo |
| The price | you wait for upstream | you update it by hand |

Make a copy for a fix your team needs that upstream hasn't shipped. A personal preference belongs in your own `CLAUDE.md`.

## Copy one skill, pinned

```bash
cd ~/your-repo   # or its worktree
npx skills@latest add https://github.com/<owner>/<repo>/tree/<full commit>/<path to the skill> -a claude-code -y
cat skills-lock.json   # "ref" = the pin: the exact upstream commit
```

- Start from the commit your plugin runs (`grep gitCommitSha ~/.claude/plugins/installed_plugins.json`), so nothing
  changes but your edit.
- Read the skill before you trust it: it runs with your agent's permissions.
- Commit twice: the files exactly as skills.sh wrote them, then your change. The history shows upstream's file on its own.
- Keep upstream's license notice, and your notes about the change, **outside** the copied folder (for example
  `THIRD_PARTY_NOTICES.md`): a re-pin replaces the whole folder.
- Keep the change small: one line is cheap to carry forward.

## Which one runs

Inside the repo, the project's skill takes the plain name. A plugin skill always keeps its prefix, so it still loads beside
yours. Claude Code's own review stays reachable as `/review`. Type the name and read the menu before you press Enter.

## The re-pin loop (staying current)

1. **Check upstream:** `git ls-remote https://github.com/<owner>/<repo> refs/heads/main`
2. **Re-pin:** the same `npx skills@latest add …/tree/<new commit>/…` command
3. **Read the diff for both sides:** what upstream changed, and what the re-pin took from you
4. **Put your line back**, word for word; update the pin in your notice
5. **Test it fresh:** run the skill in a new session (not the one that made the change)
6. **Land it** like any other change

## It's working if

- `skills-lock.json` pins a full commit, and your notice names the same commit.
- After a re-pin, `git diff` shows upstream's change, and your line is back where it was.
- A fresh session's run of the skill behaves as your change says (for the `code-review` guard line: exactly two
  sub-agents, and neither starts another review).

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License) and its README's two install routes, described
in our own words. Unofficial, not affiliated with or endorsed by Matt Pocock. First used in lesson 7.5.
