# The seams, the slices and where the numbers come from

What the session proposed, built and found in lesson 6.4, in our words. Your session will word it differently; the shape
is what to compare.

## The seams it proposed (before any test)

| Seam | What it is | Catches | Misses |
|---|---|---|---|
| **A** (recommended) | the whole engine as one pure function, `computeGroupMoney` | every arithmetic rule: the leftover unit and its hash offset (expected values from published FNV-1a vectors, not from re-running the hash), participants in creation order, a payer who isn't a participant, the balance formula including which way settlements count, balances summing to zero, greedy matching including the spec's non-minimal case, ties to the earlier-created member, no suggestions once everyone is settled up, determinism | every refusal and cap, whether the database's creation order really reaches the engine, an expense id staying the same across edits, versions and pagination, the group view's shape, currencies with 0, 2 or 3 decimals (to the engine they are integers) |
| **B** (advised against) | shares, balances and suggestions as three separate functions | the same arithmetic as A; a failure points at one function | the wiring between the three; it locks in an internal split the spec says to keep private, so reorganising the code breaks the tests |
| **C** (the spec's Seam 1) | the group service on PGlite | everything A misses: refusals, caps, persistence, versions, the group view | can't exist until ticket #3 builds the service |

Our answer: A, kept for good (the engine's tests become its contract); #4 keeps the service tests, the property test and
the parsing; invalid input stays an untested precondition, because the service refuses it first. The spec's text waits; a
comment records the change when the branch lands.

## The seven slices

| Commit | Slice | What the red showed |
|---|---|---|
| `bb2a62a` | an even split (the first slice, at walking pace) | a missing module, from before the rule |
| `f5d032a` | the leftover unit goes to the participant at FNV-1a(id) mod n | shares of 33.333… instead of 33/34/33 |
| `59e61e8` | shares follow member creation order, and the leftover wraps around | the wrong members got the extra units |
| `792447f` | balances from expenses paid for, minus shares | `[]` instead of +67/−34/−33/0 |
| `4280f07` | settlements made and received, including an overpayment crossing zero | balances ignored the settlements |
| `0f3729f` | a first cut of suggestions: each member who owes pays the member owed most | `[]` instead of two suggestions |
| `aedf1b4` | greedy matching, with the spec's five-member example | suggestions of 50 and 40 instead of the four worked by hand |

From the second slice on, every red failed on a value. Where a test needed a new field, the field went in first as an
empty stub, so the red was a wrong value and not a missing name.

## Where the expected values come from

- **The leftover unit:** the published FNV-1a 32-bit test vectors (the ones in Go's `hash/fnv` tests): "a" → `0xe40c292c`,
  "abc" → `0x1a47e90b`. The remainder is worked out by hand in the test's comment (`0xe40c292c` = 3826002220, mod 3 = 1,
  so the one leftover unit goes to the second participant).
- **Balances:** plain arithmetic you can check in your head.
- **The five-member example:** spec #1 names the case (+20, +40, +30, −50, −40 give 4 suggestions). The session built those
  balances from settlements, checked them in the test, and worked the four suggestions out by hand from the spec's
  description of greedy matching.
- **Nothing from the prototype's code.** A test that takes its expected value from the code it tests can never fail.

Rules that ended up without a test of their own (from its report): no suggestions once everyone is settled up (a test for
it would have passed at once, so it could never have a red; the property test in #4 will cover it); the leftover wrapping
around (exercised by the creation-order test, id "abc"); a group with no members (the final greedy code handles it).

## The removal check

Each line deleted, then each condition taken out, one at a time, the tests run after each change, the file put back. Seven
changes survive, and none of them hides a missing test: each one is redundant.

| Taken out | Why nothing changes |
|---|---|
| `% n` on the offset (line 38) | line 45 already takes `(offset + i) % n`, so the first `% n` does no work (it was copied from the spec's formula) |
| the tie-break `\|\| x.order - y.order`, and the `order` field it needs (lines 74, 78) | JavaScript's sort keeps equal items in their original order, and balances already arrive in creation order; the five-member example has a real tie, but the tie-break never decides it |
| `!creditor` alone, or `!debtor` alone (line 84) | balances always sum to zero, so when one side runs out the other has too; either check is enough |
| seeding every member at 0 (line 51) | two other parts each cover a member with no activity: the `?? 0` in `add` and the `?? 0` on the balance |
| `?? 0` in `add` (line 53) | once every member is seeded, it only fires for an id that isn't a member: invalid input, left as an untested precondition |
| `?? 0` on the balance (line 64) | the seed already guarantees a value |
| `?? []` on the shares lookup (line 56) | every expense always has its shares set; the guard only satisfies the type-checker |

The seed and the two `?? 0`s are one decision made three times: a member with no activity gets a balance of 0, and any
one of the three places is enough.

Everything else is caught on a value. The session suggested a cleanup commit; we left the seven for the review, because
tidying is not part of the `/tdd` loop. They are still in `potluck/src/money/group-money.ts` at the tag.
