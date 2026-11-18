# Spec #51, as published

The spec `/to-spec` wrote from map #41, as it stands on GitHub at the tag `lesson-9.3`: after our two corrections (previews
call Frankfurter; Playwright runs locally against the fake), and after the run reworded the 30-day rule for future dates. It
was closed by the merge of pull request #57.

---

# Spec: multi-currency groups

Destination of map #41. Every decision below was made in that map's tickets (#42–#50) unless **Further Notes** says it was settled while writing this spec.

## Problem Statement

A group keeps its balances in one currency, but its members don't always spend in it. On a trip abroad, a member pays for dinner in Swiss francs, a train in euros, or a hotel in dollars, while the group keeps its balances in euros. Today Potluck only accepts amounts in the group's currency, so whoever records the expense has to look up a rate, do the conversion in their head or a calculator, and type the result. Nobody else can see what was paid in which currency, or at what rate. The figure the member's bank actually charged often differs from any published rate, and there's nowhere to put it. The same happens when one member pays another back in a different currency: handing over €40 in cash to settle a franc balance. Apps that keep separate balances per currency leave the group with several half-settled ledgers. Apps that convert everything at today's rate change last month's amounts after the fact.

## Solution

Any expense or settlement can be recorded in any currency from the picker. Potluck converts it into the **group currency** once, when it is recorded, and freezes the result. Balances, shares and suggested settlements keep working exactly as today, on that group-currency amount.

The amount field gets a currency picker beside it, defaulting to the group currency. Picking another currency turns the typed number into a **foreign amount**. Potluck looks up an **exchange rate** for the entry's date from Frankfurter, a free rate source. One quiet line then shows what the entry will count as: "= €50.22 · 1 CHF = 1.0463 EUR · rate from Frankfurter". If the member's bank charged something different, they can type either the rate or the amount the bank charged in the group currency. A missing rate never blocks recording: when Frankfurter is down, slow, or has no rate for that currency or date, the form asks for a typed rate or bank amount. Lists show the group-currency amount as they do today, with the foreign amount quietly beside it. Editing never reconverts silently. A group that never uses another currency sees nothing new except the currency picker beside the amount.

## User Stories

### Recording an expense with a foreign amount

1. As a payer, I want a currency picker beside the amount field, so that I can record an expense in the currency I actually paid in.
2. As a payer, I want the picker to default to the group currency, so that the common case is unchanged and takes no extra tap.
3. As a payer, I want to pick any currency from the same list the group's currency comes from, so that I'm never stuck because a currency is missing.
4. As a payer, I want Potluck to propose an exchange rate for the expense's date as soon as I pick a currency, so that I don't have to look one up myself.
5. As a payer, I want to see the group-currency amount, the exchange rate and where the rate came from on one line under the amount before I save, so that I know exactly what the expense will count as.
6. As a payer, I want what I saw before saving to be exactly what is stored, so that the figure never shifts after I tap save.
7. As a payer, I want the group-currency amount to update as I type the foreign amount, without waiting, so that I can check the figure as I go.
8. As a payer, I want the rate published for the expense's date, or the latest one before it when that date has none (weekends, holidays), so that the conversion matches the day I paid.
9. As a payer, I want the line to say which day the rate is from when that day differs from the expense's date, so that I'm not misled about a weekend or holiday rate.
10. As a payer recording an expense with a future date, I want the latest published rate, so that I can still record a booking in advance.
11. As a payer, I want a short "rate from Frankfurter" note next to a looked-up rate, so that I know where it came from.
12. As a payer, I want the total converted once and then split with the usual odd-cent rule, so that shares still add up exactly to the expense.
13. As a participant, I want my share shown in the group currency, so that it adds up with everything else I owe or am owed.
14. As a payer whose bank charged a different figure, I want to type the amount my bank charged in the group currency, so that the group repays me what I actually paid.
15. As a payer who knows the rate I got, I want to type the exchange rate instead, so that the conversion uses my rate.
16. As a payer, I want typing a rate to update the bank amount and typing a bank amount to update the rate, so that the two never disagree.
17. As a payer, I want the rate and bank-amount fields folded away behind "Use another rate or my bank's amount", so that the form stays simple when Frankfurter's rate is fine.
18. As a payer who typed a rate or bank amount, I want a "Use Frankfurter's rate" button, so that I can go back to the looked-up rate.
19. As a payer who typed a rate or bank amount, I want the line to say "typed" in place of the source note, so that nobody thinks Frankfurter proposed it.
20. As a payer who typed what my bank charged, I want that bank amount to stay fixed when I then correct the foreign amount, so that the figure from my statement isn't overwritten.
21. As a payer who didn't type a bank amount, I want changing the foreign amount to keep the rate and recalculate the group-currency amount, so that fixing a typo in the foreign amount behaves as expected.
22. As a payer, I want the group-currency amount rounded to the nearest minor unit of the group currency, half up, so that the conversion is predictable.
23. As a payer, I want a typed rate or bank amount to win over that rounding, so that my bank's exact figure is what counts.
24. As a payer, I want to record a foreign amount in a group that never set up any other currency, so that there's nothing to switch on first.

