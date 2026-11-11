# Card: /research

One page from Lesson 4.1. When the answer is written down somewhere, send an agent to read it.

## In and out

- **In:** one narrow question that a decision of yours is waiting on, where to look, a stopping point, and "cite only
  pages you opened". On camera: who gets the leftover cent of an equal split, and where a currency's decimals come from.
- **Out:** one Markdown file in the repo, dated, with a link on every claim, and a short report in your session. The
  decision is still yours.

## The skill, in one look

- Description: "Investigate a question against high-trust primary sources and capture the findings as a Markdown file in
  the repo."
- It spins up a **background agent**, so you keep working while it reads.
- The agent's job, in three steps: read **primary sources** (official docs, source code, specs, first-party APIs) and
  follow every claim back to the page that owns it; write one Markdown file citing each claim; save it where the repo
  already keeps notes like this, or pick a place and say where.

## Where it sits

| Where the answer lives | Reach for |
|---|---|
| In your head | grilling (module 3) |
| In documents: docs, specs, source code | `/research` |
| In someone else's head | `/to-questionnaire` |

Reach for it when a decision waits on an outside fact. A decision itself goes to grilling, and a fact you could look up
in ten seconds needs no agent: just ask.

## How it ran (on camera)

1. `/research` and the pasted question. About 18 seconds later: `Agent(Research odd-cent split rules)`, "Backgrounded
   agent", and the plan (two open-source apps' split code, three apps' docs, three money libraries, the ISO 4217 list).
2. The session stayed free: an empty prompt, "Waiting for 1 background agent to finish", and a footer with the agent's
   current step, run time and tokens.
3. 4 minutes 25 seconds later the agent finished. Claude read the file and reported in the same conversation, with a
   recommendation and a question back: which rule?
4. The file: `docs/research/odd-cent-rounding.md`, 12 sources, most code links pinned to one exact commit, a table of
   seven candidate rules.
5. Two links followed: the Spliit code that rotates the extra cent, and the spec that makes currency decimals
   implementation-defined. Both held, and the decision was made in one typed line.

## Rules of thumb

- **Narrow beats broad.** A broader version of the same question was still reading after 13 minutes, with no file.
- **Give it a stopping point.** "Stop when we can pick a rule." Research has no natural end.
- **"Cite only pages you opened."** A link nobody opened proves nothing.
- **Follow two or three links yourself** to the page that owns the claim before you decide.
- **The file is dated** because facts like these change. Commit it if a spec will point to it; it can go once the rule
  lives in the spec.
- **Watch for a second agent.** Nothing stops the background agent from starting another one of its own.

**It's working if** your session stayed free while it read, the file links every claim, and the links you followed
landed on the claim.

---
The `research` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed
by Matt Pocock.
