# Deep modules

From lesson 5.1. Built on the `codebase-design` skill of mattpocock/skills (MIT License), described in our own words.

## Deep and shallow

- **Deep module:** a lot of behavior behind a small interface. Few methods, simple parameters, the complex logic hidden.
- **Shallow module:** an interface almost as large as what's behind it; a thin layer that just passes calls through.

Potluck's balance engine as a deep module: a group goes in; balances and suggested settlements come out. Behind it:
amounts in cents, shares, the odd-cent rotation, the hash that picks who gets the extra cent, the ledger, greedy matching,
ties broken by creation order. The prototype's logic, as it is, exports 22 names: each one is something a caller could come
to rely on. That is the shallow shape, and it is why a test like "computeShares reports offset 0" could exist.

## Three questions for any interface

1. Can I reduce the number of methods?
2. Can I simplify the parameters?
3. Can I hide more complexity inside?

## Principles

- **Depth belongs to the interface.** Small, swappable parts inside are fine; they just aren't part of the interface.
- **The deletion test.** Imagine deleting the module. If the complexity reappears in every caller, the module was earning
  its keep. If it simply vanishes, it was a pass-through.
- **The interface is the test surface.** Callers and tests cross the same seam. A test that has to change when the insides
  change is testing past the interface.

## The skills

- `codebase-design`: the shared words (module, interface, seam, depth, adapter) and the three questions. The `tdd` skill
  points to it for the vocabulary.
- `tdd`: tests worth keeping, one red-to-green step at a time, only at seams you agreed. Module 6 runs it for real.
