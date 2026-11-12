# Spec: Potluck v1 (issue #1, as published in lesson 5.2)

This is the body of issue #1 in the Potluck repository (`https://github.com/OrMizrahi12/potluck/issues/1`), title
"Spec: Potluck v1", label `ready-for-agent`, exactly as it was published at the end of the lesson. It is the draft
`spec-draft.md` after the four fixes, without its first line (`# Potluck v1`), which became the issue's title. The section
headings follow the template of the `to-spec` skill (mattpocock/skills, MIT License). Your own spec will differ: it is
written from your own planning session.

---

## Problem Statement

When a group of friends, flatmates or travel companions shares costs, someone ends up holding the receipts and doing the sums: who paid for what, what each member's share was, and who now has to pay whom to come out even. Today that lives in someone's memory, a spreadsheet, or an app that makes everyone sign up first. Signing up is a wall for a one-off dinner or a trip with people you'll never add as "friends". Uneven amounts leave odd cents that someone silently absorbs. The final "who pays whom" is often a tangle of more transfers than needed.

## Solution

Potluck is a free, public web app for a group to track shared money with no accounts. One member creates a **group**, picks its currency and names its **members**, and shares the group's link. Everyone holding the link can record **expenses** (one **payer**, split equally among the chosen **participants**) and **settlements** (one member paid another outside Potluck). Potluck shows every member's **balance** and proposes a small set of **suggested settlements** that would bring every balance to zero. Recording a suggestion is one tap. Shares always add up exactly to the expense, and the odd cent rotates fairly instead of always landing on the same person. It works on a phone at the table, in the visitor's locale, and keeps as little personal data as possible.

## User Stories

### Creating and reaching a group

1. As an organizer, I want to create a group without signing up, so that my friends can start adding expenses straight away.
2. As an organizer, I want to give the group a name, so that everyone recognises it in their list.
3. As an organizer, I want to pick the group's currency from a list of real currencies, so that amounts are entered and shown correctly.
4. As an organizer, I want currencies that have no minor unit (precious metals, test codes) to be absent from the list, so that I can't pick something meaningless.
5. As an organizer, I want to name the initial members when I create the group, so that the group is ready to use immediately.
6. As an organizer, I want to receive a long, unguessable link to the group, so that only people I share it with can reach it.
7. As an organizer, I want to copy or share that link easily from my phone, so that I can send it to the group chat.
8. As a member, I want to open the group from the link without creating an account, so that joining costs me nothing.
9. As a member, I want to be told plainly that anyone with the link has full control of the group, so that I share it only with the group.
10. As a member, I want the groups I've opened on this device to be listed on the home page, so that I can return to them without hunting for the link.
11. As a member, I want that list to survive closing the browser, so that I don't lose my way back to my groups.
12. As a member who cleared their browser data, I want the group itself to be unaffected, so that only my shortcut is lost and the link still works.
13. As an organizer, I want to change the group's currency while it has no expenses and no settlements, so that I can fix a mistake made at creation.
14. As an organizer, I want Potluck to refuse a currency change once the group has any expense or settlement, so that existing amounts never silently change meaning.
15. As a member, I want to delete the whole group after one confirmation, so that our data is gone when we want it gone.
16. As a member, I want the deletion to be clearly irreversible in its confirmation, so that nobody deletes the group by accident thinking it can be undone.

### Saying who I am

17. As a member opening a group for the first time on a device, I want to be asked which member I am, so that Potluck can pre-fill my name and show what I owe or am owed.
18. As a visitor, I want to view the group without choosing a member, so that I can look before committing.
19. As a member, I want to be required to choose who I am before I add an expense, so that the payer can be pre-filled sensibly.
20. As a member, I want to change who I am on this device at any time, so that a shared phone or a wrong tap is easy to fix.
21. As a member, I want the device to remember who I am in each group separately, so that I can be a different member in different groups.
22. As a member, I want to see my own balance highlighted ("you are owed" / "you owe"), so that I can see my position at a glance.

### Members

