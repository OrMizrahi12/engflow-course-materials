<!-- As filed in our own copy of Spliit in lesson 10.6. Title: Extract the expense form model from expense-form.tsx (strict refactor). Labels: ready-for-agent. -->

## Why

`src/app/groups/[groupId]/expenses/expense-form.tsx` is the most-changed file in the repo: 24 of the last 18 months' commits touch it. It is 1,524 lines, and lines 1–627 are logic, before any JSX. None of it has a unit test. Only the e2e specs reach it (`split-modes`, `multi-currency`, `repayment-currency`, `recurrence`, `expense-variants`).

A split value has three encodings: the typed string, ×100 (weights and basis points), and minor units. The rules for converting between them are spread across about ten places:

- load: `:137` and `:238`
- submit: `:326–348`
- the split preview, which fakes a Prisma row to call `calculateShare`: `:1163–1202`
- by-amount auto-balance: `:410–466`
- the figures in the "must add up" error: `:582–626`
- default splitting options: `:142–170`
- `enforceCurrencyPattern`, called at seven sites
- an inline conversion at `:1264`
- the schema transform in `src/lib/schemas.ts:214–235`

## What

Extract a pure **expense form model** module, `src/app/groups/[groupId]/expenses/expense-form-model.ts`, with `expense-form-model.test.ts` beside it. The component keeps rendering and react-hook-form wiring. Its effects become thin: read the values, call the model, set the values.

This is a **strict refactor**. Behaviour does not change.

## Decisions

These were settled in an architecture review on 2026-11-17. Don't reopen them in this issue.

**Scope**
- `expenseFormSchema` is left exactly as it is. The model takes form input values (split values as strings, amounts in whole currency units) and its close step produces the same `ExpenseFormValues` that `api.ts` accepts today, with amounts in minor units. Splitting the schema comes after this issue (see the follow-up).
- The module is pure TypeScript. It imports no React or react-hook-form.
- No new `GLOSSARY.md` term. Inside the model, names use the existing glossary terms: split value, share, original amount, conversion rate, reimbursement, group currency.

**The model owns**
- Building initial values for three cases: edit, repayment, and new expense from URL prefill or a receipt scan.
- The submit mapping to minor units. This includes dropping `originalAmount`, `originalCurrency` and `conversionRate` together when no conversion took place.
- The split preview, which returns every participant's share at once.
- By-amount auto-balance.
- The figures in the "must add up" error, for by amount and by percentage.
- `enforceCurrencyPattern`.
- Both conversion directions:
  - original amount → group amount, for regular expenses
  - group amount → original amount, for repayments, including the rule that a result rounding to zero gives an empty field
- The per-participant by-amount original-currency conversion.

**The component keeps**
- The `shareEdits` map (edited/cleared), and every dirty, touched and reset guard that decides *when* a reaction runs.
- All `localStorage` reads and writes. The model only converts the stored default splitting options in and out.
- The translated conversion-rate status message.
- Reading the URL. This includes resolving whether `?amount=` is in minor units (from a suggested reimbursement) or whole units (from a receipt scan). The model receives an already-read prefill.

**Dependencies are passed in**
- `today` and an id generator are arguments, so tests behave the same in both Jest timezone runs.
- All other dependencies are in-process (`shares.ts`, `currency-conversion.ts`, `utils.ts`, `currency.ts`). There are no ports or adapters.

**Preview**
- The preview builds a `ShareInput` and calls `getParticipantShare` directly. A reimbursement gives 0 for every participant.
- The fake Prisma row goes.

## Interface shape (chosen hybrid)

Four alternative designs were compared: minimal, flexible, most-common-caller, and units-in-the-types. This shape takes something from each. Exact names and types are left to the implementer.

- `openExpenseForm(source, ctx, env)` returns `{ values, discardStoredSplittingOptions }`.
  - `source` is a union:
    - `edit` takes the expense.
    - `repayment` takes `amountMinor` in group minor units, plus `from`, `to` and a translated `title`.
    - `new` takes `amount` in whole units, plus `title`, `date`, `categoryId`, `paidBy` and the receipt document.
  - The unit is spelled out in the field name. Don't use branded types.
  - `env` holds `today`, `newId` and the stored splitting options, or `null`.
- `closeExpenseForm(parsed, ctx)` returns `{ values, splittingOptionsToStore }`.
  - `values` is in minor units, as a new object; don't mutate `parsed`.
  - `splittingOptionsToStore` is `null` when nothing should be stored.
  - Returning both together removes any ordering constraint between storing and mapping.
- Named reactions, each taking a `Pick<>` of only the fields it reads and returning a patch or `null`:
  - `autoBalance(values, editedParticipantIds, ctx)`
  - `amountFromOriginal(values, ctx)` returns the amount and whether it is income.
  - `originalFromAmount(values, ctx)`
  - `participantOriginalAmountTyped(...)` and the matching placeholder.
- `viewExpenseForm(values, ctx)` returns `{ conversionRequired, shares: Map<participantId, minor units>, splitSum }`.
- `ctx` is built once per form. It holds the group currency, the `expenseId` that seeds the share rotation (ADR-0003), the locale for formatting, and a `currencyOf(code)` lookup with the `'Custom'` fallback.
- Inside the module, keep a per-split-mode rules table that holds each mode's encoding rules. It is an **internal** seam: don't export it, and test it only through the public functions.

Rejected and not to be reintroduced here:
- A single "change" union for all reactions. It doesn't fit while the component keeps the guards.
- An exported rules table.
- A preview that returns one participant's share per call.
- Branded unit types. Reconsider these after the schema split, because they only become workable once form state carries one unit system.

## Tests

`expense-form-model.test.ts`, through the public interface only. Write these characterization tests **first**, so they pin today's behaviour:

- Preview parity: for every split mode, every participant's share equals `calculateShare` from `totals.ts` on the same expense, and the shares add up to the amount. A reimbursement gives all 0.
- Auto-balance:
  - Amount 95 split between 3 participants by amount with no edits gives `31.67 / 31.67 / 31.66`.
  - With one participant edited, the others share the remainder exactly.
  - A currency with 0 decimals, such as JPY, behaves the same way.
- Repayment conversion: a converted amount that rounds to 0 gives an empty `originalAmount`, and close then drops all three currency fields.
- Initial values:
  - each source kind
  - stale stored splitting options give the defaults and `discardStoredSplittingOptions: true`
  - the stored-options round trip (×100) holds
  - `expenseDate` comes out the same in both timezone runs

**Pin these current behaviours. Don't fix them here:**
- The percentage preview uses `Number(s) * 100` without rounding, while the saved value is rounded.
- A repayment opened without `?to=` gets `paidFor: [undefined]`.
- The per-participant by-amount conversion (`:1264`) uses the fetched exchange rate, not the form's `conversionRate`, and does not go through `convertToGroupCurrency`. If it is ever changed, that goes in its own labelled commit or issue.

## Done when

- The model exists, with the interface above, and has tests for every bullet in **Tests**.
- `expense-form.tsx` has no domain logic left above its JSX beyond guards and calls into the model, and no fake Prisma row.
- `npm test` passes, and all e2e specs pass **unchanged**.

## Related

- #12 and #13 are by-amount auto-balance bugs. #13's cause is in when the component triggers the auto-balance (ticking doesn't call `forgetShareEdit`), and those triggers stay in the component, so this issue neither fixes nor blocks it. Once this lands, a fix to the auto-balance rule itself gets a unit test.
- #19 (the expense schema split) depends on this issue.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
