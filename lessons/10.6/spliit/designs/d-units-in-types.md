# Design D, units in the types

One of the four interface designs from lesson 10.6, as the sub-agent returned it. It is Claude's analysis of Spliit's MIT-licensed code at commit 59c41d7, kept here unedited apart from repository paths shortened to the repo root. Nothing in it was implemented: the chosen design is the hybrid in `issue-18-spec.md`.

---

## Design: `expense-form-model.ts`, where the type carries the unit

The rule the interface enforces is this: **any number or string whose unit is not already fixed by its type is branded.** That leaves three kinds of input and output:

- **ExpenseFormInput fragments.** These have one known encoding: typed strings in major units. They pass in and out unbranded.
- **Inputs from outside the form.** These come from the URL, a stored expense, localStorage or the rate hook. They are either self-describing (they carry `splitMode`) or branded.
- **Display outputs.** Preview shares, sum-error figures and placeholders are branded.

Brands exist only at the type level, and the model is the only module that mints them. A branded number still assigns to `number`, so values go into `onSubmit` and `formatCurrency` without casts.

### 1. Interface

```ts
declare const unit: unique symbol
type Side = 'group' | 'original'
export type MinorUnits<S extends Side> = number & { readonly [unit]: ['minor', S] }
export type MajorAmount<S extends Side> = number & { readonly [unit]: ['major', S] }
export type BasisPoints = number & { readonly [unit]: 'basis-points' } // percent ×100
export type ConversionRate = number & { readonly [unit]: '1 original = n group' }
/** Rejects already-branded values: a plain number fits, MinorUnits<…> does not. */
type Unbranded<T> = T & { readonly [unit]?: never }

/** The only casts in the module; easy to grep for. Callers use them at the URL/hook edge. */
export const units: {
  groupMinor(n: number): MinorUnits<'group'>
  groupMajor(n: number): MajorAmount<'group'>
  rate(n: number | null | undefined): ConversionRate | undefined // undefined unless finite and > 0
}

/** The currency-bound object. Every side-S value is read with currencies[S]. */
export type ExpenseCurrencies = { group: Currency; original: Currency; conversionRequired: boolean }
export function bindCurrencies(groupCurrencyCode: string | null, group: Currency, original: Currency): ExpenseCurrencies

/** Stored split value, picked per split mode. The edges where this applies are a stored expense, localStorage and submit. */
export type StoredPaidFor =
  | { splitMode: 'EVENLY' | 'BY_SHARES'; paidFor: { participant: string; shares: number /* weight ×100 */ }[] }
  | { splitMode: 'BY_PERCENTAGE'; paidFor: { participant: string; shares: BasisPoints }[] }
  | { splitMode: 'BY_AMOUNT'; paidFor: { participant: string; shares: MinorUnits<'group'> }[] }

// ---- initial values ----
type Common = { today: Date; newId: () => string; locale: Locale;
  group: { id: string; currencyCode: string | null; participants: { id: string }[] }
  defaultSplitting: SplittingOptions | null }        // raw from localStorage, not yet checked
export type Prefill =
  | { kind: 'edit'; expense: StoredExpense }          // the tRPC expense; amounts are read by its splitMode
  | { kind: 'repayment'; title: string; amount: MinorUnits<'group'>; from?: string; to?: string }
  | { kind: 'new'; title?: string; date?: Date; amount?: MajorAmount<'group'>; categoryId?: number;
      paidBy?: string; document?: { url: string; width: number; height: number } }
export function buildInitialValues(p: Prefill & Common):
  { values: ExpenseFormInput; staleDefaultSplitting: boolean }

// ---- localStorage conversion ----
export function splittingOptionsToSave(v: ExpenseFormValues): SplittingOptions // EVENLY→100s, BY_AMOUNT→null

// ---- submit ----
export type SubmittedExpense = Omit<ExpenseFormValues, 'amount' | 'originalAmount' | 'paidFor'>
  & { amount: MinorUnits<'group'>; originalAmount?: MinorUnits<'original'> }
  & StoredPaidFor                                      // assignable to ExpenseFormValues
export function toSubmittedExpense(
  v: ExpenseFormValues & { amount: Unbranded<number> }, c: ExpenseCurrencies): SubmittedExpense

// ---- live behaviour (snapshot in → form patch or branded figure out) ----
type Snap = Pick<ExpenseFormInput, 'amount' | 'splitMode' | 'paidFor' | 'isReimbursement'>
export function autoBalance(s: Snap, edited: ReadonlySet<string>, c: ExpenseCurrencies):
  ExpenseFormInput['paidFor'] | null                   // null unless BY_AMOUNT
export function previewShares(s: Snap, expenseId: string | undefined, c: ExpenseCurrencies):
  (participantId: string) => MinorUnits<'group'>       // 0 when reimbursement / not paid for
export type SplitSumError =
  | { splitMode: 'BY_AMOUNT'; sum: MinorUnits<'group'>; amount: MinorUnits<'group'>;
      difference: MinorUnits<'group'>; direction: 'over' | 'under' }
  | { splitMode: 'BY_PERCENTAGE'; sum: BasisPoints; difference: BasisPoints; direction: 'over' | 'under' }
export function splitSumError(s: Snap): SplitSumError | null     // reads currencies only for BY_AMOUNT
export function splitSumMessageValues(e: SplitSumError, c: ExpenseCurrencies, locale: Locale): Record<string, string>

export function originalToGroup(s: Pick<ExpenseFormInput, 'originalAmount' | 'conversionRate'>, c: ExpenseCurrencies):
  { amount: number; isIncome: boolean; clearReimbursement: boolean } | null
export function groupToOriginal(s: Pick<ExpenseFormInput, 'amount' | 'conversionRate'>, c: ExpenseCurrencies):
  { originalAmount: string } | null                    // '' when it rounds to zero
export function participantOriginalAmountTyped(typed: string, rate: ConversionRate | undefined, c: ExpenseCurrencies):
  { originalAmount: string; shares: string; cleared: boolean }
export function participantOriginalPlaceholder(shares: string, rate: ConversionRate | undefined, c: ExpenseCurrencies):
  string | undefined

export function enforceCurrencyPattern(value: string, currency?: Currency): string
```

