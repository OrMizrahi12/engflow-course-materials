# Tests and seams

From lesson 5.1. Built on the `tdd` and `codebase-design` skills of mattpocock/skills (MIT License), described in our own
words.

## A test

A small program that runs your code on an example and checks the answer: the example goes in, the code works out its
answer, and the test compares it with an answer written down beforehand. They match: green. They don't: red.

## A good test, and the three bad kinds

Run every test against two changes: a real bug, and a harmless tidy-up that changes nothing a user can see.

| Kind | What it does | Real bug | Harmless tidy-up |
|---|---|---|---|
| **Good** | checks behavior through the public interface; its answer comes from the spec | caught | stays green |
| **Coupled to the code** | reads a working number no user sees | missed | false alarm |
| **Side channel** | checks the bookkeeping instead of the answer | missed | false alarm |
| **Tautological** | recomputes its expected value from the code it checks | missed | can never fail |

In the lesson: "the balances add up to zero" (good), "computeShares reports offset 0" (coupled), "the ledger's paid column
for Ana is 1000" (side channel), "Ana's balance equals 1000 minus her share as computeShares reports it" (tautological).
Expected values come from an independent source: a known literal, a worked example, the spec. Delete bad tests rather
than fix them: they break on tidy-ups or can't break at all.

## Public interface

What a caller has to know to use a module. Tests use it the way callers do.

## Seam

A place where you can change what's on the other side without editing there: the edge where callers plug in. The
prototype page, a test and later the real app all plug in at the same edge of the balance logic. Tests plug in at seams,
never against the insides.

## Mocks belong at the edge

A mock is a stand-in you write yourself, pretending to be something real. Use one only at the edges of the system: other
people's services, sometimes a database (a real test database is better: Potluck's tests will use PGlite, a real Postgres in
memory, as decided in lesson 3.3), the clock and randomness, sometimes the file system. Never mock your own modules: then the test only checks the mock.

## The question to ask of every seam

What does it catch, and what does it miss? The `to-spec` skill proposes the highest seam possible and as few as possible,
and asks you to check them. That is lesson 5.2.
