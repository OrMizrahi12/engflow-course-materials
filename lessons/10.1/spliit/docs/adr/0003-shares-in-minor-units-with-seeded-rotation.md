# Shares are whole minor units, with leftovers rotated by an expense-ID hash

An expense's shares are computed in one place (`getExpenseShares` in `src/lib/shares.ts`), as whole minor units that always add up to exactly the expense amount, whatever the split mode. Each participant gets the floor of their exact share, and the leftover units go out by largest remainder (Hamilton apportionment). In an even split the remainders tie, so the starting position is rotated by an FNV-1a hash of the expense ID rather than by a stored cursor or randomness.

**Source of the reason:** PR #562 "Shares" (`67a8f8d`, 2026-08-13, by BastiOfBerlin). There were three disagreeing share implementations (totals, balances and the CSV export). Rounding each float share separately showed 95.00 split three ways as 31.67 each, and left balances that didn't add up to zero. On the seed, the PR says: "Seeding the rotation with the expense id rather than a persisted cursor keeps the split a pure function of the expense — no migration, no state, same answer on every render." Without the rotation, "the same participant absorbs the extra unit on every single expense." Code comments on `hashString` and `apportion` give the same reasoning.

## Consequences

- The split depends on the expense ID, so the form needs the ID before saving to preview the exact split. PR #647 (`5f75ec8`) made the form create the ID up front.
- By-percentage and by-amount split values are treated as ratios, so stored rows that break the "adds up to 100% / to the amount" rule still split the full amount.
- Do not "simplify" this back to float division or to giving the leftover to the last participant.