### When a rate can't be looked up

25. As a payer, I want to see "Looking up the CHF rate… You can type it instead." while Potluck waits for a rate, so that I know something is happening.
26. As a payer, I want to type a rate or bank amount while the lookup is still running, so that a slow rate source never holds me up.
27. As a payer who already typed a rate, I want a late answer from Frankfurter to leave my typed rate alone, so that what I entered isn't overwritten.
28. As a payer, I want Potluck to stop waiting after 4 seconds, so that I'm never stuck on a spinner.
29. As a payer, when the rate source is down or slow, I want "Couldn't get a rate right now." with a Try again button, so that I can retry a passing problem.
30. As a payer, when no rate exists for my currency or date, I want "No rate available for CHF on this date." with no retry, so that I don't keep retrying something that will never work.
31. As a payer, I want the rate and bank-amount fields to open on their own after either failure, so that I can carry on straight away.
32. As a payer, I want to record an expense in a currency no rate source covers (e.g. a fund code), by typing the rate or the bank amount, so that the picker never offers a currency I can't use.
33. As a payer, I want a rate more than 30 days older than the expense's date (or than today, for a future date) to count as unavailable, so that a long-stale rate isn't proposed as if it were current.
34. As a member of a group whose own currency no rate source covers, I want every foreign amount to ask for a typed rate or bank amount, so that the group still works.
35. As a payer, I want saving never to depend on the rate source being up, so that an outage at the moment I tap save loses nothing.
36. As a payer recording in the group currency, I want no lookup at all, so that the common case is as fast as today.

### Settlements with a foreign amount

37. As a member paying someone back, I want to record a settlement in another currency, so that handing over cash in the local currency can be recorded as it happened.
38. As a member, I want a settlement's foreign amount converted and frozen exactly like an expense's, with the same rate lookup, overrides, fallback and rounding, so that there's one way to do it.
39. As the member who paid and the member who was paid, I want the settlement to count as the same group-currency figure for both of us, so that balances still sum to zero.
40. As a member recording a suggested settlement, I want switching its currency to keep the suggested group-currency amount and propose the foreign amount worked backwards, so that saving it settles us up exactly.
41. As a member, I want the worked-backwards foreign amount rounded half up to that currency's minor unit, so that it's an amount I can actually hand over.
42. As a member who actually handed over a different foreign amount (e.g. €40 in cash), I want typing it to convert forward as usual, so that the record matches what happened, even if a small remainder stays on our balances.

### Lists and the expense view

43. As a member, I want the expense list's amount column to keep showing the group-currency amount, so that the column adds up and reads as it does today.
44. As a member, I want an expense with a foreign amount to show "Paid $48.60 at 1 USD = 0.925926 EUR" at the start of its grey line, so that I can see what was really paid and at what rate.
45. As a member, I want a settlement with a foreign amount to read "Cai paid Ana €638.05 ($689.09)", so that the group-currency amount leads and the foreign amount stays visible.
46. As a member, I want shares always shown in the group currency, so that they add up to my balance.
47. As a member opening an expense or settlement with a foreign amount, I want the same quiet line with the saved rate in place of the source note, so that I can see what was frozen.
48. As a member, I want expenses and settlements without a foreign amount to look exactly as they do today, so that nothing changes for groups that don't need it.
49. As a member, I want amounts in each currency shown with that currency's own minor units, so that yen have no decimals and dinars have three.

### Editing

