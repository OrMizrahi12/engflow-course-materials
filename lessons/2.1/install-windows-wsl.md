# Install the toolchain on Windows with WSL (Lesson 2.1)

The course runs on Ubuntu. On Windows you get the same Ubuntu with WSL (Windows Subsystem for Linux), and then follow
the Ubuntu steps inside it, exactly as in the lesson. Checked against the official pages on 2026-11-08.

## 1. Install WSL with Ubuntu

You need Windows 10 version 2004 or newer (build 19041+) or Windows 11.

1. Right-click PowerShell and choose **Run as administrator**.
2. Run:

   ```powershell
   wsl --install
   ```

   This turns on the features WSL needs and installs Ubuntu. Restart Windows when it asks.
3. Open **Ubuntu** from the Start menu. The first start takes a minute, then asks you to create a Linux username and
   password. This password is the one `sudo` asks for later. Nothing shows while you type it.
4. Check that Ubuntu runs on WSL 2 (in PowerShell):

   ```powershell
   wsl -l -v
   ```

   The VERSION column should say `2`. New installs use WSL 2 by default; if yours says 1, run
   `wsl --set-version Ubuntu 2`.

If `wsl --install` only prints help text, WSL is already installed: run `wsl --list --online` and
`wsl --install -d Ubuntu`.

## 2. Follow the Ubuntu steps inside WSL

Open the Ubuntu terminal (Windows Terminal works well) and follow `install-ubuntu.md` from step 1 to step 9. Install
and run everything **inside** Ubuntu, not in PowerShell: `claude`, `git`, `node`, `gh` and `jq` all live in WSL.
Claude Code's docs note that WSL 2 also supports its sandboxing; native Windows does not.

Keep your projects inside the Linux file system (for example `~/code`), not under `/mnt/c/`: it is much faster.

## 3. The two browser sign-ins from WSL

- **Claude (`claude auth login`):** if no browser opens, press `c` to copy the sign-in URL and open it in your Windows
  browser. If the page then shows a code, paste it at the `Paste code here` prompt (in Windows Terminal, right-click or
  Shift+Insert pastes). To let it open your Windows browser next time, Claude Code's docs suggest setting `BROWSER`,
  for example `export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"`.
- **GitHub (`gh auth login`):** `gh` prints a one-time code and the address https://github.com/login/device. If the
  browser doesn't open, open that address in your Windows browser yourself and type the code.

`gh auth status` may say the credentials were saved in plain text: WSL has no desktop keyring. The token sits in a file
only your Linux user can read.

## 4. Native Windows instead of WSL?

Claude Code also runs natively on Windows (`irm https://claude.ai/install.ps1 | iex` in PowerShell, or
`winget install Anthropic.ClaudeCode`), and git, Node.js, `gh` and `jq` all have Windows installers. This course's
commands are written for a Linux shell, so WSL is the path that matches every lesson.
