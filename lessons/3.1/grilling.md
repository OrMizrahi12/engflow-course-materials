# Card: grilling

One page from Lesson 3.1. How to get interviewed about an idea before anything is built, and how to answer so the
decisions end up yours.

## In and out

- **In:** a loose idea, one sentence. No repository, no files, no worked-out plan.
- **Out:** a shared understanding: every decision settled or explicitly parked, held in the conversation. Nothing is
  written to disk until you confirm, and even then only if you ask.

## How it works

- **Design tree:** every decision branches into the decisions that hang off it.
- **Frontier:** every decision whose prerequisites are already settled. Claude asks the whole frontier at once.
- **Round:** one batch of numbered questions, each with a recommended answer. Your answers settle branches; the next
  round asks only what they unblocked (on camera: "who is it for?" in round 1, accounts only in round 2).
- **Done** when the frontier is empty. A typical session is a few rounds (on camera: 28 questions in 4 rounds).

```text
❓ Q9 - Identity and accounts: how do people get into a group?
   (a) no accounts, the link is the way in  (b) everyone signs up  (c) a mix
➡️ (a) for v1
```

## How to answer

| You mean | Write |
|---|---|
| accept the recommendation | `9 yes` |
| push back | `1 No: a public app, ...` |
| ask for the trade-offs | `2 I don't know. What does each option cost?` |
| leave it open on purpose | `10 Park it: research first.` |
| keep something out of today | `Host and stack: not today.` |
| stop asking | `Now wrap up: ask only what is still open for the first version.` |
| confirm | `Yes, it matches. Write nothing yet.` |

One line per round, every answer by its number.

## Facts vs decisions

| Facts: Claude's job | Decisions: yours |
|---|---|
| what is in the folder, what the code does, how other apps do it | who it is for, what is in the first version, what risk you accept |
| it looks them up itself, with a sub-agent when needed | it puts each one to you and waits |

## Four doors

| Door | When | In the course |
|---|---|---|
| `/grill-me` | anything, anywhere: no repository needed, writes no files | 3.1 |
| `/grill-with-docs` | inside a codebase: also keeps a glossary and decision records | 3.3 |
| `/wayfinder` | work too big for one session | module 9 |
| `/prototype` | a question you can't answer without seeing something | 4.2 |

## When it goes wrong

- **Nodding along:** "yes" to everything means a plan you didn't decide. Disagree where you disagree.
- **Scope too big:** hundreds of questions. Split the work first, then grill each piece.
- **Plan mode on:** Claude hurries to a plan instead of asking. Leave it off.
- **It starts building:** nothing should be written before you confirm; say "write nothing yet".
- **Talking through a question that needs a picture:** build a throwaway prototype, look, then answer in one line.

**It's working if** you disagreed at least once, later rounds built on your answers, and you could defend each decision
to someone who wasn't there.

---
The `grill-me` and `grilling` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License, described here in our own words. This course is independent: unofficial, and not affiliated
with or endorsed by Matt Pocock.
