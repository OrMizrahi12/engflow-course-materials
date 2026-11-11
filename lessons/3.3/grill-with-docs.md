# Card: /grill-with-docs

One page from Lesson 3.3. The interview that writes things down: one command, two skills.

## In and out

- **In:** a repository (after the setup from lesson 3.2) and one opening line: the words you want pinned down, and your
  leaning on the open decisions.
- **Out:** `GLOSSARY.md`, written the moment each word is settled; an ADR in `docs/adr/` for each decision that passes all
  three tests; everything else stays in the conversation, for the spec.

## One command, two skills

| Skill | Its job | Where you met it |
|---|---|---|
| `grilling` | runs the interview: rounds of questions, each with a recommended answer; facts it can look up, it doesn't ask | lesson 3.1 |
| `domain-modeling` | listens to the words: challenges them against the glossary, invents edge-case scenarios, writes the glossary and the ADRs | new in lesson 3.3 |

`SKILL.md` of `grill-with-docs` is one line: call the Skill tool twice, for both. `disable-model-invocation: true`: you
type it; Claude never starts it by itself.

## How it runs (on camera)

1. Two Skill lines: `grilling`, then `domain-modeling`, each "Successfully loaded skill". That is your check.
2. Claude reads the two format files and the repo, sends the fact-finding to a background agent, and asks the word
   questions first.
3. When the facts come back, the questions that depend on them join the round.
4. You answer by number in one line, with your no's and their reasons.
5. Settled words go into `GLOSSARY.md` at once; ADRs are offered only for decisions that pass the three tests.
6. A fact can overturn an earlier answer (on camera: production moved to Neon's root branch, and ADR 0003 was updated).
7. A wrap-up line ("ask only what is still open for the first version") ends with a summary and what is still parked.

## When to reach for it

- **A repository exists, and the plan's words are still loose:** `/grill-with-docs`.
- **No repository yet:** `/grill-me` (lesson 3.1) is enough.

## Rules of thumb

- **Read the transcript for both Skill lines.** If only one loaded, ask, and type `/domain-modeling`.
- **Answer by number, say no with a reason.** Your no's are where the design gets better.
- **Turn down an ADR that fails a test.** A rule you can change any day goes in the spec.
- **Commit, look, then push.** On a public repository a push is visible at once.

**It's working if** `GLOSSARY.md` changes during the session, holds only words, and challenges at least one of yours,
and every ADR you get passes all three tests.

---
The `grill-with-docs`, `grilling` and `domain-modeling` skills are from [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock, under the MIT License, described here in our own words. This course is independent: unofficial, and not
affiliated with or endorsed by Matt Pocock.
