# Potluck decisions (Lesson 3.1)

The grilling from the lesson, as text: Claude's questions by title, the answers given on camera, and the design Claude
handed back, which was confirmed with "Yes, it matches. Write nothing yet: the repo comes first." Lesson 3.2 starts from
these decisions. If you grilled your own idea, keep your own answers instead.

## The questions, by round

**Round 1 (the frontier: decisions that depend on nothing else)**

1. Who is this for?
2. How long does a group last?
3. Which ways of splitting an expense?
4. Should each expense have a single payer?
5. Should each group use a single currency?
6. Record debts only, without moving money?
7. Should "who owes whom" be simplified?

**Round 2 (Q8 replaces Q2)**

8. Group lifespan
9. Identity and accounts
10. Rounding remainders
11. Removing members
12. Expense fields
13. Device and connectivity

**Round 3 (opened by "no accounts")**

14. Who can edit or delete?
15. Activity log and soft delete
16. Deleting a whole group
17. Leaked links
18. Abuse limits on a public, unauthenticated API
19. Data retention
20. Privacy posture
21. "My groups" on a device
22. Simultaneous edits

**Round 4 (after "now wrap up")**

23. Leaked links now mean permanent loss
24. Creating a group
25. "Who are you?" prompt
26. Settlements
27. Amount validation
28. Language

## The answers, as sent

Round 1 (pasted):

```text
1 No: a public app. Real people on the internet create their own groups, and it runs on free tiers. 2 I don't know. What does each option cost? 3 No: equal split among a chosen subset only, exact amounts later. 4 Yes. 5 Yes. 6 Yes. 7 Yes. Host and stack: not today, we pick those later.
```

Round 2 (pasted):

```text
8 No: open-ended groups only, archiving later. 9 Yes, (a): no accounts, the link is the way in. 10 Park it: I want to research how real apps handle the odd cent first. 11 Yes. 12 Yes. 13 Yes.
```

Round 3 (pasted):

```text
No sub-agent now: the odd cent gets its own research session. 14 Yes. 15 No: no log or restore in v1, deleting just asks to confirm. 16 No: one confirm and it's gone, no grace period. 17 Yes. 18 Yes. 19 Yes. 20 Yes. 21 Yes. 22 Yes. Now wrap up: ask only what is still open for the first version.
```

Round 4 (typed):

```text
23 yes, 24 yes, 25 yes, 26 yes, 27 yes, 28 yes
```

Confirmation (typed):

```text
Yes, it matches. Write nothing yet: the repo comes first.
```

Counted: 28 questions in 4 rounds. "No" five times (Q1, Q3, Q8, Q15, Q16), "I don't know" once (Q2), two decisions
parked (Q10 the odd cent, and host and stack).

## Potluck v1: the agreed design (as Claude wrote it)

### Product
- Public web app: anyone can create a group. It runs on free tiers.
- Mobile-first responsive web, online-only, no native app.
- English-only UI, with dates and amounts formatted for the visitor's locale.

### Groups and access
- No accounts. The long, unguessable group link is the only way in, and anyone holding it has full control.
- Creating a group takes a name, a currency and the initial members' names. Members can be added later.
- Groups are open-ended, with no archiving or settlement periods in v1.
- Each device asks "who are you?" the first time it opens a group. You can view without answering, but adding an expense requires it, and the answer can be changed any time.
- Each device keeps a local list of the groups it has opened.

### Members
- Renaming is always allowed.
- A member who appears in any expense or settlement can't be deleted, only marked inactive, which hides them from the default participant list. A member who appears in none can be hard-deleted.

### Expenses and settlements
- An expense has a description, amount, date, one payer, and participants. The split is always equal among the participants you choose, which by default is everyone.
- A settlement records that member A paid member B some amount; partial payments and overpayments are allowed.
- Amounts are positive integers in the currency's minor units, using the currency's own decimal count from ISO 4217, with a sanity cap. There are no negative amounts or refunds.
- Anyone with the link can add, edit or delete anything. Deletes are permanent after one confirmation, and that includes deleting the whole group. There's no activity log and no restore.
- Edits use an optimistic version check: if two people edit the same item, the second save is rejected with "this changed, reload".

### Balances
- Balances are computed from the full history. The app shows each member's net balance plus a minimal set of suggested transfers, chosen greedily, each with a one-tap "record this payment".
- Payments happen outside the app; Potluck only records them.

### Safety and privacy
- Rate limits per IP on group creation and on writes.
- Hard caps: 50 members per group, 5,000 expenses per group, and length limits on names and descriptions. A CAPTCHA gets added only if abuse appears.
- No automatic deletion of inactive groups.
- No third-party trackers, `noindex` on group pages, and IP addresses dropped or truncated in logs.
- A plain-language privacy page that says the link gives full control, so share it only with the group.
- Accepted risk: a leaked link can permanently delete a group's data.

### Deferred to later versions
- Accounts, archiving, the activity log and restore, rotating a leaked link, exact-amount splits, shares and percentages, multiple payers, multiple currencies, categories and receipts, offline mode, and translation.

### Still open (parked by you)
- **Q10, the odd cent:** who absorbs the leftover cent in an equal split. You're researching this in a separate session, and the split calculation can't be finished until it's decided.
- **Host and stack.**

## Where the open items go

- **The odd cent (Q10):** its own research session, lesson 4.1.
- **Host and stack:** lesson 3.3, with the docs.
- **The spec:** written once the repository exists (lesson 3.2 creates it from the same session).
