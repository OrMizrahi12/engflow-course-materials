# The grilling: rounds 1 and 2, with my answers

As printed in the session, in order. Each question carries its recommended answer (➡️), worded so that "yes" accepts it.
In Q13 the repository name is replaced with `<owner>/spliit`.

## My pick (typed)

```
Let's explore 1, the expense form model.```

## Round 1 ("Worked for 32s")

I read the form's logic (`expense-form.tsx:1–627`, the preview at `:1163` and the inline conversion at `:1264`). One more fact matters for scope: `api.ts` takes `ExpenseFormValues` as its input type for creating and updating expenses. So the form's output type is also the server's input type, which is where candidate 2 comes in.

Round 1:

❓ **Q1** - **Scope relative to candidate 2**: (a) Extract the model and keep `expenseFormSchema` exactly as it is; the schema split comes as a follow-up. (b) Do both at once: the model's submit mapping produces a new minor-unit expense input type, which tRPC and `api.ts` then take.

➡️ (a). Extract first, with the schema unchanged, so the refactor changes no behaviour. Once the model owns the submit mapping, candidate 2 becomes a small, separate change.

---

❓ **Q2** - **Shape of the module**: (a) A plain TypeScript module of pure functions (`expense-form-model.ts`) with no React or react-hook-form imports. The component's effects call into it. (b) A `useExpenseFormModel(form)` hook that also owns the `useEffect`s and `shareEdits` state.

➡️ (a). Tests go through the same interface the component uses, with plain Jest and no renderer. The effects become a few lines each: read values, call the model, set values. A hook would bring react-hook-form into the interface and put tests back behind a renderer.

---

❓ **Q3** - **What goes behind the interface**: Should the model own all of these?
- Building initial form values in the three cases: editing, repayment, and new from URL or receipt.
- The submit mapping to minor units, including dropping the currency fields when no conversion took place.
- The split preview for each participant.
- Auto-balancing the by-amount split from the set of edited participants.
- The figures behind the "must add up" error.
- `enforceCurrencyPattern`.

➡️ Yes, all six. For the URL case, the model takes an already-read prefill object. The `?amount=` units ambiguity (cents vs. whole units) is resolved where the URL is read, exactly as today, and fixing it stays with candidate 6.

---

❓ **Q4** - **Per-device default splitting options**: `getDefaultSplittingOptions` and `persistDefaultSplittingOptions` read and write `localStorage` directly. Should the model only *convert* them, taking the stored splitting options as an argument and returning what to store, while the component keeps the `localStorage` calls?

➡️ Yes. The model accepts its dependencies instead of reaching for them. That means no `localStorage` stub in tests, and the storage step can later move into candidate 7's device preferences module.

---

❓ **Q5** - **Currency conversion between the two amounts**: Should the two conversion directions be pure model functions that return the derived field value? One converts the original amount to the group amount for regular expenses; the other goes from the group amount to the original amount for repayments, including the "rounds to zero → empty" rule. The per-participant by-amount conversion at `:1264`, which skips the tested `convertToGroupCurrency`, would go through the model too.

➡️ Yes. Note that routing `:1264` through the tested helper could change rounding at the edges. Depending on Q6, that becomes its own commit.

---

❓ **Q6** - **Behaviour preservation**: Should this be a strict refactor? That means writing characterization tests against the new interface that pin today's behaviour, and putting any behaviour change (such as `:1264`) in a separate, labelled commit. The e2e specs (`split-modes`, `multi-currency`, `repayment-currency`, `recurrence`, `expense-variants`) must pass unchanged.

➡️ Yes.

---

❓ **Q7** - **Glossary**: "Expense form model" names a piece of UI plumbing, not a domain concept, so should it stay out of `GLOSSARY.md`? The model's function names would use the existing terms (split value, share, original amount, conversion rate, reimbursement).

➡️ Yes, leave it out, and use the glossary terms inside the model.

## My answer (typed)

```
Yes to all seven.```

## Round 2 ("Sautéed for 22s")

All seven are settled. A few facts that shape the next round:
- `shares.ts` already exports a clean `ShareInput` and `getParticipantShare`. The preview fakes a Prisma row only because it goes through `calculateShare` in `totals.ts`.
- There is already a colocated test, `expenses/create-from-receipt-button-actions.test.ts`.
- Jest runs every test in two timezones, on either side of UTC.

Round 2:

❓ **Q8** - **What the auto-balance takes**: Should the model's by-amount rebalance take only plain data: the total amount, the current split values, the set of participants the user *edited*, and the group currency? It would return the new split values. The `shareEdits` map (edited or cleared), the reset-on-mode-or-amount-change effect, and the `isDirty` trigger would all stay in the component.

➡️ Yes. "Which fields are dirty" and "what the user touched" are form-interaction state. "Given these fixed amounts, spread the rest exactly" is the rule, and that's what tests need to pin down.

---

❓ **Q9** - **Preview without the fake row**: Should the model's split preview build a `ShareInput` directly and call `getParticipantShare` from `shares.ts`? It would return 0 for a reimbursement, as `calculateShare` does, and the padded `participant: { name: '', groupId: '' }` row would go away. Characterization tests would assert that the result equals `calculateShare` on the same inputs.

➡️ Yes. This also makes the preview return every participant's share at once, rather than being called per checkbox.

---

❓ **Q10** - **Non-determinism as arguments**: Should building initial values take `today` (a date) and an id generator as arguments, instead of calling `getTodayForDateInput()` and `randomId()` inside? Both are only used for the receipt-scan document, which gets a fresh id, and the default expense date.

➡️ Yes. Tests then run the same in both Jest timezones.

---

❓ **Q11** - **The conversion-rate message**: The roughly 30-line block that builds the conversion-rate status text (loading, date mismatch, error with a stale rate, success, currency not found) is presentation built on `useCurrencyRate`'s result. Should it stay in the component and stay out of the model?

➡️ Yes, leave it in the component. It's translated text mapped from hook state, and pulling it out would need a status-kind type whose only caller is this component. That's a hypothetical seam.

---

❓ **Q12** - **File location**: Should the module live next to the form, as `src/app/groups/[groupId]/expenses/expense-form-model.ts` with `expense-form-model.test.ts` beside it, following the receipt-actions test?

➡️ Yes. Only the expense form uses it. If candidate 2 later needs the submit mapping on the server side, that piece can move to `src/lib` then.

---

❓ **Q13** - **Tracking the work**: Should I file a GitHub issue on <owner>/spliit with the decisions from this session as its spec, labelled `ready-for-agent`, and do the work on a branch with one PR? Candidates 2 and 3 (including the `groupId` scoping bug) would get their own issues, labelled `needs-triage`.

➡️ Yes. The scoping bug in particular shouldn't wait on this refactor.

## My answer (pasted)

```
Yes to 8 through 12. On 13: not yet. Before any issue, I want to see a few radically different interfaces for this model and pick one, so leave the interface open for now. Sum up what we've decided and what's still open.```
