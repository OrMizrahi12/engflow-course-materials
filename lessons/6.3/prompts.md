# Lesson 6.3: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. Three Claude Code sessions take
part: "the 6.1 session" (the one that built `worktree-walking-skeleton` in lesson 6.1, still open in its worktree), "the
landing session" (new in this lesson, in its own worktree) and, at the end, the hosting session from lesson 6.2.

## 1. /pr in the 6.1 session

A first try with plain `/pr` left two yellow lines: "Unknown command: /pr. Did you mean /cd?" and "Args from unknown
skill: …". The short name isn't found in this version; the plugin's full name is. Type `/mattpocock-skills:pr`, a space, and
paste `prompts/pr-request.txt`:

```text
Open the pull request for this branch into main; it closes #2. The last commit came from another session: the hosting setup. We've run its wizard, so this branch has a live preview. For the evidence, compare what production serves now with what that preview serves. Whatever #2 asks for that this branch doesn't do goes into one follow-up issue, linked from the PR. Keep the production address out of both: the repo is public and we haven't launched. Open it and stop there: don't merge.
```

The turn took 3 minutes 44 seconds. It loaded the `pr` skill and read the branch (`git log`, `git show HEAD`). The `npx`
command for Vercel made Claude Code offer a plugin ("Plugin recommendation: vercel … Would you like to install it?"): we
answered **2. No**. It listed Vercel's deployments and read the statuses on the branch head; curl of the production address
answered 404 ("The page could not be found"); `vercel curl` of the preview (behind deployment protection) answered 200 with
`<h1>Potluck</h1>` and "Potluck is connected to its database." It read the build log ("Migrations applied." before the
build), the environment variables by name, the repository's labels and conventions, then wrote the follow-up issue first,
so the pull request could link it: **#12 "Gate merges with four checks and protect production"** (label `ready-for-human`),
then **pull request #13 "Walking skeleton: app, database, CI and a live preview"**. It checked its own text for any Vercel
address before publishing.

Its report: the follow-up issue holds what #2 asks for that the branch doesn't do (Playwright against the preview, the four
separate checks, branch protection, the pooled-endpoint check, the firewall rule); under "Things to know", Vercel's bot
comment on the pull request carries dashboard links with the team's name, so the production address can be guessed (it
suggests hiding the comment and turning those comments off; it didn't touch it); Node 24 on Vercel isn't confirmed; linking
#12 under #1 and before #3 was blocked by the permission system, because we hadn't asked for it. Last line: "Merging is a
one-way door, as the PR says. The first production build creates app_info on Neon's root branch."

## 2. Pull request #13 on GitHub

Pull requests → #13. The body is in `pr-body-example.md`. All checks have passed (3 successful checks); the merge button
is green. We leave it.

## 3. The ruleset and auto-merge (GitHub settings)

Settings → Rules → Rulesets → New ruleset → New branch ruleset, then Settings → General → Pull Requests. Every setting is in
`ruleset-and-auto-merge.md`. On #13 the check now shows "Required".

## 4. The landing session

In a second terminal tab:

```bash
cd ~/potluck
claude -w landing-rules
```

The header: Claude Code, Opus 5.5, `~/potluck/.claude/worktrees/landing-rules`; auto mode on. Paste
`prompts/landing-rules.txt`:

```text
Write down how this repo lands a change, in docs/agents/landing.md with a short pointer in CLAUDE.md. One change, one worktree, one PR; the body follows /pr and says Closes #N when there's a ticket. Right after opening, queue auto-merge (gh pr merge --auto --merge): GitHub merges once the required check is green. A PR that carries a migration (a new file in drizzle/) is left for a human to merge, never auto-merged. Branch behind main: gh pr update-branch. After a merge, read the merge commit's production deploy from GitHub (Vercel posts it as a commit status). Then add deny rules to .claude/settings.json for force-pushes, pushes to main and git reset --hard. Commit, then test each deny rule live. Don't push yet.
```

"Sautéed for 1m 18s". It loaded `writing-for-agents`; read `.gitignore`, the remote, the repository's merge settings and
the ruleset with `gh api`. Its first write, one long shell command (`mkdir -p .claude && cat > docs/agents/landing.md
<<'EOF' …`), was refused by the worktree guard: "this command is too complex to verify that it stays inside the worktree".
It wrote `docs/agents/landing.md` (25 lines), `.claude/settings.json` (the deny rules) and the CLAUDE.md pointer with its
own file tools, and committed them as `e12ee7b` "Document how a change lands; deny force-push, push to main and reset
--hard". The live tests, each answered "Permission to use Bash with command … has been denied":

| Command | Result |
|---|---|
| `git push --force --dry-run origin <branch>` | denied |
| `git push -f --dry-run origin <branch>` | denied |
| `git push --dry-run origin <branch> --force-with-lease` | denied |
| `git push --dry-run origin +<branch>` | denied |
| `git push --dry-run origin main` | denied |
| `git push --dry-run origin HEAD:main` | denied |
| `git reset --hard HEAD` | denied |
| `git reset -q --hard HEAD` | denied |
| `git push --dry-run origin <branch>` | allowed |

Gaps it named: a plain `git push` while you're on `main` names no branch, so these rules can't catch it (the ruleset still
rejects it on GitHub); the `+` rule also blocks a branch name containing `+`.

