# Student kit: Lesson 2.4, Skills, explained

In this lesson you learn what a skill is and install a whole set of them. A skill is a folder with one `SKILL.md`: a
short header (a name and a one-line description) and, below it, the instructions. Claude keeps only the short
descriptions in its context; a skill's full instructions load when it runs. You check that Anthropic's official
marketplace is registered, install Matt Pocock's open-source skills from it (`mattpocock-skills`, version 1.3.1 on
camera, 27 skills), find the version and how it updates, read three skill files, tell the skills you type from the ones
Claude can call, and ask `/ask-matt` what to type first. The practice runs in `v0-practice`, the copy of your v0 from
lesson 2.2; the plugin is installed for your user, so the folder only decides where the session starts.

## Files in this kit

| File | What it is |
|---|---|
| `skills-table.md` | the 27 skills: which ones you type and which ones Claude can call, one line each, and where the course teaches them |
| `settings-after-install.json` | the user settings file `~/.claude/settings.json` as it looked after the lesson |

The lesson's card is `cards/skills.md` in the course materials.

## The steps, as typed on camera (Ubuntu)

Start at the shell in the practice folder. If a Claude Code session is still open, end it with `/exit`.

**1. The marketplaces this machine knows.**

```bash
claude --version
claude plugin marketplace list
```

On camera: `2.1.322 (Claude Code)`, then two marketplaces:

```text
Configured marketplaces:

  ❯ anthropic-plugin-directory
    Source: Built in (Anthropic Directory)

  ❯ claude-plugins-official
    Source: GitHub (anthropics/claude-plugins-official)
```

The first one is built in. The second, the official catalog, is added by Claude Code itself the first time you start an
interactive session. On a machine where no interactive session has run yet (for example one set up by a script), it is
missing, and this line adds it:

```bash
claude plugin marketplace add anthropics/claude-plugins-official
```

On camera the catalog was already there, so it printed:

```text
✔ Marketplace 'claude-plugins-official' already on disk — declared in user settings
```

On a machine without it you see `✔ Successfully added marketplace: claude-plugins-official` instead. Either way, the
catalog is now written into `~/.claude/settings.json` as `extraKnownMarketplaces`.

**2. Install the plugin.**

```bash
claude
```

Inside the session, paste:

```text
/plugin install mattpocock-skills@claude-plugins-official
```

The name before `@` is the plugin, the name after it is the catalog. A details screen opens instead of installing right
away: last updated, author, the 27 skills it will install, the estimated context cost (on camera: every turn ~1.6k
tokens, when invoked ~40.9k tokens), a warning to install only plugins you trust, and three scopes:

- **Install for you (user scope):** every project on this machine. This is the one used in the course.
- **Install for all collaborators on this repository (project scope):** shared with everyone on the repository.
- **Install for you, in this repo only (local scope):** only you, only this repository.

Press Enter on user scope. Expected after a few seconds:

```text
✓ Installed mattpocock-skills. Plugin is now active.
```

**3. Version and updates.**

```text
/plugin
```

Tab moves between Discover, Installed and Marketplaces. Under **Installed**, select `mattpocock-skills` to see
`Scope: user`, `Version: 1.3.1` (yours may be newer), `Author: Matt Pocock`, `Status: Enabled`, and actions such as
Update now and Uninstall. Under **Marketplaces**, select `claude-plugins-official` (317 plugins on camera, 1 installed):
it reads "Auto-update enabled. Claude Code will automatically update this marketplace and its installed plugins." The
official catalog pins each plugin to one exact commit of its author's repository, so an update follows the catalog, not
the author's latest commit. Press Esc to leave the panel.

**4. What the install wrote.** End the session, clear the screen and print your user settings:

```text
/exit
```

```bash
clear
cat ~/.claude/settings.json
```

Compare with `settings-after-install.json`: two new entries, `extraKnownMarketplaces` (the catalog) and
`enabledPlugins` with `"mattpocock-skills@claude-plugins-official": true` (the install). Your file may hold other
settings too, such as the status line from lesson 2.3.

**5. Inside three skills.** The installed files live in Claude Code's plugin cache. The path is long, so it goes into a
variable first (paste it as one line; use your version number if it differs):

