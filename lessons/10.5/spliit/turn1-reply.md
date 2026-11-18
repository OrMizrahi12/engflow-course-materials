# Turn 1: the reply in the terminal

As printed in the session `spliit-architecture` after "Crunched for 3m 41s". The path line is shortened: the real one points into
the session's own scratch folder. While its sub-agent was still reading, the session had printed this note first:

> I've sent an exploration agent through the files git history points to. The busiest is `expense-form.tsx`, touched in 24 commits. Next come `api.ts`, `currency.ts`, the CSV export route, `group-form.tsx`, `schemas.ts` and `totals.ts`, plus the receipt-scan files. I'll write up the report when the agent reports back.

The reply:

I wrote the architecture report from the git history and tried to open it in your browser. If it didn't open, it's here: `<the session's scratch folder>/architecture-review-20261117-035238.html`.

The hot spots are clear. `expense-form.tsx` has 24 commits in 18 months and is 1,524 lines with no unit tests. After it come `api.ts` (9 commits), `currency.ts`, the CSV export and `schemas.ts`.

**Candidates:**
1. **Expense form model** (Strong): lines 1–627 of the form are domain logic, not rendering. The conversions between split values and shares are spread over about 10 places. That includes a preview that builds a fake Prisma row just to calculate shares.
2. **Split the expense schema** (Strong): one schema checks the form's typed values (whole currency units) on the client and cents on the server. I confirmed a bug from this: the form accepts amounts up to 1,000,000,000.00, but the server rejects anything over 10,000,000.00 with a raw error.
3. **Expense writes module** (Strong): the activity entry is logged before the write and outside a transaction, in 6 copies, so a failed write still leaves an entry. I also confirmed that `getExpense`, `updateExpense` and `deleteExpense` ignore `groupId`. With one group's link and another group's expense id, someone can read, edit or delete that expense.
4. **Recurring expenses created once per request** (Worth exploring): this keeps ADR-0002 (create on read). Today the creation pass is hidden inside a read that runs N times for `forUser` and twice in `overview`.
5. **One expense shape for share calculations** (Worth exploring): totals, balances, the CSV export and the form each convert expenses into the share calculator's input their own way.
6. **Money module** (Worth exploring): the `?amount=` URL parameter is in cents when it comes from a suggested reimbursement and in whole units when it comes from a receipt scan.
7. **Per-device preferences** (Speculative): raw `localStorage` keys are repeated across 7 files.

**Top recommendation:** do 1 and 2 together. Separately, the `groupId` scoping gap is a small fix worth doing now.

The report is only a local file. I can publish it as a private claude.ai page if you want to share it.

Which of these would you like to explore?
