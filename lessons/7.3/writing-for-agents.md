# Card: /writing-for-agents, write what an agent reads

## What goes in, what comes out

| In | Out |
|---|---|
| A document an agent will read: a skill, `CLAUDE.md` or `AGENTS.md` | The document, written for that reader |
| What it must make the agent do, and when | A description that says when to use it; steps that end on a done-when; pointers instead of copies |

Type `/writing-for-agents` (or the plugin's full name, `/mattpocock-skills:writing-for-agents`), a space, then the request.
The skill also loads by itself when you create or edit a skill or a `CLAUDE.md`.

## Two loads

| Always loaded, in every session | Loaded only when it fires |
|---|---|
| `CLAUDE.md` | a skill's body: its steps |
| one line per skill: its description | the files a pointer leads to |

- **Context pointer**: a line that names something the agent can't see yet and says when to go and get it. A skill's
  description is one; so is every line of a lean `CLAUDE.md`.
- **Context load vs cognitive load**: letting the agent reach a skill by itself costs one line in every session; making you
  type it costs your memory.
- **Completion criterion**: a step's done-when, so the agent can tell finished from not finished.

## The ladder (information hierarchy)

1. Steps in the file: what the agent does.
2. Reference in the file: read when it's needed.
3. Reference in a file of its own: reached only through a pointer.

Moving material down is **progressive disclosure**: it keeps the top short, so the agent attends to it. Each rule lives in
one place (a **single source of truth**); everything else points at it. Start each pointer with its **leading word**, the
phrase the skills already use when they reach for that material.

## Reach for it when

- You write or change anything an agent reads: a skill, `CLAUDE.md`, `AGENTS.md`.
- Deciding what the document should know comes first: that is a job for a grilling.

## Then test it

Trimming can cut the very thing that made a document work. Test it in a fresh session with a plain request that never
names the skill or the file (see `test-after-trimming.md` in the lesson 7.3 kit).

## It's working if

- A fresh session loads the skill from a plain request.
- Every step ends on a done-when.
- Every file `CLAUDE.md` points at is reached when the work needs it, and each rule lives in one place.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. Unofficial, not
affiliated with or endorsed by Matt Pocock. First used in lesson 7.3.
