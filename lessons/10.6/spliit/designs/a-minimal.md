# Design A, minimal (three entry points)

One of the four interface designs from lesson 10.6, as the sub-agent returned it. It is Claude's analysis of Spliit's MIT-licensed code at commit 59c41d7, kept here unedited apart from repository paths shortened to the repo root. Nothing in it was implemented: the chosen design is the hybrid in `issue-18-spec.md`.

---

## Expense form model: interface design (minimal: 3 entry points)

I read `expense-form.tsx` (lines 84–627, 765, 849, 910, 1163–1202, 1255–1335), `schemas.ts`, `shares.ts`, `currency-conversion.ts`, `totals.ts`, `utils.ts`, the GLOSSARY and ADR 0003.

The design keeps the interface to three functions, one per moment in the form's life:
- **Open:** build the initial values.
- **Derive:** run every event-driven value change, and also return the render-time view.
- **Close:** map to minor units for submit.

Everything else is types. The one shared context object is passed to all three. Each call stays a pure function of its arguments, so there is no instance or state to manage.

### 1. Interface (`src/app/groups/[groupId]/expenses/expense-form-model.ts`)

```ts
import type { Currency } from '@/lib/currency'
import type { Locale } from '@/i18n/request'
import type { ExpenseFormInput, ExpenseFormValues, SplittingOptions } from '@/lib/schemas'
import type { SplitMode } from '@/generated/prisma/browser'

/** Same for every call during one form's life. */
export type ExpenseFormContext = {
  group: { id: string; currency: string; currencyCode: string | null; participants: { id: string }[] }
  locale: Locale                 // only for getCurrency(...,'Custom') and formatting the "must add up" figures
  /** Seeds the share rotation (ADR 0003): expense.id when editing, the pre-minted id when creating. */
  expenseId?: string
}

/** Structural, so tests need no Prisma/Decimal. AppRouterOutput['groups']['expenses']['get']['expense'] satisfies it. */
export type EditableExpense = {
  title: string; expenseDate: Date | null; amount: number /*minor*/; categoryId: number
  originalAmount: number | null /*minor, original currency*/; originalCurrency: string | null
  conversionRate: { toNumber(): number } | null
  paidById: string; paidFor: { participantId: string; shares: number }[]
  splitMode: SplitMode; isReimbursement: boolean
  documents: ExpenseFormInput['documents']; notes: string | null; recurrenceRule: RecurrenceRule | null
}

export type ExpenseFormSource =
  | { kind: 'edit'; expense: EditableExpense }
  | { kind: 'repayment'; title: string /*translated 'reimbursement'*/; amount: number /*major units, already resolved*/;
      from?: string; to?: string }
  | { kind: 'new'; title?: string; date?: string; amount?: number /*major*/; categoryId?: number;
      paidBy?: string /*active user, resolved by caller*/; document?: { url: string; width: number; height: number } }

export type OpenedExpenseForm = {
  values: ExpenseFormInput
  /** True when the stored options name a participant who is no longer in the group. The caller removes the localStorage key. */
  discardStoredSplittingOptions: boolean
}

export function openExpenseForm(
  source: ExpenseFormSource,
  ctx: ExpenseFormContext,
  env: { today: Date; storedSplittingOptions: SplittingOptions | null; newId: () => string },
): OpenedExpenseForm

/** What just happened. The caller keeps its own guards (dirty/touched) and only sends a change when today's effect would run. */
export type ExpenseFormChange =
  | { type: 'amountTyped'; raw: string }                          // :910
  | { type: 'originalAmountTyped'; raw: string }                  // :765
  | { type: 'conversionRateTyped'; raw: string }                  // :849
  | { type: 'splitValueTyped'; participantId: string; raw: string }               // :1321
  | { type: 'participantOriginalAmountTyped'; participantId: string; raw: string; fetchedRate?: number } // :1252
  | { type: 'rebalance'; editedParticipantIds: ReadonlySet<string> }              // auto-balance effect
  | { type: 'convert' }                                           // either conversion effect; the model picks the direction

export type ExpenseFormView = {
  conversionRequired: boolean
  /** isReimbursement: repayment direction (group to original). Otherwise original to group. */
  convertFromGroupCurrency: boolean
  originalCurrency: Currency
  /** Share in minor units for each participant it was paid for. All 0 for a reimbursement. Equals calculateShare. */
  shares: ReadonlyMap<string, number>
  /** Ready for <FormMessage values>. Undefined unless the split mode is BY_AMOUNT or BY_PERCENTAGE. */
  splitSum?: { sum: string; difference: string; direction: 'over' | 'under'; amount?: string }
  /** Placeholder for a cleared by-amount original-currency input: the participant's part converted back. */
  originalAmountPlaceholder(participantId: string, fetchedRate?: number): string | undefined
}

export type ExpenseFormDerivation = {
  /** Fields to setValue. Empty object means nothing to change. Never contains fields the change does not own. */
  set: Partial<ExpenseFormInput>
  /** Present only when the change decides income/expense (amountTyped, or convert in the original-to-group direction). */
  isIncome?: boolean
  /** View of `values` after applying `set`. */
  view: ExpenseFormView
}

export function deriveExpenseForm(
  values: ExpenseFormInput,
  ctx: ExpenseFormContext,
  change?: ExpenseFormChange,     // omit to just read the view on render
): ExpenseFormDerivation

export function closeExpenseForm(
  parsed: ExpenseFormValues,      // output of zodResolver(expenseFormSchema)
  ctx: ExpenseFormContext,
): { values: ExpenseFormValues /*minor units*/; splittingOptionsToStore: SplittingOptions | null }
```