**Invariants**
- The amount in the form is always in major units of the group currency. `paidFor[].shares` is always the typed string. Minor units and ×100 values never enter form state.
- `SubmittedExpense.paidFor` is encoded according to its `splitMode`. The discriminated union means a `BasisPoints` value cannot sit under `BY_AMOUNT`.
- `previewShares(...)` gives the same result as `calculateShare` for every participant.

**Ordering**
- Call `splittingOptionsToSave` on the schema output *before* `toSubmittedExpense`. It works on the ×100 encoding.
- `bindCurrencies` must be called again whenever `originalCurrency` changes.

**Error modes**
- Nothing throws.
- An unusable rate or a non-finite input returns `null` from the conversion functions, and the caller leaves the field as it is.
- If the stored default splitting names a participant who no longer exists, the function returns `staleDefaultSplitting: true`. The component then removes the localStorage key.
- The `Unbranded` parameter makes it a compile error to pass a `SubmittedExpense` back into `toSubmittedExpense`, which would convert it to minor units twice.

### 2. Usage in expense-form.tsx

```ts
const raw = localStorage-safe read → SplittingOptions | null
const prefill: Prefill = expense ? { kind: 'edit', expense }
  : isRepayment ? { kind: 'repayment', title: t('reimbursement'),
      amount: units.groupMinor(Number(sp.get('amount')) || 0), from: sp.get('from') ?? undefined, to: sp.get('to') ?? undefined }
  : { kind: 'new', amount: units.groupMajor(Number(sp.get('amount')) || 0), /* title, date, … */ }
const init = buildInitialValues({ ...prefill, today: getTodayForDateInput(), newId: randomId, locale, group, defaultSplitting: raw })
if (init.staleDefaultSplitting) localStorage.removeItem(`${group.id}-defaultSplittingOptions`)
const form = useForm({ resolver: zodResolver(expenseFormSchema), defaultValues: init.values })
const c = bindCurrencies(group.currencyCode, groupCurrency, originalCurrency)

useEffect(() => {                                     // auto-balance
  if (!(form.getFieldState('paidFor').isDirty || form.getFieldState('amount').isDirty)) return
  const edited = new Set([...shareEdits].filter(([, s]) => s === 'edited').map(([id]) => id))
  const next = autoBalance(form.getValues(), edited, c)
  if (next) form.setValue('paidFor', next, { shouldValidate: true })
}, [shareEdits, form.watch('amount'), form.watch('splitMode')])

const submit = async (values: ExpenseFormValues) => {
  sendEvent(...)
  if (values.saveDefaultSplittingOptions) localStorage.setItem(key, JSON.stringify(splittingOptionsToSave(values)))
  return onSubmit(toSubmittedExpense(values, c), activeUserId ?? undefined)
}

const shareOf = previewShares(form.watch(), expense?.id ?? expenseId, c)
// render: formatCurrency(groupCurrency, shareOf(id), locale)
const sumErr = form.formState.errors.paidFor ? splitSumError(form.watch()) : null
<FormMessage values={sumErr ? splitSumMessageValues(sumErr, c, locale) : undefined} />
```