23. As a member, I want to add a member after the group is created, so that someone who joins later can be included.
24. As a member, I want to rename a member at any time, so that typos and nicknames can be fixed.
25. As a member, I want Potluck to refuse a name that matches another member's name in the group, ignoring case and surrounding spaces, so that "Dan" and "dan " are never two different people in the suggested settlements.
26. As a member, I want to mark a member inactive when they leave, so that they're no longer pre-selected in new expenses.
27. As a member, I want an inactive member to keep appearing in balances and suggested settlements, so that someone who moved out still owes or is owed what they did.
28. As a member, I want to pick an inactive member by hand as payer or participant, so that a late receipt involving them can still be recorded.
29. As an inactive member, I want to record a settlement, so that I can pay back what I owe after leaving.
30. As a member, I want to reactivate an inactive member, so that someone who comes back is pre-selected again.
31. As a member, I want to delete a member who appears in no expense or settlement, so that a mistaken entry disappears entirely.
32. As a member, I want Potluck to refuse to delete a member who appears in any expense or settlement, and offer to make them inactive instead, so that history and balances stay correct.
33. As a member, I want the group to be limited to 50 members, with a clear message at the limit, so that I understand why I can't add more.

### Expenses

34. As a payer, I want to record an expense with a description, amount, date and payer, so that the group knows what I paid for.
35. As a payer, I want the date to default to today, so that recording at the table is quick.
36. As a payer, I want the payer to default to the member I said I am, so that I don't have to pick myself every time.
37. As a payer, I want the participants to default to all active members, so that the common case takes no extra taps.
38. As a payer, I want to untick participants who weren't involved, so that someone who didn't eat doesn't pay for the meal.
39. As a payer, I want to be able to leave myself out of the participants, so that a gift I bought for others is split only among them.
40. As a payer, I want Potluck to refuse an expense whose only participant is me, so that personal spending doesn't clutter the group.
41. As a payer, I want to type amounts the way they're written in my currency (no decimals for yen, three for dinar), so that entering money feels natural.
42. As a payer, I want Potluck to refuse zero or negative amounts, so that refunds and mistakes don't sneak in as expenses.
43. As a payer who got a refund, I want to edit or delete the original expense, so that the group's balances reflect what was really spent.
44. As a payer, I want Potluck to refuse absurdly large amounts above the sanity cap, so that a typo with extra zeros doesn't wreck everyone's balance.
45. As a payer, I want Potluck to refuse an amount too small to give every participant at least one minor unit, with a message saying so ("too small to split among 7"), so that nobody ends up a participant with a share of zero.
46. As a participant, I want the expense split equally among its participants, so that the split is predictable and fair.
47. As a participant, I want to see every participant's share on each expense, so that I can check the arithmetic.
48. As a participant, I want the shares of an expense always to add up exactly to its amount, so that no cent is created or lost.
49. As a participant, I want any leftover cent to rotate among participants from one expense to the next, rather than always falling on the same person, so that the odd cent is fair over time.
50. As a participant, I want the same expense always to split the same way, so that reloading the page never changes my share.
51. As a member, I want to edit any expense's description, amount, date, payer or participants, so that mistakes can be fixed.
52. As a member who edited an expense's participants, I want to see the new shares, so that I notice if the odd cent moved to someone else.
53. As a member, I want to delete an expense after one confirmation, so that a duplicate or wrong entry can be removed.
54. As a member editing an expense someone else changed in the meantime, I want my save to be refused with "this changed, reload", so that I never silently overwrite their change.
55. As a member, I want the group's expenses listed newest first, with older ones loaded on demand, so that a long-running flat's history stays fast to browse.
56. As a member, I want the group to be limited to 5,000 expenses, with a clear message at the limit, so that I understand why I can't add more.
57. As a member, I want descriptions and names to have sensible length limits, so that one pasted essay doesn't break the layout.

### Balances

58. As a member, I want to see every member's balance, so that I know where the group stands.
59. As a member, I want a positive balance to mean the group owes that member and a negative one to mean they owe the group, so that the sign is never ambiguous.
60. As a member, I want balances to always sum to zero, so that I can trust the numbers.
61. As a member whose balance is zero, I want to be shown as settled up, however my balance got there, so that I know I'm done.
62. As a member, I want balances to update the moment an expense or settlement is added, edited or deleted, so that the page is never stale after my own change.

### Settlements

63. As a member who paid someone back, I want to record a settlement from me to them with an amount and date, so that our balances reflect it.
64. As a member, I want to record a partial settlement, so that paying back in instalments works.
65. As a member, I want to record a settlement larger than what I owed, so that an overpayment or a loan between members can be recorded.
66. As a lender, I want to record a loan as a settlement from me to the borrower, so that the borrower's balance shows they owe me.
67. As a member, I want Potluck to refuse a settlement from a member to themselves, so that meaningless entries don't appear.
68. As a member, I want to edit or delete a settlement, with the same "this changed, reload" protection as expenses, so that mistakes can be fixed safely.
69. As a member, I want the group to be limited to 5,000 settlements, with a clear message at the limit, so that I understand why I can't add more.

