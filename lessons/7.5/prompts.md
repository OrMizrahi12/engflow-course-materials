# Lesson 7.5: every line, in order

Everything typed or pasted in the lesson, in the order it happened, with what came back. Three terminal tabs: a shell, the
author session (`claude -w team-review`), and a fresh session in the same worktree that first runs the review and is then
closed; that tab then starts the `/teach` session in its own folder.

## 1. Where the skill lives today (shell)

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1
clear
grep -n -o ".\{50\}Under 400 words.\"" skills/engineering/code-review/SKILL.md
```

```text
66:des the baseline. Skip anything tooling enforces. Under 400 words."
72:ooks wrong. Quote the spec line for each finding. Under 400 words."
```

Line 66 ends the Standards brief, line 72 the Spec brief.

## 2. The skill's docs page (shell)

```bash
sed -n '/keep invoking/,/agent count/p' docs/engineering/code-review.md
```

One paragraph: the heading names the problem (the sub-agents keep invoking `/code-review` again and spawn more agents); it
is a known open bug; one report reached more than 50 agents; the fix people apply is one line appended to both sub-agent
briefs, "Do not invoke `/code-review` or spawn additional agents: perform this review directly."; and it is not in the
shipped skill yet.

## 3. Why not edit it here (shell)

```bash
grep -n "updates itself" README.md
grep gitCommitSha ~/.claude/plugins/installed_plugins.json
```

```text
27:A plugin updates itself. [skills.sh](https://skills.sh/mattpocock/skills) copies editable files into your project, and you update them by hand. ...
"gitCommitSha": "49dd158d1076134a641b33efb035946536778336"
```

## 4. The author session (new tab)

```bash
cd ~/potluck
claude -w team-review
```

The header: Claude Code v2.1.325, Opus 5.5, `~/potluck/.claude/worktrees/team-review`.

## 5. The editable install (shell)

```bash
clear
cd ~/potluck
cd .claude/worktrees/team-review
clear
npx skills@latest add https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review -a claude-code -y
```

```text
Need to install the following packages:
skills@1.8.1
Ok to proceed? (y) y
...
Source: https://github.com/mattpocock/skills.git @ 49dd158d1076134a641b33efb035946536778336 (skills/engineering/code-review)
Repository cloned
Found 1 skill
...
Security Risk Assessments
            Gen    Socket     Snyk
code-review Safe   0 alerts   Med Risk
...
Installation complete
Installed 1 skill
code-review (copied)
→ ~/potluck/.claude/worktrees/team-review/.claude/skills/code-review
Done! Review skills before use; they run with full agent permissions.
```

## 6. The pin (shell)

```bash
clear
cat skills-lock.json
clear
git status --short
```

```text
{
  "version": 2,
  "skills": {
    "code-review": {
      "source": "mattpocock/skills",
      "ref": "49dd158d1076134a641b33efb035946536778336",
      "sourceType": "github",
      "skillPath": "skills/engineering/code-review/SKILL.md",
      ...
?? .claude/skills/code-review/
?? skills-lock.json
```

## 7. Make it ours (author session)

Paste `prompts/fix.txt`:

```text
I just copied the plugin's code-review into this repo with skills.sh, pinned to the commit our plugin runs. Commit that copy as skills.sh wrote it. Then make it ours: add the docs' one-line fix to the end of both sub-agent briefs, word for word: "Do not invoke `/code-review` or spawn additional agents: perform this review directly." skills.sh didn't bring the MIT license, so add upstream's notice outside the folder skills.sh manages, saying what we copied, the pin and our one change. Commit that too. Don't push.
```

"Brewed for 42s". Two commits on `worktree-team-review`, nothing pushed: `eea53e3` Copy the code-review skill from
mattpocock/skills (the copy exactly as skills.sh wrote it: `SKILL.md`, `agents/openai.yaml` and `skills-lock.json`, pinned at
`49dd158`), and `228ea3f` Keep code-review's sub-agents from reviewing recursively (the line inside each brief's quotes, after
"Under 400 words.", so the sub-agents actually receive it; `THIRD_PARTY_NOTICES.md` at the repo root with the copied path,
the upstream source, the pin, our one change and upstream's MIT license, fetched at the pinned commit). Its warning: the
edited `SKILL.md` no longer matches the `computedHash` in `skills-lock.json`, so a skills.sh update may flag the difference
or overwrite our line.

## 8. Where is upstream now? (shell)

```bash
clear
git ls-remote https://github.com/mattpocock/skills refs/heads/main
```

```text
5863806dd4e15c63174bee4e7515a4256792ecfa	refs/heads/main
```

## 9. Re-pin (shell)

```bash
npx skills@latest add https://github.com/mattpocock/skills/tree/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/code-review -a claude-code -y
clear
git status --short
```

```text
...
copy → Claude Code
overwrites: Claude Code
...
code-review (copied)
Done! Review skills before use; they run with full agent permissions.

 M .claude/skills/code-review/SKILL.md
 M skills-lock.json
```

## 10. What we gained, what we lost (author session)

Paste `prompts/restore.txt`:

```text
I re-pinned code-review to upstream main with skills.sh. Read the diff: what did upstream change, and what did the re-pin take from us? Keep upstream's change, put our line back, update the notice, and commit.
```

"Sautéed for 25s". It read `git diff`, then checked it against GitHub's comparison of the two commits. The reply: committed
as `e5f59fd` (Re-pin code-review to upstream 5863806), not pushed. What upstream changed: one sentence, "Start every
sub-agent with a fresh context window." What the re-pin took from us: our line, from the end of both briefs; skills.sh
replaced the whole file, so the edit was lost and nothing warned about it. The commit holds upstream's sentence with our line
back word for word, the new pin and hash in `skills-lock.json`, and the new pin in `THIRD_PARTY_NOTICES.md`. Last line: every
future re-pin will drop our line the same way, so it will need putting back each time.

## 11. The review, in a fresh session (new tab)

```bash
cd ~/potluck
cd .claude/worktrees/team-review
claude
```

Type `/code-review` and read the menu: the top row is `/code-review` with the skill's own description ("Review the changes
since a fixed point …"), the second `/mattpocock-skills:code-review (mattpocock-skills)`. A space, then paste
`prompts/review.txt`:

```text
/code-review origin/main. Spec: both sub-agent briefs end with the docs' guard line, upstream's fresh-context line is kept, and skills-lock.json pins upstream main.
```

"Churned for 1m 4s". It read the three commits since `origin/main` (4 files changed), launched 2 background agents
("Standards review of branch", "Spec review of branch"; 23 seconds each) and waited for both. The report: all three spec
requirements met, nothing breaks a documented standard, the findings are judgment calls.

- Standards: hard violations, none. `228ea3f` does two things (a strict reading of "one behaviour per commit" would split
  them). The pinned SHA is written in both the notice and `skills-lock.json`, so every re-pin needs two edits. A skills.sh
  re-pin silently drops the guard lines: one line in the notice would warn the next person. The repeated guard sentence:
  leave it, each brief stays self-contained.
- Spec: (a) missing or partial, none; (b) changes nobody asked for, none of substance; (c) one open point: the
  `computedHash` changed in `e5f59fd`, and the reviewer couldn't confirm how skills.sh computes it.

We kept all of them open: none blocks this change.

## 12. Land it (author session)

Type the line in `prompts/land.txt`:

```text
Push it and land it the way landing.md says.
```

It loaded the `pr` skill and checked that our copy differs from upstream only in the two brief lines. Claude Code denied its
first command (the push chained with writing the PR body to a file), so it ran `git push` on its own. Pull request #25,
"Vendor the code-review skill with a no-recursion brief", body written with `/pr`. No files under `drizzle/`, so no
migration and auto-merge applies. A background watcher waited for the required check; "PR #25 merged with every check
green". The production deploy was still pending, so it waited, then read it directly. The final reply: landed and in
production, merge commit `d58cb50`, Vercel's production deploy of that commit succeeded; no `Closes #N` because the change
has no ticket; Type-check, lint and service tests passed; the PR merged three commits, and `/code-review` in this repo now
runs from this copy instead of the plugin's.

## 13. Close the review session, make a folder (the review tab)

```text
/exit
```

Claude Code prints how to resume that session. Then:

```bash
clear
mkdir ~/learn-git-merges && cd ~/learn-git-merges
git init -q
clear
claude
```

The trust question for a new folder ("No, exit" is the default): Down, then Enter on "Yes, I trust this folder".

## 14. /teach (the new session)

Type `/teach` (the menu: `/mattpocock-skills:teach (teach)`), a space, then paste `prompts/teach-mission.txt`:

```text
How git merges branches, and how to resolve a merge conflict. Why: next week I run three Claude Code sessions on three tickets at once, and two of them will change the same file. I know commits, branches and pull requests, and I read diffs, but I've never resolved a conflict myself. Don't open files for me; I'll open the lesson.
```

"Cogitated for 5m 33s". No interview. It read its own templates, fetched the git-merge docs, Pro Git's "Basic Branching and
Merging", GitHub's guide to resolving a conflict on the command line and Claude Code's common-workflows page, checked two
git behaviours the lesson relies on, wrote and ran `assets/labs/lab-01-first-conflict.sh` ("Lab works: the shipping change
merges cleanly, the total line conflicts."), wrote `assets/course.css`, `assets/quiz.js` and `assets/conflict-resolver.js`,
then the lesson, a reference sheet, `MISSION.md`, `RESOURCES.md`, `NOTES.md` and a first learning record. The reply: "Your
first lesson is ready. Open it yourself: lessons/0001-your-first-merge-conflict.html", about 20 minutes, five parts (what a
merge compares, predict it, read the markers, resolve it in the browser, do it for real); checks it ran (the lab end to end,
the in-browser checker against six versions of the file, the neighbouring-lines conflict in Git 2.43, both pages rendered);
nothing committed, nothing changed outside the folder.

## 15. The lesson (Chrome)

Ctrl+L in the existing tab, paste the lesson's path, Enter, then Ctrl+Plus three times (150 %):

```text
file:///home/<you>/learn-git-merges/lessons/0001-your-first-merge-conflict.html
```

Replace `<you>` with your user name (on macOS the path starts `file:///Users/<you>/`). Question 1: "Session A edits line 3 of checkout.js. Session B
edits line 40 of it. You merge both." We picked "Merges cleanly; no markers": right, "1 of 5 right on the first try".

## 16. Main (shell)

```bash
clear
git fetch -q
git log --oneline -3 origin/main
git show origin/main:skills-lock.json | grep ref
```

```text
d58cb50 (origin/main, origin/HEAD) Merge pull request #25 from OrMizrahi12/worktree-team-review
e5f59fd (HEAD -> worktree-team-review, origin/worktree-team-review) Re-pin code-review to upstream 5863806
228ea3f Keep code-review's sub-agents from reviewing recursively
      "ref": "5863806dd4e15c63174bee4e7515a4256792ecfa",
```
