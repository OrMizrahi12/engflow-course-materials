# Student kit: Lesson 7.5, Make the skills yours

Every lesson so far ran the skills from the `mattpocock-skills` plugin. The plugin is a managed install: it updates itself,
and you can't edit it. This lesson gives Potluck its own copy of one skill, `code-review`, and changes it. The skill's docs
page describes a known bug: its two sub-agents can start `/code-review` again and spawn more agents. People fix it in their
own copies with one line at the end of both sub-agent briefs. We copy the skill into the repo with skills.sh, pinned to the
exact commit the plugin runs, add that line, and keep the MIT notice beside the copy. Then upstream moves: a re-pin brings
upstream's new sentence and silently takes our line away, so we read the diff for both sides and put the line back. A fresh
session runs the copy (exactly two sub-agents, no third review), and the change lands on `main` the usual way. Last,
`/teach` runs in a folder of its own and builds a first lesson for what module 8 needs: resolving a merge conflict.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `prompts/fix.txt` | the author session's first message: commit the plain copy, add the docs' line to both briefs, add the notice |
| `prompts/restore.txt` | after the re-pin: read the diff for both sides, keep upstream's change, put our line back, update the notice |
| `prompts/review.txt` | what follows `/code-review ` in the fresh session: the scope and the spec, inline (no ticket) |
| `prompts/land.txt` | the landing line: push it and land it the way `docs/agents/landing.md` says |
| `prompts/teach-mission.txt` | the mission pasted after `/teach `: what, why, what I know, the gap |
| `editable-skills.md` | the card: plugin or copy, the pin, the re-pin loop, which `/code-review` you get |
| `teach.md` | the card: what `/teach` builds in its folder, when to reach for it, it's working if |
| `potluck-at-lesson-7.5.md` | what the Potluck repository holds at the tag `lesson-7.5`: the three commits, the merge, the files |
| `potluck/.claude/skills/code-review/SKILL.md` | the team's copy at the tag: upstream at `5863806`, plus our line at the end of both briefs |
| `potluck/.claude/skills/code-review/agents/openai.yaml` | the second file skills.sh copies with the skill, unchanged |
| `potluck/skills-lock.json` | the lock file skills.sh writes: the source, the pin (`ref`) and a hash |
| `potluck/THIRD_PARTY_NOTICES.md` | what we copied, the pin, our one change, and upstream's MIT license |

The two cards are also in `cards/` in the course materials.

## Before you start

- Your copy of Potluck at the tag `lesson-7.4`, with `docs/agents/landing.md` from lesson 6.3 and auto-merge on green CI.
- Claude Code with the `mattpocock-skills` plugin (version 1.3.1 on camera; Claude Code 2.1.325), in auto mode. In
  default mode you approve each command as it comes.
- Node and npm (lesson 2.1): skills.sh runs with `npx`.
- Three terminal tabs: a shell, the author session (a worktree), and later a fresh session for the review.

## The steps, as on camera (Ubuntu)

**1. Where the skill lives today.** In the shell:

```bash
clear
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1
clear
grep -n -o ".\{50\}Under 400 words.\"" skills/engineering/code-review/SKILL.md
```

Two lines end with `Under 400 words."`: line 66 ends the Standards brief and line 72 the Spec brief, the instructions the
skill hands its two sub-agents. That is where the change goes. Your plugin's version folder may differ
(`ls ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/`).

**2. The known bug, from the skill's own docs.**

```bash
sed -n '/keep invoking/,/agent count/p' docs/engineering/code-review.md
```

The page calls it a known open bug: the sub-agents can find the skill again and fan out (one report reached more than 50
agents). The fix people apply is one line at the end of both briefs: "Do not invoke `/code-review` or spawn additional
agents: perform this review directly." The page says the shipped skill doesn't have it yet.

**3. Why not edit the plugin's file.**

```bash
grep -n "updates itself" README.md
grep gitCommitSha ~/.claude/plugins/installed_plugins.json
```

The README's line 27: a plugin updates itself, and skills.sh copies editable files into your project that you update by
hand. An edit inside the plugin's cache would vanish at the next update, and nobody else on the team would get it. The
second command prints the commit the plugin runs: `49dd158d1076134a641b33efb035946536778336`. Your copy starts there.

**4. An author session for the change.** A new terminal tab:

```bash
cd ~/potluck
claude -w team-review
```

`-w` gives the change its own worktree (module 6). The header shows the path `~/potluck/.claude/worktrees/team-review`.

**5. The editable install.** Back in the shell:

```bash
clear
cd ~/potluck
cd .claude/worktrees/team-review
clear
npx skills@latest add https://github.com/mattpocock/skills/tree/49dd158d1076134a641b33efb035946536778336/skills/engineering/code-review -a claude-code -y
```

