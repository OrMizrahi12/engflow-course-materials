# Potluck at the tag `lesson-7.3`

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it). The tag `lesson-7.3` points at
`7c3f5d2`, the merge of pull request #20 on `main`.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-7.3
```

## What landed in this lesson

Pull request #20, "Add a verify skill and make CLAUDE.md one pointer per line", merged by auto-merge (no file under
`drizzle/`), four commits:

```text
3776bfa Add a verify skill: check a change in the running app, commit evidence
7f6326d Give the verify skill's evidence and PR steps a done-when
ed24dab Make CLAUDE.md one context pointer per line
960f575 Point CLAUDE.md at AGENTS.md for the Next.js docs
```

Vercel's production deploy of `7c3f5d2`: success.

## Now on `main`

- `.claude/skills/verify/SKILL.md` (a copy is in `potluck/skills/verify/SKILL.md` in this kit): model-invoked, seven steps,
  each ending on a done-when. In this repository it answers `/verify` in place of Claude Code's own.
- `CLAUDE.md`, 8 lines (a copy is in `potluck/CLAUDE.md`): `## Agent skills` and six pointers, Next.js first.

## Still open

- **Issue #19** (`needs-triage`): "Dev server reloads the page in a loop when run through npm run dev". The suspected cause
  (the log written inside the watched project) is unconfirmed; it blocks browser checks, ticket #4's included.
- The Next.js pointer hasn't been tested in a fresh session yet, and steps 5 and 6 of the verify skill haven't run on a real
  change yet. Pull request #20's Evidence section says both.
