# Card: the small-change path

## When

A change that fits in one session but has a decision in it: how something should answer, where a check belongs, what a word
means. No spec, no tickets. Not sure which path you're on? Ask the router.

## The router: `/ask-matt <your situation>`

It reads the skills and your repo, names what to type next, and stops; it can't start a skill for you. Read its answer
against its own map: if the path it gives disagrees with the map (on camera it sent a one-session build to `/tdd` instead of
`/implement`), quote the map's line back and ask which fits. Its map in plain words:

| Your situation | The route |
|---|---|
| A build that takes several sessions | the long road: a spec, tickets, then `/implement` for each ticket |
| A small change with a decision in it | a grilling, then `/implement` in the same window |
| One behavior, nothing left to decide | `/tdd` on its own |
| Finished work | a code review, in a fresh session |
| Something broken, cause unknown | `/diagnosing-bugs` |

## The path

1. **Grill:** `/grill-with-docs <the change>`, "grill me until we've picked how it should answer, then file the decisions as
   a small issue". The facts are Claude's job (it reads the code and the docs before it asks); the decisions are yours. A word
   you settle goes into `GLOSSARY.md` on the spot.
2. **A small issue:** the decisions written down, with the evidence, the test plan, what's out of scope and when it's done.
   It isn't a spec, just a record of what you decided, and it outlives the window.
3. **`/implement #N`, in the same window:** you type it. It runs `/tdd` at the seam you agreed, a code review, then the
   commits. The window already holds the grilling, so don't clear it first.
4. **A pull request:** `/pr` and your landing steps, `Closes #N`, the evidence, and what it doesn't cover. Before it lands, a
   fresh session reviews it (`/mattpocock-skills:code-review origin/main`): a model reviewing its own work tends to agree
   with itself.

**When not:** the grilling won't fit in one session, or a question needs code to answer (a prototype). Go back to the long
road.

## `/tdd` on its own

For one concrete behavior with nothing left to decide. Agree the seam (where the test plugs in) before it writes a test. A
fresh session may skip that question, so check what it did: did it use the seam you agreed? A behavior that fits in one
prompt needs no ticket.

## It's working if

- The decisions live in an issue (and the glossary), not only in the chat.
- The build ran test-first at the agreed seam, then a review, then the commits, without clearing the window.
- You checked the behavior where it matters (on camera: a production build, because dev answered differently).
- A session that didn't write the code reviewed it, and its main point went into the PR.
- Each PR holds one change; anything found along the way that this change didn't cause becomes its own issue.

The `ask-matt`, `grill-with-docs`, `implement`, `tdd`, `code-review` and `pr` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. This course is
unofficial, not affiliated with or endorsed by Matt Pocock. First used in lesson 7.4.
