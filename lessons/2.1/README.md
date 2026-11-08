# Lesson 2.1: Install the toolchain

This lesson sets up the workbench the whole course runs on: five tools, each installed from the place its maker
publishes it, then two browser sign-ins and a private git identity.

| Tool | What it is for | Where it comes from in the lesson | Version on camera |
|---|---|---|---|
| Claude Code | the coding agent you steer for the rest of the course | Anthropic's native installer | 2.1.319 |
| git | records every change you make | Ubuntu's own repositories (`apt`) | 2.43.0 |
| jq | reads JSON output in the terminal | Ubuntu's own repositories (`apt`) | jq-1.7 |
| Node.js 24 | runs JavaScript and npm, which Potluck's code will need | NodeSource's signed repository | v24.22.2 (npm 11.19.1) |
| GitHub CLI (`gh`) | works with GitHub from the terminal: issues, pull requests, sign-in for git | GitHub's own repository | 2.103.3 |

The rule behind every choice: **read the version first, then pick the source.** If Ubuntu's version is good enough
(git, jq), take Ubuntu's. If it is too old (Node.js 18 is past end of life; Ubuntu's `gh` 2.45 is a release GitHub calls
broken), go to the maker's signed source.

## Files in this kit

| File | What it is |
|---|---|
| `install-ubuntu.md` | the lesson's commands in order, as typed on camera, with what success looks like |
| `install-macos.md` | the same five tools and two sign-ins on a Mac |
| `install-windows-wsl.md` | Windows: Ubuntu inside WSL, then the Ubuntu steps |
| `troubleshooting.md` | the errors you are most likely to meet, and the fix for each |
| [`../../cards/workbench.md`](../../cards/workbench.md) | a one-page card: the five tools, how to check each, where each comes from |

## The commands, as typed on camera (Ubuntu 24.04)

```bash
node -v                              # what Ubuntu already has: v18.19.1
claude --version                     # command not found (not installed yet)
gh --version                         # command not found
git --version                        # git version 2.43.0
jq --version                         # jq-1.7
sudo apt update
sudo apt install -y git jq curl      # keep Ubuntu's git and jq, up to date

curl -fsSL https://claude.ai/install.sh | bash      # Claude Code, native installer (silent for about 20 s)
claude --version                     # 2.1.319 (Claude Code)
claude doctor                        # install health; "Not signed in" is expected here
claude auth login                    # sign in through the browser

node -v                              # still v18.19.1
curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh     # adds NodeSource's signed repository for Node.js 24
sudo apt install -y nodejs           # replaces Node.js 18 with 24
node -v                              # v24.22.2
npm -v                               # 11.19.1

apt policy gh                        # Ubuntu would give you 2.45.0: don't take it
# paste GitHub's official block for Debian and Ubuntu (it is in install-ubuntu.md)
gh --version                         # gh version 2.103.3
gh auth login                        # GitHub.com, web browser, HTTPS, Git credentials Yes
gh auth status                       # Logged in to github.com

git config --global user.name "YOUR-GITHUB-USERNAME"
git config --global user.email "YOUR-ID+YOUR-GITHUB-USERNAME@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global --list

claude --version; git --version; node -v; gh --version; jq --version   # the workbench check
```

`install-ubuntu.md` has the same commands one step at a time, with the output to expect after each.

## Pause and try

On your own machine: install the five tools from the same sources, sign in to your own Claude plan and your own GitHub
account, set your name and your own no-reply address, then run the five version commands.

Hint: your no-reply address is on GitHub under **Settings → Emails**, once "Keep my email addresses private" is on. It
looks like `12345678+your-username@users.noreply.github.com`.

**Checkpoint:** all five commands print a version, `gh auth status` says you are logged in, and
`git config --global --list` shows your name, your no-reply address and `init.defaultBranch=main`.

## Windows, macOS and Linux

- **Linux (Ubuntu or Debian):** `install-ubuntu.md`, exactly as in the lesson.
- **Windows:** install WSL with Ubuntu, then follow `install-ubuntu.md` inside the Ubuntu terminal
  (`install-windows-wsl.md`). Everything in this course runs inside WSL.
- **macOS:** `install-macos.md` (Homebrew for git, jq and gh; Anthropic's installer for Claude Code; Node.js 24 from
  nodejs.org or Homebrew).

## What is free and what is not

- **Claude Code needs a paid Claude plan** (Pro or higher) **or a Console account** billed by usage. The free claude.ai
  plan does not include Claude Code.
- Everything else in this lesson is free: git, jq, Node.js, the GitHub CLI and a GitHub account. Later lessons use free
  tiers for hosting (note that Vercel's free Hobby plan is for non-commercial use).
- This lesson does not use any Claude usage: nothing is asked of Claude yet.

## The Potluck repository

There is no Potluck repository yet: it is created in lesson 3.2. Nothing to clone for this lesson.

## Two things to know before you sign in

- **Only approve a sign-in you started.** Both sign-ins open a browser page that says what is asking for access. If you
  did not just run `claude auth login` or `gh auth login`, don't approve it, and never type a code someone sent you.
- Claude's sign-in may ask you to prove you're human. That is normal; complete the check and the sign-in continues.

## Credits

The GitHub tracker in Matt Pocock's open-source skills ([mattpocock/skills](https://github.com/mattpocock/skills), MIT
License) needs `gh` 2.94 or newer, which is one reason this course does not use Ubuntu's `gh` 2.45. This course is
independent: unofficial, and not affiliated with or endorsed by Matt Pocock.

Install steps follow the official pages: Claude Code setup (code.claude.com/docs/en/setup), NodeSource distributions
(github.com/nodesource/distributions), GitHub CLI for Linux (github.com/cli/cli/blob/trunk/docs/install_linux.md),
Node.js release schedule (github.com/nodejs/Release), checked on 2026-11-08.
