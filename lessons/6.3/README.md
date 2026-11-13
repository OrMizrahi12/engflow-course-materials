# Student kit: Lesson 6.3, The landing loop

The walking skeleton is built and its preview runs. This lesson lands it, and sets up the way every later change lands.
`/pr` writes the pull request body (a summary, before-and-after evidence, and a door call: one-way or two-way, and the blast
radius). A ruleset on `main` makes a pull request and a green check on an up-to-date branch the only way in, and auto-merge
lets a green pull request merge itself. A second session writes the landing rules for agents and deny rules that keep force
pushes, pushes to `main` and hard resets away from Claude, and tests them live. Then we merge the migration by hand, read the
production deploy, watch the second pull request fall behind, catch up and merge itself, and remove both worktrees.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/pr-request.txt` | the request after `/mattpocock-skills:pr` (open the pull request, the evidence, the follow-up issue) |
| `prompts/landing-rules.txt` | the landing session's first request: the landing doc, the pointer, the deny rules, live tests |
| `prompts/push-and-queue.txt` | push, open the pull request with `/pr`, queue auto-merge |
| `prompts/merged-check-production.txt` | after the merge: read the production deploy, open production, where ticket #2 stands |
| `prompts/open-in-chrome.txt` | the follow-up that opens production in Chrome without an extension |
| `prompts/update-and-land.txt` | to the landing session after #13 merged: update the branch if it fell behind, watch it land |
| `ruleset-and-auto-merge.md` | the ruleset "Protect main" setting by setting, the two General settings, the `gh` commands of the loop |
| `pr-body-example.md` | the body `/pr` wrote for pull request #13, as published |
| `potluck-at-lesson-6.3.md` | what the Potluck repository holds at the tag `lesson-6.3`: the two merges, the files, the settings |
| `potluck/docs/agents/landing.md` | the landing doc the landing session wrote, exactly as it is at the tag |
| `potluck/claude-settings.json` | the file `.claude/settings.json` at the tag: the twelve deny rules |
| `pr.md` | the card: what `/pr` takes in and gives back, the door and the blast radius, it's working if |
| `landing-loop.md` | the card: the loop from worktree to production, the gate, the two locks, falling behind |

The cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the end of lesson 6.2: the branch `worktree-walking-skeleton` pushed, with its Vercel preview built
  and its Neon branch copied from `development`; signed in to GitHub with `gh`.
- The Claude Code session from lesson 6.1 that built the branch, still open in its worktree (or a new session in the same
  worktree; it won't remember the review, so give it the ticket and the branch).
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera), in auto mode on camera.
- Admin rights on your repository on GitHub (it is your own repository, so you have them).

## The steps, as on camera (Ubuntu)

**1. /pr in the 6.1 session.** Two yellow lines from a first try sit in the session: plain `/pr` answered "Unknown command:
/pr". In this version of Claude Code the short name isn't found, but the plugin's full name is. Type
`/mattpocock-skills:pr`, a space, and paste `prompts/pr-request.txt`. On camera the turn took 3 minutes 44 seconds: it
loaded the skill and read the branch; Claude Code offered a Vercel plugin (we answered 2, No); it listed Vercel's
deployments; production answered 404 ("The page could not be found"); the preview, fetched with `vercel curl`, answered 200
with the seeded greeting; it opened follow-up issue #12 ("Gate merges with four checks and protect production") and pull
request #13. Its report adds something we didn't ask for: Vercel's bot comment on the pull request links to the dashboard,
and those links carry the team's name, so the production address can be guessed. Its last line: merging is a one-way door,
because the first production build creates a table on Neon's root branch, and reverting the code won't remove it.

**2. The pull request on GitHub.** Pull requests → #13. "Closes #2" and the leftovers in #12; the Summary as a small tree;
the Evidence (before: production serves `main`, both routes 404; after: the preview answers 200, "Potluck is connected to
its database."); Merge Danger: Door one-way, Blast Radius production. All checks have passed; leave the merge button alone
for now.

**3. The ruleset.** Repository Settings → Rules → Rulesets → New ruleset → New branch ruleset. Name `Protect main`;
Enforcement status Active; Target branches → Add target → Include default branch. Restrict deletions and Block force pushes
are ticked already. Tick Require a pull request before merging (Required approvals stays at 0 when you are the only
reviewer). Tick Require status checks to pass, then Require branches to be up to date before merging, then Add checks and
start typing: pick `Type-check, lint and service tests` (GitHub Actions). Create. GitHub may ask you to confirm it's you:
that is your own sign-in step. The saved page: "Applies to 1 target: main". Every setting is in
`ruleset-and-auto-merge.md`.

**4. Auto-merge.** Settings → General → Pull Requests: tick Allow auto-merge (it saves at once) and Automatically delete
head branches. Back on #13 the check now wears a "Required" label; the merge button is still green because the check
already passed.

**5. The landing session.** In a second terminal tab: `cd ~/potluck`, then `claude -w landing-rules`. The header shows the
version, Opus 5.5 and the worktree's folder, `~/potluck/.claude/worktrees/landing-rules`. Paste
`prompts/landing-rules.txt`. On camera the turn took 1 minute 18 seconds: it loaded `writing-for-agents`, read the repo's
merge settings and the ruleset with `gh`, and its first write (one long shell command) was refused by the worktree guard
("too complex to verify that it stays inside the worktree"), so it wrote the three files with its own tools and committed
them as one commit. Then the live tests, each harmless even if its rule failed: force push written three ways, a push with a
`+`, two pushes to `main`, `git reset --hard` two ways: all eight denied. An ordinary dry-run push of its own branch was
allowed. Its report also names a gap: a bare `git push` while you're on `main` names no branch, so no rule catches it, and
the ruleset rejects it on GitHub anyway.

**6. The second pull request.** In the landing session, paste `prompts/push-and-queue.txt`. It pushed, wrote the body with
`/pr`, opened #14, checked that no file under `drizzle/` is in it, ran `gh pr merge 14 --auto --merge`, and read the state:
BLOCKED, because the required check hasn't reported (the workflow that runs it only reaches `main` with #13). It already
said that once #13 merges, this branch will be behind and will need `gh pr update-branch`. On GitHub: two open pull
requests; #14 shows "enabled auto-merge", its check "Expected — Waiting for status to be reported" and "Required", and "This
pull request will merge automatically when all requirements are met."

**7. Merge #13 by hand.** It carries a migration, so a person merges it. On #13: Merge pull request → the default message →
Confirm merge. "Pull request successfully merged and closed", and the branch is deleted by itself (the setting from step 4).
Open ticket #2: Closed, as completed, in #13.

**8. Read the production deploy.** Back in the 6.1 session, paste `prompts/merged-check-production.txt`. It read the merge
commit's Vercel status on GitHub (success), followed it to the deployment (target production, Ready) and its log
("Migrations applied."). To open a browser it loaded Claude Code's Chrome skill, and Claude Code asked to install the Claude
in Chrome extension: we answered Not now. It fetched the production address with `curl` instead: the home page and
`/api/health` answer 200, from Frankfurt. Where #2 stands: done (the app, the migrations, previews, production); not done,
all in #12 (Playwright, four separate checks, branch protection, the pooled-endpoint check, the firewall rule). The branch
protection line is out of date: the session's context was written before the ruleset existed. Then paste
`prompts/open-in-chrome.txt`: Chrome opens a new tab on production, which says "Potluck reached its database, which has no
seed data." Production was migrated by the merge and is empty, because production is never seeded. It is live at its
address; we simply haven't announced it.

**9. Fell behind.** In the landing session, paste `prompts/update-and-land.txt`. It read the state (behind), ran
`gh pr update-branch 14` (main merged into the branch), and watched the checks with `gh pr checks 14 --watch` after the
worktree guard refused its first watch loop. The required check passed in 33 seconds, GitHub auto-merged #14 with a merge
commit, and it read the merge commit's deploy: "Deployment has completed". About 1 minute 40 seconds from the message to
landed and deployed. On GitHub: no open pull requests, two closed; #14's timeline shows auto-merge enabled, the commit that
brought `main` in, the merge with three checks passed, and the branch deleted.

**10. Clean up.** In the first tab, the hosting session from lesson 6.2: `/exit`, then `cd ~/potluck`. In the second tab,
the landing session: `/exit` asks what to do with its worktree, which still holds one commit: choose Remove worktree. It
says the commit was discarded; it isn't lost, because that commit is already in `main`. The 6.1 session ends the same way,
with Remove. Then in the main checkout:

```bash
git pull
git worktree list
git log --oneline -4
```

`git worktree list` shows the main checkout alone; the log shows the merge of #14, the update, the merge of #13 and the
landing-rules commit.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own copy, from where lesson 6.2 left it: open the pull request for your walking-skeleton branch with `/pr` and
check its door call. Add the ruleset, with the check on an up-to-date branch, and allow auto-merge. Merge it yourself, since
it carries a migration. Then open your own production address.

**Checkpoint (it's working if):** the body has a Door and a Blast Radius line you agree with; Settings shows the ruleset
active on `main`; after your merge, ticket #2 is closed by the pull request, the merge commit's Vercel status says success,
and your production page says it reached its database with no seed data.

## If something goes differently

- **Plain `/pr` answers "Unknown command".** Type the plugin's full name, `/mattpocock-skills:pr`.
- **Claude Code offers a plugin, or the Claude in Chrome extension.** Neither is needed here; we answered No and Not now.
- **GitHub asks you to confirm access** when you create the ruleset. That is your own sign-in step; the ruleset is created
  after it.
- **The check isn't in the Add checks list.** GitHub suggests checks that have run in the last week; push once so the
  workflow runs, then add it.
- **Your pull request says BLOCKED with auto-merge queued.** Expected while the required check hasn't reported or the
  branch is behind: `gh pr update-branch <N>` brings `main` in and the check runs again.
- **The worktree guard refuses a long shell command.** Claude Code couldn't prove the command stays inside the worktree;
  plain separate commands, or Claude's own file tools, go through.
- **Remove worktree says commits were discarded.** If they were merged, they are in `main` (`git log` shows them).

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder. `xdg-open` opens a page on Linux; in WSL use `wslview` (or `explorer.exe`), on macOS `open`. GitHub's settings pages
are the same everywhere.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-6.3` points at
`a20746d`, the merge of #14 on `main`. Clone it to look or to start from here; don't fork it, and connect your own Vercel and
Neon projects. `potluck-at-lesson-6.3.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the sessions
  ran on Opus 5.5.
- **Rulesets and auto-merge** are free on a public GitHub repository; on a private repository they need a paid GitHub plan.
- **Vercel Hobby** is free for non-commercial use; **Neon Free** as in lesson 6.2.
- Node, npm, git, `gh` and the skills (open source, MIT License) are free.

## Credits

The `pr` and `writing-for-agents` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. The `pr` skill credits its menu of summary visuals to Dex Horthy's `show-me` skill. The skills are
described here in our own words; the body in `pr-body-example.md` and the landing doc were written by those skills on camera.
This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
