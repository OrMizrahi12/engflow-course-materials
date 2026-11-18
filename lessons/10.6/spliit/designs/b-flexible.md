# Design B, flexible (a rules table per split mode)

One of the four interface designs from lesson 10.6, as the sub-agent returned it. It is Claude's analysis of Spliit's MIT-licensed code at commit 59c41d7, kept here unedited apart from repository paths shortened to the repo root. Nothing in it was implemented: the chosen design is the hybrid in `issue-18-spec.md`.

---

## Design: `expense-form-model.ts` (flexibility-first)

The main idea is to build the module around a **per-split-mode rules table** plus one **context object**, and to return plain data (minor-unit numbers and `FormPatch` objects) rather than formatted strings or React state. Later callers can then reuse each piece without the form: the receipt scan uses initial values, a server-side check uses the sum check and the submit mapping, and a schema split moves the submit mapping to the server. A new split mode means adding one table entry, and the compiler flags it.

### 1. Interface

```ts
// ---- context (built once per render; no React, no locale, no localStorage) ----
export type ExpenseFormContext = {
  groupCurrency: Currency
  groupCurrencyCode: string
  participantIds: string[]
  currencyOf: (code: string) => Currency   // component passes c => getCurrency(c, locale, 'Custom')
  today: Date                               // UTC-midnight date-only (getTodayForDateInput today)
  newId: () => string                       // randomId in prod, counter in tests
}
export type FormPatch = Partial<ExpenseFormInput>   // what the component applies with setValue

// ---- per-split-mode codec: the extension point ----
export type SplitModeRules = {
  /** stored share (minor units / basis points / x100 weight) -> split value string */
  toSplitValue(share: number, groupCurrency: Currency): string
  /** split value string -> ShareInput.shares for the live preview (current mapping, not submit's) */
  toPreviewShare(value: string, groupCurrency: Currency): number
  /** post-schema share -> persisted share (identity except BY_AMOUNT -> minor units) */
  toStoredShare(share: number, groupCurrency: Currency): number
  /** "must add up" figures, or undefined if the mode has no sum rule */
  sumCheck?(amount: number | string, values: string[], groupCurrency: Currency): SplitSumCheck
  /** saved as default splitting options? EVENLY -> shares 100, BY_AMOUNT -> null */
  toStoredDefault(paidFor: ExpenseFormValues['paidFor']): SplittingOptions['paidFor']
  autoBalances: boolean                    // only BY_AMOUNT today
}
export const splitModeRules: Record<SplitMode, SplitModeRules>   // exhaustive over the Prisma enum

export type SplitSumCheck =
  | { unit: 'minor'; addsUp: boolean; sum: number; amount: number; difference: number; direction: 'over' | 'under' }
  | { unit: 'basisPoints'; addsUp: boolean; sum: number; target: 10000; difference: number; direction: 'over' | 'under' }

// ---- initial values: one discriminated union, open to new sources ----
export type ExpensePrefill = {            // new-from-URL today, receipt scan tomorrow
  title?: string; date?: Date; amount?: number /* major units */; categoryId?: number
  document?: { url: string; width: number; height: number }
}
export type InitialValuesSource =
  | { kind: 'edit'; expense: EditableExpense }          // Pick<> of the tRPC expense type
  | { kind: 'repayment'; amount: number /* minor */; from?: string; to?: string; title: string }
  | { kind: 'new'; prefill: ExpensePrefill; activeUserId?: string }
export type SplitDefaults = { splitMode: SplitMode; paidFor: ExpenseFormInput['paidFor'] }

export function createExpenseFormModel(ctx: ExpenseFormContext): {
  // defaults (localStorage I/O stays in the component)
  splitDefaultsFromStored(stored: SplittingOptions | null): SplitDefaults | 'stale'
  splitDefaultsToStored(values: ExpenseFormValues): SplittingOptions | null   // null unless saveDefaultSplittingOptions
  initialValues(source: InitialValuesSource, defaults: SplitDefaults): ExpenseFormInput

  // reactions: each returns a patch, or null for "leave the form alone"
  autoBalance(input: { amount: number | string; paidFor: ExpenseFormInput['paidFor'];
                       edited: ReadonlySet<string> }): ExpenseFormInput['paidFor']
  amountFromOriginal(v: ExpenseFormInput, s: { originalAmountTouched: boolean }): FormPatch | null
  originalFromAmount(v: ExpenseFormInput, s: { isCreate: boolean; amountDirty: boolean;
                     originalCurrencyDirty: boolean; conversionRateDirty: boolean }): FormPatch | null
  splitValueFromOriginal(typed: string, rate: number | undefined, originalCode: string):
    { originalAmount: string; shares: string }
  splitValuePlaceholderInOriginal(shares: string, rate: number | undefined, originalCode: string): string | undefined

  // read models
  isConversionRequired(originalCode: string | null | undefined): boolean
  previewShareInput(v: ExpenseFormInput, expenseId?: string): ShareInput | null  // null for reimbursement
  previewShares(v: ExpenseFormInput, expenseId?: string): Map<string, number>    // minor units; 0s for reimbursement
  splitSum(v: ExpenseFormInput): SplitSumCheck | undefined

  // submit
  toSubmitted(values: ExpenseFormValues): ExpenseFormValues  // new object, minor units, currency fields dropped
}
export function enforceCurrencyPattern(value: string, currency?: Currency): string
```