```bash
clear
S=~/.claude/plugins/cache/claude-plugins-official/mattpocock-skills/1.3.1/skills
head -5 $S/*/ask-matt/SKILL.md
cat $S/*/grill-me/SKILL.md
head -4 $S/*/tdd/SKILL.md
```

Expected:

```text
---
name: ask-matt
description: Ask which skill or flow fits your situation. A router over the skills in this repo.
disable-model-invocation: true
---
```

```text
---
name: grill-me
description: A relentless interview to sharpen a plan or design.
disable-model-invocation: true
---

Call the Skill tool with "grilling".
```

```text
---
name: tdd
description: Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---
```

`disable-model-invocation: true` means you type the skill yourself; Claude never starts it, and its description isn't
in Claude's context. `tdd` has no flag, so Claude can load it when the work matches its description, which is why that
description is written as a precise trigger. `grill-me`'s whole body hands the work to `grilling`, a skill Claude can
call: one interview, two ways in.

**6. Find them by name.**

```bash
clear
claude
```

```text
/skills
```

On camera: `27 skills`. Every name starts with `mattpocock-skills:`, the plugin's namespace. A row with `user-only`
(for example `mattpocock-skills:ask-matt  locked by author · user-only · plugin · ~40 tok`) is a skill you type; a row
without it (`mattpocock-skills:code-review  locked by plugin · plugin · ~150 tok`) is one Claude can call. 16 rows say
`user-only`, 11 don't. Press Esc ("No changes").

Then type, without pressing Enter:

```text
/code-review
```

The menu offers Claude Code's own `/code-review` ("Review the current diff or a PR for bugs and cleanups"), then
`/mattpocock-skills:code-review` (reviews the changes since a fixed point along two axes, standards and spec), then
`/simplify`. Same short name, two different tools: use the full name when you mean the plugin's. Press Esc, then
Ctrl+U to clear the line.

**7. Ask ask-matt.** Paste:

```text
/ask-matt New app idea, not started yet. What first? 3 lines.
```

Claude Code turns the short name into `/mattpocock-skills:ask-matt`. On camera it ran one Bash command (a `find` over its
own skill files, "Allowed by auto mode") and answered in 8 seconds with three steps: make a new directory for the app
and run `/setup-matt-pocock-skills` there once; run `/grill-with-docs` to sharpen the idea; then `/implement` for a
one-session build, or `/to-spec` and `/to-tickets` first for anything bigger (`/wayfinder` if the idea is too big and
unclear for one session). Your wording will differ. The course takes this route with one step in front: lesson 3.1 starts
with `/grill-me` before any folder exists, 3.2 creates the repository and runs the setup, and 3.3 is `/grill-with-docs`.

## Pause and try

On your own machine: run `claude plugin marketplace list`; if `claude-plugins-official` is missing, add it with the
command in step 1. In Claude Code, run `/plugin install mattpocock-skills@claude-plugins-official` and pick user scope.
Open `/skills` and count the `user-only` rows. Ask `/ask-matt` where to start. Your version may be newer than 1.3.1 if
the catalog has moved its pin; the steps stay the same.

**Checkpoint:** `/skills` lists the plugin's skills, and `/ask-matt` has answered you.

## Windows (WSL), macOS and Linux

The `claude plugin` commands, `/plugin`, `/skills` and the keys are the same in every terminal. On Windows run everything
inside the Ubuntu (WSL) terminal from lesson 2.1, in your Linux home folder (`~`), so the plugin cache path in step 5 is
the same. On macOS the commands in steps 4 and 5 work as they are in Terminal (`~/.claude/...`).

## Potluck repository

There is no Potluck repository yet, so this lesson has no tag to clone: the real Potluck starts from an empty repository in
lesson 3.2, which is also where `/setup-matt-pocock-skills` runs. Nothing in this lesson changes a file in `v0-practice`.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. Installing and
  listing plugins makes no model call; the `/ask-matt` question is one short turn.
- The skills are free and open source (MIT License).
- Every turn carries the skills' short descriptions (about 1.6k tokens on camera); a skill's full instructions are added
  only when it runs.

## Credits

The skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT License. The
skill headers quoted in step 5 are copied from that repository (version 1.3.1 as installed); its license notice is below.
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