### Suggested settlements

70. As a member, I want Potluck to propose a small set of suggested settlements that would bring every balance to zero, so that we settle up with few transfers.
71. As a member, I want the suggested settlements to be the same every time I look at the same balances, so that two of us looking at different phones see the same plan.
72. As a member, I want to record a suggested settlement with one tap that pre-fills the settlement form, so that settling up is quick.
73. As a member, I want to adjust the pre-filled amount before saving, so that a partial payment is still easy.
74. As a member, I want the suggested settlements to change as soon as balances change, so that the plan always reflects the latest entries.
75. As a member who moved out, I want to see every suggested settlement involving me, so that I know whom to pay even if it's more than one person.
76. As a member, I want no suggested settlements to be shown when everyone is settled up, so that it's obvious we're done.

### Money and formatting

77. As a member, I want amounts formatted for my locale (separators, symbol position), so that they read naturally.
78. As a member, I want every amount shown with exactly the number of decimals the currency has in ISO 4217, so that what I see always matches what was stored.
79. As a member in a group using a currency with no decimals (e.g. yen), I want amounts entered and shown with no decimals, so that I don't see ".00" everywhere.
80. As a member in a group using a three-decimal currency (e.g. Bahraini dinar), I want three decimals entered and shown, so that small amounts aren't lost.

### Phone, connectivity and language

81. As a member at a restaurant table, I want every screen to work comfortably at phone width, so that I can record the bill on the spot.
82. As a member, I want a clear error when I'm offline instead of a silently lost entry, so that I know to try again.
83. As a member, I want the interface in English, so that it works for a mixed group without translation.

### Privacy and safety

84. As a member, I want Potluck to use no third-party trackers or analytics cookies, so that my group's spending isn't shared with advertisers.
85. As a member, I want group pages to be excluded from search engines, so that our group never shows up in search results.
86. As a member, I want a short, plain-language privacy page, so that I know what is stored and that the link is the only key.
87. As a member, I want our group kept indefinitely unless someone deletes it, so that a quiet flat's history doesn't disappear without warning.
88. As the operator, I want writes rate-limited per IP address, so that one script can't flood the service or fill the free database.
89. As the operator, I want IP addresses dropped or truncated in logs, so that Potluck keeps as little personal data as possible.
90. As the operator, I want Potluck to carry no ads or paid features while it's on the free hosting plan, so that it stays within that plan's non-commercial terms.

### Building and shipping (operator)

91. As the developer, I want every change to go through a pull request with its own preview deployment, so that I can try it before it goes live.
92. As the developer, I want each preview to have its own database copy made from seeded data, so that previews never touch real people's data or each other.
93. As the developer, I want type-check, lint, the service tests and the browser tests to pass before a merge is allowed, so that production only runs checked code.
94. As the developer, I want a merge to `main` to deploy to production automatically, so that shipping takes no manual steps.
95. As the developer, I want a failed migration to fail the build and block the deploy, so that a broken schema never goes live.
96. As the developer, I want to run the whole app locally against my own Postgres with the same seed data, so that I can work offline.

## Implementation Decisions

### Platform (see ADRs 0001–0003 and `GLOSSARY.md`)

- Next.js app in TypeScript on Vercel's Hobby plan, on the free `*.vercel.app` domain. Hobby is non-commercial only: no ads, no paid features, no payments from visitors (donations allowed). Exceeding a Hobby limit pauses the site until the 30-day window resets.
- Postgres 18 on Neon's Free plan. Production runs on Neon's **root** branch, which can't be reset from a parent or deleted. A `development` branch was created from the root while it was still empty, is filled only by the repo's seed script, and is Neon's **default** branch.
- Neon's Vercel integration creates a database branch for each pull request's preview, copied from `development`, and deletes it when the PR merges. This leaves room for 8 open PRs with previews at once.
- The app connects with a standard Postgres driver over TCP, through Neon's connection pooler in production. Neon's HTTP-only driver isn't used, so local Postgres and production behave the same.
- Node 24, pinned in the package manifest's engines field, an nvm version file and CI, because Vercel's default is newer. npm is the package manager.
- Postgres 18 everywhere: Neon, the developer's local install, and PGlite (0.5 or later) in tests.