**Invariants**
- All three functions are pure. None of them mutates its arguments: `closeExpenseForm` returns a new object, where today's `submit` mutates `values` in place.
- `values` and `set` always use the input shape: split values are strings in major units, or percentages / weights. `closeExpenseForm.values` uses the output shape: minor units for `amount`, by-amount shares and `originalAmount`.
- `view.shares` and the submitted expense split the same way. Both go through `getParticipantShare` with `ctx.expenseId`, and the result adds up to `amountAsMinorUnits(amount)`.
- For `rebalance`, the split values in `set.paidFor` add up exactly, in minor units, to `amount`. This holds whenever at least one participant is not edited. Edited participants keep their split value exactly as typed.
- When no conversion is required, or there is no original amount, `closeExpenseForm` drops `originalAmount`, `originalCurrency` and `conversionRate` together.
- `splittingOptionsToStore` is `null` when `saveDefaultSplittingOptions` is false. When it is not null:
  - EVENLY stores 100 per participant.
  - BY_AMOUNT stores `paidFor: null`.
  - Other modes store the parsed shares, which are already ×100.

**Ordering constraints**
- `openExpenseForm` runs once, before `useForm`.
- For a by-amount split value: send `splitValueTyped` first and apply its `set`. Then update shareEdits. The auto-balance effect then sends `rebalance`. This is today's order: onChange, then markShareEdited, then the effect.
- `convert` must be sent after `conversionRate` has been set from the fetched rate. The component's guards stay where they are: `isTouched(originalAmount)` for the original-to-group direction, and the dirty checks when not creating for the repayment direction.

**Error modes**
- Nothing throws.
- An unusable rate or non-finite input gives `set: {}`, mirroring the `null` from `convertTo*Currency`.
- A repayment whose converted amount rounds to 0 in the original currency gives `set.originalAmount = ''`.
- JSON parse failure of localStorage stays with the caller. The model receives already-parsed `SplittingOptions | null`.
- Stale stored options give default values plus `discardStoredSplittingOptions: true`, whatever the `source.kind` (today `getDefaultSplittingOptions` runs even when editing).

### 2. Usage in expense-form.tsx

