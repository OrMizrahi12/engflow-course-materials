# Card: /setup-matt-pocock-skills

One page from Lesson 3.2. The setup every engineering skill reads: run it once per repository, before the first use of
the others.

## In and out

- **In:** a git repository with its remote (on camera: a private GitHub repository, `origin`), and your answers to
  three questions.
- **Out:** an `## Agent skills` block in `CLAUDE.md` (or `AGENTS.md`), three files in `docs/agents/`, and on GitHub or
  GitLab, any triage label the tracker lacks.

## The three questions

| Section | Question | On camera |
|---|---|---|
| A · Issue tracker | where do issues live: GitHub, GitLab, local markdown files, something else? | `GitHub` (its recommendation, because the remote is GitHub) |
| B · Triage labels | keep the five default role labels, or map them to yours? (only when the `triage` skill is installed) | `yes` |
| C · Domain docs | one glossary at the root, or one per context in a monorepo? | settled without asking: single-context |

When neither `CLAUDE.md` nor `AGENTS.md` exists it asks one more: which file holds the block. `CLAUDE.md` is loaded by
Claude Code in every session; `AGENTS.md` is the tool-neutral file other agents read.

## How it runs

1. **Explore:** the remote, the files, its own templates. Facts it can look up, it doesn't ask.
2. **Present findings and ask:** one section at a time, each with a recommended answer.
3. **Confirm and edit:** the drafts, before anything is written.
4. **Write:** the block, the three files (the seed templates, unchanged), the missing labels.
5. **Done:** what it wrote, and who reads it. Nothing is committed: you say when.

## Who reads what

| File | Read by |
|---|---|
| `docs/agents/issue-tracker.md` | `to-tickets`, `to-spec`, `triage`, `wayfinder`, `implement` |
| `docs/agents/triage-labels.md` | `triage` |
| `docs/agents/domain.md` | `domain-modeling`, `grill-with-docs`, `improve-codebase-architecture` |

The five roles: `needs-triage`, `needs-info`, `ready-for-agent` (fully specified, an agent can work on it alone),
`ready-for-human` (needs a person), `wontfix`.

## Rules of thumb

- **Once per repository.** After that, edit `docs/agents/*.md` by hand; run it again only to switch trackers or start
  over.
- **The remote first.** Create the GitHub repository before the setup, so it can recommend the tracker and create labels.
- **You type it.** `disable-model-invocation: true`: Claude never starts it by itself.
- **Commit on your word, public last.** Look at every file and commit before you make the repository public.

**It's working if** your Labels page has the five triage labels, `docs/agents/` has three files, `CLAUDE.md` has an
`## Agent skills` section, and no skill file was changed.

---
The `setup-matt-pocock-skills` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License, described here in our own words. This course is independent: unofficial, and not affiliated
with or endorsed by Matt Pocock.