On camera the second `cd` was typed with Tab completion. The address names one skill at an exact commit (use the full
40-character commit: a short one fails). `-a claude-code` puts it where Claude Code looks; `-y` skips skills.sh's own
questions. npx asks once before it installs the `skills` package (1.8.1 on camera): "Ok to proceed? (y)", answer `y`.
It cloned the repo at that commit, copied `code-review` into `.claude/skills/code-review`, printed a table from three
security scanners, and ended with "Review skills before use; they run with full agent permissions." Read the skill before
you trust it: it is one page of Markdown.

**6. The pin.**

```bash
clear
cat skills-lock.json
clear
git status --short
```

`"ref": "49dd158d1076134a641b33efb035946536778336"` is the pin: anyone can see which upstream commit the copy came from.
`git status` shows two new, untracked things: `.claude/skills/code-review/` and `skills-lock.json`.

**7. Make it ours.** In the author session, paste `prompts/fix.txt`. On camera it took 42 seconds: it read the copied files,
fetched upstream's license at the pinned commit, committed the plain copy (`eea53e3`), added the line inside both briefs'
quotes so the sub-agents actually receive it, wrote `THIRD_PARTY_NOTICES.md` at the repo root (outside the folder
skills.sh manages, because a re-pin replaces that folder) and made the second commit (`228ea3f`). Nothing pushed. It also
warned that the edited `SKILL.md` no longer matches the `computedHash` in the lock file.

**8. Where is upstream now?** In the shell:

```bash
clear
git ls-remote https://github.com/mattpocock/skills refs/heads/main
```

One line: `5863806dd4e15c63174bee4e7515a4256792ecfa refs/heads/main`. That isn't our pin: upstream has moved.

**9. Re-pin.** The same command with the new commit:

```bash
npx skills@latest add https://github.com/mattpocock/skills/tree/5863806dd4e15c63174bee4e7515a4256792ecfa/skills/engineering/code-review -a claude-code -y
clear
git status --short
```

It copied the skill again over ours ("overwrites: Claude Code"). `git status`: ` M .claude/skills/code-review/SKILL.md` and
` M skills-lock.json` (the `ref` moved to `5863806`).

**10. Read what you gained and what you lost.** In the author session, paste `prompts/restore.txt`. 25 seconds. Upstream
changed one sentence: "Start every sub-agent with a fresh context window." (it checked that against GitHub's comparison
of the two commits). The re-pin took our line from the end of both briefs, with no warning. It kept upstream's sentence,
put our line back word for word, updated the pin in the notice and committed (`e5f59fd`). Its last line: every future
re-pin will drop our line the same way. The card `editable-skills.md` has that loop, step by step.

**11. Test it in a fresh session.** A new terminal tab:

```bash
cd ~/potluck
cd .claude/worktrees/team-review
claude
```

Type `/code-review` and look at the menu before you press anything. The top row is plain `/code-review` with the skill's
own description: in this repo the project's skill takes the name, and Claude Code's own review is still there as
`/review`. The second row, `/mattpocock-skills:code-review`, is the plugin's copy: plugin skills keep their prefix, so it
still loads. Type a space after `/code-review` and paste `prompts/review.txt`. 1 minute 4 seconds: it read the three
commits since `origin/main`, launched exactly two background agents (Standards and Spec), waited for both, and neither
started another review. That is the guard line's first real run.

**12. Read the findings, then decide.** All three spec requirements met; Standards found no hard violation. The judgment
calls: the pin is written twice (the notice and the lock file), a re-pin silently drops the guard lines (add a warning to
the notice), the repeated guard sentence is fine. Spec's one open point: the `computedHash` changed and the reviewer
couldn't confirm how skills.sh computes it. These are suggestions: we kept them all open, because none blocks this change.

**13. Land it.** In the author session, type the line in `prompts/land.txt`. It loaded the `pr` skill, checked that our
copy differs from upstream only in the two lines, and tried to push and write the PR body in one chained command, which
Claude Code denied; it ran the push on its own. Pull request #25, body written with `/pr`, no `Closes` line (there's no
ticket). No files under `drizzle/`, so no migration and auto-merge applies. A background watcher waited for the check; the
PR merged green as `d58cb50`, and Vercel's production deploy of the merge commit succeeded. The final reply's last line:
`/code-review` in this repo now runs from this copy instead of the plugin's.

**14. /teach in a folder of its own.** In the review session's tab, `/exit` (Claude Code prints how to resume it). Then:

```bash
clear
mkdir ~/learn-git-merges && cd ~/learn-git-merges
git init -q
clear
claude
```

