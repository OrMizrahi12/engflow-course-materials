# Troubleshooting (Lesson 2.1)

The problems you are most likely to meet while installing the toolchain, and the fix for each.

## `claude: command not found` after the installer finished

Open a new terminal first: the installer puts `claude` in `~/.local/bin`, and an old terminal may not know about it.
If it is still missing, add that folder to your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc     # zsh: ~/.zshrc
source ~/.bashrc
```

Then `claude --version` again. `claude doctor` reports anything else that is wrong with the install.

## Ubuntu suggests `sudo apt install gh` or `snap install gh`

Don't take it. `apt policy gh` shows Ubuntu's version (2.45.0 on Ubuntu 24.04); GitHub's install page calls the
2.45/2.46 community packages broken, and GitHub discourages the Snap package. Use GitHub's official block in
`install-ubuntu.md` step 6. If you already installed Ubuntu's `gh`, run GitHub's block anyway: it replaces it.

## `sudo` asks for a password

That is your own Linux user's password (on WSL, the one you created on Ubuntu's first start). Nothing shows while you
type; press Enter. Never type it into anything else.

## The NodeSource script fails

It needs `curl` (installed in step 2: `sudo apt install -y git jq curl`). Run the steps in order. If the download
command fails, check the address: `https://deb.nodesource.com/setup_24.x`.

## `node -v` still prints v18 after installing 24

The shell remembered the old location. Run `hash -r` or open a new terminal. If it still says 18, check that the
install step ran: `sudo apt install -y nodejs` must show `nodejs (24.…)` being unpacked. "dependency problems, but
removing anyway" while it removes Ubuntu's Node 18 packages is expected.

## The browser doesn't open for a sign-in

- `claude auth login`: press `c` to copy the URL and open it yourself; if the page shows a code, paste it at
  `Paste code here`.
- `gh auth login`: open https://github.com/login/device yourself and type the one-time code the terminal shows.

## Claude's sign-in asks you to prove you're human

Normal. Complete the check in the browser; the sign-in continues and the terminal prints `Login successful.`

## Claude's sign-in says your plan doesn't include Claude Code

The free claude.ai plan has no Claude Code. You need Pro or higher, or a Console account billed by usage.

## GitHub asks for your password or a two-factor code on the device page

Normal on some accounts: GitHub is confirming it's you. Type them only into github.com, in the browser you are using.

## A sign-in page you did not start

Close it. Never approve a request, or enter a code, that you didn't start yourself.

## `gh auth status`: "credentials saved in plain text"

Your machine has no desktop keyring (WSL, servers). The token is stored in `~/.config/gh/hosts.yml`,
readable only by your user. On Ubuntu Desktop and macOS, `gh` uses the system keyring instead.

## `git config --global --list` shows extra `credential` lines

`gh auth login` added them when you answered Yes to "Authenticate Git with your GitHub credentials?". They let git
use your GitHub sign-in. Keep them.
