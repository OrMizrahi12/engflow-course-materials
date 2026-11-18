# The comparison and the recommendation (turn 1's final reply)

Claude's reply once all four designs were back, as it appeared in the session ("Baked for 3m 42s"). The full designs are in `designs/`.

---

All four designs are in. All four take the same inputs and cover the same decided behaviour, so the differences below are only in the shape of the interface.

## A. Minimal: three entry points
`openExpenseForm(source, ctx, env)` → `{ values, discardStoredSplittingOptions }`
`deriveExpenseForm(values, ctx, change?)` → `{ set, isIncome?, view }`
`closeExpenseForm(parsed, ctx)` → `{ values, splittingOptionsToStore }`

The middle function takes a union of seven change types (`amountTyped`, `rebalance`, `convert`, …). Called with no change, it returns the render view instead: shares, sum figures, whether a conversion is required. The open and close entry points are strong. Each one returns the localStorage action together with its result, so storage policy and value mapping can't drift apart. The middle one is weaker than it looks. The component keeps the dirty and touched guards, so it still has to know which change to send and when. The seven-type union just mirrors seven call sites, so the interface isn't really smaller; the width has moved into the union.

## B. Flexible: per-split-mode rules table
`createExpenseFormModel(ctx)` returns about 13 functions. Behind them is an exported `splitModeRules: Record<SplitMode, …>`, where each split mode defines its own conversions: stored ↔ typed, typed → preview, and typed → stored. A new split mode is one table entry, and the compiler flags it. The table's idea is the deepest of the four: every encoding rule for a split mode sits in one place. Exporting the table is the mistake. That turns an implementation detail into interface the caller has to learn.

## C. Most common caller: factory bound once, whole values in
`createExpenseFormModel({ group, locale, expenseId, now, newId })`. Every function then takes the whole `form.getValues()`, so each effect is one line. It's the easiest for the caller to use. On the other hand, passing the whole form object hides which fields each function reads, and its `previewShare(v, participantId)` goes against Q9, where the preview returns every participant's share at once.

## D. Units in the types: branded values
`MinorUnits<'group' | 'original'>`, `MajorAmount<…>`, `BasisPoints`, `ConversionRate`, plus a `StoredPaidFor` union keyed by split mode, so basis points can't end up stored under `BY_AMOUNT`. The best idea here is `Prefill`: `repayment.amount: MinorUnits` vs `new.amount: MajorAmount` names the `?amount=` URL ambiguity exactly. The cost is high for a strict refactor, though. The form's own state can't carry the brands, so the protection only starts at the model's edge. And `units.groupMinor()` is an unchecked cast that can claim units it can't prove.

## Comparison
- **Depth**: B's table and A's open and close entry points carry the most behaviour per thing a caller has to learn. A's derive function and C's per-row preview carry the least.
- **Locality**: B puts all encoding rules for a split mode in one table entry. D puts unit correctness in the types, but brands spread to every caller. A puts it at the form's lifecycle stages.
- **Seam placement**: all four put the seam between "react-hook-form state" and "rules". None can move the guards behind it, because Q8 keeps them in the component. So any design that tries to make the reactions a single entry point, as A's derive does, gains little.

## Recommendation: a hybrid
- **Open and close from A.** `openExpenseForm` returns the values and whether to discard stored options. `closeExpenseForm` returns the minor-unit values and the options to store. This removes the "save options before submit-mapping" ordering constraint that D has.
- **Named reactions instead of a change union**, from B and C: `autoBalance`, `amountFromOriginal`, `originalFromAmount`, `participantOriginalAmountTyped`. Since the component keeps the guards, one name per reaction is as wide as the interface needs to be. Each takes a `Pick<>` of the fields it reads, not the whole form.
- **One render view**: `viewExpenseForm(values, ctx)` → `{ conversionRequired, shares: Map, splitSum }`. That honours Q9.
- **B's rules table as an internal seam.** It isn't exported, and its own tests go through the public functions.
- **D's insight, applied lightly at the one place it matters.** The repayment and new-expense prefill variants name their units in the field name (`amountMinor` vs `amount`) rather than with brands. No branded types elsewhere.
- **The context passed in once**: group currency, `expenseId`, locale for formatting, and a `currencyOf` lookup.

That's about 7 functions, with an implementation behind them that absorbs roughly 600 lines.

**Pinned quirks to lock down in tests rather than fix.** All four designs flagged these independently:
- The percentage preview doesn't round, while the saved value does.
- A repayment opened without `?to=` gets `paidFor: [undefined]`.
- Each participant's by-amount conversion uses the fetched rate, not the form's `conversionRate`.

The localStorage round-trip looked like a bug but is correct, and a test will pin it.

Which do you want: the hybrid, one of the four as it stands, or a different combination?
