# Card: /prototype

One page from Lesson 4.2. When only running code can tell you whether an idea holds, build the smallest thing that
answers the question, and throw it away.

## In and out

- **In:** one question about a state model or logic, and the rules it must follow. On camera: does Potluck's money model
  hold up? The rules came in a handoff file.
- **Out:** for a logic question, one HTML file you drive with buttons: the question at the top, the state on screen after
  every action, free play, and guided walkthroughs. The answer is what you take away; the code is throwaway.

## The skill, in one look

- "A prototype is **throwaway code that answers a question**. The question decides the shape."
- Two branches: "Does this logic / state model feel right?" builds a single shareable HTML file with free-play buttons
  and tabbed walkthroughs that a non-developer can drive; "What should this look like?" builds several UI variations.
- Throwaway from day one, and marked as such. Trivial to run. No persistence. No polish.
- **Surface the state:** after every action, show everything that changed.
- **Capture it when done:** fold the decision into the real code, and commit the prototype itself to a throwaway branch,
  out of main, as evidence. The answer goes into the issue or a commit; `main` keeps only the decision.

## The round trip

| Step | Where |
|---|---|
| `/handoff` with the question and every rule | planning session → temp folder |
| `/prototype`, pointed at the handoff | a fresh session in its own folder |
| drive it until something happens that shouldn't | the browser |
| `/handoff` back with the findings | prototype session → planning session |
| decide, then keep the prototype on a `prototype/…` branch | planning session |

## How it ran (on camera)

1. `/prototype` and one pasted line pointing at the handoff. The build ran 9 minutes 11 seconds: the rules first, as a
   separate logic module checked in Node, then the page, then every scenario driven in a headless browser.
2. The reply: one file, `potluck-balances.PROTOTYPE.html`, 13 scenario tabs, and eight findings. The session found the
   two bugs while testing its own page.
3. Driving it confirmed both by hand. **Greedy isn't fewest:** balances of +20, +40, −50, −40, +30; greedy suggests 4
   settlements where 3 would do, and Cai pays Ben $40 for Dee's concert ticket. **Editing moves the cent:** swapping Ben
   for Dee on a $10 pizza moves the extra cent onto Cai, who wasn't touched.
4. Seven decisions went to the spec notes; the prototype went to the branch `prototype/balances`, never merged.

## A UI prototype (Lesson 9.2)

When the question is "what should this look like?", the skill takes its UI path instead of one HTML file:

- **On the real page.** The variants render on the page that already exists, chosen by a `?variant=` URL parameter; only
  the rendering swaps, while the routes, data and auth stay. A floating bar flips between them, and it is hidden in
  production builds so a stray merge can't ship it.
- **Structurally different.** Each variant lays the page out in its own way, not the same layout in another color.
- **Hand over a URL.** The person flips through the variants in the browser, and the feedback is often a mix of parts.

On camera, ticket #50 of a wayfinder map asked how a foreign amount should show on the expense and settlement forms and
lists. A session in its own worktree (`claude -w foreign-amount-ui`) built three variants: A, one quiet line under the
amount; B, three linked fields; C, "choose how it counts". We tried them with real values, and the verdict was A, plus
one rule taken from B (a typed bank amount stays fixed). The verdict went on the ticket; the code stayed on the branch
`prototype/foreign-amount-ui`, with no pull request, and `main` didn't move.

## Rules of thumb

- **Write the question at the top.** If you can't, you're not ready to prototype.
- **Look for bugs in the idea.** "Wait, that shouldn't be possible" is the moment you're looking for; the arithmetic can
  be right while the rule is wrong.
- **Drive it yourself,** even when the session reports its findings first.
- **Keep the logic pure.** One block with no page code can be lifted into the real code later, test-first.
- **Throwaway is how it's written,** not a promise to delete it: keep it on a branch as evidence.

**It's working if** the question is written at the top, someone who doesn't read code can drive it, someone says "wait,
that shouldn't be possible", and the question is answered in one sitting.

---
The `prototype` skill is from [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock, under the MIT
License, described here in our own words, with short quotes of the installed 1.3.1 files. This course is independent:
unofficial, and not affiliated with or endorsed by Matt Pocock.
