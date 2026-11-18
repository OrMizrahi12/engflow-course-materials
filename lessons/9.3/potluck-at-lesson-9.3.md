# Potluck at the tag `lesson-9.3`

Repository: `https://github.com/OrMizrahi12/potluck` (public; clone it, don't fork it). The tag `lesson-9.3` points at
`d360983`, the merge of pull request #57 on `main`, made by hand with a merge commit on 2026-11-15.

```bash
git clone https://github.com/OrMizrahi12/potluck.git
cd potluck
git checkout lesson-9.3
```

## Pull request #57: "Multi-currency groups"

- Branch `worktree-multi-currency` (the orchestrator's worktree, used as the integration branch): 24 commits, 105 files
  changed, 7,158 lines added and 132 removed. 58 of the files are screenshots in `docs/evidence/issue-52` to `issue-56`.
- Closes the spec #51 and its five tickets. The map #41 was closed earlier, by the spec session, with a pointer to #51.
- The order the run merged them: #52, #53, #54, #56, #55, then the review fixes.

| Ticket | What it added |
|---|---|
| #52 Record an expense with a foreign amount at a typed rate | the currency picker on the expense form, a typed rate or the bank's amount, the pure conversion module (`src/money`), the glossary words, migration `0004` |
| #53 Propose an exchange rate from Frankfurter | the rate lookup and its cache (migration `0005`), what the form says when a rate is unavailable or slow, the fake rate source for local runs and tests |
| #54 Record a settlement with a foreign amount | the same on the settlement form (migration `0006`) |
| #55 Switch a suggested settlement to another currency | a suggested settlement paid in another currency, worked backwards from the amount it must settle |
| #56 Edit an expense or settlement with a foreign amount | editing never reconverts silently; changing the date offers that date's rate |

How it works, in one line: a foreign amount is converted into the group currency once, when it is recorded, and frozen;
balances and shares only ever see the group-currency amount.

After the review: an edit that leaves the conversion alone keeps the stored group-currency amount (editing only who is in a
settlement could move it by one minor unit); an earlier day's rate for a past date is cached for an hour, not forever; the
tests spell out their own input; the rate readers are named by their role; the word "trip" left a browser test. The spec
#51 now says that for a future date the 30 days count back from today, as the code does.

## Checks at the merge

- The run's focused checks after the fixes: type check, lint, the dependency check, the 189 tests the fixes touched, and
  22 browser tests (desktop and phone). Before the review, `npm run check` passed with 303 tests.
- `gh pr checks 57`: three checks, all passed: the required check (type check, lint and service tests), Vercel's preview deploy, and
  Vercel's preview comments.
- Vercel's production deploy of `d360983` succeeded. Production builds run the migrations first, so all three are there.

## The three migrations

In this kit, as they are at the tag: `potluck/drizzle/0004_expense_foreign_amounts.sql`, `0005_rate_lookups.sql` and
`0006_settlement_foreign_amounts.sql`. They only add things: nullable columns for the foreign amount, its currency and the
rate (all three empty or all three set), check constraints, and the `rate_lookups` table. That is why `landing.md` leaves the
merge to a person, and why the pull request calls its door one-way: once a foreign amount is recorded, the data needs the
new columns.

## The glossary

`potluck/GLOSSARY.md` in this kit, as it is at the tag. Group is reworded; Group currency, Foreign amount and Exchange rate
are new. The change shipped with #52, the first ticket that added code.

## See the feature on your machine

With Potluck set up locally as in lessons 6.2 to 8.2:

```bash
git pull
npm run db:migrate
npm run db:seed
npm run dev
```

Create a group, add an expense and pick another currency. Locally the rate comes from the fake source Potluck serves itself
(`.env.example` explains `RATE_SOURCE_URL` if you want the real Frankfurter); previews and production ask Frankfurter.

## Open issues at the tag

Eleven (`gh issue list`), none of them the map, the spec or a ticket from this lesson:

#46 (a pre-commit test worker killed), #40 and #37 (group tokens in logs), #34, #33, #32, #31 (lesson 8.3's
follow-ups), #19 (the dev server reload loop), #12 and #11 (`ready-for-human`), and #1 (the first spec).

## Open pull requests

None (`gh pr list`).
