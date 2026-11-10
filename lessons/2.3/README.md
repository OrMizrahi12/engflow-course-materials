# Student kit: Lesson 2.3, The smart zone

In this lesson you look inside Claude's context window and learn to keep a session small. You read `/context` before
you type anything, put the context size on screen all the time with a status line, ask the same kind of question from
`CLAUDE.md` and from the code (a secondary and a primary source), and get a review from a fresh session that never saw
the code being written. The practice runs in `v0-practice`, the copy of your v0 from lesson 2.2.

## Files in this kit

| File | What it is |
|---|---|
| `statusline-command.sh` | the status line script exactly as Claude wrote it on camera (model, tokens in k, percent, a 10-block bar full at 150k) |
| `settings-example.json` | the user settings file as it looked after the lesson (`theme` + `statusLine`) |
| `smart-zone.md` | a one-page card: the window and the smart zone, `/context`, the status line, `/clear`, primary and secondary sources, a fresh reviewer |

## The steps, as typed on camera (Ubuntu)

Start in the practice folder from lesson 2.2. If a Claude Code session from the last task is still open, end it first:

```text
/exit
```

```bash
claude
```

**1. What fills the context.** Before you ask anything:

```text
/context
```

It prints more than one screen, so scroll back up to the top. On camera a fresh session showed `29.2k/1m tokens (3%)`:
System prompt 3.1k, System tools 23k, Memory files 193 tokens (the five-line `CLAUDE.md`), Skills 2.9k, Messages 10
tokens, Free space 937.8k, Autocompact buffer 33k, and "Auto-compact window: 1m tokens". The grid on the left has 200
squares, so each square stands for 5,000 tokens. Your numbers will differ (your `CLAUDE.md`, your tools, your skills),
and if you sign in with a claude.ai account your list may be longer. The shape is the same: a fresh session starts with a
fixed floor of tokens before you type.

**2. A status line.** Paste this one line (it's a plain description; Claude writes the script for you):

```text
/statusline show the model, context used (tokens in k, and percent), and a 10-block bar that fills at 150k. Use a script file.
```

Expected: a background agent named `statusline-setup` does the work ("Waiting for 1 background agent to finish", then
"Agent "Configure status line" finished"; 15 seconds on camera), and a row appears under the prompt:

```text
Opus 5.5 | 38.7k (4%) ██░░░░░░░░
```

The percent is measured against the model's whole 1M-token window, so it stays low. The bar fills at 150k, the smart
zone, so the same 38.7k lights two of ten blocks. The status line runs on your machine and costs no tokens. The script
needs `jq` (see the system notes below).

**3. A secondary source, then the primary one.** Type:

```text
Answer from CLAUDE.md only: how is money stored?
```

Expected: an answer in about a second, with no tool call ("CLAUDE.md says amounts are integers in minor units, such as
cents. The money math is in logic.js."). Then:

```text
Now read logic.js: what does 12.505 become in a euro group?
```

Expected: Claude runs one Bash command (reads `logic.js` and calls `toMinor` in Node) and reports that `12.505` becomes
1,250,500 cents (€12,505.00), because three digits after a single separator are read as a thousands separator. The
row grows a little (39.1k → 41.5k on camera). Run `/context` again: Messages grew from 10 tokens to about 12k.

**4. One task per session, and a fresh reviewer.**

```text
/clear
```

The screen empties and the row reads `0.0k (0%)` until the next reply; the fixed floor comes back with the first turn.
The old conversation stays on disk (`/resume`). Then paste:

```text
Review toMinor in logic.js for USD, EUR and JPY: the three worst problems, one line each.
```

USD, EUR and JPY are the app's three currencies. "Review" is a neutral question; avoid "is this good?". Expected: three
numbered problems, the thousands rule first ("0.001" USD returns 100, "1.005" USD returns 100500), plus the missing
safe-integer check and yen accepting "1,00". On camera it took 20 seconds, changed no file, and the row read 38.6k.

**5. Where the status line lives.**

```text
/exit
```

```bash
clear
cat ~/.claude/settings.json
```

Expected (compare with `settings-example.json`):

```json
{
  "theme": "dark",
  "statusLine": {
    "type": "command",
    "command": "bash ~/.claude/statusline-command.sh"
  }
}
```

It is your user settings file, so every later session, in every project, shows the row.

## Setting it up by hand

If `/statusline` writes something different, or you want exactly the filmed version: copy `statusline-command.sh` to
`~/.claude/statusline-command.sh` and add the `statusLine` entry above to `~/.claude/settings.json` (keep your other
settings). Claude Code runs the new command right away, and again whenever a new reply arrives.

## Pause and try

In your practice folder from lesson 2.2, or any project of yours: run `/context` before you type anything; run
`/statusline` with the same sentence; ask one question "from CLAUDE.md only", then the same question from the code; then
`/clear` and ask the fresh session to review one function with a neutral prompt.

**Checkpoint:** your bar shows under the prompt, and a fresh session has reviewed code it didn't write.

## Windows (WSL), macOS and Linux

The commands and keys are the same in every terminal. On Windows run everything inside the Ubuntu (WSL) terminal from
lesson 2.1, in your Linux home folder (`~`), not under `/mnt/c`; the bash script works there as it is. The script needs
`jq`:

- **Linux and Windows (WSL):** `sudo apt install jq`
- **macOS:** `brew install jq`

Running Claude Code natively on Windows (outside WSL) needs a PowerShell or Git Bash status line instead; the official
status line page has examples.

## Potluck repository

There is no Potluck repository yet, so this lesson has no tag to clone: the real Potluck starts from an empty repository in
lesson 3.2. Practise in `v0-practice`, keep `potluck-v0` as it is, and don't turn either into a git repository. Nothing in
this lesson changes a file in the folder.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. Every turn in this
  lesson counts toward your plan's usage limits; the reviews and questions here are short.
- The status line itself runs locally and costs no tokens.
- The app runs in your browser for free.

## Credits

The "smart zone" (roughly the first ~150K tokens of a session) is Matt Pocock's working rule of thumb from his public
teaching; his number has moved during 2026 and he calls it debated. This course teaches the open-source skills in
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License). The course is independent:
unofficial, and not affiliated with or endorsed by Matt Pocock. No skill is installed in this lesson.
