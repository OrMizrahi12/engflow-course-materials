# Potluck at the tag `lesson-7.2`

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it). The tag `lesson-7.2` points at
`ae08090`, the merge of pull request #18 on `main`.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-7.2
```

## What landed in this lesson (first-parent history of `main`)

```text
ae08090 Merge pull request #18 from OrMizrahi12/worktree-coding-standards
065b270 Merge pull request #17 from OrMizrahi12/worktree-balance-engine
292703a (tag: lesson-6.5) Merge pull request #16 from OrMizrahi12/worktree-create-group
```

- **#17, the balance engine** (from lessons 6.4 and 7.1): "Part of #4 and #6"; those tickets stay open for their service
  tests.
- **#18, coding standards and the glossary lint**: the `trip` rename, the ESLint rule, ESLint in the pre-commit step, the
  kept decisions in `CODING_STANDARDS.md`, and `CLAUDE.md` back to 19 lines.

## Now enforced on `main`

- `npm run lint` (part of `npm run check` and of CI) rejects declared names and test names that use a word from a
  `GLOSSARY.md` _Avoid_ list. The rule reads the glossary, so the glossary stays the single source. See
  `potluck/eslint.config.mjs` in this kit.
- The pre-commit step runs ESLint on staged scripts (`potluck/.lintstagedrc`).
- `CODING_STANDARDS.md` keeps only what no tool can judge, plus the decisions to leave three things as they are
  (`potluck/CODING_STANDARDS.md`).
- `CLAUDE.md` is 19 lines, the same as before the lesson (`potluck/CLAUDE.md`).

## Kept for later

- Candidate 1: a new worktree has no `node_modules`, so its commits run no pre-commit hook until `npm ci`. A worktree setup
  script would fix that.
- Candidate 5: spec #1's body still contradicts its latest comment.

The files in `potluck/` are copied exactly as they are at the tag.
