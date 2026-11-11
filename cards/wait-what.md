# Card: /wait-what

One page from Lesson 3.4. When a reply doesn't land, send it back.

## In and out

- **In:** a reply you didn't follow. Type `/wait-what`, optionally with what you mean (on camera: `/wait-what W2`).
- **Out:** a re-pitch: the context you were missing, in short plain sentences, using the project's own words from
  `GLOSSARY.md`.

## The skill, in one look

- Description: "Stop. That last message did not land: re-pitch it."
- `disable-model-invocation: true`: you type it. Only you know when you stopped following.
- The body is one paragraph: re-pitch that, give a little context, talk in ASD-STE100 Simplified Technical English
  (short, plain sentences), and use the ubiquitous language from `GLOSSARY.md`.

## Why the first word is "wait"

"Be concise" describes the answer, so a model clips words and loses you further. "Wait" describes you, the listener, so it
backs up and explains. "Re-pitch that" leaves Claude to decide how far back to go.

## How it ran (on camera)

W2's example didn't add up: Alice pays for a lunch and her balance ends at zero? `/wait-what W2`, and eight seconds later:

1. "W2, again. My first example was wrong": paying for the lunch raises her balance.
2. The context, in the glossary's words: a settlement is a record that one member paid another.
3. The two meanings of "settled up", side by side: an action and a state.
4. A corrected example, one short line per step, that adds up.
5. The same recommendation as before, now easy to agree with.

## Rules of thumb

- **Use it as soon as you notice you're skimming,** not three replies later.
- **A good re-pitch adds what was missing** (a premise, a correct example, the context), not only fewer words.
- **It fixes one reply.** A shared language agreed up front (`GLOSSARY.md`) prevents most of them.

**It's working if** the re-pitch is shorter and clearer, adds the premise you were missing, and comes back in your
project's own words.

---
The `wait-what` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words. This course is independent: unofficial, and not affiliated with or endorsed
by Matt Pocock.
