# Install the toolchain on macOS (Lesson 2.1)

The same five tools and two sign-ins as the lesson, on a Mac (macOS 13 or newer for Claude Code). Same rule: read the
version first, then pick the source. Commands go in the Terminal app. Checked against the official pages on 2026-11-08.

## 0. Homebrew

git, jq and the GitHub CLI are easiest from Homebrew. If `brew --version` prints `command not found`, install Homebrew
from https://brew.sh (the page has the one-line install command), then open a new terminal.

## 1. Read what you already have

```bash
node -v
claude --version
gh --version
git --version
jq --version
```

A Mac often has no `node`, `claude`, `gh` or `jq` yet. `git --version` may offer to install Apple's Command Line Tools:
that is fine (it is one of git's official sources), or use Homebrew below.

## 2. git and jq

```bash
brew install git jq
git --version
jq --version
```

Alternative for git from git-scm.com/install/mac: `xcode-select --install` (Apple's Command Line Tools include git).

## 3. Claude Code

Anthropic's native installer (updates itself in the background):

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

It shows no progress while it downloads. When it finishes, open a new terminal window, then:

```bash
claude --version
claude doctor
```

If `claude` is not found, `~/.local/bin` is not on your PATH yet. For zsh (the macOS default):

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

(For bash on macOS, add the same line to `~/.bash_profile`.)

Homebrew also works (`brew install --cask claude-code`), but Homebrew installs don't update themselves: run
`brew upgrade claude-code` from time to time.

## 4. Sign in to Claude

```bash
claude auth login
```

Same as the lesson: the browser opens Claude's authorize page; approve it because you started it; complete a "prove
you're human" check if one appears. Success: `Login successful.` in the terminal. You need a paid Claude plan (Pro or
higher) or a Console account.

## 5. Node.js 24

Two official options; pick one.

- **The Node.js installer:** download `node-v24.22.2.pkg` (or the newest 24.x) from
  https://nodejs.org/dist/latest-v24.x/ and run it.
- **Homebrew:** `brew install node@24`. This formula is "keg-only" (it is not put on your PATH by itself, because it is
  an older line than Homebrew's default `node`). Add it to your PATH (Apple silicon path shown; on an Intel Mac use
  `/usr/local/opt/node@24/bin`):

  ```bash
  echo 'export PATH="/opt/homebrew/opt/node@24/bin:$PATH"' >> ~/.zshrc
  source ~/.zshrc
  ```

Don't take plain `brew install node`: it installs the newest line, not 24. Check:

```bash
node -v
npm -v
```

Success: `v24.x` and an npm version.

## 6. The GitHub CLI

```bash
brew install gh
gh --version
```

(GitHub's recommended macOS install. Upgrade later with `brew upgrade gh`.) You want 2.94 or newer.

## 7. Sign in to GitHub

```bash
gh auth login
gh auth status
```

Answer GitHub.com, Login with a web browser, HTTPS, and Yes to "Authenticate Git with your GitHub credentials?". The
rest is the same as `install-ubuntu.md` step 7. On a Mac, `gh` stores the token in the macOS keychain.

## 8. Your git identity

```bash
git config --global user.name "YOUR-GITHUB-USERNAME"
git config --global user.email "YOUR-ID+YOUR-GITHUB-USERNAME@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global --list
```

Your no-reply address is on GitHub under **Settings → Emails** ("Keep my email addresses private").

## 9. The workbench check

```bash
claude --version
git --version
node -v
gh --version
jq --version
```