**Invariants**
- Inputs are always `ExpenseFormInput` (split values are major-unit strings). Outputs are minor units everywhere except `toSubmitted`, which returns `ExpenseFormValues` with amount and BY_AMOUNT shares in minor units. That matches what `submit()` sends today.
- Every function is pure: it never mutates its arguments. `toSubmitted` returns a copy, whereas today's code mutates `values`.
- `previewShares(v, id).get(p)` equals `calculateShare(p, <equivalent row>)` for every participant.
- `autoBalance` keeps the rows' order and `participant`/`originalAmount` fields. It rewrites `shares` only on rows outside `edited`, and those rewritten shares add up exactly to `amount − Σ edited` in minor units, using `distributeAmount`, so leftovers go to the first rows.
- `originalFromAmount` returns `{ originalAmount: '' }` when the converted amount rounds to 0.
- `toSubmitted` drops `originalAmount`, `originalCurrency` and `conversionRate` together whenever conversion is not required or `originalAmount` is undefined.

**Ordering:** call `splitDefaultsFromStored` before `initialValues` (repayment and new expenses both read `defaults.splitMode`). `toSubmitted` takes values that have already passed through `expenseFormSchema`.

**Error modes:** nothing throws. Bad numbers and unusable rates give `null` (no patch) or `''`. A stale participant in the stored defaults gives `'stale'`, and the component removes the key.

### 2. Usage in expense-form.tsx

```ts
const model = useMemo(() => createExpenseFormModel({ groupCurrency, groupCurrencyCode: group.currencyCode,
  participantIds: group.participants.map(p => p.id), currencyOf: c => getCurrency(c, locale, 'Custom'),
  today: getTodayForDateInput(), newId: randomId }), [group, locale])

const stored = readJson(localStorage, `${group.id}-defaultSplittingOptions`)
let defaults = model.splitDefaultsFromStored(stored)
if (defaults === 'stale') { localStorage.removeItem(key); defaults = model.splitDefaultsFromStored(null) as SplitDefaults }
const source: InitialValuesSource = expense ? { kind: 'edit', expense }
  : isRepayment ? { kind: 'repayment', amount: Number(sp.get('amount')) || 0, from: sp.get('from') ?? undefined,
                    to: sp.get('to') ?? undefined, title: t('reimbursement') }
  : { kind: 'new', prefill: readPrefillFromUrl(sp), activeUserId: storedActiveUser }
const form = useForm({ resolver: zodResolver(expenseFormSchema), defaultValues: model.initialValues(source, defaults) })

useEffect(() => {
  const v = form.getValues()
  if (!splitModeRules[v.splitMode].autoBalances) return
  if (!form.getFieldState('paidFor').isDirty && !form.getFieldState('amount').isDirty) return
  const edited = new Set([...shareEdits].filter(([, s]) => s === 'edited').map(([id]) => id))
  form.setValue('paidFor', model.autoBalance({ amount: v.amount, paidFor: v.paidFor, edited }), { shouldValidate: true })
}, [shareEdits, form.watch('amount'), form.watch('splitMode')])

useEffect(() => {
  const patch = model.amountFromOriginal(form.getValues(),
    { originalAmountTouched: form.getFieldState('originalAmount').isTouched })
  if (!patch) return
  setIsIncome(Number(patch.amount) < 0)
  applyPatch(form, patch)          // 3-line helper: setValue per key
}, [/* same deps as today */])

const submit = async (values: ExpenseFormValues) => {
  sendEvent(...)
  const stored = model.splitDefaultsToStored(values)
  if (stored) localStorage.setItem(key, JSON.stringify(stored))
  return onSubmit(model.toSubmitted(values), activeUserId ?? undefined)
}

// render
const shares = model.previewShares(form.watch(), expense?.id ?? expenseId)   // once, not per row
... ({formatCurrency(groupCurrency, shares.get(id) ?? 0, locale)})
const check = form.formState.errors.paidFor ? model.splitSum(form.watch()) : undefined
const splitSumValues = check && formatSplitSum(check, groupCurrency, locale)  // component formats
```

