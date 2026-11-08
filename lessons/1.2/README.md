# Lesson 1.2: Fifteen minutes of vibe coding

In this lesson you build Potluck v0, an app for splitting trip costs with friends, from one plain-English prompt, and
change it twice, without reading the code. Then you test it with real numbers and list what it is missing. v0 is the
"before" picture for the whole course.

## Files in this kit

| File | What it is |
|---|---|
| `v0-prompts.md` | the exact prompt and the two change requests, word for word, and what to answer if Claude asks you something |
| `real-number-checks.md` | the six checks, in order, with the right answer for each and what v0 did on camera, plus a column for your app |
| `what-v0-is-missing.md` | the gap between "runs on my laptop" and "lives in production", item by item, with the lessons that close it |
| [`../../cards/vibe-coding.md`](../../cards/vibe-coding.md) | a one-page card: what vibe coding is, when it is fine, the six checks in one line each |

## The steps, as typed on camera (Ubuntu)

```bash
mkdir potluck-v0 && cd potluck-v0     # an empty folder: this is version zero
claude                                 # Claude Code with no options, the way most people start it
```

On a first run Claude Code asks for a text style (Dark mode is fine), shows two security notes (Enter), and asks
whether you trust the folder (you made it a minute ago: Yes). Then:

1. Paste the one prompt from `v0-prompts.md` and press Enter. Don't change anything: no settings, no model, no plan.
2. Wait. On camera this took 3 min 24 s by Claude's own timer.
3. Open the app in your browser (see below) and run checks 1 to 3 from `real-number-checks.md`.
4. Back in Claude Code, type change request 1, wait, reload the page, run check 3 again.
5. Type change request 2, wait, reload the page, run checks 4 to 6.
6. Leave Claude Code and look at what you have:

```bash
/exit          # inside Claude Code: it prints how to resume this session
ls             # on camera: app.js  index.html  logic.js  styles.css (no test files)
git status     # fatal: not a git repository
```

## Opening the app

On camera, Claude built a page you open straight from the folder: no install, no server. Yours may be different; if
Claude tells you to start a server, ask it to start it for you and open the address it prints.

- **Linux:** paste `file:///home/<you>/potluck-v0/index.html` into the browser's address bar (your user name in place
  of `<you>`), or run `xdg-open index.html` in the folder.
- **macOS:** run `open index.html` in the folder, or paste `file:///Users/<you>/potluck-v0/index.html`.
- **Windows (WSL):** run `explorer.exe index.html` in the folder (inside the Ubuntu terminal); it opens in your Windows
  browser. Or paste `\\wsl.localhost\Ubuntu\home\<you>\potluck-v0\index.html` into the browser.

## Pause and try

Make your own v0: an empty folder, Claude Code started in it, the same prompt, both change requests. Then run the six
checks on whatever you get and write down which ones pass.

Hint: type the amounts the way a friend abroad would.

**Checkpoint:** you have a filled-in "Your app" column in `real-number-checks.md`, and you can name at least three things
from `what-v0-is-missing.md` that your v0 doesn't have.

Your v0 will not be the same as ours: Claude builds something new on every run. Some of your checks may pass where ours
failed, and the other way round. That is part of the lesson: you only know by testing.

## Keep v0 as it is

v0 is throwaway code. Don't fix it, and **don't turn it into a git repository** (no `git init`, no push). Leave the
`potluck-v0` folder where it is, as the picture of before. There is no Potluck repository yet: the real one starts from
an empty repository in lesson 3.2.

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. The three prompts in
  this lesson use some of it: on camera, Claude worked for about 3½ minutes, then 1 minute, then 1¼ minutes.
- The app itself runs in your browser and costs nothing.

## Credits

The definition of vibe coding follows Matt Pocock's public work. This course teaches the open-source skills in
[mattpocock/skills](https://github.com/mattpocock/skills) (MIT License). The course is independent: unofficial, and not
affiliated with or endorsed by Matt Pocock.