50. As a member, I want editing an expense's description, payer or participants to leave its foreign amount, currency, group-currency amount and exchange rate untouched, so that unrelated edits don't move money.
51. As a member, I want editing a settlement's members to leave its conversion untouched, for the same reason.
52. As a member correcting a foreign amount, I want the stored exchange rate kept and the group-currency amount recalculated from it, so that a typo fix doesn't silently pick up a new rate.
53. As a member correcting the foreign amount, I want to type a rate or bank amount just as on a new entry, so that I can fix the conversion at the same time.
54. As a member changing the date, I want the stored rate kept and the new date's rate offered beside it, one tap to switch, so that I choose whether the conversion changes.
55. As a member changing the date while the rate source is unavailable, I want the stored rate kept and nothing offered, so that the edit still works.
56. As a member changing the currency, I want the conversion to start over like a new entry, so that a wrong currency is easy to fix.
57. As a member changing the currency back to the group currency, I want the foreign amount and rate removed, so that the entry becomes a plain amount.
58. As a member, I want to add a foreign amount to an entry first recorded in the group currency, by picking a currency, so that I can fix an entry recorded in the wrong currency.
59. As a member editing a settlement first recorded from a suggestion, I want it to behave like any other stored settlement, never working backwards again, so that it doesn't quietly follow today's balances.
60. As a member, I want the "this changed, reload" check to work on foreign-amount entries as it does today, so that nobody overwrites someone else's edit.

### Limits and refusals

61. As a member, I want the 10,000,000 cap applied to the group-currency amount only, so that ordinary amounts in currencies with large numbers (10,000,000 VND is about €350) aren't refused.
62. As a member, I want an amount that converts to more than the cap refused with "This converts to more than 10,000,000 EUR, the most one expense can be." (or the settlement equivalent), so that I know the conversion is the problem.
63. As a member, I want an expense whose converted amount is smaller than its number of participants refused with the converted figure, e.g. "€0.01 is too small to split among 4.", so that I see why.
64. As a member, I want that check visible in the form before saving, so that I'm not surprised on save.
65. As a member, I want a settlement whose foreign amount converts to zero refused with "This converts to less than €0.01.", so that the message names the real problem.
66. As a member, I want a typed rate refused only when it isn't more than zero, so that any real rate, however extreme, can be entered.
67. As a member, I want a typed bank amount checked like any v1 amount (positive, under the cap, enough to split), so that the usual rules hold.
68. As a member, I want a foreign amount that is zero, negative, unreadable or more than 12 digits refused like a v1 amount, so that typos are caught.
69. As a member, I want nothing rounded up automatically to get past a refusal, so that the stored figure is always one I saw.

### The group currency

70. As an organizer, I want the group currency still changeable only while the group has no expenses and no settlements, so that existing amounts never change meaning.
71. As an organizer, I want entries never reconverted into a new group currency, so that frozen figures stay frozen; a group that picked the wrong currency starts again as in v1.
72. As a member of an existing group, I want everything to behave exactly as today until someone records a foreign amount, so that the change costs nothing to groups that don't need it.

### Privacy

73. As a member, I want rate lookups made from Potluck's server, so that the rate source never sees my device or anything about the group's members.
74. As a member, I want only someone holding the group link to be able to trigger a rate lookup, so that the endpoint isn't an open proxy.
75. As the operator, I want looked-up rates cached, so that Potluck doesn't hammer a free rate source.

## Implementation Decisions

### Words (GLOSSARY.md changes with this spec)

- **Group** reworded: "A set of members who share expenses, keeping their balances in one group currency." _Avoid_ unchanged.
- **Group currency** (new): "The one currency a group's balances, shares and settlements are in." _Avoid_: Base currency, home currency, default currency.
- **Foreign amount** (new): "An expense's or settlement's amount as paid, in a currency other than the group currency." _Avoid_: Original amount, source amount.
- **Exchange rate** (new): "How many units of the group currency one unit of a foreign amount's currency was worth, for the expense or settlement it belongs to." _Avoid_: Conversion rate, FX rate.
- Expense, Settlement, Share and Balance keep their definitions. An expense's or settlement's plain **amount** stays the group-currency figure.
- The lint rule rejects names using the new _Avoid_ words, so the glossary edit lands in the first change that adds code.

### Conversion model

