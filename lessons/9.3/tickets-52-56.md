# The five tickets, as published

`/to-tickets` published these as sub-issues of spec #51, labelled `ready-for-agent`, with GitHub's native "blocked by"
links. Text as on GitHub at the tag `lesson-9.3` (all five closed by the merge of pull request #57).

| Ticket | Blocked by |
|---|---|
| #52 Record an expense with a foreign amount at a typed rate | none |
| #53 Propose an exchange rate from Frankfurter | #52 |
| #54 Record a settlement with a foreign amount | #53 |
| #55 Switch a suggested settlement to another currency | #54 |
| #56 Edit an expense or settlement with a foreign amount | #54 |

## #52 Record an expense with a foreign amount at a typed rate

## Parent

#51 (Spec: multi-currency groups)

## What to build

A payer can record an expense in any currency from the picker by typing the exchange rate, or the amount their bank charged in the group currency. There's no rate lookup yet. The expense counts in balances and shares exactly like a v1 amount, at its group-currency figure. The list shows what was really paid.

- **Words:** GLOSSARY.md changes as #51 sets out:
  - Group is reworded;
  - Group currency, Foreign amount and Exchange rate are added, with their _Avoid_ lists.
- **Pure conversion module** (shared by the form and the group service):
  - converts a foreign amount forward with a rate, half up to the group currency's minor unit, in exact decimal arithmetic (no floats);
  - works a rate out from a foreign amount and a bank amount;
  - shows a rate to 6 significant digits.
- **Storage:** an add-only migration adds the foreign amount, foreign currency and exchange rate to expenses. All three are null or all three are set and positive.
- **Group service:** adding an expense takes an optional foreign part, and the view returns it. The service stores what the form sent and never fetches a rate. It refuses:
  - an unknown foreign currency, or the group currency;
  - a foreign amount that's unreadable, not positive, or over 12 whole digits;
  - a rate that's unreadable or not more than zero;
  - a group-currency amount that doesn't agree with the foreign amount and rate: it must be within 1 minor unit of the half-up conversion, or within 0.5% of foreign amount × rate.
- **Refusals that name the converted figure:**
  - over the cap: "This converts to more than 10,000,000 EUR, the most one expense can be.";
  - too small to split: "€0.01 is too small to split among 4."

  Both show in the form before saving, and the service checks them on every save. Nothing rounds up automatically.
- **Expense form:**
  - A currency picker sits beside the amount, defaulting to the group currency. Picking another one opens "Exchange rate (1 CHF = ? EUR)" and "Or what your bank charged (EUR)". Changing one field updates the other.
  - The quiet line reads "= €50.22 · 1 CHF = 1.0463 EUR · typed".
  - Once a bank amount is typed, changing the foreign amount keeps the bank amount and works the rate out from it. Otherwise it keeps the rate and recalculates the group-currency amount, in the browser.
- **Expense row:** the amount column is unchanged. The grey line begins "Paid $48.60 at 1 USD = 0.925926 EUR · ". Shares stay in the group currency, and each amount uses its own currency's digits.

## Acceptance criteria

- [ ] GLOSSARY.md carries the reworded Group and the three new words; lint rejects their _Avoid_ words.
- [ ] Pure module tests: half-up at the .5 boundary; 0-, 2- and 3-digit currencies (e.g. JPY→EUR, EUR→KWD); a rate from a bank amount; display to 6 significant digits; a property test against a BigInt reference. Expected values are worked by hand.
- [ ] Group service tests:
  - the four values are stored and returned;
  - the group-currency amount counts in balances and shares, split by the odd-cent rule;
  - each new refusal;
  - the agreement check, including a bank-amount rate;
  - the over-cap and too-small-to-split refusals on a converted figure;
  - an expense without a foreign part behaves exactly as v1.
- [ ] A group that never records a foreign amount looks and behaves as today. The only change is the currency picker beside the amount.
- [ ] Playwright (desktop and phone, local dev server): record an expense with a typed rate and with a typed bank amount, then see the quiet line, the list row and balances.
- [ ] Screenshots in `docs/evidence/issue-<n>/`.



## #53 Propose an exchange rate from Frankfurter

## Parent

#51 (Spec: multi-currency groups)

## What to build

Picking a foreign currency, or changing the date, makes Potluck propose an exchange rate from Frankfurter v2 for the expense's date. A missing rate never blocks recording.

- **Rate lookup:** a module on Potluck's server, reached through one endpoint gated by the group link (read AGENTS.md for this Next version). It answers one of:
  - **found**: the rate and the date it was published for;
  - **unavailable**: the pair or date isn't covered, or the rate is more than 30 days older than the entry's date;
  - **temporary failure**: the source errored, or there was no answer within 4 seconds.
- **What it asks for:** the rate on the entry's date, or the latest one before it; a future date gets the latest. There's no hard-coded coverage list: the source's answer decides.
- **Cache**, keyed by foreign currency + group currency + date, kept somewhere that survives serverless instances:
  - past dates: forever;
  - today and future dates: 1 hour;
  - unavailable: 1 hour;
  - temporary failures: never.
- **Dependencies:** the rate source and the clock are injected.
- **Fake source:** the base URL comes from configuration. Local dev and tests use a fake source served by Potluck itself. Previews and Production call Frankfurter, and the fake is never served on any Vercel deployment. The fake's fixed answers depend on the currency code: a rate on the asked date, a rate from an earlier day, slow (past 4 s), down, and not covered.
- **Form:**
  - A lookup runs only when the currency or date changes. No lookup runs for the group currency.
  - The quiet line reads "= €50.22 · 1 CHF = 1.0463 EUR · rate from Frankfurter", plus "· rate of 13 Nov 2026" when the rate's date differs from the entry's.
  - The override fields fold behind "Use another rate or my bank's amount". "Use Frankfurter's rate" goes back to the looked-up rate.
  - Looking up: "Looking up the CHF rate… You can type it instead." with "Type the rate instead".
  - Temporary failure: "Couldn't get a rate right now." with **Try again**, then "Or type the rate, or what your bank charged in EUR."
  - Permanent failure: "No rate available for CHF on this date. Type the rate, or what your bank charged in EUR." No retry.
  - Both failures open the override fields. Typing is allowed throughout, and typed input wins over a late answer.
- **Saving** never fetches a rate.

## Acceptance criteria

- [ ] Rate lookup tests (fake source, fixed clock):
  - found;
  - an earlier-day rate;
  - a future date gets the latest rate;
  - 30 days stale is proposed, 31 days is unavailable;
  - not covered is unavailable;
  - an error or the 4 s timeout is temporary;
  - each cache lifetime;
  - an unknown group link is refused.
- [ ] The fake is never reachable on a Vercel deployment; previews and Production use Frankfurter.
- [ ] Playwright (local dev server with the fake) runs these paths:
  - a rate found, then save;
  - an earlier-day rate shows "rate of …";
  - the looking-up state, then the timeout;
  - a temporary failure, then Try again;
  - a permanent failure, then a typed rate;
  - typing during the lookup wins over the late answer.
- [ ] Screenshots in `docs/evidence/issue-<n>/`.



## #54 Record a settlement with a foreign amount

## Parent

#51 (Spec: multi-currency groups)

## What to build

A member can record a settlement in another currency, such as handing over euros in cash in a franc group. It's converted and frozen exactly like an expense. The one group-currency figure raises the paying member's balance and lowers the receiving member's balance by the same amount, so balances still sum to zero.

- **Storage:** an add-only migration adds the foreign amount, foreign currency and exchange rate to settlements, with the same check constraint as expenses.
- **Group service:** adding a settlement takes the optional foreign part, with the same checks and refusals as an expense, and the view returns it. A foreign amount that converts to zero is refused with its own message: "This converts to less than €0.01." The over-cap refusal names the converted figure, adapted for settlements.
- **Settlement form:** the same currency picker, rate lookup, quiet line, overrides, failure states and linked-field rule as the expense form.
- **Settlement row:** "Cai paid Ana €638.05 ($689.09)": the group-currency amount, then the foreign amount in grey brackets.

## Acceptance criteria

- [ ] Group service tests: the settlement's four values are stored and returned; both members' balances move by the group-currency figure; each refusal, including converting to zero and over the cap; a settlement without a foreign part behaves exactly as v1.
- [ ] Playwright (local dev server with the fake): record a settlement with a looked-up rate and one with a typed bank amount; see the row and balances.
- [ ] Screenshots in `docs/evidence/issue-<n>/`.



## #55 Switch a suggested settlement to another currency

## Parent

#51 (Spec: multi-currency groups)

## What to build

A member records a suggested settlement and switches its currency. The group-currency amount stays at the suggested figure, and Potluck proposes the foreign amount by working backwards, rounded half up to the foreign currency's minor unit. The quiet line shows the rate. Saving it brings both members' balances to exactly zero. If the member then types a different foreign amount (e.g. the €40 actually handed over), it converts forward as usual, and a small remainder may stay on the balances.

- **Pure conversion module:** gains working backwards from a group-currency amount and a rate.
- A worked-backwards foreign amount of zero or less gets the v1 refusals.
- Once saved, it's an ordinary settlement. Editing it never works backwards again.

## Acceptance criteria

- [ ] Pure module tests: working backwards across 0-, 2- and 3-digit currencies, and converting forward again gives the suggested figure. Expected values are worked by hand.
- [ ] Group service test: a settlement saved from a worked-backwards foreign amount leaves both members settled up.
- [ ] Playwright (local dev server with the fake): record a suggested settlement in another currency and see both members settled up. Then type a different foreign amount and see the small remainder.
- [ ] Screenshots in `docs/evidence/issue-<n>/`.



## #56 Edit an expense or settlement with a foreign amount

## Parent

#51 (Spec: multi-currency groups)

## What to build

Editing an expense or settlement with a foreign amount never replaces its frozen exchange rate silently.

- **Description, payer, participants, or a settlement's members:** the foreign amount, currency, group-currency amount and rate all stay as they are. Nothing is looked up.
- **Foreign amount:** the stored rate is kept, and the group-currency amount is recalculated in the browser. A typed rate or bank amount works as on a new entry.
- **Date:** the stored rate is kept, and the new date's rate is looked up. If one is found, it's offered on a second line under the quiet line: "Rate for 13 Nov: 1 CHF = 1.0470 EUR · Use this rate". One tap applies it as if it had just been looked up, and the source note returns. If the lookup fails, nothing is offered.
- **Currency:** the conversion starts over like a new entry. Switching to the group currency clears the foreign part, and the entry becomes a plain amount. Picking a currency on a plain entry adds a foreign part.
- **The edit page** opens with the quiet line, showing the saved rate in place of the source note.
- **Unchanged:** the "this changed, reload" version check, and the rule that the group currency stays locked once anything is recorded.

## Acceptance criteria

- [ ] Group service tests, for expenses and settlements:
  - an edit keeps the foreign part;
  - an edit replaces it;
  - an edit clears it;
  - an edit adds one to a plain entry;
  - converted-figure refusals still apply on an edit that keeps the frozen rate;
  - a stale version is refused;
  - changing the group currency is still refused once anything is recorded.
- [ ] Playwright (local dev server with the fake), on desktop and phone:
  - edit the foreign amount and see the rate kept;
  - change the date and take the offered rate;
  - change the date while the source is down and see no offer;
  - switch an entry back to the group currency.
- [ ] Screenshots in `docs/evidence/issue-<n>/`.



