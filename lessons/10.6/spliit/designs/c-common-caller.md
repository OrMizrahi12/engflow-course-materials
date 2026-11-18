# Design C, most common caller

One of the four interface designs from lesson 10.6, as the sub-agent returned it. It is Claude's analysis of Spliit's MIT-licensed code at commit 59c41d7, kept here unedited apart from repository paths shortened to the repo root. Nothing in it was implemented: the chosen design is the hybrid in `issue-18-spec.md`.

---

## Expense form model: interface design (optimised for the common caller)

The design rests on one idea. The form calls this module many times per keystroke, and almost every call would otherwise pass the same three things: the group currency, the locale and the expense id. So the caller passes them once, to a factory. What comes back is a set of pure functions over the values the form already holds (`ExpenseFormInput`). Each returns either the patch to apply or `null` for "nothing to do". That makes every effect read the values, call the model and set the result if there is one.

New file: `src/app/groups/[groupId]/expenses/expense-form-model.ts`

### 1. Interface

```ts
type Ctx = {
  group: { currencyCode: string; currency: string; participants: { id: string }[] } // what getCurrencyFromGroup needs + ids
  locale: Locale
  expenseId?: string     // the id the preview seeds the rotation with (expense.id ?? minted id)
  now: () => Date        // model turns this into "today" as UTC midnight of the local date
  newId: () => string    // receipt document id
}
export function createExpenseFormModel(ctx: Ctx): ExpenseFormModel

type InitialSource =
  | { kind: 'edit'; expense: EditedExpense }                    // AppRouterOutput expense
  | { kind: 'repayment'; amount: number /*minor*/; from?: string; to?: string; title: string }
  | { kind: 'new'; prefill: NewExpensePrefill; splitting: DefaultSplitting; activeUserId?: string }
type NewExpensePrefill = { title?: string; date?: string; amount?: number /*major*/; categoryId?: number;
  receipt?: { url: string; width: number; height: number } }
type DefaultSplitting = Pick<ExpenseFormInput, 'splitMode' | 'paidFor'>
type SplitSumValues = { sum: string; amount?: string; difference: string; direction: 'over' | 'under' }

interface ExpenseFormModel {
  groupCurrency: Currency
  currencies(v: ExpenseFormInput): { original: Currency; conversionRequired: boolean }

  // initial values / localStorage conversion (no storage access)
  initialValues(src: InitialSource): ExpenseFormInput
  defaultSplitting(stored: SplittingOptions | null): DefaultSplitting | 'stale'
  splittingToStore(v: ExpenseFormValues): SplittingOptions | null   // null => don't persist

  // per keystroke
  autoBalance(v: ExpenseFormInput, editedParticipantIds: ReadonlySet<string>): ExpenseFormInput['paidFor'] | null
  groupAmountFromOriginal(v: ExpenseFormInput): { amount: number; isIncome: boolean } | null
  originalAmountFromGroup(v: ExpenseFormInput): { originalAmount: string } | null
  withParticipantOriginalAmount(v: ExpenseFormInput, participantId: string, typed: string, rate?: number)
    : { paidFor: ExpenseFormInput['paidFor']; cleared: boolean }
  participantOriginalPlaceholder(v: ExpenseFormInput, participantId: string, rate?: number): string | undefined

  // per render
  previewShare(v: ExpenseFormInput, participantId: string): number   // minor units, 0 for reimbursement
  splitSumValues(v: ExpenseFormInput): SplitSumValues | undefined     // undefined for EVENLY/BY_SHARES

  // submit
  toSubmission(v: ExpenseFormValues): ExpenseFormValues               // returns a new object; does not mutate
}
export function enforceCurrencyPattern(value: string, currency?: Currency): string
```

**Invariants**
- Every input is shaped like `ExpenseFormInput`: split values are strings in major units. `toSubmission` is the only function that produces minor units. Only the amount and BY_AMOUNT split values are scaled; the schema has already multiplied the other split modes by 100.
- `autoBalance` returns `null` unless the split mode is BY_AMOUNT. Otherwise it keeps edited participants exactly as typed, and the rest get `distributeAmount` of what is left in minor units, formatted with the group currency's decimals. Together with the edited values they add up to the amount exactly.
- `previewShare(v, id) === calculateShare(id, <same expense saved>)`. It builds a `ShareInput` and calls `getParticipantShare` directly, and returns 0 when `isReimbursement` is set. It keeps today's scaling exactly: percentage × 100 without rounding, BY_AMOUNT in minor units, BY_SHARES taken as is.
- `toSubmission` drops `originalAmount`, `originalCurrency` and `conversionRate` together when `!conversionRequired || originalAmount === undefined`.
- `originalAmountFromGroup` returns `{ originalAmount: '' }` when the converted amount rounds to 0. It returns `null` when the expense is not a reimbursement, no conversion is needed, or the rate can't be used.
- `groupAmountFromOriginal` returns `null` when the expense is a reimbursement, no conversion is needed, or the original amount or rate is missing or zero.
- `defaultSplitting(null)` gives EVENLY with every participant at "1". A stored `paidFor` of `null` is replaced by everyone. If a stored participant no longer exists the result is `'stale'`, and the caller removes the key.

