# Card: /improve-codebase-architecture

One page from Lesson 10.5. A survey of a codebase for places where the code could be deeper, written up as one HTML report,
then a grilling on the one idea you pick. It never changes code.

## In and out

- **In:** you type it (`/improve-codebase-architecture`; Claude never reaches for it on its own), with or without a direction.
  It reads the git history, the project's `GLOSSARY.md` and decision records, and the code itself, walked by an Explore
  sub-agent.
- **Out:** one self-contained HTML report in your system's temp folder, never in the repository, and one question: "Which of
  these would you like to explore?" Nothing is decided and no code has changed at that point.
- **After the pick:** a grilling round by round, until the decisions are made or deliberately left open. During it, the skill
  may add a term to `GLOSSARY.md` or offer a decision record when you reject a candidate for a lasting reason.

## The two filters

| Filter | What it does |
|---|---|
| Recent hot spots first | Without a direction, it walks the commit history and looks first where the code keeps changing: that is where depth pays off. A direction you name (a module, a pain point) is taken as is and this step is skipped. |
| The deletion test | Imagine deleting the module. If its complexity would vanish, it was a pass-through. If it would reappear in every caller, it was earning its keep, and moving that complexity behind a smaller interface is a real candidate. |

## The report

- A header with the scope it chose ("scope chosen from 18 months of git history" on camera) and the hot spots with their counts.
- A legend for the diagrams (module, seam, leak, deep module).
- One card per candidate: the files, the problem, a plain-English solution, a before and an after, the wins in the words of
  `codebase-design` (locality, leverage, adapters, the test surface), and a strength badge: **Strong** (take it seriously),
  **Worth exploring** (depends on where the code goes next), **Speculative** (mostly ignorable).
- A top recommendation, then the stop.

Check its hot spots yourself with one git command (the kit's `spliit/hotspots.sh`): the same window, the same filter.

## When to run it, and when not

| Run it | Use something else |
|---|---|
| as routine upkeep, every so often | you already know which module to redesign: `codebase-design` |
| before a big build ("how can we make this change easy?" with the spec) | something specific is broken: `/diagnosing-bugs` |
| on a codebase you didn't write, to see its shape | an effort too big for one session: `/wayfinder` |

## Rules of thumb

- **One candidate per session.** The report is only a temp file: carry the candidate forward, not the file. Start a fresh
  session for the next one.
- A run with no direction is fine for upkeep; a direction makes the report actionable.
- It rarely concludes the code is fine. Read the badges: a report of only Speculative cards found nothing.
- If the report opens unstyled with no diagrams, its CDN scripts were blocked: ask for inline styles.
- The decision goes back into the normal flow (a spec, tickets). Stop the grilling yourself when the next step is a design
  job of its own, as we did with the interface.

---
Built on the `improve-codebase-architecture` skill of [mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock
(MIT License), described in our own words. This course is unofficial and not affiliated with him.
