# Card: from a cleared map to a shipped feature

One page from Lesson 9.3. When every ticket under a wayfinder map is closed and only "Writing the spec" is left, the map has
done its job. Don't build from the map: collapse it into one spec, cut the spec into tickets, build those.

## The path

| Step | What happens |
|---|---|
| A fresh session, in the main checkout | `/to-spec #<map>`; it writes no code, it only publishes issues |
| It reads, then asks | the map, its closed tickets and their comments, the glossary and the code; no grilling if every decision is written down; at least one question: the test seams |
| The spec | one issue, labelled `ready-for-agent`; it lists what it decided by itself while writing |
| You sign off | answer each decision it made by itself, and correct anything you never said: a statement you never made is a defect |
| Close the map | the map's destination points at the spec, the spec gets a line in Decisions so far, the map closes with a comment |
| Tickets, same window | `/to-tickets` with no argument (the spec is already in context); don't clear or compact in between |
| Push back at the quiz | is each ticket a tracer bullet through every layer? are its blocking edges real? |
| Published | sub-issues of the spec with native "blocked by" links; only the first is free to start |
| Take the label off the spec | `ready-for-agent` stays on the tickets only, so nothing unattended builds the spec whole |
| Build | one `/implement-spec` run (lesson 8.2), or one session per ticket (lesson 8.1) |
| Land | read the pull request, try the preview, merge by hand when it carries migrations, confirm the deploy |

## Rules of thumb

- **The seams answer is yours.** Say how your tests avoid the network: a test that calls a real service fails whenever that
  service has a bad day. Decide separately what previews do; previews should behave like production.
- **The glossary change ships with the first ticket that adds code.** In Potluck a lint rule rejects the avoided words, so
  the words and the code that uses them change together.
- **Schema changes only add.** The spec should say so, and the pull request then needs a person at the merge.
- **Compute the frontier from merges.** GitHub unblocks a ticket only when its blocker closes, and tickets close when the
  pull request merges, so a run tracks merges into its integration branch.
- **A long run can stop.** Resume the session by its ID in its worktree and say what happened; ask it to stop before the
  review if you want to start the review yourself.
- **Check memory before many test workers.** Several agents each running a full test suite at once can exhaust a machine;
  capping the workers is cheap.

## It's working if

- the spec is on GitHub with the decisions, the new words and the test seams;
- every decision it made by itself has your answer, and nothing in it is something you never said;
- the tickets are sub-issues with "blocked by" links, only the first is free to start, and the spec has no `ready-for-agent`;
- the map is closed, its destination pointing at the spec;
- after the merge, the spec and every ticket are closed by the pull request, and the production deploy of the merge commit
  succeeded.

Credits: the `to-spec`, `to-tickets`, `wayfinder` and `implement-spec` skills are from
[mattpocock/skills](https://github.com/mattpocock/skills) by Matt Pocock (MIT License), described here in our own words.
This course is unofficial and not affiliated with or endorsed by Matt Pocock.
