# Card: /wayfinder, chart the map before you build something big

## Reach for it when

- The work needs **more than one session**, **and** you **can't see the route** to a spec yet.
- Fits in one sitting? `/grill-with-docs`. The deciding is already done? Straight to `/to-spec`.

You start it; Claude never does (the skill is user-invoked). Type `/wayfinder` (or the plugin's full name,
`/mattpocock-skills:wayfinder`), a space, then the idea in your own words: no tickets, no answers.

## The six steps of charting

1. **Name the destination**: what the map ends in, kept bounded (for example, a spec issue ready to hand off).
2. **Map the frontier**: one breadth-first round over the whole space. No fog at all? No map: it stops and says so.
3. **Create the map**: one issue labelled `wayfinder:map`.
4. **Create the tickets**, then wire the blocking in a **second pass**, with the real issue numbers.
5. **Fire the research** as background agents: findings on a throwaway `research/<name>` branch, pushed, **no pull request**.
6. **Stop.** Charting is one session's work.

Plan, don't do: a map session produces decisions, not deliverables.

## The map: one issue, an index, not a store

| Section | Holds |
|---|---|
| Destination | where the map ends |
| Notes | what every later session reads first: domain, glossary words, skills to load, standing constraints |
| Decisions so far | one line per resolved ticket: a gist and a link |
| Not yet specified | the fog: in scope, not sharp enough to ticket yet |
| Out of scope | past the destination; never graduates unless the destination changes |

## Tickets

- Child issues (sub-issues) of the map. The body is one `## Question`. One `wayfinder:<type>` label, never a triage label.
- Types: **research** (away from keyboard), **prototype** and **grilling** (human in the loop), **task** (either).
- **Claim**: a session assigns the ticket before any work, so no other session takes it.
- **Native blocking**: the tracker's own "blocked by" link, so the frontier shows without opening the map.
- **Frontier**: open, unblocked, unclaimed tickets: takeable now.
- **Resolve**: a resolution comment, close the ticket, one line in Decisions so far. One ticket per session.

## Fog or ticket?

Can you state the question precisely **now**? Then it's a ticket. Can you only name the area? It stays fog. You don't need
the answer yet, only a sharp question.

## It's working if

- The destination is written down and agreed before a single ticket exists.
- Every open ticket reads as a question.
- You can see which tickets are takeable without opening the map.
- "Not yet specified" is longer than the ticket list at first, and shrinks over time.
- Nothing gets built in a map session; the finished map points you toward a spec, not a pull request.

From [mattpocock/skills](https://github.com/mattpocock/skills) (MIT License), described in our own words. Unofficial, not
affiliated with or endorsed by Matt Pocock. First used in lesson 9.1.
