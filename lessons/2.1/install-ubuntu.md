# Install the toolchain on Ubuntu (Lesson 2.1)

The lesson's commands in order, as typed on camera on Ubuntu 24.04, with what success looks like. Debian works the same
way. `sudo` asks for your own Linux password the first time; nothing shows while you type it.

## 1. Read what Ubuntu already has

```bash
node -v
claude --version
gh --version
git --version
jq --version
```

On a fresh Ubuntu 24.04 with Node.js already pulled in by something else, the lesson saw: `v18.19.1`, then
`claude: command not found`, `gh: command not found`, `git version 2.43.0`, `jq-1.7`. Yours may differ: a machine with no
Node.js at all prints `node: command not found`, which is fine.

## 2. git and jq from Ubuntu (good enough, keep them)

```bash
sudo apt update
sudo apt install -y git jq curl
```

Success: apt ends without an error. It may upgrade git or curl (security updates) and leave jq as it is.

## 3. Claude Code from Anthropic's native installer

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

The installer shows no progress while it downloads (about 20 seconds in the lesson). Success:

```
✔ Claude Code successfully installed!
  Version: 2.1.319
  Location: ~/.local/bin/claude
```

Your version number will be newer. Then:

```bash
claude --version
claude doctor
```

`claude --version` prints `2.1.319 (Claude Code)` (or newer). `claude doctor` reports the install health; on a machine
that is not signed in yet it says "Not signed in to claude.ai" and "No installation issues found". Native installs
update themselves in the background.

If you get `claude: command not found`, open a new terminal; if it is still missing, see `troubleshooting.md`.

## 4. Sign in to Claude

```bash
claude auth login
```

Your browser opens Claude's authorize page. It names what is asking (Claude Code) and what it may do. Approve it only
because you just started it. Claude may ask you to prove you're human; complete the check. Success: the browser says
you're all set up for Claude Code, and the terminal prints `Login successful.`

You need a paid Claude plan (Pro or higher) or a Console account. If the browser doesn't open, press `c` to copy the URL
and open it yourself; if the page then shows a code, paste it at the `Paste code here` prompt.

## 5. Node.js 24 from NodeSource

Ubuntu 24.04 ships Node.js 18, which reached end of life in April 2025. Node.js 24 is a long-term-support line,
supported until April 2028; the course's projects are pinned to it.

```bash
node -v
curl -fsSL https://deb.nodesource.com/setup_24.x -o nodesource_setup.sh
sudo -E bash nodesource_setup.sh
sudo apt install -y nodejs
node -v
npm -v
```

The setup script adds NodeSource's signed repository and ends with "Repository configured successfully." The install
replaces Node.js 18: apt may remove `libnode109` and `node-acorn` and print "dependency problems, but removing anyway",
which is expected here. Success: `node -v` prints `v24.22.2` (or a newer 24.x), `npm -v` prints `11.19.1` (or newer).

## 6. The GitHub CLI from GitHub's own repository

```bash
apt policy gh
```

Ubuntu's candidate is `2.45.0`. GitHub's install page calls the Ubuntu and Debian community packages 2.45 and 2.46
broken, and the course needs a much newer `gh`. Paste GitHub's official block instead (from
github.com/cli/cli/blob/trunk/docs/install_linux.md, section Debian; copy it from that page if it has changed):

```bash
(type -p wget >/dev/null || (sudo apt update && sudo apt install wget -y)) \
	&& sudo mkdir -p -m 755 /etc/apt/keyrings \
	&& out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
	&& cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
	&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
	&& sudo mkdir -p -m 755 /etc/apt/sources.list.d \
	&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
	&& sudo apt update \
	&& sudo apt install gh -y
```

Then:

```bash
gh --version
```

Success: `gh version 2.103.3 (2026-10-26)` or newer.

## 7. Sign in to GitHub

```bash
gh auth login
```

The answers used in the lesson:

| Question | Answer |
|---|---|
| Where do you use GitHub? | GitHub.com |
| How would you like to authenticate GitHub CLI? | Login with a web browser |
| What is your preferred protocol for Git operations on this host? | HTTPS |
| Authenticate Git with your GitHub credentials? | Yes |

`gh` shows a one-time code (and copies it to the clipboard if it can), then "Press Enter to open
https://github.com/login/device in your browser". On the device page: Continue, paste the code, Continue. The next page
names where the request came from: check that it is you, then Authorize. Back in the terminal: "Authentication
complete" and "Logged in as <your username>".

```bash
gh auth status
```

Success: "Logged in to github.com account <your username>", protocol https, token scopes `gist`, `read:org`, `repo`,
`workflow`. If it says "credentials saved in plain text", your machine has no desktop keyring (common in WSL and on
servers); the token sits in a file only your user can read.

## 8. Your git identity (private)

Find your no-reply address on GitHub: **Settings → Emails**, turn on "Keep my email addresses private". The address looks
like `12345678+your-username@users.noreply.github.com`. Every commit carries this address, so use the no-reply one rather
than your real email.

```bash
git config --global user.name "YOUR-GITHUB-USERNAME"
git config --global user.email "YOUR-ID+YOUR-GITHUB-USERNAME@users.noreply.github.com"
git config --global init.defaultBranch main
git config --global --list
```

Success: the list shows your `user.name`, your no-reply `user.email`, `init.defaultBranch=main`, and two
`credential.…helper` lines that `gh auth login` added.

## 9. The workbench check

```bash
claude --version
git --version
node -v
gh --version
jq --version
```

All five print a version. That is the end of the lesson.