**Ordering and guards the caller keeps.** Whether a conversion should run at all stays in the component, because it depends on react-hook-form state:
- the dirty check on `paidFor`/`amount` before `autoBalance`;
- the touched check on `originalAmount` before `groupAmountFromOriginal`;
- "editing and nothing dirty" before `originalAmountFromGroup`.

Clearing `shareEdits` when the split mode or amount changes also stays there. The model is stateless, so it puts no ordering constraints between its own calls.

**Error modes.** Nothing throws. Bad or partial input gives `null` (no patch), and NaN splits count as 0, the same as today's `Number(x) || 0`. Validation messages remain the schema's job.

### 2. Usage in expense-form.tsx

```ts
const model = useMemo(() => createExpenseFormModel({ group, locale, expenseId: expense?.id ?? expenseId,
  now: () => new Date(), newId: randomId }), [group, locale, expense?.id, expenseId])

const stored = readStoredSplitting(group.id)                 // component: localStorage + JSON.parse
let splitting = model.defaultSplitting(stored)
if (splitting === 'stale') { localStorage.removeItem(key); splitting = model.defaultSplitting(null) }
const form = useForm({ resolver: zodResolver(expenseFormSchema), defaultValues: model.initialValues(
  expense ? { kind: 'edit', expense }
  : isRepayment ? { kind: 'repayment', amount: Number(sp.get('amount')) || 0, from, to, title: t('reimbursement') }
  : { kind: 'new', prefill: readPrefill(sp), splitting, activeUserId: storedActiveUser }) })

useEffect(() => {                                            // auto-balance
  if (!form.getFieldState('paidFor').isDirty && !form.getFieldState('amount').isDirty) return
  const next = model.autoBalance(form.getValues(), editedIds(shareEdits))
  if (next) form.setValue('paidFor', next, { shouldValidate: true })
}, [shareEdits, form.watch('amount'), form.watch('splitMode')])

useEffect(() => {                                            // original -> group
  if (!form.getFieldState('originalAmount').isTouched) return
  const r = model.groupAmountFromOriginal(form.getValues()); if (!r) return
  setIsIncome(r.isIncome); if (r.isIncome) form.setValue('isReimbursement', false)
  form.setValue('amount', r.amount)
}, [...])

const submit = async (values) => {
  const toStore = model.splittingToStore(values); if (toStore) localStorage.setItem(key, JSON.stringify(toStore))
  return onSubmit(model.toSubmission(values), activeUserId ?? undefined)
}

// per participant row
({formatCurrency(model.groupCurrency, model.previewShare(form.watch(), id), locale)})
onChange={(e) => { const r = model.withParticipantOriginalAmount(form.getValues(), id, e.target.value, exchangeRate.data)
  field.onChange(r.paidFor); markShareEdited(id, r.cleared) }}

const splitSum = form.formState.errors.paidFor ? model.splitSumValues(form.watch()) : undefined
```

### 3. What the implementation hides

- How each split mode is scaled, in three places:
  - initial values: edit divides by 100, or uses `amountAsDecimal` for BY_AMOUNT;
  - preview: × 100, minor units, or raw;
  - submit: minor units only for the amount and BY_AMOUNT.
- Deciding whether a conversion is needed, and looking up the original `Currency` from its code with the `'Custom'` fallback.
- Both conversion directions, with `enforceCurrencyPattern` applied to each result, and the rule that a repayment amount rounding to zero becomes empty.
- The per-participant BY_AMOUNT conversion. It multiplies by the fetched `exchangeRate.data` with `toFixed`, not by the `conversionRate` form field; that is today's quirk, and keeping it means the module must not call `convertToGroupCurrency`.
- Auto-balance done with `distributeAmount` in minor units.
- The "must add up" sums: BY_AMOUNT in minor units, BY_PERCENTAGE in basis points, both formatted with the locale.
- The three ways an expense is created (edit, repayment, new), including today's minor-vs-major amount differences and default categories 1 and 0.
- Turning `now` into a date at UTC midnight.
- The receipt document, with its id from `newId`.
- The localStorage shape (`SplittingOptions`, the × 100 scaling, BY_AMOUNT stored as `null`).

