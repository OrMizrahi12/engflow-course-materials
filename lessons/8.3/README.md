# Student kit: Lesson 8.3, Background sessions and phase boundaries

Lesson 8.2's orchestrator finished with 130,000 tokens in its context. Instead of clearing it, we walk the five questions at a
phase boundary, and this session lands on `/compact` with an instruction. It files its four open decisions as tickets (#31 to
#34), and we close it. A named session (`claude -n leftovers`) files two small tickets that can run with nobody watching (#35,
#36) and one decision for us (#37). `/fork` sends a copy of it off to research Vercel's log retention. Then `claude --bg` starts
one background session per ticket. We watch them in the agent view (`claude agents`), reply to the one that got stuck, and land
both draft pull requests ourselves (#38, #39). At the end we resume the named session to confirm the deploys and empty the agent
view.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/compact.txt` | the instruction after `/compact`: what the next phase is |
| `prompts/decisions.txt` | file each decision PR #30 left as its own `ready-for-human` ticket |
| `prompts/leftovers.txt` | the named session's prompt: two tickets for unattended work, one decision for us |
| `prompts/fork.txt` | the side task after `/fork`: what Vercel's request logs keep, from public docs only |
| `prompts/reply-stuck.txt` | the reply to the stuck background session, sent from the peek box |
| `prompts/resume.txt` | in the resumed session: confirm the deploys the way `landing.md` says |
| `issues-35-36.md` | the two `ready-for-agent` tickets as the named session filed them |
| `potluck-at-lesson-8.3.md` | what the Potluck repository holds at the tag `lesson-8.3`: the merges, the issues, the fork's comment |
| `potluck/scripts/dev.mjs` | the dev wrapper after #38 (the log masks group tokens), exactly as it is at the tag |
| `potluck/e2e/logs.spec.ts` | the log tests after #38, exactly as they are at the tag |
| `potluck/THIRD_PARTY_NOTICES.md` | the notice after #39 (the re-pin warning), exactly as it is at the tag |
| `phase-boundaries.md` | the card: five questions, five moves, `/fork`, the same tree with two answers |
| `background-sessions.md` | the card: which tickets run unattended, `claude --bg`, the agent view's keys, landing, cleanup, when not to |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 8.2 (the tag `lesson-8.2`, `18cb54a`), with `main` deployed and `npm run dev` working.
  Signed in to GitHub with `gh`.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325). On camera every session ran on
  Opus 5.5 in auto mode. The agent view is a research preview in this version; its screens may differ in yours.
- A local Postgres as in lesson 6.2, and enough memory for two test runs at once (see "If something goes differently").

## The steps, as on camera (Ubuntu)

**1. At the boundary.** The orchestrator from lesson 8.2 is still open in its worktree window. Its last reply: the production
deploy worked, the merge closed five tickets, one step is still yours. The footer reads `130.1k (13%)`, and Claude Code suggests
`new task? /clear to save 130.6k tokens`.

**2. The tree.** In a shell, print the two parts of the plugin's phase-boundary file:

```bash
sed -n '9,25p' ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/ask-matt/PHASE-BOUNDARIES.md
sed -n '27,40p' ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/ask-matt/PHASE-BOUNDARIES.md
```

(The path depends on where your plugin is installed; `ls ~/.claude/plugins/cache` finds it.) The five options, the rule "the
first yes wins", and five questions. `phase-boundaries.md` has them in plain words.

**3. `/compact` with an instruction.** In the orchestrator, type `/compact` (its menu row: "Free up context by summarizing the
conversation so far"), a space, and paste `prompts/compact.txt`. About 40 seconds later: `Compacted`, the files it read again, and
`Skills restored (mattpocock-skills:pr, mattpocock-skills:code-review, mattpocock-skills:implement-spec)`. The counter shows
`0.0k (0%)` until the next turn. Ctrl+O opens the same block in the detailed view; the summary itself isn't shown.

**4. The next job.** Paste `prompts/decisions.txt`. After its first step the counter reads `53.4k (5%)`, including the doc it just
read. One command is refused (`Error: This session is isolated in the worktree …`); it splits it up and carries on. One minute:
tickets #31 to #34, each `ready-for-human` and a sub-issue of the spec, and a table of what each one asks you. The counter ends at
`58.9k (6%)`.

**5. Close it.** Type `/exit`. Because the session lives in a worktree, it asks what to do with it: "You have 57 commits on
worktree-spec-v1." That branch went into `main` through PR #30, so nothing is lost: press Down to "Remove worktree" and Return.
`Worktree removed.` It prints `Resume this session with: claude --resume <id>`. Type `exit` to close the window.

**6. A named session.** Open a new terminal window (Ctrl+Shift+N on camera), then:

```bash
cd ~/potluck
claude -n leftovers
```

The name shows on the prompt bar. Paste `prompts/leftovers.txt`. 1 minute 22 seconds: it read `scripts/dev.mjs` and found real
tokens in an old worktree's log, checked Next's request-logging setting, and filed #35 and #36 (`ready-for-agent`) and #37
(`ready-for-human`, three options: accept the risk, move the token out of the path, or reduce what Vercel keeps).
`issues-35-36.md` has the two unattended tickets as filed. The counter reads `52.2k (5%)`: at this session's own boundary,
question 1 says continue.

**7. `/fork` the side task.** Type `/fork` (its menu row: "Copy this conversation into a new background session and keep working
here"), a space, and paste `prompts/fork.txt`. It answers with one line: `session running · leftovers ⑂ From Vercel's public docs
only … · <id>`.

**8. Launch the background sessions.** In your first window:

```bash
gh issue list -l ready-for-agent
claude --bg --name dev-log "/mattpocock-skills:implement #35, then open a draft PR"
claude --bg --name repin-note "/mattpocock-skills:implement #36, then open a draft PR"
```

Each returns at once: `backgrounded · <id> · <name>`, plus `claude attach <id>`, `claude logs <id>` and `claude stop <id>`.

**9. The agent view.** Type `claude agents`. The header: "New sessions: Opus 5.5 · medium effort", then "0 awaiting input · 2
working · 1 completed". The completed row is the fork, with its mark. Select it, press Space to peek (logs are kept 1 hour on
Hobby, up to 30 days with Observability Plus), Enter to attach (a retention table by plan, and log drains on paid plans only),
and the left arrow to go back: its row says the findings are posted to #37. Then peek and attach on dev-log: browser tests green,
a test worker killed mid-run (memory), all 196 service tests passing, a commit on its way.

**10. What it costs.** In the leftovers window, type `/usage`. The current week, all models: 7% used, with the reset date; below
it, what has been using it. Esc, then `/exit`: it prints how to resume this session.

**11. Watch.** dev-log finished after 17 minutes: draft PR #38. repin-note's status stayed on "pre-commit tests OOM; waiting on
other job, then recommit": its wait loop's `pgrep` matched its own command line, so it could never end. Select its row, press Space,
paste `prompts/reply-stuck.txt`, and press Enter. The row changes to "Checking memory and top processes"; the suite passes on four
workers; it commits, runs the project's own `code-review` copy (Standards and Spec), fixes the one hard violation it finds in the
commit body, and opens draft PR #39. 41 minutes in all, about 27 of them stuck.

**12. Land #38.** Esc out of the agent view, then:

```bash
gh pr list
gh pr diff 38 --name-only
gh pr checks 38
gh pr ready 38
gh pr merge 38 --auto --merge
```

Two files (`e2e/logs.spec.ts`, `scripts/dev.mjs`), nothing under `drizzle/`, so no migration; three checks successful. The branch
was current, so it merged at once.

**13. Land #39.**

```bash
gh pr diff 39 --name-only
gh pr checks 39
gh pr view 38 --json state,mergedAt
gh pr ready 39
gh pr merge 39 --auto --merge
gh pr view 39 --json mergeStateStatus
gh pr update-branch 39
gh pr checks 39 --watch
gh pr view 39 --json state,mergedAt
```

One file, checks green; #38 `MERGED`. #39 was `BEHIND`, because #38 had just changed `main`; `update-branch` brought `main` in and
CI ran again (2 minutes 40 seconds). It was still `OPEN` for a few seconds more, then auto-merge took it.

**14. Resume by name.** In the leftovers window:

```bash
claude --resume leftovers
```

Same conversation, `52.2k`. Paste `prompts/resume.txt`. It read Vercel's status on each merge commit: #38's merge (`2fae063`)
succeeded, #39's (`2ce5739`) succeeded, and production serves #39, which includes #38. The merges closed #35 and #36. Its last line:
it can't see what the fork did, so it doesn't know whether the comment reached #37. A fork is a copy; its work never flows back.

**15. Clean up.** In your first window, `claude agents`, then Ctrl+X twice on each of the three rows (the first asks, the second
removes the row with its worktree). The empty view explains its three sections. Esc, then:

```bash
git pull -q
git log --oneline --first-parent -3
gh issue list -l ready-for-agent
git worktree list
```

`Merge pull request #39`, `Merge pull request #38`, lesson 8.2's merge; no `ready-for-agent` tickets left; the orchestrator's
worktree and both background worktrees are gone.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own clone, pick one small ticket that a check can prove, with no migration and no product decision in it. Start it with
`claude --bg`, a name, and `/mattpocock-skills:implement` with the ticket number, then open a draft PR. Open the agent view, peek,
attach once, and land its draft yourself. Then, at the next boundary in your longest session, walk the five questions and write
down which one said yes.

**Checkpoint (it's working if):** the session worked in its own worktree and stopped at a draft; you read the diff and the checks
before marking it ready; the agent view is empty afterwards; and you can name the question that decided your boundary move.

## If something goes differently

- **The background session pushes but opens no pull request.** Without ", then open a draft PR" in the prompt, our dry run ended
  that way. Put the clause in, or open the PR yourself from its branch.
- **A row sits on the same status for many minutes.** Peek. If it's waiting on something that already finished, reply from the
  peek box; attach if you need to see more.
- **Test workers get killed (out of memory).** Two sessions running the test suite at once can run a machine out of memory. Both
  sessions on camera retried with fewer workers. Run fewer sessions at once, or close other heavy programs.
- **`/exit` warns about commits that would be lost.** Check that the branch is already in `main` (on camera it had merged through
  PR #30) before you remove the worktree; otherwise keep it.
- **`mergeStateStatus` says `BEHIND`.** Another PR changed `main` first: `gh pr update-branch <n>` and wait for the checks.
- **The resumed session can't see what the fork did.** Expected: look where you asked the fork to leave its result (on camera, a
  comment on #37).
- **Your tickets and numbers differ.** Expected. What should match is the shape: small tickets with a provable "Done when", one
  background session each, a draft that you land.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that's the Ubuntu (WSL) terminal, in your Linux home folder
(`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. The new-window shortcut differs between terminals
(on camera: Ctrl+Shift+N).

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-8.3` points at
`2ce5739`, `main` after PR #39. Clone it to look or to start from here; don't fork it. `potluck-at-lesson-8.3.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. Parallel sessions spend your
  usage in parallel; on camera `/usage` showed 7% of the week at the time we checked. Every session ran on Opus 5.5.
- git, `gh`, GitHub Actions on a public repository and the skills (open source, MIT License) are free.
- Vercel's free Hobby plan (for non-commercial use) keeps runtime logs for 1 hour; log drains are on paid plans only.

## Credits

The `ask-matt` skill (its `PHASE-BOUNDARIES.md` tree), `handoff`, `implement`, `tdd`, `code-review` and `pr` are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. They are described here in our own
words; `phase-boundaries.md` paraphrases the tree. This course is independent: unofficial, and not affiliated with or endorsed by
Matt Pocock.

```text
MIT License

Copyright (c) 2026 Matt Pocock

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
