# Card: skills

One page from Lesson 2.4. What a skill is, the two kinds, where they come from, and how to run the right one.

## What a skill is

- **Skill:** a folder with one `SKILL.md`. On top, a short header between two `---` lines: a `name` and a one-line
  `description`. Below it, the instructions.
- **Description = pointer, body on demand.** Claude keeps only the short descriptions in its context on every turn. A
  skill's full instructions are added only when it runs. In the lesson the install screen estimated the plugin's cost
  at about 1.6k tokens every turn and about 40.9k tokens when invoked.

## The two kinds

| | You type it (user-invoked) | Claude can call it (model-invoked) |
|---|---|---|
| In `SKILL.md` | `disable-model-invocation: true` | no flag |
| In `/skills` | the row says `user-only` | no `user-only` |
| Who starts it | only you, with `/name` | Claude, when the work matches its description; you can still type it |
| Its description | not in Claude's context | in Claude's context, written as a precise trigger |
| Examples (1.3.1) | `ask-matt`, `grill-me`, `to-spec`, `to-tickets`, `implement` (16 in all) | `tdd`, `grilling`, `diagnosing-bugs`, `code-review`, `prototype` (11 in all) |

A skill you type can hand its work to one Claude can call: `grill-me`'s whole body calls `grilling`. One interview, two
ways in.

## Marketplace, plugin, skills

```text
marketplace (a catalog)  ->  plugin (a package)  ->  skills (the SKILL.md files)
claude-plugins-official      mattpocock-skills        27 skills in 1.3.1
```

| Step | Command |
|---|---|
| see the catalogs | `claude plugin marketplace list` |
| add the official one if missing | `claude plugin marketplace add anthropics/claude-plugins-official` |
| install (pick user scope) | `/plugin install mattpocock-skills@claude-plugins-official` |
| version, updates, uninstall | `/plugin` → Installed / Marketplaces |
| list the skills | `/skills` |

- **Scopes:** user (every project on this machine), project (everyone on the repository), local (only you, only this
  repository).
- **Updates:** the official catalog auto-updates by default and pins each plugin to one exact commit of its author's
  repository. An update follows the catalog's pin, so your version may be newer than the one in the lesson.

## The name rule

- A plugin's skills are namespaced: `mattpocock-skills:code-review`. The short name (`/code-review`) works when nothing
  else shares it.
- When names clash, type the full name. `/code-review` alone also matches Claude Code's own review command, a different
  tool.

## When in doubt

`/ask-matt <your situation>` asks which skill or flow fits and routes you to it.

---
The skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License,
described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed by Matt
Pocock.
