# Card: the smart zone

One page from Lesson 2.3. Keep each Claude Code session small enough to stay sharp.

## The window and the smart zone

- **Context window:** everything the model reads on every turn. Before you type, it already holds the system prompt,
  the tools, your `CLAUDE.md` and your skills' short descriptions (about 30K tokens in the lesson's fresh session).
  Every message, file read, reply and command output is added on top, and nothing leaves on its own.
- **Token:** a small piece of a word. The window is counted in tokens.
- Current models have a 1M-token window, and Claude Code auto-compacts at about 967K by default.
- **Smart zone:** Matt Pocock's working rule of thumb for the part of the window where a model still keeps track of
  everything: roughly the first ~150K tokens. Past it (his "dumb zone") a model forgets earlier instructions and repeats
  mistakes it already fixed. His number moved during 2026 (the first 40% → ~100K → ~150K) and he calls it debated:
  treat it as a habit, not a measured limit.

## See it

| Command | What it shows |
|---|---|
| `/context` | what fills the window now, by category, and a grid (each square = 1/200 of the window) |
| `/statusline <description>` | Claude writes a status line script and adds it to `~/.claude/settings.json` |
| the status line | a row under the prompt, redrawn on every reply; it runs locally and costs no tokens |

The status line from the lesson: `Opus 5.5 | 38.7k (4%) ██░░░░░░░░`. The percent is out of the whole 1M window; the bar
fills at 150k, the smart zone.

## Keep it small

- **One task per session.** Three tasks in one session all eat into the same smart zone.
- **`/clear` between tasks.** It starts an empty conversation; the old one stays resumable with `/resume`. The fixed floor
  (system prompt, tools, `CLAUDE.md`, skills) comes back with the first reply.
- **`/compact [focus]`** replaces the conversation with a summary, which is a secondary source. Use it, with a focus,
  only when you must continue the same work past a phase boundary.

## Primary and secondary sources

| Primary source: the thing itself | Secondary source: an account of it |
|---|---|
| the code, the real command output, the full transcript | `CLAUDE.md`, a comment in the code, a summary, a compacted session |
| complete and current, costs tokens | cheap, can be incomplete or out of date |

A good secondary source is a pointer to the primary one. For a quick orientation the map is enough; when the answer has to
be exact, ask Claude to read the primary source.

## A fresh reviewer

The session that wrote the code holds its own reasoning and tends to agree with itself (**sycophancy**: models are trained
toward answers people like). A reviewer session starts empty (**fresh context**), gets only the code and a neutral
question ("Review … the three worst problems, one line each."), and reads it like a stranger. Use one for every change
that will live; skip it for a throwaway experiment.

---
The smart zone is Matt Pocock's concept from his public teaching, described here in our own words. This course is
independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
