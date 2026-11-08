# Card: the workbench

Five tools under every lesson of the course. Each one comes from a source you chose on purpose.

| Tool | What it does in this course | Check it | Where it comes from (Ubuntu) |
|---|---|---|---|
| Claude Code | the coding agent you steer | `claude --version` | Anthropic's native installer, updates itself |
| git | records every change, branch and commit | `git --version` | Ubuntu's repositories (`apt`) |
| jq | reads JSON output in the terminal | `jq --version` | Ubuntu's repositories (`apt`) |
| Node.js 24 | runs JavaScript, npm and the app's tests | `node -v` | NodeSource's signed repository, pinned to 24 |
| GitHub CLI | issues, pull requests and sign-in for git from the terminal | `gh --version` | GitHub's own repository (`cli.github.com`) |

## The rule

**Read the version first, then pick the source.**

1. Read what your system already has (`--version`).
2. Good enough? Take your system's package (git, jq).
3. Too old? Go to the maker's signed source (Node.js 18 is past end of life; Ubuntu's `gh` 2.45 is a release GitHub
   calls broken).

## Two sign-ins, one pattern

The terminal asks and opens a page → the page shows who is asking and what it may do → you approve in your own
browser → a token comes back and the terminal keeps it.

**Never approve a request, or enter a code, that you didn't start.**

## Your identity

`git config --global user.name` and `user.email` go into every commit you make. Use GitHub's no-reply address
(Settings → Emails, "Keep my email addresses private"), not your real email. Set `init.defaultBranch` to `main`.

## Words to keep

- **Package manager:** installs software from repositories (`apt` on Ubuntu, Homebrew on macOS).
- **Repository (package):** a source of packages, signed by its publisher.
- **Signing key:** proves a package came from its publisher.
- **PATH:** the folders your shell searches for commands.
- **LTS:** long-term support, a release line that gets fixes for years.
- **Device code:** a one-time code that links a terminal to a browser sign-in.

## When it fails

`command not found` right after an install: open a new terminal. Still missing: the install folder is not on your PATH.