- **Convert once, at entry, and freeze.** The group-currency amount is the entry's amount: balances, shares, the odd-cent rule, suggested settlements and caps all use it, unchanged from v1. The money engine (`computeGroupMoney`) does not change.
- An expense or settlement with a foreign amount stores four things: the foreign amount (integer minor units of its currency, per ISO 4217), its currency, the group-currency amount (the existing amount column), and the exchange rate shown at save. Nothing records whether the rate was looked up, typed, or worked out from a bank amount.
- **Rounding:** group-currency amount = foreign amount × exchange rate, rounded half up to the group currency's minor unit, using exact decimal arithmetic (no floats anywhere, per the coding standards). A typed bank amount wins over the rounding: the rate is then worked out from it.
- **Working backwards** (a suggested settlement switched to another currency): foreign amount = group-currency amount ÷ exchange rate, rounded half up to the foreign currency's minor unit. The group-currency amount stays the suggested figure.
- **No group setup:** any picker currency except the group currency counts as a foreign currency on any entry. There's no allowed-currency list and no switch.

### Pure conversion module (new, under the money folder)

- A pure module the browser form and the group service both import, so that both compute identical figures. It has no I/O and is deep: callers pass amounts and currency digits and get minor units or a rate back. Rounding and decimal arithmetic stay hidden inside it.
- Operations: convert a foreign amount forward with a rate; work a foreign amount backwards from a group-currency amount; work a rate out from a foreign amount and a bank amount; format a rate for display (6 significant digits, e.g. 0.925926, 1.0463).
- Rates go in and out as decimal strings, never floats. Preconditions (positive amounts, rate > 0, known digits) go in doc comments, per the coding standards. The service refuses bad input; the functions don't re-check it.

### Group service changes (the seam the pages call)

