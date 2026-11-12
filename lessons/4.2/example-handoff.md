# Handoff: Potluck logic prototype

Written 2026-11-11. The previous session ran in `~/potluck` (the real repo). This session runs in `~/potluck-prototype`, which doesn't exist yet: create it. It won't load the previous session's memory notes, so **every rule the model needs is written out below**.

## The task

Build a **throwaway logic prototype** of how balances and settlements work: **one self-contained HTML file** (inline JS/CSS, no build step, no server, no database) that the user drives with buttons. The aim is to **find where the idea breaks**, not to ship anything. The UI can be plain. The logic must follow the rules below exactly, and it must show its working: each expense's shares, each member's balance, and the suggested settlements.

Don't touch `~/potluck` from this session. Bring findings back to the user. Anything that changes a definition or rule is decided there, not here.

## Read first (don't duplicate)

- `~/potluck/GLOSSARY.md`: the canonical words. Use them in the UI and in code names: **group, member, inactive member, expense, payer, participant, share, balance, settlement, suggested settlement, settled up**. Never say "payment" for a settlement, or "debt" for a balance.
- `~/potluck/docs/research/odd-cent-rounding.md`: the source of the odd-cent rule, including Spliit's code, which this prototype mirrors.
- `~/potluck/docs/adr/`: hosting and database decisions. These don't matter for this prototype.

## Rules the model must follow

These come from design sessions on 2026-11-10/11. They're settled, so don't re-open them. Implement them and report where they hurt.

**Money**
- One group has exactly one currency (ISO 4217). Every amount in the group is in that currency.
- Amounts are **integers in the currency's minor units**, never floats. The number of decimals comes from ISO 4217: USD/EUR 2, JPY 0, BHD/KWD 3. HUF is 2 in ISO even though browsers show 0.
- When formatting, always pass explicit `minimumFractionDigits`/`maximumFractionDigits` (equal to the ISO digits) to `Intl.NumberFormat`. Offer a few currencies in a picker, at least USD, JPY, BHD and HUF.
- Expense and settlement amounts are **positive only**. The cap is 10,000,000 in major units, so no zero, no negatives and no refunds. A refund is handled by editing or deleting the original expense.

**Members**
- A member has a name and a stable creation order. The group cap is 50 members.
- A member can be renamed at any time.
- A member can be deleted **only if no expense or settlement references them**. Otherwise they can only be made **inactive**.
- An inactive member is only "not pre-selected as a participant in new expenses". They still appear in balances and suggested settlements. They can still record settlements, can be picked by hand as payer or participant, and can be reactivated.

**Expenses**
- Fields: description, amount, date, **exactly one payer**, and the participants.
- Participants default to all *active* members.
- The payer is a participant only if they're included.
- An expense needs **at least one participant other than its payer**.
- The only split is **equal** among participants. There are no exact amounts, weights or percentages.
- An expense can be edited (amount, payer, participants) or deleted. Deletion is a hard delete after one confirmation, with no undo and no history.
- The group cap is 5,000 expenses.

**Shares (the odd-cent rule, after Spliit)**
- Let `n` be the number of participants, `q = floor(amount / n)`, and `r = amount mod n`.
- Every participant's share is `q`. The `r` leftover units then go one each to participants in a rotation:
  - Order the participants by member creation order into list `P`.
  - Set `offset = hash(expense id) mod n`.
  - Participants `P[(offset + i) mod n]` for `i = 0..r-1` get +1.
  - Use FNV-1a for `hash`, as Spliit does.
- Shares always sum exactly to the amount.
- This is a pure function of the expense: same id, amount and participants give the same shares, and nothing is stored.

**Balances**
- `balance(m) = Σ amounts of expenses m paid + Σ settlements m made − Σ m's shares − Σ settlements m received`.
- Positive means the group owes them. Negative means they owe the group.
- A group's balances always **sum to zero**. Assert this after every action.
- **Settled up** is the state where a member's balance is zero, however it got there. It doesn't require a settlement.

**Settlements**
- A record that member A paid member B an amount outside Potluck. Fields: from, to, amount, date.
- **Any positive amount** is allowed, whatever it does to balances. Partial payments, overpayments that push a balance past zero, and loans are all fine. A loan is recorded as a settlement from lender to borrower.
- A settlement is never an expense.
- Settlements can be edited or deleted like expenses.

**Suggested settlements**
- Recomputed after every change and never stored.
- The decided approach: take every member's net balance, then **greedily match debtors to creditors** to propose a small set of settlements that brings every balance to zero.
- Each suggestion needs a "record this settlement" button that prefills a settlement. Recording it makes it a real settlement.

## Known tension to probe first

The design calls suggested settlements "the smallest set". **Greedy matching doesn't always find the minimum number of settlements**, because finding the true minimum is a hard combinatorial problem. Build scenarios where greedy gives more settlements than necessary, and report how often that happens and how bad it gets at realistic sizes (4 to 10 members). Don't change the rule; report back.

## Other places the idea may break (suggested scenarios)

- **Editing an expense's participants** moves the leftover unit to someone else. Check whether that's visible and confusing.
- **Fairness over many expenses:** add 1,000 random small expenses and chart leftover units absorbed per member, compared with "first by creation order".
- **JPY** (0 decimals) with large `r`, such as 100 JPY among 7, and **BHD** (3 decimals).
- **Inactive member with a nonzero balance:** they must stay in suggested settlements.
- **Deleting a member** who's referenced must be refused. Deleting one who isn't must work.
- **Overpayment and loans:** balances cross zero. Check that suggested settlements flip direction sensibly.
- **Payer not a participant** (a gift), and the invalid case where the payer is the *only* participant (must be rejected).
- **Settlement from a member to themselves:** *not decided.* Report what seems right, but don't decide it.
- **Caps:** 50 members, 5,000 expenses and the amount cap. Is anything slow at the caps?
- **Many-to-many:** 4 flatmates, a month of mixed expenses plus a trip. This is the real first group, the user's flat, who also travel together.

Nice extras if cheap: a "scenario" dropdown that loads each case above; an export/import of the state as JSON so a breaking case can be shared.

## Out of scope for v1 (don't build)

Accounts, a multi-currency group, more than one payer per expense, unequal splits, recurring expenses, categories and receipts, an activity log, undo or restore, archiving, settlement periods, real money movement, a backend, persistence beyond optional `localStorage`.

## Open items elsewhere (context only)

- Real backups are a launch blocker, decided later in `~/potluck`.
- A questionnaire for the flatmate who tracks the flat's money is out with the user. Its answers may challenge "one currency per group" and "one payer per expense". Don't assume the answers.

## Suggested skills

- **`mattpocock-skills:prototype`**: call this first. It's the skill for a throwaway prototype that answers a design question about a state model or logic.
- **`mattpocock-skills:grilling`**: if the prototype surfaces a real decision, such as self-settlement or greedy vs. optimal matching, put it to the user as a question with a recommendation. Don't decide it yourself.
- **`mattpocock-skills:domain-modeling`**: only if a finding shows a glossary word is wrong. Glossary changes are made in `~/potluck`, not in the prototype folder.

## Git

`~/potluck-prototype` isn't a repo and needn't become one unless the user asks. Commit or push only when asked.
