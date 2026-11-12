# Decisions checklist: what the spec must carry

A spec records what you decided. Before it goes up, read it against the decisions themselves, not against your memory of
them. This is the list we checked Potluck's draft against in lesson 5.2, in plain words, with where each group of decisions
ended up in issue #1 (`spec-issue-1.md`). Use it as a model for your own list: write yours from your own planning session.

How to use it:

1. Tick each decision you find in the draft, and note the section.
2. For each one you can't find, search for its own words (`grep -n -i`), not for your paraphrase.
3. Search for things you never decided. If the draft states them, that's a defect (an invention), even when it sounds right.
4. Read the gaps the skill says it filled. Accept them or correct them, one line each.

## A. The product (lesson 3.1)

Where: Solution, User Stories, Implementation Decisions (Rules; Access and identity; Abuse, privacy and data), Out of Scope.

- [ ] A public web app; anyone can create a group; it runs on free tiers.
- [ ] Phone first, responsive, online only; no native app.
- [ ] English only; dates and amounts in the visitor's locale.
- [ ] No accounts: the long, unguessable group link is the only way in, and it gives full control.
- [ ] Creating a group: a name, a currency, the first members; more members later.
- [ ] Groups never close: no archiving, no settlement periods.
- [ ] Each device asks "who are you?" once; you can look without answering; adding an expense needs an answer.
- [ ] Each device keeps its own list of the groups it opened.
- [ ] Members can be renamed. A member in any expense or settlement can only be made inactive; one in none can be deleted.
- [ ] An expense: description, amount, date, one payer, participants; an equal split (everyone by default).
- [ ] A settlement: member A paid member B any positive amount; partial payments and overpayments allowed.
- [ ] Amounts are positive whole numbers in the currency's minor units, with a sanity cap; no negative amounts.
- [ ] Anyone with the link can add, edit and delete anything; deletes ask once; no activity log, no restore.
- [ ] Edits check a version number ("this changed, reload").
- [ ] Balances from the full history; each member's balance and a set of suggested settlements, recorded in one tap.
- [ ] Payments happen outside the app.
- [ ] Rate limits per IP on creating groups and on writes; caps of 50 members and 5,000 expenses per group.
- [ ] No automatic deletion of idle groups; no trackers; group pages `noindex`; IP addresses dropped or truncated in logs.
- [ ] A privacy page: the link gives full control, so share it only with the group.
- [ ] Out of scope: accounts, archiving, activity log and restore, rotating a leaked link, exact or percentage splits,
      more than one payer, more than one currency, categories and receipts, offline mode, translation.

## B. Stack, hosting and the path to production (lesson 3.3)

Where: Implementation Decisions (Platform; Path to production), Testing Decisions.

- [ ] Next.js **in TypeScript** on Vercel Hobby (non-commercial), on the free `*.vercel.app` domain.
- [ ] Postgres on Neon Free; Neon's short history is the only backup for now.
- [ ] Production on Neon's root branch; a `development` branch for previews; each pull request's preview gets its own copy.
- [ ] Postgres 18 everywhere: Neon, a local install, PGlite in tests.
- [ ] Drizzle with plain SQL migrations, run in the build under an advisory lock; migrations only add things.
- [ ] Every change through a pull request; checks: type-check, lint, the PGlite tests, Playwright against the preview.
- [ ] Node 24 pinned; npm.
- [ ] One firewall rule rate-limits all writes per IP.

**Never decided, must not appear:** the hosting region (`grep -c -i region` gave `0`: good). Real backups before launch
were parked as a launch blocker, and the draft says exactly that.

## C. The words (lesson 3.4)

Where: Solution (the bold terms), Implementation Decisions (Rules, enforced by the group service).

- [ ] An expense needs at least one participant besides its payer.
- [ ] An inactive member still counts in balances and suggested settlements, and can be reactivated.
- [ ] A loan is a settlement from the lender to the borrower; a settlement is never an expense.
- [ ] Every amount in a group is in the group's one currency.
- [ ] A balance is what you paid and settled out, minus your shares and what you were paid back; a group's balances add up
      to zero. "Settled up" means a balance of zero, however it got there.

## D. Money details (lesson 4.1)

Where: Implementation Decisions (Modules: the currency table; Rules: amounts and expenses).

- [ ] The odd cent: each share is the amount divided by the number of participants, rounded down; the leftover units go one
      each, starting at a position given by a hash of the expense id. Nothing extra is stored.
- [ ] Minor units from ISO 4217; the browser formatter always gets explicit fraction digits; the 13 currency codes with no
      minor unit are left out of the picker.

## E. The prototype's seven rules (lesson 4.2)

These lived only in Claude's notes, so they were the riskiest part. All seven made it into Implementation Decisions (Rules).

- [ ] Suggested settlements by greedy matching: "a small set", never "the smallest".
- [ ] An edit may move the odd cent onto a participant the edit didn't touch (accepted).
- [ ] Refuse an amount smaller than its number of participants ("too small to split").
- [ ] Refuse a settlement from a member to themselves.
- [ ] The currency changes only while the group has no expenses and no settlements.
- [ ] At most 5,000 settlements per group.
- [ ] Member names unique per group, case-insensitive, trimmed.

## What the check caught in lesson 5.2

| Found in the draft | Why it was a defect | The fix |
|---|---|---|
| "a questionnaire is out with the first real group" | it was written, never sent | "written but not sent yet" |
| "Recurring expenses" in Out of Scope | it never came up | taken out |
| no mention of TypeScript | we chose it in lesson 3.3 | "Next.js app in TypeScript" |
| the version rule named groups, expenses and settlements | the schema gives members a version too | members added |

The six gaps the skill flagged itself (link token of at least 128 bits, expenses newest first, version numbers on groups
and members, database backstops, text limits left open, an offline save shows an error) were read and accepted.