## 5. Push and queue auto-merge

In the landing session, paste `prompts/push-and-queue.txt`:

```text
Push it, open the PR with /pr and queue auto-merge as the new rules say. There's no ticket for this one. The check only reaches main with #13, so it will wait for that.
```

"Cooked for 39s" (48 seconds on the clock). `Skill(mattpocock-skills:pr)`; `git push -u origin worktree-landing-rules`; the
body written to a file; `gh pr create` → **#14**; "The PR carries no drizzle/ file, so it qualifies for auto-merge.";
`gh pr merge 14 --auto --merge`; `gh pr view 14`: "auto": "MERGE", state BLOCKED. Its reply: GitHub shows the pull request as
BLOCKED because the required check hasn't reported, which fits it only reaching `main` with #13; because the ruleset
requires an up-to-date branch, once #13 merges this pull request will need `gh pr update-branch`.

On GitHub: Pull requests shows #14 and #13 open. #14: "OrMizrahi12 enabled auto-merge", "1 expected", "Type-check, lint and
service tests — Expected — Waiting for status to be reported — Required", "This pull request will merge automatically when
all requirements are met."

## 6. Merge #13 by hand

#13 carries a migration (`drizzle/0000_skeleton.sql`), so a person merges it. Merge pull request → the message "Merge pull
request #13 from OrMizrahi12/worktree-walking-skeleton" → Confirm merge. "Pull request successfully merged and closed", and
"deleted the worktree-walking-skeleton branch" (automatic). Merge commit `8103e4d`. Ticket #2: "closed this as completed in
#13".

## 7. Read the production deploy (the 6.1 session)

Paste `prompts/merged-check-production.txt`:

```text
I merged it. Read the production deploy of the merge commit from GitHub, then open the production address in the browser and tell me where #2 stands.
```

It read the pull request and the issues (`MERGED`, #2 `CLOSED`, #12 `OPEN`), the merge commit's statuses ("Vercel success
Deployment has completed"), followed the status to the deployment and inspected it with the Vercel command line: target
production, status Ready, created at 07:33:01 UTC. To open the browser it loaded Claude Code's Chrome skill, and Claude Code
showed "Claude wants to use your browser" (Install extension / Not now / Don't ask again): we chose **Not now**. "No
browser, so I'll fetch the production address directly, the same way a visitor's browser would": `/` → 200,
`<h1>Potluck</h1>`, "Potluck reached its database, which has no seed data."; `/api/health` → 200 `{"status":"ok"}`, served
from Frankfurt (`fra1`). About a minute of work, plus the time the question waited.

Its answer: the deploy as GitHub reports it (success; the log shows "Migrations applied." and "Deployment completed" about
half a minute after the merge); what production serves; where #2 stands. Done: the migrations, local development, the CI
check, the Vercel project linked with Neon, a database copy per preview, production deployed by the merge. Not done, all in
#12: Playwright, the four separate checks, branch protection on `main`, the pooled-endpoint check, the firewall rule. The
branch-protection line is out of date: the session's context predates the ruleset.

Then paste `prompts/open-in-chrome.txt`:

```text
Open it in Chrome for me with xdg-open; no extension needed.
```

Chrome comes to the front with a new tab on the production address. Ctrl+= three times: "Potluck reached its database,
which has no seed data."

## 8. Fell behind (the landing session)

Paste `prompts/update-and-land.txt`:

```text
#13 is merged. Check your PR: if it fell behind main, update it and watch it land.
```

`gh pr view 14`: BEHIND. "It's behind main, so I'm updating the branch." → `gh pr update-branch 14` → "PR branch
updated". Its first watch loop was refused by the worktree guard, so it used `gh pr checks 14 --watch --interval 30` in the
background. The required check passed in 33 seconds; "GitHub auto-merged it as merge commit a20746d"; it read the merge
commit's production status: "Deployment has completed". About 1 minute 40 seconds from the message to landed and deployed.

On GitHub: Open 0, Closed 2. #14's timeline: enabled auto-merge; "Merge branch 'main' into worktree-landing-rules"
(`107a91b`, Verified); "merged commit a20746d into main", 3 checks passed; the branch deleted.

## 9. Clean up

First tab (the hosting session from lesson 6.2): `/exit` (it prints how to resume the session), then:

```bash
cd ~/potluck
```

Second tab (the landing session): `/exit` → "Exiting worktree session · You have 1 commit on worktree-landing-rules" →
**Remove worktree** → "Worktree removed. 1 commit on worktree-landing-rules was discarded." The commit is in `main`
already. The 6.1 session: `/exit` → Remove worktree, the same way. Then in the main checkout:

```bash
git pull
git worktree list
git log --oneline -4
```

`git pull`: a fast-forward to `a20746d` through both merges. `git worktree list`: only the main checkout,
`~/potluck a20746d [main]`. The log:

```text
a20746d Merge pull request #14 from OrMizrahi12/worktree-landing-rules
107a91b Merge branch 'main' into worktree-landing-rules
8103e4d Merge pull request #13 from OrMizrahi12/worktree-walking-skeleton
e12ee7b Document how a change lands; deny force-push, push to main and reset --hard
```