### 3. What the implementation hides
- Unit conventions per mode: shares ×100 for EVENLY and BY_SHARES, basis points for BY_PERCENTAGE, minor units for BY_AMOUNT. `/100` from storage, `amountAsDecimal` on edit, `amountAsMinorUnits` on submit. All of this lives in `splitModeRules`, so it sits in one place where today it is spread across five sites.
- Turning form values into a `ShareInput`, with no fake Prisma row. Current preview quirks are kept on purpose: BY_PERCENTAGE uses `Number(s)*100` without rounding, and BY_SHARES uses the raw `Number(s)`.
- The auto-balance algorithm and its `distributeAmount` minor-unit apportionment.
- Both conversion directions with their gating rules: "touched" for original→group; "create or dirty" for group→original; the rule that a result rounding to zero gives an empty field; and income forcing `isReimbursement: false`.
- The per-participant BY_AMOUNT conversion. It uses the rate the component passes in (today that is `exchangeRate.data`, not the form's `conversionRate`, and this is pinned). It runs `toFixed` and then `enforceCurrencyPattern`.
- Summing in minor units or basis points for the "must add up" figures.
- The odd repayment defaults: `paidFor: [undefined]` when there is no `to` (characterize it and don't fix it), category 1, and `splitMode` taken from the stored defaults.

### 4. Dependency strategy
All dependencies are in-process: `shares.ts`, `currency-conversion.ts`, `utils.ts` and the `Currency` type. There are no ports. The only things that vary by environment come in through `ExpenseFormContext`: `today`, `newId` and `currencyOf` (which removes locale from the module). Tests build a context with literal `Currency` objects (EUR with 2 decimals, JPY with 0, and a 3-decimal currency), a fixed `today`, and a counter for `newId`. They call the module directly under both `TZ` runs. A future server-side check builds the same context from the group row.

### 5. Trade-offs
- **High leverage:** `splitModeRules` (one place per split mode, compile error on a new enum value), `previewShares`, `toSubmitted`, `initialValues` and `autoBalance`. Each replaces dozens of lines of inline logic and can be tested without React.
- **Thin:** `amountFromOriginal` and `originalFromAmount` still need the component to pass the dirty/touched flags. The gating lives in the module, but the component has to remember which flags to read, and the effect dependency arrays stay in the component, so the coupling just moves there.
- **Flexibility costs:** the context factory and rules table add indirection compared with free functions. `SplitSumCheck` returns raw numbers, so the component keeps a small `formatSplitSum` (locale belongs there). `FormPatch` needs an `applyPatch` helper, because `setValue` does not take partial objects.
- **Divergence the seam exposes:** preview (`toPreviewShare`) and submit (schema ×100 with rounding) map BY_SHARES and BY_PERCENTAGE differently once values have more than 2 decimals. The rules table makes this visible and fixable later; this refactor keeps it.
- **Awkward for the component:** it still owns `shareEdits`, both dirty-reset effects, the `isIncome` state and the `'stale'` handling. `initialValues` needs `title: t('reimbursement')` passed in.

### 6. Test sketches (through the interface)
1. **Preview equals `calculateShare`.** For each split mode, with an id `'exp-1'`, and amount `'95'` over three participants (BY_PERCENTAGE `'33.33','33.33','33.34'`), check `model.previewShares(v,'exp-1').get(p) === calculateShare(p, row)` for every p. The shares add up to 9500. For a reimbursement the map is all 0.
2. **Auto-balance:** amount `'95'`, three rows, `edited={'a'}` with a = `'10'` gives b and c `'42.50','42.50'`. With nothing edited it gives `'31.67','31.67','31.66'`. For JPY with amount `'100'` over three rows it gives `'34','33','33'`.
3. **Repayment rounding to zero:** a repayment with `isCreate:true`, amount `'0.01'`, rate 1000 and original currency JPY gives `{ originalAmount: '' }`. Then `toSubmitted` on the matching values has no `originalAmount`, `originalCurrency` or `conversionRate`.
4. **Initial values from an edit:** a BY_AMOUNT expense with shares `[1050, 950]` minor gives `paidFor` shares `[10.5, 9.5]` and amount `20`. A BY_PERCENTAGE expense with `[5000, 5000]` gives `'50','50'`. Run under `TZ=UTC` and `TZ=Pacific/Auckland`, with `expenseDate` null, to check that the `today` fallback is used unchanged.

### Critical Files for Implementation
- src/app/groups/[groupId]/expenses/expense-form.tsx
- src/lib/schemas.ts
- src/lib/shares.ts
- src/lib/currency-conversion.ts
- src/lib/totals.ts (and the amount helpers in src/lib/utils.ts)
