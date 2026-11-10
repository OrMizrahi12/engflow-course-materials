# Grilling prompts (Lesson 3.1)

The lines typed or pasted in the lesson, and the ways to answer a round. Use your own words; these are the ones from
camera.

## Start

```text
/grill-me Potluck: a web app where a group splits shared expenses: who paid what, and who owes whom.
```

One sentence is enough. A loose idea is the point: the interview exists to make it precise.

## Answer a round by number

Each question is worded so that "yes" accepts Claude's recommended answer. One line per round:

| You mean | Write | Example from camera |
|---|---|---|
| I accept the recommendation | `<n> yes` | `4 Yes.` |
| A range of yeses | `<n> to <m> yes` | `11 Yes. 12 Yes. 13 Yes.` (or `11 to 13 yes`) |
| No, and here's what I want | `<n> No: <your answer>` | `3 No: equal split among a chosen subset only, exact amounts later.` |
| Pick an offered option | `<n> Yes, (a): <it in your words>` | `9 Yes, (a): no accounts, the link is the way in.` |
| I don't know | `<n> I don't know. What does each option cost?` | `2 I don't know. What does each option cost?` |
| Not ready to decide | `<n> Park it: <why>` | `10 Park it: I want to research how real apps handle the odd cent first.` |

Keep the answers on one line: a multi-line paste is shown as a single `[Pasted text]` chip.

## Scope lines (add to the end of an answer line)

```text
Host and stack: not today, we pick those later.
```

You own the scope. Anything you don't want decided today gets a line like this. Claude parks it and says so.

```text
No sub-agent now: the odd cent gets its own research session.
```

Declining an offer to research a fact now (it gets a session of its own later).

## Wrap up

```text
Now wrap up: ask only what is still open for the first version.
```

There's no question limit built in. Count rounds, not questions; when you've had enough, say so.

## The last round, typed

```text
23 yes, 24 yes, 25 yes, 26 yes, 27 yes, 28 yes
```

## Confirm the shared understanding

```text
Yes, it matches. Write nothing yet: the repo comes first.
```

Claude doesn't act on the design until you confirm. "Write nothing yet" keeps the folder empty until the repository
exists (lesson 3.2).

---
The `grill-me` and `grilling` skills are from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock,
under the MIT License. This course is independent: unofficial, and not affiliated with or endorsed by Matt Pocock.
