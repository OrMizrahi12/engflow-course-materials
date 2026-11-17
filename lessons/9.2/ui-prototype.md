# A prototype ticket: how #50 ran

## The question

#50, labelled `wayfinder:prototype`: what should the expense and settlement forms and lists show for a foreign amount? It
was blocked until the rate-lookup ticket (#47) closed, because the form also has to show the no-rate case.

## The shape the skill chose

The prototype skill's UI path, sub-shape A: the variants render on the page that already exists, chosen by a `?variant=`
URL parameter, with a floating bar to flip between them (arrows, and a menu that fakes each lookup outcome: rate found, rate
from an earlier day, slow, 4-second timeout, source down, no rate). Only the rendering swaps; the data fetching stays. The
variants must be structurally different, and the bar is hidden in production builds.

## The session

`claude -w foreign-amount-ui` (its own worktree), `/wayfinder 41 50`. It claimed #50 first, loaded the `prototype` skill,
read the existing forms and built for 14 minutes 39 seconds. Saving is switched off in the prototype; a dashed panel shows
the four values that would be stored. It pushed the variants to `prototype/foreign-amount-ui` (CI and the Vercel preview
passed) and linked the branch on the ticket. The pre-commit tests had failed twice when the machine ran out of memory, a
different test file each time (a known flaky-test issue in the repo); the full suite passed with two workers, 196/196, so
the session committed with `--no-verify`. Acceptable only on a branch that never merges.

## The three variants

| Variant | The form | The lists |
|---|---|---|
| A, quiet line | a currency picker beside the amount; one quiet line under it with the converted amount, the rate and "rate from Frankfurter"; the rate and bank-amount fields stay folded until asked for or a lookup fails | the group-currency amount leads; a grey line says what was paid, like "Paid $48.60 at" its rate |
| B, three linked fields | after you pick a currency, a box with the rate and the group-currency amount side by side, always editable | the foreign amount leads, with the group amount under it |
| C, choose how it counts | "Paid in" first, then one of three: Frankfurter's rate, a rate you type, or what your bank charged | rows read dollars, an arrow, euros |

## What we tried (on camera)

1. The group page in A, then B (Right arrow), then C (the bar's arrow).
2. The C form: dinner, paid in US dollars, 48. It offered Frankfurter's rate (44.44 euros); we picked "What my bank
   charged" and typed 44.44, and the rate was worked out from it.
3. The bar to A, with the values carried over: one quiet line, "typed". The bank amount changed to 45.10: the line and the
   rate followed.
4. The bar to B: the same values in the linked box. The bar's menu set "Source down". Changing the dollars to 52 kept the
   bank amount at 45.10 and moved the rate instead.
5. Pounds, which need a fresh lookup while the source is down: "Couldn't get a rate right now." with Try again, and a
   prompt to type the rate or what the bank charged.

## The verdict

`prompts/verdict.txt`: A wins, in the forms and the lists, with one rule taken from B (a typed bank amount stays fixed when
the foreign amount changes; the rate is worked out from it). The reason we gave in the video: balances live in the group
currency, and most of the time Frankfurter's rate is fine, so the overrides can stay folded away. The session recorded it
on #50 (the winner, the rule from B, B and C rejected with a reason each), closed the ticket and added the map line. The
prototype already behaved that way in all three variants, so nothing was rebuilt.

## What stays

The decision, on the ticket and the map. The code stays on `prototype/foreign-amount-ui`, never merged, with no pull
request; `main` is unchanged. When the feature is built from the spec, the winner is written properly, test-first, not
copied from the prototype.