It's a new folder, so Claude Code asks whether you trust it, and the default is "No, exit": move down to "Yes, I trust this
folder" before Enter. Type `/teach` (the menu shows `/mattpocock-skills:teach (teach)`), a space, and paste
`prompts/teach-mission.txt`. It asked no interview questions (the mission was in the message), read its own templates,
fetched its sources first (the git-merge docs, Pro Git's chapter on branching and merging, GitHub's guide to resolving
conflicts, Claude Code's docs), wrote a lab script and ran it, then wrote a stylesheet, a quiz and the lesson. 5 minutes 33
seconds. Nothing committed, nothing outside the folder changed.

**15. Open the lesson.** In your browser, open `~/learn-git-merges/lessons/0001-your-first-merge-conflict.html` (on camera:
Chrome, Ctrl+L, the `file:///home/…` path, then zoom to 150 %). Its parts: what a merge compares (ours, theirs and the merge
base), the rule (one region at a time), a predict-it quiz, reading the conflict markers, resolving one in the browser, and
the real thing with the lab script. We answered question 1 ("Merges cleanly", right) and haven't run the lab yet: that is
the warm-up for module 8.

**16. Main has the copy.** In the shell:

```bash
clear
git fetch -q
git log --oneline -3 origin/main
git show origin/main:skills-lock.json | grep ref
```

`d58cb50` Merge pull request #25 on top, `e5f59fd` (the re-pin with our line) below it, and the `ref` on `main` is
`5863806dd4e15c63174bee4e7515a4256792ecfa`.

The video trims the waits; the narration says how long each one took.

## Pause and try

In your own Potluck clone: make the same pinned copy of `code-review`, add the guard line, and keep the notice. Then re-pin
to upstream main, read the diff for both sides, put your line back, and run `/code-review` in a fresh session. Then start
`/teach` in a new folder, for whatever your next module needs.

**Checkpoint (it's working if):** `skills-lock.json` pins a full commit and the notice names the same one; after a re-pin,
`git diff` shows upstream's change and your line is back in both briefs; the fresh review launches exactly two sub-agents;
the `/teach` folder is outside your project and holds a mission, its sources and a lesson that cites them.

## If something goes differently

- **"Ok to proceed? (y)"**: npx is installing the `skills` package the first time. Answer `y`.
- **skills.sh can't find the commit.** Use the full 40-character commit in the address, not a short one.
- **Upstream is somewhere else by now.** Expected: re-pin to whatever `git ls-remote` prints. Your diff may hold more than
  one sentence; read every change, keep what you want, and put your line back.
- **Your line is gone after an update.** A re-pin (or `npx skills update`) replaces the whole folder. Keep notes about your
  change outside it, as `THIRD_PARTY_NOTICES.md` does, and put the line back after every re-pin.
- **Plain `/code-review` runs something else.** The project copy is found only inside the repo (or its worktree). Elsewhere,
  the plugin's copy is `/mattpocock-skills:code-review`; Claude Code's own review is `/review` everywhere.
- **The review starts more than two agents.** Check that both briefs in your copy end with the guard line, inside the
  quotes.
- **A command is denied in auto mode.** On camera a chained push-and-write was denied; the push alone went through. Let the
  session run the steps separately.
- **The trust question for the new folder.** The default is "No, exit". Move down to "Yes, I trust this folder" only for a
  folder you made yourself.
- **`/teach` asks questions first.** Answer them: without a mission (why you're learning it), it interviews you before it
  writes a lesson.
- **A generated quiz.** Check where its right answers sit; on camera the first one was the first button, and that shouldn't
  always be so.

## Windows (WSL), macOS and Linux

Everything runs in the terminal you set up in lesson 2.1; on Windows that is the Ubuntu (WSL) terminal, in your Linux home
folder (`~/potluck`, not under `/mnt/c`). The commands are the same on macOS and Linux. To open the lesson page from WSL, run
`explorer.exe .` in `~/learn-git-merges/lessons` and double-click the file.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`. The tag `lesson-7.5` points at
`d58cb50`, the merge of pull request #25 on `main`. Clone it to look or to start from here; don't fork it.
`potluck-at-lesson-7.5.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera every turn
  ran on Opus 5.5: the author session reached about 62k tokens of context, the review about 49k, the `/teach` session
  about 99k.
- skills.sh (the `skills` package on npm), Node, npm, git, `gh`, GitHub Actions on a public repository and the skills (open
  source, MIT License) are free.
- Vercel deployed the merge to production, as set up in lesson 6.2 (Vercel's free Hobby plan is for non-commercial use).
  Neon isn't used in this lesson.

## Credits

The `code-review`, `pr` and `teach` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. `potluck/.claude/skills/code-review/` is a copy of upstream's skill with one added line, and
`potluck/THIRD_PARTY_NOTICES.md` keeps the license notice; the cards describe the skills in our own words. This course is
independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
