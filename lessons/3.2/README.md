# Student kit: Lesson 3.2, The repo and /setup-matt-pocock-skills

In this lesson Potluck gets a home. From the same `planning` session as lesson 3.1, Claude turns `~/potluck` into a git
repository with a one-sentence README as the first commit, creates a private GitHub repository from it with `gh`, and
pushes. You name the six words of git and GitHub on the real page (repository, commit, branch, issue, label, pull
request), read the setup skill before running it, then run `/setup-matt-pocock-skills` once: it explores the repo, asks
three questions one at a time, shows its drafts, and only then writes a `CLAUDE.md` block, three files in `docs/agents/`,
and the missing triage labels on GitHub. You commit and push, check every file on GitHub, and only then make the
repository public.

## Files in this kit

| File | What it is |
|---|---|
| `prompts.md` | every line typed or pasted in the lesson, in order, with what came back |
| `potluck-at-lesson-3.2.md` | what the Potluck repository holds at the tag `lesson-3.2`, and how to start from it |
| `potluck/README.md` | the repository's README at `lesson-3.2` (the first commit) |
| `potluck/CLAUDE.md` | the `## Agent skills` block the setup wrote |
| `potluck/docs/agents/issue-tracker.md` | the setup skill's GitHub template, unchanged (MIT, see Credits) |
| `potluck/docs/agents/triage-labels.md` | the setup skill's labels template, unchanged (MIT, see Credits) |
| `potluck/docs/agents/domain.md` | the setup skill's domain-docs template, unchanged (MIT, see Credits) |
| `setup-matt-pocock-skills.md` | the card for the setup skill |
| `git-and-github-words.md` | the card for the six words |

The cards are also in `cards/` in the course materials.

## Before you start

- The `planning` session from lesson 3.1, still open in `~/potluck` (or any folder you grilled in). If you closed it,
  `cd ~/potluck && claude --resume` and pick `planning`.
- `gh` signed in to your GitHub account (lesson 2.1). Check with `gh auth status`.
- The `mattpocock-skills` plugin from lesson 2.4 (version 1.3.1 on camera). `/skills` lists
  `mattpocock-skills:setup-matt-pocock-skills`.
- On camera Claude Code ran in auto mode, so no permission prompts appeared. In default mode you approve each command.

## The steps, as typed on camera (Ubuntu)

**1. The repository, from the planning session.** The request was written before recording and pasted:

```text
The repo comes first, so let's make it. Turn this folder into a git repository with a short README.md (the name and one sentence about Potluck) as the first commit, then create a private GitHub repository called potluck from it with gh and push. Private for now: it goes public once we've checked what's in it.
```

Claude first checked the facts it could look up (`gh auth status`, git's name and email, what's in the folder), then ran
`git init -b main`, wrote the README, made the first commit (`9eea3cd Add README`, "1 file changed"), ran
`gh repo create potluck --private --source=. --remote=origin --push`, and pushed (`* [new branch] HEAD -> main`). It ended
with the command to go public later, "when you've checked what's in it". The footer said "Baked for 30s".

**2. The six words, on GitHub.** Open your repository page (`https://github.com/<your-account>/potluck`; on camera the URL was
pasted). It shows the name, **Private**, the README rendered, the commit row "… and claude Add README" (hover the message:
`Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`), and "1 Commit". Click it: "Commits on Nov 10, 2026", the short
ID `9eea3cd`, branch `main`. Back on the repo page: "1 Branch", and the Issues and Pull requests tabs. Then add `/labels`
to the address: on camera a new repository came with **10** labels (accessibility, bug, documentation, duplicate,
enhancement, good first issue, help wanted, invalid, question, wontfix). Your list may differ; note whether `wontfix` is
there.

**3. Read the skill before you run it.** In a second terminal (the lesson terminal), clear the screen and paste:

```bash
cd ~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills/engineering/setup-matt-pocock-skills
ls
head -15 SKILL.md
grep -n "^### [0-9]" SKILL.md
```