### Path to production

- Every change is a pull request. GitHub Actions runs type-check, lint, the service tests on PGlite, and Playwright against the PR's Vercel preview. Branch protection on `main` requires all four checks to pass. Merging to `main` deploys to production automatically.
- Previews stay behind Vercel's deployment protection. CI reaches them with Vercel's automation bypass secret, stored as a GitHub secret. PRs from forks can't use the secret; their browser tests are run by hand.
- Schema migrations are plain SQL files generated and run by Drizzle. They run inside the Vercel build: production's against the root branch, each preview's against its own branch. The migration runner holds a Postgres advisory lock, so two builds can never migrate at once. If a migration fails, the build fails and nothing deploys.
- Migrations may only add things. Removing or renaming a column, table or constraint happens in a later, separate change, once no deployed code uses it. This is a rule of this spec, not an ADR, and can be changed.
- A seed script in the repo is the only source of data for `development` and for local databases. It creates fake groups that cover the edge cases: an inactive member with a nonzero balance, a payer who isn't a participant, partial settlements and overpayments, a loan, a JPY group, a BHD group, and a group at the 50-member cap. Production data is never copied anywhere.

### Modules

- **Group service** (the main seam). This is the server-side interface every page calls. Its commands are: create group, change currency, delete group, add member, rename member, set a member active or inactive, delete member, add, edit or delete an expense, and add, edit or delete a settlement. Its single read is the **group view**. Each command either succeeds and returns the updated group view, or is refused with a reason code and changes nothing. The service owns all validation, the caps and the version check.
- **Money core** (inside the group service, not a separate seam). These are pure functions: parse typed amount text into integer minor units without floats, compute the shares of an expense, compute balances, and compute suggested settlements. They're lifted from the logic prototype on the `prototype/balances` branch.
- **Currency table.** For each ISO 4217 currency it holds the number of minor-unit digits, taken from ISO 4217 List One rather than from the browser. It excludes the 13 codes whose minor unit is "N.A.". Formatting always passes explicit minimum and maximum fraction digits, equal to the ISO digits, to the browser's number formatter. The browser's CLDR data disagrees with ISO for about 15 currencies (e.g. HUF, IDR, IQD).
- **Device store** (browser only). This is the list of groups opened on this device, and the member this device claims in each group. It lives in browser storage, is wrapped so a missing or blocked storage never breaks the page, and is never sent to the server.
- **Pages.** Home (my groups, create group), create group, the group page (balances, suggested settlements, expenses newest first, settlements), expense form, settlement form, group settings (members, currency, delete), and privacy. All are mobile-first. Group pages are marked `noindex`.

### Group view (the service's read contract)

- The group: name, currency, digits, and version.
- Members in creation order, each with name, active flag, version, balance, and whether they're referenced by any expense or settlement (so the UI knows whether delete is allowed).
- Expenses, newest first and paginated. Each has id, description, amount, date, payer, version, and every participant's share, flagging who received a leftover unit.
- Settlements: from, to, amount, date and version for each.
- Suggested settlements: from, to and amount for each, in a deterministic order.

### Rules (enforced by the group service)

- **Amounts.**
  - Every amount in a group is in the group's currency, stored as a positive integer in minor units.
  - Expense and settlement amounts must be at least 1 minor unit and no more than 10,000,000 in major units.
- **Expenses.**
  - Exactly one payer. At least one participant other than the payer. The payer is a participant only if included.
  - The amount in minor units must be at least the number of participants, so no share is zero. A refusal says "too small to split among N".
  - The only split is equal among participants.
