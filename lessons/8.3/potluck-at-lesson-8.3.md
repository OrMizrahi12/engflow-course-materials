# Potluck at lesson 8.3

Repository: https://github.com/OrMizrahi12/potluck (public). Clone it to look or to start from here; don't fork it.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-8.3
```

The tag `lesson-8.3` points at `2ce5739`, `main` after PR #39 merged. The lesson starts from `18cb54a` (the tag `lesson-8.2`).

## Two merges after `lesson-8.2`

| Commit | Message |
|---|---|
| `2fae063` | Merge pull request #38 from OrMizrahi12/worktree-mask-dev-log-tokens ("Mask group tokens in the dev log", closes #35) |
| `2ce5739` | Merge pull request #39 from OrMizrahi12/worktree-issue-36-repin-warning ("Warn that re-pinning the code-review skill drops our guard sentence", closes #36) |

Both branches were built by background sessions, each in its own worktree, and opened as draft pull requests. We marked them
ready and merged them with auto-merge. Both production deploys succeeded.

What changed, in three files (all three are in this kit, exactly as they are at the tag):

- `scripts/dev.mjs`: the line it writes to `.data/logs/dev-latest.log` now masks every path under `/g/` as `/g/<token>`, a whole
  line at a time (so a token split across two chunks can't leak). The terminal still shows the real path.
- `e2e/logs.spec.ts`: two new browser tests. One creates a group, opens it with a probe query, waits for the log line
  `GET /g/<token>?probe=… 200`, and checks that the real token appears nowhere in the log. The other opens `/g/wp-login.php` and
  expects `GET /g/<token>?probe=… 404`. Before the fix: 4 failed and 2 passed; after: 6 passed (desktop and phone).
- `THIRD_PARTY_NOTICES.md`: a note for whoever re-pins the vendored `code-review` skill. Re-pinning overwrites `SKILL.md` and
  drops our guard sentence, so add it back, check it with the `grep -c` command (it prints `2`), and update the pinned commit.

## Issues

- #31 to #34: the decisions lesson 8.2's run left in PR #30, each `ready-for-human` and a sub-issue of the spec (#1): suggested
  settlements above the single-settlement cap; what should happen when a group is deleted outside the app; two glossary words; three small
  additions to keep or remove. Still open: they're decisions for you.
- #35 and #36: closed by the merges above (`issues-35-36.md` has them as filed).
- #37, "Group link tokens in Vercel's production request logs" (`ready-for-human`, open), with three options. The fork posted
  its research as a comment: Vercel keeps runtime logs for 1 hour on Hobby (1 day on Pro, 30 days with Observability Plus), each
  entry stores the real request path, the docs show no setting that keeps a path out of Vercel's own logs, and log drains (Pro and
  Enterprise only) can drop `/g/` requests completely but never rewrite a path.

No `ready-for-agent` ticket is left, and no pull request is open.