If your plugin version is newer, change `1.3.1` to the folder you have. `ls` shows `SKILL.md` plus templates
(issue trackers for GitHub, GitLab and local files, triage labels, domain docs): the setup is a prompt plus templates it
copies into your repo. The top of `SKILL.md`: "Run once before first use of the other engineering skills",
`disable-model-invocation: true` (Claude can't start it by itself; you type it), and "This is a prompt-driven skill, not a
deterministic script. Explore, present what you found, confirm with the user, then write." The `grep` lists its five
steps: 1. Explore, 2. Present findings and ask, 3. Confirm and edit, 4. Write, 5. Done.

**4. Run the setup.** Back in the planning session, type `/setup-matt-pocock-skills` and press Enter (the menu shows
`/mattpocock-skills:setup-matt-pocock-skills`). It explored first (`git remote -v`, the files, its own templates), then
said where the repo stands: the private GitHub repo is `origin`, only `README.md`, the `triage` skill installed, no
monorepo (so domain docs use the single-context layout, settled without asking). Then **Section A: Issue tracker**: it
recommended GitHub Issues because the remote is GitHub ("Churned for 11s").

**5. Answer, one question at a time.**

```text
GitHub
```

Reply: "I'll set up GitHub Issues." Then **Section B: Triage labels**: keep the defaults (`needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`, `wontfix`)? It recommended yes.

```text
yes
```

It showed the drafts before writing anything: the `## Agent skills` block, the three `docs/agents` files ("Each is the
skill's seed template, unchanged"), and one decision left: neither `CLAUDE.md` nor `AGENTS.md` exists, so which one should
hold the block? `CLAUDE.md` is loaded automatically by Claude Code; `AGENTS.md` is the tool-neutral file other agents read.
We use Claude Code (lesson 2.2), so:

```text
CLAUDE.md, no changes. Write it.
```

It copied the templates, wrote `CLAUDE.md`, and created four labels on GitHub (`needs-triage`, `needs-info`,
`ready-for-agent`, `ready-for-human`); `wontfix` already existed, so it left it ("Worked for 17s"). It listed who reads
what: the issue tracker file is read by `to-tickets`, `to-spec`, `triage`, `wayfinder` and `implement`; the labels by
`triage`; the domain docs by `domain-modeling`, `grill-with-docs` and `improve-codebase-architecture`.

**6. Commit and push, on your word.**

```text
Commit these files and push.
```

`9eea3cd..12deed8 main -> main`: one commit adding four files. "The GitHub repo is still private."

**7. Check on GitHub.** Refresh the labels page: the four new labels sit among the defaults (`ready-for-agent`: "Fully
specified, ready for an AFK agent"; `ready-for-human`: "Requires human implementation"). On the repo page: `docs/agents`,
`CLAUDE.md`, `README.md`, "2 Commits". Open `CLAUDE.md` (13 lines, the Agent skills block with a pointer to each file),
then `docs/agents/issue-tracker.md` (the exact `gh` commands to create, read and list issues and to make sub-issues).

**8. Go public, last.**

```text
I've checked what's in it. Make the repository public.
```

Claude ran `gh repo edit --visibility public --accept-visibility-change-consequences` and confirmed `"visibility":
"PUBLIC"`. Reload the repo page: the badge says **Public**. The planning session stays open for the next lessons.

On camera Claude's own footers timed the replies at 30, 11, 3, 8, 17, 7 and 9 seconds. The video trims these waits.

## Pause and try

In the folder you grilled in, ask Claude for a git repository with a short README and a private GitHub repository from
it. Run `/setup-matt-pocock-skills`, answer GitHub, yes and `CLAUDE.md`, and ask it to commit and push.

**Checkpoint (it's working if):** your Labels page has the five triage labels, `docs/agents/` has three files, and
`CLAUDE.md` has an `## Agent skills` section. Go public only after you've looked at every file.

## Before you make a repository public

Look at every file and every commit message: no keys or tokens, no `.env` files, no e-mail addresses you don't want
shown, nothing copied from somewhere you have no right to publish. Making a repository public can't be quietly undone:
once it is public, anyone may already have a copy.

## If something goes differently

- **`gh` is not signed in.** Run `gh auth login` yourself in a terminal and sign in in the browser, then ask again.
- **No Section B.** The labels question appears only when the `triage` skill is installed (it is part of the same plugin).
- **Your repo already has a `CLAUDE.md` or `AGENTS.md`.** The setup adds its block to the file that exists and doesn't ask
  the last question.
- **Different default labels.** GitHub changes its defaults over time; the setup creates only the ones that are missing.
- **You want GitLab or local markdown files.** Answer that in Section A; the setup uses the matching template.
- **You change your mind later.** Edit `docs/agents/*.md` by hand. Re-running the setup is only for switching trackers or
  starting over.

## Windows (WSL), macOS and Linux

The commands are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from lesson 2.1,
in your Linux home folder (`~`). On macOS the paths under `~/.claude` are the same. In the browser, Ctrl+L (Cmd+L on macOS)
jumps to the address bar, and F5 (Cmd+R) reloads the page.

## Potluck repository

The Potluck repository from the lesson is public: `https://github.com/OrMizrahi12/potluck`, tag `lesson-3.2` (commit
`12deed8`). Clone it to look or to start from here; don't fork it. `potluck-at-lesson-3.2.md` has the details.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera this
  lesson was seven requests to Opus 5.5 in the same session; the context went from 46.5k to 59.2k tokens (6% of the
  window).
- A GitHub account, public and private repositories, `gh` and git are free.
- The skills are free and open source (MIT License).

## Credits

The `setup-matt-pocock-skills` skill and its templates are from [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock, under the MIT License. The three files in `potluck/docs/agents/` are its 1.3.1 templates, unchanged, as
the setup copied them; the rest is described in our own words, with short quotes of the installed 1.3.1 files. This
course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

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
