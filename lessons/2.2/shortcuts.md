# Shortcuts and commands from Lesson 2.2

Everything below was used or named on camera (Claude Code 2.1.319, updated to 2.1.321 during the lesson). Labels can
change between versions: trust what your screen says.

## Keys

| Key | What it does | What you see |
|---|---|---|
| **Shift+Tab** | cycles the permission mode | the footer: `manual mode on` → `accept edits on` → `plan mode on` → `auto mode on` |
| **Shift+Tab** on an open file prompt | picks "Yes, and switch to accept edits" | the edit is approved and the mode changes |
| **Down / Up, Enter** | move through and pick a menu option | `❯` marks the selected row |
| **Esc** | close a dialog or picker without changing anything | e.g. "Kept model as Opus 5.5 (default)" |
| **Esc Esc** (on an empty prompt) | opens rewind, same as `/rewind` | the list of your prompts with their file changes |
| **Ctrl+O** | toggles the detailed transcript (full plans, full tool output) | "Showing detailed transcript · ctrl+o to toggle" |
| **Ctrl+U** | clears the input line | an empty prompt |
| **Ctrl+L** (in the shell) | clears the terminal screen | |

## Slash commands

| Command | What it does | On camera |
|---|---|---|
| `/model` | pick the model; Enter = new default for future sessions, `s` = this session only | Default (recommended) Opus 5.5; Esc kept it |
| `/effort` | the effort slider: low, medium, high, xhigh, max | Right → high, "~1.5x the estimated cost of medium"; `s` = this session only |
| `/plan <task>` | enter plan mode for one prompt (named, not used on camera) | |
| `/rewind` | restore code and/or conversation to the point before a prompt | Restore code and conversation |
| `/usage` | session cost and time, plan bars, recommendations | $0.66, 1m 28s API, 26m 43s wall, 106 lines added, 4 removed |
| `/context` | what fills the context window (next lesson) | named by `/usage`: "63% See what fills your context · run /context" |
| `/memory` | where instructions live: auto memory, project `./CLAUDE.md`, user `~/.claude/CLAUDE.md` | Auto-memory true |
| `/exit` | leave Claude Code; prints `claude --resume <id>` to come back | |
| `!<command>` | run one shell command from the Claude Code prompt (named, not used on camera) | |

## The rewind menu

1. Restore code and conversation · 2. Restore conversation · 3. Restore code · 4. Summarize from here ·
5. Summarize up to here. The warning under it: "Restored files go back whole, losing later changes by anyone. Bash changes
to other files are not undone."
