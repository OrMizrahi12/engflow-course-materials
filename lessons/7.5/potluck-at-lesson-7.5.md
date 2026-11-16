# Potluck at the tag `lesson-7.5`

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it). The tag `lesson-7.5` points at
`d58cb50`, the merge of pull request #25 on `main`.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-7.5
```

## What landed in this lesson

```text
d58cb50 Merge pull request #25 from OrMizrahi12/worktree-team-review
e5f59fd Re-pin code-review to upstream 5863806
228ea3f Keep code-review's sub-agents from reviewing recursively
eea53e3 Copy the code-review skill from mattpocock/skills
d2649a1 (tag: lesson-7.4) Merge pull request #24 from OrMizrahi12/worktree-link-shape
```

- **`eea53e3`**: the copy exactly as skills.sh wrote it, at the commit the plugin runs (`49dd158`):
  `.claude/skills/code-review/SKILL.md`, `.claude/skills/code-review/agents/openai.yaml` and `skills-lock.json`.
- **`228ea3f`**: our one change, the documented guard line at the end of both sub-agent briefs, and
  `THIRD_PARTY_NOTICES.md` with upstream's MIT license.
- **`e5f59fd`**: the re-pin to upstream main (`5863806`): upstream's new sentence kept ("Start every sub-agent with a fresh
  context window."), our line put back, the pin updated in the notice.
- **#25**, "Vendor the code-review skill with a no-recursion brief": body written with `/pr`, no `Closes` line (no ticket),
  no migration, auto-merge on green checks; Vercel deployed the merge commit to production. No app code changed.

## What it means for the next lessons

- Inside Potluck (and every worktree and clone), plain `/code-review` runs the team's copy, with the guard line. Claude Code's
  own review is `/review`; the plugin's copy still loads as `/mattpocock-skills:code-review`.
- To stay current: check upstream with `git ls-remote`, re-pin with the same skills.sh command at the new commit, read the
  diff for both sides, put the line back, test in a fresh session, land it. A re-pin always drops our line (the copied folder
  is replaced).
- The review's suggestions were kept open: the pin is written twice (notice and lock file); a warning about the re-pin could
  go in the notice; the lock file's `computedHash` after our edit is unconfirmed.

## Outside the repo

`~/learn-git-merges` holds the `/teach` workspace (its own git repo, nothing committed): `MISSION.md`, `RESOURCES.md`,
`NOTES.md`, `lessons/0001-your-first-merge-conflict.html`, `reference/merge-conflicts.html`, `assets/` (the stylesheet, the
quiz, the conflict checker, `labs/lab-01-first-conflict.sh`) and `learning-records/`. Its lab hasn't been run yet.

The files in `potluck/` are copied exactly as they are at the tag.
