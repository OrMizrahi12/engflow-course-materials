# Student kit: Lesson 2.2, Claude Code for engineers

In this lesson you take the Claude Code you already prompt with and use its controls on purpose: you start it in a folder
you trust, switch permission modes, set the model and effort for the job, make Claude plan before it touches code, undo a
change with rewind, check what a session cost, and give every new session a short `CLAUDE.md` of pointers. The practice
runs in a copy of your v0 from lesson 1.2, never in the original.

## Files in this kit

| File | What it is |
|---|---|
| `shortcuts.md` | every key and slash command used in the lesson, with what it does and what you see |
| `claude-md-pointers.md` | the pasted request, the five pointer lines Claude wrote on camera, and how to keep the file short |
| `claude-code-controls.md` | a one-page card: the four permission modes, the plan flow, what rewind does and doesn't undo, CLAUDE.md as a map |

## The steps, as typed on camera (Ubuntu)

```bash
cd ~
cp -r potluck-v0 v0-practice     # never experiment on the only copy
cd v0-practice
ls                               # app.js  index.html  logic.js  styles.css
claude
```

**1. The trust question.** A folder Claude Code has never seen gets a "Quick safety check: Is this a project you created
or one you trust?" with **No, exit** preselected. You made the copy a minute ago: press Down, then Enter on
**Yes, I trust this folder**. Claude Code remembers the answer for that folder. (On camera a one-time "Try the new
fullscreen renderer?" offer came next; we chose **Not now**.)

**2. The four permission modes.** Press **Shift+Tab** and watch the footer: `manual mode on` → `accept edits on` →
`plan mode on` → `auto mode on` (where a session starts). In manual mode, the request below stops at a permission prompt:

```text
Change the page title to Potluck practice.
```

Expected: an "Edit file index.html" diff and "Do you want to make this edit to index.html? 1. Yes / 2. Yes, and switch
to accept edits … (shift+tab) / 3. No". On camera we chose 1.

**3. Model and effort.** `/model` opens the picker (Enter = new default for future sessions, `s` = this session only,
Esc = keep). `/effort` opens the slider; Right once moves medium → high, and the slider showed "~1.5x the estimated cost
of medium (the default)". Press `s` for this session only: "Set effort level to high (this session only)".

**4. Plan mode.** Shift+Tab twice (accept edits, then plan mode), then type:

```text
In a euro group, 12,50 is saved as 1,250 euros. Plan a fix.
```

Claude reads `logic.js` and `app.js`, reproduces the bug with a small `node` command, and shows a plan with three
choices: **Yes, and use auto mode** / **Yes, manually approve edits** / **Tell Claude what to change**. When the plan box
shows only its end, press **Ctrl+O** to read the whole plan in the detailed transcript (Ctrl+O again to go back). On
camera we chose 1. Read the summary's caveats: with the new rule, `12.505` is read as twelve thousand five hundred and
five, and expenses saved before the fix stay wrong.

**5. Try a change, then rewind it.**

```text
Add the tagline 'Split costs, stay friends' to the top bar.
```

Open the page in your browser (see below) to see it. Then press **Esc Esc** on an empty prompt, or type `/rewind`,
pick the tagline prompt, and choose **Restore code and conversation**. Your prompt comes back in the input; clear it
with **Ctrl+U**. Reload the page: the tagline is gone.

**6. What rewind won't undo.** Rewind restores files Claude changed with its own file tools, and later Bash changes to
those same files. A file that only a Bash command changed is not tracked. On camera Claude wrote the tagline with one
Bash command, so `index.html` came back (Claude had edited it earlier with its file tool) while the `.tagline` rules
stayed in `styles.css`. We removed them with:

```text
Rewind kept the .tagline CSS in styles.css. Remove it.
```

If your rewind list shows two files for the tagline prompt, Claude used its file tools and both came back: nothing to
clean up. Either way, rewind is an undo for Claude's edits; git (from module 3) is your real history.

**7. What it cost.** `/usage` shows the session block (cost at list price, API and wall time, lines changed), the plan
bars, and recommendations. On a Pro, Max or Ultra plan the session cost is not a bill. Esc closes it.

**8. A map for every session.** Paste the request from `claude-md-pointers.md`, then:

```text
/exit
```

```bash
clear
cat CLAUDE.md
claude
```

```text
Where is the money maths, and how do I check a change?
```

Expected: an answer "According to the project's CLAUDE.md…", without opening `logic.js`. `/memory` lists where the
instructions live (project `./CLAUDE.md`, user `~/.claude/CLAUDE.md`, auto memory). Esc closes it.

## Opening the page

- **Linux:** paste `file:///home/<you>/v0-practice/index.html` into the address bar (your user name for `<you>`), or run
  `xdg-open index.html` in the folder.
- **macOS:** run `open index.html` in the folder.
- **Windows (WSL):** run `explorer.exe index.html` in the folder (inside the Ubuntu terminal); it opens in your Windows
  browser.

Pages opened from files share one saved storage, so the practice copy shows the groups you made in lesson 1.2. Look,
don't click: that data belongs to v0.

## Pause and try

In your own copy of your v0 from 1.2 (or any small folder of yours): copy it, start Claude Code and read the trust
question. Shift+Tab to plan mode and ask for a plan for one thing you noticed in 1.2; approve it or tell Claude what to
change. Ask for one change you might not keep and undo it with Esc Esc. Then ask for a five-line `CLAUDE.md` of pointers,
start a fresh session and ask where the money maths is.

**Checkpoint:** the fresh session answers without opening a file, and `/rewind` lists your prompts.

## Windows (WSL), macOS and Linux

The commands and keys are the same in every terminal. On macOS use Terminal or iTerm2; on Windows run everything inside
the Ubuntu (WSL) terminal from lesson 2.1, in your Linux home folder (`~`), not under `/mnt/c`. Claude Code does not keep
a trust answer for your home folder itself, so always start it inside a project folder.

## Potluck repository

There is no Potluck repository yet, so this lesson has no tag to clone: the real Potluck starts from an empty repository in
lesson 3.2. Practise in `v0-practice`, keep `potluck-v0` as it is, and don't turn either into a git repository.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. On camera the whole
  first session (title change, plan and fix at high effort, tagline, cleanup) came to $0.66 at list price, which a
  subscription does not bill separately; it does count toward your plan's usage limits.
- High effort costs more than medium (the slider said about 1.5×). Raise it for the job that needs it, for that session.
- The app runs in your browser for free.

## Credits

This course teaches the open-source skills in [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock
(MIT License). The course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock. No skill is
installed in this lesson.
