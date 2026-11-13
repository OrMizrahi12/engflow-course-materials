# Card: /tdd, tests that failed first, one slice at a time

## What goes in, what comes out

| In | Out |
|---|---|
| A behavior: inputs and an output you can check | Tests that failed first, then passed |
| The seams you agreed (where the tests meet the code) | One slice at a time: one test, its red, the least code, green, a commit |
| A source for expected values outside the code: the spec, a worked example, a published vector | The least code that passes them |

## How it runs

1. It reads the project's glossary and decision records, so test names use the project's words.
2. **Seams first.** Before any test, it proposes the seams, each with a line on what it catches and what it misses, and
   waits for your answer. No test is written at a seam you haven't confirmed.
3. **The loop**, one slice per cycle: write one failing test; run it and see it fail; write only enough code to pass it;
   see it pass. Then the next slice.
4. **No refactor step.** Tidying belongs to the review, in a session of its own. The skill's docs say why: agents almost
   never did the refactor step, and review works better with fresh eyes in a separate session.

Type `/tdd` (in some versions only the plugin's full name, `/mattpocock-skills:tdd`, is found).

## Ask for this

- "Before any test, propose the seams, each with what it catches and what it misses, and wait for my answer."
- "A red has to fail on the value, not on a missing name." (An empty stub first, so the red is a wrong value.)
- "Expected values come from the spec's examples and published vectors, never from the existing code."
- "Commit each green slice."

## Reach for it when

- Business logic, a contract or a calculation: anything with inputs and an output someone can check independently.
- A bug fix: the failing test first, so the fix is proven.

## Not for

- Behavior that isn't pinned down yet (prototype it first).
- Glue code with nothing independent to check.
- Browser tests before the behavior works.

## It's working if

- No test exists until you've answered about the seams.
- Every red after the first fails on a value: a number, a list, an order.
- `git log --oneline` shows one commit per slice.
- Every expected value can be traced to the spec, a worked example or a published vector.
- The test names, read as sentences, tell a reviewer what the code does.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. Unofficial, not
affiliated with or endorsed by Matt Pocock. First used live in lesson 6.4.
