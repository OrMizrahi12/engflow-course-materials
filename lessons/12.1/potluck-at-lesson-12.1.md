# Potluck at the tag `lesson-12.1`

The tag `lesson-12.1` points at commit `e873988` on `main`: the merge of PR #72, "Add the words for running Potluck to the
glossary", from the branch `worktree-production-readiness`. Compared with `lesson-11.2` (`39a76fc`), one file changed:
`GLOSSARY.md`, 38 lines added (the Running Potluck section, `glossary-running-potluck.md` in this kit). No app code changed,
so the production deploy after the merge serves the same app; `/api/health` still answers `{"status":"ok"}`.

What changed outside the code, on GitHub:

- spec #63 "Spec: production readiness" (`spec-63.md`), with eight sub-issues #64 to #71 (`tickets-64-71.md`);
- #11 rewritten as "Nightly encrypted backups before launch", now blocked by #67 and #70;
- a comment on #37 accepting the log risk on Hobby;
- PR #72, merged by auto-merge on its check.

To follow along from this point:

```bash
git clone https://github.com/OrMizrahi12/potluck.git   # clone, never fork
cd potluck
git checkout lesson-12.1
sed -n '/^## Running Potluck/,$p' GLOSSARY.md
```

The spec and tickets live in our tracker; in your own clone, the issues are yours to create with your own grilling.
