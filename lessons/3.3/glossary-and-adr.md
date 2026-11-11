# Card: the glossary and the ADR

One page from Lesson 3.3. The two kinds of file `/grill-with-docs` writes, and what goes in neither.

## GLOSSARY.md: the project's words

- **What:** one file at the root of the repository. The project in one sentence, then sections of terms (Potluck has
  People and Money).
- **Each term:** the word in bold, a definition of a sentence or two, and an `_Avoid_` line with the words not to use for
  it.
- **When it changes:** the moment a word is settled in the interview, never saved up for the end. The file is created
  with the first settled term.
- **What stays out:** implementation details. No tables, columns, classes or code: words only.
- **Why:** one word means one thing. Anyone who clones the repository, and any agent working in it, reads the same words.

Example from Potluck (lesson 3.3):

```markdown
**Settlement**:
A record that one member paid another member an amount outside Potluck, to bring their balances toward zero. "Settle up" is the verb.
_Avoid_: Payment, repayment, transfer
```

"Payment" is avoided because it collides with paying for an expense.

## docs/adr/: the hard calls

An ADR (architecture decision record) is a short numbered file that says what was decided and why. Offer one only when
all three are true:

| Test | The question | ADR 0003 on camera |
|---|---|---|
| 1 · Hard to reverse | Is changing your mind later expensive? | yes: hard to undo once real data exists |
| 2 · Surprising without context | Would a future reader wonder why? | yes: production is not on the default branch |
| 3 · A real trade-off | Were there real alternatives, picked for reasons? | yes: one shared preview database and copying production were rejected |

If any one is missing, skip the ADR. On camera ADR 0004 (a migration rule: only add, never remove) was refused: we can
change that rule any day, so it fails the first test and goes in the spec.

## Where everything lands

| What | Where |
|---|---|
| a word, settled | `GLOSSARY.md` |
| a decision that passes all three tests | `docs/adr/NNNN-short-title.md` |
| everything else (the path to production, versions, rules you can change) | the conversation, then the spec (module 5) |

## Potluck's three ADRs (lesson 3.3)

- `0001-host-on-vercel-hobby.md`: Hobby forbids commercial use, and that can't be seen in the code.
- `0002-postgres-on-neon-free.md`: the free limits, the slower first request after idle time, the 6-hour history as the
  only backup for now.
- `0003-per-pr-database-copies.md`: each pull request gets its own database copy, never production data; production
  stays on Neon's root branch.

---
The glossary and ADR habits come from the `domain-modeling` skill in [mattpocock/skills](https://github.com/mattpocock/skills)
by Matt Pocock, under the MIT License, described here in our own words. This course is independent: unofficial, and not
affiliated with or endorsed by Matt Pocock.