- **Shares (the odd-cent rule, after Spliit).**
  - Order the participants by member creation order. Let `n` be the number of participants, `q = floor(amount / n)` and `r = amount mod n`.
  - Every participant's share is `q`. The `r` leftover units go one each, starting at position `hash(expense id) mod n` and wrapping around. The hash is 32-bit FNV-1a over the expense id.
  - Shares are never stored; they're a pure function of the expense's id, amount and participants. The expense id is assigned at creation and never changes.
  - Editing an expense's participants can move the leftover onto a participant the edit didn't touch. That's accepted; the shares shown on the expense make it visible.
  - From the prototype (trimmed):

    ```js
    // Pure function of the expense: same id, amount and participants -> same shares.
    function computeShares(expense, members) {
      const P = [...expense.participantIds].sort(byMemberCreationOrder);
      const n = P.length, q = Math.floor(expense.amount / n), r = expense.amount % n;
      const offset = fnv1a(expense.id) % n;      // 32-bit FNV-1a, offset basis 0x811c9dc5, prime 0x01000193
      const shares = P.map((memberId) => ({ memberId, share: q, extra: 0 }));
      for (let i = 0; i < r; i++) { const s = shares[(offset + i) % n]; s.share += 1; s.extra = 1; }
      return shares;
    }
    ```

- **Balances.**
  - `balance = expenses paid for + settlements made − shares − settlements received`. A group's balances always sum to zero.
  - A member whose balance is zero is **settled up**.
- **Settlements.**
  - From one member to a different member, with any positive amount, whatever it does to their balances. That includes partial payments, overpayments and loans; a loan is a settlement from lender to borrower.
  - A settlement from a member to themselves is refused. A settlement is never an expense.
- **Suggested settlements.**
  - Recomputed on every read and never stored.
  - Greedy matching: repeatedly match the largest debtor with the largest creditor for the smaller of the two amounts. Ties go to the earlier-created member, so the result is deterministic.
  - This gives "a small set", not always the smallest. In the prototype, greedy needed more settlements than the true minimum in 0% of random groups of 4–7 members with odd-cent amounts, and in about 5% of groups of 10 with round amounts, never by more than 2.
  - No exact-minimum method is used.
  - From the prototype:

    ```js
    // Greedy: repeatedly match the largest debtor with the largest creditor.
    // Ties go to the earlier-created member, so the result is deterministic.
    function greedyMatch(entries) {           // entries: { id, order, amount: balance } for nonzero balances
      const cred = entries.filter((e) => e.amount > 0).map((e) => ({ ...e }));
      const debt = entries.filter((e) => e.amount < 0).map((e) => ({ ...e, amount: -e.amount }));
      const byAmount = (a, b) => b.amount - a.amount || a.order - b.order;
      const out = [];
      while (cred.length && debt.length) {
        cred.sort(byAmount); debt.sort(byAmount);
        const c = cred[0], d = debt[0], x = Math.min(c.amount, d.amount);
        out.push({ fromId: d.id, toId: c.id, amount: x });
        c.amount -= x; d.amount -= x;
        if (c.amount === 0) cred.shift();
        if (d.amount === 0) debt.shift();
      }
      return out;
    }
    ```

- **Members.**
  - Names are unique within a group, compared case-insensitively after trimming.
  - A member referenced by any expense (as payer or participant) or settlement can't be deleted, only made inactive. An unreferenced member can be deleted.
  - "Inactive" only means "not pre-selected as a participant in new expenses". Inactive members can still pay, take part in expenses, record settlements, appear in suggested settlements, and be reactivated.
- **Group.**
  - The currency can be changed only while the group has no expenses and no settlements.
  - Deleting a group is a hard delete of everything in it.
- **Caps per group.** 50 members, 5,000 expenses, 5,000 settlements, and length limits on group names, member names and descriptions. The exact lengths are chosen during implementation and enforced by the service.
- **Concurrency.** Groups, members, expenses and settlements each carry a version number. An edit or delete that names a stale version is refused ("this changed, reload"). No last-write-wins.
- **Deletion.** Every delete is a hard delete after one confirmation in the UI. There's no activity log, no soft delete and no restore.

### Access and identity

- A group is reached only through a link containing a long random token of at least 128 bits. The token is the only credential: anyone holding it can do everything, including deleting the group. There's no way to rotate it in v1. This risk is accepted and stated on the privacy page.
- "Who are you?" is unverified and lives only on the device. The server never relies on it. It's used only to pre-fill the payer and to highlight "you".

### Abuse, privacy and data

- One Vercel firewall rate-limit rule (the only one Hobby allows) limits every write per IP, including group creation. There's no CAPTCHA unless abuse appears.
- No third-party trackers or analytics cookies. Group pages are `noindex`. Logs drop or truncate IP addresses. A short, plain-language privacy page explains what's stored and the link-is-the-key risk.
- No automatic deletion of inactive groups.
- Neon's built-in history (about 6 hours) is the only backup in v1. **Real backups are a launch blocker.**

