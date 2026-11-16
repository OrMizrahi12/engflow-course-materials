# When to reach for /wayfinder

Ask two questions about the work in front of you.

1. **Will it fit in one session?** One session means one context: grill it, write the spec, split it, and nothing is lost
   between sittings.
2. **Can you see the route?** Do you know which decisions stand between you and a spec, and in what order?

| It fits in one session | The route is clear | Use |
|---|---|---|
| yes | yes or no | `/grill-with-docs`, then `/to-spec` |
| no | yes (the deciding is already done) | straight to `/to-spec` |
| no | no | `/wayfinder`: chart a map first |

## Signs you need a map

- You can name the area ("multi-currency trips") but not the questions inside it yet.
- Some answers need research you can't do in your head (rate sources, how other apps solve it).
- One decision clearly hangs over the others (here: convert once, or keep a balance per currency).

## Signs you don't

- The breadth-first round finds no fog. The skill itself stops and says so.
- Every question is already sharp and the answers are small.

## Keep the map honest

- Bound the destination. "A spec for multi-currency groups" ends; "make Potluck international" never does.
- Plan, don't do. A map session produces decisions, not code. If a session starts building in the middle of a map, stop it.
- One ticket per session after charting. Research runs in the background; the frontier ticket waits for a fresh session.
- The fog is meant to be bigger than the ticket list. A question becomes a ticket only when you can state it precisely.
