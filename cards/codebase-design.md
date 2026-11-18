# Card: codebase-design, the words for depth

One page from Lesson 10.5. The `codebase-design` skill fixes the words used to design a module, so a report, a ticket and a
test all mean the same thing. It is a reference, not a process: other skills load it (the architecture review loads it first),
and on its own it gives you the words and stops. Lesson 5.1's card `deep-modules.md` covers deep and shallow in Potluck.

## The words

| Word | What it means | Not |
|---|---|---|
| **Module** | anything with an interface and an implementation: a function, a file, a package | component, service |
| **Interface** | everything a caller has to know to use it correctly: the types, and also the rules, the order of calls, the errors | API, signature |
| **Implementation** | the code inside | |
| **Depth** | how much behaviour a caller gets per piece of interface it has to learn. **Deep**: a lot behind a small interface. **Shallow**: an interface almost as big as what it does | |
| **Seam** | the place where an interface lives, where what is behind it can change without editing the callers | boundary |
| **Adapter** | what plugs into a seam: real storage, an in-memory copy for tests | |
| **Leverage** | what callers get from depth: one interface, many call sites | |
| **Locality** | what the maintainer gets from depth: change it in one place, and it is fixed everywhere | |

"Deep module" comes from John Ousterhout's *A Philosophy of Software Design* and "seam" from Michael Feathers' *Working
Effectively with Legacy Code*. The skill measures depth as leverage at the interface, not as a ratio of lines.

## Four principles

- **Depth belongs to the interface.** Small, swappable parts inside are fine; callers just don't see them.
- **The deletion test.** Imagine deleting the module. Complexity vanishes: it was a pass-through. Complexity reappears in
  every caller: it was earning its keep.
- **The interface is the test surface.** Tests use exactly what callers use. Wanting to test past the interface means the
  module is the wrong shape.
- **One adapter means a hypothetical seam; two adapters make it real.** Don't cut a seam until something varies across it.
  On camera, Q11 of the grilling kept a message inside its component for this reason: pulling it out would need a type whose
  only caller is that component.

## The words on camera (Lesson 10.5)

| Report line | The word at work |
|---|---|
| "Locality: one place owns all three encodings" | locality |
| "Interface is the test surface: Jest, not Playwright" | the test surface |
| "Leverage: one mapping, four callers" | leverage |
| "Testable with an in-memory adapter" | adapter (and the second adapter that makes the seam real) |
| "expense form model · pure, unit-tested", four entry points | a deep module |

Dependency categories (from the skill's deepening notes), as the report uses them: **in-process** (no database, no network:
test it directly), **local-substitutable** (a real local stand-in such as a test database), **ports & adapters** (an interface
with a production adapter and a test adapter). Lesson 10.6 adds the skill's other technique: designing an interface twice.

---
Built on the `codebase-design` skill of [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License),
described in our own words. This course is unofficial and not affiliated with him.