- `AddExpenseInput`, `EditExpenseInput`, `AddSettlementInput` and `EditSettlementInput` gain an optional foreign part: the foreign amount as typed, its currency, and the exchange rate. When it's present, `amount` is the group-currency amount as shown in the form. When it's absent, behaviour is exactly v1.
- **No re-fetch on save.** The service stores what the form sent ("what you see is what's frozen"). It checks that the foreign currency is a picker code other than the group currency, that the foreign amount and the rate are readable and positive, and that the group-currency amount agrees with them. The agreement tolerance is set in **Further Notes**.
- New refusal reasons, with the v1 reasons kept for the group-currency amount:
  - foreign currency unknown, or equal to the group currency;
  - foreign amount unreadable, not positive, or too large (more than 12 whole digits, the parser's limit);
  - exchange rate unreadable or not more than zero;
  - group-currency amount inconsistent with the foreign amount and rate;
  - for a settlement, a foreign amount that converts to zero ("converts to less than €0.01").
- The v1 checks on the group-currency amount (positive, at most `LIMITS.amountMajorUnits`, at least as many minor units as participants) run on every save, including edits that keep the frozen rate. The messages name the converted figure when a foreign amount is present. No cap on the foreign amount itself.
- `ExpenseView` and `SettlementView` gain an optional foreign part: the foreign amount (minor units), its currency, its digits, and the exchange rate (decimal string). `amount` stays the group-currency amount.
- Edits: the service stores whatever the edit sends. Keeping the frozen rate, offering the new date's rate, and starting over on a currency change are form behaviour; the service checks them like any save. Sending no foreign part clears it (switching back to the group currency).
- Changing the group currency: unchanged. Refused once the group has any expense or settlement.

### Schema (add-only migration)

- `expenses` and `settlements` each gain three nullable columns: foreign amount (bigint, minor units), foreign currency (text), and exchange rate (exact numeric, not a float type).
- A check constraint per table: either all three are null, or all three are set with foreign amount > 0 and exchange rate > 0.
- Existing rows keep nulls and behave as v1. `groups` is unchanged.

### Rate lookup (new module + one endpoint)

- One deep module answers `lookUpRate(linkToken, foreignCurrency, groupCurrency, date)` with one of:
  - **found**: the exchange rate (decimal string) and the date it was published for;
  - **unavailable** (permanent): the pair or date isn't covered, or the rate is too stale;
  - **temporary failure**: the source is down, erroring, or past the timeout.
- It checks the group link the same way every other action does. It runs only on Potluck's server, and the page reaches it through one Potluck endpoint (a server action or route, whichever fits this Next version; read `AGENTS.md`). No separate rate limit; the existing WAF rule on writes and the cache cover it.
- **Source:** Frankfurter v2 (`api.frankfurter.dev/v2`). Ask for the rate on the entry's date, or the latest published before it; for a future date, the latest. A rate whose own date is more than 30 days before the entry's date is **unavailable**; for a future date, the 30 days count back from today. There's no hard-coded coverage list: the source's answer decides. That covers BOV, CHE, CHW, COU, USN, UYW, XAD, CLF, MXV/VED before their history, and any currency before its first rate, and it applies when the group currency itself is uncovered.
- **Timeout:** 4 seconds, after which it answers temporary failure.
- **Cache**, on the server, keyed by foreign currency + group currency + date:
  - past dates: kept indefinitely;
  - today and future dates: one hour;
  - unavailable answers: one hour;
  - temporary failures: never cached.

  Where the cache lives is left to the build (an in-process cache doesn't survive Vercel's serverless instances, so a Postgres table is the natural fit).
- **Injected source and clock:** the module takes its rate source and its clock as dependencies, so tests can pass a fake source and a fixed "now".
- **Fake rate source for local runs and tests:** the rate source's base URL comes from configuration. Local dev and test runs use a fake rate source that Potluck serves itself. Preview deployments and Production both call Frankfurter, and the fake is never served on any Vercel deployment. The fake answers by currency code, with fixed, documented behaviour: a fixed rate on the asked date, a rate from an earlier day, slow (past the 4 s timeout), down (an error status), and not covered.
- What Frankfurter sees: Vercel's egress IP, the currency pair and the date. Nothing about members is sent. The privacy page doesn't change.

### Forms (expense and settlement; variant A of the #50 prototype)

- One amount field with a currency picker beside it, defaulting to the group currency. There is no separate "paid in?" question.
- A lookup runs only when the currency or date changes, never while the foreign amount is typed. Changing the foreign amount is recalculated in the browser with the pure conversion module.
- One quiet line under the amount once a rate is in: `= <group-currency amount> · 1 <foreign> = <rate> <group> · rate from Frankfurter`.
  - Add `· rate of <date>` when the rate's date differs from the entry's.
  - Show "typed" in place of the source note for a typed rate or a rate worked out from a bank amount.
  - The edit page shows the saved rate in place of the source note.
- A "Use another rate or my bank's amount" button opens two linked fields: "Exchange rate (1 CHF = ? EUR)" and "Or what your bank charged (EUR)". A "Use Frankfurter's rate" button returns to the looked-up rate.
- **Linked-field rule:** once a bank amount is typed, changing the foreign amount keeps the bank amount and works the rate out from it. Otherwise, changing the foreign amount keeps the rate and recalculates the group-currency amount.
- **Lookup states:**
  - Looking up: "Looking up the CHF rate… You can type it instead.", with a "Type the rate instead" button.
  - Temporary failure: "Couldn't get a rate right now." with **Try again**, then "Or type the rate, or what your bank charged in EUR."
  - Permanent failure: "No rate available for CHF on this date. Type the rate, or what your bank charged in EUR."
  - Both failures open the override fields on their own. Typing is allowed at every moment, and anything typed wins over a late answer.
- A suggested settlement switched to another currency: the group-currency amount stays at the suggested figure, and the foreign amount is proposed by working backwards.
- Edit form: see the rules under **Editing** in the user stories (#50–#59). The offer of a new date's rate is described in **Further Notes**.
- The too-small-to-split and over-cap messages show in the form before saving, from the converted figure.

### Lists

- **Expense row:** the amount column shows the group-currency amount, as today. The grey line begins "Paid $48.60 at 1 USD = 0.925926 EUR · " before the usual "Paid by Ben · 8 Oct 2026 · Edit".
- **Settlement row:** "Cai paid Ana €638.05 ($689.09)", with the foreign amount in grey brackets.
- Shares stay in the group currency. Each amount uses its own currency's digits, passed explicitly to `Intl` as in v1.

## Testing Decisions

- A good test drives a module through its public function and asserts what a caller can observe: refusals, the stored and returned view, balances, and what the page shows. It never asserts on internals. Expected figures are worked by hand in a comment above the test, never taken from running the code. Each test spells out its own input as literals, per the coding standards.
- **Group service** (PGlite, the existing seam; prior art: `expenses.test.ts`, `edit-expenses.test.ts`, `settlements.test.ts`, `edit-settlements.test.ts`, `group-settings.test.ts`). Covers:
  - storing and returning the four values;
  - a group-currency amount counted in balances and shares exactly like a v1 amount;
  - every new refusal, and the v1 refusals on converted figures (over cap, too small to split, settlement converting to zero);
  - the agreement check, including a bank-amount-derived rate;
  - edits that keep, replace or clear the foreign part;
  - the stale-version check;
  - the group currency staying locked;
  - groups without foreign amounts behaving exactly as v1.
- **Pure conversion module** (prior art: `group-money.test.ts`). Covers:
  - half-up rounding at the .5 boundary;
  - 0-, 2- and 3-digit currencies in both directions (e.g. JPY→EUR, EUR→KWD);
  - working backwards so that converting forward again gives the suggested figure;
  - a rate worked out from a bank amount;
  - display to 6 significant digits.

  A property test (prior art: `expenses.property.test.ts`) checks that forward conversion never uses floats, by comparing against a BigInt reference.
- **Rate lookup** (new seam; fake source and fixed clock injected). Covers:
  - found;
  - earlier-day rate (weekend);
  - future date → latest;
  - rate 30 days stale (proposed) vs 31 days stale (unavailable);
  - not covered → unavailable;
  - source error or 4 s timeout → temporary;
  - each cache lifetime (past forever, today 1 h, unavailable 1 h, temporary never);
  - refusal of an unknown group link.
- **Playwright** (prior art: `add-expense.spec.ts`, `settle-up.spec.ts`, `edit-and-delete.spec.ts`; desktop and phone), against the local dev server, which uses the fake rate source. Covers:
  - recording a foreign-amount expense and seeing the quiet line, the list row and balances;
  - a rate from an earlier day;
  - the looking-up state, then the timeout;
  - the temporary failure with Try again;
  - the permanent failure, then a typed rate and a typed bank amount;
  - a suggested settlement switched to another currency settling both members up;
  - editing the date and taking the offered rate;
  - switching back to the group currency.

  Screenshots go in `docs/evidence/issue-<n>/` as for v1.

  Playwright runs locally against the dev server, never in CI (CI runs only `npm run check`), so every browser test gets the fake.

## Out of Scope

- Per-member home currencies (each member seeing balances in their own currency).
- Separate balances per currency.
- Reconverting entries, or changing the group currency once anything is recorded.
- Bank or ATM fees as something to split. Typing the amount the bank charged is in scope.
- Crypto and other non-ISO 4217 currencies.
- Rate charts or rate history in the UI.
- Exchange-rate sources other than Frankfurter v2 (ExchangeRate-API, fawazahmed0 and ECB were researched in #42 and not chosen). Coverage gaps fall back to a typed rate.
- Recording whether a rate was looked up or typed.
- An allowed-currency list or a per-group on/off switch.

## Further Notes

- **Settled while writing this spec, not in the map's tickets** (reopen any of them if they're wrong):
  - **Agreement tolerance on save.** Without a stored "how was this rate made" value, the service can't tell a rounded conversion from a bank-amount override. So it accepts the group-currency amount when it is within 1 minor unit of the half-up conversion, or within 0.5% of foreign amount × rate. This catches garbled input, not deliberate overrides.
  - **Stored rate precision.** Looked-up rates are stored as Frankfurter gives them. A rate worked out from a bank amount is stored to 10 significant digits. Rates are shown to 6.
  - **The offered rate on a date edit.** #48 left its look to #50, and #50 didn't settle it. This spec puts it on a second line under the quiet line: "Rate for 13 Nov: 1 CHF = 1.0470 EUR · Use this rate". Tapping it applies the rate as if just looked up, and the source note returns.
  - **Fake rate source.** Only local runs and tests use it. Previews call Frankfurter like Production. Playwright runs only locally against the dev server, so every browser test uses the fake.
- Research behind the decisions: `docs/research/exchange-rate-sources.md` (branch `research/exchange-rate-sources`) and `docs/research/multi-currency-in-other-apps.md` (branch `research/multi-currency-in-other-apps`).
- UI prototype (throwaway, never merged): branch `prototype/foreign-amount-ui`, variant A screenshots `*-A-*.png`.
- Spliit's open bugs, from #43, are why shares are never converted one by one and why a typed bank amount updates the rate.


