# Card: design it twice

One page from Lesson 10.6. Your first design for an interface is rarely the best one. Before you commit to it, get a few designs
made under constraints that really differ, compare them in the same words, pick one with a reason, and write the reasons down
where the next person will look. It is a technique of the `codebase-design` skill (its `DESIGN-IT-TWICE.md` page); lesson 10.5's
card `codebase-design.md` has the words it compares in.

## When to use it

- The interface of a new or reshaped module is about to be decided, and other code will call it for a long time.
- A grilling has settled what the module must do (the behaviour), and only its shape is left open.
- Not for a one-off helper, a private function or a pure rename: one obvious design is enough there.

## The constraints

Three or more designs, each with one constraint, so they come out radically different instead of drifting to the same middle.
First write down what every design must satisfy (on camera: the decisions from the grilling), then hand each design its constraint.

| Constraint | What it pushes for | What it tends to cost |
|---|---|---|
| **Minimal** | the fewest entry points (one to three), each doing a lot | width hidden somewhere else (on camera: a union of seven change types) |
| **Flexible** | easy to extend (a new case is one entry) | internals turned into interface if they are exported |
| **Most common caller** | the easiest call at the busiest call site | broad inputs that hide what each function reads |
| **Ports & adapters** | a dependency behind an interface, with a real and a test adapter | only worth it when something crosses a seam (a database, a network call) |

The fourth row only applies when the module has a dependency to put behind a seam. On camera everything ran in-process, so
Claude picked a fourth constraint that bites in this code instead: **units in the types** (the type says whether an amount is in
cents or in whole units). Choose constraints that pull in different directions in *your* module.

Run the designs in parallel, as separate sub-agents: each one works without seeing the others, and the wait is the slowest
design, not all of them added up (on camera, 1 min 29 s to 2 min 12 s each, one turn of "3m 42s").

## How to compare

Use the same three questions for every design, in the skill's words:

- **Depth**: how much behaviour a caller gets for each thing it has to learn.
- **Locality**: when a rule changes, how many places change with it.
- **Seam placement**: where the interface sits, and what it can and can't hide (on camera none could hide the guards, because
  an earlier decision kept them in the component).

The answer is often not one of the designs. On camera it was a hybrid: the strong parts of three designs and one idea from the
fourth, about seven functions in all. The winner was not the one with the fewest functions.

## Pick one, keep the reasons

- Pick yourself, and say why in one sentence that points at decisions already made.
- Write the pick, the rejected designs and why, and the tests to write first into the issue that hands the work on. That is
  where the next person, or agent, will look.
- An **ADR** (architecture decision record) only if a rejected design passes all three tests: hard to reverse, surprising
  without context, the result of a real trade-off. On camera none did: every rejected design was cheap to switch to later. A
  record of a temporary reason ("not now, because...") would stop the right move when that reason goes away.
- Behaviours that every design found odd but that work today: pin them with tests, fix them later on purpose.

---
"Design it twice" is John Ousterhout's idea, from *A Philosophy of Software Design*. Built on the `codebase-design` and
`domain-modeling` skills of [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License), described in
our own words. This course is unofficial and not affiliated with him.
