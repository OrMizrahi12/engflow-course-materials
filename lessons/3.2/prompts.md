# Prompts (Lesson 3.2)

Every line typed or pasted in the lesson, in order. Use your own words; these are the ones from camera.

## In the planning session (Claude Code, `~/potluck`)

**The repository** (written beforehand and pasted):

```text
The repo comes first, so let's make it. Turn this folder into a git repository with a short README.md (the name and one sentence about Potluck) as the first commit, then create a private GitHub repository called potluck from it with gh and push. Private for now: it goes public once we've checked what's in it.
```

Came back: the first commit `9eea3cd Add README`, a private repository on GitHub, `main` pushed and tracking
`origin/main`, and the command to go public later.

**The setup** (typed; pick it from the menu):

```text
/setup-matt-pocock-skills
```

Came back: what it found (the remote, the files, the `triage` skill, no monorepo), then Section A: where should issues
live? Recommended: GitHub Issues.

**Section A, the issue tracker:**

```text
GitHub
```

**Section B, the triage labels** (keep the five defaults?):

```text
yes
```

Came back: the drafts (the `## Agent skills` block and the three `docs/agents` files) and one question: `CLAUDE.md` or
`AGENTS.md`?

**Where the block goes:**

```text
CLAUDE.md, no changes. Write it.
```

Came back: `CLAUDE.md` and three files in `docs/agents/` written, four labels created on GitHub, `wontfix` already there,
nothing committed yet.

**Commit and push:**

```text
Commit these files and push.
```

Came back: `12deed8` "Configure agent skills: GitHub issues, triage labels, domain docs", pushed; still private.

**Go public, after checking every file:**

```text
I've checked what's in it. Make the repository public.
```

Came back: `"visibility": "PUBLIC"`.

## In a second terminal (reading the skill)

```bash
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/setup-matt-pocock-skills
ls
head -15 SKILL.md
grep -n "^### [0-9]" SKILL.md
```

## In the browser

- `https://github.com/<your-account>/potluck`: the repository page (Private, then Public).
- `https://github.com/<your-account>/potluck/labels`: the labels (10 defaults on camera, then 14).
- On the repo page: `1 Commit` / `2 Commits`, `CLAUDE.md`, `docs/agents/issue-tracker.md`.

The setup skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License). This
course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
