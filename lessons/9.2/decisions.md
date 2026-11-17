# What each ticket decided (in our words)

In the order the tickets closed. Each line is the gist of the ticket's resolution comment and of its line in the map's
Decisions so far. Your answers decide yours.

| Ticket | Type | Session | Decided |
|---|---|---|---|
| #42 Where exchange rates can come from | research | lesson 9.1 | Frankfurter version 2 covers 154 of the 164 currencies in the picker, with history; seven fund and accounting codes have no free source |
| #43 How other apps handle more than one currency | research | lesson 9.1 | most convert once, when the amount is entered, and freeze the rate; overrides are common; plain rounding |
| #44 How a foreign amount becomes part of a balance | grilling | foreign-amount | convert once, at entry, with the rate for the expense's date, and freeze it; the group-currency amount counts, and a typed rate or the bank's amount can override it; convert the total, then split; round half up; no group setting; three new words (group currency, foreign amount, exchange rate) |
| #45 Settlements in another currency | grilling | A | a settlement works like an expense: converted once and frozen, the same overrides; one group-currency figure counts for both members; a suggested settlement switched to another currency keeps its group amount and works the foreign amount out backwards |
| #47 When a rate can't be looked up | grilling | B | the lookup runs on Potluck's server and only for requests with a valid group link; after 4 seconds the form falls back to a typed rate or the bank amount, never waiting or refusing; a temporary failure offers a retry, a currency that isn't covered doesn't; rates more than 30 days stale count as unavailable; no hard-coded list of currencies; saving doesn't look the rate up again; past dates cached indefinitely, today's for an hour; a "rate from Frankfurter" note |
| #50 What the forms and lists show for a foreign amount | prototype | the prototype session | variant A: the group-currency amount leads, a currency picker beside the amount and one quiet line with the converted amount, the rate and its source; the overrides stay folded until asked for or a lookup fails; a typed bank amount stays fixed when the foreign amount changes (the rule taken from B); B and C rejected |
| #48 Editing a foreign-amount expense or settlement, and changing the group currency | grilling | C | an edit keeps the frozen rate; a new date offers that date's rate as a one-tap switch; a new currency starts the conversion over; the group currency stays locked once anything is recorded |
| #49 Caps on foreign amounts | grilling | D | only the group-currency amount gets the 10 million cap; a foreign amount is bounded only by the parser's 12-digit limit; every refusal names the converted figure |

What's left: "Writing the spec", which is the map's destination itself (lesson 9.3).
