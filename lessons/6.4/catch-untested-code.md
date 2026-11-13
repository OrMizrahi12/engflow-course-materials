# Card: catch untested code, and tests that can't fail

Two checks on the tests themselves. Green tests prove less than they seem when code was written ahead of its test, or when
a test takes its answer from the code it checks.

## The removal check

**What it asks:** was any of this code written before a test asked for it?

**How:** take each line out on its own, then each condition, run the tests, put it back. A change the tests catch is
covered. A change nothing notices is code no test checks. (This is a small, hand-run form of what is usually called
mutation testing.)

**The prompt from lesson 6.4:**

```text
One more check before we push: was any of this code written before a test asked for it? Take each line or condition of the engine out on its own, run the tests, put it back. Show me what no test notices.
```

**Read every survivor as one of two things:**

| Survivor | What it means | What to do |
|---|---|---|
| Taking it out changes a result, but no test notices | a missing test | add one test, with its own red run with the line taken out |
| Taking it out can't change any result for valid input | redundant code | tidying: leave it for the review |

In lesson 6.4, seven changes survived and all seven were redundant (a second `% n`, a tie-break the sort already gives,
one of two loop exits, three places that each give an idle member a balance of 0, a type-only guard).

**It's working if:** the code is back exactly as committed afterwards (`git status` clean, all tests green), and every
survivor comes with a reason.

## The tautological test

**The tell:** the expected value is computed the way the code computes it (`expect(add(a, b)).toBe(a + b)`, a hash
re-run in the test, a snapshot made from the code's own output). It passes by construction and can never disagree with the
code.

**The fix:** an independent source of truth: a known literal, the spec's worked example, a published test vector, a number
worked out by hand in a comment. In lesson 6.4 the leftover unit's tests use the published FNV-1a vectors ("a" →
`0xe40c292c`), and the five-member case is worked by hand from the spec.

Also suspect: arithmetic inside a test's input (`6000 - 3000`). A plain literal (`3000`) reads as data.

Built on the `tdd` skill of [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own
words. Unofficial, not affiliated with or endorsed by Matt Pocock. From lesson 6.4.