### 4. Dependency strategy

Every dependency runs in the same process and is called directly: `shares.ts`, `currency-conversion.ts`, `utils.ts`, `currency.ts` (getCurrency). There are no ports or adapters. The only things that vary are `now` and `newId`, which go into the factory. Tests call `createExpenseFormModel({ group: fixtureGroup, locale: 'en-US', expenseId: 'e1', now: () => new Date(2026, 10, 17, 23, 30), newId: () => 'doc1' })` and assert on what comes back. The test suite runs under `TZ=UTC` and under a timezone far from UTC. For the parity invariant, tests call `calculateShare` from `totals.ts` as the oracle.

### 5. Trade-offs

**Where leverage is high:**
- `previewShare`: about 40 inline lines become one call, and it removes the fake Prisma row.
- `toSubmission`: three scaling rules and the "drop currency fields" rule.
- `initialValues`: about 100 lines.
- `autoBalance`.
- `withParticipantOriginalAmount`: about 30 inline lines.
- Being able to take the whole `form.getValues()` lets every call site stay one line.

**Where it is thin:**
- `currencies()` and `enforceCurrencyPattern` are close to pass-throughs. They are exposed because the component needs them for rendering (symbols, step, whether to show the per-participant input).
- `splittingToStore` and `defaultSplitting` are small. They are in the module so the scaling rules sit together.

**What is awkward for the component:**
- The guards (dirty and touched checks, "editing and nothing dirty") stay split between the component and the module. The model can't see react-hook-form state, so a reader still needs both files to know when a conversion fires.
- Passing the whole values object hides which fields each function reads, so the effect dependency lists must still be kept by hand.
- `autoBalance` takes a set of ids, as decided, while the component keeps a Map with edited and cleared entries. That needs a one-line `editedIds(shareEdits)` filter. It could live in the component, or the module could export it, though that would be thin.
- `previewShare` is called once per participant and rebuilds the `ShareInput` each time, which is O(n²). That is fine at 100 participants or fewer, and `getParticipantShare` is what was decided on.
- `isIncome` is still separate component state, set from the conversion result.

**Checked, not a bug:** the localStorage round-trip (store "2", read back divided by 100) looked wrong at first. It is correct, because the schema transform has already multiplied by 100 before `persist` runs. A characterization test should pin it.

### 6. Test sketches (through the interface)

1. **Preview matches `calculateShare`.** Use BY_PERCENTAGE with 33.33 / 33.33 / 33.34 on an amount of "95.00" and `expenseId: 'e1'`. For each participant, `previewShare(v, id)` must equal `calculateShare(id, { id: 'e1', amount: 9500, splitMode, paidFor: [...basis points] })`, and the shares must add up to 9500. With `isReimbursement: true`, every share is 0.
2. **Auto-balance.** BY_AMOUNT, amount "95", three participants, with p1 edited at "10". The result is p1 "10.00"-or-as-typed and the rest "42.50", "42.50". With no edits it is "31.67", "31.67", "31.66" in `distributeAmount` order, adding up to exactly 95. For EVENLY the result is `null`.
3. **Submit and conversion.** Group EUR, original currency USD, original amount "12.345", rate 0.9. `toSubmission` gives amount in minor units and the BY_AMOUNT shares in minor units, with no mutation of the input. When the original currency equals the group currency, `originalAmount`, `originalCurrency` and `conversionRate` are absent. For a repayment of amount "0.01", rate 1000 and JPY, `originalAmountFromGroup` gives `{ originalAmount: '' }`.
4. **Initial values across two timezones.** `{ kind: 'new', prefill: {}, splitting: model.defaultSplitting(null) }` with `now` set to 23:30 local time on 17 Nov gives `expenseDate` = `2026-11-17T00:00Z` in both. A repayment with amount 1234 in EUR gives amount 12.34 and category 1. A stored splitting that names a deleted participant gives `'stale'`.

### Critical Files for Implementation
- src/app/groups/[groupId]/expenses/expense-form.tsx
- src/lib/schemas.ts
- src/lib/shares.ts
- src/lib/currency-conversion.ts
- src/lib/totals.ts (calculateShare, the oracle for preview parity)