### 3. What the implementation hides
- How each split mode encodes its values, in three forms: the typed string, the stored value (×100, basis points or minor units), and the ratio passed to `ShareInput`. Two quirks are kept for the refactor: the preview uses unrounded `Number(s)*100` for percentages and raw weights for by-shares.
- Hamilton apportionment through `distributeAmount`, and the float to minor-unit maths inside auto-balance.
- Building the `ShareInput` and the reimbursement → 0 rule. There is no fake Prisma row.
- `amountAsDecimal`, `amountAsMinorUnits` and `formatAmountAsDecimal`, and which currency each call uses.
- The conversion direction and the "rounds to zero → empty" rule.
- Dropping `originalAmount`, `originalCurrency` and `conversionRate` when no conversion took place.
- The three prefill shapes, the fallback to the stored default splitting, and checking it for stale participants.

### 4. Dependency strategy
Everything runs in-process: `shares.ts`, `currency-conversion.ts`, `utils.ts` and `currency.ts`, and there are no ports. The only non-determinism comes from `today` and `newId`, and both are parameters. Tests import the functions directly and build `Currency` fixtures (EUR with 2 decimal digits, JPY with 0). They mint inputs with `units.*` and run under both TZ settings. The `previewShares` tests compare against `calculateShare` itself as the oracle.

### 5. Trade-offs
- **High leverage:**
  - `StoredPaidFor` and `SubmittedExpense`. These fix the real minor-vs-×100 hazard at the type level.
  - `Prefill.repayment.amount: MinorUnits` against `new.amount: MajorAmount`. This is exactly the URL ambiguity.
  - `SplitSumError` as a union, so percentages cannot be formatted as currency.
  - The `'group' | 'original'` side tag on conversions and placeholders.
- **Thin:**
  - `enforceCurrencyPattern` stays unbranded, because its output goes straight into form fields typed `string`.
  - The live functions take unbranded `ExpenseFormInput` snapshots. Since the schema stays unchanged, form state cannot carry brands. The model's protection therefore starts at its edge, not inside react-hook-form.
- **Awkward for the component:**
  - `c` has to be rebuilt every time `originalCurrency` changes.
  - `originalToGroup` returns a three-field patch that the component spreads into `setIsIncome` and two `setValue` calls.
  - `units.groupMinor` is an unchecked cast. The type says "this is minor", but it cannot prove it.
  - `Unbranded<number>` is a clever trick and needs a one-line comment.
- **Preserved quirk:** per-participant conversion uses the fetched rate (`exchangeRate.data`), not the form's `conversionRate`. Keeping the parameter typed as `ConversionRate` makes that choice visible.

### 6. Test sketch
1. **Edit round trip, BY_AMOUNT in JPY.** Start from a stored expense with amount 1000 and shares [333, 667]. Then `buildInitialValues` gives `amount: 1000` and shares `'333'`/`'667'`. Running the schema and then `toSubmittedExpense` returns the same minor units, with no currency fields when there is no conversion. Also check that `@ts-expect-error toSubmittedExpense(toSubmittedExpense(v,c), c)` does not compile.
2. **Auto-balance.** EUR amount `'95'`, three participants, nothing edited. The result is `'31.67','31.67','31.66'`, and it sums exactly to the amount, so `splitSumError` is null after the schema passes. With one participant edited to `'50'`, the other two get `'22.50'`.
3. **Preview equals `calculateShare`.** Loop over every split mode, with and without income and with an expense id, and assert `previewShares(s,id,c)(p) === calculateShare(p, equivalentRow)`. For a reimbursement every participant gets 0.
4. **Repayment conversion.** Amount 1 minor unit of EUR, rate 1000, original currency JPY. `groupToOriginal` returns `{ originalAmount: '' }`, and the submitted expense drops `originalAmount`, `originalCurrency` and `conversionRate`. For comparison, `originalToGroup` with `'-10'` returns `isIncome: true, clearReimbursement: true`.

### Critical Files for Implementation
- src/app/groups/[groupId]/expenses/expense-form.tsx
- src/lib/schemas.ts
- src/lib/shares.ts
- src/lib/currency-conversion.ts
- src/lib/utils.ts (also src/lib/totals.ts for the `calculateShare` oracle)
