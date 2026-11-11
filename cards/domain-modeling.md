# Card: /domain-modeling

One page from Lesson 3.4. Put a project's words under pressure, and keep the glossary to words.

## In and out

- **In:** a `GLOSSARY.md` (or the words you use) and one line asking for words that do two jobs and edge cases at the
  borders. Name no word and no case: finding them is the skill's job.
- **Out:** questions, each with an edge case and a recommended answer; settled words written into `GLOSSARY.md` at once;
  an ADR only for a decision that passes all three tests; rules held for the spec.

## Four moves, three destinations

| Move | What it does |
|---|---|
| Challenge | checks a word against the glossary |
| Sharpen | one precise word per job, the others on the `_Avoid_` list |
| Scenario | an edge case that tests where one term ends and the next begins |
| Cross-check | checks the words against the code, once there is code |

| What was settled | Where it goes |
|---|---|
| A word: what the thing is | `GLOSSARY.md`, the moment it's settled |
| A decision that is hard to reverse, surprising without context, and a real trade-off | an ADR in `docs/adr/` |
| A rule (what must be true, how something is calculated) | the spec |

## How it ran (on camera)

1. Measure first: `grep -F '**' GLOSSARY.md` (9 terms) and `wc -w GLOSSARY.md` (278 words).
2. `/domain-modeling` and one line. Six questions back, W1 to W6, with Claude's own edge cases: an overpayment and a loan
   against "toward zero", "settle up" as an action and a state, "member" as an entry and as the person holding the phone.
3. Answers by number, two of them marked "as a rule for the spec". The glossary grew: 10 terms, 327 words.
4. "Does any of this need an ADR?" No: each change failed at least one test.
5. "Then cut GLOSSARY.md down to words only." 11 terms, 211 words; every rule taken out was kept for the spec.

## When to reach for it

- **The words themselves are the problem:** `/domain-modeling`.
- **You only need to look a word up:** read `GLOSSARY.md`.
- **A whole plan needs interrogating:** `/grill-with-docs` (lesson 3.3), which runs this skill underneath.

## Rules of thumb

- **Count before and after.** A healthy glossary shrinks as often as it grows.
- **A glossary is for words.** Rules go in the spec; decisions earn an ADR.
- **Answer by number, and mark the rules.** "Yes, as a rule for the spec" keeps a rule out of a definition.
- **If a reply doesn't land, say so:** `/wait-what` (see its card).

**It's working if** the file changed while you talked, every ADR you were offered passed all three tests, and your last
count isn't your biggest.

---
The `domain-modeling` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the
MIT License, described here in our own words. This course is independent: unofficial, and not affiliated with or
endorsed by Matt Pocock.
