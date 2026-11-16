# Issues #35 and #36, as filed

The two `ready-for-agent` tickets the named session filed in step 6, exactly as they read on GitHub, except one line: the
real link token in #35's example is replaced by `<token>` (a group's link is its only access control).

## #35 Dev log records full group link tokens

Label: `ready-for-agent`. Closed by PR #38.

### What happens

`npm run dev` (`scripts/dev.mjs`) copies everything `next dev` prints to `.data/logs/dev-latest.log`, and Next prints every request with its full path. A group's link token is its only access control, so the log holds a working link to every group opened in that dev session:

```
GET /g/<token> 200 in …
```

(Found in a worktree's log while writing this.) The file is gitignored, but agents are told to read it (`CLAUDE.md`, `/verify`), so tokens end up in transcripts.

### What to change

In `scripts/dev.mjs`, rewrite each line before it goes to the log so any path under `/g/` loses its token: `/g/<anything up to whitespace, ?, # or />` becomes `/g/<token>`. This covers `GET` and `POST` lines and malformed links like `/g/wp-login.php`. Leave the terminal output unchanged; it's the developer's own screen. Don't use Next's `logging.incomingRequests.ignore`: it drops the whole line, and `/verify` relies on the log showing each request's status.

Only `scripts/dev.mjs` and `e2e/logs.spec.ts` change. No migration.

### Done when

- A new test in `e2e/logs.spec.ts`, written like the IP test there, creates a group, opens its link, polls the log until it shows `GET /g/<token>`, and asserts the group's real token doesn't appear anywhere in the log since the test started. It passes on `desktop` and `phone` against `npm run dev` in the worktree.
- Opening `/g/wp-login.php` logs `GET /g/<token> 404`.
- The comment at the top of `scripts/dev.mjs` says the log masks group tokens.

## #36 Warn that re-pinning the code-review skill drops our guard sentence

Label: `ready-for-agent`. Closed by PR #39.

### What happens

`THIRD_PARTY_NOTICES.md` records our one change to the vendored code-review skill: the Standards and Spec sub-agent briefs in `.claude/skills/code-review/SKILL.md` each end with "Do not invoke `/code-review` or spawn additional agents: perform this review directly." It doesn't say that re-pinning the skill (moving `ref` in `skills-lock.json` and copying the upstream files again) replaces `SKILL.md` and drops that sentence without any warning. Without it, a sub-agent can call `/code-review` again and the review recurses. Flagged by the review of 7.5.

### What to change

Only `THIRD_PARTY_NOTICES.md` changes. Under "Our one change", add a short note for whoever re-pins:

- re-pinning overwrites `SKILL.md`, so the sentence has to be added back to the end of both briefs;
- how to check it's back: this command prints `2`;

  ```sh
  grep -c 'Do not invoke `/code-review` or spawn additional agents' .claude/skills/code-review/SKILL.md
  ```

- update the pinned commit in this file to match `skills-lock.json`.

Leave the skill's files alone; they already carry the sentence.

### Done when

- `THIRD_PARTY_NOTICES.md` contains the note, including that exact `grep -c` command and its expected output `2`.
- Running that command today prints `2`.
- The commit named in the notice still matches `ref` in `skills-lock.json`.