### Schema (sketch)

- **Group:** id, link token (unique, unguessable), name, currency code, version, created at.
- **Member:** id, group, name, active flag, creation order, version.
- **Expense:** id, group, description, amount in minor units, date, payer, version, created at.
- **Expense participant:** expense, member.
- **Settlement:** id, group, from member, to member, amount in minor units, date, version, created at.
- **Constraints in the database as a backstop:**
  - amounts positive;
  - settlement from ≠ to;
  - member name unique per group (case-insensitive, trimmed);
  - foreign keys that block deleting a referenced member;
  - cascading delete from group.

## Testing Decisions

- **What makes a good test:** it exercises behaviour through a public seam and asserts on what a user of that seam can observe, such as the group view or a refusal reason. It never asserts on internal functions, table layouts or call order, so the internals can be reorganised without rewriting tests.
- **Seam 1, the group service, on PGlite.** Each test creates a fresh database with the real migrations applied and calls service commands, then reads the group view. This covers every rule and refusal listed above:
  - the odd-cent rotation and determinism;
  - balances summing to zero;
  - greedy suggested settlements, including the case where greedy isn't minimal (balances +20, +40, +30, −50, −40 give 4 suggestions);
  - inactive members still in balances and suggestions;
  - currency change refused after the first entry;
  - referenced-member deletion refused;
  - zero-share, self-settlement and duplicate-name refusals;
  - every cap;
  - the stale-version refusal on edit and delete.
- **Property test, through the service.** For thousands of randomly generated groups and expenses across currencies with 0, 2 and 3 decimals, it adds them via the service and asserts on the group view:
  - each expense's shares sum exactly to its amount;
  - each share is `floor` or `floor + 1`;
  - balances sum to zero;
  - recording every suggested settlement leaves every member settled up;
  - reading twice gives identical shares and suggestions.

  It uses a fixed seed so failures reproduce.
- **Seam 2, Playwright against the PR's preview.** Browser tests start from the first page and run against the preview's own seeded database copy. They cover:
  - create group, then share the link, open it, and answer "who are you?";
  - add an expense, see the balances, record a suggested settlement, and reach settled up;
  - the my-groups list on the device;
  - amounts formatted for JPY (no decimals), USD and HUF (2 decimals);
  - phone-width layout;
  - the "this changed, reload" message.
- **Prior art:** none in the repo yet. The logic prototype on the `prototype/balances` branch includes scenarios worth turning into service tests (its 13 scenario tabs) and its fairness and greedy-versus-minimum experiments.
- **Not tested in code:** the Vercel firewall rule and the Neon/Vercel branch-per-PR setup. Both are configuration, checked by hand once when set up.

## Out of Scope

- Accounts, sign-in, or a cross-device "all my groups".
- Archiving groups, settlement periods, or closing a group.
- An activity log, soft delete, restore, or undo.
- Rotating a leaked link.
- Exact-amount, share-weighted or percentage splits.
- More than one payer per expense.
- More than one currency in a group, or exchange rates.
- Categories, notes, receipt photos, or any file upload.
- Moving money: payment integrations or payment-app links.
- Offline mode, a native app, or translation into other languages.
- An exact-minimum algorithm for suggested settlements.
- A CAPTCHA (only if abuse appears).
- Ads, paid features, or anything commercial while on Vercel Hobby.
- A custom domain.
- Automatic deletion of inactive groups.

## Further Notes

- **Launch blocker:** real backups beyond Neon's roughly 6-hour history must exist before launch. Where they go and how often is still to be decided.
- **Pending input:** a questionnaire for the first real group, four flatmates who also travel together, is written but not sent yet. Its answers may challenge "one currency per group" and "one payer per expense". Revisit this spec when they come back.
- **Accepted costs:**
  - HUF and the other currencies where ISO and browsers disagree show the ISO number of decimals (e.g. HUF 12.34), even if locals usually write none.
  - An inactive member who owes money may be asked to settle with more than one person, because greedy matching doesn't minimise settlements per member.
- **Glossary:** the canonical words are in `GLOSSARY.md`. Use them in the UI and the code, never "payment" for a settlement or "debt" for a balance.
- **Supporting documents:**
  - Hosting, database and preview-database decisions are in ADRs 0001–0003.
  - The odd-cent research is in the repo's research notes.
  - The logic prototype is on the `prototype/balances` branch.