```ts
const ctx = { group, locale, expenseId: expense?.id ?? expenseId }
const [opened] = useState(() => openExpenseForm(
  expense ? { kind: 'edit', expense }
  : isRepayment ? { kind: 'repayment', title: t('reimbursement'),
      amount: amountAsDecimal(Number(sp.get('amount')) || 0, groupCurrency),
      from: sp.get('from') ?? undefined, to: sp.get('to') ?? undefined }
  : { kind: 'new', title: sp.get('title') ?? undefined, date: sp.get('date') ?? undefined, /* ... */ paidBy: getSelectedPayer() },
  ctx, { today: new Date(), storedSplittingOptions: readStoredOptions(group.id), newId: randomId }))
if (opened.discardStoredSplittingOptions) localStorage.removeItem(`${group.id}-defaultSplittingOptions`)
const form = useForm({ resolver: zodResolver(expenseFormSchema), defaultValues: opened.values })

const apply = (change: ExpenseFormChange, opts?: SetValueConfig) => {
  const { set, isIncome } = deriveExpenseForm(form.getValues(), ctx, change)
  for (const [k, v] of Object.entries(set)) form.setValue(k as any, v as any, opts)
  if (isIncome !== undefined) setIsIncome(isIncome)
}

useEffect(() => {                                           // auto-balance
  if (form.getValues().splitMode === 'BY_AMOUNT' && (dirty(paidFor) || dirty(amount)))
    apply({ type: 'rebalance', editedParticipantIds: new Set(edited(shareEdits)) }, { shouldValidate: true })
}, [shareEdits, form.watch('amount'), form.watch('splitMode')])

useEffect(() => { if (guardsPass) apply({ type: 'convert' }) }, [/* same deps as both of today's effects */])

const { view } = deriveExpenseForm(form.watch(), ctx)       // render
// preview: formatCurrency(groupCurrency, view.shares.get(id) ?? 0, locale)
// <FormMessage values={form.formState.errors.paidFor ? view.splitSum : undefined} />

const submit = async (parsed: ExpenseFormValues) => {
  sendEvent(/* ... */)
  const { values, splittingOptionsToStore } = closeExpenseForm(parsed, ctx)
  if (splittingOptionsToStore) localStorage.setItem(`${group.id}-defaultSplittingOptions`, JSON.stringify(splittingOptionsToStore))
  return onSubmit(values, activeUserId ?? undefined)
}
```

### 3. What the implementation hides behind the seam
- Local calendar date to UTC-midnight `today` (`getTodayForDateInput`).
- The three initial-value branches, including:
  - the `'Custom'` original-currency lookup for formatting the stored original amount
  - `shares / 100` vs `amountAsDecimal` depending on split mode
  - category 1 (Payment) vs 0 (General)
  - `originalAmount: ''` (rather than undefined) for repayments
  - documents from the receipt scan
- Turning stored `SplittingOptions` into split values, and back on submit, including the `paidFor: null` fallback.
- `enforceCurrencyPattern`, and which currency it is given in each input:
  - group currency for the amount
  - original currency for the original amount
  - none for the rate
  - group currency only in BY_AMOUNT for split values
- Income detection and forcing `isReimbursement: false` when the amount is negative.
- Picking the conversion direction from `isReimbursement`, the `conversionRequired` predicate, the `Number(v)` vs string asymmetry for `amount`, and the "rounds to zero → empty" rule.
- The per-participant original-currency conversion uses `fetchedRate`, not the form's `conversionRate`. This quirk is pinned as-is.
- Auto-balance via `distributeAmount` in minor units.
- Building `ShareInput` for the preview. The percentage is ×100 unrounded and BY_SHARES uses the raw number, exactly as today. The reimbursement case returns 0.
- Summing the "must add up" figures in minor units / basis points, and formatting them with `formatCurrency` / `toLocaleString`.
- Minor-unit mapping on submit and dropping the currency fields.

### 4. Dependency strategy
- Everything is in-process: `shares.ts`, `currency-conversion.ts`, `currency.ts` (`getCurrency`), and `utils.ts` (amount helpers, `formatCurrency`, `getCurrencyFromGroup`). There are no ports and no adapters.
- The only nondeterminism is `today` and `newId`, both passed in `env` to `openExpenseForm`.
- Tests live in `expense-form-model.test.ts` and call the three functions with literal objects. The structural `EditableExpense` means no Prisma Decimal is needed: `{ toNumber: () => 1.1 }` is enough.
- The same suite runs under two timezones (`TZ=Pacific/Auckland` and `TZ=America/Los_Angeles`).

### 5. Trade-offs
- **High leverage**
  - `deriveExpenseForm` absorbs four effects, five onChange normalisers, the preview and the sum figures behind one function and one union type. Adding a new derived rule means adding one union member, and the component does not change.
  - `closeExpenseForm` returns the storage payload, so the persistence policy (the BY_AMOUNT → null rule) is no longer split across files.
- **Thin spots**
  - `conversionRateTyped` is little more than `enforceCurrencyPattern(raw)`. It exists so the component never imports the helper.
  - `originalAmountPlaceholder` is a function inside the view because it depends on the cleared state, which the component owns.
- **Awkward for the component**
  - It still owns the dirty/touched guards, so it must know which change to send when. A mis-sent `convert` on edit would overwrite a stored original amount.
  - The patch is a `Partial<ExpenseFormInput>` applied field by field. Today, setValue options (`shouldValidate` for rebalance) differ per call site, so options stay with the caller.
  - Calling `deriveExpenseForm` without a change on every render recomputes the shares: an O(n log n) sort over at most 100 participants, which is negligible. Folding the view into the same entry point keeps the interface to three functions, at the cost of one function with two roles.
  - `isIncome` stays component state, because today it is only updated at specific moments and not derived on every render.

### 6. Test sketches (characterization, through the interface)
1. **Repayment conversion rounds to zero.** Values: repayment, `amount: '0.01'`, `originalCurrency: 'JPY'`, `conversionRate: '0.0063'`, `isReimbursement: true`. Calling `deriveExpenseForm(values, ctx, { type: 'convert' })` gives `set` equal to `{ originalAmount: '' }`. With `amount: '10.00'` it gives `{ originalAmount: '1587' }`. `closeExpenseForm` on the parsed result with `originalAmount` undefined drops all three currency fields.
2. **Auto-balance adds up.** BY_AMOUNT, `amount: '95'`, three participants, none edited. `rebalance` gives `['31.67', '31.67', '31.66']`. With p1 edited at `'50'` it gives `p1: '50', p2: '22.50', p3: '22.50'`. The split values always sum exactly to the amount in minor units.
3. **The preview equals `calculateShare`.**
   - EVENLY 100.00 over three participants, `expenseId: 'abc'`: `view.shares` matches `calculateShare(id, …)` for each participant and adds up to 10000.
   - BY_PERCENTAGE `['33.33', '33.33', '33.34']`: same check.
   - `isReimbursement: true`: all shares are 0.
4. **Opening a new expense with stale stored options and the timezone.**
   - `storedSplittingOptions` naming a removed participant: returns EVENLY over all participants with `'1'`, and `discardStoredSplittingOptions: true`.
   - `today = new Date('2026-11-17T23:30:00')` local: `expenseDate` is `2026-11-17T00:00Z` in both TZ runs.
   - A BY_PERCENTAGE stored option with shares 5000: gives split value `'50'`.
   - Round trip: `closeExpenseForm` with `saveDefaultSplittingOptions: true` and BY_AMOUNT gives `splittingOptionsToStore.paidFor === null`.

Pin as current behaviour (do not fix in this refactor):
- The percentage preview is unrounded, while the saved value is `Math.round`.
- A repayment with no `?to=` gets `paidFor: [undefined]`.
- The per-participant conversion uses the fetched rate, not the form's `conversionRate`.

### Critical Files for Implementation
- src/app/groups/[groupId]/expenses/expense-form.tsx
- src/lib/schemas.ts
- src/lib/shares.ts
- src/lib/currency-conversion.ts
- src/lib/utils.ts
